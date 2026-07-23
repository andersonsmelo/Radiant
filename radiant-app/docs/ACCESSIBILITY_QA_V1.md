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

## Release-candidate manual checklist

1. Enable Reduce Motion in iOS or Android accessibility settings, reopen a
   lesson, quiz and review flow, and confirm that entry, shake, scale and
   press effects do not move content.
2. With VoiceOver or TalkBack, move through AppButton controls. Confirm names,
   hints and disabled/busy state are announced once and in the expected order.
3. In a quiz, confirm the selected answer and the post-submit locked state are
   communicated without relying on color.
4. In onboarding, confirm exactly one specialty and one daily goal are exposed
   as selected radio choices.
5. In web preview with keyboard navigation, confirm every focusable control
   has a visible focus treatment and that the Home shortcut and sign-in action
   remain at least 44 by 44 px.
