# T07 — causal audit / handoff

Status: DONE_WITH_CONCERNS. Frozen at 2026-10-28T14:29:58.205389+00:00; no remaining implementation writes. HEAD `c694f95191d990f78056f4985c958b9ebe7518e5` / `claude/trilha-medalhao-design`.

## Acceptance and evidence

| Requirement | Local evidence | Limit |
| --- | --- | --- |
| Title/count/list/CTA order | Pre-product red plus three individual order mutations | Native reading order to verify |
| Real item counts, same-lesson items, 1/2/3 estimate | Flow assertions on original queue and real catalogs; dedupe mutation | No queue/agenda service changes |
| Lesson/checkpoint/unknown/mixed origins | Real catalog definitions, checkpoint 34-pt SVG host assertion, unknown false-attribution mutation | SVG host values are not raster proof |
| Honest history | Null attempt with valid date, real attempt with invalid/future/missing date, missing card; independent temporal mutants | Review history is not last viewing |
| No Pixel/rings, own summary | Observable pre-removal mocks red in actual start/active/end states; source removals; Resultado da sessão preserved | Actual character artwork not rasterized |
| Empty/loading/read failure | Distinct rendered states, explicit retry, no false empty | Existing hook real suite covers storage failure |
| Persistence/help/confirm/continue | Screen callback/feedback characterizations, disconnected-callback mutation, real hook and ReviewCard suites | UI mocks do not prove persistence alone |
| Life once | Rerender/remount same queue, nonfinished/empty, failed native award retry; exact individual mutants | Ref preserved as overlapping defense, not independently claimed |
| Font lifecycle | Initial maximum ListRow without caps/truncation/fixed height/flex compression; start/summary host renewal and stable CTA, two live transitions; exact screen/row renewal mutants | Native image coverage remains pending |
| Maestro consumers | Three updated YAMLs, 40 contracts, AST phantom-comment mutant and one stale-CTA mutant per consumer | No device Maestro run |

## Failure handling

All raw failed attempts remain in red.txt/green.txt. Initial AsyncStorage native-module error, incomplete motion mock, RNTL instance=null assumptions, copied-module dimension spy and snapshot contamination were harness problems; none is counted as a product red. Final focal and other necessary checks pass without console output warnings. The first unknown-attribution mutation was equivalent and survived; classification/reason remain in mutations.json beside the corrected behavioral kill. All mutation targets restored SHA-exact.

## Frozen product files

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

Root may now snapshot these eight files for independent read-only review, then coordinate serial native checks. No process started by this implementer remains running; no Loop lifecycle action was taken. The caller owns the still-active writer and all final gates.


## FIX1 / R1-01 follow-up — 2026-10-28T14:40:08.071083+00:00

DONE_WITH_CONCERNS. Local-calendar “hoje” corrected; earlier-date <24 h now has an elapsed-time label. Pre-product red and complete-fix removal both reproduce the exact midnight defect while same-day/three-day controls stay green. Final TZ=UTC flow 36/36, TZ=America/Bahia targeted 3/3, tsc and scoped lint pass. Existing temporal filters and reward/callback cases pass unchanged. Complete removal restores original R1 source SHA; finally restores new source SHA exactly, recorded as appended FIX1 entry in mutations.json. No native/raster claim; root gates remain pending. Eight-file hashes above are superseded only for ReviewScreen.tsx and ReviewScreen.flow.test.tsx by the latest freeze table in implementation-report.md. No test process remains active.
