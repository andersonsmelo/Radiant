# Radiant — Execution Status (2026-04-05)

## Resumo executivo

Em 2026-04-05, o pipeline editorial fechou o ciclo completo ponta a ponta:
geração de bundles AI → aprovação editorial → promoção para catálogo → integração no app.

O app agora carrega `16` lições ricas geradas a partir da obra-piloto como track primário.

## O que foi feito

### Pipeline de conteúdo AI

- `96` bundles gerados diretamente por Claude Code (sem chamadas de API externas)
  via `scripts/content/generate-local-bundles.py` (`GENERATOR_VERSION = "claude-code-local-v1"`);
- conteúdo em português do Brasil, pedagogicamente estruturado para técnicos de radiologia;
- formato: `16` conceitos × `6` tipos (`microlições`, `quizzes`, `reviews`, `casos`, `checkpoints`, `rewards`);
- todos os bundles aprovados via script de aprovação em lote e painel editorial.

### Promoção para catálogo

- `scripts/content/promote-to-catalog.mjs` coletou todos os bundles aprovados,
  ordenou pela sequência de aprendizagem e gerou `conteúdo/governança/catalog-payload.json` v1.0.0;
- o catálogo agrupa `96` bundles em `6` tracks por formato.

### Integração no app

- `scripts/content/sync-catalog-to-app.mjs` converteu os `16` quizzes do catálogo
  para `QuizLesson[]` e gerou:
  - `radiant-app/src/data/ai-lessons.ts` — `16` lições, `2` questões cada
  - `radiant-app/src/data/ai-catalog.ts` — track AI + summaries
- `radiant-app/src/data/catalog.ts` foi atualizado para incluir o track AI como track primário
  (`initialLessonId` = primeira lição AI);
- `LessonCatalogService` foi atualizado para incluir `AI_LESSONS` na base local;
- TypeScript: zero erros (`tsc --noEmit` limpo).

### Painel editorial

- `tools/editorial-panel/` — Next.js 15, porta 3001;
- 4 superfícies: Status / Bundles / Grafo / Promover;
- bundle completo compilado sem erros.

## Artefatos gerados

| Artefato | Caminho |
|---|---|
| Bundles AI (96) | `conteúdo/formatos/**/ai-bundles.json` |
| Catálogo promovido | `conteúdo/governança/catalog-payload.json` |
| Lições AI (geradas) | `radiant-app/src/data/ai-lessons.ts` |
| Catálogo AI (gerado) | `radiant-app/src/data/ai-catalog.ts` |
| Script de geração | `scripts/content/generate-local-bundles.py` |
| Script de promoção | `scripts/content/promote-to-catalog.mjs` |
| Script de sync | `scripts/content/sync-catalog-to-app.mjs` |

## Fluxo de atualização (para novas versões)

```bash
# 1. Gerar/regenerar bundles
python3 scripts/content/generate-local-bundles.py

# 2. Aprovar bundles (painel ou script)
cd tools/editorial-panel && npm run dev  # porta 3001

# 3. Promover para catálogo
node scripts/content/promote-to-catalog.mjs

# 4. Sincronizar para o app
node scripts/content/sync-catalog-to-app.mjs

# 5. Validar fundação editorial
node scripts/content/validate-foundation.mjs

# 6. Validar TypeScript
cd radiant-app && npx tsc --noEmit
```

## Próximos passos

- teste do app com as 16 lições AI em simulador iOS;
- curadoria dos `30` registros de classificação e `7` conceitos em `needs-review`;
- segunda fonte (novo livro) no pipeline editorial;
- Learning Road V2: RewardScreen galáctico, animações de desbloqueio.
