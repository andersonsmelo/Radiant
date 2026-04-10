# Character Asset Technical Guide

## File Specifications
*   **Format**: PNG (24-bit or 32-bit).
*   **Transparency**: Required (Alpha channel).
*   **Color Profile**: sRGB.

## Dimensions & Exports
Optimize for mobile displays (Retina/High-DPI).

| Size Token | Dimension (px) | Usage Context |
| :--- | :--- | :--- |
| `sm` | 96 x 96 | Header icons, inline feedback |
| `md` | 160 x 160 | Standard dialogs, cards |
| `lg` | 512 x 512 | Hero moments, checkpoint, quiz summary |

## Composition Rules
1.  **Canvas**: Prefer transparent canvas with portrait-safe framing.
2.  **Safe Area**: Keep main character mass within the center 80% to avoid clipping in rounded containers.
3.  **Padding**: Leave ~10% padding on all sides to allow for glow effects without cutoff.
4.  **Centering**: Optical center, not just bounding box center.

## Visual Direction
*   Clean robot silhouette with rounded forms.
*   Medical-tech premium, not toy-like.
*   Subtle radiology cues:
    *   pixel/grid accents
    *   scan overlays
    *   restrained cyan-blue glow
*   Face should remain readable on small iPhone sizes.

## Evolution Tiers
Exports can later support:
*   `starter`: simpler, softer glow
*   `intermediate`: more light and light holographic support
*   `advanced`: grid/overlay/orbit support and stronger glow

## Dark Mode Compatibility
Radiant is **Dark-First**.
*   Verify assets against `#000000` and `#1C1C1E` backgrounds.
*   Ensure internal contrast is high enough.
*   Avoid dark grey outer strokes that might blend into the background. Use light rim lighting instead.

## Naming Convention
The app now resolves Pixel assets in this order:

1. dedicated render for `state + tier + size`
2. size-specific base export
3. legacy fallback composition in UI

Recommended dedicated asset convention:

`pixel_[state]_[tier]_[size].png`

Examples:
*   `pixel_idle_starter_sm.png`
*   `pixel_thinking_intermediate_md.png`
*   `pixel_guide_intermediate_lg.png`
*   `pixel_celebrate_advanced_lg.png`
*   `pixel_oops_starter_md.png`

If only base exports are available, keep using:
*   `exports/pixel_sm.png`
*   `exports/pixel_md.png`
*   `exports/pixel_lg.png`
