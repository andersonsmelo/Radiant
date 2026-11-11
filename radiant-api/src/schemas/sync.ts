import { z } from 'zod';

export const lessonProgressSchema = z.object({
    lessonId: z.string().min(1),
    totalQuestions: z.number().int().nonnegative(),
    correctAnswers: z.number().int().nonnegative(),
    answeredAtIso: z.iso.datetime(),
}).refine((progress) => progress.correctAnswers <= progress.totalQuestions, {
    message: 'correctAnswers cannot exceed totalQuestions',
});

export const reviewCardSchema = z.object({
    lessonId: z.string().min(1),
    // Cabe em `numeric(4,2)`; o SM-2 do app fica entre 1,3 e poucas unidades.
    easeFactor: z.number().min(1).max(10),
    intervalDays: z.number().int().nonnegative().max(36_500),
    repetitions: z.number().int().nonnegative(),
    nextReviewAtIso: z.iso.datetime(),
    lastReviewedAtIso: z.iso.datetime(),
    createdAtIso: z.iso.datetime(),
});

export type LessonProgressPayload = z.infer<typeof lessonProgressSchema>;
export type ReviewCardPayload = z.infer<typeof reviewCardSchema>;
