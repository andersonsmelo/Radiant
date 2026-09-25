import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';

export type CheckpointChargeStorage = Pick<typeof AsyncStorage, 'getItem' | 'setItem'>;

/**
 * Por nó de checkpoint, os ids das perguntas já cobradas na tentativa aberta.
 *
 * ADR 2026-09-24, decisão 2: numa mesma tentativa, cada pergunta custa no
 * máximo uma vida, mesmo que o aluno saia e volte. Por isso o registro vive no
 * armazenamento, e não num `Set` da tela, que se perdia a cada remontagem.
 * Guarda-se só o id da pergunta, nunca a alternativa escolhida: o contrato de
 * não persistir respostas continua valendo.
 */
type ChargedItemsByNode = Record<string, string[]>;

function parse(raw: string | null): ChargedItemsByNode {
  if (raw === null) return {};
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return {};
    const result: ChargedItemsByNode = {};
    for (const [nodeId, itemIds] of Object.entries(value)) {
      if (Array.isArray(itemIds) && itemIds.every((itemId) => typeof itemId === 'string')) {
        result[nodeId] = itemIds;
      }
    }
    return result;
  } catch {
    return {};
  }
}

export class CheckpointChargeLedger {
  private queue: Promise<unknown> = Promise.resolve();

  constructor(private readonly storage: CheckpointChargeStorage = AsyncStorage) {}

  /**
   * Reserva a cobrança da pergunta nesta tentativa. Devolve `true` só na
   * primeira vez, quando a vida deve ser cobrada.
   */
  claim(nodeId: string, itemId: string): Promise<boolean> {
    return this.exclusively(async () => {
      const charged = await this.read();
      const itemIds = charged[nodeId] ?? [];
      if (itemIds.includes(itemId)) return false;
      charged[nodeId] = [...itemIds, itemId];
      await this.write(charged);
      return true;
    });
  }

  /** Encerra a tentativa do nó: o envio, aprovado ou não, apaga a lista. */
  clear(nodeId: string): Promise<void> {
    return this.exclusively(async () => {
      const charged = await this.read();
      if (!(nodeId in charged)) return;
      delete charged[nodeId];
      await this.write(charged);
    });
  }

  private async read(): Promise<ChargedItemsByNode> {
    return parse(await this.storage.getItem(STORAGE_KEYS.CHECKPOINT_CHARGED_ITEMS));
  }

  private async write(charged: ChargedItemsByNode): Promise<void> {
    await this.storage.setItem(STORAGE_KEYS.CHECKPOINT_CHARGED_ITEMS, JSON.stringify(charged));
  }

  private exclusively<T>(work: () => Promise<T>): Promise<T> {
    const operation = this.queue.then(work);
    this.queue = operation.then(() => undefined, () => undefined);
    return operation;
  }
}

export const checkpointChargeLedger = new CheckpointChargeLedger();
