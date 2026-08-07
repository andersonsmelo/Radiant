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

Duas ondas. A primeira, sobre `91445e4`, fechou a re-revisão da onda de correção.
A segunda, sobre `9681db6`, tirou a fiação da cadeia de conteúdo do brainstorming
e entregou quatro das seis tasks do plano.

Todos os runs fecharam no ritual completo (`validate` → `step finish` →
`memory write` → `run close`, com o `code` de cada resposta conferido
separadamente) e `declaredFiles` conferido contra os arquivos do commit — com
**uma exceção declarada**, o `1a815f4`, explicada abaixo.

### Primeira onda — a re-revisão

| Commit | O quê |
| --- | --- |
| `27716f7` | O veredito da re-revisão da onda de correção, e a quinta armadilha do fechamento no `AGENTS.md` |
| `ca1cc59` | Pagamento repetível de XP em nó recusado — a quebra que a onda de correção introduziu |
| `ad79def` | O caso de teste de limpeza que não agendava nada, e portanto não media limpeza |
| `0c351dd` | As decisões do dono bancadas em documento, e a correção da seção "Aberto" |

### Segunda onda — a fiação da cadeia

| Commit | O quê |
| --- | --- |
| `6b4f8c1` | Spec do design, com as Seções 1 e 2 aprovadas pelo dono |
| `88eb50e` | Plano de implementação, seis tasks |
| `90d4432` | **Task 1** — ponto de entrada do validador de mapa de taxonomia |
| `7315072` | **Task 2** — manifesto de excertos com filtro de direitos na entrada |
| `6f1e7cf` | Correção do plano: a extração rodava dentro da janela do run |
| `53b6a89` | `.loop/project.yaml` — ponteiro de status vencido e extrações fora do escopo vigiado |
| `738b113` | Reestruturação: a cadeia fecha sem motor de embedding |
| `7006d9c` | **Task 4** — as 8 claims do piloto, escritas à mão |
| `b76c30b` | Task 4, rodada 1: testes restaurados e claims sem ancoragem fiel corrigidas |
| `97c01d2` | Task 4, rodada 2: a paráfrase que tinha sido realocada em vez de removida |
| `1a815f4` | **Task 5** — ancoragem por resolução de hash. Entrou **não revisada**; revisada em 2026-08-07, ver abaixo |
| `cb795e1` | **Task 6** — o validador estrito de ancoragem entra no gate. **A cadeia fecha** |

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
| Fiação da cadeia de conteúdo | **Começar pelo brainstorming e plano.** Feito: spec e plano commitados, 4 de 6 tasks entregues |
| Seção 1 do design — onde o `rightsClass` filtra | **Na entrada, com relatório de descarte.** Fonte não-`authorized` não gera linha; `descartes.json` registra quem caiu e por quê |
| Motor de IA na cadeia de conteúdo | **Rodar somente local.** E como não há motor local instalado, a cadeia fechou **sem motor nenhum** — o validador nunca leu um vetor |
| Aula do piloto | **`ai-lesson:qualidade-de-imagem`**, entre os 16 nós `ai-lesson:`. Nenhum é de mamografia; este é o mais próximo |
| `.loop/project.yaml` | **Corrigir os dois pontos** — ponteiro de status e escopo das extrações. Feito em `53b6a89` |
| Task 5 interrompida, verde e sem commit | **Commitar como não revisada**, com a lacuna declarada na mensagem e no status |
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

## Fiação da cadeia de conteúdo — FECHADA, 5 das 6 tasks entregues

**Estado: spec aprovado e commitado, plano escrito, Tasks 1, 2, 4, 5 e 6
entregues, e a Task 5 revisada. A única não entregue é a Task 3 (embeddings),
adiada por decisão do dono.** A cadeia roda ponta a ponta em dado real e o
validador estrito está no gate. O gate do `superpowers:brainstorming` foi vencido
em 2026-08-07; o do `superpowers:writing-plans` também.

A cadeia viva, em um comando por elo — extrair → manifesto → claims → ancorar →
validar. O último elo é o que o `loop validate` executa a cada run, como
`content-anchoring-data`:

```bash
node scripts/content/validate-content-anchoring.mjs
```

- Spec: [`docs/superpowers/specs/2026-08-07-fiacao-cadeia-conteudo-design.md`](superpowers/specs/2026-08-07-fiacao-cadeia-conteudo-design.md)
- Plano: [`docs/superpowers/plans/2026-08-07-fiacao-cadeia-conteudo.md`](superpowers/plans/2026-08-07-fiacao-cadeia-conteudo.md)

### As decisões que fecharam o desenho

| Pergunta | Decisão |
| --- | --- |
| Onde o `rightsClass` filtra o manifesto? | **Na entrada, com relatório de descarte.** Fonte não-`authorized` não gera linha |
| O validador leria zero aulas e passaria verde por vacuidade | **Reprovar até existir dado.** Verde significa "validei dados" |
| As claims não têm produtor | **Piloto com claims escritas à mão**, sobre a fonte INCA |
| Qual nó do catálogo o piloto ancora? | **`ai-lesson:qualidade-de-imagem`** — nenhum dos 16 nós é de mamografia, e este é o mais próximo |
| Sem motor de embedding local, a cadeia para? | **Não.** Ver a seção própria abaixo |

A pergunta sobre filtrar na entrada foi respondida com a premissa remedida contra
o código: o ramo `rightsClass !== 'authorized'` do validador realmente fica
inalcançável no dado real, mas **a proteção não some — ela troca de nome**. A
condição passa a cair no ramo anterior, `excerto fora do manifesto`, e o ramo
original continua provado por mutação com fixture sintético. A escolha não era
entre ter e não ter a guarda; era sobre qual mensagem nomeia a causa.

### A cadeia fecha sem motor de embedding

Decisão do dono no meio da execução: **rodar somente local.** Medido na máquina
no mesmo dia — `ollama` não instalado, nada em `127.0.0.1:11434`, sem `torch`
nem `sentence-transformers`, e o `lms` do LM Studio responde *"daemon is not
running and no valid installation could be found"*. O modelo de 8,7 GB em
`~/.lmstudio` é `gemma-4-E4B-it`, um instruct — não serviria como embedder nem
com runtime.

Isso não bloqueou nada, porque **`anchoringErrors` nunca lê um vetor**. Ele checa
`excerptId` presente, pertencimento ao manifesto, `rightsClass` e hash.
Similaridade não entra em nenhuma das quatro. Os embeddings serviam só para
`anchor_report` **descobrir** a âncora — e num piloto de 8 claims escritas à mão,
quem lê os excertos atribui o `excerptId` melhor que o cosseno.

**Task 3 (embeddings) fica adiada.** `embed-excerpts.py` e `anchor_report`
seguem funções puras com testes, sem ponto de entrada, até existir motor local.

### O que a cadeia produziu, em dado real

**Os números desta seção envelheceram em menos de um dia** — a correção do
extrator, mais abaixo, levou o manifesto de 296 para 282 linhas na mesma data.
Ficou a lição que este documento já aplicava aos commits e não aplicava aqui:
**contagem corrente não vai para documento durável; vai o comando que a mede.**
Os dois comandos abaixo reproduzem a tabela inteira a qualquer momento, e são os
mesmos que o `loop validate` executa:

```bash
node scripts/content/validate-content-anchoring.mjs && node scripts/content/validate-no-verbatim.mjs
```

| Artefato | O que é, com o número **medido em 2026-08-07 e sujeito a envelhecer** |
| --- | --- |
| `content-manifest/excerpts/manifest.jsonl` | Ponteiro e hash por excerto citável — nunca o texto. 282 linhas, todas `authorized`, todas do piloto INCA |
| `content-manifest/excerpts/descartes.json` | Quem ficou de fora e por quê. 109 descartes, todos de `library-source:f375049d4e936d05` (`blocked`), com o motivo nomeando a classe |
| `content-manifest/lessons/ai-lesson-qualidade-de-imagem.claims.json` | **8 claims** humanas, cada uma com seu `excerptId` |
| `content-manifest/lessons/ai-lesson-qualidade-de-imagem.anchored.json` | 8 claims, **`unanchored: 0`** |
| Validador de taxonomia, contra o dado real | 16 entradas de mapa, 15 ids de taxonomia, 18 de catálogo, **zero erros** |

391 excertos foram lidos para produzir as 282 linhas. Os 109 que sobraram são a
fonte `blocked` que já estava extraída em disco — e o descarte deles é o teste de
aceitação da decisão de filtrar na entrada. **A extração dessa fonte `blocked`
não foi regerada de propósito**, pelo motivo descrito no item 1 de "Aberto": os
arquivos dela estão rastreados em git, fora de `writePolicy.allowedRoots`, e
mexer neles é decisão do dono.

### O extrator emitia órfão no fim da página, e a D4 já tinha visto isso

A triagem editorial da **D4** registrou em 2026-08-03 um achado lateral: *4 dos
30 excertos problemáticos eram defeito de extração, não de classificação.* O
achado ficou lá, sem dono, porque a D4 inteira depende de uma decisão de
taxonomia. Medido na cadeia viva em 2026-08-07, o mesmo defeito estava dentro do
piloto.

**A causa não era o divisor de frases.** `chunk_text` enche gulosamente até o
teto e emite o resto **incondicionalmente, sem piso**: toda página de
`k × max_chars + ε` produzia um órfão de tamanho ε.

| Medida, antes da correção | Valor |
| --- | --- |
| Excertos extraídos da fonte do piloto | 405 |
| Abaixo de 80 caracteres | 19 |
| Deles, que eram o **último** pedaço da página | **19 de 19** |
| Deles, único pedaço da página (página curta de verdade) | 1 |
| Claims do piloto ancoradas num deles | **0 de 8** |

O caso mais limpo: a página 33 tem 1401 caracteres e virava `[1398, 3]` — um
excerto de **três caracteres**.

Corrigido reencostando o resto no pedaço anterior, de onde ele veio. Depois:
**282 excertos, 1 toco** — e o que sobrou é a página 181, o colofão, que é uma
página curta inteira e não artefato. A aula ancorada saiu **byte a byte
idêntica**, confirmando por outro caminho a medição de raio de alcance.

**Por que agora e não depois:** os tocos eram inertes porque quem escolheu os
`excerptId` à mão os evitou. Quando a **Task 3** entrar e a ancoragem virar
similaridade, o cosseno **não** vai evitá-los — texto curto produz similaridade
ruidosa e alta, e eles seriam as primeiras âncoras alcançadas.

Achado lateral do achado: **`extract-source.test.py` existia e não estava no
validador `content-python`.** Seus testes nunca haviam rodado no gate. Entrou
agora, com `skipUnless` no caso que lê PDF — sem essa guarda, o `loop validate`
do projeto inteiro passaria a depender de material fora do versionamento, e o
skip **declara** a ausência, porque um caso que não rodou não pode parecer um que
passou.

### A lacuna da Task 5 foi paga: a revisão rodou, e achou uma coisa

O commit `1a815f4` entrou na branch **sem revisão** — o implementador foi
interrompido durante o `loop validate`, com zero validadores concluídos, e o
controlador fechou o run (`validating → closed`) para liberar o lock de escritor.
A dívida foi paga em 2026-08-07, antes de a Task 6 começar. A prova de mutação do
Step 7 do plano rodou, e o resultado foi comparado item a item com o previsto:

| Mutação | Previsto pelo plano | Observado |
| --- | --- | --- |
| `if hash_vigente is None:` → `if False:` | 1 vermelho, `test_excerto_fora_do_manifesto_conta_como_nao_ancorado` | **Confere.** 1 vermelho, e na asserção certa (`unanchored`, não `hash`) |
| `load_allowed` devolvendo `{}` | **2** vermelhos | **Diverge: 1.** Só `test_allowed_liga_id_ao_hash_do_manifesto` |
| `main()` → `return 0` fixo (**não estava no plano**) | — | **Zero vermelhos. Os 11 seguem verdes** |

As duas divergências são a mesma coisa vista de dois ângulos, e a segunda é o
achado real. `test_carimba_o_hash_vigente_do_manifesto` não fica vermelho porque
ele injeta o `allowed` como literal no próprio caso e **nunca chama
`load_allowed`** — a mutação não podia alcançá-lo. A composição
`load_allowed → resolve_anchors`, que é exatamente o que o `main()` faz, não tem
teste nenhum. E a terceira passada mede a consequência: **o código de saída do
runner da Task 5 não é mordido por teste algum.** Ele pode declarar sucesso sobre
uma aula não ancorada e a suíte inteira fica verde.

Isso **não** é defeito de comportamento — o runner está correto no dado real,
verificado nesta revisão: `unanchored: 0`, saída 0, e o artefato commitado é
**byte a byte idêntico** ao que o runner reproduz hoje, o que prova que ele é
saída de máquina e não arquivo escrito à mão. É lacuna de regressão, e está na
lista de "Aberto" abaixo com o teste que a fecha.

O resto do que se sabia se confirmou: 11 testes verdes, diff puramente aditivo,
`cosine`, `best_anchor` e `anchor_report` intactos.

**Lição, e ela generaliza para todo runner deste repositório:** cobertura de
função pura não se propaga para o invólucro que a chama. O valor que o processo
devolve é a única superfície pela qual o gate decide, e é a mais fácil de deixar
sem teste justamente por parecer trivial. A prova de mutação de um runner inclui
o **retorno do ponto de entrada**, não só os ramos das funções que ele chama.

### A Task 6 fechou a cadeia, e a ordem foi respeitada

O commit `cb795e1` deu `main()` ao `validate-content-anchoring.mjs` e **só então**
pôs o validador no `.loop/project.yaml`, como `content-anchoring-data`. A ordem
não era negociável: o validador rodou **fora** do gate contra o dado real
primeiro — 1 aula, 296 excertos, `porAula` vazio, saída 0 — porque um validador
que reprova, posto no gate, trava `loop validate` para todas as IAs do projeto.

Ausência de dado reprova: com zero aulas ancoradas, `main()` devolve 1. Verde só
pode significar "validei dados"; um validador que passa por vacuidade mente para
o gate exatamente enquanto a cadeia estiver quebrada, que é quando ele precisaria
falar.

Duas provas de mutação, previsto e observado conferidos:

| Mutação | Observado |
| --- | --- |
| `if (aulas.length === 0)` → `if (false)` | **1 vermelho de 8**, o da aula ausente. Os outros sete verdes |
| `return total === 0 ? 0 : 1` → `return 0` | **1 vermelho de 8**, o do hash divergente |

A segunda passada não estava no plano. Ela entrou porque a revisão da Task 5,
feita imediatamente antes, mediu a lacuna descrita acima — e o achado de uma task
virou instrumento na task seguinte. Aqui o retorno **é** mordido: a Task 6 não
herda o defeito da Task 5.

O validador `content-anchoring` existente **fica**. Ele roda `node --test` sobre
os testes unitários; o novo roda o validador contra o dado em disco. Os dois
medem coisas diferentes, e o `loop validate` desta entrega executou os **12**
validadores com `passed`, o novo entre eles.

### O eixo comercial dos direitos — RESOLVIDO ainda em 2026-08-07

**A seção abaixo descreve o problema como ele foi diagnosticado, e ela está
correta no diagnóstico e errada na conclusão.** O item foi fechado no mesmo dia
pelo [ADR de proveniência sem citação](adr/ADR-2026-08-07-proveniencia-sem-citacao.md),
e o motivo é que a premissa da pergunta nunca tinha sido verificada: **a cadeia
não embarca verbatim em lugar nenhum.** `manifest.jsonl` guarda ponteiro e hash,
`.anchored.json` guarda claim original mais ponteiro e hash, e o texto das fontes
só existe em `Conteúdo/extrações/`, fora do git. A decisão escalada era sobre uma
capacidade que o sistema não exerce.

Três coisas mudaram junto, e as três estão no gate:

- o código passa a ler **`allowedUses`**, não `commercialUse`. Ancorar exige
  `factual-reference`, checado no filtro de entrada e em `anchoringErrors`;
- o validador `content-no-verbatim` reprova artefato rastreado que carregue texto
  de fonte, por contrato de chaves, coincidência de hash e substring contra o
  material bruto. Rodado contra o dado real: 296 excertos, 405 textos lidos, zero
  erros — **as 8 claims do piloto não são cópia literal**, o que dá conferência de
  máquina à regra da Task 4 que só tinha conferência humana;
- conferido **na fonte primária**, e não no nosso próprio catálogo: o
  `commercialUse: false` do INCA *Mamografia: da prática ao controle* é precaução
  nossa. A página 3 da obra diz apenas *"É permitida a reprodução total ou parcial
  desta obra, desde que citada a fonte"* — sem cláusula não-comercial. E a fonte
  do piloto é CC BY-NC-**SA** 4.0: o *Compartilha Igual* é a restrição mais afiada
  das quatro, e ninguém a tinha nomeado. Ele não morde referência factual; morde
  adaptação.

**A frase "se a resposta for não, a cadeia inteira precisa de fontes diferentes"
não se sustenta.** As fontes servem para o que a cadeia faz.

O texto original do diagnóstico segue abaixo, porque a medição que ele carrega
continua válida e é o que sustenta o ADR.

Medido em 2026-08-07 e registrado no spec: o código consulta um único campo do
registro de direitos, `rightsClass`, e a mensagem de erro fala em "autorização de
direitos" — o assunto inteiro. O catálogo registra **dois** eixos. As quatro
fontes `authorized` têm **todas `commercialUse: false`** (CC BY-NC-SA 4.0,
CC BY-NC 4.0, "vedados venda e fins comerciais", "reprodução com citação"), e
`commercialUse` **não tem um único leitor a jusante**: é validado na escrita do
catálogo e nunca mais lido.

Não bloqueia a cadeia. Bloqueia *embarcar* excerto verbatim num app com
entitlement premium (ADR-2026-08-01). **É decisão do dono, com contorno
jurídico, e está em aberto.**

### Três defeitos de processo que esta onda pagou

1. **A extração rodava dentro da janela do run.** `Conteúdo/extrações/` está fora
   do git mas **`.gitignore` não é `context.excludes`** — são listas
   independentes, e o guarda de escopo compara o repositório inteiro contra a
   baseline da abertura. `step finish` devolveu `OUT_OF_SCOPE_CHANGE`, o run caiu
   em `needs_human` e prendeu o lock. De `needs_human` **não existe transição
   para `memory_written`**: o aprendizado daquele run se perdeu e teve de ser
   regravado noutro. Corrigido no plano e no `project.yaml`.
2. **Um palpite viajou dentro do bloco reservado ao que foi verificado.** O
   despacho de um subagente afirmava que um arquivo de teste "provavelmente não
   existe ainda". Ele existia, com quatro testes verdes — entre eles a guarda de
   que excerto não autorizado nunca vira âncora. O subagente obedeceu e os
   apagou; a revisão pegou. Incerteza não pode compartilhar canal com "eu
   conferi".
3. **Existência não é conteúdo.** O spec afirmava que `catalogIds` vinha de
   `catalog-payload.json`, herdado do documento anterior. A conferência feita foi
   `ls` no caminho. O arquivo existe e não tem **nenhum** id `ai-lesson:` — os 16
   vivem em `wave-1-priority-tracks.json`. Corrigido no spec e no plano.

## Aberto

**Esta lista é um recorte, e o recorte é: a frente de trabalho viva mais o que
espera decisão do dono.** Ela **não** é o inventário do lançamento. O registro
completo do backlog é o roadmap, e há P0 abertos lá que não aparecem aqui —
`E3` (privacy labels e data safety, que depende do `D1`), `E4` (classificação
etária), `D4` (gate editorial, que não bloqueia o closed test e bloqueia a
produção) e `F3`–`F5`, além de `C4`–`C6` e `D6`. Quem quiser a conta completa
lê o roadmap:

```bash
grep -n '^- \*\*[A-F][0-9]' docs/plans/2026-07-27-radiant-launch-roadmap.md
```

Esta frase existe porque uma lista curada e uma lista exaustiva têm a mesma
aparência: a ausência de um item é indistinguível da inexistência dele, e o
recorte é a única informação que o leitor não consegue recuperar olhando para a
lista.

**Decisões do dono, sem trabalho de engenharia pendente:**

1. **D1** — a linha do decisor no ADR da estratégia de API. Antes da E3.
2. **`checkHeuristics`** — ligar os nudges ou manter em shadow mode.
3. **Escopo da taxonomia** — os 16 nós seguem com `taxonomyId: null`. O mapa
   registra `ai-lesson:interacao-das-radiacoes-e-protecao-radiologica` ×
   `star-dose-radiacao` como candidato real **adiado**, com gatilho de
   reabertura escrito em prosa dentro do JSON — e prosa não dispara sozinha.

**Ações que só o dono executa:**

4. **Apagar `~/.lmstudio`** — 8,7 GB de um modelo MLX órfão
   (`gemma-4-E4B-it-MLX-4bit`). Confirmado em 2026-08-07 pelo próprio `lms`:
   *"daemon is not running and no valid installation could be found"*. Leva o
   espaço livre de 15 GB para ~23,7 GB.
5. **Instalar o Ollama e um modelo de embedding.** O plano fixa
   `127.0.0.1:11434`. **Já não bloqueia a cadeia de conteúdo** — a fiação fechou
   sem motor. Desbloqueia a Task 3 (embeddings) e a ancoragem por similaridade.
6. **F2** — os opt-ins do closed test. Caminho crítico; nenhum trabalho de
   engenharia o encurta.
7. **A5** — gerar a service-account key no Play Console.
8. **Enviar o pedido de autorização ao INCA.** Rascunho pronto em
   [`docs/content/2026-08-07-pedido-de-autorizacao-inca.md`](content/2026-08-07-pedido-de-autorizacao-inca.md),
   com o destinatário deliberadamente em branco — o canal precisa ser conferido
   no site do Instituto antes. **Não bloqueia nada**, por decisão registrada no
   [ADR de proveniência sem citação](adr/ADR-2026-08-07-proveniencia-sem-citacao.md);
   converte incerteza futura em documento arquivado, por um e-mail.
9. **Enviar os commits da branch `codex/wave1-hardening-api-smoke`.** Conte com
   `git log --oneline '@{upstream}..HEAD'` — e note que este documento **não**
   fixa o número de propósito: uma contagem escrita aqui envelhece no commit
   seguinte, inclusive no commit que a escreveu. O upstream é
   `origin/codex/wave1-hardening-api-smoke`, **não** `main`, que nem existe como
   ref local: `git log main..HEAD` devolve erro, e a mesma medição contra um ref
   inexistente devolveria vazio **com sucesso** — a negativa mais perigosa deste
   repositório, porque parece "nada a enviar".

**Engenharia, com host ou janela:**

10. **B5 Android** — janela exclusiva de host, horas. Não validar nem gerar
    durante o flow: mediu-se 2,3× de desaceleração no emulador sob carga
    concorrente, e o flow morre em timeout que parece defeito do app.
11. **Harness de acessibilidade no dev-tools** — upgrade opcional sobre a B4 já
    fechada; fecharia o gatilho de reabertura e a B0. **Adiado por decisão do
    dono em 2026-08-07:** nada no caminho crítico depende dele, e o caminho
    crítico é a F2, que é humana.
12. **A trava de escopo do teste do `eyebrow` não teve a mordida provada.** O
    segundo caso de `PixelHeroSplit.test.tsx` afirma que a mensagem do balão
    **não** carrega teto de escala. Provar que ele morde exigiria pôr um teto em
    `SpeechBubble.tsx`, fora do escopo declarado daquele run. Fica para a
    próxima vez que `SpeechBubble` for tocado — e está escrito aqui porque um
    teste de guarda não provado é indistinguível de um teste vazio.
13. **Claim `:5` do piloto** rotula os 0,1 mm como "exames com ampliação
    **geométrica**". O adjetivo vem de `p53:c1`, excerto vizinho, e não do
    excerto ancorado `p54:c1`. O núcleo está sustentado; decidir numa passagem
    futura se o adjetivo cai.

**Fechados em 2026-08-07, que estavam nesta lista:**

- ~~`content-no-verbatim` varre um diretório~~ — a raiz da varredura passou a ser
  **`git ls-files`**, o próprio sistema de registro, e não um caminho escolhido à
  mão: caminho escolhido à mão só encontra o que já se esperava encontrar. Dado
  real: **692 arquivos rastreados varridos, 391 textos de extração, zero erros,
  em 0,4 s.**

  **A prova não é afirmação.** A checagem nova foi rodada sobre o conteúdo do
  arquivo **como ele estava em `adee209^`**, o commit anterior à remoção, e
  devolveu 1 erro nomeando o caminho. Ela teria pego o vazamento sozinha.

  Dois números, e a diferença importa: a assinatura procurada tem 120 caracteres,
  mas o piso para um excerto **entrar** na varredura é 80 — que é o piso que o
  extrator passou a garantir no mesmo dia. Usar 120 nos dois lugares foi o
  primeiro rascunho, e deixava de fora todo excerto entre 80 e 120; os testes
  pegaram.

  Achado lateral: a guarda de entrypoint `process.argv[1] &&` **já era o padrão
  da casa** — `validate-foundation`, `validate-competencies`,
  `validate-media-manifest` e `catalog-library-sources` a tinham. O trecho do
  plano da fiação a omitiu, e os dois validadores nascidos dele ficavam
  impossíveis de importar por qualquer contexto sem script de entrada.
  Restaurada, com teste em processo filho — dentro do `node --test` o `argv[1]`
  está sempre preenchido, então um caso in-process passaria verde com a guarda
  morta.

- ~~Texto verbatim de fonte `blocked` rastreado em git~~ — **retirado do índice**
  em `adee209`, com a policy alargada e estreitada de volta em runs próprios
  (`a5d9cc8` e o desta entrega). Medido antes e depois, varrendo **toda** a
  árvore rastreada contra 375 amostras de excerto: **694 arquivos / 2 com texto
  de fonte → 692 / 0**. Dos 7 arquivos rastreados sob a pasta, só
  `excerpts.json` e `pages.json` carregavam texto; os outros cinco são metadado
  do pipeline e ficaram.

  **Duas correções de afirmações escritas por mim horas antes, e as duas
  importam mais que o conserto:**

  1. **"O prazo é o push" estava errado.** `847a12d` já estava em `origin/main`
     **e** na branch, e o repositório é **público** no GitHub. Não era "decida
     antes de enviar" — já estava publicado. A verificação que faltou é uma
     linha: `git branch -r --contains <sha>`. Escrever urgência com prazo é
     escrever uma afirmação sobre o mundo, e ela precisa da mesma checagem que
     qualquer outra.
  2. **A garantia do ADR era mais larga que a verificação que a sustentava.** O
     `content-no-verbatim` varre `content-manifest/`; o ADR afirma "nenhum
     artefato rastreado". Um verde prova a asserção **no domínio em que rodou**,
     e o domínio não viaja junto com o resultado. Fechar essa lacuna é o item 12,
     ainda aberto.

  **Decisão do dono:** parar o sangramento sem reescrever histórico. O texto
  permanece no histórico público — remover do `HEAD` não remove do histórico, e
  reescrever `main` público quebra clones e forks sem garantir expurgo dos
  objetos no GitHub. **Tratar como já exposto** é a leitura correta, e a
  avaliação que sobra é de risco, não de apagamento.

- ~~O eixo comercial dos direitos~~ — era a decisão de maior alcance da lista e
  **caiu por premissa falsa**: a cadeia não embarca verbatim, e a decisão pedida
  era sobre uma capacidade que o sistema não exerce. Fechado pelo
  [ADR de proveniência sem citação](adr/ADR-2026-08-07-proveniencia-sem-citacao.md),
  com o código passando a ler `allowedUses`, o não-vazamento virando gate
  (`content-no-verbatim`) e os termos das duas obras do INCA conferidos contra a
  página de direitos dos PDFs. **A lição custa registro:** um item pendente
  carrega três afirmações independentes, não duas — **estado**, **bloqueio** e a
  **premissa da própria pergunta**. As duas primeiras estavam certas; a terceira
  nunca foi checada, e foi ela que manteve uma tarefa de engenharia pequena
  travada no topo da lista como impasse jurídico. Escalar a um humano é a operação
  mais cara da lista: prove que a capacidade existe antes de pedir a decisão.

- ~~O `main()` de `anchor-lesson.py` sem mordida~~ — fechado com três casos que
  chamam `main()` sobre árvore de fixture. O antes e o depois estão medidos:
  com `return 0` fixo eram **zero** vermelhos e passaram a ser **1**; com
  `load_allowed` devolvendo `{}` era **1** vermelho e passaram a ser **3**, e os
  dois novos são os que exercitam a fiação `load_allowed → resolve_anchors` —
  a composição que o `main()` faz e que nenhum teste cobria.
- ~~Menor do `eyebrow`~~ — corrigido com teto de escala **só** no rótulo
  decorativo, escolha do dono entre três formas. O balão e o resto do app seguem
  acompanhando o ajuste do sistema por inteiro, e há um segundo teste travando
  esse escopo — cuja mordida, porém, não foi provada; virou o item 12 acima.
- ~~Revisar a Task 5 e executar a Task 6~~ — feitos, nesta ordem. A revisão rodou
  a prova de mutação que faltava e produziu um achado próprio, que virou o item
  10 acima; a Task 6 entrou em `cb795e1` com o validador rodado fora do gate
  antes de entrar nele. **A fiação da cadeia de conteúdo está concluída** — só a
  Task 3 (embeddings) segue adiada, e ela não bloqueia nada.

- ~~Seção 1 do design da fiação~~ — aprovada pelo dono, com relatório de descarte.
- ~~`.loop/project.yaml` aponta para o documento errado~~ — corrigido em
  `53b6a89`. **O bloqueio registrado era falso:** `.loop/project.yaml` **está**
  em `writePolicy.allowedRoots`, como entrada nominal própria, ainda que o
  diretório `.loop` não esteja. O item ficou dias na lista do dono por um
  impedimento que um `grep` na própria policy derrubava. A lição está registrada
  em "Três defeitos de processo" acima, e generaliza: **um item pendente carrega
  estado E bloqueio, e são afirmações independentes, com sistemas de registro
  diferentes.** Reverificar o estado não toca a frase que explica por que
  ninguém pode agir.

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
