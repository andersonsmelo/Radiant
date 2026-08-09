import { AuthorityStore } from './AuthorityStore';
import { CommitCoordinator, CrashInjectedError, OneShotCrashInjector } from './CommitCoordinator';
import { CheckpointStore } from './CheckpointStore';
import { OutboxStore } from './OutboxStore';
import { MemoryKeyValueStorage } from './storage';
import type { MandatoryStep } from './contracts';
import { FIXED_NOW, lessonIntent, reviewIntent, unitCheckpointIntent } from './testFixtures';

const ALL_STEPS: MandatoryStep[] = ['attempt', 'evidence', 'mastery', 'review', 'xp', 'goal', 'journey'];

function harness(crashPoint?: string) {
    const storage = new MemoryKeyValueStorage();
    const checkpointStore = CheckpointStore.active(storage, () => FIXED_NOW);
    const authorities = Object.fromEntries(ALL_STEPS.map((step) => [step, new AuthorityStore(storage, step, () => FIXED_NOW)])) as Record<MandatoryStep, AuthorityStore>;
    const outbox = new OutboxStore(storage, () => FIXED_NOW);
    return {
        storage,
        checkpointStore,
        authorities,
        outbox,
        coordinator: new CommitCoordinator({ checkpointStore, authorities, outbox, now: () => FIXED_NOW, crashInjector: crashPoint ? new OneShotCrashInjector(crashPoint) : undefined }),
    };
}

describe('CommitCoordinator crash recovery', () => {
    it.each([lessonIntent(), reviewIntent(), unitCheckpointIntent()])('persists operation+intent before effects and completes %s', async (intent) => {
        const { coordinator, checkpointStore } = harness();
        const result = await coordinator.commit(intent);
        expect(result.operation.mandatoryState).toBe('completed');
        expect((await checkpointStore.getJournal(intent.operationId))?.intent).toEqual(intent);
    });

    it('applies zero effects when the initial journal write crashes', async () => {
        const { coordinator, authorities } = harness('before-journal');
        await expect(coordinator.commit(lessonIntent())).rejects.toBeInstanceOf(CrashInjectedError);
        await expect(Promise.all(ALL_STEPS.map((step) => authorities[step].effectCount()))).resolves.toEqual([0, 0, 0, 0, 0, 0, 0]);
    });

    it.each(ALL_STEPS)('recovers a crash before %s without applying that authority twice', async (step) => {
        const first = harness(`before-effect:${step}`);
        await expect(first.coordinator.commit(lessonIntent())).rejects.toBeInstanceOf(CrashInjectedError);
        const relaunched = new CommitCoordinator({ checkpointStore: first.checkpointStore, authorities: first.authorities, outbox: first.outbox, now: () => FIXED_NOW });
        expect((await relaunched.reconcile('operation-1')).operation.mandatoryState).toBe('completed');
        await expect(Promise.all(ALL_STEPS.map((authorityStep) => first.authorities[authorityStep].effectCount()))).resolves.toEqual([1, 1, 1, 1, 1, 1, 1]);
    });

    it.each(ALL_STEPS)('recovers a crash after %s effect+receipt but before the saga marker', async (step) => {
        const first = harness(`after-effect:${step}`);
        await expect(first.coordinator.commit(lessonIntent())).rejects.toBeInstanceOf(CrashInjectedError);
        const countBeforeRelaunch = await first.authorities[step].effectCount();
        const relaunched = new CommitCoordinator({ checkpointStore: first.checkpointStore, authorities: first.authorities, outbox: first.outbox, now: () => FIXED_NOW });
        await relaunched.reconcile('operation-1');
        expect(await first.authorities[step].effectCount()).toBe(countBeforeRelaunch);
    });

    it.each([
        [lessonIntent(), 'competency-review-updated'],
        [reviewIntent(), 'spaced-repetition-updated'],
        [unitCheckpointIntent(), 'competency-review-updated'],
    ] as const)('persists the branch-specific review receipt for %s', async (intent, effectKind) => {
        const first = harness('after-effect:review');
        await expect(first.coordinator.commit(intent)).rejects.toBeInstanceOf(CrashInjectedError);
        const relaunched = new CommitCoordinator({ checkpointStore: first.checkpointStore, authorities: first.authorities, outbox: first.outbox, now: () => FIXED_NOW });
        await relaunched.reconcile(intent.operationId);
        expect(await first.authorities.review.effectKinds()).toEqual([effectKind]);
    });

    it.each(['before-enqueue', 'after-enqueue'])('keeps mandatory completion independent from %s crash', async (point) => {
        const first = harness(point);
        await expect(first.coordinator.commit(lessonIntent())).rejects.toBeInstanceOf(CrashInjectedError);
        const relaunched = new CommitCoordinator({ checkpointStore: first.checkpointStore, authorities: first.authorities, outbox: first.outbox, now: () => FIXED_NOW });
        const result = await relaunched.reconcile('operation-1');
        expect(result.operation.mandatoryState).toBe('completed');
        expect(result.operation.auxiliaryDeliveryState).toBe('pending-delivery');
        expect(await first.outbox.list()).toHaveLength(1);
    });

    it('keeps study completion after enqueue failure and clears the auxiliary failure on reconciliation', async () => {
        const first = harness();
        const enqueue = jest.fn().mockRejectedValueOnce(new Error('outbox-offline'));
        const failingOutbox = { enqueue } as unknown as OutboxStore;
        const coordinator = new CommitCoordinator({ checkpointStore: first.checkpointStore, authorities: first.authorities, outbox: failingOutbox, now: () => FIXED_NOW });
        await expect(coordinator.commit(lessonIntent())).resolves.toMatchObject({
            operation: { mandatoryState: 'completed', lastFailureCode: 'outbox-enqueue-failed' },
        });
        const relaunched = new CommitCoordinator({ checkpointStore: first.checkpointStore, authorities: first.authorities, outbox: first.outbox, now: () => FIXED_NOW });
        await expect(relaunched.reconcile('operation-1')).resolves.toMatchObject({
            operation: { mandatoryState: 'completed', lastFailureCode: null },
        });
        expect(await first.outbox.list()).toHaveLength(1);
    });

    it('pauses durably on the twentieth automatic failure and explicit retry opens a new epoch', async () => {
        const first = harness();
        first.authorities.attempt.failNext(20);
        for (let index = 0; index < 20; index += 1) {
            await first.coordinator.commit(lessonIntent()).catch(() => undefined);
        }
        const paused = await first.checkpointStore.getJournal('operation-1');
        expect(paused?.operation).toMatchObject({ mandatoryState: 'paused-retry-limit', automaticRetryCount: 20, nextMandatoryStep: 'attempt' });
        first.authorities.attempt.failNext(0);
        const result = await first.coordinator.retryExplicit('operation-1');
        expect(result.operation).toMatchObject({ mandatoryState: 'completed', automaticRetryCount: 0, retryEpoch: 1 });
    });
});
