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

        // Estabilidade inicial é medida em dias (ver comentário do tipo:
        // "dias até a recuperabilidade cair ao alvo"). Tem de ser positiva —
        // estabilidade zero ou negativa não descreve memória nenhuma — e
        // plausível para um item recém-visto: até 30 dias dá folga generosa
        // sem deixar passar um valor fora de ordem de grandeza (ex.: centenas
        // de dias).
        expect(DEFAULT_MEMORY_PARAMS.initialStabilityCorrect).toBeGreaterThan(0);
        expect(DEFAULT_MEMORY_PARAMS.initialStabilityCorrect).toBeLessThanOrEqual(30);
        expect(DEFAULT_MEMORY_PARAMS.initialStabilityIncorrect).toBeGreaterThan(0);
        expect(DEFAULT_MEMORY_PARAMS.initialStabilityIncorrect).toBeLessThanOrEqual(30);

        // Errar na primeira exposição não pode produzir memória mais estável
        // do que acertar — senão o agendador recompensaria o erro com um
        // intervalo maior até a próxima revisão.
        expect(DEFAULT_MEMORY_PARAMS.initialStabilityIncorrect).toBeLessThanOrEqual(
            DEFAULT_MEMORY_PARAMS.initialStabilityCorrect,
        );

        // O ganho de estabilidade tem de ser positivo — um acerto nunca pode
        // encolher a memória — e não absurdo: um valor de dezenas infla a
        // estabilidade muito além da faixa inicial plausível em uma única
        // repetição.
        expect(DEFAULT_MEMORY_PARAMS.stabilityGain).toBeGreaterThan(0);
        expect(DEFAULT_MEMORY_PARAMS.stabilityGain).toBeLessThanOrEqual(10);

        // Dificuldade vive em [0, 1] (ver comentário do tipo em
        // `competencyReview.ts`), então o valor inicial precisa respeitar a
        // mesma escala.
        expect(DEFAULT_MEMORY_PARAMS.initialDifficulty).toBeGreaterThanOrEqual(0);
        expect(DEFAULT_MEMORY_PARAMS.initialDifficulty).toBeLessThanOrEqual(1);

        // O passo de dificuldade tem de ser positivo (senão nunca ajusta) e
        // menor que 1 (senão uma única repetição satura a escala 0–1
        // inteira).
        expect(DEFAULT_MEMORY_PARAMS.difficultyStep).toBeGreaterThan(0);
        expect(DEFAULT_MEMORY_PARAMS.difficultyStep).toBeLessThan(1);

        // O limiar de retenção retardada tem de ser positivo e menor que um
        // dia inteiro (24h): curto o bastante para uma revisão "no dia
        // seguinte" sempre qualificar, mesmo com horas de deriva, mas
        // comprido o bastante para nenhuma repetição feita na mesma noite
        // qualificar.
        expect(DEFAULT_MEMORY_PARAMS.delayedRetentionMinHours).toBeGreaterThan(0);
        expect(DEFAULT_MEMORY_PARAMS.delayedRetentionMinHours).toBeLessThan(24);

        // O teto de intervalo tem de ser positivo — um teto zero ou negativo
        // impediria qualquer revisão de ser agendada.
        expect(DEFAULT_MEMORY_PARAMS.maxIntervalDays).toBeGreaterThan(0);
    });
});
