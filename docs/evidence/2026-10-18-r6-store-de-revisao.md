# R6: capacidade do store de revisão e quarentena do registro inválido

**Data:** 2026-10-18. **Autor:** Claude Opus 5.5. **Base:** `main` em `e2e0524`.
**Origem:** os achados A2 e A3 da
[revisão do trabalho do Codex](../trilha/avaliacoes/2026-10-17-revisao-do-trabalho-do-codex.md),
e o item R6 da §4 do prompt de continuidade (19).

**Decisões do dono, tomadas na conversa em 2026-10-18:**
- o registro inválido vai para uma chave própria, e não é descartado;
- o cartão em quarentena sai da agenda. O item volta quando o aluno o estuda de
  novo, e uma lição sem nenhum cartão volta pela semeadura do legado.

Trocar o storage (particionar ou SQLite) continua sendo decisão do dono e não
entrou aqui.

## Medição (A2)

[medido] O
[`ItemReviewRepository.capacity.bench.ts`](../../radiant-app/src/features/spaced-repetition/repositories/ItemReviewRepository.capacity.bench.ts)
monta o store pela própria API do repositório, em lotes de 2.000, com
identificadores no comprimento dos do catálogo V2. Depois mede, em mediana de 5
rodadas, a leitura fria, a leitura com o cache, a escrita de uma resposta sem
cache e a com cache. A leitura fria é um storage novo, sem o snapshot validado.
Fica fora da suíte, porque o `testMatch` só coleta `*.test.*`. Os números
brutos estão em [`medicao.json`](2026-10-18-r6-store-de-revisao/medicao.json).

| Cartões | Tentativas | Tamanho | Dos 6 MB do Android | Leitura fria | Leitura com cache | Escrita fria | Escrita com cache |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1.000 | 1.000 | 1,09 MiB | 18% | 18 ms | 1 ms | 20 ms | 2 ms |
| 5.000 | 2.000 | 4,01 MiB | 67% | 61 ms | 3 ms | 67 ms | 11 ms |

- **[medido]** Cada registro ocupa de 572 a 600 bytes, o que confirma a
  estimativa do Codex (581 e 588).
- **[medido]** Com a quarentena, os tempos ficam no ruído: 63 ms contra 61 ms na
  leitura fria de 5.000, e o mesmo tamanho.
- **[inferido]** Com 5.000 cartões, o store sozinho usa dois terços do banco
  padrão de 6 MB do AsyncStorage no Android, que as outras chaves do app
  dividem. Isso confirma o A2: o desenho de um valor único não chega ao teto
  declarado de 20.000.
- **[não medido]** Os tempos são do Node no Mac. Um Android de entrada é mais
  lento, e esse número é do G6.

## Quarentena (A3)

Antes, `load()` validava tudo ou nada: um cartão ou uma tentativa inválidos
deixavam o store ilegível, e o `loadQueue` lançava `review-store-unavailable`.
Agora:

- **Envelope inválido** (schema futuro, JSON quebrado, tetos, falha de leitura):
  nada muda. O store fica indisponível, sem escrita por cima, como o teste
  existente já fixava.
- **Envelope válido com registro inválido:** o cartão ou a tentativa inválidos
  saem do store, e o resto segue. Um registro nulo ou de outro tipo também
  conta como inválido, em vez de derrubar o validador. A tentativa repetida fica
  com a primeira cópia.
- **A quarentena** (`@radiant:item_review_quarantine_v1`) guarda o registro
  original, o tipo, a chave do cartão e a data, sem repetir o que já guarda, e
  mantém as 200 entradas mais recentes.
- **A ordem é quarentena primeiro, store depois.** Se a quarentena não grava,
  ou se a que existe está ilegível, o store fica como estava e indisponível.
  Nenhum registro se perde.
- **`clear()`** apaga também a quarentena.

### Vermelho antes do conserto

[medido] Os testes novos, contra o código sem a quarentena: **7 falharam e 35
passaram** ([saída](2026-10-18-r6-store-de-revisao/jest-vermelho.txt)). Os
sete falham pelo motivo previsto: o store indisponível no repositório e
`review-store-unavailable` no `loadQueue`, que é o sintoma do A3.

Três testes novos passaram já no vermelho, porque guardam um comportamento que
só existe depois do conserto: a quarentena que não grava, a quarentena
ilegível e o `clear`. Eles foram vistos falhando por injeção, abaixo.

### Cada guarda, vista falhando pelo defeito que nomeia

[medido] O script troca uma âncora única do repositório, roda só o teste-alvo e
restaura o arquivo ([execuções e script](2026-10-18-r6-store-de-revisao/injecoes.txt)):

| Injeção | Teste que reprova |
| --- | --- |
| store regravado antes da quarentena | sem conseguir gravar a quarentena… |
| falha da quarentena engolida | sem conseguir gravar a quarentena… |
| quarentena ilegível tratada como vazia | uma quarentena existente ilegível… |
| sem deduplicar a quarentena | …a nova tentativa não duplica a entrada |
| sem o teto da quarentena | …até o teto |
| `clear` sem apagar a quarentena | clear apaga também a quarentena |
| a tentativa repetida não é descartada | tentativa repetida fica com a primeira… |

Com tudo restaurado: 6 suítes e 96 testes em `src/features/spaced-repetition`.

## Gates

O `loop validate` do run `run-1792351847847-47001797` roda o
`EXPO_NO_DOTENV=1 npm run quality` do CI e os outros 14 validadores. O
resultado está no envelope do run e no relatório da sessão.

## Limites

- A medição é do JS no Node, e não do aparelho (G6).
- Nada no app lê a quarentena. Recuperar um registro dela é trabalho manual, e
  não há telemetria do evento, porque o analytics espera a FILA 43.
- O A2 continua aberto: a quarentena não muda o tamanho do store.
