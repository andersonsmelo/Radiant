# Radiant — estado arquitetural

## Produto vigente

Radiant é um app Expo/React Native local-first. Catálogo, lições, progresso e
revisões permanecem utilizáveis sem backend. A API Fastify/PostgreSQL existe
para autenticação e sincronização, mas a API pública conhecida está registrada
como inativa (HTTP 502) no
[`status canônico`](archive/EXECUTION_STATUS_2026-08-13.md) e não faz parte do caminho
crítico do teste fechado.

Componentes principais:

- `radiant-app/src/app`: única árvore oficial de rotas;
- `LessonCatalogService`: fachada do catálogo local/remoto;
- `ProductionCurriculumCatalog`: projeção somente de batches v2 promovidos para
  catálogo, jornada, player e checkpoint;
- `JourneyDefinitionService`: projeta trilhas do catálogo para a jornada;
- `JourneyProgressService`: mantém seleção e progresso por trilha;
- `LessonOutcomeService`: registra resultado, XP e evidência de conclusão;
- `LegacyLessonAdapter`: converte bloco legado em atividade v2, puro e 1:1;
- `ActivityRendererRegistry` + `useLearningActivity`: player desacoplado dos
  tipos de atividade, com contrato único `interaction/value/onChange`;
- `LearningEvidenceRepository`: evidência estruturada por interação;
- `CompetencyMasteryService`: domínio por competência, puro e determinístico;
- `CompetencyReviewService`: store e agendamento por competência, ainda sem
  chamador de leitura em produção;
- `Conteúdo/`: pipeline editorial com proveniência;
- `radiant-api/`: auth, sync e catálogo remoto opcional.

## Jornada atual

A Learning Road V2 usa `journey-progress.v2`, preserva progresso separado por
trilha e migra o store legado quando possível. O catálogo runtime expõe
Fundamentos, Tórax e Abdome; as 18 atividades existentes continuam sendo o
baseline compatível durante a evolução.

Regra arquitetural: alternar trilhas não apaga progresso, uma falha de sync não
bloqueia o estudo e estados vazios devem manter continuidade no fluxo principal.

Na saída da apresentação de primeiro uso, `RootLayout` persiste o encerramento
antes de consultar `JourneyProgressService`. O desfecho **Começar** abre o
`nextRecommendedNode` pela mesma política de roteamento da jornada, somente
depois que o `Stack` está montado; **Pular apresentação** abre a Home. Não há id
de lição fixo, e falha ou nó não navegável degrada para Home.

## Kernel de checkpoints — `active` interno medido, produção em `off`

Em 2026-08-09 foi aprovado o desenho de um kernel central para registrar e
retomar as telas principais da jornada. Ele não substitui os serviços acima:
coordena estado mínimo retomável por adaptadores e delega progresso, evidência,
domínio, revisão, XP e desbloqueio aos donos atuais.

O contrato usa `off | shadow | active`, stores separados para ativo/shadow,
diário limitado e um commit local recuperável e idempotente por `operationId`.
Cada operação nasce junto de uma intenção imutável de replay no mesmo registro
serializado; cada serviço persiste o recibo de idempotência atomicamente com o
efeito antes de a saga marcar a etapa como concluída.
O loop pedagógico será ligado a um loop editorial com revisões humanas clínica,
de direitos e de acessibilidade independentes.

Em 2026-08-10 o runtime `active` interno foi medido em aparelho pela primeira
vez, e a medição corrigiu dois enganos que estavam versionados. O primeiro é de
configuração: `expo/virtual/env.js` monta o env do cliente como
`{ ...process.env, ...arquivos .env }`, então o arquivo vence a linha de comando
e `EXPO_PUBLIC_APP_ENV=preview` do `.env` derrubava o modo para `off` —
`resolveStudentCheckpointRuntimeMode('preview','active')` devolve `off` por
contrato. O segundo é de produto: `CheckpointResumeScreen` não era rolável e, a
partir de `accessibility-extra-extra-large`, perdia os dois botões, deixando
quem usa texto grande sem saída. Ambos corrigidos; o segundo tem prova em
aparelho em AX4 e AX5, e também na viewport mais curta que este host oferece
(`iPhone SE` de 375 × 667 pt), onde em AX5 nem o corpo do cartão cabe e o CTA
segue alcançável rolando.

O terceiro engano era do **instrumento**, e custou três correções no mesmo dia: o
gate de partida media uma janela em que o kernel não existe. A arquitetura de
medição resultante tem três famílias de métrica com autoridades diferentes —
`persistence`/`restoration` medidas dentro do app e só em `active`; `first_frame` e
`launch_inspection` medidas dentro do app e **em todos os modos**, porque delta
exige as duas coortes; e `cold_start`/`home_to_lesson` derivadas do runner de E2E.
Só as duas primeiras famílias entram no veredito.

Em 2026-08-09 a Onda 2 criou o módulo isolado
`radiant-app/src/features/student-checkpoints/`: contratos/schemas fechados,
stores ativo/shadow, quarentena, coordenadores, journal recuperável, sete
autoridades transacionais e outbox auxiliar. Nenhum adaptador foi conectado às
telas ou aos serviços legados; produção permanece `off`, rotas/progresso/XP não
mudaram e sync remoto continua inexistente.

Ordem normativa: governança → fundação transacional → shadow → runtime interno
→ Task 12 educacional → Galáxia/pipeline/Unidade 1 → outbox e beta pedagógico local/offline
→ expansão pedagógica. Sync remoto é uma trilha posterior e independente, com
gates próprios de carga/soak, API/auth, conflitos e sink verificado.

## Evolução por competências

A decisão de 2026-07-31 introduz um contrato de atividade v2 com renderizadores
reutilizáveis, tentativas estruturadas e domínio por competência. A Galáxia
deverá se tornar uma projeção da mesma jornada canônica, não uma segunda árvore
de progresso. O catálogo legado será preservado por adaptador durante a
migração.

Fluxo-alvo:

```text
fonte + decisão de direitos
          ↓
conceito + competência + atividade
          ↓
revisão humana da unidade
          ↓
catálogo canônico
     ↙          ↘
jornada        Galáxia
     ↓
tentativa → domínio → revisão espaçada
```

Estado de implementação (a autoridade é o status canônico; esta lista é
conveniência e decai):

- governança das novas raízes editoriais: concluída;
- catálogo dos 36 documentos únicos: concluído;
- validação do manifesto de mídia: concluída;
- primeiro lote original de mídia: **concluído para o corte autorizado** — uma
  ilustração sintética está `ready`; cinco candidatas históricas continuam
  rejeitadas;
- grafo curricular de 30 competências: **concluído**;
- contrato `LearningActivityV2` e adaptador do catálogo legado: **concluídos**;
- evidência estruturada por interação e domínio por competência: **concluídos**;
- registro de renderizadores e player desacoplado: **concluído**;
- agendador por competência: **concluído e inerte** — observa exposições, mas
  `getDue` ainda não alimenta a jornada; campos numéricos persistidos exigem
  `Number.isFinite` e stores inválidos vão para quarentena;
- renderizadores de hotspot, comparação, associação e ordenação:
  **concluídos**, ao lado da múltipla escolha; `parameter-lab`, `risk-hunt` e
  `case-decision` permanecem para ondas futuras;
- guarda de ativação do agendador: **concluída** — competência sintética legada
  falha fechada; o lote H4 v2 existe, mas a leitura curricular permanece
  desligada pelo limite de rollout;
- kernel de checkpoints e commit recuperável: fundação (`off`), shadow nas 12
  superfícies e **runtime `active` interno** concluídos. Produção continua `off`
  e as autoridades legadas seguem decidindo progresso, XP, desbloqueio, revisão
  e jornada. O gate de dispositivo foi executado em 2026-08-10: persistência p95
  **23,1 ms** e restauração p95 **9,0 ms**, com a retomada offline provada 20
  vezes, e o viewport curto fechado em simulador de 375 × 667 pt em `medium`, AX3,
  AX4 e AX5. O delta de partida é o único item aberto, e o instrumento que o mede
  foi trocado três vezes em 2026-08-10, cada vez porque a anterior não bastava:
  limiar consciente do ruído medido; depois um terceiro desfecho
  (`inconclusive`/`measurement-too-noisy`, falha fechada, quando o piso de ruído
  passa de um quinto do p95 do baseline); e por fim a **troca da métrica**. O
  `cold_start` mede a duração do `launchApp` do Maestro, que num Dev Client termina
  no launcher, antes de o bundle JS existir — o kernel é JavaScript e não vive
  nessa janela, então nenhum ajuste de limiar podia salvá-la. Entrou `first_frame`,
  do início da janela JS ao frame seguinte a `startupPhase` virar `ready`, que só
  ocorre depois de `inspectLaunch` do runtime de checkpoints: **o kernel está
  dentro da janela por construção**. Emitida nos dois modos, porque é isso que faz
  o baseline `off` produzir a coorte de comparação; `cold_start` ficou informativo,
  fora do veredito.

  **E a primeira medição da métrica nova achou custo de partida, mas não onde
  parecia.** Um piloto apontou ~440 ms a mais em `active`, e a fronteira medida
  (`launch_inspection`, instrumentada nos dois modos: 0,5–0,9 ms em `off` contra
  184–357 ms em `active`) mostrou que **~72% disso não é lógica do kernel** — é
  resolução de módulo. A primeira operação de storage do kernel resolve o
  AsyncStorage por `await import()`, que o Metro serve como chunk buscado por HTTP
  num Dev Client; a operação seguinte no mesmo lançamento custa 13–21 ms. Em `off`,
  `inspectLaunch` retorna antes de tocar o store, então o baseline nunca paga.
  Import estático foi tentado e derrubou seis suítes do kernel, porque `jest-expo`
  não mocka esse módulo — a preguiça é obrigatória e o custo dela está registrado
  no ponto de chamada. **A pergunta está fechada:** medindo a resolução do módulo
  isolada da leitura, a resolução responde por 177–622 ms e a leitura por **menos de
  2 ms**; e o export de produção emite um único bundle JS sem chunk assíncrono, então
  num build embarcado o `import()` não tem o que buscar. **O custo é artefato do Dev
  Client, e o kernel custa menos de 2 ms na partida** — a medida mais baixa das três
  do kernel. A consequência recai sobre o instrumento: o delta de `first_frame` medido
  em Dev Client não podia julgar esta onda, porque apenas um dos lados percorria o
  caminho de chunk. **Corrigido no mesmo dia:** `warmNativeStorage()` roda no
  bootstrap independente do modo, sem tocar chave alguma, então os dois lados pagam a
  resolução — `launch_inspection` em `active` caiu de 184–357 ms para **1,0–1,9 ms** e
  o delta de medianas de `first_frame` de +344/+441 ms para **−28,7 ms**, com o
  candidato marginalmente mais rápido, que é o esperado de um kernel de <2 ms. Em
  desenvolvimento isso deixa os dois modos mais lentos, porque a busca é mais lenta
  que o resto do bootstrap e passa a dominá-lo; em produção o custo é ~0. O que resta
  é rodar as duas coortes de 20 em janela de host, e agora elas medem o kernel;
- checkpoint e reforço adaptativo (Task 12 educacional): **corte vertical da
  primeira unidade conectado em 2026-08-13**. O player consome as 12 atividades
  v2 nativas e registra competência/contentVersion reais; o checkpoint apresenta
  10 itens, aplica 80%, só conclui a jornada em aprovação e encaminha falha para
  reforço da competência frágil. O kernel continua `off` em produção; quando
  `active` interno, o hook constrói o intent com o `checkpointId` emitido pelo
  runtime, evitando mismatch de autoridade.

Antes de ativar o lado de leitura do agendador, o resolver ainda precisa apontar
para competência curricular real do conteúdo v2. A guarda já impede que
competências sintéticas legadas produzam recomendação visível.

Duas propriedades que o motor v2 já garante e convém não perder de vista ao
evoluí-lo:

- **O caminho legado segue intacto.** `LessonBlock` continua validado por exceção
  com exatamente uma múltipla escolha por bloco e usa `recordCompletion`; uma
  atividade v2 promovida usa `recordActivityCompletion`, sem fabricar bloco
  legado. As 18 atividades anteriores continuam funcionando durante a migração.
- **Evidência legada é rastreável e separável.** Conteúdo antigo produz
  `legacy-lesson-recall` sob competência sintética `competency:legacy:*`, e o
  cálculo de domínio a **ignora por padrão** — lição antiga não foi escrita contra
  o currículo, então sua evidência não sabe qual competência mede.

## Contratos editoriais

- `Conteúdo/fontes/library-catalog.json`: inventário por SHA-256 e decisão de
  direitos;
- `Conteúdo/mídia/manifest.json`: autorização, anonimização, acessibilidade e
  regiões interativas;
- `Conteúdo/governança/catalog-payload.json`: catálogo promovido legado;
- `radiant-app/src/features/student-checkpoints/ProductionBatch.ts`: envelope,
  gates e fingerprint material do lote v2;
- `scripts/content/production-batch.mjs`: recálculo do hash material, lock
  exclusivo de escritor, publicação atômica, changelog e rollback;
- `scripts/content/validate-foundation.mjs`: gate agregado;
- `scripts/content/validate-media-manifest.mjs`: gate específico de mídia.

Fonte `reference-only` serve somente para consulta factual e redação original.
Fonte `blocked` não alimenta conteúdo. Nenhum ativo de imagem entra no app sem
autorização e anonimização verificadas.

## Fontes de verdade

| Tema | Documento |
| --- | --- |
| Estado operacional | [`archive/EXECUTION_STATUS_2026-08-13.md`](archive/EXECUTION_STATUS_2026-08-13.md) |
| Produto | [`PRD.md`](PRD.md) |
| Ordem entre as frentes | [`plans/2026-08-01-radiant-roadmap-mestre.md`](plans/2026-08-01-radiant-roadmap-mestre.md) |
| Roadmap de lançamento | [`plans/2026-07-27-radiant-launch-roadmap.md`](plans/2026-07-27-radiant-launch-roadmap.md) |
| Pipeline editorial | [`CONTENT_PIPELINE.md`](CONTENT_PIPELINE.md) |
| Runtime do app | [`../radiant-app/README.md`](../radiant-app/README.md) |
| Runtime da API | [`../radiant-api/README.md`](../radiant-api/README.md) |
| Decisão educacional | [`adr/ADR-2026-07-31-aprendizagem-por-competencias.md`](adr/ADR-2026-07-31-aprendizagem-por-competencias.md) |
| Kernel de checkpoints | [`superpowers/specs/2026-08-09-checkpoints-e-loops-do-aluno-design.md`](superpowers/specs/2026-08-09-checkpoints-e-loops-do-aluno-design.md) |
| Plano do kernel | [`superpowers/plans/2026-08-09-checkpoints-e-loops-do-aluno.md`](superpowers/plans/2026-08-09-checkpoints-e-loops-do-aluno.md) |
| Privacidade de checkpoints | [`STUDENT_CHECKPOINT_PRIVACY_CONTRACT.md`](STUDENT_CHECKPOINT_PRIVACY_CONTRACT.md) |
| Rollout/rollback do kernel | [`runbooks/student-checkpoint-rollout-rollback.md`](runbooks/student-checkpoint-rollout-rollback.md) |

## Estado em 2026-09-14 — depois da publicação e do desenho da 1.4

Este bloco é o mais recente; o que está acima descreve estados anteriores e
permanece como histórico.

- **Publicado:** `1.3.1 (11)` na App Store em 2026-09-14, de `main` =
  `063770d` (tag `v1.3.1`). Sem Galáxia (absorvida por Estude, ADR
  2026-08-15), sem painel decorativo nas lições, com alternativas
  embaralhadas no gerador compartilhado, sem formulário de conta em produção.
  Trilha contínua com o catálogo legado de 16 lições.
- **1.4 desenhada e parcialmente implementada** (spec e ADR de 2026-09-14).
  Serviços novos em `radiant-app/src/features/`: `journey/services/NextNodeResolver`
  (o motor do próximo nó, consumido por `JourneyRecommendationService` →
  `JourneyProgressService.computeSnapshot`); `hearts/` (`HeartsService` puro +
  `HeartsRepository` persistido; descontado na lição e no checkpoint);
  `subscription/` (`SubscriptionService` com porta de loja, tela
  `/subscription` e, desde 2026-09-23, o `StoreKit2Adapter` sobre o módulo
  Expo local `modules/radiant-storekit/`, só StoreKit 2 — Swift ainda não
  compilado em build; pedido Ask to Buy pendente vale 24 h e nunca esconde
  planos); backup no iCloud (`ProgressSyncService` sobre o módulo
  `modules/radiant-cloudkit/`, validado em aparelho em 2026-09-16);
  migração de armazenamento 1.3.1 → 1.4 com backup na abertura. Trilha
  virtualizada (`JourneyTrail`) com cabeçalho de vidas; folha de vidas nas
  três telas de estudo. **Estado dos nativos em 2026-09-23:** iCloud validado
  em aparelho; Sentry com opções mínimas, portão fechado por decisão de loja;
  StoreKit implementado e à espera de build e sandbox — ver `STATUS.md`.
- **Kill switches (`src/config.ts`), desde 2026-09-23:** só dois reais,
  `ENABLE_LEARNING_ROAD` e `ENABLE_REVIEW`, ambos lidos do ambiente e
  acionáveis por build ou OTA. `config/killSwitches.contract.test.ts` barra
  por AST flag fixa ou sem leitor. "Nenhum evento de analytics sai do
  aparelho" é garantido por nenhum adaptador de analytics ser registrado, com
  guarda em `telemetry-privacy-contract.test.ts` — não por flag.
- **Vidas têm uma fonte só desde 2026-09-23:** o `HeartsRepository`. O
  contador que o `GamificationService` guardava ao lado foi aposentado pelo
  PR #20 (`2e62fc9`); os campos antigos gravados pela 1.3.1 continuam no blob
  `radiant:gami:v1`, intocados, e nada os lê — o `tsc` barra um leitor novo.
- **Dívida conhecida:** o cartão antigo de conta continua em
  `ProgressScreen`, condicionado por `remoteSyncAvailable` e invisível em
  produção — código morto.
- **V3 (currículo):** fundação J2 em `main`; L1 e L2 do Arco 1 estão
  versionadas em `main` (`features/curriculum-v3/l1-body-reference` e
  `l2-slicing-space`), ligadas a nada; `prepareV3()` não tem chamador fora de
  teste (medido em 2026-09-23). A L2 reprovou nas seis revisões — ver J3 na
  `FILA.md`. O corte (J5) é a 1.4 ou posterior, com spec própria.

## Estado em 2026-09-22 — telemetria auditável e geometria da L2 em módulo puro

- **Telemetria.** `features/telemetry/bootstrap.ts` passou a expor
  `buildSentryOptions` como **função pura**, que é o que determina o que sairia
  do aparelho: sem PII, sem rastreamento de desempenho, sem quadros nativos,
  `beforeSend` removendo `user`/`server_name`/nome de aparelho e
  `beforeBreadcrumb` descartando migalhas `console`/`xhr`/`fetch`. O contrato de
  privacidade ganhou guarda **por AST** de que o SDK é inicializado num ponto só
  e sempre por essa função. O portão continua fechado: sem
  `EXPO_PUBLIC_ENABLE_CRASH_REPORTING` o `Sentry.init` não roda.
- **Três portas de saída, todas fechadas em produção.** Sentry (exige flag +
  DSN), API (`isApiConfigured()` exige `EXPO_PUBLIC_API_BASE_URL`) e sync
  (`ENABLE_REMOTE_SYNC`, default falso). O ambiente `production` do EAS tem uma
  variável só, o DSN. Consequência registrada: o defeito conhecido de
  `ENABLE_REMOTE_SYNC` não desligar o `AuthService` **é inerte em produção**,
  porque o auth decide por `isApiConfigured()`.
- **L2 do currículo V3.** A geometria do modelo 2.5D saiu do componente para
  `l2-slicing-space/l2SlicingGeometry.ts`, um módulo puro. O motivo é estrutural
  e vale além desta lição: **Jest não rasteriza SVG**, então asseverar sobre o
  desenho exige asseverar sobre os valores que o determinam. A versão anterior
  incidia sobre um `<Text>` espelho das props embarcado no componente só para os
  testes — asserção de conjunto de falhas vazio, verde por três ciclos de
  auditoria com 18 achados presentes.
- **O desenho é inalcançável pelas consultas padrão de teste.** O `<Svg>` é
  `accessibilityElementsHidden`, e o RNTL fixa `defaultIncludeHiddenElements:
  false`. Teste sobre elemento de desenho precisa de
  `{ includeHiddenElements: true }` — é por isso que nunca houve um, não por
  esquecimento.

## Regras de consistência

- o status canônico governa o presente; snapshots anteriores são históricos;
- arquivos gerados do catálogo não são editados manualmente;
- promoção exige proveniência, revisão e validadores verdes;
- ~~vidas não podem bloquear novas lições~~ — **substituída em 2026-09-14** pela
  [ADR da 1.4](adr/ADR-2026-09-14-1-4-freemium-por-vidas-storekit-e-icloud.md):
  vidas bloqueiam lição nova e checkpoint; **nunca bloqueiam revisão**;
- nenhuma mudança de binário entra no closed test sem repetir os gates de
  release aplicáveis.
