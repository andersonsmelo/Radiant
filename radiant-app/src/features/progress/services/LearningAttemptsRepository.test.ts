import AsyncStorage from '@react-native-async-storage/async-storage';
import { LearningAttemptsRepository, LEARNING_ATTEMPTS_CAP } from './LearningAttemptsRepository';
import { STORAGE_KEYS } from '../../../constants/storageKeys';

jest.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
    },
}));

const mockedStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

function attempt(overrides: Partial<Parameters<typeof LearningAttemptsRepository.append>[0]> = {}) {
    return {
        lessonId: 'lesson-1',
        topicId: 'unit-1',
        correctAnswers: 1,
        totalQuestions: 1,
        completedAt: '2026-07-30T12:00:00.000Z',
        ...overrides,
    };
}

describe('LearningAttemptsRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedStorage.getItem.mockResolvedValue(null);
        mockedStorage.setItem.mockResolvedValue(undefined);
    });

    it('devolve lista vazia quando nunca gravou', async () => {
        expect(await LearningAttemptsRepository.getAll()).toEqual([]);
    });

    it('grava a primeira tentativa', async () => {
        await LearningAttemptsRepository.append(attempt());

        const [key, payload] = mockedStorage.setItem.mock.calls[0];
        expect(key).toBe(STORAGE_KEYS.LEARNING_ATTEMPTS);
        expect(JSON.parse(payload)).toEqual({
            schemaVersion: 'learning-attempts.v1',
            attempts: [attempt()],
        });
    });

    it('acrescenta preservando as tentativas anteriores', async () => {
        mockedStorage.getItem.mockResolvedValue(
            JSON.stringify({ schemaVersion: 'learning-attempts.v1', attempts: [attempt()] })
        );

        await LearningAttemptsRepository.append(attempt({ lessonId: 'lesson-2' }));

        const stored = JSON.parse(mockedStorage.setItem.mock.calls[0][1]);
        expect(stored.attempts.map((entry: { lessonId: string }) => entry.lessonId)).toEqual([
            'lesson-1',
            'lesson-2',
        ]);
    });

    it('mantém apenas as últimas tentativas quando passa do teto', async () => {
        const existing = Array.from({ length: LEARNING_ATTEMPTS_CAP }, (_, index) =>
            attempt({ lessonId: `lesson-${index}` })
        );
        mockedStorage.getItem.mockResolvedValue(
            JSON.stringify({ schemaVersion: 'learning-attempts.v1', attempts: existing })
        );

        await LearningAttemptsRepository.append(attempt({ lessonId: 'lesson-nova' }));

        const stored = JSON.parse(mockedStorage.setItem.mock.calls[0][1]);
        expect(stored.attempts).toHaveLength(LEARNING_ATTEMPTS_CAP);
        // A mais antiga sai, a nova entra no fim.
        expect(stored.attempts[0].lessonId).toBe('lesson-1');
        expect(stored.attempts[LEARNING_ATTEMPTS_CAP - 1].lessonId).toBe('lesson-nova');
    });

    it('trata payload corrompido como ausência de tentativas, sem lançar', async () => {
        mockedStorage.getItem.mockResolvedValue('{isto não é json');

        expect(await LearningAttemptsRepository.getAll()).toEqual([]);
    });

    it('ignora entradas com formato inválido ao ler', async () => {
        mockedStorage.getItem.mockResolvedValue(
            JSON.stringify({
                schemaVersion: 'learning-attempts.v1',
                attempts: [attempt(), { lessonId: 'sem-o-resto' }, null, 'texto'],
            })
        );

        expect(await LearningAttemptsRepository.getAll()).toEqual([attempt()]);
    });

    it('não propaga falha de escrita para o chamador', async () => {
        mockedStorage.setItem.mockRejectedValue(new Error('disco cheio'));

        await expect(LearningAttemptsRepository.append(attempt())).resolves.toBeUndefined();
    });
});
