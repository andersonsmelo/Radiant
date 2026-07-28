# Maestro local E2E runbook

The `.maestro` workspace covers the real local-first route, not a mocked API:

- `boot-to-home.yaml`: a clean install (`clearState`) boots straight to the
  learning-road home (`Foco de hoje`) — v1.3 has no blocking wizard.
- `learning-critical-path.yaml`: completes both seeded lessons, checkpoint,
  reward and reaches Progress.
- `offline-relaunch.yaml`: completes a local lesson, relaunches with airplane
  mode enabled, then confirms the persisted checkpoint is still available.

## Current execution state

On 2026-07-23 the local environment was prepared with Maestro 2.7.0, an iOS
26.5 simulator and an Android API 36 emulator. A local Release build equivalent
to `e2e-test` was installed on iOS: onboarding passed, while the critical path
failed after the first quiz because `Fixe este ponto` was not visible. Offline
relaunch and every Android flow remained unexecuted. No device PASS was claimed.

On 2026-07-26 the `Fixe este ponto` block was root-caused to two defects: a real
layout defect (the lower answer options rendered below the scroll fold, under the
fixed footer, so their taps hit the disabled button and selection never
registered) and a wrong assertion (the reinforce step shows answer feedback,
`Resposta correta`/`Vamos reforçar`, never the payload title on the answered
path). Both were fixed — the visual panel was made less dominant so options stay
reachable, and the flow now centers options before tapping and asserts
`Concluir e voltar`.

Reconciling the rest of the critical path on 2026-07-26 surfaced three further
causes. First, another real layout defect: the tab bar is absolutely positioned
(~86pt of floating chrome), so it does not inset scroll content, and the home
reserved only 24pt — the primary CTA was permanently clipped under the bar for
real users. A shared `tabBarClearance` constant now covers it. Second, a
selector incompatibility: `AppButton` sets `accessibilityRole` plus
`accessibilityLabel` on the Pressable, so iOS collapses the subtree and the node
exposes `accessibilityText` with no `text` attribute — `scrollUntilVisible`
matches `element.text` and never resolves against these, while `visible`/`tapOn`
do match. Flows now use a `repeat` guarded by `while: notVisible` before each
footer action. Third, the flow's tail targeted `defaultTrack.ts` (2 lessons),
but the running track is generated from the catalog (7 lessons) and unlocks the
reward only after the last lesson, so the achievement is unreachable in a smoke
run; the flow now ends at Progresso and the reward node has no E2E coverage.

With those fixes, all three flows pass on iOS in one suite run
(`3/3 Flows Passed in 8m 44s`), so iOS is `passed`. Android is still
`environment-blocked` — no local build was produced or installed.

On 2026-07-28 the onboarding wizard (`src/app/onboarding/*`) was removed as an
unfinished, unreachable prototype, and `onboarding-to-home.yaml` was retired. Its
assertions had already gone stale: the 2026-07-27 wizard migration to pt-BR left
the flow asserting English strings (`WELCOME TO RADIANT`, `STEP 3 OF 4`), so the
2026-07-26 `3/3` iOS pass predates that drift. Its replacement,
`boot-to-home.yaml`, asserts the stable pt-BR home (`Foco de hoje`) after a clean
install. The new flow passes the static Maestro contract but has **not** been
device-run yet — that device pass belongs to task B0.1, so the iOS boot row below
is `pending`.

The dated environment inventory and first-run matrix live in
[`docs/evidence/2026-07-23-device-e2e-baseline.md`](evidence/2026-07-23-device-e2e-baseline.md);
the 2026-07-26 root cause, fixes and updated matrix live in
[`docs/evidence/2026-07-26-device-e2e-followup.md`](evidence/2026-07-26-device-e2e-followup.md).
Its states are defined in [`docs/evidence/README.md`](evidence/README.md):
`environment-blocked`, `app-failed`, and `passed`. A static contract, local
build, or YAML inspection never promotes a platform to `passed`.

## Prerequisites

1. Install the Maestro CLI following its official installation guide.
2. Start an iOS simulator or Android emulator, or attach an authorized test
   device. Confirm it is visible to the relevant platform tooling.
3. Build/install a local `e2e-test` build. The profile disables the Dev Client,
   beta gate, push and remote sync, while enabling the learning road. Do not use
   EAS cloud, submission or a release profile for this validation:

   ```sh
   eas build --profile e2e-test --platform ios
   eas build --profile e2e-test --platform android
   ```

   For a local native build, use the same seven `EXPO_PUBLIC_*` values from the
   `e2e-test` profile before invoking the Expo platform command. A Release
   simulator build is acceptable when it embeds the local test bundle and does
   not start a development server.

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
maestro test .maestro/boot-to-home.yaml
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

| Platform | Device/runtime | Build | Boot-to-home | Critical path | Offline relaunch | Status | Owner/date |
|---|---|---|---:|---:|---:|---|---|
| iOS | see dated evidence | local Release equivalent | pending (flow repointed 2026-07-28) | passed (reward node not covered) | passed | boot-to-home pending device re-run (B0.1); critical-path + offline passed 2026-07-26 | engineering / 2026-07-28 |
| Android | see dated evidence | `e2e-test` | pending | pending | pending | environment-blocked | engineering / 2026-07-26 |

No EAS workflow or cloud execution is enabled by this change. Add it only after
both local rows are recorded as `passed` in dated evidence and its cost/privacy
review is approved.
