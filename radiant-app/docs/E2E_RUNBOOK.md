# Maestro local E2E runbook

The `.maestro` workspace covers the real local-first route, not a mocked API:

- `onboarding-to-home.yaml`: deep-link onboarding, selects preferences and
  reaches the learning-road home.
- `learning-critical-path.yaml`: completes both seeded lessons, checkpoint,
  reward and reaches Progress.
- `offline-relaunch.yaml`: completes a local lesson, relaunches with airplane
  mode enabled, then confirms the persisted checkpoint is still available.

## Current execution state

On 2026-07-23 the workspace had no `maestro` binary and no available iOS or
Android virtual device. The flows and their static contract test are committed,
but no device PASS is claimed until this runbook is executed on each platform.

## Prerequisites

1. Install the Maestro CLI following its official installation guide.
2. Start an iOS simulator or Android emulator, or attach an authorized test
   device. Confirm it is visible to the relevant platform tooling.
3. Build/install the `e2e-test` development client. It disables the beta gate,
   enables the learning road and keeps remote sync off:

   ```sh
   eas build --profile e2e-test --platform ios
   eas build --profile e2e-test --platform android
   ```

   For a local native build, use the same six `EXPO_PUBLIC_*` values from the
   `e2e-test` profile before invoking the Expo platform command.

## Validate before running

From `radiant-app`:

```sh
npm run test:maestro-contract
maestro --version
maestro hierarchy
```

`maestro hierarchy` is the selector audit. If a label differs on a real device,
fix the control's accessible name or its deterministic `testID`; do not replace
the assertion with a coordinate tap.

## Execute

```sh
maestro test .maestro/onboarding-to-home.yaml
maestro test .maestro/learning-critical-path.yaml
maestro test .maestro/offline-relaunch.yaml
```

Run each flow once on an iOS simulator and once on an Android emulator. Keep
the generated artifacts in `.maestro/artifacts/` out of Git. For a triageable
CI-style report, use:

```sh
maestro test .maestro --format junit --output maestro-results.xml
```

## Sign-off matrix

| Platform | Device/runtime | Build | Onboarding | Critical path | Offline relaunch | Owner/date |
|---|---|---|---:|---:|---:|---|
| iOS | pending | `e2e-test` | pending | pending | pending | |
| Android | pending | `e2e-test` | pending | pending | pending | |

No EAS workflow or cloud execution is enabled by this change. Add it only after
both local rows are recorded as passing and its cost/privacy review is approved.
