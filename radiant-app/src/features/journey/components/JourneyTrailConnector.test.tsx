import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { JourneyTrailConnector } from './JourneyTrailConnector';
import { galaxyColors } from '../../../ui/theme';

function dotColors(screen: ReturnType<typeof render>) {
  // `includeHiddenElements` é obrigatório aqui: o conector esconde os próprios
  // descendentes do leitor de tela de propósito, e a query respeita isso. Sem a
  // opção, o teste não acha os pontos — e o motivo é justamente o comportamento
  // que o terceiro caso afirma.
  return screen
    .getAllByTestId(/^journey-connector-dot-/, { includeHiddenElements: true })
    .map((dot) => StyleSheet.flatten(dot.props.style).backgroundColor);
}

describe('JourneyTrailConnector — o caminho mostra até onde o aluno chegou', () => {
  // O caminho não é enfeite: preenchido até a posição do aluno, ele responde
  // "onde eu estou" sem que nenhum rótulo precise ser lido. Antes deste
  // componente a trilha desenhava âncoras soltas, sem ligação nenhuma entre
  // elas — cada nó parecia um cartão avulso, não uma etapa de um percurso.

  it('pinta o trecho percorrido com a cor de concluído', () => {
    const screen = render(<JourneyTrailConnector traveled />);
    const colors = dotColors(screen);

    expect(colors.length).toBeGreaterThan(0);
    expect(new Set(colors)).toEqual(new Set([galaxyColors.nodeCompletedAccent]));
  });

  it('deixa o trecho não percorrido na cor apagada do trilho', () => {
    const screen = render(<JourneyTrailConnector traveled={false} />);
    const colors = dotColors(screen);

    expect(colors.length).toBeGreaterThan(0);
    expect(new Set(colors)).toEqual(new Set([galaxyColors.spine]));
  });

  it('fica fora da árvore de acessibilidade — é sinal visual, não conteúdo', () => {
    // A cor do caminho repete o que o rótulo de cada nó já diz. Anunciá-la
    // faria o leitor de tela ler "concluído" duas vezes por nó.
    const screen = render(<JourneyTrailConnector traveled />);
    const track = screen.getByTestId('journey-connector', { includeHiddenElements: true });

    expect(track.props.accessibilityElementsHidden).toBe(true);
    expect(track.props.importantForAccessibility).toBe('no-hide-descendants');
  });
});
