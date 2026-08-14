import { PIXEL_MOUTH_BASELINE } from './pixelExpressions';

/**
 * Onde fica a "tela" do Pixel — o retângulo escuro que faz as vezes de rosto —
 * dentro do asset, em fração da própria imagem.
 *
 * Medido em 2026-08-11 sobre pixel_core.png (576×864) por detecção dos pixels
 * escuros no terço superior: x 168…336, y 200…312.
 *
 * Estas frações descrevem a IMAGEM, não o frame do componente. É toda a
 * diferença: a versão anterior do rosto se posicionava com `top: 22%` do frame,
 * enquanto a imagem tem altura `dimension × 1.48` dentro de um frame de
 * `× 1.38` e transborda `0.05 × dimension` para cima. Os olhos desenhados
 * apareciam uma cabeça acima do lugar. Quem posicionar rosto mede contra a
 * caixa da imagem, nunca contra o container externo.
 */
export const PIXEL_SCREEN = {
  x: 0.292,
  y: 0.231,
  w: 0.292,
  h: 0.13,
} as const;

/** Proporção do asset (largura ÷ altura). */
export const PIXEL_ASSET_ASPECT = 576 / 864;

/**
 * Altura do FRAME do componente, em múltiplos de `dimension`.
 * `PixelIllustration` monta o frame com esta razão.
 */
export const PIXEL_FRAME_RATIO = 1.38;

/**
 * Altura da caixa da IMAGEM, em múltiplos de `dimension`. Maior que o frame:
 * a imagem transborda, e a caixa é centrada no frame, então o excesso se
 * divide igualmente entre topo e base (ver `PIXEL_IMAGE_OVERFLOW_RATIO`).
 */
export const PIXEL_IMAGE_RATIO = 1.48;

/**
 * Quanto a imagem transborda o frame para CIMA, em múltiplos de `dimension`.
 * É o que converte uma coordenada medida na imagem para o espaço do frame —
 * subtraia este valor. Quem esquecer essa subtração erra por uma cabeça, que
 * é exatamente o defeito corrigido em 2026-08-11.
 */
export const PIXEL_IMAGE_OVERFLOW_RATIO = (PIXEL_IMAGE_RATIO - PIXEL_FRAME_RATIO) / 2;

/**
 * Onde fica a BOCA dentro do frame, em múltiplos de `dimension`, medida a
 * partir do topo e da esquerda do frame.
 *
 * Derivada, não medida à mão: a boca é `PIXEL_MOUTH_BASELINE` abaixo do centro
 * da tela do rosto (é assim que `PixelFace` a desenha), a tela é posicionada
 * por `PIXEL_SCREEN` contra a IMAGEM, e a imagem transborda o frame. Quem
 * quiser apontar alguma coisa para a boca — um balão, por exemplo — usa isto
 * em vez de reencontrar a conta, que é onde o erro mora.
 */
/**
 * É FUNÇÃO, e não constante de módulo, de propósito. `PIXEL_MOUTH_BASELINE`
 * mora em `pixelExpressions`, e calcular no corpo do módulo lê essa referência
 * durante a inicialização — o grafo de imports chega aqui antes daquele módulo
 * terminar, e o app morre com `ReferenceError: Property
 * 'PIXEL_MOUTH_BASELINE' doesn't exist`. Aconteceu em 2026-08-14, com jest,
 * tsc, lint e os 13 validadores TODOS verdes: nenhum deles enxerga ordem de
 * inicialização de módulo, só o app rodando. Dentro da função a referência
 * resolve na hora da chamada, quando todo mundo já carregou.
 */
export function pixelMouthAnchor() {
  const mouthBaselineWithinScreen = 0.5 + PIXEL_MOUTH_BASELINE;

  return {
    x: PIXEL_SCREEN.x + PIXEL_SCREEN.w / 2,
    y:
      (PIXEL_SCREEN.y + mouthBaselineWithinScreen * PIXEL_SCREEN.h) * PIXEL_IMAGE_RATIO -
      PIXEL_IMAGE_OVERFLOW_RATIO,
  };
}
