# Maestro local E2E runbook

The `.maestro` workspace covers the real local-first route, not a mocked API:

- `first-run.yaml`: a clean install (`clearState`) now lands on the first-run
  welcome — three skippable screens narrated by the Pixel mascot. "Começar"
  opens the context screen of the first eligible learning step; "Pular
  apresentação" keeps the shorter escape route to the learning-road home.
  This flow asserts the welcome copy itself, the footnote disclaimer on the
  last screen, and the first lesson's source-derived context after tapping
  "Começar".
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
- `rating-prompt.yaml`: the only flow that reaches the store-review prompt's
  eligibility gate. `RatingPromptService` requires `countEvents('app_open') >=
  MIN_APP_OPENS` (3), and every other flow opens the app once — twice for
  `offline-relaunch` — so the prompt always stopped at `insufficient_sessions`
  and had never been exercised on a device. It drives the **`/quiz` route**, not
  `/learn`: the prompt's call sites are `QuizScreen`, `ReviewScreen` and
  `RewardScreen`, and the lesson-flow reaches none of them. It completes a
  passing quiz (which emits `first_value_moment_reached`, the gate's other
  precondition), relaunches twice without clearing state, then completes a
  second quiz.
  **It requires a production-equivalent build**: eligibility returns
  `blocked: non_production_build` whenever `APP_ENV !== 'production'`, and the
  `e2e-test` profile declares `development`. The dialog assertion is iOS-only
  and is pinned by the contract — see "Rating prompt" below.
- `reward-locked.yaml`: covers the reward node from the only side a smoke can
  reach it. The node unlocks on `requiresNodeIds: [node:<last lesson>]` and the
  active track has 7 lessons, so the achievement is unreachable in a smoke —
  `learning-critical-path` even forbids asserting it. This flow deep-links
  `radiantapp://reward?nodeId=…` instead, because `findReward` resolves by id
  **without** checking status. It asserts the locked state and, above all, the
  **absence** of the collect button. **It does not prove the unlock rule**; that
  half stays uncovered. See
  [`2026-08-04-b5-reward-deep-link.md`](evidence/2026-08-04-b5-reward-deep-link.md).
- `reward-unlock.yaml`: the other half of the reward node — the unlock rule
  itself, which `reward-locked.yaml` states it does not prove. It walks the
  whole active track: 7 lessons chained by 6 checkpoints, lesson → checkpoint →
  lesson, and only then does the achievement become collectable. **It is
  forbidden from deep-linking the reward** (the contract enforces it): arriving
  by `radiantapp://reward` would re-prove what the sibling already proves and
  leave the rule uncovered with nothing going red. It arrives by the product
  path instead — the home CTA, whose label comes from `continueLabel`, and the
  checkpoint CTA, from `resolveNextAction`. The assertion that carries the flow
  is that label: `continueLabel` returns "Receber conquista" **only** when the
  recommended node is a reward, and the reward is recommended only once
  `requiresNodeIds: [node:<last lesson>]` is satisfied — the six earlier lessons
  each produced "Abrir checkpoint" instead. It then collects and asserts the
  milestone counter moved from 13 of 14 to 14 of 14, which is what separates
  "the button appeared" from "the collect wrote". **Not yet run on a device —
  see the sign-off note below.**
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
one VoiceOver node on iOS, leaving only the step position audible and hiding
the title, body, illustration label and the store-required disclaimer from
screen readers (fixed by composing the group
label from position, title, body and footnote, commits `1a8fd59`/`b3f5684`;
the illustration's `accessibilityLabel` still isn't part of that composition,
so it remains collapsed by the grouping — a known gap, not scheduled); and
Maestro's selector is a
full-match regex, so the old bare-title pattern stopped matching once the
label carried the full composed phrase (fixed by anchoring `first-run.yaml` on
the real group-label shape, with `scripts/maestro-contract.test.mjs` now
deriving the expected anchored pattern from `WelcomeFlowScreen.tsx`'s own
`SLIDES` array and rejecting the old bare-title form, commit `728ca8d`).
iOS is `passed` for `first-run`, `boot-to-home`, `learning-critical-path` and
`offline-relaunch`. `store-capture.yaml` failed on this run's iPhone 17 Pro
simulator — not due to the welcome: the diff this branch made to that file is
one line (the dismiss-first-run step). The step that actually failed, in the
first quiz, uses the `runFlow when notVisible → scrollUntilVisible` guard —
the exact pattern commit `f7b602a` already removed from the second quiz,
because Maestro doesn't model occlusion: the element sits in the tree and
reads as "visible" to the guard while it's actually under the floating CTA,
so the guard skips the scroll and the tap lands on the wrong control. The
quiz stalled at `0%` selected is that defect's signature. The fixed scroll
calibrated for iPhone 16 Plus and iPhone 11 Pro Max lives in the **second**
quiz, steps past where the flow actually failed, and was never reached this
run. The sibling `learning-critical-path` makes the same assertion and also
uses `scrollUntilVisible` — the real difference is that the sibling has no
`runFlow when notVisible` guard and uses `centerElement: true` instead of
`visibilityPercentage: 60`. **Android was not re-run against the welcome in
this session** — its 2026-07-29 `passed` state predates the gate and does not
cover it. Full detail, recipe and the `store-capture` attribution are in
[`docs/evidence/2026-08-02-e2e-primeiro-uso.md`](evidence/2026-08-02-e2e-primeiro-uso.md).

On 2026-08-03 the suite was re-run on version **1.3.1 (3)** and **both platforms
now pass all five flows** — the paragraph above is the record of 2026-08-02 and
its "Android was not re-run" clause no longer describes the present. Getting
there took four rounds and surfaced two real flow defects plus one host problem,
all of them older than the first-run welcome. `offline-relaunch` chained two
`tapOn: Continuar` straight into a `scrollUntilVisible`; in Maestro
`assertVisible` **is** the wait, so the scroll began before the quiz step
existed in the tree — invisible on iOS at ~0.1s per screen, fatal on Android at
~5× that (`970ffb6`). `store-capture`'s first quiz still carried the
occlusion-blind guard and was fixed with the same fixed scroll the second quiz
already used (`da877b2`). The host problem is documented under "Host budget"
below; three of the first round's failures were timeouts that vanished once
memory was freed. Both fixes are pinned by contracts, and the full account —
including the trap where the emulator silently reverted to 1.3.0 — is in
[`docs/evidence/2026-08-03-e2e-1.3.1-ios-android.md`](evidence/2026-08-03-e2e-1.3.1-ios-android.md).

On 2026-08-09 the first-victory route changed after the last device matrix:
completing all three presentation slides now resolves the current journey and
opens its next eligible node from the node's context screen, while skipping the
presentation still opens Home. The static contract derives the first lesson
body from `defaultBlocks.ts` and requires `first-run.yaml` to assert it after
"Começar". The startup flow suite covers first lesson, due review, persistence
ordering, double tap, and safe Home fallback. On 2026-08-09 the updated
`first-run.yaml` passed 1/1 on a local Release build in an iOS 26.5 simulator,
including the catalog-derived lesson context after "Começar". The same updated
flow then passed 1/1 on a production-configured local Release APK in the Android
API 36 emulator. The other flows remain anchored to the earlier matrix.
Evidence:
[`docs/evidence/2026-08-09-primeira-vitoria-ios.md`](evidence/2026-08-09-primeira-vitoria-ios.md)
and
[`docs/evidence/2026-08-09-primeira-vitoria-android.md`](evidence/2026-08-09-primeira-vitoria-android.md).

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
maestro test .maestro/reward-locked.yaml
maestro test .maestro/reward-unlock.yaml
```

The two reward flows are a pair and only mean something together: one asserts
the node refuses collection while locked, the other that it yields after the
seventh lesson, and both point at the same `node:reward:fundamentos:final`.
`reward-unlock` is the long one — 170 steps, roughly 15 minutes — and it must
not be shortened by deep-linking to the reward, which is what its sibling
already covers.

**Declare the visibility bar; never inherit it.** `scrollUntilVisible` defaults
to demanding **100%** visibility. On 2026-08-06 that failed `reward-unlock` on
Android at an option that was on screen and tappable: a decorative glow —
non-clickable, `important-for-accessibility=false`, like all 78 nodes of that
layer — covered ~11% of the option's bounds, and 89% became a red after 103
steps. `assertVisible` and `tapOn` on the same id passed, and the scroll passed
at 80%. iOS never tripped it because its composition differs. The contract
requires every `scrollUntilVisible` to state `visibilityPercentage`.

**One bar per selector — corrected on 2026-08-07.** Declaring the bar was only
half the rule, and the half that was written down left a contradiction
standing: `learning-critical-path.yaml` and `offline-relaunch.yaml` demanded
100% of `lesson-option-q1:option:1` while `reward-unlock.yaml` demanded 80% of
the **same element on the same screen**, with the measurement above written in
a comment three lines away. Two rulers for one element is not platform
tolerance — it is a contradiction that only shows up by burning a device
window, and which flow pays is decided by run order. All three now sit at the
measured-safe 80, and a second contract assertion
(`keeps one visibility bar per selector across every flow`) makes the
divergence impossible to reintroduce: whoever measures a different number
changes every site at once, which is the review the silent divergence never
had. An inherited default is a decision nobody made; two declared defaults are
a decision made twice, differently.

**Budget the Android run in hours, not minutes.** Measured on 2026-08-06 on
this host: roughly **one minute per step** on the emulator — 103 steps took
~110 minutes. `reward-unlock` is 170 steps, so plan the exclusive host window
accordingly; the earlier "~13 min" figure in the roadmap was off by nearly an
order of magnitude. The emulator is also fragile under contention: a second
attempt died with `device 'emulator-5554' not found` four steps in. Run it with
nothing else competing for the 16 GB, and check `adb devices` before trusting a
short run.

**Prove the binary before trusting the run.** On 2026-08-06 `npx expo run:ios`
failed on this host for a missing CocoaPods CLI while the shell still reported
success (the build had been chained with diagnostics by `;`, so the status came
from the last element), and a build from two days earlier was still installed on
the simulator. Running the flow there would have produced a genuine `passed`
against the wrong binary. Use the `xcodebuild` path above, then check that the
installed bundle carries the timestamp of the build you just made:

```sh
xcrun simctl get_app_container <UDID> com.ascendcreative.radiant app
```

Run each flow once on an iOS simulator and once on an Android emulator. Keep
the generated artifacts in `.maestro/artifacts/` out of Git. For a triageable
CI-style report, use:

```sh
maestro test .maestro --format junit --output maestro-results.xml
```

### Gate H3 — active interno e p95

O gate H3 usa o mesmo binário `checkpoint-internal` antes/depois. Como ele é
um Dev Client, o Metro precisa repetir explicitamente a configuração do profile.

**Antes de qualquer coisa, corrija a precedência do env — medido em 2026-08-10,
e sem isso o gate não mede nada.** `EXPO_PUBLIC_APP_ENV=development` na linha de
comando **não chega** ao app. O módulo virtual que o Expo injeta
(`node_modules/expo/virtual/env.js`) monta o env do cliente como

```js
{ ...process.env, ...('.env', '.env.development', '.env.local', ...) }
```

com os **arquivos espalhados depois**, ou seja o arquivo vence o shell — o
inverso da precedência do próprio CLI, que registra no terminal que não vai
exportar as variáveis já presentes no ambiente. Como `radiant-app/.env` declara
`EXPO_PUBLIC_APP_ENV=preview`, o app resolvia `AppConfig.APP_ENV = 'preview'`
enquanto `process.env.EXPO_PUBLIC_APP_ENV` dizia `'development'`. E
`resolveStudentCheckpointRuntimeMode('preview', 'active')` devolve **`off`** por
contrato: o runtime interno era inalcançável por esta receita, o probe resolvia
desligado no import e as coortes sairiam vazias. O sintoma engana porque é
seletivo — `EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE` **não** está no `.env`, então
essa flag chegava certa e só a outra era sobrescrita. `EXPO_NO_DOTENV=1` não
resolve: ele governa o carregamento do CLI, não o módulo virtual.

`.env.local` é espalhado **depois** de `.env` e é o único ponto que corrige isso
sem editar o arquivo do desenvolvedor. Crie-o antes de subir o Metro:

```sh
printf 'EXPO_PUBLIC_APP_ENV=development\n' > radiant-app/.env.local
```

Ele é ignorado pelo git (`radiant-app/.gitignore:34`), mas **não** é isento do
guarda de escopo do Loop: crie-o antes de abrir o run, para que entre na
baseline, e remova-o depois de `run close`.

**Mudou em 2026-08-10: a coorte baseline agora roda com `PERFORMANCE=true`.** A
marca de primeiro frame (`first_frame`) é emitida em **todos** os modos do kernel,
porque é ela que passou a gatear o cold start, e um delta exige as duas coortes.
Ligar `PERFORMANCE` com `MODE=off` **não** liga o probe de checkpoint: ele exige
`runtimeMode === 'active'`, então o baseline emite `first_frame` e mais nada.

Isso é verificado, não assumido: se um log de baseline carregar qualquer métrica de
checkpoint (`persistence`/`restoration`), o gate `baseline_isolation` **reprova o
relatório**. Foi escrito depois de uma contaminação real por replay de buffer do
CDP, que na época nada pegaria porque o baseline não era lido.

```sh
# baseline: kernel em `off`, mas a marca de partida É emitida
EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE=off \
EXPO_PUBLIC_STUDENT_CHECKPOINT_PERFORMANCE=true \
EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false \
npx expo start --dev-client --clear

# candidato active; somente persistência/restauração são emitidas localmente
EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE=active \
EXPO_PUBLIC_STUDENT_CHECKPOINT_PERFORMANCE=true \
EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false \
npx expo start --dev-client --clear
```

**Prova de instrumento, antes de coletar cada coorte.** Contrato estático,
parser verde e resolução de profile pelo EAS CLI não observam o app rodando: em
2026-08-09 os três estavam verdes e o runtime não ligava. Meça o modo **dentro
do processo**, pelo inspector do Metro, e guarde a leitura como
`instrument-proof.json` no diretório da coorte. A leitura esperada é
`{"APP_ENV":"development","modoResolvido":"active","probeEnabled":true}` no
candidato e `modoResolvido":"off","probeEnabled":false` no baseline. Um gate que
nunca leu essa linha não mediu o que promete.

**O primeiro flow depois de `--clear` é descartável — e a corrida reincide.**
Com o bundler frio, os três guards `runFlow when visible` do topo do flow são
avaliados antes de o dev menu aparecer, os três são pulados e a falha se
manifesta três passos adiante, na primeira asserção obrigatória — com mensagem
de seletor errado. Rode um aquecimento e descarte-o antes de contar amostras.

**Corrigido em 2026-08-10:** o aquecimento **não** é remédio completo. A mesma
corrida reincidiu no meio de uma coorte já quente (execução 8 de 20), com a
assinatura idêntica: os dois guards do dev menu `SKIPPED` e a falha na primeira
asserção obrigatória. Ela acontece sempre que o dev menu demora, não apenas
depois de `--clear`. Por isso a coleta precisa **repetir a execução que falhar**
até fechar o número de amostras válidas, e registrar quantas retentativas houve.

**Ao repetir, não sobrescreva o log da tentativa perdida.** Medido na mesma
sessão: o runner gravava todas as tentativas no mesmo arquivo e apagava o
diretório antes de repetir, então a assinatura da falha desapareceu e não foi
possível afirmar se era esta corrida ou outra coisa. Guarde cada tentativa em
caminho próprio (`.../<n>/tentativa-<k>/`).

**Pré-requisitos de ambiente que o shell do agente não herda — medido em
2026-08-10.** Shell não-interativo não carrega `~/.zshrc`, então três coisas
somem e cada uma falha de um jeito diferente:

| falta | sintoma |
| --- | --- |
| `~/.maestro/bin` no `PATH` | toda execução sai em `status=127` e 0 s |
| `JAVA_HOME` | `maestro` responde `Unable to locate a Java Runtime` |
| Node ≥ 22 como `node` | o coletor CDP quebra em `WebSocket is not defined` |

```sh
export JAVA_HOME="$HOME/.jdks/jdk-17.0.19+10/Contents/Home"
export PATH="$JAVA_HOME/bin:$HOME/.maestro/bin:$PATH"
```

O `node` do `PATH` pode ser o 20; use o binário 24 explicitamente para os
auxiliares que falam CDP. Vinte execuções saindo em 0 s parecem "o app quebrou"
e são só `PATH`.

**As duas coortes rodam em sequência imediata, no mesmo processo de
orquestração.** Medido em 2026-08-10, e custou uma passagem inteira: baseline e
candidato executados com uma hora de intervalo na mesma máquina produziram um
delta de cold start de **+6021 ms**, vinte vezes o limite. A causa era o host —
swap em 2781 MB de 3072 MB e load 5,58 ao fim, contra swap zero no começo — e
não o software, já que num Dev Client a janela do `launchApp` é lançamento
nativo. Repetida com as coortes em sequência, a mesma comparação deu +918 ms.

A deriva do host é indistinguível de regressão por qualquer análise que só olhe
os dois números, porque ela tem o **mesmo sinal** do efeito procurado: o
candidato roda depois, logo mede pior. Registre `vm.swapusage` e `vm.loadavg` no
início e no fim de cada coorte, dentro do artefato de evidência.

Não comparar dois aparelhos, duas versões do sistema ou dois binários. Execute
20 vezes cada coorte em diretórios separados, sem validar o Loop em paralelo:

O orquestrador é versionado desde 2026-08-12 e implementa as três regras que o
laço acima não tinha:

```sh
node scripts/checkpoint-cohort-runner.mjs \
  --root .maestro/artifacts/h3/baseline \
  --flow .maestro/student-checkpoint-performance-baseline.yaml --samples 20

node scripts/checkpoint-cohort-runner.mjs \
  --root .maestro/artifacts/h3/active \
  --flow .maestro/student-checkpoint-active-resume.yaml --samples 20
```

1. **repete a execução que falhar**, porque a corrida do dev menu reincide no
   meio de coorte quente e não só depois de `--clear`;
2. **guarda cada tentativa em caminho próprio** (`<nn>/tentativa-<k>`), porque
   sobrescrever a tentativa perdida apaga a assinatura da falha — foi o que
   impediu, em 2026-08-10, afirmar se era aquela corrida ou outra coisa;
3. **falha fechada** quando uma amostra esgota as tentativas, em vez de entregar
   19: o relatório reprovaria por `insufficient-samples`, que lê como "faltou
   rodar" quando o que houve foi uma amostra que nunca converge.

Ele grava `cohort-manifest.json` na raiz da coorte com o número de retentativas
e com `vm.swapusage`/`vm.loadavg` nas duas pontas — a deriva do host tem o mesmo
sinal do efeito procurado, então sem esse registro ela é indistinguível de
regressão.

Cold start e Home→Lição vêm dos tempos de comando do próprio
`commands.json`; isso mede a ponta a ponta. O app emite envelopes
`RADIANT_CHECKPOINT_PERF` com `schemaVersion`, métrica, modo e milissegundos —
sem ids, conteúdo, PII, PHI ou mídia. São três métricas, e a diferença entre
elas é o que o gate pode concluir:

| métrica | de onde vem | em que modos | entra no veredito |
| --- | --- | --- | --- |
| `persistence` / `restoration` | probe do kernel, dentro do app | só `active` | **sim** |
| `first_frame` | marca de partida, dentro do app | **`off` e `active`** | **sim** |
| `cold_start` / `home_to_lesson` | `commands.json` do Maestro | os dois | `home_to_lesson` sim; **`cold_start` não** |

**Por que `cold_start` saiu do veredito, desde 2026-08-10.** Ele mede a duração do
`launchApp`, que num Dev Client termina no launcher, antes de o bundle JS ser
buscado e avaliado — e o kernel é JavaScript, então não vive na janela medida. Um
gate cuja métrica não observa o objeto sob teste não pode aprovar nem reprovar, e
foi tentando fazê-lo que ele primeiro **reprovou por ruído** e depois **aprovou
vazio**. Continua calculado e reportado, com `advisory: true`, porque a série
histórica vale como contexto e porque uma regressão de lançamento **nativo** só
apareceria ali. Voltar a gateá-lo é tirar o nome de `ADVISORY_GATES`.

**Corrigido em 2026-08-10 pelo aquecimento do módulo.** `warmNativeStorage()` roda no
bootstrap independente do modo, então os dois lados pagam a resolução e o delta voltou
a medir o kernel: `launch_inspection` em `active` caiu para **1,0–1,9 ms** e o delta de
medianas para **−28,7 ms**. Em desenvolvimento isso deixa os dois modos mais lentos
(`first_frame` em `off` subiu de ~232 para ~580 ms), porque a busca é mais lenta que o
resto do bootstrap e passa a dominá-lo; em produção o custo é ~0. O parágrafo abaixo
fica como registro do que a assimetria causava.

**O delta de `first_frame` medido num Dev Client não julgava o kernel — medido em
2026-08-10.** Apenas o lado `active` toca o store na partida, e a primeira operação
de storage resolve o AsyncStorage por `await import()`, que o Metro serve como chunk
buscado por HTTP em dev: 177–622 ms. A leitura em si custa **menos de 2 ms**, e o
`expo export` de produção emite um único bundle sem chunk assíncrono, então o custo
não existe num build embarcado. Consequência prática: **não promova nem reprove esta
onda pelo delta de `first_frame` colhido em Dev Client** até que os dois lados paguem
a mesma resolução — aquecendo-a no bootstrap nos dois modos — ou até medir num build
embarcado. Mesmo binário, mesmo aparelho e mesma coorte não garantem o mesmo caminho
de módulo.

**`launch_inspection` e `storage_module_resolution` são diagnósticos, não gates.** Mede a única etapa do bootstrap que
difere entre os modos, nos dois modos, e existe porque atribuir custo de partida ao
kernel sem medir essa fronteira levou a uma conclusão errada em 2026-08-10. Ela não
é parseada pelo relatório de propósito: serve para ler o log cru quando o delta de
`first_frame` precisar de explicação. Referência medida naquele dia, no Dev Client:
**0,5–0,9 ms em `off`** e **184–357 ms em `active`** — e a diferença é resolução de
módulo (`await import()` do AsyncStorage servido como chunk HTTP pelo Metro), não
trabalho do kernel. Num build sem Dev Client isso pode desaparecer, e essa medição
ainda não foi feita.

**`first_frame` é o que gateia agora.** Mede do início da janela JS até o frame
seguinte a `startupPhase` virar `ready` — que só acontece depois de `inspectLaunch`
do runtime de checkpoints. O kernel está dentro da janela por construção. Limite
declarado: ela **exclui** o lançamento nativo, então regressão puramente nativa
fica invisível para ela; medir isso exigiria módulo nativo e binário novo.

**O canal de coleta não é o terminal do Metro — medido em 2026-08-10.** Neste
Dev Client bridgeless, **nenhuma** saída de `console` do app chega ao terminal
do Metro (as linhas `Require cycle` que parecem do app são do empacotador, em
tempo de build), e o log do sistema do simulador também não a carrega: 12 mil
linhas do processo, zero console JS, porque o runtime novo roteia console para
o canal de depuração. A instrução anterior — "preserve o log do Metro" — colhia
um arquivo vazio, e o parser reportava isso como amostra insuficiente, que lê
como "faltou rodar" em vez de "o canal está quebrado".

Colete pelo inspector (CDP), que é onde o console realmente sai, filtrando pelo
prefixo fechado para o arquivo não carregar nada além dos envelopes. **O coletor
é versionado desde 2026-08-12** — antes disso esta seção descrevia o canal em
prosa e o instrumento era reconstruído a cada sessão, o que fazia a medição
parecer reprodutível sem ser: os artefatos sobrevivem, o instrumento não, e um
coletor sutilmente diferente produz um número que ninguém consegue comparar com o
anterior.

```sh
node scripts/checkpoint-cdp-collector.mjs \
  --output .maestro/artifacts/h3/active/checkpoint-console.log &
```

Ele resolve o alvo em `http://localhost:8081/json/list` **pelo rótulo, não pela
posição** (o alvo depreciado também aceita conexão e devolve silêncio), envia
`Runtime.enable`, grava as linhas de `Runtime.consoleAPICalled` que contenham o
prefixo e **reconecta a cada `killApp`/`launchApp` do flow**, porque o alvo cai
junto com o app.

Ele tem **duas** defesas contra a reentrega do buffer, e elas cobrem coisas
diferentes:

1. **deduplicação por (instante, texto)** — contra a contaminação de 2026-08-10:
   cada `Runtime.enable` reentrega o buffer do alvo, então sem ela a mesma
   amostra é contada uma vez por reconexão. Deduplicar por texto sozinho
   engoliria medida legítima, porque duas amostras da mesma métrica com a mesma
   duração são normais numa coorte de 20;
2. **piso temporal** — contra o que a deduplicação não alcança, porque ela é por
   processo. Medido ao vivo em 2026-08-12: um coletor recém-criado recebeu, no
   `Runtime.enable`, três envelopes **reais** com 110 s de idade, de um
   lançamento que não pertencia à coorte. `timestamp` do
   `Runtime.consoleAPICalled` é epoch em milissegundos, então o coletor descarta
   o que foi emitido antes de ele existir. Não há perda: numa coorte ele sobe
   antes do primeiro `launchApp`.

O coletor **não** filtra por modo, de propósito: o gate `baseline_isolation`
existe para reprovar métrica de checkpoint num log de baseline, e um coletor que
a descartasse calaria o sinal em vez de deixá-lo reprovar.

**Antes de coletar, prove o canal com um controle positivo.** Sem isso, ausência
de amostra é ambígua entre emissor e canal, e a ambiguidade custou o diagnóstico
inteiro de 2026-08-10.

```sh
node scripts/checkpoint-cdp-collector.mjs --control \
  --output .maestro/artifacts/h3/controle.log
```

O modo `--control` injeta a linha pelo próprio canal e a grava no arquivo
indicado; confirme que ela aparece.

**A instrução anterior — "descarte o arquivo de controle" — não protegia, e isso
foi medido em 2026-08-12.** A linha mora no buffer do alvo, não no arquivo: ela
reapareceu no arquivo de um processo criado minutos depois, junto com envelopes
reais de um lançamento anterior. E o controle antigo imitava `first_frame` com
`durationMs: 0`, que é o pior valor possível — entraria na coorte, deprimiria o
p50 do baseline e portanto **inflaria** o piso de ruído, produzindo exatamente o
passe vazio que o gate existe para recusar. O instrumento desenhado para provar
que a medição vale era o que podia invalidá-la sem deixar rastro.

Por isso o controle usa `"metric":"positive-control"`: o coletor o grava, porque
filtra só pelo prefixo, e o parser do relatório o ignora, porque a métrica não
está na lista dele. As duas metades são afirmadas por um teste que atravessa os
dois módulos. O arquivo de controle continua morando fora dos diretórios das
coortes, mas isso agora é higiene, não a defesa.

Gere o relatório falha-fechada:

```sh
npm run checkpoint:performance-report -- \
  --baseline .maestro/artifacts/h3/baseline \
  --active .maestro/artifacts/h3/active \
  --output .maestro/artifacts/h3/report.json
```

**Acessibilidade da retomada — o teste que fecha o item "viewport curto".** O
critério é do usuário: *o CTA é alcançável e acionável*. Não use presença na
árvore de acessibilidade — dentro de um contêiner rolável, ausência ali
significa "abaixo da dobra", não "não renderizado", e essa leitura já produziu
uma conclusão errada em 2026-08-10. Role e toque:

```sh
xcrun simctl ui <UDID> content_size accessibility-extra-extra-extra-large
# flow que chega à retomada, rola até "Retomar estudo", toca e afirma a volta
xcrun simctl ui <UDID> content_size medium
```

Cobrir no mínimo `medium`, `accessibility-extra-large` (AX3) e os dois maiores,
AX4 e AX5 — foi em AX4 que a tela de retomada perdeu os dois botões antes da
correção. Viewport curto continua **sem evidência**, mas **não por falta de
device type** — a alegação anterior desta linha foi medida como falsa em
2026-08-10. `xcrun simctl list runtimes --json` mostra o runtime iOS 26.5
declarando `iPhone SE (3rd generation)` (375 × 667 pt), `iPhone 13 mini` e
`iPhone 12 mini` entre os `supportedDeviceTypes`. **Executado em 2026-08-10, e o simulador curto passou nos quatro tamanhos:**

```sh
xcrun simctl create "Radiant SE 4.7" \
  com.apple.CoreSimulator.SimDeviceType.iPhone-SE-3rd-generation \
  com.apple.CoreSimulator.SimRuntime.iOS-26-5
# o Dev Client pode ser copiado do bundle ja instalado no simulador do gate,
# preservando o mesmo binario nativo:
#   ~/Library/Developer/CoreSimulator/Devices/<UDID do gate>/data/Containers/\
#     Bundle/Application/*/com.ascendcreative.radiant-*.app
xcrun simctl install <UDID novo> "<caminho do .app>"

for TAM in medium accessibility-extra-large \
           accessibility-extra-extra-large accessibility-extra-extra-extra-large; do
  xcrun simctl ui <UDID novo> content_size $TAM
  maestro --device <UDID novo> test .maestro/student-checkpoint-short-viewport.yaml
done
```

`Radiant SE 4.7` (UDID `36CB3EC6-1EE9-4F60-AD4A-328AA2A55E45`) mede
**`[0,0][375,667]`** na árvore, 207 pt mais curta que o `iPhone 17 Pro` das
coortes. `medium`, AX3, AX4 e AX5 passaram.

**Numa viewport curta, a âncora da espera antes de `scrollUntilVisible` tem de
ser o primeiro elemento da tela.** Medido aqui: ancorada no corpo do cartão, a
espera **reprova em AX5** numa tela de 667 pt, porque o corpo já nasce abaixo da
dobra, enquanto o CTA continua alcançável e o produto funciona. Ancore no título.

**Não use `maestro hierarchy` como comando separado para responder se um controle
existe.** Medido em 2026-08-10: em 4 de 5 invocações ele não trouxe o nó do
título que a asserção do próprio Maestro havia completado segundos antes. O
instrumento é a asserção dentro do flow em execução.

O que **não** existe neste host é aparelho **físico** de tela baixa, e um
simulador de 375 × 667 pt não o substitui — sem toque real, densidade real ou
pressão de memória real.

O comando só retorna sucesso com ≥20 amostras por coorte, persistência p95
≤75 ms, restauração p95 ≤100 ms e os dois deltas dentro da fórmula do gate,
que desde 2026-08-10 é
`max(0,05 × baseline_p95, 50 ms, baseline_p95 - baseline_p50)`. O terceiro termo
é o piso de ruído medido: o relatório reporta `noiseFloorMs` e `baselineP50Ms`
em cada gate de delta, para o leitor ver qual termo mandou. Um limiar abaixo da
dispersão da própria medida reprova por ruído — foi o que aconteceu na primeira
execução real, com 167,6 ms permitidos contra ~835 ms de amplitude interna.
Relatório verde ainda não substitui kill/relaunch, duas falhas, VoiceOver,
TalkBack e viewport curto.

**Leia `outcome` antes de `passed` — medido em 2026-08-10, e é a diferença entre
aprovar e não ter medido.** O terceiro termo da fórmula acima elimina a
reprovação por ruído e, num host que degrada, a troca por um **passe vazio**: na
terceira passagem daquele dia o piso de ruído do cold start foi 2863 ms contra um
p95 de baseline de 5748 ms, e o relatório fechou em `"passed": true`. Um limite
que tolera 2,9 s não aprova o produto; ele apenas declara que a medição não tem
resolução. Por isso cada gate e o relatório carregam agora um desfecho de três
valores:

| `outcome` | significado | próxima ação |
| --- | --- | --- |
| `pass` | mediu e está dentro do limite | seguir |
| `fail` | mediu e o candidato excedeu o limite | investigar o **produto** |
| `inconclusive` | não mediu — `insufficient-samples` ou `measurement-too-noisy` | remedir o **instrumento**; não promover nada |

`measurement-too-noisy` dispara quando `noiseFloorMs > maxNoiseFloorMs`, e o teto
é **um quinto do p95 do baseline** — quatro vezes a sensibilidade de 5% que o
desenho original pedia. Acima disso "dentro do limite" tolera um quinto da
métrica inteira e não carrega informação. O teto é checado **antes** da
comparação de delta: sem resolução, nem "dentro" nem "excede" são afirmações
sobre o software. As razões medidas em 2026-08-10 são a calibração: 0,108 na
passagem de host ocioso (conclusiva), 0,246 na que foi descartada por método,
0,498 na do host em swap, e 0,053/0,073 nos deltas de Home→Lição das três.

**Consequência operacional:** `inconclusive` é falha fechada (`passed: false`),
então um gate inconclusivo não promove. O remédio não é reduzir o limite — é
**remedir com o host ocioso**, sem sessão de agente rodando, porque o piso de
ruído é propriedade da máquina naquele momento, não do software sob teste.
Registre `vm.swapusage` e `vm.loadavg` antes de concluir que a passagem serve.

## Sign-off matrix

| Platform | Device/runtime | Build | First-run welcome | Boot-to-home | Critical path | Offline relaunch | Store-capture | Rating prompt | Status | Owner/date |
|---|---|---|---:|---:|---:|---:|---:|---:|---|---|
| iOS | `Radiant iPhone 17 Pro` / iOS 26.5 | local Release under **production configuration** (`APP_ENV=production`, `ENABLE_PUSH=true`), version **1.3.1 (3)** verified in the installed binary | passed (47s) | passed (28s) | passed (312s, reward node not covered) | passed (155s) | passed (402s) | passed (210s, dialog asserted) | **6/6** — measured at `b9c77f4`, 2026-08-03. Detail in [`2026-08-03-e2e-producao-rating-prompt.md`](evidence/2026-08-03-e2e-producao-rating-prompt.md) | engineering / 2026-08-03 |
| Android | `Radiant_Pixel_9_API_36` emulator / API 36, `google_apis` image | local Release APK, same production configuration, version **1.3.1 (3)** verified via `dumpsys package` | passed (73s) | passed (36s) | passed (239s) | passed (247s) | passed (918s) | passed (471s, dialog not asserted — see "Rating prompt") | **6/6** — same evidence document | engineering / 2026-08-03 |

> **⚠️ Superseded on 2026-08-04 — this matrix precedes HEAD again.** The six
> rows were measured at `b9c77f4`. Since then two product fixes landed:
> `b62f529` (system status bar, which touches `_layout.tsx` — the root of every
> screen) and `130d8ea` (locked reward could be collected by deep link). The
> suite is also **7 flows** now, not 6: `reward-locked.yaml` was measured
> separately at `130d8ea`.
>
> Nothing suggests a regression — `npm run quality` passes and every contract
> passes — but this document's own rule holds: a static contract never promotes
> a platform. **Re-run before treating the score as valid for submission.**
>
> This is the third time the gap appears, and the pattern is not carelessness:
> every fix made after a measurement recreates it. The structural answer is to
> measure immediately before submitting and stop treating this matrix as durable
> state.
>
> **Quantified 2026-08-04, because "precedes HEAD" is read as a blocker and this
> one is not.** The gap is a missing *consolidated row*, not missing coverage:
>
> | Since the matrix | Device evidence |
> |---|---|
> | `b62f529` — `_layout.tsx`, 10 lines, the status-bar style | `store-capture` ran green on **both** platforms *after* it, to regenerate the 18 store assets (iOS 448s on the 6.5" bucket). That flow walks home → lesson → quiz → checkpoint → reward screen → progress |
> | `130d8ea` — `RewardScreen.tsx`, 46 lines, the locked-reward guard | `reward-locked` green on both platforms **at that commit** (iOS 82s, Android 81s) |
> | `RewardScreen.flow.test.tsx` | test-only |
>
> Those are the only app files touched since `b9c77f4`, and **the app code at
> HEAD is byte-identical to `130d8ea`** — everything after it is documentation
> (`git diff 130d8ea..HEAD -- src components app.json eas.json package.json` is
> empty). So every post-matrix change has been exercised on a device; what does
> not exist is one score collected at a single commit.
>
> The practical consequence: **do not re-run to close this now.** Re-running
> today recreates the same gap with the next commit — that is exactly how the
> pattern repeated three times. Spend the host window immediately before the
> store submission (F4). TestFlight distribution is not gated by it.

> **Measured 2026-08-03 — the first run under a production-equivalent
> configuration.** The previous rows were taken at
> `da877b2` under the `e2e-test` profile and had fallen 11 commits behind; both
> gaps are closed here. The delta that mattered was two runtime flags —
> `APP_ENV` and `ENABLE_PUSH` — and the proof that they were actually in the
> build is `build_channel=production` on every rating-prompt event read back
> from the devices, not a `strings` grep of a Hermes bundle.

**Four of the five existing Android flows came in 2–7× faster than the
2026-08-03 baseline**, which confirms the host finding of that day rather than
contradicting it: those numbers were measured with the machine in swap.
`store-capture` is the exception — 918s against 557s, while its neighbours fell
— and it is recorded as **unattributed**: it passed with no step retries, and
being the only flow that takes seven screenshots is a correlation, not a
demonstrated cause.

### Added 2026-08-04 — `reward-locked.yaml`

| Platform | Result |
| --- | ---: |
| iOS (`Radiant iPhone 17 Pro`) | passed (82s) |
| Android (`Radiant_Pixel_9_API_36`) | passed (81s) |

Measured on local Release builds of 1.3.1 under production configuration, after
the fix in this same date. **Writing this flow found a real defect first**: the
screen showed a locked reward as "Pronta para ser coletada" at 0 of 14
milestones, and its collect button wrote `markNodeCompleted` — reachable by a
deep link, from outside the app. Had the flow been written before the fix, the
contract would now be defending that defect.

Two selector traps measured here, both worth carrying: `scrollUntilVisible` is
unusable on this screen (every node exposes `accessibilityText` with an empty
`text`, and `scrollUntilVisible` matches `element.text` only — use a
`repeat ... while: notVisible` guard instead), and scrolling to the action card
**before** asserting absence is what makes the absence mean anything.

Android times are 4–20× the iOS ones on this host. That ratio is a property of
the machine, not of the app — see the host note below before reading a timeout
as a defect.

No EAS workflow or cloud execution is enabled by this change. Add it only after
both local rows are recorded as `passed` in dated evidence and its cost/privacy
review is approved.

~~**Open item:** `store-capture.yaml` needs its first quiz's `runFlow when
notVisible` guard reviewed.~~ **Closed on 2026-08-03 (`da877b2`).** The guard
was replaced by the same fixed `- scroll` that commit `f7b602a` had already put
in the second quiz of the same file — scrolling past the end is a no-op, so a
fixed scroll serves both the screen that cannot scroll and the screen that
occludes, while the guard only ever served one. Measured green on both platforms
(iOS 416s, Android 557s).

The guard was **not** an oversight, and that matters for whoever reads this
next: it existed because at 1080×1920 the option is already visible and the list
no longer scrolls, where `scrollUntilVisible` with `centerElement` fails to
centre. Copying the sibling flow's pattern would have reintroduced that. Read
the comment above a guard before removing it — it may exist for a case the
sibling does not have.

`scripts/maestro-contract.test.mjs` now requires every `scrollUntilVisible` to be
a top-level step, never nested under a conditional. This pattern had already bitten
twice, on different platforms, and came back once after being fixed in one place.

### Added 2026-08-04 — `reward-unlock.yaml`, written but **not yet measured**

| Platform | Result |
| --- | ---: |
| iOS | **not run** — no device evidence exists |
| Android | **not run** — no device evidence exists |

This is a deliberate, recorded gap, not an omission. The flow is written and the
contract governs it; what does not exist yet is a device run, and by this
document's own rule nothing but a device run promotes a platform. It closes the
half that `reward-locked.yaml` explicitly left open on 2026-08-04, so B5 stays
open until both rows above are filled in dated evidence.

**Expected cost, so the host window can be budgeted:** 7 lessons and 6
checkpoints is ~3.2× `learning-critical-path`, which measured 312s on iOS and
239s on Android — so roughly 16 and 13 minutes respectively, plus build and
install. Read the host budget note below before running Android.

**What the contract already proves without a device**, because a contract that
never goes red is the failure this project has paid for three times — every one
of these was mutation-tested on 2026-08-04, and each mutation was confirmed to
turn the contract red:

- removing a lesson or a checkpoint from the path;
- miscounting the milestone total (it is derived as `2 × lessonCount` from the
  catalog: 7 lessons + 6 checkpoints + the reward);
- reaching the reward screen without the home CTA that only the satisfied rule
  produces — the label appears **twice**, as the home CTA and as the collect
  button, so the contract counts occurrences instead of asserting presence;
- deep-linking the reward;
- answering the generated lessons out of catalog order;
- leaving a `?` unescaped in an assertion. Maestro selectors are full-match
  regexes: unescaped, `a?` makes the preceding letter optional and the literal
  `?` has nothing to match, so the assertion silently starts describing a screen
  that does not exist. On a positive assertion that goes red on a device; on a
  negative one it passes forever.

**A finding this raised, outside the flow's own scope — CLOSED on 2026-08-07:**
the same unescaped-`?` problem was present in `reward-locked.yaml`, whose
`assertNotVisible: Pronto para coletar essa conquista?` could never match the
string the screen renders — so that half of its defect guard could not fail. Its
sibling assertion, `assertNotVisible: Receber conquista`, is exact and did
work, so the guard was weakened rather than absent. The contract at
`scripts/maestro-contract.test.mjs` **required** that unescaped form, so the
contract was enforcing the bug: escaping the flow made the contract go red.

What closed it, and why in that shape:

- the flow now asserts `'Pronto para coletar essa conquista\?'`, and every
  other unescaped `?` in every flow was escaped in the same pass — including
  the `runFlow when: visible: 'Abrir com “Radiant”\?'` guards, which failed the
  other way (the deep-link dialog was never tapped, and the next assertion took
  the blame);
- the contract stopped freezing the literal line. It now derives both forbidden
  strings from `RewardScreen.tsx` and asserts the **property**: this element
  carries a negative assertion, and that assertion escapes its `?`. A contract
  that only accepts today's text does not survive tomorrow's correction — this
  one does;
- the `?` scan was widened from one key in one flow (`assertVisible` in
  `reward-unlock.yaml`) to the four selector keys — `assertVisible`,
  `assertNotVisible`, `visible`, `notVisible` — across every flow in the
  directory, discovered by listing rather than by an explicit list, so a new
  flow is born covered. `tapOn` stays out on purpose: two flows use a
  deliberate regex there (`^Progresso(, tab.*)?$`).

Both new assertions were mutation-tested on 2026-08-07: unescaping the `?` in
`reward-locked.yaml` turns the scan red, and the property assertion turns red
with it.

## Rating prompt — what a green run here can and cannot claim

Added 2026-08-03, with the flow. Read this before recording a row for
`rating-prompt.yaml`.

The prompt's own gate was never the only thing blocking it. `app_open` had a
single emission site, in the legacy `HomeScreen`, which `(tabs)/index.tsx`
renders only when `ENABLE_LEARNING_ROAD` is false — and no profile declares
that. **The event was never emitted in any build**, so `countEvents('app_open')`
was permanently 0 and no number of relaunches could have made the prompt
eligible. Fixed the same day by moving the app-open lifecycle into
`useAppOpenLifecycle`, consumed by both homes. A flow written before that fix
would have gone red for a reason in the app, not in the flow.

Two bounds on what the flow proves:

1. **The dialog is only observable on iOS here — and the reason is not the one
   you would guess.** Measured on 2026-08-03 on the `google_apis` emulator:
   `StoreReview.isAvailableAsync()` returns **true**, the gate opens exactly as
   it does on iOS (`rating_prompt_eligible`), and the failure comes one step
   later, from Play's `ReviewManager`, recorded as
   `deferred: "Android ReviewManager task was not successful"`. The prediction
   written before that run — that Android would stop at
   `store_review_unavailable` for lack of a Play Store — was wrong in mechanism,
   and the device corrected it. The app's own path is identical on both
   platforms; only the store service differs. Android proof needs an install
   from a closed track (task C4), not a different emulator image. The contract
   enforces that every `platform:` guard in this flow is `iOS`, so the Android
   row can never go red for a store-service limit.
2. **The iOS assertion is anchored to a hierarchy read, done 2026-08-03.** The
   dialog is a system surface: `SKStoreReviewController` exposes no `text`
   attribute, only `accessibilityText` — `assertVisible` matches that. The node
   read on the simulator is `Curtindo o app Radiant?`, and the flow escapes the
   `?` because Maestro's selector is a full-match regex: unescaped, `t?` makes
   the "t" optional and the literal `?` has nothing to match. Do not anchor on
   the subtitle — it contains a non-breaking space in "App Store".

**The first version of this flow was green and measured nothing.** It completed
the *lesson* (`/learn`) instead of the *quiz* (`/quiz`), and
`maybePromptForReview` is called only by `QuizScreen`, `ReviewScreen` and
`RewardScreen` — never by the lesson-flow. The flow passed, and the device's own
telemetry had not a single `rating_prompt_*` event. What caught it was reading
AsyncStorage out of the simulator container, not the flow's exit code. The
contract now pins the `/quiz` deep link and derives the three correct answers
from `src/data/lessons.ts`, because a failing score makes `QuizScreen` return
before it ever calls the prompt — the red would have read as a gate failure.

**Reading the device's telemetry is the strongest evidence this suite produces.**
`RatingPromptService` records its own decision, with the reason. Pull
`RCTAsyncLocalStorage_V1` from the container
(`xcrun simctl get_app_container <UDID> com.ascendcreative.radiant data`) and
read `telemetry.events.v1`. The 2026-08-03 run recorded, in order:
`first_value_moment_reached` → `rating_prompt_blocked (insufficient_sessions)` →
`rating_prompt_eligible` → `rating_prompt_shown`, every event carrying
`build_channel=production`.

That `build_channel` is also **the only reliable proof that the build ran under
production configuration.** The bundle is Hermes, so its string table cannot
tell you which literal was inlined for `EXPO_PUBLIC_APP_ENV`; `buildProps`
writes `AppConfig.APP_ENV` into every prompt event, so the device tells you
what a `strings` grep cannot.

## Host budget — read this before attributing an Android timeout

Measured on 2026-08-03: with **only** the Android emulator running — no build,
no iOS simulator — this 16 GB host sits at ~130 MB free RAM and **3.6 GB of its
4 GB swap** in use. The older rule ("run one platform at a time") is necessary
but not sufficient. Android needs an exclusive window here:

1. no concurrent Gradle build, and run `./gradlew --stop` after building — the
   daemon outlives the build and keeps holding memory;
2. no iOS simulator booted (`xcrun simctl shutdown all`);
3. **no test or validation suite either** — this rule was missing until
   2026-08-06 and the omission cost a run. `loop validate` fires jest, lint and
   typecheck; three of those during a `reward-unlock` execution took it from
   **1.07 min/step** (idle host, 103 steps in 110 minutes) to **2.47 min/step**
   (34 steps in 84 minutes), a **2.3× slowdown**, and the flow died on a
   `scrollUntilVisible` timeout at a step that had passed in the idle run under
   a *stricter* visibility bar. The earlier wording banned Gradle and the iOS
   simulator by name, which reads as an exhaustive list; it is not. Anything
   that competes for the 16 GB counts, documentation runs included;
4. compare each flow's wall time against this document's baseline **before**
   attributing a failure to the app. On 2026-08-03 a `boot-to-home` that
   normally takes 73s took 640s, and three flows failed on timeouts that
   vanished once memory was freed. A flow that takes 54 minutes is telling you
   about the machine, not about a selector. This rule worked on 2026-08-06: the
   per-step comparison is what separated "the app broke" from "I loaded the
   machine", and it took one division to do it.

Also, the emulator is normally started with `-no-snapshot-save`, so it reverts
to the last saved snapshot on boot — including the previously installed APK.
**Reinstall and re-check the version before measuring.** On 2026-08-03 the
emulator came back up with 1.3.0 while the run under test was 1.3.1; only an
explicit `dumpsys package` check caught it.
