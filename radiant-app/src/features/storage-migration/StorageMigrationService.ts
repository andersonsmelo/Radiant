import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';

export type StorageMigrationPort = Pick<
    typeof AsyncStorage,
    'getItem' | 'setItem' | 'removeItem'
>;

export type StorageMigrationStatus =
    | 'unchanged'
    | 'migrated'
    | 'restored-backup'
    | 'started-clean-with-warning';

export type StorageMigrationResult = {
    status: StorageMigrationStatus;
    warning?: string;
};

export type StorageMigrationProgress =
    | 'preparing-backup'
    | 'organizing-progress'
    | 'complete';

type MigrationBackup = {
    version: 1;
    createdAt: string;
    entries: Record<string, string | null>;
};

const TARGET_VERSION = '1.4';
const IN_PROGRESS = 'in-progress';
const COMPLETE = 'complete';
const RESTORED_WARNING = 'Seu progresso anterior foi restaurado. Tentaremos organizar a atualização novamente.';
const CLEAN_WARNING = 'Não encontramos uma cópia segura. O Radiant iniciou um progresso local novo.';

export const PEDAGOGICAL_STORAGE_KEYS: readonly string[] = [
    STORAGE_KEYS.JOURNEY_PROGRESS,
    STORAGE_KEYS.LEARNING_ATTEMPTS,
    STORAGE_KEYS.LEARNING_EVIDENCE,
    STORAGE_KEYS.COMPETENCY_MASTERY,
    STORAGE_KEYS.LESSON_RATINGS,
    STORAGE_KEYS.FIRST_RUN,
    STORAGE_KEYS.LEGACY_GAMIFICATION,
    STORAGE_KEYS.DAILY_GOAL,
    STORAGE_KEYS.SPACED_REPETITION_SCHEDULE,
    STORAGE_KEYS.HEARTS,
];

function initialHearts(): string {
    return JSON.stringify({ count: 5, lastRefillAt: null, unlimitedUntil: null });
}

function parseBackup(raw: string | null): MigrationBackup | null {
    if (raw === null) return null;
    try {
        const value: unknown = JSON.parse(raw);
        if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
        const candidate = value as Partial<MigrationBackup>;
        if (candidate.version !== 1 || typeof candidate.createdAt !== 'string') return null;
        if (typeof candidate.entries !== 'object' || candidate.entries === null || Array.isArray(candidate.entries)) {
            return null;
        }
        for (const key of PEDAGOGICAL_STORAGE_KEYS) {
            const entry = candidate.entries[key];
            if (entry !== null && typeof entry !== 'string') return null;
        }
        return candidate as MigrationBackup;
    } catch {
        return null;
    }
}

function validatePedagogicalJson(entries: Record<string, string | null>): void {
    for (const key of PEDAGOGICAL_STORAGE_KEYS) {
        const raw = entries[key];
        if (raw !== null) JSON.parse(raw);
    }
}

export class StorageMigration {
    constructor(
        private readonly storage: StorageMigrationPort = AsyncStorage,
        private readonly now: () => string = () => new Date().toISOString(),
    ) {}

    async migrateToV14(
        onProgress: (step: StorageMigrationProgress) => void = () => undefined,
    ): Promise<StorageMigrationResult> {
        if (await this.storage.getItem(STORAGE_KEYS.APP_SCHEMA_VERSION) === TARGET_VERSION) {
            return { status: 'unchanged' };
        }

        if (await this.storage.getItem(STORAGE_KEYS.V14_MIGRATION_STATE) === IN_PROGRESS) {
            return this.recoverInterruptedMigration();
        }

        onProgress('preparing-backup');
        const entries = await this.captureEntries();
        const backup: MigrationBackup = {
            version: 1,
            createdAt: this.now(),
            entries,
        };

        await this.storage.setItem(STORAGE_KEYS.V14_MIGRATION_BACKUP, JSON.stringify(backup));

        try {
            await this.storage.setItem(STORAGE_KEYS.V14_MIGRATION_STATE, IN_PROGRESS);
            validatePedagogicalJson(entries);
            onProgress('organizing-progress');
            await this.storage.setItem(STORAGE_KEYS.HEARTS, initialHearts());
            await this.storage.setItem(STORAGE_KEYS.APP_SCHEMA_VERSION, TARGET_VERSION);
            await this.storage.setItem(STORAGE_KEYS.V14_MIGRATION_STATE, COMPLETE);
            onProgress('complete');
            return { status: 'migrated' };
        } catch {
            await this.restore(backup);
            return { status: 'restored-backup', warning: RESTORED_WARNING };
        }
    }

    private async captureEntries(): Promise<Record<string, string | null>> {
        const entries: Record<string, string | null> = {};
        for (const key of PEDAGOGICAL_STORAGE_KEYS) {
            entries[key] = await this.storage.getItem(key);
        }
        return entries;
    }

    private async recoverInterruptedMigration(): Promise<StorageMigrationResult> {
        const backup = parseBackup(await this.storage.getItem(STORAGE_KEYS.V14_MIGRATION_BACKUP));
        if (backup) {
            await this.restore(backup);
            return { status: 'restored-backup', warning: RESTORED_WARNING };
        }

        for (const key of PEDAGOGICAL_STORAGE_KEYS) {
            await this.storage.removeItem(key);
        }
        await this.storage.setItem(STORAGE_KEYS.HEARTS, initialHearts());
        await this.storage.setItem(STORAGE_KEYS.APP_SCHEMA_VERSION, TARGET_VERSION);
        await this.storage.setItem(STORAGE_KEYS.V14_MIGRATION_STATE, COMPLETE);
        return { status: 'started-clean-with-warning', warning: CLEAN_WARNING };
    }

    private async restore(backup: MigrationBackup): Promise<void> {
        for (const key of PEDAGOGICAL_STORAGE_KEYS) {
            const raw = backup.entries[key];
            if (raw === null) {
                await this.storage.removeItem(key);
            } else {
                await this.storage.setItem(key, raw);
            }
        }
        await this.storage.removeItem(STORAGE_KEYS.APP_SCHEMA_VERSION);
        await this.storage.removeItem(STORAGE_KEYS.V14_MIGRATION_STATE);
    }
}

export const StorageMigrationService = new StorageMigration();
