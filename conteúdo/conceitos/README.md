# Conceitos

Esta pasta guarda os conceitos canônicos consolidados a partir dos trechos já classificados.

## Como funciona

- cada obra aprovada pela classificação ganha um `concept-job.json`
- o normalizador escreve um `concepts.json` com conceitos canônicos e rastreáveis
- cada conceito preserva `sourceExcerptIds` e `sourceClassificationIds`
- a taxonomia usada precisa continuar válida em `galaxyId`, `planetId` e `starId`

## Regras

- cada conceito nasce de `conteúdo/classificação/`
- cada conceito aponta para `sourceExcerptIds` rastreáveis
- cada conceito preserva `galaxyId`, `planetId` e `starId`
- nada entra em `formatos/` sem passar por esta camada

## Obra piloto atual

- `Fundamentos de Radiologia` (`source:fundamentos-de-radiologia-everton-costa-pinto`)

Snapshot atual do piloto:

- `16` conceitos canônicos
- `7` itens em `needs-review`
- todos os conceitos preservam `sourceExcerptIds` e `sourceClassificationIds`
