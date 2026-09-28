import React from 'react';
import { act, render } from '@testing-library/react-native';
import { NavigationContext } from '@react-navigation/native';
import { StarfieldBackground } from './StarfieldBackground';
import { useReducedMotionPreference } from '../accessibility/useReducedMotionPreference';

// Item 12 da FILA (aquecimento). Medido no simulador em 2026-09-25: a aba
// visitada continua montada e o fundo dela segue animando fora de foco, o que
// somou ~24 pontos de CPU por fundo coberto. O defeito que este arquivo nomeia
// é esse: o fundo anima numa tela que não está em foco. O Jest não rasteriza,
// então a prova é o que determina o quadro — a opacidade e a transformação que
// o Reanimated calcula a cada instante — e não um espelho de props.

jest.mock('../accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: jest.fn(() => false),
}));

const mockReducedMotion = useReducedMotionPreference as jest.MockedFunction<
  typeof useReducedMotionPreference
>;

type FocusEvent = 'focus' | 'blur';
type TestNode = ReturnType<typeof render>['UNSAFE_root'];

/**
 * O pedaço do contrato de navegação que uma tela usa para saber se está em
 * foco: `isFocused()` e os eventos `focus`/`blur`. É o que o React Navigation
 * entrega a cada tela pelo `NavigationContext`.
 */
function fakeNavigation(initiallyFocused: boolean) {
  let focused = initiallyFocused;
  const listeners: Record<FocusEvent, Set<() => void>> = { focus: new Set(), blur: new Set() };
  const navigation = {
    isFocused: () => focused,
    addListener: (type: FocusEvent, callback: () => void) => {
      listeners[type]?.add(callback);
      return () => listeners[type]?.delete(callback);
    },
  };
  const emit = (type: FocusEvent) => {
    focused = type === 'focus';
    act(() => listeners[type].forEach((callback) => callback()));
  };
  return { navigation, emit };
}

function renderInScreen(navigation: ReturnType<typeof fakeNavigation>['navigation'] | null) {
  const background = <StarfieldBackground starCount={12} />;
  return render(
    navigation === null ? (
      background
    ) : (
      <NavigationContext.Provider value={navigation as never}>{background}</NavigationContext.Provider>
    ),
  );
}

/**
 * As views nativas que recebem estilo animado: uma por estrela e por nebulosa.
 * No Jest, o Reanimated escreve o estilo do quadro atual em
 * `jestAnimatedStyle.value` do nó nativo, que é o que o `getAnimatedStyle` dele
 * lê. O invólucro `Animated.View` não carrega esse valor.
 */
function animatedNodes(screen: ReturnType<typeof render>) {
  return screen.UNSAFE_root.findAll(
    (node: TestNode) => typeof node.type === 'string' && node.props.jestAnimatedStyle !== undefined,
  );
}

/** O quadro do fundo: o estilo animado de cada estrela e nebulosa, agora. */
function frame(screen: ReturnType<typeof render>) {
  return animatedNodes(screen).map((node: TestNode) => JSON.stringify(node.props.jestAnimatedStyle.value));
}

function advance(ms: number) {
  act(() => {
    jest.advanceTimersByTime(ms);
  });
}

/** Quadros tirados ao longo de ~12 s, mais que o ciclo mais longo de estrela (5 s). */
function framesOverTime(screen: ReturnType<typeof render>) {
  // 3 nebulosas e 12 estrelas. Sem esta conferência, zero nós daria um quadro
  // só, e todo caso "parado" passaria sem ler nada.
  expect(animatedNodes(screen)).toHaveLength(15);
  const frames = [frame(screen)];
  for (const step of [700, 1900, 3100, 6300]) {
    advance(step);
    frames.push(frame(screen));
  }
  return frames;
}

function distinct(frames: string[][]) {
  return new Set(frames.map((f) => f.join('|'))).size;
}

beforeEach(() => {
  jest.useFakeTimers();
  mockReducedMotion.mockReturnValue(false);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('StarfieldBackground e o foco da tela', () => {
  it('fora de foco, o fundo não anima com o passar do tempo', () => {
    const { navigation } = fakeNavigation(false);
    const screen = renderInScreen(navigation);

    expect(distinct(framesOverTime(screen))).toBe(1);
  });

  it('a animação que já rodava para quando a tela perde o foco', () => {
    const { navigation, emit } = fakeNavigation(true);
    const screen = renderInScreen(navigation);
    advance(2500);

    emit('blur');

    expect(distinct(framesOverTime(screen))).toBe(1);
  });

  // Validade: parar fora de foco não pode virar parar sempre.
  it('em foco, o fundo anima', () => {
    const { navigation } = fakeNavigation(true);
    const screen = renderInScreen(navigation);

    expect(distinct(framesOverTime(screen))).toBeGreaterThan(1);
  });

  it('ao voltar o foco, a animação recomeça', () => {
    const { navigation, emit } = fakeNavigation(false);
    const screen = renderInScreen(navigation);
    advance(2500);

    emit('focus');

    expect(distinct(framesOverTime(screen))).toBeGreaterThan(1);
  });

  it('fora de um navegador, o fundo anima como antes', () => {
    const screen = renderInScreen(null);

    expect(distinct(framesOverTime(screen))).toBeGreaterThan(1);
  });

  it('com Reduzir Movimento, o fundo fica parado mesmo em foco', () => {
    mockReducedMotion.mockReturnValue(true);
    const { navigation } = fakeNavigation(true);
    const screen = renderInScreen(navigation);

    expect(distinct(framesOverTime(screen))).toBe(1);
  });
});
