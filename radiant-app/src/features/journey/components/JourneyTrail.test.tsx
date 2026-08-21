import React from 'react';
import { render } from '@testing-library/react-native';
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
});
