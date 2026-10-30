# Task 6 / T04a implementation report — 2026-10-27

Status: **DONE_WITH_CONCERNS**. Product frozen for independent review. No commit/push.

The registry imports BenchStepRenderer statically. Jest maps @shopify/react-native-skia to one observable shared double; the six named consumers no longer duplicate the factory. Existing shader/fallback and illustration frame/color/light-slot assertions and Make overrides remain intact.

## Requirements and files

- `radiant-app/jest.config.cjs`
- `radiant-app/src/features/bench/CollimationImage.test.tsx`
- `radiant-app/src/features/bench/ExposureImage.test.tsx`
- `radiant-app/src/features/lesson-flow/renderers/ActivityRendererRegistry.test.tsx`
- `radiant-app/src/features/lesson-flow/renderers/ActivityRendererRegistry.tsx`
- `radiant-app/src/features/lesson-flow/renderers/BenchStepRenderer.test.tsx`
- `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`
- `radiant-app/src/test/mocks/reactNativeSkia.test.tsx`
- `radiant-app/src/test/mocks/reactNativeSkia.tsx`
- `radiant-app/src/ui/illustrations/ThemeIllustration.test.tsx`

The three additional runtime paths in the brief were used only for temporary mutations and restored byte-for-byte. Two first-run factories remain unchanged as explicitly scoped. No dependencies, physics, curriculum, design identity, economy, SDK, native fallback or runtimeVersion policy changed.

## Evidence by phase

1. RED before import/mapper implementation: registry TypeScript AST assertion sees no static BenchStepRenderer import; resolution assertion still finds the installed native package. Both fail by assertion with exit1, not loading errors. See red.txt initial phase.
2. GREEN with shared hosts and unchanged scenario overrides: seven suites/184 tests pass. New double suite characterizes hierarchy/children, shader source/uniforms, Canvas dimensions, Skottie frame/animation, layer color, ColorMatrix, picture recorder, testID, and success/null/throw overrides.
3. Mutation evidence: seven injected defects fail their intended guards: missing seed uniform; removed shader fallback for null and throw; wrong soft-tissue fallback tone; lost collimation field; silhouette light left on; broken Skottie fallback for null/throw; double discarding uniforms. Each runtime is restored by finally and SHA. Full outputs: red.txt. Exact anchors, commands, exit codes and before/mutated/restored hashes: mutations.json.
4. Final GREEN after runtime restoration: seven suites/184 tests, zero failures. Node20.20.2 measured. Full command/cwd/output: green.txt. App tsc --noEmit and focal eslint exit0, no lint warnings. git diff --check exit0.
5. Warning provenance: baseline bytes of config/registry/flow test reproduce 85 passing flow tests and the same two act warnings as final7. Both warnings are from LessonFlowAttempt at setUnitProgress LessonFlowScreen.tsx:542:9 and setSummary :502:17. Original final bytes restored with identical SHA, recorded in green.txt. The warning is pre-existing baseline noise, retained unsuppressed.

## Self-review and limits

Self-review, complete API inventory, owned final SHA snapshot, scope classification and unchanged runtime/first-run hashes are in audit.md. All existing consumer assertions are preserved. The import contract is AST-based; useful source/uniform/frame/slot observations remain available through shared hosts and scenario animations.

The mock does not compile SkSL, parse Lottie as native Skottie, rasterize pixels, measure GPU/native costs or prove device animation. No native or release gate was exercised. The two baseline act warnings remain a known test-harness concern; their repair is outside this technical change. Controller owns independent review, one final Loop validation and writer closure. Implementer has not run full quality or Loop commands, started native tooling, installed dependencies, committed or pushed.

## Validation command

CWD: `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app`; PATH prefix `/Users/anderson/.nvm/versions/node/v20.20.2/bin`; `node --version` => v20.20.2.

```sh
EXPO_NO_DOTENV=1 npx --no-install jest --runInBand --no-cache src/test/mocks/reactNativeSkia.test.tsx src/ui/illustrations/ThemeIllustration.test.tsx src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx src/features/lesson-flow/renderers/ActivityRendererRegistry.test.tsx src/features/lesson-flow/renderers/BenchStepRenderer.test.tsx src/features/bench/ExposureImage.test.tsx src/features/bench/CollimationImage.test.tsx
```

Expected review disposition: assess ten owned permanent paths against brief R1 and audit.md; confirm restored runtime hashes and real mutation outputs. Product remains frozen pending controller instruction.
