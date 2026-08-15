/**
 * LessonRatingService
 *
 * Persiste a avaliação (1 a 5) que o estudante dá a uma lição na tela de
 * conclusão. Escrita best-effort: avaliar nunca pode derrubar a conclusão
 * da lição em volta. Mesma postura do `LearningAttemptsRepository`.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { TelemetryService } from '../../telemetry/TelemetryService';

const MIN_RATING = 1;
const MAX_RATING = 5;

type RatingMap = Record<string, number>;

async function readAll(): Promise<RatingMap> {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.LESSON_RATINGS);
        if (!raw) { return {}; }
        const parsed: unknown = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) { return {}; }
        return parsed as RatingMap;
    } catch {
        return {};
    }
}

class LessonRatingServiceImpl {
    async getRating(lessonId: string): Promise<number | null> {
        const all = await readAll();
        const value = all[lessonId];
        return typeof value === 'number' ? value : null;
    }

    /**
     * Uma lição é avaliada uma vez. Repetir a lição não pede nota de novo, e não
     * existe desfazer pela interface — decisão registrada na spec.
     * Escrita best-effort: avaliar nunca pode derrubar a conclusão da lição.
     */
    async rate(lessonId: string, rating: number): Promise<void> {
        if (!Number.isInteger(rating) || rating < MIN_RATING || rating > MAX_RATING) { return; }
        const all = await readAll();
        if (typeof all[lessonId] === 'number') { return; }
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.LESSON_RATINGS, JSON.stringify({ ...all, [lessonId]: rating }));
            await TelemetryService.track('lesson_rated', { lessonId, rating });
        } catch (error) {
            console.error('[LessonRatingService] Falha ao registrar avaliação:', error);
        }
    }
}

export const LessonRatingService = new LessonRatingServiceImpl();
