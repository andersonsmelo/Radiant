# Radiant — Execution Status (2026-08-06)

Este documento **substitui [`EXECUTION_STATUS_2026-08-04.md`](EXECUTION_STATUS_2026-08-04.md)**
como estado canônico.

Ele nasce por um motivo estreito e específico: o documento substituído registra
a frente de **produção contínua de aulas** como "Task 4 reprovada na revisão,
tarefas 5 a 8 não começaram", e isso deixou de ser verdade no mesmo dia. Um
documento canônico que manda a próxima sessão executar trabalho já mesclado é
pior do que um documento silencioso — ele gasta uma sessão inteira antes de ser
desmentido. O ledger operacional do plano vive em
`.superpowers/sdd/<plano>/progress.md`, que é **ignorado pelo git**: quem clonar
o repositório vê só o que está versionado, e é por isso que este documento e a
seção de estado dentro do plano são os dois únicos lugares que contam.

Tudo que o documento substituído registra continua valendo e **não foi
reverificado aqui**, exceto a seção "Produção contínua de aulas", que esta
página corrige. Em particular, os seis itens da seção "Aberto" do documento
substituído (F2, D1, A5, B4, B5 e os menores) seguem como estavam: nenhum deles
foi tocado por este trabalho.

## Produção contínua de aulas — as nove tarefas fecharam, a fiação não

Todas as tarefas do plano
[`2026-08-06-producao-continua-de-aulas.md`](superpowers/plans/2026-08-06-producao-continua-de-aulas.md)
estão mescladas em `codex/wave1-hardening-api-smoke`. Cada linha abaixo foi
conferida com `git show`, não inferida:

| Tarefa | Commit | Estado |
| --- | --- | --- |
| 0 — policy `content-manifest/` | `afcb002` | concluída |
| 1 — manifesto de excertos | `299430f` | concluída |
| 2 — embeddings por excerto | `49a5597` | concluída, após 1 fix round |
| 2.5 — embrulho da transação | `581702c` | concluída |
| 3 — ancorador em modo registro | `872d5e5` | concluída |
| 4 — mapa entre grafos | `abef952`, corrigida em `23d23fa` | concluída, revisão limpa |
| 5 — validador `content-anchoring` | `d73962f`, corrigida em `c61bad7` | concluída, revisão limpa |
| 6 — motor local e calibração | `0a36fa1`, revisada em `3dd3ba0` | **Steps 1–4 concluídos; Steps 5 e 6 bloqueados** |
| 7 — classificação consulta o mapa | `a9ad1ce` | concluída |
| 8 — fila de amostragem humana | `740067f` | concluída |

Fora do plano, no mesmo intervalo: `521421f` editou os textos de decisão do mapa
por aprovação do dono; `592d0ca` e `0e2e9f1` corrigiram o handoff e a ordem do
ritual de memória no `AGENTS.md`.

A **revisão final de branch** rodou depois da Task 8 e encontrou dois achados
Críticos e cinco Importantes. Todos foram corrigidos numa onda única de fix,
`a39c37c`, detalhada na seção seguinte.

### O que a revisão final encontrou, e o que mudou

**A prova de mutação estava atestada em prosa e não era verificável.** A
"Definição de pronto" do plano afirmava quatro guardas provadas por mutação, mas
um dos testes casava a **contagem** de erros (`assert.equal(erros.length, 1)`) em
vez da mensagem. Com a guarda `if (!claim.excerptId)` neutralizada, a afirmação
caía no ramo seguinte, que também empurra um erro — a suíte seguia **5/5 verde
com a guarda morta**. O defeito foi reproduzido antes de ser fechado. Hoje toda
asserção de guarda casa a mensagem, e a varredura de mutação virou **tabela
versionada dentro do plano**: dez ramos, um por vez, sobre código já verde, com
o teste que fica vermelho nomeado em cada linha. Prosa decai em silêncio; tabela
é rechecável.

**Seis suítes Python não eram rodadas por nada.** O `loop validate` não tinha
validador para `.test.py`, e os workflows do GitHub só cobrem api e app — a
metade de ancoragem e manifesto do pipeline estava inteiramente fora do gate.
Entrou o validador **`content-python`**; o `loop validate` passou de 10 para
**11 validadores**.

**O formato do id de taxonomia estava indeciso.** `Conteúdo/taxonomia/estrelas.json`
usa a forma nua `star-<slug>`; os testes e o plano usavam `estrela:<slug>`. Nada
forçava a decisão porque os 16 `taxonomyId` seguem `null` e os conjuntos são
injetados nos testes. O plano ganhou Global Constraint pinando o formato, e as
fixtures foram alinhadas à fonte real.

Também corrigidos: `distribution` estourava `KeyError` com similaridade
negativa — e cosseno vive em `[-1, 1]`, exatamente a população crua que a leva de
calibração ia consumir; e `partition` recolhia numa lista só os dois estados que
`destination_state` acabara de separar, sem nenhum teste roteando um item
`unknown`.

### O que está bloqueado, e em quem

A Task 6 parou nos **Steps 5 e 6** porque **Ollama não está instalado nesta
máquina** — não há binário no `PATH` e nada responde em `127.0.0.1:11434`.
Instalar o runtime e baixar o modelo é decisão do dono do projeto.
`scripts/content/ai-generate-formats.py` segue **intocado de propósito** (último
commit a tocá-lo é `847a12d`, anterior a esta frente); nenhum stub foi deixado no
lugar.

O Step 6 ainda exige **janela exclusiva de host**, que disputa a máquina com a
B5 Android. A medição de 2026-08-06 registrada no documento substituído — 2,3× de
desaceleração no emulador sob carga concorrente — vale aqui igual: geração, E2E e
validação não rodam ao mesmo tempo neste host de 16 GB.

### O que existe, e o que ainda não está ligado

Esta é a parte que a "Definição de pronto" do plano não deixa ver, e é a que
governa o próximo plano. **Cada módulo entregue é função pura importada apenas
pelo próprio teste.** A cadeia não está fiada:

1. **O mapa não tem leitor.** `content-manifest/taxonomy-catalog-map.json` não é
   lido por nenhum código — nem pelo validador. O detector de deriva entre os
   dois grafos, portanto, não detecta deriva nenhuma.
2. **A ponte de classe de direitos não tem produtor.** O dicionário `allowed` de
   `anchor_report` e a `rightsClass` de `manifest_line` são fornecidos por quem
   chama, e não existe chamador. A regra crítica de segurança **"só `authorized`
   ancora"** está implementada e provada por mutação, mas nada a alimenta com
   dados reais.
3. **O validador `content-anchoring` valida testes, não dados.** Ele roda
   `node --test`. "11 validadores passaram" significa "os testes unitários
   passam", **não** "o conteúdo está ancorado".

Ligar as três coisas é trabalho do próximo plano e está declarado fora de escopo
deste, na seção "O que este plano não faz". Nada aqui deve ser lido como conteúdo
verificado: o que existe é o andaime, provado peça a peça.

## Onda de correção da revisão de 40 commits (2026-08-07)

Uma revisão de 40 commits que entraram sem revisão devolveu uma Crítica e cinco
Importantes. Todas foram corrigidas numa onda só, na mesma branch. Nada aqui
altera o estado de M1 nem o das tasks abertas — é dívida de correção, não avanço
de marco.

**Crítica — a autorização de conquista não fechava a fronteira.** Um commit
anterior afirmava impedir que uma conquista bloqueada fosse coletada por deep
link, e pôs a guarda na TELA de recompensa. A escrita seguia desguarnecida:
`JourneyProgressService.markNodeCompleted` validava apenas que o nó EXISTE
(`findNode`), nunca seu status nem sua `unlockRule`. Três caminhos chegavam à
escrita sem passar pela tela — `/learn` repassa `params.nodeId` verbatim de
`src/app/learn.tsx` até `LessonFlowScreen`, `CheckpointScreen` filtra por tipo e
não por status, e o serviço é público. O deep link
`radiantapp://learn?nodeId=<reward bloqueado>&blockId=<bloco de lição real>`
gravava a conquista da unidade em `completedNodeIds` e emitia `reward_awarded`.

A autorização passou para onde a escrita acontece. A régua é a `unlockRule`
derivada por `JourneyRecommendationService` — não uma cópia da regra, e não o
status cru: um nó de revisão fora da fila do dia lê como `locked` sem estar
bloqueado, e recusá-lo quebraria a conclusão de revisão, que é legítima. As
guardas de tela ficaram, agora como defesa em profundidade real.
`JourneyNodeCompletionGuard.test.tsx` alcança a guarda pelos três caminhos, e
cada um foi verificado vermelho com a guarda removida, falhando na escrita
persistida — não no log.

**Importantes.** (1) O `assertNotVisible` de `reward-locked.yaml` não podia
falhar por um `?` sem escape, e o contrato **exigia** a forma quebrada; o
contrato passou a afirmar a propriedade e a varredura cobre as quatro chaves de
seletor em todos os flows. (2) O teste da guarda de recompensa nunca apertava
nada; a decisão virou função (`canCollectReward`), invocável, e apagá-la fica
vermelho. (3) A régua de visibilidade de `lesson-option-q1:option:1` divergia
entre flows (100 × 80 no mesmo elemento da mesma tela); as três foram para o
valor medido, com contrato de régua única. (4) O gate de reduced motion podia
perder a corrida — a preferência resolve assíncrona e as cascatas de entrada
(`index * 80`, `index * 60`) agendavam na primeira passada — e vazava timeout
sem limpeza; o hook ganhou estado indeterminado, as duas telas passaram a adiar
até saber, e as duas ganharam teste. (5) `app_open` significava "o componente da
home montou", e a home remonta a cada `router.replace('/(tabs)')` de lição
concluída — o gate de `MIN_APP_OPENS = 3` do prompt de avaliação abria antes da
hora; a trava virou de processo.

> **Decisão de produto deixada em aberto, de propósito.** Contar
> `background → foreground` como abertura define o que é uma sessão para o gate
> da loja e **pode tornar o gate mais fácil** do que é hoje. Sem essa decisão,
> vale a leitura conservadora: abertura é lançamento de processo. O
> `rating-prompt.yaml` continua alcançando o gate — três `launchApp`, três
> processos.

## Aberto

Os seis itens da seção "Aberto" do documento substituído continuam abertos e não
foram reverificados. Acrescenta-se a eles, desta frente:

1. **Task 6, Steps 5 e 6** — bloqueados no dono: instalar Ollama e conceder a
   janela exclusiva de host. Enquanto isso não acontece, não há limiar
   calibrado, e sem limiar a reprovação automática não liga.
2. **Fiação da cadeia** — os três pontos da seção anterior. É o primeiro
   trabalho do próximo plano, não deste.
3. **Escopo da taxonomia** — os 16 nós seguem com `taxonomyId: null`. O plano
   **produz** a lista que a decisão precisa; a decisão é do dono. Registrado no
   mapa: `ai-lesson:interacao-das-radiacoes-e-protecao-radiologica` ×
   `star-dose-radiacao` é candidato real **adiado**, com gatilho de reabertura
   escrito em prosa dentro do JSON — e prosa não dispara sozinha.

## Herdado, não reverificado

Todo o estado de preparação de lançamento — contas de desenvolvedor, TestFlight,
entitlement premium (ADR-2026-08-01), currículo v2, versões e matriz de sign-off —
está em [`EXECUTION_STATUS_2026-08-04.md`](EXECUTION_STATUS_2026-08-04.md) e, antes
dele, em [`EXECUTION_STATUS_2026-07-29.md`](EXECUTION_STATUS_2026-07-29.md). Nada
ali foi tocado por este trabalho.

## Atualização de 2026-08-07

### A re-revisão da onda de correção retornou, e encontrou uma quebra nova

A re-revisão independente da onda `78d7f0d..91445e4` **fechou**. Ela confirmou os
seis achados por mutação — um ramo por vez, sobre código já verde, numa cópia
fora do checkout — e a tabela dela bate com a do relatório da onda em todas as
linhas comparáveis.

E encontrou um defeito **que a onda introduziu**, verificado de novo aqui contra
o código antes de ser escrito nesta página:

**Importante — pagamento repetível de XP em nó recusado.**
[`LessonFlowScreen.tsx:158`](../radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx)
chama `LessonOutcomeService.recordCompletion` **antes** de `markNodeCompleted`.
O pagamento é decidido por `rewarded = !completedNodeIds.includes(nodeId)`
(`LessonOutcomeService.resolveNode`) e `GamificationService.recordQuizCompletion`
não desduplica. Como a guarda nova impede o nó recusado de entrar em
`completedNodeIds`, o mesmo deep link paga XP, sequência e meta diária **todas as
vezes**; antes da correção pagava uma vez só. A conquista não vaza — a guarda
segura o que se propôs a segurar —, mas a correção converteu um vazamento único
em ilimitado. Medido pela re-revisão executando o deep link três vezes contra os
serviços reais: `completedNodeIds` limpo, `recordQuizCompletion` chamado 3×.

A causa é de forma, não de descuido: o princípio da correção Crítica — "a
autorização mora onde a escrita acontece" — foi aplicado a **uma** das duas
escritas do mesmo fluxo. A varredura enumerou exaustivamente os cinco caminhos
que chegam à escrita guardada e não perguntou o que mais escreve no mesmo call
site.

**Atenção ao aplicar a correção:** a re-revisão oferece duas formas e **a
primeira está errada**. Inverter a ordem para `markNodeCompleted` antes de
`recordCompletion` quebra todo o caminho feliz — com o nó já em
`completedNodeIds`, `rewarded` vira `false` e nenhuma conclusão legítima paga.
O cabeçalho do próprio `LessonOutcomeService` documenta a restrição de ordem. A
forma correta é a segunda: o caminho de pagamento consulta o mesmo predicado
`isNodeUnlocked`.

**Menor — celebração em conclusão recusada.**
[`CheckpointScreen.tsx:163`](../radiant-app/src/features/checkpoint/screens/CheckpointScreen.tsx)
chama `setCompleted(true)` incondicionalmente depois do serviço, então um
checkpoint recusado ainda exibe "CONQUISTA DESBLOQUEADA". Só por deep link, sem
dano a dado. Antes da correção a celebração era verdadeira porque a escrita
acontecia; agora é mentira.

**Menor — teste que não pode falhar.** Em `PlanetInteriorScreen.test.tsx:135` e
no equivalente de `GalaxyInteriorScreen`, o caso "não deixa o timeout sobreviver
à virada da preferência" começa com `resolved: false`, então nada chegou a ser
agendado e a remoção do `clearTimeout` não o derruba. O requisito de limpeza
segue coberto pelo teste de desmontagem; este caso duplica o do gate.

**Pré-existente, não introduzido aqui:** `buildInitialProgress`
(`JourneyProgressService.ts:302`) semeia `completedNodeIds` a partir de
`SpacedRepetitionService.getTrackedLessonIds()` sem checar a cadeia. Se o
progresso de uma trilha for reconstruído depois de lições estudadas por
`radiantapp://quiz?lessonId=…`, um nó de última lição pode satisfazer a regra de
desbloqueio do reward sem o checkpoint. Estreito e multi-passo, mas é o caminho
que resta para satisfazer a regra sem estudo.

### Pendências abertas em 2026-08-07

- **`app_open` e a transição segundo-plano → primeiro-plano: decisão de produto
  em aberto.** A correção entregou a versão conservadora (latch de processo: N
  lançamentos do processo → N eventos; remontagem → nenhum evento extra). A
  re-revisão confirmou que o gate lê `countEvents('app_open')` do store
  persistido, então a contagem hoje é estritamente ≤ a de antes — o gate **não**
  ficou mais fácil de abrir. Contar o retorno do segundo plano definiria o que é
  uma sessão para o gate de avaliação da loja e poderia afrouxá-lo. Não
  implementado de propósito.

- **Task 6, Steps 5 e 6 — o bloqueio tem número.** Medido em 2026-08-07: Apple
  M5, 16 GB de RAM, 10 núcleos, macOS 27.0, **15 GB livres de 460 GB**. O
  gargalo é disco antes de memória: um modelo 7–9B quantizado em Q4 ocupa ~5 GB
  e cabe; 12–14B em Q4 ocupa ~8–9 GB e deixa o sistema no limite. O plano fixa
  `127.0.0.1:11434`, porta do Ollama, que **não está instalado** (sem binário no
  `PATH`, sem `/Applications/Ollama.app`). Há 6,4 GB de pesos em
  `~/.lmstudio/models`, mas o app do LM Studio não está em `/Applications` nem
  em `~/Applications` e nada responde em 1234 — antes de escolher o runtime,
  vale conferir o que esses 6,4 GB são e se ainda servem. Manter dois runtimes
  com cópias dos mesmos pesos não cabe no espaço livre.

- **Acesso a `~/Documents`: restaurado.** Foi revogado pelo macOS em 2026-08-07,
  no meio de uma sessão, e derrubou o validador `brain-links` — logo, todo
  fechamento de run. Está lendo normalmente desde então. A armadilha e o
  diagnóstico de um comando ficaram registrados em `AGENTS.md`, na lista de
  armadilhas do fechamento, porque o sintoma (`INTERNAL_ERROR` com `data`
  vazio) não aponta para a causa.

- **Um resultado de agente em segundo plano quase se perdeu.** A re-revisão
  acima retornou 28 segundos depois de a sessão anterior escrever, num handoff,
  que ela "ainda não retornou"; a sessão então terminou por limite de uso e o
  veredito ficou só no transcript. Ao despachar verificação em segundo plano,
  peça ao agente que **grave o resultado em disco** e registre no handoff onde
  ele vai aparecer, em vez do estado de espera.
