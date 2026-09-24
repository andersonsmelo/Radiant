# iOS 27 — insumos para a decisão: imagem com Xcode 26 ou `UIScene`

**Data da pesquisa:** 2026-09-24. **Autor:** agente (Claude), frente C do
[prompt de continuidade](../superpowers/handoffs/2026-09-24-radiant-prompt-de-continuidade.md).
**Decisor:** dono. Nenhum código foi alterado.

Cada afirmação diz se foi **medida** (com a fonte ou o comando) ou **inferida**.

## A resposta curta

1. **A build do EAS já usa o Xcode 26.** O `eas.json` não fixa imagem, e a
   imagem padrão do SDK 54 é `macos-sequoia-15.6-xcode-26.0`. A build de
   produção da 1.3.1 saiu dela, com o SDK do iOS 26.0. O app fecha na abertura
   só quando é compilado com o **Xcode 27**, e hoje isso acontece só **nesta
   máquina**, que tem apenas o Xcode 27.
2. **A 1.4 pode sair sem mudar nada**, pela saída 1. O prazo real é **abril de
   2027**: a partir daí a Apple só aceita envio compilado com o SDK do iOS 27,
   e aí o `UIScene` é obrigatório.
3. **O SDK 54 não tem suporte oficial a `UIScene`, e não vai ter.** A Expo
   entregou o suporte no SDK 58 e uma opção de ativação no SDK 57 a partir do
   `57.0.23`. Adotar `UIScene` no SDK 54 significa escrever e manter um config
   plugin próprio.

**Recomendação do agente:** saída 1 para a 1.4, com a imagem fixada
explicitamente no `eas.json`. O `UIScene` entra pela **atualização do SDK**
(para o 58, onde já é padrão), como frente própria depois da 1.4 e antes de
abril de 2027. Não escrever plugin próprio sobre o SDK 54.

## Medições

| # | O quê | Resultado | Fonte / comando |
| --- | --- | --- | --- |
| M1 | `ios.image` nos perfis do `radiant-app/eas.json` | ausente nos 7 perfis | leitura do arquivo, 2026-09-24 |
| M2 | Imagem padrão do SDK 54 no EAS | `macos-sequoia-15.6-xcode-26.0` — macOS 15.6, **Xcode 26.0 (17A324)**, Node 20.19.4 | [docs.expo.dev/build-reference/infrastructure](https://docs.expo.dev/build-reference/infrastructure/), página atualizada em 2026-07-09, lida em 2026-09-24 |
| M3 | Imagem, Xcode e SDK da build de produção da 1.3.1 (11) — EAS `7c18e187`, 2026-09-11, commit `063770d` | `macos-sequoia-15.6-xcode-26.0`, `Xcode 26.0 (17A324)`, `iPhoneOS26.0.sdk` | log da build (`npx eas build:list --platform ios --json` → `logFiles`, conteúdo em brotli) |
| M4 | Outras imagens com Xcode 26 no EAS | `macos-sequoia-15.6-xcode-26.1` (26.1), `macos-sequoia-15.6-xcode-26.2` (26.2, padrão do SDK 55), `macos-tahoe-26.4-xcode-26.4` (26.4, SDK 56), `macos-tahoe-26.5-xcode-26.6` (26.6, `latest`, SDK 57). Alternativa com Xcode 16.4 para o SDK 54: `macos-sequoia-15.6-xcode-16.4` | mesma página de M2 |
| M5 | Imagem com Xcode 27 no EAS | **nenhuma** listada | mesma página de M2 |
| M6 | Prazo da Apple | "Starting April 2027 … iOS and iPadOS apps must be built with the iOS 27 & iPadOS 27 SDK or later" | [Apple Developer News, 2026-09-09](https://developer.apple.com/news/?id=k1mtkt1k) |
| M7 | Suporte da Expo a `UIScene` | padrão no **SDK 58**; opção `ios.enableSceneSupport` do `expo-build-properties` no **SDK 57 a partir do `57.0.23`** (publicado em 2026-09-15). Issue [expo/expo#46664](https://github.com/expo/expo/issues/46664) fechada em 2026-09-23 apontando para essa opção | [expo/fyi — ios-scene-lifecycle.md](https://github.com/expo/fyi/blob/main/ios-scene-lifecycle.md) |
| M8 | Suporte no SDK 54 | nenhum: o último patch, `expo@54.0.37` (2026-08-17), e o `expo-modules-core@3.0.30` não têm `ExpoAppSceneDelegate` nem manifesto de cena | `npm pack` dos dois pacotes e busca no conteúdo |
| M9 | React Native por SDK | o app usa RN **0.81.5** (`expo@54.0.32`); o SDK 57 usa RN **0.86.3**; o SDK 58 (`58.0.0-preview.6`), RN **0.88.0-rc.1** | `bundledNativeModules.json` de cada pacote; `node_modules` local |
| M10 | Xcode nesta máquina | só `Xcode 27.0 (27A266a)`; simuladores iOS 26.5 e 27.0 | `ls -d /Applications/Xcode*.app`, `xcodebuild -version`, `xcrun simctl list runtimes` |
| M11 | A pasta `radiant-app/ios/` | ignorada pelo git (`.gitignore`, linha 42): o projeto é CNG, então código nativo só entra por config plugin | `radiant-app/.gitignore` |
| M12 | Ganchos de ciclo de vida nos módulos nativos | `modules/radiant-cloudkit` e `radiant-storekit`: nenhuma ocorrência. `expo-notifications`, `expo-linking`, `expo-router` e `expo-splash-screen`: 1 arquivo cada com `ExpoAppDelegateSubscriber`, `UIScreen.main`, `keyWindow` ou `applicationDidBecomeActive` (contagem por busca, não analisada) | `grep` em `radiant-app/modules` e `node_modules/<pacote>/ios` |

**Não medido:**

- as três builds `preview` de 2026-09-15/16: só a de produção teve o log lido;
- a 1.3.1 publicada rodando num aparelho com iOS 27. A afirmação de que ela
  não é afetada vem da regra da Apple, de que o requisito vale para apps
  **compilados com** o SDK 27, e de relatos de terceiros, não de teste nosso;
- se a Expo pode trocar a imagem por trás do padrão do SDK 54. A página não
  promete nada sobre isso.

## Saída 1 — manter a build no Xcode 26

**O que fazer:** nada é obrigatório, porque M1 a M3 mostram que já é assim. O
recomendado é **fixar a imagem** nos perfis de iOS do `eas.json`
(`"ios": { "image": "macos-sequoia-15.6-xcode-26.0" }` em `production`,
`preview` e `development`), para que uma mudança do padrão pela Expo não troque
o Xcode no meio da 1.4.

**Custo:**
- Fixar a imagem: uma edição no `eas.json`, sem build extra. A próxima build já
  a usa.
- Sem mudança de código nativo nem de dependência.
- Para compilar localmente, há duas opções:
  - seguir com o procedimento atual (Xcode 27 e simulador iOS 26.5, na seção
    "Risco de build" do STATUS);
  - ou instalar um Xcode 26.x ao lado do 27 (não medido; o download é da
    ordem de gigabytes).

**Risco:**
- **Prazo, não defeito:** vale até abril de 2027 (M6). Depois disso, nenhum
  envio passa sem `UIScene`.
- **Testes no simulador do iOS 27:** o que for compilado localmente com o
  Xcode 27 continua fechando na abertura. Os E2E locais ficam no iOS 26.5.
- **Build do EAS no iOS 27:** o app compilado pelo EAS com o SDK 26 roda no
  iOS 27 pelo modo de compatibilidade da Apple (inferido). Confira no primeiro
  build `development` da 1.4, que o dono já precisa fazer para o StoreKit.
- **Imagem desatualizada:** fixar uma imagem antiga ignora correções da Expo
  nela. É baixo enquanto a 1.4 estiver no SDK 54.

**Reversível?** Sim. É apagar a linha.

## Saída 2 — adotar `UIScene`

Há dois caminhos, com custos muito diferentes.

### 2a. Config plugin próprio sobre o SDK 54

**O que é:** o que o SDK 57.0.23 faz, reescrito à mão. O plugin precisa:
- incluir `UIApplicationSceneManifest` no `Info.plist`;
- criar um `SceneDelegate` que monta a janela e inicia o React Native em
  `scene(_:willConnectTo:options:)`;
- tirar do `AppDelegate` a criação da janela;
- **reencaminhar a mão** URLs, user activity e eventos de primeiro e segundo
  plano, porque sob cenas o UIKit deixa de chamar esses métodos do
  `AppDelegate` (M7).

Existe um plugin da comunidade para o SDK 56
([YesterdaysLemon/expo-ios-scene-lifecycle-plugin](https://github.com/YesterdaysLemon/expo-ios-scene-lifecycle-plugin),
12 estrelas, marcado pelo autor como temporário).

**Custo (estimado, não medido):**
- escrever e testar o plugin;
- E2E dos caminhos que dependem de ciclo de vida, no iOS 26 **e** no 27:
  - deep link a frio e a quente (`radiantapp://`, `expo-router`);
  - toque em notificação;
  - splash;
  - `AppState`, com o retorno do segundo plano;
  - restauração do StoreKit ao voltar para o app.

Os quatro pacotes de M12 precisam ser lidos um a um.

**Risco:** alto para a 1.4.
- **Regressão fora do código testado:** a própria Expo precisou corrigir
  `Linking.getInitialURL()` a frio ([expo/expo#47628](https://github.com/expo/expo/pull/47628))
  e a entrega dupla de URL no caminho oficial (M7). Nosso plugin herdaria esses
  defeitos sem as correções.
- **Custo morto:** o plugin é descartado na atualização do SDK.
- **Guarda sem cobertura:** o gate `npm run quality` não empacota o app (STATUS,
  "O que o gate NÃO pega"). Nada disso aparece nos testes.

### 2b. Atualizar o SDK (para o 57.0.23+ com a opção, ou para o 58)

**O que é:** três saltos de SDK. O React Native passa de 0.81 para 0.86 ou
0.88 (M9), e cada dependência nativa sobe junto:
- os dois módulos Swift próprios (CloudKit e StoreKit);
- Sentry, `expo-audio` e `expo-notifications`.

**Custo (estimado, não medido):** o maior dos três caminhos.
- Uma frente inteira: atualizar, corrigir a quebra, rodar o gate e fazer E2E
  completo.
- Refaz a validação da 1.4, que hoje depende da `main` como está.

**Risco:** alto se entrar antes da 1.4, porque a janela de lançamento passa a
depender de uma migração. Baixo depois da 1.4, porque o `UIScene` sai como
padrão do SDK 58, mantido pela Expo, e não como código nosso.

## Comparação

| | Saída 1 (Xcode 26) | 2a (plugin no SDK 54) | 2b (SDK 57/58) |
| --- | --- | --- | --- |
| Mudança | 1 linha por perfil, opcional | plugin nativo novo | migração de SDK |
| Bloqueia a 1.4? | não | sim, até o E2E passar no 26 e no 27 | sim, se vier antes |
| Resolve abril de 2027? | não | sim | sim |
| Quem mantém | Expo (imagem) | nós | Expo |
| Reversível | sim | sim, com prebuild | caro |

## O que o dono decide

1. **Para a 1.4:** saída 1, fixando a imagem ou deixando o padrão. O agente
   recomenda fixar, porque a 1.4 vai passar por várias builds (`development`,
   sandbox e produção), e a imagem trocar no meio desse ciclo seria um risco
   sem nenhum ganho.
2. **Depois da 1.4:** quando abrir a frente de atualização do SDK. O limite é
   abril de 2027, e o SDK 58 é o primeiro com `UIScene` por padrão (M7).
