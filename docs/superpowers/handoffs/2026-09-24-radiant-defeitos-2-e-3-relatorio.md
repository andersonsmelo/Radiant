# Defeitos 2 e 3 do E2E — relatório (2026-09-24)

Frente 6 do [prompt de continuidade (2)](2026-09-24-radiant-prompt-de-continuidade-2.md),
na parte destravada: os defeitos 2 e 3 que o
[E2E dos caminhos dourados](2026-09-24-radiant-e2e-caminhos-dourados-relatorio.md)
expôs. O defeito 1 espera a decisão do dono (item 5) e não foi tocado.

- **Branch:** `fix/e2e-defeitos-2-e-3`. Saiu da branch de documentação
  `docs/prompt-continuidade-2026-09-24-2`, que está empilhada sobre a #32. É
  local, sem push.
- **Build, simulador e flow:** nenhum.

## Defeito 2 — "Próxima revisão em 2 dias" para revisão a 24 h

- **Run:** `run-1790264575429-172de974`, `closed`. Os 14 validadores
  passaram, e não houve memória a gravar.
- **Commit:** `66cba85`.
- **Causa:**
  - o SM-2 carimba o cartão com o próprio relógio
    (`SpacedRepetitionService.applySM2`) alguns milissegundos depois do
    `answeredAt`;
  - o resumo contava os dias a partir do `answeredAt`, com `Math.ceil`. Com
    24 h + 1 ms, o resultado era 2.
- **Correção:**
  - o cálculo foi extraído, primeiro sem alteração, para
    `radiant-app/src/features/lesson-flow/services/nextReviewInDays.ts`;
  - quando esta resposta carimbou o cartão (`lastReviewedAt >= answeredAt`), a
    contagem parte do carimbo dele. Nos outros casos, o `Math.ceil` continua
    partindo da resposta.
- **Vermelho visto antes da correção**, com a extração ainda igual ao código
  original, Node `v20.20.2`:

  ```
  ✕ anuncia 1 dia para a revisão de 24 h carimbada 1 ms depois da resposta (defeito 2 do E2E)
  ✕ não converte a demora do armazenamento num dia a mais
  ✓ arredonda para cima quando o cartão não foi carimbado por esta resposta
  ✓ não anuncia dias negativos para cartão já vencido
      Expected: 1
      Received: 2
  Tests:       2 failed, 2 passed, 4 total
  ```

  Os dois casos verdes são de validade: cartão não carimbado nesta resposta e
  cartão vencido. Eles impedem uma correção que só troque o `ceil` por um
  arredondamento cego.

## Defeito 3 — resumo de vidas cortado na trilha

- **Run:** `run-1790264858438-25aad92c`. É o run deste relatório. O estado
  final está abaixo.
- **Causa:** em `HUD.tsx`, o contêiner `heartsControlContent` punha os cinco
  corações de 28 pt e o texto `0 · +1 em 24 min` na mesma linha, e as
  larguras se somavam.
- **Correção:** o contêiner passou a ser uma coluna. O resumo fica sob os
  corações, alinhado à direita, e o texto não mudou.
- **O teste:**
  - o Jest não mede layout;
  - a asserção fica no valor que decide a largura: a direção do contêiner
    comum aos corações e ao resumo;
  - a busca inclui os nós ocultos da acessibilidade, porque dentro do botão os
    corações ficam ocultos.
- **Vermelho visto antes da correção:**

  ```
  ✕ empilha o resumo sob os corações, e não ao lado deles (5 ms)
    Expected: "column"
    Received: "row"
  Tests:       1 failed, 34 passed, 35 total
  ```

## Gate

`EXPO_NO_DOTENV=1 npm run quality`, em `radiant-app`:
- **Ambiente:** Node `v20.20.2`, em 2026-09-24, sobre a árvore do branch com os
  dois defeitos corrigidos. Não havia Metro nem flow rodando.
- **Resultado:** **exit 0**.
- **Suíte inteira:** **148 suítes / 1379 testes** Jest. Antes eram 147 / 1374;
  entraram a suíte nova do defeito 2, com 4 testes, e 1 teste no HUD.
- **Lint:** 0 erros e 26 avisos, os mesmos de antes.
- **Visual QA estrito:** 0 regressões.

## Medido, inferido e não verificado

- **Medido:**
  - os dois vermelhos acima;
  - os verdes depois de cada correção;
  - o gate;
  - os validadores do Loop do run do defeito 2.
- **Inferido do código, não medido:** a correção do defeito 3 cabe no iPhone
  17. A conta, com os tamanhos do código:
  - margens de 40 pt, pílulas de XP e sequência com cerca de 150 pt, botão
    com 24 pt de padding e cinco corações com 152 pt dão cerca de 370 pt;
  - a tela tem 402 pt de largura;
  - antes, o resumo ao lado somava cerca de 105 pt, o que bate com o x=443
    medido.

  Com o XP na casa das dezenas de milhares, a folga cai para perto de zero.
  O HUD também fica cerca de 14 pt mais alto, por causa da segunda linha.
- **Não verificado:**
  - **a tela, nos dois defeitos.** O dono decidiu deixar a conferência visual
    para depois do dia 2 do caminho 2, porque o Metro serviria o JS novo ao
    binário do dia 1;
  - texto grande: fica com a H4.

## O que fica

- **Depois do dia 2 do caminho 2** (2026-09-25, a partir de 11:55):
  - capturar a trilha com vidas em recarga no iPhone 17;
  - capturar o resumo de uma lição concluída, para ver "Próxima revisão em 1
    dia".
- **Defeito 1:** espera a decisão do dono (item 5).
- **Integração:** push e PR deste branch, depois do merge da #32 e da PR de
  documentação, de cima para baixo. Decisão do dono.
- **Item 1 da lista, fora do projeto:** a chave da Brevo continuava na linha
  de comando do processo `mcp-remote` em 2026-09-24, por volta das 12:50. Ela
  apareceu de novo na saída de um `pgrep` desta sessão. A chave não foi
  copiada para nenhum arquivo.
