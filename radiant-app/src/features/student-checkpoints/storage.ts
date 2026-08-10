export interface KeyValueStorage {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
}

async function nativeStorage(): Promise<KeyValueStorage> {
    // Lazy loading keeps the deterministic in-memory adapter independent from
    // React Native's NativeModule during pure Jest runs.
    //
    // **A preguiça é obrigatória, e isso foi medido em 2026-08-10.** Trocada por
    // `import AsyncStorage from ...` no topo do módulo, **seis suítes do kernel
    // deixam de carregar** com `[@RNC/AsyncStorage]: NativeModule: AsyncStorage is
    // null` — o preset `jest-expo` **não** mocka esse módulo. Que outros vinte
    // serviços o importem estaticamente não contradiz nada: as suítes deles
    // declaram o mock; as daqui dependem do adaptador em memória, que existe para
    // não precisar dele.
    //
    // **E a preguiça tem um preço, também medido.** No Dev Client o Metro do Expo
    // serve `import()` como chunk assíncrono buscado por HTTP, e cada contexto JS
    // novo paga essa busca na PRIMEIRA operação de storage: a primeira operação do
    // kernel na partida custou **~240 ms**, e a seguinte, no mesmo lançamento,
    // 13–21 ms — assinatura de resolução de módulo, não de I/O. Como `inspectLaunch`
    // em `off` retorna antes de tocar o store, o baseline nunca paga, e a diferença
    // apareceu no gate como se fosse custo do kernel. **Se esse custo existe fora do
    // Dev Client é pergunta aberta**; otimizar antes de responder seria otimizar um
    // artefato de instrumento. Não mexa aqui sem medir num build sem Dev Client.
    return (await import('@react-native-async-storage/async-storage')).default as KeyValueStorage;
}

export const asyncStorageKeyValueStorage: KeyValueStorage = {
    getItem: async (key) => (await nativeStorage()).getItem(key),
    setItem: async (key, value) => (await nativeStorage()).setItem(key, value),
    removeItem: async (key) => (await nativeStorage()).removeItem(key),
};

export class MemoryKeyValueStorage implements KeyValueStorage {
    private readonly values = new Map<string, string>();
    readCount = 0;
    writeCount = 0;

    constructor(initial: Record<string, string> = {}) {
        Object.entries(initial).forEach(([key, value]) => this.values.set(key, value));
    }

    async getItem(key: string): Promise<string | null> {
        this.readCount += 1;
        return this.values.get(key) ?? null;
    }

    async setItem(key: string, value: string): Promise<void> {
        this.writeCount += 1;
        this.values.set(key, value);
    }

    async removeItem(key: string): Promise<void> {
        this.writeCount += 1;
        this.values.delete(key);
    }

    snapshot(): Record<string, string> {
        return Object.fromEntries([...this.values.entries()].sort(([left], [right]) => left.localeCompare(right)));
    }
}
