# Radiant — Roadmap de Lançamento iOS e Android (2026-07-27)

> **Status:** plano ativo. Complementa (não substitui) o
> [roadmap de continuação](2026-07-23-radiant-continuation-roadmap.md) e o
> [status canônico](../EXECUTION_STATUS_2026-07-27.md). As Tasks 11–16 do
> roadmap anterior permanecem válidas; este documento as ordena dentro da
> trilha de lançamento e adiciona a trilha de lojas, que não existia.

## 1. Objetivo

Publicar o Radiant v1.3 nas lojas — App Store (iOS) e Google Play (Android) —
como aplicativo educacional de radiologia **local-first**, sem dependência da
API remota, com acessibilidade validada, fluxo crítico coberto por E2E nas duas
plataformas e beta com usuários reais antes da produção.

**Definição de lançado:** o app está disponível para download público nas duas
lojas, com crash-free sessions ≥ 99% no beta, zero perda de progresso em
relaunch offline, e metadados/privacidade aprovados na revisão das lojas sem
rejeição pendente.

## 2. Onde estamos hoje (verificado)

Fonte: [status canônico 2026-07-27](../EXECUTION_STATUS_2026-07-27.md).

**Sólido:**

- App local-first funcional; catálogo, progresso e revisão funcionam sem API.
- v1.2.1 alinhada entre `package.json` e `app.json`; `runtimeVersion` por
  `appVersion`; nenhum build publicado ainda (mudanças de versão ainda livres).
- Qualidade: 27 suítes / 71 testes PASS; `npm run quality` PASS; Gate 2 de
  acessibilidade parcial (3/5).
- E2E iOS em device PASS (3/3 flows Maestro), com a ressalva do item 3 dos
  bloqueadores: a evidência foi colhida sob o perfil `e2e-test`.
- EAS configurado (projeto, perfis `development`, `e2e-test`, `preview`,
  `production`); bundle id/package `com.ascendcreative.radiant` definidos.
- Expo SDK 54 / RN 0.81 → target Android API 36 por padrão, o que já atende o
  requisito do Play para novos apps (ver §4).

**Aberto (bloqueadores conhecidos):**

1. Gate 2 de acessibilidade: resta o item 2 (anúncio único VoiceOver, exige
   humano com áudio, task B4). O item 5 (navegação por teclado) foi fechado em
   2026-07-27 com a build web (task B3).
2. Android sem projeto nativo (`expo prebuild` nunca executado); zero E2E
   Android.
3. E2E ainda não reexecutado sob o perfil `preview`, que passou a refletir
   produção em 2026-07-27 (task B0.1).
4. ~~`JourneyMap` renderiza tema claro em tela escura e quebra rótulos no meio da
   palavra (task B2).~~ Corrigido em 2026-07-27 (task B2): tema `galaxyColors` e
   rótulos quebrando só em limite de palavra. O defeito de folga da tab bar foi
   resolvido em todas as telas roláveis nesta data (task B1).
5. Nó de reward sem cobertura E2E (track ativo tem 7 lições; conquista só no
   final).
6. API pública inativa (HTTP 502) — decisão de estratégia pendente (ADR da
   Task 15).
7. Onboarding não aparece em instalação limpa — pendente de confirmação de
   intenção.
8. Dívidas rastreadas: 54 warnings de lint, 122 achados visuais no baseline,
   42 itens editoriais `formatNeedsReview`, 121 referências com caminho
   absoluto da máquina em docs.
9. **Trilha de lojas inexistente:** sem conta Apple Developer/Play Console
   confirmada no plano, sem metadados, screenshots, política de privacidade
   hospedada, privacy labels, data safety, ou submissão de qualquer build.

## 3. Estratégia

1. **Local-first é o produto lançável.** A API não entra no caminho crítico do
   lançamento; a decisão sobre ela (Task 15) só precisa acontecer antes do
   beta público para fixar flags e copy honesta (`ENABLE_REMOTE_SYNC=false` em
   produção enquanto a ADR não autorizar o contrário).
2. **A trilha de lojas começa agora, em paralelo à engenharia.** Os prazos
   administrativos (verificação de conta, D-U-N-S, teste fechado de 14 dias no
   Play) são os itens de maior latência do plano e não dependem de código.
3. **Android é o maior risco técnico.** Paridade Android (prebuild + E2E) vem
   antes de qualquer polimento novo.
4. **Beta antes de produção nas duas lojas.** TestFlight no iOS; closed
   testing no Play (obrigatório se a conta for pessoal e nova — ver §4).

## 4. Requisitos externos pesquisados (2026)

Datas e regras que moldam o cronograma:

| Requisito | Regra | Impacto no Radiant |
| --- | --- | --- |
| Play: target API | Novos apps devem mirar Android 16 (API 36) até 31/08/2026; extensão possível até 01/11/2026 | Atendido pelo Expo SDK 54 / RN 0.81 (target 36 por padrão; edge-to-edge obrigatório — já habilitado no `app.json`) |
| Play: teste fechado | Conta pessoal criada após 13/11/2023 só publica em produção após closed test com ≥ 12 testadores opted-in por 14 dias consecutivos | Se a conta for pessoal e nova, adiciona ~3–4 semanas ao caminho crítico Android → iniciar a trilha de conta imediatamente ou usar conta de organização (exige CNPJ + D-U-N-S) |
| Play: verificação de desenvolvedor | Começa no Brasil em 30/09/2026 | Concluir cadastro e verificação antes dessa janela reduz atrito |
| App Store: SDK mínimo | Desde 28/04/2026, builds devem usar SDK do iOS 26 (Xcode 26) | Garantir Xcode 26 na máquina de build ou usar EAS Build (imagens já compatíveis com SDK 54) |
| App Store: privacidade | Privacy nutrition labels detalhados, privacy manifests, política de privacidade com URL pública | Telemetria precisa de allowlist documentada (Task 16) antes de preencher os labels |
| App Store: conta | Exclusão de conta dentro do app é obrigatória se houver criação de conta | Local-first sem conta obrigatória evita a exigência; se auth entrar (ADR da API), a exclusão in-app vira requisito |
| Apps de saúde/educação | Disclaimers: app educacional, não substitui conselho médico | Adicionar disclaimer no onboarding/metadados das lojas |
| Custos de conta | Apple Developer Program US$ 99/ano; Play Console US$ 25 única vez | Orçamento mínimo de contas |

Fontes: ver §9.

## 5. Marcos (metas com critério de saída)

| Marco | Meta | Critério de saída | Alvo |
| --- | --- | --- | --- |
| **M0 — Contas e fundações de loja** | Contas ativas e verificadas nas duas lojas | Apple Developer + Play Console verificados; app criado nas duas consoles; decisão pessoal vs organização registrada | Semana 1–2 (até ~2026-08-10) |
| **M1 — Qualidade pendente fechada** | Gate 2 aprovado e defeitos conhecidos corrigidos | Itens 2 e 5 do Gate 2 com evidência; ProgressScreen/JourneyMap corrigidos; reward coberto por E2E | Semana 2–3 |
| **M2 — Paridade Android** | Fluxo crítico PASS em Android | `expo prebuild` + build local; 3 flows Maestro PASS em emulador e 1 device físico | Semana 3–5 |
| **M3 — Prontidão de release** | Contratos de privacidade, telemetria e release prontos | Task 16 concluída: matriz real-device, contrato de telemetria, checklist v1.3, Sentry configurado; ADR da API registrada (Task 15) | Semana 5–6 |
| **M4 — Beta nas duas lojas** | Builds de produção em TestFlight e closed testing | Build `production` submetido; ≥ 12 testadores opted-in no Play por 14 dias; feedback triado P0–P3; pesquisa com usuários (Task 12) iniciada | Semana 6–9 |
| **M5 — Lançamento público** | Aprovação e produção nas duas lojas | Revisões aprovadas; rollout faseado no Play (10→50→100%); release iOS; monitoramento ativo | Semana 9–11 (até ~2026-10-12) |

Os alvos assumem dedicação contínua e nenhuma rejeição de loja com retrabalho
grande; o teste fechado de 14 dias do Play é o piso do caminho crítico entre
M4 e M5.

## 6. Ondas e tasks

Convenção: **[P0]** bloqueia lançamento; **[P1]** bloqueia beta de qualidade;
**[P2]** desejável antes da produção. Cada task deve terminar com evidência
(commit, screenshot, log ou documento) e passar `npm run quality` quando tocar
código.

### Onda A — Contas e fundações de loja (M0) — pode começar hoje, sem código

- **A1 [P0]** ~~Decidir tipo de conta Play~~ **Decidida em 2026-07-27:** Play
  pessoal + Apple individual — ver
  [ADR de contas de loja](../adr/ADR-2026-07-27-store-account-strategy.md).
  O closed test 12×14 do Play fica confirmado no caminho crítico (F2–F3).
- **A2 [P0]** Criar/verificar conta Apple Developer (US$ 99/ano) e Play
  Console (US$ 25); concluir verificação de identidade antes da janela de
  30/09/2026 do Brasil.
- **A3 [P0]** Criar o app nas duas consoles com
  `com.ascendcreative.radiant`; reservar nome "Radiant" (ter plano B de nome
  caso indisponível na App Store).
- **A4 [P0]** Publicar política de privacidade em URL pública (pt-BR, com
  seção de dados locais, telemetria e contato). Bloqueia preenchimento de
  privacy labels e data safety. **Rascunho pronto em 2026-07-27** em
  [`docs/legal/politica-de-privacidade.md`](../legal/politica-de-privacidade.md),
  fundamentado num levantamento do que o app realmente coleta (insumo do D2):
  controlador Anderson Melo (pessoa física); local-first sem conta obrigatória;
  telemetria só no dispositivo; notificações locais sem push token; crash
  reporting (Sentry) coberto como opcional, hoje desligado no perfil
  `production`; Expo Updates como único terceiro ativo. **Pendente:** revisão
  jurídica, definição do e-mail/entidade final e **hospedagem em URL pública**
  (preencher «URL_PÚBLICA_DA_POLÍTICA»). Só então destrava E3 (privacy labels /
  data safety).
- **A5 [P1]** Configurar `eas submit`: chave de service account do Play +
  App Store Connect API key; preencher o bloco `submit` do `eas.json` (hoje só
  tem `ios: {}`).
- **A6 [P1]** Recrutar ≥ 14 testadores (12 é o mínimo do Play; margem para
  churn) — alinhado ao recrutamento da Task 12 (5–8 participantes de pesquisa
  podem vir do mesmo pool).

### Onda B — Qualidade pendente (M1) — engenharia, já autorizada no status

- **B1 [P0]** ~~Corrigir `ProgressScreen`~~ **Concluída em 2026-07-27.** O
  escopo real era maior: a correção de 86d1867 aplicou `tabBarClearance` apenas
  ao `JourneyHomeScreen`, e o defeito seguia vivo em quatro telas —
  `HomeScreen` (32pt), `ProgressScreen` (24pt), `MissionsScreen` (120pt mágico)
  e `GalaxyMapScreen` (110pt mágico). As quatro passaram a usar a constante e o
  contrato virou teste estrutural em
  `radiant-app/scripts/tab-bar-clearance-contract.test.mjs`, ligado ao
  `npm run quality`.
- **B0 [P0] — NOVO, bloqueia o beta.** A flag `ENABLE_LEARNING_ROAD` tem
  default `false` e **não é definida nos perfis `development`, `preview` nem
  `production`** do `eas.json`; só o perfil `e2e-test` a liga. Consequências
  verificadas em 2026-07-27:
  1. Um build de produção renderiza `HomeScreen`, não `JourneyHomeScreen`.
  2. Todo o E2E em device de 2026-07-26 rodou sob `e2e-test`, ou seja,
     validou a Home da trilha — uma tela que o usuário de produção não vê.
  3. O `.env` local também liga a flag, então o desenvolvimento manual observa
     a mesma tela do E2E, e não a de produção.
  **Decidida em 2026-07-27: a v1.3 lança com a Learning Road** — ver
  [ADR da home de produção](../adr/ADR-2026-07-27-learning-road-como-home.md).
  A flag passou a ser declarada em `development`, `preview` e `production`, e o
  default em `src/config.ts` virou `true` para que nenhum build divirja do que
  é distribuído. Com isso a evidência de E2E de 2026-07-26 volta a valer para o
  caminho de produção. Restam duas pontas:
  - **B0.1 [P0]** reexecutar os três flows Maestro sob o perfil `preview`, que
    agora reflete produção, e registrar a evidência.
  - **B0.2 [P1]** ~~atualizar a seção "Learning Road" do `radiant-app/README.md`~~
    **Concluída em 2026-07-27.** A seção deixou de descrever a Learning Road como
    redesign em andamento e passou a tratá-la como a home de produção entregue da
    v1.3 (sem o enquadramento "primeiro slice / rollout V2"), e ganhou um plano
    explícito de remoção da `HomeScreen` morta pós-beta (branch de flag em
    `(tabs)/index.tsx`, arquivos da `HomeScreen` e a flag `ENABLE_LEARNING_ROAD`).
- **B2 [P1]** ~~Corrigir `JourneyMap`: tema escuro correto e quebra de rótulos~~
  **Concluída em 2026-07-27.** Os dois defeitos tinham a mesma origem: os
  componentes do mapa (`JourneyMap`, `JourneyNodeCard`, `JourneyMapHeader`)
  usavam a paleta clara `colors` e o `SurfaceCard` claro, mas só renderizam
  dentro do `JourneyHomeScreen` escuro — saía um card branco no fundo escuro.
  Passaram a usar `galaxyColors` e um container próprio (padrão do `JourneyHero`,
  não o `SurfaceCard` compartilhado). A quebra no meio da palavra vinha do card
  do zig-zag com o ícone inline comendo a largura; o ícone foi empilhado acima do
  texto e o card alargado, dando largura para o texto quebrar só em limite de
  palavra. Guarda estrutural nova em
  `scripts/maestro-contract.test.mjs`: esses componentes devem usar
  `galaxyColors`, nunca a paleta clara. Verificado no build web a 375px.
- **B3 [P0]** ~~Gate 2 item 5: build web + navegação por teclado~~ **Concluída em
  2026-07-27.** Build web estática gerada (`npx expo export --platform web`; o
  `app.json` já usa `web.output: static`) e o fluxo crítico (Learning Road →
  lição → quiz → onboarding/entrar) percorrido só por teclado. Ordem de foco
  lógica, foco visível em todos os controles (anel `outline: auto` do navegador +
  borda 3px do `AppButton`), sem armadilhas de foco (a Home cicla e fecha; a rota
  de lição contém o foco) e alvos ≥ 44px (atalho da Home 56px, ação de entrar
  44px). Evidência:
  [`radiant-app/docs/evidence/2026-07-27-accessibility-gate2-item5-keyboard.md`](../../radiant-app/docs/evidence/2026-07-27-accessibility-gate2-item5-keyboard.md).
  Com isso o Gate 2 fica em 4/5; resta só o item 2 (B4).
- **B4 [P0]** Gate 2 item 2: sessão humana de VoiceOver com áudio (agendar com
  Anderson; roteiro em `radiant-app/docs/ACCESSIBILITY_QA_V1.md`).
- **B5 [P1]** Cobrir o nó de reward com E2E (track de 7 lições ou fixture de
  track curto no perfil `e2e-test`).
- **B6 [P1]** Resolver a pendência de produto: onboarding em instalação limpa
  (confirmar intenção; se defeito, corrigir e cobrir com flow de instalação
  limpa).
- **B7 [P2]** Reduzir warnings de lint por domínio (meta: 54 → ≤ 20) sem
  supressões globais.

### Onda C — Paridade Android (M2)

- **C1 [P0]** `expo prebuild` Android; build local com JDK/SDK documentados;
  registrar runbook em `radiant-app/docs/E2E_RUNBOOK.md`.
- **C2 [P0]** Smoke manual em emulador: navegação completa, edge-to-edge,
  predictive back (hoje `predictiveBackGestureEnabled: false` — validar a
  escolha sob target 36), teclado, fontes ampliadas.
- **C3 [P0]** Os 3 flows Maestro PASS em emulador Android (com rodadas de
  ajuste de seletor esperadas).
- **C4 [P1]** Rodar os flows em ≥ 1 device Android físico (compacto ou médio,
  conforme matriz da Task 16).
- **C5 [P1]** TalkBack: repetir o checklist do Gate 2 no Android.
- **C6 [P2]** Baseline de performance Android (cold start, FPS; Flashlight
  opcional) para comparação pós-lançamento.

### Onda D — Prontidão de release (M3) — Tasks 15 e 16 do roadmap anterior

- **D1 [P0]** ADR da estratégia de API (Task 15): auditoria read-only e
  decisão entre manter local-first puro, catálogo remoto, ou catálogo+auth+
  sync. **Parte de configuração concluída em 2026-07-27**, com uma correção
  importante da premissa original deste plano: eu havia registrado que
  `ENABLE_REMOTE_SYNC=true` em produção geraria UX quebrada. Isso estava
  errado. `EXPO_PUBLIC_API_BASE_URL` não é definida em nenhum perfil do
  `eas.json`, e tanto o `SyncQueueService` quanto a tela de Progresso exigem
  `isApiConfigured()` além da flag — o sync já era inerte em todo build. O que
  existia de verdade era desonestidade de configuração: o painel de
  homologação anunciava "Sync remoto: ativado" enquanto nada sincronizava.
  Feito: os perfis `preview` e `production` passam a declarar
  `ENABLE_REMOTE_SYNC=false`, que é o estado real enquanto a API responde 502
  (reconfirmado por smoke público read-only em 2026-07-27), e o painel passa a
  exibir o estado efetivo (`ligado, sem API configurada` quando a flag está
  ligada sem API). Resta a ADR de estratégia da API, que é decisão de produto.
- **D2 [P0]** Contrato de telemetria/privacidade (Task 16): allowlist de
  eventos, proibições (PII, conteúdo clínico), scrub no Sentry. É insumo
  direto dos privacy labels (iOS) e data safety (Play).
- **D3 [P0]** Checklist de release v1.3 + matriz real-device (Task 16).
- **D4 [P0]** Gate editorial: triar os 42 itens `formatNeedsReview` (aceitar
  com motivo, corrigir ou remover do caminho público).
- **D5 [P1]** Congelar versionamento: definir `1.3.0`, alinhar
  `ios.buildNumber`/`android.versionCode` e documentar a política de
  `runtimeVersion` — depois do primeiro build publicado, mudanças deixam de
  ser livres (alerta do status 2026-07-26).
- **D6 [P1]** Pesquisa com usuários (Task 12) começa aqui e corre em paralelo
  ao beta (M4); P0/P1 de pesquisa bloqueiam M5.
- **D7 [P2]** Converter as 121 referências absolutas de docs para caminhos
  relativos (limpeza mecânica; melhora o repo para colaboradores).

### Onda E — Assets e metadados de loja (paralela a C/D)

- **E1 [P0]** Screenshots por dispositivo: iPhone 6,7"/6,5" (e 13" iPad se
  mantiver `supportsTablet: true` — decidir; desligar tablet reduz escopo de
  QA e screenshots), Android phone + feature graphic 1024×500.
- **E2 [P0]** Textos de loja pt-BR: nome, subtítulo/short description,
  descrição longa, keywords, notas de release; disclaimer educacional ("não
  substitui orientação médica profissional").
- **E3 [P0]** Privacy labels (App Store Connect) e Data safety (Play) — 
  derivados de D2; declarar Sentry (crash data) e o que mais a allowlist
  permitir.
- **E4 [P0]** Classificação etária/questionários de conteúdo nas duas
  consoles; categoria (Educação ou Medicina — recomendação: Educação, evita
  escrutínio de app médico).
- **E5 [P1]** Página de suporte + e-mail de contato (obrigatórios nas fichas).
- **E6 [P2]** Ícone e assets finais revisados (ícone 1024 sem alfa para iOS;
  adaptive icon Android já configurado).

### Onda F — Beta, submissão e lançamento (M4 → M5)

- **F1 [P0]** Build `production` iOS via EAS → TestFlight (revisão beta da
  Apple); distribuir aos testadores.
- **F2 [P0]** Build `production` Android (AAB) via EAS → closed testing track;
  atingir 12+ opted-in e manter 14 dias consecutivos (se conta pessoal).
- **F3 [P0]** Ciclo de triagem de feedback beta: P0/P1 corrigidos e novo build
  se necessário (cada novo ciclo de closed test não reinicia os 14 dias, mas
  quedas abaixo de 12 testadores sim — monitorar diariamente).
- **F4 [P0]** Solicitar acesso a produção no Play (questionário) e submeter
  revisão final na App Store (App Review; primeira revisão típica de 24–48h,
  planejar retrabalho).
- **F5 [P0]** Lançamento: rollout faseado no Play (10% → 50% → 100%);
  liberação manual no iOS após aprovação.
- **F6 [P1]** Pós-lançamento (2 primeiras semanas): monitorar Sentry
  crash-free ≥ 99%, reviews das lojas, funil de onboarding; hotfix por OTA
  (Expo Updates) apenas para JS compatível com `runtimeVersion`, senão novo
  build.
- **F7 [P2]** Retrospectiva + atualizar status canônico e brain (aprendizados
  validados de lançamento).

## 7. Recursos necessários

**Contas e serviços (custo direto):**

- Apple Developer Program — US$ 99/ano.
- Google Play Console — US$ 25 (única vez). Conta organização: + CNPJ ativo e
  número D-U-N-S (gratuito, mas com latência).
- Hospedagem da política de privacidade (pode ser página estática no domínio
  já existente).
- Sentry (plano free cobre o beta) — já integrado via `@sentry/react-native`.
- EAS Build/Submit — plano free tem fila/limites; avaliar plano pago
  (~US$ 19/mês) se a cadência de builds do beta apertar.

**Hardware/ambiente:**

- Mac com Xcode 26 (obrigatório para SDK iOS 26 se buildar localmente; EAS
  Build cobre isso na nuvem).
- 1 iPhone físico (já usado no E2E) + 1 device Android físico para C4.
- Emulador Android + JDK para C1–C3.

**Pessoas:**

- Anderson: decisões A1/E4, sessão VoiceOver (B4), aprovação de copy de loja.
- 12–14 testadores beta (Play) + 5–8 participantes de pesquisa (Task 12),
  com sobreposição possível.
- 1 revisor de domínio (radiologia) para o gate editorial D4 e o checklist
  clínico da Task 12.

## 8. Riscos e mitigações

| Risco | Prob. | Mitigação |
| --- | --- | --- |
| Closed test do Play atrasar M5 (testadores insuficientes/queda abaixo de 12) | Alta | A1 decidida já; A6 recruta 14+; monitorar opt-in diário durante os 14 dias |
| E2E Android exigir mais ciclos que o previsto (primeiro prebuild) | Alta | Janela de 2 semanas em C; seletores por accessibility label já estáveis no iOS |
| Rejeição na App Review (metadados/privacidade/disclaimer médico) | Média | E2–E4 revisados contra as guidelines; categoria Educação; disclaimer explícito; sem login obrigatório |
| ~~`ENABLE_REMOTE_SYNC=true` em produção com API 502 gerar UX quebrada~~ | Descartado | Premissa errada: sem `API_BASE_URL` em nenhum perfil, o sync já era inerte. O risco real era de configuração desonesta, corrigido em D1 |
| Evidência de E2E não cobrir o caminho de produção por divergência de feature flag | Confirmado | B0: decidir qual Home lança e reexecutar o E2E no perfil que reflete produção |
| Verificação de conta/D-U-N-S travar M0 | Média | Iniciar na semana 1; caminho pessoal como fallback aceitando o custo do closed test |
| Runtime version/OTA mal configurados após primeiro build | Média | D5 congela política antes de F1/F2; nunca alterar `runtimeVersion` sem novo build |
| Pesquisa (Task 12) achar P0/P1 tarde | Média | D6 começa junto do beta, não depois; gate de M5 inclui P0/P1 de pesquisa |
| Escopo iPad (`supportsTablet: true`) ampliar QA e screenshots | Baixa | Decidir em E1; desligar tablet no v1.3 é aceitável |

## 9. Fontes da pesquisa (2026-07-27)

- [Target API level — Play Console Help](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en)
- [Meet Google Play's target API level requirement — Android Developers](https://developer.android.com/google/play/requirements/target-sdk)
- [Google Play closed testing: 12 testers / 14 days (guia 2026)](https://primetestlab.com/blog/google-play-publishing-requirements-2026)
- [React Native 0.81 — Android 16 (API 36) por padrão](https://reactnative.dev/blog/2025/08/12/react-native-0.81)
- [Expo SDK 54 — changelog](https://expo.dev/changelog/sdk-54)
- [EAS Submit — Android](https://docs.expo.dev/submit/android/) e
  [introdução](https://docs.expo.dev/submit/introduction/)
- [Guia de revisão App Store 2026 (SDK iOS 26 a partir de 28/04/2026)](https://capgo.app/blog/first-time-app-review-guide/)
- [Exclusão de conta — guidelines Apple](https://capgo.app/blog/account-deletion-compliance-apple-guidelines/)

Regras de loja mudam com frequência; revalidar §4 nas datas de M0 e M4.

## 10. Como executar

1. Ondas A (contas) e B (qualidade) começam em paralelo — A não depende de
   código.
2. Cada task de engenharia segue o fluxo padrão do repo: branch a partir de
   `codex/wave1-hardening-api-smoke` (ou `main` após merge), TDD onde couber,
   `npm run quality` verde, evidência em `radiant-app/docs/evidence/` ou
   `docs/evidence/`.
3. Atualizar o status canônico (`docs/EXECUTION_STATUS_*.md`) a cada marco
   fechado; este roadmap não substitui o status.
4. Para as Tasks 12, 15 e 16 detalhadas, usar os blocos correspondentes do
   [roadmap de continuação](2026-07-23-radiant-continuation-roadmap.md).
