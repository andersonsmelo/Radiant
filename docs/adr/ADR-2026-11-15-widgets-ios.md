# ADR 2026-11-15 — Widgets da tela inicial do iOS (F5 da 1.6)

- **Data:** 2026-11-15
- **Decisor:** Claude (frente F5), por delegação do dono à atualização 1.6 em 2026-11-13
  ([ADR da delegação de 2026-11-05](ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla.md)
  e pedido de 2026-11-13). Ligar a chave numa build e criar o App Group no portal são do dono.
- **Estado:** aceita, atrás de `ENABLE_WIDGETS` (desligada por padrão).

## Contexto

A 1.6 pede dois widgets na tela inicial: pequeno (sequência e se hoje já conta) e
médio (sequência, meta do dia e próxima aula). O app é Expo 54 com prebuild (CNG,
`ios/` fora do git), React Native 0.81.5 com New Architecture, build pelo EAS.
WidgetKit exige um alvo de extensão em SwiftUI; não há como escrever o widget em
React Native.

## Opções avaliadas (pesquisa de 2026-11-15)

| Opção | Expo 54 | Prebuild/EAS | New Arch | Dependência | Manutenção |
| --- | --- | --- | --- | --- | --- |
| **`@bacons/apple-targets` 5.0.0** | sim (exige SDK 53+, Xcode 16, CocoaPods 1.16.2) | plugin de config, alvo fora de `ios/`; EAS assina extensões pelo projeto Xcode | o alvo é SwiftUI puro, fora do React Native; o módulo `ExtensionStorage` do pacote exige iOS 16.4 (ver Decisão 4) | 1 pacote | Evan Bacon (Expo); publicado em 2026-07-17 |
| `expo-widgets` (Expo) | **não**: a documentação começa no SDK 55 | — | — | — | exige atualizar o SDK, fora do recorte |
| Voltra (Callstack) | não confirmado para o SDK 54 na pesquisa | — | — | — | descartado por falta de evidência |
| Plugin próprio que monta o alvo no `.pbxproj` | sim | sim | sim | 0 pacotes | alto: escrever e manter a manipulação do projeto Xcode à mão |

## Decisão

1. **`@bacons/apple-targets`**, chamado **só** pelo plugin local
   `radiant-app/plugins/with-widgets.js` quando `EXPO_PUBLIC_ENABLE_WIDGETS=true` na
   build. Com a chave desligada, o plugin devolve a config intacta: nenhum alvo,
   nenhum App Group, nenhuma permissão nova (provado por teste com contraprova e por
   `expo prebuild` comparado com a `main`).
2. **O alvo mora em `radiant-app/modules/radiant-widgets/targets/widget/`**, pela
   opção `root` do plugin, que **não é o padrão da ferramenta**: o padrão é `./targets`
   (`const { root = "./targets", match = "*" } = _props`, em
   `packages/apple-targets/src/config-plugin.ts` do `EvanBacon/expo-apple-targets` 5.0.0,
   lido em 2026-11-15). Aprovado pelo controlador da 1.6 em 2026-11-15, sem mudar o
   `.loop/project.yaml`. A pasta
   padrão, `radiant-app/targets/`, fica fora de `writePolicy.allowedRoots`; `modules/`
   já é onde mora o código nativo do app (CloudKit, StoreKit, Game Center da F4).
3. **App Group:** `group.com.ascendcreative.radiant.widgets`, nas permissões do app e
   do alvo, só com a chave ligada. Bundle id do alvo:
   `com.ascendcreative.radiant.widgets`. Bundle id e time do app não mudam.
4. **Ponte de dados:** o JS monta um retrato com `schemaVersion: 1` e a **linha do
   tempo já calculada** (entradas datadas na meia-noite local), grava como texto JSON
   no App Group e pede `reloadAllTimelines`. O Swift do widget só lê e mostra; a regra
   da sequência continua uma só, a `advanceStreak` do `StreakFreezeService`. Versão
   desconhecida ou dado ausente: o widget mostra "Abra o Radiant".

   A gravação é de um **módulo Expo local mínimo**, `modules/radiant-widgets`
   (duas funções: `write` e `reloadTimelines`), e não do `ExtensionStorage` do
   pacote. Medido em 2026-11-15: o podspec do `ExtensionStorage` declara iOS 16.4, o
   app tem alvo 15.1, e o autolink do Expo pula pod de plataforma acima do alvo
   (`autolinking_manager.rb`, `supports_platform?`). O pod nunca entraria no binário,
   e a ponte gravaria no vazio. Subir o alvo mínimo do app para 16.4 tiraria o app de
   aparelhos com iOS 15 e 16, decisão de produto que esta frente não toma.

   O podspec do módulo local usa o mesmo mecanismo a nosso favor: declara iOS 15.1
   com `EXPO_PUBLIC_ENABLE_WIDGETS=true` no ambiente do `pod install` e 99.0 sem ela,
   e o autolink o deixa fora da build.
5. **Visual:** SwiftUI com as cores dos tokens do app (`src/ui/theme.ts`), claro e
   escuro, fontes do sistema com estilos de texto (Dynamic Type), sem imagem.
6. **Android: fora do recorte.** Widgets no Android exigem outra técnica (Glance ou
   `react-native-android-widget`) e o app não está em produção no Play.

## Consequências

- **Com a chave desligada, o binário é o da `main`:** o prebuild sai igual (a única
  diferença é o identificador aleatório da fase do Sentry, que muda a cada prebuild
  da própria `main`) e nenhum pod novo entra (nem o `RadiantWidgets`, pela regra do
  podspec, nem o `ExtensionStorage`, pelo alvo 15.1). Provas em
  [`evidence/2026-11-15-f5-widgets/`](../evidence/2026-11-15-f5-widgets/README.md).
- **O lockfile muda para todas as builds:** a instalação do pacote subiu o
  `@expo/image-utils` (0.8.8 → 0.8.17, usado pelo prebuild para ícone e splash) e o
  `minipass`, e o pacote traz cópias próprias de `@expo/config-plugins` e
  `@expo/prebuild-config` do SDK 55. Medido em 2026-11-15: o prebuild com a chave
  desligada continua idêntico ao da `main` instalada pelo próprio lockfile, PNGs
  incluídos. Achado da revisão independente.
- **O widget pode divergir da home, por desenho:** a home mostra o `streakDays`
  gravado, que só muda quando o aluno estuda; o widget aplica a regra e mostra 0
  quando a sequência já quebrou (dois dias sem estudo, ou backup restaurado sem
  `lastActiveDate`). O widget está certo pela regra; alinhar a home é decisão do dono.
- Se o alvo mínimo do app subir para 16.4 ou mais, o `ExtensionStorage` do pacote
  passa a entrar por autolink em todo binário, inerte. Nesse dia, vale mover o pacote
  para `devDependencies` ou excluí-lo do autolink.
- Ligar `ENABLE_WIDGETS` por OTA num binário compilado sem a chave é inofensivo: o
  módulo nativo não existe, `requireOptionalNativeModule` devolve `null` e a ponte
  não faz nada, sem aviso.
- O prebuild com a chave ligada gera `Assets.xcassets` (as cores) dentro de
  `modules/radiant-widgets/targets/widget/`. No EAS isso é descartável; num prebuild
  local, apague a pasta ou acrescente-a ao `.gitignore` (fora do escopo deste run).
- O dono precisa criar o App Group no portal e associá-lo aos dois identificadores
  antes da primeira build com a chave ([runbook](../runbooks/2026-11-15-widgets-ios.md)).
- O widget não depende de o app abrir para deixar de mentir: à meia-noite a entrada
  seguinte assume ("hoje ainda não conta", meta zerada) e, quando a sequência quebra
  pela regra, ela aparece zerada.

## Fontes

- README e código de `EvanBacon/expo-apple-targets` (clonado em 2026-11-15, versão 5.0.0).
- Documentação do `expo-widgets`: docs.expo.dev/versions/v55.0.0/sdk/widgets.
- Blog do Expo, "Home screen widgets and live activities in Expo" (2026-03-04).
