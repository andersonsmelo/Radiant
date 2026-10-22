import React from 'react';
import { StyleSheet, View } from 'react-native';
import { render } from '@testing-library/react-native';
import Svg from 'react-native-svg';
import { useReducedMotionPreferenceState } from '../accessibility/useReducedMotionPreference';
import { PixelBody, PIXEL_HEAD_WINDOW, PIXEL_VIEWBOX } from './PixelBody';
import { PixelFace } from './PixelFace';
import { PIXEL_HEAD_SIZE_MAP, PIXEL_SIZE_MAP, PixelIllustration } from './PixelIllustration';
import { PIXEL_FRAME_RATIO, PIXEL_IMAGE_RATIO } from './pixelScreenGeometry';
import { poseForState } from './pixelPoses';
import type { CharacterState } from './types';

jest.mock('../accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreferenceState: jest.fn(),
}));

// O rosto tem a suíte própria (`PixelFace.test.tsx`). Aqui ele é um marcador que
// guarda as props que o frame lhe entrega: é a geometria que esta suíte mede.
jest.mock('./PixelFace', () => ({
  PixelFace: () => null,
}));

// Shared values persistem entre renders, os callbacks animados rodam na hora e
// `withTiming`/`withSequence`/`withRepeat` devolvem o alvo da primeira etapa,
// então a elevação máxima do laço fica observável sem relógio de animação.
jest.mock('react-native-reanimated', () => {
  const ReactActual = jest.requireActual('react') as typeof React;
  const { View: RNView } = jest.requireActual('react-native') as typeof import('react-native');

  const createAnimatedComponent = (Component: React.ComponentType<Record<string, unknown>>) =>
    (props: Record<string, unknown>) => {
      const { animatedProps, ...rest } = props;
      return ReactActual.createElement(Component, { ...rest, ...(animatedProps as object) });
    };

  return {
    __esModule: true,
    default: { View: RNView, createAnimatedComponent },
    Easing: { inOut: (value: unknown) => value, out: (value: unknown) => value, quad: 'quad' },
    useSharedValue: (initial: number) => ReactActual.useRef({ value: initial }).current,
    useAnimatedStyle: (updater: () => Record<string, unknown>) => updater(),
    useAnimatedProps: (updater: () => Record<string, unknown>) => updater(),
    withTiming: jest.fn((value: number) => value),
    withSequence: jest.fn((...steps: number[]) => steps[0]),
    withRepeat: jest.fn((animation: number) => animation),
  };
});

const reanimated = jest.requireMock('react-native-reanimated') as {
  withRepeat: jest.Mock;
  withSequence: jest.Mock;
  withTiming: jest.Mock;
};

const mockedReducedMotion = useReducedMotionPreferenceState as jest.MockedFunction<
  typeof useReducedMotionPreferenceState
>;

const motion = (reducedMotionEnabled: boolean, resolved = true) =>
  mockedReducedMotion.mockReturnValue({ reducedMotionEnabled, resolved });

const STATES: CharacterState[] = ['idle', 'thinking', 'guide', 'happy', 'celebrate', 'oops'];
const LABEL = 'Mascote Pixel';

/** O frame é o único elemento com o rótulo de acessibilidade. */
const frameOf = (screen: ReturnType<typeof render>) =>
  screen.getByLabelText(LABEL, { includeHiddenElements: true });

const faceProps = (screen: ReturnType<typeof render>) => screen.UNSAFE_getByType(PixelFace).props;

/** Estilo achatado do elemento animado que carrega a flutuação. */
const floatTranslateY = (screen: ReturnType<typeof render>) => {
  const floating = screen.UNSAFE_getAllByType(View).find((node) => {
    const style = StyleSheet.flatten(node.props.style);
    return Array.isArray(style?.transform);
  });
  const transform = floating ? StyleSheet.flatten(floating.props.style).transform : undefined;
  return (transform as { translateY?: number }[] | undefined)?.find((item) => 'translateY' in item)
    ?.translateY;
};

describe('PixelIllustration — corpo vetorial', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    motion(false);
  });

  it('desenha o PixelBody no lugar da imagem 3D, sem expo-image na árvore', () => {
    const screen = render(<PixelIllustration state="guide" size="md" />);

    expect(screen.UNSAFE_queryAllByType(require('expo-image').Image)).toHaveLength(0);
    expect(screen.UNSAFE_getByType(PixelBody).props.pose).toBe('aponta');
  });

  it.each(STATES)('escolhe a pose do estado %s por poseForState', (state) => {
    const screen = render(<PixelIllustration state={state} size="md" />);

    expect(screen.UNSAFE_getByType(PixelBody).props.pose).toBe(poseForState(state));
  });

  it('só acena no estado happy', () => {
    for (const state of STATES) {
      const screen = render(<PixelIllustration state={state} size="md" />);
      expect(screen.UNSAFE_getByType(PixelBody).props.waving).toBe(state === 'happy');
      screen.unmount();
    }
  });

  it('não desenha halo, grade, painel nem partícula', () => {
    for (const state of STATES) {
      const screen = render(<PixelIllustration state={state} size="lg" tier="advanced" />);
      const rounded = screen
        .UNSAFE_getAllByType(View)
        .filter((node) => StyleSheet.flatten(node.props.style)?.borderRadius === 999);
      expect(rounded).toHaveLength(0);
      screen.unmount();
    }
  });

  it('ignora o tier no visual', () => {
    const starter = render(<PixelIllustration state="guide" size="md" tier="starter" />);
    const advanced = render(<PixelIllustration state="guide" size="md" tier="advanced" />);

    expect(starter.toJSON()).toEqual(advanced.toJSON());
  });

  it('mantém o frame e a caixa de sempre no tamanho cheio', () => {
    const screen = render(<PixelIllustration state="guide" size="sm" />);
    const dimension = PIXEL_SIZE_MAP.sm;
    const body = screen.UNSAFE_getByType(PixelBody).props;

    expect(StyleSheet.flatten(frameOf(screen).props.style)).toMatchObject({
      width: dimension,
      height: Math.round(dimension * PIXEL_FRAME_RATIO),
    });
    expect(body.width).toBe(dimension);
    expect(body.height).toBe(Math.round(dimension * PIXEL_IMAGE_RATIO));
    expect(faceProps(screen)).toMatchObject({ imageWidth: body.width, imageHeight: body.height });
  });

  it('põe o rótulo uma vez, no frame, e esconde o corpo do leitor de tela', () => {
    const screen = render(<PixelIllustration state="guide" size="md" accessibilityLabel="Pixel guia" />);

    expect(screen.getAllByLabelText('Pixel guia', { includeHiddenElements: true })).toHaveLength(1);
    expect(frameOf(render(<PixelIllustration />)).props.accessibilityRole).toBe('image');
    expect(screen.UNSAFE_getByType(Svg).props.importantForAccessibility).toBe('no-hide-descendants');
  });
});

describe('PixelIllustration — variante cabeça', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    motion(false);
  });

  it('exporta os tamanhos da cabeça', () => {
    expect(PIXEL_HEAD_SIZE_MAP).toEqual({ sm: 48, md: 64, lg: 96 });
  });

  it.each([
    ['sm', 48],
    ['md', 64],
    ['lg', 96],
  ] as const)('recorta a caixa inteira numa janela de cabeça em %s', (size, width) => {
    const screen = render(<PixelIllustration state="idle" size={size} variant="head" />);
    const scale = width / PIXEL_HEAD_WINDOW.width;
    const frame = StyleSheet.flatten(frameOf(screen).props.style);
    const imageWidth = PIXEL_VIEWBOX.width * scale;
    const imageHeight = PIXEL_VIEWBOX.height * scale;

    expect(frame.width).toBe(width);
    expect(frame.height).toBe(Math.round(PIXEL_HEAD_WINDOW.height * scale));
    expect(frame.overflow).toBe('hidden');

    // O rosto continua medindo contra a caixa INTEIRA, não contra a janela.
    expect(faceProps(screen).imageWidth).toBeCloseTo(imageWidth, 6);
    expect(faceProps(screen).imageHeight).toBeCloseTo(imageHeight, 6);
    expect(screen.UNSAFE_getByType(PixelBody).props.width).toBeCloseTo(imageWidth, 6);
    expect(screen.UNSAFE_getByType(PixelBody).props.height).toBeCloseTo(imageHeight, 6);

    const box = screen
      .UNSAFE_getAllByType(View)
      .map((node) => StyleSheet.flatten(node.props.style))
      .find((style) => style?.position === 'absolute' && 'left' in style);
    expect(box?.left).toBeCloseTo(-PIXEL_HEAD_WINDOW.x * scale, 6);
    expect(box?.top).toBeCloseTo(-PIXEL_HEAD_WINDOW.y * scale, 6);
  });

  it('mede 48 por 46 em sm, com o rosto na caixa de 80,4 por 120,5', () => {
    const screen = render(<PixelIllustration variant="head" size="sm" />);

    expect(StyleSheet.flatten(frameOf(screen).props.style)).toMatchObject({ width: 48, height: 46 });
    expect(faceProps(screen).imageWidth).toBeCloseTo((48 * 576) / 344, 6);
    expect(faceProps(screen).imageHeight).toBeCloseTo((48 * 864) / 344, 6);
  });

  // A janela da cabeça pega a altura dos ombros: em `acena` e `comemora`, mangas
  // e mãos entrariam no recorte. Na prancheta, a cabeça é sempre `repouso`.
  it.each(STATES)('no estado %s, a cabeça fica em repouso e não acena', (state) => {
    const screen = render(<PixelIllustration state={state} size="md" variant="head" />);
    const body = screen.UNSAFE_getByType(PixelBody).props;

    expect(body.pose).toBe('repouso');
    expect(body.waving).toBe(false);
  });

  it('mantém um só rótulo e o corpo escondido', () => {
    const screen = render(<PixelIllustration variant="head" size="sm" />);

    expect(screen.getAllByLabelText(LABEL, { includeHiddenElements: true })).toHaveLength(1);
    expect(screen.UNSAFE_getByType(Svg).props.importantForAccessibility).toBe('no-hide-descendants');
  });
});

describe('PixelIllustration — flutuação', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    motion(false);
  });

  it.each(STATES)('flutua 10 unidades da caixa em 3,2 s no estado %s', (state) => {
    const screen = render(<PixelIllustration state={state} size="md" />);
    const imageHeight = Math.round(PIXEL_SIZE_MAP.md * PIXEL_IMAGE_RATIO);
    const amplitude = (-10 * imageHeight) / PIXEL_VIEWBOX.height;

    // Metade do ciclo sobe, metade desce: 1,6 s cada. (O aceno do `happy`
    // também usa withTiming, mas em meios ciclos de 0,8 s.)
    const halves = reanimated.withTiming.mock.calls.filter(([, options]) => options.duration === 1600);
    expect(halves.map(([target]) => target)).toEqual([amplitude, 0]);
    expect(reanimated.withRepeat).toHaveBeenCalledWith(expect.anything(), -1, false);

    // O estilo animado é lido na renderização; o efeito atribui depois dela.
    screen.rerender(<PixelIllustration state={state} size="md" />);
    expect(floatTranslateY(screen)).toBeCloseTo(amplitude, 6);
  });

  it('declara o easing do laço', () => {
    render(<PixelIllustration state="idle" size="md" />);

    for (const [, options] of reanimated.withTiming.mock.calls) {
      expect(options.easing).toBeDefined();
    }
  });

  it('flutua o conteúdo todo, corpo e rosto juntos', () => {
    const screen = render(<PixelIllustration state="idle" size="md" />);
    const floating = screen
      .UNSAFE_getAllByType(View)
      .find((node) => Array.isArray(StyleSheet.flatten(node.props.style)?.transform));

    expect(floating).toBeDefined();
    expect(floating?.findByType(PixelBody)).toBeTruthy();
    expect(floating?.findByType(PixelFace)).toBeTruthy();
  });

  it('flutua também a cabeça, na escala da caixa', () => {
    render(<PixelIllustration state="idle" size="sm" variant="head" />);
    const imageHeight = (48 * PIXEL_VIEWBOX.height) / PIXEL_HEAD_WINDOW.width;

    expect(reanimated.withTiming).toHaveBeenCalledWith(
      (-10 * imageHeight) / PIXEL_VIEWBOX.height,
      expect.objectContaining({ duration: 1600 }),
    );
  });

  it.each(STATES)('com reduzir movimento nada se move no estado %s', (state) => {
    motion(true);
    const screen = render(<PixelIllustration state={state} size="md" />);

    expect(reanimated.withTiming).not.toHaveBeenCalled();
    expect(reanimated.withRepeat).not.toHaveBeenCalled();
    expect(floatTranslateY(screen) ?? 0).toBe(0);
    // A pose do estado fica.
    expect(screen.UNSAFE_getByType(PixelBody).props.pose).toBe(poseForState(state));
  });

  it('espera a preferência de movimento responder antes de flutuar', () => {
    motion(false, false);
    render(<PixelIllustration state="idle" size="md" />);

    expect(reanimated.withTiming).not.toHaveBeenCalled();
  });
});
