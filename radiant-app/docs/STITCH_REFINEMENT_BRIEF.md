# Radiant Stitch Refinement Brief

## Objective

Use the first Stitch output as the foundation for the next design iteration instead of restarting from zero.

This brief preserves the strongest signals from the generated work while removing drift, improving consistency, and aligning the system with:

- Radiant's product positioning
- mobile usability
- maintainability for a founder + AI workflow
- accessible, premium, progression-first UX

## Skills Applied

- `ui-ux-pro-max`
- `antigravity-design-expert`

## Constraint Notes

- The `ui-ux-pro-max` helper script is currently broken due to a syntax error in the skill bundle. Validation below was derived from the skill datasets directly.
- The `antigravity-design-expert` guidance is adapted selectively. Radiant is a mobile learning app, not a full antigravity web experience, so only the useful principles should survive:
  - weightlessness
  - spatial depth
  - glass overlays
  - disciplined motion

## Keep vs Change

## Keep

- The blue + cyan brand direction
- The journey-first layout
- The lesson screen's overall hierarchy
- The clearer premium tone versus the old app
- The idea of a guiding mascot
- The energetic CTA treatment

## Change

- Sci-fi copy and terminology
- Inconsistent mascot rendering
- Overflowing or clipped node labels on mobile
- Overuse of borders where tonal layering should do the work
- Generic or underspecified component primitives in the app implementation
- Dark current implementation that no longer matches the approved direction

## External Validation Summary

Derived from `ui-ux-pro-max` datasets:

- `Glassmorphism` is valid for premium product surfaces, but needs strong contrast discipline.
- `Accessible & Ethical` and `Inclusive Design` are non-negotiable because the product sits in education and healthcare-adjacent territory.
- `Touch Target Size` minimum is 44x44px.
- `Animation` should stay at 150-300ms for micro-interactions.
- `Reduced Motion` must be respected.
- `Color Contrast` for text must stay at 4.5:1 minimum.
- Typography options most compatible with the current direction:
  - Space Grotesk + Manrope
  - Lexend + Source Sans 3
  - Figtree + Noto Sans
  - Outfit + Work Sans

Derived from `antigravity-design-expert`:

- Premium depth should come from layering and soft Z-space, not heavy ornament.
- Glass effects are useful for floating headers, mascot bubbles, and overlays.
- Motion should never snap instantly.
- Parallax and theatrical spatial effects should be used very sparingly on mobile.

## Refined Visual Position

### Direction Name

Tactical Bright Learning

### Refinement Goal

Shift the current Stitch output away from "medical sci-fi HUD" and toward "premium progression-based mobile learning".

### Final Tone

- energetic
- credible
- bright
- mobile-native
- guided
- lightweight

### Explicit Non-Goals

- cold clinical product
- childish edtech
- cyberpunk sci-fi interface
- casino reward language
- template SaaS card stack

## Screen-by-Screen Refinement

## 1. Journey Home

### What Works

- The vertical node spine is the right signature for the product.
- The primary CTA already feels appropriately dominant.
- The progress treatment is clear and high-signal.

### Problems

- Node labels overflow or clip on mobile.
- The top shell is too generic and does not yet feel like a branded learning environment.
- The mascot appears as an avatar in one place and as an icon elsewhere, breaking identity.
- The spacing between nodes is visually dramatic but wastes valuable mobile space.

### Refinement Direction

- Keep the central journey spine.
- Remove side labels that leave the safe width of the phone.
- Use one of these two patterns:
  - node label below the active node
  - compact title row embedded into the node card itself
- Reduce vertical gaps between non-active nodes.
- Add a stronger branded hero strip that includes:
  - current unit
  - streak
  - next learning action
  - mascot encouragement

### Antigravity Layer

- Use a very soft floating header with blur.
- Give the active node a weightless energy halo, but only one animated ring.
- Use subtle background depth behind the journey path, not decorative texture everywhere.

## 2. Lesson Flow

### What Works

- Best screen of the first batch.
- Strong hierarchy.
- Better editorial pacing.
- The image + concept pairing is directionally correct.

### Problems

- The image dominates the first screen too strongly.
- The learning explanation feels detached from the image rather than integrated with it.
- The hotspot affordance looks more like an image annotation tool than guided study.
- Bottom action bar is good visually, but systemically disconnected from the current app primitives.

### Refinement Direction

- Keep the same page structure.
- Reduce the image block's visual dominance by roughly 10-15%.
- Pull the concept explanation closer to the image.
- Make the image interaction clearly instructional:
  - label the hotspot
  - use a guided highlight
  - explain why the hotspot matters
- Use one consistent educational hint style for "Radiant Tip".

### Antigravity Layer

- Let the image card float subtly over the surface with soft depth.
- Add only one parallax-capable layer if ever implemented on web preview.
- Avoid stacking too many shadows or blurs.

## 3. Checkpoint / Reward

### What Works

- Clear sense of accomplishment
- strong primary CTA
- progress visualization is promising

### Problems

- Copy drifts into sci-fi fiction
- the screen feels more like a futuristic command center than a learning reward
- the mascot bubble competes with the content block
- "mission briefing" language is too theatrical for the product's trust goal

### Refinement Direction

- Keep the circular mastery visual.
- Rewrite the content using learning language:
  - "Checkpoint concluído"
  - "Você consolidou os fundamentos de..."
  - "Próxima lição"
  - "Continuar trilha"
- Reduce secondary card count if the information is not essential.
- Move the mascot from floating interruption into a structured encouragement block or corner callout.
- The reward accent should feel earned, not explosive.

### Antigravity Layer

- Allow one premium floating badge and one glass encouragement bubble.
- No extra layered movement beyond the CTA and progress ring.

## Mascot System Refinement

## Problem

The generated set uses multiple incompatible mascot representations:

- avatar
- icon substitute
- robot-style head
- abstract energy symbol

This destroys brand memory.

## Refinement Rule

The mascot must be a single identity system.

### Required Rules

- one visual art style
- one head/body proportion system
- one shape language
- one bubble style
- one placement rule set

### Recommended Presence

- Journey Home: yes
- Lesson Flow: optional, low frequency
- Checkpoint: yes
- Review: only when needed

### Emotional States

- encourage
- celebrate
- recover
- focus

## Component Refinement

The current app primitives are not enough to support the redesign.

## Required System Primitives

### 1. Primary CTA

Must support:

- icon slot
- loading state
- success state
- disabled state
- top-edge light pipe
- gradient fill variant

### 2. Secondary CTA

Needed for:

- back
- alternate actions
- support actions

### 3. Surface

Replace generic `Card` with a surface system:

- `surface/base`
- `surface/raised`
- `surface/glass`
- `surface/hero`

### 4. Journey Node

Must be its own component, not a one-off screen artifact.

States:

- locked
- available
- active
- resumable
- completed
- review due

### 5. Progress Signals

Create reusable:

- streak pill
- slim progress bar
- mastery ring
- checkpoint badge

## Typography Refinement

## Current Recommendation

Keep:

- `Space Grotesk` for display and headlines
- `Manrope` for body and UI

Reason:

- already present in the Stitch output
- balances tactical energy with readable body text
- supports a premium but approachable tone

## Rules

- avoid excessive all-caps outside labels and CTA text
- small labels should not go below 12px in production mobile
- body text on learning surfaces should remain highly readable and never feel decorative

## Color Refinement

Base the next iteration on the current bright surface system, not the dark implementation now in the app.

### Core Palette

- primary: electric blue
- accent: cyan
- reward: mint green
- text: graphite blue-black
- surfaces: cool white with blue cast

### Rules

- do not use pure gray
- do not use low-contrast cyan text on white
- active state must not depend on color alone

## Motion Refinement

## Keep

- active node halo
- subtle CTA movement
- lightweight progress feedback

## Remove or Reduce

- multiple simultaneous pulse layers
- ambient infinite animations outside loading/progress emphasis
- overly dramatic hover assumptions that do not map to touch devices

## Motion Rules

- 150-300ms for microinteractions
- one hero animation per view maximum
- reduced-motion fallback required
- use transform and opacity only

## Accessibility Constraints for Next Iteration

- touch targets minimum 44x44px
- visible focus treatment for any web-preview/exportable component
- text contrast minimum 4.5:1
- no state communicated only by color
- no critical interaction hidden behind hover-only patterns

## Priority Changes for Next Stitch Round

## Priority 1

- Redesign `Journey Home` so all node labels fit mobile safely
- Unify mascot identity
- Rewrite checkpoint copy away from sci-fi terminology

## Priority 2

- Tighten lesson image/text relationship
- Refine CTA system
- Replace border-heavy separations with tonal layering

## Priority 3

- Tune shadows, blur, and floating depth
- Reduce visual noise in support surfaces
- Align all screens to one reusable component grammar

## Prompt Addendum for Next Stitch Iteration

Use these refinements on top of the existing approved direction.

```text
Refine this existing Radiant mobile design. Keep the electric blue and cyan premium learning identity, but remove any sci-fi HUD feeling and make it feel more credible for radiology education.

Key refinements:
- keep the journey-first layout
- keep the premium bright surface system
- keep the mascot as a guide
- unify the mascot into one consistent visual identity
- make all node labels fully mobile-safe
- reduce decorative borders and use tonal layering instead
- keep glass and floating depth subtle and premium
- use light gamification only
- rewrite reward and checkpoint language to sound educational, not futuristic

Avoid:
- cold clinical dashboard
- childish edtech
- cyberpunk or command-center language
- casino reward styling
- generic SaaS card stacks
```

## Screen-Specific Prompt Addendum: Journey Home

```text
Refine this journey home screen for mobile iPhone layout. Keep the central progression spine, but fix all node labels so nothing clips or overflows on mobile. Make the hero more branded and motivating. Keep one active node halo only. Use one consistent mascot system. Reduce wasted vertical space while preserving a clear next-step focus.
```

## Screen-Specific Prompt Addendum: Lesson Flow

```text
Refine this lesson screen while keeping its current hierarchy. Reduce the visual dominance of the medical image slightly and strengthen the educational connection between image, hotspot, and explanatory text. Keep the experience clean, premium, and focused. Make the tip component feel like a reusable product pattern, not a one-off card.
```

## Screen-Specific Prompt Addendum: Checkpoint

```text
Refine this checkpoint screen to feel like premium educational progress, not sci-fi mission control. Keep the mastery ring, but rewrite all copy to emphasize learning progress, completion, and next-step confidence. Reduce theatrical terminology and keep the reward moment elegant, short, and motivating.
```

## Implementation Readiness Recommendation

Do not jump directly from the first Stitch output into final React Native screens.

Instead:

1. run one refinement round in Stitch
2. lock the mascot system
3. lock the token system
4. define the reusable primitives
5. then port the refined screens into the app

## Final Recommendation

Use the current `lesson_flow` output as the visual benchmark.

Use the current `journey_home` output as the structural benchmark, but redesign its node labeling and hero.

Use the current `checkpoint` output only as composition reference, not as copy or emotional tone reference.
