# Revisão do trabalho do Codex na trilha — 2026-10-17

**Autoria:** Claude Opus 5.5 (Anthropic, `claude-opus-5-5`), numa sessão do
Claude Code. Pedido de Anderson nesta conversa: revisar o trabalho, propor
avanços e coordenar as IAs que trabalham no projeto.
**Papel:** revisor e coordenador. Este documento não reescreve os relatórios do
Codex; soma uma segunda leitura, com outro método.
**Estado medido:** branch `codex/radiant-study-improvements`, HEAD `2c1b5f0`,
árvore compartilhada com 113 entradas no `git status --porcelain`. Medido em
2026-10-17, entre 18h e 18h30 (America/Bahia).

**Método:**

1. Leitura do [README da trilha](../README.md), do
   [prompt de continuidade](../PROMPT-PARA-IAS.md), do STATUS, da FILA (49–54),
   do [programa G0–G8](../plano/2026-10-16-loop-global-de-evolucao-da-trilha.md),
   do [diagnóstico estrutural](2026-10-16-diagnostico-estrutural-global-da-trilha.md)
   e das evidências de G3 e G4.
2. Reprodução dos 15 validadores do `.loop/project.yaml`, com os comandos
   literais do arquivo, na árvore atual.
3. Leitura integral do código do G4: `ItemReviewService.ts`,
   `ItemReviewRepository.ts`, `types/itemReview.ts`, `itemSm2.ts` e
   `useReview.ts`. Amostra do G2 (`JourneyUnitNavigation.tsx`) e do G3 (CI e
   contrato).
4. Uma sonda de comportamento temporária, executada e apagada antes do run.
5. Inventário das worktrees e das branches.

**Não feito:** execução nativa, avaliação de tela, revisão linha a linha das
cerca de 3.500 linhas do diff, conferência das fontes externas das pesquisas.

**Graus:** [código] lido no código, [visto] observado numa execução,
[inferido] conclusão minha, [terceiro] documentação de biblioteca.

## 1. Veredito

- **[visto] A engenharia é rigorosa e os relatórios são honestos.** Os 15
  validadores passam. Os relatórios registram o passo vermelho, testes de
  mutação e limites explícitos, e nenhum deles afirma o que não mediu.
- **[código] O que o aluno percebe mudou pouco.** O maior problema da
  avaliação de 16/10 estava **dentro da lição**: uma pergunta por lição, erro
  explicado longe da pergunta, alternativa certa mais longa e nenhuma imagem.
  Esse problema continua sem conserto:
  - o achado D1 do diagnóstico (`buildIntroBlock` usa uma pergunta) segue
    aberto, porque o `JourneyDefinitionService.ts` não aparece no diff;
  - a FILA 50 (P1, lição honesta) não foi executada;
  - o catálogo continua com 18 lições legadas e 38 perguntas, mais 12
    atividades V2.

  O que muda na tela é a revisão com resposta antes do gabarito (G4) e a
  navegação por unidades (G2), e nenhuma das duas foi vista num aparelho.
- **[código] O trabalho só existe nesta máquina.** Nada foi commitado:
  - 25 arquivos de código novos, com 2.070 linhas;
  - 49 arquivos alterados, com +1.458 e −841;
  - a documentação.

  A branch já está 39 commits à frente da `main` sem PR. Um disco perdido ou
  um `git checkout` descuidado apaga tudo, e nenhuma outra IA consegue revisar
  isso por diff.
- **[visto] O G4 tem um defeito que atinge exatamente a próxima fase (G3).**
  Ele está na seção 3, A1.

## 2. Gates reproduzidos

[visto] Rodaram em série os 15 comandos de `validators` do `.loop/project.yaml`,
com Node 20 nos comandos de app, API e conteúdo. A carga de 1 minuto estava em
3,2 no início.

| Validador | Resultado | Tempo |
| --- | --- | ---: |
| docs-contract, content-foundation, content-wave1, content-anchoring, content-anchoring-data, content-source-rights | aprovado | < 1 s cada |
| content-production | aprovado | 2 s |
| content-no-verbatim | aprovado | 1 s |
| content-python | aprovado | 8 s |
| app-quality | aprovado, 173 suítes e 1.728 testes, visual QA sem regressão | 71 s |
| app-test | aprovado, 173 suítes e 1.728 testes | 63 s |
| api-lint, api-typecheck | aprovado | 1–2 s |
| api-test | aprovado, 13 testes | 1 s |
| brain-links | aprovado | < 1 s |

[inferido] Essas contagens valem para **esta árvore suja**, e não para um
conjunto rastreado: o trabalho G0–G4 não está em nenhum commit. Não as compare
com contagens de CI da `main`.

## 3. Achados

| ID | Prioridade proposta | Resumo |
| --- | --- | --- |
| A1 | P0 antes de qualquer lote G3 real | Nova `contentVersion` tira a lição da revisão para sempre |
| A2 | P1, G6 | O store de revisão não cabe no Android nos tetos declarados |
| A3 | P1, G7 | Um registro inválido bloqueia a revisão inteira, sem recuperação |
| A4 | P2 | O agregado legado avança uma vez por item |
| A5 | P2, manutenção | Código novo muito denso para revisão entre IAs |
| A6 | P0, coordenação | Trabalho do E1 parado numa worktree, em conflito com a árvore principal |
| A7 | P2, documentação | README de entrada longo e mapa da pasta desatualizado |
| A8 | Estratégia | Infraestrutura de escala à frente do conteúdo e da lição |

### A1 — nova `contentVersion` apaga a lição da revisão, sem aviso

- **[código] Cadeia do defeito:**
  - `itemKey` inclui a `contentVersion` (`types/itemReview.ts:29-30`).
  - A `contentVersion` é **do lote inteiro**: toda atividade precisa repetir a
    do candidato (`EditorialBatchContract.ts:62`).
  - Quando a versão muda, nenhum cartão antigo casa com as definições novas,
    e a fila os descarta (`ItemReviewService.ts:79-82`).
  - A lição continua marcada como "gerida" (`ItemReviewService.ts:60`), então
    nunca é semeada de novo.
  - `effectiveSchedule` apaga a lição da agenda legada antes de descobrir que
    os cartões estão órfãos (`ItemReviewService.ts:91-94`).
- **[visto] Sonda:** uma lição com dois itens na versão `v1` entra na fila.
  Com a versão trocada para `v2`, 60 dias depois a fila tem **0** itens, o
  `dueCount` dá **0** e a agenda fica **vazia**.
- **[código] O teste existente fixa o defeito como comportamento esperado.**
  `ItemReviewService.test.ts:71-78` ("não transfere a agenda/evidência de uma
  versão material para outra") exige a fila vazia **e** a agenda vazia. A
  intenção é correta: não transferir evidência. Mas a asserção só exige
  *diferença* e não exige *validade*, que seria a lição continuar revisável. É
  a armadilha da lição 1 de 2026-09-22 no AGENTS.md.
- **[inferido] Consequência:** corrigir um erro de digitação num item, com a
  versão incrementada como o contrato pede, tira da revisão **todos** os itens
  daquele lote para todos os alunos.
- **Correção proposta [inferido]:** reconciliar por `(lessonId, itemId)`.
  - O mesmo item numa versão nova herda **só a agenda**, isto é, o `dueAt`,
    sem evidência, como a migração do legado já faz.
  - Item removido sai da agenda.
  - Item novo é semeado.

  O teste novo exige as duas coisas: nenhuma evidência transferida **e** a
  lição de volta à fila na data herdada. Ele precisa ser visto falhando com o
  código atual.
- **Decisão do dono:** se a mudança material deve reiniciar o intervalo
  (`interval: 1`) ou preservá-lo. A escolha é pedagógica, não técnica.

### A2 — o store de revisão não cabe no Android nos tetos declarados

- **[código]** O store inteiro é um único valor JSON no AsyncStorage
  (`STORAGE_KEYS.ITEM_REVIEW`), com teto de 20.000 cartões e 2.000 tentativas
  (`ItemReviewRepository.ts:8-9`). Cada resposta relê, revalida e reescreve o
  store inteiro (linhas 84 e 110).
- **[código]** Uma única chamada a `dueCount` lê e valida o store completo
  quatro vezes: `inspect`, `getCards` e as duas leituras de `loadQueue`
  (`ItemReviewService.ts:100-107`).
- **[visto] Tamanho medido:** um cartão com chave serializado ocupa cerca de
  581 bytes, e uma tentativa cerca de 588. Nos tetos, o store chega a cerca de
  **12,2 MiB**. Com mil cartões, a cerca de 1,7 MiB.
- **[código/terceiro]** O AsyncStorage 2.2.0 instalado limita o banco
  **inteiro** no Android a **6 MB** por padrão (`getDatabaseSize`, em
  `android/config.gradle`), e o projeto não altera esse valor.
- **[inferido] Consequências:**
  - no Android, as escritas começam a falhar por volta de 8 a 9 mil cartões,
    ou antes, já que as outras chaves do app dividem os mesmos 6 MB;
  - a partir daí, `recordMany` devolve `accepted: false`, e o aluno vê "Não
    foi possível salvar esta revisão" em toda resposta;
  - o cenário de capacidade do plano, com 10.000 itens, não é viável nesse
    desenho.

  Falta medir isso num aparelho, que é trabalho do G6.
- **Proposta [inferido]:** particionar o store por lição ou por lote, ou
  migrar para SQLite, antes do G3 em escala. E medir o tempo de leitura e
  validação com 1k e 5k cartões num Android de entrada.

### A3 — um registro inválido bloqueia a revisão inteira

- **[código]** `load()` valida tudo ou nada: um cartão ou tentativa inválidos
  fazem o store inteiro ser tratado como ilegível
  (`ItemReviewRepository.ts:64-69`).
- Nesse estado, `loadQueue` lança `review-store-unavailable` e toda escrita
  falha. Não existe caminho de recuperação, nem quarentena do registro
  inválido.
- **[inferido]** O STATUS cita recuperação no G7 de forma genérica. Este modo
  de falha, um registro corrompido que bloqueia tudo, precisa de critério e
  teste próprios.

### A4 — o agregado legado avança uma vez por item

- **[código]** Cada resposta da revisão chama
  `SpacedRepetitionService.recordQuizResult` com `totalQuestions: 1`
  (`useReview.ts:159-160`). Uma lição com três itens numa sessão avança três
  vezes o cartão legado.
- **[inferido]** Para lições geridas pelo journal, esse cartão é a agenda de
  reserva quando o store está ilegível (`ItemReviewService.ts:101-103`). A
  reserva fica distorcida justamente quando é usada. O impacto é baixo.

### A5 — código novo muito denso para revisão entre IAs

- **[visto]** Nos módulos novos, de 9% a 12% das linhas passam de 140
  colunas: `ItemReviewRepository.ts` tem 16 em 169, com máximo de 284, e
  `ItemReviewService.ts` tem 13 em 138. No resto do TypeScript rastreado, a
  taxa é de 1,7%: 292 em 17.549 linhas.
- **[inferido]** Num projeto em que várias IAs revisam o código umas das
  outras, essa densidade esconde condições compostas, como as das linhas
  97-100 do repositório. Proposta: limite de largura para código novo no lint,
  ou extrair predicados com nome.

### A6 — trabalho do E1 parado numa worktree, em conflito com a árvore principal

- **[visto]** A worktree `.claude/worktrees/trusting-mestorf-a5ca83`, branch
  `feat/e1-e2e-sem-movimento`, tem **22 arquivos alterados e não commitados**.
  A pasta é de 2026-10-16 às 18:49, e são roteiros do Maestro (FILA 49).
- **[visto]** Três desses arquivos também foram alterados pelo Codex na
  árvore principal: `.maestro/rating-prompt.yaml`, `.maestro/review-due.yaml`
  e `scripts/maestro-contract.test.mjs`. Juntar os dois trabalhos vai dar
  conflito.
- **[inferido]** Nenhum documento de estado diz que o E1 está em andamento.
  Isso viola o contrato "sinalize o que foi feito" e é o tipo de trabalho que
  outra IA refaria do zero.

### A7 — README de entrada longo e mapa da pasta desatualizado

- **[visto]** O [README](../README.md) tem quatro blocos que se sobrepõem: a
  direção atual, a consolidação de 17/10, a fotografia de 16/10 e a
  contribuição complementar.
- **[visto]** A tabela "Mapa da pasta" lista 2 das 4 pesquisas, 4 das 8
  avaliações e 2 dos 4 planos.
- **[inferido]** A promessa de "entender em poucos minutos" não se cumpre. A
  proposta está no [plano de coordenação](../plano/2026-10-17-avancos-e-coordenacao-multi-ia.md).

### A8 — infraestrutura de escala à frente do conteúdo e da lição

- **[código]** A ordem que o próprio programa propôs era G0 → G1 + P1/E1 → G2/G3
  → G4/G5. O P1 e o E1 foram pulados, e o G4 foi feito antes de qualquer lote
  real ou de qualquer prova nativa.
- **[inferido]** Existe hoje um motor testado para 10.000 itens e 38 perguntas
  para alimentá-lo. O gargalo real é **produção aprovada**, que depende das
  decisões do dono na FILA 45 e do acervo de imagens do P6, e **a qualidade
  dentro da lição**.

  Mais infraestrutura antes disso aumenta o custo de manutenção sem mudar o
  que o aluno vive. Isso não diminui o valor do G3/G4: eles impedem que a
  produção futura degrade o histórico.

## 4. O que manter

- **[visto]** Rigor de prova: vermelho registrado, mutações discriminantes,
  limites ditos, decisões do dono preservadas em ADR.
- **[código]** Reuso das fronteiras que já existiam (`LessonOutcomeService`,
  `ProductionBatch`, registry de renderizadores), sem trocar a arquitetura.
- **[código]** Correção pelo catálogo, e não pela UI: o gabarito adulterado na
  tela não conta, e a ajuda é registrada sem XP.

## 5. Limites desta revisão

- Não executei o app. O comportamento na tela, a acessibilidade e o Android
  continuam sem prova.
- A1 está provado por sonda na camada de serviço. O efeito ponta a ponta numa
  instalação real não foi observado.
- A2 tem o tamanho medido e o limite lido no código da biblioteca. A falha no
  aparelho é inferência.
- Não revisei linha a linha o G0/G1/G2/G3 nem conferi as fontes externas das
  quatro pesquisas.
