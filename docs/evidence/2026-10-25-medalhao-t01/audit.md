# T01 / Task 2 — current audit after fix round 3 (2026-10-25)

Current section; prior fix2/fix1/R1 material below is historical. Product writes are paused for snapshot-r4 and original-reviewer focal re-review.

**R3-A correction only:** expandedArray now keeps two separate facts: the union of known static text origins from all possible array branches, and the minimum number of array positions that those branches provide. A spread resolving to two alternative arrays no longer discards their literal origins. The join consumer measures all collected origins and uses minimumLength, not the number of unioned origins, to infer a separator. Alternative singleton arrays can contribute two origins while still rendering one position and no separator. Equal-length alternatives can retain exact cardinality; unresolved/unequal cases keep the conservative diagnostic/lower-bound behavior. This fixes static origin loss without claiming whole-program branch evaluation.

Tests first failed specifically in three product programs: the reviewer's conditional-singleton-array jargon example; the same alternatives with a spaced-dash separator that must stay absent; and two-item alternatives preserving jargon plus their guaranteed separator. The original independent R3-A file recorded one assertion failure. Both red outputs are appended to task-2-red.txt. Final green is **129/129**, no skips/failures, for the three contracts and all original R1/R2/R3 reviewer repro files. All previous empty/singleton join, spread, namespace, Alert binding and seven original R1 cases remain included. Focused scanner/test ESLint and git diff --check pass.

Remedição is unchanged: **325 sources / 1603 sink visits / 135 findings in 40 files (70 eyebrow, 16 dash, 49 jargon) / 922 diagnostic paths**. Baseline contents did not change. No screen/CTA product changed. Only scanner/test changed in this round; no broad audit, full quality, Loop command, native/build/commit/push or unchanged Jest rerun. The earlier 147/147 CTA consumer evidence remains historical/unchanged, not a new test claim.

Reports/logs remain consolidated in task-2-red.txt, task-2-green.txt, task-2-audit.md and task-2-report.md, with task-2-fix3-report.md as the round detail. The controller owns snapshot-r4/delta, independent review, final validation and run closure. No absolute runtime coverage claim; the previously documented runtime/Map/reduce/regex limits remain and do not excuse R3-A's now-tested static origins.

---

# Historical fix2/fix1/R1 audit (superseded current section)

# T01 / Task 2 — current audit after fix round 2 (2026-10-25)

This section is current. Earlier fix1/R1 sections below are preserved history. Independent focal review remains pending; the worker has paused product writes.

Fix2 is limited to the three differential P2 findings from review R2:

- **R2-A namespace imports:** retain an imported module namespace as a value origin, then resolve the requested export through its module symbol. The namespace regression fixture deliberately uses `value` outside COPY_FIELDS and verifies the src/copy.ts origin and no diagnostics. Returned composite environments from fix1 still follow their own env; no broad property shortcut was restored.
- **R2-B spread/join cardinality:** recursively expand statically resolved array spreads with each element's environment before deciding whether the separator can appear. Empty spread plus one literal now gives one item and no separator; a spread containing two strings gives two items and measures the separator. A runtime/ambiguous spread records unresolved join spread cardinality; known items provide only a lower cardinality bound. Cyclic spread expansion is bounded. No baseline increase was used for the false positive.
- **R2-C Alert shadowing:** inspect the actual identifier symbol/binding first. Accept an import specifier only when that binding imports React Native Alert, or follow a simple bound alias initializer. A parameter that shadows the import has its own binding and does not acquire native Alert semantics. The positive import alias and negative unrelated-object cases from fix1 remain green.

Before correction, four incorporated product regressions failed specifically: namespace, empty-spread singleton, two-string spread separator, shadowing parameter. The independent original R2 file had three assertion failures. Both red outputs are appended to task-2-red.txt. After correction, **125/125** Node tests pass (three contracts plus the original seven R1 and three R2 review repros), no failures/skips. Focused scanner/test ESLint and git diff --check pass. Only scanner/test changed in the product delta; baseline was remeasured and its contents are identical to fix1.

**Current measurement is unchanged:** 325 sources, 1603 sink visits, **135 findings / 40 files (70 eyebrow, 16 dash, 49 jargon)**, 922 diagnostic paths. Existing SubscriptionCard:25 and MatchingStepRenderer:36 dash origins remain in the baseline. The historical R1 133-finding count is not a current gate. No fresh domain audit or Jest rerun was performed: the scanner-only delta does not alter the previously measured CTA consumer products (147/147 Jest).

Remaining runtime/Map/reduce/arbitrary regex limits and conservative copy-field roots stay as described in the fix1 audit; they do not waive these three static defects. No absolute runtime coverage claim. No quality/Loop/native/build/commit/push. Controller owns snapshot-r3/delta and original-reviewer focal re-review before final validation.

Packaging remains the four aggregated files task-2-red.txt, task-2-green.txt, task-2-audit.md, task-2-report.md. Current fix details are task-2-fix2-report.md. Individual round outputs and measurements remain local review artifacts; no artifact outside the declared task-2-* workspace or owned products was created by this worker.

---

# Historical fix1/R1 audit (superseded current section)

# T01 / Task 2 — current audit after fix round 1 (2026-10-25)

The independent R1 review requested changes. Its seven P2 findings were static-analysis defects in the promised domain, not acceptable runtime exclusions. The earlier snapshot and its counts are preserved below as history, **not current acceptance evidence**. Independent re-review remains pending.

## Current measurement

Node 20.20.2, same writer/ownership: **325 sources, 1603 sink visits, 135 findings in 40 files (70 eyebrow, 16 dash, 49 jargon), 922 diagnostic paths**. R1 was 325/1595/133/964. The only finding changes are:

| File | R1 | Current | Cause |
| --- | --- | --- | --- |
| src/features/subscription/components/SubscriptionCard.tsx | eyebrow 1, dash 0 | eyebrow 1, dash 1 | describe() returns detail at :25, destructured and displayed; previously missed by the guard. |
| src/features/lesson-flow/renderers/MatchingStepRenderer.tsx | absent/zero ceiling | dash 1 | Literal JSX span ` — ` at :36 was incorrectly stripped before dash classification. |

No screen/copy was edited to obtain these numbers. The baseline was remeasured, not raised to absorb a false positive. The JSON ceilings include the newly detected real text origins.

## R1–R7 corrections and focused acceptance

- **R1:** follow BindingElement to its object/array initializer, including function-return objects and renamed local bindings. SubscriptionCard's existing dash is now measured.
- **R2:** propagate each returned array/object's parameter environment into consume/property/shorthand resolution. Tests combine function arguments with arrays, returned shorthand properties and returned named properties.
- **R3:** interpolation separators contain no letters (U+FFFC), so the analysis no longer injects lowercase `value` into an uppercase template. The mixed-case static-template negative case remains allowed.
- **R4:** inspect a join separator only when a statically enumerated array has more than one element; preserve surrounding whitespace for dash detection. Empty and singleton literal-array joins do not manufacture a visible separator. This is bounded cardinality analysis, not evaluation of arbitrary runtime arrays.
- **R5:** array length produces a numeric result, not the strings stored in the array. Known non-index properties do not mean “all array elements”; dynamic element access remains conservative.
- **R6:** recognize React Native Alert from its import specifier's origin (including renamed imports and simple local aliases), preserving the unbound canonical Alert fixture. An unrelated object's alert method is not an Alert sink.
- **R7:** remove the blanket exclusion of JSON.stringify. Serialization consumed by UI exposes its literal-value origins; fetch transport context is excluded by its use. Tests put a real serialized HTTP body next to visible serialized text, proving their different handling. JSON.stringify booleans in telemetry remain clean without hiding visible strings.

The checked-in product tests first produced **11 assertion failures, 3 passing negative variants, 43 nonmatching tests skipped** on the pre-fix scanner. The reviewer's original file independently recorded 7/7 assertion failures. Both outputs are aggregated in task-2-red.txt. After correction, the three Node contracts plus the original seven reviewer reproductions pass **118/118**, zero skipped/failures. This includes the named negative variants for mixed-case templates, empty/singleton joins, numeric array length, unrelated Alert objects and real HTTP transport. These red/green specific repros are the fix evidence; the historical 11 mutation checks below are not presented as new fix-round runs.

Focused ESLint for scanner/test from the app cwd passed, and git diff --check passed. An initial lint invocation from repository root could not find the app ESLint configuration (exit 2); the corrected app-cwd command succeeded. No Jest repeat was needed: only the scanner/test/baseline changed after the earlier 147/147 CTA consumer result. No quality/Loop validation/native/build/commit/push was run by this worker.

## Remaining diagnostics and cross-check delta

Current diagnostics: **293 unresolved identifiers, 449 unresolved properties, 177 unresolved calls, 3 ThisKeyword** (922 overlapping paths, not unique missing strings). Removing the eager property shortcut and preserving call environments changes where a dynamic path is diagnosed, so category counts do not measure monotonic coverage. The remaining Map/get, reduce, arbitrary regex/service and runtime-data limits described in the historical audit still apply; they do not justify reclassifying a simple local binding, composite function return, constant template, join separator, array length, imported Alert alias or visible serialization as runtime. All seven named static defects now have specific tests.

Current exclusion-origin counts: 358 clinical-authorship, 9 source/license metadata, 3 protected-legal prose; no transport exclusion happened to be reached in the current production source snapshot. The transport fixture nevertheless verifies its use-dependent handling. JSON.stringify alone is no longer listed as an infrastructure exclusion in domainPolicy/baseline policy.

The independent textual-search source lines are unchanged because no source-screen copy changed. Of the current 135 findings, 130 share a line with that textual search; the same five .toUpperCase() calls remain AST-only under that search convention. The two newly measured dash origins were already present in textual search and were real false negatives in R1, now corrected. No absolute runtime copy-coverage claim is made.

## Packaging/current report

Current fix details: task-2-fix1-report.md and consolidated task-2-report.md. The four canonical packaging inputs remain task-2-red.txt, task-2-green.txt, task-2-audit.md and task-2-report.md. Red/green now retain both R1 history and the latest fix round. The measurement JSONs and individual round logs remain local task-2-* review artifacts.

---

# Historical snapshot R1 audit (superseded measurement)

# T01 / Task 2 — audit, measured 2026-10-25

Node used for tests: `/Users/anderson/.nvm/versions/node/v20.20.2/bin/node`.
Writer authorized by controller: `run-1792947283114-3566f047`, editing / STEP_STARTED. This worker did not create or close a run/session.

## Measured domain

325 TS/TSX source files; 1595 sink visits; 133 unique origin-AST/class findings in 39 files: **70 eyebrow, 14 dash, 49 jargon**. These numbers replace the older plan's historical counts; they are different measurements on the current checkout, with broader coverage.

Roots: all `radiant-app/src/**/*.ts(x)` except test/spec/story/declaration/test-utility sources. Follow relative imports and `@/*` aliases using the current tsconfig order (`./*`, then `./src/*`). External sources reached: `components/external-link.tsx`, `components/haptic-tab.tsx`, `components/ui/icon-symbol.tsx`. No dependency code is loaded by the custom TS program. `ast-helpers.mjs` supplies the shared parser/unwrap helpers; no dependency/lockfile/policy change.

Sinks: JSX children including fragments, renamed Text imports and ReactNode wrappers; props and object copy fields `title`, `label`, `body`, `eyebrow`, `subtitle`, `description`, `message`, `placeholder`, `accessibilityLabel`, `accessibilityHint`, plus authored `prompt`, `explanation`, `phrases` subject to source/field exclusions; Alert.alert title/message; referenced text styles. Object copy fields are conservative candidate roots: the analysis does not claim every runtime object is reachable in the rendered screen. It tracks locals, named/default imports, aliases, property/shorthand access, literal arrays/indexes/spreads, map/find/filter/flatMap, function returns/parameters, useMemo, ternary result arms, static template spans/interpolations, trim/toLowerCase and join origins. It does not execute app code or evaluate condition/discriminant literals as copy.

Origin AST plus class is the dedup key. A repeated alias/import does not multiply one literal. Eyebrow prop values and uppercase on the text path are counted; an object style merely called eyebrow is not a text finding. Uppercase literals require >=4 Unicode letters. Dash requires spaces around em/en dash, preserving hyphens and `120–140`. Jargon uses Unicode word boundaries: jornada, elegível, nó (including nó liberado), checkpoint, Configuração/Configurações. Each file/class has its own ceiling; absent paths default to zero. Unknown classes/invalid ceilings and obsolete paths fail; a lower count warns to reduce the ceiling.

## Explicit exclusions (no whole data/UI/bench/Pixel source blanket)

The exact policy is exported as domainPolicy and recorded in copy-style-baseline.json:

- Tests/spec/stories/declarations, __tests__, __mocks__, test-utils.
- `src/data/lessons.ts`, `src/data/ai-lessons.ts`: questions subtree (clinical prompt, answer choices, explanation); lesson navigation titles remain.
- `src/data/journey/defaultBlocks.ts`: payload prompt/explanation/options and teach/reinforce body. Context body, eyebrow and titles remain. The closing UI sentence containing “nó” is measured.
- `src/features/bench/lessons/exposicao.ts`, `colimacao.ts`: clinical prompt/body/explanation/options. Navigation titles and control labels remain.
- The two explicit L1/L2 authored content sources: challenges/relationships/modelLayers/sources subtrees. The preview screens and other fields remain.
- `src/features/subscription/screens/SubscriptionScreen.tsx`: only CANCEL_COPY and children of Text styled exactly styles.legal are protected legal prose. Other paragraphs, buttons, legal labels and accessibility hints remain.
- `src/features/student-checkpoints/EditorialCurriculumCandidate.ts`: only sources metadata and LICENSE.label. Student interface text remains.
- fetch request bodies and JSON.stringify payloads are transport data, not UI copy.
- Comments/import specifiers/type literals, routes, testIDs, storage keys, icons and discriminant strings are not sinks.

The snapshot contains 358 clinical-origin exclusions, 8 transport payloads, 9 source/license metadata entries and 3 protected-legal entries. Entries are AST origins, not a clinical/editorial approval claim.

## Diagnostics: explicit analysis boundary

**964 diagnostics**, not 964 confirmed clean strings: 385 unresolved identifiers, 447 unresolved properties, 131 unresolved calls, 1 ThisKeyword. This is an overlapping path diagnostic inventory (one dynamic expression can produce an identifier/property/call diagnostic); these are not unique missing sinks. The test prints this count every run, and the local task-2-measurement.json retains every location/expression/reason. They are outside the finding ceiling; the baseline does not make them resolved.

Examples classified against actual code:

| Kind | Actual source/path | Interpretation |
| --- | --- | --- |
| Runtime props/state | AppButton label/children/hints; WelcomeSlide stepLabel/title/body/footnote; JourneyHome segments; Subscription offers.products | Supplied at runtime; source literals on callers/copy-field roots are scanned separately. Props/state themselves cannot be asserted clean statically. |
| Runtime personalization | ProfileIdentityHeader displayName/charAt and email.split | Runtime data; uppercase transform is nevertheless measured at its call origin. |
| Numeric/date formatting | nodeCopy date.getFullYear and String(...).padStart; HUD Math.max; telemetry locale/date formatting | Generated numbers/dates; static surrounding template spans are still scanned. |
| Static collection indirection limitation | catalog LESSONS_BY_ID.get(lessonId), defaultTrack LESSON_CATALOG.lessons.find | Map construction/get and full service evaluation are unsupported. Raw source lesson titles are independently scanned as copy fields, so known catalog title literals are not silently discarded. |
| Function transformation limitation | JourneyDefinitionService displayLessonTitle(rawTitle).replace(/^Quiz:/, '').trim() | Imported function/return is followed, but arbitrary regex replace is not evaluated. Its raw source title fields are scanned; the transformed output has no completeness proof. |
| Array reducer limitation | WelcomeSlide groupLabel filter(Boolean).reduce | The aggregation is not evaluated. Each actual JSX title/body and caller props are measured separately. |
| Runtime arrays | Checkpoint/Reward snapshot.track.units flatMap/find; LessonFlow currentInteraction payload options; telemetry Object.entries(...).map | Input contents come from runtime/catalog boundaries; declarations and JSX descendants are scanned, but no whole-program value proof. |
| Style hooks/animation | useAnimatedStyle callbacks, interpolated shared values | Conservative wrapper traversal encounters non-copy expressions; diagnostics do not imply visible copy is missing. |

Named/default imports, @ aliases, static arrays, returns and template literals are exercised by isolated fixtures with hand-derived expectations, including origin dedup; they are not waived simply because diagnostics exist. Remaining Map/reduce/regex/service/runtime boundaries are documented limitations, not evidence of full domain coverage. No absolute coverage claim is made. An independent reviewer must decide whether this bounded guard is sufficient for T01; future T17 cannot infer “no copy remains” from a zero finding count alone without this boundary audit. The 133 current findings intentionally remain for their owning screen tasks; this task changes only the trail CTA.

## Independent textual cross-check

`rg` search over production src/components for jargon, eyebrow, uppercase style, uppercase words and spaced dashes produced **3717 matching lines** (task-2-textual-search.txt). This is not comparable one-for-one with 133 AST origins/classes: it includes identifiers/imports/comments/metadata and unused external components, counts a line once, and can put multiple copy literals on one line.

128 AST findings share a source line with that textual search. The **five exact AST-only locations** are `.toUpperCase()` expressions omitted by that independent textual convention: HomeScreen:513, ProfileIdentityHeader:53 and :98, TelemetryDebugScreen:332 and :441. The AST measures these because the call is on a text path. This is why text search alone cannot be the guard.

Textual-only examples and their dispositions:

- storageInventory / storageKeys checkpoint keys: internal identifiers/storage literals; no text sink.
- app/_layout checkpoint import/route/type/discriminant strings: routing/type identity; the rendered “jornada” at :544/:561 is measured.
- comments in nodeCopy mentioning the CTA: comments; runtime literal is measured via the consumer.
- SubscriptionScreen legal renewal prose and CANCEL_COPY: narrow legal exclusion, without excluding “Vidas — e só isso” or link hints.
- EditorialCurriculumCandidate sources titles and CC BY 4.0: bibliography/license metadata in the named source/fields.
- lessons clinical questions/choices: protected authorship by named source and subtree, while defaultTrack's visible “Checkpoint da unidade” remains.
- type field eyebrow?: string: type metadata; actual defaultBlocks eyebrow values are measured.
- ordinary uppercase constants/SDK names and Icon name/testID: internal symbols/attributes; a visible MISSÕES literal is measured.

No unaccounted textual count has been promoted to an implementation guarantee. Raw search and per-origin snapshot stay local for review; the versioned audit contains the method, counts, exact AST-only differences and concrete exclusions.

## Consumer reconciliation and validation

Six actual Maestro YAML consumers updated, including all assertions/taps and comments. The AST Maestro contract preserves nodeCopy's exported function, single default and ternary shape. The checkpoint performance launch detector and command fixture change together. JourneyHome's two negative CTA assertions now query Continuar trilha, preserving the ability to catch CTA leakage. JourneyTrail/nodeCopy consumer expectations also change.

The only remaining “Continuar jornada” in src/.maestro/scripts is the generic AppButton.test.tsx fixture at :138; left unchanged by the binding ruling, as it does not consume the trail CTA.

- task-2-red.txt: initial executable no-op scanner yields specific [] versus expected-class failures (not missing-module errors); CTA and performance consumer failures; later named case failures; final 11 mutation runs, each a nonzero exit.
- task-2-green.txt: final Node run **97 passed**, followed by the previously measured unchanged CTA Jest consumers **147 passed / 3 suites**; focused ESLint exit 0. It does not stand for full quality.
- Mutations killed: jargon, spaced dash, uppercase literal, structural eyebrow, Alert sink, @ alias, default export, baseline increase, protected legal prose, clinical exclusion, wrapper children. Each uses a specific test-name filter and runs a temporary task-2-* scanner; product files were not mutated for those checks.
- git diff --check: passed.

No full quality/Loop validation, native test, simulator, build, commit, push or release was run by this worker. Controller owns final validation and operational docs.
