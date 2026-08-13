import type { StudentCheckpointMode } from './contracts';

export function resolveStudentCheckpointMode(value: unknown): StudentCheckpointMode {
    return value === 'shadow' || value === 'active' || value === 'off' ? value : 'off';
}

export function resolveStudentCheckpointRuntimeMode(
    environment: 'development' | 'preview' | 'production',
    configuredMode?: unknown,
): StudentCheckpointMode {
    if (environment === 'production') return 'off';
    if (configuredMode !== undefined) {
        if (environment === 'preview' && configuredMode === 'shadow') return 'shadow';
        if (environment === 'development' && configuredMode === 'active') return 'active';
        return 'off';
    }
    return environment === 'preview' ? 'shadow' : 'off';
}
