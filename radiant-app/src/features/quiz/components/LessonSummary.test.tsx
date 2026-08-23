import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ScrollView, StyleSheet } from 'react-native';
import { LessonSummary } from './LessonSummary';
import { space } from '../../../ui/styles';

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

// Mocka `useScalePop` para poder afirmar o COMPORTAMENTO da animação de
// ganho (chamadas a `animateIn`/`scale.setValue`), não um testID que só
// espelha a prop `animate` de volta — ver os testes "anima"/"não anima"
// abaixo e o Achado Importante 4 do review final. Nomes precisam começar
// com `mock` para o Jest permitir a referência dentro da factory.
const mockAnimateIn = jest.fn();
const mockSetValue = jest.fn();

jest.mock('../../../ui/motion', () => ({
  duration: { micro: 0, ui: 0, celebrate: 0 },
  useScalePop: () => ({
    scale: { setValue: mockSetValue },
    style: {},
    animateIn: mockAnimateIn,
  }),
}));

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
  beforeEach(() => {
    mockAnimateIn.mockClear();
    mockSetValue.mockClear();
  });

  it('mostra os dois cards de placar da tentativa', () => {
    render(<LessonSummary {...base} />);
    expect(screen.getByText('9 de 10 corretas')).toBeTruthy();
    expect(screen.getByText('+30 XP nesta tentativa')).toBeTruthy();
  });

  it('mostra "Sem XP nesta tentativa" quando xpAwarded ainda não chegou', () => {
    // xpAward chega assíncrono de useQuiz/GamificationService; até resolver
    // (ou numa repetição que não concede XP), a tela não pode mostrar
    // "+0 XP" — essa era a regressão: copy honesta trocada por um zero que
    // pisca. Ver Minor do review final.
    render(<LessonSummary {...base} xpAwarded={null} />);
    expect(screen.getByText('Sem XP nesta tentativa')).toBeTruthy();
    expect(screen.queryByText(/\+0 XP/)).toBeNull();
  });

  it('reconhece a conclusão sem exibir ganho zero de XP', () => {
    render(<LessonSummary {...base} xpAwarded={0} />);
    expect(screen.getByText('Progresso registrado')).toBeTruthy();
    expect(screen.queryByText(/\+0 XP/)).toBeNull();
  });

  it('mostra o progresso da unidade', () => {
    render(<LessonSummary {...base} />);
    expect(screen.getByText('7 de 14 etapas')).toBeTruthy();
  });

  it('não renderiza o card de progresso da unidade quando unitTotal é 0', () => {
    // unitTotal fica 0 quando a leitura da jornada falha ou quando a lição
    // não mapeia para nenhum nó da trilha (ex.: /quiz por deep link direto
    // sem nó correspondente) — nenhum dos dois casos pode produzir o
    // literal "0 de 0 lições" na tela. Ver Achado Importante 2 do review.
    render(<LessonSummary {...base} unitCompleted={0} unitTotal={0} />);
    expect(screen.queryByText(/de 0 lições/)).toBeNull();
    expect(screen.queryByText('Progresso da unidade')).toBeNull();
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

  it('mostra o rótulo visível "Avalie a aula" só quando ainda não há nota', () => {
    // O `accessibilityLabel` de cada estrela ("Avaliar a aula com N de 5")
    // nunca foi um rótulo visível — só leitor de tela o alcança. Sem texto
    // de leitura acima da linha, a tela renderiza cinco estrelas cinzas sem
    // nenhuma pista do que fazem. Achado Importante 1 do QA visual.
    const { rerender } = render(<LessonSummary {...base} currentRating={null} />);
    expect(screen.getByText('Avalie a aula')).toBeTruthy();

    // E o convite não pode sobreviver a uma nota já dada — pedir de novo o
    // que já foi respondido é incoerente com "Você avaliou esta aula...".
    rerender(<LessonSummary {...base} currentRating={4} />);
    expect(screen.queryByText('Avalie a aula')).toBeNull();
  });

  it('reserva no scroll espaço suficiente para o botão fixo não cobrir o fim do conteúdo', () => {
    // O rodapé com `Continuar` fica fora do ScrollView, fixo na base da tela
    // (padding vertical space.s3 * 2 + altura do AppButton, 56px). Sem essa
    // reserva no `contentContainerStyle`, a linha de hábito renderiza cortada
    // e a linha de avaliação fica invisível atrás do botão no primeiro paint
    // — Achado Importante 2 do QA visual. Este teste não importa a constante
    // `ctaClearance` do componente de propósito: comparar contra o footprint
    // real do rodapé é o que faz o teste falhar se a reserva for removida ou
    // reduzida de volta a um valor que não cobre o botão.
    render(<LessonSummary {...base} />);
    const scrollView = screen.UNSAFE_getByType(ScrollView);
    const contentStyle = StyleSheet.flatten(scrollView.props.contentContainerStyle);
    const FOOTER_FOOTPRINT = space.s3 * 2 + 56;
    expect(contentStyle.paddingBottom).toBeGreaterThanOrEqual(FOOTER_FOOTPRINT);
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
    // Afirma o COMPORTAMENTO real (animateIn chamado, scale.setValue não),
    // não um testID que só refletia de volta a prop `animate` — esse era o
    // teste tautológico do Achado Importante 4: um testID condicional prova
    // apenas que o `? :` existe, nunca que a animação de fato acontece.
    render(<LessonSummary {...base} starsImproved />);
    expect(mockAnimateIn).toHaveBeenCalledTimes(3);
    expect(mockSetValue).not.toHaveBeenCalled();
  });

  it('não anima as estrelas quando a marca não melhorou — a escala vai direto para 1', () => {
    render(<LessonSummary {...base} starsImproved={false} />);
    expect(mockAnimateIn).not.toHaveBeenCalled();
    expect(mockSetValue).toHaveBeenCalledTimes(3);
    expect(mockSetValue).toHaveBeenCalledWith(1);
  });

  it('expõe a contagem de estrelas como rótulo de acessibilidade único', () => {
    // DecorativeIcon esconde cada estrela individual da árvore de
    // acessibilidade (accessibilityElementsHidden), então sem este rótulo no
    // container o resultado principal da tela — quantas estrelas o aluno
    // ganhou — não existe em lugar nenhum para leitor de tela. Ver Achado
    // Importante 3 do review final; padrão igual ao HUDPill em ui/components/HUD.tsx.
    render(<LessonSummary {...base} stars={2} />);
    expect(screen.getByLabelText('2 de 3 estrelas')).toBeTruthy();
  });
});
