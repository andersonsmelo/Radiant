import { STORAGE_KEYS } from '../../constants/storageKeys';
import { HeartsRepository } from './HeartsRepository';

jest.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: {
        getItem: jest.fn(),
        setItem: jest.fn(),
    },
}));

const AGORA = Date.parse('2026-09-14T12:00:00.000Z');

class MemoryStorage {
    readonly values = new Map<string, string>();
    readonly writes: Array<{ key: string; value: string }> = [];

    async getItem(key: string): Promise<string | null> {
        return this.values.get(key) ?? null;
    }

    async setItem(key: string, value: string): Promise<void> {
        this.values.set(key, value);
        this.writes.push({ key, value });
    }
}

describe('HeartsRepository', () => {
    it('cria CHEIA quando não existe estado e persiste somente os três campos', async () => {
        const storage = new MemoryStorage();
        const repository = new HeartsRepository(storage);

        await expect(repository.getSnapshot(AGORA)).resolves.toEqual({
            count: 5,
            status: 'full',
            nextRefillAt: null,
            unlimitedUntil: null,
        });
        expect(storage.writes).toEqual([{
            key: STORAGE_KEYS.HEARTS,
            value: JSON.stringify({ count: 5, lastRefillAt: null, unlimitedUntil: null }),
        }]);
    });

    it('recupera pelo tempo ao ler e grava o estado normalizado', async () => {
        const storage = new MemoryStorage();
        storage.values.set(STORAGE_KEYS.HEARTS, JSON.stringify({
            count: 1,
            lastRefillAt: '2026-09-14T10:50:00.000Z',
            unlimitedUntil: null,
        }));

        await expect(new HeartsRepository(storage).getSnapshot(AGORA)).resolves.toEqual({
            count: 3,
            status: 'recovering',
            nextRefillAt: '2026-09-14T12:20:00.000Z',
            unlimitedUntil: null,
        });
        expect(JSON.parse(storage.writes.at(-1)!.value)).toEqual({
            count: 3,
            lastRefillAt: '2026-09-14T11:50:00.000Z',
            unlimitedUntil: null,
        });
    });

    it('serializa gastos concorrentes sem perder atualização', async () => {
        const storage = new MemoryStorage();
        const repository = new HeartsRepository(storage);

        const [first, second] = await Promise.all([
            repository.spend(AGORA),
            repository.spend(AGORA),
        ]);

        expect(first.count).toBe(4);
        expect(second.count).toBe(3);
        await expect(repository.getSnapshot(AGORA)).resolves.toMatchObject({ count: 3 });
    });

    it('persiste recompensa e direito ilimitado usando o mesmo contrato', async () => {
        const storage = new MemoryStorage();
        const repository = new HeartsRepository(storage);

        await repository.spend(AGORA);
        await expect(repository.rewardReview(AGORA)).resolves.toMatchObject({ count: 5, status: 'full' });
        await expect(repository.setUnlimited('2026-10-14T12:00:00.000Z', AGORA)).resolves.toMatchObject({
            status: 'unlimited',
            unlimitedUntil: '2026-10-14T12:00:00.000Z',
        });
    });

    it('se bytes inválidos escaparem da migração, recupera em CHEIA sem expor o conteúdo', async () => {
        const storage = new MemoryStorage();
        storage.values.set(STORAGE_KEYS.HEARTS, '{ quebrado');

        await expect(new HeartsRepository(storage).getSnapshot(AGORA)).resolves.toMatchObject({
            count: 5,
            status: 'full',
        });
        expect(storage.values.get(STORAGE_KEYS.HEARTS)).toBe(
            JSON.stringify({ count: 5, lastRefillAt: null, unlimitedUntil: null }),
        );
    });
});
