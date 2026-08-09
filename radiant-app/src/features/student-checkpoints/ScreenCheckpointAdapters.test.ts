import { validateStudentCheckpoint } from './schemas';
import {
    SCREEN_CHECKPOINT_ADAPTERS,
    STUDENT_CHECKPOINT_SURFACES,
    type ScreenCheckpointContext,
} from './ScreenCheckpointAdapters';

const context: ScreenCheckpointContext = {
    checkpointId: 'checkpoint-shadow-1',
    flowId: 'flow-shadow-1',
    contentVersion: 'shadow-v1',
    cursorId: 'cursor-1',
    compatibleCursorIds: ['cursor-1', 'cursor-2'],
    progressPercent: 25,
    completedStepCount: 1,
    totalStepCount: 4,
    createdAt: '2026-08-09T12:00:00.000Z',
    updatedAt: '2026-08-09T12:00:00.000Z',
};

describe('ScreenCheckpointAdapters', () => {
    it('implements every governed surface with a valid closed checkpoint', () => {
        expect(Object.keys(SCREEN_CHECKPOINT_ADAPTERS).sort()).toEqual([...STUDENT_CHECKPOINT_SURFACES].sort());

        for (const surface of STUDENT_CHECKPOINT_SURFACES) {
            const checkpoint = SCREEN_CHECKPOINT_ADAPTERS[surface].create(context);
            expect(checkpoint.surface).toBe(surface);
            expect(validateStudentCheckpoint(checkpoint)).toEqual({ ok: true, value: checkpoint });
        }
    });

    it('reconciles only allowlisted ids and reason codes', () => {
        const adapter = SCREEN_CHECKPOINT_ADAPTERS.lesson;
        const checkpoint = adapter.create(context);

        expect(adapter.reconcile(checkpoint, context)).toEqual({ kind: 'resume', cursorId: 'cursor-1' });
        expect(adapter.reconcile(checkpoint, { ...context, contentVersion: 'shadow-v2' })).toEqual({
            kind: 'fallback',
            nextAction: 'home',
            reasonCode: 'content-version-mismatch',
        });
        expect(adapter.reconcile(checkpoint, { ...context, compatibleCursorIds: ['cursor-2'] })).toEqual({
            kind: 'fallback',
            nextAction: 'home',
            reasonCode: 'cursor-missing',
        });
    });

    it('drops undeclared free-form and identity fields instead of persisting them', () => {
        const checkpoint = SCREEN_CHECKPOINT_ADAPTERS.home.create({
            ...context,
            email: 'never-persist@example.invalid',
            text: 'free form',
            patient: 'forbidden',
        } as ScreenCheckpointContext & Record<string, unknown>);

        expect(checkpoint).not.toHaveProperty('email');
        expect(checkpoint).not.toHaveProperty('text');
        expect(checkpoint).not.toHaveProperty('patient');
        expect(validateStudentCheckpoint(checkpoint).ok).toBe(true);
    });
});
