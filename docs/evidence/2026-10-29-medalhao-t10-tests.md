# T10 Ajustes — testes executados e proveniência

**R1 histórica, reprovada:** os números, hashes e a afirmação de serviços
inalterados nas seções abaixo descrevem exclusivamente a primeira entrega23.
A revisão identificou dois P2 entre telas apesar desses verdes. Em29/10 a FIX1
foi autorizada na janela61/ownership27, com alterações de ordenação em dois
serviços existentes. Seus testes e revisão serão registrados separadamente;
a R1 não prova a correção desses P2 nem o estado final27.

29/10/2026; BASEgit `c879543c0223e9153380d217cd3ddd180735e1f8`.
Produto23 congelado para revisão. Cada recibo JSON registra comando, cwd,
Node20.20.2/EXPO_NO_DOTENV1, exit e duração; hash do log confere os bytes.
142focais+156consumidores são conjuntos disjuntos (298normais em21suítes).
CPUSettings21 e replay3 são repetições, não novos testes adicionais.
Jest não prova rasterização, fala audível ou efeitos externos reais.

## Escopo e limites

Original run1793285025012-97f1822e supervisionou22, foi abandonado CLOSED
emediting/0validações ao descobrir consumidor indireto fora do escopo.
Nenhuma edição desse consumidor no original; nova janela57/ownership23
run1793286563961-b906061e começa com baseline própria anterior preservada,
sem supervisão retroativa. O consumidor só teve cinco labels de botão e um
header de teste corrigidos.22hashes mantidos; a nova final Loop será própria.

Vermelhos causais precederam produto, incluindo oito verdes de Ajustes/meta
antes da retirada do editor do Perfil. Preservados também refoco durante save
pendente e leitura inicial de preferências desconhecidas. Invalidar publicação
não cancela gravação já iniciada. Serviços/schema/política não mudaram.

Tentativas incidentais não são prova: hoist no primeiro mock de Settings,
import ausente de GroupedList no bootstrap, mock recursivo/RangeError de teste
extra. Âncora ambígua parou antes da escrita e foi selecionada pela posição.
Baselinecopy só reduziu cinco tetos. Strict passou sem ampliar exceções.

## green-meta-before-profile

Recibo SHA `6e73086b0e648f3d795272805d44ea2ba37bcbe5a51fb30d385965d169c61bde`; log SHA `dc9547b4f32387b8b24a9e4294a0f4d2cdb9f7da4671f1f99dc1dfcf379bf698`.

```json
{
  "command": [
    "npx",
    "--no-install",
    "jest",
    "--runInBand",
    "--no-cache",
    "src/features/settings/screens/SettingsScreen.flow.test.tsx",
    "-t",
    "editor grava|falha ao salvar|bloqueia duas|blur invalida|carregamento e rejeição"
  ],
  "cwd": "/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 0,
  "seconds": 10.65
}
```

```text
  ○ skipped preserva portas da assinatura, privacidade, termos e suporte e fecha replay/Back sem substituir onFinish
  ○ skipped mantém console só na flag real e conta/sync ausente no aluno

Test Suites: 1 passed, 1 total
Tests:       9 skipped, 8 passed, 17 total
Snapshots:   0 total
Time:        8.033 s
Ran all test suites matching /src\/features\/settings\/screens\/SettingsScreen.flow.test.tsx/i with tests matching "editor grava|falha ao salvar|bloqueia duas|blur invalida|carregamento e rejeição".
```

## red-transfer-profile

Recibo SHA `628cf2d5d626fda125c96fbbaf544b11280411b9932904385389bf3e5b6eab70`; log SHA `bf70c46d34caccb26cee72a4e1450eb1dcfb2ea783db69f2149510f17c0e31fc`.

```json
{
  "command": [
    "npx",
    "--no-install",
    "jest",
    "--runInBand",
    "--no-cache",
    "src/features/profile/screens/ProfileScreen.flow.test.tsx",
    "src/features/profile/components/TodayGoals.test.tsx",
    "src/features/profile/components/ProfileIdentityHeader.test.tsx"
  ],
  "cwd": "/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 1,
  "seconds": 11.56
}
```

```text
  ● Console

    console.warn
      [ThemeIllustration] tema "tubo" sem ilustração, só a medalha: o Skottie não montou o JSON

      64 |   if (warnedThemes.has(theme)) return;
      65 |   warnedThemes.add(theme);
    > 66 |   console.warn(`[ThemeIllustration] tema "${theme}" sem ilustração, só a medalha: ${reason}`);
         |           ^
      67 | }
      68 |
      69 | function makeAnimation(theme: IllustrationTheme): SkSkottieAnimation | null {

      at warn (src/ui/illustrations/ThemeIllustration.tsx:66:11)
      at warnOnce (src/ui/illustrations/ThemeIllustration.tsx:78:7)
      at makeAnimation (src/ui/illustrations/ThemeIllustration.tsx:116:35)
      at mountMemo (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:3859:23)
      at Object.useMemo (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:13093:18)
...
      at Object.getByRole (src/features/profile/components/ProfileIdentityHeader.test.tsx:13:26)

Test Suites: 3 failed, 3 total
Tests:       4 failed, 29 passed, 33 total
Snapshots:   0 total
Time:        8.672 s
Ran all test suites matching /src\/features\/profile\/screens\/ProfileScreen.flow.test.tsx|src\/features\/profile\/components\/TodayGoals.test.tsx|src\/features\/profile\/components\/ProfileIdentityHeader.test.tsx/i.
```

## red-settings-causal

Recibo SHA `e1eda3e8bb5096d7868e23d3e885151f76ceb2c5530fd74036a0fc17c71c498b`; log SHA `c231c0d3897f718e210befe31aa2bcf5c9fd6a6f0259072a4073ded871ab672c`.

```json
{
  "command": [
    "npx",
    "--no-install",
    "jest",
    "--runInBand",
    "--no-cache",
    "src/features/settings/screens/SettingsScreen.flow.test.tsx"
  ],
  "cwd": "/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 1,
  "seconds": 12.51
}
```

```text
  ● abre Ajustes em grupos, com uma rolagem e retorno real ao Perfil

    Unable to find an element with role: button, name: Meta diária: Começar

    [36m<View>[39m
      [36m<RNCSafeAreaView>[39m
        [36m<View>[39m
          [36m<View[39m
            [33maccessibilityLabel[39m=[32m"Voltar ao Perfil"[39m
            [33maccessibilityRole[39m=[32m"button"[39m
            [33maccessible[39m=[32m{true}[39m
          [36m>[39m
            [36m<ViewManagerAdapter_SymbolModule />[39m
            [36m<Text>[39m
              [0mPerfil[0m
            [36m</Text>[39m
          [36m</View>[39m
          [36m<Text[39m
...
      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

Test Suites: 1 failed, 1 total
Tests:       17 failed, 17 total
Snapshots:   0 total
Time:        9.886 s
Ran all test suites matching /src\/features\/settings\/screens\/SettingsScreen.flow.test.tsx/i.
```

## red-components

Recibo SHA `3a3a31796b4d90a970212cc063852a28d4368461f2b4f3e45454fd25dd8b21fd`; log SHA `fab36f44786d7ddff50d5502918b6ae13258296349aa3d658bf3bf9715254431`.

```json
{
  "command": [
    "npx",
    "--no-install",
    "jest",
    "--runInBand",
    "--no-cache",
    "src/ui/components/GroupedList.test.tsx",
    "src/features/subscription/components/SubscriptionCard.test.tsx",
    "src/features/progress-sync/components/ICloudBackupCard.test.tsx",
    "src/features/profile/components/FeedbackPreferencesCard.test.tsx",
    "src/features/progress/components/LegalLinksCard.test.tsx"
  ],
  "cwd": "/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 1,
  "seconds": 10.78
}
```

```text
  ● ICloudBackupCard › erro: informa sem bloquear e mantém o interruptor

    Unable to find an element with text: /N\xE3o foi poss\xEDvel acessar o iCloud agora/

    [36m<View>[39m
      [36m<View>[39m
        [36m<View>[39m
          [36m<Text>[39m
            [0mPROGRESSO[0m
          [36m</Text>[39m
          [36m<Text[39m
            [33maccessibilityRole[39m=[32m"header"[39m
          [36m>[39m
            [0mBackup no iCloud[0m
          [36m</Text>[39m
        [36m</View>[39m
        [36m<RCTSwitch[39m
          [33maccessibilityHint[39m=[32m"Guarda seu progresso na sua conta do iCloud para reinstalar sem perder nada."[39m
...
      at Object.toHaveLength (src/features/progress/components/LegalLinksCard.test.tsx:40:41)

Test Suites: 5 failed, 5 total
Tests:       8 failed, 17 passed, 25 total
Snapshots:   0 total
Time:        8.107 s
Ran all test suites matching /src\/ui\/components\/GroupedList.test.tsx|src\/features\/subscription\/components\/SubscriptionCard.test.tsx|src\/features\/progress-sync\/components\/ICloudBackupCard.test.tsx|src\/features\/profile\/components\/FeedbackPreferencesCard.test.tsx|src\/features\/progress\/components\/LegalLinksCard.test.tsx/i.
```

## red-reminder-specific

Recibo SHA `9c679e7b06bf3f295f394a4ef96bd5b2583d8bfb2c29a6d3531e6d8ee0f3ca38`; log SHA `259a67c050af740498362649080528ba8e510a937a565564c806460c72d4d91a`.

```json
{
  "command": [
    "npx",
    "--no-install",
    "jest",
    "--runInBand",
    "--no-cache",
    "src/features/push/components/ReminderRow.test.tsx",
    "-t",
    "dois callbacks|refoco relê|reconciliação atrasada|texto grande"
  ],
  "cwd": "/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 1,
  "seconds": 4.46
}
```

```text
  ● refoco relê preferência e leitura antiga não apaga a escolha nova

    Unable to find an element with role: switch

      227 |   push.getOptIn.mockResolvedValue(true);
      228 |   await act(async () => focus.__focus());
    > 229 |   expect(screen.getByRole('switch').props.value).toBe(true);
          |                 ^
      230 |   await act(async () => resolveOld(false));
      231 |   expect(screen.getByRole('switch').props.value).toBe(true);
      232 |   expect(push.requestPermissionIfNeeded).not.toHaveBeenCalled(); expect(push.setOptIn).not.toHaveBeenCalled();

      at Object.getByRole (src/features/push/components/ReminderRow.test.tsx:229:17)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● dois callbacks no mesmo lote não enviam decisões concorrentes

...
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       4 failed, 13 skipped, 17 total
Snapshots:   0 total
Time:        1.841 s
Ran all test suites matching /src\/features\/push\/components\/ReminderRow.test.tsx/i with tests matching "dois callbacks|refoco relê|reconciliação atrasada|texto grande".
```

## red-refocus-pending

Recibo SHA `3f2e470533b3e1f97ed6dc22c07e05863ac4d4eb569b819508cab12c31bcf312`; log SHA `45d20456d9ec2d73350a292a77173d85d3698abd3649e454e6ee4532f5ad1a2f`.

```json
{
  "command": [
    "npx",
    "--no-install",
    "jest",
    "--runInBand",
    "--no-cache",
    "src/features/settings/screens/SettingsScreen.flow.test.tsx",
    "-t",
    "refocar durante save"
  ],
  "cwd": "/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 1,
  "seconds": 10.77
}
```

```text
  ● refocar durante save aguarda I/O existente, relê fonte persistida e libera editor

    Unable to find an element with text: Carregando meta…

    [36m<View>[39m
      [36m<RNCSafeAreaView>[39m
        [36m<View>[39m
          [36m<View[39m
            [33maccessibilityLabel[39m=[32m"Voltar ao Perfil"[39m
            [33maccessibilityRole[39m=[32m"button"[39m
            [33maccessible[39m=[32m{true}[39m
          [36m>[39m
            [36m<ViewManagerAdapter_SymbolModule />[39m
            [36m<Text>[39m
              [0mPerfil[0m
            [36m</Text>[39m
          [36m</View>[39m
          [36m<Text[39m
...
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 17 skipped, 18 total
Snapshots:   0 total
Time:        8.155 s
Ran all test suites matching /src\/features\/settings\/screens\/SettingsScreen.flow.test.tsx/i with tests matching "refocar durante save".
```

## red-feedback-unknown

Recibo SHA `e253abf5d5aa3e239c96caad3a2466f24bf2b3dfe53edc0cde2dff70d90d08a5`; log SHA `9dd84510a9454e461cf34ead1817905dbb62fea3fe5a46c00c358a33001ddf15`.

```json
{
  "command": [
    "npx",
    "--no-install",
    "jest",
    "--runInBand",
    "--no-cache",
    "src/features/profile/components/FeedbackPreferencesCard.test.tsx",
    "-t",
    "aguarda leitura"
  ],
  "cwd": "/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 1,
  "seconds": 4.37
}
```

```text
  ● aguarda leitura antes de gravar, sem transformar defaults visuais em escolha sobre a preferência desconhecida

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: undefined

      36 |   const change = jest.fn(); render(<FeedbackPreferencesCard preferences={null} onChange={change} />);
      37 |   const sounds = screen.getByRole('switch', { name: 'Sons' });
    > 38 |   expect(sounds.props.disabled).toBe(true);
         |                                 ^
      39 |   fireEvent(sounds, 'valueChange', false);
      40 |   expect(change).not.toHaveBeenCalled();
      41 | });

      at Object.toBe (src/features/profile/components/FeedbackPreferencesCard.test.tsx:38:33)

Test Suites: 1 failed, 1 total
...
      at Object.toBe (src/features/profile/components/FeedbackPreferencesCard.test.tsx:38:33)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 4 skipped, 5 total
Snapshots:   0 total
Time:        1.79 s
Ran all test suites matching /src\/features\/profile\/components\/FeedbackPreferencesCard.test.tsx/i with tests matching "aguarda leitura".
```

## final-focals

Recibo SHA `5db1e622294ac100b35e75fc634a7254b861115b1531d75472b662ecabcd5cab`; log SHA `5a733d3f7875c612962e0c381908d9fdc1387cb64c162f6c3830ce60408903ef`.

```json
{
  "command": [
    "npx",
    "--no-install",
    "jest",
    "--runInBand",
    "--no-cache",
    "src/features/settings/screens/SettingsScreen.flow.test.tsx",
    "src/ui/components/GroupedList.test.tsx",
    "src/features/subscription/components/SubscriptionCard.test.tsx",
    "src/features/progress-sync/components/ICloudBackupCard.test.tsx",
    "src/features/profile/components/FeedbackPreferencesCard.test.tsx",
    "src/features/progress/components/LegalLinksCard.test.tsx",
    "src/features/profile/screens/ProfileScreen.flow.test.tsx",
    "src/features/profile/components/TodayGoals.test.tsx",
    "src/features/profile/components/ProfileIdentityHeader.test.tsx",
    "src/features/push/components/ReminderRow.test.tsx",
    "src/features/journey/screens/JourneyHomeScreen.flow.test.tsx"
  ],
  "cwd": "/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 0,
  "seconds": 29.04
}
```

```text
PASS src/features/profile/components/ProfileIdentityHeader.test.tsx
PASS src/features/progress/components/LegalLinksCard.test.tsx

Test Suites: 11 passed, 11 total
Tests:       142 passed, 142 total
Snapshots:   0 total
Time:        26.349 s
Ran all test suites matching /src\/features\/settings\/screens\/SettingsScreen.flow.test.tsx|src\/ui\/components\/GroupedList.test.tsx|src\/features\/subscription\/components\/SubscriptionCard.test.tsx|src\/features\/progress-sync\/components\/ICloudBackupCard.test.tsx|src\/features\/profile\/components\/FeedbackPreferencesCard.test.tsx|src\/features\/progress\/components\/LegalLinksCard.test.tsx|src\/features\/profile\/screens\/ProfileScreen.flow.test.tsx|src\/features\/profile\/components\/TodayGoals.test.tsx|src\/features\/profile\/components\/ProfileIdentityHeader.test.tsx|src\/features\/push\/components\/ReminderRow.test.tsx|src\/features\/journey\/screens\/JourneyHomeScreen.flow.test.tsx/i.
```

## final-settings-cpu

Recibo SHA `86dec1141f2fec92363966603f1a6cb2d827b27b58dd2cac46634b2225d213ce`; log SHA `06a42d9d9938ac17a08bc4132f6b07db99b4a18f97e78ca8984a9333641a40ea`.

```json
{
  "command": [
    "/usr/sbin/taskpolicy",
    "-b",
    "env",
    "EXPO_NO_DOTENV=1",
    "npx",
    "--no-install",
    "jest",
    "--runInBand",
    "--no-cache",
    "src/features/settings/screens/SettingsScreen.flow.test.tsx"
  ],
  "cwd": "/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 0,
  "seconds": 46.47
}
```

```text
  ✓ rejeição do save depois do blur não publica erro no foco seguinte (57 ms)
  ✓ backup bloqueia duplo callback e refoco aguarda a gravação antes da releitura (79 ms)

Test Suites: 1 passed, 1 total
Tests:       21 passed, 21 total
Snapshots:   0 total
Time:        36.666 s
Ran all test suites matching /src\/features\/settings\/screens\/SettingsScreen.flow.test.tsx/i.
```

## final-typecheck

Recibo SHA `b743399591023790e7a86f052871d64f32753ba7aacdcb2db7fda6bc97de558c`; log SHA `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

```json
{
  "command": [
    "npx",
    "--no-install",
    "tsc",
    "--noEmit"
  ],
  "cwd": "/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 0,
  "seconds": 5.63
}
```

```text

```

## final-lint

Recibo SHA `87ac7933b63196458bee6fc4511c3147e10fcbd4042ff8da65b14ec1df7dd1f0`; log SHA `f3d07d7c81419213cb830f5757c82febb5c99d2c39948d938ffb0cb58107d604`.

```json
{
  "command": [
    "npm",
    "run",
    "lint"
  ],
  "cwd": "/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 0,
  "seconds": 11.02
}
```

```text

/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/src/ui/characters/PixelFace.tsx
  101:6  warning  React Hook useEffect has missing dependencies: 'arcMix', 'eyeH', 'eyeOffsetY', 'eyeRadius', 'eyeRotate', 'eyeW', 'mouthDip', 'mouthThickness', and 'mouthW'. Either include them or remove the dependency array  react-hooks/exhaustive-deps
  127:6  warning  React Hook useEffect has a missing dependency: 'blink'. Either include it or remove the dependency array                                                                                                         react-hooks/exhaustive-deps

✖ 24 problems (0 errors, 24 warnings)
  0 errors and 9 warnings potentially fixable with the `--fix` option.

```

## final-visual

Recibo SHA `0aac8a8308927a0614cd5a251965fb96275712f4b6d2ee4ae276884d50ac9130`; log SHA `9d803fe81ff3f2fd1f4fb3b7bd3bc7cfade17ef3da42f39a413ea1391a276994`.

```json
{
  "command": [
    "npm",
    "run",
    "visual:qa:strict"
  ],
  "cwd": "/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 0,
  "seconds": 0.33
}
```

```text

👁  Starting Radiant Visual QA...

------------------------------------------------
Scanned 473 files.
Found 44 issues: 0 regressions, 41 baselined, 3 scoped exceptions.

✅ Visual QA passed without unapproved regressions.
```

## final-contracts

Recibo SHA `42db655f6166baeb0f217de52e871a7756960b9b4f0591450cf1d7e104afee65`; log SHA `84c032d369ce5af85b3ca017df74b960cad82e94d98c3603573305107fb73738`.

```json
{
  "command": [
    "node",
    "--test",
    "scripts/copy-style-contract.test.mjs",
    "scripts/maestro-contract.test.mjs"
  ],
  "cwd": "/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 0,
  "seconds": 0.98
}
```

```text
# tests 105
# suites 0
# pass 105
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 957.712834
```

## final-consumers

Recibo SHA `5b32da6efec3c329313b6a1ed696fced9bab391887da75e11e4931f3efa7163e`; log SHA `ff432ad3ae238cd92ce907b2148aa7c2d2ebfac047cb45aa126d73c5a7972393`.

```json
{
  "command": [
    "npx",
    "--no-install",
    "jest",
    "--runInBand",
    "--no-cache",
    "src/features/subscription/screens/SubscriptionScreen.flow.test.tsx",
    "src/features/progress/components/AccountSyncCard.test.tsx",
    "components/external-link.test.tsx",
    "src/features/daily-goal/services/DailyGoalService.test.ts",
    "src/features/push/services/PushService.test.ts",
    "src/features/progress-sync/ProgressSyncService.test.ts",
    "src/features/progress-sync/CloudKitPrivateAdapter.test.ts",
    "src/ui/feedback/feedbackPreferences.test.ts",
    "src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx",
    "src/features/first-run/screens/WelcomeFlowReentry.test.tsx"
  ],
  "cwd": "/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 1,
  "seconds": 17.3
}
```

```text
  ● Console

    console.error
      [ProgressSyncService] Falha ao marcar opt-out no iCloud: CloudUnavailableError: O backup no iCloud não está disponível neste build.
          at Object.<anonymous> (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/src/features/progress-sync/ProgressSyncService.test.ts:141:39)
          at Generator.next (<anonymous>)
          at asyncGeneratorStep (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
          at _next (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
          at /Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
          at new Promise (<anonymous>)
          at Object.<anonymous> (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)
          at Object.apply (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/src/features/progress-sync/ProgressSyncService.test.ts:141:16)
          at ProgressSyncService.pull (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/src/features/progress-sync/ProgressSyncService.ts:154:45)
          at Generator.next (<anonymous>)
          at asyncGeneratorStep (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
          at _next (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
          at /Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
          at new Promise (<anonymous>)
...
PASS src/ui/feedback/feedbackPreferences.test.ts

Test Suites: 1 failed, 9 passed, 10 total
Tests:       3 failed, 153 passed, 156 total
Snapshots:   0 total
Time:        14.593 s
Ran all test suites matching /src\/features\/subscription\/screens\/SubscriptionScreen.flow.test.tsx|src\/features\/progress\/components\/AccountSyncCard.test.tsx|components\/external-link.test.tsx|src\/features\/daily-goal\/services\/DailyGoalService.test.ts|src\/features\/push\/services\/PushService.test.ts|src\/features\/progress-sync\/ProgressSyncService.test.ts|src\/features\/progress-sync\/CloudKitPrivateAdapter.test.ts|src\/ui\/feedback\/feedbackPreferences.test.ts|src\/features\/first-run\/screens\/WelcomeFlowScreen.flow.test.tsx|src\/features\/first-run\/screens\/WelcomeFlowReentry.test.tsx/i.
```

## r3-reentry-green

Recibo SHA `5157ff89d7f55fd744dc2241bbffec53d5aa4e743915ade6415bd4f4cf0850fe`; log SHA `2db06218d70cc9995351497f6f7e46ba9ceb76a00c14a20d1850584c92b346fa`.

```json
{
  "command": [
    "npx",
    "--no-install",
    "jest",
    "--runInBand",
    "--no-cache",
    "src/features/first-run/screens/WelcomeFlowReentry.test.tsx"
  ],
  "cwd": "/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 0,
  "seconds": 11.41
}
```

```text
    ✓ pular no replay fecha o modal sem reescrever o marcador anterior (45 ms)
    ✓ concluir no replay fecha o modal sem reescrever o marcador anterior (48 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        8.522 s
Ran all test suites matching /src\/features\/first-run\/screens\/WelcomeFlowReentry.test.tsx/i.
```

## r3-consumers-green

Recibo SHA `166702e99b8895a30113ecff7ac80e101217ba5a8dc715bc1c4af86cff6fd8b2`; log SHA `abc8562928eade3eec80fd390e6f753253f06ff86b2f2c71dc5cc2dfc7d11926`.

```json
{
  "command": [
    "npx",
    "--no-install",
    "jest",
    "--runInBand",
    "--no-cache",
    "src/features/subscription/screens/SubscriptionScreen.flow.test.tsx",
    "src/features/progress/components/AccountSyncCard.test.tsx",
    "components/external-link.test.tsx",
    "src/features/daily-goal/services/DailyGoalService.test.ts",
    "src/features/push/services/PushService.test.ts",
    "src/features/progress-sync/ProgressSyncService.test.ts",
    "src/features/progress-sync/CloudKitPrivateAdapter.test.ts",
    "src/ui/feedback/feedbackPreferences.test.ts",
    "src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx",
    "src/features/first-run/screens/WelcomeFlowReentry.test.tsx"
  ],
  "cwd": "/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 0,
  "seconds": 14.45
}
```

```text

PASS src/ui/feedback/feedbackPreferences.test.ts

Test Suites: 10 passed, 10 total
Tests:       156 passed, 156 total
Snapshots:   0 total
Time:        11.72 s
Ran all test suites matching /src\/features\/subscription\/screens\/SubscriptionScreen.flow.test.tsx|src\/features\/progress\/components\/AccountSyncCard.test.tsx|components\/external-link.test.tsx|src\/features\/daily-goal\/services\/DailyGoalService.test.ts|src\/features\/push\/services\/PushService.test.ts|src\/features\/progress-sync\/ProgressSyncService.test.ts|src\/features\/progress-sync\/CloudKitPrivateAdapter.test.ts|src\/ui\/feedback\/feedbackPreferences.test.ts|src\/features\/first-run\/screens\/WelcomeFlowScreen.flow.test.tsx|src\/features\/first-run\/screens\/WelcomeFlowReentry.test.tsx/i.
```

## Mutações específicas

mutations.json contém25 registros e24 nomes distintos: feedback-stale-read foi
repetido após ajustar seu teste para refoco já carregado. A lista abaixo usa a
última evidência por nome (24defeitos), sem multiplicar testes pelo registro
repetido. Os logs atuais sustentam as falhas nomeadas; a sequência histórica
e eventuais artefatos anteriores são examinados pelo revisor independentemente.
Não afirmar25logs distintos ou causalidade no runtime nativo.

| Defeito | Padrão focal | SHA do log |
|---|---|---|
| meta-double | bloqueia duas seleções | `749686df021effae6ca5892098838162d4dc12bc837be9ea4349860df8ae63b9` |
| meta-wrong-tier | editor grava Foco | `e48df233498f67f1519cb395cab97cfdfba09246fa256833212cf17e6245ea2f` |
| meta-request-not-result | bloqueia duas seleções | `ad00df83ebc324b2bb14652c6d08072fb5418417a313aeaf8fef6b81a9e5f38a` |
| meta-stale-success | blur invalida publicação | `3b6061be9ea1af5221c6f93888eb777ab7fe00083389914ddc5be99b2edb0f8a` |
| meta-stale-error | rejeição do save depois | `c7c713e3969a23416dcac036851e0f75ece813965e73d4de767d7bc6c0d8fa76` |
| meta-read-without-wait | refocar durante save | `2cc3b8f30cd59b32af4a883cc03aae812cffc6fd6db1dd89230dcc09d7f8f6cb` |
| feedback-stale-read | leitura atrasada de preferências | `3acf67b57b9d6760eeab9a4e282bd4c5098057e0669a7f568b0b7687a89863c8` |
| feedback-stale-patch | dois callbacks | `c9603d392996d5521a0d527d11fd07731258d56c69f2b811380f434f578497ba` |
| backup-hidden-present | módulo CloudKit presente | `e1d48ee4647733c51272a2ecd6ee839c71b0419a77ec3670215d2faf62c3ee15` |
| backup-visible-absent | backup absent | `8ee32fcf01f2894a115cb78f63635e05359da893dc4b6b11b3f7b4e672d3fe74` |
| backup-transient-as-absent | busy protege | `4c47d39a27b22d846fe044be3f735b68983722efd4033fa095b56e071a005800` |
| backup-double | backup bloqueia duplo | `f626a4e47db77e66c7a27b684ff9fcfa1794ba088ca46c5cac13071ce0f9836f` |
| reminder-double | dois callbacks | `24870c13b10ad1d385fd24b01fc564db141519b433e343a1ca0d18419cb3fc4d` |
| reminder-denial | permissão negada | `96d554ade710a9705f06e2380166ef75266e0eb627fae1f69a5a4b0a7303c8f4` |
| reminder-stale-read | refoco relê | `94a7e216091e3bf8e7f787a4ee2a2cc2bab74fab754c7ae14c6771af8e2024e7` |
| reminder-stale-error | reconciliação atrasada | `d295c2bf592b52188eae9a702753eea2194b0d3fef2429bd166d4dacace402d6` |
| reminder-font-cap | texto grande | `03a8d554018134b85b4f0b99374e48bf9651d53a4853ae001ae438380b57a4fd` |
| group-radius | reúne linhas | `b60849092763ebe7e08975d68cc37742502a7025d9ef6dc2b7f19282a50d94a6` |
| group-uppercase | reúne linhas | `41e8026332812fa293171473b7d559e10a69d456f2357f62e56182087b563363` |
| legal-destination | renders Privacidade | `942f89c91557546c5dab5327b6517e591d50fd66caeebe052e1e8c58ed779b4b` |
| legal-support-missing | renders Central | `c1e0762d3ed8faef0e9be734af27ee898119b589e2c0ece6ea782d71360434d6` |
| subscription-renewal-unknown | renovação desconhecida | `5daac7a1323b3b95396de0cc60a4cbb7c3ebc9fc7e41ba5b45397998f38b9676` |
| subscription-pending-door | pendente informa | `a04e7fda175dd93c8d8bb653015adbd278b4707271ab0985dcbc55fb70038e7f` |
| feedback-loading | aguarda leitura | `f36de96963bc26c1ec9af484fbe7da8c3c26e7448c608384b02ed0208da35641` |

### Falhas causais preservadas

#### meta-double

```text
  ● bloqueia duas seleções no mesmo lote e usa o snapshot devolvido, sem derivar o resultado

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 2

      105 |   const focus = screen.getByRole('radio', { name: 'Foco, 35 XP' }); const rhythm = screen.getByRole('radio', { name: 'Ritmo, 20 XP' });
      106 |   act(() => { fireEvent.press(focus); fireEvent.press(rhythm); });
    > 107 |   expect(write).toHaveBeenCalledTimes(1); expect(write).toHaveBeenCalledWith('focus');
          |                 ^
      108 |   expect(screen.getByRole('radio', { name: 'Começar, 10 XP' }).props.accessibilityState.checked).toBe(true);
      109 |   expect(screen.getByText('Salvando meta…')).toBeTruthy();
      110 |   await act(async () => saved.resolve({ ...initial, tierId: 'challenge', goalXp: 50, goalPerDay: 50 }));

      at Object.toHaveBeenCalledTimes (src/features/settings/screens/SettingsScreen.flow.test.tsx:107:17)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

#### meta-wrong-tier

```text
  ● editor grava Foco, 35 XP pelo serviço real e relê o valor persistido

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      88 |   expect(screen.getAllByRole('radio')).toHaveLength(4);
      89 |   fireEvent.press(screen.getByRole('radio', { name: label }));
    > 90 |   await waitFor(() => expect(screen.getByRole('radio', { name: label }).props.accessibilityState.checked).toBe(true));
         |                ^
      91 |   expect(JSON.parse((await AsyncStorage.getItem(DAILY_GOAL_STORAGE_KEY))!)).toMatchObject({ tierId, goalPerDay: xp });
      92 | });
      93 | it('falha ao salvar mantém valor anterior e permite nova tentativa, sem atualização otimista', async () => {

      at src/features/settings/screens/SettingsScreen.flow.test.tsx:90:16
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

#### meta-request-not-result

```text
  ● bloqueia duas seleções no mesmo lote e usa o snapshot devolvido, sem derivar o resultado

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      109 |   expect(screen.getByText('Salvando meta…')).toBeTruthy();
      110 |   await act(async () => saved.resolve({ ...initial, tierId: 'challenge', goalXp: 50, goalPerDay: 50 }));
    > 111 |   expect(screen.getByRole('radio', { name: 'Desafio, 50 XP' }).props.accessibilityState.checked).toBe(true);
          |                                                                                                  ^
      112 | });
      113 | it('blur invalida publicação do save; refoco relê a fonte e leitura antiga não sobrescreve', async () => {
      114 |   const saved = deferred<DailyGoalSnapshot>(); jest.spyOn(DailyGoalService, 'setTier').mockReturnValueOnce(saved.promise);

      at Object.toBe (src/features/settings/screens/SettingsScreen.flow.test.tsx:111:98)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

#### meta-stale-success

```text
  ● blur invalida publicação do save; refoco relê a fonte e leitura antiga não sobrescreve

    Unable to find an element with role: button, name: Meta diária: Começar

    [36m<View>[39m
      [36m<RNCSafeAreaView>[39m
        [36m<View>[39m
          [36m<View[39m
            [33maccessibilityLabel[39m=[32m"Voltar ao Perfil"[39m
            [33maccessibilityRole[39m=[32m"button"[39m
            [33maccessible[39m=[32m{true}[39m
          [36m>[39m
            [36m<ViewManagerAdapter_SymbolModule />[39m
            [36m<Text>[39m
              [0mPerfil[0m
            [36m</Text>[39m
          [36m</View>[39m
          [36m<Text[39m
```

#### meta-stale-error

```text
  ● rejeição do save depois do blur não publica erro no foco seguinte

    expect(received).toBeNull()

    Received: {"_fiber": {"_debugHookTypes": null, "_debugInfo": null, "_debugNeedsRemount": false, "_debugOwner": [FiberNode], "_debugStack": [Error: react-stack-top-frame], "_debugTask": null, "actualDuration": 0, "actualStartTime": 1793285894028, "alternate": [FiberNode], "child": [FiberNode], "childLanes": 0, "deletions": null, "dependencies": null, "elementType": "Text", "flags": 4, "index": 0, "key": null, "lanes": 0, "memoizedProps": [Object], "memoizedState": null, "mode": 3, "pendingProps": [Object], "ref": null, "refCleanup": null, "return": [FiberNode], "selfBaseDuration": 0, "sibling": null, "stateNode": [Object], "subtreeFlags": 262144, "tag": 5, "treeBaseDuration": 0, "type": "Text", "updateQueue": null}}

      204 |   await act(async () => { routes.__blur(); routes.__focus(); });
      205 |   await act(async () => stale.reject(new Error('save')));
    > 206 |   expect(screen.queryByText('Não foi possível salvar a meta. Tente novamente.')).toBeNull();
          |                                                                                  ^
      207 |   expect(screen.getByRole('button', { name: 'Meta diária: Começar' }).props.accessibilityState.disabled).toBe(false);
      208 | });
      209 | it('backup bloqueia duplo callback e refoco aguarda a gravação antes da releitura', async () => {

      at Object.toBeNull (src/features/settings/screens/SettingsScreen.flow.test.tsx:206:82)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

```

#### meta-read-without-wait

```text
  ● refocar durante save aguarda I/O existente, relê fonte persistida e libera editor

    Unable to find an element with text: Carregando meta…

    [36m<View>[39m
      [36m<RNCSafeAreaView>[39m
        [36m<View>[39m
          [36m<View[39m
            [33maccessibilityLabel[39m=[32m"Voltar ao Perfil"[39m
            [33maccessibilityRole[39m=[32m"button"[39m
            [33maccessible[39m=[32m{true}[39m
          [36m>[39m
            [36m<ViewManagerAdapter_SymbolModule />[39m
            [36m<Text>[39m
              [0mPerfil[0m
            [36m</Text>[39m
          [36m</View>[39m
          [36m<Text[39m
```

#### feedback-stale-read

```text
  ● leitura atrasada de preferências não apaga um toque feito antes de terminar

    expect(received).toBe(expected) // Object.is equality

    Expected: false
    Received: true

      198 |   fireEvent(screen.getByRole('switch', { name: 'Sons' }), 'valueChange', false);
      199 |   await act(async () => stale.resolve(JSON.stringify({ sounds: true, haptics: true })));
    > 200 |   expect(screen.getByRole('switch', { name: 'Sons' }).props.value).toBe(false);
          |                                                                    ^
      201 | });
      202 | it('rejeição do save depois do blur não publica erro no foco seguinte', async () => {
      203 |   const stale = deferred<DailyGoalSnapshot>(); jest.spyOn(DailyGoalService, 'setTier').mockReturnValueOnce(stale.promise);

      at Object.toBe (src/features/settings/screens/SettingsScreen.flow.test.tsx:200:68)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

#### feedback-stale-patch

```text
  ● dois callbacks antes do render preservam ambas as escolhas

    expect(jest.fn()).toHaveBeenLastCalledWith(...expected)

    Expected: {"haptics": false, "sounds": false}
    Received
           1: {"haptics": true, "sounds": false}
    ->     2
              Object {
                "haptics": false,
            -   "sounds": false,
            +   "sounds": true,
              },

    Number of calls: 2

      31 |   const { act } = require('@testing-library/react-native');
      32 |   act(() => { fireEvent(sounds, 'valueChange', false); fireEvent(haptics, 'valueChange', false); });
```

#### backup-hidden-present

```text
  ● módulo CloudKit presente mantém backup funcional mesmo em indisponibilidade transitória

    expect(received).toBeNull()

    Received: {"_fiber": {"_debugHookTypes": null, "_debugInfo": null, "_debugNeedsRemount": false, "_debugOwner": [FiberNode], "_debugStack": [Error: react-stack-top-frame], "_debugTask": null, "actualDuration": 0, "actualStartTime": 1793285930677, "alternate": [FiberNode], "child": [FiberNode], "childLanes": 0, "deletions": null, "dependencies": null, "elementType": "Text", "flags": 4, "index": 0, "key": null, "lanes": 0, "memoizedProps": [Object], "memoizedState": null, "mode": 3, "pendingProps": [Object], "ref": null, "refCleanup": null, "return": [FiberNode], "selfBaseDuration": 0, "sibling": null, "stateNode": [Object], "subtreeFlags": 262144, "tag": 5, "treeBaseDuration": 0, "type": "Text", "updateQueue": null}}

      168 | it('módulo CloudKit presente mantém backup funcional mesmo em indisponibilidade transitória', async () => {
      169 |   const native = { accountStatus: jest.fn(), fetchBackup: jest.fn(), saveBackup: jest.fn() }; nativeModule.mockReturnValue(native);
    > 170 |   await ready(); expect(screen.queryByText('Em breve')).toBeNull(); expect(native.accountStatus).not.toHaveBeenCalled();
          |                                                         ^
      171 |   fireEvent(screen.getByRole('switch', { name: 'Backup no iCloud' }), 'valueChange', true);
      172 |   await waitFor(() => expect(backup.setEnabled).toHaveBeenCalledWith(true, expect.any(Number)));
      173 |   expect(screen.getByRole('switch', { name: 'Backup no iCloud' }).props.value).toBe(true);

      at Object.toBeNull (src/features/settings/screens/SettingsScreen.flow.test.tsx:170:57)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

```

#### backup-visible-absent

```text
  ● backup absent pelo resolver real fica Em breve sem chamada de gravação

    Unable to find an element with text: Em breve

    [36m<View>[39m
      [36m<RNCSafeAreaView>[39m
        [36m<View>[39m
          [36m<View[39m
            [33maccessibilityLabel[39m=[32m"Voltar ao Perfil"[39m
            [33maccessibilityRole[39m=[32m"button"[39m
            [33maccessible[39m=[32m{true}[39m
          [36m>[39m
            [36m<ViewManagerAdapter_SymbolModule />[39m
            [36m<Text>[39m
              [0mPerfil[0m
            [36m</Text>[39m
          [36m</View>[39m
          [36m<Text[39m
```

#### backup-transient-as-absent

```text
  ● busy protege controle funcional sem trocar falha transitória por Em breve

    expect(received).toBeNull()

    Received: {"_fiber": {"_debugHookTypes": null, "_debugInfo": null, "_debugNeedsRemount": false, "_debugOwner": [FiberNode], "_debugStack": [Error: react-stack-top-frame], "_debugTask": null, "actualDuration": 0, "actualStartTime": 1793285946278, "alternate": null, "child": [FiberNode], "childLanes": 0, "deletions": null, "dependencies": null, "elementType": "Text", "flags": 0, "index": 0, "key": null, "lanes": 0, "memoizedProps": [Object], "memoizedState": null, "mode": 3, "pendingProps": [Object], "ref": null, "refCleanup": null, "return": [FiberNode], "selfBaseDuration": 0, "sibling": null, "stateNode": [Object], "subtreeFlags": 0, "tag": 5, "treeBaseDuration": 0, "type": "Text", "updateQueue": null}}

      72 | it('busy protege controle funcional sem trocar falha transitória por Em breve', () => {
      73 |     render(<ICloudBackupCard available state={{ enabled: true, decided: true, lastBackupAt: null, lastError: 'cloud-unavailable' }} onToggle={jest.fn()} busy />);
    > 74 |     expect(screen.queryByText('Em breve')).toBeNull();
         |                                            ^
      75 |     expect(screen.getByRole('switch').props.disabled).toBe(true);
      76 | });
      77 |

      at Object.toBeNull (src/features/progress-sync/components/ICloudBackupCard.test.tsx:74:44)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 7 skipped, 8 total
```

#### backup-double

```text
  ● backup bloqueia duplo callback e refoco aguarda a gravação antes da releitura

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 2

      217 |   await ready(); const toggle = screen.getByRole('switch', { name: 'Backup no iCloud' });
      218 |   act(() => { fireEvent(toggle, 'valueChange', true); fireEvent(toggle, 'valueChange', false); });
    > 219 |   expect(backup.setEnabled).toHaveBeenCalledTimes(1);
          |                             ^
      220 |   await act(async () => { routes.__blur(); routes.__focus(); });
      221 |   await act(async () => done.resolve());
      222 |   expect(screen.getByRole('switch', { name: 'Backup no iCloud' }).props.value).toBe(true);

      at Object.toHaveBeenCalledTimes (src/features/settings/screens/SettingsScreen.flow.test.tsx:219:29)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

#### reminder-double

```text
  ● dois callbacks no mesmo lote não enviam decisões concorrentes

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 2

      237 |   await renderRow(); const toggle = screen.getByRole('switch');
      238 |   act(() => { fireEvent(toggle, 'valueChange', true); fireEvent(toggle, 'valueChange', false); });
    > 239 |   expect(push.setOptIn).toHaveBeenCalledTimes(1);
          |                         ^
      240 |   await act(async () => finish());
      241 | });
      242 | it('reconciliação atrasada após blur não publica estado na tela antiga e refoco lê escolha real', async () => {

      at Object.toHaveBeenCalledTimes (src/features/push/components/ReminderRow.test.tsx:239:25)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

#### reminder-denial

```text
  ● ReminderRow › com a permissão negada, o interruptor volta a desligado sem erro e sem agendar

    expect(received).toBe(expected) // Object.is equality

    Expected: false
    Received: true

      129 |
      130 |     await waitFor(() => expect(push.requestPermissionIfNeeded).toHaveBeenCalled());
    > 131 |     await waitFor(() =>
          |                  ^
      132 |       expect(screen.getByRole('switch', { name: 'Lembrete diário' }).props.value).toBe(false),
      133 |     );
      134 |     expect(push.scheduleDailyIfEligible).not.toHaveBeenCalled();

      at Object.<anonymous> (src/features/push/components/ReminderRow.test.tsx:131:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

#### reminder-stale-read

```text
  ● refoco relê preferência e leitura antiga não apaga a escolha nova

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      229 |   expect(screen.getByRole('switch').props.value).toBe(true);
      230 |   await act(async () => resolveOld(false));
    > 231 |   expect(screen.getByRole('switch').props.value).toBe(true);
          |                                                  ^
      232 |   expect(push.requestPermissionIfNeeded).not.toHaveBeenCalled(); expect(push.setOptIn).not.toHaveBeenCalled();
      233 | });
      234 | it('dois callbacks no mesmo lote não enviam decisões concorrentes', async () => {

      at Object.toBe (src/features/push/components/ReminderRow.test.tsx:231:50)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

#### reminder-stale-error

```text
  ● reconciliação atrasada após blur não publica estado na tela antiga e refoco lê escolha real

    expect(received).toBeNull()

    Received: {"_fiber": {"_debugHookTypes": null, "_debugInfo": null, "_debugNeedsRemount": false, "_debugOwner": [FiberNode], "_debugStack": [Error: react-stack-top-frame], "_debugTask": null, "actualDuration": 0, "actualStartTime": 1793285997225, "alternate": null, "child": [FiberNode], "childLanes": 0, "deletions": null, "dependencies": null, "elementType": "Text", "flags": 0, "index": 0, "key": null, "lanes": 0, "memoizedProps": [Object], "memoizedState": null, "mode": 3, "pendingProps": [Object], "ref": null, "refCleanup": null, "return": [FiberNode], "selfBaseDuration": 0, "sibling": null, "stateNode": [Object], "subtreeFlags": 0, "tag": 5, "treeBaseDuration": 0, "type": "Text", "updateQueue": null}}

      248 |     await act(async () => jest.requireMock('expo-router').__blur());
      249 |     await act(async () => rejectSave(new Error('write')));
    > 250 |     expect(screen.queryByRole('alert')).toBeNull();
          |                                         ^
      251 |     push.getOptIn.mockResolvedValue(false);
      252 |     await act(async () => jest.requireMock('expo-router').__focus());
      253 |     expect(screen.getByRole('switch').props.value).toBe(false);

      at Object.toBeNull (src/features/push/components/ReminderRow.test.tsx:250:41)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

```

#### reminder-font-cap

```text
  ● texto grande mantém label e controle alcançáveis sem limite artificial

    expect(received).toBeUndefined()

    Received: 2

      257 |   const Native = require('react-native'); const dimensions = jest.spyOn(Native, 'useWindowDimensions').mockReturnValue({ width: 320, height: 800, scale: 2, fontScale: 3.1 });
      258 |   try { const view = await renderRow(); for (const text of view.UNSAFE_getAllByType(Native.Text)) {
    > 259 |     expect(text.props.maxFontSizeMultiplier).toBeUndefined(); expect(text.props.numberOfLines).toBeUndefined();
          |                                              ^
      260 |   } } finally { dimensions.mockRestore(); }
      261 | });
      262 |

      at Object.toBeUndefined (src/features/push/components/ReminderRow.test.tsx:259:46)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

```

#### group-radius

```text
  ● reúne linhas numa superfície raio12 com divisórias internas, preservando controles acessíveis

    expect(received).toMatchObject(expected)

    - Expected  - 1
    + Received  + 1

      Object {
    -   "borderRadius": 12,
    +   "borderRadius": 16,
      }

      11 |   const surfaces = view.UNSAFE_getAllByType(View).filter(node => StyleSheet.flatten(node.props.style)?.backgroundColor);
      12 |   expect(surfaces).toHaveLength(1);
    > 13 |   expect(StyleSheet.flatten(surfaces[0].props.style)).toMatchObject({ borderRadius: 12 });
         |                                                       ^
      14 |   const borders = view.UNSAFE_getAllByType(View).map(node => StyleSheet.flatten(node.props.style)).filter(style => style?.borderTopWidth);
      15 |   expect(borders).toHaveLength(1);
```

#### group-uppercase

```text
  ● reúne linhas numa superfície raio12 com divisórias internas, preservando controles acessíveis

    expect(received).not.toBe(expected) // Object.is equality

    Expected: not "uppercase"

      18 |   expect(toggle).toHaveBeenCalledWith(true);
      19 |   for (const text of view.UNSAFE_getAllByType(Text)) {
    > 20 |     expect(StyleSheet.flatten(text.props.style)?.textTransform).not.toBe('uppercase');
         |                                                                     ^
      21 |     expect(text.props.maxFontSizeMultiplier).toBeUndefined(); expect(text.props.numberOfLines).toBeUndefined();
      22 |   }
      23 | });

      at Object.toBe (src/ui/components/GroupedList.test.tsx:20:69)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 skipped, 2 total
```

#### legal-destination

```text
  ● LegalLinksCard › renders Privacidade as an accessible link to the approved destination

    expect(element).toHaveProp("href", "https://saudediagnostica.com/radiant/privacidade/")

    Expected element to have prop:
      href="https://saudediagnostica.com/radiant/privacidade/"
    Received:
      href="https://saudediagnostica.com/radiant/suporte/"

      30 |
      31 |     const link = screen.getByRole('link', { name: label });
    > 32 |     expect(link).toHaveProp('href', href);
         |                  ^
      33 |     expect(link.props.accessibilityHint).toContain('navegador interno');
      34 |   });
      35 |

      at toHaveProp (src/features/progress/components/LegalLinksCard.test.tsx:32:18)
```

#### legal-support-missing

```text
  ● LegalLinksCard › renders Central de Suporte as an accessible link to the approved destination

    Unable to find an element with role: link, name: Central de Suporte

    [36m<View>[39m
      [36m<View>[39m
        [36m<View>[39m
          [36m<View[39m
            [33maccessibilityHint[39m=[32m"Abre a política de privacidade no navegador interno."[39m
            [33maccessibilityLabel[39m=[32m"Privacidade"[39m
            [33maccessibilityRole[39m=[32m"link"[39m
            [33maccessible[39m=[32m{true}[39m
          [36m>[39m
            [36m<Text>[39m
              [0mPrivacidade[0m
            [36m</Text>[39m
            [36m<ViewManagerAdapter_SymbolModule />[39m
          [36m</View>[39m
```

#### subscription-renewal-unknown

```text
  ● SubscriptionCard › renovação desconhecida mostra o acesso, e nunca "Cancelada" (ADR 2026-09-25, 2A)

    Unable to find an element with text: Ativa · acesso até 14/10/2026

    [36m<View>[39m
      [36m<View>[39m
        [36m<View>[39m
          [36m<View[39m
            [33maccessibilityHint[39m=[32m"Assinante · vidas ilimitadas. Cancelada · válida até 14/10/2026 Abre a tela da assinatura."[39m
            [33maccessibilityLabel[39m=[32m"Gerenciar"[39m
            [33maccessibilityRole[39m=[32m"button"[39m
            [33maccessible[39m=[32m{true}[39m
          [36m>[39m
            [36m<View>[39m
              [36m<Text>[39m
                [0mAssinante · vidas ilimitadas[0m
              [36m</Text>[39m
              [36m<Text>[39m
```

#### subscription-pending-door

```text
  ● SubscriptionCard › pendente informa que aguarda aprovação e continua abrindo a tela

    Unable to find an element with role: button, name: Ver

    [36m<View>[39m
      [36m<View>[39m
        [36m<View>[39m
          [36m<View[39m
            [33maccessibilityHint[39m=[32m"Radiant Ilimitado. Pedido aguardando aprovação Abre a tela da assinatura."[39m
            [33maccessibilityLabel[39m=[32m"Radiant Ilimitado"[39m
            [33maccessibilityRole[39m=[32m"button"[39m
            [33maccessible[39m=[32m{true}[39m
          [36m>[39m
            [36m<View>[39m
              [36m<Text>[39m
                [0mRadiant Ilimitado[0m
              [36m</Text>[39m
              [36m<Text>[39m
```

#### feedback-loading

```text
  ● aguarda leitura antes de gravar, sem transformar defaults visuais em escolha sobre a preferência desconhecida

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      36 |   const change = jest.fn(); render(<FeedbackPreferencesCard preferences={null} onChange={change} />);
      37 |   const sounds = screen.getByRole('switch', { name: 'Sons' });
    > 38 |   expect(sounds.props.disabled).toBe(true);
         |                                 ^
      39 |   fireEvent(sounds, 'valueChange', false);
      40 |   expect(change).not.toHaveBeenCalled();
      41 | });

      at Object.toBe (src/features/profile/components/FeedbackPreferencesCard.test.tsx:38:33)

Test Suites: 1 failed, 1 total
```

## Snapshot congelado

Brief-r3 `7f2d863845e93a8d06f0321967c64d2f03c74285a5b9f828a00a72f9138874b2`; manifesto `c190d3bb10823ee779becc7b19263c289b702d378ec7ee3d28d5dfb45e78bacd`; diff integral `cd95dafaacd8036cba2aa85b4ec5e3f62d9e7783a7e8e69447e16eeb81c2386b`.

| Caminho | SHA-256 |
|---|---|
| `radiant-app/src/features/settings/screens/SettingsScreen.tsx` | `1728d58d5a122062a20c25ffd049f5784397426fd2407c2c479cd946b43f7013` |
| `radiant-app/src/features/settings/screens/SettingsScreen.flow.test.tsx` | `2b577d139a074839e7d98d9a678d5baecb7630e28824c14616074f8e8956afc0` |
| `radiant-app/src/ui/components/GroupedList.tsx` | `11eae68e0afbba836f1600283d4a9cf631e71aed8ad845060664d6b4b4e236f6` |
| `radiant-app/src/ui/components/GroupedList.test.tsx` | `8b0aa4da5c9371f4c5cecaf6c7bdb7d4e4c8f1e179a73eb54ede04f1f8ea8108` |
| `radiant-app/src/features/subscription/components/SubscriptionCard.tsx` | `06c73de422f0c36461928f54354b530b162c1147c74449c3efb9480722895c4f` |
| `radiant-app/src/features/subscription/components/SubscriptionCard.test.tsx` | `fd98caab1fe20704dddf0a0a37f8b3c63a0e7e1040cd9f73b60ead8b1b68ca9b` |
| `radiant-app/src/features/progress-sync/components/ICloudBackupCard.tsx` | `9412ff08f24e39738a9d910bb3dc42eb0f7d4d2db241fb08145de19b107a09da` |
| `radiant-app/src/features/progress-sync/components/ICloudBackupCard.test.tsx` | `732f4143e797e4999522a9070ddf988d516e664772eff38184e79a7d018db320` |
| `radiant-app/src/features/profile/components/FeedbackPreferencesCard.tsx` | `a513e9da0122b4c5f962029a0304c2da8d9309bb1f9f9571bd96e2c0e279eca3` |
| `radiant-app/src/features/profile/components/FeedbackPreferencesCard.test.tsx` | `94075804a783c317921be9d22c448a8aec563c248e2a5058363e959c02088b96` |
| `radiant-app/src/features/progress/components/LegalLinksCard.tsx` | `bf14c3b7721a4d5c57d7bedd07f8241fc7e61e282b7bfcfc00c35c147b87dd0f` |
| `radiant-app/src/features/progress/components/LegalLinksCard.test.tsx` | `90c35f67e4ee715e33f64678279938ad1fa3062b6621fd8c6852d1f282aa6f4f` |
| `radiant-app/src/features/profile/screens/ProfileScreen.tsx` | `44ab9b7d0890cc5cf8d2c0be08618aefa4ecf16bf033758d9af205432d12406e` |
| `radiant-app/src/features/profile/screens/ProfileScreen.flow.test.tsx` | `7152add679541c852c2508354ccd699c38d285f4ed3223713042b3682071c188` |
| `radiant-app/src/features/profile/components/TodayGoals.tsx` | `c9e3ea65ea280263cb5bc1326a354df98f7461bda6107b1279529344ea1b9794` |
| `radiant-app/src/features/profile/components/TodayGoals.test.tsx` | `82e0e9e052d3dd90e2e3655d8dd670e4b998356ce57a58429c848132e50423cd` |
| `radiant-app/src/features/profile/components/ProfileIdentityHeader.tsx` | `9569cea33c3660b692fe322c619cf77f353667d8994f0edf503584e548d82ad5` |
| `radiant-app/src/features/profile/components/ProfileIdentityHeader.test.tsx` | `cb6ea7e711f65a51efb80a4a87f05e7c1ab5a301d5a0d3eccbbcdf3f9861c5f6` |
| `radiant-app/src/features/push/components/ReminderRow.tsx` | `df42be2f6f19de8ed5de11a5258c938ed0e6090aa1e5c31ea1927ca9d88c7aa7` |
| `radiant-app/src/features/push/components/ReminderRow.test.tsx` | `8c6dc9ed73a4e6fa38e8ba77dac57611d37f2f72db4ae760dafeae747e3c226f` |
| `radiant-app/src/features/journey/screens/JourneyHomeScreen.flow.test.tsx` | `aa50c1785c1abbb4c3841806f80abbf9637861368884c72245b575ac2bf34589` |
| `radiant-app/scripts/copy-style-baseline.json` | `9ce37d534bc44e6905ff483077087195bdf9c49ff4a9e65104213866f5b8dfec` |
| `radiant-app/src/features/first-run/screens/WelcomeFlowReentry.test.tsx` | `170bc3de2de3f37afa210fd22240926e3323a2e5bb7a97844dd9e378731dbe93` |

Revisão independente em andamento; ainda sem prova nativa T10 ou final Loop.

## FIX1 — evidência final27, separada da R1 reprovada

29/10/2026. Os dois P2 motivaram ordenação dos produtores existentes.
374testes normais em25suítes (170focais+204consumidores disjuntos);
CPU40 é repetição. Tipos,105contratos e strict473/0regressões aprovados.
Lint exit0 com24avisos fora do ownership. Revisão independente R2 pendente.
Sem nativo, qualidade completa ou validação final executados nesta evidência.
Filas vivem no processo JS; não cancelam I/O nem criam transação durável.
Back continua disponível. Nenhuma fórmula, esquema, consentimento ou política nova.

Relatório local fix1.md SHA `3d29477931edda393d025ef318c27119ebbc2bd35a85026330db4b1a834f8bd7`.
FreezeR2 SHA `40f211bdd567fcc04a0fee17aac33b42ebd5c7a491d6f83e84eac546bf6f34cb`.
Manifesto `33f034206a63bc1ba14279d59d277c9e6984bd215bc828d527f953b71893a9e9`; full contraBASE `caf41112bc2bb35134db648675e467f150e8a9b8f0aca09ee562e57968a24638`; deltaR1 `48bcb242c5d057c8bb9c07b3a3c60687f9f5b345ff0fc55bab0ae3e885370273`.

### fix1-red-goal

Recibo original SHA `b06a156780f2f94e19ac3fc81e49f6bb3d34a26064878dd4cf9e474c6b23e575`; log SHA `7b4cf17a221bb474530cb9c40d7287d349e515b112ac2f6b398c0c15bc10a3d9`. Cwd normalizado abaixo; comando/ambiente/exit preservados.

```json
{
  "command": [
    "npx",
    "--no-install",
    "jest",
    "--runInBand",
    "--no-cache",
    "src/features/daily-goal/services/DailyGoalService.test.ts",
    "src/features/settings/screens/SettingsScreen.flow.test.tsx",
    "-t",
    "ordenação entre consumidores|POP real|POP com falha"
  ],
  "cwd": "radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 1,
  "seconds": 14.23
}
```

```text
  ● Console

    console.warn
      No native ExponentConstants module found, are you sure the expo-constants's module is linked properly?

    > 1 | import * as Haptics from 'expo-haptics';
        | ^
      2 |
      3 | /**
      4 |  * Feedback tátil dos momentos que importam.

      at Object.warn (node_modules/expo-constants/src/Constants.ts:42:11)
      at Object.require (node_modules/expo-asset/src/PlatformUtils.ts:1:1)
      at Object.require (node_modules/expo-asset/src/AssetSources.ts:6:1)
      at Object.require (node_modules/expo-asset/src/Asset.ts:4:1)
      at Object.require (node_modules/expo-asset/src/Asset.fx.ts:3:1)
      at Object.require (node_modules/expo-asset/src/index.ts:1:1)
      at Object.require (node_modules/expo/src/Expo.fx.tsx:4:1)
...
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 2 failed, 2 total
Tests:       7 failed, 24 skipped, 2 passed, 33 total
Snapshots:   0 total
Time:        9.318 s
Ran all test suites matching /src\/features\/daily-goal\/services\/DailyGoalService.test.ts|src\/features\/settings\/screens\/SettingsScreen.flow.test.tsx/i with tests matching "ordenação entre consumidores|POP real|POP com falha".
```

### fix1-red-reminder-lifetime

Recibo original SHA `27d6a6b4eb7653ac27f913e25156284d2e41b7f709268359bb05c727a63c7455`; log SHA `f295990076c856e4b7ef9c9a352079b54fc957f60e37ea09f077718ced95b163`. Cwd normalizado abaixo; comando/ambiente/exit preservados.

```json
{
  "command": [
    "npx",
    "--no-install",
    "jest",
    "--runInBand",
    "--no-cache",
    "src/features/push/components/ReminderRow.test.tsx",
    "-t",
    "A desmontada"
  ],
  "cwd": "radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 1,
  "seconds": 4.82
}
```

```text
  ● A desmontada com segunda permissão pendente → B nova não publica true intermediário; final granted

    expect(received).toBeNull()

    Received: {"_fiber": {"_debugHookTypes": null, "_debugInfo": null, "_debugNeedsRemount": false, "_debugOwner": [FiberNode], "_debugStack": [Error: react-stack-top-frame], "_debugTask": null, "actualDuration": 0, "actualStartTime": 1793288048598, "alternate": null, "child": null, "childLanes": 0, "deletions": null, "dependencies": null, "elementType": "RCTSwitch", "flags": 0, "index": 0, "key": null, "lanes": 0, "memoizedProps": [Object], "memoizedState": null, "mode": 3, "pendingProps": [Object], "ref": null, "refCleanup": null, "return": [FiberNode], "selfBaseDuration": 0, "sibling": null, "stateNode": [Object], "subtreeFlags": 0, "tag": 5, "treeBaseDuration": 0, "type": "RCTSwitch", "updateQueue": null}}

      129 |   a.unmount(); const b = render(<ReminderRow visible />);
      130 |   try { await act(async () => undefined);
    > 131 |     expect(screen.queryByRole('switch')).toBeNull(); expect(screen.getByText('Carregando lembrete…')).toBeTruthy();
          |                                          ^
      132 |     await act(async () => outcome === 'native-error' ? gate.reject(new Error('native')) : gate.resolve({ status: outcome } as never));
      133 |     expect(screen.getByRole('switch').props.value).toBe(outcome === 'granted');
      134 |     expect(await AsyncStorage.getItem(OPT_IN)).toBe(String(outcome === 'granted'));

      at toBeNull (src/features/push/components/ReminderRow.test.tsx:131:42)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

...
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       3 failed, 11 skipped, 14 total
Snapshots:   0 total
Time:        2.015 s
Ran all test suites matching /src\/features\/push\/components\/ReminderRow.test.tsx/i with tests matching "A desmontada".
```

### fix1-green-lifetime

Recibo original SHA `67a39bddf5f62116500fb4e431bbe3c327d2c84efc8fc9fdc9364708d8f7db77`; log SHA `259346bff47a886cc5d537281ca8caba6f4af4c803f7d187a76e105735e7471a`. Cwd normalizado abaixo; comando/ambiente/exit preservados.

```json
{
  "command": [
    "npx",
    "--no-install",
    "jest",
    "--runInBand",
    "--no-cache",
    "src/features/daily-goal/services/DailyGoalService.test.ts",
    "src/features/settings/screens/SettingsScreen.flow.test.tsx",
    "src/features/push/components/ReminderRow.test.tsx"
  ],
  "cwd": "radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 0,
  "seconds": 11.25
}
```

```text
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)


Test Suites: 3 passed, 3 total
Tests:       47 passed, 47 total
Snapshots:   0 total
Time:        8.625 s
Ran all test suites matching /src\/features\/daily-goal\/services\/DailyGoalService.test.ts|src\/features\/settings\/screens\/SettingsScreen.flow.test.tsx|src\/features\/push\/components\/ReminderRow.test.tsx/i.
```

### fix1-red-date-argument

Recibo original SHA `b947e7c12632dc463eba744438c3f234cc86fa234aad67b41d6fa3f49e7e4946`; log SHA `a30fa7585b40d600e5a5fe2f503c362b4c8b24ac2b18737dd4d01128f245caa6`. Cwd normalizado abaixo; comando/ambiente/exit preservados.

```json
{
  "command": [
    "npx",
    "--no-install",
    "jest",
    "--runInBand",
    "--no-cache",
    "src/features/daily-goal/services/DailyGoalService.test.ts",
    "-t",
    "captura Date recebido"
  ],
  "cwd": "radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 1,
  "seconds": 3.15
}
```

```text
  ● DailyGoalService — ordenação entre consumidores › captura Date recebido na entrada de read antes da espera, sem mudar o dia pelo objeto mutável do chamador

    expect(received).toMatchObject(expected)

    - Expected  - 2
    + Received  + 2

      Object {
    -   "dateKey": "2026-10-29",
    -   "earnedXpToday": 7,
    +   "dateKey": "2026-10-30",
    +   "earnedXpToday": 0,
        "goalXp": 35,
      }

      165 |     const following = kind === 'read' ? DailyGoalService.getSnapshot(atCall) : kind === 'award' ? DailyGoalService.recordXp(5, atCall) : DailyGoalService.setTier('challenge', atCall);
      166 |     try { atCall.setDate(30); gate.resolve(); await save;
    > 167 |       expect(await following).toMatchObject({ dateKey: '2026-10-29', earnedXpToday: kind === 'award' ? 12 : 7, goalXp: kind === 'tier' ? 50 : 35 });
...
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       3 failed, 10 skipped, 13 total
Snapshots:   0 total
Time:        0.626 s
Ran all test suites matching /src\/features\/daily-goal\/services\/DailyGoalService.test.ts/i with tests matching "captura Date recebido".
```

### fix1-green-date-argument

Recibo original SHA `66cf10e08e3f5e1419e057beba925a24adf19bbda6a98ed61140182b7f31f22f`; log SHA `0d4d5951343f9b079748699a12a470db4a0b31cc0de62af3569b8cfef1f94eb6`. Cwd normalizado abaixo; comando/ambiente/exit preservados.

```json
{
  "command": [
    "npx",
    "--no-install",
    "jest",
    "--runInBand",
    "--no-cache",
    "src/features/daily-goal/services/DailyGoalService.test.ts"
  ],
  "cwd": "radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 0,
  "seconds": 3.14
}
```

```text
    ✓ captura Date recebido na entrada de tier antes da espera, sem mudar o dia pelo objeto mutável do chamador
    ✓ alias recordQuizCompletion termina sem reenfileirar a própria espera

Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        0.623 s
Ran all test suites matching /src\/features\/daily-goal\/services\/DailyGoalService.test.ts/i.
```

### fix1-final-focals

Recibo original SHA `b905d4a5b4e75fc73517bac4e08faab29c8fc858d1a1cf2501ae0ef858e53079`; log SHA `b299c891b1042b5c4412d7d0a6d1354f9ab7a7e49df598e0211de668fd361d97`. Cwd normalizado abaixo; comando/ambiente/exit preservados.

```json
{
  "command": [
    "npx",
    "--no-install",
    "jest",
    "--runInBand",
    "--no-cache",
    "src/features/settings/screens/SettingsScreen.flow.test.tsx",
    "src/ui/components/GroupedList.test.tsx",
    "src/features/subscription/components/SubscriptionCard.test.tsx",
    "src/features/progress-sync/components/ICloudBackupCard.test.tsx",
    "src/features/profile/components/FeedbackPreferencesCard.test.tsx",
    "src/features/progress/components/LegalLinksCard.test.tsx",
    "src/features/profile/screens/ProfileScreen.flow.test.tsx",
    "src/features/profile/components/TodayGoals.test.tsx",
    "src/features/profile/components/ProfileIdentityHeader.test.tsx",
    "src/features/push/components/ReminderRow.test.tsx",
    "src/features/journey/screens/JourneyHomeScreen.flow.test.tsx",
    "src/features/first-run/screens/WelcomeFlowReentry.test.tsx",
    "src/features/daily-goal/services/DailyGoalService.test.ts",
    "src/features/push/services/PushService.test.ts"
  ],
  "cwd": "radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 0,
  "seconds": 27.23
}
```

```text
PASS src/features/profile/components/ProfileIdentityHeader.test.tsx
PASS src/features/progress/components/LegalLinksCard.test.tsx

Test Suites: 14 passed, 14 total
Tests:       170 passed, 170 total
Snapshots:   0 total
Time:        24.689 s
Ran all test suites matching /src\/features\/settings\/screens\/SettingsScreen.flow.test.tsx|src\/ui\/components\/GroupedList.test.tsx|src\/features\/subscription\/components\/SubscriptionCard.test.tsx|src\/features\/progress-sync\/components\/ICloudBackupCard.test.tsx|src\/features\/profile\/components\/FeedbackPreferencesCard.test.tsx|src\/features\/progress\/components\/LegalLinksCard.test.tsx|src\/features\/profile\/screens\/ProfileScreen.flow.test.tsx|src\/features\/profile\/components\/TodayGoals.test.tsx|src\/features\/profile\/components\/ProfileIdentityHeader.test.tsx|src\/features\/push\/components\/ReminderRow.test.tsx|src\/features\/journey\/screens\/JourneyHomeScreen.flow.test.tsx|src\/features\/first-run\/screens\/WelcomeFlowReentry.test.tsx|src\/features\/daily-goal\/services\/DailyGoalService.test.ts|src\/features\/push\/services\/PushService.test.ts/i.
```

### fix1-final-consumers

Recibo original SHA `bf3d1bbbb93dad2fd3e72994b90a676ed21a8999c9bf31cc77ff483f99c3c7df`; log SHA `b0f394315e5b941b5c895fadd1ed5ffddcd1ca7245e63219b42e9293e6338201`. Cwd normalizado abaixo; comando/ambiente/exit preservados.

```json
{
  "command": [
    "npx",
    "--no-install",
    "jest",
    "--runInBand",
    "--no-cache",
    "src/features/subscription/screens/SubscriptionScreen.flow.test.tsx",
    "src/features/progress/components/AccountSyncCard.test.tsx",
    "components/external-link.test.tsx",
    "src/features/progress-sync/ProgressSyncService.test.ts",
    "src/features/progress-sync/CloudKitPrivateAdapter.test.ts",
    "src/ui/feedback/feedbackPreferences.test.ts",
    "src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx",
    "src/features/push/components/PushOptInCard.test.tsx",
    "src/features/home/screens/HomeScreen.flow.test.tsx",
    "src/features/review/screens/ReviewScreen.flow.test.tsx",
    "src/features/telemetry/hooks/useAppOpenLifecycle.test.ts"
  ],
  "cwd": "radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 0,
  "seconds": 15.05
}
```

```text
PASS components/external-link.test.tsx
PASS src/ui/feedback/feedbackPreferences.test.ts

Test Suites: 11 passed, 11 total
Tests:       204 passed, 204 total
Snapshots:   0 total
Time:        12.294 s
Ran all test suites matching /src\/features\/subscription\/screens\/SubscriptionScreen.flow.test.tsx|src\/features\/progress\/components\/AccountSyncCard.test.tsx|components\/external-link.test.tsx|src\/features\/progress-sync\/ProgressSyncService.test.ts|src\/features\/progress-sync\/CloudKitPrivateAdapter.test.ts|src\/ui\/feedback\/feedbackPreferences.test.ts|src\/features\/first-run\/screens\/WelcomeFlowScreen.flow.test.tsx|src\/features\/push\/components\/PushOptInCard.test.tsx|src\/features\/home\/screens\/HomeScreen.flow.test.tsx|src\/features\/review\/screens\/ReviewScreen.flow.test.tsx|src\/features\/telemetry\/hooks\/useAppOpenLifecycle.test.ts/i.
```

### fix1-final-cpu

Recibo original SHA `53ab7d298595961b8a2ee191363112b3e4866e6a1a5eb44fe28237b50beccc53`; log SHA `6385cdb3a872c0f55ed02dc3f30ddba2d146bd8f904fb5c1a7fa9b2c9416b6e6`. Cwd normalizado abaixo; comando/ambiente/exit preservados.

```json
{
  "command": [
    "/usr/sbin/taskpolicy",
    "-b",
    "env",
    "EXPO_NO_DOTENV=1",
    "npx",
    "--no-install",
    "jest",
    "--runInBand",
    "--no-cache",
    "src/features/settings/screens/SettingsScreen.flow.test.tsx",
    "src/features/push/components/ReminderRow.test.tsx"
  ],
  "cwd": "radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 0,
  "seconds": 56.01
}
```

```text
      at PushServiceImpl.log (src/features/push/services/PushService.ts:482:17)


Test Suites: 2 passed, 2 total
Tests:       40 passed, 40 total
Snapshots:   0 total
Time:        46.429 s
Ran all test suites matching /src\/features\/settings\/screens\/SettingsScreen.flow.test.tsx|src\/features\/push\/components\/ReminderRow.test.tsx/i.
```

### fix1-final-typecheck

Recibo original SHA `1097f966139c5cb98db4ac439de4d12292a6d684c2cd59dbef3973c744a9761d`; log SHA `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`. Cwd normalizado abaixo; comando/ambiente/exit preservados.

```json
{
  "command": [
    "npx",
    "--no-install",
    "tsc",
    "--noEmit"
  ],
  "cwd": "radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 0,
  "seconds": 5.27
}
```

```text

```

### fix1-final-lint

Recibo original SHA `00556b2f732dbe636821178fc96a0975294daaf635af1322dc2301e0e572ab85`; log SHA `f3d07d7c81419213cb830f5757c82febb5c99d2c39948d938ffb0cb58107d604`. Cwd normalizado abaixo; comando/ambiente/exit preservados.

```json
{
  "command": [
    "npm",
    "run",
    "lint"
  ],
  "cwd": "radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 0,
  "seconds": 11.11
}
```

```text

<worktree>/radiant-app/src/ui/characters/PixelFace.tsx
  101:6  warning  React Hook useEffect has missing dependencies: 'arcMix', 'eyeH', 'eyeOffsetY', 'eyeRadius', 'eyeRotate', 'eyeW', 'mouthDip', 'mouthThickness', and 'mouthW'. Either include them or remove the dependency array  react-hooks/exhaustive-deps
  127:6  warning  React Hook useEffect has a missing dependency: 'blink'. Either include it or remove the dependency array                                                                                                         react-hooks/exhaustive-deps

✖ 24 problems (0 errors, 24 warnings)
  0 errors and 9 warnings potentially fixable with the `--fix` option.

```

### fix1-final-visual

Recibo original SHA `ad21df9c5949266b4e1204e8281eb4ec2e3818126357a3777b20219ebcc3545e`; log SHA `9d803fe81ff3f2fd1f4fb3b7bd3bc7cfade17ef3da42f39a413ea1391a276994`. Cwd normalizado abaixo; comando/ambiente/exit preservados.

```json
{
  "command": [
    "npm",
    "run",
    "visual:qa:strict"
  ],
  "cwd": "radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 0,
  "seconds": 0.34
}
```

```text

👁  Starting Radiant Visual QA...

------------------------------------------------
Scanned 473 files.
Found 44 issues: 0 regressions, 41 baselined, 3 scoped exceptions.

✅ Visual QA passed without unapproved regressions.
```

### fix1-final-contracts

Recibo original SHA `f0c596988a5535862b0fbde4d99114f56b394ebebf77d7a8a9279cd2b18c881a`; log SHA `75726ca44567ca07a7e91e7af27c22ed9f205dfe88b259eb1bb1dff19719115a`. Cwd normalizado abaixo; comando/ambiente/exit preservados.

```json
{
  "command": [
    "node",
    "--test",
    "scripts/copy-style-contract.test.mjs",
    "scripts/maestro-contract.test.mjs"
  ],
  "cwd": "radiant-app",
  "node": "v20.20.2",
  "EXPO_NO_DOTENV": "1",
  "exit": 0,
  "seconds": 0.82
}
```

```text
# tests 105
# suites 0
# pass 105
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 795.178666
```

### Mutações FIX1:17aceitas,1descartada

18tentativas com nomes distintos. goal-tail-poison inicial terminou por rejeição
não tratada, sem asserção causal; descartada. A variante observed mantém a cauda
rejeitada e observa a rejeição lateralmente, permitindo a asserção do próximo
consumidor falhar. Deadlocks nomeados usam timeout normal5000ms com I/O liberado.
Nenhum timeout foi adicionado à produção. As mutações precederam a cópia defensiva
dos Date recebidos; essa última mudança tem seu próprio vermelho/verde acima.
Os gates finais mediram a fonte final com a cópia. Todos os mutantes foram restaurados.

| Defeito aceito | Teste focal | SHA do log |
|---|---|---|
| goal-read-outside | POP real.*profile | `6a6b27da154cb0ad3e11931cd391bbc4df3433b9922de1b33d46d7c02ccf585b` |
| goal-write-outside | POP real.*settings | `968d9ee70ec1c5d2cc4744c7bbc50de6fd70df3ddcc7cfbdac43acbe386fe673` |
| goal-xp-outside | recordXp depois | `3153f8870ba82057a92273e392416b153553513ec5dc58504cdacc4f98792a58` |
| goal-reset-outside | reset depois | `147903ba69368261dc2096e643fbf84da416305627a011727f1ff02ccd14c833` |
| goal-tail-poison-observed | rejeita o save publicamente | `431c3084a4111c1fae9591974f4b5e8924a18d22ba9ed784d3d79c3c4ea09e0c` |
| goal-false-success | rejeita o save publicamente | `069bb03081f8dca3e7bae2557a9eacd3402fc8606715312db9cfe3d02a646298` |
| goal-date-recaptured | Date default fica | `e3b54245777c1af372e94bb8a029d29939a2fc22e3d58287077b27b3a5faabe5` |
| goal-alias-deadlock | alias recordQuizCompletion | `65a4f15cc470a7ee0aebf47260eae148d08b86f5cab530629490966c18de9b76` |
| push-read-outside | A desmontada.*final denied | `62c520eac2294f328a475877f6a5045200db77f0348a24d1e830e91182d58c5a` |
| push-partial-transaction | leitor, scheduler externo | `dbda5f1952774400444f4676ce84723afc991315fb00ce36e090d88f14e11be9` |
| push-scheduler-outside | leitor, scheduler externo | `85ab50ad5e3c57054d218c66448137ef42bef7be93e856b2b5dcca8af8b988cd` |
| push-legacy-write-outside | leitor, scheduler externo | `5bd8aa7d87ef52cb62d83d1a11f3d3cd598abb1650f0291e61fdad4d9fb754c1` |
| push-tail-poison-observed | rejeição de agendamento é pública | `fbf6b40ca7b368f1376c47a202634ee2ba20a4c9e7bb3389e78d973aa564b324` |
| push-false-success | rejeição de gravação não fabrica | `c6b563d34d59f3ad4bc090d477098cca56988f29771b17170fc9095015959822` |
| push-internal-deadlock | grant, deny e false completos | `a5793b28b363a290a62e6da6aa8559a5ad266542e7b8246bbc907639efa4f806` |
| reminder-split-transaction | A desmontada.*final denied | `422f3fbcc36145e78aa2003e68cc879faf35ba190326e52aab17df2e796925ef` |
| reminder-double-guard | duplo callback local | `2f8e79d07f36e55b178e25b12a4616073c6fb2d8b65cd514cd67971b5a07ae72` |

#### goal-read-outside

```text
  ● POP real da montagem A: profile novo espera I/O da meta e recebe persistido sem refoco extra

    Unable to find an element with text: Carregando meta…

    [36m<View>[39m
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
```

#### goal-write-outside

```text
  ● POP real da montagem A: settings novo espera I/O da meta e recebe persistido sem refoco extra

    Unable to find an element with text: Carregando meta…

    [36m<View>[39m
      [36m<RNCSafeAreaView>[39m
        [36m<View>[39m
          [36m<View[39m
            [33maccessibilityLabel[39m=[32m"Voltar ao Perfil"[39m
            [33maccessibilityRole[39m=[32m"button"[39m
            [33maccessible[39m=[32m{true}[39m
          [36m>[39m
            [36m<ViewManagerAdapter_SymbolModule />[39m
            [36m<Text>[39m
              [0mPerfil[0m
            [36m</Text>[39m
          [36m</View>[39m
          [36m<Text[39m
```

#### goal-xp-outside

```text
  ● DailyGoalService — ordenação entre consumidores › recordXp depois de setTier preserva ambos os efeitos na ordem, sem mudar o cap

    expect(received).toMatchObject(expected)

    - Expected  - 1
    + Received  + 1

      Object {
    -   "earnedXpToday": 12,
    +   "earnedXpToday": 7,
        "goalXp": 35,
        "tierId": "focus",
      }

      112 |       await Promise.resolve(); await Promise.resolve(); gate.resolve();
      113 |       await save; await award;
    > 114 |       expect(await DailyGoalService.getSnapshot(now)).toMatchObject({ tierId: 'focus', goalXp: 35, earnedXpToday: 12 });
          |                                                       ^
```

#### goal-reset-outside

```text
  ● DailyGoalService — ordenação entre consumidores › reset depois de save pendente não ressuscita o registro apagado

    expect(received).toMatchObject(expected)

    - Expected  - 3
    + Received  + 3

      Object {
    -   "earnedXpToday": 0,
    -   "goalXp": 10,
    -   "tierId": "start",
    +   "earnedXpToday": 7,
    +   "goalXp": 35,
    +   "tierId": "focus",
      }

      123 |     const reset = DailyGoalService.reset();
      124 |     try { await Promise.resolve(); gate.resolve(); await save; await reset;
```

#### goal-tail-poison-observed

```text
  ● DailyGoalService — ordenação entre consumidores › rejeita o save publicamente, recupera a fila e permite leitura e próxima escrita

    expect(received).resolves.toMatchObject()

    Received promise rejected instead of resolved
    Rejected to value: [Error: disk]

      132 |     try {
      133 |       await expect(DailyGoalService.setTier('focus', now)).rejects.toThrow('disk');
    > 134 |       await expect(DailyGoalService.getSnapshot(now)).resolves.toMatchObject({ tierId: 'start', goalXp: 10 });
          |             ^
      135 |       expect(await DailyGoalService.setTier('challenge', now)).toMatchObject({ tierId: 'challenge', goalXp: 50 });
      136 |     } finally { error.mockRestore(); }
      137 |   });

      at expect (node_modules/expect/build/index.js:113:15)
      at Object.expect (src/features/daily-goal/services/DailyGoalService.test.ts:134:13)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
```

#### goal-false-success

```text
  ● DailyGoalService — ordenação entre consumidores › rejeita o save publicamente, recupera a fila e permite leitura e próxima escrita

    expect(received).rejects.toThrow()

    Received promise resolved instead of rejected
    Resolved to value: undefined

      131 |     mockedStorage.setItem.mockRejectedValueOnce(new Error('disk'));
      132 |     try {
    > 133 |       await expect(DailyGoalService.setTier('focus', now)).rejects.toThrow('disk');
          |             ^
      134 |       await expect(DailyGoalService.getSnapshot(now)).resolves.toMatchObject({ tierId: 'start', goalXp: 10 });
      135 |       expect(await DailyGoalService.setTier('challenge', now)).toMatchObject({ tierId: 'challenge', goalXp: 50 });
      136 |     } finally { error.mockRestore(); }

      at expect (node_modules/expect/build/index.js:113:15)
      at Object.expect (src/features/daily-goal/services/DailyGoalService.test.ts:133:13)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
```

#### goal-date-recaptured

```text
  ● DailyGoalService — ordenação entre consumidores › Date default fica no instante da chamada, mesmo atravessando a meia-noite na fila

    expect(received).toMatchObject(expected)

    - Expected  - 2
    + Received  + 2

      Object {
    -   "dateKey": "2026-10-29",
    -   "earnedXpToday": 7,
    +   "dateKey": "2026-10-30",
    +   "earnedXpToday": 0,
        "tierId": "focus",
      }

      154 |     const read = DailyGoalService.getSnapshot();
      155 |     try { jest.setSystemTime(new Date(2026, 9, 30, 0, 1)); gate.resolve(); await save;
    > 156 |       expect(await read).toMatchObject({ dateKey: '2026-10-29', tierId: 'focus', earnedXpToday: 7 });
```

#### goal-alias-deadlock

```text
  ● DailyGoalService — ordenação entre consumidores › alias recordQuizCompletion termina sem reenfileirar a própria espera

    thrown: "Exceeded timeout of 5000 ms for a test.
    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."

      158 |   });
      159 |
    > 160 |   it('alias recordQuizCompletion termina sem reenfileirar a própria espera', async () => {
          |   ^
      161 |     expect(await DailyGoalService.recordQuizCompletion(now)).toMatchObject({ tierId: 'start', earnedXpToday: 10, goalXp: 10 });
      162 |   });
      163 | });

      at it (src/features/daily-goal/services/DailyGoalService.test.ts:160:3)
      at Object.describe (src/features/daily-goal/services/DailyGoalService.test.ts:83:1)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 9 skipped, 10 total
```

#### push-read-outside

```text
  ● A desmontada com segunda permissão pendente → B nova não publica true intermediário; final denied

    expect(received).toBeNull()

    Received: {"_fiber": {"_debugHookTypes": null, "_debugInfo": null, "_debugNeedsRemount": false, "_debugOwner": [FiberNode], "_debugStack": [Error: react-stack-top-frame], "_debugTask": null, "actualDuration": 0, "actualStartTime": 1793288642742, "alternate": null, "child": null, "childLanes": 0, "deletions": null, "dependencies": null, "elementType": "RCTSwitch", "flags": 0, "index": 0, "key": null, "lanes": 0, "memoizedProps": [Object], "memoizedState": null, "mode": 3, "pendingProps": [Object], "ref": null, "refCleanup": null, "return": [FiberNode], "selfBaseDuration": 0, "sibling": null, "stateNode": [Object], "subtreeFlags": 0, "tag": 5, "treeBaseDuration": 0, "type": "RCTSwitch", "updateQueue": null}}

      133 |   a.unmount(); const b = render(<ReminderRow visible />);
      134 |   try { await act(async () => undefined);
    > 135 |     expect(screen.queryByRole('switch')).toBeNull(); expect(screen.getByText('Carregando lembrete…')).toBeTruthy();
          |                                          ^
      136 |     await act(async () => outcome === 'native-error' ? gate.reject(new Error('native')) : gate.resolve({ status: outcome } as never));
      137 |     expect(screen.getByRole('switch').props.value).toBe(outcome === 'granted');
      138 |     expect(await AsyncStorage.getItem(OPT_IN)).toBe(String(outcome === 'granted'));

      at toBeNull (src/features/push/components/ReminderRow.test.tsx:135:42)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

```

#### push-partial-transaction

```text
  ● PushService — transação inteira entre portas › leitor, scheduler externo e setOptIn legado esperam inclusive a segunda permissão e rollback

    expect(received).toEqual(expected) // deep equality

    - Expected  - 3
    + Received  + 3

      Object {
    -   "readDone": false,
    -   "scheduled": false,
    -   "wrote": false,
    +   "readDone": true,
    +   "scheduled": true,
    +   "wrote": true,
      }

      117 |     const legacyWrite = PushService.setOptIn(false).then(() => { wrote = true; });
      118 |     try {
```

#### push-scheduler-outside

```text
  ● PushService — transação inteira entre portas › leitor, scheduler externo e setOptIn legado esperam inclusive a segunda permissão e rollback

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "readDone": false,
    -   "scheduled": false,
    +   "scheduled": true,
        "wrote": false,
      }

      117 |     const legacyWrite = PushService.setOptIn(false).then(() => { wrote = true; });
      118 |     try {
    > 119 |       await flushIO(); expect({ readDone, scheduled, wrote }).toEqual({ readDone: false, scheduled: false, wrote: false });
          |                                                               ^
```

#### push-legacy-write-outside

```text
  ● PushService — transação inteira entre portas › leitor, scheduler externo e setOptIn legado esperam inclusive a segunda permissão e rollback

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "readDone": false,
        "scheduled": false,
    -   "wrote": false,
    +   "wrote": true,
      }

      117 |     const legacyWrite = PushService.setOptIn(false).then(() => { wrote = true; });
      118 |     try {
    > 119 |       await flushIO(); expect({ readDone, scheduled, wrote }).toEqual({ readDone: false, scheduled: false, wrote: false });
          |                                                               ^
```

#### push-tail-poison-observed

```text
  ● PushService — transação inteira entre portas › rejeição de agendamento é pública, cauda recupera e próxima decisão termina

    expect(received).resolves.toBe()

    Received promise rejected instead of resolved
    Rejected to value: [Error: schedule]

      153 |     notifications.scheduleNotificationAsync.mockRejectedValueOnce(new Error('schedule'));
      154 |     await expect(PushService.changeReminderPreference(true)).rejects.toThrow('schedule');
    > 155 |     await expect(PushService.getOptIn()).resolves.toBe(true);
          |           ^
      156 |     await expect(PushService.changeReminderPreference(false)).resolves.toBe(false);
      157 |     await expect(PushService.getDebugState()).resolves.toMatchObject({ optIn: false });
      158 |   });

      at expect (node_modules/expect/build/index.js:113:15)
      at Object.expect (src/features/push/services/PushService.test.ts:155:11)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
```

#### push-false-success

```text
  ● PushService — transação inteira entre portas › rejeição de gravação não fabrica sucesso nem envenena leitura e nova escrita

    expect(received).rejects.toThrow()

    Received promise resolved instead of rejected
    Resolved to value: null

      159 |   it('rejeição de gravação não fabrica sucesso nem envenena leitura e nova escrita', async () => {
      160 |     storage.setItem.mockRejectedValueOnce(new Error('disk'));
    > 161 |     await expect(PushService.changeReminderPreference(true)).rejects.toThrow('disk');
          |           ^
      162 |     await expect(PushService.getOptIn()).resolves.toBeNull();
      163 |     await expect(PushService.changeReminderPreference(true)).resolves.toBe(true);
      164 |   });

      at expect (node_modules/expect/build/index.js:113:15)
      at Object.expect (src/features/push/services/PushService.test.ts:161:11)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
```

#### push-internal-deadlock

```text
  ● PushService — transação inteira entre portas › grant, deny e false completos não reenfileiram chamadas internas nem travam

    thrown: "Exceeded timeout of 5000 ms for a test.
    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."

      163 |     await expect(PushService.changeReminderPreference(true)).resolves.toBe(true);
      164 |   });
    > 165 |   it('grant, deny e false completos não reenfileiram chamadas internas nem travam', async () => {
          |   ^
      166 |     await expect(PushService.changeReminderPreference(true)).resolves.toBe(true);
      167 |     const track = jest.requireMock('../../telemetry/TelemetryService').TelemetryService.track;
      168 |     const events = track.mock.calls.map(([name]: [string]) => name);

      at it (src/features/push/services/PushService.test.ts:165:3)
      at Object.describe (src/features/push/services/PushService.test.ts:96:1)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 9 skipped, 10 total
```

#### reminder-split-transaction

```text
  ● A desmontada com segunda permissão pendente → B nova não publica true intermediário; final denied

    expect(received).toBe(expected) // Object.is equality

    Expected: false
    Received: true

      135 |     expect(screen.queryByRole('switch')).toBeNull(); expect(screen.getByText('Carregando lembrete…')).toBeTruthy();
      136 |     await act(async () => outcome === 'native-error' ? gate.reject(new Error('native')) : gate.resolve({ status: outcome } as never));
    > 137 |     expect(screen.getByRole('switch').props.value).toBe(outcome === 'granted');
          |                                                    ^
      138 |     expect(await AsyncStorage.getItem(OPT_IN)).toBe(String(outcome === 'granted'));
      139 |     expect(screen.queryByRole('alert')).toBeNull();
      140 |   } finally { await act(async () => gate.resolve({ status: 'denied' } as never)); await PushService.getOptIn(); b.unmount(); error.mockRestore(); }

      at toBe (src/features/push/components/ReminderRow.test.tsx:137:52)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

#### reminder-double-guard

```text
  ● duplo callback local não inicia decisão concorrente e mantém disabled até completar I/O

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      120 |     await act(async () => gate.resolve({ status: 'granted' } as never));
      121 |     await waitFor(() => expect(screen.getByRole('switch').props.disabled).toBe(false));
    > 122 |     expect(await PushService.getOptIn()).toBe(true);
          |                                          ^
      123 |     expect(storage.setItem.mock.calls.filter(([key]) => key === OPT_IN)).toEqual([[OPT_IN, 'true']]);
      124 |   } finally { await act(async () => gate.resolve({ status: 'granted' } as never)); await PushService.getOptIn(); a.unmount(); }
      125 | });

      at Object.toBe (src/features/push/components/ReminderRow.test.tsx:122:42)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

### Fontes finais27 congeladas para R2

| Caminho | SHA-256 |
|---|---|
| `radiant-app/src/features/settings/screens/SettingsScreen.tsx` | `1728d58d5a122062a20c25ffd049f5784397426fd2407c2c479cd946b43f7013` |
| `radiant-app/src/features/settings/screens/SettingsScreen.flow.test.tsx` | `389c7a0c5a69bc68aa8c08791377270c05d88e7d174862d4a03edeb72b7c3503` |
| `radiant-app/src/ui/components/GroupedList.tsx` | `11eae68e0afbba836f1600283d4a9cf631e71aed8ad845060664d6b4b4e236f6` |
| `radiant-app/src/ui/components/GroupedList.test.tsx` | `8b0aa4da5c9371f4c5cecaf6c7bdb7d4e4c8f1e179a73eb54ede04f1f8ea8108` |
| `radiant-app/src/features/subscription/components/SubscriptionCard.tsx` | `06c73de422f0c36461928f54354b530b162c1147c74449c3efb9480722895c4f` |
| `radiant-app/src/features/subscription/components/SubscriptionCard.test.tsx` | `fd98caab1fe20704dddf0a0a37f8b3c63a0e7e1040cd9f73b60ead8b1b68ca9b` |
| `radiant-app/src/features/progress-sync/components/ICloudBackupCard.tsx` | `9412ff08f24e39738a9d910bb3dc42eb0f7d4d2db241fb08145de19b107a09da` |
| `radiant-app/src/features/progress-sync/components/ICloudBackupCard.test.tsx` | `732f4143e797e4999522a9070ddf988d516e664772eff38184e79a7d018db320` |
| `radiant-app/src/features/profile/components/FeedbackPreferencesCard.tsx` | `a513e9da0122b4c5f962029a0304c2da8d9309bb1f9f9571bd96e2c0e279eca3` |
| `radiant-app/src/features/profile/components/FeedbackPreferencesCard.test.tsx` | `94075804a783c317921be9d22c448a8aec563c248e2a5058363e959c02088b96` |
| `radiant-app/src/features/progress/components/LegalLinksCard.tsx` | `bf14c3b7721a4d5c57d7bedd07f8241fc7e61e282b7bfcfc00c35c147b87dd0f` |
| `radiant-app/src/features/progress/components/LegalLinksCard.test.tsx` | `90c35f67e4ee715e33f64678279938ad1fa3062b6621fd8c6852d1f282aa6f4f` |
| `radiant-app/src/features/profile/screens/ProfileScreen.tsx` | `44ab9b7d0890cc5cf8d2c0be08618aefa4ecf16bf033758d9af205432d12406e` |
| `radiant-app/src/features/profile/screens/ProfileScreen.flow.test.tsx` | `7152add679541c852c2508354ccd699c38d285f4ed3223713042b3682071c188` |
| `radiant-app/src/features/profile/components/TodayGoals.tsx` | `c9e3ea65ea280263cb5bc1326a354df98f7461bda6107b1279529344ea1b9794` |
| `radiant-app/src/features/profile/components/TodayGoals.test.tsx` | `82e0e9e052d3dd90e2e3655d8dd670e4b998356ce57a58429c848132e50423cd` |
| `radiant-app/src/features/profile/components/ProfileIdentityHeader.tsx` | `9569cea33c3660b692fe322c619cf77f353667d8994f0edf503584e548d82ad5` |
| `radiant-app/src/features/profile/components/ProfileIdentityHeader.test.tsx` | `cb6ea7e711f65a51efb80a4a87f05e7c1ab5a301d5a0d3eccbbcdf3f9861c5f6` |
| `radiant-app/src/features/push/components/ReminderRow.tsx` | `0c68069924890b22f73a4ede5cb0ed8b9bcf4b2e38bf8fe2934915dce4b7ea6b` |
| `radiant-app/src/features/push/components/ReminderRow.test.tsx` | `2f1e7a7505797f029336ea363f6bd54c91b19c9d5ea11ad1caeb27a196424657` |
| `radiant-app/src/features/journey/screens/JourneyHomeScreen.flow.test.tsx` | `aa50c1785c1abbb4c3841806f80abbf9637861368884c72245b575ac2bf34589` |
| `radiant-app/scripts/copy-style-baseline.json` | `9ce37d534bc44e6905ff483077087195bdf9c49ff4a9e65104213866f5b8dfec` |
| `radiant-app/src/features/first-run/screens/WelcomeFlowReentry.test.tsx` | `170bc3de2de3f37afa210fd22240926e3323a2e5bb7a97844dd9e378731dbe93` |
| `radiant-app/src/features/daily-goal/services/DailyGoalService.ts` | `d02989e42eedbb2160bda463ead90119b0a5127c21e846ac56f62ef51d7ea630` |
| `radiant-app/src/features/daily-goal/services/DailyGoalService.test.ts` | `737ecaac32bcf17a8a9b5d9ece866e6526793f6d57be1c32db22aeec767efd93` |
| `radiant-app/src/features/push/services/PushService.ts` | `845c5ff090ac5467a072fa274327dea04c94535ef864940945326ee3c4209564` |
| `radiant-app/src/features/push/services/PushService.test.ts` | `0c57fe982b573d0263079cbb1fc738b9055589cf017af05516cf79d27eb6c76e` |

## Estado após as revisões e validação final

FIX1 R2 aprovada; nativo R3 aprovado no núcleo delimitado, com gesto iOS
NOT PASS/P3 legal pendente. Loop final15/15 em um ciclo, em29/10.
Os374testes focais/consumidores e40repetidos CPU pertencem à FIX1; os298da
R1 são históricos e não se somam. A suíte completa foi medida pelos validadores
app-quality/app-test, sem deduzir sua contagem a partir desses subconjuntos.
Fechamento/publicação ainda não afirmados nesta medição documental.
