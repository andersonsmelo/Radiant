# G7 — vidas e meta diária leem `schemaVersion` — 2026-10-19

**Decisão do dono, em 2026-10-19 à noite, nesta conversa:** saída 1 para as
vidas e a meta diária; saída 2 para a agenda SM-2, a gamificação e o ledger de
cobrança. Saída 1 é "ler `schemaVersion` sem mudar o formato"; saída 2 é
"deixar como está até a primeira mudança de formato de cada uma". As duas
saídas e a recomendação estão na
[proposta](2026-10-19-g7-schema-desconhecido.md#as-stores-sem-schemaversion-proposta-ao-dono).

O dono também decidiu o comportamento da build antiga diante de vidas de uma
versão mais nova: **o gasto não fica salvo nem é guardado em memória**. Ele
aparece na tela que o recebeu, e a próxima leitura volta ao dado gravado.

## O que muda

A regra é a do G7: uma versão antiga não grava por cima de um store com
`schemaVersion` que não conhece. O predicado é o mesmo, de
`radiant-app/src/storage/schemaVersionGuard.ts`. Como essas duas stores nunca
gravaram `schemaVersion`, a lista de versões conhecidas é **vazia**: qualquer
versão declarada veio de uma build mais nova. O formato gravado não muda.

**[código]** Os escritores, enumerados por `git grep` das duas chaves e dos
serviços, e não só o óbvio:

| Chave | Escritor | Nesta frente |
| --- | --- | --- |
| `@radiant:hearts_v1` | `HeartsRepository.write`: leitura que não reconhece o registro (grava 5 vidas), recarga por tempo, gastar, ganhar na revisão, ilimitado | recusa |
| `@radiant:hearts_v1` | `LocalProgressAdapter.applyHearts`, mescla do backup do iCloud | recusa |
| `@radiant:hearts_v1` | `StorageMigration` (1.4) | fora: só roda com `APP_SCHEMA_VERSION` ausente, já barrado pela PR #61 **[inferido do código]** |
| `radiant:daily-goal:v1` | `DailyGoalService.saveStore`: virada do dia, XP, troca de nível | recusa |
| `radiant:daily-goal:v1` | `DailyGoalService.reset()` | fora: só a homologação do iOS chama, e apagar por pedido explícito continua valendo |

**Leitura diante de versão desconhecida:**
- vidas: usa `count`, `lastRefillAt` e `unlimitedUntil` se forem válidos,
  ignorando os campos a mais; senão, 5 vidas. Nada é gravado;
- meta diária: `loadStore` já usava só os quatro campos que conhece. Nada é
  gravado.

Store **sem** `schemaVersion` segue exatamente como antes: os testes que já
existiam continuam verdes sem mudança.

## Os vermelhos

Os 7 testes novos foram escritos antes do conserto e rodados na base
(`8a902e0`), no Node 20, com `npx jest --runInBand --ci` nos três arquivos:
7 falharam, 12 passaram ([saída](2026-10-19-g7-vidas-e-meta-diaria/vermelhos.txt)).
Cada um falhou pelo motivo previsto:

| Teste | Falha observada |
| --- | --- |
| vidas, `getSnapshot` não grava por cima | o store virou `{"count":5,"lastRefillAt":null,"unlimitedUntil":null}` |
| vidas, lê em memória os campos que conhece | devolveu 5 vidas, não 2 |
| vidas, `spend` devolve o gasto e não grava | devolveu 4, não 1 |
| vidas, sem campos que entenda | o store virou 5 vidas |
| mescla do iCloud nas vidas | `lastRefillAt` regravado de 11:00 para 11:30 |
| meta, `getSnapshot` na virada do dia | `setItem` chamado 1 vez |
| meta, `recordXp` | `setItem` chamado 1 vez |

Depois do conserto, os mesmos três arquivos: 19 de 19
([saída](2026-10-19-g7-vidas-e-meta-diaria/verde.txt)).

## Gates

- `EXPO_NO_DOTENV=1 npm run quality` em `radiant-app`, Node 20, em
  2026-10-19 às 19:52: saída 0, 179 suítes e 1.841 testes passando, e o
  `visual:qa:strict` sem regressão
  ([saída](2026-10-19-g7-vidas-e-meta-diaria/quality.log)).
- `loop validate`: registrado no run do Loop desta frente.
- Merge simulado com a `main`: [log](2026-10-19-g7-vidas-e-meta-diaria/merge-tree.log).
- **Merge real:** a [PR #64](https://github.com/andersonsmelo/Radiant/pull/64) entrou na `main` em 2026-10-19 às 20:00 (−03),
  conferido com `gh pr view 64 --json state` (`MERGED`).

## Limites

- **[não verificado]** Nenhuma volta de versão real com duas builds no mesmo
  aparelho. A prova é a dos testes de unidade.
- A proteção só existe a partir da build que levar o código. A `1.4.0`
  publicada continua gravando por cima.
- A agenda SM-2, a gamificação e o ledger seguem sem leitura de
  `schemaVersion`, por decisão do dono (saída 2).
