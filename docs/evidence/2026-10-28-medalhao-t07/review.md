# T07 — revisão independente

R1 encontrou P2 temporal; R2 confirmou correção. R3 aprovou Spec/Quality do núcleo T07 no escopo medido. Aceite global bloqueado pelo P2 compartilhado PushOptIn máximo, pendente T17.

# Task9/T07 — independent review R1

## Spec Compliance

- **FAIL** — one incorrect historical label: `radiant-app/src/features/review/screens/ReviewScreen.tsx:57-58` equates an elapsed interval shorter than 24 hours with the local calendar word “hoje”. This violates the brief's truthful-history requirement. Finding R1-01 below is the only requested product correction.
- The other statically verifiable requirements pass: all eight nominal product/consumer files appear in the supplied diff, including the two new ListRow files. The opening uses HUD, Revisão, original-queue count/estimate, one row per item, and the footer action; the start, active and finished screen no longer use Pixel/rings (`ReviewScreen.tsx:230-299`, `309-349`, `370-398`). `Resultado da sessão` remains (`ReviewScreen.tsx:324`).
- ⚠️ Native raster layout, live font changes and actual VoiceOver/TalkBack speech are **pending controller evidence**. JS host identity is not raster proof; grouped accessibility props are not proof of speech heard. Final configured Loop validation, lifecycle closure, Git and CI remain controller gates, not additional code findings in this review.

## Strengths

- `ReviewScreen.tsx:61-89` derives display metadata from the original `useReview` queue without replacing it, using canonical lesson/checkpoint nodes and unit titles. Item keys preserve separate questions from one lesson; unknown origins remain unknown. `ReviewScreen.tsx:264-273` reuses the actual node/theme and radius 17, with no pulse or invented completion. `ReviewScreen.flow.test.tsx:351-410` covers counts/estimates, mixed and unknown origins, the actual SVG width and the history filters.
- `ListRow.tsx:7-36` implements the requested API and changes from View to Pressable only when an action exists. It groups the title/detail, hides decorative slots from accessibility and has a divider without a card. Its 56 pt minimum height and uncapped, untruncated, stacking text are explicit (`ListRow.tsx:39-46`, `ListRow.test.tsx:8-42`). No unrelated consumer migration is required for this new component.
- The queue/session behavior remains separate from presentation: the unchanged award effect retains finished/nonempty/ref/WeakSet guards and rejection rollback (`ReviewScreen.tsx:128-144`); `ReviewScreen.flow.test.tsx:439-491` checks rerender/remount, empty, failure rollback and nonfinished cases. The WeakSet test uses a new screen ref; the preserved ref is appropriately described as an overlapping defense, not independently proved coverage.
- Screen callbacks still pass answer/help/continue to the actual hook (`ReviewScreen.tsx:393-396`, `ReviewScreen.flow.test.tsx:520-547`). The existing real-hook integration test writes and reads the repository journal before feedback (`hooks/useReview.test.ts:127-149`), while rejection retry preserves arguments/date and assistance avoids duplicate XP (`hooks/useReview.test.ts:150-180`). This is stronger evidence than the screen mock alone.
- All three Maestro consumers use the new CTA (`.maestro/review-due.yaml:20-28`, `.maestro/rating-prompt.yaml:63-71`, `.maestro/g4-native-evidence.yaml:24-32`). The new contract reads executable JSX with TypeScript AST rather than accepting a matching comment (`scripts/maestro-contract.test.mjs:1715-1740`).

## Issues

### Critical (Must Fix)

- None found.

### Important (Should Fix)

- **R1-01 / P2 — calendar-day history can falsely say “Revisado hoje”.** `radiant-app/src/features/review/screens/ReviewScreen.tsx:57-58`: `Math.floor((now - reviewedAt) / 86400000) === 0` also holds for an attempt on the preceding calendar date. For example, a confirmed review at `2026-10-27T23:50:00-03:00` displayed at `2026-10-28T00:10:00-03:00` is labeled “Revisado hoje”, although it happened yesterday in America/Bahia. The attempt/date-validity/future guards are correct; the final label adds a false claim after those guards. Use a local-calendar comparison for “hoje”, with an honest fallback for an earlier date, or use an elapsed-time label that actually describes less than 24 hours. Add a focused fixed-time regression for midnight crossing and preserve a true same-day case. The current positive test only checks `Date.now() - 2 * 86400000` (`ReviewScreen.flow.test.tsx:403-410`), so the recorded temporal mutants do not cover this boundary. This is a code/label defect, not a request to change the approved source-of-history ruling or scheduling algorithm.

### Minor (Nice to Have)

- None found within this task scope. The shared T06 tail remains T17 and is not assigned to T07.

## Checks and Evidence

- **Snapshot integrity:** SHA-256 recomputation matched the binding brief `1057b25986a429d8562711b79d4960b32eb841fd484e389183e68d9945927f86`, product diff `90be7313c256e97aac278a4b02380e2f726652203a120762e9ff64bcb650a62a`, manifest `3e372de788cb4ac83fa5936715d1d1edf46c105f5ba15736ef913ead65908e82`, and all eight `productFreeze` hashes. ReviewScreen is `c45f0758e28508e5de87445c72920f6a687d8cf7cba14df3cceb61a2d3269c90`; ListRow is `ce3519819ff93f3e58a83eb997ec33b4d275c92960b628c622cf83732be0f08e`. BASE/HEAD precommit is the supplied `c694f95191d990f78056f4985c958b9ebe7518e5`; no fresh Git diff/status or branch mutation was performed.
- **Diff reading:** reviewed the supplied product diff once. Tool output truncated its middle; read only the missing ranges to complete that pass. The screen hunk cuts the component between its hook setup and rendering, so inspected only `ReviewScreen.tsx:100-238` to judge the named award/queue/checkpoint continuity risk. No other changed source file was separately reread.
- **Named focused risk — history authority/migration:** inspected `ItemReviewRepository.ts:75-80,172-182,210-226,254-286` and `ItemReviewService.ts:61-100,134-145`. Seeds/reconciliation deliberately set a current timestamp with null attempt; actual recorded attempts update both fields. The new helper correctly rejects the synthetic/null-attempt date, invalid/missing dates and future dates. R1-01 concerns its subsequent calendar wording only.
- **Named focused risk — canonical lesson/checkpoint lineage:** inspected `JourneyDefinitionService.ts:124-156,226-259`, `createProductionCurriculumCatalog.ts:120-156,247-248`, and `ItemReviewService.ts:17-40,94-97`. Real lesson origins use `node.lessonId`/activity IDs; checkpoint origins use the canonical node ID and catalog presence. The implementation does not invent a node or use the question prompt as a preview subject.
- **Named focused risk — medal visible/static semantics:** checked `JourneyMedal.tsx:167-175,243`. Size determines radius; `visible=false` disables illustration playback/pulse participation rather than hiding the origin medal. Existing artwork remains reused.
- **Named focused risk — persistence and retry:** inspected the unchanged `useReview.ts:39-69,150-212` and the specific existing hook tests cited above. It assigns and returns the service queue, commits `recordAnswer` before setting feedback, retains the pending choice/time for retry, and gates assisted/duplicate XP. No new queue API is introduced.
- **Raw final local results inspected, not rerun:** `docs/evidence/2026-10-28-medalhao-t07/green.txt:1870-1884` records Node v20.20.2, `EXPO_NO_DOTENV=1`, taskpolicy-backed four-suite focal execution, exit 0, **52/52 tests**. `green.txt:1887-2101` records **40/40 Maestro contracts**; `2104-2116` records successful tsc and scoped eslint; `2118-2133` records visual strict with **0 regressions**, 49 baseline findings and 3 scoped exceptions. Final focal/static outputs contain no introduced console warnings. Earlier harness errors and warnings remain in the raw file and are explicitly distinguished from final results.
- **Red/counterexample evidence inspected:** `red.txt:3417-3421,6016-6017` records the pre-product **18 failed / 8 passed** run after harness fixes; `6022-6051` is API absence only, not behavioral proof; `6284-6312` separately shows the large-font flex assertion failing. Inspected the focused failure sections through `red.txt:9102` and the full mutation metadata: **24 attempts, 23 behavioral kills, one explicitly classified equivalent survivor, 24 SHA-exact restores**. The equivalent survivor is not counted as coverage. Each reward barrier, ordering edge, deduplication, diameter, action/static row, AST phantom, stale YAML, unknown attribution, font-renewal and disconnected-answer kill has corresponding raw failure evidence. No broad suite, new harness, native app, build, installation, Loop or brain operation was started by this reviewer.

## Assessment

**Task quality: CHANGES_REQUESTED.**

The implementation is cohesive and its preservation evidence is credible, but R1-01 must be corrected before the truthful-history contract passes. This verdict is frozen for the supplied R1 snapshot; native/Loop/Git/CI acceptance remains separate and pending.


---

## R2 — SHA256 e82215f94e98bad3d3122734fc34578120cf4e2af7432e1ff20f71cb3fd79962

# Task9/T07 — independent scoped review R2 / FIX1

## Spec Compliance

- **PASS** — R1-01 is resolved. `radiant-app/src/features/review/screens/ReviewScreen.tsx:57-64` now requires matching local year, month and date before saying “Revisado hoje”. An earlier local date less than 24 hours ago says “Revisado há menos de 1 dia”; larger intervals retain their truthful elapsed-day wording. The existing null-attempt, invalid/missing-date and future-date filters remain unchanged at `ReviewScreen.tsx:52-56`.
- The supplied R1→R2 delta changes only that helper and the three regression cases in `ReviewScreen.flow.test.tsx:570-588`. No service, queue identity, scheduling, reward, callback, font mechanism, design or consumer change is present. The six other frozen product/consumer files retain their R1 hashes; the unaffected findings/checks of the completed R1 review remain valid.
- ⚠️ This is the static/behavioral fix gate. Native final evidence on frozen R2, configured final Loop validation, Git and CI remain controller gates. Jest host identity does not establish raster layout, and an accessible tree does not establish VoiceOver/TalkBack speech heard. No native acceptance is inferred from the earlier R1 inspection.

## Strengths

- `ReviewScreen.tsx:57-64` separates local-calendar wording from elapsed duration without changing the authority of stored history or introducing a timezone-specific assumption.
- `ReviewScreen.flow.test.tsx:570-588` uses deterministic local constructors persisted as ISO instants, covers a true same-day attempt, 23:50→next-day 00:10 and three elapsed days, and restores the Date.now spy after each case. The regression exercises the rendered screen wording rather than duplicating the helper's implementation.
- `docs/evidence/2026-10-28-medalhao-t07/red.txt:9285-9458` and the appended FIX1 mutation record preserve a complete fix removal: the original R1 source hash is recovered, only the midnight case fails, both controls pass, and the corrected source is restored exactly afterward.

## Issues

### Critical (Must Fix)

- None.

### Important (Should Fix)

- None. R1-01 is closed by this delta and its specific counterexample.

### Minor (Nice to Have)

- None within the authorized FIX1 scope.

## Checks and Evidence

- Read the supplied FIX1 diff once; no changed source file was separately reread, no R1 audit was repeated, and no test suite, new harness, Git command, Loop/brain operation, native action, build or installation was run by this reviewer. Only this review artifact was written.
- Recomputed the FIX1 diff SHA-256: `238fb421103a7db51c56b2b476dc5cea9b8d3d1d6f6d8572e38a3451cc716941`; R2 manifest: `79eb7280a6c8d83b4abffdd1c9c7830eff295f5afa15a4d2c1c6f298dd22dd92`. Both match the dispatch.
- Recomputed **8/8 live and snapshot product hashes** against `task-9-snapshot-r2/manifest.json`. ReviewScreen is `f33df619dc6da9c33b43bb1e14ac2dac67d17da8292d10bab7bbff4d10a90176`; flow test is `fb05f2d82aca0475bdec2850d27c65bb446a49f99e230f29ff39acc721ea9404`. ListRow, ListRow.test, all three Maestro YAMLs and maestro-contract retain their exact R1 hashes. The two changed files match the scoped delta.
- Inspected appended report/audit, raw red/green and the appended mutation metadata. Pre-product red (`red.txt:9107-9280`) is **one midnight failure / two controls passing**, without a harness error. Complete-fix removal (`red.txt:9285-9458`) reproduces the same exact failure/control pattern with `TZ=UTC`; its mutation hash is the original R1 `c45f0758e28508e5de87445c72920f6a687d8cf7cba14df3cceb61a2d3269c90`, and `restoredExact=true` returns to the new source hash above.
- Final restored `green.txt:2190-2243` records Node v20.20.2, `TZ=UTC`, `EXPO_NO_DOTENV=1`, the full ReviewScreen flow **36/36**, exit 0. That execution includes the unchanged null-attempt/missing/invalid/future-date, queue, award and callback cases.
- Final restored `green.txt:2245-2298` records `TZ=America/Bahia` and the three FIX1 cases **3/3**, exit 0. `green.txt:2300-2312` records successful typecheck and scoped two-file eslint. These appended final outputs contain no introduced warnings. Unaffected hook/ReviewCard/contract/visual suites were not repeated for this helper-only correction.

## Assessment

**Task quality: APPROVED.**

The only R1 code finding is fixed with a small, truthful labeling change and a regression that fails specifically when the complete fix is removed. This R2 verdict is frozen for the verified eight-file snapshot; native and final controller acceptance remain pending.


---

## R3 — SHA256 d845110e3e084104b3e2e5537b843ed83485a40ccb1548d1f822680d53ef64d6

# Task9/T07 — independent native evidence review R3

## Spec Compliance

- **PASS — bounded T07 core evidence.** The frozen FIX1/R2 code verdict remains PASS/APPROVED. The real iOS and Android clients show the original three-item queue without deduplication, actual origins/history, the expected estimate and CTA, three distinct questions with confirmation before feedback, a real three-item completion with +12 XP, and a genuinely empty queue after reopening. No new defect in the T07-owned code is established by this evidence.
- **This is not acceptance of the complete maximum-font layout.** Shared PushOptIn has the P2 defect below; Android live-font and result-maximum scenarios are **NOT_VALIDATED**, iOS empty-maximum was not measured, and native error/retry or persisted partial-session resume was not induced. Final configured Loop validation, Git and CI remain controller gates.

## Strengths / Verified Native Cases

- **Opening normal, both platforms:** opened `task9-native-r2-ios-start-normal.png` plus its raw UI and `task9-native-r3-android-start-normal.png` plus XML. Both show HUD → Revisão → “3 itens de Fundamentos de Radiologia. Leva uns 2 minutos.” → three separate origin rows/blue medals → instructions → Começar. There is no review Pixel or progress annulus. The same lesson title in three rows is supported by three different actual questions, not an accidental duplicate. iOS history says 5 elapsed days and Android 4, reflecting their distinct real stores; neither is substituted with Home's lesson-level review count.
- **iOS font scenarios:** opened final-source `task9-native-r2-ios-start-max-live-3s.png`, `-live-10s.png`, `-max-to-max.png`, and initial `-start-max.png`; their matching raw captures and runtime distinguish live changes from initial mounting. The local screen text enlarges and the initial-max CTA is enlarged. The shared HUD/CTA glyphs retain normal sizing on the same mounted live transition, so no whole-font-system fix is claimed.
- **Historical iOS full opening scroll, limited reuse:** opened old-source `task9-native-ios-start-max-live-bottom-1.png` and `-scroll-2.png` through `-scroll-7.png`. They show the origin medals, wrapped title/history and final instructions readable by scrolling, with the footer reachable. Their source manifest is R1 `c45f0758…`, not current `f33df619…`. The already-reviewed FIX1 delta changes only the history helper; for the shown >24-hour “Revisado há 5 dias” case its return value and all styles/row props are identical. This supports that specific unchanged layout case only. The files retain their original phase and names. `-scroll-8.png` is SpringBoard and is excluded from review-screen proof.
- **Android initial maximum:** `task9-native-r3-android-start-max.png` and `-start-max-bottom.png`, corresponding XML and `runtime.jsonl:80-89` establish readiness/deep link after force-stop, with font scale already 2.0. The text/CTA are legible and the lower list scroll shows complete atom artwork. The first top capture's bare medal discs are a rendering observation; the following complete artwork does not establish a persistent missing-origin-art defect. This initial scenario does not validate a live font change.
- **Answer-before-feedback, both platforms:** opened all actual question/selected-choice/feedback images for items 1–3 and their relevant raw UI. The selected-choice captures retain Confirmar resposta and withhold the explanation; subsequent feedback captures show the explanation and Continuar. iOS predecessor R2 confirmed items 1 and 2, then stopped with the third choice selected but unconfirmed. Replacement R3 re-observed that same state (`task9-native-r3-ios-resume-choice-3.png`), confirmed it once and continued (`runtime.jsonl:1-8`). Android records exactly the three legitimate choice → confirm → feedback → continue sequences (`runtime.jsonl:98-127`). This replacement-executor continuity is not proof of persisted partial-session resume.
- **Actual completion:** `task9-native-r3-ios-result-normal.png`/raw UI and `task9-native-r3-android-result-normal.png`/XML show “3 concluídos nesta rodada”, “+12 XP confirmado”, “Revisão salva neste aparelho” and HUD 66 XP, after starting from 54 XP. No Pixel or progress annulus appears in the result. The visible five hearts do not count reward grants; unique-award proof remains the separate automated guard evidence reviewed in R1/R2.
- **iOS result maximum and exit:** opened `task9-native-r3-ios-result-max.png`, `-bottom.png`, `-bottom-2.png`, `-exit.png`, `-footer.png` and `-final-footer.png`. T07's own result title, count, XP, saved state and final copy remain visible through scrolling; the final Voltar para jornada is reachable. Runtime `:10-30` records maximum-size change, sequential scrolls and that button returning to Home. This passes the local T07 text/exit case while exposing the shared PushOptIn failure below.
- **Real empty queue and exit:** `task9-native-r3-ios-empty-normal-valid.png` and `task9-native-r3-android-empty-normal.png`, with raw UI, show Nenhuma revisão pendente / Sua fila está em dia and Voltar para jornada after the queue was completed and the clients reopened. The corresponding normal Home return images/UI show 66 XP and the newly scheduled review. Transitional iOS blank/download captures are excluded. Neither platform's empty-maximum screen is claimed here.

## Issues

### Critical (Must Fix)

- None established within this bounded review.

### Important (Should Fix)

- **R3-SHARED-01 / P2 — PushOptIn copy is clipped in iOS maximum text.** `task9-native-r3-ios-result-max-bottom-2.png` and `task9-native-r3-ios-result-max-exit.png` show the reminder card's title reduced to a white fragment and its body cut horizontally, while its Ativar lembretes / Agora não controls remain. `task9-native-r3-ios-result-normal.png` supplies the complete normal-size wording, and `task9-native-r3-ios-result-max-exit-ui.json` supplies the full accessible content despite the failed raster presentation. A user who enlarges text cannot read the invitation's explanation reliably. This is an observed shared-component defect, not dismissed or presumed pre-existing merely because the component was unchanged. It is outside the eight-file T07 ownership. Per controller ruling, retain it for **T17 / broad review before global layout acceptance**, without expanding this atomic writer to fix it. Cost remains: the reminder is poorly readable at maximum size until corrected. T07's local core approval does not clear this P2 or certify the whole result screen.

### Minor / Unresolved Measurement Limits

- **Android live opening and result maximum: NOT_VALIDATED.** `task9-native-r3-android-start-live-max-3s.png`, `-10s.png` and `-result-max-attempt.png` show Trilha/Home with the actual linking-in-multiple-places error, not the Review route. The opening dump files contain an idle-state error rather than XML; the result dump is valid XML containing the wrong route and linking error. These are failed attempts, not a voluntary result exit, not evidence of Review live readability and not diagnosed as a T07 code cause. The 3s/10s names are scheduled labels: blocking UIAutomator made actual captures about 14.30s/32.61s after the font command, as recorded in font provenance.
- **Shared same-mount font limitation:** the iOS local Text/ListRow changes do not prove that unchanged HUD/CTA glyphs renew on live scaling; initial maximum visibly differs. Keep that explicit rather than declaring the font system clean.
- **Unmeasured:** iOS empty maximum, Android result maximum, native induced read/write errors/retry, persisted partial-session resume, audible VoiceOver/TalkBack, physical devices, audible sound and FPS. Static/Jest identity is not rasterization; accessibility snapshots are not speech heard. No opt-in or push permission was activated. Reserved simulator/second-day/release gates are not validated by this pass.

## Provenance, Integrity and Cleanup

- Read `task9-native-r3-report.json`, candidates, font provenance, exclusions, relevant raw runtime/UI, cleanup and source manifests. Recomputed report SHA `135f36d7b12f0c2e2d73a84d0dee860adb2b68c51d771d16a6cff50a57ebc367`, candidates `b50ae4c961068ddadd932e5cfbd29ba8f01ba49a3eef8272cc80224c8ecee236`, artifact manifest `701fe2a8ed58169036284e9b9e26e839b0db0522534e7b6c417b174c09adceb2`, and combined raw UI `afdf673e488dd4ed6d501546c0ad3709a91f49057f759e0110c6d1dba1de6bdd`; all match dispatch. All **211 manifest artifact hashes** and **13 selected PNG + 13 companion UI hashes** match the actual files. All 13 selected images were visually opened. Android result-maximum is correctly omitted from candidates.
- Current R3 source-before/after manifests are identical (`fa8bf6343e8ab0da494a4de00129aceec2de510f1c22e54aea138612966cbcfc`) and recomputation matches **all eight live product hashes**. ReviewScreen remains `f33df619dc6da9c33b43bb1e14ac2dac67d17da8292d10bab7bbff4d10a90176`; flow test remains `fb05f2d82aca0475bdec2850d27c65bb446a49f99e230f29ff39acc721ea9404`. Code review and suites were not repeated in this evidence round.
- iOS target is the principal `E262D4C1-99BE-496B-8567-0291C14E6533`; Android is entry AVD `radiant-entrada-api34` / `emulator-5554`. Existing clients are reported 1.4.0(3). The predecessor's artifacts remain attributed to predecessor R2; replacement R3 owns only its actual continuation/Android/cleanup. No old-source image is presented as new-source capture.
- Cleanup `task9-native-r3-cleanup.json` SHA `cfdc600795ee97e94a8e404408e1b7434e9f531bd1df6d812d693d69b22a952f` and runtime final entries show no booted simulator, empty ADB, port 8081 free, owned Metro/AVD PIDs gone, no QEMU, reverse removed, iOS content size restored to large and Android font 1.0 with animation scales 0/0/0. These measured Android originals supersede the historical T06 settings; no claim is made that older values were current. The mistaken iOS termination of `com.radiant.app` failed and remains logged; subsequent termination of measured bundle `com.ascendcreative.radiant` succeeded before valid reopening/final cleanup.
- No source/docs/Git/index/branch/Loop/brain/native mutation, new test, agent, build, installation, clock/storage reset or external write was performed by this reviewer. Only this owned R3 review artifact was written.

## Assessment

**Task quality: APPROVED for bounded T07 core; global layout acceptance remains BLOCKED.**

The reached native states support T07's real queue, origin presentation, answer-before-feedback, completion and empty/exit behavior, with the R2 code finding closed. The shared PushOptIn P2 must remain actionable in T17/broad review; Android live/result-maximum and the explicitly unmeasured scenarios remain open proof boundaries, not fabricated passes.
