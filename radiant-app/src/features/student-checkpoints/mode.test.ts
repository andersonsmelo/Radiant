import { resolveStudentCheckpointRuntimeMode } from './mode';

describe('resolveStudentCheckpointRuntimeMode', () => {
    it('defaults preview to shadow and all other environments to off', () => {
        expect(resolveStudentCheckpointRuntimeMode('preview')).toBe('shadow');
        expect(resolveStudentCheckpointRuntimeMode('production')).toBe('off');
        expect(resolveStudentCheckpointRuntimeMode('development')).toBe('off');
    });

    it('enables active only for an explicit development/internal configuration', () => {
        expect(resolveStudentCheckpointRuntimeMode('development', 'active')).toBe('active');
        expect(resolveStudentCheckpointRuntimeMode('preview', 'active')).toBe('off');
        expect(resolveStudentCheckpointRuntimeMode('production', 'active')).toBe('off');
    });

    it('fails closed for invalid or cross-profile runtime configuration', () => {
        expect(resolveStudentCheckpointRuntimeMode('preview', 'invalid')).toBe('off');
        expect(resolveStudentCheckpointRuntimeMode('development', 'shadow')).toBe('off');
        expect(resolveStudentCheckpointRuntimeMode('production', 'shadow')).toBe('off');
        expect(resolveStudentCheckpointRuntimeMode('preview', 'shadow')).toBe('shadow');
        expect(resolveStudentCheckpointRuntimeMode('preview', 'off')).toBe('off');
    });
});
