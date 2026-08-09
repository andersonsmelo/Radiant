# Radiant App

Cliente mobile do Radiant, construído com Expo, React Native, Expo Router e TypeScript.

## Objetivo

O app implementa o núcleo do produto Radiant:

- estudo em microlições;
- quiz com feedback imediato;
- revisão por spaced repetition;
- gamificação leve;
- onboarding progressivo;
- telemetry e heurísticas para validação controlada de uso;
- camada de App Store para hábito, reputação e monetização saudável.

## Stack atual

- Expo 54
- React Native 0.81
- React 19
- Expo Router
- TypeScript
- AsyncStorage
- Reanimated
- Gesture Handler

## Estrutura principal

```text
src/app/                 # router root principal do produto
src/features/            # domínios do produto
src/ui/                  # design system, motion, personagens
src/types/               # contratos de domínio
src/data/                # seed local e catálogo inicial
src/storage/             # persistência local
src/config.ts            # configuração central e flags do app
```

## Features atuais

- `home`
- `journey` (rollout controlado)
- `lesson-flow` (mínimo inicial)
- `quiz`
- `review`
- `spaced-repetition`
- `gamification`
- `annotation`
- `telemetry`
- `heuristics`
- `onboarding`
- `paywall`
- `push`
- `beta`
- `progress`
- `auth`
- `sync`

## Conteúdo

O app usa atualmente um catálogo local versionado para alimentar Quiz e Review:

- catálogo: `src/data/lessons.ts`
- manifesto: `src/data/catalog.ts`
- adapter de leitura: `src/features/content/services/LessonCatalogService.ts`

Essa camada substitui o uso anterior de mocks hardcoded em tela e hook. O catálogo local também alimenta a `Learning Road V2`: as trilhas em `src/data/catalog.ts` viram definições de jornada em `src/features/journey/services/JourneyDefinitionService.ts`.

Estado runtime do catálogo em 2026-04-09:

- `Fundamentos` (`track-radiology-foundations`) — trilha padrão;
- `Tórax` (`track-thorax-patterns`) — trilha selecionável na jornada;
- `Abdome` (`track-abdomen-essentials`) — trilha selecionável na jornada;
- refresh remoto opcional via `/v1/content/catalog`, sem bloquear o fallback local.

## Learning Road

A Learning Road é a **home oficial do produto** desde 2026-07-27 e é o que lança na v1.3 — ver [ADR da home de produção](../docs/adr/ADR-2026-07-27-learning-road-como-home.md). A flag `EXPO_PUBLIC_ENABLE_LEARNING_ROAD` deixou de ser um interruptor de redesign em andamento e passou a ser um **kill switch de rollback**: seu default é `true` e ela é declarada em `development`, `preview` e `production`. Desligá-la restaura a `HomeScreen` clássica, que permanece no código apenas para essa reversão e deve ser removida depois do beta.

Estado atual:

- foundation visual V2 centralizada em `src/ui/theme.ts`, `src/ui/styles.ts` e `src/ui/motion.ts`;
- primitives novas em `src/components/ui/*` com `AppButton`, `SurfaceCard`, `ProgressRing`, `SpeechBubble` e `StatItem`;
- hero compartilhado do mascote em `src/components/ui/PixelHeroSplit.tsx`;
- mascote oficial `Pixel` encapsulado em `src/ui/characters/PixelIllustration.tsx`;
- resolução de assets do mascote centralizada em `src/ui/characters/pixelAssets.ts`;
- domínio `journey` implementado em `src/types/journey.ts` e `src/features/journey/services/*`;
- persistência local versionada para progresso da jornada (`journey-progress.v2`);
- progresso separado por trilha, preservado ao alternar entre `Fundamentos`, `Tórax` e `Abdome`;
- migração segura do store legado `journey-progress.v1` para o bucket da trilha padrão;
- Home de produção (Learning Road) em `src/features/journey/screens/JourneyHomeScreen.tsx`;
- prateleira `Trilhas disponíveis` em `src/features/journey/components/JourneyTrackShelf.tsx`;
- cards acionáveis de trilha em `src/features/journey/components/JourneyTrackCard.tsx`;
- estado inline de trilha pausada quando não existe próximo nó elegível para abrir;
- `lesson-flow` declarativo já remodelado visualmente em `src/features/lesson-flow/*`;
- `checkpoint` dedicado navegável pela rota `/checkpoint`;
- `reward` dedicado navegável pela rota `/reward`;
- `quiz` e `review` já migrados para o novo sistema visual;
- trilhas prioritárias navegáveis pelas rotas dedicadas `/learn`, `/checkpoint`, `/reward`, `/quiz` e `/review`.

Status funcional:

- a flag é ligada por padrão e em todos os perfis do `eas.json`; desligá-la é rollback, não configuração normal;
- a Home do produto é a trilha; a `HomeScreen` clássica só aparece com a flag desligada;
- a Home mostra as trilhas disponíveis e abre o próximo nó real da trilha selecionada;
- quando não houver próximo nó elegível, a Home mantém a trilha ativa e explica o estado no próprio fluxo;
- cada trilha monta sua própria definição de nós a partir das lições do catálogo;
- `checkpoint` já possui flow dedicado e persiste conclusão localmente;
- `reward` já possui flow dedicado e persiste a conquista localmente;
- `review` e `quiz` mantêm a engine atual, com o chrome e as superfícies atuais;
- `reward` fecha o ciclo dedicado da jornada e entra no smoke do fluxo crítico.

### Telas entregues da Learning Road

As telas que compõem a home de produção e o fluxo crítico da v1.3:

- `Journey Home`
- `Journey Track Shelf`
- `Lesson Flow`
- `Checkpoint`
- `Reward`
- `Review`
- `Quiz`

Arquivos principais deste rollout:

- `src/features/journey/screens/JourneyHomeScreen.tsx`
- `src/features/journey/components/JourneyTrackShelf.tsx`
- `src/features/journey/components/JourneyTrackCard.tsx`
- `src/features/journey/services/JourneyDefinitionService.ts`
- `src/features/journey/services/JourneyProgressService.ts`
- `src/features/lesson-flow/screens/LessonFlowScreen.tsx`
- `src/features/checkpoint/screens/CheckpointScreen.tsx`
- `src/features/rewards/screens/RewardScreen.tsx`
- `src/features/review/screens/ReviewScreen.tsx`
- `src/features/quiz/screens/QuizScreen.tsx`

### Remoção da `HomeScreen` clássica (pós-beta)

A `HomeScreen` clássica não é mais a home do produto: ela só é montada quando
`EXPO_PUBLIC_ENABLE_LEARNING_ROAD` é desligada, que hoje é o caminho de rollback.
Ela permanece no código apenas como esse kill switch e é dívida rastreada — deve
sair depois que o beta estabilizar a Learning Road em produção.

Plano de remoção (executar quando o beta confirmar a Learning Road como home
estável, sem necessidade de rollback):

1. Remover o branch de flag em `src/app/(tabs)/index.tsx`, deixando a rota
   renderizar `JourneyHomeScreen` diretamente.
2. Excluir `src/features/home/screens/HomeScreen.tsx` e
   `src/features/home/screens/HomeScreen.flow.test.tsx`.
3. Retirar a flag `ENABLE_LEARNING_ROAD` de `src/config.ts` e dos perfis do
   `eas.json` (o comportamento passa a ser fixo, não mais configurável).
4. Atualizar esta seção e o exemplo de rollback abaixo, que deixa de existir.

Enquanto o rollback for necessário, a flag e a `HomeScreen` ficam; a remoção é
uma única passada mecânica depois que o caminho de reversão puder ser aposentado.

**Onboarding órfão (investigado na task B6, 2026-07-27).** A adoção da Learning
Road deixou duas superfícies de onboarding sem uso em produção. O **wizard** já
foi removido (2026-07-28, ver abaixo); o **onboarding suave** ainda depende da
`HomeScreen` e sai junto com ela:

- O **onboarding suave** (`OnboardingService`, cartão de intro no Dia 0 e banner
  de encerramento no Dia 7) é consumido **apenas** pela `HomeScreen` clássica.
  A Learning Road não o fia, então ele nunca aparece em produção. Sai junto com a
  `HomeScreen`; se o intro/closure for desejado na Learning Road, ele precisa ser
  reconectado à `JourneyHomeScreen` de propósito.
- O **wizard de onboarding** em `src/app/onboarding/*` (welcome → especialidade →
  meta) era um **protótipo inacabado** que **não persistia as escolhas** (o
  "Build my plan →" só fazia `router.replace('/(tabs)')`) e que nenhuma tela de
  produção navegava — só o deep link `radiantapp://onboarding`. **Removido em
  2026-07-28**: as rotas `onboarding/index`, `onboarding/value`, `onboarding/goal`
  e o `Stack.Screen name="onboarding"` fantasma do `_layout` (a rota real era
  `onboarding/index`, então o Metro o acusava a cada boot). O smoke
  `onboarding-to-home.yaml`, que dirigia esse wizard e já afirmava strings em
  inglês tornadas obsoletas pela migração pt-BR de 07-27, foi repontado para
  `boot-to-home.yaml` (instalação limpa → `Foco de hoje`). Se um setup guiado for
  desejado no futuro, deve ser **reconstruído** como feature real (pt-BR, trilhas
  do catálogo, persistindo especialidade e meta diária).

**Apresentação vigente (decidida em 2026-08-02, encurtada em 2026-08-09).** A
instalação limpa abre três telas puláveis narradas pelo Pixel. **Começar**
persiste a saída, consulta a jornada e abre o próximo nó elegível; **Pular
apresentação** abre a Home. Não há wizard de especialidade/meta, id de lição
hardcoded nem login no caminho. Rever a apresentação não navega automaticamente
ao final. O flow focado passou no iOS e no Android em 2026-08-09.

## Sistema visual V2

O app agora usa uma camada visual clara e progress-driven inspirada na direção `Radiology Journey` da segunda versão do Stitch.

### Direção

- app de aprendizado em radiologia, não health companion;
- superfícies claras com branco azulado e glow ciano controlado;
- azul elétrico como primária;
- Pixel como guia emocional recorrente;
- foco em próximo passo, não em dashboard de métricas.

### Tokens

- cores e sombras: `src/ui/theme.ts`
- spacing, radius e tipografia: `src/ui/styles.ts`
- motion com reduced motion: `src/ui/motion.ts`

### Primitives base

- `AppButton`
- `SurfaceCard`
- `ProgressRing`
- `SpeechBubble`
- `StatItem`
- `PixelHeroSplit`

Esses componentes são a base obrigatória para telas novas do rollout V2. `PrimaryButton` permanece apenas como wrapper de compatibilidade.

## Sistema do Pixel

O mascote oficial do app é `Pixel`, com contrato técnico em:

- `src/ui/characters/PixelIllustration.tsx`
- `src/ui/characters/pixelAssets.ts`
- `src/ui/characters/assets/pixel/*`

Estratégia atual:

- exports base por tamanho (`sm`, `md`, `lg`);
- variações visuais compostas em UI para `idle`, `thinking`, `guide`, `happy`, `celebrate` e `oops`;
- suporte já preparado para assets dedicados por `state + tier + size`, com fallback seguro para os exports base.

Superfícies principais já padronizadas com hero compartilhado do mascote:

- `journey`
- `checkpoint`
- `review`
- `quiz` (summary/result state)

## Auth e sync remoto

O app já possui integração funcional com o `radiant-api` para:

- bootstrap de sessão persistida;
- refresh automático de access token expirado;
- login e cadastro por email/senha;
- logout com revogação de refresh token;
- fila local para sync posterior de:
  - `lesson_progress`;
  - `review_cards`.

A implementação atual também endurece o comportamento offline-first:

- startup com estados explícitos de loading, pronto e erro;
- timeout de API no cliente HTTP;
- fila local com retry/backoff, normalização de itens legados e flush idempotente;
- estudo local não bloqueado por falha remota durante review e progresso.

A superfície atual de homologação fica na tela `Progresso`, que expõe:

- status da API configurada;
- teste manual de `GET /health`;
- autenticação;
- quantidade de itens pendentes na fila;
- último erro de sync conhecido;
- flush manual da fila.

Em builds de produção, detalhes técnicos e telas de debug ficam restritos por flags de ambiente.

## App Store Operating System no app

O runtime do app já implementa uma camada operacional de App Store voltada a
retenção, reputação e monetização sem pressionar o usuário cedo demais.

Estado atual:

- o onboarding já registra `first_value_moment_reached`;
- `RatingPromptService` decide elegibilidade e registra
  `rating_prompt_eligible`, `rating_prompt_shown`, `rating_prompt_deferred` e
  `rating_prompt_blocked`;
- `PaywallService` só libera oferta depois de valor percebido, mínimo de
  sessões, dias desde instalação e ausência de erro de sync;
- o paywall contextual já está integrado em `reward`, `quiz` e `checkpoint`;
- quando o review prompt aparece, o paywall não é exibido na mesma sessão de
  sucesso;
- `UpgradeInterestService` captura interesse de upgrade de forma local-first;
- `TelemetryDebugScreen` mostra o card `App Store Ops`, interesses de upgrade e
  permite compartilhar um war room snapshot textual.

Arquivos principais:

- `src/services/RatingPromptService.ts`
- `src/features/paywall/PaywallService.ts`
- `src/features/paywall/UpgradeInterestService.ts`
- `src/features/telemetry/services/AppStoreOpsService.ts`
- `src/features/telemetry/screens/TelemetryDebugScreen.tsx`

## Release e EAS

Estado operacional validado em **2026-08-09** — detalhes e bloqueios no
[`status canônico`](../docs/EXECUTION_STATUS_2026-08-09.md):

- projeto EAS vinculado a `@hashi1802/radiant-app`, com contadores de build
  governados remotamente;
- Apple Developer e App Store Connect ativos; `1.3.1 (7)` submetida e ainda em
  **Aguardando revisão**, com liberação manual após aprovação;
- Android `1.3.0 (4)` ativo no teste fechado `alpha`; o gate é 12+ opt-ins por
  14 dias consecutivos, não a quantidade de contas vinculadas;
- `EXPO_PUBLIC_API_BASE_URL` não é declarado nos perfis distribuídos; o app
  permanece local-first e a API pública conhecida está registrada em HTTP 502;
- `expo-updates` configurado; crash reporting e sync remoto desligados na build
  distribuída.

Perfis principais em [`eas.json`](/Users/anderson/Developer/Radiant/radiant-app/eas.json):

- `development`
- `development-simulator`
- `preview`
- `production`

Estado dos caminhos iOS:

- `development-simulator`: simulador sem assinatura de distribuição;
- `preview`: distribuição interna com o team Apple ativo;
- `production`: App Store/TestFlight; já comprovado pela build `1.3.1 (7)`.

## Comandos

```bash
npm install
npm run start
npm run ios
npm run ios:v2
npm run ios:doctor
npm run ios:preflight
npm run android
npm run lint
npm run typecheck
npm run visual:qa
npm run quality
```

Para homologação iOS antes de build distribuível:

- `npm run ios:doctor` valida Xcode, `simctl` e resolução da config Expo;
- `npm run ios:preflight` executa qualidade do app e o check do ambiente iOS em sequência;
- `npm run ios:v2` sobe o simulador com a combinação oficial de flags da Learning Road V2.

Para build Android local (usado no E2E de 2026-07-28, o primeiro do projeto):

- `CI=1 npx expo prebuild --platform android --no-install` gera `android/`.
  **O `--no-install` é obrigatório** — sem ele o prebuild roda o gerenciador de
  pacotes e mexe no `package-lock.json`, que é versionado.
- `./gradlew assembleRelease` dentro de `android/`, com as sete variáveis
  `EXPO_PUBLIC_*` do perfil `e2e-test` exportadas, produz um APK Release com o
  bundle JS embutido — sem dev client e sem Metro.
- A memória da JVM do Gradle vem do config plugin
  [`plugins/with-gradle-memory.js`](plugins/with-gradle-memory.js), registrado
  em `app.json`. O valor gerado por padrão pelo prebuild não basta: o KSP do
  `expo-updates` estoura o metaspace, e o Gradle **trava no shutdown sem
  imprimir a causa** — o sintoma é um build parado, não um erro. Como o
  `gradle.properties` é gerado, ajustá-lo à mão não sobrevive ao próximo
  prebuild; por isso o plugin. `expo-build-properties` não cobre este caso.
- Receita completa e resultado da suíte em
  [`docs/evidence/2026-07-28-android-e2e-first-run.md`](docs/evidence/2026-07-28-android-e2e-first-run.md).

Para release iOS em nuvem:

- build sem team Apple: `eas build --platform ios --profile development-simulator`
- build distribuível interno: `eas build --platform ios --profile preview`

Para o ritual operacional de App Store:

- `npm run app-store:ops-save` salva o snapshot exportado da tela de debug;
- `npm run app-store:ops-check` valida o artefato em modo advisory;
- `npm run app-store:ops-check:strict` transforma o snapshot em gate real.

## Variáveis de ambiente

Use `.env.example` como base:

```bash
cp .env.example .env
```

Variáveis esperadas:

- `EXPO_PUBLIC_APP_ENV`
- `EXPO_PUBLIC_APP_VERSION`
- `EXPO_PUBLIC_API_BASE_URL`
- `EXPO_PUBLIC_ENABLE_REMOTE_SYNC`
- `EXPO_PUBLIC_ENABLE_REMOTE_CONTENT_CATALOG`
- `EXPO_PUBLIC_ENABLE_CRASH_REPORTING`
- `EXPO_PUBLIC_ENABLE_PRODUCT_ANALYTICS`
- `EXPO_PUBLIC_ENABLE_PAYWALL`
- `EXPO_PUBLIC_ENABLE_REVENUECAT`
- `EXPO_PUBLIC_SENTRY_DSN`
- `EXPO_PUBLIC_ENABLE_LEARNING_ROAD`
- `EXPO_PUBLIC_ENABLE_DEV_TOOLS`
- `EXPO_PUBLIC_ENABLE_TELEMETRY_DEBUG_SCREEN`
- `EXPO_PUBLIC_ENABLE_BETA_GATE`
- `EXPO_PUBLIC_BETA_INVITE_CODE`

Com `EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false`, o app continua operando apenas no modo local-first.
Com `EXPO_PUBLIC_ENABLE_REMOTE_CONTENT_CATALOG=false`, o runtime usa apenas o catálogo local.
Mesmo com o endpoint `/v1/content/catalog` já publicado, o override remoto deve permanecer desligado até a API expor o manifesto completo esperado pelo app.

Exemplo de configuração para homologação contra o VPS:

```dotenv
EXPO_PUBLIC_API_BASE_URL=https://api.radiant.ascendcreative.com.br
EXPO_PUBLIC_ENABLE_REMOTE_SYNC=true
EXPO_PUBLIC_ENABLE_CRASH_REPORTING=true
EXPO_PUBLIC_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
```

Exemplo para reproduzir localmente a `HomeScreen` clássica (caminho de rollback):

```dotenv
EXPO_PUBLIC_ENABLE_LEARNING_ROAD=false
```

## Homologação iOS local da Learning Road V2

O fluxo oficial de homologação local da V2 é `local-first` e não depende de backend remoto.

### Pré-check

```bash
npm run ios:doctor
npm run quality
```

### Subir o app no simulador com a V2

```bash
npm run ios:v2
```

Esse comando força o modo de homologação local com:

- `EXPO_PUBLIC_ENABLE_LEARNING_ROAD=true`
- `EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false`
- `EXPO_PUBLIC_ENABLE_BETA_GATE=false`
- `EXPO_PUBLIC_ENABLE_TELEMETRY_DEBUG_SCREEN=true`
- `EXPO_PUBLIC_ENABLE_DEV_TOOLS=true`

### Reset determinístico do estado local

Abra a aba `Progresso` e use o botão `Resetar estado local da V2`.

Esse reset limpa o estado local relevante para repetir o smoke:

- progresso da jornada;
- spaced repetition;
- daily goal;
- gamification;
- fila de sync;
- sessão local de auth;
- beta access;
- telemetry, heuristics e health score;
- onboarding.

### Smoke flow manual obrigatório

1. O app abre sem `Beta Gate`.
2. A rota inicial cai na `Journey Home`.
3. A seção `Trilhas disponíveis` mostra `Fundamentos`, `Tórax` e `Abdome`.
4. Tocar em uma trilha muda a trilha ativa e abre o próximo nó elegível.
5. Se a trilha não tiver próximo nó elegível, a `Journey Home` mostra o estado inline sem `Alert`.
6. O `Lesson Flow` avança sem travar.
7. O `Checkpoint` conclui e libera o próximo passo.
8. `Quiz` e `Review` continuam navegáveis dentro do chrome V2.
9. Fechar e reabrir o app preserva o progresso local por trilha.
10. A aba `Progresso` mostra `Sync remoto: desativado` sem erro operacional.

### Evidências mínimas

Capture pelo menos estas telas durante a homologação:

- `Journey Home`
- `Journey Home` com prateleira de trilhas
- `Journey Home` com estado inline de trilha sem próximo passo
- `Lesson Flow`
- `Checkpoint` concluído

## Release e distribuição

O app já possui scaffolding explícito para distribuição:

- [`eas.json`](/Users/anderson/Developer/Radiant/radiant-app/eas.json) com perfis `development`, `preview` e `production`;
- perfil `development-simulator` para gerar build de iOS Simulator via EAS;
- identificadores mobile em [`app.json`](/Users/anderson/Developer/Radiant/radiant-app/app.json):
  - iOS `com.ascendcreative.radiant`
  - Android `com.ascendcreative.radiant`
- workflow de qualidade em [`.github/workflows/radiant-app-quality.yml`](/Users/anderson/Developer/Radiant/.github/workflows/radiant-app-quality.yml).

### Soft launch iOS

- [`radiant-app/docs/release/IOS_SOFT_LAUNCH_CHECKLIST.md`](/Users/anderson/Developer/Radiant/radiant-app/docs/release/IOS_SOFT_LAUNCH_CHECKLIST.md)
- [`radiant-app/docs/release/APP_STORE_METADATA.md`](/Users/anderson/Developer/Radiant/radiant-app/docs/release/APP_STORE_METADATA.md)
- [`radiant-app/docs/release/TESTFLIGHT_SMOKE.md`](/Users/anderson/Developer/Radiant/radiant-app/docs/release/TESTFLIGHT_SMOKE.md)

Uso esperado dos perfis:

- `preview`: internal QA e validação de soft launch
- `production`: candidato de App Store só depois do checklist passar

Comandos principais:

```bash
eas build --platform ios --profile preview
eas build --platform ios --profile production
```

### Preflight local de iOS

Antes de homologar no simulador, rode:

```bash
npm run ios:doctor
```

O script valida:

- `xcode-select` apontando para o Xcode completo;
- disponibilidade de `xcodebuild`;
- disponibilidade de `simctl`;
- resolução do `app.json` via Expo.

Para gerar artefato de simulador no EAS, use o perfil `development-simulator`.

### Preflight de release

Antes de gerar build distribuível, rode:

```bash
npm run release:preflight
```

Esse preflight valida:

- Node.js 20.x;
- presença de `EXPO_PUBLIC_API_BASE_URL` quando o sync remoto estiver ativo;
- disponibilidade de `eas`;
- autenticação Expo via `eas login` ou `EXPO_TOKEN`;
- tooling Apple local via `npm run ios:doctor`.

Estado operacional atual:

- homologação em simulador já é viável com `xcodebuild` e `simctl` funcionando localmente;
- a build iOS nativa já foi revalidada em `iPhone 17` com `expo run:ios` e `ios:v2` conectando no bundle atual;
- smoke principal de produto já está documentado com captura de `cold start`, `auth restore`, `quiz`, `review`, `journey` e `progresso/sync`;
- o smoke físico de sete cenários passou em 2026-08-05 e o Gate 2/VoiceOver
  fechou em 2026-08-06; o último estado observado no App Store Connect, em
  2026-08-09, foi `1.3.1 (7)` **Aguardando revisão**, com liberação manual após
  aprovação. O console é a fonte do estado atual.

### Gate de comando central (repositório)

Para validar app + API em uma única rotina, rode no diretório raiz do monorepo:

```bash
cd "$(git rev-parse --show-toplevel)"
bash scripts/launch-war-room.sh
```

Resultado esperado atual: `PASS=13 FAIL=0`.

## Estado do projeto

O app está em transição de beta local-first para produto distribuível.

Prioridades imediatas:

- acompanhar a App Review da `1.3.1 (7)` e liberar manualmente após aprovação;
- no Android, alcançar 12 opt-ins e completar os 14 dias do teste fechado;
- resolver os direitos do primeiro lote de mídia antes dos jogos visuais da
  Task 10;
- antes da Task 12, tornar explícita a guarda de ativação do agendador por
  competência;
- varrer o padrão `jest.spyOn` sobre mocks oficiais nas demais suítes;
- manter API, auth e sync fora do caminho distribuído enquanto a implantação da
  estratégia de catálogo remoto não acontecer.

## Documentação

- mapa e precedência: [`../docs/README.md`](../docs/README.md)
- PRD: [`../docs/PRD.md`](../docs/PRD.md)
- arquitetura vigente: [`../docs/ARCHITECTURE_STATE.md`](../docs/ARCHITECTURE_STATE.md)
- fluxo do cliente: [`../docs/CLIENT_FLOW.md`](../docs/CLIENT_FLOW.md)
- status canônico: [`../docs/EXECUTION_STATUS_2026-08-09.md`](../docs/EXECUTION_STATUS_2026-08-09.md)
- roadmap ativo: [`../docs/plans/2026-07-27-radiant-launch-roadmap.md`](../docs/plans/2026-07-27-radiant-launch-roadmap.md)
- checklist de release: [`../docs/release/CHECKLIST_RELEASE_V1.3.md`](../docs/release/CHECKLIST_RELEASE_V1.3.md)
- acessibilidade: [`docs/ACCESSIBILITY_QA_V1.md`](docs/ACCESSIBILITY_QA_V1.md)
- E2E local-first: [`docs/E2E_RUNBOOK.md`](docs/E2E_RUNBOOK.md)
- evidências datadas: [`docs/evidence/README.md`](docs/evidence/README.md)
