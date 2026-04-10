import { z } from 'zod';

export const lessonProgressSchema = z.object({
    lessonId: z.string().min(1),
    totalQuestions: z.number().int().nonnegative(),
    correctAnswers: z.number().int().nonnegative(),
    answeredAtIso: z.iso.datetime(),
});

export const reviewCardSchema = z.object({
    lessonId: z.string().min(1),
    easeFactor: z.number(),
    intervalDays: z.number().int().nonnegative(),
    repetitions: z.number().int().nonnegative(),
    nextReviewAtIso: z.iso.datetime(),
    lastReviewedAtIso: z.iso.datetime(),
    createdAtIso: z.iso.datetime(),
});

export type LessonProgressPayload = z.infer<typeof lessonProgressSchema>;
export type ReviewCardPayload = z.infer<typeof reviewCardSchema>;
