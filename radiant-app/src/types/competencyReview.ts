// radiant-app/src/types/competencyReview.ts

/**
 * Agendamento de revisão por competência.
 *
 * A nota não é a escala 0–5 do SM-2. O motor de domínio já registra `outcome` e
 * `hintUsed` por interação em `LearningEvidence`; inventar uma segunda escala
 * aqui criaria duas verdades sobre o mesmo acerto.
 */

export type ReviewOutcome = 'correct' | 'incorrect';

export type ReviewGrade = {
    outcome: ReviewOutcome;
    hintUsed: boolean;
};

export type CompetencyReviewCard = {
    competencyId: string;
    /** Dias até a recuperabilidade cair ao alvo. */
    stability: number;
    /** 0–1. */
    difficulty: number;
    reps: number;
    lapses: number;
    /** ISO. */
    lastReviewedAt: string;
    /** ISO, derivado da estabilidade e do alvo; persistido para consulta barata. */
    dueAt: string;
};

export type MemoryParams = {
    /** Forma da curva de esquecimento. */
    alpha: number;
    /** Quanto um acerto consolida. */
    stabilityGain: number;
    /** Quanto um erro encolhe a estabilidade. */
    lapseFactor: number;
    /** Desconto aplicado ao acerto obtido com dica. */
    hintPenalty: number;
    difficultyStep: number;
    initialStabilityCorrect: number;
    initialStabilityIncorrect: number;
    initialDifficulty: number;
    targetRetention: number;
    targetRetentionCriticalSafety: number;
    /**
     * Decorrido mínimo para uma recuperação contar como retardada. Curto o
     * bastante para uma revisão "no dia seguinte" sempre qualificar mesmo com
     * horas de deriva; longo o bastante para nenhuma repetição na mesma noite
     * qualificar.
     */
    delayedRetentionMinHours: number;
    minIntervalDays: number;
    maxIntervalDays: number;
};

export type CompetencyReviewStore = {
    schemaVersion: number;
    cards: Record<string, CompetencyReviewCard>;
    /** Último `now` observado; detecta relógio que andou para trás. */
    lastSeenClock: string;
    updatedAt: string;
};

export type DueCompetency = {
    competencyId: string;
    /** Recuperabilidade estimada no instante da consulta; menor é mais urgente. */
    retrievability: number;
    criticalSafety: boolean;
};
