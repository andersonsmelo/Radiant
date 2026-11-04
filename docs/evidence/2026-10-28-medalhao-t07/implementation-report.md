# T07 — implementation report

Status: **DONE_WITH_CONCERNS** — implementation/focused static and integration checks passed; independent review, native evidence and controller final validation remain pending.

Freeze: 2026-10-28T14:29:58.205389+00:00. The eight product/consumer paths below are frozen; no further product writes until a scoped controller dispatch.

Repository: `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`. Branch `claude/trilha-medalhao-design`, BASE_TASK/HEAD `c694f95191d990f78056f4985c958b9ebe7518e5`. Controller writer `run-1793196624149-d9c215ee` was already STEP_STARTED; this implementer opened/closed no Loop run or brain session. No commit, push, install, build, native launch, device fixture, clock, policy, catalog or service change.

## Delivered

- Opening reads HUD → Revisão → real queue count/rounded estimate → one row per item → Começar in a footer. Queue data and reference remain those returned by useReview. Two items from the same lesson remain separate; card identity uses itemKey, legacy identity uses lesson/question IDs.
- Origins use existing lesson nodes matched by lessonId and canonical checkpoint nodes matched by node.id/catalog presence. Unit names come from those definitions. Mixed/partly unknown queues say different origins and show each known unit on its own row. Unknown origins have no invented title or medal.
- History requires a nonempty lastAttemptId and a finite, nonfuture lastReviewedAt. Seeds with null attempt, missing card/date, invalid date and future date say Última revisão sem registro. Valid history says Revisado hoje/há N dias, without claiming last viewing.
- Origin medals use the existing JourneyMedal/resolveNodeTheme, radius 17 (34 pt SVG draw diameter). Blue, unpulsed static artwork avoids an unearned completion/parallel recommendation; no stars are invented. Pixel and progress rings are absent from opening, active review and completion. Active progress stays textual; shadow/active checkpoint calculations stay unchanged.
- ListRow has the exact requested API: static accessible View or button Pressable only with onPress, a divider, no card, grouped reading and 56 pt minimum target. Sora text remains untruncated and uncapped; large text stacks with flex 0. Text hosts renew on font-scale changes while screen, queue and controls remain mounted.
- ReviewScreen retains its own summary and Resultado da sessão selector. Existing answer persistence, retry, cursor, 4 XP, assistance, first-answer/feedback order, dismissal, award WeakSet/ref and secondary effects remain intact. Three Maestro callers now scroll/tap Começar; their new source contract parses executable JSX with TypeScript AST.

## Verification on final restored source

All commands ran in `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app`, Node **v20.20.2**, `EXPO_NO_DOTENV=1`. Complete commands/output/exit/time are in green.txt.

| Check | Result |
| --- | --- |
| `/usr/sbin/taskpolicy -b npx --no-install jest --runInBand --no-cache src/features/review/screens/ReviewScreen.flow.test.tsx src/features/review/hooks/useReview.test.ts src/ui/components/ListRow.test.tsx src/features/review/components/ReviewCard.test.tsx` | Exit 0; 4 suites, 52 tests; 26.543 s wall |
| `node --test scripts/maestro-contract.test.mjs` | Exit 0; 40/40 |
| `npx --no-install tsc --noEmit` | Exit 0; 4.732 s |
| `npx --no-install eslint src/features/review/screens/ReviewScreen.tsx src/features/review/screens/ReviewScreen.flow.test.tsx src/ui/components/ListRow.tsx src/ui/components/ListRow.test.tsx scripts/maestro-contract.test.mjs` | Exit 0; 1.951 s |
| `npm run visual:qa:strict` | Exit 0; 465 files; 0 regressions, 49 baselined and 3 scoped exceptions |

The unchanged ReviewCard suite was included as a direct child whose selection/confirmation, assistance and accessible feedback contract must survive the screen replacement. The real useReview suite proves repository-backed response persistence and preserved retry/economy; UI mocks alone are not treated as that proof. Final focal output has no console warnings. No broad quality command or Loop validate was run by the implementer.

## Red/green and exact counterexamples

red.txt preserves every attempt. After the AsyncStorage/snapshot harness corrections, the pre-product screen run had **18 failing / 8 passing** tests: the new queue/metadata/removal behavior was red, while preservation characterizations were already green. Opaque Pixel/ring doubles were first made observable; their absence checks then failed in the states that actually contained them. ListRow import absence is labeled API absence, not behavioral/raster proof. Its large-font flex correction has a separate behavioral red before that correction.

mutations.json records 24 attempts: **23 killed behaviorally**, 1 explicitly equivalent, and **24 exact SHA restores in finally**. Nominal failures include independent attempt/invalid/future history gates; nonfinished/empty/WeakSet-remount/failure rollback award gates; each title/count/items/CTA ordering edge; deduplication by lesson; actual SVG diameter; unknown origin falsely attributed; static/button action; start and summary font renewal normal→maximum/maximum→maximum; disconnected answer callback; executable JSX versus a commented phantom; and each of the three stale YAML CTAs. The equivalent first unknown-origin mutation left the actual fallback unchanged; it is not counted as coverage. The corrected, actually false attribution failed.

The ref and WeakSet overlap for a stable queue. The ref remains preserved and is classified as a combined defense; no fabricated queue/state is used to claim independent proof. The remount test isolates WeakSet with a fresh screen ref. Empty and failed-award rollback have distinct valid scenarios.

## Boundaries / self-review

- Jest verifies trees, interactions, persistence and host identity. It does **not** rasterize glyphs/SVG or establish native touch/VoiceOver/TalkBack layout. Source visual QA is not screenshot QA.
- Font initial-maximum structure and live normal→maximum/maximum→maximum identities are covered locally; controller native verification is still needed on the frozen source. Shared ReviewCard/HUD behavior was preserved rather than changed.
- Historical metadata is unknown when the service has no trustworthy review timestamp. No createdAt/dueAt substitute, fake subject or fabricated origin is used.
- Award failure retry is verified by remounting the same queue after rejection, preserving the existing behavior. No new reward or retry mechanism was invented.
- Independent reviewer, native checks on existing clients, one configured final Loop quality/closure, root canonical documentation and Git decisions belong to the controller. Reserved simulator, second day and existing release/product gates remain untouched.
- Root-owned dirty documentation was observed and preserved. Only the eight owned product/consumer paths, five owned evidence files and excluded SDD helper were written.

## Frozen SHA-256

| Path | SHA-256 |
| --- | --- |
| `radiant-app/src/features/review/screens/ReviewScreen.tsx` | `c45f0758e28508e5de87445c72920f6a687d8cf7cba14df3cceb61a2d3269c90` |
| `radiant-app/src/features/review/screens/ReviewScreen.flow.test.tsx` | `a8adbb315f9600e3d3aa0c62a1d6158f81bc1f38ac75087b2358c129661ee643` |
| `radiant-app/src/ui/components/ListRow.tsx` | `ce3519819ff93f3e58a83eb997ec33b4d275c92960b628c622cf83732be0f08e` |
| `radiant-app/src/ui/components/ListRow.test.tsx` | `dce6d83458b6ba2283c27cb4f8ba04042efd062adb7bed69285c6caa3e8b0000` |
| `radiant-app/.maestro/review-due.yaml` | `96e982c604b542e1130f73a3e5da10be15843bf420bd5971e922e529a0d3525f` |
| `radiant-app/.maestro/rating-prompt.yaml` | `ce50ba964e44938c2f44fe92be8e7a6dd2e54453848afda990ff307e13d513be` |
| `radiant-app/.maestro/g4-native-evidence.yaml` | `e1b56f5737763d04ddaa7fc0cb53f29686f5e245f22dd748fcbf0b21187e33bf` |
| `radiant-app/scripts/maestro-contract.test.mjs` | `6de86c8367ce70f86d1ca2d71693c8781c4e140651b275d7602b92cc5bbbade2` |


# FIX1 — R1-01 temporal wording correction

**DONE_WITH_CONCERNS; latest freeze 2026-10-28T14:40:08.071083+00:00.** This authorized correction supersedes the initial two source/test hashes above; prior evidence is preserved unchanged. No implementer test/process remains active.

- Scope: only reviewHistory's final local wording and three deterministic screen regressions. “Revisado hoje” now requires matching local year/month/day. An earlier local date with less than 24 elapsed hours says “Revisado há menos de 1 dia”; larger intervals retain the elapsed-day label. Authority/validity/future filters, agenda, queue, rewards, services and design are unchanged.
- RED before product: same-local-day and three-elapsed-days cases passed; 23:50 → next-day 00:10 failed specifically because the original source displayed Revisado hoje. Test dates use local constructors and persisted ISO instants; only Date.now is frozen inside the test, restored afterward. No host timezone assumption or device clock change.
- GREEN: final restored full ReviewScreen flow **36/36** with TZ=UTC; the three FIX1 cases also **3/3** with TZ=America/Bahia. Existing null-attempt/missing/invalid/future-date, queue, life and callback cases remain green. tsc and two-file ESLint pass. No hook change occurred, so hook/ReviewCard/contract/visual/full-quality suites were not repeated for this textual delta.
- Exact counterexample: removed the complete calendar/fallback fix, recovering original R1 source SHA `c45f0758e28508e5de87445c72920f6a687d8cf7cba14df3cceb61a2d3269c90`. The midnight case failed while same-day and three-day controls passed (TZ=UTC); finally restored exact source SHA `f33df619dc6da9c33b43bb1e14ac2dac67d17da8292d10bab7bbff4d10a90176`. mutations.json now preserves the previous 24 entries plus this FIX1 behavioral kill (25 exact restores total; 24 kills and the prior explicitly equivalent attempt).

All raw provenance remains in red.txt/green.txt, Node v20.20.2, cwd `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app`:

- `TZ=UTC EXPO_NO_DOTENV=1 npx --no-install jest --runInBand --no-cache src/features/review/screens/ReviewScreen.flow.test.tsx` — exit 0, 7.398 s.
- `TZ=America/Bahia EXPO_NO_DOTENV=1 npx --no-install jest --runInBand --no-cache src/features/review/screens/ReviewScreen.flow.test.tsx -t FIX1` — exit 0, 7.071 s.
- `TZ=UTC EXPO_NO_DOTENV=1 npx --no-install tsc --noEmit` — exit 0, 6.338 s.
- `TZ=UTC EXPO_NO_DOTENV=1 npx --no-install eslint src/features/review/screens/ReviewScreen.tsx src/features/review/screens/ReviewScreen.flow.test.tsx` — exit 0, 3.158 s.

Self-review: local-calendar comparison handles the specific false “hoje” claim without changing storage or scheduling. The <24 h fallback is elapsed time rather than “ontem”, so it remains truthful across timezone/DST boundaries. Jest confirms wording/behavior, not raster output. Independent follow-up review, native final evidence and configured final validation remain controller gates. No native/Git/Loop/brain/build/install/policy/shared-file action was taken.

## Latest frozen eight-file SHA-256

| Path | SHA-256 |
| --- | --- |
| `radiant-app/src/features/review/screens/ReviewScreen.tsx` | `f33df619dc6da9c33b43bb1e14ac2dac67d17da8292d10bab7bbff4d10a90176` |
| `radiant-app/src/features/review/screens/ReviewScreen.flow.test.tsx` | `fb05f2d82aca0475bdec2850d27c65bb446a49f99e230f29ff39acc721ea9404` |
| `radiant-app/src/ui/components/ListRow.tsx` | `ce3519819ff93f3e58a83eb997ec33b4d275c92960b628c622cf83732be0f08e` |
| `radiant-app/src/ui/components/ListRow.test.tsx` | `dce6d83458b6ba2283c27cb4f8ba04042efd062adb7bed69285c6caa3e8b0000` |
| `radiant-app/.maestro/review-due.yaml` | `96e982c604b542e1130f73a3e5da10be15843bf420bd5971e922e529a0d3525f` |
| `radiant-app/.maestro/rating-prompt.yaml` | `ce50ba964e44938c2f44fe92be8e7a6dd2e54453848afda990ff307e13d513be` |
| `radiant-app/.maestro/g4-native-evidence.yaml` | `e1b56f5737763d04ddaa7fc0cb53f29686f5e245f22dd748fcbf0b21187e33bf` |
| `radiant-app/scripts/maestro-contract.test.mjs` | `6de86c8367ce70f86d1ca2d71693c8781c4e140651b275d7602b92cc5bbbade2` |
