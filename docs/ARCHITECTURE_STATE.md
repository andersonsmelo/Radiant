# Radiant — estado arquitetural

## Produto vigente

Radiant é um app Expo/React Native local-first. Catálogo, lições, progresso e
revisões permanecem utilizáveis sem backend. A API Fastify/PostgreSQL existe
para autenticação e sincronização, mas a API pública conhecida está registrada
como inativa (HTTP 502) no
[`status canônico`](STATUS.md) e não faz parte do caminho
crítico do teste fechado.

Componentes principais:

- `radiant-app/src/app`: única árvore oficial de rotas;
- `LessonCatalogService`: fachada do catálogo local/remoto;
- `ProductionCurriculumCatalog`: projeção somente de batches v2 promovidos para
  catálogo, jornada, player e checkpoint;
- `JourneyDefinitionService`: projeta trilhas do catálogo para a jornada;
- `JourneyProgressService`: mantém seleção e progresso por trilha;
- `NextNodeResolver`: prioriza retomada, revisão devida, avaliação, conquista
  coletável e lição, sem liberar pré-requisitos;
- `AssessmentAttemptRepository`: histórico local das avaliações V2 e conclusão
  das atividades de reforço posteriores à reprovação;
- `SpacedRepetitionService`: agenda SM-2 completa, com filtro separado da fila
  devida; a data futura pode informar o cartão sem antecipar uma revisão;
- `LessonOutcomeService`: registra resultado, XP e evidência de conclusão;
- `LegacyLessonAdapter`: converte bloco legado em atividade v2, puro e 1:1;
- `ActivityRendererRegistry` + `useLearningActivity`: player desacoplado dos
  tipos de atividade, com contrato único `interaction/value/onChange`;
- `JourneyRecommendationCard`: apresentação do próximo nó existente, no header
  rolável da `JourneyTrail`; nenhuma resolução/persistência própria;
- `StarfieldBackground`: variante opcional `focused` (24 estrelas, sem nebulosas),
  default galaxy preservado; foco e movimento reduzido continuam nos hooks;
- `LessonSummary`: celebração e resultados roláveis/factuais; callbacks e
  avaliação da aula independentes da loja, sem outro serviço de resultado;
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

## Contratos locais dos itens 36, 39 e 27 — commit `a366295`

Reconciliados com o código em 2026-10-12. A disponibilidade nas lojas é
registrada somente no STATUS; esta seção descreve implementação local.

- **Reforço persistente:** `AssessmentAttemptRepository` serializa operações
  na chave `@radiant:assessment_attempts_v1`. A avaliação consulta a tentativa
  anterior, exige nova conclusão integral do conjunto de atividades das
  competências frágeis e registra os vínculos de ciclo. O player entrega a
  conclusão por `LessonOutcomeService.recordActivityCompletion`, inclusive
  para lições que já estavam concluídas na jornada. Concluir antes da falha
  ou apenas abrir o conteúdo não satisfaz o reforço. Reentrada reseta respostas
  somente na transição bloqueado→liberado. Leitura/gravação inválida não
  presume conclusão. O histórico ainda está fora do backup iCloud.
- **Currículo e kernel:** o reforço V2 reutiliza atividades já aprovadas e
  funciona independentemente do modo do kernel. Os metadados de modalidades
  novas do plano do kernel não são prova de que esses materiais foram
  entregues. O contrato preserva dois ciclos e o estado terminal de apoio.
- **Conquista:** `JourneyRecommendationService` inclui `reward` entre os
  candidatos; `NextNodeResolver` o escolhe depois de retomada, revisão devida
  e checkpoint, antes da próxima lição. Pré-requisitos e conclusão permanecem
  soberanos. A escrita/coleta continua no serviço da jornada, sem concessão
  automática pela recomendação.
- **Revisão futura:** `getReviewSchedule` expõe instantes futuros, enquanto
  `getDueReviewSchedule` continua filtrando `dueAtMs <= agora`. O snapshot
  transporta `reviewAvailableAtMs` apenas quando os pré-requisitos foram
  cumpridos; `JourneyNodeCard` apresenta data/hora local e rótulo acessível.
  Intervalos, fila devida e progresso não são alterados pela apresentação.

[ADR](adr/ADR-2026-10-12-reforco-conquista-e-disponibilidade.md) e
[evidência](evidence/2026-10-12-itens-36-39-27.md) concentram decisões e provas.

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
  cinco avaliações de dois itens (desde a decisão de 2026-08-21), aplica 80%,
  só conclui a jornada em aprovação e encaminha falha para reforço da
  competência frágil. O kernel continua `off` em produção; quando
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

## Catálogo de lotes — contrato de implementação de 2026-10-16

`ProductionCurriculumCatalog` é o singleton de um snapshot criado por
`createProductionCurriculumCatalog`. A apresentação é declarada por batchId em
`production-catalog-entries`: slug, nome, descrição, unidade e ID/texto da conquista.
O registro enumera `PRODUCTION_BATCHES`; falta de metadados é erro explícito.
A configuração de apresentação permanece compilada e separada do fingerprint
do material clínico; novos registros exigem apresentação revisada e lote promovido.

Os índices de atividade/checkpoint/jornada são construídos uma vez por snapshot,
com dados clonados e congelados. IDs existentes são mantidos; colisões e etapas
sem avaliação são recusadas. A composição aceita lotes de trilhas distintas e, com
`ProductionTrackComposition` explícito, várias unidades no mesmo trackId.
Ordem, conjunto de unidades, grafo e consistência de metadados são verificados;
resumos recebem ordem contínua. Sem plano explícito, sobreposição é recusada.
O contrato de 2026-10-16 exige o checkpoint final da unidade anterior, preservando
a coleta opcional de conquista; [decisão e continuidade G2](adr/ADR-2026-10-16-composicao-multiunidade-da-trilha.md). A mudança não grava storage nem altera o schema do
progresso, o contrato de promoção ou os seis gates editoriais.

`composeCurriculumCatalog` contém a composição local/remota existente usada por
`LessonCatalogService` e pelo inventário. `JourneyCatalogAudit` verifica grafo e
resolução com portas explícitas; a medição offline chama os mesmos serviços de
jornada/player, substituindo somente a porta local do catálogo. O estado operacional,
o gate integral e os próximos passos pertencem ao [STATUS](STATUS.md).
[Evidência e método](evidence/2026-10-16-trilha-g0-g1-catalogo.md).

`ProductionCurriculumCoverage` é uma auditoria offline de referências por item,
competência, fonte e claim; distingue placeholders do legado, não valida clínica
ou direitos. O inventário schema 3 resolve também os itens dos checkpoints pelos
nós reais. A convenção de claims permanece a do candidato V1 e a promoção ainda
contém regras específicas do H4, a generalizar em G3. O singleton real mantém o
lote existente; nova composição curricular exige configuração e gates próprios.
[Evidência desta extensão](evidence/2026-10-16-trilha-cobertura-e-multiunidade.md).

### Progressão e navegação das composições — G2

`ProductionCatalogComposition` marca apenas conquistas com
`optionalForProgression`. A régua em `trackCompletion` é consumida pela conclusão
de áreas e por `JourneyUnitProgress`; lições e avaliações nunca são dispensadas.
`NextNodeResolver` mantém retomada/revisão/avaliação e recomenda estudo antes de
conquista opcional. O foco das composições consome essa prioridade. A marca é do
catálogo, não é estado novo no storage e não altera identidades.

`JourneyTrail` mantém índices de nós estáveis e inclui marcadores/índice virtualizado
de unidades quando houver composições. A seleção rola a lista, sem autorizar
atividade. `RewardScreen` resolve destino explícito por `getSnapshotForNode` e
conserva o contexto da área; ID inexistente não vira fallback para outra conquista.
[Evidência e limites de validação](evidence/2026-10-16-trilha-g2-progressao-e-unidades.md).

## Contrato editorial genérico da trilha — 2026-10-17

`EditorialBatchContract` é a validação pura dos lotes v1, sem dependência do
candidato H4. O candidato histórico reexporta a função por compatibilidade;
`ProductionBatch` preserva promoção imutável e expõe validação de artefato promovido.
O publicador Node usa esses mesmos módulos via carregador restrito a `src`, sem
executar o JSON recebido. Conteúdo, cobertura, claims, gates e fingerprints são
conferidos antes da escrita; colisões entre lotes impedem persistir um catálogo
incompilável por identidades repetidas. A apresentação/composição continuam fora
do artefato editorial e exigem revisão de integração antes de ativar conteúdo.

Contrato v1: uma múltipla escolha por atividade sem mídia, competência única,
fontes CC BY 4.0, limiar de 80% e reforço de dois ciclos. Não altera IDs, progresso
nem o lote real. Auditoria e painel mostram pendências e cobertura estrutural;
não concedem aprovação humana. [Pipeline](CONTENT_PIPELINE.md) e
[evidência](evidence/2026-10-17-trilha-g3-contrato-editorial.md).

## Evidência e agenda por item — camada G4, 2026-10-17

`ItemReviewRepository` guarda tentativa confirmada e agenda em uma escrita no
store local `@radiant:item_review_v1`. A chave reúne lição, item e versão. O
registro guarda IDs, resultados estruturados, ajuda, faixa de duração e tempo;
não guarda alternativas escolhidas, prosa ou mídia. Escritores usam fila por
porta de storage; falta de leitura/schema conhecido impede escrita, preservando
os bytes originais. Duplicação conflitante é recusada e não é nova tentativa.

`ItemReviewCoordinator` resolve o payload atual e limita a sessão a 50 itens.
A migração aditiva importa até 50 lições por abertura, em um commit, sem converter
resultado agregado em evidência. Presença dos cartões é o cursor durável; versões
materiais não são equiparadas. O SM-2 puro compartilhado preserva a fórmula
existente. `SpacedRepetitionService` oferece o vencimento mínimo atual por lição
para trilha/push e conta itens para os contadores de missão/progresso. A vista
legada `getDueCards` continua uma leitura de cartões agregados por lição; a fila
ativa usa o coordenador por item.

`LessonFlowScreen` fornece ID/data estáveis; `LessonOutcomeService` evita repetir
rollups/recompensa de um commit já confirmado e só observa competências após
persistir evidência. `/review` confirma a escrita antes de avançar/premiar e
oferece retry em falha. A revisão ativa confirma alternativa antes do feedback;
a ajuda explícita é assistida. A projeção para `LearningEvidenceRepository`
mantém o erro inicial, e o cálculo de domínio não pontua acertos com ajuda. A revisão não promove retenção retardada automaticamente.

Limites: journal de 2 mil tentativas, 20 mil cartões e projeção de mil evidências;
sem cobertura nova de backup/sync ou snapshots V3/1.4. Avaliações mantêm seu
histórico próprio; sua projeção no journal está descrita abaixo. Sem ativação de adaptação,
V3 ou prova nativa. [Evidência](evidence/2026-10-17-trilha-g4-evidencia-e-revisao-por-item.md).

### Avaliações no journal — continuação de 2026-10-17

`AssessmentAttemptRepository` mantém a autoridade de aprovação/reforço, com
`journalStatus` pendente/confirmado no mesmo registro da avaliação. `submit`
confirma todos os itens numa escrita do journal; `getState` retoma projeção
pendente após reabrir. Histórico anterior sem marcador permanece legível e não
é importado implicitamente. Mesmo ID com outro material é recusado.

O modo `assessment` acrescenta competências atribuídas e sinal de erro crítico;
a projeção de evidência expande as competências e não pontua erro crítico como
acerto. Há um cartão por item, com versão, resolvido pelo checkpoint atual.
A porta nativa compartilhada preserva serialização entre as fachadas de escrita.
Não altera rollout do kernel, limiar de aprovação, reforço, vidas ou equivalência
entre versões. Os stores de XP/jornada/backup continuam separados.
[Evidências e limites](evidence/2026-10-17-trilha-g4-avaliacoes-no-journal.md).

### Resposta de revisão — continuação de 2026-10-17

`recordAnswer` corrige pelo catálogo atual; `ReviewCard` não envia booleano de
acerto. O journal confirma antes do feedback, registra `review-answer` e valida
vencimento/data anterior/ausência de tentativa anterior contra o cartão salvo.
Não persiste índice escolhido. A projeção de conteúdo promovido usa recuperação
independente sem ajuda e prática guiada ao consultar resposta; legado permanece
legado. `itemReviewTiming` fornece sinal temporal operacional, sem promoção a
`delayed-retention`. A adaptação continua sem ativação nova.
[Evidências](evidence/2026-10-17-trilha-g4-resposta-antes-do-gabarito.md).

## Fontes de verdade

| Tema | Documento |
| --- | --- |
| Estado operacional | [`STATUS.md`](STATUS.md) |
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

O registro histórico `production-batches.ts` fixa o hash do material já promovido;
não o recalcula ao importar uma edição do candidato. O teste importa esse registro
com material alterado e exige a recusa, protegendo a invalidade das decisões
anteriores no caminho real. Mudança futura exige novas aprovações explícitas.
