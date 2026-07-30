/**
 * LearningAttemptsRepository
 *
 * Persiste a tentativa de cada conclusão de bloco. É a fonte que faltava para o
 * `LearningStatsService`: até 2026-07-30 o serviço existia, tinha teste e nenhum
 * consumidor, porque nada no app gravava `LearningAttempt` — a única
 * implementação de `getAttempts` vivia dentro do próprio teste dele.
 *
 * Toda escrita é best-effort: acurácia é informação secundária e nunca pode
 * derrubar a conclusão de uma lição. Mesma postura do `LessonOutcomeService`.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import type { LearningAttempt } from './LearningStatsService';

const SCHEMA_VERSION = 'learning-attempts.v1';

/**
 * Teto de tentativas guardadas. O `LearningStatsService` só agrega — precisão
 * total, precisão dos últimos 7 dias e domínio por tópico — então histórico
 * antigo além disso não muda nenhuma das saídas de forma perceptível, e um
 * array sem limite em AsyncStorage cresce para sempre num app local-first.
 */
export const LEARNING_ATTEMPTS_CAP = 500;

type LearningAttemptsStore = {
    schemaVersion: typeof SCHEMA_VERSION;
    attempts: LearningAttempt[];
};

function isValidAttempt(value: unknown): value is LearningAttempt {
    if (typeof value !== 'object' || value === null) return false;
    const entry = value as Record<string, unknown>;

    return (
        typeof entry.lessonId === 'string' &&
        typeof entry.topicId === 'string' &&
        typeof entry.correctAnswers === 'number' &&
        typeof entry.totalQuestions === 'number' &&
        typeof entry.completedAt === 'string'
    );
}

class LearningAttemptsRepositoryImpl {
    async getAll(): Promise<LearningAttempt[]> {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEYS.LEARNING_ATTEMPTS);
            if (!raw) return [];

            const parsed: unknown = JSON.parse(raw);
            if (typeof parsed !== 'object' || parsed === null) return [];

            const attempts = (parsed as Record<string, unknown>).attempts;
            if (!Array.isArray(attempts)) return [];

            return attempts.filter(isValidAttempt);
        } catch (error) {
            console.error('[LearningAttemptsRepository] Falha ao ler tentativas:', error);
            return [];
        }
    }

    async append(attempt: LearningAttempt): Promise<void> {
        try {
            const attempts = [...(await this.getAll()), attempt];
            const store: LearningAttemptsStore = {
                schemaVersion: SCHEMA_VERSION,
                attempts: attempts.slice(-LEARNING_ATTEMPTS_CAP),
            };

            await AsyncStorage.setItem(STORAGE_KEYS.LEARNING_ATTEMPTS, JSON.stringify(store));
        } catch (error) {
            console.error('[LearningAttemptsRepository] Falha ao gravar tentativa:', error);
        }
    }

    async clear(): Promise<void> {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.LEARNING_ATTEMPTS);
        } catch (error) {
            console.error('[LearningAttemptsRepository] Falha ao limpar tentativas:', error);
        }
    }
}

export const LearningAttemptsRepository = new LearningAttemptsRepositoryImpl();
