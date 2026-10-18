import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import { ItemReviewRepository } from './ItemReviewRepository';
import { buildStore, median, time } from './itemReviewBenchFixtures';
import { STORAGE_KEYS } from '../../../constants/storageKeys';

// FILA 61, passo 1: mede no aparelho (ou no emulador) o que o bench do R6 só
// mediu no Node. Duas perguntas:
//   1. até que tamanho um valor único do AsyncStorage volta numa leitura. No
//      Android, a leitura passa pelo Cursor do SQLite
//      (`AsyncStorageModule.java`, `cursor.getString(0)`), e uma linha maior que
//      a CursorWindow não volta;
//   2. quanto custa ler o store de revisão com 1.000 e 5.000 cartões, montado
//      pelo mesmo gerador do R6.
//
// Só roda em desenvolvimento e com `EXPO_PUBLIC_RADIANT_STORE_BENCH=1` no
// Metro: o console de desenvolvimento chama `isStoreBenchEnabled()` ao montar.
// Usa chaves próprias, com prefixo, e as apaga no fim: o store do aluno não é
// lido nem escrito. O resultado sai no log, uma linha por medida, porque o
// logcat corta linhas longas.

export const STORE_BENCH_LOG_TAG = '[radiant-store-bench]';
export const STORE_BENCH_KEY_PREFIX = '@radiant:bench:';
export const STORE_BENCH_PROBE_SIZES_MIB = [1.0, 1.5, 1.9, 2.0, 2.1, 2.5, 3.0, 4.0];
export const STORE_BENCH_CARD_COUNTS = [1000, 5000];

const MIB = 1024 * 1024;
const PROBE_KEY = `${STORE_BENCH_KEY_PREFIX}probe`;

type BenchStorage = {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
};

type BenchOptions = {
    storage?: BenchStorage;
    probeSizesMiB?: number[];
    cardCounts?: number[];
    repetitions?: number;
    log?: (line: string) => void;
};

export function isStoreBenchEnabled(
    flag: string | undefined = process.env.EXPO_PUBLIC_RADIANT_STORE_BENCH,
    dev: boolean = __DEV__,
): boolean {
    return dev && flag === '1';
}

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

function utf8Bytes(value: string): number {
    return new TextEncoder().encode(value).length;
}

// O repositório lê e escreve as próprias chaves (o store e a quarentena). Este
// adaptador põe o prefixo em todas, para a medição nunca tocar as do aluno.
function prefixed(storage: BenchStorage): BenchStorage {
    return {
        getItem: key => storage.getItem(STORE_BENCH_KEY_PREFIX + key),
        setItem: (key, value) => storage.setItem(STORE_BENCH_KEY_PREFIX + key, value),
        removeItem: key => storage.removeItem(STORE_BENCH_KEY_PREFIX + key),
    };
}

async function probe(storage: BenchStorage, sizeMiB: number) {
    const value = 'a'.repeat(Math.round(sizeMiB * MIB));
    const result: Record<string, unknown> = { kind: 'probe', sizeMiB, bytes: value.length };
    try {
        try {
            await storage.setItem(PROBE_KEY, value);
            result.written = true;
        } catch (error) {
            result.written = false;
            result.writeError = errorMessage(error);
            return result;
        }
        try {
            const start = Date.now();
            const read = await storage.getItem(PROBE_KEY);
            result.readMs = Date.now() - start;
            result.read = read === value;
            if (read !== value) result.readBytes = read === null ? null : read.length;
        } catch (error) {
            result.read = false;
            result.readError = errorMessage(error);
        }
        return result;
    } finally {
        await storage.removeItem(PROBE_KEY).catch(() => undefined);
    }
}

async function measureStore(storage: BenchStorage, cards: number, repetitions: number) {
    const raw = await buildStore(cards);
    const key = STORE_BENCH_KEY_PREFIX + STORAGE_KEYS.ITEM_REVIEW;
    const result: Record<string, unknown> = { kind: 'store', cards, bytes: utf8Bytes(raw) };
    try {
        try {
            await storage.setItem(key, raw);
            result.written = true;
        } catch (error) {
            result.written = false;
            result.writeError = errorMessage(error);
            return result;
        }
        const nativeRead: number[] = [];
        const coldRead: number[] = [];
        for (let round = 0; round < repetitions; round += 1) {
            try {
                let read: string | null = null;
                nativeRead.push(await time(async () => { read = await storage.getItem(key); }));
                result.nativeReadIntact = read === raw;
            } catch (error) {
                result.nativeReadIntact = false;
                result.nativeReadError = errorMessage(error);
            }
            // Mesmo se a leitura nativa falhar, mede o estado explícito do
            // repositório; getCards() mascararia o erro como uma lista vazia.
            // Leitura fria pelo repositório: instância nova, sem o snapshot em cache.
            const reader = new ItemReviewRepository(prefixed(storage));
            let inspected: { readable: boolean; cards: unknown[] } = { readable: false, cards: [] };
            coldRead.push(await time(async () => { inspected = await reader.inspect(); }));
            result.readable = inspected.readable;
            result.cardsRead = inspected.cards.length;
        }
        result.medianMs = { nativeRead: nativeRead.length ? median(nativeRead) : null, coldRead: coldRead.length ? median(coldRead) : null };
        result.samplesMs = { nativeRead, coldRead };
        return result;
    } finally {
        for (const suffix of [STORAGE_KEYS.ITEM_REVIEW, STORAGE_KEYS.ITEM_REVIEW_QUARANTINE]) {
            await storage.removeItem(STORE_BENCH_KEY_PREFIX + suffix).catch(() => undefined);
        }
    }
}

export async function runStoreDeviceBench(options: BenchOptions = {}): Promise<Record<string, unknown>[]> {
    const storage = options.storage ?? AsyncStorage;
    const log = options.log ?? ((line: string) => console.log(line));
    const repetitions = options.repetitions ?? 5;
    const header = { kind: 'header', measuredAt: new Date().toISOString(), platform: Platform.OS, osVersion: Platform.Version, repetitions };
    log(`${STORE_BENCH_LOG_TAG} ${JSON.stringify(header)}`);
    const results: Record<string, unknown>[] = [];
    for (const sizeMiB of options.probeSizesMiB ?? STORE_BENCH_PROBE_SIZES_MIB) {
        const result = await probe(storage, sizeMiB);
        results.push(result);
        log(`${STORE_BENCH_LOG_TAG} ${JSON.stringify(result)}`);
    }
    for (const cards of options.cardCounts ?? STORE_BENCH_CARD_COUNTS) {
        const result = await measureStore(storage, cards, repetitions);
        results.push(result);
        log(`${STORE_BENCH_LOG_TAG} ${JSON.stringify(result)}`);
    }
    log(`${STORE_BENCH_LOG_TAG} ${JSON.stringify({ kind: 'done' })}`);
    return results;
}
