import { AppConfig } from '../../config';
import { readBooleanFlag } from '../../config/contracts';
import { resolveStudentCheckpointRuntimeMode } from './mode';

export const CHECKPOINT_PERFORMANCE_PREFIX = 'RADIANT_CHECKPOINT_PERF ';

export const CHECKPOINT_PERFORMANCE_METRICS = [
    'persistence',
    'restoration',
] as const;

export type CheckpointPerformanceMetric = (typeof CHECKPOINT_PERFORMANCE_METRICS)[number];
export type CheckpointPerformanceMode = 'off' | 'active';

type ProbeDependencies = {
    enabled: boolean;
    mode: CheckpointPerformanceMode;
    clock: () => number;
    emit: (line: string) => void;
};

function roundedDuration(start: number, end: number): number | null {
    const duration = end - start;
    if (!Number.isFinite(duration) || duration < 0) return null;
    return Math.round(duration * 10) / 10;
}

export class CheckpointPerformanceProbe {
    constructor(private readonly dependencies: ProbeDependencies) {}

    async measure<T>(metric: CheckpointPerformanceMetric, task: () => Promise<T>): Promise<T> {
        if (!this.dependencies.enabled) return task();
        const startedAt = this.dependencies.clock();
        try {
            return await task();
        } finally {
            this.record(metric, startedAt);
        }
    }

    private record(metric: CheckpointPerformanceMetric, startedAt: number): number | null {
        const durationMs = roundedDuration(startedAt, this.dependencies.clock());
        if (durationMs === null) return null;
        const envelope = {
            schemaVersion: 1,
            metric,
            mode: this.dependencies.mode,
            durationMs,
        } as const;
        try {
            this.dependencies.emit(`${CHECKPOINT_PERFORMANCE_PREFIX}${JSON.stringify(envelope)}`);
        } catch {
            // Diagnostics must never interfere with the learning path.
        }
        return durationMs;
    }
}

const runtimeMode = resolveStudentCheckpointRuntimeMode(
    AppConfig.APP_ENV,
    process.env.EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE,
);
const probeMode: CheckpointPerformanceMode = runtimeMode === 'active' ? 'active' : 'off';
const probeEnabled = AppConfig.APP_ENV === 'development'
    && runtimeMode === 'active'
    && readBooleanFlag(process.env.EXPO_PUBLIC_STUDENT_CHECKPOINT_PERFORMANCE, false);

export const checkpointPerformanceProbe = new CheckpointPerformanceProbe({
    enabled: probeEnabled,
    mode: probeMode,
    clock: () => globalThis.performance?.now?.() ?? Date.now(),
    emit: (line) => console.info(line),
});
