import React from 'react';
import { render } from '@testing-library/react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { pixelColors } from '../theme';
import { useReducedMotionPreferenceState } from '../accessibility/useReducedMotionPreference';
import { PixelBody, PIXEL_SCREEN_RECT, PIXEL_VIEWBOX } from './PixelBody';
import { PIXEL_ARMS, poseForState, type PixelPose } from './pixelPoses';
import type { CharacterState } from './types';

jest.mock('../accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreferenceState: jest.fn(),
}));

// Mesmo mock de `PixelFace.test.tsx`: shared values persistem entre renders, os
// callbacks animados rodam na hora e `withTiming`/`withRepeat` devolvem o alvo
// que receberam, para o valor ficar observável sem um relógio de animação.
jest.mock('react-native-reanimated', () => {
  const ReactActual = jest.requireActual('react') as typeof React;

  const createAnimatedComponent = (Component: React.ComponentType<Record<string, unknown>>) =>
    (props: Record<string, unknown>) => {
      const { animatedProps, ...rest } = props;
      return ReactActual.createElement(Component, { ...rest, ...(animatedProps as object) });
    };

  return {
    __esModule: true,
    default: { createAnimatedComponent },
    Easing: { inOut: (value: unknown) => value, quad: 'quad' },
    useSharedValue: (initial: number) => ReactActual.useRef({ value: initial }).current,
    useAnimatedProps: (updater: () => Record<string, unknown>) => updater(),
    withTiming: jest.fn((value: number) => value),
    withRepeat: jest.fn((animation: number) => animation),
  };
});

const reanimated = jest.requireMock('react-native-reanimated') as {
  withRepeat: jest.Mock;
  withTiming: jest.Mock;
};

const mockedReducedMotion = useReducedMotionPreferenceState as jest.MockedFunction<
  typeof useReducedMotionPreferenceState
>;

const motion = (reducedMotionEnabled: boolean, resolved = true) =>
  mockedReducedMotion.mockReturnValue({ reducedMotionEnabled, resolved });

const rightArmOf = (screen: ReturnType<typeof render>) =>
  screen.UNSAFE_getAllByType(G).find((group) => group.props.testID === 'pixel-right-arm');

// O corpo do Pixel é SVG, e o Jest não rasteriza SVG. As asserções recaem sobre
// o que decide o que o aluno vê: onde a tela escura cai, qual traçado cada pose
// desenha e de que cor cada peça é pintada.

const POSES: PixelPose[] = ['acena', 'aponta', 'comemora', 'pensa', 'repouso'];

// Valores de `pixelColors`, achatados. O preto da sombra no chão e o `none` dos
// contornos sem preenchimento são as duas únicas cores fora da paleta.
const PALETTE = new Set<string>([
  ...Object.values(pixelColors.coat),
  ...Object.values(pixelColors.blue),
  ...Object.values(pixelColors.visor),
  ...Object.values(pixelColors.metal),
  pixelColors.stethoscope,
  pixelColors.glow,
]);
const SHADOW_BLACK = 'black';

const SLEEVE_BASE_WIDTH = 58;

const sleeveBasePaths = (pose: PixelPose) =>
  render(<PixelBody pose={pose} width={288} height={432} />)
    .UNSAFE_getAllByType(Path)
    .filter((path) => path.props.strokeWidth === SLEEVE_BASE_WIDTH);

beforeEach(() => {
  jest.clearAllMocks();
  motion(false);
});

describe('poseForState', () => {
  it.each<[CharacterState, PixelPose]>([
    ['idle', 'repouso'],
    ['guide', 'aponta'],
    ['thinking', 'pensa'],
    ['happy', 'acena'],
    ['celebrate', 'comemora'],
    ['oops', 'repouso'],
  ])('%s vira %s', (state, pose) => {
    expect(poseForState(state)).toBe(pose);
  });
});

describe('PIXEL_ARMS', () => {
  it('descreve as cinco poses, cada uma com os dois braços', () => {
    expect(Object.keys(PIXEL_ARMS).sort()).toEqual([...POSES].sort());
    for (const pose of POSES) {
      expect(PIXEL_ARMS[pose].left.sleeve).toHaveLength(4);
      expect(PIXEL_ARMS[pose].right.sleeve).toHaveLength(4);
    }
  });
});

describe('PixelBody', () => {
  it('desenha na caixa de 576 × 864 e redimensiona pelo tamanho pedido', () => {
    const svg = render(<PixelBody pose="repouso" width={288} height={432} />).UNSAFE_getByType(Svg);

    expect(svg.props.viewBox).toBe(`0 0 ${PIXEL_VIEWBOX.width} ${PIXEL_VIEWBOX.height}`);
    expect(svg.props.width).toBe(288);
    expect(svg.props.height).toBe(432);
  });

  it('põe a tela escura onde o rosto é desenhado', () => {
    const screens = render(<PixelBody pose="repouso" width={288} height={432} />)
      .UNSAFE_getAllByType(Rect)
      .filter((rect) => rect.props.fill === pixelColors.visor.base);

    expect(screens).toHaveLength(1);
    expect(screens[0].props).toMatchObject({ x: 168, y: 200, width: 168, height: 112 });
    expect(screens[0].props).toMatchObject({
      x: PIXEL_SCREEN_RECT.x,
      y: PIXEL_SCREEN_RECT.y,
      width: PIXEL_SCREEN_RECT.width,
      height: PIXEL_SCREEN_RECT.height,
    });
  });

  it('não desenha rosto: nada no corpo usa o brilho ciano', () => {
    const screen = render(<PixelBody pose="repouso" width={288} height={432} />);
    const painted = [
      ...screen.UNSAFE_getAllByType(Path),
      ...screen.UNSAFE_getAllByType(Rect),
    ].flatMap((node) => [node.props.fill, node.props.stroke]);

    expect(painted).not.toContain(pixelColors.glow);
  });

  it('muda os braços de uma pose para outra', () => {
    const [comemoraLeft] = sleeveBasePaths('comemora');
    const [repousoLeft] = sleeveBasePaths('repouso');

    expect(comemoraLeft.props.d).toBeTruthy();
    expect(comemoraLeft.props.d).not.toBe(repousoLeft.props.d);
  });

  it.each(POSES)('em %s, cada braço é uma manga de três traços', (pose) => {
    const screen = render(<PixelBody pose={pose} width={288} height={432} />);
    const sleeveStrokes = screen
      .UNSAFE_getAllByType(Path)
      .filter((path) => [58, 18, 10].includes(path.props.strokeWidth));

    expect(sleeveStrokes).toHaveLength(6);
  });

  it('mantém o braço direito num grupo próprio, para a tarefa de movimento', () => {
    const screen = render(<PixelBody pose="acena" width={288} height={432} />);
    const rightArm = screen.UNSAFE_getAllByType(G).find((group) => group.props.testID === 'pixel-right-arm');

    expect(rightArm).toBeDefined();
    expect(rightArm?.findAllByType(Path).filter((path: { props: { strokeWidth?: number } }) => path.props.strokeWidth === 58)).toHaveLength(1);
  });

  it('só usa cores de pixelColors (e o preto da sombra)', () => {
    for (const pose of POSES) {
      const screen = render(<PixelBody pose={pose} width={288} height={432} />);
      const shapes = [
        ...screen.UNSAFE_getAllByType(Path),
        ...screen.UNSAFE_getAllByType(Rect),
        ...screen.UNSAFE_getAllByType(Circle),
        ...screen.UNSAFE_getAllByType(Ellipse),
      ];

      expect(shapes.length).toBeGreaterThan(20);
      for (const shape of shapes) {
        for (const key of ['fill', 'stroke'] as const) {
          const value = shape.props[key] as string | undefined;
          if (value === undefined || value === 'none' || value === SHADOW_BLACK) continue;
          expect(PALETTE.has(value)).toBe(true);
        }
      }
    }
  });

  it('é decorativo: o rótulo vive no frame que o contém', () => {
    const root = render(<PixelBody pose="repouso" width={288} height={432} />).toJSON() as {
      props: Record<string, unknown>;
    };

    expect(root.props.accessibilityElementsHidden).toBe(true);
    expect(root.props.importantForAccessibility).toBe('no-hide-descendants');
  });
});

describe('PixelBody — aceno', () => {
  it('com "reduzir movimento", o braço fica em 0 grau e nada é agendado', () => {
    motion(true);
    const screen = render(<PixelBody pose="acena" width={288} height={432} waving />);

    expect(rightArmOf(screen)?.props.rotation).toBe(0);
    expect(reanimated.withRepeat).not.toHaveBeenCalled();
    expect(reanimated.withTiming).not.toHaveBeenCalled();
  });

  it('enquanto a preferência não responde, ainda não agenda o aceno', () => {
    motion(false, false);
    render(<PixelBody pose="acena" width={288} height={432} waving />);

    expect(reanimated.withRepeat).not.toHaveBeenCalled();
  });

  it('com o movimento ligado, repete um ciclo de 1600 ms em volta do ombro', () => {
    const screen = render(<PixelBody pose="acena" width={288} height={432} waving />);

    expect(reanimated.withRepeat).toHaveBeenCalledTimes(1);
    // Vai e volta: a meia-volta dura 800 ms, o ciclo inteiro 1600.
    expect(reanimated.withTiming).toHaveBeenCalledTimes(1);
    const [alvo, opcoes] = reanimated.withTiming.mock.calls[0];
    expect(alvo).toBe(-14);
    expect(opcoes.duration).toBe(800);
    expect(opcoes.easing).toBe('quad');
    const [, repeticoes, vaiEVolta] = reanimated.withRepeat.mock.calls[0];
    expect(repeticoes).toBe(-1);
    expect(vaiEVolta).toBe(true);
    expect(opcoes.duration * 2).toBe(1600);

    expect(rightArmOf(screen)?.props).toMatchObject({ originX: 360, originY: 408 });
  });

  it('só acena na pose "acena"', () => {
    render(<PixelBody pose="aponta" width={288} height={432} waving />);

    expect(reanimated.withRepeat).not.toHaveBeenCalled();
  });

  it('sem `waving`, o braço fica parado', () => {
    const screen = render(<PixelBody pose="acena" width={288} height={432} />);

    expect(reanimated.withRepeat).not.toHaveBeenCalled();
    expect(rightArmOf(screen)?.props.rotation).toBe(0);
  });
});
