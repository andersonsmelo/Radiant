import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { HeartsService } from './HeartsService';
import type { HeartsSnapshot, HeartsState } from './hearts.types';

export type HeartsStorage = Pick<typeof AsyncStorage, 'getItem' | 'setItem'>;

const storageQueues = new WeakMap<HeartsStorage, Promise<unknown>>();
const STATE_KEYS = ['count', 'lastRefillAt', 'unlimitedUntil'];

function isIsoTimestamp(value: unknown): value is string {
    return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function parseState(raw: string | null): HeartsState | null {
    if (raw === null) return null;
    try {
        const value: unknown = JSON.parse(raw);
        if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
        const record = value as Record<string, unknown>;
        if (Object.keys(record).sort().join('|') !== [...STATE_KEYS].sort().join('|')) return null;
        if (!Number.isInteger(record.count) || (record.count as number) < 0 || (record.count as number) > 5) {
            return null;
        }
        if (record.lastRefillAt !== null && !isIsoTimestamp(record.lastRefillAt)) return null;
        if (record.unlimitedUntil !== null && !isIsoTimestamp(record.unlimitedUntil)) return null;
        return value as HeartsState;
    } catch {
        return null;
    }
}

function sameState(left: HeartsState | null, right: HeartsState): boolean {
    return left !== null
        && left.count === right.count
        && left.lastRefillAt === right.lastRefillAt
        && left.unlimitedUntil === right.unlimitedUntil;
}

export class HeartsRepository {
    constructor(private readonly storage: HeartsStorage = AsyncStorage) {}

    getSnapshot(nowMs: number): Promise<HeartsSnapshot> {
        return this.exclusively(async () => {
            const state = await this.read();
            const normalized = HeartsService.refillByTime(state, nowMs);
            if (!sameState(state, normalized)) await this.write(normalized);
            return HeartsService.getSnapshot(normalized, nowMs);
        });
    }

    spend(nowMs: number): Promise<HeartsSnapshot> {
        return this.transform(state => HeartsService.spend(state, nowMs), nowMs);
    }

    rewardReview(nowMs: number): Promise<HeartsSnapshot> {
        return this.transform(state => HeartsService.rewardReview(state, nowMs), nowMs);
    }

    setUnlimited(unlimitedUntil: string | null, nowMs: number): Promise<HeartsSnapshot> {
        return this.transform(
            state => HeartsService.setUnlimited(state, unlimitedUntil, nowMs),
            nowMs,
        );
    }

    private transform(
        operation: (state: HeartsState) => HeartsState,
        nowMs: number,
    ): Promise<HeartsSnapshot> {
        return this.exclusively(async () => {
            const next = operation(await this.read());
            await this.write(next);
            return HeartsService.getSnapshot(next, nowMs);
        });
    }

    private async read(): Promise<HeartsState> {
        const parsed = parseState(await this.storage.getItem(STORAGE_KEYS.HEARTS));
        if (parsed) return parsed;
        const initial = HeartsService.initialState();
        await this.write(initial);
        return initial;
    }

    private async write(state: HeartsState): Promise<void> {
        await this.storage.setItem(STORAGE_KEYS.HEARTS, JSON.stringify(state));
    }

    private exclusively<T>(work: () => Promise<T>): Promise<T> {
        const operation = (storageQueues.get(this.storage) ?? Promise.resolve()).then(work);
        storageQueues.set(this.storage, operation.then(() => undefined, () => undefined));
        return operation;
    }
}

export const heartsRepository = new HeartsRepository();
