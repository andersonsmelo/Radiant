import React from 'react';
import { act, render } from '@testing-library/react-native';
import { useReducedMotionPreference } from '../accessibility/useReducedMotionPreference';
import { PixelFace } from './PixelFace';
import {
  PIXEL_EYE_BASELINE,
  PIXEL_EXPRESSIONS,
  PIXEL_MOUTH_BASELINE,
} from './pixelExpressions';
import { PIXEL_SCREEN } from './pixelScreenGeometry';

jest.mock('../accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: jest.fn(),
}));

jest.mock('react-native-svg', () => {
  const ReactActual = jest.requireActual('react') as typeof React;

  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => ReactActual.createElement('Svg', props),
    Path: (props: Record<string, unknown>) => ReactActual.createElement('Path', props),
  };
});

// Este mock preserva a semântica que o componente usa: shared values persistem
// entre renders e os callbacks animados calculam o estilo a partir do valor
// atual. `withTiming` e `withSequence` não inventam uma pose; devolvem
// explicitamente o alvo que receberam para a atribuição do componente.
jest.mock('react-native-reanimated', () => {
  const ReactActual = jest.requireActual('react') as typeof React;

  const AnimatedView = (props: Record<string, unknown>) =>
    ReactActual.createElement('AnimatedView', props);
  const createAnimatedComponent = (Component: React.ComponentType<Record<string, unknown>>) =>
    (props: Record<string, unknown>) => {
      const { animatedProps, ...rest } = props;
      return ReactActual.createElement(Component, { ...rest, ...(animatedProps as object) });
    };

  return {
    __esModule: true,
    default: { View: AnimatedView, createAnimatedComponent },
    Easing: { out: (value: unknown) => value, quad: 'quad' },
    useSharedValue: (initial: number) => ReactActual.useRef({ value: initial }).current,
    useAnimatedStyle: (updater: () => Record<string, unknown>) => updater(),
    useAnimatedProps: (updater: () => Record<string, unknown>) => updater(),
    withTiming: jest.fn((value: number) => value),
    // A primeira etapa fica observável para provar a altura fechada; a segunda
    // continua registrada como a restauração que o componente entrega à sequência.
    withSequence: jest.fn((...steps: number[]) => steps[0]),
  };
});

const reanimated = jest.requireMock('react-native-reanimated') as {
  withSequence: jest.Mock;
  withTiming: jest.Mock;
};

const mockedReducedMotion = useReducedMotionPreference as jest.MockedFunction<
  typeof useReducedMotionPreference
>;

const AnimatedViewHost = 'AnimatedView' as unknown as React.ComponentType<unknown>;
const PathHost = 'Path' as unknown as React.ComponentType<unknown>;
const IMAGE_WIDTH = 200;
const IMAGE_HEIGHT = 200;

function expectedFaceGeometry(expression: 'neutro' | 'feliz') {
  const shape = PIXEL_EXPRESSIONS[expression];
  const screenW = PIXEL_SCREEN.w * IMAGE_WIDTH;
  const screenH = PIXEL_SCREEN.h * IMAGE_HEIGHT;
  const eyeWidth = shape.eyeW * screenW;
  const eyeHeight = shape.eyeH * screenH;
  const eyeCenterY = screenH / 2 + (PIXEL_EYE_BASELINE + shape.eyeOffsetY) * screenH;
  const mouthWidth = shape.mouthW * screenW;
  const mouthY = screenH / 2 + PIXEL_MOUTH_BASELINE * screenH;
  const mouthDip = shape.mouthDip * screenH;
  const centerX = screenW / 2;

  return {
    eyeWidth,
    eyeHeight,
    eyeTop: eyeCenterY - eyeHeight / 2,
    eyeRadius: shape.eyeRadius * eyeWidth,
    mouthPath: `M ${centerX - mouthWidth / 2} ${mouthY} Q ${centerX} ${mouthY + mouthDip * 2} ${centerX + mouthWidth / 2} ${mouthY}`,
  };
}

function renderFace(expression: 'neutro' | 'feliz' = 'neutro') {
  return render(<PixelFace expression={expression} imageWidth={IMAGE_WIDTH} imageHeight={IMAGE_HEIGHT} />);
}

function animatedEyeStyles(view: ReturnType<typeof render>) {
  return view.UNSAFE_getAllByType(AnimatedViewHost).map((node) => {
    const style = node.props.style as Record<string, unknown>[];
    return style[style.length - 1];
  });
}

function arcOpacities(view: ReturnType<typeof render>) {
  return view.UNSAFE_getAllByType(PathHost).slice(0, 2).map((node) => node.props.opacity);
}

function mouthPath(view: ReturnType<typeof render>) {
  return view.UNSAFE_getAllByType(PathHost)[2].props.d;
}

function setArcMixIntermediate(marker: number) {
  let callsInTransition = 0;
  reanimated.withTiming.mockImplementation((value: number) => {
    callsInTransition += 1;
    // arcMix é a nona e última interpolação do efeito de expressão. Os outros
    // oito valores ficam naturais; só o retorno de arcMix vira marcador.
    return callsInTransition === 9 ? marker : value;
  });
}

describe('PixelFace — comportamento da animação facial', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockedReducedMotion.mockReturnValue(false);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('pisca multiplicando eyeH e restaura 1 pela sequência', () => {
    const view = renderFace();
    const neutral = expectedFaceGeometry('neutro');
    const openHeight = animatedEyeStyles(view)[0].height as number;

    reanimated.withTiming.mockClear();
    act(() => {
      jest.runOnlyPendingTimers();
    });
    view.rerender(<PixelFace expression="neutro" imageWidth={IMAGE_WIDTH} imageHeight={IMAGE_HEIGHT} />);

    const closedHeight = animatedEyeStyles(view)[0].height as number;
    expect(openHeight).toBeCloseTo(neutral.eyeHeight);
    expect(closedHeight).toBeCloseTo(neutral.eyeHeight * 0.1);
    expect(reanimated.withSequence).toHaveBeenCalledWith(0.1, 1);
    expect(reanimated.withTiming).toHaveBeenNthCalledWith(
      1,
      0.1,
      expect.objectContaining({ duration: 90 }),
    );
    view.unmount();
    expect(reanimated.withTiming).toHaveBeenNthCalledWith(
      2,
      1,
      expect.objectContaining({ duration: 90 }),
    );
  });

  it('cancela a piscada agendada ao desmontar e não agenda outra', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const view = renderFace();

    view.unmount();
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(reanimated.withSequence).not.toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(0);
  });

  it('sob reduced motion muda a pose diretamente, sem timeout, piscada ou withTiming', () => {
    mockedReducedMotion.mockReturnValue(true);
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    const view = renderFace();

    view.rerender(<PixelFace expression="feliz" imageWidth={200} imageHeight={200} />);
    // O efeito já atribuiu a pose; este render a torna observável no mock.
    view.rerender(<PixelFace expression="feliz" imageWidth={IMAGE_WIDTH} imageHeight={IMAGE_HEIGHT} />);

    expect(setTimeoutSpy).not.toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(0);
    expect(reanimated.withSequence).not.toHaveBeenCalled();
    expect(reanimated.withTiming).not.toHaveBeenCalled();
    expect(animatedEyeStyles(view).map((style) => style.opacity)).toEqual([0, 0]);
    expect(arcOpacities(view)).toEqual([1, 1]);
    const happy = expectedFaceGeometry('feliz');
    for (const eye of animatedEyeStyles(view)) {
      expect(eye.width).toBeCloseTo(happy.eyeWidth);
      expect(eye.height).toBeCloseTo(happy.eyeHeight);
      expect(eye.top).toBeCloseTo(happy.eyeTop);
      expect(eye.borderRadius).toBeCloseTo(happy.eyeRadius);
    }
    expect(mouthPath(view)).toBe(happy.mouthPath);
  });

  it('mantém pílulas e arcos presentes e vincula o crossfade ao retorno animado nos dois sentidos', () => {
    const view = renderFace('neutro');

    expect(animatedEyeStyles(view)).toHaveLength(2);
    expect(arcOpacities(view)).toHaveLength(2);
    expect(animatedEyeStyles(view).map((style) => style.opacity)).toEqual([1, 1]);
    expect(arcOpacities(view)).toEqual([0, 0]);

    reanimated.withTiming.mockClear();
    setArcMixIntermediate(0.37);
    view.rerender(<PixelFace expression="feliz" imageWidth={IMAGE_WIDTH} imageHeight={IMAGE_HEIGHT} />);
    view.rerender(<PixelFace expression="feliz" imageWidth={IMAGE_WIDTH} imageHeight={IMAGE_HEIGHT} />);

    expect(reanimated.withTiming).toHaveBeenCalledTimes(9);
    expect(reanimated.withTiming).toHaveBeenNthCalledWith(9, 1, expect.any(Object));
    expect(animatedEyeStyles(view).map((style) => style.opacity)).toEqual([0.63, 0.63]);
    expect(arcOpacities(view)).toEqual([0.37, 0.37]);

    reanimated.withTiming.mockClear();
    setArcMixIntermediate(0.63);
    view.rerender(<PixelFace expression="neutro" imageWidth={IMAGE_WIDTH} imageHeight={IMAGE_HEIGHT} />);
    view.rerender(<PixelFace expression="neutro" imageWidth={IMAGE_WIDTH} imageHeight={IMAGE_HEIGHT} />);

    expect(reanimated.withTiming).toHaveBeenCalledTimes(9);
    expect(reanimated.withTiming).toHaveBeenNthCalledWith(9, 0, expect.any(Object));
    expect(animatedEyeStyles(view).map((style) => style.opacity)).toEqual([0.37, 0.37]);
    expect(arcOpacities(view)).toEqual([0.63, 0.63]);
  });
});
