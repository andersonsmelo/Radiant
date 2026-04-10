# Pixel Assets

This folder contains the base production asset contract for the `Pixel` mascot system.

Current runtime strategy:

- `pixel_core.png` is the current base render used in runtime for all size buckets;
- state variation is still composed in UI with glow, scan, orbit and face overlays;
- `src/ui/characters/pixelAssets.ts` is the single resolver for future dedicated renders;
- dedicated state/tier renders can be added later without touching the consuming screens.

Future exports (optional optimization):

- `exports/pixel_sm.png` for compact references
- `exports/pixel_md.png` for card-scale references
- `exports/pixel_lg.png` for hero and promo references

Future dedicated render contract:

- `dedicated/pixel_idle_starter_sm.png`
- `dedicated/pixel_thinking_intermediate_md.png`
- `dedicated/pixel_guide_intermediate_lg.png`
- `dedicated/pixel_happy_intermediate_md.png`
- `dedicated/pixel_celebrate_advanced_lg.png`
- `dedicated/pixel_oops_starter_md.png`
