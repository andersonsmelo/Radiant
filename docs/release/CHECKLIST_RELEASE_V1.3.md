# Checklist de release — Radiant v1.3

> Lista única de **go/no-go** para submeter a v1.3 nas duas lojas. Cada item tem
> estado e dono; os detalhes vivem nas tasks do
> [roadmap de lançamento](../plans/2026-07-27-radiant-launch-roadmap.md) e no
> [status vivo](../STATUS.md). Este documento **não
> substitui** o roadmap — ele é o checklist final que se percorre antes de cada
> submissão.
>
> Legenda: ✅ feito · ⏳ pendente · ⛔ bloqueado (dependência externa) ·
> 🔁 refazer sob perfil de produção.

**Última atualização:** primeira vitória E2E iOS + Android e App Store Connect
medidos em 2026-08-09 · **Alvo:** v1.3.1

> **Por que a marca separa código de console.** A validação datada ancora o que
> existe no repositório; preço, declarações e estado da App Review não pertencem
> ao Git e precisam de data e hora. Misturar os dois como se fossem uma única
> fotografia faria o checklist parecer mais preciso do que a evidência permite.

> **Por que esta revisão foi grande.** O checklist ficou parado em 2026-07-27
> enquanto o status canônico e os planos avançaram quatro dias. Quinze itens
> aqui marcados ⏳ ou ⛔ já estavam fechados. Isso não é cosmético: um checklist
> de go/no-go é documento de **instrução** — quem o percorre decide o que fazer a
> seguir, e bloqueio fantasma faz alguém *não* fazer trabalho que já podia
> começar. Documento de estado envelhecido engana quem lê; documento de instrução
> envelhecido produz latência. Ao fechar uma task, atualize os dois gêneros.

## 1. Qualidade e app (M1)

- [x] ✅ `npm run quality` verde (lint, typecheck, visual QA strict, contratos).
- [x] ✅ Suíte de testes verde (`npm test`).
- [x] ✅ Gate 2 de acessibilidade — item 5 (teclado no build web) fechado; folga
  da tab bar e `JourneyMap` corrigidos. Ver
  [`ACCESSIBILITY_QA_V1.md`](../../radiant-app/docs/ACCESSIBILITY_QA_V1.md).
- [x] ✅ Gate 2 — **item 2** (VoiceOver, task **B4**) fechado em 2026-08-06;
  com isso o Gate 2 ficou **5/5**. A evidência e o gatilho de reabertura estão em
  [`2026-08-06-b4-voiceover-item2.md`](../../radiant-app/docs/evidence/2026-08-06-b4-voiceover-item2.md).
- [ ] ⏳ Nó de reward coberto por E2E nas duas plataformas (task **B5**). O
  `reward-unlock.yaml` passou no iOS em 2026-08-06; a execução Android dos 170
  passos continua pendente e exige janela exclusiva de host. O flow bloqueado
  (`reward-locked.yaml`) já passou nas duas plataformas.
- [x] ✅ Primeira experiência (tasks **B6/B9**) — o wizard morto foi removido e
  a apresentação aprovada de três telas permanece pulável. Desde 2026-08-09,
  **Começar** abre o próximo nó elegível e **Pular apresentação** abre a Home;
  o `first-run.yaml` atualizado passou 1/1 em simulador iOS 26.5 e 1/1 em
  emulador Android API 36 sobre builds locais Release. Ver
  [`2026-08-09-primeira-vitoria-ios.md`](../../radiant-app/docs/evidence/2026-08-09-primeira-vitoria-ios.md)
  e
  [`2026-08-09-primeira-vitoria-android.md`](../../radiant-app/docs/evidence/2026-08-09-primeira-vitoria-android.md).

## 2. Versionamento e OTA (task D5) — ✅ CONCLUÍDA em 2026-07-28

Estado medido em 2026-08-08: `version` **1.3.1** · contadores de build remotos ·
`runtimeVersion.policy` `appVersion`.

- [x] ✅ `version` = **1.3.1** em `package.json` e `app.json`, alinhados.
- [x] ✅ `cli.appVersionSource: remote` + `autoIncrement`: os valores locais de
  `ios.buildNumber`/`android.versionCode` não respondem qual foi o último build.
  O artefato iOS submetido é `1.3.1 (7)`.
- [x] ✅ Política de `runtimeVersion` documentada aqui e no roadmap (D5).
  **Continua valendo o alerta:** depois do primeiro build publicado, nunca alterar
  `runtimeVersion` sem novo build — OTA só entrega JS compatível.

## 3. E2E e matriz real-device (task D3/16)

- [x] ✅ Os 3 flows Maestro sob build Release local com bundle embutido, que é o
  equivalente de produção (task **B0.1**) — **fechado nas duas plataformas em
  2026-07-29**: iOS `3/3` (7m32s) e Android `3/3` (11m48s). Evidência em
  [`2026-07-29-android-e2e-close.md`](../../radiant-app/docs/evidence/2026-07-29-android-e2e-close.md).
- [x] ✅ Paridade Android: `expo prebuild` + build + 3 flows em emulador
  (Onda **C**, task C3) — `radiant-app/android/` existe e o APK Release
  builda em 48s com o JDK 17 de `~/.jdks`.
- [ ] ⏳ **1 device Android físico** (task **C4**) — a parte da Onda C que
  continua aberta. Emulador não substitui.
- Runbook e critérios: [`E2E_RUNBOOK.md`](../../radiant-app/docs/E2E_RUNBOOK.md).

### Matriz real-device

Testar o fluxo crítico (onboarding → trilha → lição → quiz → checkpoint →
progresso) e os itens de plataforma em cada linha marcada. Mínimo para
submeter: uma linha iOS e uma Android com PASS.

| Dispositivo | Classe | iOS/Android | Status | Cobre |
| --- | --- | --- | --- | --- |
| iPhone físico; modelo/iOS não registrados | não inferida | iOS | ✅ | smoke de 7 cenários, relaunch offline, links legais e VoiceOver; build `1.3.1 (5)` |
| iPhone 6,7" (ex.: 15/16 Pro Max) | grande | iOS | ⏳ | notch dinâmico, safe area, fontes ampliadas |
| iPhone 6,1"/6,5" (ex.: 15/16) | médio | iOS | ⏳ | tamanho mais comum |
| ~~iPad 13"~~ | tablet | iPadOS | ➖ **fora de escopo** | `supportsTablet: false` na v1.3 (decidido em E1, 2026-07-29) |
| Android phone compacto (~5,8") | pequeno | Android | ⏳ | edge-to-edge, teclado, densidade |
| Android phone médio (~6,5") | médio | Android | ⏳ | predictive back (hoje off — validar) |

Checks por linha: fluxo crítico completo · relaunch offline sem perda de
progresso · edge-to-edge / safe area · teclado (foco visível, sem armadilha) ·
fontes ampliadas · sem vazamento de rota no header.

> **As linhas Android deixaram de ser ⛔ e viraram ⏳.** O bloqueio era ausência de
> projeto nativo, resolvido em 2026-07-28/29 — o que falta agora é **hardware**,
> não engenharia. Simulador e emulador **não** preenchem esta matriz: ela existe
> justamente para o que só aparece em aparelho real.
>
> **O iPhone físico não preenche uma classe de tamanho:** o modelo e a versão do
> iOS não foram registrados. A evidência funcional é válida e fechou F1/B4, mas
> não autoriza inferir que uma das duas linhas dimensionais passou.

## 4. Privacidade e telemetria (M3)

- [x] ✅ Contrato de telemetria/privacidade (task **D2**) —
  [`CONTRATO_TELEMETRIA.md`](../legal/CONTRATO_TELEMETRIA.md): allowlist,
  proibições, teste de contrato e scrub no Sentry.
- [x] ✅ Verificado: na config de produção nenhuma propriedade de telemetria sai
  do device (analytics off, Sentry off, sync off).
- [x] ✅ Política de privacidade **hospedada em URL pública** (task **A4**) —
  `https://saudediagnostica.com/radiant/privacidade/`, **HTTP 200 remedido em
  2026-08-01**. Não bloqueia mais E3.
  **Risco aberto:** o código que a publica vive na PR **#39** de
  `andersonsmelo/saude-diagnostica-home`, que está **OPEN mas em DRAFT** — draft
  bloqueia merge no GitHub independentemente de estar mergeable. As páginas estão
  no ar porque subiram por FTPS; um redeploy da main pode removê-las. Marcar a PR
  como *ready for review*, mergear antes de submeter, e **remedir as duas URLs na
  véspera** — o estado de uma URL pública decai sozinho.
- [x] ✅ Política de Privacidade e Central de Suporte disponíveis **dentro do
  app** — cartão sempre visível **Ajuda e informações** na aba **Perfil** (que absorveu Progresso e Missões em 2026-08-21), URLs
  HTTPS centralizadas, papéis/dicas acessíveis e falha do navegador contida. As
  4 suítes focadas passaram com 14 testes em 2026-08-01; a abertura dos dois
  destinos em iPhone físico passou em 2026-08-05 e B4/VoiceOver fechou em
  2026-08-06.
- [ ] ⛔ **Sentry: não há organização nem projeto configurado.** Medido em
  2026-07-31: o `app.json` declara o plugin sem `organization`/`project`, o
  `sentry.properties` gerado cai em variáveis de ambiente e nenhum perfil do
  `eas.json` as definia — o upload de source maps **derrubava todo build limpo**.
  Foi desligado (`SENTRY_DISABLE_AUTO_UPLOAD`) para destravar o lançamento; o
  Sentry já estava off em runtime (`ENABLE_CRASH_REPORTING` default `false`).
  Ligar o crash reporting no beta **exige antes** criar organização e projeto e
  guardar o auth token como segredo do EAS. Se for ligado, declarar Crash Data nas
  fichas (mapeamento no contrato de telemetria). É também pré-requisito do **F6**,
  que promete monitorar crash-free ≥ 99%.
- [ ] ⏳ Snapshot de war room de homologação, se for usar sign-off estrito:
  `npm run app-store:ops-check:strict` exige
  `docs/release/APP_STORE_WAR_ROOM_LATEST.md`.

## 5. Metadados e assets de loja (Onda E)

- [x] ✅ Textos de loja pt-BR (task **E2**) aprovados pelo dono e persistidos na
  ficha iOS — subtítulo, texto promocional, descrição e palavras-chave.
  Fonte: [`textos-loja-pt-BR.md`](../store/textos-loja-pt-BR.md).
- [x] ✅ Screenshots por dispositivo + os **três** assets gráficos do Play
  (task **E1**) — fechado nas duas plataformas. Play: 6 × 1080×1920 em
  `docs/store/assets/screenshots/`, mais ícone 512×512 e feature graphic
  1024×500. App Store: 6 × 1290×2796 e 6 × 1242×2688 em
  `screenshots-ios-67/` e `screenshots-ios-65/` (2026-07-30). Tudo travado pelo
  contrato de assets, **14/14** dentro do `npm run quality`. Inventário em
  [`ASSETS_DE_LOJA.md`](../store/ASSETS_DE_LOJA.md). Na App Store, seis capturas
  de 6,5" persistiram na ordem aprovada; a publicação no Play continua uma
  operação separada.
- [x] ✅ **Apple Privacy Labels** publicadas como **Dados não coletados** em
  2026-08-08, depois de `npx eas secret:list` voltar vazio. **Data Safety do
  Play permanece aberta** e não herda o estado da Apple (task **E3**).
- [x] ✅ **Apple:** categoria Educação, classificação `13+` global / `12+` no
  Brasil e direitos de conteúdo persistidos. **Play:** IARC continua pendente
  e deve ser respondido com a taxonomia própria (task **E4**).
- [x] ✅ Página de suporte + e-mail de contato (task **E5**) —
  `https://saudediagnostica.com/radiant/suporte/`, HTTP 200 remedido em
  2026-08-01; contato publicado na página. Mesmo risco da PR #39. O destino
  também está disponível no cartão interno **Ajuda e informações**.
- [x] ✅ Ícone da marca (task **E6**) — as 6 tasks do plano do ícone entregues em
  2026-07-29; o mascote **Pixel** virou a marca. `icon.png` é sem alpha por
  exigência da Apple e o `notification-icon.png` existe porque os requisitos das
  duas superfícies são mutuamente exclusivos.
  **Ressalva aberta:** a prova do *themed icon* do Android 13+ exige aparelho
  real — é a **única pendência de engenharia** restante, e este número veio de
  varredura em 2026-07-30, não de herança.

## 6. Contas e submissão (M0 → M4)

- [x] ✅ Tipo de conta decidido: Play pessoal + Apple individual (task **A1**).
- [x] ✅ **Play Console: conta paga e VERIFICADA.** A verificação de acesso a
  dispositivo — que exigia aparelho Android real e bloqueava a publicação por
  **qualquer** caminho — foi concluída em 2026-07-31.
- [x] ✅ **Apple Developer ativo e App Store Connect acessível.** Em 2026-08-01,
  a adesão individual foi comprovada por Certificates, Identifiers & Profiles e
  pelo acesso ao App Store Connect; termos aceitos. App ID explícito e ficha iOS
  criados com `com.ascendcreative.radiant` e nome `Radiant — Radiologia`. Em
  2026-08-08, a versão `1.3.1` entrou em **Aguardando revisão**; o mesmo estado
  foi reconfirmado no console em 2026-08-09.
- [x] ✅ **App criado no Play Console** em 2026-07-31 com o título
  `Radiant — Radiologia` e o pacote `com.ascendcreative.radiant` (task **A3**).
  O identificador é digitado **na criação** e é irreversível. Ficha, assets e
  Conteúdo do app preenchidos. Runbook:
  [`RUNBOOK_PLAY_CONSOLE.md`](../store/RUNBOOK_PLAY_CONSOLE.md).
- [ ] ⏳ `eas submit` (task **A5**) — **iOS configurado e comprovado em
  2026-08-01:** `ascAppId`, certificado, provisioning profile e App Store
  Connect API key foram configurados pelo EAS, que submeteu o build `1.3.0 (4)`.
  A task permanece aberta somente pela automação Android: a service-account key
  do Play não é pré-requisito do primeiro upload e continua pendente.
- [x] ✅ Recrutar ≥ 14 testadores para o closed test do Play (task **A6**) —
  **CONCLUÍDA e verificada em 2026-08-03:** a página da faixa no Console mostrou
  14 contas vinculadas, confirmando a margem de churn. O repositório não persiste
  endereços. **O painel mostrou 2 opt-ins** — ainda insuficientes para o gate F2,
  que é outro item desta lista.
- [x] ✅ Build `production` iOS → TestFlight (task **F1**) — `1.3.1 (7)`
  processada como **Pronta para envio**, selecionada na versão e enviada à App
  Review. Smoke físico de sete cenários passou em 2026-08-05, B4/VoiceOver
  fechou em 2026-08-06 e o Gate 2 ficou 5/5.
- [x] ✅ **Build `production` Android (AAB) — EXISTE.** Primeiro artefato
  distribuível da história do projeto, `versionCode 4`, gerado em 2026-07-31 e
  verificado por dentro (`com.ascendcreative.radiant`, `1.3.0`, com controle
  negativo). O primeiro build falhou e a causa foi o upload de source maps do
  Sentry sem organização configurada — ver
  [`EAS_SUBMIT_SETUP.md`](../store/EAS_SUBMIT_SETUP.md).
- [ ] 🟢 **Release Android `1.3.0 (4)` publicada no track fechado `alpha`; 14
  testadores vinculados, 2 opt-ins observados e janela pendente** (task **F2**).
  Em 2026-07-31 às
  15:45, o Play publicou as 12 mudanças e passou a mostrar a faixa como `Ativo` e a versão
  disponível para testadores selecionados. A lista `Radiant Alpha — 31/07/2026`
  permanece selecionada no track; em 2026-08-03 o Console confirmou 14 contas
  vinculadas e o painel mostrou 2 testadores participando no momento. Nenhum
  endereço foi persistido no repositório. **F2 permanece aberto:** faltam pelo
  menos 10 opt-ins para chegar a 12 e então comprovar **12+ opted-in por 14 dias
  consecutivos**.
- [ ] 🔴 **App Store / F4 — REABERTO. `1.3.1 (7)` foi REJEITADA.** Preço gratuito
  e direitos de conteúdo seguem persistidos, e a versão foi enviada às 12:05 BRT
  de 2026-08-08. Mas a Apple respondeu em **14/08/2026 às 02:54** com
  `Guideline 2.1 - Information Needed - New App Submission`, e o envio está em
  **"Problemas não resolvidos"** (`2.1.0 Performance: App Completeness`).
  Medido no App Store Connect em **2026-08-24** — a rejeição ficou **dez dias sem
  leitura**, enquanto este checklist e o `STATUS.md` afirmavam "Aguardando
  revisão" com base na medição de 2026-08-09.

  Não é defeito funcional: a Apple pede sete informações para conseguir avaliar.
  O plano de resposta está em [`APP_REVIEW_REPLY_1.3.1.md`](APP_REVIEW_REPLY_1.3.1.md).

  ⛔ **Bloqueio anterior à resposta:** o contrato de licença do Apple Developer
  Program foi atualizado e exige aceite do **titular da conta** antes de qualquer
  novo envio.

  ⚠️ **Duas lacunas que este checklist já continha e agora custam caro:** a
  matriz real-device registra `modelo/iOS não registrados` para o iPhone físico —
  que é literalmente o item 2 do pedido da Apple —, e o smoke físico foi no build
  `1.3.1 (5)`, não no `(7)` submetido.

  ✅ **Decidido em 2026-08-24 — caminho B:** a resposta vai com um **build novo
  do `main`**, anexado à versão `1.3.1` (que está em estado editável), e não com
  o `(7)`. Motivo medido: o `(7)` ainda contém `src/app/modal.tsx`, o template do
  Expo com `This is a modal` em inglês, sob um código de rejeição que é
  literalmente *App Completeness*. O build sai como `1.3.1 (8)` — o EAS numera
  sozinho (`appVersionSource: remote` + `autoIncrement` no perfil `production`),
  sem bump manual no `app.json`.

  **Isso reabre a matriz real-device desta seção:** o `(8)` precisa de passagem em
  iPhone físico, e a primeira verificação é se o app **abre** — nenhum passo do
  gate empacota o binário. A gravação do vídeo para a Apple e esse smoke são a
  mesma sessão, e ela também preenche o `modelo/iOS não registrados`.

  **Play / F4** continua esperando F2.

## 7. Lançamento e pós (M5)

- [ ] ⛔ Rollout faseado no Play (10% → 50% → 100%); liberação manual no iOS
  (task **F5**).
- [ ] ⛔ Monitorar Sentry crash-free ≥ 99%, reviews e funil de onboarding nas 2
  primeiras semanas (task **F6**).

## Resumo de bloqueios de lançamento (recontado em 2026-08-09)

Ordenado por **latência**, que é o que decide a sequência — não por gravidade.

1. **iOS:** decisão da App Review; após aprovação, liberação manual (F5). Não há
   ação de engenharia nem dependência de F2 neste intervalo.
2. **Android:** ≥12 testadores participando por 14 dias consecutivos (F2). A
   última leitura, em 2026-08-03, mostrou 2 participantes de 14 vinculados; o
   relógio não havia começado.
3. **Android:** questionário IARC/Play (E4), aparelho físico (C4) e TalkBack
   (C5). Nada disso reabre o lado Apple já submetido.

**Saíram da lista desde 2026-07-27**, todas com evidência no
[status canônico](../archive/EXECUTION_STATUS_2026-08-09.md): versionamento congelado
(D5), E2E fechado nas duas plataformas (B0.1/C3), paridade Android, política e
suporte hospedados (A4/E5), screenshots e assets gráficos nas duas lojas (E1),
ícone da marca (E6).

**Não há bloqueio de engenharia no caminho iOS.** O caminho Android conserva os
gates humanos e de hardware descritos acima, incluindo B5 Android e a prova do
*themed icon* do Android 13+ em aparelho real.
