import React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { render } from '@testing-library/react-native';
import { JourneyTrailSpine } from './JourneyTrailSpine';
import { JourneyNodeCard } from './JourneyNodeCard';
import { galaxyColors } from '../../../ui/theme';

// Tamanho de fonte do sistema simulado: `fontScale` é o que o iOS entrega a
// `useWindowDimensions` quando o aluno aumenta o texto (XXXL ≈ 1,35; AX5 ≈ 3,1).
const mockWindow = { width: 402, height: 874, scale: 3, fontScale: 1 };
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: () => mockWindow,
}));
afterEach(() => {
  mockWindow.fontScale = 1;
});

function nearestHostParent(node: { parent: unknown } | null | undefined): { props: { style?: StyleProp<ViewStyle> } } | undefined {
  let current = node?.parent as { type?: unknown; parent: unknown; props: { style?: StyleProp<ViewStyle> } } | null | undefined;
  while (current && typeof current.type !== 'string') current = current.parent as typeof current;
  return current ?? undefined;
}


function styleOf(screen: ReturnType<typeof render>) {
  return StyleSheet.flatten(
    screen.getByTestId('journey-spine', { includeHiddenElements: true }).props.style,
  );
}

describe('JourneyTrailSpine — os segmentos se encostam e formam uma linha só', () => {
  // O que este componente substitui: trechos pontilhados desenhados APENAS nas
  // folgas entre os nós. Mesmo sólidos, eles nasciam cortados — nas alturas dos
  // cartões não havia trecho nenhum. Aqui cada nó carrega o seu segmento, que
  // cobre a altura do cartão E transborda para dentro da folga seguinte. É o
  // transbordo que costura um segmento no outro: sem ele a linha volta a ser
  // uma sequência de tracinhos.

  it('transborda para a folga seguinte, para encostar no segmento de baixo', () => {
    expect(styleOf(render(<JourneyTrailSpine traveled position="middle" gap={12} />)).bottom).toBe(
      -12,
    );
  });

  it('começa na âncora do primeiro nó, e não acima dele', () => {
    // Sem isto a linha nasce um pedaço acima do primeiro cartão, solta.
    expect(styleOf(render(<JourneyTrailSpine traveled position="first" gap={12} />)).top).toBe('50%');
  });

  it('termina na âncora do último nó, e não abaixo dele', () => {
    const style = styleOf(render(<JourneyTrailSpine traveled={false} position="last" gap={12} />));

    expect(style.bottom).toBe('50%');
    expect(style.top).toBe(0);
  });

  it('um percurso de um nó só não desenha linha nenhuma', () => {
    // Não há o que ligar. Um segmento aqui seria um traço atravessando o único
    // cartão, sem começo nem fim.
    const screen = render(<JourneyTrailSpine traveled position="only" gap={12} />);

    expect(screen.queryByTestId('journey-spine', { includeHiddenElements: true })).toBeNull();
  });

  it('usa a cor de concluído no trecho andado e a do trilho no que falta', () => {
    expect(styleOf(render(<JourneyTrailSpine traveled position="middle" gap={12} />)).backgroundColor)
      .toBe(galaxyColors.nodeCompletedAccent);
    expect(
      styleOf(render(<JourneyTrailSpine traveled={false} position="middle" gap={12} />))
        .backgroundColor,
    ).toBe(galaxyColors.spine);
  });

  it('fica fora da árvore de acessibilidade — é sinal visual, não conteúdo', () => {
    const screen = render(<JourneyTrailSpine traveled position="middle" gap={12} />);
    const spine = screen.getByTestId('journey-spine', { includeHiddenElements: true });

    expect(spine.props.accessibilityElementsHidden).toBe(true);
    expect(spine.props.importantForAccessibility).toBe('no-hide-descendants');
  });
});

// A linha tem que passar pelo centro das âncoras dos nós. Com texto grande as
// âncoras vão para a esquerda (achado 2 do gate H4), e a linha vai junto: a
// asserção compara os dois centros, não um valor copiado.
describe('JourneyTrailSpine — texto grande', () => {
  function centers() {
    const spine = styleOf(render(<JourneyTrailSpine traveled position="middle" gap={12} />));
    const card = render(
      <JourneyNodeCard
        node={{ id: 'n1', unitId: 'u1', type: 'lesson', title: 'Nó', status: 'available' }}
        nodeIndex={0}
        isRecommended={false}
        onPress={jest.fn()}
      />,
    );
    const column = StyleSheet.flatten(
      nearestHostParent(card.getByTestId('journey-anchor-n1', { includeHiddenElements: true }))?.props.style,
    );
    const center = (style: { left?: unknown; marginLeft?: unknown; width?: unknown }) =>
      Number(style.left) + Number(style.marginLeft ?? 0) + Number(style.width) / 2;
    return { spine, column, spineCenter: center(spine), anchorCenter: center(column) };
  }

  it('desce pelo centro das âncoras quando elas vão para a esquerda', () => {
    mockWindow.fontScale = 3.1;
    const { spine, spineCenter, anchorCenter } = centers();

    expect(typeof spine.left).toBe('number');
    expect(Number.isFinite(spineCenter)).toBe(true);
    expect(spineCenter).toBe(anchorCenter);
  });

  it('fica no meio da tela no tamanho padrão', () => {
    expect(centers().spine.left).toBe('50%');
  });
});
