import React from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { act, fireEvent, render } from '@testing-library/react-native';
import { galaxyColors } from '../../../ui/theme';
import { JourneyTrail } from './JourneyTrail';
import type { CurriculumSegment } from '../services/JourneyCurriculumService';
import type { JourneyNodeStatus } from '../../../types/journey';

function unit(id: string, title: string, statuses: JourneyNodeStatus[]) {
  return {
    id,
    title,
    nodes: statuses.map((status, index) => ({
      id: `${id}-node-${index}`,
      unitId: id,
      type: 'lesson' as const,
      title: `${title} — nó ${index + 1}`,
      status,
    })),
  };
}

function segment(
  trackId: string,
  trackTitle: string,
  units: ReturnType<typeof unit>[],
  overrides: Partial<CurriculumSegment> = {},
): CurriculumSegment {
  return {
    trackId,
    trackTitle,
    order: 0,
    unlocked: true,
    completed: false,
    units,
    ...overrides,
  };
}

/** O estado de cada segmento da linha, de cima para baixo. */
function spineStates(screen: ReturnType<typeof render>): string[] {
  return screen
    .getAllByTestId('journey-spine', { includeHiddenElements: true })
    .map((spine) =>
      StyleSheet.flatten(spine.props.style).backgroundColor === galaxyColors.nodeCompletedAccent
        ? 'percorrido'
        : 'pendente',
    );
}

jest.mock('../../../components/ui/DecorativeIcon', () => ({ DecorativeIcon: () => null }));

const onNodePress = jest.fn();
const isNodeDisabled = (node: { status: JourneyNodeStatus }) => node.status === 'locked';

function renderTrail(segments: CurriculumSegment[], recommendedNodeId?: string) {
  return render(
    <JourneyTrail
      segments={segments}
      recommendedNodeId={recommendedNodeId}
      onNodePress={onNodePress}
      isNodeDisabled={isNodeDisabled as never}
    />,
  );
}

describe('JourneyTrail — um caminho só, do começo ao fim do currículo', () => {
  // O JourneyMap que este componente substitui quebrava o percurso em seções:
  // uma por unidade, cada uma com título próprio e trilho próprio, tudo dentro
  // de um card com borda. O aluno via trechos separados, não um caminho.

  it('renderiza os nós de todos os segmentos, na ordem', () => {
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed', 'available'])]),
      segment('t2', 'Tórax', [unit('u2', 'Unidade 2', ['locked'])], { unlocked: false, order: 1 }),
    ]);

    expect(screen.getByText('Unidade 1 — nó 1')).toBeTruthy();
    expect(screen.getByText('Unidade 1 — nó 2')).toBeTruthy();
    expect(screen.getByText('Unidade 2 — nó 1')).toBeTruthy();
  });

  it('não acrescenta navegação de unidades ao percurso legado de uma unidade por área', () => {
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [
        unit('u1', 'Unidade 1', ['completed']),
      ]),
    ]);

    expect(screen.queryByText('Unidade 1')).toBeNull();
    expect(screen.queryByText('Unidade 2')).toBeNull();
  });

  it('alterna os lados de forma contínua, sem reiniciar a cada unidade', () => {
    // Duas unidades de um nó cada. Se o índice reiniciasse por unidade, os dois
    // nós cairiam do mesmo lado; num caminho só, o segundo alterna.
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [
        unit('u1', 'Unidade 1', ['completed']),
        unit('u2', 'Unidade 2', ['available']),
      ]),
    ]);

    const primeiro = screen.getByTestId('journey-trail-row-u1-node-0');
    const segundo = screen.getByTestId('journey-trail-row-u2-node-0');

    expect(primeiro.props.accessibilityValue?.text).toBe('esquerda');
    expect(segundo.props.accessibilityValue?.text).toBe('direita');
  });

  it('mostra a faixa de próximo nível entre segmentos, e não depois do último', () => {
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed'])]),
      segment('t2', 'Tórax', [unit('u2', 'Unidade 2', ['locked'])], { unlocked: false, order: 1 }),
    ]);

    expect(screen.getByText('Tórax')).toBeTruthy();
    expect(screen.getAllByTestId(/^journey-level-band-/)).toHaveLength(1);
    expect(screen.queryByTestId('journey-level-band-t1')).toBeNull();
  });

  it('a faixa fechada nomeia a trilha anterior como o que falta', () => {
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['available'])]),
      segment('t2', 'Tórax', [unit('u2', 'Unidade 2', ['locked'])], { unlocked: false, order: 1 }),
    ]);

    expect(screen.getByText('Abre ao concluir Fundamentos')).toBeTruthy();
  });

  it('não desenha faixa nenhuma quando há um único segmento', () => {
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed'])]),
    ]);

    expect(screen.queryAllByTestId(/^journey-level-band-/)).toHaveLength(0);
  });
  it('preenche a linha até a posição do aluno, com UMA fronteira', () => {
    const screen = renderTrail(
      [
        segment('t1', 'Fundamentos', [
          unit('u1', 'Unidade 1', ['completed', 'completed', 'available', 'locked']),
        ]),
      ],
      'u1-node-2',
    );

    expect(spineStates(screen)).toEqual([
      'percorrido',
      'percorrido',
      'percorrido',
      'pendente',
    ]);
  });

  it('não listra a linha quando um nó pendente aparece no meio do trecho já andado', () => {
    // O defeito que este caso trava, visto no simulador em 2026-08-21: colorir
    // cada trecho pelo estado do nó vizinho produzia verde-cinza-verde-cinza,
    // porque revisões bloqueadas se intercalam entre lições concluídas. Uma
    // linha listrada não responde "onde eu estou" — a informação está na
    // FRONTEIRA, e duas ou mais fronteiras não são fronteira nenhuma.
    const screen = renderTrail(
      [
        segment('t1', 'Fundamentos', [
          unit('u1', 'Unidade 1', ['completed', 'locked', 'completed', 'available', 'locked']),
        ]),
      ],
      'u1-node-3',
    );

    const estados = spineStates(screen);
    expect(estados).toEqual([
      'percorrido',
      'percorrido',
      'percorrido',
      'percorrido',
      'pendente',
    ]);

    const trocas = estados.filter((estado, i) => i > 0 && estado !== estados[i - 1]);
    expect(trocas).toHaveLength(1);
  });

  it('sem nó recomendado, preenche até o último concluído', () => {
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [
        unit('u1', 'Unidade 1', ['completed', 'completed', 'locked']),
      ]),
    ]);

    expect(spineStates(screen)).toEqual(['percorrido', 'percorrido', 'pendente']);
  });

  it('dá um segmento de linha a cada nó, para que eles se encostem', () => {
    // A linha é contínua porque cada nó carrega o seu pedaço e transborda para a
    // folga seguinte. Um nó sem segmento é um corte visível na linha.
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [
        unit('u1', 'Unidade 1', ['completed', 'available']),
        unit('u2', 'Unidade 2', ['locked']),
      ]),
    ]);

    expect(spineStates(screen)).toHaveLength(3);
  });

  it('não desenha linha nenhuma num percurso de um nó só', () => {
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['available'])]),
    ]);

    expect(
      screen.queryAllByTestId('journey-spine', { includeHiddenElements: true }),
    ).toHaveLength(0);
  });

  it('liga a linha ATRAVÉS da fronteira entre trilhas', () => {
    // A costura entre segmentos é onde o percurso mais corre risco de voltar a
    // parecer dois pedaços.
    const screen = renderTrail(
      [
        segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed'])]),
        segment('t2', 'Tórax', [unit('u2', 'Unidade 2', ['available'])], { order: 1 }),
      ],
      'u2-node-0',
    );

    expect(spineStates(screen)).toEqual(['percorrido', 'percorrido']);
  });
});
  it('usa uma lista virtualizada como superfície rolável', () => {
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed', 'available'])]),
    ]);

    expect(screen.UNSAFE_getByType(FlatList)).toBeTruthy();
  });

// O cabeçalho que a tela passa à trilha rola junto com ela (achado 2 do gate H4:
// fixo acima, com texto grande, ele ocupava a tela e escondia a trilha).
describe('JourneyTrail — cabeçalho na rolagem', () => {
  it('renderiza o cabeçalho dentro da lista rolável', () => {
    const screen = render(
      <JourneyTrail
        segments={[segment('t1', 'Trilha', [unit('u1', 'Unidade', ['available'])])]}
        header={<Text>Cabeçalho do estágio</Text>}
        onNodePress={jest.fn()}
        isNodeDisabled={() => false}
      />,
    );
    let insideScroll = false;
    for (let node = screen.getByText('Cabeçalho do estágio').parent; node; node = node.parent) {
      if (node.type === 'RCTScrollView') insideScroll = true;
    }

    expect(insideScroll).toBe(true);
  });
});

// Pedido do dono em 2026-10-16, conferido no simulador: a trilha abria sempre
// no topo, e o nó PRÓXIMO ficava abaixo da dobra. A Home precisa levar o aluno
// ao ponto em que ele está. Jest não faz layout, então a asserção é sobre o
// pedido de rolagem que a lista recebe, que é o que determina a posição.
describe('JourneyTrail — abre no ponto do aluno', () => {
  const trilhaComDuasTrilhas = () => [
    segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed', 'completed', 'completed'])]),
    segment('t2', 'Tórax', [unit('u2', 'Unidade 2', ['completed', 'available'])], { order: 1 }),
  ];

  let scrollToIndex: jest.SpyInstance;
  let scrollToOffset: jest.SpyInstance;

  beforeEach(() => {
    scrollToIndex = jest.spyOn(FlatList.prototype, 'scrollToIndex').mockImplementation(() => {});
    scrollToOffset = jest.spyOn(FlatList.prototype, 'scrollToOffset').mockImplementation(() => {});
  });

  afterEach(() => {
    scrollToIndex.mockRestore();
    scrollToOffset.mockRestore();
  });

  function medirConteudo(screen: ReturnType<typeof render>) {
    fireEvent(screen.getByTestId('journey-trail'), 'contentSizeChange', 402, 3000);
  }

  it('centraliza o nó recomendado quando o conteúdo é medido', () => {
    // Itens: 3 nós de t1, a faixa de Tórax, e os 2 nós de t2. O PRÓXIMO é o 6º.
    const screen = renderTrail(trilhaComDuasTrilhas(), 'u2-node-1');
    medirConteudo(screen);

    expect(scrollToIndex).toHaveBeenCalledTimes(1);
    expect(scrollToIndex).toHaveBeenCalledWith({ index: 5, viewPosition: 0.5, animated: false });
  });

  it('não volta a centralizar enquanto a recomendação é a mesma', () => {
    // O conteúdo muda de tamanho a cada lote virtualizado. Recentralizar a cada
    // medição arrancaria o aluno do lugar para onde ele rolou.
    const screen = renderTrail(trilhaComDuasTrilhas(), 'u2-node-1');
    medirConteudo(screen);
    medirConteudo(screen);

    expect(scrollToIndex).toHaveBeenCalledTimes(1);
  });

  it('centraliza o novo PRÓXIMO quando a recomendação muda', () => {
    const screen = renderTrail(trilhaComDuasTrilhas(), 'u2-node-0');
    medirConteudo(screen);
    screen.rerender(
      <JourneyTrail
        segments={trilhaComDuasTrilhas()}
        recommendedNodeId="u2-node-1"
        onNodePress={onNodePress}
        isNodeDisabled={isNodeDisabled as never}
      />,
    );
    medirConteudo(screen);

    expect(scrollToIndex).toHaveBeenCalledTimes(2);
    expect(scrollToIndex).toHaveBeenLastCalledWith({ index: 5, viewPosition: 0.5, animated: false });
  });

  it('centraliza o novo PRÓXIMO mesmo quando o conteúdo não muda de tamanho', () => {
    // Concluir uma lição troca rótulos, não alturas: a lista já medida não
    // recebe nova medição, e a recomendação nova ficaria fora da tela.
    const screen = renderTrail(trilhaComDuasTrilhas(), 'u2-node-0');
    medirConteudo(screen);
    screen.rerender(
      <JourneyTrail
        segments={trilhaComDuasTrilhas()}
        recommendedNodeId="u2-node-1"
        onNodePress={onNodePress}
        isNodeDisabled={isNodeDisabled as never}
      />,
    );

    expect(scrollToIndex).toHaveBeenCalledTimes(2);
    expect(scrollToIndex).toHaveBeenLastCalledWith({ index: 5, viewPosition: 0.5, animated: false });
  });

  it('não centraliza antes de a lista ser medida', () => {
    // Sem medida, `scrollToIndex` falha e gasta as tentativas à toa.
    renderTrail(trilhaComDuasTrilhas(), 'u2-node-1');

    expect(scrollToIndex).not.toHaveBeenCalled();
  });

  it('sem nó recomendado, não rola', () => {
    const screen = renderTrail(trilhaComDuasTrilhas());
    medirConteudo(screen);

    expect(scrollToIndex).not.toHaveBeenCalled();
  });

  it('recomendação que não está na trilha não vira índice inválido', () => {
    // O snapshot e o currículo são lidos em paralelo; um id que o currículo não
    // tem daria `scrollToIndex(-1)`.
    const screen = renderTrail(trilhaComDuasTrilhas(), 'no-que-nao-existe');
    medirConteudo(screen);

    expect(scrollToIndex).not.toHaveBeenCalled();
  });

  it('quando o nó ainda não foi medido, aproxima pela altura média e tenta de novo', () => {
    // Fora da primeira janela virtualizada, `scrollToIndex` falha sem medida.
    jest.useFakeTimers();
    try {
      const screen = renderTrail(trilhaComDuasTrilhas(), 'u2-node-1');
      screen.UNSAFE_getByType(FlatList).props.onScrollToIndexFailed({
        index: 5,
        highestMeasuredFrameIndex: 2,
        averageItemLength: 200,
      });

      expect(scrollToOffset).toHaveBeenCalledWith({ offset: 1000, animated: false });
      expect(scrollToIndex).not.toHaveBeenCalled();
      act(() => {
        jest.runOnlyPendingTimers();
      });
      expect(scrollToIndex).toHaveBeenCalledWith({ index: 5, viewPosition: 0.5, animated: false });
    } finally {
      jest.useRealTimers();
    }
  });
});


describe('JourneyTrail — navegação por unidades compostas', () => {
  it('identifica as unidades e permite consultar a bloqueada sem disparar um nó', () => {
    const scroll = jest.spyOn(FlatList.prototype, 'scrollToIndex').mockImplementation(() => {});
    try {
      onNodePress.mockClear();
      const screen = renderTrail([segment('t', 'Área', [unit('u1', 'Primeira unidade', ['completed']), unit('u2', 'Segunda unidade', ['locked'])])]);
      expect(screen.getByRole('header', { name: /Unidade 1 de 2: Primeira unidade/ })).toBeTruthy();
      expect(screen.getByRole('header', { name: /Unidade 2 de 2: Segunda unidade/ })).toBeTruthy();
      fireEvent.press(screen.getByRole('button', { name: 'Ver unidade 2 de 2: Segunda unidade. Área' }));
      // Cabeçalho u1, nó u1, cabeçalho u2: os novos cabeçalhos entram no índice.
      expect(scroll).toHaveBeenLastCalledWith({ index: 2, viewPosition: 0, animated: false });
      expect(onNodePress).not.toHaveBeenCalled();
      expect(screen.getByText(/Bloqueada/)).toBeTruthy();
    } finally { scroll.mockRestore(); }
  });
  it('reinicia a recuperação de rolagem ao escolher outra unidade distante', async () => {
    jest.useFakeTimers();
    const scroll = jest.spyOn(FlatList.prototype, 'scrollToIndex').mockImplementation(() => {});
    const offset = jest.spyOn(FlatList.prototype, 'scrollToOffset').mockImplementation(() => {});
    try {
      const screen = renderTrail([segment('t', 'Área', [unit('u1', 'Primeira', ['completed']), unit('u2', 'Segunda', ['available'])])], 'u2-node-0');
      await act(async () => {});
      const main = screen.UNSAFE_getAllByType(FlatList).find(list => list.props.testID === 'journey-trail')!;
      fireEvent(screen.getByTestId('journey-trail'), 'contentSizeChange', 400, 3000);
      for (let i = 0; i < 3; i += 1) {
        main.props.onScrollToIndexFailed({ index: 3, averageItemLength: 100 });
        act(() => { jest.runOnlyPendingTimers(); });
      }
      fireEvent.press(screen.getByRole('button', { name: 'Ver unidade 2 de 2: Segunda. Área' }));
      const before = scroll.mock.calls.length;
      main.props.onScrollToIndexFailed({ index: 2, averageItemLength: 100 });
      act(() => { jest.runOnlyPendingTimers(); });
      expect(scroll).toHaveBeenCalledTimes(before + 1);
      expect(scroll).toHaveBeenLastCalledWith({ index: 2, viewPosition: 0, animated: false });
    } finally { scroll.mockRestore(); offset.mockRestore(); jest.useRealTimers(); }
  });

});
