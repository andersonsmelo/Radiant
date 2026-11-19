import { renderHook } from '@testing-library/react-native';

import {
  useReducedMotionPreferenceState,
  type ReducedMotionPreference,
} from '../accessibility/useReducedMotionPreference';
import { useLoopProgress } from '../motion';

jest.mock('../accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreferenceState: jest.fn(),
}));
jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual('react-native-reanimated');
  return { ...actual, withTiming: jest.fn(actual.withTiming), withRepeat: jest.fn(actual.withRepeat) };
});

// R4 do visual:qa: o módulo do Reanimated só é importado em ui/motion.ts.
const { withRepeat, withTiming } = jest.requireMock('react-native-reanimated');
const setPreference = (value: ReducedMotionPreference) =>
  (useReducedMotionPreferenceState as jest.Mock).mockReturnValue(value);
const started = () => (withTiming as jest.Mock).mock.calls.length + (withRepeat as jest.Mock).mock.calls.length > 0;

describe('useLoopProgress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setPreference({ reducedMotionEnabled: false, resolved: true });
  });

  it('movimento liberado inicia o relógio', () => {
    renderHook(() => useLoopProgress(3000, true));
    expect(started()).toBe(true);
  });

  it('movimento reduzido não inicia o relógio', () => {
    setPreference({ reducedMotionEnabled: true, resolved: true });
    renderHook(() => useLoopProgress(3000, true));
    expect(started()).toBe(false);
  });

  it('preferência não resolvida não inicia o relógio', () => {
    setPreference({ reducedMotionEnabled: false, resolved: false });
    renderHook(() => useLoopProgress(3000, true));
    expect(started()).toBe(false);
  });

  it('playing falso não inicia o relógio', () => {
    renderHook(() => useLoopProgress(3000, false));
    expect(started()).toBe(false);
  });

  it('sem periodMs não inicia o relógio', () => {
    renderHook(() => useLoopProgress(undefined, true));
    expect(started()).toBe(false);
  });
});
