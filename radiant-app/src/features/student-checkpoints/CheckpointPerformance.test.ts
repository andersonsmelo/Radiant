import {
    CHECKPOINT_PERFORMANCE_PREFIX,
    CheckpointPerformanceProbe,
} from './CheckpointPerformance';

describe('CheckpointPerformanceProbe', () => {
    it('emits only the closed metric, mode and rounded duration', async () => {
        const emit = jest.fn();
        const times = [100, 126.789];
        const probe = new CheckpointPerformanceProbe({
            enabled: true,
            mode: 'active',
            clock: () => times.shift() ?? 0,
            emit,
        });

        await expect(probe.measure('persistence', async () => 'ok')).resolves.toBe('ok');

        expect(emit).toHaveBeenCalledWith(
            `${CHECKPOINT_PERFORMANCE_PREFIX}{"schemaVersion":1,"metric":"persistence","mode":"active","durationMs":26.8}`,
        );
    });

    it('records failures without swallowing the original error', async () => {
        const emit = jest.fn();
        const times = [10, 12];
        const probe = new CheckpointPerformanceProbe({
            enabled: true,
            mode: 'active',
            clock: () => times.shift() ?? 0,
            emit,
        });

        await expect(probe.measure('restoration', async () => {
            throw new Error('storage-unavailable');
        })).rejects.toThrow('storage-unavailable');

        expect(emit).toHaveBeenCalledWith(expect.stringContaining('"metric":"restoration"'));
    });

    it('is a byte-silent no-op when disabled', async () => {
        const emit = jest.fn();
        const clock = jest.fn(() => 1);
        const probe = new CheckpointPerformanceProbe({ enabled: false, mode: 'off', clock, emit });

        await expect(probe.measure('persistence', async () => 7)).resolves.toBe(7);

        expect(clock).not.toHaveBeenCalled();
        expect(emit).not.toHaveBeenCalled();
    });
});
