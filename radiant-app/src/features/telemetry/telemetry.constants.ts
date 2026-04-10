export const TELEMETRY_CONSTANTS = {
    STORAGE_KEYS: {
        EVENTS: 'telemetry.events.v1',
        DAILY_STATS: 'telemetry.daily.v1',
        COHORTS: 'telemetry.cohorts.v1',
        DAYS: 'telemetry.days.v1',
    },
    LIMITS: {
        MAX_EVENTS: 2000,
        MAX_DAYS_HISTORY: 30,
    },
    DEFAULT_TIMER_MS: 0,
};

export const TelemetryEvents = {
    APP_OPEN: 'app_open',
    BOOTSTRAP_COMPLETE: 'bootstrap_complete',
    BOOTSTRAP_FAILED: 'bootstrap_failed',
    AUTH_LOGIN_SUCCESS: 'auth_login_success',
    AUTH_REFRESH_FAILED: 'auth_refresh_failed',
    LESSON_STARTED: 'lesson_started',
    LESSON_COMPLETED: 'lesson_completed',
    QUIZ_COMPLETED: 'quiz_completed',
    REVIEW_COMPLETED: 'review_completed',
    FIRST_VALUE_MOMENT_REACHED: 'first_value_moment_reached',
    RATING_PROMPT_ELIGIBLE: 'rating_prompt_eligible',
    RATING_PROMPT_SHOWN: 'rating_prompt_shown',
    RATING_PROMPT_DEFERRED: 'rating_prompt_deferred',
    RATING_PROMPT_BLOCKED: 'rating_prompt_blocked',
    PAYWALL_OUTCOME: 'paywall_outcome',
    SESSION_QUALITY: 'session_quality',
    SYNC_FLUSH_SUCCEEDED: 'sync_flush_succeeded',
    SYNC_FLUSH_FAILED: 'sync_flush_failed',
} as const;

export const TelemetryPropKeys = {
    LOCALE: 'locale',
    MARKET: 'market',
    EXPERIMENT_ID: 'experiment_id',
    ENTRY_SURFACE: 'entry_surface',
    BUILD_CHANNEL: 'build_channel',
} as const;
