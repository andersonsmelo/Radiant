import { SM2_PARAMS, SR_SAFETY_CAPS, SR_RATING_THRESHOLDS } from '../../../constants/spacedRepetition';

/** Mesmo SM-2 do serviço legado, com relógio explícito e sem armazenamento. */
export function advanceItemSm2(card: { interval: number; repetitions: number; easeFactor: number }, quality: number, nowMs: number) {
    const next = { ...card };
    if (quality < SR_RATING_THRESHOLDS.SUCCESS_THRESHOLD) {
        next.interval = SM2_PARAMS.INITIAL_INTERVALS[0]; next.repetitions = 0;
    } else {
        next.interval = next.repetitions === 0 ? SM2_PARAMS.INITIAL_INTERVALS[0]
            : next.repetitions === 1 ? SM2_PARAMS.INITIAL_INTERVALS[1] : Math.round(next.interval * next.easeFactor);
        next.repetitions += 1;
    }
    next.easeFactor += 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
    next.easeFactor = Math.max(SM2_PARAMS.MIN_EASE, Math.min(SM2_PARAMS.MAX_EASE, next.easeFactor));
    next.interval = Math.max(SR_SAFETY_CAPS.MIN_INTERVAL_DAYS, Math.min(SR_SAFETY_CAPS.MAX_INTERVAL_DAYS, next.interval));
    return { ...next, dueAtMs: nowMs + next.interval * 86400000 };
}
