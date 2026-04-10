/**
 * Legacy XP helpers kept as a stable module boundary for future extraction.
 * The concrete XP calculation currently lives in `GamificationService`.
 */

export const REVIEW_XP_BASE = 4;

export function normalizeXpValue(value: number): number {
    if (!Number.isFinite(value)) {
        return 0;
    }

    return Math.max(0, Math.round(value));
}
