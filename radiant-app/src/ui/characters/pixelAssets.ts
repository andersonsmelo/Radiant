import type { CharacterSize, CharacterState, CharacterTier } from './types';

const PIXEL_BASE_ASSETS: Record<CharacterSize, number> = {
  // O render base não tem rosto: o rosto é desenhado por PixelFace sobre a
  // "tela" do personagem, para que ele possa mudar de expressão. O render com
  // rosto pintado (pixel_core.png) segue no repositório como referência.
  sm: require('./assets/pixel/pixel_core_faceless.png'),
  md: require('./assets/pixel/pixel_core_faceless.png'),
  lg: require('./assets/pixel/pixel_core_faceless.png'),
};

type PixelDedicatedAssetRegistry = Partial<
  Record<CharacterState, Partial<Record<CharacterTier, Partial<Record<CharacterSize, number>>>>>
>;

// Dedicated state/tier renders can be registered here as they become available.
// Until then, PixelIllustration falls back to the size-specific base exports above.
const PIXEL_DEDICATED_ASSETS: PixelDedicatedAssetRegistry = {};

export function resolvePixelAsset(
  state: CharacterState,
  tier: CharacterTier,
  size: CharacterSize
): { source: number; isDedicated: boolean } {
  const dedicatedSource = PIXEL_DEDICATED_ASSETS[state]?.[tier]?.[size];

  if (dedicatedSource) {
    return {
      source: dedicatedSource,
      isDedicated: true,
    };
  }

  return {
    source: PIXEL_BASE_ASSETS[size],
    isDedicated: false,
  };
}
