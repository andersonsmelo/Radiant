export type TelemetryEventName =
    | 'app_open'
    | 'bootstrap_complete'
    | 'bootstrap_failed'
    | 'screen_view'
    | 'learn_start'
    | 'learn_complete'
    | 'lesson_started'
    | 'lesson_completed'
    | 'lesson_rated'
    | 'quiz_completed'
    | 'review_start'
    | 'review_item'
    | 'review_complete'
    | 'review_completed'
    | 'xp_awarded'
    | 'error_boundary'
    | 'auth_bootstrap'
    | 'auth_refresh_failed'
    | 'auth_login_attempt'
    | 'auth_login_success'
    | 'auth_login_failure'
    | 'auth_register_success'
    | 'auth_register_failure'
    | 'auth_local_state_migrated'
    | 'auth_password_reset_requested'
    | 'auth_password_reset_request_failed'
    | 'auth_password_reset_confirmed'
    | 'auth_password_reset_confirm_failed'
    | 'auth_session_refreshed'
    | 'auth_logout'
    | 'catalog_bootstrap'
    | 'catalog_refresh'
    | 'catalog_remote_success'
    | 'catalog_remote_fallback'
    | 'journey_track_selected'
    | 'sync_queue_enqueued'
    | 'sync_flush_started'
    | 'sync_flush_completed'
    | 'sync_flush_succeeded'
    | 'sync_flush_failed'
    | 'sync_flush_skipped'
    | 'sync_item_failed'
    | 'paywall_view'
    | 'paywall_cta_tap'
    | 'paywall_outcome'
    | 'first_value_moment_reached'
    | 'rating_prompt_eligible'
    | 'rating_prompt_shown'
    | 'rating_prompt_deferred'
    | 'rating_prompt_blocked'
    | 'session_quality'
    | 'onboarding_start'
    | 'onboarding_dismissed_intro'
    | 'onboarding_first_quiz'
    | 'onboarding_first_review'
    | 'onboarding_complete'
    | 'first_run_started'
    | 'first_run_step_viewed'
    | 'first_run_skipped'
    | 'first_run_completed'
    | 'push_optin_shown'
    | 'push_optin_accepted'
    | 'push_optin_declined'
    | 'push_permission_granted'
    | 'push_permission_denied'
    | 'push_would_send_review'
    | 'push_would_send_goal'
    | 'push_scheduled_review'
    | 'push_scheduled_goal'
    | 'push_cancel_all'
    | 'push_ignored'
    | 'push_backoff_level_light'
    | 'push_backoff_level_strong'
    | 'push_backoff_level_silent'
    | 'push_backoff_reset'
    | 'push_backoff_blocked';

export interface TelemetryEvent {
    id: string;
    ts: number;
    name: TelemetryEventName;
    props?: Record<string, unknown>;
}

export interface DailyMetric {
    date: string; // YYYY-MM-DD
    eventCounts: Record<string, number>;
    totals: {
        xpQuiz: number;
        xpReview: number;
        reviewItemsAnswered: number;
        reviewDurationMs: number;
        quizDurationMs: number;
        errors: number;
    };
}

export interface CohortData {
    installDate: string; // YYYY-MM-DD
    retention: {
        d1: boolean;
        d3: boolean;
        d7: boolean;
    };
}

export interface DayActivity {
    date: string; // YYYY-MM-DD
    opened: boolean;
    reviewed: boolean;
    goalMet: boolean;
}

export interface TelemetryStore {
    events: TelemetryEvent[];
    dailyHelpers: Record<string, DailyMetric>; // Keyed by YYYY-MM-DD
    cohort: CohortData;
    days: Record<string, DayActivity>; // Keyed by YYYY-MM-DD
}

export interface ProductAnalyticsAdapter {
    track(event: TelemetryEvent): Promise<void> | void;
    identify?(userId: string, traits?: Record<string, unknown>): Promise<void> | void;
    reset?(userId?: string): Promise<void> | void;
}

export interface CrashReportingAdapter {
    capture(error: unknown, context?: Record<string, unknown>): Promise<void> | void;
    setUserId?(userId: string | null): Promise<void> | void;
    addBreadcrumb?(message: string, data?: Record<string, unknown>): Promise<void> | void;
}
