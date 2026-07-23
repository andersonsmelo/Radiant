import { act, renderHook, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { useReducedMotionPreference } from './useReducedMotionPreference';

describe('useReducedMotionPreference', () => {
  const isReduceMotionEnabled = AccessibilityInfo.isReduceMotionEnabled as jest.Mock;
  const addEventListener = AccessibilityInfo.addEventListener as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses the device preference and follows changes while mounted', async () => {
    const remove = jest.fn();
    let onPreferenceChange: ((enabled: boolean) => void) | undefined;

    isReduceMotionEnabled.mockResolvedValue(true);
    addEventListener.mockImplementation((_eventName: string, listener: (enabled: boolean) => void) => {
      onPreferenceChange = listener;
      return { remove };
    });

    const { result, unmount } = renderHook(() => useReducedMotionPreference());

    await waitFor(() => expect(result.current).toBe(true));

    act(() => onPreferenceChange?.(false));
    expect(result.current).toBe(false);

    unmount();
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('falls back to regular motion when the native preference cannot be read', async () => {
    isReduceMotionEnabled.mockRejectedValue(new Error('native accessibility preference unavailable'));
    addEventListener.mockReturnValue({ remove: jest.fn() });

    const { result } = renderHook(() => useReducedMotionPreference());

    await waitFor(() => expect(result.current).toBe(false));
  });
});
