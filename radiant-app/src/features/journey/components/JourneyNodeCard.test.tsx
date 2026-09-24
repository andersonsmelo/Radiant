import React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { JourneyNodeCard } from './JourneyNodeCard';
import type { JourneyNode, JourneyNodeStatus } from '../../../types/journey';
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


function node(status: JourneyNodeStatus, id = `node-${status}`): JourneyNode {
  return {
    id,
    unitId: 'unit-1',
    type: 'lesson',
    title: 'Princípios de Tomografia Computadorizada',
    status,
  };
}

function renderCard(status: JourneyNodeStatus, overrides: Partial<React.ComponentProps<typeof JourneyNodeCard>> = {}) {
  return render(
    <JourneyNodeCard
      node={node(status)}
      nodeIndex={0}
      isRecommended={false}
      onPress={jest.fn()}
      disabled={status === 'locked'}
      {...overrides}
    />,
  );
}

function statusColor(screen: ReturnType<typeof render>, status: JourneyNodeStatus) {
  return StyleSheet.flatten(screen.getByTestId(`journey-status-node-${status}`).props.style).color;
}

describe('JourneyNodeCard — o estado é legível sem ler o rótulo', () => {
  // O defeito que estes casos travam: até 2026-08-14 concluído e bloqueado
  // desenhavam o MESMO cartão cinza com o MESMO ícone azul, e a diferença
  // vivia inteira numa palavra de rodapé em cinza apagado. Na trilha, o aluno
  // não distinguia o que já tinha feito do que não podia fazer — e o azul no
  // ícone de um nó bloqueado ainda o fazia parecer clicável.

  it('não pinta concluído e bloqueado com a mesma cor', () => {
    const completed = statusColor(renderCard('completed'), 'completed');
    const locked = statusColor(renderCard('locked'), 'locked');

    expect(completed).not.toBe(locked);
    expect(completed).toBe(galaxyColors.nodeCompletedAccent);
    expect(locked).toBe(galaxyColors.nodeLockedAccent);
  });

  it('nunca usa o azul de ação num nó bloqueado, que o faria parecer clicável', () => {
    expect(statusColor(renderCard('locked'), 'locked')).not.toBe(galaxyColors.ctaGradientEnd);
  });

  it('marca o nó bloqueado com cadeado, e não apenas com cor', () => {
    // Cor sozinha nunca carrega informação neste projeto: quem não distingue
    // cor precisa do ícone, e quem usa leitor de tela precisa do rótulo.
    const screen = renderCard('locked');
    const tile = screen.getByTestId('journey-icon-tile-node-locked');

    expect(tile.findByProps({ name: 'lock' })).toBeTruthy();
    expect(screen.getByLabelText(/Bloqueado\.$/u)).toBeTruthy();
  });

  it('preenche a âncora só no nó concluído, para a fronteira do progresso ser visível na linha', () => {
    const completed = StyleSheet.flatten(
      renderCard('completed').getByTestId('journey-anchor-node-completed').props.style,
    );
    const available = StyleSheet.flatten(
      renderCard('available').getByTestId('journey-anchor-node-available').props.style,
    );

    expect(completed.backgroundColor).toBe(galaxyColors.nodeCompletedAccent);
    expect(available.backgroundColor).toBe(galaxyColors.background);
  });

  it('não apaga o título do nó bloqueado com opacidade global', () => {
    // `opacity` no cartão inteiro derrubaria junto o contraste do título, e o
    // contrato de contraste não pega isso porque calcula tokens, não runtime.
    // O título precisa continuar legível: é o que permite decidir se vale a
    // pena destravar aquele ponto.
    const screen = renderCard('locked');
    const card = screen.getByRole('button');
    const flattened = StyleSheet.flatten(card.props.style);

    expect(flattened.opacity).toBeUndefined();
    expect(flattened.borderStyle).toBe('dashed');
  });

  it('não dispara navegação a partir de um nó bloqueado', () => {
    const onPress = jest.fn();
    const screen = renderCard('locked', { onPress });

    fireEvent.press(screen.getByRole('button'));

    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('JourneyNodeCard — onde o aluno está', () => {
  it('explica quando o próximo nó é uma revisão devida e conta as devidas', () => {
    const screen = renderCard('due-review', {
      isRecommended: true,
      recommendationReason: 'due-review',
      dueReviewCount: 3,
    });

    expect(screen.getByText('Revisão devida · 3 devidas')).toBeTruthy();
  });

  it('explica a retomada sem substituir o título da lição', () => {
    const screen = renderCard('resumable', {
      isRecommended: true,
      recommendationReason: 'paused-lesson',
    });

    expect(screen.getByText('Continuar de onde parou')).toBeTruthy();
  });

  // "Onde eu estou" era carregado por uma borda azul e por uma linha de rodapé
  // dizendo "Próximo passo". Numa trilha rolável, com o nó atual quase sempre
  // fora do primeiro quadro, isso obrigava o aluno a ler cartão por cartão para
  // se localizar. A pílula existe para ser reconhecível de relance, antes de
  // qualquer texto ser lido — é o mesmo papel que ela cumpre na referência.

  it('marca o nó recomendado com a pílula de próximo', () => {
    const screen = renderCard('available', { isRecommended: true });

    expect(
      screen.getByTestId('journey-next-pill-node-available', { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(screen.getByText('Próximo', { includeHiddenElements: true })).toBeTruthy();
  });

  it('não marca nenhum outro nó', () => {
    for (const status of ['completed', 'locked', 'available'] as const) {
      const screen = renderCard(status, { isRecommended: false });
      expect(screen.queryByText('Próximo', { includeHiddenElements: true })).toBeNull();
    }
  });

  it('anuncia a posição uma vez só, no rótulo do botão', () => {
    // A pílula é visual; quem diz "próximo passo" para o leitor de tela é o
    // accessibilityLabel do próprio botão. Duas fontes fariam o leitor repetir.
    const screen = renderCard('available', { isRecommended: true });
    const pill = screen.getByTestId('journey-next-pill-node-available', {
      includeHiddenElements: true,
    });

    expect(pill.props.accessibilityElementsHidden).toBe(true);
    expect(
      screen.getByLabelText(/Próximo passo/u),
    ).toBeTruthy();
  });
});

// Achado 2 do gate H4 (2026-09-24): com texto grande, o cartão de 45% da largura
// partia as palavras ("Fundame / ntos de / Radiolo…") já no AX1. Nos tamanhos
// grandes a trilha vira uma coluna só: a linha desce pela esquerda e todos os
// cartões ficam à direita dela, na largura quase toda, sem limite de linhas.
describe('JourneyNodeCard — texto grande', () => {
  function layout(nodeIndex: number) {
    const screen = renderCard('available', { nodeIndex });
    const anchorColumn = nearestHostParent(screen.getByTestId('journey-anchor-node-available', { includeHiddenElements: true }));
    const card = screen.getByRole('button');
    const row = nearestHostParent(card);
    return {
      anchorColumn: StyleSheet.flatten(anchorColumn?.props.style),
      card: StyleSheet.flatten(card.props.style),
      row: StyleSheet.flatten(row?.props.style),
      title: screen.getByText('Princípios de Tomografia Computadorizada'),
    };
  }

  it.each([0, 1])('nó %i: cartão largo à direita da linha, sem cortar o título', (nodeIndex) => {
    mockWindow.fontScale = 1.65;
    const { anchorColumn, card, row, title } = layout(nodeIndex);

    expect(typeof anchorColumn.left).toBe('number');
    expect(row.justifyContent).toBe('flex-end');
    expect(Number.parseFloat(String(card.width))).toBeGreaterThanOrEqual(80);
    expect(title.props.numberOfLines).toBeUndefined();
  });

  it('mantém o zigue-zague no tamanho padrão', () => {
    const { anchorColumn, card } = layout(0);

    expect(anchorColumn.left).toBe('50%');
    expect(card.width).toBe('45%');
  });
});
