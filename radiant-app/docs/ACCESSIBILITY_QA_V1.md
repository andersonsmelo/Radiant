# Accessibility QA v1

This gate covers the interaction primitives and critical learning paths added
through the first implementation wave. It complements, rather than replaces,
runtime checks with VoiceOver and TalkBack on release candidates.

## Enforced contracts

- `AppButton` exposes a button role, a programmatic name, optional hint and
  disabled/busy state. Its 56 px height exceeds the 44 px minimum target.
- Keyboard and web-preview focus receives a visible border treatment.
- The motion layer reads `AccessibilityInfo.isReduceMotionEnabled()` and
  subscribes to `reduceMotionChanged`. Entry, scale, shake and press effects
  resolve immediately when the preference is enabled.
- Quiz answers announce their selected and locked states; onboarding choices
  are radio controls with a selected state.
- The Home continuation shortcut and onboarding sign-in action have names,
  hints and a 44 px touch target.

## Automated evidence

Run from `radiant-app`:

```sh
npm test -- --runInBand src/ui/accessibility/useReducedMotionPreference.test.ts src/components/ui/AppButton.test.tsx
npm run quality
```

The semantic color tests also protect the defined text, focus and status-token
contrast pairs. Functional flow tests cover the learning screens separately.

## Latest run of the manual checklist

Executed on 2026-07-26 against the local Release build on iOS 26.5. Items 1, 3
and 4 passed with captured evidence. The two defects found — decorative icons
exposed with their raw font codepoint, and Expo Router route paths leaking into
the navigation header — were fixed and reverified on device the same day, and
both are now covered by the contract test.

Item 5 (keyboard navigation) was closed on 2026-07-27: the static web build was
generated (`npx expo export --platform web`) and the critical flow — Learning
Road home → lesson → quiz → onboarding/sign-in — was traversed with the keyboard
only. Focus order is logical, every focusable control shows a visible focus ring
(browser `outline: auto` amber; the `AppButton` adds its own 3px focus border),
there are no focus traps (the home cycles and wraps; the pushed lesson route
contains focus to its own controls), and every control meets the 44px target —
the Home shortcut at 56px and the sign-in action at 44px. Method, the full
per-screen focus tables and the tooling caveat about keyboard activation:
[`docs/evidence/2026-07-27-accessibility-gate2-item5-keyboard.md`](evidence/2026-07-27-accessibility-gate2-item5-keyboard.md).

The gate remains unapproved for one remaining reason: item 2 needs VoiceOver
with audio and has not been done (task B4). Details, method and the fix for the
2026-07-26 device run: [`docs/evidence/2026-07-26-accessibility-gate2.md`](evidence/2026-07-26-accessibility-gate2.md).

Two enforced contracts follow from that run and are worth stating here:
decorative icons must go through `DecorativeIcon`, never `MaterialIcons`
directly; and the root `Stack` hides headers by default, so a new route cannot
silently inherit the native one.

## Release-candidate manual checklist

1. Enable Reduce Motion in iOS or Android accessibility settings, reopen a
   lesson, quiz and review flow, and confirm that entry, shake, scale and
   press effects do not move content. **Also walk the galaxy surfaces** — the
   map, a galaxy interior and a planet interior. Until 2026-08-03 those four
   screens ignored the preference entirely (continuous `withRepeat` glow loops,
   staggered entries, press recoil); they now honour it, and the rule applied
   was **remove the motion, not the information**: the glow is what separates an
   active planet from a completed and an ordinary one by eye, so under the
   preference it settles at its cycle's resting value instead of going to zero.
   Confirm that distinction still reads with motion reduced — if every planet
   looks alike, the preference has erased state, which is a defect. Covered in
   code by `PlanetBody.test.tsx`; the walkthrough is what verifies it on device.
2. With VoiceOver or TalkBack, move through AppButton controls. Confirm names,
   hints and disabled/busy state are announced once and in the expected order.
3. In a quiz, confirm the selected answer and the post-submit locked state are
   communicated without relying on color.
4. In onboarding, confirm exactly one specialty and one daily goal are exposed
   as selected radio choices.
5. In web preview with keyboard navigation, confirm every focusable control
   has a visible focus treatment and that the Home shortcut and sign-in action
   remain at least 44 by 44 px.
