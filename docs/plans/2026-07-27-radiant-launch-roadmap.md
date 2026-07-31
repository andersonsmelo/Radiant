# Radiant — Roadmap de Lançamento iOS e Android (2026-07-27)

> **Status:** plano ativo. Complementa (não substitui) o
> [roadmap de continuação](2026-07-23-radiant-continuation-roadmap.md) e o
> [status canônico](../EXECUTION_STATUS_2026-07-29.md). As Tasks 11–16 do
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

Fonte: [status canônico 2026-07-29](../EXECUTION_STATUS_2026-07-29.md) — o
snapshot de 07-27 permanece como histórico. A seção abaixo descreve o estado
verificado em 07-27; as entregas de 07-28 (identidade de design, versionamento
1.3.0, tipografia, lesson-flow, assets e gate) estão no status canônico.

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
  **Lado Play CONCLUÍDO em 2026-07-31:** a conta já era paga e a **verificação de
  acesso a dispositivo Android** — que exigia aparelho real e bloqueava a publicação
  por qualquer caminho — foi concluída nesta data.
  **Decisão do dono em 2026-07-31: o lançamento foca só no Android.** A conta Play
  está paga; o lado Apple fica **adiado**, não cancelado, e nada de iOS deve ser
  executado até essa decisão ser revertida.
  *Estado da conta Apple, medido em 2026-07-31 e registrado porque nenhum documento
  registrava:* existe neste host uma sessão autenticada do portal Apple Developer
  (`~/.app-store/auth/`), de **2026-03-30**, sob um e-mail **diferente** do contato
  declarado na política de privacidade. Isso **não** estabelece membresia paga —
  Apple ID gratuito também loga no portal — e o chaveiro não ajuda a decidir, porque
  o EAS guarda credenciais no servidor. A varredura anterior concluiu "estado
  desconhecido" varrendo **documentos do repositório**, instrumento que mede a
  prática de documentar, não o estado de um sistema externo.
- **A3 [P0]** Criar o app nas consoles com `com.ascendcreative.radiant`.
  **Play: CONCLUÍDA em 2026-07-31** — app criado com o título
  `Radiant — Radiologia` (o valor da fonte
  [`textos-loja-pt-BR.md`](../store/textos-loja-pt-BR.md); o `Radiant` puro é o nome
  da App Store, e o runbook mandava digitá-lo por engano). O identificador de pacote
  é digitado **na criação** e é irreversível — conferir em Configurações → Detalhes
  do app antes do primeiro AAB. **App Store: adiada** junto com A2.
- **A4 [P0]** ~~Publicar política de privacidade em URL pública~~ **CONCLUÍDA em
  2026-07-29**: no ar em `https://saudediagnostica.com/radiant/privacidade/`
  (HTTP 200, corpo byte a byte idêntico à fonte, verificado de fora). Junto com
  ela subiu a página de suporte (**E5**) em
  `https://saudediagnostica.com/radiant/suporte/`. Detalhe da verificação e o
  risco da PR não mergeada no
  [plano de closed testing](2026-07-29-android-closed-testing-plan.md), L2.3/L2.8.
  Resta colar as duas URLs nos consoles — o que destrava privacy labels e data
  safety. O texto (pt-BR, com seção de dados locais, telemetria e contato) foi
  escrito em 2026-07-27 em
  [`docs/legal/politica-de-privacidade.md`](../legal/politica-de-privacidade.md),
  fundamentado num levantamento do que o app realmente coleta (insumo do D2):
  controlador Anderson Melo (pessoa física); local-first sem conta obrigatória;
  telemetria só no dispositivo; notificações locais sem push token; crash
  reporting (Sentry) coberto como opcional, hoje desligado no perfil
  `production`; Expo Updates como único terceiro ativo. **Resolvido desde
  então:** a hospedagem (URL acima) e o e-mail/entidade — o texto publicado
  declara Anderson Melo como controlador, contato `anderson.smelo94@gmail.com`.
  **Continua pendente:** revisão jurídica do texto, que é a única ressalva
  restante; ela não bloqueia E3, porque a URL já existe e o conteúdo publicado é
  o que foi declarado no Data Safety.
- **A5 [P1]** Configurar `eas submit`. **O bloco `submit.production.android` do
  `eas.json` foi preenchido em 2026-07-29** (`serviceAccountKeyPath`, `track`,
  `releaseStatus`) — a redação anterior desta task, "hoje só tem `ios: {}`",
  deixou de valer naquela data. `radiant-app/credentials/` existe, vazio e
  protegido pelo `.gitignore` da raiz. **Continua pendente:** gerar a
  service-account key do Play no console, e a **App Store Connect API key** —
  `submit.production.ios` segue `{}`.
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
  - **B0.1 [P0]** ~~reexecutar os três flows Maestro sob o perfil `preview`, que
    agora reflete produção, e registrar a evidência.~~ **Concluída para iOS em
    2026-07-28:** `3/3 Flows Passed in 6m 52s` sobre build Release local com
    bundle embutido (equivalente ao `e2e-test`: sem dev client, sem Metro). A
    execução anterior do mesmo dia falhou 1/3 — o `learning-critical-path` ainda
    afirmava a tarja em inglês da celebração de checkpoint, que o commit
    `fb1af1f` migrou para pt-BR junto com a troca do CTA fixo pelo rótulo do
    próximo nó. O flow foi repontado e o contrato ganhou uma guarda que extrai a
    string da própria `CheckpointScreen.tsx`, para que a mesma deriva não volte a
    passar verde. Evidência e receita de build em
    [`radiant-app/docs/evidence/2026-07-28-e2e-local-release.md`](../../radiant-app/docs/evidence/2026-07-28-e2e-local-release.md).
    **Android rodou pela primeira vez em 2026-07-28 e ficou `app-failed`**, não
    mais `environment-blocked`: `expo prebuild --platform android --no-install`,
    APK Release e emulador `Radiant_Pixel_9_API_36` produziram **2/3** —
    `boot-to-home` e `offline-relaunch` verdes, `learning-critical-path` vermelho
    em `tapOn: 'Progresso, tab.*'`, seletor que afirma o formato de
    acessibilidade que só o iOS compõe. A mesma execução revelou dois defeitos de
    ícone exclusivos do Android (ver bloqueio 4 do status canônico). Evidência em
    [`radiant-app/docs/evidence/2026-07-28-android-e2e-first-run.md`](../../radiant-app/docs/evidence/2026-07-28-android-e2e-first-run.md).
    **Fechado em 2026-07-29: Android `passed`, 3/3 (`11m 48s`); iOS reconfirmado 3/3.**
    Com isso **B0.1 fica concluída nas duas plataformas** — ver
    [`radiant-app/docs/evidence/2026-07-29-android-e2e-close.md`](../../radiant-app/docs/evidence/2026-07-29-android-e2e-close.md).
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
- **B6 [P1]** ~~Onboarding em instalação limpa~~ **Investigada em 2026-07-27.**
  Não é defeito de runtime: "instalação limpa → Home" é consequência correta da
  Learning Road ser a home (a home já recebe o usuário com o Pixel e destaca o
  próximo passo — casa com a copy "é só abrir e estudar"). A investigação revelou
  **código morto de onboarding**, não uma armadilha: (1) o wizard
  `src/app/onboarding/*` é protótipo inacabado — conteúdo em inglês que não bate
  com o catálogo pt-BR, especialidades falsas hardcoded, **não persiste nada**
  (escolhas descartadas no "Build my plan →") e **nenhuma tela de produção navega
  até ele** (só deep link); (2) o onboarding suave (`OnboardingService`
  intro/closure) está fiado só na `HomeScreen` clássica morta, então nunca aparece
  na Learning Road. **Recomendação (confirmar com Anderson):** manter o onboarding
  frictionless da Learning Road na v1.3 (sem wizard) e **remover o wizard + o
  onboarding suave junto com a `HomeScreen`** (ver plano estendido no
  `radiant-app/README.md`); se um setup guiado for desejado no futuro, o wizard
  precisa ser reconstruído (pt-BR, catálogo real, persistindo as escolhas).
  **Nenhuma correção de runtime é necessária para lançar.**
- **B7 [P2]** ~~Reduzir warnings de lint por domínio sem supressões globais~~
  **CONCLUÍDA em 2026-07-31: 65 → 11 warnings, 0 erros.** Meta era ≤ 20.

  A contagem herdada estava errada em toda parte (`54` nesta linha, de 07-27; `62`
  no status, de 07-30); recontada, eram **65**. E medindo **por regra e por
  arquivo**, 40 dos 65 **não eram dívida**:
  - **37** `no-require-imports` estavam dentro de fábricas `jest.mock()`, onde
    `require()` é **obrigatório** — o Jest içia `jest.mock` acima dos imports e a
    fábrica não pode referenciar binding de fora do escopo. Converter quebraria os
    testes.
  - **2** em `.rnstorybook/storybook.requires.ts`, que se declara
    `auto generated by storybook`.
  - **1** em `.expo/types/router.d.ts`, também gerado.

  **O que foi feito:** os 16 mecânicos corrigidos de fato (6 `array-type`, 5
  `no-unused-vars`, 4 `import/first`, 1 `no-empty-object-type`); e o
  `eslint.config.js` passou a ignorar os dois caminhos gerados e a desligar
  `no-require-imports` **apenas em `**/*.test.ts(x)`**, com a razão escrita no
  próprio arquivo. **Não é supressão global:** a regra segue valendo em todo o
  código de produção, que é onde proibir `require()` faz sentido. O ruído de 40
  warnings incorrigíveis era o que impedia alguém de olhar os que importam.

  Editar o `eslint.config.js` exigiu alargar `writePolicy.allowedRoots`, feito em
  **transação própria e anterior**, pelo mesmo padrão do alargamento para
  `radiant-app/assets` (commit `38f59b8`).

  **Restam 11**, e a natureza mudou: **9** `react-hooks/exhaustive-deps`, que
  exigem julgamento caso a caso porque mexer em dependências de hook altera
  comportamento, e **2** diretivas `eslint-disable` que ficaram órfãs — alguém já
  havia contornado a mesma regra arquivo a arquivo antes. Para o valor de agora,
  recontar em vez de citar qualquer número desta linha:
  `cd radiant-app && npx eslint . --format json`.

### Onda C — Paridade Android (M2)

- **C1 [P0]** `expo prebuild` Android; build local com JDK/SDK documentados;
  registrar runbook em `radiant-app/docs/E2E_RUNBOOK.md`.
- **C2 [P0]** Smoke manual em emulador: navegação completa, edge-to-edge,
  predictive back (hoje `predictiveBackGestureEnabled: false` — validar a
  escolha sob target 36), teclado, fontes ampliadas.
- **C3 [P0]** ~~Os 3 flows Maestro PASS em emulador Android~~ **Concluída em
  2026-07-29:** `3/3 Flows Passed in 11m 48s` no emulador `Radiant_Pixel_9_API_36`
  (iOS reconfirmado 3/3). Exigiu dois defeitos de E2E (seletor de aba ancorado
  `^Progresso(, tab.*)?$`; lift-scroll nos CTAs oclusos pela tab bar flutuante) e a
  resolução de uma causa ambiental (RAM do host de 16GB). Evidência em
  [`radiant-app/docs/evidence/2026-07-29-android-e2e-close.md`](../../radiant-app/docs/evidence/2026-07-29-android-e2e-close.md).
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
- **D2 [P0]** ~~Contrato de telemetria/privacidade (Task 16)~~ **Concluída em
  2026-07-27.** Contrato em
  [`docs/legal/CONTRATO_TELEMETRIA.md`](../legal/CONTRATO_TELEMETRIA.md), com:
  (a) allowlist de eventos já imposta em tempo de compilação pelo tipo
  `TelemetryEventName`; (b) proibições de propriedades (PII, credenciais,
  conteúdo clínico) em `sanitizeTelemetryProps.ts`, com mecanismo de exceção
  revisada (`REVIEWED_SAFE_KEYS`, hoje só `tokenPreviewAvailable`, um booleano);
  (c) imposição por teste de contrato (`telemetry-privacy-contract.test.ts`, no
  gate `app-test`) que varre as chamadas `track()` e falha em chave proibida;
  (d) scrub no adapter do Sentry (breadcrumb + context passam por
  `sanitizeTelemetryProps`; `sendDefaultPii=false`, user só `id`). Inclui o
  mapeamento para privacy labels (iOS) e data safety (Play). **Verificado:** hoje
  nenhuma propriedade de telemetria sai do device (analytics remoto off, Sentry
  off em `production`). Destrava **E3** (preencher as fichas das lojas).
- **D3 [P0]** ~~Checklist de release v1.3 + matriz real-device (Task 16)~~
  **Concluída em 2026-07-27.** Checklist go/no-go em
  [`docs/release/CHECKLIST_RELEASE_V1.3.md`](../release/CHECKLIST_RELEASE_V1.3.md),
  cobrindo qualidade/a11y, versionamento (D5), E2E + matriz real-device (iOS
  6,7"/6,1", iPad condicional, Android compacto/médio, com os checks por linha),
  privacidade/telemetria, metadados de loja, contas/submissão e pós-lançamento —
  cada item com estado (✅/⏳/⛔) e link para a task detalhada, mais um resumo dos
  bloqueios de submissão. É o checklist que se percorre antes de cada submissão,
  não uma reescrita do roadmap.
- **D4 [P0]** Gate editorial. **Triado em 2026-07-31 — a redação anterior, "triar
  os 42 itens `formatNeedsReview`", descrevia mal o trabalho nas duas direções.**
  Medição em [`docs/content/2026-07-31-d4-triagem-editorial.md`](../content/2026-07-31-d4-triagem-editorial.md):
  - os **42 bundles são 7 conceitos × 6 formatos** — os seis formatos marcam o mesmo
    conjunto, o campo de motivo está vazio nos 42, e o estado foi herdado do
    conceito. Triar "os 42" faz o revisor ler o mesmo conceito seis vezes;
  - os **7 conceitos** também são derivados: todos têm ≥33% de excertos-fonte
    sinalizados, contra ≤25% em todos os 9 aprovados;
  - a unidade atômica são **30 excertos**, e **8 deles moram em conceitos
    aprovados** — invisíveis para uma triagem feita na camada dos bundles;
  - a dúvida **não é editorial**: os 30 vêm do classificador `deterministic-keyword-v1`
    caindo em *fallback* (13 sem sinal nos três níveis), confiança média 0,52 contra
    0,91 dos aprovados. É posicionamento na taxonomia, não correção clínica.

  **Próximo passo (não decidido):** estender a cobertura de palavras-chave da
  taxonomia e reclassificar, medindo quanto da população cai sem intervenção humana;
  só o resíduo vai para o revisor de domínio. Alocar revisor de radiologia antes
  disso é usá-lo para consertar dicionário. O gate não bloqueia o closed test —
  bloqueia a produção.
- **D5 [P1]** ~~Congelar versionamento: definir `1.3.0`, alinhar
  `ios.buildNumber`/`android.versionCode` e documentar a política de
  `runtimeVersion`~~ **Concluída em 2026-07-28.** `radiant-app/package.json` e
  `radiant-app/app.json` foram de `1.2.1` para `1.3.0` (alinhados entre si),
  `ios.buildNumber` de `"1"` para `"2"` e `android.versionCode` de `1` para `2`.
  A política `runtimeVersion: appVersion` já estava documentada aqui e no
  checklist de release; a runtime passa a `1.3.0` junto com a versão. Nenhum
  build publicado ainda, então a mudança ainda é livre — depois do primeiro
  build de F1/F2 deixa de ser (alerta do status 2026-07-26). Registrado no
  [status canônico de 2026-07-29](../EXECUTION_STATUS_2026-07-29.md).
- **D6 [P1]** Pesquisa com usuários (Task 12) começa aqui e corre em paralelo
  ao beta (M4); P0/P1 de pesquisa bloqueiam M5.
- **D7 [P2]** Converter as 121 referências absolutas de docs para caminhos
  relativos (limpeza mecânica; melhora o repo para colaboradores).

### Onda E — Assets e metadados de loja (paralela a C/D)

- **E1 [P0]** **Android CONCLUÍDO em 2026-07-29** — os três assets gráficos do Play
  existem, travados pelo contrato (11/11 àquela data, **14/14** hoje, dentro do
  `npm run quality`):
  [`docs/store/ASSETS_DE_LOJA.md`](../store/ASSETS_DE_LOJA.md). Evidência em device
  do ícone da marca em
  [`2026-07-29-icone-marca-pixel.md`](../../radiant-app/docs/evidence/2026-07-29-icone-marca-pixel.md).
  **Ressalva, FECHADA no Android em 2026-07-30:** os screenshots mostravam
  progresso zerado (XP 0), e a causa foi investigada — **não era vitrine fraca,
  era defeito**. Em produção o laço de gamificação não tinha escritor alcançável:
  XP, sequência, revisões e meta diária ficavam permanentemente em zero.
  **Corrigido** nos commits `ab40bb1..056ffe1`, com gate verde, e **recapturado em
  device em 2026-07-30**: `XP total: 18` no checkpoint, `⚡ 36`/`🔥 1d` na home,
  `TOTAL XP 36` no progresso — ver
  [a evidência](../../radiant-app/docs/evidence/2026-07-30-laco-xp-device.md).
  A recaptura estava registrada como bloqueada por falta de JDK no host; **isso
  era falso** — o JDK 17 está instalado desde 2026-04-22 e o build sai em 48s
  (§4 do [status canônico](../EXECUTION_STATUS_2026-07-29.md)).
  **O lado iOS também fechou em 2026-07-30**, nos dois buckets: iPhone 16 Plus
  (6,7", 1290×2796) e iPhone 11 Pro Max (6,5", 1242×2688), ambos `EXIT=0` sobre
  build Release com env **production**. A mesma captura expôs e resolveu, no
  mesmo dia, os cards `PRECISÃO` e `TÓPICOS` sem dado por trás, e um defeito de
  oclusão no `store-capture.yaml` que travava o iOS. Evidência em
  [`2026-07-30-e1-store-capture.md`](../../radiant-app/docs/evidence/2026-07-30-e1-store-capture.md).
  **E1 está fechado nas duas plataformas** (iPad segue desligado na v1.3).
  **Complemento de 2026-07-30:** as capturas de iPhone deixaram de ser só
  evidência e viraram **assets publicáveis** — `docs/store/assets/screenshots-ios-67/`
  (1290×2796) e `screenshots-ios-65/` (1242×2688), seis telas cada. O
  `normalize-screenshots.py` passou a exigir `--spec`, porque o teto de 2:1 do
  Play **reprovava** os doze arquivos; o contrato de assets foi de 11 para 14
  testes, travando tamanho exato por bucket e paridade de telas entre eles.
  Escopo
  original: Screenshots por dispositivo: iPhone 6,7"/6,5" (iPad **desligado**
  na v1.3 — `supportsTablet: false`, decidido em 2026-07-29, o que remove os
  screenshots de tablet do escopo), Android phone + os **três** assets gráficos
  obrigatórios do Play. **Correção de 2026-07-29:** são três, não dois — **ícone
  512×512** (PNG 32-bit **com** alpha, ≤ 1024 KB), **feature graphic 1024×500**
  (**sem** alpha) e **≥ 2 screenshots de telefone**. Screenshot tem teto de
  proporção **2:1**: o nativo do emulador Pixel 9 (1080×2424 = 2,24:1) **seria
  recusado**; capturar em 1080×1920.
- **E2 [P0]** ~~Textos de loja pt-BR~~ **Rascunho pronto em 2026-07-27** em
  [`docs/store/textos-loja-pt-BR.md`](../store/textos-loja-pt-BR.md): nome,
  subtítulo (App Store, 3 opções) / título (Play), descrição curta (Play),
  texto promocional, descrição longa, keywords e notas de release da v1.3, tudo
  dentro dos limites de caracteres, mais o disclaimer educacional. Decisões:
  categoria **Educação**, gratuito no lançamento (freemium futuro, sem prometer
  "grátis para sempre"), ângulo de método (trilha + revisão espaçada). Sem
  alegação médica/clínica e sem números inventados. **Pendente:** aprovação de
  Anderson (escolher variantes), reserva do nome (A3) e revisão de domínio.
  **Confirmado em 2026-07-31:** o posicionamento "sem conta" fica na v1.3 porque
  descreve o binário distribuído — o bloco de login existe no código mas é inerte
  sem `EXPO_PUBLIC_API_BASE_URL`. Conta e assinatura premium ficam para a **v1.4**,
  com o modelo de cobrança ainda em aberto (Play Billing puro vs. conta própria):
  ver [ADR-2026-07-31 — conta e premium](../adr/ADR-2026-07-31-conta-e-premium.md).
  Na mesma data, três contagens de caracteres da fonte foram recontadas e
  corrigidas, e ficou registrado que a descrição longa precisa ser **convertida de
  Markdown para texto limpo** antes de colar no console.
- **E3 [P0]** Privacy labels (App Store Connect) e Data safety (Play) — 
  derivados de D2; declarar Sentry (crash data) e o que mais a allowlist
  permitir.
- **E4 [P0]** Classificação etária/questionários de conteúdo nas duas
  consoles; categoria (Educação ou Medicina — recomendação: Educação, evita
  escrutínio de app médico).
- **E5 [P1]** ~~Página de suporte + e-mail de contato~~ **CONCLUÍDA em
  2026-07-29**: no ar em `https://saudediagnostica.com/radiant/suporte/`
  (HTTP 200, verificado de fora), com contato `anderson.smelo94@gmail.com`.
  Resta colar a URL nos consoles. Ver A4 e L2.8.
- **E6 [~~P2~~ → P0] — CONCLUÍDA em 2026-07-29.** As 6 tasks do
  [plano do ícone](../superpowers/plans/2026-07-29-icone-do-app.md) foram
  entregues: gerador determinístico, oito derivados, `app.json` alinhado, assets
  de loja fechados e evidência em device (3 de 4 provas —
  [`2026-07-29-icone-marca-pixel.md`](../../radiant-app/docs/evidence/2026-07-29-icone-marca-pixel.md)).
  Contrato de assets em **11/11** àquela data — **14/14** desde 2026-07-30 —,
  dentro do `npm run quality`. O enquadramento
  foi resolvido a favor da spec (62% da largura), com o gerador derivando a altura
  do aspecto real. **Ressalva aberta:** a prova do *themed icon* do Android 13+
  precisa de aparelho real — uma captura da gaveta com o tema ligado basta.

  ~~Ícone e assets finais
  revisados~~ → **Ícone e assets finais refeitos.** A revisão preparatória da
  ficha do Play encontrou **três defeitos reais**, não ajustes cosméticos:
  1. A **grade de construção do design está embutida na arte** de `icon.png`
     **e** de `android-icon-background.png`. Como `app.json` não declara
     `ios.icon`, `icon.png` é o ícone da App Store e da tela inicial do iPhone.
     Armadilha registrada: inspecionar só a camada *foreground* (que está limpa)
     leva à conclusão errada de que o Android está ok — o adaptive icon é a
     **composição** das duas camadas, e a de fundo tinha o mesmo defeito.
  2. `splash-icon.png` **não é a marca**: é um placeholder de alvo em blueprint,
     exibido a 200 px sobre fundo **branco** em todo cold start, contra a
     [ADR de identidade galaxy dark](../adr/ADR-2026-07-27-identidade-visual-galaxy-dark.md).
  3. O **"A" em chevron é da Ascend Creative**, não do Radiant.

  **Decisão aprovada pelo dono (2026-07-29):** o mascote **Pixel** vira a marca —
  corpo inteiro sobre gradiente galaxy elevado (`#0D1230` centro → `#07091c`
  borda), com o rosto simplificado como forma reduzida na camada monocromática.
  Spec em
  [`2026-07-29-icone-do-app-design.md`](../superpowers/specs/2026-07-29-icone-do-app-design.md),
  execução em
  [`2026-07-29-icone-do-app.md`](../superpowers/plans/2026-07-29-icone-do-app.md)
  (6 tasks; 1 e 2 concluídas). E6 deixou de ser P2 porque **bloqueia E1/L2.7**:
  os assets de loja saem da mesma arte-mestra.

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
  **Pré-requisito descoberto em 2026-07-31:** não existe organização nem projeto
  Sentry configurado. O plugin Gradle tentava subir source maps em todo build de
  release e **derrubava o build** (`error: An organization ID or slug is required`),
  porque `app.json`, `sentry.properties` e `eas.json` não traziam
  `SENTRY_ORG`/`SENTRY_PROJECT`/`SENTRY_AUTH_TOKEN`. O upload foi **desligado** com
  `SENTRY_DISABLE_AUTO_UPLOAD: "true"` para destravar o lançamento — o Sentry já
  estava desligado em runtime (`ENABLE_CRASH_REPORTING` default `false`). Para o F6
  acontecer de verdade, alguém precisa criar a organização e o projeto no Sentry e
  guardar o auth token como segredo do EAS. Sem isso, "monitorar crash-free" não tem
  onde acontecer. Detalhe em [`EAS_SUBMIT_SETUP.md`](../store/EAS_SUBMIT_SETUP.md).
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
