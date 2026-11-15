# Evidência da F3 da 1.6: sons e microinterações (2026-11-15)

Frente F3, branch `claude/f3-sons-e-microinteracoes-db21d1`. Decisões na
[ADR 2026-11-15](../../adr/ADR-2026-11-15-retorno-rico-da-aula.md); plano em
[`plans/2026-11-15-f3-sons-e-microinteracoes.md`](../../plans/2026-11-15-f3-sons-e-microinteracoes.md).

| Arquivo | O que prova |
| --- | --- |
| [`levantamento.md`](levantamento.md) | Quem tocava som, quem vibrava e o que animava antes da F3, com caminho e linha; os nove momentos mudos ou parados |
| [`sons.md`](sons.md) | Comando gerador, duração, pico, média e SHA-256 dos dois sons novos, e o nivelamento contra os nove existentes |
| [`vermelho.txt`](vermelho.txt) | Cada asserção nova vista falhando: primeiro pela ausência do comportamento, depois por mutações que reproduzem o defeito que ela nomeia (chave vazando, preferências ignoradas, duração da base, `advance` no conferir, cunhagem da zero estrela) |
| [`desempenho.txt`](desempenho.txt) | Commits e tempo de render no JS antes e depois, na cena de diálogo e na ficha do cloze; onde roda cada animação nova |
| [`simulador.txt`](simulador.txt) | O roteiro M01.03 no simulador com a chave ligada e cada som identificado no log, mais o que não foi visto nem ouvido |
| [`revisao.md`](revisao.md) | Achados da revisão independente e o que foi feito com cada um |

**Gate, 2026-11-15 às 16h08:** `cd radiant-app && EXPO_NO_DOTENV=1 npm run quality`,
Node 20.20.2, código 0: 238 suítes e 3.315 testes no Jest, 17 contratos `node --test`
e QA visual estrito sem regressão. Medido sobre esta worktree com a árvore declarada
no run, sem arquivo de outra sessão.
