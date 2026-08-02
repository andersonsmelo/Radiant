# Maestro local E2E runbook

The `.maestro` workspace covers the real local-first route, not a mocked API:

- `first-run.yaml`: a clean install (`clearState`) now lands on the first-run
  welcome — three skippable screens narrated by the Pixel mascot — before the
  learning-road home. This flow asserts the welcome copy itself: each slide's
  group-accessibility label, the footnote disclaimer on the last screen, and
  that the welcome is gone after tapping "Começar".
- `boot-to-home.yaml`: a clean install (`clearState`) passes through the
  first-run welcome (dismissed via the `subflows/dismiss-first-run.yaml`
  subflow) and reaches the learning-road home (`Foco de hoje`). **A clean
  install no longer boots straight to the home** — see the 2026-08-02 entry
  below.
- `learning-critical-path.yaml`: dismisses first-run, then completes both
  seeded lessons, checkpoint, reward and reaches Progress.
- `offline-relaunch.yaml`: dismisses first-run, completes a local lesson,
  relaunches with airplane mode enabled, then confirms the persisted
  checkpoint is still available.
- `subflows/dismiss-first-run.yaml`: a conditional subflow (`runFlow` guarded
  by `when: visible`) that taps "Pular apresentação" only if the first-run
  welcome is on screen. Flows that already ran once without `clearState` never
  see the welcome, so an unconditional tap would fail on them. Included by
  every flow above except `first-run.yaml` itself, which asserts the welcome
  directly.

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
install.

B0.1 closed for iOS on 2026-07-28: `3/3 Flows Passed in 6m 52s` against a local
**Release** simulator build of the current commit, with the JS bundle embedded
and no development server. A missing CocoaPods install had been read as "no local
build is possible" — it only blocks `expo run:ios`; `xcodebuild` over an already
consistent `Pods/` needs no `pod`. The reproducible recipe and both runs of the
day are in
[`docs/evidence/2026-07-28-e2e-local-release.md`](evidence/2026-07-28-e2e-local-release.md).

The first run of that suite failed 1/3, and the cause was the same drift class as
the retired onboarding smoke: commit `fb1af1f` (2026-07-27) migrated the
checkpoint celebration to pt-BR — `CONQUISTA DESBLOQUEADA` replacing
`ACHIEVEMENT UNLOCKED`, and the fixed `Continue` CTA replaced by the next
recommended node's label — while `learning-critical-path.yaml` went on asserting
the English strings and the static contract stayed green, because it reads the
YAML rather than the screen. The flow now asserts the real strings, and the
contract gained a guard that **extracts the eyebrow from `CheckpointScreen.tsx`**
and requires the flow to assert exactly it, plus requires the tapped label to be
one `resolveNextAction` can return. A content assertion over an artifact confirms
what someone wrote; anchoring it to the source is what makes it track the screen.

Android ran for the first time on 2026-07-28 and came out `app-failed`, not
`environment-blocked`: `expo prebuild` had genuinely never run, but the toolchain
was installed, and the project was generated, built and installed on the same
machine without adding anything. Two of three flows passed on an emulator against
a local Release APK; `learning-critical-path` failed on its last step because
`tapOn: 'Progresso, tab.*'` asserts the shape iOS composes for a tab
(`"<label>, tab, N of 4"`), which Android does not produce. Fixing it changes the
flow **and** the contract that pins the old literal, and both platforms must be
re-run afterwards — not just the one that was red. The same run also surfaced two
Android-only product defects in the shared `IconSymbol` fallback. Recipe,
hierarchy dumps for both platforms and the defects are in
[`docs/evidence/2026-07-28-android-e2e-first-run.md`](evidence/2026-07-28-android-e2e-first-run.md).

Android closed on 2026-07-29: `3/3 Flows Passed in 11m 48s`, and iOS was re-run on the
same corrected flows (`3/3 in 7m 32s`), so both platforms are `passed`. Two real E2E
defects were fixed: the tab selector was anchored to `^Progresso(, tab.*)?$` (the
iOS-only literal broke Android; a loose `.*Progresso.*` broke both by matching the home
caption "Seu progresso..." under case-insensitive matching), and the below-the-fold CTAs
were getting a lift-scroll before each tap because the guarded repeat left them resting
under the floating tab bar on a fast emulator (measured CTA y2212-2277 vs tab bar
y2198-2387), so the tap hit the bar. A host-memory finding also mattered: running the iOS
simulator and the Android emulator together on a 16 GB host thrashes swap and makes the
emulator crawl — run one platform at a time. Both contract regressions are pinned in
`scripts/maestro-contract.test.mjs`. Full detail in
[`docs/evidence/2026-07-29-android-e2e-close.md`](evidence/2026-07-29-android-e2e-close.md).

On 2026-08-02 the first-run welcome (three skippable screens narrated by the
Pixel mascot, gated on the absence of the `@radiant/first_run_v1` key) started
intercepting every clean install before the learning-road home. `boot-to-home`
no longer describes what it asserts on its own: a clean install now passes
through the welcome first. All four existing flows gained a
`subflows/dismiss-first-run.yaml` step, and a new `first-run.yaml` flow asserts
the welcome itself. Device execution surfaced two real defects, both already
fixed: `WelcomeSlide`'s `accessible` container collapsed the whole slide into
one VoiceOver node on iOS, hiding title, body, illustration label and the
store-required disclaimer from screen readers (fixed by composing the group
label from all four, commits `1a8fd59`/`b3f5684`); and Maestro's selector is a
full-match regex, so the old bare-title pattern stopped matching once the
label carried the full composed phrase (fixed by anchoring `first-run.yaml` on
the real group-label shape, with `scripts/maestro-contract.test.mjs` now
deriving the expected anchored pattern from `WelcomeFlowScreen.tsx`'s own
`SLIDES` array and rejecting the old bare-title form, commit `728ca8d`).
iOS is `passed` for `first-run`, `boot-to-home`, `learning-critical-path` and
`offline-relaunch`. `store-capture.yaml` failed on this run's iPhone 17 Pro
simulator — attributed to device geometry, not to the welcome: the diff this
branch made to that file is one line (the dismiss-first-run step), the flow
ran ~20 steps past that point before failing, and its fixed-scroll occlusion
guard (commit `f7b602a`) was calibrated for iPhone 16 Plus and iPhone 11 Pro
Max, not iPhone 17 Pro — while the sibling `learning-critical-path`, which
uses adaptive `scrollUntilVisible`/`centerElement` instead of a fixed scroll,
passed on the same device minutes earlier. **Android was not re-run against
the welcome in this session** — its 2026-07-29 `passed` state predates the
gate and does not cover it. Full detail, recipe and the `store-capture`
attribution are in
[`docs/evidence/2026-08-02-e2e-primeiro-uso.md`](evidence/2026-08-02-e2e-primeiro-uso.md).

The dev-client verification of 2026-07-28
([`docs/evidence/2026-07-28-boot-to-home-devclient.md`](evidence/2026-07-28-boot-to-home-devclient.md))
remains a supplement only — per this doc's rules a dev-client run never promotes
iOS to `passed`, and it is not what promoted it here.

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
maestro test .maestro/first-run.yaml
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

| Platform | Device/runtime | Build | First-run welcome | Boot-to-home | Critical path | Offline relaunch | Store-capture | Status | Owner/date |
|---|---|---|---:|---:|---:|---:|---:|---|---|
| iOS | `Radiant iPhone 17 Pro` / iOS 26.5 | local Release equivalent (embedded bundle) | passed | passed | passed (reward node not covered) | passed | **app-failed** — device-geometry attribution, not a regression of this branch | 4/5 flows passed — `first-run`, `boot-to-home`, `learning-critical-path`, `offline-relaunch` all green; `store-capture` failed on quiz-answer selection, commit `728ca8d`, 2026-08-02 | engineering / 2026-08-02 |
| Android | `Radiant_Pixel_9_API_36` emulator | local Release APK (embedded bundle) | **not re-run** | passed (2026-07-29, pre-dates the welcome gate) | passed (2026-07-29, pre-dates the welcome gate) | passed (2026-07-29, pre-dates the welcome gate) | not re-run | **not revalidated against the first-run welcome.** The `3/3 Flows Passed in 11m 48s` result is real but was measured before the welcome existed and does not exercise it. | engineering / 2026-07-29 (stale w.r.t. the welcome) |

No EAS workflow or cloud execution is enabled by this change. Add it only after
both local rows are recorded as `passed` in dated evidence and its cost/privacy
review is approved.

**Open item:** `store-capture.yaml` needs revalidation or scroll recalibration
for iPhone 17 Pro geometry (or an equivalent device in the calibrated set)
before it is relied on again to produce store screenshots from this simulator.
Full attribution in
[`docs/evidence/2026-08-02-e2e-primeiro-uso.md`](evidence/2026-08-02-e2e-primeiro-uso.md).
