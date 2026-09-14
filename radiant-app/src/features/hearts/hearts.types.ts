export type HeartsState = {
    count: number;
    lastRefillAt: string | null;
    unlimitedUntil: string | null;
};

export type HeartsStatus = 'full' | 'recovering' | 'empty' | 'unlimited';

export type HeartsSnapshot = {
    count: number;
    status: HeartsStatus;
    nextRefillAt: string | null;
    unlimitedUntil: string | null;
};
