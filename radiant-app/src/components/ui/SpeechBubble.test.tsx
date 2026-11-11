import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { SpeechBubble } from './SpeechBubble';

// Achado 8 da prova de 2026-11-07, confirmado no simulador em 2026-11-11: o
// rabicho ficava 10 px para DENTRO da caixa e cobria a primeira letra da linha
// ("o próximo ‹asso pronto"). Ele precisa sair pela borda, apontando para o
// Pixel, sem ser cortado pelo `overflow: hidden` do invólucro animado.
const flat = (node: { props: { style: unknown } }) =>
  StyleSheet.flatten(node.props.style as never) as Record<string, number>;

function geometry(align: 'left' | 'right') {
  const view = render(
    <SpeechBubble text="Conquista sua!" testID="bolha" align={align} visible tailTop={40} />,
  );
  const tail = flat(view.getByTestId('bolha-tail'));
  const box = flat(view.getByTestId('bolha-box'));
  const side = align === 'left' ? 'left' : 'right';
  const margin = align === 'left' ? 'marginLeft' : 'marginRight';
  return {
    tailCenter: tail[side] + tail.width / 2,
    // O quadrado gira 45°: a meia diagonal é o quanto ele avança além do centro.
    tailReach: (tail.width * Math.SQRT2) / 2,
    boxEdge: box[margin] ?? 0,
  };
}

describe('SpeechBubble — rabicho', () => {
  it.each(['left', 'right'] as const)('sai pela borda do balão (%s), e não cobre o texto', (align) => {
    const { tailCenter, boxEdge } = geometry(align);
    // Centro na borda: metade do losango fica fora da caixa e aponta para o Pixel.
    expect(tailCenter).toBe(boxEdge);
  });

  it.each(['left', 'right'] as const)('cabe no recorte do invólucro animado (%s)', (align) => {
    const { tailCenter, tailReach } = geometry(align);
    // Fora da caixa, mas não fora do invólucro: o `overflow: hidden` cortaria a ponta.
    expect(tailCenter - tailReach).toBeGreaterThanOrEqual(0);
  });
});
