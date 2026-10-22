# Pixel Assets

Desde 2026-10-21 o Pixel **não usa mais PNG no app**. O corpo é o desenho
vetorial `src/ui/characters/PixelBody.tsx` (SVG numa caixa de 576 × 864, em três
tons, com as poses de `pixelPoses.ts`), e o rosto continua sendo desenhado por
`PixelFace` por cima da tela escura.

Os arquivos desta pasta ficam só como **referência histórica** e não entram no
bundle, porque nada mais os importa:

- `pixel_core.png` é o render 3D antigo, com o rosto pintado, exportado em
  **576×864**;
- `pixel_core_faceless.png` é o mesmo render sem rosto, que foi a base de
  `PixelIllustration` até a troca;
- `dedicated/` guardava o contrato de renders por estado e tamanho, que o desenho
  vetorial dispensa: a pose sai do estado (`poseForState`).

A medida da tela do rosto (`PIXEL_SCREEN` em `pixelScreenGeometry.ts`) agora
vem do SVG, e o `pixel-screen-geometry-contract` a confere.
