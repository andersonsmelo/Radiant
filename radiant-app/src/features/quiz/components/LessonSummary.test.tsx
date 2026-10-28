import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ScrollView, StyleSheet } from 'react-native';
import { LessonSummary } from './LessonSummary';
import { DecorativeIcon } from '../../../components/ui/DecorativeIcon';
import { JourneyMedal } from '../../journey/components/JourneyMedal';
import { Circle } from 'react-native-svg';
import { medalColors } from '../../../ui/theme';
import { useReducedMotionPreferenceState } from '../../../ui/accessibility/useReducedMotionPreference';
import { space } from '../../../ui/styles';
import { semanticColors } from '../../../ui/semantic-colors';

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.mock('../../../ui/illustrations/ThemeIllustration', () => ({ ThemeIllustration: () => null }));
jest.mock('../../../ui/useScreenFocused', () => ({ useScreenFocused: () => true }));

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
    interpolateColor: (value: number, _input: number[], colors: string[]) =>
      value >= 1 ? colors[1] : colors[0],
    withDelay: jest.fn((_delay: number, animation: unknown) => animation),
    withSequence: jest.fn((...animations: unknown[]) => animations.at(-1)),
    withTiming: jest.fn((value: unknown) => value),
    withSpring: jest.fn((value: unknown) => value),
  };
});

const reanimated = jest.requireMock('react-native-reanimated') as { withSpring: jest.Mock; withTiming: jest.Mock };
const reducedMotion = useReducedMotionPreferenceState as jest.MockedFunction<typeof useReducedMotionPreferenceState>;
const starEntries = () => reanimated.withTiming.mock.calls.filter(([, config]) => config?.duration === 220);

const base = {
  title: 'Tubo de raios X',
  theme: 'tubo' as const,
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
  nextReviewInDays: 3,
};

describe('LessonSummary', () => {
  beforeEach(() => {
    reanimated.withSpring.mockClear();
    reanimated.withTiming.mockClear();
    reducedMotion.mockReturnValue({ reducedMotionEnabled: false, resolved: true });
    base.onRate.mockClear();
    base.onContinue.mockClear();
  });

  it('mostra os resultados da tentativa', () => {
    render(<LessonSummary {...base} />);
    expect(screen.getByText('9 de 10 corretas')).toBeTruthy();
    expect(screen.getByText('+30 XP')).toBeTruthy();
  });

  it('mostra "Sem XP nesta tentativa" quando xpAwarded ainda não chegou', () => {
    // xpAward chega assíncrono de useQuiz/GamificationService; até resolver
    // (ou numa repetição que não concede XP), a tela não pode mostrar
    // "+0 XP" — essa era a regressão: copy honesta trocada por um zero que
    // pisca. Ver Minor do review final.
    render(<LessonSummary {...base} xpAwarded={null} />);
    expect(screen.getByText('Sem XP nesta tentativa')).toBeTruthy();
    expect(screen.queryByText(/\+.* XP/)).toBeNull();
  });

  it('reconhece a conclusão sem exibir ganho zero de XP', () => {
    render(<LessonSummary {...base} xpAwarded={0} />);
    expect(screen.getByText('Progresso registrado')).toBeTruthy();
    expect(screen.queryByText(/\+.* XP/)).toBeNull();
  });

  it('agrupa cada resultado em uma linha acessível factual', () => {
    render(<LessonSummary {...base} />);
    expect(screen.getByLabelText('Respostas corretas: 9 de 10 corretas')).toBeTruthy();
    expect(screen.getByLabelText('XP: +30 XP nesta tentativa')).toBeTruthy();
    expect(screen.getByLabelText('Progresso da unidade: 7 de 14 etapas')).toBeTruthy();
  });

  it('mantém a celebração no conteúdo rolável junto dos resultados', () => {
    render(<LessonSummary {...base} />);
    const pixel = screen.getByLabelText('Pixel comemorando');
    let ancestor = pixel.parent;
    while (ancestor && ancestor.type !== ScrollView) ancestor = ancestor.parent;
    expect(ancestor).not.toBeNull();
  });

  it('permite continuar sem avaliar e usa orientação neutra para os consumidores compartilhados', () => {
    const onContinue = jest.fn();
    const onRate = jest.fn();
    render(<LessonSummary {...base} onContinue={onContinue} onRate={onRate} />);
    expect(screen.getByText('Avalie a aula')).toBeTruthy();
    expect(screen.getByText('É opcional')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));
    expect(onContinue).toHaveBeenCalledTimes(1);
    expect(onRate).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Continuar' }).props.accessibilityHint)
      .toBe('Continua o estudo');
  });

  it('comunica o destino fornecido pelo chamador e preserva o callback', () => {
    const onContinue = jest.fn();
    render(<LessonSummary {...base} continueHint="Volta para Estude" onContinue={onContinue} />);
    const button = screen.getByRole('button', { name: 'Continuar' });
    expect(button.props.accessibilityHint).toBe('Volta para Estude');
    fireEvent.press(button);
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('preserva uma repetição sem ganho de XP ou nova melhora de estrelas', () => {
    render(<LessonSummary {...base} xpAwarded={0} starsImproved={false} currentRating={4} />);
    expect(screen.getByText('Progresso registrado')).toBeTruthy();
    expect(screen.getByText('7 de 14 etapas')).toBeTruthy();
    expect(screen.getByText('Você avaliou esta aula com 4 de 5')).toBeTruthy();
    expect(screen.queryByText(/\+.* XP/)).toBeNull();
    expect(reanimated.withSpring).not.toHaveBeenCalled();
    expect(starEntries()).toHaveLength(0);
    expect(base.onRate).not.toHaveBeenCalled();
    expect(base.onContinue).not.toHaveBeenCalled();
  });

  it.each([null, undefined])('omite revisão sem intervalo real (%s)', (nextReviewInDays) => {
    render(<LessonSummary {...base} nextReviewInDays={nextReviewInDays} habitLine={null} />);
    expect(screen.queryByText(/Próxima revisão/)).toBeNull();
    expect(screen.queryByText('Meta do dia fechada.')).toBeNull();
  });

  it.each<[number, string]>([[1, 'dia'], [7, 'dias'], [0, 'dias']])(
    'usa o intervalo fornecido de %s %s sem fixar um dia', (days, noun) => {
      render(<LessonSummary {...base} nextReviewInDays={days} />);
      expect(screen.getByText(`Próxima revisão em ${days} ${noun}`)).toBeTruthy();
    },
  );

  // Resumo honesto (ADR de 2026-10-16): as estrelas e a frase são desta
  // tentativa; o recorde, quando maior, vem numa linha à parte.
  it('mostra o recorde à parte quando a tentativa ficou abaixo dele', () => {
    render(<LessonSummary {...base} stars={0} recordStars={3} starsImproved={false} />);
    expect(screen.getByLabelText('0 de 3 estrelas')).toBeTruthy();
    expect(screen.getByText('Seu recorde nesta lição: 3 estrelas')).toBeTruthy();
  });

  it('não repete o recorde quando a tentativa o igualou ou superou', () => {
    render(<LessonSummary {...base} stars={2} recordStars={2} />);
    expect(screen.queryByText(/Seu recorde/u)).toBeNull();
  });

  it('na revisão, diz que a revisão terminou e não pede avaliação de aula', () => {
    render(<LessonSummary {...base} kind="review" />);
    expect(screen.getByText('Revisão concluída')).toBeTruthy();
    expect(screen.queryByText('A lição foi concluída')).toBeNull();
    expect(screen.queryByText('Avalie a aula')).toBeNull();
  });

  it('mostra o progresso da unidade', () => {
    render(<LessonSummary {...base} />);
    expect(screen.getByText('7 de 14 etapas')).toBeTruthy();
  });

  it('mostra quando a próxima revisão foi agendada', () => {
    render(<LessonSummary {...base} />);
    expect(screen.getByText('Próxima revisão em 3 dias')).toBeTruthy();
  });

  it('não renderiza o card de progresso da unidade quando unitTotal é 0', () => {
    // unitTotal fica 0 quando a leitura da jornada falha ou quando a lição
    // não mapeia para nenhum nó da trilha (ex.: /quiz por deep link direto
    // sem nó correspondente) — nenhum dos dois casos pode produzir o
    // literal "0 de 0 lições" na tela. Ver Achado Importante 2 do review.
    render(<LessonSummary {...base} unitCompleted={0} unitTotal={0} />);
    expect(screen.queryByText(/de 0 etapas/)).toBeNull();
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
    expect(screen.queryByText('É opcional')).toBeNull();
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
    expect(screen.getByText('Você avançou. Vale reforçar os pontos que faltaram.')).toBeTruthy();
    expect(screen.getByText('A lição foi concluída')).toBeTruthy();
  });

  it('cunha uma vez e assenta somente as estrelas preenchidas, sem mola nelas', () => {
    const view = render(<LessonSummary {...base} stars={2} starsImproved />);
    expect(reanimated.withSpring).toHaveBeenCalledTimes(1);
    expect(starEntries()).toHaveLength(2);
    const mintCount = reanimated.withSpring.mock.calls.length;
    const starCount = starEntries().length;
    fireEvent.press(screen.getByLabelText('Avaliar a aula com 4 de 5'));
    view.rerender(<LessonSummary {...base} stars={2} currentRating={4} />);
    expect(reanimated.withSpring).toHaveBeenCalledTimes(mintCount);
    expect(starEntries()).toHaveLength(starCount);
  });

  it('não encena ganho em uma repetição sem melhora', () => {
    render(<LessonSummary {...base} starsImproved={false} xpAwarded={0} />);
    expect(reanimated.withSpring).not.toHaveBeenCalled();
    expect(starEntries()).toHaveLength(0);
  });

  it('movimento reduzido preserva medalha, estrelas e pose final sem cunhar', () => {
    reducedMotion.mockReturnValue({ reducedMotionEnabled: true, resolved: true });
    const view = render(<LessonSummary {...base} />);
    expect(view.UNSAFE_getByType(JourneyMedal).props.state).toBe('done');
    expect(screen.getByLabelText('Pixel comemorando')).toBeTruthy();
    expect(screen.getByLabelText('2 de 3 estrelas')).toBeTruthy();
    expect(reanimated.withSpring).not.toHaveBeenCalled();
    expect(starEntries()).toHaveLength(0);
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

  // A lição de 0 estrela conta como concluída na trilha; a copy diz a verdade
  // sobre o estado e deixa a honestidade sobre o resultado para a faixa, o
  // Pixel e a frase. Os roteiros Maestro afirmam este subtítulo depois de erro.
  it('com 0 estrelas mantém a conclusão, a régua e medalha neutra sem fingir bloqueio', () => {
    const view = render(<LessonSummary {...base} stars={0} correctAnswers={0} starsImproved />);
    expect(screen.getByText('A lição foi concluída')).toBeTruthy();
    expect(screen.getByLabelText('0 de 3 estrelas')).toBeTruthy();
    expect(screen.queryByText(/quase|bloquead|não fechou/i)).toBeNull();
    const medal = view.UNSAFE_getByType(JourneyMedal);
    expect(medal.props.state).toBe('done');
    expect(medal.props.disabled).not.toBe(true);
    const face = view.UNSAFE_getAllByType(Circle)[1];
    expect(face.props.fill).toBe(medalColors.silver.face);
    expect(screen.queryByLabelText('Pixel comemorando')).toBeNull();
    expect(reanimated.withSpring).not.toHaveBeenCalled();
    expect(starEntries()).toHaveLength(0);
  });

  it.each([0, 1, 2, 3] as const)('mostra o tema, o título real e a régua completa com %s estrelas', stars => {
    const view = render(<LessonSummary {...base} stars={stars} />);
    expect(screen.getByRole('header', { name: 'Tubo de raios X' })).toBeTruthy();
    expect(screen.getByLabelText(`${stars} de 3 estrelas`)).toBeTruthy();
    const icons = screen.getByLabelText(`${stars} de 3 estrelas`).findAllByType(DecorativeIcon);
    expect(icons.filter((icon: { props: { name: string } }) => icon.props.name === 'star')).toHaveLength(stars);
    expect(icons.filter((icon: { props: { name: string } }) => icon.props.name === 'star-border')).toHaveLength(3 - stars);
    expect(view.UNSAFE_getByType(JourneyMedal).props.theme).toBe('tubo');
    if (stars > 0) expect(view.UNSAFE_getAllByType(Circle)[1].props.fill).toBe(medalColors.gold.face);
  });

  it('mostra XP real grande e sem card, separado das linhas factuais', () => {
    render(<LessonSummary {...base} />);
    const xp = screen.getByText('+30 XP');
    expect(StyleSheet.flatten(xp.props.style).fontSize).toBeGreaterThanOrEqual(32);
    let ancestor = xp.parent;
    while (ancestor && ancestor.type !== ScrollView) {
      const style = StyleSheet.flatten(ancestor.props.style) ?? {};
      expect(style.borderWidth ?? 0).toBe(0);
      expect(style.backgroundColor).toBeUndefined();
      ancestor = ancestor.parent;
    }
  });

  it('a revisão mantém medalha e título sem montar Pixel', () => {
    const view = render(<LessonSummary {...base} kind="review" />);
    expect(screen.getByRole('header', { name: 'Tubo de raios X' })).toBeTruthy();
    expect(view.UNSAFE_getByType(JourneyMedal).props.theme).toBe('tubo');
    expect(screen.queryByLabelText(/Pixel/)).toBeNull();
  });

  it('o título e a frase aceitam texto máximo sem truncamento nem teto de escala', () => {
    render(<LessonSummary {...base} title="Tubo de raios X e produção da radiação em diferentes situações" />);
    const title = screen.getByRole('header');
    expect(title.props.numberOfLines).toBeUndefined();
    expect(title.props.maxFontSizeMultiplier).toBeUndefined();
    expect(screen.getByText('Você avançou. Vale reforçar os pontos que faltaram.').props.maxFontSizeMultiplier).toBeUndefined();
  });

  it.each([
    ['Colimação', 'Sora-ExtraBold', 32, '800'],
    ['Três estrelas. Nada passou despercebido.', 'Sora-Regular', 16, '400'],
    ['A lição foi concluída', 'Sora-Regular', 16, '400'],
  ] as const)('AX5 deixa a fonte determinar a altura de %s sem limitar a leitura', (label, fontFamily, fontSize, fontWeight) => {
    const dimensions = jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({
      width: 402, height: 874, scale: 3, fontScale: 3.1,
    });
    try {
      render(<LessonSummary {...base} title="Colimação" stars={3} correctAnswers={4}
        totalQuestions={4} phrase="Três estrelas. Nada passou despercebido." xpAwarded={null} unitTotal={0} />);
      const text = screen.getByText(label);
      // Drivers do Text que chega ao nativo, não um espelho de props do componente.
      // RN/iOS transforma lineHeight explícito em min/max do parágrafo. A
      // legibilidade dos glifos continua dependendo da remedição nativa AX5.
      const style = StyleSheet.flatten(text.props.style);
      expect(style).toMatchObject({ fontFamily, fontSize, fontWeight });
      expect(style.lineHeight).toBeUndefined();
      expect(text.props.allowFontScaling).not.toBe(false);
      expect(text.props.maxFontSizeMultiplier).toBeUndefined();
      expect(text.props.numberOfLines).toBeUndefined();
      expect(text.props.adjustsFontSizeToFit).not.toBe(true);
      let ancestor = text;
      while (ancestor.type !== ScrollView) {
        const metrics = StyleSheet.flatten(ancestor.props.style) ?? {};
        expect(metrics.height).toBeUndefined();
        expect(metrics.maxHeight).toBeUndefined();
        expect(metrics.overflow).not.toBe('hidden');
        expect(ancestor.parent).not.toBeNull();
        ancestor = ancestor.parent!;
      }
      const content = StyleSheet.flatten(ancestor.props.contentContainerStyle);
      expect(content.height).toBeUndefined();
      expect(content.maxHeight).toBeUndefined();
      expect(content.overflow).not.toBe('hidden');
    } finally {
      dimensions.mockRestore();
    }
  });
});



it('M6 oferece Refazer somente para resultado incompleto de lição e executa a ação', () => {
  const retry = jest.fn();
  const { rerender } = render(<LessonSummary {...base} correctAnswers={1} totalQuestions={2} onRetry={retry} />);
  fireEvent.press(screen.getByRole('button', { name: 'Refazer' }));
  expect(retry).toHaveBeenCalledTimes(1);
  expect(screen.getByText('1 de 2 corretas')).toBeTruthy();
  rerender(<LessonSummary {...base} correctAnswers={2} totalQuestions={2} onRetry={retry} />);
  expect(screen.queryByRole('button', { name: 'Refazer' })).toBeNull();
  expect(screen.getByText('2 de 2 corretas')).toBeTruthy();
  rerender(<LessonSummary {...base} kind="review" correctAnswers={0} totalQuestions={2} onRetry={retry} />);
  expect(screen.queryByRole('button', { name: 'Refazer' })).toBeNull();
  expect(screen.getByText('Revisão concluída')).toBeTruthy();
});

it('M7 resultado parcial com estrelas não anuncia aprovação nem domínio', () => {
  render(<LessonSummary {...base} stars={1} correctAnswers={1} totalQuestions={2}
    phrase="Passou! Dá para apertar o resultado repetindo." />);
  expect(screen.queryByText(/Passou!/)).toBeNull();
  expect(screen.getByText('Você avançou. Vale reforçar os pontos que faltaram.')).toBeTruthy();
  expect(screen.getByText('1 de 2 corretas')).toBeTruthy();
});

it('C2 Refazer é a ação secundária: Continuar segue como a principal', () => {
  render(<LessonSummary {...base} correctAnswers={1} totalQuestions={2} onRetry={jest.fn()} />);
  const refazer = StyleSheet.flatten(screen.getByRole('button', { name: 'Refazer' }).props.style);
  const continuar = StyleSheet.flatten(screen.getByRole('button', { name: 'Continuar' }).props.style);
  expect(continuar.backgroundColor).toBe(semanticColors.galaxy.actionPrimary);
  expect(refazer.backgroundColor).toBe(semanticColors.galaxy.surfaceElevated);
  expect(refazer.borderWidth).toBe(1);
});

describe('T05 Dynamic Type no resultado já aberto', () => {
  beforeEach(() => {
    reanimated.withSpring.mockClear();
    reanimated.withTiming.mockClear();
    reducedMotion.mockReturnValue({ reducedMotionEnabled: false, resolved: true });
    base.onRate.mockClear();
    base.onContinue.mockClear();
  });

  // A escala muda os parágrafos nativos, não a conquista nem os controles.
  // Remover a renovação dos Text deve manter estes hosts antigos e falhar.
  it.each([[1, 3.1], [3.1, 2.5]])('renova todos os parágrafos próprios em %s → %s, inclusive entre escalas grandes', (from, to) => {
    const window = { width: 402, height: 874, scale: 3, fontScale: from };
    const dimensions = jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue(window);
    const labels = [
      'Tubo de raios X',
      'Você avançou. Vale reforçar os pontos que faltaram.',
      'A lição foi concluída',
      'Seu recorde nesta lição: 3 estrelas',
      '+30 XP',
      'Respostas corretas',
      '9 de 10 corretas',
      'Progresso da unidade',
      '7 de 14 etapas',
      'Meta do dia fechada.',
      'Próxima revisão em 3 dias',
      'Avalie a aula',
      'É opcional',
    ];
    try {
      const { rerender } = render(<LessonSummary {...base} recordStars={3} />);
      const before = new Map(labels.map(label => [label, screen.getByText(label)]));
      window.fontScale = to;
      rerender(<LessonSummary {...base} recordStars={3} />);
      // Identidade pública do host montado; não lê key/fiber nem rasteriza fontes.
      const staleParagraphs = labels.filter(label => screen.getByText(label) === before.get(label));
      expect(staleParagraphs).toEqual([]);
    } finally {
      dimensions.mockRestore();
    }
  });

  it.each([
    [null, 'Sem XP nesta tentativa'],
    [0, 'Progresso registrado'],
    [30, '+30 XP'],
  ] as const)('renova subtítulo de revisão e XP %s sem montar Pixel', (xpAwarded, label) => {
    const window = { width: 402, height: 874, scale: 3, fontScale: 3.1 };
    const dimensions = jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue(window);
    try {
      const { rerender } = render(<LessonSummary {...base} kind="review" xpAwarded={xpAwarded} />);
      const subtitle = screen.getByText('Revisão concluída');
      const xp = screen.getByText(label);
      const cta = screen.getByRole('button', { name: 'Continuar' });
      window.fontScale = 2.5;
      rerender(<LessonSummary {...base} kind="review" xpAwarded={xpAwarded} />);
      expect([
        screen.getByText('Revisão concluída') === subtitle ? 'subtítulo' : null,
        screen.getByText(label) === xp ? 'XP' : null,
      ].filter(Boolean)).toEqual([]);
      expect(screen.queryByLabelText(/Pixel/)).toBeNull();
      expect(screen.getByRole('button', { name: 'Continuar' }) === cta).toBe(true);
    } finally {
      dimensions.mockRestore();
    }
  });

  it('mantém scroll, conquista, controles e avaliação ao renovar só o texto, sem repetir ganho', () => {
    const window = { width: 402, height: 874, scale: 3, fontScale: 1 };
    const dimensions = jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue(window);
    try {
      const view = render(<LessonSummary {...base} />);
      const scroll = view.UNSAFE_getByType(ScrollView);
      const medal = view.UNSAFE_getByType(JourneyMedal);
      const stars = screen.getByLabelText('2 de 3 estrelas');
      const cta = screen.getByRole('button', { name: 'Continuar' });
      const rating = screen.getByRole('button', { name: 'Avaliar a aula com 3 de 5' });
      expect(reanimated.withSpring).toHaveBeenCalledTimes(1);
      expect(starEntries()).toHaveLength(2);
      fireEvent.press(rating);
      expect(base.onRate).toHaveBeenCalledTimes(1);
      expect(base.onRate).toHaveBeenLastCalledWith(3);

      for (const fontScale of [3.1, 2.5]) {
        window.fontScale = fontScale;
        view.rerender(<LessonSummary {...base} />);
        expect(view.UNSAFE_getByType(ScrollView) === scroll).toBe(true);
        expect(view.UNSAFE_getByType(JourneyMedal) === medal).toBe(true);
        expect(screen.getByLabelText('2 de 3 estrelas') === stars).toBe(true);
        expect(screen.getByRole('button', { name: 'Continuar' }) === cta).toBe(true);
        expect(screen.getByRole('button', { name: 'Avaliar a aula com 3 de 5' }) === rating).toBe(true);
        expect(reanimated.withSpring).toHaveBeenCalledTimes(1);
        expect(starEntries()).toHaveLength(2);
        expect(base.onRate).toHaveBeenCalledTimes(1);
        expect(base.onContinue).not.toHaveBeenCalled();
      }

      const title = screen.getByRole('header');
      view.rerender(<LessonSummary {...base} />);
      expect(screen.getByRole('header') === title).toBe(true);
      view.rerender(<LessonSummary {...base} currentRating={3} />);
      const given = screen.getByText('Você avaliou esta aula com 3 de 5');
      window.fontScale = 1;
      view.rerender(<LessonSummary {...base} currentRating={3} />);
      expect(screen.getByText('Você avaliou esta aula com 3 de 5') === given).toBe(false);
      expect(screen.queryByRole('button', { name: 'Avaliar a aula com 3 de 5' })).toBeNull();
      expect(reanimated.withSpring).toHaveBeenCalledTimes(1);
      expect(starEntries()).toHaveLength(2);
      expect(base.onRate).toHaveBeenCalledTimes(1);
      fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));
      expect(base.onContinue).toHaveBeenCalledTimes(1);
    } finally {
      dimensions.mockRestore();
    }
  });
});
