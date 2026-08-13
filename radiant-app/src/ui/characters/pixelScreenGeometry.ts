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
