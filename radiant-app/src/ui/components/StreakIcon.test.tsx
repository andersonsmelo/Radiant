import React from 'react';
import { act, render } from '@testing-library/react-native';
import { NavigationContext } from '@react-navigation/native';
import { StreakIcon } from './HudIcons';
import { useReducedMotionPreference } from '../accessibility/useReducedMotionPreference';

// Item 33 da FILA (aquecimento). Medido no simulador em 2026-09-28: com o fundo
// já parado fora de foco, a tela da assinatura empilhada sobre as abas ainda
// custava ~31 % de CPU, e o resto zerava com Reduzir Movimento. O ícone de
// sequência respira em laço infinito, e as duas abas o montam: o HUD da Estude
// e as seções de Missões e Progresso do Perfil. O defeito que este arquivo
// nomeia é o ícone respirar numa tela que não está em foco.

jest.mock('../accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: jest.fn(() => false),
}));

const mockReducedMotion = useReducedMotionPreference as jest.MockedFunction<
  typeof useReducedMotionPreference
>;

type FocusEvent = 'focus' | 'blur';
type TestNode = ReturnType<typeof render>['UNSAFE_root'];

/** O contrato de foco que o React Navigation entrega a cada tela. */
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
  const icon = <StreakIcon />;
  return render(
    navigation === null ? (
      icon
    ) : (
      <NavigationContext.Provider value={navigation as never}>{icon}</NavigationContext.Provider>
    ),
  );
}

/**
 * O nó nativo que recebe a escala animada. No Jest, o Reanimated escreve o
 * estilo do quadro atual em `jestAnimatedStyle.value` desse nó; o invólucro
 * não carrega o valor.
 */
function animatedNodes(screen: ReturnType<typeof render>) {
  return screen.UNSAFE_root.findAll(
    (node: TestNode) => typeof node.type === 'string' && node.props.jestAnimatedStyle !== undefined,
  );
}

function frame(screen: ReturnType<typeof render>) {
  return animatedNodes(screen).map((node: TestNode) => JSON.stringify(node.props.jestAnimatedStyle.value));
}

function advance(ms: number) {
  act(() => {
    jest.advanceTimersByTime(ms);
  });
}

/** Quadros ao longo de ~4 s, mais que dois ciclos da respiração (1,6 s). */
function framesOverTime(screen: ReturnType<typeof render>) {
  // Um nó só, o do ícone. Sem esta conferência, zero nós daria um quadro só,
  // e todo caso "parado" passaria sem ler nada.
  expect(animatedNodes(screen)).toHaveLength(1);
  const frames = [frame(screen)];
  for (const step of [300, 500, 700, 1100, 1300]) {
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

describe('StreakIcon e o foco da tela', () => {
  it('fora de foco, o ícone não respira com o passar do tempo', () => {
    const { navigation } = fakeNavigation(false);
    const screen = renderInScreen(navigation);

    expect(distinct(framesOverTime(screen))).toBe(1);
  });

  it('a respiração que já rodava para quando a tela perde o foco', () => {
    const { navigation, emit } = fakeNavigation(true);
    const screen = renderInScreen(navigation);
    advance(900);

    emit('blur');

    expect(distinct(framesOverTime(screen))).toBe(1);
  });

  // Validade: parar fora de foco não pode virar parar sempre.
  it('em foco, o ícone respira', () => {
    const { navigation } = fakeNavigation(true);
    const screen = renderInScreen(navigation);

    expect(distinct(framesOverTime(screen))).toBeGreaterThan(1);
  });

  it('ao voltar o foco, a respiração recomeça', () => {
    const { navigation, emit } = fakeNavigation(false);
    const screen = renderInScreen(navigation);
    advance(900);

    emit('focus');

    expect(distinct(framesOverTime(screen))).toBeGreaterThan(1);
  });

  it('fora de um navegador, o ícone respira como antes', () => {
    const screen = renderInScreen(null);

    expect(distinct(framesOverTime(screen))).toBeGreaterThan(1);
  });

  it('com Reduzir Movimento, o ícone fica parado mesmo em foco', () => {
    mockReducedMotion.mockReturnValue(true);
    const { navigation } = fakeNavigation(true);
    const screen = renderInScreen(navigation);

    expect(distinct(framesOverTime(screen))).toBe(1);
  });
});
