# Checklist de release — Radiant v1.3

> Lista única de **go/no-go** para submeter a v1.3 nas duas lojas. Cada item tem
> estado e dono; os detalhes vivem nas tasks do
> [roadmap de lançamento](../plans/2026-07-27-radiant-launch-roadmap.md) e no
> [status canônico](../EXECUTION_STATUS_2026-07-29.md). Este documento **não
> substitui** o roadmap — ele é o checklist final que se percorre antes de cada
> submissão.
>
> Legenda: ✅ feito · ⏳ pendente · ⛔ bloqueado (dependência externa) ·
> 🔁 refazer sob perfil de produção.

**Última atualização:** revisado em `f106d26` (2026-07-31, tarde) · **Alvo:** v1.3.0

> **Por que a marca de atualização é um hash, e não uma data.** A revisão anterior
> deste checklist também dizia "2026-07-31" — foi feita na manhã daquele dia, no
> commit `f2fddcb`. À tarde, cinco itens desta lista voltaram a estar errados: a
> conta foi verificada, o app foi criado, o AAB passou a existir. **Data em
> granularidade de dia não distingue duas revisões do mesmo dia**, e um checklist de
> go/no-go é exatamente onde essa ambiguidade custa. Ancorado a um hash, o leitor
> sabe contra qual estado do repositório esta lista foi conferida — a mesma regra
> que este projeto já aplica a contagens.

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
- [ ] ⏳ Gate 2 — **item 2** (VoiceOver com áudio, task **B4**) — exige sessão
  humana. Único item do Gate 2 aberto.
- [ ] ⏳ Nó de reward coberto por E2E (task **B5**). O `learning-critical-path.yaml`
  documenta por que ficou de fora: o track ativo tem 7 lições e o
  `JourneyDefinitionService` só libera a recompensa depois da **última**.
- [x] ✅ Onboarding em instalação limpa (task **B6**) — **investigado em 2026-07-27
  e encerrado sem correção de runtime**: "instalação limpa → Home" é consequência
  correta da Learning Road ser a home. A investigação achou código morto de
  onboarding, não defeito. Ver B6 no roadmap.

## 2. Versionamento e OTA (task D5) — ✅ CONCLUÍDA em 2026-07-28

Estado medido em 2026-07-31: `version` **1.3.0** · `ios.buildNumber` **2** ·
`android.versionCode` **2** · `runtimeVersion.policy` `appVersion`.

- [x] ✅ `version` = **1.3.0** em `package.json` e `app.json`, alinhados.
- [x] ✅ `ios.buildNumber` e `android.versionCode` em **2** para o primeiro build.
- [x] ✅ Política de `runtimeVersion` documentada aqui e no roadmap (D5).
  **Continua valendo o alerta:** depois do primeiro build publicado, nunca alterar
  `runtimeVersion` sem novo build — OTA só entrega JS compatível. Nenhum build foi
  publicado ainda, então a versão ainda é livre; **deixa de ser em F1/F2**.

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
  app** — cartão sempre visível **Ajuda e informações** na aba Progresso, URLs
  HTTPS centralizadas, papéis/dicas acessíveis e falha do navegador contida. As
  4 suítes focadas passaram com 14 testes em 2026-08-01. A abertura em iPhone
  físico e o VoiceOver continuam pendentes e não são inferidos desses testes.
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

- [x] ✅ Textos de loja pt-BR (task **E2**, rascunho) —
  [`textos-loja-pt-BR.md`](../store/textos-loja-pt-BR.md). Falta Anderson
  escolher variantes.
- [x] ✅ Screenshots por dispositivo + os **três** assets gráficos do Play
  (task **E1**) — fechado nas duas plataformas. Play: 6 × 1080×1920 em
  `docs/store/assets/screenshots/`, mais ícone 512×512 e feature graphic
  1024×500. App Store: 6 × 1290×2796 e 6 × 1242×2688 em
  `screenshots-ios-67/` e `screenshots-ios-65/` (2026-07-30). Tudo travado pelo
  contrato de assets, **14/14** dentro do `npm run quality`. Inventário em
  [`ASSETS_DE_LOJA.md`](../store/ASSETS_DE_LOJA.md).
  *Resta selecionar quais telas vão em cada ficha — passo de publicação.*
- [ ] ⏳ Privacy labels (App Store) e Data safety (Play) (task **E3**) — respostas
  já decididas em [`DATA_SAFETY_E_CLASSIFICACAO.md`](../store/DATA_SAFETY_E_CLASSIFICACAO.md).
  **Não estão mais bloqueadas por A4**; só falta colar nas consoles.
- [ ] ⛔ Classificação etária / questionários de conteúdo; categoria **Educação**
  (task **E4**) — feito nas consoles, exige conta.
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
  criados com `com.ascendcreative.radiant`, nome `Radiant — Radiologia` e versão
  `1.3.0`, ainda em **Preparar para envio**.
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
- [ ] ⛔ Recrutar ≥ 14 testadores para o closed test do Play (task **A6**) —
  **13/14 contas vinculadas em 2026-08-01; falta pelo menos uma para a margem
  planejada.** Os opt-ins ainda não foram comprovados.
- [ ] ⏳ Build `production` iOS → TestFlight (task **F1**) — **build `1.3.0 (4)`
  pronta no TestFlight em 2026-08-01**, com distribuição automática no grupo
  interno `Radiant Internal` (1 tester, 1 build). **Instalação física, versão,
  build e lançamento confirmados** por consulta sanitizada ao CoreDevice. Restam
  smoke dos links no iPhone físico, sessão humana de VoiceOver, metadata, privacy
  labels, classificação e informações de revisão. F1 não fecha apenas com a
  instalação e o lançamento.
- [x] ✅ **Build `production` Android (AAB) — EXISTE.** Primeiro artefato
  distribuível da história do projeto, `versionCode 4`, gerado em 2026-07-31 e
  verificado por dentro (`com.ascendcreative.radiant`, `1.3.0`, com controle
  negativo). O primeiro build falhou e a causa foi o upload de source maps do
  Sentry sem organização configurada — ver
  [`EAS_SUBMIT_SETUP.md`](../store/EAS_SUBMIT_SETUP.md).
- [ ] 🟢 **Release Android `1.3.0 (4)` publicada no track fechado `alpha`; 13
  testadores vinculados e opt-in pendente** (task **F2**). Em 2026-07-31 às
  15:45, o Play publicou as 12 mudanças e passou a mostrar a faixa como `Ativo` e a versão
  disponível para testadores selecionados. A lista `Radiant Alpha — 31/07/2026`
  permanece selecionada no track; em 2026-08-01, a fonte completa foi importada,
  validada e salva, e o Console confirmou 13 usuários sem alteração pendente na
  página da faixa. Nenhum endereço foi persistido no repositório. F2 permanece
  aberto: é necessário comprovar **12+ opted-in por 14 dias consecutivos**.

## 7. Lançamento e pós (M5)

- [ ] ⛔ Rollout faseado no Play (10% → 50% → 100%); liberação manual no iOS
  (task **F5**).
- [ ] ⛔ Monitorar Sentry crash-free ≥ 99%, reviews e funil de onboarding nas 2
  primeiras semanas (task **F6**).

## Resumo de bloqueios de submissão (recontado em 2026-08-01)

Ordenado por **latência**, que é o que decide a sequência — não por gravidade.

1. **≥12 testadores × 14 dias consecutivos** em closed testing (F2). Piso do
   caminho crítico e o único item cujo relógio é externo. **O relógio só corre no
   track fechado**: `eas.json` tem `track: "internal"` e `releaseStatus: "draft"`,
   os dois deliberados, e com eles a contagem não começa. Ver Parte 6 do
   [runbook](../store/RUNBOOK_PLAY_CONSOLE.md).
2. **Smoke do build iOS `1.3.0 (4)` pelo TestFlight** — instalação e lançamento
   no iPhone foram confirmados; abertura dos links legais e VoiceOver ainda não.
3. **Metadata e declarações das lojas**: privacy labels, classificação etária,
   informações de revisão e questionários ainda precisam de fechamento.
4. **Sessões humanas de a11y**: VoiceOver (B4) e TalkBack (C5).
5. **Matriz real-device** (C4): 1 Android físico; as linhas iPhone.

**Saíram da lista desde 2026-07-27**, todas com evidência no
[status canônico](../EXECUTION_STATUS_2026-07-29.md): versionamento congelado
(D5), E2E fechado nas duas plataformas (B0.1/C3), paridade Android, política e
suporte hospedados (A4/E5), screenshots e assets gráficos nas duas lojas (E1),
ícone da marca (E6).

**Não há mais bloqueio de engenharia no caminho crítico**, com uma exceção que
não depende de código: a prova do *themed icon* do Android 13+, que precisa de
aparelho real.
