# E2E sob configuração de produção, nas duas plataformas — 2026-08-03

Estado: **iOS `passed` 6/6, Android `passed` 6/6.** Esta é a primeira evidência
de device colhida sob configuração equivalente a produção; toda a anterior usou
o perfil `e2e-test`. Substitui, para fins de sign-off, a matriz de
[`2026-08-03-e2e-1.3.1-ios-android.md`](2026-08-03-e2e-1.3.1-ios-android.md),
que foi medida em `da877b2` e passou a preceder o HEAD em 11 commits.

## Configuração medida

As sete variáveis do perfil `e2e-test` com **duas** trocadas — o delta real
entre `e2e-test` e `production` no `eas.json` é só isto:

| Variável | `e2e-test` | Medido aqui |
| --- | --- | --- |
| `EXPO_PUBLIC_APP_ENV` | `development` | **`production`** |
| `EXPO_PUBLIC_ENABLE_PUSH` | `false` | **`true`** |
| `ENABLE_DEV_TOOLS` / `TELEMETRY_DEBUG_SCREEN` / `BETA_GATE` / `LEARNING_ROAD` / `REMOTE_SYNC` | `false`/`false`/`false`/`true`/`false` | idênticas |

Nenhuma alteração no `eas.json`: as variáveis foram exportadas antes do comando
de build, então o contrato que fixa o perfil `e2e-test` por `deepEqual` seguiu
verde.

**Como a configuração foi verificada, e por que não por `strings`.** O bundle é
Hermes e suas literais vivem numa tabela concatenada — procurar `"production"`
ali não distingue a literal inlinada de qualquer outra ocorrência. A prova veio
do próprio aparelho: `RatingPromptService.buildProps` grava
`AppConfig.APP_ENV` em `build_channel`, e **todos** os eventos do prompt nas duas
plataformas trazem `build_channel=production`. O dispositivo responde o que o
grep não responde.

Builds locais Release, versão **1.3.1 (3)** conferida no binário instalado:
`CFBundleShortVersionString` no `Info.plist` do `.app`, e `versionName=1.3.1` /
`versionCode=3` via `dumpsys package` no emulador — a armadilha do emulador
voltar ao APK anterior foi checada, não presumida.

Ambiente: Maestro 2.7.0; simulador `Radiant iPhone 17 Pro` / iOS 26.5; emulador
`Radiant_Pixel_9_API_36` / API 36, imagem `google_apis`. Plataformas medidas em
janelas exclusivas, com `xcrun simctl shutdown all` antes do Android e
`./gradlew --stop` depois do build.

## Placar

| Flow | iOS | Android | Linha de base Android de 2026-08-03 |
| --- | ---: | ---: | ---: |
| `first-run` | passou (47s) | passou (73s) | 284s |
| `boot-to-home` | passou (28s) | passou (36s) | 640s |
| `learning-critical-path` | passou (312s) | passou (239s) | 1698s |
| `offline-relaunch` | passou (155s) | passou (247s) | 1077s |
| `store-capture` | passou (402s) | passou (918s) | 557s |
| `rating-prompt` | passou (210s) | passou (471s) | — (flow novo) |

Os tempos do iOS ficaram dentro da linha de base; nenhum pede interpretação.

**Quatro dos cinco flows Android vieram 2 a 7× mais rápidos que a linha de
base**, e isso confirma o diagnóstico de host de 2026-08-03 em vez de contradizê-lo:
aquela medição foi feita com a máquina em swap, e o runbook já dizia que o número
era propriedade da máquina. Com o simulador desligado e o daemon do Gradle
parado, o `learning-critical-path` caiu de 28 para 4 minutos.

**O `store-capture` é a exceção e fica sem atribuição.** Subiu de 557s para 918s
enquanto os vizinhos caíam. Ele passou, sem nenhuma repetição de passo no log, e
é o único flow que tira sete screenshots — captura em emulador é cara. Isso é
correlação, não causa: registrado como não atribuído em vez de explicado por
conveniência.

## O que o `rating-prompt` provou, e o que ele não prova

O flow existe para alcançar um gate que nenhum outro alcança:
`countEvents('app_open') >= MIN_APP_OPENS` (3). A telemetria lida do próprio
aparelho — não o exit code do flow — é a evidência:

| Passo | iOS | Android |
| --- | --- | --- |
| `first_value_moment_reached` | emitido | emitido |
| primeira conclusão de quiz | `rating_prompt_blocked` / `insufficient_sessions` | idem |
| segunda conclusão | `rating_prompt_eligible` | `rating_prompt_eligible` |
| apresentação | **`rating_prompt_shown`** | `rating_prompt_deferred` / *"Android ReviewManager task was not successful"* |
| `app_open` acumulado | 4 | 4 |
| `cohort.installDate` | `2026-08-03` | `2026-08-03` |

No iOS o diálogo do `SKStoreReviewController` apareceu e foi afirmado pelo flow
(`Curtindo o app Radiant?`), com screenshot em
`rating-prompt-ios-dialog`.

**A previsão sobre o Android estava errada no mecanismo, e a medição a
corrigiu.** O texto escrito antes desta execução dizia que o Android pararia em
`deferred: store_review_unavailable`, por não haver Play Store na imagem
`google_apis`. Não foi o que aconteceu: `StoreReview.isAvailableAsync()`
devolveu verdadeiro, **o gate abriu igual ao iOS**, e a falha veio um passo
depois, na chamada ao `ReviewManager` do Play, que reporta a task como
malsucedida. O resultado prático é o mesmo — não há prova de diálogo em Android
aqui —, mas a razão registrada é outra, e é ela que alguém vai procurar ao
interpretar uma execução futura.

Prova do diálogo em Android continua exigindo instalação por faixa fechada do
Play (task C4). Não é limitação do flow nem defeito do app.

## Contexto: o gate estava fechado por um defeito, não por falta de execução

Até 2026-08-03 este flow não teria como passar. `app_open` tinha um único ponto
de emissão, na `HomeScreen` legada, que `(tabs)/index.tsx` só renderiza com
`ENABLE_LEARNING_ROAD=false` — e nenhum perfil declara isso. O evento nunca foi
emitido em build nenhuma, então `countEvents('app_open')` era permanentemente 0.
Corrigido no commit `f499714` pelo hook `useAppOpenLifecycle`, que também
restaurou `markDayOpen()` — único inicializador de `cohort.installDate`, sem o
qual o paywall soma `missing_install_date` — e o reset de backoff de push.

**A primeira versão deste flow passou verde medindo a coisa errada.** Ela
completava a lição (`/learn`) em vez do quiz (`/quiz`), e
`maybePromptForReview` só é chamado por `QuizScreen`, `ReviewScreen` e
`RewardScreen`. O flow ficou verde e a telemetria do aparelho não tinha um único
evento `rating_prompt_*`. O exit code não denunciou; denunciou a leitura do
armazenamento local do aparelho. Corrigido em `b9c77f4`.

## Semântica de `app_open` — o número que a decisão precisa

O evento é emitido a cada **montagem da home**, decisão registrada no dia. Medido
nesta execução: **4 eventos `app_open` para 3 aberturas reais**, nas duas
plataformas, porque voltar do quiz para a home a remonta.

A escolha funciona e destrava os gates, mas infla ~33% neste percurso. Quem for
revisar a semântica — para retenção, para o piso do paywall ou para
`MIN_APP_OPENS` — deve partir deste número, não da intuição de que uma abertura
equivale a um lançamento do app.

## Pendência nomeada, não perdida

`checkHeuristics()` é o quarto comportamento do bloco de abertura que ficou na
home legada e **segue sem fiação**. Ele foi deixado de fora deliberadamente:
renderiza nudges, e religá-lo mudaria o que o usuário vê na home — dentro da
mesma rodada que existe para certificar essa home. É decisão de produto, com
registro em [`../HEURISTICS_SYSTEM_V1.md`](../HEURISTICS_SYSTEM_V1.md).

## Como reproduzir

iOS, a partir de `radiant-app/ios`, com o `derivedData` apagado (as variáveis são
inlinadas em tempo de build; um bundle reaproveitado traz a configuração antiga
sem que nada falhe):

```sh
export EXPO_NO_DOTENV=1 EXPO_PUBLIC_APP_ENV=production \
  EXPO_PUBLIC_ENABLE_DEV_TOOLS=false EXPO_PUBLIC_ENABLE_TELEMETRY_DEBUG_SCREEN=false \
  EXPO_PUBLIC_ENABLE_BETA_GATE=false EXPO_PUBLIC_ENABLE_LEARNING_ROAD=true \
  EXPO_PUBLIC_ENABLE_PUSH=true EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false
xcodebuild -workspace Radiant.xcworkspace -scheme Radiant -configuration Release \
  -sdk iphonesimulator -destination "platform=iOS Simulator,id=<UDID>" \
  -derivedDataPath build/DD CODE_SIGNING_ALLOWED=NO build
```

Android, a partir de `radiant-app/android`, com as mesmas variáveis, mais
`ANDROID_HOME`, `JAVA_HOME` do JDK 17 e `SENTRY_DISABLE_AUTO_UPLOAD=true`,
apagando antes `app/build/generated/assets/createBundleReleaseJsAndAssets` e
`app/build/intermediates/assets/release` para forçar a regeração do bundle:

```sh
./gradlew assembleRelease --console=plain && ./gradlew --stop
adb install -r app/build/outputs/apk/release/app-release.apk
```

Leitura da telemetria do aparelho, que é a evidência mais forte desta suíte:

```sh
# iOS
xcrun simctl get_app_container <UDID> com.ascendcreative.radiant data
# → Library/Application Support/com.ascendcreative.radiant/RCTAsyncLocalStorage_V1

# Android (imagem google_apis permite adb root; imagem de Play Store não)
adb root && adb pull /data/data/com.ascendcreative.radiant/databases/RKStorage
# → tabela catalystLocalStorage, chave telemetry.events.v1
```
