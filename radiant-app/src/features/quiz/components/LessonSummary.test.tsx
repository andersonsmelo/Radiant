import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { LessonSummary } from './LessonSummary';

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.mock('expo-linear-gradient', () => {
  const ReactActual = require('react') as typeof React;
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children, ...rest }: { children?: React.ReactNode }) =>
      ReactActual.createElement(View, rest, children),
  };
});

jest.mock('expo-image', () => {
  const ReactActual = require('react') as typeof React;
  const { View } = require('react-native');
  return {
    Image: (props: Record<string, unknown>) => ReactActual.createElement(View, props),
  };
});

// `false` (movimento normal) de propósito: os testes de animação de ganho
// abaixo precisam distinguir o efeito de `starsImproved` do de movimento
// reduzido, que é uma camada de acessibilidade separada e não faz parte do
// contrato desta tarefa.
jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: jest.fn(() => false),
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

const base = {
  stars: 2 as const,
  starsImproved: true,
  phrase: 'Muito bom.',
  xpAwarded: 30,
  correctAnswers: 9,
  totalQuestions: 10,
  unitCompleted: 7,
  unitTotal: 14,
  habitLine: 'Meta do dia fechada.',
  currentRating: null,
  onRate: jest.fn(),
  onContinue: jest.fn(),
};

describe('LessonSummary', () => {
  it('mostra os dois cards de placar da tentativa', () => {
    render(<LessonSummary {...base} />);
    expect(screen.getByText('9 de 10 corretas')).toBeTruthy();
    expect(screen.getByText('+30 XP nesta tentativa')).toBeTruthy();
  });

  it('mostra o progresso da unidade', () => {
    render(<LessonSummary {...base} />);
    expect(screen.getByText('7 de 14 lições')).toBeTruthy();
  });

  it('emite a nota escolhida', () => {
    const onRate = jest.fn();
    render(<LessonSummary {...base} onRate={onRate} />);
    fireEvent.press(screen.getByLabelText('Avaliar a aula com 4 de 5'));
    expect(onRate).toHaveBeenCalledWith(4);
  });

  it('não pede avaliação quando a lição já foi avaliada', () => {
    render(<LessonSummary {...base} currentRating={5} />);
    expect(screen.queryByLabelText('Avaliar a aula com 4 de 5')).toBeNull();
  });

  it('não renderiza oferta de assinatura nem pedido de notificação', () => {
    render(<LessonSummary {...base} />);
    expect(screen.queryByText(/Radiant Plus/)).toBeNull();
    expect(screen.queryByText(/notifica/i)).toBeNull();
  });

  it('não mostra texto de leitura sobre a faixa de comemoração', () => {
    render(<LessonSummary {...base} />);
    // A faixa carrega só a arte do Pixel; frase e subtítulo vivem no corpo.
    expect(screen.getByText('Muito bom.')).toBeTruthy();
    expect(screen.getByText('A lição foi concluída')).toBeTruthy();
  });

  it('anima o ganho das estrelas quando a marca melhorou', () => {
    render(<LessonSummary {...base} starsImproved />);
    expect(screen.getAllByTestId('lesson-summary-star-gain').length).toBe(3);
  });

  it('não anima as estrelas quando a marca não melhorou', () => {
    render(<LessonSummary {...base} starsImproved={false} />);
    expect(screen.queryAllByTestId('lesson-summary-star-gain').length).toBe(0);
  });
});
