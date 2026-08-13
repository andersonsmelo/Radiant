import { useCallback, useEffect, useMemo, useRef } from 'react';
import { AppConfig } from '../../config';
import {
    getNativeActiveCheckpointRuntime,
    type ActiveCheckpointBinding,
    type ActiveCheckpointStartResult,
} from './ActiveCheckpointRuntime';
import type { CommitIntentV1 } from './contracts';
import { resolveStudentCheckpointRuntimeMode } from './mode';

export type ActiveCheckpointHookBinding = ActiveCheckpointBinding & {
    enabled?: boolean;
    resumeCheckpointId?: string;
    onRestoreFallback?: () => void;
};

export type ActiveCheckpointControl = {
    commit: (createIntent: (checkpointId: string) => CommitIntentV1) => Promise<CommitIntentV1 | null>;
    finish: () => Promise<void>;
};

export function useActiveCheckpoint(binding: ActiveCheckpointHookBinding): ActiveCheckpointControl {
    const mode = resolveStudentCheckpointRuntimeMode(
        AppConfig.APP_ENV,
        process.env.EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE,
    );
    const enabled = mode === 'active' && binding.enabled !== false;
    const runtimeRef = useRef<ReturnType<typeof getNativeActiveCheckpointRuntime> | null>(null);
    const startPromiseRef = useRef<Promise<ActiveCheckpointStartResult> | null>(null);
    const fallbackRef = useRef(binding.onRestoreFallback);
    fallbackRef.current = binding.onRestoreFallback;
    const compatibleCursorKey = binding.compatibleCursorIds.join('|');

    useEffect(() => {
        if (!enabled) return;
        const runtime = getNativeActiveCheckpointRuntime(mode);
        runtimeRef.current = runtime;
        let disposed = false;
        const pending = runtime.start(binding, binding.resumeCheckpointId);
        startPromiseRef.current = pending;
        void pending.then((result) => {
            if (!disposed && result.status === 'fallback') fallbackRef.current?.();
        });
        return () => {
            disposed = true;
        };
        // Progress fields update the current checkpoint and do not restart it.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        binding.surface,
        binding.flowId,
        binding.contentVersion,
        binding.resumeCheckpointId,
        compatibleCursorKey,
        enabled,
        mode,
    ]);

    useEffect(() => {
        if (!enabled) return;
        const runtime = runtimeRef.current;
        const pending = startPromiseRef.current;
        if (!runtime || !pending) return;
        void pending.then((result) => result.handle
            ? runtime.progress(result.handle, {
                cursorId: binding.cursorId,
                progressPercent: binding.progressPercent,
                completedStepCount: binding.completedStepCount,
                totalStepCount: binding.totalStepCount,
            })
            : undefined);
    }, [
        binding.completedStepCount,
        binding.cursorId,
        binding.progressPercent,
        binding.totalStepCount,
        enabled,
    ]);

    const finish = useCallback(async () => {
        const runtime = runtimeRef.current;
        const pending = startPromiseRef.current;
        if (!runtime || !pending) return;
        const result = await pending;
        if (result.handle) await runtime.finish(result.handle);
    }, []);

    const commit = useCallback(async (createIntent: (checkpointId: string) => CommitIntentV1) => {
        const runtime = runtimeRef.current;
        const pending = startPromiseRef.current;
        if (!runtime || !pending) return null;
        const result = await pending;
        if (!result.handle) return null;
        const intent = createIntent(result.handle.checkpointId);
        await runtime.commit(result.handle, intent);
        return intent;
    }, []);

    return useMemo(() => ({ commit, finish }), [commit, finish]);
}
