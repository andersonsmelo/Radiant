import { STORAGE_KEYS } from '../../constants/storageKeys';
import type { LearningActivityV2 } from '../../types/learningActivity';
import type { KeyValueStorage } from './storage';
import { UnitCheckpointService, type UnitCheckpointEvaluation, type UnitCheckpointEvaluationInput } from './UnitCheckpointService';
import { validateCommitIntent } from './schemas';

type AttemptRecord = {
    evaluation: UnitCheckpointEvaluation;
    requiredActivityIds: string[];
    completedActivityIds: string[];
};
type Store = { schemaVersion: 1; attempts: AttemptRecord[] };

/**
 * V2 operational gate, independent of the optional checkpoint kernel: replay
 * every approved activity covering weak competencies after each failure.
 * The kernel plan's requiredActivities describes its richer curriculum; a V2
 * replay does not claim new modalities or a new checkpoint variant were taught.
 * The prior links preserve cycle history, not editorial approval of new content.
 */
export class AssessmentAttemptRepository {
    private pending: Promise<unknown> = Promise.resolve();

    constructor(private readonly storage: KeyValueStorage) {}

    private serialize<T>(operation: () => Promise<T>): Promise<T> {
        const result = this.pending.then(operation);
        this.pending = result.catch(() => undefined);
        return result;
    }

    private async load(): Promise<Store> {
        const raw = await this.storage.getItem(STORAGE_KEYS.ASSESSMENT_ATTEMPTS);
        if (raw === null) return { schemaVersion: 1, attempts: [] };
        const store = JSON.parse(raw) as Store;
        if (store?.schemaVersion !== 1 || !Array.isArray(store.attempts)
            || !store.attempts.every(record => record?.evaluation?.attempt
                && validateCommitIntent(record.evaluation.intent).ok
                && record.evaluation.attempt.attemptId === record.evaluation.intent.attemptId
                && record.evaluation.attempt.passed === record.evaluation.intent.passed
                && Array.isArray(record.requiredActivityIds)
                && record.requiredActivityIds.every(id => typeof id === 'string')
                && Array.isArray(record.completedActivityIds)
                && record.completedActivityIds.every(id => record.requiredActivityIds.includes(id)))) {
            throw new Error('assessment-history-invalid');
        }
        return store;
    }

    private latest(store: Store, nodeId: string): AttemptRecord | undefined {
        return store.attempts.filter(record => record.evaluation.attempt.journeyNodeId === nodeId).at(-1);
    }

    private complete(record: AttemptRecord): boolean {
        return record.requiredActivityIds.length > 0
            && record.requiredActivityIds.every(id => record.completedActivityIds.includes(id));
    }

    getState(nodeId: string) {
        return this.serialize(async () => {
            const record = this.latest(await this.load(), nodeId);
            const blocked = Boolean(record && !record.evaluation.attempt.passed
                && (record.evaluation.attempt.resultingSupportState === 'support-required' || !this.complete(record)));
            return {
                evaluation: record?.evaluation ?? null,
                blocked,
                remainingActivityIds: record?.requiredActivityIds.filter(id => !record.completedActivityIds.includes(id)) ?? [],
            };
        });
    }

    submit(input: UnitCheckpointEvaluationInput, activities: readonly LearningActivityV2[]) {
        return this.serialize(async () => {
            const store = await this.load();
            const existing = store.attempts.find(record => record.evaluation.attempt.attemptId === input.attemptId);
            if (existing) return existing.evaluation;
            const previous = this.latest(store, input.journeyNodeId);
            if (previous && previous.evaluation.attempt.contentVersion !== input.contentVersion) {
                throw new Error('assessment-content-version-mismatch');
            }
            if (previous && !previous.evaluation.attempt.passed
                && (!this.complete(previous) || previous.evaluation.attempt.resultingSupportState === 'support-required')) {
                throw new Error('reinforcement-required');
            }
            const evaluation = UnitCheckpointService.evaluate({
                ...input,
                prior: previous && !previous.evaluation.attempt.passed ? {
                    attempt: previous.evaluation.attempt,
                    completedReinforcementPlan: previous.evaluation.reinforcementPlan,
                } : undefined,
            });
            if (!validateCommitIntent(evaluation.intent).ok) {
                throw new Error('assessment-attempt-invalid');
            }
            const requiredActivityIds = evaluation.attempt.passed ? [] : activities
                .filter(activity => activity.provenance.contentVersion === input.contentVersion
                    && activity.competencyIds.some(id => evaluation.attempt.weakCompetencyIds.includes(id)))
                .map(activity => activity.id);
            store.attempts.push({ evaluation, requiredActivityIds, completedActivityIds: [] });
            await this.storage.setItem(STORAGE_KEYS.ASSESSMENT_ATTEMPTS, JSON.stringify(store));
            return evaluation;
        });
    }

    completeActivity(activity: LearningActivityV2, confirmedAnswers: Record<string, boolean>): Promise<void> {
        return this.serialize(async () => {
            const interactions = activity.steps.filter(step => step.kind === 'interaction');
            if (interactions.length === 0 || interactions.some(step => step.kind === 'interaction'
                && typeof confirmedAnswers[step.interaction.id] !== 'boolean')) return;
            const store = await this.load();
            let changed = false;
            const nodes = new Set(store.attempts.map(record => record.evaluation.attempt.journeyNodeId));
            for (const nodeId of nodes) {
                const record = this.latest(store, nodeId)!;
                if (!record.evaluation.attempt.passed
                    && record.evaluation.attempt.contentVersion === activity.provenance.contentVersion
                    && record.requiredActivityIds.includes(activity.id)
                    && !record.completedActivityIds.includes(activity.id)) {
                    record.completedActivityIds.push(activity.id);
                    changed = true;
                }
            }
            if (changed) await this.storage.setItem(STORAGE_KEYS.ASSESSMENT_ATTEMPTS, JSON.stringify(store));
        });
    }
}

function nativeStorage(): KeyValueStorage {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Resolve the native module only when this adapter is used.
    const module = require('@react-native-async-storage/async-storage');
    return (module.default ?? module) as KeyValueStorage;
}

export const assessmentAttemptRepository = new AssessmentAttemptRepository({
    getItem: key => nativeStorage().getItem(key),
    setItem: (key, value) => nativeStorage().setItem(key, value),
    removeItem: key => nativeStorage().removeItem(key),
});
