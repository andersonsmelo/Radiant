import { ItemReviewRepository, ITEM_QUARANTINE_CAP } from './ItemReviewRepository';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { itemAttemptEvidenceEntries, itemKey, type ItemAttempt } from '../../../types/itemReview';

function storage() {
    const data = new Map<string, string>();
    return { data, getItem: jest.fn(async (key: string) => data.get(key) ?? null),
        setItem: jest.fn(async (key: string, value: string) => { data.set(key, value); }),
        removeItem: jest.fn(async (key: string) => { data.delete(key); }) };
}
function attempt(overrides: Partial<ItemAttempt> = {}): ItemAttempt {
    return { attemptId: 'attempt:1', item: { lessonId: 'lesson:1', itemId: 'item:1', activityId: 'activity:1', competencyId: 'competency:1', contentVersion: 'v1', evidenceKind: 'independent-recall' },
        firstOutcome: 'correct', finalOutcome: 'correct', hintUsed: false, durationBand: 'unknown', recordedAt: '2026-10-17T12:00:00.000Z', mode: 'study', ...overrides };
}

describe('lote atômico de itens da avaliação', () => {
    function assessment(): ItemAttempt {
        return attempt({ mode: 'assessment', assessment: { competencyIds: ['competency:1', 'competency:2'], isCriticalError: false } });
    }
    it('valida o lote inteiro antes de gravar e não deixa o primeiro item de um lote inválido', async () => {
        const s = storage(); const repo = new ItemReviewRepository(s); const first = assessment();
        const second = { ...first, item: { ...first.item, itemId: 'item:2' }, assessment: { ...first.assessment!, competencyIds: ['competency:patient'] } };
        expect((await repo.recordBatch([first, second])).accepted).toBe(false);
        expect(s.setItem).not.toHaveBeenCalled(); expect(await repo.getAttempts()).toEqual([]);
    });
    it('um conflito tardio do lote não confirma o item novo que veio antes dele', async () => {
        const s = storage(); const repo = new ItemReviewRepository(s); const first = assessment();
        await repo.recordBatch([first]); const before = s.data.get(STORAGE_KEYS.ITEM_REVIEW);
        const added = { ...first, item: { ...first.item, itemId: 'item:2' } };
        expect((await repo.recordBatch([added, { ...first, hintUsed: true }])).accepted).toBe(false);
        expect(s.data.get(STORAGE_KEYS.ITEM_REVIEW)).toBe(before);
    });
    it('faz uma escrita para mil itens e retry não altera os intervalos', async () => {
        const s = storage(); const repo = new ItemReviewRepository(s); const first = assessment();
        const items = Array.from({ length: 1000 }, (_, index) => ({ ...first, item: { ...first.item, itemId: `item:${index}` } }));
        expect(await repo.recordBatch(items)).toMatchObject({ accepted: true, duplicate: false });
        expect(s.setItem).toHaveBeenCalledTimes(1); const before = s.data.get(STORAGE_KEYS.ITEM_REVIEW);
        expect(await repo.recordBatch(items)).toMatchObject({ accepted: true, duplicate: true });
        expect(s.setItem).toHaveBeenCalledTimes(1); expect(s.data.get(STORAGE_KEYS.ITEM_REVIEW)).toBe(before);
        expect(await repo.getAttempts()).toHaveLength(1000);
    });
    it('mantém todas as competências e trata erro crítico como erro, mesmo com alternativa correta', async () => {
        const s = storage(); const repo = new ItemReviewRepository(s);
        const value = { ...assessment(), assessment: { ...assessment().assessment!, isCriticalError: true } };
        expect((await repo.recordBatch([value])).accepted).toBe(true);
        expect(itemAttemptEvidenceEntries((await repo.getAttempts())[0])).toEqual([
            expect.objectContaining({ competencyId: 'competency:1', outcome: 'incorrect' }),
            expect.objectContaining({ competencyId: 'competency:2', outcome: 'incorrect' }),
        ]);
        expect((await repo.getCards())[0].repetitions).toBe(0);
    });
    it('recusa metadados ausentes, campos extras e primeira resposta inválida no modo avaliação', async () => {
        const s = storage(); const repo = new ItemReviewRepository(s); const first = assessment();
        const invalid = [ { ...first, assessment: undefined }, { ...first, assessment: { ...first.assessment!, freeText: 'text' } },
            { ...first, firstOutcome: 'unknown' }, { ...first, mode: 'study' },
            { ...first, assessment: { competencyIds: ['competency:1', 'competency:patient'], isCriticalError: false } } ];
        for (const value of invalid) expect((await repo.recordBatch([value as ItemAttempt])).accepted).toBe(false);
        expect(s.setItem).not.toHaveBeenCalled();
    });
});

describe('ItemReviewRepository', () => {
    it('persiste tentativa e agenda no mesmo envelope e deduplica após recriar o repositório', async () => {
        const s = storage(); const repo = new ItemReviewRepository(s);
        expect((await repo.record(attempt())).accepted).toBe(true);
        expect(s.setItem).toHaveBeenCalledTimes(1);
        const persisted = JSON.parse(s.data.get(STORAGE_KEYS.ITEM_REVIEW)!);
        expect(persisted.attempts).toHaveLength(1);
        expect(persisted.cards[itemKey(attempt().item)].dueAt).toBe('2026-10-18T12:00:00.000Z');
        expect(await new ItemReviewRepository(s).record(attempt())).toMatchObject({ accepted: true, duplicate: true });
        expect(s.setItem).toHaveBeenCalledTimes(1);
    });
    it('serializa instâncias concorrentes sem perder tentativas de itens diferentes', async () => {
        const s = storage(); const a = attempt(); const b = attempt({ attemptId: 'attempt:2', item: { ...a.item, itemId: 'item:2' } });
        await Promise.all([new ItemReviewRepository(s).record(a), new ItemReviewRepository(s).record(b)]);
        expect(await new ItemReviewRepository(s).getAttempts()).toHaveLength(2);
        expect(await new ItemReviewRepository(s).getCards()).toHaveLength(2);
    });
    it('preserva schema futuro, JSON inválido e falha de leitura sem escrever por cima', async () => {
        for (const raw of ['{"schemaVersion":"item-review.v9","future":true}', '{bad']) {
            const s = storage(); s.data.set(STORAGE_KEYS.ITEM_REVIEW, raw);
            expect((await new ItemReviewRepository(s).record(attempt())).accepted).toBe(false);
            expect(s.setItem).not.toHaveBeenCalled(); expect(s.data.get(STORAGE_KEYS.ITEM_REVIEW)).toBe(raw);
        }
        const s = storage(); s.getItem.mockRejectedValue(new Error('read-failure'));
        expect((await new ItemReviewRepository(s).record(attempt())).accepted).toBe(false);
        expect(s.setItem).not.toHaveBeenCalled();
    });
    it('falha de escrita não concede evidência; retry persistido acontece uma única vez', async () => {
        const s = storage(); const repo = new ItemReviewRepository(s);
        s.setItem.mockRejectedValueOnce(new Error('full'));
        expect((await repo.record(attempt())).accepted).toBe(false);
        expect(await repo.getAttempts()).toEqual([]);
        expect((await repo.record(attempt())).accepted).toBe(true);
        expect(await repo.getAttempts()).toHaveLength(1);
    });
    it('semeia legado sem fabricar evidência, espalha itens adicionais e não remarca no retry', async () => {
        const s = storage(); const repo = new ItemReviewRepository(s); const item = attempt().item;
        const items = [item, { ...item, itemId: 'item:2' }, { ...item, itemId: 'item:3' }];
        expect(await repo.seedLegacy(items, '2026-10-16T12:00:00.000Z', '2026-10-17T12:00:00.000Z')).toBe(true);
        const before = s.data.get(STORAGE_KEYS.ITEM_REVIEW);
        await repo.seedLegacy(items, '2026-10-16T12:00:00.000Z', '2026-10-18T12:00:00.000Z');
        expect(s.data.get(STORAGE_KEYS.ITEM_REVIEW)).toBe(before);
        expect(await repo.getAttempts()).toEqual([]);
        expect((await repo.getCards()).map(card => card.dueAt)).toEqual(['2026-10-16T12:00:00.000Z', '2026-10-18T12:00:00.000Z', '2026-10-19T12:00:00.000Z']);
    });
    it('agenda pelo primeiro erro e não promove o acerto após ajuda a recuperação independente', async () => {
        const s = storage(); const repo = new ItemReviewRepository(s);
        await repo.record(attempt({ firstOutcome: 'incorrect', finalOutcome: 'correct', hintUsed: true }));
        expect((await repo.getCards())[0].repetitions).toBe(0);
        expect((await repo.getAttempts())[0]).toMatchObject({ firstOutcome: 'incorrect', finalOutcome: 'correct', hintUsed: true });
    });
    it('recusa submissão de revisão atrasada ou que já não corresponde ao vencimento selecionado', async () => {
        const s = storage(); const repo = new ItemReviewRepository(s);
        await repo.record(attempt());
        expect((await repo.record(attempt({ attemptId: 'review:old', recordedAt: '2026-10-17T13:00:00.000Z', mode: 'self-review' }), '2026-10-17T12:00:00.000Z')).accepted).toBe(false);
        expect(await repo.getAttempts()).toHaveLength(1);
    });
    it('recusa campos fora da allowlist, dado sensível e timestamp impossível antes de escrever', async () => {
        for (const invalid of [
            { ...attempt(), answerText: 'free-text-test' },
            attempt({ attemptId: 'patient:synthetic' }),
            attempt({ recordedAt: '2026-02-30T12:00:00.000Z' }),
        ]) {
            const s = storage();
            expect((await new ItemReviewRepository(s).record(invalid)).accepted).toBe(false);
            expect(s.setItem).not.toHaveBeenCalled();
        }
    });
    it('recusa colisão semântica no mesmo ID de tentativa', async () => {
        const s = storage(); const repo = new ItemReviewRepository(s);
        await repo.record(attempt());
        expect(await repo.record(attempt({ firstOutcome: 'incorrect' }))).toMatchObject({ accepted: false, duplicate: true });
        expect(await repo.getAttempts()).toHaveLength(1);
        expect((await repo.getCards())[0].repetitions).toBe(1);
    });
});

describe('referência temporal da resposta de revisão', () => {
    it('exige metadados iguais ao cartão persistido e não grava referência temporal forjada', async () => {
        const s = storage(); const repo = new ItemReviewRepository(s);
        await repo.record(attempt());
        const [card] = await repo.getCards();
        const review = attempt({ attemptId: 'review:next', mode: 'review-answer', recordedAt: card.dueAt,
            review: { previousReviewedAt: card.lastReviewedAt, scheduledDueAt: card.dueAt, hasPriorAttempt: true } });
        const before = s.data.get(STORAGE_KEYS.ITEM_REVIEW);
        for (const reference of [ { ...review.review!, hasPriorAttempt: false }, { ...review.review!, previousReviewedAt: '2026-10-01T00:00:00.000Z' }, { ...review.review!, scheduledDueAt: '2026-10-01T00:00:00.000Z' } ]) {
            expect((await repo.record({ ...review, review: reference }, card.dueAt)).accepted).toBe(false);
            expect(s.data.get(STORAGE_KEYS.ITEM_REVIEW)).toBe(before);
        }
        expect((await repo.record(review, card.dueAt)).accepted).toBe(true);
        expect(await repo.getAttempts()).toHaveLength(2);
        expect((await repo.record({ ...review, recordedAt: new Date(Date.parse(card.dueAt) + 1000).toISOString() }, card.dueAt))).toMatchObject({ accepted: true, duplicate: true });
    });

    it('reutiliza o snapshot validado entre leituras consecutivas sem reexecutar JSON.parse quando o payload bruto não mudou', async () => {
        const s = storage();
        const repo = new ItemReviewRepository(s);
        await repo.record(attempt());

        const parseSpy = jest.spyOn(JSON, 'parse');
        try {
            await repo.getCards();
            await repo.getAttempts();
            await repo.inspect();
            expect(parseSpy).toHaveBeenCalledTimes(0);

            // Se o armazenamento subjacente mudar externamente, o repositório revalida.
            s.data.set(STORAGE_KEYS.ITEM_REVIEW, '{corrompido');
            expect(await repo.inspect()).toEqual({ readable: false, cards: [] });
        } finally {
            parseSpy.mockRestore();
        }
    });
});


// R6 (A3): com o envelope válido, um registro inválido não bloqueia a revisão
// inteira. Ele sai do store e o original vai para a quarentena, gravada ANTES
// de o store ser regravado sem ele. O cartão em quarentena sai da agenda
// (decisão de Anderson, 2026-10-18). Schema futuro, JSON quebrado e falha de
// leitura continuam indisponíveis, sem escrita (teste acima).
describe('quarentena do registro inválido (R6)', () => {
    const second = () => attempt({ attemptId: 'attempt:2', item: { ...attempt().item, itemId: 'item:2' } });
    async function seeded() {
        const s = storage();
        await new ItemReviewRepository(s).recordBatch([attempt(), second()]);
        return s;
    }
    function corrupt(s: ReturnType<typeof storage>, edit: (store: { cards: Record<string, unknown>; attempts: unknown[] }) => void) {
        const store = JSON.parse(s.data.get(STORAGE_KEYS.ITEM_REVIEW)!);
        edit(store);
        const raw = JSON.stringify(store);
        s.data.set(STORAGE_KEYS.ITEM_REVIEW, raw);
        return raw;
    }
    const quarantine = (s: ReturnType<typeof storage>) => JSON.parse(s.data.get(STORAGE_KEYS.ITEM_REVIEW_QUARANTINE) ?? 'null');

    it('um cartão inválido vai para a quarentena e a revisão segue com os outros cartões', async () => {
        const s = await seeded(); const key = itemKey(second().item);
        let bad: unknown;
        corrupt(s, store => { (store.cards[key] as { easeFactor: number }).easeFactor = 9; bad = store.cards[key]; });

        const snapshot = await new ItemReviewRepository(s).inspect();
        expect(snapshot.readable).toBe(true);
        expect(snapshot.cards.map(card => card.item.itemId)).toEqual(['item:1']);
        expect(quarantine(s)).toEqual({ schemaVersion: 'item-review-quarantine.v1',
            entries: [{ kind: 'card', key, record: bad, quarantinedAt: expect.any(String) }] });
        expect(Number.isFinite(Date.parse(quarantine(s).entries[0].quarantinedAt))).toBe(true);
        expect(Object.keys(JSON.parse(s.data.get(STORAGE_KEYS.ITEM_REVIEW)!).cards)).toEqual([itemKey(attempt().item)]);
        expect(await new ItemReviewRepository(s).getAttempts()).toHaveLength(2);
    });
    it('uma tentativa inválida vai para a quarentena sem levar o cartão dela', async () => {
        const s = await seeded();
        corrupt(s, store => { (store.attempts[1] as { mode: string }).mode = 'inventado'; });

        const repo = new ItemReviewRepository(s);
        expect((await repo.getAttempts()).map(entry => entry.attemptId)).toEqual(['attempt:1']);
        expect(await repo.getCards()).toHaveLength(2);
        expect(quarantine(s).entries).toEqual([{ kind: 'attempt', record: expect.objectContaining({ attemptId: 'attempt:2', mode: 'inventado' }),
            quarantinedAt: expect.any(String) }]);
    });
    it('registro nulo ou de outro tipo vai para a quarentena em vez de derrubar a leitura', async () => {
        const s = await seeded(); const key = itemKey(second().item);
        corrupt(s, store => { store.cards[key] = null; store.attempts.push(42); });

        expect((await new ItemReviewRepository(s).inspect()).readable).toBe(true);
        expect(quarantine(s).entries.map((entry: { kind: string; record: unknown }) => [entry.kind, entry.record])).toEqual([['card', null], ['attempt', 42]]);
    });
    it('tentativa repetida fica com a primeira e manda a cópia para a quarentena', async () => {
        const s = await seeded();
        corrupt(s, store => { store.attempts.push({ ...(store.attempts[0] as object), durationBand: 'under-10s' }); });

        const attempts = await new ItemReviewRepository(s).getAttempts();
        expect(attempts.map(entry => [entry.attemptId, entry.durationBand])).toEqual([['attempt:1', 'unknown'], ['attempt:2', 'unknown']]);
        expect(quarantine(s).entries).toEqual([{ kind: 'attempt', record: expect.objectContaining({ attemptId: 'attempt:1', durationBand: 'under-10s' }), quarantinedAt: expect.any(String) }]);
    });
    it('sem conseguir gravar a quarentena, não regrava o store e o mantém indisponível', async () => {
        const s = await seeded();
        const raw = corrupt(s, store => { (store.cards[itemKey(second().item)] as { interval: number }).interval = 0; });
        s.setItem.mockClear();
        s.setItem.mockImplementation(async (key: string, value: string) => {
            if (key === STORAGE_KEYS.ITEM_REVIEW_QUARANTINE) throw new Error('full');
            s.data.set(key, value);
        });

        expect(await new ItemReviewRepository(s).inspect()).toEqual({ readable: false, cards: [] });
        expect(s.data.get(STORAGE_KEYS.ITEM_REVIEW)).toBe(raw);
        expect(s.setItem.mock.calls.map(([key]) => key)).not.toContain(STORAGE_KEYS.ITEM_REVIEW);
    });
    it('uma quarentena existente ilegível não é sobrescrita', async () => {
        const s = await seeded();
        const raw = corrupt(s, store => { (store.cards[itemKey(second().item)] as { interval: number }).interval = 0; });
        s.data.set(STORAGE_KEYS.ITEM_REVIEW_QUARANTINE, '{quebrada');

        expect((await new ItemReviewRepository(s).inspect()).readable).toBe(false);
        expect(s.data.get(STORAGE_KEYS.ITEM_REVIEW_QUARANTINE)).toBe('{quebrada');
        expect(s.data.get(STORAGE_KEYS.ITEM_REVIEW)).toBe(raw);
    });
    it('se o store não regrava depois da quarentena, a nova tentativa não duplica a entrada', async () => {
        const s = await seeded();
        corrupt(s, store => { (store.cards[itemKey(second().item)] as { interval: number }).interval = 0; });
        s.setItem.mockImplementationOnce(async (key: string, value: string) => { s.data.set(key, value); })
            .mockImplementationOnce(async () => { throw new Error('full'); });

        expect((await new ItemReviewRepository(s).inspect()).readable).toBe(false);
        expect((await new ItemReviewRepository(s).inspect()).readable).toBe(true);
        expect(quarantine(s).entries).toHaveLength(1);
    });
    it('a quarentena guarda só as entradas mais recentes, até o teto', async () => {
        const s = await seeded();
        const old = Array.from({ length: ITEM_QUARANTINE_CAP }, (_, index) => ({ kind: 'attempt', record: index, quarantinedAt: '2026-10-01T00:00:00.000Z' }));
        s.data.set(STORAGE_KEYS.ITEM_REVIEW_QUARANTINE, JSON.stringify({ schemaVersion: 'item-review-quarantine.v1', entries: old }));
        corrupt(s, store => { store.attempts.push('nova'); });

        expect((await new ItemReviewRepository(s).inspect()).readable).toBe(true);
        const entries = quarantine(s).entries;
        expect(entries).toHaveLength(ITEM_QUARANTINE_CAP);
        expect(entries[0].record).toBe(1);
        expect(entries.at(-1).record).toBe('nova');
    });
    it('clear apaga também a quarentena', async () => {
        const s = await seeded();
        corrupt(s, store => { store.attempts.push(42); });
        const repo = new ItemReviewRepository(s);
        await repo.inspect();
        await repo.clear();
        expect(s.data.has(STORAGE_KEYS.ITEM_REVIEW_QUARANTINE)).toBe(false);
        expect(s.data.has(STORAGE_KEYS.ITEM_REVIEW)).toBe(false);
    });
});
