# Tarefa 14 — pendências menores, fechadas em 2026-11-17

Pedido do dono, a partir da lista de pendências da sessão. Feita pelo controlador
(Claude Fable 5.2), sem subagente e sem revisor independente.

## O que mudou

1. **Capturas 11 e 12** refeitas com o botão de ordem atual (ver tarefa 13).
2. **`HomeScreen` antiga:** o painel (`HomeDashboardService`) passa a mostrar
   `shownStreakDays`, a sequência que vale hoje.
3. **Relevo único:** `PIECE_LIP` e `pieceRelief(raio)` em `ui/styles.ts`. `ChoiceOption`,
   `TapChip`, `PlanCard` e o item de ordenar deixaram de repetir a constante e os dois
   estilos. `AppButton` (lábio de 5 pt, `depth.lip`) e a peça numerada do passo de
   ensino (3 pt, redonda) ficaram como estão: são outras formas.
4. **Guarda de estilo:** `style-literal-contract` acusa `...typography.label` espalhado
   num estilo que não desliga a caixa alta no mesmo objeto. Os quatro usos julgados na
   tarefa 6 estão em `LABEL_USES`, com contagem por arquivo e motivo; um uso a mais no
   mesmo arquivo é acusado.
5. **Verdadeiro ou falso:** `statementStem` tira o ponto final (e reticências) da
   afirmação antes de emendá-la. "Resposta certa: A distância reduz a dose: certo", e o
   rótulo lido deixa de ter "dose.. Você marcou".
6. **Pasta `.superpowers/sdd/2026-11-16-refinamento-visual-1-6/`:** não apagada. A
   condição era o merge, e a PR 84 estava aberta quando esta tarefa rodou.

## Execução vermelha (antes do código), Node 20.20.2

- `HomeDashboardService › mostra a sequência que vale hoje, não a contagem guardada de
  uma sequência parada`
- `correctAnswerText › verdadeiro ou falso lista cada afirmação com o veredito`
  (asserção nova com ponto final e com reticências). A asserção da folha de erro que
  fixava o texto "dose.: certo" foi trocada pelo texto certo.
- Guarda, com `LABEL_USES` já exportada e a detecção ainda por fazer:
  `not ok 16 - acusa a caixa alta que chega por ...typography.label` e
  `not ok 17 - uso julgado passa até a contagem registrada; o excedente é acusado`,
  as duas com `actual [] / expected ['label']`.

Sem execução vermelha: o relevo único é refatoração, coberta pelos testes de lábio que
já existiam (`ChoiceOption`, `TapChip`, `PlanCard`, ordenar). O uso de `statementStem`
no rótulo de acessibilidade do `TrueFalseStepRenderer` não tem teste próprio; a função
é testada pelo texto da resposta certa.

## Execução verde

284 suítes, 3.856 testes, na árvore da branch. Typecheck e lint sem erro; a guarda
passa no app com os três arquivos de `LABEL_USES`.

## Não provado

- Nada desta tarefa foi visto em simulador, além das duas capturas refeitas.
- A guarda só vê `...typography.label` escrito assim: um apelido
  (`const t = typography.label`) ou outro papel com caixa alta escapam.
