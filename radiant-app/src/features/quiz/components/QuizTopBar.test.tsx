import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { galaxyColors } from '../../../ui/theme';
import { QuizTopBar } from './QuizTopBar';

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.mock('expo-linear-gradient', () => {
  const ReactActual = require('react') as typeof React;
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children, ...rest }: { children?: React.ReactNode }) =>
      ReactActual.createElement(View, rest, children),
  };
});

jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: jest.fn(() => true),
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
    interpolateColor: (value: number, _input: number[], colors: string[]) =>
      value >= 1 ? colors[1] : colors[0],
    withDelay: jest.fn((_delay: number, animation: unknown) => animation),
    withSequence: jest.fn((...animations: unknown[]) => animations.at(-1)),
    withTiming: jest.fn((value: unknown) => value),
  };
});

describe('QuizTopBar', () => {
  it('chama onClose ao tocar em fechar', () => {
    const onClose = jest.fn();
    render(<QuizTopBar questionIndex={0} totalQuestions={5} hearts={3} maxHearts={5} onClose={onClose} />);
    fireEvent.press(screen.getByLabelText('Fechar quiz'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('não anuncia progresso pela barra', () => {
    render(<QuizTopBar questionIndex={2} totalQuestions={5} hearts={3} maxHearts={5} onClose={jest.fn()} />);
    expect(screen.queryByLabelText(/Questão 3 de 5/)).toBeNull();
  });
});

// A spec da 1.4 (estado ILIMITADA): "∞; corações somem; errar não custa". Quem
// decide é o `HeartsSnapshot.status` — o mesmo predicado que faz o `spend` não
// descontar —, então pendente e expirado chegam aqui como vidas comuns.
describe('QuizTopBar — vidas por estado da assinatura', () => {
  it('assinante vê ∞ e nenhum coração', () => {
    render(<QuizTopBar questionIndex={0} totalQuestions={5} hearts={0} maxHearts={5} unlimited onClose={jest.fn()} />);

    expect(screen.getByLabelText('Vidas ilimitadas')).toBeTruthy();
    expect(screen.getByText('∞')).toBeTruthy();
    expect(screen.queryByTestId('hud-heart-0')).toBeNull();
    expect(screen.queryByLabelText(/de 5 vidas/)).toBeNull();
  });

  it('sem assinatura ativa vê as vidas e nenhum ∞', () => {
    render(<QuizTopBar questionIndex={0} totalQuestions={5} hearts={3} maxHearts={5} onClose={jest.fn()} />);

    expect(screen.getByLabelText('3 de 5 vidas')).toBeTruthy();
    expect(screen.getByTestId('hud-heart-0')).toBeTruthy();
    expect(screen.queryByText('∞')).toBeNull();
    expect(screen.queryByLabelText('Vidas ilimitadas')).toBeNull();
  });
});


describe('QuizTopBar — pílula Medalhão compartilhada com o HUD', () => {
  it.each([0, 1, 3, 5])('desenha um coração e a contagem %i uma vez no cabeçalho da aula', (hearts) => {
    const rendered = render(<QuizTopBar questionIndex={0} totalQuestions={5} hearts={hearts} maxHearts={5} onClose={jest.fn()} />);
    expect(rendered.getAllByTestId(/^hud-heart-\d+$/u, { includeHiddenElements: true })).toHaveLength(1);
    expect(rendered.getAllByText(String(hearts))).toHaveLength(1);
    expect(rendered.getByLabelText(`${hearts} de 5 vidas`)).toBeTruthy();
    expect(rendered.queryByText('∞')).toBeNull();
  });

  it('preserva maxHearts e a superfície da pílula ao anunciar a contagem', () => {
    const rendered = render(<QuizTopBar questionIndex={1} totalQuestions={4} hearts={2} maxHearts={7} onClose={jest.fn()} />);
    const label = rendered.getByLabelText('2 de 7 vidas');
    expect(StyleSheet.flatten(label.props.style)).toMatchObject({
      backgroundColor: galaxyColors.hudPill,
      borderColor: galaxyColors.hudPillBorder,
      borderWidth: 1,
      borderRadius: 20,
    });
    expect(rendered.getAllByText('2')).toHaveLength(1);
  });

  it.each([0, 5])('no ilimitado count%i não desenha coração ou número', (hearts) => {
    const rendered = render(<QuizTopBar questionIndex={0} totalQuestions={5} hearts={hearts} maxHearts={5} unlimited onClose={jest.fn()} />);
    expect(rendered.queryAllByTestId(/^hud-heart-\d+$/u, { includeHiddenElements: true })).toHaveLength(0);
    expect(rendered.queryByText(String(hearts))).toBeNull();
    expect(rendered.getAllByLabelText('Vidas ilimitadas')).toHaveLength(1);
    expect(rendered.getAllByText('∞')).toHaveLength(1);
  });
});
