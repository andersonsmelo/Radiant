import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CompetencyMastery } from '../../../types/mastery';
import { CompetencyMasteryRepository } from './CompetencyMasteryRepository';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

const storage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const COMPETENCY = 'competency:protecao-radiologica:tempo-distancia-e-blindagem';

function mastery(overrides: Partial<CompetencyMastery> = {}): CompetencyMastery {
    return {
        competencyId: COMPETENCY,
        state: 'retained',
        score: 0.75,
        evidenceCount: 3,
        blockedBy: [],
        evaluatedAt: '2026-08-02T12:00:00.000Z',
        ...overrides,
    };
}

beforeEach(() => {
    jest.clearAllMocks();
    storage.getItem.mockResolvedValue(null);
    storage.setItem.mockResolvedValue(undefined);
});

describe('CompetencyMasteryRepository — migração vazia', () => {
    it('devolve not-started para quem nunca teve domínio gravado', async () => {
        const atual = await CompetencyMasteryRepository.get(COMPETENCY);

        expect(atual.state).toBe('not-started');
        expect(atual.score).toBe(0);
        expect(atual.evidenceCount).toBe(0);
        expect(atual.competencyId).toBe(COMPETENCY);
    });

    it('não infere domínio de nenhuma outra fonte — lê só a própria chave', async () => {
        await CompetencyMasteryRepository.get(COMPETENCY);

        expect(storage.getItem).toHaveBeenCalledTimes(1);
        expect(storage.getItem).toHaveBeenCalledWith(expect.stringContaining('competency_mastery'));
    });

    it('devolve mapa vazio quando não há nada gravado', async () => {
        await expect(CompetencyMasteryRepository.getAll()).resolves.toEqual({});
    });
});

describe('CompetencyMasteryRepository — persistência', () => {
    it('grava em chave versionada, indexado por competência', async () => {
        await CompetencyMasteryRepository.save(mastery());

        const [key, raw] = storage.setItem.mock.calls[0];
        expect(key).toContain('competency_mastery');

        const store = JSON.parse(raw);
        expect(store.schemaVersion).toBe('competency-mastery.v1');
        expect(store.mastery[COMPETENCY].state).toBe('retained');
    });

    it('substitui o domínio anterior da mesma competência em vez de acumular', async () => {
        storage.getItem.mockResolvedValue(JSON.stringify({
            schemaVersion: 'competency-mastery.v1',
            mastery: { [COMPETENCY]: mastery({ state: 'practicing', score: 0.45 }) },
        }));

        await CompetencyMasteryRepository.save(mastery({ state: 'mastered', score: 1 }));

        const store = JSON.parse(storage.setItem.mock.calls[0][1]);
        expect(Object.keys(store.mastery)).toHaveLength(1);
        expect(store.mastery[COMPETENCY].state).toBe('mastered');
    });

    it('preserva o domínio das outras competências ao gravar uma', async () => {
        const outra = 'competency:parametros-e-qualidade:contraste-resolucao-ruido-artefato';
        storage.getItem.mockResolvedValue(JSON.stringify({
            schemaVersion: 'competency-mastery.v1',
            mastery: { [outra]: mastery({ competencyId: outra, state: 'introduced' }) },
        }));

        await CompetencyMasteryRepository.save(mastery());

        const store = JSON.parse(storage.setItem.mock.calls[0][1]);
        expect(Object.keys(store.mastery).sort()).toEqual([outra, COMPETENCY].sort());
    });

    it('descarta registro corrompido na leitura em vez de propagar', async () => {
        storage.getItem.mockResolvedValue(JSON.stringify({
            schemaVersion: 'competency-mastery.v1',
            mastery: {
                [COMPETENCY]: mastery(),
                'competency:quebrada': { state: 'inventado' },
            },
        }));

        const todos = await CompetencyMasteryRepository.getAll();

        expect(Object.keys(todos)).toEqual([COMPETENCY]);
    });

    it('não lança quando o storage falha na leitura nem na escrita', async () => {
        storage.getItem.mockRejectedValue(new Error('storage indisponível'));
        await expect(CompetencyMasteryRepository.getAll()).resolves.toEqual({});

        storage.getItem.mockResolvedValue(null);
        storage.setItem.mockRejectedValue(new Error('disco cheio'));
        await expect(CompetencyMasteryRepository.save(mastery())).resolves.toBeUndefined();
    });
});
