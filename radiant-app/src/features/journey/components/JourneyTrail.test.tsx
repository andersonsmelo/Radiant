import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
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

  it('não emite o título da unidade como cabeçalho que parte o caminho', () => {
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [
        unit('u1', 'Unidade 1', ['completed']),
        unit('u2', 'Unidade 2', ['available']),
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
