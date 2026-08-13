import { AccessibilityInfo } from 'react-native';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import {
  useReducedMotionPreference,
  useReducedMotionPreferenceState,
} from './useReducedMotionPreference';

describe('useReducedMotionPreferenceState', () => {
  let listener: ((enabled: boolean) => void) | null = null;
  let remove: jest.Mock;

  beforeEach(() => {
    listener = null;
    remove = jest.fn();

    // A sobrecarga tipada de `addEventListener` casa com
    // `announcementFinished` primeiro, e o handler de `reduceMotionChanged`
    // recebe `boolean`. O cast é sobre a assinatura do espião, não sobre o
    // comportamento observado.
    jest
      .spyOn(AccessibilityInfo, 'addEventListener')
      .mockImplementation(((_event: string, handler: (enabled: boolean) => void) => {
        listener = handler;
        return { remove };
      }) as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('começa indeterminado, e é isso que impede a corrida', async () => {
    // A primeira renderização acontece ANTES da resposta assíncrona. Quem lê
    // só o booleano vê `false` e não distingue "sem redução" de "ainda não
    // sei" — foi essa indistinção que fez a cascata de entrada começar contra
    // uma preferência que diria o contrário.
    let resolvePreference: (enabled: boolean) => void = () => undefined;
    jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockReturnValue(new Promise<boolean>((resolve) => {
        resolvePreference = resolve;
      }));

    const { result } = renderHook(() => useReducedMotionPreferenceState());

    expect(result.current).toEqual({ reducedMotionEnabled: false, resolved: false });

    await act(async () => {
      resolvePreference(true);
    });

    expect(result.current).toEqual({ reducedMotionEnabled: true, resolved: true });
  });

  it('resolve como "sem redução" quando a consulta falha', async () => {
    jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockRejectedValue(new Error('sem resposta do sistema'));

    const { result } = renderHook(() => useReducedMotionPreferenceState());

    await waitFor(() => {
      expect(result.current).toEqual({ reducedMotionEnabled: false, resolved: true });
    });
  });

  it('acompanha a mudança feita com o app aberto', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);

    const { result } = renderHook(() => useReducedMotionPreferenceState());

    await waitFor(() => {
      expect(result.current.resolved).toBe(true);
    });

    act(() => {
      listener?.(true);
    });

    expect(result.current).toEqual({ reducedMotionEnabled: true, resolved: true });
  });

  it('cancela a inscrição ao desmontar', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);

    const { unmount } = renderHook(() => useReducedMotionPreferenceState());

    await waitFor(() => {
      expect(remove).not.toHaveBeenCalled();
    });

    unmount();

    expect(remove).toHaveBeenCalledTimes(1);
  });
});

describe('useReducedMotionPreference', () => {
  let listener: ((enabled: boolean) => void) | null = null;
  let remove: jest.Mock;

  beforeEach(() => {
    listener = null;
    remove = jest.fn();

    jest
      .spyOn(AccessibilityInfo, 'addEventListener')
      .mockImplementation(((_event: string, handler: (enabled: boolean) => void) => {
        listener = handler;
        return { remove };
      }) as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('usa a preferência do aparelho e acompanha mudanças enquanto montado', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);

    const { result, unmount } = renderHook(() => useReducedMotionPreference());

    await waitFor(() => expect(result.current).toBe(true));

    act(() => listener?.(false));
    expect(result.current).toBe(false);

    unmount();
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('cai para movimento normal quando a preferência nativa não pode ser lida', async () => {
    jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockRejectedValue(new Error('native accessibility preference unavailable'));

    const { result } = renderHook(() => useReducedMotionPreference());

    await waitFor(() => expect(result.current).toBe(false));
  });

  it('continua devolvendo só o booleano para quem não agenda nada', async () => {
    // Os ~15 consumidores existentes decidem valor de repouso a cada
    // renderização, sem agendar: para eles o estado indeterminado não muda
    // nada, e trocar a assinatura seria mexer em todos eles sem motivo.
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);

    const { result } = renderHook(() => useReducedMotionPreference());

    expect(result.current).toBe(false);

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});
