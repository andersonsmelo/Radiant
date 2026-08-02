# E2E em device — apresentação de primeiro uso, iOS `passed` com pendência de `store-capture` — 2026-08-02

**Task:** sinalização do plano `docs/superpowers/plans/2026-08-02-primeiro-uso-pixel.md`
(o mascote Pixel explicando o método em três telas puláveis, antes da Learning
Road).
**Resultado:** iOS — `first-run.yaml`, `boot-to-home.yaml`,
`learning-critical-path.yaml` e `offline-relaunch.yaml` **`passed`**;
`store-capture.yaml` **`app-failed`**, com atribuição a geometria de aparelho
(ver seção própria). **Android não foi executado nesta sessão.**

## Contexto

- **Aparelho:** simulador `Radiant iPhone 17 Pro`, iOS 26.5, UDID
  `3DA4F77E-086B-4C6F-A0B5-FECEA0F4A164`.
- **Host:** macOS 27.0, Xcode 26.6 (build 17F113), Maestro 2.7.0.
- **Runtime:** build **Release** local de simulador, `main.jsbundle` embutido —
  sem dev client, sem Metro, sem servidor de desenvolvimento. Equivalente local
  do perfil `e2e-test`, mesma receita de
  [`2026-07-28-e2e-local-release.md`](2026-07-28-e2e-local-release.md).
- **Commit exercitado:** `728ca8d`.
- **Flows rodados sequencialmente, um por vez** — não em paralelo.

## Receita de build (reprodutível)

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
maestro test .maestro/first-run.yaml
maestro test .maestro/boot-to-home.yaml
maestro test .maestro/learning-critical-path.yaml
maestro test .maestro/offline-relaunch.yaml
maestro test .maestro/store-capture.yaml
```

Pré-condições: `Pods/` instalado e consistente com o `Podfile.lock` (`pod`
**não** é necessário para este caminho); `ios/.xcode.env.local` apontando para
o binário real do Node.

## Resultado por flow

| Flow | Resultado |
| --- | --- |
| `first-run.yaml` | passou |
| `boot-to-home.yaml` | passou |
| `learning-critical-path.yaml` | passou |
| `offline-relaunch.yaml` | passou |
| `store-capture.yaml` | **falhou** — ver "A falha do `store-capture.yaml`" abaixo |

## Os dois defeitos que a execução em dispositivo achou

Ambos já corrigidos e commitados antes do fechamento desta evidência — registro
como achados da execução, não como pendências.

### 1. Acessibilidade — defeito de produto no `WelcomeSlide`

`<View accessible accessibilityLabel={stepLabel}>` no `WelcomeSlide` colapsa a
subárvore inteira num único nó de acessibilidade no iOS. A árvore de
acessibilidade da apresentação toda tinha três nós: `Pular apresentação`,
`Tela 1 de 3`, `Continuar`. Título, corpo, rótulo da ilustração do Pixel e o
aviso legal exigido pela ficha da loja **não existiam para leitor de tela**. O
`jest-expo` não modela esse colapso, então `getByText` vinha passando havia
três tasks e duas revisões sem detectar o problema.

Corrigido mantendo o agrupamento — uma parada de foco por tela é boa UX de
VoiceOver numa apresentação de três telas — e compondo o rótulo do grupo com
posição + título + corpo + footnote, sem duplicar pontuação quando um segmento
já termina em `.`, `!` ou `?`. O rótulo existe para ser falado inteiro.
Commits `1a8fd59` e `b3f5684`.

### 2. Seletor do Maestro — correspondência total, não substring

O seletor do Maestro é regex de **correspondência total**. Com o rótulo do
grupo carregando a frase inteira (posição + título + corpo + footnote), o
padrão antigo `'Oi, eu sou o Pixel.'` parou de casar — ele descrevia apenas o
título, não o rótulo composto que o dispositivo agora expõe.

Corrigido ancorando os padrões em `.maestro/first-run.yaml` na forma real do
rótulo do grupo (`^Tela N de M\. <título>\..*$`), e o contrato estático
(`scripts/maestro-contract.test.mjs`) passou a exigir a forma ancorada
**derivada de `SLIDES`** (lida da própria `WelcomeFlowScreen.tsx`) **e** a
proibir a forma antiga (o título isolado, sem o prefixo `Tela N de M`) — um
contrato que só aceita o formato novo deixa essa mesma regressão voltar a
entrar por onde ele não olha. Commit `728ca8d`.

## A falha do `store-capture.yaml`, com a atribuição

Falhou em `assertVisible: Concluir e voltar`, na seleção da alternativa do
quiz. **Não é regressão desta branch.** A evidência para essa atribuição:

- O diff inteiro desta branch nesse arquivo é **uma linha** no topo — o
  `runFlow` do subflow de dispensa da apresentação — verificado com
  `git diff 34e432e..HEAD -- radiant-app/.maestro/store-capture.yaml`.
- O subflow de dispensa executou e completou (a apresentação foi pulada sem
  erro). O flow passou por `Foco de hoje`, 12 rolagens, `Continuar jornada`,
  abriu a lição e tirou dois screenshots. A falha acontece cerca de 20 passos
  **depois** desse ponto, bem adiante do trecho que esta branch tocou.
- O dump da hierarquia no momento da falha mostra o quiz parado com `0%`
  selecionado: o toque na alternativa não registrou.
- É a classe de oclusão que o commit `f7b602a` já havia corrigido, mas com uma
  **rolagem fixa calibrada** para iPhone 16 Plus e iPhone 11 Pro Max — a
  execução desta sessão foi num **iPhone 17 Pro**, de geometria de tela
  diferente, fora do conjunto para o qual a rolagem foi calibrada.
- O irmão `learning-critical-path.yaml`, que faz a mesma asserção de conclusão
  do quiz mas usa `scrollUntilVisible` com `centerElement: true` (rolagem
  adaptativa, não fixa), **passou** no mesmo aparelho minutos antes.

A rolagem calibrada de `store-capture.yaml` **não foi tocada** nesta sessão:
ajustá-la às cegas arrisca quebrar a captura nos aparelhos onde ela hoje
funciona (iPhone 16 Plus, iPhone 11 Pro Max) e produz os screenshots de loja
publicados.

**Pendência aberta, atribuída a geometria de aparelho, não à apresentação de
primeiro uso:** `store-capture.yaml` precisa ser revalidado ou recalibrado
especificamente para iPhone 17 Pro (ou outro aparelho do conjunto calibrado)
antes de se apoiar nele para gerar novos screenshots de loja a partir deste
simulador.

## Estado por plataforma

- **iOS:** `passed` para `first-run.yaml`, `boot-to-home.yaml`,
  `learning-critical-path.yaml` e `offline-relaunch.yaml` — simulador
  `Radiant iPhone 17 Pro` / iOS 26.5, build Release local (bundle embutido, sem
  servidor de desenvolvimento), Maestro 2.7.0, commit `728ca8d`, 2026-08-02.
  `store-capture.yaml`: `app-failed`, pendência aberta (geometria de aparelho,
  não regressão desta branch).
- **Android:** **não revalidado contra a apresentação de primeiro uso nesta
  sessão.** O estado anterior conhecido (`passed`, 2026-07-29, antes da
  apresentação existir) não cobre os flows que hoje atravessam o gate de
  primeiro uso.

Screenshots e artefatos do runner ficam fora do Git por política
(`.maestro/artifacts/`).

**Responsável:** engenharia — 2026-08-02.
**Próxima ação:** revalidar ou recalibrar `store-capture.yaml` para a
geometria do iPhone 17 Pro; rodar a suíte completa em Android contra a
apresentação de primeiro uso.
