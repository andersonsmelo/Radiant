import type { HeartsSnapshot, HeartsState } from './hearts.types';

export const MAX_HEARTS = 5;
export const REFILL_MIN = 30;
export const REVIEW_REWARD = 1;

const REFILL_INTERVAL_MS = REFILL_MIN * 60 * 1000;

function fullState(): HeartsState {
    return {
        count: MAX_HEARTS,
        lastRefillAt: null,
        unlimitedUntil: null,
    };
}

function activeUnlimited(state: HeartsState, nowMs: number): boolean {
    if (state.unlimitedUntil === null) return false;
    const expiresAt = Date.parse(state.unlimitedUntil);
    return Number.isFinite(expiresAt) && nowMs < expiresAt;
}

function resolveEntitlement(state: HeartsState, nowMs: number): HeartsState {
    if (state.unlimitedUntil === null || activeUnlimited(state, nowMs)) return state;
    return fullState();
}

export const HeartsService = {
    initialState(): HeartsState {
        return fullState();
    },

    refillByTime(input: HeartsState, nowMs: number): HeartsState {
        const state = resolveEntitlement(input, nowMs);
        if (activeUnlimited(state, nowMs)) return state;
        if (state.count >= MAX_HEARTS) return fullState();
        if (state.lastRefillAt === null) return state;

        const lastRefillMs = Date.parse(state.lastRefillAt);
        if (!Number.isFinite(lastRefillMs) || nowMs < lastRefillMs) return state;

        const elapsedIntervals = Math.floor((nowMs - lastRefillMs) / REFILL_INTERVAL_MS);
        if (elapsedIntervals < 1) return state;

        const count = Math.min(MAX_HEARTS, state.count + elapsedIntervals);
        if (count === MAX_HEARTS) return fullState();

        return {
            count,
            lastRefillAt: new Date(lastRefillMs + elapsedIntervals * REFILL_INTERVAL_MS).toISOString(),
            unlimitedUntil: null,
        };
    },

    spend(input: HeartsState, nowMs: number): HeartsState {
        const state = this.refillByTime(input, nowMs);
        if (activeUnlimited(state, nowMs) || state.count === 0) return state;

        return {
            count: state.count - 1,
            lastRefillAt: state.lastRefillAt ?? new Date(nowMs).toISOString(),
            unlimitedUntil: null,
        };
    },

    rewardReview(input: HeartsState, nowMs: number): HeartsState {
        const state = this.refillByTime(input, nowMs);
        if (activeUnlimited(state, nowMs) || state.count >= MAX_HEARTS) return state;

        const count = Math.min(MAX_HEARTS, state.count + REVIEW_REWARD);
        if (count === MAX_HEARTS) return fullState();

        return {
            count,
            lastRefillAt: state.lastRefillAt ?? new Date(nowMs).toISOString(),
            unlimitedUntil: null,
        };
    },

    setUnlimited(input: HeartsState, unlimitedUntil: string | null, nowMs: number): HeartsState {
        if (unlimitedUntil === null) return fullState();
        const expiresAt = Date.parse(unlimitedUntil);
        if (!Number.isFinite(expiresAt) || nowMs >= expiresAt) return fullState();

        return {
            ...input,
            unlimitedUntil,
        };
    },

    getSnapshot(input: HeartsState, nowMs: number): HeartsSnapshot {
        const state = this.refillByTime(input, nowMs);
        if (activeUnlimited(state, nowMs)) {
            return {
                count: state.count,
                status: 'unlimited',
                nextRefillAt: null,
                unlimitedUntil: state.unlimitedUntil,
            };
        }

        const status = state.count === MAX_HEARTS
            ? 'full'
            : state.count === 0 ? 'empty' : 'recovering';
        const lastRefillMs = state.lastRefillAt === null ? Number.NaN : Date.parse(state.lastRefillAt);
        const nextRefillAt = Number.isFinite(lastRefillMs)
            ? new Date(lastRefillMs + REFILL_INTERVAL_MS).toISOString()
            : null;

        return {
            count: state.count,
            status,
            nextRefillAt,
            unlimitedUntil: null,
        };
    },
};
