import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { JourneyStageHeader } from './JourneyStageHeader';
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

type HostNode = ReturnType<ReturnType<typeof render>['getByText']>;
function hostAncestors(node: HostNode): HostNode[] {
  const chain: HostNode[] = [];
  for (let current: HostNode | null = node.parent; current; current = current.parent) {
    if (typeof current.type === 'string') chain.push(current);
  }
  return chain;
}


function renderHeader(props: Partial<React.ComponentProps<typeof JourneyStageHeader>> = {}) {
  return render(
    <JourneyStageHeader title="Fundamentos de Radiologia" completed={7} total={21} {...props} />,
  );
}

describe('JourneyStageHeader — o aluno se localiza também pelo número', () => {
  // A cor do caminho responde "onde eu estou" de relance; o contador responde
  // "quanto falta", que a cor não consegue dizer. São perguntas diferentes, e é
  // por isso que os dois convivem em vez de um substituir o outro.

  it('nomeia o estágio e conta o percurso dentro dele', () => {
    const screen = renderHeader();

    expect(screen.getByText('Fundamentos de Radiologia')).toBeTruthy();
    expect(screen.getByText('7 de 21')).toBeTruthy();
  });

  it('anuncia o progresso como uma frase só, e não como três fragmentos', () => {
    // Lido peça por peça, o cabeçalho sairia como "Fundamentos de Radiologia",
    // "7 de 21", "barra de progresso 33%" — três paradas para uma informação.
    const screen = renderHeader();

    expect(
      screen.getByLabelText('Fundamentos de Radiologia. 7 de 21 etapas concluídas.'),
    ).toBeTruthy();
  });

  it('desenha a barra de 22 pt com o "N de M" dentro e o brilho do verde de concluído', () => {
    const screen = renderHeader();
    const track = StyleSheet.flatten(screen.getByTestId('journey-stage-progress-track').props.style);
    const fill = StyleSheet.flatten(screen.getByTestId('journey-stage-progress-fill').props.style);

    expect(track.height).toBe(22);
    expect(fill.shadowColor).toBe(galaxyColors.nodeCompletedAccent);
    expect(hostAncestors(screen.getByText('7 de 21'))).toContain(
      screen.getByTestId('journey-stage-progress-track'),
    );
  });

  it('preenche a barra na proporção do percurso', () => {
    const screen = renderHeader({ completed: 5, total: 20 });
    const fill = screen.getByTestId('journey-stage-progress-fill');

    expect(StyleSheet.flatten(fill.props.style).width).toBe('25%');
  });

  it('não divide por zero num estágio ainda sem etapas', () => {
    // Catálogo que ainda não produziu conteúdo: a barra fica vazia em vez de
    // NaN, que o React Native renderiza como largura inválida.
    const screen = renderHeader({ completed: 0, total: 0 });

    expect(
      StyleSheet.flatten(screen.getByTestId('journey-stage-progress-fill').props.style).width,
    ).toBe('0%');
    expect(screen.getByText('0 de 0')).toBeTruthy();
  });

  it('não deixa a barra passar de cheia se a contagem vier inconsistente', () => {
    const screen = renderHeader({ completed: 30, total: 21 });

    expect(
      StyleSheet.flatten(screen.getByTestId('journey-stage-progress-fill').props.style).width,
    ).toBe('100%');
  });
});

// Achado 2 do gate H4 (2026-09-24): no AX1 o título virava "Matéria, energia e
// r…" (limite de 2 linhas) e no AX5 "Mat / éri…", espremido ao lado da
// contagem. Com texto grande a contagem desce para baixo do título e o título
// não tem limite de linhas.
describe('JourneyStageHeader — texto grande', () => {
  it('não corta o título e deixa a contagem dentro da barra', () => {
    mockWindow.fontScale = 1.65;
    const screen = renderHeader({ title: 'Matéria, energia e radiação' });
    const title = screen.getByText('Matéria, energia e radiação');
    const bar = screen.getByTestId('journey-stage-progress-track');

    expect(title.props.numberOfLines).toBeUndefined();
    expect(hostAncestors(screen.getByText('7 de 21'))).toContain(bar);
  });

  it('continua com duas linhas e a contagem ao lado no tamanho padrão', () => {
    const screen = renderHeader();

    expect(screen.getByText('Fundamentos de Radiologia').props.numberOfLines).toBe(2);
  });

  // Em AX5 o título a 3,1× (74 pt) partia "radiação" em "radiaçã / o". Títulos
  // crescem menos que o corpo, como os estilos de título do iOS: até 2×.
  it('deixa o título crescer além do cromo, mas não mais que 2×', () => {
    mockWindow.fontScale = 3.1;
    const multiplier = renderHeader({ title: 'Matéria, energia e radiação' })
      .getByText('Matéria, energia e radiação').props.maxFontSizeMultiplier;

    expect(multiplier).toBeGreaterThan(1.35);
    expect(multiplier).toBeLessThanOrEqual(2);
  });
});
