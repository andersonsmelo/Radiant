# Evidência da fase B: formatos (2026-11-19)

Esta pasta guarda a evidência das tarefas da fase B da trilha dobrada (novos formatos de interação): saídas vermelhas dos testes escritos antes da implementação e, mais adiante, as medições de cada tela.

| Tarefa | O que entregou | Evidência |
|---|---|---|
| 1 | Teste que percorre todas as famílias de interação; unidade sintética de formatos | `vermelho-tarefa-1.txt`: sem o `case 'multi-select'` em `isCorrectInteractionValue`, o teste reprova só em `multi-select`, na asserção de `isCompleteInteractionValue` (`isCorrect` começa chamando `isComplete`) |

## Limites conhecidos

- O gerador de roteiros Maestro só é exercitado para os tipos da aula-fonte presentes na unidade sintética (`comparison` fica de fora, por exigir imagem).
- `validateInteraction` não acusa tipo sem `case`: o teste de famílias só pega payload malformado do exemplo.
- As réguas do `hotspot` (3 a 6 alvos, área de toque de 44 pt centrada, sem sobreposição, `width` e `height` obrigatórios) vivem só no verificador `.mjs`; o contrato `wide` não as espelha, então um lote escrito à mão, sem passar pelo verificador, escapa delas.

## Tarefa 11: laços de animação (2026-11-19)

Dez laços novos entraram no catálogo, que fica com doze diagramas: `tubo-raios-x`
(parado), `colimador-abrindo`, `tubo-emitindo`, `feixe-atenuando`,
`radiacao-espalhada`, `grade-antidifusora`, `foco-e-penumbra`,
`corte-tomografico-girando`, `precessao-rm`, `eco-ultrassom`,
`detector-convertendo` e `compressao-mama`. Os três do `parameter-lab` entram com a
tarefa 9.

Revisão: cada laço foi gravado em quatro instantes pelo
`radiant-app/scripts/render-diagrams.mjs` e olhado como imagem pelo autor e pelo
controlador. Dois voltaram ao autor: `precessao-rm` (a vista lateral, parada em dois
dos instantes, mostrava o eixo alinhado ao campo) e `radiacao-espalhada` (parado, lia
como dois feixes horizontais). Os quadros de pôster estão em [`lacos/`](lacos/).

Limites: ninguém viu os laços em movimento, em simulador ou aparelho. A revisão foi
feita sobre quadros parados, e o desenho da tela é o do `DiagramView`, que os testes
modelam mas não executam. A guarda nova de `style=` e aspas simples foi vista
falhando (`vermelho-tarefa-11.txt`).
