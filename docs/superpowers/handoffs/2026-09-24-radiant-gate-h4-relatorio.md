# Gate H4 no simulador — relatório (2026-09-24)

Frente 7 do [prompt de continuidade (2)](2026-09-24-radiant-prompt-de-continuidade-2.md).
A condição de pronto combinada com o dono:
- evidência dos quatro pontos;
- o que falhar vira defeito na FILA, sem conserto nesta frente;
- H4 marcada na FILA, no roadmap e no STATUS.

A evidência completa, com as 11 capturas, está em
[`2026-09-24-gate-h4-simulador.md`](../../../radiant-app/docs/evidence/2026-09-24-gate-h4-simulador.md).

## Resultado

**O gate foi percorrido e não está fechado.** Situação de cada ponto:

| Ponto | Resultado |
| --- | --- |
| Aprovação e reforço | medido: 1 de 2 certas abre o reforço do ciclo 1, e depois dele 2 de 2 aprova |
| Retomada sem persistir respostas | medido no modo `off` (produção): nenhuma resposta fica salva e a avaliação recomeça do zero |
| Texto grande | **reprovado** do AX1 ao AX5 |
| Leitor de tela | árvore de acessibilidade medida; VoiceOver real **não exercitado** |

**Defeitos abertos na FILA:**
1. o texto do checkpoint promete "10 questões"/"8 acertos" para avaliações de 2
   itens;
2. os tamanhos de texto de acessibilidade quebram a trilha e o checkpoint.

**Para o dono decidir:**
- se a H4 fecha antes da correção dos dois defeitos e do VoiceOver em
  aparelho;
- se a vida gasta num checkpoint abandonado deve continuar gasta.

**De brinde, os defeitos 2 e 3 do E2E foram conferidos na tela** com o JS do
branch `fix/e2e-defeitos-2-e-3`:
- **defeito 2:** a tela diz "Próxima revisão em 1 dia";
- **defeito 3:** o botão de vidas na trilha vai de x 206 a 382 em 402 pt.

## Como, e com que limites

**Simulador:**
- é um **segundo** iPhone 17 (iOS 26.5), `A5FA5443-…`, com o binário do E2E
  copiado;
- o simulador do E2E, `E3C547AE-…`, guarda o dia 1 do caminho 2 e **não foi
  tocado**.

**Metro:**
- ficou parado antes deste run;
- nenhum flow teve `clearState`.

**Estado pré-montado:** o progresso das três trilhas anteriores foi gravado
direto no AsyncStorage, por decisão do dono. A trilha da H4 é a última, e o
app não abre o checkpoint de trilha que não esteja ativa. A evidência não
prova a passagem de uma trilha para a outra.

## Medido, inferido e não verificado

- **Medido:**
  - as telas e a árvore de acessibilidade de cada passo;
  - a ausência de respostas no AsyncStorage com o app fechado;
  - os limites do nó de vidas no padrão, no AX1 e no AX5;
  - o texto fixo em `CheckpointScreen.tsx:609` e `:637`.
- **Inferido:** o texto "10 questões" vem do desenho de avaliação única, que
  mudou em 2026-08-21. A inferência vem do comentário no próprio
  `CheckpointScreen.tsx`; o histórico do git não foi conferido.
- **Não verificado:**
  - o VoiceOver e o TalkBack;
  - o Android;
  - aparelho físico;
  - o kernel de retomada no ponto (`active`, que é só de desenvolvimento);
  - o alcance do botão "Iniciar checkpoint" no AX5;
  - os checkpoints 3 a 5;
  - o ciclo 2 e o `support-required`;
  - a razão de o tamanho de texto só valer depois de reabrir o app.

## Gate de qualidade

Este run só mexe em documentação e imagens. O gate do app não foi rodado de
novo além do `loop validate`, que roda a suíte inteira. A contagem citada no
STATUS continua a da frente 6: 148 suítes / 1379 testes, no branch.
