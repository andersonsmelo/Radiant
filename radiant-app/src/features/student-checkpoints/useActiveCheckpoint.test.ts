import { act, renderHook, waitFor } from '@testing-library/react-native';
import { getNativeActiveCheckpointRuntime } from './ActiveCheckpointRuntime';
import { lessonIntent } from './testFixtures';
import { useActiveCheckpoint } from './useActiveCheckpoint';

jest.mock('../../config', () => ({ AppConfig: { APP_ENV: 'development' } }));

jest.mock('./ActiveCheckpointRuntime', () => ({
    getNativeActiveCheckpointRuntime: jest.fn(),
}));

const mockedRuntimeFactory = getNativeActiveCheckpointRuntime as jest.MockedFunction<typeof getNativeActiveCheckpointRuntime>;

describe('useActiveCheckpoint', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE = 'active';
    });

    afterEach(() => {
        delete process.env.EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE;
    });

    it('constrói o intent com o checkpointId emitido pelo runtime antes do commit', async () => {
        const handle = {
            checkpointId: 'checkpoint:runtime:generated',
            surface: 'lesson' as const,
            flowId: 'lesson:activity-1',
            contentVersion: 'content-v1',
        };
        const runtime = {
            start: jest.fn().mockResolvedValue({ status: 'started', handle }),
            progress: jest.fn().mockResolvedValue(undefined),
            commit: jest.fn().mockResolvedValue({ status: 'committed', operation: null }),
            finish: jest.fn().mockResolvedValue(undefined),
        };
        mockedRuntimeFactory.mockReturnValue(runtime as never);

        const { result } = renderHook(() => useActiveCheckpoint({
            surface: 'lesson',
            flowId: handle.flowId,
            contentVersion: handle.contentVersion,
            cursorId: 'step-1',
            compatibleCursorIds: ['step-1'],
            progressPercent: 0,
            completedStepCount: 0,
            totalStepCount: 1,
            enabled: true,
        }));

        await waitFor(() => expect(runtime.start).toHaveBeenCalledTimes(1));
        await act(async () => {
            await result.current.commit((checkpointId) => lessonIntent({
                checkpointId,
                flowId: handle.flowId,
                contentVersion: handle.contentVersion,
            }));
        });

        expect(runtime.commit).toHaveBeenCalledWith(
            handle,
            expect.objectContaining({ checkpointId: handle.checkpointId }),
        );
    });
});
