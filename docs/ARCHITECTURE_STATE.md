# Radiant — estado arquitetural

## Produto vigente

Radiant é um app Expo/React Native local-first. Catálogo, lições, progresso e
revisões permanecem utilizáveis sem backend. A API Fastify/PostgreSQL existe
para autenticação e sincronização, mas a API pública conhecida está registrada
como inativa (HTTP 502) no
[`status canônico`](EXECUTION_STATUS_2026-07-29.md) e não faz parte do caminho
crítico do teste fechado.

Componentes principais:

- `radiant-app/src/app`: única árvore oficial de rotas;
- `LessonCatalogService`: fachada do catálogo local/remoto;
- `JourneyDefinitionService`: projeta trilhas do catálogo para a jornada;
- `JourneyProgressService`: mantém seleção e progresso por trilha;
- `LessonOutcomeService`: registra resultado, XP e evidência de conclusão;
- `Conteúdo/`: pipeline editorial com proveniência;
- `radiant-api/`: auth, sync e catálogo remoto opcional.

## Jornada atual

A Learning Road V2 usa `journey-progress.v2`, preserva progresso separado por
trilha e migra o store legado quando possível. O catálogo runtime expõe
Fundamentos, Tórax e Abdome; as 18 atividades existentes continuam sendo o
baseline compatível durante a evolução.

Regra arquitetural: alternar trilhas não apaga progresso, uma falha de sync não
bloqueia o estudo e estados vazios devem manter continuidade no fluxo principal.

## Evolução por competências

A decisão de 2026-07-31 introduz um contrato de atividade v2 com renderizadores
reutilizáveis, tentativas estruturadas e domínio por competência. A Galáxia
deverá se tornar uma projeção da mesma jornada canônica, não uma segunda árvore
de progresso. O catálogo legado será preservado por adaptador durante a
migração.

Fluxo-alvo:

```text
fonte + decisão de direitos
          ↓
conceito + competência + atividade
          ↓
revisão humana da unidade
          ↓
catálogo canônico
     ↙          ↘
jornada        Galáxia
     ↓
tentativa → domínio → revisão espaçada
```

Estado de implementação:

- governança das novas raízes editoriais: concluída;
- catálogo dos 36 documentos únicos: concluído;
- validação do manifesto de mídia: concluída;
- primeiro lote de mídia aprovado: pendente (`0` aprovados, `5` rejeitados);
- grafo curricular e motor de atividades v2: não iniciados.

## Contratos editoriais

- `Conteúdo/fontes/library-catalog.json`: inventário por SHA-256 e decisão de
  direitos;
- `Conteúdo/mídia/manifest.json`: autorização, anonimização, acessibilidade e
  regiões interativas;
- `Conteúdo/governança/catalog-payload.json`: catálogo promovido legado;
- `scripts/content/validate-foundation.mjs`: gate agregado;
- `scripts/content/validate-media-manifest.mjs`: gate específico de mídia.

Fonte `reference-only` serve somente para consulta factual e redação original.
Fonte `blocked` não alimenta conteúdo. Nenhum ativo de imagem entra no app sem
autorização e anonimização verificadas.

## Fontes de verdade

| Tema | Documento |
| --- | --- |
| Estado operacional | [`EXECUTION_STATUS_2026-07-29.md`](EXECUTION_STATUS_2026-07-29.md) |
| Produto | [`PRD.md`](PRD.md) |
| Roadmap | [`plans/2026-07-27-radiant-launch-roadmap.md`](plans/2026-07-27-radiant-launch-roadmap.md) |
| Pipeline editorial | [`CONTENT_PIPELINE.md`](CONTENT_PIPELINE.md) |
| Runtime do app | [`../radiant-app/README.md`](../radiant-app/README.md) |
| Runtime da API | [`../radiant-api/README.md`](../radiant-api/README.md) |
| Decisão educacional | [`adr/ADR-2026-07-31-aprendizagem-por-competencias.md`](adr/ADR-2026-07-31-aprendizagem-por-competencias.md) |

## Regras de consistência

- o status canônico governa o presente; snapshots anteriores são históricos;
- arquivos gerados do catálogo não são editados manualmente;
- promoção exige proveniência, revisão e validadores verdes;
- vidas não podem bloquear novas lições;
- nenhuma mudança de binário entra no closed test sem repetir os gates de
  release aplicáveis.
