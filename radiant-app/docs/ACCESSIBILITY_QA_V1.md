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

Executed on 2026-07-26 against the local Release build on iOS 26.5. Items 3 and
4 passed with captured evidence. Item 1 passed **only for the scope the
checklist had that day** — the entry animation on the lesson path, measured by
frame stability; shake, scale and press were explicitly not measured, and the
galaxy surfaces were not part of the item yet. The two defects found —
decorative icons exposed with their raw font codepoint, and Expo Router route
paths leaking into the navigation header — were fixed and reverified on device
the same day, and both are now covered by the contract test.

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

**The gate stands at 4/5 approved: items 1, 3, 4 and 5. Only item 2 is open.**

Item 1 was reopened on 2026-08-05 and **closed again on 2026-08-06 with its own
device pass** — the fastest way to settle a bookkeeping dispute is to go and
measure. It had been reopened because the checklist text was widened on
2026-08-03 to require walking the galaxy map, a galaxy interior and a planet
interior, and those four surfaces only began honouring the preference that same
day (`fix(a11y): respeita reduced motion nas quatro superficies da galaxia`); a
manual pass recorded a week earlier could not cover a criterion added afterwards
over code that did not yet exist.

The new pass walked all three surfaces on the TestFlight build with the
preference on. Nothing moves on its own, tapping a planet opens with no
animation, and — the part that actually decides this item — **the state
distinction survives**: compared against a baseline capture taken with the
preference off, the active galaxy keeps its lit halo and stays the brightest of
the four, and inside `Anatomia` the active, available and locked planets remain
distinguishable by eye. The glow settles at its resting value instead of going
to zero, which is what the checklist demands. Evidence, including what the pass
does **not** prove:
[`docs/evidence/2026-08-06-b8-reduce-motion-iphone.md`](evidence/2026-08-06-b8-reduce-motion-iphone.md).

One limit worth carrying: no planet in the account is **completed**, so the
distinction verified was active × available × locked. A completed state, when it
first exists, deserves its own look.

Item 2 still needs a complete VoiceOver pass (task B4). A physical-iPhone
session on 2026-08-05 heard tab names/positions/roles and the disabled state of
`Confirmar reset com token` once, with no spontaneous repetition. That closes the ambiguity between a
single structured announcement and duplicate speech, but the session did not
transcribe a hint or activate a genuinely busy control. Details:
[`docs/evidence/2026-08-05-testflight-1.3.1-build-5-iphone.md`](evidence/2026-08-05-testflight-1.3.1-build-5-iphone.md).

The earlier method and the fixes from the 2026-07-26 device run remain in
[`docs/evidence/2026-07-26-accessibility-gate2.md`](evidence/2026-07-26-accessibility-gate2.md).

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
   **Read "What item 2 can and cannot reach" below before booking device time** —
   two of the four things this line asks for have exactly one target in the
   product, and one of them has none.
3. In a quiz, confirm the selected answer and the post-submit locked state are
   communicated without relying on color.
4. In onboarding, confirm exactly one specialty and one daily goal are exposed
   as selected radio choices.
5. In web preview with keyboard navigation, confirm every focusable control
   has a visible focus treatment and that the Home shortcut and sign-in action
   remain at least 44 by 44 px.

## What item 2 can and cannot reach — measured 2026-08-06

Item 2 asks for four things: name, hint, disabled and busy. The first three
have been heard on real controls. The fourth cannot be produced by walking the
shipped app, and that is a fact about the build, not a missing session.

**Hint — exactly one target.** The only `AppButton` in product code carrying an
`accessibilityHint` is the home CTA in
[`JourneyHomeScreen`](../src/features/journey/screens/JourneyHomeScreen.tsx):
label `{continueLabel}`, hint *"Abre o próximo passo elegível da trilha
ativa."*. Every other hint-bearing control — track cards, quiz answers, lesson
choices, the legal links on Progresso — is a `Pressable`, so none of them
exercises this line. Whoever runs the pass should go straight to the home CTA.

**Busy — no target at all.** The single `AppButton` that ever receives
`loading` (and therefore `accessibilityState.busy`) is inside
`PaywallOfferCard`. It renders only on `CheckpointScreen`, only when
`PaywallService` returns an offer — and `evaluateEligibility()` returns
`blocked / paywall_disabled` unless `AppConfig.ENABLE_PAYWALL` is on.
`EXPO_PUBLIC_ENABLE_PAYWALL` is declared in **no** build profile of `eas.json`,
and `src/config.ts` defaults it to `false`. Even with the flag on, the busy
window is two local AsyncStorage awaits — milliseconds — and it ends by setting
the offer to `null`, which unmounts the button instead of returning it to idle.
There is nothing for a screen reader to announce.

This is the same defect class as B0: a flag that is not declared in the
production profiles. The item was never "not yet executed"; it was
**unreachable**, and a device session would have spent a morning discovering
that.

**Three ways out, and the third is the honest one:**

- **(a)** Close the item on what exists — name, position, role and disabled
  heard on real controls, plus the `AppButton` unit contract covering `busy`.
  Costs nothing, but the gate starts accepting a unit contract where it asked
  for an audible announcement.
- **(b)** Change the product so the state becomes audible. Wrong on its face:
  altering behaviour to satisfy a gate, and it would need an artificial delay.
- **(c)** Exercise it through a harness — an `AppButton` held in `loading` on
  the dev-tools screen the app already has. Measures exactly what the item
  wants, the component announcing its state once, without touching the product
  path. **Not yet built; this is the open decision.**
