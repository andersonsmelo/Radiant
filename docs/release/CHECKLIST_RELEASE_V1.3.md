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

**Última atualização:** 2026-07-31 · **Alvo:** v1.3.0

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
  2026-07-31 08:47**. Não bloqueia mais E3.
  **Risco aberto:** o código que a publica vive na PR **#39** de
  `andersonsmelo/saude-diagnostica-home`, que está **OPEN mas em DRAFT** — draft
  bloqueia merge no GitHub independentemente de estar mergeable. As páginas estão
  no ar porque subiram por FTPS; um redeploy da main pode removê-las. Marcar a PR
  como *ready for review*, mergear antes de submeter, e **remedir as duas URLs na
  véspera** — o estado de uma URL pública decai sozinho.
- [ ] ⏳ Decidir se o **relatório de falhas (Sentry)** entra ligado no beta; se
  sim, declarar Crash Data nas fichas (ver mapeamento no contrato).
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
  2026-07-31 08:47; contato `anderson.smelo94@gmail.com`. Mesmo risco da PR #39.
- [x] ✅ Ícone da marca (task **E6**) — as 6 tasks do plano do ícone entregues em
  2026-07-29; o mascote **Pixel** virou a marca. `icon.png` é sem alpha por
  exigência da Apple e o `notification-icon.png` existe porque os requisitos das
  duas superfícies são mutuamente exclusivos.
  **Ressalva aberta:** a prova do *themed icon* do Android 13+ exige aparelho
  real — é a **única pendência de engenharia** restante, e este número veio de
  varredura em 2026-07-30, não de herança.

## 6. Contas e submissão (M0 → M4)

- [x] ✅ Tipo de conta decidido: Play pessoal + Apple individual (task **A1**).
- [ ] ⛔ **Play Console: a conta EXISTE** (tipo Pessoal, "Saúde Diagnóstica",
  `anderson.smelo94@gmail.com`), mas a **verificação de acesso a dispositivo**
  está pendente e **exige aparelho Android real** — o emulador local é imagem
  "Google APIs" sem Play Store.
- [ ] ⛔ **Apple Developer: estado DESCONHECIDO** (task **A2**). Nenhum documento
  deste repositório registra que a conta existe; o status detalha a conta Play e
  **cala sobre a Apple**. São US$ 99/ano mais verificação de identidade, com
  latência própria. **Confirmar com Anderson antes de planejar o lado iOS** —
  ausência de registro não é evidência de ausência, nem de existência.
- [ ] ⛔ Criar o app nas duas consoles com `com.ascendcreative.radiant` e
  reservar o nome "Radiant" (task **A3**). Runbook com os valores prontos para
  colar: [`RUNBOOK_PLAY_CONSOLE.md`](../store/RUNBOOK_PLAY_CONSOLE.md).
- [ ] ⛔ `eas submit` (task **A5**) — **o bloco Android já está configurado** no
  `eas.json` (`serviceAccountKeyPath`, `track`, `releaseStatus`) e
  `radiant-app/credentials/` existe, vazio e protegido pelo `.gitignore` da raiz.
  Falta **gerar a chave** no console. O lado **iOS segue `{}`**: falta a App Store
  Connect API key.
- [ ] ⛔ Recrutar ≥ 14 testadores para o closed test do Play (task **A6**).
- [ ] ⛔ Build `production` iOS → TestFlight (task **F1**).
- [ ] ⛔ Build `production` Android (AAB) → closed testing, **12+ opted-in por 14
  dias consecutivos** (task **F2**) — piso do caminho crítico.

## 7. Lançamento e pós (M5)

- [ ] ⛔ Rollout faseado no Play (10% → 50% → 100%); liberação manual no iOS
  (task **F5**).
- [ ] ⛔ Monitorar Sentry crash-free ≥ 99%, reviews e funil de onboarding nas 2
  primeiras semanas (task **F6**).

## Resumo de bloqueios de submissão (recontado em 2026-07-31)

Ordenado por **latência**, que é o que decide a sequência — não por gravidade.

1. **≥12 testadores × 14 dias consecutivos** em closed testing (F2). Piso do
   caminho crítico e o único item cujo relógio é externo. **O relógio só corre no
   track fechado**: `eas.json` tem `track: "internal"` e `releaseStatus: "draft"`,
   os dois deliberados, e com eles a contagem não começa. Ver Parte 6 do
   [runbook](../store/RUNBOOK_PLAY_CONSOLE.md).
2. **Verificação de acesso a dispositivo da conta Play** — exige **aparelho
   Android real**. Trava o item 1.
3. **Conta Apple Developer** (A2) — estado desconhecido; se não existir, vira o
   segundo item mais lento.
4. **Criar os apps nas consoles** (A3) + **service-account key** (A5).
5. **Sessões humanas de a11y**: VoiceOver (B4) e TalkBack (C5).
6. **Classificação etária / questionários** (E4) — exigem conta.
7. **Matriz real-device** (C4): 1 Android físico; as linhas iPhone.

**Saíram da lista desde 2026-07-27**, todas com evidência no
[status canônico](../EXECUTION_STATUS_2026-07-29.md): versionamento congelado
(D5), E2E fechado nas duas plataformas (B0.1/C3), paridade Android, política e
suporte hospedados (A4/E5), screenshots e assets gráficos nas duas lojas (E1),
ícone da marca (E6).

**Não há mais bloqueio de engenharia no caminho crítico**, com uma exceção que
não depende de código: a prova do *themed icon* do Android 13+, que precisa de
aparelho real.
