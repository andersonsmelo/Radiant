/**
 * src/features/onboarding/onboarding.types.ts
 */

export interface OnboardingState {
    /** Timestamp of the very first app launch (or null if not started) */
    startedAt: number | null;

    /** Whether the user dismissed the Day 0 intro card */
    dismissedIntro: boolean;

    /** Timestamp when the user completed their first quiz */
    firstQuizAt: number | null;

    /** Timestamp when the user completed their first review */
    firstReviewAt: number | null;

    /** Whether the user has seen the "Closure" banner on Day 7 */
    completed: boolean;
}

export type OnboardingStage =
    | 'intro'         // Day 0 (Fresh)
    | 'quiz_guided'   // Day 1-2 (Building habit)
    | 'review_guided' // Day 3-4 (Introducing review)
    | 'habit_forming' // Day 5-6 (Reinforcing)
    | 'closure'       // Day 7 (Graduation)
    | 'graduated';    // Completed
