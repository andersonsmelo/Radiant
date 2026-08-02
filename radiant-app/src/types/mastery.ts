/**
 * Domínio por competência.
 *
 * Este arquivo carrega uma regra pedagógica, não uma métrica de engajamento. A
 * spec é explícita: o sucesso primário é domínio em checkpoints e retenção em
 * revisões futuras, e engajamento não pode compensar aprendizagem insuficiente.
 * Cada limiar e cada bloqueio aqui existe para impedir que o app declare
 * "dominado" com base em atividade em vez de evidência.
 */

import type { AuthoredEvidenceKind } from './learningActivity';

export type MasteryState =
    | 'not-started'
    | 'introduced'
    | 'practicing'
    | 'retained'
    | 'mastered';

/** Ordem de progressão, usada para rebaixar um nível na degradação. */
export const MASTERY_ORDER: readonly MasteryState[] = [
    'not-started',
    'introduced',
    'practicing',
    'retained',
    'mastered',
];

/**
 * Motivos pelos quais um estado foi contido abaixo do que a pontuação sozinha
 * daria. Fica no resultado porque o aluno tem direito de saber por que uma
 * competência não avançou — a spec proíbe que o algoritmo esconda isso.
 */
export type MasteryBlocker = 'missing-retention' | 'recent-error' | 'critical-safety-error';

export type CompetencyMastery = {
    competencyId: string;
    state: MasteryState;
    /** 0–1, soma dos pesos dos tipos de evidência com ao menos um acerto. */
    score: number;
    evidenceCount: number;
    blockedBy: MasteryBlocker[];
    /** Espelha `params.now`: o cálculo não lê relógio. */
    evaluatedAt: string;
};

export type MasteryParams = {
    /** Instante de referência, injetado. Nada aqui chama `Date.now()`. */
    now: string;
    /** Janela em dias na qual um erro ainda pesa contra o domínio. */
    recentErrorWindowDays: number;
    weights: Record<AuthoredEvidenceKind, number>;
    thresholds: {
        practicing: number;
        retained: number;
        mastered: number;
    };
    /**
     * Competência crítica de segurança: um erro na janela recente impede
     * `retained` e `mastered`, não apenas rebaixa um nível. A assimetria é
     * deliberada — errar sobre blindagem não é o mesmo que errar sobre um
     * conceito, e o checkpoint da unidade depende dessa distinção.
     */
    criticalSafety: boolean;
    /**
     * Evidência legada é ignorada por padrão. Lição antiga não foi escrita
     * contra o currículo, então sua evidência não sabe qual competência mede;
     * somá-la produziria um número plausível e errado — o pior tipo, porque não
     * parece errado. Ligar isto é uma decisão consciente, nunca um default.
     */
    includeLegacyEvidence: boolean;
};

/**
 * Pesos somando 1. Recuperação independente e retenção pesam mais que prática
 * guiada porque guiada é apoio: acertar com dica disponível demonstra bem menos
 * que recuperar sozinho depois de um intervalo.
 */
export const DEFAULT_MASTERY_PARAMS: MasteryParams = {
    now: '1970-01-01T00:00:00.000Z',
    recentErrorWindowDays: 14,
    weights: {
        'guided-practice': 0.15,
        'independent-recall': 0.3,
        'applied-transfer': 0.25,
        'delayed-retention': 0.3,
    },
    thresholds: {
        practicing: 0.4,
        retained: 0.7,
        mastered: 1,
    },
    criticalSafety: false,
    includeLegacyEvidence: false,
};
