# Conteúdo Radiant

Raiz editorial do Radiant para transformar livros e materiais em uma base de conhecimento cumulativa.

## Estrutura

- `fontes/`: obras e materiais brutos
- `extrações/`: trechos extraídos das fontes
- `classificação/`: mapeamento de trechos para taxonomia
- `conceitos/`: conhecimento consolidado em conceitos canônicos
- `taxonomia/`: galáxias, planetas e estrelas
- `formatos/`: artefatos pedagógicos gerados
- `governança/`: contratos, critérios e regras editoriais

## Regra principal

Nada entra em `formatos/` sem passar por:

1. fonte
2. extração
3. classificação
4. conceito

## Obra piloto atual

- `Fundamentos de Radiologia` (`source:fundamentos-de-radiologia-everton-costa-pinto`)

## Fase atual

O sistema já consegue:

- registrar uma obra como fonte
- indexar a fonte em JSON
- abrir um job de extração pendente para a obra piloto
- extrair a obra piloto em páginas e trechos
- classificar os trechos da obra piloto contra a taxonomia MVP
- consolidar a obra piloto em conceitos canônicos rastreáveis
- gerar `microlições`, `quizzes`, `reviews`, `casos`, `checkpoints` e `rewards` a partir desses conceitos
- revisar e aprovar bundles via painel editorial (`tools/editorial-panel/`)
- promover bundles aprovados para `catalog-payload.json` via `promote-to-catalog.mjs`
- sincronizar o catálogo para o app via `sync-catalog-to-app.mjs`

## Snapshot do piloto

Estado consolidado em 2026-04-05 para `Fundamentos de Radiologia`:

- `75` páginas extraídas
- `109` excerpts extraídos
- `109` classificações, `30` em `needs-review`
- `16` conceitos canônicos, `7` em `needs-review`
- `96` bundles totais — todos aprovados
- `catalog-payload.json` v1.0.0 promovido
- `16` lições AI ativas no catálogo do app (`ai-lessons.ts`)

## Fluxo de promoção

```
conteúdo/formatos/**/ai-bundles.json
    ↓ tools/editorial-panel/ (revisão + aprovação)
    ↓ node scripts/content/promote-to-catalog.mjs
conteúdo/governança/catalog-payload.json
    ↓ node scripts/content/sync-catalog-to-app.mjs
radiant-app/src/data/ai-lessons.ts + ai-catalog.ts
```

## Validação

- comando oficial: `node scripts/content/validate-foundation.mjs`
- o pipeline editorial só deve ser considerado íntegro quando esse comando retorna `ok: true`
