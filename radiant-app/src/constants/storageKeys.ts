/**
 * Centralized AsyncStorage keys for cross-feature runtime state.
 *
 * Feature-specific constants can continue to live near their domains, but
 * journey rollout state is coordinated here because it participates in
 * migration and schema-version checks.
 */
export const STORAGE_KEYS = {
    JOURNEY_PROGRESS: '@radiant:journey_progress_v1',
    CURRICULUM_RUNTIME: '@radiant:curriculum_runtime_v1',
    LEGACY_CURRICULUM_SNAPSHOT: '@radiant:legacy_curriculum_snapshot_v1',
    V3_JOURNEY_PROGRESS: '@radiant:v3:journey_progress_v1',
    V3_LEARNING_ATTEMPTS: '@radiant:v3:learning_attempts_v1',
    V3_LEARNING_EVIDENCE: '@radiant:v3:learning_evidence_v1',
    V3_COMPETENCY_MASTERY: '@radiant:v3:competency_mastery_v1',
    AUTH_MIGRATION_STATE: '@radiant:auth_migration_v1',
    UPGRADE_INTEREST: '@radiant:upgrade_interest_v1',
    LEARNING_ATTEMPTS: '@radiant:learning_attempts_v1',
    LEARNING_EVIDENCE: '@radiant:learning_evidence_v1',
    COMPETENCY_MASTERY: '@radiant:competency_mastery_v1',
    LESSON_RATINGS: '@radiant:lesson_ratings_v1',
    HEARTS: '@radiant:hearts_v1',
    SUBSCRIPTION: '@radiant:subscription_v1',
    PROGRESS_BACKUP: '@radiant:progress_backup_v1',
    FIRST_RUN: '@radiant/first_run_v1',
    LEGACY_GAMIFICATION: 'radiant:gami:v1',
    DAILY_GOAL: 'radiant:daily-goal:v1',
    SPACED_REPETITION_SCHEDULE: '@radiant:sr_schedule_v1',
    APP_SCHEMA_VERSION: '@radiant:app_schema_version',
    V14_MIGRATION_BACKUP: '@radiant:migration_v14_backup',
    V14_MIGRATION_STATE: '@radiant:migration_v14_state',
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
