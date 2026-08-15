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
    LEARNING_ATTEMPTS: '@radiant:learning_attempts_v1',
    LEARNING_EVIDENCE: '@radiant:learning_evidence_v1',
    COMPETENCY_MASTERY: '@radiant:competency_mastery_v1',
    LESSON_RATINGS: '@radiant:lesson_ratings_v1',
} as const;

export const STUDENT_CHECKPOINT_STORAGE_KEYS = {
    ACTIVE: '@radiant:student_checkpoints_active_v1',
    SHADOW: '@radiant:student_checkpoints_shadow_v1',
    ACTIVE_QUARANTINE: '@radiant:student_checkpoints_active_quarantine_v1',
    SHADOW_QUARANTINE: '@radiant:student_checkpoints_shadow_quarantine_v1',
    OUTBOX: '@radiant:student_checkpoint_outbox_v1',
    OUTBOX_QUARANTINE: '@radiant:student_checkpoint_outbox_quarantine_v1',
    AUTHORITY_PREFIX: '@radiant:student_checkpoint_authority_v1:',
    AUTHORITY_QUARANTINE_PREFIX: '@radiant:student_checkpoint_authority_quarantine_v1:',
} as const;
