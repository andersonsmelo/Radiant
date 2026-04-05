# Formatos

Esta pasta guarda os artefatos pedagógicos gerados a partir dos conceitos canônicos.

## Estado atual

O primeiro ciclo do pipeline já chega até aqui com o livro-piloto `Fundamentos de Radiologia`.
Todos os `96` bundles do piloto foram gerados, revisados e aprovados.
O `catalog-payload.json` v1.0.0 foi promovido e integrado ao app.

## Formatos

- `microlições/`
- `quizzes/`
- `reviews/`
- `casos/`
- `checkpoints/`
- `rewards/`

## Arquivos por fonte

Cada `{formato}/{fonte}/` pode conter:

- `bundles.json` — bundles determinísticos (geração clássica, `reviewStatus: "approved"`)
- `ai-bundles.json` — bundles gerados por IA (geração AI, `reviewStatus` começa como `"pending"`)
- `format-job.json` — metadados do job de geração

## Fluxo de promoção

Aprovação no painel editorial → `promote-to-catalog.mjs` → `catalog-payload.json` → `sync-catalog-to-app.mjs` → app

## Regras

- cada bundle precisa apontar para `conceptIds` e `sourceExcerptIds` reais
- cada bundle deve preservar a proveniência até o conceito de origem
- `ai-bundles.json` nunca substitui `bundles.json` — são camadas independentes
