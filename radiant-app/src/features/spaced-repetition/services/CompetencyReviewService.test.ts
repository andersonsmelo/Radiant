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
        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:antiga', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
        });
        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:recente', grade: ACERTO,
            criticalSafety: false, now: '2026-05-01T00:00:00.000Z',
        });

        const vencidas = await CompetencyReviewService.getDue('2026-06-01T00:00:00.000Z', SEM_CRITICO);

        expect(vencidas[0].competencyId).toBe('competency:antiga');
        expect(vencidas[0].retrievability).toBeLessThan(vencidas[1].retrievability);
    });

    it('concede delayed-retention quando o decorrido passa do limiar', async () => {
        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
        });

        const resultado = await CompetencyReviewService.recordReview({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-05T00:00:00.000Z',
        });

        expect(resultado.evidenceKind).toBe('delayed-retention');
    });

    it('recusa delayed-retention no mesmo dia', async () => {
        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
        });

        const resultado = await CompetencyReviewService.recordReview({
            competencyId: 'competency:a:b', grade: ACERTO,
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
            competencyId: 'competency:a:b', grade: ACERTO,
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
            competencyId: 'competency:a:b', grade: ERRO,
            criticalSafety: false, now: '2026-02-01T00:00:00.000Z',
        });

        expect(resultado.evidenceKind).toBe('independent-recall');
    });

    it('põe store ilegível em quarentena em vez de apagar em silêncio', async () => {
        await AsyncStorage.setItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE, '{ isto nao e json');

        expect(await CompetencyReviewService.getDue('2026-01-01T00:00:00.000Z', SEM_CRITICO)).toEqual([]);
        expect(await AsyncStorage.getItem(COMPETENCY_REVIEW_STORAGE_KEYS.QUARANTINE))
            .toBe('{ isto nao e json');
    });

    it('lê como vazio e recusa escrever sobre schema mais novo', async () => {
        const futuro = JSON.stringify({
            schemaVersion: 999, cards: {}, lastSeenClock: '', updatedAt: '',
        });
        await AsyncStorage.setItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE, futuro);

        await CompetencyReviewService.observeExposure({
            competencyId: 'competency:a:b', grade: ACERTO,
            criticalSafety: false, now: '2026-01-01T00:00:00.000Z',
        });

        expect(await AsyncStorage.getItem(COMPETENCY_REVIEW_STORAGE_KEYS.STORE)).toBe(futuro);
    });

    it('não propaga erro de storage para o chamador', async () => {
        const espia = jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('disco cheio'));

        await expect(
            CompetencyReviewService.getDue('2026-01-01T00:00:00.000Z', SEM_CRITICO),
        ).resolves.toEqual([]);

        espia.mockRestore();
    });
});
