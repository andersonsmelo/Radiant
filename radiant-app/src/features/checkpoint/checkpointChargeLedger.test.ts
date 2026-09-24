import { STORAGE_KEYS } from '../../constants/storageKeys';
import { CheckpointChargeLedger, type CheckpointChargeStorage } from './checkpointChargeLedger';

// O módulo importa o AsyncStorage nativo para o registro padrão; aqui cada
// teste injeta o seu armazenamento em memória.
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { getItem: jest.fn(), setItem: jest.fn() },
}));

function memoryStorage(initial: Record<string, string> = {}): CheckpointChargeStorage & { values: Record<string, string> } {
  const values = { ...initial };
  return {
    values,
    async getItem(key: string) {
      return values[key] ?? null;
    },
    async setItem(key: string, value: string) {
      values[key] = value;
    },
  };
}

describe('CheckpointChargeLedger', () => {
  it('cobra cada pergunta uma vez por nó, e o mesmo id em outro nó é outra cobrança', async () => {
    const ledger = new CheckpointChargeLedger(memoryStorage());

    expect(await ledger.claim('node:a', 'item-1')).toBe(true);
    expect(await ledger.claim('node:a', 'item-1')).toBe(false);
    expect(await ledger.claim('node:b', 'item-1')).toBe(true);
  });

  it('grava só os ids das perguntas cobradas, por nó, e nada mais', async () => {
    const storage = memoryStorage();
    const ledger = new CheckpointChargeLedger(storage);

    await ledger.claim('node:a', 'item-1');
    await ledger.claim('node:a', 'item-2');

    expect(JSON.parse(storage.values[STORAGE_KEYS.CHECKPOINT_CHARGED_ITEMS])).toEqual({
      'node:a': ['item-1', 'item-2'],
    });
  });

  it('apagar a tentativa de um nó não mexe na de outro', async () => {
    const ledger = new CheckpointChargeLedger(memoryStorage());
    await ledger.claim('node:a', 'item-1');
    await ledger.claim('node:b', 'item-1');

    await ledger.clear('node:a');

    expect(await ledger.claim('node:a', 'item-1')).toBe(true);
    expect(await ledger.claim('node:b', 'item-1')).toBe(false);
  });

  it('duas reservas simultâneas da mesma pergunta cobram uma vez só', async () => {
    const ledger = new CheckpointChargeLedger(memoryStorage());

    const results = await Promise.all([
      ledger.claim('node:a', 'item-1'),
      ledger.claim('node:a', 'item-1'),
    ]);

    expect(results.filter(Boolean)).toHaveLength(1);
  });

  it('registro corrompido vale como tentativa sem cobranças, sem lançar', async () => {
    const ledger = new CheckpointChargeLedger(memoryStorage({
      [STORAGE_KEYS.CHECKPOINT_CHARGED_ITEMS]: '{não é json',
    }));

    expect(await ledger.claim('node:a', 'item-1')).toBe(true);
  });
});
