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

/**
 * Por que a leitura da nuvem tem TRÊS estados e não dois.
 *
 * Com `ProgressBackup | null`, "não existe registro" e "existe um registro que
 * este binário não entende" colapsavam no mesmo `null` — e `backupNow` lê
 * `null` como permissão para gravar por cima. Um backup criado por uma versão
 * futura do app era destruído pelo snapshot local, dentro do mecanismo que
 * existe justamente para não perder progresso.
 *
 * `incompatible` nunca pode virar `null`: é registro presente e intocável.
 */
export type IncompatibleReason =
    /** Envelope de uma versão que este binário não sabe ler. */
    | 'payload-version'
    /** O payload não é JSON válido. */
    | 'corrupt'
    /** JSON válido, mas o progresso dentro dele é de outro schema. */
    | 'schema-version';

export type PrivateCloudRead =
    | { kind: 'absent' }
    | { kind: 'usable'; backup: ProgressBackup }
    | { kind: 'incompatible'; reason: IncompatibleReason };

export interface PrivateCloudPort {
    pull(): Promise<PrivateCloudRead>;
    push(snapshot: ProgressBackup): Promise<{ savedAt: string }>;
}

/**
 * O registro remoto mudou entre a leitura e a escrita.
 *
 * Distinto de `CloudUnavailableError` porque a resposta é diferente: conflito
 * se resolve refazendo o ciclo `pull → merge → push`, e indisponibilidade só
 * se resolve esperando. O merge continua sendo do TypeScript — o lado nativo
 * não abre o payload.
 */
export class CloudConflictError extends Error {
    readonly code = 'cloud-conflict' as const;

    constructor(message = 'O backup no iCloud mudou durante a gravação.') {
        super(message);
        this.name = 'CloudConflictError';
    }
}

export function isCloudConflict(error: unknown): error is CloudConflictError {
    return typeof error === 'object' && error !== null && (error as { code?: unknown }).code === 'cloud-conflict';
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

/**
 * `incompatible` é separado de `failed` de propósito: não é defeito nem falha
 * transitória, é um backup mais novo que este app. A ação do usuário é
 * diferente (atualizar o app), e apagar essa distinção esconderia de quem tem
 * progresso na nuvem que ele está lá, intacto.
 */
export type BackupError = 'cloud-unavailable' | 'failed' | 'incompatible';

export type BackupState = {
    enabled: boolean;
    lastBackupAt: string | null;
    lastError: BackupError | null;
};

export type BackupStateV1 = BackupState & { schemaVersion: 1 };
