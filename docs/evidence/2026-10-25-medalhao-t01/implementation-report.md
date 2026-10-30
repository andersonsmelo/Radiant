# Task 2 / T01 consolidated report

**Status: fix3 ready for original-reviewer focal re-review; product writes paused.**

R3-A now preserves static text origins from conditional array spreads independently of separator cardinality. Unioned alternative origins do not count as simultaneously rendered positions: singleton branches stay separator-free, while two-item branches retain their guaranteed separator. Prior namespace, Alert shadowing, spread and seven original R1 cases remain green.

Final evidence on Node 20.20.2: **129/129 Node tests**, comprising three contracts plus all original R1/R2/R3 reviewer repros; scanner/test lint and diff-check exit 0. Three new product cases were seen fail before correction; the original R3-A reproduction recorded 1/1 red. Previous unchanged CTA Jest evidence remains 147/147 / 3 suites, not rerun.

Current baseline unchanged: **135 findings / 40 files (70 eyebrow, 16 dash, 49 jargon)**; 325 sources / 1603 sink visits / 922 overlapping diagnostic paths. No screen copy changed during the fix rounds. SubscriptionCard:25 and MatchingStepRenderer:36 remain measured existing dash origins. All historical measurements and review red/green outputs remain in the audit/log package.

Original delivery scope remains the AST guard/baseline in quality, Continuar trilha CTA, six actual Maestro YAMLs, AST Maestro contract, performance detector/fixture and real nodeCopy/JourneyTrail/JourneyHome consumers. Generic AppButton fixture stays unchanged by ruling.

Runtime/Map/reduce/arbitrary-regex limits and conservative copy-field roots remain explicit; no absolute runtime coverage or native claim. They do not excuse the corrected static cases. Later owning tasks must reduce baseline ceilings; T17's zero gate and boundary audit remain pending.

Round details: task-2-fix3-report.md. Packaging inputs remain aggregated red.txt / green.txt / audit.md / report.md. No broad audit, full quality, Loop validation, simulator/build, commit/push by worker. Controller owns snapshot-r4/delta, focal re-review, final validation and closure of run-1792947283114-3566f047.
