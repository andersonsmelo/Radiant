// Gerado por scripts/content/build-rtg-batches.mjs a partir de content-manifest/rtg-2026/aulas.
// Não edite à mão: mude a aula-fonte e rode o gerador.
import type { ImageSourcePropType } from 'react-native';
import type { ResolvedInteractionImage } from '../../lesson-flow/renderers/InteractionImageSource';

export type RtgImageCredit = Readonly<{ id: string; author: string; license: string; licenseUrl: string; sourcePage: string; modification: string; alt: string; width: number; height: number; source: ImageSourcePropType }>;

export const RTG_IMAGES: readonly RtgImageCredit[] = [
  {
      "id": "image:rtg-2026:m08:torax-pa-adulto-01",
      "author": "Mikael Häggström",
      "license": "CC0 1.0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "sourcePage": "https://commons.wikimedia.org/wiki/File:Normal_posteroanterior_(PA)_chest_radiograph_(X-ray).jpg",
      "modification": "redução",
      "alt": "Radiografia do tórax em tons de cinza, em formato vertical. Nos cantos superiores há as marcações de texto Dx, à esquerda de quem olha, e Sin, à direita.",
      "width": 1049,
      "height": 1200,
    "source": require('../../../../assets/content/rtg-2026/imagens/m08/torax-pa-adulto-01.jpg'),
  },
  {
      "id": "image:rtg-2026:m08:torax-perfil-adulto-01",
      "author": "Mikael Häggström",
      "license": "CC0 1.0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "sourcePage": "https://commons.wikimedia.org/wiki/File:Normal_lateral_chest_radiograph_(X-ray).jpg",
      "modification": "redução",
      "alt": "Radiografia do tórax em tons de cinza, em formato vertical. Não há marcações de texto visíveis.",
      "width": 865,
      "height": 1200,
    "source": require('../../../../assets/content/rtg-2026/imagens/m08/torax-perfil-adulto-01.jpg'),
  },
];

export function resolveRtgImage(ref: string): ResolvedInteractionImage | null {
  const image = RTG_IMAGES.find(entry => entry.id === ref);
  return image ? { source: image.source, width: image.width, height: image.height } : null;
}
