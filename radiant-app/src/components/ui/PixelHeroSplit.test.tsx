import React from 'react';
import { render } from '@testing-library/react-native';
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
});
