export const HEURISTICS_CONSTANTS = {
    STORAGE_KEYS: {
        ALERTS: 'heuristics.alerts.v1',
        SHOWN: 'heuristics.shown.v1',
    },
    THRESHOLDS: {
        H1_REVIEW_AVOIDANCE: 0.30,
        H2_LONG_REVIEW_MS: 180000,
        H3_HABIT_BREAK_HOURS: 48,
        H4_GOAL_IGNORED: 0.40,
        H5_FLOW_RATIO_MIN: 0.5,
        H5_FLOW_RATIO_MAX: 1.5,
        H5_GOAL_CONSISTENCY: 0.60
    },
    HISTORY_DAYS: 7,
    SHADOW_MODE: true,
};
