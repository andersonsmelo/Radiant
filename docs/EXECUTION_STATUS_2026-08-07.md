# Radiant — Execution Status (2026-08-07)

Este documento **substitui [`EXECUTION_STATUS_2026-08-06.md`](EXECUTION_STATUS_2026-08-06.md)**
como estado canônico.

Ele nasce por um motivo que vale ler antes do resto, porque é o defeito que o
dia inteiro girou em torno: o documento substituído afirmava, na seção "Aberto",
que "os seis itens da seção Aberto do documento substituído continuam abertos e
não foram reverificados". Um deles — a B4 — estava **concluída desde 2026-08-06
no roadmap**, com o Gate 2 em 5/5. O rótulo de "não reverificado" estava
escrito, foi lido, foi citado ao dono em voz alta, e mesmo assim o item virou um
menu de decisão. O dono escolheu. A escolha era vazia.

A lição, para quem escrever o próximo: **um rótulo de incerteza anota o texto e
não impede ninguém de usar o conteúdo como fato.** Uma seção herdada precisa
nomear, por item, onde a verificação seria feita — e a fronteira barata de
vigiar é o momento em que estado herdado vira pergunta a um humano ou vira
trabalho, não antes.

Os seis itens foram reverificados hoje, um a um, contra o **roadmap**, que é o
sistema de registro deles. A tabela está em "Situação real dos itens herdados".

## O que fechou em 2026-08-07

Quatro commits sobre `91445e4`, todos com run do Loop fechado no ritual completo
(`validate` → `step finish` → `memory write` → `run close`, com o `code` de cada
resposta conferido) e `declaredFiles` conferido contra os arquivos do commit.

| Commit | O quê |
| --- | --- |
| `27716f7` | O veredito da re-revisão da onda de correção, e a quinta armadilha do fechamento no `AGENTS.md` |
| `ca1cc59` | Pagamento repetível de XP em nó recusado — a quebra que a onda de correção introduziu |
| `ad79def` | O caso de teste de limpeza que não agendava nada, e portanto não media limpeza |
| `0c351dd` | As decisões do dono bancadas em documento, e a correção da seção "Aberto" |

### A re-revisão da onda voltou, e quase se perdeu

A re-revisão independente de `78d7f0d..91445e4` retornou **28 segundos depois**
de a sessão anterior escrever, num handoff, que ela "ainda não retornou" — e a
sessão morreu no limite de uso antes de alguém ler. O veredito ficou só dentro
do transcript JSONL. Foi recuperado de lá.

Duas regras saem disso, e valem para todo trabalho assíncrono deste projeto:

1. **Nunca registre o estado de um job em curso como afirmação num documento
   durável.** É o único tipo de afirmação cuja invalidação está garantida — o
   job vai terminar. Registre o **ponteiro de resolução**: onde a resposta vai
   aparecer e como reconhecê-la.
2. **Peça ao agente em segundo plano que grave o resultado em disco** e devolva
   o caminho. O contexto do controlador é o armazenamento menos durável da
   pilha: morre com limite de uso, com compactação, com o fim da janela.

O veredito em si: os seis achados confirmados por mutação, e **uma quebra nova
que a própria onda introduziu**.

### A quebra que a correção Crítica criou

`LessonFlowScreen.tsx:158` chama `LessonOutcomeService.recordCompletion` **antes**
de `markNodeCompleted`. O pagamento é decidido por
`rewarded = !completedNodeIds.includes(nodeId)` e `recordQuizCompletion` não
desduplica. Como a guarda nova impede o nó recusado de entrar em
`completedNodeIds`, o predicado nunca fecha: o mesmo deep link passou a pagar
XP, sequência e meta diária **todas as vezes**. Antes da guarda pagava uma só.

A causa é de forma, não de descuido. A varredura da correção original foi séria
e correu num eixo só — *quem chama a escrita que eu guardei*, com os cinco
caminhos enumerados e conferidos por um revisor independente. O eixo que faltou
foi o perpendicular: *o que mais escreve no mesmo call site, e quem dependia
desta escrita acontecer*. Quem dependia era o desduplicador do pagamento.

**A primeira forma de correção sugerida pela re-revisão estava errada.** Inverter
a ordem quebra todo o caminho feliz: com o nó já em `completedNodeIds`,
`rewarded` vira `false` e nenhuma conclusão legítima paga. O cabeçalho do próprio
`LessonOutcomeService` documenta a restrição. Regra que fica: **num achado de
revisão, o diagnóstico carrega a medição e a receita costuma ser uma frase
escrita de memória.** Herde a confiança do diagnóstico, nunca a da prescrição.

Corrigido pela segunda forma: `resolveNode` consulta o mesmo `isNodeUnlocked`,
antes do despacho por tipo, espelhando `markNodeCompleted`. Reavaliar o card e
gravar a tentativa continuam acontecendo na recusa — recusar pagamento não é
recusar informação.

Junto vieram duas coisas menores e instrutivas: a tela de checkpoint comemorava
uma conclusão recusada, e corrigir isso exigiu **reescrever o teste que fixava o
defeito** (ele afirmava a comemoração falsa e registrava em comentário que
"corrigir isso é outra decisão"); e o fixture `completedSnapshot` de
`CheckpointScreen.flow.test.tsx`, declarado `as any` sem campo `progress`, fazia
o **caminho feliz passar pelo `catch`**.

### Prova de mutação de 2026-08-07

| Ramo neutralizado | Teste que fica vermelho |
| --- | --- |
| Guarda `isNodeUnlocked` em `LessonOutcomeService.resolveNode` | `não premia um nó cuja regra de desbloqueio não está satisfeita` e `recusa todas as vezes, e não só a primeira` (2 vermelhos; as duas contraprovas seguem verdes) |
| Checagem do snapshot em `CheckpointScreen.handleComplete` | `markNodeCompleted authorization boundary › recusa o checkpoint bloqueado alcançado pela tela de checkpoint` |
| `return () => clearTimeout(timeout)` nos dois Interior screens, contra a forma **antiga** do teste | **2 vermelhos**, só os de desmontagem — os casos de "virada da preferência" seguiram **verdes com a limpeza morta** |
| O mesmo ramo, contra a forma **nova** | **4 vermelhos** — os dois de virada e os dois de desmontagem |

As duas últimas linhas são o mesmo experimento e existem juntas de propósito.
Reescrever um teste inerte e vê-lo verde prova que o teste novo funciona, **não**
que o antigo estava quebrado. Uma mutação aplicada às duas formas prova as duas.

## Decisões do dono, 2026-08-07

| Decisão | Resultado |
| --- | --- |
| `app_open` e a transição segundo-plano → primeiro-plano | **Fica conservador.** Abertura é lançamento de processo. O latch de processo é a forma final, não um estágio. Mudar isso agora é mudança de produto com ADR, não resolução de pendência |
| Task 6, Steps 5 e 6 — motor local | **Ollama, depois de liberar o órfão.** Pendente do dono: apagar `~/.lmstudio` e instalar o runtime |
| Fiação da cadeia de conteúdo | **Começar pelo brainstorming e plano.** Em andamento — ver a seção própria |
| B4 — harness de acessibilidade | Nada a decidir: a task fechou em 2026-08-06. Construir o harness segue possível como **upgrade opcional**, que fecharia o gatilho de reabertura e a B0 junto. Não iniciado |

## Situação real dos itens herdados

Reverificados contra o roadmap em 2026-08-07:

| Item | Estado |
| --- | --- |
| **F2** — opt-ins do closed test | **Aberto.** Humano, caminho crítico. 14 vinculadas, 2 participando; faltam ≥10 para o piso de 12, e só aí começam os 14 dias |
| **D1** — ADR da estratégia de API | **Aberto.** O ADR está escrito, aguardando a linha do decisor. Recomenda decidir **antes da E3** |
| **A5** — `eas submit` | **Aberto.** Um passo, humano: gerar a service-account key no Play Console |
| **B4** — acessibilidade em aparelho | **CONCLUÍDA em 2026-08-06**, pelo contrato unitário do `AppButton`, com ressalva escrita e gatilho de reabertura. **Gate 2 em 5/5**, F1 sem o último bloqueio |
| **B5** — E2E do nó de reward | **iOS `passed` em 2026-08-06; resta o Android.** Exige janela exclusiva de host, medida em horas e não em minutos |
| **Menores** | Dois dos três estavam descritos errado — abaixo |

### Os três menores, remedidos

**`checkHeuristics()` "sem fiação" está errado.** Ele é chamado no `useEffect` de
montagem de `HomeScreen.tsx:141`, desde `847a12d`, anterior ao documento que o
registrou como pendência. Quem o segura é `HEURISTICS_CONSTANTS.SHADOW_MODE:
true`. O item real é **decisão de produto** — desligar o shadow mode liga nudges
visíveis na home — e **continua em aberto**, aguardando o dono. Ao contrário do
`app_open`, não foi decidido.

**`.easignore` e os 856 MB: a premissa não se reproduz.** O repositório inteiro
tem **26,3 MB rastreados** (9,0 MB em `radiant-app`), e `.maestro/artifacts` —
os 439 MB de artefatos de E2E — já está ignorado na linha 47 do
`radiant-app/.gitignore`. Num upload baseado em git, um `.easignore` não mudaria
nada. **Não gaste a decisão de alargar `writePolicy.allowedRoots` nesta
premissa**; os 856 MB precisam ser remedidos num upload real do EAS antes de
qualquer coisa.

**`eyebrow` do `JourneyHero` a 2× de escala: real, e aberto.** O commit `a371641`
consertou o **balão de fala**, fixando a largura da coluna do personagem em
`PixelHeroSplit`. O eyebrow em si — caixa alta, `letterSpacing: 1`, dentro dessa
coluna de largura fixa que não cresce com `fontScale` — não foi tocado, e não há
teste de escala de fonte no componente.

## Fiação da cadeia de conteúdo — brainstorming EM ANDAMENTO

**Estado: Seção 1 do design apresentada, aguardando aprovação do dono. Seção 2
não apresentada. Nenhum spec escrito, nenhum código tocado.** O gate do
`superpowers:brainstorming` não foi vencido.

O levantamento, porém, está feito e **muda o enunciado do problema**. Vale mais
que o design em si, e é o que a próxima sessão deve herdar.

### A linha divide exatamente onde o plano começou

Varredura de ponto de entrada em todos os scripts de conteúdo:

| Entregue pelas Tasks 1–8 | Pré-existente |
| --- | --- |
| `anchor-lesson.py`, `build-manifest.py`, `calibration-report.py`, `destination-state.py`, `embed-excerpts.py`, `sampling-queue.py`, `validate-content-anchoring.mjs`, `validate-taxonomy-map.mjs` — **nenhum tem ponto de entrada** | `extract-source.py`, `generate-embeddings.py`, `promote-to-catalog.mjs`, `validate-foundation.mjs`, `validate-media-manifest.mjs` e os demais — **todos têm** |

Não falta "um leitor aqui e um produtor ali". O plano entregou uma
**biblioteca**; o pipeline anterior é **executável**.

### As pontas são quatro, não três, e a quarta não existe

**Ponta A — taxonomia. Fiação real, pequena.** `mapErrors` precisa de `map`,
`taxonomyIds` e `catalogIds`, e os três existem em disco:
`content-manifest/taxonomy-catalog-map.json` (16 entradas),
`Conteúdo/taxonomia/{estrelas,planetas,galaxias}.json` e
`Conteúdo/governança/catalog-payload.json`. Falta o ponto de entrada.

**Ponta B — manifesto de excertos. Fiação, média.** O `rightsClass` **tem**
produtor real, ao contrário do que o documento anterior dizia: o
`Conteúdo/fontes/library-catalog.json` classifica as 36 fontes —
17 `blocked`, 15 `reference-only` e **4 `authorized`**, todas com
`verbatim-excerpt` licenciado e arquivo presente em disco. O trabalho é dar
entrada a `build-manifest.py` e carregar a classe da fonte até o excerto.

**Ponta C — as `claims`. Não é fiação: não existe.** Os únicos lugares no
repositório que mencionam `claims` são os dois consumidores. Nada as produz.
`anchor_report` recebe claims **já com texto e vetor** e atribui o `excerptId`
por similaridade — ele ancora a afirmação, não a descobre. E
`ai-generate-formats.py` produz quizzes, revisões e checkpoints, não afirmações
ancoráveis. Sem produtor de claims, a maquinaria de ancoragem não tem entrada,
nunca. **É a ponta que sustenta as outras duas, e é a única que o documento
anterior não lista.**

**Ponta D — o validador.** `content-anchoring` roda `node --test` sobre dois
arquivos de teste. "11 validadores passaram" significa "os testes unitários
passam", não "o conteúdo está ancorado".

### O Ollama não bloqueia a cadeia

Medido: `generate-embeddings.py` usa `text-embedding-3-small` da OpenAI, e
`ai-generate-formats.py` usa Claude para narrativa e `gpt-4o-mini` para formatos
estruturados. Ambos remotos. E `anchoringErrors` **não olha similaridade** — só
excerto presente, pertencimento ao manifesto, `rightsClass` e hash —, então
nenhum limiar calibrado é necessário para fechar a cadeia. O motor local da
Task 6 é economia e privacidade, **não pré-requisito da fiação**.

### Decisões já tomadas dentro do brainstorming

| Pergunta | Decisão |
| --- | --- |
| O validador ligado a dado real leria zero aulas e passaria verde por vacuidade. O que fazer? | **Reprovar até existir dado.** Verde passa a significar "validei dados", nunca "não achei dados" |
| Mas isso trava todo `loop validate` até o dado existir. Como sair do impasse? | **A fiação produz o primeiro dado real.** Só então o validador estrito entra no `project.yaml`, já com o que validar |
| As claims não têm produtor. Por onde? | **Piloto com claims escritas à mão.** Uma aula, fonte autorizada, 5–10 afirmações humanas contra excertos reais. Zero capacidade nova de IA. O extrator por LLM fica para um plano seguinte, já com a cadeia viva para medi-lo contra |

### Onde parou, exatamente

A **Seção 1** do design foi apresentada e cobre: cada função pura ganha um runner
fino que carrega dado real, chama a função e sai não-zero em erro; os artefatos
que passam a existir em `content-manifest/` (`excerpts/`, `embeddings/`,
`lessons/*.claims.json`, `lessons/*.anchored.json`); e a decisão de que o
`rightsClass` viaja da fonte para o excerto no nascimento do excerto e nunca é
recalculado — com fontes não-`authorized` **não gerando linha**, em vez de
gerarem linha que o validador depois recusa. O piloto usaria
`library-source:ed36a480d512d69a` (INCA, mamografia, CC BY-NC-SA).

A pergunta feita ao dono, e ainda sem resposta: se filtrar os direitos na
**entrada** do manifesto está certo, sabendo que isso deixa o validador com um
ramo que, no dado real, nunca dispara.

A **Seção 2** — pontos de entrada, momento de o validador estrito entrar no
gate, e testes com prova de mutação — não foi apresentada.

## Aberto

**Decisões do dono, sem trabalho de engenharia pendente:**

1. **D1** — a linha do decisor no ADR da estratégia de API. Antes da E3.
2. **`checkHeuristics`** — ligar os nudges ou manter em shadow mode.
3. **Escopo da taxonomia** — os 16 nós seguem com `taxonomyId: null`. O mapa
   registra `ai-lesson:interacao-das-radiacoes-e-protecao-radiologica` ×
   `star-dose-radiacao` como candidato real **adiado**, com gatilho de
   reabertura escrito em prosa dentro do JSON — e prosa não dispara sozinha.
4. **Seção 1 do design da fiação** — aprovar, corrigir ou recusar.

**Ações que só o dono executa:**

5. **Apagar `~/.lmstudio`** — 8,7 GB de um modelo MLX órfão
   (`gemma-4-E4B-it-MLX-4bit`), sem runtime instalado em lugar nenhum. Leva o
   espaço livre de 15 GB para ~23,7 GB.
6. **Instalar o Ollama** — o plano fixa `127.0.0.1:11434`.
7. **F2** — os opt-ins do closed test. Caminho crítico; nenhum trabalho de
   engenharia o encurta.
8. **A5** — gerar a service-account key no Play Console.
9. **`.loop/project.yaml` aponta para o documento errado.** O `context.includes`
   lista `docs/EXECUTION_STATUS_2026-08-06.md`, que este documento substitui, e
   `.loop` **não está** em `writePolicy.allowedRoots` — nenhum agente consegue
   corrigir sem alargar a policy. Enquanto não for corrigido, toda sessão de
   cérebro carrega o estado superado como contexto.

**Engenharia, com host ou janela:**

10. **B5 Android** — janela exclusiva de host, horas. Não validar nem gerar
    durante o flow: mediu-se 2,3× de desaceleração no emulador sob carga
    concorrente, e o flow morre em timeout que parece defeito do app.
11. **Fiação da cadeia** — o brainstorming acima, retomando na Seção 1.
12. **Menor do `eyebrow`** — `fontScale` em `PixelHeroSplit`, com teste.
13. **Harness de acessibilidade no dev-tools** — upgrade opcional sobre a B4 já
    fechada; fecharia o gatilho de reabertura e a B0.

## Herdado, não reverificado

Todo o estado de preparação de lançamento — contas de desenvolvedor, TestFlight,
entitlement premium (ADR-2026-08-01), currículo v2, versões e matriz de
sign-off — está em [`EXECUTION_STATUS_2026-08-04.md`](EXECUTION_STATUS_2026-08-04.md)
e, antes dele, em [`EXECUTION_STATUS_2026-07-29.md`](EXECUTION_STATUS_2026-07-29.md).

**Onde reverificar, por item** — sem este ponteiro o rótulo transfere a dúvida
sem transferir o meio de resolvê-la, que foi o defeito que abriu este documento:
contas e TestFlight, no App Store Connect e no Play Console; entitlement
premium, no `ADR-2026-08-01` e em `PaywallService`; currículo v2, no
`catalog-payload.json` e no roadmap; versões e sign-off, no `app.json`, no
`eas.json` e na matriz do roadmap.
