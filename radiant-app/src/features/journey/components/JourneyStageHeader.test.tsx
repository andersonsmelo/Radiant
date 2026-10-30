import React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { JourneyStageHeader } from './JourneyStageHeader';
import { semanticColors } from '../../../ui/semantic-colors';

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


function luminance(hex: string): number {
  const channels = [1, 3, 5].map((index) => {
    const value = parseInt(hex.slice(index, index + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}
function contrastRatio(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
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

  it('desenha a barra de 22 pt com o "N de M" dentro', () => {
    const screen = renderHeader();
    const track = StyleSheet.flatten(screen.getByTestId('journey-stage-progress-track').props.style);

    expect(track.height).toBe(22);
    expect(hostAncestors(screen.getByText('7 de 21'))).toContain(
      screen.getByTestId('journey-stage-progress-track'),
    );
  });

  it('preenche com o azul da ação primária, sem sombra nem brilho', () => {
    const screen = renderHeader();
    const fill = StyleSheet.flatten(screen.getByTestId('journey-stage-progress-fill').props.style);

    expect(fill.backgroundColor).toBe(semanticColors.galaxy.actionPrimary);
    // DESIGN.md: sombra só na barra de abas; brilho sem fonte de luz é sinal de template.
    expect(Object.keys(fill).filter((key) => key.startsWith('shadow') || key === 'elevation')).toEqual([]);
    const count = StyleSheet.flatten(screen.getByText('7 de 21').props.style);
    expect(Object.keys(count).filter((key) => key.startsWith('textShadow'))).toEqual([]);
  });

  describe('realce do preenchimento', () => {
    function layout(screen: ReturnType<typeof renderHeader>, width: number) {
      fireEvent(screen.getByTestId('journey-stage-progress-track'), 'layout', {
        nativeEvent: { layout: { x: 0, y: 0, width, height: 22 } },
      });
    }

    it('é a faixa branca a 28% da prancheta, dentro do preenchimento', () => {
      const screen = renderHeader({ completed: 10, total: 20 });
      layout(screen, 300);

      const stripe = StyleSheet.flatten(screen.getByTestId('journey-stage-progress-highlight').props.style);
      expect(stripe).toMatchObject({ left: 8, right: 8, top: 4, height: 5, borderRadius: 2.5, opacity: 0.28 });
      expect(hostAncestors(screen.getByTestId('journey-stage-progress-highlight')))
        .toContain(screen.getByTestId('journey-stage-progress-fill'));
      expect(Object.keys(stripe).filter((key) => key.startsWith('shadow'))).toEqual([]);
    });

    it.each([0.6, 0.8, 1])('a faixa composta preserva 4,5:1 em toda a caixa real da contagem com preenchimento %f', ratio => {
      const screen = renderHeader({ completed: ratio * 20, total: 20 });
      layout(screen, 300);
      const count = screen.getByText(`${ratio * 20} de 20`);
      const bounds = { x: 110, y: 0, width: 80, height: 22 };
      // A caixa vem do layout nativo do Text (inclui o fontScale), não de
      // estimativa por número de caracteres.
      if (count.props.onLayout) fireEvent(count, 'layout', { nativeEvent: { layout: bounds } });
      const stripe = screen.getByTestId('journey-stage-progress-highlight');
      const style = StyleSheet.flatten(stripe.props.style);
      const fill = StyleSheet.flatten(screen.getByTestId('journey-stage-progress-fill').props.style);
      const foreground = StyleSheet.flatten(count.props.style).color;
      const segments = screen.queryAllByTestId(/^journey-stage-progress-highlight-(left|right)$/u);
      const coloredRegions = segments.length > 0 ? segments.map(piece => {
        const s = StyleSheet.flatten(piece.props.style);
        return { left: style.left + s.left, right: style.left + s.left + s.width };
      }) : [{ left: style.left, right: 300 * ratio - style.right }];
      // A faixa a28% mede só3,368:1. Ela deve parar antes dos glifos, deixando
      // o azul puro (5,75:1) atrás de toda a caixa, com folga de4pt.
      expect(coloredRegions.every(region => region.right <= bounds.x - 4 || region.left >= bounds.x + bounds.width + 4)).toBe(true);
      expect(contrastRatio(foreground, fill.backgroundColor)).toBeGreaterThanOrEqual(4.5);
      expect(style.opacity).toBe(0.28);
      expect(coloredRegions.some(region => region.right > region.left)).toBe(true);
    });

    it('não existe antes de a barra ser medida', () => {
      const screen = renderHeader({ completed: 10, total: 20 });

      expect(screen.queryByTestId('journey-stage-progress-highlight')).toBeNull();
    });

    it('some quando o preenchimento é estreito demais para conter a faixa', () => {
      // 1 de 21 numa barra de 300 pt: ~14 pt de preenchimento, menos que 8 + 8 de margem.
      const screen = renderHeader({ completed: 1, total: 21 });
      layout(screen, 300);

      expect(screen.queryByTestId('journey-stage-progress-highlight')).toBeNull();
    });

    it('some com a barra vazia', () => {
      const screen = renderHeader({ completed: 0, total: 21 });
      layout(screen, 300);

      expect(screen.queryByTestId('journey-stage-progress-highlight')).toBeNull();
    });
  });

  it('escreve a contagem em minúsculas, em negrito, sem espaçamento e com algarismos tabulares', () => {
    const screen = renderHeader();
    const count = StyleSheet.flatten(screen.getByText('7 de 21').props.style);

    expect(count.textTransform).toBe('none');
    expect(count.letterSpacing).toBe(0);
    expect(count.fontWeight).toBe('700');
    expect(count.fontVariant).toContain('tabular-nums');
  });

  it('a cor da contagem passa de 4,5:1 sobre o preenchimento e sobre a trilha', () => {
    const screen = renderHeader();
    const count = StyleSheet.flatten(screen.getByText('7 de 21').props.style);
    const fill = StyleSheet.flatten(screen.getByTestId('journey-stage-progress-fill').props.style);
    const track = StyleSheet.flatten(screen.getByTestId('journey-stage-progress-track').props.style);

    expect(contrastRatio(count.color as string, fill.backgroundColor as string)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(count.color as string, track.backgroundColor as string)).toBeGreaterThanOrEqual(4.5);
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
