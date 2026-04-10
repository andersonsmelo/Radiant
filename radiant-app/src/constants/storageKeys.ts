/**
 * Centralized AsyncStorage keys for cross-feature runtime state.
 *
 * Feature-specific constants can continue to live near their domains, but
 * journey rollout state is coordinated here because it participates in
 * migration and schema-version checks.
 */
export const STORAGE_KEYS = {
    JOURNEY_PROGRESS: '@radiant:journey_progress_v1',
    AUTH_MIGRATION_STATE: '@radiant:auth_migration_v1',
    UPGRADE_INTEREST: '@radiant:upgrade_interest_v1',
} as const;
