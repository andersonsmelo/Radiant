# E2E em device — build Release local (equivalente `e2e-test`) — 2026-07-28

**Task:** B0.1 (reexecutar os três flows Maestro sob um build sem dev client).
**Resultado:** iOS **`passed`** — `3/3 Flows Passed in 6m 52s`. Android
**`environment-blocked`** (sem projeto nativo).

Este registro **corrige** a conclusão de
[`2026-07-28-boot-to-home-devclient.md`](2026-07-28-boot-to-home-devclient.md),
que classificou iOS como `environment-blocked` na mesma data. A classificação
estava errada: a ausência de CocoaPods bloqueia `expo run:ios`, mas não
`xcodebuild` sobre `Pods/` já instalado, e o projeto nativo em `ios/` estava
completo (`Radiant.xcworkspace`, `Podfile.lock` idêntico a `Pods/Manifest.lock`).
O build foi produzido localmente nesta mesma data.

## Contexto

- **Código:** branch `codex/wave1-hardening-api-smoke`, commit `a87c7a4` mais a
  correção do flow crítico entregue neste mesmo dia.
- **Alvo:** simulador `Radiant iPhone 17 Pro`, iOS 26.5.
- **Runtime:** build **Release** de simulador com `main.jsbundle` embutido — sem
  dev launcher, sem Metro, sem servidor de desenvolvimento. É o equivalente local
  do perfil `e2e-test` que o RUNBOOK admite ("A Release simulator build is
  acceptable when it embeds the local test bundle and does not start a
  development server").
- **Runner:** Maestro 2.7.0, Xcode 26.6, Node 24.

## Receita de build (reprodutível, sem CocoaPods)

A partir de `radiant-app/ios`, com as sete variáveis do perfil `e2e-test`:

```sh
export EXPO_NO_DOTENV=1 EXPO_PUBLIC_APP_ENV=development \
  EXPO_PUBLIC_ENABLE_DEV_TOOLS=false EXPO_PUBLIC_ENABLE_TELEMETRY_DEBUG_SCREEN=false \
  EXPO_PUBLIC_ENABLE_BETA_GATE=false EXPO_PUBLIC_ENABLE_LEARNING_ROAD=true \
  EXPO_PUBLIC_ENABLE_PUSH=false EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false
xcodebuild -workspace Radiant.xcworkspace -scheme Radiant -configuration Release \
  -sdk iphonesimulator -destination "platform=iOS Simulator,id=<UDID>" \
  -derivedDataPath build/DD CODE_SIGNING_ALLOWED=NO build
```

Instalar e rodar:

```sh
xcrun simctl uninstall <UDID> com.ascendcreative.radiant
xcrun simctl install <UDID> ios/build/DD/Build/Products/Release-iphonesimulator/Radiant.app
maestro test .maestro
```

Pré-condições: `Pods/` instalado e consistente com o `Podfile.lock`
(`pod` **não** é necessário para este caminho); `ios/.xcode.env.local` apontando
para o binário real do Node.

**Limite declarado:** o `Info.plist` nativo ficou em `1.0.0` porque vem de um
prebuild anterior (`app.json` está em `1.3.0`). O que o E2E exercita é o
comportamento — o bundle JS, que é o do commit atual. A versão nativa defasada
não afeta os fluxos validados, mas invalida este build para qualquer verificação
sobre numeração de versão ou OTA.

## Execuções

Duas execuções da suíte completa (`maestro test .maestro`), a segunda depois da
correção do flow crítico:

| # | Comando | Resultado |
| --- | --- | --- |
| 1 | `maestro test .maestro` | **1/3 falhou.** `boot-to-home` PASSED (11s); `learning-critical-path` FAILED em 3m22s (`Assertion is false: "ACHIEVEMENT UNLOCKED" is visible`); `offline-relaunch` PASSED (2m21s). |
| 2 | `maestro test .maestro` | **`3/3 Flows Passed in 6m 52s`** — `boot-to-home` 12s, `learning-critical-path` 4m19s, `offline-relaunch` 2m21s. |

### Causa da falha da execução 1

Deriva de copy EN→pt-BR, a mesma classe do wizard de onboarding retirado nesta
data. O commit `fb1af1f` (2026-07-27) migrou a celebração do checkpoint:
`CheckpointScreen.tsx` passou a renderizar `CONQUISTA DESBLOQUEADA` no lugar de
`ACHIEVEMENT UNLOCKED`, e o CTA fixo `label="Continue"` deu lugar ao rótulo do
próximo nó recomendado (`Abrir próxima lição` neste ponto da trilha). O flow
seguiu afirmando as strings antigas e o contrato estático seguiu verde, porque
ele lê o texto do YAML e não a tela.

A correção repontou o flow para as strings reais e acrescentou ao
`scripts/maestro-contract.test.mjs` uma guarda que **extrai a tarja da própria
`CheckpointScreen.tsx`** e exige que o flow afirme exatamente ela, além de exigir
que o rótulo tocado seja um dos que `resolveNextAction` produz. É a deriva que
essa guarda fecha: sem ela, um contrato sobre o texto de um artefato confirma o
que alguém escreveu, nunca o que a tela renderiza.

## Estado por plataforma

- **iOS:** `passed` — `3/3 Flows Passed in 6m 52s` em 2026-07-28, build Release
  local (bundle embutido, sem servidor de desenvolvimento), simulador
  `Radiant iPhone 17 Pro` / iOS 26.5, Maestro 2.7.0.
- **Android:** `environment-blocked` — `expo prebuild` nunca executado, sem
  projeto nativo e sem build instalável (inalterado desde 2026-07-26).

Screenshots e artefatos do runner ficam fora do Git por política
(`.maestro/artifacts/`).

**Responsável:** engenharia — 2026-07-28.
**Próxima ação:** Android — gerar o projeto nativo e repetir a suíte para fechar
a segunda linha da matriz.
