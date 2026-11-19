# Evidência da fase B: formatos (2026-11-19)

Esta pasta guarda a evidência das tarefas da fase B da trilha dobrada (novos formatos de interação): saídas vermelhas dos testes escritos antes da implementação e, mais adiante, as medições de cada tela.

| Tarefa | O que entregou | Evidência |
|---|---|---|
| 1 | Teste que percorre todas as famílias de interação; unidade sintética de formatos | `vermelho-tarefa-1.txt`: sem o `case 'multi-select'` em `isCorrectInteractionValue`, o teste reprova só em `multi-select`, na asserção de `isCompleteInteractionValue` (`isCorrect` começa chamando `isComplete`) |
| 2 | Diagramas e laços em código (camadas de SVG, `DiagramView`, catálogo com paleta e movimento) e o script de revisão visual | `vermelho-tarefa-2.txt`: as guardas do catálogo (paleta, camada animada com folga, XML, relógio) vistas falhando com defeitos injetados |
| 3 | Figura compartilhada (imagem ou diagrama pelo mesmo campo) e `hotspot` na aula-fonte, nos quatro portões, com a régua do alvo de toque de 44 pt | `vermelho-tarefa-3.txt`: o vermelho antes da implementação e os defeitos específicos da régua de toque vistos falhando |
| 4 | Formato `label` (rotular pontos de uma figura) nos quatro portões, com tela, história e roteiro Maestro | `vermelho-tarefa-4.txt`: o vermelho antes da implementação e 14 defeitos específicos (sobreposição, área de 44 pt fora da figura, distratores, ordem das fichas, acerto, retorno, alvo, rótulo da figura, direção da rolagem) vistos falhando por mutação |
| 5 | Formato `risk-hunt` (caça ao erro) nos quatro portões, com tela, história, roteiro Maestro e o diagrama `sala-com-riscos` | `vermelho-tarefa-5.txt`: o vermelho antes da implementação e 17 defeitos específicos vistos falhando por mutação (uma mutação sobreviveu e foi refeita); quadro do diagrama em [`lacos/sala-com-riscos.png`](lacos/sala-com-riscos.png), revisado como imagem |
| 6 | Visual opcional no passo de conceito (`visual`, um diagrama do registro), nos quatro portões | `vermelho-tarefa-6.txt`: o vermelho antes da implementação (diagrama do registro passa, id fora dele reprova, limite de palavras) |
| 7 | Formato `conversation` (conduzir uma conversa com um personagem) nos quatro portões, com tela, história e roteiro Maestro; a unidade sintética leva a conversa na aula 02 | `vermelho-tarefa-7.txt`: o vermelho antes da implementação e 26 defeitos específicos vistos falhando por mutação (uma mutação sobreviveu, por o teste da fábrica ler o lote já serializado, e foi refeita com um teste sobre o objeto) |
| 8 | Formato `blitz` (rodada rápida de verdadeiro ou falso, com relógio que se desliga) nos quatro portões, com tela, história e roteiro Maestro; a exceção de vida em `LessonFlowScreen` vale só para ele; a unidade sintética leva a rodada na aula 02 | `vermelho-tarefa-8.txt`: o vermelho antes da implementação e 37 defeitos específicos vistos falhando por mutação (relógio com leitor de tela, com "reduzir movimento" e antes de as duas preferências responderem; avanço de 900 ms; tempo esgotado como nulo; vida cobrada no `blitz` e, no outro sentido, deixar de cobrar no `true-false`) |
| 9 | Formato `parameter-lab` (o aluno move um controle e vê o efeito no desenho) nos quatro portões, com tela, história e roteiro Maestro; a unidade sintética leva o laboratório na aula 04 (a verdadeiro ou falso saiu, que a aula 06 ainda cobre) | `vermelho-tarefa-9.txt`: o vermelho antes da implementação e 4 defeitos específicos vistos falhando por mutação (limites trocados, meta que já vale na partida no contrato wide e no verificador, botão Diminuir do Maestro) |
| 10 | Formato `bench` (bancada de exposição e colimação) na aula-fonte, nos quatro portões, com roteiro Maestro pelos botões Aumentar ou Diminuir; a unidade sintética leva a bancada na aula 03 | `vermelho-tarefa-10.txt`: o vermelho antes da implementação e os defeitos específicos do alvo, dos controles e das dicas vistos falhando |
| 11 | Dez laços de animação no catálogo (doze diagramas), com revisão por imagem e guarda de `style=` e aspas simples | `vermelho-tarefa-11.txt` e [`lacos/`](lacos/): a guarda vista falhando com `style="fill:white"` num `<rect>` de `eco-ultrassom`; ver a seção da tarefa 11 abaixo |

## Limites conhecidos

- O roteiro Maestro do `blitz` roda com "reduzir movimento" ligado, então o caminho com relógio (barra de tempo, "Sem tempo", tempo esgotado) só tem teste de componente.
- O gerador de roteiros Maestro só é exercitado para os tipos da aula-fonte presentes na unidade sintética (`comparison` fica de fora, por exigir imagem).
- `validateInteraction` não acusa tipo sem `case`: o teste de famílias só pega payload malformado do exemplo.
- Os textos que o gerador Maestro repete à mão (rótulo falado do ponto, ids das fichas) não estão amarrados aos da tela por teste (tarefas 4 e 5).
- A rolagem do `label` no roteiro Maestro (`direction: UP` até o ponto) não foi medida em aparelho.
- Figura que não resolve (diagrama ou imagem fora do registro) deixa a interação sem saída no tocador, no `label`, no `hotspot` e no `risk-hunt`.
- As réguas do `hotspot` (3 a 6 alvos, área de toque de 44 pt centrada, sem sobreposição, `width` e `height` obrigatórios) vivem só no verificador `.mjs`; o contrato `wide` não as espelha, então um lote escrito à mão, sem passar pelo verificador, escapa delas.
- O gerador de roteiros Maestro lança `rtg-maestro-bench-manual` para a bancada com alvo `match`, que o verificador aceita: esse roteiro é manual.
- No `HotspotStepRenderer` o alvo de 44 pt passou a ser `hitSlop`; o conteúdo do piloto editorial, que não passa pela régua de toque do verificador, pode ter alvo menor perto da borda da figura.
- A régua de toque mede a figura a 280 pt de largura; a largura real em tela de 320 pt não foi medida.

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
