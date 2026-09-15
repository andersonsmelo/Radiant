import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../../constants/storageKeys';
import { GamificationService } from '../gamification/services/GamificationService';
import type { SRCardStatePersisted } from '../../types/spacedRepetition';
import type { LocalProgressPort, ProgressBackup } from './progressSync.types';

type Storage = Pick<typeof AsyncStorage, 'getItem' | 'setItem'>;
type Gamification = {
    getSnapshot(): Promise<{ totalXp: number; streakDays: number }>;
    absorbBackup(backup: { totalXp: number; streakDays: number }): Promise<unknown>;
};

type Deps = { storage?: Storage; gamification?: Gamification };

type JourneyStoreShape = {
    tracks?: Record<string, { completedNodeIds?: unknown } & Record<string, unknown>>;
} & Record<string, unknown>;

type ScheduleStoreShape = {
    cards?: Record<string, SRCardStatePersisted>;
    reviewHistory?: unknown[];
    lastUpdated?: string;
};

type HeartsShape = { count: number; lastRefillAt: string | null; unlimitedUntil: string | null };

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function readJson<T>(storage: Storage, key: string): Promise<T | null> {
    try {
        const raw = await storage.getItem(key);
        if (raw === null) return null;
        const value: unknown = JSON.parse(raw);
        return isRecord(value) ? (value as T) : null;
    } catch (cause) {
        console.error(`[LocalProgressAdapter] Falha ao ler ${key}:`, cause);
        return null;
    }
}

/**
 * Fotografa e aplica o progresso local para o backup, falando com o storage
 * das trilhas, da agenda e das vidas, e com a gamificação pelo serviço (que
 * mantém cache em memória).
 *
 * `apply` só toca trilhas que já existem localmente: um nó de uma trilha que
 * este aparelho ainda não hidratou não tem definição para ser anexado, e
 * inventar a trilha corromperia o progresso. A mescla continua guardada na
 * nuvem e volta a ser aplicada no próximo backup.
 */
export class LocalProgressAdapter implements LocalProgressPort {
    private readonly storage: Storage;
    private readonly gamification: Gamification;

    constructor(deps: Deps = {}) {
        this.storage = deps.storage ?? AsyncStorage;
        this.gamification = deps.gamification ?? GamificationService;
    }

    async snapshot(nowIso: string): Promise<ProgressBackup> {
        const [journey, schedule, hearts, gamification] = await Promise.all([
            readJson<JourneyStoreShape>(this.storage, STORAGE_KEYS.JOURNEY_PROGRESS),
            readJson<ScheduleStoreShape>(this.storage, STORAGE_KEYS.SPACED_REPETITION_SCHEDULE),
            readJson<HeartsShape>(this.storage, STORAGE_KEYS.HEARTS),
            this.gamification.getSnapshot(),
        ]);

        const completedNodesByTrack: Record<string, string[]> = {};
        for (const [trackId, track] of Object.entries(journey?.tracks ?? {})) {
            const ids = Array.isArray(track?.completedNodeIds) ? track.completedNodeIds : [];
            completedNodesByTrack[trackId] = ids.filter((id): id is string => typeof id === 'string');
        }

        return {
            schemaVersion: 1,
            savedAt: nowIso,
            completedNodesByTrack,
            reviewSchedule: isRecord(schedule?.cards) ? { ...schedule.cards } : {},
            totalXp: gamification.totalXp,
            streakDays: gamification.streakDays,
            lastRefillAt: typeof hearts?.lastRefillAt === 'string' ? hearts.lastRefillAt : null,
        };
    }

    async apply(merged: ProgressBackup): Promise<void> {
        await this.applyJourney(merged);
        await this.applySchedule(merged);
        await this.applyHearts(merged);
        await this.gamification.absorbBackup({ totalXp: merged.totalXp, streakDays: merged.streakDays });
    }

    private async applyJourney(merged: ProgressBackup): Promise<void> {
        const journey = await readJson<JourneyStoreShape>(this.storage, STORAGE_KEYS.JOURNEY_PROGRESS);
        if (!journey || !isRecord(journey.tracks)) return;

        let changed = false;
        for (const [trackId, nodeIds] of Object.entries(merged.completedNodesByTrack)) {
            const track = journey.tracks[trackId];
            if (!track) continue;
            const current = Array.isArray(track.completedNodeIds) ? (track.completedNodeIds as string[]) : [];
            const union = [...new Set([...current, ...nodeIds])];
            if (union.length !== current.length) {
                track.completedNodeIds = union;
                changed = true;
            }
        }
        if (changed) await this.storage.setItem(STORAGE_KEYS.JOURNEY_PROGRESS, JSON.stringify(journey));
    }

    private async applySchedule(merged: ProgressBackup): Promise<void> {
        const schedule = (await readJson<ScheduleStoreShape>(this.storage, STORAGE_KEYS.SPACED_REPETITION_SCHEDULE)) ?? {};
        await this.storage.setItem(STORAGE_KEYS.SPACED_REPETITION_SCHEDULE, JSON.stringify({
            ...schedule,
            cards: { ...(isRecord(schedule.cards) ? schedule.cards : {}), ...merged.reviewSchedule },
            reviewHistory: Array.isArray(schedule.reviewHistory) ? schedule.reviewHistory : [],
            lastUpdated: merged.savedAt,
        }));
    }

    private async applyHearts(merged: ProgressBackup): Promise<void> {
        if (merged.lastRefillAt === null) return;
        const hearts = await readJson<HeartsShape>(this.storage, STORAGE_KEYS.HEARTS);
        if (!hearts) return;
        const current = typeof hearts.lastRefillAt === 'string' ? Date.parse(hearts.lastRefillAt) : Number.NEGATIVE_INFINITY;
        if (Date.parse(merged.lastRefillAt) <= current) return;
        await this.storage.setItem(STORAGE_KEYS.HEARTS, JSON.stringify({ ...hearts, lastRefillAt: merged.lastRefillAt }));
    }
}
