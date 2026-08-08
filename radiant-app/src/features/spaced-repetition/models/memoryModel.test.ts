import { DEFAULT_MEMORY_PARAMS } from '../../../constants/competencyReview';
import type { CompetencyReviewCard, ReviewGrade } from '../../../types/competencyReview';
import {
    elapsedDaysBetween,
    intervalForTarget,
    isDelayedRetention,
    retrievability,
    scheduleNext,
} from './memoryModel';

const P = DEFAULT_MEMORY_PARAMS;
const ACERTO: ReviewGrade = { outcome: 'correct', hintUsed: false };
const ACERTO_COM_DICA: ReviewGrade = { outcome: 'correct', hintUsed: true };
const ERRO: ReviewGrade = { outcome: 'incorrect', hintUsed: false };

function cartao(overrides: Partial<CompetencyReviewCard> = {}): CompetencyReviewCard {
    return {
        competencyId: 'competency:protecao-radiologica:blindagem',
        stability: 10,
        difficulty: 0.3,
        reps: 2,
        lapses: 0,
        lastReviewedAt: '2026-01-01T00:00:00.000Z',
        dueAt: '2026-01-03T00:00:00.000Z',
        ...overrides,
    };
}

describe('retrievability', () => {
    it('vale 1 no instante da revisão e decresce com o tempo', () => {
        expect(retrievability(0, 10, P)).toBeCloseTo(1, 6);
        expect(retrievability(5, 10, P)).toBeLessThan(1);
        expect(retrievability(30, 10, P)).toBeLessThan(retrievability(5, 10, P));
    });

    it('trata decorrido negativo como zero', () => {
        expect(retrievability(-5, 10, P)).toBeCloseTo(1, 6);
    });

    it('devolve 0 para estabilidade não positiva', () => {
        expect(retrievability(1, 0, P)).toBe(0);
    });
});

describe('intervalForTarget', () => {
    it('respeita o piso mesmo quando a fórmula pede menos', () => {
        // Com r=0,95, S=3 e alpha=0,5 a fórmula pede ~0,324 dia (7,8 h).
        expect(intervalForTarget(3, 0.95, P)).toBe(P.minIntervalDays);
    });

    it('cresce com a estabilidade e respeita o teto', () => {
        expect(intervalForTarget(100, 0.9, P)).toBeGreaterThan(intervalForTarget(10, 0.9, P));
        expect(intervalForTarget(1e9, 0.9, P)).toBe(P.maxIntervalDays);
    });

    it('pede intervalo menor quando a retenção alvo é mais alta', () => {
        expect(intervalForTarget(100, 0.95, P)).toBeLessThan(intervalForTarget(100, 0.9, P));
    });
});

describe('isDelayedRetention', () => {
    it('aceita decorrido acima do limiar', () => {
        expect(isDelayedRetention('2026-01-01T00:00:00.000Z', '2026-01-02T00:00:00.000Z', P)).toBe(true);
    });

    it('recusa decorrido abaixo do limiar', () => {
        expect(isDelayedRetention('2026-01-01T00:00:00.000Z', '2026-01-01T10:00:00.000Z', P)).toBe(false);
    });

    it('recusa relógio retrocedido', () => {
        expect(isDelayedRetention('2026-01-02T00:00:00.000Z', '2026-01-01T00:00:00.000Z', P)).toBe(false);
    });

    it('recusa data ilegível', () => {
        expect(isDelayedRetention('nao-e-data', '2026-01-02T00:00:00.000Z', P)).toBe(false);
    });
});

describe('scheduleNext', () => {
    it('cria cartão na primeira exposição com acerto', () => {
        const resultado = scheduleNext({
            card: null,
            competencyId: 'competency:x:y',
            grade: ACERTO,
            criticalSafety: false,
            params: P,
            now: '2026-01-01T00:00:00.000Z',
        });

        expect(resultado.stability).toBe(P.initialStabilityCorrect);
        expect(resultado.difficulty).toBe(P.initialDifficulty);
        expect(resultado.reps).toBe(1);
        expect(resultado.lapses).toBe(0);
        expect(resultado.lastReviewedAt).toBe('2026-01-01T00:00:00.000Z');
    });

    it('cria cartão mais frágil na primeira exposição com erro', () => {
        const resultado = scheduleNext({
            card: null,
            competencyId: 'competency:x:y',
            grade: ERRO,
            criticalSafety: false,
            params: P,
            now: '2026-01-01T00:00:00.000Z',
        });

        expect(resultado.stability).toBe(P.initialStabilityIncorrect);
        expect(resultado.lapses).toBe(1);
    });

    it('nunca reduz estabilidade no acerto nem aumenta no erro', () => {
        const base = cartao();

        const comAcerto = scheduleNext({
            card: base, competencyId: base.competencyId, grade: ACERTO,
            criticalSafety: false, params: P, now: '2026-01-11T00:00:00.000Z',
        });
        const comErro = scheduleNext({
            card: base, competencyId: base.competencyId, grade: ERRO,
            criticalSafety: false, params: P, now: '2026-01-11T00:00:00.000Z',
        });

        expect(comAcerto.stability).toBeGreaterThanOrEqual(base.stability);
        expect(comErro.stability).toBeLessThanOrEqual(base.stability);
    });

    it('nunca deixa a estabilidade cair abaixo do piso de erro', () => {
        const frageil = cartao({ stability: 1.2 });

        const resultado = scheduleNext({
            card: frageil, competencyId: frageil.competencyId, grade: ERRO,
            criticalSafety: false, params: P, now: '2026-01-11T00:00:00.000Z',
        });

        expect(resultado.stability).toBeGreaterThanOrEqual(P.initialStabilityIncorrect);
    });

    it('mantém a dificuldade dentro de [0, 1] sob sequência longa', () => {
        let atual = cartao({ difficulty: 0.95 });
        for (let i = 0; i < 40; i += 1) {
            atual = scheduleNext({
                card: atual, competencyId: atual.competencyId, grade: ERRO,
                criticalSafety: false, params: P, now: `2026-02-${String((i % 27) + 1).padStart(2, '0')}T00:00:00.000Z`,
            });
        }
        expect(atual.difficulty).toBeLessThanOrEqual(1);
        expect(atual.difficulty).toBeGreaterThanOrEqual(0);
    });

    it('consolida MENOS quando o acerto veio com dica', () => {
        const base = cartao();
        const argumentos = {
            card: base, competencyId: base.competencyId,
            criticalSafety: false, params: P, now: '2026-01-11T00:00:00.000Z',
        };

        const semDica = scheduleNext({ ...argumentos, grade: ACERTO });
        const comDica = scheduleNext({ ...argumentos, grade: ACERTO_COM_DICA });

        expect(comDica.stability).toBeLessThan(semDica.stability);
    });

    it('consolida MAIS quando a revisão acontece mais tarde', () => {
        const base = cartao();
        const argumentos = {
            card: base, competencyId: base.competencyId, grade: ACERTO,
            criticalSafety: false, params: P,
        };

        const cedo = scheduleNext({ ...argumentos, now: '2026-01-02T00:00:00.000Z' });
        const tarde = scheduleNext({ ...argumentos, now: '2026-01-25T00:00:00.000Z' });

        expect(tarde.stability).toBeGreaterThan(cedo.stability);
    });

    it('agenda a competência crítica de segurança mais cedo', () => {
        const base = cartao({ stability: 100 });
        const argumentos = {
            card: base, competencyId: base.competencyId, grade: ACERTO,
            params: P, now: '2026-01-11T00:00:00.000Z',
        };

        const comum = scheduleNext({ ...argumentos, criticalSafety: false });
        const critica = scheduleNext({ ...argumentos, criticalSafety: true });

        expect(Date.parse(critica.dueAt)).toBeLessThan(Date.parse(comum.dueAt));
    });

    it('sempre agenda no mínimo o piso de intervalo à frente', () => {
        const resultado = scheduleNext({
            card: null, competencyId: 'competency:x:y', grade: ERRO,
            criticalSafety: true, params: P, now: '2026-01-01T00:00:00.000Z',
        });

        const horas = elapsedDaysBetween(resultado.lastReviewedAt, resultado.dueAt) * 24;
        expect(horas).toBeGreaterThanOrEqual(P.delayedRetentionMinHours);
    });
});
