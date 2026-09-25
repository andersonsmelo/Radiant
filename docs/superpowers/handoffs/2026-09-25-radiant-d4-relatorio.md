# Relatório — D4: propostas do agente e camada de decisões de revisão (2026-09-25)

**Frente:** item 7 do [prompt (5)](2026-09-25-radiant-prompt-de-continuidade-5.md).
**Branch:** `feat/d4-decisoes-de-revisao`, sobre `fix/renovacao-desconhecida`.
Sem push.

**Condição de pronto, combinada com o dono:**
- o agente propõe destino e motivo para os 19;
- as propostas ficam num arquivo versionado de decisões, que o classificador lê
  e que tem teste;
- os registros continuam `needs-review` até um humano aprovar;
- a cadeia de baixo só é registrada, sem regerar nada.

## O que foi feito

| Run | Conteúdo |
| --- | --- |
| `run-1790362482566-b0117998` → `f39ec65` | Abre a janela de `Conteúdo/classificação` na grafia do disco. Religa duas guardas que nenhum gate executava |
| `run-1790362692639-523c7fd5` | Camada `review-decisions.json` no `classify-source.py`, as 19 propostas, a regeneração e os documentos |
| terceiro run | Fecha a janela |

Detalhe, tabela das 19 e medição da cadeia:
[`docs/content/2026-09-25-d4-propostas-e-cascata.md`](../../content/2026-09-25-d4-propostas-e-cascata.md).

## Medido

- **A regeneração é idempotente.** Antes da mudança, rodar o classificador
  reproduziu `classifications.json` e `classification-job.json` byte a byte.
  Depois dela, o diff só acrescenta: 19 blocos `reviewProposal`, sem nenhuma
  linha removida. As contagens seguem 105 / 86 / 19.
- **O `classify-source.test.py` tem 23 testes verdes**, 14 deles novos, no
  Python 3.9.6 do sistema, que é o mesmo do validador. Nenhum `__pycache__`
  foi gerado.
- **Os 14 testes novos foram vistos vermelhos:**
  - 11 pela função inexistente;
  - o de integração pela falta de `reviewProposal`;
  - os 2 últimos, de ação desconhecida e de arquivo ausente, por mutação.

  **Treze guardas** foram derrubadas, cada uma pelo defeito específico
  injetado. O arquivo foi restaurado e conferido por `cmp` depois.
- **O `validate-foundation.test.mjs` foi visto vermelho** antes da correção
  (esperava 109 e recebeu 105), e fica verde depois dela.
- **O catálogo do app sai de `ai-bundles.json`**, que está 96 de 96
  `approved`, e **não** dos `bundles.json` determinísticos. O
  `catalog-payload.json` já leva os 16 conceitos.

## Inferido, não verificado

- **Os destinos propostos são leitura do agente**, não revisão de domínio. Em
  dois deles, p60 e p71, há uma alternativa plausível, anotada no motivo.
- **Não sei quem marcou os `ai-bundles.json` como `approved`,** nem com que
  critério. O gerador escreve `pending`.

## Correção de uma afirmação desta sessão

Na conversa, antes de medir o promotor, eu disse ao dono que regerar a cadeia
**colocaria lições novas no app**. **Estava errado:** o promotor lê os bundles
de IA, que já estão todos aprovados. A decisão de só registrar a cadeia
continua válida, mas o motivo é outro: a cadeia não governa o app.

## Resposta do dono, no mesmo dia

- **Aprovou as propostas** e o nó de radioterapia. Foram aplicados em mais três
  runs:
  - `run-1790364136807-f099f189` → `d152863` reabre a janela;
  - `run-1790364288998-acaf23f3` cria o `planet-radioterapia` (`planned`) e
    aprova 18 decisões;
  - um run final fecha a janela.

  O resultado são 104 registros `approved` e 1 `needs-review`. O p30 e o p32
  foram para o planeta novo, e não para Modalidades.
- **Três guardas novas** foram vistas falhando, cada uma pelo defeito
  específico: um planeta nascendo `active`, uma lição mapeada num planeta
  `planned` e uma decisão aprovada tratada como proposta.
- **O push está autorizado a partir de 2026-09-25.** A partir desse dia sai
  uma PR por dia, às 21 h, com o acumulado.

## Pendente

- **Dono, que pediu mais informação:**
  - como representar uma exclusão (p1);
  - o que a D4 ainda bloqueia, dado o V3.
- **Agente:** a PR das 21 h de 2026-09-25, com este branch. Ele está empilhado
  sobre a #37.
- **Não feito:** o `validate-foundation` não confere se o
  `review-decisions.json` e o `classifications.json` estão em dia um com o
  outro. Uma decisão editada sem regerar passa pelo gate.
