import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../../constants/storageKeys';
import { LocalProgressAdapter } from './LocalProgressAdapter';
import { UnavailablePrivateCloudAdapter } from './UnavailablePrivateCloudAdapter';
import {
    isCloudUnavailable,
    type BackupState,
    type BackupStateV1,
    type LocalProgressPort,
    type PrivateCloudPort,
    type ProgressBackup,
} from './progressSync.types';

export type ProgressSyncStorage = Pick<typeof AsyncStorage, 'getItem' | 'setItem'>;

type Deps = {
    cloud?: PrivateCloudPort;
    local?: LocalProgressPort;
    storage?: ProgressSyncStorage;
};

const INITIAL_STATE: BackupState = { enabled: false, lastBackupAt: null, lastError: null };

function laterIso(a: string | null, b: string | null): string | null {
    if (a === null) return b;
    if (b === null) return a;
    return Date.parse(b) > Date.parse(a) ? b : a;
}

/**
 * Conflito: mescla, nunca apaga. União de concluídos por trilha, agenda mais
 * recente por nó, maior XP e sequência, `lastRefillAt` mais recente. Uma nuvem
 * vazia ou ausente devolve o local intacto.
 */
export function mergeProgressBackups(local: ProgressBackup, cloud: ProgressBackup | null): ProgressBackup {
    if (cloud === null) return local;

    const completedNodesByTrack: Record<string, string[]> = {};
    for (const trackId of new Set([...Object.keys(local.completedNodesByTrack), ...Object.keys(cloud.completedNodesByTrack)])) {
        completedNodesByTrack[trackId] = [...new Set([
            ...(local.completedNodesByTrack[trackId] ?? []),
            ...(cloud.completedNodesByTrack[trackId] ?? []),
        ])];
    }

    const reviewSchedule = { ...local.reviewSchedule };
    for (const [lessonId, remote] of Object.entries(cloud.reviewSchedule)) {
        const current = reviewSchedule[lessonId];
        if (!current || Date.parse(remote.lastReviewedAt) > Date.parse(current.lastReviewedAt)) {
            reviewSchedule[lessonId] = remote;
        }
    }

    return {
        schemaVersion: 1,
        savedAt: local.savedAt,
        completedNodesByTrack,
        reviewSchedule,
        totalXp: Math.max(local.totalXp, cloud.totalXp),
        streakDays: Math.max(local.streakDays, cloud.streakDays),
        lastRefillAt: laterIso(local.lastRefillAt, cloud.lastRefillAt),
    };
}

function parseState(raw: string | null): BackupState {
    if (raw === null) return INITIAL_STATE;
    try {
        const value: unknown = JSON.parse(raw);
        if (typeof value !== 'object' || value === null) return INITIAL_STATE;
        const record = value as Record<string, unknown>;
        if (record.schemaVersion !== 1) return INITIAL_STATE;
        return {
            enabled: record.enabled === true,
            lastBackupAt: typeof record.lastBackupAt === 'string' ? record.lastBackupAt : null,
            lastError: record.lastError === 'cloud-unavailable' || record.lastError === 'failed' ? record.lastError : null,
        };
    } catch {
        return INITIAL_STATE;
    }
}

export class ProgressSyncService {
    private readonly cloud: PrivateCloudPort;
    private readonly local: LocalProgressPort;
    private readonly storage: ProgressSyncStorage;

    constructor(deps: Deps = {}) {
        this.cloud = deps.cloud ?? new UnavailablePrivateCloudAdapter();
        this.local = deps.local ?? new LocalProgressAdapter();
        this.storage = deps.storage ?? AsyncStorage;
    }

    async getState(): Promise<BackupState> {
        return parseState(await this.storage.getItem(STORAGE_KEYS.PROGRESS_BACKUP));
    }

    /** Ligar sobe o local na hora; desligar só para de sincronizar — nada é apagado. */
    async setEnabled(enabled: boolean, nowMs: number): Promise<BackupState> {
        const state = await this.writeState({ ...(await this.getState()), enabled });
        return enabled ? this.backupNow(nowMs) : state;
    }

    /** `push` a cada conclusão de nó: mescla o que existe na nuvem e sobe a união. */
    async backupNow(nowMs: number): Promise<BackupState> {
        const state = await this.getState();
        if (!state.enabled) return state;

        try {
            const local = await this.local.snapshot(new Date(nowMs).toISOString());
            const cloud = await this.cloud.pull();
            const merged = mergeProgressBackups(local, cloud);
            if (cloud !== null) await this.local.apply(merged);
            const { savedAt } = await this.cloud.push(merged);
            return this.writeState({ enabled: true, lastBackupAt: savedAt, lastError: null });
        } catch (cause) {
            return this.recordFailure(state, cause);
        }
    }

    /** `pull` na abertura: nuvem vazia nunca substitui o progresso local. */
    async restoreOnLaunch(nowMs: number): Promise<BackupState> {
        const state = await this.getState();
        if (!state.enabled) return state;

        try {
            const cloud = await this.cloud.pull();
            if (cloud === null) return state;
            const local = await this.local.snapshot(new Date(nowMs).toISOString());
            await this.local.apply(mergeProgressBackups(local, cloud));
            return this.writeState({ ...state, lastError: null });
        } catch (cause) {
            return this.recordFailure(state, cause);
        }
    }

    private async recordFailure(state: BackupState, cause: unknown): Promise<BackupState> {
        if (!isCloudUnavailable(cause)) {
            console.error('[ProgressSyncService] Falha no backup:', cause);
        }
        return this.writeState({ ...state, lastError: isCloudUnavailable(cause) ? 'cloud-unavailable' : 'failed' });
    }

    private async writeState(state: BackupState): Promise<BackupState> {
        const persisted: BackupStateV1 = { schemaVersion: 1, ...state };
        await this.storage.setItem(STORAGE_KEYS.PROGRESS_BACKUP, JSON.stringify(persisted));
        return state;
    }
}

export const progressSyncService = new ProgressSyncService();
