import { resolveLessonStars, type LessonStars } from '../../quiz/services/resolveLessonStars';
import { LearningAttemptsRepository } from '../../progress/services/LearningAttemptsRepository';

class JourneyStarsServiceImpl {
    /**
     * O recorde de estrelas de cada aula entre todas as tentativas guardadas.
     * Aula sem tentativa não tem chave: a trilha a mostra em ouro, sem estrelas,
     * e nunca com zero estrelas cinzas.
     */
    async getRecordStarsByLessonId(): Promise<Record<string, LessonStars>> {
        const attempts = await LearningAttemptsRepository.getAll();
        const records: Record<string, LessonStars> = {};

        for (const attempt of attempts) {
            const stars = resolveLessonStars(attempt.correctAnswers, attempt.totalQuestions);
            const previous = records[attempt.lessonId];
            if (previous === undefined || stars > previous) {
                records[attempt.lessonId] = stars;
            }
        }

        return records;
    }
}

export const JourneyStarsService = new JourneyStarsServiceImpl();
