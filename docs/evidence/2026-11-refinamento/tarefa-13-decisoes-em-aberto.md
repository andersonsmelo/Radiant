# Tarefa 13 — decisões em aberto, resolvidas em 2026-11-17

Feita pelo controlador (Claude Fable 5.2), sem subagente e sem revisor independente.

## O que o dono decidiu

1. **Relevo:** as quatro superfícies que o aluno alcança (ordenar, parear, comparação
   e cartão de revisão). O quiz antigo fica como está: a rota `/quiz` não tem entrada
   dentro do app (medido por busca de chamadores em 2026-11-17).
2. **Sequência parada:** mostrar 0, como o widget já fazia.

## O que mudou

- `standingStreakDays` (em `StreakFreezeService`) é a regra única da sequência que vale
  no dia: a guardada, se estudar hoje a estenderia (ontem, ou anteontem com proteção);
  senão 0. Saiu de dentro do `widgetSnapshot`, que agora a importa.
- `GamificationService.getSnapshot` devolve `standingStreakDays` ao lado de `streakDays`.
  A contagem guardada não mudou de sentido: sincronização, decorações e lembretes
  continuam lendo `streakDays`.
- Topo (trilha, revisão, recompensa, avaliação) e perfil mostram `shownStreakDays`.
  A `HomeScreen` antiga não foi tocada.
- `streakWeekDays` recebe a sequência que vale hoje: um dia perdido coberto por
  proteção continua marcando os dias da sequência.
- `ChoiceOption` ganhou `media` e `selectedMark`. Parear, cartão de revisão e
  "Selecionar esta ordem" usam a peça; a comparação também, com a figura acima do
  rótulo e a marca desenhada no lugar da etiqueta "Selecionada". O item de ordenar
  tem lábio parado.

## Execução vermelha (antes do código), Node 20.20.2, `jest --runInBand`

Sequência, 9 falhas em 4 suítes:

- `standingStreakDays` (4 testes): `TypeError: standingStreakDays is not a function`
- `shownStreakDays` (2 testes): `TypeError: shownStreakDays is not a function`
- `GamificationService: a sequência que vale hoje` (1 teste)
- `streakWeekDays`: dia perdido coberto por proteção (1 teste)
- `ProfileScreen`: sequência parada mostra 0 no contador (1 teste)

Relevo, 6 falhas em 5 suítes:

- `ChoiceOption › com mídia, a face empilha a mídia acima do rótulo e mantém o relevo`
- `ChoiceOption › selectedMark desenha a marca de escolhida só em selected`
- `ComparisonStepRenderer › não depende de cor: marca desenhada na escolhida, sem a etiqueta "Selecionada"`
- `MatchingStepRenderer › cada opção a associar é a peça com relevo da aula`
- `OrderingStepRenderer › cada item tem lábio de relevo, e "Selecionar esta ordem" é a peça com relevo`
- `ReviewCard › as alternativas são a peça com relevo da aula, em grupo de rádio`

Nasceu verde: `StreakWeek › sequência parada mostra 0 dias e só o dia do último estudo
marcado`. O componente já mostrava o número que recebe; quem mudou foi a tela.

## Execução verde

284 suítes, 3.855 testes, na árvore da branch. Typecheck e lint sem erro; contratos de
texto, de literal de estilo, de contraste, de Maestro, do Storybook e o `visual:qa:strict`
passando.

A primeira rodada inteira teve 7 falhas, corrigidas: um `null` na lista de estilos da
face quebrava o utilitário de teste do Reanimated, e o teste da tela de revisão trocava
o módulo de movimento inteiro por um substituto sem `usePressDescend`.

## Prova em simulador (2026-11-17, bundle do commit `3c8a4369`)

iPhone simulado "Radiant F6", iOS, tamanho de texto normal, aulas abertas por link
(`radiantapp://learn?blockId=…`), perfil sem estudo registrado.

| Captura | O que mostra |
| --- | --- |
| [11-ordenar.jpg](capturas/11-ordenar.jpg) | Ordenar: itens com borda e lábio (M01, aula 2, passo 5) |
| [12-ordem-selecionada.jpg](capturas/12-ordem-selecionada.jpg) | "Ordem selecionada" com a marca desenhada e o botão de continuar liberado |
| [13-parear.jpg](capturas/13-parear.jpg) | Parear: opções com a peça da aula (M01, aula 4, passo 5) |
| [14-comparacao.jpg](capturas/14-comparacao.jpg) | Comparação: radiografia dentro da peça, escolhida com marca (M08, aula 1, passo 4) |
| [15-perfil-sequencia-zero.jpg](capturas/15-perfil-sequencia-zero.jpg) | Perfil com "0 dias" e nenhum dia marcado; o topo da trilha mostrava "0d" |

Nenhum defeito de tela apareceu. Uma observação foi levada ao dono: em ordenar,
"Selecionar esta ordem" tinha a mesma aparência dos itens da lista até ser tocado, e
podia ser lido como um quinto item. O dono mandou ajustar, e ele virou botão
secundário (`AppButton`), com a marca desenhada depois de escolhido. O rótulo lido
pelo leitor de tela continua "Selecionar esta ordem"; a dica passa a dizer "Ordem
selecionada". A execução vermelha foi `Expected length: 0, Received length: 1` na
contagem de `choice-option-lip`. As capturas 11 e 12 são anteriores a esse ajuste.

## Não provado

- **O cartão de revisão não foi visto.** No simulador, a revisão abre "Este conteúdo
  foi atualizado", porque não há item de revisão no catálogo atual para aquele perfil.
  As alternativas dele só têm asserção de estrutura.
- A sequência **parada depois de ter existido** (contagem guardada maior que zero) não
  foi vista: o perfil do simulador nunca estudou. Só o caso de zero inicial apareceu.
- Android e aparelho físico.
- Texto no tamanho máximo: as alternativas do cartão de revisão perderam o teto de
  escala (`LABEL_MAX_FONT_SCALE`) que tinham e agora crescem como as da aula.
- Os roteiros do Maestro que tocam "Associar …" e "Selecionar esta ordem" não foram
  rodados; os rótulos de acessibilidade são os mesmos.
- O aluno novo, que nunca estudou, passa a ver 0 no topo (antes via 1, o valor inicial
  guardado).
