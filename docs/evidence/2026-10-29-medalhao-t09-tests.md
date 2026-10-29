# T09 Perfil — evidência executada de testes

29/10/2026, BASE_TASK `a72ddf246a85ecc5cc951ef340cd75632ab4d1dc`.
Cwd `radiant-app`, Node20.20.2, EXPO_NO_DOTENV=1. O controlador conferiu
os hashes dos logs e dos14 arquivos congelados; não repetiu suítes sem hipótese.
Snapshot R1 inclui seis arquivos novos e diff integral dos14 contra a base.
Jest não comprova rasterização, fala audível nem armazenamento real ocultado pelo produtor.

## Comandos e resultados

- Cinco arquivos focais do integrador T09, com `npx --no-install jest --runInBand --no-cache`:5 suítes/60 testes PASS.
- Mesmo comando sob `/usr/sbin/taskpolicy -b env`:5 suítes/60 testes PASS.
- `npx --no-install jest --runInBand --no-cache src/features/missions src/features/progress src/features/journey/services/JourneyStarsService.test.ts`:12 suítes/163 testes PASS. O filtro progress inclui progress-sync; não chamar este conjunto de apenas duas suítes.
- `node --test scripts/maestro-contract.test.mjs scripts/copy-style-contract.test.mjs`:105 PASS.
- `npx --no-install tsc --noEmit`, `npx --no-install eslint --max-warnings=0 src/features/profile scripts/maestro-contract.test.mjs` e diff-check: exit0.

## Vermelho e limites de causalidade

red-existing:14 falhas e1 controle passou, antes de trocar Perfil/cabeçalho.
red-components:29 falhas e8 negativas passaram contra skeletons nulos;
as negativas receberam injeções específicas. Nenhuma falha de import ausente
foi usada como substituto de comportamento. Header ampliado e estrelas em
loading tiveram vermelhos adicionais antes de seus ajustes.

Duas injeções parciais de data não reproduziram o defeito; a primeira injeção
de duplo envio caiu em TypeError do harness. Estas três tentativas foram
DESCARTADAS como prova causal, com os logs preservados localmente. Duplo envio
foi refeito com dois fireEvent reais e falhou por esperado1/recebido2. A regra
inteira de validação de datas foi desfeita para os defeitos correspondentes.
Um primeiro CPU59/60 também caiu no harness e foi substituído por60/60 após
correção real. Spy da cópia namespaceRN foi corrigido; o vermelho inicial não
comprova escala. Não afirmar que toda injeção tentada foi útil.

Baseline de copy medida pelo AST: eyebrow do cabeçalho reduzido2→1, pois a
inicial do avatar ainda é contada. Nenhum teto original foi ampliado; contrato
105/105 após a correção. O diagnóstico interno que APIs engolem continua
indisponível; rejeições mockadas não provam leitura real do AsyncStorage.

## red-existing.log

SHA-256 `0a02767d31e4700217a2fcabfd47c0f3b38136ccd576b3ffe6d70e207532f29a`.

```text
  ● Console

    console.error
      [MissionsScreen] Failed to load mission data: Error: read failed
          at /Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/src/features/profile/screens/ProfileScreen.flow.test.tsx:95:42
          at Generator.next (<anonymous>)
          at asyncGeneratorStep (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
          at _next (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
          at /Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
          at new Promise (<anonymous>)
          at /Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
          at apply (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/src/features/profile/screens/ProfileScreen.flow.test.tsx:106:2)
          at Object.<anonymous> (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-each/build/bind.js:81:13)
          at Promise.then.completed (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/utils.js:298:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/utils.js:231:10)
          at _callCircusTest (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/run.js:316:40)
          at _runTest (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/run.js:252:3)
          at _runTestsForDescribeBlock (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/run.js:126:9)
          at run (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/run.js:71:3)
          at runAndTransformResultsToJestFormat (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
          at jestAdapter (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
          at runTestInternal (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-runner/build/runTest.js:367:16)
      at Object.toBeNull (src/features/profile/components/ProfileIdentityHeader.test.tsx:11:43)

Test Suites: 2 failed, 2 total
Tests:       14 failed, 1 passed, 15 total
Snapshots:   0 total
Time:        10.499 s
Ran all test suites matching /src\/features\/profile\/screens\/ProfileScreen.flow.test.tsx|src\/features\/profile\/components\/ProfileIdentityHeader.test.tsx/i.
```

## red-components.log

SHA-256 `be8862db0c040fe4db51092c7f6a48ef24bf3f76fef12ccd9296c4c7f4edb617`.

```text
  ● contador1 sem data não fabrica atividade nem falta

    Unable to find an element with text: Sequência registrada: 1

      11 | it.each([1, 9, 99])('contador%s sem data não fabrica atividade nem falta', count => {
      12 |   show(null, count);
    > 13 |   expect(screen.getByText(`Sequência registrada: ${count}`)).toBeTruthy();
         |                 ^
      14 |   expect(screen.getByLabelText(`Contador de sequência: ${count}`)).toBeTruthy();
      15 |   expect(screen.queryAllByLabelText(/atividade registrada/u)).toHaveLength(0);
      16 |   expect(screen.getAllByLabelText(/sem registro disponível/u)).toHaveLength(4);

      at getByText (src/features/profile/components/StreakWeek.test.tsx:13:17)

  ● contador9 sem data não fabrica atividade nem falta

    Unable to find an element with text: Sequência registrada: 9

      11 | it.each([1, 9, 99])('contador%s sem data não fabrica atividade nem falta', count => {
      12 |   show(null, count);
    > 13 |   expect(screen.getByText(`Sequência registrada: ${count}`)).toBeTruthy();
         |                 ^
      14 |   expect(screen.getByLabelText(`Contador de sequência: ${count}`)).toBeTruthy();
      at Object.getByText (src/features/profile/components/MedalShelf.test.tsx:54:17)

Test Suites: 3 failed, 3 total
Tests:       29 failed, 8 passed, 37 total
Snapshots:   0 total
Time:        6.825 s
Ran all test suites matching /src\/features\/profile\/components\/StreakWeek.test.tsx|src\/features\/profile\/components\/MedalShelf.test.tsx|src\/features\/profile\/components\/TodayGoals.test.tsx/i.
```

## red-header-scale.log

SHA-256 `b72f35afbfc7087f0e7979f510d08ebea70bb06a2fab5d8939f7551d223d2aa4`.

```text
  ● texto máximo põe a identidade inteira abaixo do avatar e da engrenagem, sem cortar nome

    Unable to find an element with testID: profile-identity-text

    [36m<View>[39m
      [36m<View>[39m
        [36m<View[39m
          [33maccessibilityElementsHidden[39m=[32m{true}[39m
          [33mimportantForAccessibility[39m=[32m"no-hide-descendants"[39m
        [36m>[39m
          [36m<Text>[39m
            [0mE[0m
          [36m</Text>[39m
        [36m</View>[39m
        [36m<View>[39m
          [36m<Text[39m
            [33maccessibilityRole[39m=[32m"header"[39m
          [36m>[39m
            [0mEstudante[0m
          [36m</Text>[39m
          [36m<Text>[39m
            [0mEstudo local, sem conta[0m
          [36m</Text>[39m
      at Object.getByTestId (src/features/profile/components/ProfileIdentityHeader.test.tsx:27:43)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 2 skipped, 3 total
Snapshots:   0 total
Time:        2.284 s
Ran all test suites matching /src\/features\/profile\/components\/ProfileIdentityHeader.test.tsx/i with tests matching "texto máximo".
```

## red-stars-loading.log

SHA-256 `52a106210bb9a57a6ec337ac9ac5f01d2d9fc8abeadb1825b0d5b0b824fdf53b`.

```text
  ● estrelas ainda carregando não são anunciadas como falha nem como zero

    Unable to find an element with text: Carregando estrelas…

    [36m<View>[39m
      [36m<View[39m
        [33mpointerEvents[39m=[32m"none"[39m
      [36m/>[39m
      [36m<RNCSafeAreaView>[39m
        [36m<RCTScrollView>[39m
          [36m<View>[39m
            [36m<View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessibilityElementsHidden[39m=[32m{true}[39m
                  [33mimportantForAccessibility[39m=[32m"no-hide-descendants"[39m
                [36m>[39m
                  [36m<Text>[39m
                    [0mE[0m
                  [36m</Text>[39m
                [36m</View>[39m
                [36m<View />[39m
                [36m<View[39m
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 19 skipped, 20 total
Snapshots:   0 total
Time:        8.004 s
Ran all test suites matching /src\/features\/profile\/screens\/ProfileScreen.flow.test.tsx/i with tests matching "estrelas ainda carregando".
```

## focal-final.log

SHA-256 `09a9b74f83ca5516662ea745523b4e46842c1d011520dfa964f12d464668d13b`.

```text
      at Object.<anonymous> (src/features/profile/components/MedalShelf.test.tsx:21:9)

PASS src/features/profile/components/ProfileIdentityHeader.test.tsx

Test Suites: 5 passed, 5 total
Tests:       60 passed, 60 total
Snapshots:   0 total
Time:        8.165 s
Ran all test suites matching /src\/features\/profile\/screens\/ProfileScreen.flow.test.tsx|src\/features\/profile\/components\/ProfileIdentityHeader.test.tsx|src\/features\/profile\/components\/MedalShelf.test.tsx|src\/features\/profile\/components\/StreakWeek.test.tsx|src\/features\/profile\/components\/TodayGoals.test.tsx/i.
```

## focal-cpu-final.log

SHA-256 `c82dae3b6645e06a4aa303bf3ab2a58416f8cbd74b26d5dc1efdbfc4ab8a0f18`.

```text
      at Object.<anonymous> (src/features/profile/components/MedalShelf.test.tsx:21:9)

PASS src/features/profile/components/ProfileIdentityHeader.test.tsx

Test Suites: 5 passed, 5 total
Tests:       60 passed, 60 total
Snapshots:   0 total
Time:        39.716 s
Ran all test suites matching /src\/features\/profile\/screens\/ProfileScreen.flow.test.tsx|src\/features\/profile\/components\/ProfileIdentityHeader.test.tsx|src\/features\/profile\/components\/MedalShelf.test.tsx|src\/features\/profile\/components\/StreakWeek.test.tsx|src\/features\/profile\/components\/TodayGoals.test.tsx/i.
```

## consumers-final.log

SHA-256 `f6384018eb62bade71b91868e6266579f9f524b5684f157778bd0c3d5c44b917`.

```text
PASS src/features/journey/services/JourneyStarsService.test.ts
PASS src/features/progress/components/LegalLinksCard.test.tsx
PASS src/features/progress/services/LearningStatsService.test.ts

Test Suites: 12 passed, 12 total
Tests:       163 passed, 163 total
Snapshots:   0 total
Time:        9.553 s
Ran all test suites matching /src\/features\/missions|src\/features\/progress|src\/features\/journey\/services\/JourneyStarsService.test.ts/i.
```

## contracts-final-r2.log

SHA-256 `6fdfe40b37ceae7f9f2bc0eb4483e8ceaa644ae70ccc117448a454ed2a539184`.

```text
1..105
# tests 105
# suites 0
# pass 105
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 785.081167
```

## 22 injeções com falha causal

Cada log abaixo foi preservado; bytes restaurados emfinally e âncora única
conferida. A tabela enumera as22 aceitas, não as3 tentativas descartadas.

| Caso | Teste/padrão | Hash do log |
|---|---|---|
| default-count-fills-week | contador1 sem data | `8e995e05abfe7d9715379e44ac510b16ffa759cf31d29487be2fab17087c1714` |
| counter-retrofill | última data válida | `d6417ac1a2bf1443ba9a9fdab19ba400638c38a37627c88b888bd2555b6c7d0c` |
| unknown-becomes-absence | contador1 sem data | `c714297bc34ae13359e0cb0bdbe67d1674f08bd970ec08f9bfb9c38ee0cb170f` |
| wrong-week-start | virada de ano | `ff9c085c54dddfc97a83b583913ee800acb2087bdb1694af7ead73c7b6af1ab1` |
| calendar-parsed-utc | última data válida | `9cd9db12346fd967f4d4558b3bd90bd2ca9771bb1d30bea5833a1aa6d8cfdd26` |
| future-marked-active | data2026-10-30 | `710ce27307bc2650f1ba8b70289d49cbb429b158fa93b8d9b4eacc837a02efeb` |
| counter-invalid-published | contador inválido | `5b3c096f46f3cf2a4cc0e1e0acf68af616f85d73df01bfff048ad35156c7dc87` |
| completed-promoted-available | ouro só | `752b32b758df13c801f48e1f49b0ebc82628e18f80d95eea01d7bdd0b9ccbfc5` |
| missing-stars-become-zero | zero real | `19647c5237297744672d4d3fe30e9370171b99f24731e720dbfe781db972fa75` |
| zero-xp-alias-dropped | preserva zero | `6583029c65898d8c929c8d0c2ff54c604f38a11de48bd649c4aa0f2d02d15a51` |
| invalid-goal-published | snapshot inválido | `455e1b6b7b542d5f620a5308e0c747cddbe2214faf825cc2c2745cbc40c84ae5` |
| pending-called-completed | preserva zero | `5546b84ec8e2a14a5781bc208530c8cac975f6489e55cbc5172a3fd66981be65` |
| stale-save-published | blur mantém | `0ea42c307b6fa565ba486452782c3ddad1df7a685701bcf7e41b3fb6ff442df7` |
| stale-read-published | leitura velha | `a3d70368828fe7b78c42af719d225c3041ee0a8b6e91e5d0723b49f71f50a9b5` |
| invalid-xp-published | XP total inválido | `d4136855e69462c538c84e7c59d992a9676ea4274c74be752aecff4c074dc6d3` |
| invalid-date-normalization-whole-rule | dia impossível | `8f61d77e46e8b318853ed87d65babd5af278ed4c53e8b790f392dc8f793ea66d` |
| untrusted-date-falls-back-today | data.*não comprova | `34611ec9e3f37dae958114464e485b639e175575e0b233107545baa9f6a0890e` |
| max-week-single-row | escala máxima | `01b16add0bb2ca773aea030928de416ce7a98bfbf87a43718101d2737721037e` |
| max-header-squeezed | texto máximo | `a460ce71736fb3577d82ff0a2a8c9dbca367a143c1b9651eb2e2ba4f96675559` |
| save-duplicate-unlocked-r2 | impede envio duplo | `606723288fe5b28cf8e4ad22c72b2a1cd9d4e83d7311d69c00bb4e69ccdfe60d` |
| learning-critical-path.yaml |  | `ed22727ebc7a2b5f302dd036e8e3018447c8144b46212aaffd8b8462538dca2b` |
| store-capture.yaml |  | `f16581bbb76d57282f0059a74739f7322440f418607af0e740d2d59d1370c4a5` |

### Saídas causais preservadas

#### default-count-fills-week

```text
  ● contador1 sem data não fabrica atividade nem falta

    expect(received).toHaveLength(expected)

    Expected length: 0
    Received length: 4
    Received array:  [{"_fiber": [FiberNode]}, {"_fiber": [FiberNode]}, {"_fiber": [FiberNode]}, {"_fiber": [FiberNode]}]

      14 |   expect(screen.getByText(`Sequência registrada: ${count}`)).toBeTruthy();
      15 |   expect(screen.getByLabelText(`Contador de sequência: ${count}`)).toBeTruthy();
    > 16 |   expect(screen.queryAllByLabelText(/atividade registrada/u)).toHaveLength(0);
         |                                                               ^
      17 |   expect(screen.getAllByLabelText(/sem registro disponível/u)).toHaveLength(4);
      18 |   expect(screen.getAllByLabelText(/dia futuro/u)).toHaveLength(3);
      19 |   expect(screen.getByLabelText('Quinta-feira, 2026-10-29, hoje: sem registro disponível')).toBeTruthy();

      at toHaveLength (src/features/profile/components/StreakWeek.test.tsx:16:63)

```

#### counter-retrofill

```text
  ● última data válida marca um único dia, sem retropreencher pelo contador

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 4
    Received array:  [{"_fiber": [FiberNode]}, {"_fiber": [FiberNode]}, {"_fiber": [FiberNode]}, {"_fiber": [FiberNode]}]

      23 | it('última data válida marca um único dia, sem retropreencher pelo contador', () => {
      24 |   show('2026-10-28', 9);
    > 25 |   expect(screen.getAllByLabelText(/atividade registrada/u)).toHaveLength(1);
         |                                                             ^
      26 |   expect(screen.getByLabelText('Quarta-feira, 2026-10-28: atividade registrada')).toBeTruthy();
      27 | });
      28 | it('hoje com anel só marca atividade quando lastActiveDate também é hoje', () => {

      at Object.toHaveLength (src/features/profile/components/StreakWeek.test.tsx:25:61)

```

#### unknown-becomes-absence

```text
  ● contador1 sem data não fabrica atividade nem falta

    Unable to find an element with accessibility label: /sem registro dispon\xEDvel/

    [36m<View>[39m
      [36m<Text[39m
        [33maccessibilityLabel[39m=[32m"Contador de sequência: 1"[39m
        [33maccessibilityRole[39m=[32m"header"[39m
      [36m>[39m
        [0mSequência registrada: 1[0m
      [36m</Text>[39m
      [36m<View>[39m
        [36m<View[39m
          [33mtestID[39m=[32m"week-row-0"[39m
        [36m>[39m
          [36m<View[39m
            [33maccessibilityLabel[39m=[32m"Segunda-feira, 2026-10-26: não estudou"[39m
            [33maccessibilityRole[39m=[32m"text"[39m
```

#### wrong-week-start

```text
  ● segunda e domingo locais continuam na semana mesmo na virada de ano

    Unable to find an element with accessibility label: Segunda-feira, 2025-12-29: atividade registrada

    [36m<View>[39m
      [36m<Text[39m
        [33maccessibilityLabel[39m=[32m"Contador de sequência: 8"[39m
        [33maccessibilityRole[39m=[32m"header"[39m
      [36m>[39m
        [0mSequência registrada: 8[0m
      [36m</Text>[39m
      [36m<View>[39m
        [36m<View[39m
          [33mtestID[39m=[32m"week-row-0"[39m
        [36m>[39m
          [36m<View[39m
            [33maccessibilityLabel[39m=[32m"Segunda-feira, 2026-01-04, hoje: sem registro disponível"[39m
            [33maccessibilityRole[39m=[32m"text"[39m
```

#### calendar-parsed-utc

```text
  ● última data válida marca um único dia, sem retropreencher pelo contador

    Unable to find an element with accessibility label: Quarta-feira, 2026-10-28: atividade registrada

    [36m<View>[39m
      [36m<Text[39m
        [33maccessibilityLabel[39m=[32m"Contador de sequência: 9"[39m
        [33maccessibilityRole[39m=[32m"header"[39m
      [36m>[39m
        [0mSequência registrada: 9[0m
      [36m</Text>[39m
      [36m<View>[39m
        [36m<View[39m
          [33mtestID[39m=[32m"week-row-0"[39m
        [36m>[39m
          [36m<View[39m
            [33maccessibilityLabel[39m=[32m"Segunda-feira, 2026-10-26: sem registro disponível"[39m
            [33maccessibilityRole[39m=[32m"text"[39m
```

#### future-marked-active

```text
  ● data2026-10-30 não comprova dia desta semana

    expect(received).toHaveLength(expected)

    Expected length: 0
    Received length: 1
    Received array:  [{"_fiber": [FiberNode]}]

      34 | it.each(['2026-10-30', '2026-10-25', '2026-02-30', '2026-13-01', '2026-10-28T12:00:00Z', 'bad', '2026-1-28'])('data%s não comprova dia desta semana', date => {
      35 |   show(date, 5);
    > 36 |   expect(screen.queryAllByLabelText(/atividade registrada/u)).toHaveLength(0);
         |                                                               ^
      37 | });
      38 | it('valida dia impossível que cairia nesta semana se o Date o normalizasse', () => {
      39 |   show('2026-02-30', 5, new Date(2026, 2, 2, 12));

      at toHaveLength (src/features/profile/components/StreakWeek.test.tsx:36:63)

```

#### counter-invalid-published

```text
  ● contador inválidoNaN fica indisponível, não zero

    Unable to find an element with text: Sequência indisponível

    [36m<View>[39m
      [36m<Text[39m
        [33maccessibilityLabel[39m=[32m"Contador de sequência: NaN"[39m
        [33maccessibilityRole[39m=[32m"header"[39m
      [36m>[39m
        [0mSequência registrada: NaN[0m
      [36m</Text>[39m
      [36m<View>[39m
        [36m<View[39m
          [33mtestID[39m=[32m"week-row-0"[39m
        [36m>[39m
          [36m<View[39m
            [33maccessibilityLabel[39m=[32m"Segunda-feira, 2026-10-26: sem registro disponível"[39m
            [33maccessibilityRole[39m=[32m"text"[39m
```

#### completed-promoted-available

```text
  ● ouro só para conclusão real; available e resumable ficam silhuetas não interativas

    Unable to find an element with accessibility label: Disponível. Ainda não conquistada.

    [36m<View>[39m
      [36m<Text[39m
        [33maccessibilityRole[39m=[32m"header"[39m
      [36m>[39m
        [0mMedalhas[0m
      [36m</Text>[39m
      [36m<View>[39m
        [36m<View[39m
          [33maccessibilityLabel[39m=[32m"Concluída. Concluída. 3 estrelas."[39m
          [33maccessibilityRole[39m=[32m"image"[39m
          [33maccessibilityValue[39m=[32m{
            {
              "text": "3 estrelas",
            }
```

#### missing-stars-become-zero

```text
  ● zero real não é undefined e estrelas de aula não concluída não viram conquista

    Unable to find an element with accessibility label: Disponível. Concluída.

    [36m<View>[39m
      [36m<Text[39m
        [33maccessibilityRole[39m=[32m"header"[39m
      [36m>[39m
        [0mMedalhas[0m
      [36m</Text>[39m
      [36m<View>[39m
        [36m<View[39m
          [33maccessibilityLabel[39m=[32m"Concluída. Concluída. 0 estrelas."[39m
          [33maccessibilityRole[39m=[32m"image"[39m
          [33maccessibilityValue[39m=[32m{
            {
              "text": "0 estrelas",
            }
```

#### zero-xp-alias-dropped

```text
  ● preserva zero do alias XP e não usa contador legado quando o alias está presente

    Unable to find an element with text: 0 de 35

    [36m<View>[39m
      [36m<Text[39m
        [33maccessibilityRole[39m=[32m"header"[39m
      [36m>[39m
        [0mHoje[0m
      [36m</Text>[39m
      [36m<View>[39m
        [36m<View[39m
          [33maccessibilityLabel[39m=[32m"Ganhe 35 XP. 7 de 35"[39m
          [33maccessibilityRole[39m=[32m"text"[39m
          [33maccessible[39m=[32m{true}[39m
        [36m>[39m
          [36m<View>[39m
            [36m<Text>[39m
```

#### invalid-goal-published

```text
  ● snapshot inválido{ goalXp: 0 } não inventa meta/barra

    Unable to find an element with text: Meta diária indisponível

    [36m<View>[39m
      [36m<Text[39m
        [33maccessibilityRole[39m=[32m"header"[39m
      [36m>[39m
        [0mHoje[0m
      [36m</Text>[39m
      [36m<View>[39m
        [36m<View[39m
          [33maccessibilityLabel[39m=[32m"Ganhe 0 XP. 0 de 0"[39m
          [33maccessibilityRole[39m=[32m"text"[39m
          [33maccessible[39m=[32m{true}[39m
        [36m>[39m
          [36m<View>[39m
            [36m<Text>[39m
```

#### pending-called-completed

```text
  ● preserva zero do alias XP e não usa contador legado quando o alias está presente

    Unable to find an element with text: Revisões pendentes: 5

    [36m<View>[39m
      [36m<Text[39m
        [33maccessibilityRole[39m=[32m"header"[39m
      [36m>[39m
        [0mHoje[0m
      [36m</Text>[39m
      [36m<View>[39m
        [36m<View[39m
          [33maccessibilityLabel[39m=[32m"Ganhe 35 XP. 0 de 35"[39m
          [33maccessibilityRole[39m=[32m"text"[39m
          [33maccessible[39m=[32m{true}[39m
        [36m>[39m
          [36m<View>[39m
            [36m<Text>[39m
```

#### stale-save-published

```text
  ● blur mantém a UI anterior quando salvar acaba e novo foco relê a meta real

    Unable to find an element with text: 0 de 10

    [36m<View>[39m
      [36m<View[39m
        [33mpointerEvents[39m=[32m"none"[39m
      [36m/>[39m
      [36m<RNCSafeAreaView>[39m
        [36m<RCTScrollView>[39m
          [36m<View>[39m
            [36m<View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessibilityElementsHidden[39m=[32m{true}[39m
                  [33mimportantForAccessibility[39m=[32m"no-hide-descendants"[39m
                [36m>[39m
                  [36m<Text>[39m
```

#### stale-read-published

```text
  ● leitura velha não substitui o snapshot do novo foco

    Unable to find an element with text: 100 XP no total

    [36m<View>[39m
      [36m<View[39m
        [33mpointerEvents[39m=[32m"none"[39m
      [36m/>[39m
      [36m<RNCSafeAreaView>[39m
        [36m<RCTScrollView>[39m
          [36m<View>[39m
            [36m<View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessibilityElementsHidden[39m=[32m{true}[39m
                  [33mimportantForAccessibility[39m=[32m"no-hide-descendants"[39m
                [36m>[39m
                  [36m<Text>[39m
```

#### invalid-xp-published

```text
  ● XP total inválidoNaN não vira número publicado

    Unable to find an element with text: XP total indisponível

    [36m<View>[39m
      [36m<View[39m
        [33mpointerEvents[39m=[32m"none"[39m
      [36m/>[39m
      [36m<RNCSafeAreaView>[39m
        [36m<RCTScrollView>[39m
          [36m<View>[39m
            [36m<View>[39m
              [36m<View>[39m
                [36m<View[39m
                  [33maccessibilityElementsHidden[39m=[32m{true}[39m
                  [33mimportantForAccessibility[39m=[32m"no-hide-descendants"[39m
                [36m>[39m
                  [36m<Text>[39m
```

#### invalid-date-normalization-whole-rule

```text
  ● valida dia impossível que cairia nesta semana se o Date o normalizasse

    expect(received).toHaveLength(expected)

    Expected length: 0
    Received length: 1
    Received array:  [{"_fiber": [FiberNode]}]

      37 | it('valida dia impossível que cairia nesta semana se o Date o normalizasse', () => {
      38 |   show('2026-02-30', 5, new Date(2026, 2, 2, 12));
    > 39 |   expect(screen.queryAllByLabelText(/atividade registrada/u)).toHaveLength(0);
         |                                                               ^
      40 | });
      41 | it('segunda e domingo locais continuam na semana mesmo na virada de ano', () => {
      42 |   show('2025-12-29', 8, new Date(2026, 0, 4, 0, 5));

      at Object.toHaveLength (src/features/profile/components/StreakWeek.test.tsx:39:63)

```

#### untrusted-date-falls-back-today

```text
  ● data2026-10-30 não comprova dia desta semana

    expect(received).toHaveLength(expected)

    Expected length: 0
    Received length: 1
    Received array:  [{"_fiber": [FiberNode]}]

      33 | it.each(['2026-10-30', '2026-10-25', '2026-02-30', '2026-13-01', '2026-10-28T12:00:00Z', 'bad', '2026-1-28'])('data%s não comprova dia desta semana', date => {
      34 |   show(date, 5);
    > 35 |   expect(screen.queryAllByLabelText(/atividade registrada/u)).toHaveLength(0);
         |                                                               ^
      36 | });
      37 | it('valida dia impossível que cairia nesta semana se o Date o normalizasse', () => {
      38 |   show('2026-02-30', 5, new Date(2026, 2, 2, 12));

      at toHaveLength (src/features/profile/components/StreakWeek.test.tsx:35:63)

```

#### max-week-single-row

```text
  ● escala máxima troca sete colunas por duas linhas inteiras e renova texto ao vivo

    expect(received).toHaveLength(expected)

    Expected length: 2
    Received length: 1
    Received array:  [{"_fiber": [FiberNode]}]

      63 |   result.rerender(<StreakWeek lastActiveDate={null} streakDays={1} today={today} />);
      64 |   const rows = screen.getAllByTestId(/^week-row-\d$/u);
    > 65 |   expect(rows).toHaveLength(2);
         |                ^
      66 |   expect(rows.map(row => row.findAllByType(View).filter((child: { props: { accessible?: boolean } }) => child.props.accessible === true).length)).toEqual([4, 3]);
      67 |   for (const label of result.UNSAFE_getAllByType(Text)) {
      68 |     expect(label.props.numberOfLines).toBeUndefined();

      at Object.toHaveLength (src/features/profile/components/StreakWeek.test.tsx:65:16)

```

#### max-header-squeezed

```text
  ● texto máximo põe a identidade inteira abaixo do avatar e da engrenagem, sem cortar nome

    expect(received).toBe(expected) // Object.is equality

    Expected: 0
    Received: 1

      25 |   const dimensions = jest.spyOn(Native, 'useWindowDimensions').mockReturnValue({ width: 320, height: 800, scale: 2, fontScale: 3.1 });
      26 |   const result = render(<ProfileIdentityHeader email={null} onOpenSettings={jest.fn()} />);
    > 27 |   expect(Native.StyleSheet.flatten(screen.getByTestId('profile-identity-text').props.style).flex).toBe(0);
         |                                                                                                   ^
      28 |   for (const text of result.UNSAFE_getAllByType(Native.Text)) {
      29 |     expect(text.props.numberOfLines).toBeUndefined();
      30 |     expect(text.props.maxFontSizeMultiplier).toBeUndefined();

      at Object.toBe (src/features/profile/components/ProfileIdentityHeader.test.tsx:27:99)

Test Suites: 1 failed, 1 total
```

#### save-duplicate-unlocked-r2

```text
  ● mantém seleção de meta no Perfil, aplica só sucesso e impede envio duplo

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 2

      146 |   // Dois callbacks nativos no mesmo lote, antes do render que desabilita opções.
      147 |   act(() => { fireEvent.press(focusOption); fireEvent.press(rhythmOption); });
    > 148 |   expect(goalWrite).toHaveBeenCalledTimes(1);
          |                     ^
      149 |   expect(goalWrite).toHaveBeenCalledWith('focus');
      150 |   expect(screen.getByText('0 de 10')).toBeTruthy();
      151 |   await act(async () => saved.resolve({ ...goal, goalXp: 35, goalPerDay: 35, tierId: 'focus' }));

      at Object.toHaveBeenCalledTimes (src/features/profile/screens/ProfileScreen.flow.test.tsx:148:21)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

#### learning-critical-path.yaml

```text
not ok 6 - keeps each shipped flow tied to the installed mobile identifier
  ---
  duration_ms: 2.102708
  location: '/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/scripts/maestro-contract.test.mjs:221:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /- assertVisible: Medalhas/. Input:
    
    'appId: com.ascendcreative.radiant\n' +
      'name: Local-first learning path through two lessons and progress\n' +
      'tags:\n' +
      '  - critical-path\n' +
      '  - local-first\n' +
      '---\n' +
      '# `radiantReduceMotion` liga "Reduzir movimento" no app: o fundo estrelado\n' +
      '# para e o confete não sobe, e a tela assenta antes de cada rolagem\n' +
      '# (FILA 49; ver `src/ui/accessibility/motionLaunchArgument.ts`). Vale para\n' +
      '# todo lançamento: um processo aberto sem ele volta a animar.\n' +
```

#### store-capture.yaml

```text
not ok 6 - keeps each shipped flow tied to the installed mobile identifier
  ---
  duration_ms: 7.837542
  location: '/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/scripts/maestro-contract.test.mjs:221:1'
  failureType: 'testCodeFailure'
  error: |-
    The expression evaluated to a falsy value:
    
      assert.ok(storeCapture.some(command => command.assertVisible === 'Medalhas'))
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected: true
  actual: false
  operator: '=='
  stack: |-
    TestContext.<anonymous> (file:///Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/scripts/maestro-contract.test.mjs:259:10)
    async Test.run (node:internal/test_runner/test:797:9)
```

## Identidade congelada

Brief-r2 SHA-256 `79888c19e8ecdbd8655a1fd1bbbea518ac40ad38558249e1f4a0128ae921ff9e`; manifesto `7a70c2c2e5576d74bbee729efc1d36c7c57de1e326fefdf753f944ec2ca6fc89`; diff `e4ffd10708a666bf621edb9c69fa5ff77eb9c9afda6c9aa89c18d55328271fb4`.

| Caminho | SHA-256 |
|---|---|
| `radiant-app/src/features/profile/screens/ProfileScreen.tsx` | `8fade7af34b6a2abebae1c0f347baab50e41f646002e742b016fb975a1e75fa9` |
| `radiant-app/src/features/profile/screens/ProfileScreen.flow.test.tsx` | `93e25a6ab12f84384c05ae9c3850c6303b9e48049895d74d3307ace60d7602f0` |
| `radiant-app/src/features/profile/components/ProfileIdentityHeader.tsx` | `cc7c2bc4dea16af47a0b2dc6d1d0198fc5f4697b194d289b732d23cf6b03c47e` |
| `radiant-app/src/features/profile/components/ProfileIdentityHeader.test.tsx` | `fdf522f6a96682424285fa8038b6d3d08424a977e8cdbed46f1f772567af2a77` |
| `radiant-app/src/features/profile/components/MedalShelf.tsx` | `2cd4c1db20624c0c13328bd96277095f2973fc85255cfeb668805e5b22e36fc8` |
| `radiant-app/src/features/profile/components/MedalShelf.test.tsx` | `618f46c91c804947c02a6e37617f3c12b1a0f7f96b4731fbce320a5e132e7715` |
| `radiant-app/src/features/profile/components/StreakWeek.tsx` | `a6e2cf7fb37d5547abc68dbcfe4c8cdc238c16826eb52e347140ba5f1ee60bba` |
| `radiant-app/src/features/profile/components/StreakWeek.test.tsx` | `a5e28264dfc9595ba37405c726bff000d2b7d56b199f744e09d9f7fb22be6b67` |
| `radiant-app/src/features/profile/components/TodayGoals.tsx` | `c1a272b71b639c85e2b29f2a5dd6b07015536b8206051d2bbfa085113a0fab65` |
| `radiant-app/src/features/profile/components/TodayGoals.test.tsx` | `b3b40ae4b8aa33fa64a654daa3b63e7b45f88c6168d7aa3f735441e0df1d5c9d` |
| `radiant-app/.maestro/learning-critical-path.yaml` | `0dc6b9f2504c470d2f31dd5ebf015462d5caddc057ab6ae1011be23eec78786a` |
| `radiant-app/.maestro/store-capture.yaml` | `abf2965e39a6d38d18a289f65607320bbe797cff10080e3b5136488f70a7f073` |
| `radiant-app/scripts/maestro-contract.test.mjs` | `3e21735fd5d464d608b765596a6245f0de176e324d820b88d7dc9a16f93a1ab8` |
| `radiant-app/scripts/copy-style-baseline.json` | `c1334e32e2abc49519763b1541565e3209f82d9ecfec1c7ee43ad5ae6a43e858` |

Revisão independente em andamento. Ainda não há validação Loop final ou prova
nativa T09 por este registro de testes focais. G5 permanece separado.

## Correção1 após falha configurada — snapshot R2

Primeiro Loop14/15: app-quality falhou; diagnóstico visual:qa:strict isolou
padding3 e dois borderRadius3 sem tokens. Correção do autor em dois arquivos:
space.s2/4 e radius.rMd/4, tokens existentes12→3. Não há precedente local de
frações nem mudança de baseline/scanner/política; aceitação desse uso explícito
é ponto de revisão independente, não consequência do scanner verde.

Todos os estilos estáticos resolvidos dos dois componentes foram comparados
antes/depois por transpile/avaliação de StyleSheet com tokens reais: igualdade
byte a byte, inset3/raios3/altura6 preservados.12 outros hashes r1 iguais.
Isto é equivalência estática medida, não captura nem execução nativa de R2.
Focais repetidos60/60, strict0regressões, tipos/lint exit0; CPU não repetida
porque não houve mudança geométrica resolvida. Sem nova suíte completa até
parecer do delta. Prova nativa anterior pertence aos bytes R1.

SnapshotR2 manifesto `bd66b87e6681f13c9bbf7956945d406f136e1d53423de5a4aa5793c78abb8a7e`;
diff `c88a27c3d2e5663fc1f288292bc63b878c7d80d478c01e175a3c332126739a2c`;
delta contraR1 `a1853ae06b34e6f430cd56f1a7a47f9851a610d42dbe6a65f791a7fa99a649a9`.
