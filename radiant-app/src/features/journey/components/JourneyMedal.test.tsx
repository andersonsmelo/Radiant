import React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import type { JourneyNode, JourneyNodeStatus } from '../../../types/journey';
import { useReducedMotionPreference } from '../../../ui/accessibility/useReducedMotionPreference';
import { ThemeIllustration } from '../../../ui/illustrations/ThemeIllustration';
import { depth, medalColors, medalStarTones } from '../../../ui/theme';
import { JourneyMedal, medalStateFor } from './JourneyMedal';

// O Jest não rasteriza Skia nem toca Lottie: a ilustração é um dublê que só
// registra o que a medalha lhe pede (tema, estado, tamanho).
jest.mock('../../../ui/illustrations/ThemeIllustration', () => {
  const { View } = require('react-native');
  return {
    ThemeIllustration: jest.fn(() => <View testID="theme-illustration" />),
  };
});

jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: jest.fn(() => false),
  useReducedMotionPreferenceState: jest.fn(() => ({ reducedMotionEnabled: false, resolved: true })),
}));

jest.mock('react-native-reanimated', () => {
  const ReactActual = jest.requireActual('react') as typeof React;
  const actual = jest.requireActual('react-native-reanimated/mock');
  const animated = actual.default ?? actual;
  const createAnimatedComponent = (Component: React.ComponentType<Record<string, unknown>>) =>
    (props: Record<string, unknown>) => {
      const { animatedProps, ...rest } = props;
      return ReactActual.createElement(Component, { ...rest, ...(animatedProps as object) });
    };
  return {
    ...actual,
    __esModule: true,
    default: { ...animated, createAnimatedComponent },
    withRepeat: jest.fn((animation: unknown) => animation),
    withTiming: jest.fn((value: unknown) => value),
  };
});

const reanimated = jest.requireMock('react-native-reanimated') as {
  withRepeat: jest.Mock;
  withTiming: jest.Mock;
};
const mockedReducedMotion = useReducedMotionPreference as jest.MockedFunction<typeof useReducedMotionPreference>;
const illustration = ThemeIllustration as unknown as jest.Mock;

// O anel, o número e a ilustração são escondidos do leitor de tela, e a
// biblioteca de testes, por padrão, também não acha o que está escondido dele.
const HIDDEN = { includeHiddenElements: true };
const RING = 'journey-medal-pulse-ring';

beforeEach(() => {
  mockedReducedMotion.mockReturnValue(false);
  illustration.mockClear();
  reanimated.withRepeat.mockClear();
  reanimated.withTiming.mockClear();
});

function node(status: JourneyNodeStatus, type: JourneyNode['type'] = 'lesson'): JourneyNode {
  return { id: `node-${status}`, unitId: 'unit-1', type, title: 'O tubo de raios X', status };
}

type MedalProps = React.ComponentProps<typeof JourneyMedal>;

function renderMedal(overrides: Partial<MedalProps> = {}) {
  return render(
    <JourneyMedal
      node={{ id: 'n1', type: 'lesson' }}
      theme="tubo"
      state="done"
      pulsing={false}
      accessibilityLabel="O tubo de raios X. Concluído."
      onPress={jest.fn()}
      {...overrides}
    />,
  );
}

describe('medalStateFor', () => {
  it('concluído é ouro, esteja ou não recomendado', () => {
    expect(medalStateFor(node('completed'), false)).toBe('done');
    expect(medalStateFor(node('completed'), true)).toBe('done');
  });

  it('o recomendado é a próxima', () => {
    expect(medalStateFor(node('available'), true)).toBe('next');
    expect(medalStateFor(node('due-review', 'review'), true)).toBe('next');
  });

  it('bloqueado e não recomendado é bloqueado', () => {
    expect(medalStateFor(node('locked'), false)).toBe('locked');
  });

  it.each(['available', 'active', 'resumable', 'due-review'] as const)(
    '%s não recomendado também é "next", só que sem anel',
    (status) => {
      expect(medalStateFor(node(status), false)).toBe('next');
    },
  );
});

describe('JourneyMedal — estrelas', () => {
  it('desenha três estrelas, duas acesas e uma apagada, com 2 estrelas', () => {
    const view = renderMedal({ stars: 2 });
    expect(view.getAllByTestId('journey-medal-star-on')).toHaveLength(2);
    expect(view.getAllByTestId('journey-medal-star-off')).toHaveLength(1);
  });

  it('com 3 estrelas acende as três', () => {
    const view = renderMedal({ stars: 3 });
    expect(view.getAllByTestId('journey-medal-star-on')).toHaveLength(3);
    expect(view.queryAllByTestId('journey-medal-star-off')).toHaveLength(0);
  });

  it('com 0 estrelas desenha as três apagadas', () => {
    const view = renderMedal({ stars: 0 });
    expect(view.queryAllByTestId('journey-medal-star-on')).toHaveLength(0);
    expect(view.getAllByTestId('journey-medal-star-off')).toHaveLength(3);
  });

  it('sem estrelas (aula sem tentativa registrada) não desenha nenhuma', () => {
    const view = renderMedal();
    expect(view.queryAllByTestId('journey-medal-star-on')).toHaveLength(0);
    expect(view.queryAllByTestId('journey-medal-star-off')).toHaveLength(0);
  });

  it('pinta a estrela acesa e a apagada com os tons do tema', () => {
    const view = renderMedal({ stars: 1 });
    const fillOf = (testID: string) =>
      view.UNSAFE_getAllByType(Path).find((path) => path.props.testID === testID)?.props.fill;
    expect(fillOf('journey-medal-star-on-shape')).toBe(medalStarTones.on.face);
    expect(fillOf('journey-medal-star-off-shape')).toBe(medalStarTones.off.face);
  });
});

describe('JourneyMedal — acessibilidade', () => {
  it('mantém o rótulo "<título>. <estado>." que os roteiros Maestro leem', () => {
    const view = renderMedal({ accessibilityLabel: 'O tubo de raios X. Próximo passo.', state: 'next' });
    expect(view.getByRole('button').props.accessibilityLabel).toBe('O tubo de raios X. Próximo passo.');
  });

  it.each([
    [0, '0 estrelas'],
    [1, '1 estrela'],
    [2, '2 estrelas'],
    [3, '3 estrelas'],
  ] as const)('com %s estrelas, o valor lido é "%s"', (stars, text) => {
    const view = renderMedal({ stars });
    expect(view.getByRole('button').props.accessibilityValue).toEqual({ text });
  });

  it('sem estrelas, não há valor lido', () => {
    const view = renderMedal();
    expect(view.getByRole('button').props.accessibilityValue?.text).toBeUndefined();
  });

  it('a medalha bloqueada é um botão desativado', () => {
    const onPress = jest.fn();
    const view = renderMedal({ state: 'locked', disabled: true, onPress, accessibilityLabel: 'Aula. Bloqueado.' });
    const button = view.getByRole('button');
    expect(button.props.accessibilityState.disabled).toBe(true);
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('toca o onPress quando liberada', () => {
    const onPress = jest.fn();
    const view = renderMedal({ onPress });
    fireEvent.press(view.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('o alvo de toque mede ao menos 48 × 48, mesmo com a medalha pequena', () => {
    const view = renderMedal({ size: 16 });
    const style = StyleSheet.flatten(view.getByRole('button').props.style);
    expect(style.minWidth).toBeGreaterThanOrEqual(48);
    expect(style.minHeight).toBeGreaterThanOrEqual(48);
  });

  it('sem onPress é uma imagem com o rótulo, e não um botão', () => {
    const view = renderMedal({ onPress: undefined, stars: 3, accessibilityLabel: 'O tubo de raios X. Concluído.' });
    expect(view.queryByRole('button')).toBeNull();
    const image = view.getByRole('image');
    expect(image.props.accessibilityLabel).toBe('O tubo de raios X. Concluído.');
    expect(image.props.accessibilityValue).toEqual({ text: '3 estrelas' });
  });

  it('esconde ilustração, anel e estrelas: o rótulo do botão já diz tudo', () => {
    const view = renderMedal({ stars: 3, state: 'next', pulsing: true });
    const ring = view.getByTestId(RING, HIDDEN);
    expect(ring.props.importantForAccessibility).toBe('no-hide-descendants');
  });
});

describe('JourneyMedal — a ilustração', () => {
  it('passa tema e estado ao ThemeIllustration', () => {
    renderMedal({ theme: 'tomografia', state: 'next' });
    expect(illustration).toHaveBeenCalledWith(
      expect.objectContaining({ theme: 'tomografia', state: 'next' }),
      undefined,
    );
  });

  it('a medalha bloqueada passa state="locked" à ilustração', () => {
    renderMedal({ state: 'locked', disabled: true });
    expect(illustration).toHaveBeenCalledWith(expect.objectContaining({ state: 'locked' }), undefined);
  });

  it('desenha a ilustração com 72% do diâmetro da medalha', () => {
    renderMedal({ size: 34 });
    const props = illustration.mock.calls[0][0] as { size: number };
    expect(props.size).toBeCloseTo(0.72 * 68, 5);
  });

  it.each(['review', 'checkpoint', 'reward'] as const)('%s não monta ilustração de tema', (type) => {
    const view = renderMedal({ node: { id: 'n1', type } });
    expect(view.queryByTestId('theme-illustration')).toBeNull();
  });
});

describe('JourneyMedal — a forma', () => {
  function circles(view: ReturnType<typeof render>) {
    return view.UNSAFE_getAllByType(Circle).map((c) => c.props);
  }

  it('desenha lábio, face e miolo, com o lábio deslocado depth.medalLip para baixo', () => {
    const view = renderMedal({ state: 'done' });
    const [lip, face, , inner] = circles(view);
    expect(lip.fill).toBe(medalColors.gold.lip);
    expect(Number(lip.cy)).toBe(depth.medalLip);
    expect(face.fill).toBe(medalColors.gold.face);
    expect(inner.fill).toBe(medalColors.gold.inner);
    expect(Number(inner.r)).toBeCloseTo(34 * (37 / 46), 5);
  });

  it('usa o azul da unidade na próxima e o cinza no bloqueado', () => {
    expect(circles(renderMedal({ state: 'next' }))[1].fill).toBe(medalColors.unit.face);
    expect(circles(renderMedal({ state: 'locked', disabled: true }))[1].fill).toBe(medalColors.locked.face);
  });

  it('concluída e bloqueada nunca dividem a cor, e a bloqueada nunca é azul', () => {
    // Herdado do cartão que a medalha substituiu: até 2026-08-14 feito e
    // impedido eram o mesmo cartão cinza, e o azul num nó bloqueado o fazia
    // parecer clicável.
    for (const type of ['lesson', 'review', 'checkpoint', 'reward'] as const) {
      const done = circles(renderMedal({ node: { id: 'n1', type }, state: 'done' }))[1].fill;
      const locked = circles(renderMedal({ node: { id: 'n1', type }, state: 'locked', disabled: true }))[1].fill;
      expect(locked).not.toBe(done);
      expect(locked).not.toBe(medalColors.unit.face);
    }
  });

  it('o raio padrão é 34 e o Svg cobre a medalha mais o lábio', () => {
    const svg = renderMedal().UNSAFE_getByType(Svg);
    expect(Number(svg.props.width)).toBe(68);
    expect(Number(svg.props.height)).toBe(68 + depth.medalLip);
  });

  it('respeita o raio pedido (a próxima mede 40)', () => {
    const svg = renderMedal({ size: 40 }).UNSAFE_getByType(Svg);
    expect(Number(svg.props.width)).toBe(80);
  });

  it('a revisão é uma medalha de raio 30 com o ícone de revisão', () => {
    const view = renderMedal({ node: { id: 'r1', type: 'review' }, state: 'next' });
    expect(Number(view.UNSAFE_getByType(Svg).props.width)).toBe(60);
    expect(view.getByTestId('journey-medal-review-glyph')).toBeTruthy();
  });

  it('o checkpoint é de prata e traz o número da unidade', () => {
    const view = renderMedal({ node: { id: 'c1', type: 'checkpoint' }, state: 'done', unitNumber: 2 });
    expect(circles(view)[1].fill).toBe(medalColors.silver.face);
    expect(view.getByText('2', HIDDEN)).toBeTruthy();
  });

  it('o checkpoint bloqueado volta ao cinza do bloqueado', () => {
    const view = renderMedal({ node: { id: 'c1', type: 'checkpoint' }, state: 'locked', disabled: true, unitNumber: 2 });
    expect(circles(view)[1].fill).toBe(medalColors.locked.face);
  });

  it('a conquista é de ouro com a estrela', () => {
    const view = renderMedal({ node: { id: 'w1', type: 'reward' }, state: 'next' });
    expect(circles(view)[1].fill).toBe(medalColors.gold.face);
    expect(view.getByTestId('journey-medal-reward-glyph')).toBeTruthy();
  });
});

describe('JourneyMedal — o anel da próxima', () => {
  it('só monta o anel quando pulsing e state="next"', () => {
    expect(renderMedal({ state: 'next', pulsing: true }).queryByTestId(RING, HIDDEN)).not.toBeNull();
    expect(renderMedal({ state: 'next', pulsing: false }).queryByTestId(RING, HIDDEN)).toBeNull();
    expect(renderMedal({ state: 'done', pulsing: true }).queryByTestId(RING, HIDDEN)).toBeNull();
    expect(
      renderMedal({ state: 'locked', pulsing: true, disabled: true }).queryByTestId(RING, HIDDEN),
    ).toBeNull();
  });

  it('o anel nasce do tamanho da face', () => {
    const view = renderMedal({ state: 'next', pulsing: true, size: 40 });
    const style = StyleSheet.flatten(view.getByTestId(RING, HIDDEN).props.style);
    expect(style.width).toBe(80);
    expect(style.height).toBe(80);
    expect(style.borderColor).toBe(medalColors.unit.face);
  });

  it('pulsa de 1 a 1,18 em 1,6 s, sem fim', () => {
    renderMedal({ state: 'next', pulsing: true });
    const targets = reanimated.withTiming.mock.calls.map(([value, config]) => [value, config?.duration]);
    expect(targets).toContainEqual([1.18, 1600]);
    expect(targets).toContainEqual([0, 1600]);
    expect(reanimated.withRepeat).toHaveBeenCalledWith(expect.anything(), -1, false);
  });

  it('com "reduzir movimento" o anel não pulsa e fica invisível', () => {
    mockedReducedMotion.mockReturnValue(true);
    const view = renderMedal({ state: 'next', pulsing: true });
    expect(reanimated.withRepeat).not.toHaveBeenCalled();
    const style = StyleSheet.flatten(view.getByTestId(RING, HIDDEN).props.style);
    expect(style.opacity).toBe(0);
  });

  it('declara o easing de cada movimento', () => {
    renderMedal({ state: 'next', pulsing: true });
    const configs = reanimated.withTiming.mock.calls.map(([, config]) => config);
    expect(configs.length).toBeGreaterThan(0);
    configs.forEach((config) => expect(config?.easing).toBeDefined());
  });
});
