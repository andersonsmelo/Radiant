import type { StudentCheckpointMode } from './contracts';

export function resolveStudentCheckpointMode(value: unknown): StudentCheckpointMode {
    return value === 'shadow' || value === 'active' || value === 'off' ? value : 'off';
}
