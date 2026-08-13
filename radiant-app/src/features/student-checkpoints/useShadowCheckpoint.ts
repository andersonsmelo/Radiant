import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { AppConfig } from '../../config';
import { resolveStudentCheckpointRuntimeMode } from './mode';
import {
    getNativeShadowCheckpointObserver,
    type ShadowCheckpointBinding,
    type ShadowCheckpointHandle,
} from './ShadowCheckpointObserver';

export { STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION } from './ScreenCheckpointAdapters';

export type ShadowCheckpointHookBinding = ShadowCheckpointBinding & { enabled?: boolean };

export function useShadowCheckpoint(binding: ShadowCheckpointHookBinding): void {
    const mode = resolveStudentCheckpointRuntimeMode(
        AppConfig.APP_ENV,
        process.env.EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE,
    );
    const enabled = mode === 'shadow' && binding.enabled !== false;
    const observerRef = useRef<ReturnType<typeof getNativeShadowCheckpointObserver> | null>(null);
    const handleRef = useRef<ShadowCheckpointHandle | null>(null);
    const startPromiseRef = useRef<Promise<ShadowCheckpointHandle | null> | null>(null);
    const compatibleCursorKey = binding.compatibleCursorIds.join('|');

    useEffect(() => {
        if (!enabled) return;

        const observer = getNativeShadowCheckpointObserver(mode);
        observerRef.current = observer;
        let disposed = false;
        let observedAppState = AppState.currentState;

        const start = async () => {
            const result = await observer.start(binding);
            const handle = result.handle;
            if (disposed && handle) {
                await observer.leave(handle);
                return null;
            }
            handleRef.current = handle;
            return handle;
        };

        startPromiseRef.current = start();
        const subscription = AppState.addEventListener('change', (nextState) => {
            observedAppState = nextState;
            if (nextState === 'active') {
                if (!handleRef.current) startPromiseRef.current = start();
                return;
            }
            const pending = startPromiseRef.current;
            if (!pending) return;
            void pending.then(async (handle) => {
                if (!handle) return;
                await observer.background(handle);
                if (handleRef.current?.checkpointId === handle.checkpointId) handleRef.current = null;
                if (!disposed && observedAppState === 'active') startPromiseRef.current = start();
            });
        });

        return () => {
            disposed = true;
            subscription.remove();
            const pending = startPromiseRef.current;
            startPromiseRef.current = null;
            if (pending) void pending.then((handle) => handle ? observer.leave(handle) : undefined);
        };
        // The identity fields deliberately exclude progress: progress is an
        // update to the current shadow session, not a new navigation.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        binding.surface,
        binding.flowId,
        binding.contentVersion,
        compatibleCursorKey,
        enabled,
        mode,
    ]);

    useEffect(() => {
        if (!enabled) return;
        const observer = observerRef.current;
        const pending = startPromiseRef.current;
        if (!observer || !pending) return;
        void pending.then((handle) => handle
            ? observer.progress(handle, {
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
}
