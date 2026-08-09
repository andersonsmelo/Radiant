// radiant-app/src/features/spaced-repetition/services/CompetencyReviewService.test.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COMPETENCY_REVIEW_STORAGE_KEYS } from '../../../constants/competencyReview';
import type { ReviewGrade } from '../../../types/competencyReview';
import { CompetencyReviewService } from './CompetencyReviewService';

// Mock oficial do pacote: persistência real entre chamadas e compatível com
// jest.spyOn(...).mockRejectedValueOnce(...), diferente dos mocks manuais sem
// estado usados no resto do repositório.
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

const ACERTO: ReviewGrade = { outcome: 'correct', hintUsed: false };
const ERRO: ReviewGrade = { outcome: 'incorrect', hintUsed: false };
const SEM_CRITICO = () => false;

const getItemMock = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;
const LEITURA_REAL = getItemMock.getMockImplementation() as typeof AsyncStorage.getItem;

/**
 * Faz toda leitura do storage falhar durante `executar`.
 *
 * Não usamos `jest.spyOn(...).mockRestore()`: `spyOn` sobre uma função que JÁ é
 * mock devolve o próprio mock sem registrar restauração, e o `mockRestore()`
 * apaga a implementação do mock oficial do AsyncStorage — todo teste posterior
 * passaria a ler `undefined`. Trocamos a implementação e a devolvemos à mão.
 */
async function comLeituraFalhando<T>(executar: () => Promise<T>): Promise<T> {
    getItemMock.mockRejectedValue(new Error('disco cheio'));
    try {
        return await executar();
    } finally {
        getItemMock.mockImplementation(LEITURA_REAL);
    }
}

beforeEach(async () => {
    await AsyncStorage.clear();
});

describe('CompetencyReviewService', () => {
    it('não devolve nada quando nunca houve exposição', async () => {
        expect(await CompetencyReviewService.getDue('2026-01-01T00:00:00.000Z', SEM_CRITICO)).toEqual([]);
    });

    it('cria cartão na exposição e não o devolve como vencido no mesmo instante', async () => {
        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
        });

        expect(await CompetencyReviewService.getDue('2026-01-01T00:00:00.000Z', SEM_CRITICO)).toEqual([]);
    });

    it('devolve como vencido depois de passado o intervalo', async () => {
        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
        });

        const vencidas = await CompetencyReviewService.getDue('2026-06-01T00:00:00.000Z', SEM_CRITICO);

        expect(vencidas.map((item) => item.competencyId)).toEqual(['competency:a:b']);
    });

    it('ordena as vencidas por recuperabilidade crescente', async () => {
        // Inserida em ordem invertida de propósito: Object.values preserva a
        // ordem de inserção, então inserir "recente" antes de "antiga" garante
        // que só um .sort() real — e não a ordem de chegada — pode produzir o
        // resultado afirmado abaixo.
        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:recente', grade: ACERTO,
            criticalSafety: false, now: '2026-05-01T00:00:00.000Z',
        });
        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:antiga', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
        });

        const vencidas = await CompetencyReviewService.getDue('2026-06-01T00:00:00.000Z', SEM_CRITICO);

        expect(vencidas[0].competencyId).toBe('competency:antiga');
        expect(vencidas[0].retrievability).toBeLessThan(vencidas[1].retrievability);
    });

    it('concede delayed-retention quando as três condições da §4 se cumprem', async () => {
        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
        });

        const resultado = await CompetencyReviewService.recordReview({
            competencyId: 'competency:a:b', grade: ACERTO, admitsDelayedRetention: true,
            criticalSafety: false, now: '2026-01-05T00:00:00.000Z',
        });

        expect(resultado.evidenceKind).toBe('delayed-retention');
    });

    it('recusa delayed-retention à competência que não a admite, mesmo com decorrido de sobra', async () => {
        // Vinte das trinta competências do currículo não admitem
        // delayed-retention; conceder a uma delas fura o teto que a spec §3
        // registra como deliberado e promove a `retained` indevidamente.
        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
        });

        const resultado = await CompetencyReviewService.recordReview({
            competencyId: 'competency:a:b', grade: ACERTO, admitsDelayedRetention: false,
            criticalSafety: false, now: '2026-01-05T00:00:00.000Z',
        });

        expect(resultado.evidenceKind).toBe('independent-recall');
    });

    it('recusa delayed-retention no mesmo dia', async () => {
        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
        });

        const resultado = await CompetencyReviewService.recordReview({
            competencyId: 'competency:a:b', grade: ACERTO, admitsDelayedRetention: true,
            criticalSafety: false, now: '2026-01-01T09:00:00.000Z',
        });

        expect(resultado.evidenceKind).toBe('independent-recall');
    });

    it('recusa delayed-retention quando o relógio andou para trás', async () => {
        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-10T00:00:00.000Z',
        });

        const resultado = await CompetencyReviewService.recordReview({
            competencyId: 'competency:a:b', grade: ACERTO, admitsDelayedRetention: true,
            criticalSafety: false, now: '2026-01-02T00:00:00.000Z',
        });

        expect(resultado.evidenceKind).toBe('independent-recall');
    });

    it('nunca concede delayed-retention no erro', async () => {
        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
        });

        const resultado = await CompetencyReviewService.recordReview({
            competencyId: 'competency:a:b', grade: ERRO, admitsDelayedRetention: true,
            criticalSafety: false, now: '2026-02-01T00:00:00.000Z',
        });

        expect(resultado.evidenceKind).toBe('independent-recall');
    });

    it('põe store ilegível em quarentena em vez de apagar em silêncio', async () => {
        await AsyncStorage.setItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE, '{ isto nao e json');

        expect(await CompetencyReviewService.getDue('2026-01-01T00:00:00.000Z', SEM_CRITICO)).toEqual([]);
        expect(await AsyncStorage.getItem(COMPETENCY_REVIEW_STORAGE_KEYS.QUARANTINE))
            .toBe('{ isto nao e json');
        // Sem isto, apagar o removeItem da store deixaria o lixo para trás, e
        // toda leitura seguinte re-quarentenaria a mesma string em vez de
        // recomeçar limpo.
        expect(await AsyncStorage.getItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE)).toBeNull();
    });

    it.each([
        ['cards nulo', '{"schemaVersion":1,"cards":null}'],
        ['cards em array', '{"schemaVersion":1,"cards":[]}'],
        ['store em array', '[]'],
        ['schemaVersion textual', '{"schemaVersion":"1","cards":{}}'],
        ['cartão sem os campos do contrato', '{"schemaVersion":1,"cards":{"a":{"competencyId":"a"}}}'],
    ])('trata store com forma errada (%s) como ilegível, e não deixa TypeError escapar', async (_caso, cru) => {
        // JSON válido não é store válido: sem conferir a forma, `store.cards[id] = …`
        // lançava TypeError para fora de observeExposure.
        await AsyncStorage.setItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE, cru);

        await expect(CompetencyReviewService.observeExposure({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
        })).resolves.toBeUndefined();

        expect(await AsyncStorage.getItem(COMPETENCY_REVIEW_STORAGE_KEYS.QUARANTINE)).toBe(cru);
        // Começou limpo e seguiu agendando: o cartão novo está lá.
        const vencidas = await CompetencyReviewService.getDue('2026-06-01T00:00:00.000Z', SEM_CRITICO);
        expect(vencidas.map((item) => item.competencyId)).toEqual(['competency:a:b']);
    });

    it('não propaga erro de storage em observeExposure nem em recordReview', async () => {
        // A promessa "erro nunca escapa" vale para os quatro métodos públicos,
        // não só para getDue: uma exposição não pode derrubar a conclusão da
        // atividade.
        const resultado = await comLeituraFalhando(async () => {
            await expect(CompetencyReviewService.observeExposure({
                competencyId: 'competency:a:b', grade: ACERTO,
                criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
            })).resolves.toBeUndefined();

            return CompetencyReviewService.recordReview({
                competencyId: 'competency:a:b', grade: ACERTO, admitsDelayedRetention: true,
                criticalSafety: false, now: '2026-02-01T00:00:00.000Z',
            });
        });

        // Falha fechada: sem leitura confiável, não há retenção retardada.
        expect(resultado.evidenceKind).toBe('independent-recall');
    });

    it('lê como vazio e recusa escrever sobre schema mais novo', async () => {
        const futuro = JSON.stringify({
            schemaVersion: 999, cards: {}, updatedAt: '',
        });
        await AsyncStorage.setItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE, futuro);

        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
        });

        expect(await AsyncStorage.getItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE)).toBe(futuro);
    });

    it('preserva store de versão futura mesmo quando a forma dele não é a desta versão', async () => {
        // A checagem de versão vem ANTES da validação de forma, e é isto que a
        // ordem protege: a versão futura tem forma diferente por definição, e
        // julgá-la pelo contrato de hoje a mandaria para a quarentena —
        // destruindo justamente o dado que a recusa de escrita existe para
        // preservar.
        const futuroDiferente = JSON.stringify({
            schemaVersion: 999, fichas: { 'competency:a:b': { peso: 1 } },
        });
        await AsyncStorage.setItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE, futuroDiferente);

        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
        });

        expect(await AsyncStorage.getItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE)).toBe(futuroDiferente);
        expect(await AsyncStorage.getItem(COMPETENCY_REVIEW_STORAGE_KEYS.QUARANTINE)).toBeNull();
    });

    it('não propaga erro de storage para o chamador', async () => {
        await expect(comLeituraFalhando(
            () => CompetencyReviewService.getDue('2026-01-01T00:00:00.000Z', SEM_CRITICO),
        )).resolves.toEqual([]);
    });
});
