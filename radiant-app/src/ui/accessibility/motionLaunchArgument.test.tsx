import React from 'react';
import { AccessibilityInfo } from 'react-native';
import { act, render } from '@testing-library/react-native';
import { StarfieldBackground } from '../components/StarfieldBackground';
import { Confetti } from '../../components/ui/Confetti';
import {
  REDUCE_MOTION_LAUNCH_ARGUMENT,
  REDUCE_MOTION_LAUNCH_VALUE,
} from './motionLaunchArgument';

// FILA 49 (E1). O defeito que este arquivo nomeia: lançado pelo E2E com
// `-radiantReduceMotion 1`, o app continuava animando o fundo e soltando
// confete, porque só a preferência do SISTEMA desligava o movimento. O Maestro
// espera a tela assentar antes de cada rolagem, e o fundo em laço infinito não
// deixa: medido em 2026-10-16, cada tentativa custou de 8 a 11 s.
//
// A preferência do sistema fica DESLIGADA em todos os casos. O hook é o real,
// não um mock: o que se prova é que o argumento entra pelo mesmo caminho de
// "Reduzir movimento" que o fundo e o confete já respeitam.

const mockLaunchDefaults: Record<string, unknown> = {};

// O `Settings` do iOS lê o `NSUserDefaults`, onde o iOS põe os argumentos
// `-chave valor` do lançamento. No Jest não há módulo nativo; este é o domínio.
jest.mock('react-native/Libraries/Settings/Settings', () => ({
  __esModule: true,
  default: { get: (key: string) => mockLaunchDefaults[key] },
}));

type TestNode = {
  type: unknown;
  props: { jestAnimatedStyle?: { value: Record<string, unknown> } };
  findAll: (predicate: (node: TestNode) => boolean) => TestNode[];
};
type AnimatedTestNode = TestNode & {
  props: { jestAnimatedStyle: { value: Record<string, unknown> } };
};

/** As views nativas com estilo animado; o Reanimated escreve nelas o quadro atual. */
function animatedNodes(screen: ReturnType<typeof render>): AnimatedTestNode[] {
  const root: TestNode = screen.UNSAFE_root;
  return root
    .findAll((node) => typeof node.type === 'string')
    .filter((node): node is AnimatedTestNode => node.props.jestAnimatedStyle !== undefined);
}

function frame(screen: ReturnType<typeof render>) {
  return animatedNodes(screen)
    .map((node) => JSON.stringify(node.props.jestAnimatedStyle.value))
    .join('|');
}

/**
 * Quadros ao longo de ~12 s, desde o PRIMEIRO, antes de a consulta assíncrona
 * à preferência do sistema responder: um argumento que só valesse depois dela
 * deixaria a animação começar.
 */
function distinctFramesOverTime(
  screen: ReturnType<typeof render>,
  steps: number[] = [700, 1900, 3100, 6300],
) {
  const frames = [frame(screen)];
  for (const step of steps) {
    act(() => {
      jest.advanceTimersByTime(step);
    });
    frames.push(frame(screen));
  }
  return new Set(frames).size;
}

function launchWithArgument(value: unknown) {
  mockLaunchDefaults[REDUCE_MOTION_LAUNCH_ARGUMENT] = value;
}

beforeEach(() => {
  jest.useFakeTimers();
  delete mockLaunchDefaults[REDUCE_MOTION_LAUNCH_ARGUMENT];
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
  jest
    .spyOn(AccessibilityInfo, 'addEventListener')
    .mockImplementation((() => ({ remove: jest.fn() })) as never);
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('argumento de lançamento que desliga o movimento (E1)', () => {
  it('com o argumento, o fundo estrelado não anima', () => {
    launchWithArgument(REDUCE_MOTION_LAUNCH_VALUE);
    const screen = render(<StarfieldBackground starCount={12} />);

    // 3 nebulosas + 12 estrelas. Sem conferir, zero nós daria um quadro só.
    expect(animatedNodes(screen)).toHaveLength(15);
    expect(distinctFramesOverTime(screen)).toBe(1);
  });

  it('com o argumento, o confete não roda', () => {
    launchWithArgument(REDUCE_MOTION_LAUNCH_VALUE);
    const screen = render(<Confetti count={40} />);

    expect(animatedNodes(screen)).toHaveLength(0);
  });

  // Validade: o mesmo arnês, sem o argumento, VÊ a animação. Sem estes dois
  // casos, os de cima passariam com um arnês cego.
  it('sem o argumento, o fundo anima', () => {
    const screen = render(<StarfieldBackground starCount={12} />);

    expect(animatedNodes(screen)).toHaveLength(15);
    expect(distinctFramesOverTime(screen)).toBeGreaterThan(1);
  });

  // Oito peças e um passo de 700 ms: cada peça começa a cair em até 600 ms.
  // Quarenta peças por 12 s custavam ~7 s de Jest em cada gate (achado da
  // revisão da PR #49).
  it('sem o argumento, o confete roda', () => {
    const screen = render(<Confetti count={8} />);

    expect(animatedNodes(screen)).toHaveLength(8);
    expect(distinctFramesOverTime(screen, [700])).toBeGreaterThan(1);
  });

  // O Maestro 2.7 lança `-chave true` sem o `-` quando o valor é booleano, e o
  // iOS não põe isso no `NSUserDefaults`. Outro valor não liga nada.
  it.each([['0'], ['true'], [true]])('com o valor %p, o fundo continua animando', (value) => {
    launchWithArgument(value);
    const screen = render(<StarfieldBackground starCount={12} />);

    expect(distinctFramesOverTime(screen)).toBeGreaterThan(1);
  });
});
