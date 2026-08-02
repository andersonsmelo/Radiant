import type { LearningEvidence } from '../../../types/learningEvidence';
import type { MasteryParams } from '../../../types/mastery';
import { DEFAULT_MASTERY_PARAMS } from '../../../types/mastery';
import { calculateCompetencyMastery } from './CompetencyMasteryService';

const COMPETENCY = 'competency:protecao-radiologica:tempo-distancia-e-blindagem';
const NOW = '2026-08-02T12:00:00.000Z';

function daysBefore(days: number): string {
    return new Date(Date.parse(NOW) - days * 24 * 60 * 60 * 1000).toISOString();
}

function evidence(overrides: Partial<LearningEvidence> = {}): LearningEvidence {
    return {
        activityId: 'activity:protecao-1',
        interactionId: 'interaction:mc-1',
        competencyId: COMPETENCY,
        evidenceKind: 'guided-practice',
        outcome: 'correct',
        hintUsed: false,
        durationBand: 'unknown',
        contentVersion: 'foundations-safety-2026-08-01',
        recordedAt: daysBefore(1),
        ...overrides,
    };
}

function params(overrides: Partial<MasteryParams> = {}): MasteryParams {
    return { ...DEFAULT_MASTERY_PARAMS, now: NOW, ...overrides };
}

/** Percurso completo: as quatro evidências, todas corretas, sem erro recente. */
function fullPath(): LearningEvidence[] {
    return [
        evidence({ evidenceKind: 'guided-practice', recordedAt: daysBefore(20) }),
        evidence({ evidenceKind: 'independent-recall', recordedAt: daysBefore(18) }),
        evidence({ evidenceKind: 'applied-transfer', recordedAt: daysBefore(15) }),
        evidence({ evidenceKind: 'delayed-retention', recordedAt: daysBefore(5) }),
    ];
}

describe('calculateCompetencyMastery — os cinco estados', () => {
    it('devolve not-started quando não há evidência alguma', () => {
        const mastery = calculateCompetencyMastery(COMPETENCY, [], params());

        expect(mastery.state).toBe('not-started');
        expect(mastery.score).toBe(0);
        expect(mastery.evidenceCount).toBe(0);
    });

    it('devolve introduced com prática guiada correta apenas', () => {
        expect(calculateCompetencyMastery(COMPETENCY, [evidence()], params()).state).toBe('introduced');
    });

    it('devolve introduced quando há evidência mas nenhuma correta', () => {
        const mastery = calculateCompetencyMastery(
            COMPETENCY,
            [evidence({ outcome: 'incorrect', recordedAt: daysBefore(40) })],
            params(),
        );

        expect(mastery.state).toBe('introduced');
        expect(mastery.score).toBe(0);
    });

    it('devolve practicing com guiada e recuperação independente corretas', () => {
        const mastery = calculateCompetencyMastery(
            COMPETENCY,
            [
                evidence({ evidenceKind: 'guided-practice', recordedAt: daysBefore(20) }),
                evidence({ evidenceKind: 'independent-recall', recordedAt: daysBefore(18) }),
            ],
            params(),
        );

        expect(mastery.state).toBe('practicing');
    });

    it('devolve retained quando há retenção mas ainda falta transferência', () => {
        const mastery = calculateCompetencyMastery(
            COMPETENCY,
            [
                evidence({ evidenceKind: 'guided-practice', recordedAt: daysBefore(20) }),
                evidence({ evidenceKind: 'independent-recall', recordedAt: daysBefore(18) }),
                evidence({ evidenceKind: 'delayed-retention', recordedAt: daysBefore(5) }),
            ],
            params(),
        );

        expect(mastery.state).toBe('retained');
    });

    it('devolve mastered com o percurso completo e sem erro recente', () => {
        const mastery = calculateCompetencyMastery(COMPETENCY, fullPath(), params());

        expect(mastery.state).toBe('mastered');
        expect(mastery.score).toBeCloseTo(1);
    });
});

describe('calculateCompetencyMastery — pesos por tipo de evidência', () => {
    it('pesa recuperação independente e retenção acima de prática guiada', () => {
        const guiada = calculateCompetencyMastery(
            COMPETENCY, [evidence({ evidenceKind: 'guided-practice' })], params(),
        ).score;
        const independente = calculateCompetencyMastery(
            COMPETENCY, [evidence({ evidenceKind: 'independent-recall' })], params(),
        ).score;
        const retencao = calculateCompetencyMastery(
            COMPETENCY, [evidence({ evidenceKind: 'delayed-retention' })], params(),
        ).score;

        expect(independente).toBeGreaterThan(guiada);
        expect(retencao).toBeGreaterThan(guiada);
    });

    it('não soma duas vezes o mesmo tipo de evidência', () => {
        const uma = calculateCompetencyMastery(
            COMPETENCY, [evidence({ evidenceKind: 'independent-recall' })], params(),
        ).score;
        const duas = calculateCompetencyMastery(
            COMPETENCY,
            [
                evidence({ evidenceKind: 'independent-recall', interactionId: 'interaction:a' }),
                evidence({ evidenceKind: 'independent-recall', interactionId: 'interaction:b' }),
            ],
            params(),
        ).score;

        expect(duas).toBeCloseTo(uma);
    });
});

describe('calculateCompetencyMastery — bloqueio de mastered sem retenção', () => {
    it('não passa de practicing sem evidência de retenção, por mais acertos que haja', () => {
        const mastery = calculateCompetencyMastery(
            COMPETENCY,
            [
                evidence({ evidenceKind: 'guided-practice', recordedAt: daysBefore(20) }),
                evidence({ evidenceKind: 'independent-recall', recordedAt: daysBefore(18) }),
                evidence({ evidenceKind: 'applied-transfer', recordedAt: daysBefore(15) }),
            ],
            params(),
        );

        expect(mastery.state).toBe('practicing');
        expect(mastery.blockedBy).toContain('missing-retention');
    });

    it('não aceita retenção incorreta como retenção', () => {
        const comErro = fullPath().map((entry) => (
            entry.evidenceKind === 'delayed-retention' ? { ...entry, outcome: 'incorrect' as const } : entry
        ));

        const mastery = calculateCompetencyMastery(COMPETENCY, comErro, params({ now: NOW }));

        expect(mastery.state).not.toBe('mastered');
        expect(mastery.blockedBy).toContain('missing-retention');
    });
});

describe('calculateCompetencyMastery — degradação por erro recente', () => {
    it('rebaixa um nível quando há erro dentro da janela recente', () => {
        const comErroRecente = [...fullPath(), evidence({ outcome: 'incorrect', recordedAt: daysBefore(1) })];

        const mastery = calculateCompetencyMastery(COMPETENCY, comErroRecente, params());

        expect(mastery.state).toBe('retained');
        expect(mastery.blockedBy).toContain('recent-error');
    });

    it('ignora erro antigo, fora da janela recente', () => {
        const comErroAntigo = [...fullPath(), evidence({ outcome: 'incorrect', recordedAt: daysBefore(60) })];

        expect(calculateCompetencyMastery(COMPETENCY, comErroAntigo, params()).state).toBe('mastered');
    });

    it('nunca rebaixa abaixo de introduced quando existe evidência', () => {
        const mastery = calculateCompetencyMastery(
            COMPETENCY,
            [
                evidence({ evidenceKind: 'guided-practice', recordedAt: daysBefore(2) }),
                evidence({ outcome: 'incorrect', recordedAt: daysBefore(1) }),
            ],
            params(),
        );

        expect(mastery.state).toBe('introduced');
    });
});

describe('calculateCompetencyMastery — gate crítico de segurança', () => {
    it('não concede mastered a competência crítica com erro na janela', () => {
        const comErro = [...fullPath(), evidence({ outcome: 'incorrect', recordedAt: daysBefore(3) })];

        const mastery = calculateCompetencyMastery(COMPETENCY, comErro, params({ criticalSafety: true }));

        expect(mastery.state).toBe('practicing');
        expect(mastery.blockedBy).toContain('critical-safety-error');
    });

    it('concede mastered a competência crítica sem erro na janela', () => {
        const mastery = calculateCompetencyMastery(COMPETENCY, fullPath(), params({ criticalSafety: true }));

        expect(mastery.state).toBe('mastered');
    });
});

describe('calculateCompetencyMastery — evidência legada', () => {
    const legada = evidence({
        evidenceKind: 'legacy-lesson-recall',
        competencyId: 'competency:legacy:lesson-1',
        contentVersion: 'legacy-lesson-catalog',
    });

    it('ignora evidência legada por padrão, porque ela não sabe que competência mede', () => {
        const mastery = calculateCompetencyMastery('competency:legacy:lesson-1', [legada], params());

        expect(mastery.state).toBe('not-started');
        expect(mastery.evidenceCount).toBe(0);
    });

    it('conta evidência legada apenas quando explicitamente pedido', () => {
        const mastery = calculateCompetencyMastery(
            'competency:legacy:lesson-1', [legada], params({ includeLegacyEvidence: true }),
        );

        expect(mastery.state).toBe('introduced');
        expect(mastery.evidenceCount).toBe(1);
    });
});

describe('calculateCompetencyMastery — determinismo', () => {
    it('ignora evidência de outra competência', () => {
        const deOutra = evidence({ competencyId: 'competency:parametros-e-qualidade:contraste-resolucao-ruido-artefato' });

        expect(calculateCompetencyMastery(COMPETENCY, [deOutra], params()).state).toBe('not-started');
    });

    it('não depende da ordem de entrada', () => {
        const direta = calculateCompetencyMastery(COMPETENCY, fullPath(), params());
        const invertida = calculateCompetencyMastery(COMPETENCY, [...fullPath()].reverse(), params());

        expect(invertida).toEqual(direta);
    });

    it('não lê o relógio: mesmo `now` produz o mesmo resultado em qualquer execução', () => {
        const primeira = calculateCompetencyMastery(COMPETENCY, fullPath(), params());
        const segunda = calculateCompetencyMastery(COMPETENCY, fullPath(), params());

        expect(segunda).toEqual(primeira);
        expect(primeira.evaluatedAt).toBe(NOW);
    });
});
