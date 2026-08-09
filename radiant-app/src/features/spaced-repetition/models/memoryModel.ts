/**
 * Modelo de memória por competência.
 *
 * Puro e determinístico: não lê relógio, não lê storage, não conhece o
 * catálogo. `now` entra por parâmetro. É a mesma disciplina de
 * `calculateCompetencyMastery`, e pelo mesmo motivo — sem relógio interno, as
 * mesmas entradas sempre produzem o mesmo estado, e discordar do resultado vira
 * discutir limiares em vez de caçar não-determinismo.
 *
 * Este módulo existe para fabricar `delayed-retention` na hora certa. O
 * intervalo que ele escolhe é o que decide se a evidência conta.
 */

import type {
    CompetencyReviewCard,
    MemoryParams,
    ReviewGrade,
} from '../../../types/competencyReview';

const MS_POR_DIA = 24 * 60 * 60 * 1000;

/** Fora deste alcance `new Date(...).toISOString()` lança `RangeError`. */
const MAX_INSTANTE_VALIDO = 8.64e15;

/**
 * Marcador de agendamento impossível. Não é data e **não deve** ser: quem lê
 * `dueAt` com `Date.parse` recebe `NaN`, e todo leitor do subsistema já trata
 * `NaN` como "não vencido". Assim, quando a entrada é ambígua o cartão some da
 * fila em vez de aparecer eternamente vencido — ambiguidade resolve contra
 * conceder domínio, e um cartão que nunca vence é o lado seguro do erro.
 */
export const DUE_AT_INDETERMINADO = 'indeterminado';

export type ScheduleInput = {
    card: CompetencyReviewCard | null;
    competencyId: string;
    grade: ReviewGrade;
    criticalSafety: boolean;
    params: MemoryParams;
    now: string;
};

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Decorrido em dias, **clampado em zero**. Data ilegível ou relógio retrocedido
 * devolvem 0 — ambiguidade resolve contra conceder domínio.
 */
export function elapsedDaysBetween(fromIso: string, toIso: string): number {
    const from = Date.parse(fromIso);
    const to = Date.parse(toIso);

    if (Number.isNaN(from) || Number.isNaN(to)) {
        return 0;
    }

    return Math.max(0, (to - from) / MS_POR_DIA);
}

/**
 * Decaimento por potência, não exponencial: esquecimento tem cauda pesada, e a
 * exponencial erra justamente nos intervalos longos, que são os que interessam
 * a um sistema de manutenção de competência.
 */
export function retrievability(
    elapsedDays: number,
    stability: number,
    params: MemoryParams,
): number {
    if (stability <= 0) {
        return 0;
    }

    const t = Math.max(0, elapsedDays);
    return Math.pow(1 + t / stability, -params.alpha);
}

/** Inverte a curva no alvo de retenção e aplica piso e teto. */
export function intervalForTarget(
    stability: number,
    targetRetention: number,
    params: MemoryParams,
): number {
    const bruto = stability * (Math.pow(targetRetention, -1 / params.alpha) - 1);
    return clamp(bruto, params.minIntervalDays, params.maxIntervalDays);
}

/**
 * Uma recuperação só conta como retardada se o decorrido passou do limiar.
 * Falha fechado em data ilegível e em relógio retrocedido.
 */
export function isDelayedRetention(
    lastExposureIso: string,
    nowIso: string,
    params: MemoryParams,
): boolean {
    const from = Date.parse(lastExposureIso);
    const to = Date.parse(nowIso);

    if (Number.isNaN(from) || Number.isNaN(to)) {
        return false;
    }

    const horas = (to - from) / (60 * 60 * 1000);
    return horas >= params.delayedRetentionMinHours;
}

function cartaoInicial(input: ScheduleInput): CompetencyReviewCard {
    const { competencyId, grade, criticalSafety, params, now } = input;
    const acertou = grade.outcome === 'correct';

    const stability = acertou
        ? params.initialStabilityCorrect
        : params.initialStabilityIncorrect;

    const alvo = criticalSafety
        ? params.targetRetentionCriticalSafety
        : params.targetRetention;

    return {
        competencyId,
        stability,
        difficulty: params.initialDifficulty,
        reps: 1,
        lapses: acertou ? 0 : 1,
        lastReviewedAt: now,
        dueAt: somaDias(now, intervalForTarget(stability, alvo, params)),
    };
}

/**
 * Soma dias a um instante ISO, **falhando fechado** — a mesma disciplina de
 * `elapsedDaysBetween` (devolve 0) e `isDelayedRetention` (devolve `false`).
 *
 * Duas ambiguidades são recusadas em vez de arredondadas:
 *
 * 1. `iso` ilegível. Cair na época Unix produziria `dueAt: 1970-…`, um cartão
 *    permanentemente vencido — era o único ponto do subsistema onde a
 *    ambiguidade beneficiava o agendamento.
 * 2. `dias` não finito (cartão com `stability` corrompida propaga `NaN` até
 *    aqui). `new Date(NaN).toISOString()` lança `RangeError`, e a exceção
 *    escapava até fora de `observeExposure`, derrubando a conclusão da
 *    atividade por causa de um agendamento.
 */
export function somaDias(iso: string, dias: number): string {
    const base = Date.parse(iso);

    if (Number.isNaN(base) || !Number.isFinite(dias)) {
        return DUE_AT_INDETERMINADO;
    }

    const instante = base + dias * MS_POR_DIA;

    if (!Number.isFinite(instante) || Math.abs(instante) > MAX_INSTANTE_VALIDO) {
        return DUE_AT_INDETERMINADO;
    }

    return new Date(instante).toISOString();
}

export function scheduleNext(input: ScheduleInput): CompetencyReviewCard {
    const { card, grade, criticalSafety, params, now } = input;

    if (card === null) {
        return cartaoInicial(input);
    }

    const decorrido = elapsedDaysBetween(card.lastReviewedAt, now);
    const r = retrievability(decorrido, card.stability, params);

    let stability: number;
    let difficulty: number;
    let lapses = card.lapses;

    if (grade.outcome === 'correct') {
        // (1 - r) é o coração da decisão: acertar quando a recuperabilidade já
        // caiu vale mais que acertar logo depois. É a dificuldade desejável
        // expressa como aritmética, e é o que o easeFactor do SM-2 não sabe
        // fazer — ele não conhece o tempo decorrido.
        const desconto = grade.hintUsed ? params.hintPenalty : 1;
        const ganho = params.stabilityGain * (1 - card.difficulty) * (1 - r) * desconto;

        stability = card.stability * (1 + ganho);
        difficulty = clamp(card.difficulty - params.difficultyStep, 0, 1);
    } else {
        // O piso é a própria estabilidade inicial de erro: um lapso devolve a
        // competência ao ponto de partida de quem errou na primeira exposição,
        // e nunca abaixo disso.
        stability = Math.max(params.initialStabilityIncorrect, card.stability * params.lapseFactor);
        difficulty = clamp(card.difficulty + params.difficultyStep, 0, 1);
        lapses += 1;
    }

    const alvo = criticalSafety
        ? params.targetRetentionCriticalSafety
        : params.targetRetention;

    return {
        competencyId: card.competencyId,
        stability,
        difficulty,
        reps: card.reps + 1,
        lapses,
        lastReviewedAt: now,
        dueAt: somaDias(now, intervalForTarget(stability, alvo, params)),
    };
}
