# Extrações

Esta pasta guarda os jobs e artefatos de extração derivados das fontes registradas.

## Regras

- cada job de extração deve apontar para uma `sourceId`
- jobs começam como `pending` e avançam para `extracted` quando os artefatos são materializados
- a pasta do job deve conter, no mínimo, `pages.json` e `excerpts.json`
- extração real só entra depois que a fonte estiver registrada
- o job piloto usa extração por texto embutido com `pypdf`

## Job piloto atual

- `extract:fundamentos-de-radiologia-everton-costa-pinto`
- estado: `extracted`
