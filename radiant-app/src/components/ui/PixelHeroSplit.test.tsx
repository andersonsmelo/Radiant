import React from 'react';
import { StyleSheet } from 'react-native';
import { act, render } from '@testing-library/react-native';
import { PixelHeroSplit } from './PixelHeroSplit';

const PROPS = {
  eyebrow: 'Jornada de Radiologia',
  message: 'Vamos continuar de onde você parou.',
  ringValue: 2,
  ringTotal: 5,
  ringLabel: 'Meta do dia',
  state: 'guide' as const,
  tier: 'intermediate' as const,
  accessibilityLabel: 'Pixel guiando a jornada',
};

describe('PixelHeroSplit — escala de fonte do eyebrow', () => {
  // A coluna do personagem tem largura FIXA, presa ao tamanho da ilustração
  // (176px em `lg`, 108px no compacto). Isso é deliberado: sem a trava, o
  // eyebrow em caixa alta com tracking define a largura intrínseca da coluna e
  // rouba o espaço do balão. O efeito colateral é que o eyebrow não tem para
  // onde crescer — num ajuste de fonte grande do sistema ele passa a quebrar
  // dentro da palavra, que é o defeito que estes casos travam.
  it('limita a escala do eyebrow para que ele caiba na coluna de largura fixa', () => {
    const { getByText } = render(<PixelHeroSplit {...PROPS} />);

    expect(getByText('Jornada de Radiologia').props.maxFontSizeMultiplier).toBe(1.5);
  });

  it('nao limita a escala da mensagem: o teto vale so para o rotulo decorativo', () => {
    const { getByText } = render(<PixelHeroSplit {...PROPS} />);

    // O balão vive na coluna flexível e cresce com o contêiner, então ele
    // acompanha o ajuste do sistema por inteiro. Um teto aplicado aqui seria
    // regressão de acessibilidade em texto que o usuário precisa ler.
    expect(getByText(PROPS.message).props.maxFontSizeMultiplier).toBeUndefined();
  });

  it('mostra a legenda da meta junto do anel, e nao apenas na acessibilidade', () => {
    const { getByText } = render(<PixelHeroSplit {...PROPS} />);

    expect(getByText('Meta do dia')).toBeTruthy();
  });
});

describe('PixelHeroSplit — o balão nasce da boca', () => {
  // O rabicho é o ponto em que a fala encosta no mascote. Se ele for derivado
  // do frame do componente em vez da geometria da imagem, aponta para o peito
  // do Pixel — que é o mesmo erro de unidade que o contrato de âncora do rosto
  // já trava para os olhos e a boca desenhados. Aqui a trava é sobre quem
  // CONSOME essa geometria de fora do personagem.
  // `onLayout` não dispara sob o renderer de teste, e tanto a posição da
  // ilustração quanto a altura natural do balão vêm de medida. Sem simular os
  // dois eventos o rabicho cai no fallback de rodapé e o caso passaria a
  // verificar o comportamento antigo achando que verifica o novo.
  function flushLayouts(node: ReturnType<typeof render>, illustrationTop: number) {
    act(() => {
      node.getByTestId('journey-hero-illustration').props.onLayout?.({
        nativeEvent: { layout: { x: 0, y: illustrationTop, width: 176, height: 243 } },
      });
    });

    act(() => {
      node.UNSAFE_root
        .findAll(
          (n: { props?: { onLayout?: unknown; testID?: string } }) =>
            typeof n.props?.onLayout === 'function' &&
            // A ilustração já foi medida acima com o seu `y` real. Incluí-la na
            // varredura genérica a remediria com y=0 e o caso passaria a medir
            // a partir do topo da coluna, não do topo da ilustração.
            n.props?.testID !== 'journey-hero-illustration',
        )
        .forEach((n: { props: { onLayout: (e: unknown) => void } }) => {
          n.props.onLayout({ nativeEvent: { layout: { x: 0, y: 0, width: 200, height: 160 } } });
        });
    });
  }

  it('põe o rabicho na altura da boca, medida contra a imagem e não contra o frame', () => {
    const node = render(<PixelHeroSplit {...PROPS} />);
    // O eyebrow ocupa o topo da coluna; a ilustração começa abaixo dele.
    flushLayouts(node, 20);

    // PIXEL_MOUTH_ANCHOR.y ≈ 0.438 × 176 (largura da coluna em `lg`) ≈ 77px
    // abaixo do topo da ilustração, mais os 20px do eyebrow ≈ 97, menos meia
    // altura do rabicho. Medir contra o FRAME daria ~0.22 × 176 ≈ 39px — uma
    // cabeça acima, que é a diferença que este caso existe para pegar.
    const top = StyleSheet.flatten(node.getByTestId('journey-hero-bubble-tail').props.style).top;

    // 20 (eyebrow) + 0.4381 × 176 (boca) − 9 (meia altura do rabicho) ≈ 88.
    expect(typeof top).toBe('number');
    expect(top).toBeGreaterThan(80);
    expect(top).toBeLessThan(96);
  });

  it('mantém a mensagem na tela enquanto o balão recolhe, para não encolher uma caixa vazia', () => {
    const node = render(<PixelHeroSplit {...PROPS} />);
    expect(node.getByTestId('journey-hero-bubble')).toBeTruthy();

    node.rerender(<PixelHeroSplit {...PROPS} message={undefined} />);

    // Ainda montado: quem desmonta é o onHidden, no fim do recolhimento.
    expect(node.getByTestId('journey-hero-bubble')).toBeTruthy();
  });
});
