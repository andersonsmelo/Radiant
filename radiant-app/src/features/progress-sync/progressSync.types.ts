import type { SRCardStatePersisted } from '../../types/spacedRepetition';

/**
 * Backup do progresso no banco privado do iCloud (spec 1.4 §7).
 *
 * Um JSON pequeno com o que não pode se perder numa reinstalação: nós
 * concluídos, agenda do SM-2, XP, sequência e `lastRefillAt`. Conteúdo não
 * entra. A porta `PrivateCloudPort` é a única fronteira com o CloudKit; nesta
 * versão só o adaptador indisponível existe.
 */
export type ProgressBackup = {
    schemaVersion: 1;
    savedAt: string;
    completedNodesByTrack: Record<string, string[]>;
    reviewSchedule: Record<string, SRCardStatePersisted>;
    totalXp: number;
    streakDays: number;
    lastRefillAt: string | null;
};

export interface PrivateCloudPort {
    pull(): Promise<ProgressBackup | null>;
    push(snapshot: ProgressBackup): Promise<{ savedAt: string }>;
}

/** Lê e aplica o progresso local; o serviço nunca conhece as chaves de storage. */
export interface LocalProgressPort {
    snapshot(nowIso: string): Promise<ProgressBackup>;
    apply(merged: ProgressBackup): Promise<void>;
}

export class CloudUnavailableError extends Error {
    readonly code = 'cloud-unavailable' as const;

    constructor(message = 'O backup no iCloud não está disponível neste build.') {
        super(message);
        this.name = 'CloudUnavailableError';
    }
}

export function isCloudUnavailable(error: unknown): error is CloudUnavailableError {
    return typeof error === 'object' && error !== null && (error as { code?: unknown }).code === 'cloud-unavailable';
}

export type BackupError = 'cloud-unavailable' | 'failed';

export type BackupState = {
    enabled: boolean;
    lastBackupAt: string | null;
    lastError: BackupError | null;
};

export type BackupStateV1 = BackupState & { schemaVersion: 1 };
