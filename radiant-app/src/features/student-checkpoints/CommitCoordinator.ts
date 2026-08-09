import type { CommitIntentV1, CommitJournalEntryV1, CommitOperationV1, EffectKind, MandatoryStep } from './contracts';
import { stableStringify, validateCommitIntent } from './schemas';
import type { AuthorityStore } from './AuthorityStore';
import type { CheckpointStore } from './CheckpointStore';
import type { OutboxStore } from './OutboxStore';

export class CrashInjectedError extends Error {
    constructor(readonly point: string) {
        super(`crash-injected:${point}`);
        this.name = 'CrashInjectedError';
    }
}

export interface CrashInjector {
    hit(point: string): void;
}

export class OneShotCrashInjector implements CrashInjector {
    private consumed = false;

    constructor(private readonly target: string) {}

    hit(point: string): void {
        if (!this.consumed && point === this.target) {
            this.consumed = true;
            throw new CrashInjectedError(point);
        }
    }
}

export type CommitResult = { operation: CommitOperationV1 };

type CommitCoordinatorDependencies = {
    checkpointStore: CheckpointStore;
    authorities: Record<MandatoryStep, AuthorityStore>;
    outbox: OutboxStore;
    now: () => string;
    crashInjector?: CrashInjector;
};

const EFFECT_KIND_BY_STEP: Record<MandatoryStep, EffectKind> = {
    attempt: 'learning-attempt-recorded',
    evidence: 'learning-evidence-recorded',
    mastery: 'competency-mastery-recomputed',
    review: 'spaced-repetition-updated',
    xp: 'xp-awarded',
    goal: 'daily-goal-updated',
    journey: 'journey-node-completed',
};

function effectKindForStep(step: MandatoryStep, intent: CommitIntentV1): EffectKind {
    if (step !== 'review') return EFFECT_KIND_BY_STEP[step];
    return intent.intentKind === 'review-completion'
        ? 'spaced-repetition-updated'
        : 'competency-review-updated';
}

function payloadHash(value: unknown): string {
    const serialized = stableStringify(value);
    let hash = 2166136261;
    for (let index = 0; index < serialized.length; index += 1) {
        hash ^= serialized.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, '0').repeat(8);
}

export class CommitCoordinator {
    private readonly checkpointStore: CheckpointStore;
    private readonly authorities: Record<MandatoryStep, AuthorityStore>;
    private readonly outbox: OutboxStore;
    private readonly now: () => string;
    private readonly crashInjector?: CrashInjector;

    constructor(dependencies: CommitCoordinatorDependencies) {
        this.checkpointStore = dependencies.checkpointStore;
        this.authorities = dependencies.authorities;
        this.outbox = dependencies.outbox;
        this.now = dependencies.now;
        this.crashInjector = dependencies.crashInjector;
    }

    async commit(intent: CommitIntentV1): Promise<CommitResult> {
        const validated = validateCommitIntent(intent);
        if (!validated.ok) throw new Error(validated.reasonCode);
        const existing = await this.checkpointStore.getJournal(intent.operationId);
        if (existing) {
            if (stableStringify(existing.intent) !== stableStringify(intent)) throw new Error('idempotency-payload-mismatch');
            return this.reconcile(intent.operationId);
        }
        this.crashInjector?.hit('before-journal');
        await this.checkpointStore.createJournal(intent);
        return this.reconcile(intent.operationId);
    }

    async reconcile(operationId: string): Promise<CommitResult> {
        let journal = await this.requireJournal(operationId);
        if (journal.operation.mandatoryState === 'paused-retry-limit') return { operation: journal.operation };

        while (journal.operation.nextMandatoryStep !== null) {
            const step = journal.operation.nextMandatoryStep;
            journal = await this.markInProgress(journal, step);
            try {
                this.crashInjector?.hit(`before-effect:${step}`);
                const effectKind = effectKindForStep(step, journal.intent);
                await this.authorities[step].apply({
                    operationId: journal.operation.operationId,
                    effectKind,
                    effectRecordId: `${journal.operation.operationId}:${effectKind}`,
                    payloadHash: payloadHash({ step, intent: journal.intent }),
                });
                this.crashInjector?.hit(`after-effect:${step}`);
                journal = await this.markStepCompleted(journal, step);
            } catch (error) {
                if (error instanceof CrashInjectedError) throw error;
                journal = await this.markAutomaticFailure(journal);
                throw error;
            }
        }

        if (journal.operation.mandatoryState !== 'completed') {
            journal = {
                ...journal,
                operation: {
                    ...journal.operation,
                    mandatoryState: 'completed',
                    nextMandatoryStep: null,
                    lastFailureCode: null,
                    updatedAt: this.now(),
                },
            };
            await this.checkpointStore.saveJournal(journal);
        }

        if (journal.intent.plannedSyncEvents.length > 0) {
            for (const planned of journal.intent.plannedSyncEvents) {
                try {
                    this.crashInjector?.hit('before-enqueue');
                    await this.outbox.enqueue(planned);
                    this.crashInjector?.hit('after-enqueue');
                } catch (error) {
                    if (error instanceof CrashInjectedError) throw error;
                    const withAuxiliaryFailure: CommitJournalEntryV1 = {
                        ...journal,
                        operation: {
                            ...journal.operation,
                            lastFailureCode: 'outbox-enqueue-failed',
                            updatedAt: this.now(),
                        },
                    };
                    await this.checkpointStore.saveJournal(withAuxiliaryFailure);
                    return { operation: withAuxiliaryFailure.operation };
                }
            }
            if (journal.operation.lastFailureCode === 'outbox-enqueue-failed') {
                journal = {
                    ...journal,
                    operation: {
                        ...journal.operation,
                        lastFailureCode: null,
                        updatedAt: this.now(),
                    },
                };
                await this.checkpointStore.saveJournal(journal);
            }
        }
        return { operation: journal.operation };
    }

    async retryExplicit(operationId: string): Promise<CommitResult> {
        let journal = await this.requireJournal(operationId);
        if (journal.operation.mandatoryState !== 'paused-retry-limit') return this.reconcile(operationId);
        journal = {
            ...journal,
            operation: {
                ...journal.operation,
                mandatoryState: 'in-progress',
                automaticRetryCount: 0,
                retryEpoch: journal.operation.retryEpoch + 1,
                lastFailureCode: null,
                updatedAt: this.now(),
            },
        };
        await this.checkpointStore.saveJournal(journal);
        return this.reconcile(operationId);
    }

    private async requireJournal(operationId: string): Promise<CommitJournalEntryV1> {
        const journal = await this.checkpointStore.getJournal(operationId);
        if (!journal) throw new Error('commit-journal-not-found');
        return journal;
    }

    private async markInProgress(journal: CommitJournalEntryV1, step: MandatoryStep): Promise<CommitJournalEntryV1> {
        const next: CommitJournalEntryV1 = {
            ...journal,
            operation: {
                ...journal.operation,
                mandatoryState: 'in-progress',
                nextMandatoryStep: step,
                updatedAt: this.now(),
            },
        };
        await this.checkpointStore.saveJournal(next);
        return next;
    }

    private async markStepCompleted(journal: CommitJournalEntryV1, step: MandatoryStep): Promise<CommitJournalEntryV1> {
        const completedMandatorySteps = journal.operation.completedMandatorySteps.includes(step)
            ? journal.operation.completedMandatorySteps
            : [...journal.operation.completedMandatorySteps, step];
        const nextMandatoryStep = journal.operation.requiredMandatorySteps[completedMandatorySteps.length] ?? null;
        const next: CommitJournalEntryV1 = {
            ...journal,
            operation: {
                ...journal.operation,
                completedMandatorySteps,
                nextMandatoryStep,
                mandatoryState: nextMandatoryStep === null ? 'completed' : 'in-progress',
                automaticRetryCount: 0,
                lastFailureCode: null,
                updatedAt: this.now(),
            },
        };
        await this.checkpointStore.saveJournal(next);
        return next;
    }

    private async markAutomaticFailure(journal: CommitJournalEntryV1): Promise<CommitJournalEntryV1> {
        const automaticRetryCount = Math.min(20, journal.operation.automaticRetryCount + 1);
        const next: CommitJournalEntryV1 = {
            ...journal,
            operation: {
                ...journal.operation,
                automaticRetryCount,
                mandatoryState: automaticRetryCount >= 20 ? 'paused-retry-limit' : 'in-progress',
                lastFailureCode: 'dependency-unavailable',
                updatedAt: this.now(),
            },
        };
        await this.checkpointStore.saveJournal(next);
        return next;
    }
}
