jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

import {
    isStoreBenchEnabled,
    runStoreDeviceBench,
    STORE_BENCH_KEY_PREFIX,
} from './ItemReviewRepository.deviceBench';
import { STORAGE_KEYS } from '../../../constants/storageKeys';

function memoryStorage(failReadAbove = Infinity) {
    const data = new Map<string, string>();
    const touched = new Set<string>();
    return {
        data,
        touched,
        getItem: async (key: string) => {
            touched.add(key);
            const value = data.get(key) ?? null;
            // Imita a CursorWindow do Android: a linha grande demais não volta.
            if (value !== null && value.length > failReadAbove) {
                throw new Error('Row too big to fit into CursorWindow');
            }
            return value;
        },
        setItem: async (key: string, value: string) => { touched.add(key); data.set(key, value); },
        removeItem: async (key: string) => { touched.add(key); data.delete(key); },
    };
}

const quiet = () => undefined;

describe('isStoreBenchEnabled', () => {
    it('só liga em desenvolvimento e com a variável', () => {
        expect(isStoreBenchEnabled(undefined, true)).toBe(false);
        expect(isStoreBenchEnabled('0', true)).toBe(false);
        expect(isStoreBenchEnabled('1', false)).toBe(false);
        expect(isStoreBenchEnabled('1', true)).toBe(true);
    });
});

describe('runStoreDeviceBench', () => {
    it('lê o valor e o store inteiros, e não deixa chave nenhuma para trás', async () => {
        const storage = memoryStorage();
        const results = await runStoreDeviceBench({
            storage, probeSizesMiB: [0.01], cardCounts: [40], sessionCardCounts: [], repetitions: 2, log: quiet,
        });

        expect(results[0]).toMatchObject({ kind: 'probe', written: true, read: true });
        expect(results[1]).toMatchObject({
            kind: 'store', cards: 40, written: true, nativeReadIntact: true, readable: true, cardsRead: 40,
        });
        expect(storage.data.size).toBe(0);
    });

    it('nunca toca as chaves do aluno', async () => {
        const storage = memoryStorage();
        await runStoreDeviceBench({ storage, probeSizesMiB: [0.01], cardCounts: [10], sessionCardCounts: [12], repetitions: 1, log: quiet });

        expect([...storage.touched].filter(key => !key.startsWith(STORE_BENCH_KEY_PREFIX))).toEqual([]);
        expect(storage.touched.has(STORAGE_KEYS.ITEM_REVIEW)).toBe(false);
    });

    it('registra a falha de leitura com a mensagem, em vez de um store vazio', async () => {
        const storage = memoryStorage(1024);
        const results = await runStoreDeviceBench({
            storage, probeSizesMiB: [0.0005, 0.01], cardCounts: [10], sessionCardCounts: [], repetitions: 1, log: quiet,
        });

        expect(results[0]).toMatchObject({ kind: 'probe', read: true });
        expect(results[1]).toMatchObject({
            kind: 'probe', written: true, read: false, readError: 'Row too big to fit into CursorWindow',
        });
        expect(results[2]).toMatchObject({
            kind: 'store', written: true, nativeReadIntact: false,
            nativeReadError: 'Row too big to fit into CursorWindow', readable: false, cardsRead: 0,
        });
        expect(storage.data.size).toBe(0);
    });

    it('mede abrir e confirmar a revisão pelo coordenador real, com p50 e p95', async () => {
        const storage = memoryStorage();
        const results = await runStoreDeviceBench({
            storage, probeSizesMiB: [], cardCounts: [], sessionCardCounts: [60], repetitions: 4, log: quiet,
        });
        const session = results.find(result => result.kind === 'session') as Record<string, any>;

        // 60 cartões vencidos, e a sessão para no teto de 50.
        expect(session).toMatchObject({ kind: 'session', cards: 60, written: true, queueLength: 50, confirmAccepted: 4 });
        for (const measure of ['openCold', 'openWarm', 'confirm']) {
            expect(session.samplesMs[measure]).toHaveLength(4);
            expect(session.p50Ms[measure]).toEqual(expect.any(Number));
            expect(session.p95Ms[measure]).toBeGreaterThanOrEqual(session.p50Ms[measure]);
        }
        expect(storage.data.size).toBe(0);
    });

    it('para a sessão e registra o erro quando o store não pode ser lido', async () => {
        const storage = memoryStorage(1024);
        const results = await runStoreDeviceBench({
            storage, probeSizesMiB: [], cardCounts: [], sessionCardCounts: [10], repetitions: 2, log: quiet,
        });

        expect(results[0]).toMatchObject({ kind: 'session', cards: 10, written: true, openError: 'review-store-unavailable' });
        expect(storage.data.size).toBe(0);
    });

    it('escreve uma linha de log por medida, com a etiqueta', async () => {
        const lines: string[] = [];
        await runStoreDeviceBench({
            storage: memoryStorage(), probeSizesMiB: [0.01], cardCounts: [10], sessionCardCounts: [10], repetitions: 1, log: line => lines.push(line),
        });

        expect(lines.map(line => JSON.parse(line.replace('[radiant-store-bench] ', '')).kind))
            .toEqual(['header', 'probe', 'store', 'session', 'done']);
    });
});
