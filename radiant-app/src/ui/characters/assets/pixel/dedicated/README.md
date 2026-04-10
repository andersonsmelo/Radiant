# Dedicated Pixel Renders

Drop final production PNGs for Pixel here when the art pack is ready.

Expected pattern:

- `pixel_[state]_[tier]_[size].png`

Examples:

- `pixel_idle_starter_sm.png`
- `pixel_thinking_intermediate_md.png`
- `pixel_guide_intermediate_lg.png`
- `pixel_happy_intermediate_md.png`
- `pixel_celebrate_advanced_lg.png`
- `pixel_oops_starter_md.png`

The app is already prepared to resolve these files through `src/ui/characters/pixelAssets.ts`.
Until they are registered there, PixelIllustration continues using the size-based base exports and UI-composed overlays.
