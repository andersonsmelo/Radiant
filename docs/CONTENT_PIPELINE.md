# Pipeline editorial do Radiant

## Objetivo

Manter conteúdo educacional versionado, rastreável, revisável e seguro para
promoção incremental ao app e à API.

`Conteúdo/` é a raiz editorial canônica. Todo artefato pedagógico deve preservar
proveniência até fonte, trecho e conceito. A expansão por competências acrescenta
decisões explícitas de direitos e mídia antes da produção de novas unidades.

## Estado validado em 2026-07-31

### Pipeline legado promovido

- 1 obra piloto processada;
- 75 páginas e 109 trechos extraídos;
- 109 classificações, 30 em `needs-review`;
- 16 conceitos, 7 em `needs-review`;
- 96 bundles em seis formatos, com 42 marcações `needs-review` derivadas;
- 18 atividades prontas nas trilhas Fundamentos, Tórax e Abdome;
- catálogo promovido sincronizável para app e seed da API.

### Nova biblioteca

- 41 PDFs no disco;
- 36 fontes únicas e 5 duplicatas detectadas por SHA-256;
- 4 fontes `authorized`;
- 15 fontes `reference-only`;
- 17 fontes `blocked`.

O catálogo está em `Conteúdo/fontes/library-catalog.json`. `reference-only`
autoriza apenas consulta factual com redação original; `blocked` impede qualquer
derivação editorial até nova decisão humana documentada.

### Mídia

`Conteúdo/mídia/manifest.json` está em
`awaiting-authorized-assets`: há 0 ativos aprovados e 5 candidatos rejeitados.
O validador exige autorização, SHA-256, modalidade, região, descrição acessível,
anonimização verificada e hotspots normalizados quando aplicáveis. O manifesto
verde sem itens confirma a integridade do gate, não a prontidão do lote.

## Fluxo vigente

1. Inventariar fonte e calcular SHA-256.
2. Registrar licença, uso comercial, usos permitidos e decisão humana.
3. Extrair páginas e trechos somente de fonte permitida para o uso pretendido.
4. Classificar trechos e normalizar conceitos.
5. Gerar bundles pedagógicos preservando proveniência.
6. Revisar e aprovar no painel editorial.
7. Promover com `scripts/content/promote-to-catalog.mjs`.
8. Sincronizar app e seed da API.
9. Validar a cadeia completa.

Para lotes curriculares v2, a promoção usa `ProductionBatchV1`, não o payload
legado. O lote carrega atividades, competências, fontes, checkpoint,
reforços, schemas, hash material e seis decisões independentes. Qualquer mudança
material altera o hash e invalida as decisões. A publicação em arquivo usa
compare-and-swap pelo hash esperado, temporário + `fsync` + rename atômico; o
changelog e a instrução de rollback vivem no mesmo catálogo para não existir
promoção parcial.

Para o sistema por competências, antes dos passos 3–8 também é obrigatório:

1. aprovar o lote de mídia no manifesto;
2. mapear atividade para competência observável;
3. revisar a unidade como lote completo;
4. provar checkpoint e retenção antes de expandir para a unidade seguinte.

## Ferramentas

| Comando | Finalidade |
| --- | --- |
| `node scripts/content/catalog-library-sources.mjs` | gera o inventário determinístico da biblioteca |
| `node scripts/content/validate-foundation.mjs` | valida a fundação editorial agregada |
| `node scripts/content/validate-media-manifest.mjs` | valida autorização e anonimização da mídia |
| `node scripts/content/promote-to-catalog.mjs` | promove bundles aprovados |
| `node scripts/content/production-batch.mjs --input=<json> --catalog=<json> --expected-sha256=<sha256\|absent>` | publica um `ProductionBatchV1` validado com concorrência otimista e rename atômico |
| `node --test scripts/content/production-batch.test.mjs` | prova gates, conflito de hash e rollback antes do rename |
| `node scripts/content/sync-catalog-to-app.mjs` | gera artefatos do catálogo local |
| `node scripts/content/sync-catalog-to-api.mjs` | gera o seed remoto correspondente |
| `node --test scripts/content/wave-1-priority-tracks.test.mjs` | protege as trilhas da Wave 1 |
| `node scripts/qa/wave-1-smoke.mjs` | verifica o fluxo local da Wave 1 |

## Fontes de verdade

- `Conteúdo/fontes/library-catalog.json`: inventário e direitos da nova
  biblioteca;
- `Conteúdo/mídia/manifest.json`: ativos aprovados e candidatos rejeitados;
- `Conteúdo/governança/catalog-payload.json`: catálogo legado promovido;
- `radiant-app/src/features/student-checkpoints/production-batches.ts`: batches
  v2 promovidos compilados pelo app;
- `Conteúdo/governança/wave-1-priority-tracks.json`: trilhas prioritárias;
- `radiant-app/src/data/ai-lessons.ts` e `ai-catalog.ts`: artefatos gerados;
- `radiant-api/sql/003_seed_editorial_catalog.sql`: espelho gerado para a API.

## Regras de publicação

- nunca copiar texto ou imagem de obra comercial sem permissão compatível;
- nunca inferir autorização pelo nome ou pela origem aparente do arquivo;
- nunca promover mídia sem manifesto e anonimização verificadas;
- nunca substituir o catálogo local por payload remoto inválido;
- nunca editar manualmente os artefatos gerados do app ou da API;
- depois de aprovar bundles, sincronizar app e API antes do commit;
- declarar o catálogo pronto somente com os gates correspondentes executados.
- nunca reutilizar uma aprovação depois de mudança no hash material;
- nunca publicar lote v2 sem os seis gates ou sem o hash esperado do catálogo.
