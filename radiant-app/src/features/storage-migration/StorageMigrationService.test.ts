import { STORAGE_KEYS } from '../../constants/storageKeys';
import {
    PEDAGOGICAL_STORAGE_KEYS,
    StorageMigration,
} from './StorageMigrationService';
import { V131_PEDAGOGICAL_FIXTURE } from './v131Fixtures';

jest.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
    },
}));

class MemoryStorage {
    readonly values = new Map<string, string>();
    readonly operations: { kind: 'get' | 'set' | 'remove'; key: string }[] = [];
    failOnceOnSet: string | null = null;

    async getItem(key: string): Promise<string | null> {
        this.operations.push({ kind: 'get', key });
        return this.values.get(key) ?? null;
    }

    async setItem(key: string, value: string): Promise<void> {
        this.operations.push({ kind: 'set', key });
        if (this.failOnceOnSet === key) {
            this.failOnceOnSet = null;
            throw new Error('WRITE_FAILED');
        }
        this.values.set(key, value);
    }

    async removeItem(key: string): Promise<void> {
        this.operations.push({ kind: 'remove', key });
        this.values.delete(key);
    }
}

function seedV131(storage: MemoryStorage): void {
    for (const [key, value] of Object.entries(V131_PEDAGOGICAL_FIXTURE)) {
        storage.values.set(key, value);
    }
}

describe('StorageMigration', () => {
    const now = () => '2026-09-14T12:00:00.000Z';

    it('faz backup antes da primeira escrita operacional e migra instalação 1.3.1', async () => {
        const storage = new MemoryStorage();
        seedV131(storage);

        await expect(new StorageMigration(storage, now).migrateToV14()).resolves.toEqual({
            status: 'migrated',
        });

        const writes = storage.operations.filter(operation => operation.kind === 'set');
        expect(writes[0]?.key).toBe(STORAGE_KEYS.V14_MIGRATION_BACKUP);
        expect(storage.values.get(STORAGE_KEYS.APP_SCHEMA_VERSION)).toBe('1.4');
        expect(JSON.parse(storage.values.get(STORAGE_KEYS.HEARTS)!)).toEqual({
            count: 5,
            lastRefillAt: null,
            unlimitedUntil: null,
        });
        expect(storage.values.get(STORAGE_KEYS.LEGACY_GAMIFICATION)).toBe(
            V131_PEDAGOGICAL_FIXTURE['radiant:gami:v1'],
        );
    });

    it('instala CHEIA sem apagar os stores pedagógicos numa instalação limpa', async () => {
        const storage = new MemoryStorage();

        await expect(new StorageMigration(storage, now).migrateToV14())
            .resolves.toEqual({ status: 'migrated' });
        expect(JSON.parse(storage.values.get(STORAGE_KEYS.HEARTS)!)).toEqual({
            count: 5,
            lastRefillAt: null,
            unlimitedUntil: null,
        });
        expect(PEDAGOGICAL_STORAGE_KEYS).not.toContain(STORAGE_KEYS.AUTH_MIGRATION_STATE);
    });

    it('restaura o backup quando uma escrita falha depois da cópia', async () => {
        const storage = new MemoryStorage();
        seedV131(storage);
        storage.failOnceOnSet = STORAGE_KEYS.HEARTS;

        await expect(new StorageMigration(storage, now).migrateToV14()).resolves.toEqual({
            status: 'restored-backup',
            warning: 'Seu progresso anterior foi restaurado. Tentaremos organizar a atualização novamente.',
        });
        expect(storage.values.get(STORAGE_KEYS.JOURNEY_PROGRESS)).toBe(
            V131_PEDAGOGICAL_FIXTURE['@radiant:journey_progress_v1'],
        );
        expect(storage.values.has(STORAGE_KEYS.APP_SCHEMA_VERSION)).toBe(false);
    });

    it('preserva bytes corrompidos na cópia e restaura sem mascarar o problema', async () => {
        const storage = new MemoryStorage();
        seedV131(storage);
        storage.values.set(STORAGE_KEYS.JOURNEY_PROGRESS, '{ quebrado');

        await expect(new StorageMigration(storage, now).migrateToV14())
            .resolves.toMatchObject({ status: 'restored-backup' });
        expect(storage.values.get(STORAGE_KEYS.JOURNEY_PROGRESS)).toBe('{ quebrado');
        const backup = JSON.parse(storage.values.get(STORAGE_KEYS.V14_MIGRATION_BACKUP)!);
        expect(backup.entries[STORAGE_KEYS.JOURNEY_PROGRESS]).toBe('{ quebrado');
    });

    it('inicia limpo com aviso após interrupção sem backup recuperável', async () => {
        const storage = new MemoryStorage();
        seedV131(storage);
        storage.values.set(STORAGE_KEYS.V14_MIGRATION_STATE, 'in-progress');

        await expect(new StorageMigration(storage, now).migrateToV14()).resolves.toEqual({
            status: 'started-clean-with-warning',
            warning: 'Não encontramos uma cópia segura. O Radiant iniciou um progresso local novo.',
        });
        expect(storage.values.get(STORAGE_KEYS.APP_SCHEMA_VERSION)).toBe('1.4');
        expect(storage.values.has(STORAGE_KEYS.JOURNEY_PROGRESS)).toBe(false);
        expect(JSON.parse(storage.values.get(STORAGE_KEYS.HEARTS)!)).toMatchObject({ count: 5 });
    });

    it('é idempotente depois que a versão 1.4 foi confirmada', async () => {
        const storage = new MemoryStorage();
        const migration = new StorageMigration(storage, now);
        await migration.migrateToV14();
        storage.operations.length = 0;

        await expect(migration.migrateToV14()).resolves.toEqual({ status: 'unchanged' });
        expect(storage.operations.filter(operation => operation.kind !== 'get')).toEqual([]);
    });

    it('reporta fases sem incluir valores dos stores', async () => {
        const storage = new MemoryStorage();
        seedV131(storage);
        const progress: string[] = [];

        await new StorageMigration(storage, now).migrateToV14(step => progress.push(step));

        expect(progress).toEqual(['preparing-backup', 'organizing-progress', 'complete']);
        expect(progress.join(' ')).not.toContain('120');
    });
});
