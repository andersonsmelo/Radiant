export interface KeyValueStorage {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
}

async function nativeStorage(): Promise<KeyValueStorage> {
    // Lazy loading keeps the deterministic in-memory adapter independent from
    // React Native's NativeModule during pure Jest runs.
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
