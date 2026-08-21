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
  it('preenche o caminho até a posição do aluno, com UMA fronteira', () => {
    // O caminho tem um trecho a menos que a quantidade de nós — o primeiro nó
    // não tem nada acima dele.
    const screen = renderTrail(
      [
        segment('t1', 'Fundamentos', [
          unit('u1', 'Unidade 1', ['completed', 'completed', 'available', 'locked']),
        ]),
      ],
      'u1-node-2',
    );

    const connectors = screen.getAllByTestId(/^journey-connector-for-/, {
      includeHiddenElements: true,
    });

    expect(connectors).toHaveLength(3);
    expect(connectors.map((c) => c.props.accessibilityValue?.text)).toEqual([
      'percorrido',
      'percorrido',
      'pendente',
    ]);
  });

  it('não listra o caminho quando um nó pendente aparece no meio do trecho já andado', () => {
    // O defeito que este caso trava, visto no simulador em 2026-08-21: pintar
    // cada trecho pelo estado do nó ACIMA dele produzia verde-cinza-verde-cinza,
    // porque revisões bloqueadas se intercalam entre lições concluídas. Um
    // caminho listrado não responde "onde eu estou" — a informação está na
    // FRONTEIRA, e duas ou mais fronteiras não são fronteira nenhuma.
    const screen = renderTrail(
      [
        segment('t1', 'Fundamentos', [
          unit('u1', 'Unidade 1', ['completed', 'locked', 'completed', 'available', 'locked']),
        ]),
      ],
      'u1-node-3',
    );

    const estados = screen
      .getAllByTestId(/^journey-connector-for-/, { includeHiddenElements: true })
      .map((c) => c.props.accessibilityValue?.text);

    expect(estados).toEqual(['percorrido', 'percorrido', 'percorrido', 'pendente']);

    // Uma fronteira só: o número de trocas de estado ao longo do caminho é 1.
    const trocas = estados.filter((estado, i) => i > 0 && estado !== estados[i - 1]);
    expect(trocas).toHaveLength(1);
  });

  it('sem nó recomendado, preenche até o último concluído', () => {
    // Trilha inteira concluída, ou estado que o serviço não soube recomendar: o
    // caminho continua tendo que dizer até onde o aluno chegou.
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [
        unit('u1', 'Unidade 1', ['completed', 'completed', 'locked']),
      ]),
    ]);

    expect(
      screen
        .getAllByTestId(/^journey-connector-for-/, { includeHiddenElements: true })
        .map((c) => c.props.accessibilityValue?.text),
    ).toEqual(['percorrido', 'pendente']);
  });

  it('não desenha trecho de caminho acima do primeiro nó do percurso', () => {
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed'])]),
    ]);

    expect(
      screen.queryAllByTestId(/^journey-connector-for-/, { includeHiddenElements: true }),
    ).toHaveLength(0);
  });

  it('liga o caminho ATRAVÉS da fronteira entre trilhas', () => {
    // A costura entre segmentos é onde o percurso mais corre risco de voltar a
    // parecer dois pedaços. O primeiro nó do segundo segmento tem um nó antes
    // dele no percurso, então tem trecho de caminho.
    const screen = renderTrail(
      [
        segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed'])]),
        segment('t2', 'Tórax', [unit('u2', 'Unidade 2', ['available'])], { order: 1 }),
      ],
      'u2-node-0',
    );

    const connectors = screen.getAllByTestId(/^journey-connector-for-/, {
      includeHiddenElements: true,
    });

    // O trecho existe apesar da faixa de nível ficar entre os dois nós: a faixa
    // é marco no caminho, não corte nele.
    expect(connectors).toHaveLength(1);
    expect(connectors[0].props.testID).toBe('journey-connector-for-u2-node-0');
    expect(connectors[0].props.accessibilityValue?.text).toBe('percorrido');
  });
});
