# ADR — H3 compara somente partidas frias de `first_frame` (2026-08-13)

**Status:** aceita e implementada
**Decisor:** Anderson (proprietário do projeto)
**Contexto de origem:** gate H3 de runtime interno de checkpoints

## Contexto

O flow `active` do H3 faz dois lançamentos por amostra: um lançamento frio e um
relançamento que prova a retomada offline. A primeira coorte completa registrou
42 `first_frame` no active contra 20 no baseline. O relançamento é
sistematicamente mais rápido, portanto agregá-lo no mesmo p95 desloca a população
do candidato e torna a comparação com o baseline inválida.

Inferir a fase pela posição das linhas não é seguro: retentativas e eventos extras
mudam a ordem sem produzir um erro visível.

## Decisão

Cada envelope `first_frame` usa `schemaVersion: 2` e declara `launchPhase`:

- `cold` para o lançamento inicial sem checkpoint recuperável;
- `resume` para oferta ou fallback de retomada.

O gate `first_frame_delta` compara somente as amostras `cold`. Um gate de
população exige exatamente 20 `cold` no baseline, 20 `cold` e 20 `resume` no
active; qualquer divergência resulta em `inconclusive`.

## Consequências

- o relançamento permanece obrigatório para provar recovery, mas não entra no p95
  de partida;
- logs legados sem fase não podem promover H3;
- retries e linhas extras falham fechados em vez de alterar silenciosamente a
  distribuição;
- a nova coorte continua dependente de host silencioso e não promove produção,
  OTA, TestFlight, App Store ou versão.

## Alternativa descartada

Remover o relançamento do flow active: simplificaria a distribuição, mas retiraria
do mesmo fluxo a prova de retomada offline que H3 precisa preservar.
