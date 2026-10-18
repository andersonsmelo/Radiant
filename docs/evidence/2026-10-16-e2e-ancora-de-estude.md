# E2E — âncora de Estude depois da trilha centralizada (FILA 46)

Medido em 2026-10-16, no simulador `Radiant E2E item 38`
(`0A1B5AAA`, iOS 26.5), com o build Debug e o Metro da árvore local. Maestro
2.7.0.

## Causa

Desde o `f39ac9e`, a trilha abre centralizada no PRÓXIMO. O cabeçalho de
estágio, com o rótulo `"<trilha>. N de M etapas concluídas."`, fica acima da
tela, e os roteiros o usavam como âncora da aba Estude. `learning-critical-path`
reprovou ([pacote de confiança](2026-10-16-pacote-de-confianca-da-trilha.md)).

## Conserto

Os 12 roteiros que usam a âncora agora esperam `journey-trail` e rolam para
cima até o cabeçalho antes de afirmá-lo. O FILA 46 falava em 13 roteiros, mas
a contagem por `grep` dá 12.

Em `reward-unlock`, as oito rolagens até o cabeçalho ganharam `timeout: 120000`.
O padrão do Maestro é 20 s. O contrato Maestro proíbe trocar a espera da tela
por prazo, e isso continua valendo: aqui a trilha já está na árvore, e o
cabeçalho existe, só que acima da dobra. Como o fundo animado não deixa a tela
assentar, cada tentativa custa ~8 s.

A distância cresce a cada lição concluída. Depois da 1ª lição, o convite do
lembrete diário também sobe por cima do cabeçalho.

Tempos das oito rolagens na execução aprovada:

| Rolagem | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Duração (s) | 0,1 | 7,9 | 16,5 | 24,9 | 33,2 | 32,9 | 41,1 | 50,1 |

Na execução reprovada, a 4ª rolagem estourou os 20 s padrão aos 25 s. A
hierarquia final mostrava o cabeçalho inteiro na tela (`[16,293][386,381]`):
faltou prazo, não seletor. Com 60 s, a execução passou, mas a 8ª rolagem ficou
com 10 s de folga. O prazo final é 120 s, o que dá mais que o dobro da
rolagem mais longa.

## Resultados

- `npm run test:maestro-contract`: 29/29.
- Bateria padrão na sessão anterior, com a âncora já corrigida: 7 de 8. Passaram
  `first-run`, `boot-to-home`, `learning-critical-path`, `offline-relaunch`,
  `reward-locked`, `radiant-1-4-primeira-execucao` e
  `radiant-1-4-vidas-esgotadas`. Reprovou `reward-unlock`, como descrito acima.
- `reward-unlock`, com prazo de 60 s: **passed**, 153 passos em 11 min 10 s.
  A versão com 120 s só afrouxa o limite e não foi executada de novo.

## Limites

- Não foram executados depois do conserto: `rating-prompt`, `store-capture` e
  os três `student-checkpoint-*`. A mudança neles é a mesma rolagem, mas sem
  execução.
- O `store-capture` passa a encontrar o convite do lembrete em Estude depois da
  1ª lição. Mantê-lo nas capturas de loja é decisão do dono.
- O custo de ~8 s por tentativa vem do fundo animado e vale para todo roteiro.
  Nenhum outro roteiro passa de duas lições antes de rolar até o cabeçalho.
