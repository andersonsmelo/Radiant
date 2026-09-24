/**
 * Quantos dias faltam para a próxima revisão, como o resumo da lição anuncia.
 *
 * O SM-2 carimba o cartão com o próprio relógio, alguns milissegundos depois do
 * `answeredAt` (medido: 1 ms no E2E de 2026-09-24). Contado a partir da
 * resposta, esse resto passa do dia inteiro e o `Math.ceil` o transforma num dia
 * a mais — "2 dias" para a revisão de 24 h. Por isso, quando o cartão foi
 * carimbado por esta resposta, a contagem parte do carimbo dele.
 */

import type { SRCardState } from '../../../types/spacedRepetition';

const DAY_MS = 24 * 60 * 60 * 1000;

export function resolveNextReviewInDays(
    card: Pick<SRCardState, 'nextReviewAt' | 'lastReviewedAt'>,
    answeredAt: Date,
): number {
    const stampedByThisAnswer = card.lastReviewedAt.getTime() >= answeredAt.getTime();
    const from = stampedByThisAnswer ? card.lastReviewedAt : answeredAt;

    return Math.max(0, Math.ceil((card.nextReviewAt.getTime() - from.getTime()) / DAY_MS));
}
