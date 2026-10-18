# A4: o cartão legado da lição avança uma vez por sessão

**Data:** 2026-10-18. **Autor:** Claude Opus 5.5. **Base:** branch
`claude/r6-store-revisao` em `8e1b08e`, sobre a `main` em `e2e0524`.
**Origem:** o achado A4 da
[revisão do trabalho do Codex](../trilha/avaliacoes/2026-10-17-revisao-do-trabalho-do-codex.md),
e o item A4 da §4 do prompt de continuidade (19).

## O defeito

[código] Cada resposta da revisão chamava
`SpacedRepetitionService.recordQuizResult` com `totalQuestions: 1`, nos dois
caminhos do `useReview`: a autoavaliação (`submitRating`) e a resposta
corrigida (`submitAnswer`). Uma lição com três itens na sessão avançava três
vezes o cartão legado. Esse cartão é a agenda de reserva quando o store por
item está ilegível, e é ele que vai para o sync. A reserva ficava distorcida
justamente quando é usada.

## O conserto

**Decisão de Anderson, 2026-10-18:** o cartão legado avança uma vez, quando o
último item daquela lição na fila é respondido, com o resultado agregado (por
exemplo, 2 de 3 certos). Se o aluno sai antes, o legado dessa lição não avança.
Os cartões por item já avançaram, e o legado é só a reserva.

- Os dois caminhos passam por um único `recordLegacyLesson`, que soma a
  resposta já gravada e avança no último item da lição na fila. O sync segue o
  mesmo caminho de antes.
- Só entra na soma a resposta que o store confirmou. Uma escrita recusada e
  refeita conta uma vez.
- Recarregar a fila recomeça a soma.
- O tratamento de erro de cada caminho ficou como era. Na resposta corrigida,
  uma falha do agregado não desfaz a resposta confirmada. Na autoavaliação, a
  falha continua aparecendo como erro de gravação.

## Vermelho antes do conserto

[medido] Três dos testes novos, contra o `useReview` sem o agregado: **3
falharam e 8 passaram**
([saída](2026-10-18-a4-agregado-legado/jest-vermelho.txt)). Os três falham
pelo motivo previsto, uma chamada por item com `totalQuestions: 1`.

O quarto teste, o do recarregamento, foi escrito depois do conserto, e seu
vermelho foi produzido por injeção, abaixo.

## Cada guarda, vista falhando pelo defeito que nomeia

[medido] O script troca uma âncora única do `useReview.ts`, roda só o
teste-alvo e restaura o arquivo
([execuções e script](2026-10-18-a4-agregado-legado/injecoes.txt)):

| Injeção | Teste que reprova |
| --- | --- |
| avança em todo item, sem esperar o último da lição | os dois de agregação |
| não recomeça a soma ao recarregar a fila | recarregar a fila recomeça o agregado… |
| conta a resposta antes de ela ser gravada | uma resposta que não foi gravada… |

Com tudo restaurado: 3 suítes e 20 testes em `src/features/review`.

## Limites

- A interface não muda. Nenhuma tela foi vista no simulador.
- O agregado vive na memória da sessão. Se o app fecha no meio de uma lição, o
  legado dela não avança, como decidido.
