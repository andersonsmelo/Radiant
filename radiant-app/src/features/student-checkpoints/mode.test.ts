import { resolveStudentCheckpointRuntimeMode } from './mode';

describe('resolveStudentCheckpointRuntimeMode', () => {
    it('defaults preview to shadow and all other environments to off', () => {
        expect(resolveStudentCheckpointRuntimeMode('preview')).toBe('shadow');
        expect(resolveStudentCheckpointRuntimeMode('production')).toBe('off');
        expect(resolveStudentCheckpointRuntimeMode('development')).toBe('off');
    });

    it('fails closed for invalid or active runtime configuration in this wave', () => {
        expect(resolveStudentCheckpointRuntimeMode('preview', 'invalid')).toBe('off');
        expect(resolveStudentCheckpointRuntimeMode('preview', 'active')).toBe('off');
        expect(resolveStudentCheckpointRuntimeMode('production', 'shadow')).toBe('off');
        expect(resolveStudentCheckpointRuntimeMode('preview', 'shadow')).toBe('shadow');
        expect(resolveStudentCheckpointRuntimeMode('preview', 'off')).toBe('off');
    });
});
