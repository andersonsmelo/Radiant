# T08 — testes e evidência vermelho/verde

Medido em 28/10/2026, America/Bahia, sobre BASE_TASK
`2af93856693617d7c569ae36ec139dc9d338abe6`.
Comandos abaixo executados em `radiant-app`, Node 20.20.2,
`EXPO_NO_DOTENV=1`; os logs locais preservam stdout/stderr completos.
Trechos transcritos dos logs executados, com hash integral, não substituem
prova nativa. A validação final Loop é registrada na evidência principal.

Os vermelhos iniciais `red-r1` (37 falhas) e `red-states-r1` (6 falhas)
incluíam problemas de mock e seletores. Não se contam como 37 defeitos.
O vermelho adicional restaura a fonte inteira de BASE_TASK com dublês finais
alinhados a ambos os loaders; após cada injeção o arquivo corrente foi
restaurado em finally. O teste de conclusão falhava no seletor de abertura;
seu vermelho não prova isoladamente a conclusão. A retomada antiga falhava no
rótulo antigo do resumo; não prova restauração de respostas parciais.


## red-original-final-mocks-r1.log

SHA-256 `05ea197cfae8e4b7e983eb3e1dc1fc00e4335d7e6327336bc085603dd95098ba`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npx jest --runInBand --no-cache src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx --testNamePattern=estados Medalhão
  ● CheckpointScreen flow › estados Medalhão › bloqueada explica só as aulas necessárias e não abre histórico nem runtime

    Unable to find an element with text: Abre depois das 2 aulas. Faltam 1.

    <RNCSafeAreaProvider>
      <View>
        <RNCSafeAreaView>
          <RCTScrollView>
            <View>
              <View>
                <View
                  accessibilityLabel="Voltar"
                  accessibilityRole="button"
  ● CheckpointScreen flow › estados Medalhão › inválida explícita volta à trilha em vez de abrir outra avaliação disponível

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: "/(tabs)"

    Number of calls: 0

      345 |       try {
      346 |         renderWithProviders(<CheckpointScreen nodeId="node:invalid" />);
    > 347 |         await waitFor(() => expect(mockedRouter.dismissTo).toHaveBeenCalledWith('/(tabs)'));
          |                      ^
      348 |         expect(history).not.toHaveBeenCalled();
  ● CheckpointScreen flow › estados Medalhão › disponível em outra trilha usa snapshot do nó, prata e regra real sem Pixel

    Unable to find an element with text: Começar avaliação

    <RNCSafeAreaProvider>
      <View>
        <RNCSafeAreaView>
          <RCTScrollView>
            <View>
              <View>
                <View
                  accessibilityLabel="Voltar"
                  accessibilityRole="button"
  ● CheckpointScreen flow › estados Medalhão › falha de leitura mostra erro recuperável e não é tratada como nó inválido

    Unable to find an element with text: Não foi possível carregar a avaliação.

    <RNCSafeAreaProvider>
      <View>
        <RNCSafeAreaView>
          <RCTScrollView>
            <View>
              <View>
                <View
                  accessibilityLabel="Voltar"
                  accessibilityRole="button"
  ● CheckpointScreen flow › estados Medalhão › conclusão sem nodeId sobrevive ao desaparecimento do fallback e não inventa XP

    Unable to find an element with text: Começar avaliação

    <RNCSafeAreaProvider>
      <View>
        <RNCSafeAreaView>
          <RCTScrollView>
            <View>
              <View>
                <View
                  accessibilityLabel="Voltar"
                  accessibilityRole="button"
  ● CheckpointScreen flow › estados Medalhão › retoma resumo confirmado sem reenviar respostas ou creditar novamente

    Unable to find an element with text: Avaliação concluída

    <RNCSafeAreaProvider>
      <View>
        <View />
        <View
          pointerEvents="none"
        >
          <View
            nativeID="0"
            style={
                    Iniciar checkpoint
                    Iniciar checkpoint
                    Iniciar checkpoint
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

Test Suites: 1 failed, 1 total
Tests:       6 failed, 30 skipped, 36 total
Snapshots:   0 total
Time:        14.936 s
Ran all test suites matching /src\/features\/checkpoint\/screens\/CheckpointScreen.flow.test.tsx/i with tests matching "estados Medalhão".

exit=1
```

## mutation-count-future-r1.log

SHA-256 `f4ae3c2c1a42699495e090656936415f03b6202a8229439bc304ab60a8e478a2`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npx jest --runInBand --no-cache src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx --testNamePattern=bloqueada explica
  ● CheckpointScreen flow › estados Medalhão › bloqueada explica só as aulas necessárias e não abre histórico nem runtime

    Unable to find an element with text: Abre depois das 2 aulas. Faltam 1.

    <RNCSafeAreaProvider>
      <View>
        <RNCSafeAreaView>
          <RCTScrollView>
            <View>
              <View>
                <View
                  accessibilityLabel="Voltar"
                  accessibilityRole="button"
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 36 skipped, 37 total
Snapshots:   0 total
Time:        8.352 s
Ran all test suites matching /src\/features\/checkpoint\/screens\/CheckpointScreen.flow.test.tsx/i with tests matching "bloqueada explica".

exit=1
```

## mutation-double-send-r1.log

SHA-256 `73c7cc7dfa9817b6ab92fcd37abfbd1617e015c7756c1d9af88cdb3e979f0754`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npx jest --runInBand --no-cache src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx --testNamePattern=dois toques no envio
  ● CheckpointScreen flow › dois toques no envio comprometem uma única tentativa e um único crédito

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 2

      431 |       });
      432 |       expect(await screen.findByText('Avaliação concluída')).toBeTruthy();
    > 433 |       expect(submit).toHaveBeenCalledTimes(1);
          |                      ^
      434 |       expect(mockedJourneyProgressService.markNodeCompleted).toHaveBeenCalledTimes(1);
      435 |       expect(mockedLessonOutcome.recordAssessmentApproval).toHaveBeenCalledTimes(1);
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 36 skipped, 37 total
Snapshots:   0 total
Time:        7.763 s
Ran all test suites matching /src\/features\/checkpoint\/screens\/CheckpointScreen.flow.test.tsx/i with tests matching "dois toques no envio".

exit=1
```

## mutation-history-locked-r1.log

SHA-256 `dba329e87b45fde060cb0ec438bd1de839eccfce678a8ad662db102f7ef384cc`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npx jest --runInBand --no-cache src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx --testNamePattern=bloqueada explica
  ● CheckpointScreen flow › estados Medalhão › bloqueada explica só as aulas necessárias e não abre histórico nem runtime

    expect(jest.fn()).not.toHaveBeenCalled()

    Expected number of calls: 0
    Received number of calls: 1

    1: "node:checkpoint:materia-energia-e-radiacao:estrutura-atomica-e-ionizacao"

      331 |         expect(screen.queryByText('Começar avaliação')).toBeNull();
      332 |         expect(screen.queryByRole('radio')).toBeNull();
    > 333 |         expect(history).not.toHaveBeenCalled();
          |                             ^
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 36 skipped, 37 total
Snapshots:   0 total
Time:        7.193 s
Ran all test suites matching /src\/features\/checkpoint\/screens\/CheckpointScreen.flow.test.tsx/i with tests matching "bloqueada explica".

exit=1
```

## mutation-invalid-fallback-r1.log

SHA-256 `171422fae343059bd93c0e7700eba0059e873680dee33609be9a013a27d10a90`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npx jest --runInBand --no-cache src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx --testNamePattern=inválida explícita
  ● CheckpointScreen flow › estados Medalhão › inválida explícita volta à trilha em vez de abrir outra avaliação disponível

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: "/(tabs)"

    Number of calls: 0

      347 |       try {
      348 |         renderWithProviders(<CheckpointScreen nodeId="node:invalid" />);
    > 349 |         await waitFor(() => expect(mockedRouter.dismissTo).toHaveBeenCalledWith('/(tabs)'));
          |                      ^
      350 |         expect(history).not.toHaveBeenCalled();
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 36 skipped, 37 total
Snapshots:   0 total
Time:        9.519 s
Ran all test suites matching /src\/features\/checkpoint\/screens\/CheckpointScreen.flow.test.tsx/i with tests matching "inválida explícita".

exit=1
```

## mutation-pixel-r1.log

SHA-256 `2b2deee307149afe2f7806f6b4b55563ba56bfb7319e5510917cd4734cccdcbb`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npx jest --runInBand --no-cache src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx --testNamePattern=disponível em outra trilha
  ● CheckpointScreen flow › estados Medalhão › disponível em outra trilha usa snapshot do nó, prata e regra real sem Pixel

    expect(received).toBeNull()

    Received: {"_fiber": {"_debugHookTypes": null, "_debugInfo": null, "_debugNeedsRemount": false, "_debugOwner": [FiberNode], "_debugStack": [Error: react-stack-top-frame], "_debugTask": null, "actualDuration": 0, "actualStartTime": 1793218958266, "alternate": [FiberNode], "child": [FiberNode], "childLanes": 0, "deletions": null, "dependencies": null, "elementType": [Function PixelHeroSplit], "flags": 1, "index": 0, "key": null, "lanes": 0, "memoizedProps": [Object], "memoizedState": null, "mode": 3, "pendingProps": [Object], "ref": null, "refCleanup": null, "return": [FiberNode], "selfBaseDuration": 0, "sibling": [FiberNode], "stateNode": null, "subtreeFlags": 5, "tag": 0, "treeBaseDuration": 0, "type": [Function PixelHeroSplit], "updateQueue": null}}

      369 |       // Cor efetiva dos desenhos SVG, não cópia das props do componente.
      370 |       expect(medal.findAllByType(Circle).some((circle: { props: { fill?: string } }) => circle.props.fill === medalColors.silver.face)).toBe(true);
    > 371 |       expect(screen.UNSAFE_queryByType(PixelHeroSplit)).toBeNull();
          |                                                         ^
      372 |       expect(screen.UNSAFE_queryByType(PixelIllustration)).toBeNull();
      373 |       expect(screen.queryByLabelText(/Pixel/u)).toBeNull();
      374 |       expect(screen.queryByText(/checkpoint|jornada|indisponível/iu)).toBeNull();
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 36 skipped, 37 total
Snapshots:   0 total
Time:        7.944 s
Ran all test suites matching /src\/features\/checkpoint\/screens\/CheckpointScreen.flow.test.tsx/i with tests matching "disponível em outra trilha".

exit=1
```

## mutation-retry-identity-r1.log

SHA-256 `3828974bd71dea11046f51a4a15bce81a00d25b439143a68ff42600fc394dcc7`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npx jest --runInBand --no-cache src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx --testNamePattern=retry após falha de gravação
  ● CheckpointScreen flow › retry após falha de gravação envia o mesmo ID e as mesmas respostas, sem concluir antes

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: "node:checkpoint:materia-energia-e-radiacao:estrutura-atomica-e-ionizacao"

    Number of calls: 0

      455 |       const first = submit.mock.calls[0][0];
      456 |       fireEvent.press(screen.getByText('Enviar avaliação'));
    > 457 |       await waitFor(() => expect(mockedJourneyProgressService.markNodeCompleted).toHaveBeenCalledWith(productionNodeId));
          |                    ^
      458 |       expect(submit.mock.calls[1][0]).toEqual(first);
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 36 skipped, 37 total
Snapshots:   0 total
Time:        8.426 s
Ran all test suites matching /src\/features\/checkpoint\/screens\/CheckpointScreen.flow.test.tsx/i with tests matching "retry após falha de gravação".

exit=1
```

## mutation-runtime-locked-r1.log

SHA-256 `5d7bcf7cd92ec4d40db19eeab4cd3bb5fe2ede6f10837cc85ef0381f0d01f4d0`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npx jest --runInBand --no-cache src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx --testNamePattern=bloqueada explica
  ● CheckpointScreen flow › estados Medalhão › bloqueada explica só as aulas necessárias e não abre histórico nem runtime

    expect(received).toBe(expected) // Object.is equality

    Expected: false
    Received: true

      332 |         expect(screen.queryByRole('radio')).toBeNull();
      333 |         expect(history).not.toHaveBeenCalled();
    > 334 |         expect(active.mock.calls.at(-1)?.[0].enabled).toBe(false);
          |                                                       ^
      335 |         expect(shadow.mock.calls.at(-1)?.[0].enabled).toBe(false);
      336 |         expect(mockedLessonOutcome.recordAssessmentApproval).not.toHaveBeenCalled();
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 36 skipped, 37 total
Snapshots:   0 total
Time:        7.171 s
Ran all test suites matching /src\/features\/checkpoint\/screens\/CheckpointScreen.flow.test.tsx/i with tests matching "bloqueada explica".

exit=1
```

## mutation-silver-r1.log

SHA-256 `b18ce2c37627b2d889fb1ab9e221462f4afad1d00ecd4dfd7853aa6ab81c2e9e`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npx jest --runInBand --no-cache src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx --testNamePattern=disponível em outra trilha
  ● CheckpointScreen flow › estados Medalhão › disponível em outra trilha usa snapshot do nó, prata e regra real sem Pixel

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      368 |       const medal = screen.UNSAFE_getByType(JourneyMedal);
      369 |       // Cor efetiva dos desenhos SVG, não cópia das props do componente.
    > 370 |       expect(medal.findAllByType(Circle).some((circle: { props: { fill?: string } }) => circle.props.fill === medalColors.silver.face)).toBe(true);
          |                                                                                                                                         ^
      371 |       expect(screen.UNSAFE_queryByType(PixelHeroSplit)).toBeNull();
      372 |       expect(screen.UNSAFE_queryByType(PixelIllustration)).toBeNull();
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 36 skipped, 37 total
Snapshots:   0 total
Time:        7.625 s
Ran all test suites matching /src\/features\/checkpoint\/screens\/CheckpointScreen.flow.test.tsx/i with tests matching "disponível em outra trilha".

exit=1
```

## mutation-unit-index-r1.log

SHA-256 `8d29ee4d754acd4a1003f5f119d525730e8351473190e0e87fc8363a6c1ba4c8`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npx jest --runInBand --no-cache src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx --testNamePattern=bloqueada explica
  ● CheckpointScreen flow › estados Medalhão › bloqueada explica só as aulas necessárias e não abre histórico nem runtime

    Unable to find an element with text: Avaliação da unidade 2

    <RNCSafeAreaProvider>
      <View>
        <RNCSafeAreaView>
          <RCTScrollView>
            <View>
              <View>
                <View
                  accessibilityLabel="Voltar"
                  accessibilityRole="button"
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 36 skipped, 37 total
Snapshots:   0 total
Time:        7.299 s
Ran all test suites matching /src\/features\/checkpoint\/screens\/CheckpointScreen.flow.test.tsx/i with tests matching "bloqueada explica".

exit=1
```

## green-final-r1.log

SHA-256 `d98415f4ba262835b65afa24ef48b0126210c52b529e850da7dd1a3f6ee85ad3`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npx jest --runInBand --no-cache src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx src/features/journey/services/JourneyNodeCompletionGuard.test.tsx src/features/checkpoint/checkpointRuleCopy.test.ts src/features/checkpoint/checkpointChargeLedger.test.ts
PASS src/features/checkpoint/checkpointChargeLedger.test.ts
PASS src/features/checkpoint/checkpointRuleCopy.test.ts

Test Suites: 4 passed, 4 total
Tests:       59 passed, 59 total
Snapshots:   0 total
Time:        13.847 s
Ran all test suites matching /src\/features\/checkpoint\/screens\/CheckpointScreen.flow.test.tsx|src\/features\/journey\/services\/JourneyNodeCompletionGuard.test.tsx|src\/features\/checkpoint\/checkpointRuleCopy.test.ts|src\/features\/checkpoint\/checkpointChargeLedger.test.ts/i.

exit=0
```

## green-limited-cpu-r1.log

SHA-256 `0c5a13666aebcb57f6ed40ae65a9c392d611940a5cbc8cd9f2b5326b24e12a8a`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 /usr/sbin/taskpolicy -b npx jest --runInBand --no-cache src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx src/features/journey/services/JourneyNodeCompletionGuard.test.tsx

PASS src/features/journey/services/JourneyNodeCompletionGuard.test.tsx (8.25 s)

Test Suites: 2 passed, 2 total
Tests:       43 passed, 43 total
Snapshots:   0 total
Time:        57.801 s
Ran all test suites matching /src\/features\/checkpoint\/screens\/CheckpointScreen.flow.test.tsx|src\/features\/journey\/services\/JourneyNodeCompletionGuard.test.tsx/i.

exit=0
```

## test-checkpoint-performance-report-r1.log

SHA-256 `e5e3ee7dbb7f9902170a82ca14da819f1bef0e1a5b6c576d9121e944e7c11c4c`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npm run test:checkpoint-performance-report
# tests 16
# suites 0
# pass 16
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 45.834375

exit=0
```

## test-checkpoint-instrument-r1.log

SHA-256 `729a4c88840127cf8149eb046972645945f5620adc3634aa2434589008134486`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npm run test:checkpoint-instrument
# tests 28
# suites 0
# pass 28
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 88.207

exit=0
```

## test-copy-style-contract-r1.log

SHA-256 `afdc9cfd15a9f5573d87b90c6f8deb33d765b997e42aa5524069fdd95fb0f853`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npm run test:copy-style-contract
# tests 65
# suites 0
# pass 65
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 775.648291

exit=0
```

## test-maestro-contract-r1.log

SHA-256 `e7740f56ce6ae67c1845451d098d6e4b4b69b5559ed5ff43e4643fb8647290b5`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npm run test:maestro-contract
# tests 40
# suites 0
# pass 40
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 746.927334

exit=0
```

## visual-qa-strict-r1.log

SHA-256 `d84eaa50924cacec69602c0e668f821e83cdbd64aea4780ded28653b3fd62c55`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npm run visual:qa:strict

👁  Starting Radiant Visual QA...

------------------------------------------------
Scanned 465 files.
Found 44 issues: 0 regressions, 41 baselined, 3 scoped exceptions.

✅ Visual QA passed without unapproved regressions.

exit=0
```

## typecheck-r2.log

SHA-256 `e896f3d0193b8647711fd043e7aed0deea05e37b692774595239c39dd9d57d06`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npm run typecheck
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npm run typecheck

> radiant-app@1.4.0 typecheck
> tsc --noEmit


exit=0
```

## lint-owned-r1.log

SHA-256 `73326d8e61635a8483e7329a3f2b49fd8779b5cc1acdad6c51c0942498bec9a1`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npx eslint src/features/checkpoint/screens/CheckpointScreen.tsx src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx src/features/journey/services/JourneyNodeCompletionGuard.test.tsx
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npx eslint src/features/checkpoint/screens/CheckpointScreen.tsx src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx src/features/journey/services/JourneyNodeCompletionGuard.test.tsx

exit=0
```

## Mutações específicas

Todos os nove logs `mutation-*-r1.log` têm exit 1, sem alteração residual de produto:

| Log | Mutação | Sintoma que falhou |
| --- | --- | --- |
| mutation-invalid-fallback-r1.log | ID ausente escolhe fallback disponível | dismiss para trilha não acontece |
| mutation-count-future-r1.log | Conta todas as aulas em vez da cadeia | contagem 2 necessárias / 1 faltante deixa de ser mostrada |
| mutation-runtime-locked-r1.log | Liga hooks para locked | enabled recebido true em vez de false |
| mutation-retry-identity-r1.log | Recria pendingSubmission em cada envio | retry não conclui; nova identidade é recusada pelo journal (a falha ocorre antes da asserção final de igualdade) |
| mutation-double-send-r1.log | Remove trava processingAnswer | submit chamado 2 vezes em vez de 1 |
| mutation-history-locked-r1.log | Lê histórico mesmo locked | getState recebe chamada indevida |
| mutation-unit-index-r1.log | Força unidade 1 | título da unidade 2 da fixture desaparece |
| mutation-silver-r1.log | Renderiza medalha de reward | cor efetiva SVG prata ausente |
| mutation-pixel-r1.log | Reinsere PixelHeroSplit | componente Pixel detectado na tela |


## Correção da revisão R1 — identidade do resumo

[Relatório R1](2026-10-28-medalhao-t08-review.md). O delta preserva a primeira avaliação antes de markNodeCompleted/setSnapshot e durante finish pendente. Duas regressões com duas avaliações canônicas disponíveis foram vistas falhando antes do código. O pacote R2 tem manifest27b78d4c4b9e9524098a0a3842dbe1340752ec9b1e833b0d57b3eed8fafc3491; deltaSHA3a3f9860f3ceaf50106dd526b6c9f9ccb5b82c8ac90853495e62df796d5992cf.

### fix1-red.log

SHA-256 `3197240ff13c3f18718444b3ddba040ef0b0665ccb81da2d6c8abf66aea6066f`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npx jest --runInBand --no-cache src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx --testNamePattern=mantém a primeira avaliação no resumo
  ● CheckpointScreen flow › mantém a primeira avaliação no resumo sem abrir a segunda (finish pendente: false)

    Unable to find an element with text: Avaliação 1 de 5

    <RNCSafeAreaProvider>
      <View>
        <View
          pointerEvents="none"
        >
  ● CheckpointScreen flow › mantém a primeira avaliação no resumo sem abrir a segunda (finish pendente: true)

    Unable to find an element with text: Avaliação 1 de 5

    <RNCSafeAreaProvider>
      <View>
        <RNCSafeAreaView>
          <RCTScrollView>
            <View>
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 37 skipped, 39 total
Snapshots:   0 total
Time:        8.79 s
Ran all test suites matching /src\/features\/checkpoint\/screens\/CheckpointScreen.flow.test.tsx/i with tests matching "mantém a primeira avaliação no resumo".

exit=1
```

### fix1-green.log

SHA-256 `4f2e36beb20ca1d603c45cd7afaf792569cb2179232fe5d7282c6613b35b60a8`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npx jest --runInBand --no-cache src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx src/features/journey/services/JourneyNodeCompletionGuard.test.tsx src/features/checkpoint/checkpointRuleCopy.test.ts src/features/checkpoint/checkpointChargeLedger.test.ts
PASS src/features/checkpoint/checkpointChargeLedger.test.ts
PASS src/features/checkpoint/checkpointRuleCopy.test.ts

Test Suites: 4 passed, 4 total
Tests:       61 passed, 61 total
Snapshots:   0 total
Time:        14.333 s
Ran all test suites matching /src\/features\/checkpoint\/screens\/CheckpointScreen.flow.test.tsx|src\/features\/journey\/services\/JourneyNodeCompletionGuard.test.tsx|src\/features\/checkpoint\/checkpointRuleCopy.test.ts|src\/features\/checkpoint\/checkpointChargeLedger.test.ts/i.

exit=0
```

### fix1-limited.log

SHA-256 `c17cd1e8b90df9671005160e1a407c43889ddf2db4034443dc4cdd192f9b2ee9`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 /usr/sbin/taskpolicy -b npx jest --runInBand --no-cache src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx --testNamePattern=mantém a primeira avaliação no resumo
      ○ skipped sem crédito, a celebração mostra só o total
      ○ skipped reprovar não credita XP

Test Suites: 1 passed, 1 total
Tests:       37 skipped, 2 passed, 39 total
Snapshots:   0 total
Time:        42.26 s
Ran all test suites matching /src\/features\/checkpoint\/screens\/CheckpointScreen.flow.test.tsx/i with tests matching "mantém a primeira avaliação no resumo".

exit=0
```

### fix1-limited-screens.log

SHA-256 `e7d2d53c19dce4379189f45bf924c3cac45b3f6049d379470366effd8742ec1c`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 /usr/sbin/taskpolicy -b npx jest --runInBand --no-cache src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx src/features/journey/services/JourneyNodeCompletionGuard.test.tsx

PASS src/features/journey/services/JourneyNodeCompletionGuard.test.tsx (8.826 s)

Test Suites: 2 passed, 2 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        60.091 s
Ran all test suites matching /src\/features\/checkpoint\/screens\/CheckpointScreen.flow.test.tsx|src\/features\/journey\/services\/JourneyNodeCompletionGuard.test.tsx/i.

exit=0
```

### fix1-typecheck.log

SHA-256 `e896f3d0193b8647711fd043e7aed0deea05e37b692774595239c39dd9d57d06`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npm run typecheck
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npm run typecheck

> radiant-app@1.4.0 typecheck
> tsc --noEmit


exit=0
```

### fix1-lint.log

SHA-256 `b92d4b8d854860f44b01bd1ed68b869b878a660060b22cf10d298176437b8d42`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npx eslint src/features/checkpoint/screens/CheckpointScreen.tsx src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npx eslint src/features/checkpoint/screens/CheckpointScreen.tsx src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx

exit=0
```

### fix1-copy-contract.log

SHA-256 `e3986e1cdb0d090ae33862362f8e6ab9e697a70e0d93cc1577fbbbdc8a3fb2b1`.

```text
cwd=/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app
node=v20.20.2
command=EXPO_NO_DOTENV=1 npm run test:copy-style-contract
# tests 65
# suites 0
# pass 65
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 631.162541

exit=0
```
