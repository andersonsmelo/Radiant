/**
 * Inventário de toda chave que o app grava no AsyncStorage (G7, FILA 54).
 *
 * Existe para que backup, reinstalação, reset e schema futuro se discutam
 * sobre uma lista conhecida, e não sobre o que cada sessão lembra. A guarda
 * `storageInventory.test.ts` lê a AST de `src/` e reprova quando o app passa
 * a gravar uma chave que não está aqui, ou quando uma chave daqui deixa de
 * existir no código. O comportamento de cada classe está na evidência
 * `docs/evidence/2026-10-19-fila54-g4-android-g7.md`.
 *
 * Classes:
 * - `aprendizagem`: o histórico que o aluno construiu (jornada, tentativas,
 *   evidências, revisão, domínio, checkpoints). Perder isto é perder estudo;
 * - `economia`: XP, sequência, meta diária, vidas e o espelho local da
 *   assinatura;
 * - `quarentena`: registros inválidos separados para não derrubar o store
 *   principal;
 * - `controle`: migrações, marcos de primeira execução e convites. Perder isto
 *   repete uma tela ou uma migração, sem perder estudo;
 * - `sessao`: a sessão de conta local;
 * - `preferencia`: escolhas do aluno sobre som, avisos e notificações;
 * - `telemetria`: contadores e eventos locais;
 * - `legado`: chaves de versões antigas, lidas só para migrar ou limpar.
 */
export type StorageClass =
    | 'aprendizagem'
    | 'economia'
    | 'quarentena'
    | 'controle'
    | 'sessao'
    | 'preferencia'
    | 'telemetria'
    | 'legado';

export interface StorageInventoryEntry {
    /** A chave, ou o começo dela quando `match` é `prefix`. */
    key: string;
    /** `prefix`: a chave é este texto seguido de um identificador. */
    match: 'exact' | 'prefix';
    classe: StorageClass;
}

const exact = (key: string, classe: StorageClass): StorageInventoryEntry => ({ key, match: 'exact', classe });
const prefix = (key: string, classe: StorageClass): StorageInventoryEntry => ({ key, match: 'prefix', classe });

export const STORAGE_INVENTORY: readonly StorageInventoryEntry[] = [
    exact('@radiant:journey_progress_v1', 'aprendizagem'),
    exact('@radiant:curriculum_runtime_v1', 'aprendizagem'),
    exact('@radiant:v3:journey_progress_v1', 'aprendizagem'),
    exact('@radiant:v3:learning_attempts_v1', 'aprendizagem'),
    exact('@radiant:v3:learning_evidence_v1', 'aprendizagem'),
    exact('@radiant:v3:competency_mastery_v1', 'aprendizagem'),
    exact('@radiant:learning_attempts_v1', 'aprendizagem'),
    exact('@radiant:learning_evidence_v1', 'aprendizagem'),
    exact('@radiant:item_review_v1', 'aprendizagem'),
    exact('@radiant:competency_mastery_v1', 'aprendizagem'),
    exact('@radiant:competency_review_v1', 'aprendizagem'),
    exact('@radiant:assessment_attempts_v1', 'aprendizagem'),
    exact('@radiant:student_checkpoints_active_v1', 'aprendizagem'),
    exact('@radiant:student_checkpoints_shadow_v1', 'aprendizagem'),
    exact('@radiant:student_checkpoint_outbox_v1', 'aprendizagem'),
    prefix('@radiant:student_checkpoint_authority_v1:', 'aprendizagem'),
    exact('@radiant:sr_schedule_v1', 'aprendizagem'),

    exact('radiant:gami:v1', 'economia'),
    exact('radiant:daily-goal:v1', 'economia'),
    exact('@radiant:hearts_v1', 'economia'),
    exact('@radiant:checkpoint_charged_items_v1', 'economia'),
    exact('@radiant:subscription_v1', 'economia'),

    exact('@radiant:item_review_quarantine_v1', 'quarentena'),
    exact('@radiant:competency_review_v1:quarantine', 'quarentena'),
    exact('@radiant:student_checkpoints_active_quarantine_v1', 'quarentena'),
    exact('@radiant:student_checkpoints_shadow_quarantine_v1', 'quarentena'),
    exact('@radiant:student_checkpoint_outbox_quarantine_v1', 'quarentena'),
    prefix('@radiant:student_checkpoint_authority_quarantine_v1:', 'quarentena'),

    exact('@radiant:app_schema_version', 'controle'),
    exact('@radiant:migration_v14_backup', 'controle'),
    exact('@radiant:migration_v14_state', 'controle'),
    exact('@radiant:legacy_curriculum_snapshot_v1', 'controle'),
    exact('@radiant:auth_migration_v1', 'controle'),
    exact('@radiant:progress_backup_v1', 'controle'),
    exact('@radiant:sync_queue_v1', 'controle'),
    exact('@radiant/first_run_v1', 'controle'),
    exact('@radiant/onboarding', 'controle'),
    exact('@radiant:rating_prompt_v1', 'controle'),
    exact('@radiant:paywall_v1', 'controle'),
    exact('@radiant:upgrade_interest_v1', 'controle'),
    exact('@radiant/beta_access', 'controle'),
    exact('@radiant/beta_feedback', 'controle'),
    exact('push.lastSent.v1', 'controle'),
    exact('push.lastScheduled.v1', 'controle'),
    exact('push.debug.lastDecision.v1', 'controle'),
    exact('push.ignoredCount.v1', 'controle'),
    exact('push.backoffLevel.v1', 'controle'),
    exact('push.nextAllowedAt.v1', 'controle'),
    prefix('pixel-mood:last:', 'controle'),

    exact('@radiant:auth_session_v1', 'sessao'),

    exact('@radiant:feedback_preferences_v1', 'preferencia'),
    exact('@radiant:lesson_ratings_v1', 'preferencia'),
    exact('push.optin.v1', 'preferencia'),
    exact('push.permission.v1', 'preferencia'),

    exact('telemetry.events.v1', 'telemetria'),
    exact('telemetry.daily.v1', 'telemetria'),
    exact('telemetry.cohorts.v1', 'telemetria'),
    exact('telemetry.days.v1', 'telemetria'),
    exact('heuristics.alerts.v1', 'telemetria'),
    exact('heuristics.shown.v1', 'telemetria'),
    exact('health.score.v1', 'telemetria'),
    exact('@radiant:v3:hybrid_lesson_metrics_v1', 'telemetria'),

    exact('@radiant:sr_history_v1', 'legado'),
    exact('@radiant:quiz_progress', 'legado'),
    exact('@radiant:quiz_results', 'legado'),
];
