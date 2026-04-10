import type { CharacterSize, CharacterState, CharacterTier } from './types';

const PIXEL_BASE_ASSETS: Record<CharacterSize, number> = {
  // The current repository keeps a single core render.
  // Size is controlled by layout in PixelIllustration consumers.
  sm: require('./assets/pixel/pixel_core.png'),
  md: require('./assets/pixel/pixel_core.png'),
  lg: require('./assets/pixel/pixel_core.png'),
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
