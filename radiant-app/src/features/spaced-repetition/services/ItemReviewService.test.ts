import { ItemReviewCoordinator, canonicalStudyItemId, type ItemDefinition, type ReviewCatalogPort } from './ItemReviewService';
import { ItemReviewRepository } from '../repositories/ItemReviewRepository';
import { itemAttemptEvidence, itemReviewTiming } from '../../../types/itemReview';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { MATERIA_ENERGIA_E_RADIACAO_CANDIDATE } from '../../student-checkpoints/EditorialCurriculumCandidate';

function setup(count = 2) {
    const data = new Map<string, string>();
    const storage = { getItem: async (key: string) => data.get(key) ?? null, setItem: async (key: string, value: string) => { data.set(key, value); }, removeItem: async (key: string) => { data.delete(key); } };
    const repository = new ItemReviewRepository(storage);
    const definitions: ItemDefinition[] = Array.from({ length: count }, (_, index) => ({
        item: { lessonId: 'lesson:1', itemId: `item:${index}`, activityId: 'activity:1', competencyId: 'competency:1', contentVersion: 'v1', evidenceKind: 'independent-recall' },
        question: { id: `item:${index}`, type: 'multiple-choice', prompt: 'Fixture', options: [{ label: 'A' }, { label: 'B' }], correctAnswerIndex: 0, explanation: 'Fixture' },
    }));
    const catalog: ReviewCatalogPort = { definitions: () => definitions };
    return { data, storage, repository, definitions, coordinator: new ItemReviewCoordinator(repository, catalog) };
}
const now = new Date('2026-10-17T12:00:00.000Z');
const legacy = [{ lessonId: 'lesson:1', nextReviewAt: new Date('2026-10-16T12:00:00.000Z') }];

describe('revisão por item', () => {
    it('corrige pelo catálogo atual, ignora gabarito adulterado na UI e não converte migração em intervalo confirmado', async () => {
        const { coordinator, repository } = setup(1);
        const [item] = await coordinator.loadQueue(legacy, now);
        item.question = { ...item.question, correctAnswerIndex: 1 };
        expect(await coordinator.recordAnswer(item, 0, now)).toMatchObject({ accepted: true, correct: true, assisted: false });
        const [entry] = await repository.getAttempts();
        expect(entry).toMatchObject({ firstOutcome: 'correct', hintUsed: false, mode: 'review-answer' });
        expect(itemAttemptEvidence(entry).evidenceKind).toBe('independent-recall');
        expect(itemReviewTiming(entry)).toBe('unverified');
        expect((await coordinator.recordAnswer(item, 1, now)).accepted).toBe(false);
        expect(await repository.getAttempts()).toHaveLength(1);
    });
    it.each([null, 0, 1])('separa ajuda, resultado e intervalo para a resposta %s, sem fabricar delayed-retention', async answer => {
        const { coordinator, repository, definitions } = setup(1);
        await repository.record({ attemptId: 'study:previous', item: definitions[0].item, mode: 'study', firstOutcome: 'correct', finalOutcome: 'correct', hintUsed: false, durationBand: 'unknown', recordedAt: '2026-10-14T12:00:00.000Z' });
        const [item] = await coordinator.loadQueue([], now);
        expect((await coordinator.recordAnswer(item, answer, now)).accepted).toBe(true);
        const entry = (await repository.getAttempts()).at(-1)!;
        expect(entry.firstOutcome).toBe(answer === null ? 'skipped' : answer === 0 ? 'correct' : 'incorrect');
        expect(entry.hintUsed).toBe(answer === null);
        expect(itemReviewTiming(entry)).toBe('after-interval');
        expect(itemAttemptEvidence(entry).evidenceKind).toBe(answer === null ? 'guided-practice' : 'independent-recall');
    });
    it('recusa índice inválido e conteúdo fora da versão sem persistir resposta', async () => {
        const { coordinator, repository, definitions } = setup(1);
        const [item] = await coordinator.loadQueue(legacy, now);
        expect((await coordinator.recordAnswer(item, 99, now)).accepted).toBe(false);
        definitions[0].item = { ...definitions[0].item, contentVersion: 'v2' };
        expect((await coordinator.recordAnswer(item, 0, now)).accepted).toBe(false);
        expect(await repository.getAttempts()).toEqual([]);
    });
    it('migra só a agenda; responde um item e preserva o vencimento do outro', async () => {
        const { coordinator, repository } = setup();
        const queue = await coordinator.loadQueue(legacy, now);
        expect(queue).toHaveLength(1); expect(await repository.getAttempts()).toEqual([]);
        expect((await coordinator.recordReview(queue[0], true, now)).accepted).toBe(true);
        const evidence = itemAttemptEvidence((await repository.getAttempts())[0]);
        expect(evidence).toMatchObject({ evidenceKind: 'guided-practice', hintUsed: true });
        expect((await coordinator.effectiveSchedule([{ lessonId: 'lesson:1', dueAtMs: 0 }]))[0].dueAtMs).toBe(Date.parse('2026-10-18T12:00:00.000Z'));
        expect(await coordinator.loadQueue(legacy, new Date('2026-10-18T12:00:00.000Z'))).toHaveLength(2);
        expect(await coordinator.dueCount([{ lessonId: 'lesson:1', dueAtMs: 0 }], new Date('2026-10-18T12:00:00.000Z'))).toBe(2);
    });
    it('retry da mesma revisão não cria segunda tentativa mesmo se o relógio avançar', async () => {
        const { coordinator, repository } = setup(); const [item] = await coordinator.loadQueue(legacy, now);
        await coordinator.recordReview(item, true, now);
        expect(await coordinator.recordReview(item, true, new Date(now.getTime() + 1000))).toMatchObject({ accepted: true, duplicate: true });
        expect(await repository.getAttempts()).toHaveLength(1);
        expect((await coordinator.recordReview(item, false, new Date(now.getTime() + 2000))).accepted).toBe(false);
    });
    it('não transfere a agenda/evidência de uma versão material para outra', async () => {
        const { coordinator, repository, definitions } = setup(); await coordinator.loadQueue(legacy, now);
        definitions.forEach(definition => { definition.item.contentVersion = 'v2'; });
        expect(await coordinator.loadQueue(legacy, now)).toEqual([]);
        expect(await repository.getAttempts()).toEqual([]);
        expect((await repository.getCards()).every(card => card.item.contentVersion === 'v1')).toBe(true);
        expect(await coordinator.effectiveSchedule([{ lessonId: 'lesson:1', dueAtMs: 0 }])).toEqual([]);
    });
    it('limita a sessão a 50 de 10000 itens, sem produzir evidência da migração', async () => {
        const { coordinator, repository } = setup(10000);
        await repository.seedLegacy((setup(10000).definitions).map(definition => definition.item), '2026-10-16T12:00:00.000Z', now.toISOString());
        const queue = await coordinator.loadQueue([], new Date('2056-10-17T12:00:00.000Z'));
        expect(queue).toHaveLength(50); expect(await repository.getAttempts()).toEqual([]);
    });
    it('migra no máximo 50 lições por abertura, retomando a janela seguinte sem duplicar', async () => {
        const { repository, definitions, storage } = setup(1);
        const write = jest.spyOn(storage, 'setItem');
        const coordinator = new ItemReviewCoordinator(repository, { definitions: lessonId => definitions.map(definition => ({ ...definition, item: { ...definition.item, lessonId } })) });
        const legacyCards = Array.from({ length: 51 }, (_, index) => ({ lessonId: `lesson:${index}`, nextReviewAt: legacy[0].nextReviewAt }));
        expect(await coordinator.loadQueue(legacyCards, now)).toHaveLength(50);
        expect(await repository.getCards()).toHaveLength(50); expect(write).toHaveBeenCalledTimes(1);
        await coordinator.loadQueue(legacyCards, now);
        expect(await repository.getCards()).toHaveLength(51); expect(write).toHaveBeenCalledTimes(2);
        expect(await repository.getAttempts()).toEqual([]);
    });
    it('uma fonte antiga sem payload não bloqueia a migração de outra lição disponível', async () => {
        const { repository, definitions } = setup(1);
        const coordinator = new ItemReviewCoordinator(repository, { definitions: id => id === 'lesson:1' ? definitions : [] });
        const unavailable = Array.from({ length: 51 }, (_, index) => ({ lessonId: `missing:${index}`, nextReviewAt: legacy[0].nextReviewAt }));
        expect(await coordinator.loadQueue([...unavailable, ...legacy], now)).toHaveLength(1);
    });
    it('não mostra schema futuro indisponível como uma fila vazia saudável', async () => {
        const { coordinator, data } = setup(); const raw = '{"schemaVersion":"item-review.v9","future":true}';
        data.set(STORAGE_KEYS.ITEM_REVIEW, raw);
        await expect(coordinator.loadQueue(legacy, now)).rejects.toThrow('review-store-unavailable');
        expect(data.get(STORAGE_KEYS.ITEM_REVIEW)).toBe(raw);
    });
    it('preserva o ID da interação promovida e resolve a questão original no adaptador legado', () => {
        const activity = MATERIA_ENERGIA_E_RADIACAO_CANDIDATE.activities[0];
        const step = activity.steps.find(entry => entry.kind === 'interaction');
        if (!step || step.kind !== 'interaction') throw Error('fixture');
        expect(canonicalStudyItemId(step.interaction)).toBe(step.interaction.id);
        expect(canonicalStudyItemId({ ...step.interaction, evidenceKind: 'legacy-lesson-recall' })).toBe(activity.id);
    });
});
