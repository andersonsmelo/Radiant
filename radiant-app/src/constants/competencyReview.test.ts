// radiant-app/src/constants/competencyReview.test.ts
import { DEFAULT_MEMORY_PARAMS } from './competencyReview';

describe('constantes do agendador por competência', () => {
    it('mantém o piso de intervalo acima do limiar de retenção retardada', () => {
        const pisoEmHoras = DEFAULT_MEMORY_PARAMS.minIntervalDays * 24;

        expect(pisoEmHoras).toBeGreaterThanOrEqual(
            DEFAULT_MEMORY_PARAMS.delayedRetentionMinHours,
        );
    });

    it('exige retenção mais alta das competências críticas de segurança', () => {
        expect(DEFAULT_MEMORY_PARAMS.targetRetentionCriticalSafety).toBeGreaterThan(
            DEFAULT_MEMORY_PARAMS.targetRetention,
        );
    });

    it('mantém pesos e limiares dentro de faixas utilizáveis', () => {
        expect(DEFAULT_MEMORY_PARAMS.alpha).toBeGreaterThan(0);
        expect(DEFAULT_MEMORY_PARAMS.hintPenalty).toBeGreaterThan(0);
        expect(DEFAULT_MEMORY_PARAMS.hintPenalty).toBeLessThanOrEqual(1);
        expect(DEFAULT_MEMORY_PARAMS.lapseFactor).toBeGreaterThan(0);
        expect(DEFAULT_MEMORY_PARAMS.lapseFactor).toBeLessThan(1);
        expect(DEFAULT_MEMORY_PARAMS.targetRetention).toBeGreaterThan(0);
        expect(DEFAULT_MEMORY_PARAMS.targetRetention).toBeLessThan(1);
        expect(DEFAULT_MEMORY_PARAMS.minIntervalDays).toBeLessThan(
            DEFAULT_MEMORY_PARAMS.maxIntervalDays,
        );
    });
});
