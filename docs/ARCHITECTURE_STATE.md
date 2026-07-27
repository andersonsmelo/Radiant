# Radiant Architecture State

## Estado atual do produto

Radiant é hoje um app mobile local-first com backend próprio no VPS. O estado vigente combina:

- cliente Expo/React Native em `radiant-app/`;
- backend Fastify/PostgreSQL em `radiant-api/`;
- auth própria com JWT de acesso e refresh token;
- rate limiting básico no backend para contenção de abuso;
- fila local de sync com fallback offline;
- Learning Road V2 com rollout controlado por flag, trilhas de catálogo selecionáveis e progresso local por trilha;
- `Pixel` como nome canônico do mascote nos docs atuais.

O app mantém esse contrato local-first porque a API pública conhecida está inativa e retorna HTTP 502. O estado operacional atual está registrado em [EXECUTION_STATUS_2026-07-27.md](EXECUTION_STATUS_2026-07-27.md); reativar infraestrutura exige uma decisão e uma execução separadas.

## Learning Road V2 — Estado 2026-04-09

A jornada V2 deixou de ser apenas uma unidade local inicial e passou a usar o catálogo runtime como fonte de trilhas.

Contratos vigentes:

- `LessonCatalogService` continua sendo a fachada runtime para catálogo local/remoto.
- `JourneyDefinitionService.getTrackDefinition(trackId?)` monta uma definição de jornada para uma trilha específica do catálogo.
- `JourneyProgressService.selectTrack(trackId)` alterna a trilha ativa e retorna o próximo snapshot elegível.
- `JourneyProgressStore` usa `journey-progress.v2`, com `activeTrackId` no store e um bucket `tracks[trackId]` para cada progresso.
- progresso legado `journey-progress.v1` é migrado para o bucket da trilha padrão quando possível.
- `JourneyHomeScreen` expõe a prateleira `Trilhas disponíveis` e abre o próximo nó real da trilha tocada.
- quando a trilha ativa não tem próximo nó elegível, `JourneyHomeScreen` responde com estado inline e mantém o contexto da trilha ativa.

Trilhas prioritárias expostas no catálogo app/API:

- `track-radiology-foundations` — Fundamentos;
- `track-thorax-patterns` — Tórax;
- `track-abdomen-essentials` — Abdome.

Regra arquitetural: alternar trilhas nunca deve apagar progresso já conquistado em outra trilha.

## Fontes canônicas de verdade

| Tema | Fonte |
| --- | --- |
| Visão do produto | [docs/PRD.md](/Users/anderson/Developer/Radiant/docs/PRD.md) |
| Regras de engenharia | [docs/README.md](/Users/anderson/Developer/Radiant/docs/README.md) |
| Sistema operacional de App Store | [docs/APP_STORE_OPERATING_SYSTEM.md](/Users/anderson/Developer/Radiant/docs/APP_STORE_OPERATING_SYSTEM.md) |
| Status de execução atual | [docs/EXECUTION_STATUS_2026-07-27.md](EXECUTION_STATUS_2026-07-27.md) |
| Plano executivo | [docs/IMPLEMENTATION_PLAN.md](/Users/anderson/Developer/Radiant/docs/IMPLEMENTATION_PLAN.md) |
| Runtime do app | [radiant-app/README.md](/Users/anderson/Developer/Radiant/radiant-app/README.md) |
| Runtime da API | [radiant-api/README.md](/Users/anderson/Developer/Radiant/radiant-api/README.md) |
| Status 2026-04-09 | [docs/EXECUTION_STATUS_2026-04-09.md](/Users/anderson/Developer/Radiant/docs/EXECUTION_STATUS_2026-04-09.md) |
| Política de beta do app | [radiant-app/docs/BETA_SCOPE.md](/Users/anderson/Developer/Radiant/radiant-app/docs/BETA_SCOPE.md) |
| Critérios de saída da beta | [radiant-app/docs/BETA_EXIT_CRITERIA.md](/Users/anderson/Developer/Radiant/radiant-app/docs/BETA_EXIT_CRITERIA.md) |
| Sistema do personagem | [radiant-app/docs/CHARACTER_SYSTEM_SPEC.md](/Users/anderson/Developer/Radiant/radiant-app/docs/CHARACTER_SYSTEM_SPEC.md) |
| Métricas do produto | [radiant-app/docs/PRODUCT_METRICS_V1_1.md](/Users/anderson/Developer/Radiant/radiant-app/docs/PRODUCT_METRICS_V1_1.md) |
| Política de higiene | [docs/REPO_HYGIENE.md](/Users/anderson/Developer/Radiant/docs/REPO_HYGIENE.md) |
| Política de escala | [docs/SCALE_TRIGGERS.md](/Users/anderson/Developer/Radiant/docs/SCALE_TRIGGERS.md) e [docs/CAPACITY_REVIEW.md](/Users/anderson/Developer/Radiant/docs/CAPACITY_REVIEW.md) |

## Precedência documental

Quando houver conflito entre documentos, a ordem de verdade é:

1. `docs/EXECUTION_STATUS_2026-07-27.md` para estado operacional presente.
2. `radiant-app/README.md` e `radiant-api/README.md` para comportamento em runtime.
3. `docs/IMPLEMENTATION_PLAN.md` para estado do programa e da arquitetura-alvo.
4. `docs/APP_STORE_OPERATING_SYSTEM.md` para decisões que afetem distribuição,
   App Store, growth iOS e gates relacionados.
5. `docs/ADR-*.md` para decisões estruturais.
6. Docs de beta, métricas e personagem para intenção de produto, desde que não contradigam o runtime atual.

## Regras de consistência

- Nenhum documento de beta pode descrever o produto como pré-auth ou sem sync quando o runtime já não está nesse estado.
- Nenhuma spec de personagem pode usar um nome diferente do nome canônico atual sem marcar o texto como histórico.
- O README raiz deve apontar para esta página como mapa canônico.
- Nenhuma iniciativa iOS deve existir sem referência ao bloco `App Store Impact`.
- Drift entre docs deve ser corrigido no documento de menor precedência, não normalizado como ambiguidade.
