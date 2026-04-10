import AsyncStorage from '@react-native-async-storage/async-storage';

export async function readJsonStorage<T>(key: string, fallbackValue: T): Promise<T> {
    try {
        const raw = await AsyncStorage.getItem(key);
        if (!raw) {
            return fallbackValue;
        }

        return JSON.parse(raw) as T;
    } catch (error) {
        console.error(`[storage] Failed to read key "${key}":`, error);
        return fallbackValue;
    }
}

export async function writeJsonStorage(key: string, value: unknown): Promise<void> {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`[storage] Failed to write key "${key}":`, error);
        throw error;
    }
}

export async function removeStorageKey(key: string): Promise<void> {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error(`[storage] Failed to remove key "${key}":`, error);
        throw error;
    }
}
