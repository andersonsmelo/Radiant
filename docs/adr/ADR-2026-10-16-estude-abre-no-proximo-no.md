# ADR — Estude abre no nó PRÓXIMO, e a volta à aba preserva a posição

Data: 2026-10-16. Decisor: Anderson Melo. Complementa o
[ADR de 2026-08-15](ADR-2026-08-15-topologia-de-navegacao-estude-e-perfil.md),
que fez de Estude a trilha do currículo inteiro numa rolagem só.

## Contexto

Medido no simulador (iPhone 17, iOS 26.5) em 2026-10-16, no branch
`codex/radiant-study-improvements`: a trilha abria sempre no topo, com o
título do estágio, o cartão de recomendação e a primeira lição. O nó marcado
PRÓXIMO ficava abaixo da dobra. Mesmo depois de o aluno rolar até ele, a
posição se perdia ao ir ao Perfil e voltar, porque a releitura do foco trocava
a lista pelo esqueleto de carregamento e a desmontava.

O ADR de 2026-08-15 previa reabrir a decisão "se a rolagem contínua se mostrar
longa demais para navegar". O pedido do dono é esse caso: a Home sempre leva o
aluno ao ponto exato em que ele está na trilha.

## Decisão

Opção A, escolhida pelo dono entre duas:

- a trilha abre com o nó recomendado (PRÓXIMO) **centralizado** na tela;
- o título do estágio e o cartão de recomendação **continuam no topo da
  rolagem**, alcançáveis rolando para cima. O cabeçalho segue dentro da lista,
  como fixou o conserto de AX5 de 2026-09-24;
- a trilha centraliza **uma vez por recomendação**. Voltar à aba sem mudar o
  PRÓXIMO preserva o ponto para onde o aluno rolou; concluir um nó muda a
  recomendação e centraliza o novo PRÓXIMO;
- o esqueleto de carregamento é só da primeira leitura. As releituras de foco
  são silenciosas e não desmontam a lista.

Opção descartada (B): fixar título e progresso no alto e remover o cartão de
recomendação, porque o nó PRÓXIMO já é o CTA. Muda mais e exigiria reconferir
AX5, onde um cabeçalho fixo já ocupou a tela inteira.

## Consequências

- Aluno novo continua vendo o cabeçalho: o primeiro nó fica perto do topo e a
  rolagem para quando não há mais conteúdo acima.
- Com o PRÓXIMO fora da primeira janela virtualizada, a lista aproxima a
  posição pela altura média dos itens e tenta de novo, até três vezes.
- Implementação em `JourneyTrail` e `JourneyHomeScreen`; evidência em
  [`evidence/2026-10-16-trilha-ancorada-no-proximo.md`](../evidence/2026-10-16-trilha-ancorada-no-proximo.md).
