import React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { JourneyNodeCard } from './JourneyNodeCard';
import type { JourneyNode, JourneyNodeStatus } from '../../../types/journey';
import { galaxyColors } from '../../../ui/theme';

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
