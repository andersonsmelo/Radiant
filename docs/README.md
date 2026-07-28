# Radiant — Engineering Rules (SDD)

Este projeto segue o workflow Specification Driven Development (SDD).

## Regras base

- nenhuma feature é implementada sem spec;
- specs não são alteradas durante a implementação em andamento;
- mudanças estruturais relevantes viram ADR;
- implementação deve respeitar o PRD e as specs vigentes;
- o app continua local-first mesmo após auth e sync remotos.

## Mapa canônico de verdade

- Estado arquitetural consolidado: [ARCHITECTURE_STATE.md](/Users/anderson/Developer/Radiant/docs/ARCHITECTURE_STATE.md)
- Sistema operacional de App Store: [APP_STORE_OPERATING_SYSTEM.md](/Users/anderson/Developer/Radiant/docs/APP_STORE_OPERATING_SYSTEM.md)
- Status de execução do programa: [EXECUTION_STATUS_2026-03-29.md](/Users/anderson/Developer/Radiant/docs/EXECUTION_STATUS_2026-03-29.md)
- Status de execução atualizado: [EXECUTION_STATUS_2026-03-30.md](/Users/anderson/Developer/Radiant/docs/EXECUTION_STATUS_2026-03-30.md)
- Status de execução atualizado: [EXECUTION_STATUS_2026-04-01.md](/Users/anderson/Developer/Radiant/docs/EXECUTION_STATUS_2026-04-01.md)
- Status de execução atualizado: [EXECUTION_STATUS_2026-04-03.md](/Users/anderson/Developer/Radiant/docs/EXECUTION_STATUS_2026-04-03.md)
- Status de execução atualizado: [EXECUTION_STATUS_2026-04-04.md](/Users/anderson/Developer/Radiant/docs/EXECUTION_STATUS_2026-04-04.md)
- Status de execução atualizado: [EXECUTION_STATUS_2026-04-09.md](/Users/anderson/Developer/Radiant/docs/EXECUTION_STATUS_2026-04-09.md)
- Status de execução canônico atual: [EXECUTION_STATUS_2026-07-28.md](EXECUTION_STATUS_2026-07-28.md)
- Snapshot anterior, agora histórico: [EXECUTION_STATUS_2026-07-27.md](EXECUTION_STATUS_2026-07-27.md)
- Plano técnico vigente: [IMPLEMENTATION_PLAN.md](/Users/anderson/Developer/Radiant/docs/IMPLEMENTATION_PLAN.md)
- Pipeline editorial de conteúdo: [CONTENT_PIPELINE.md](/Users/anderson/Developer/Radiant/docs/CONTENT_PIPELINE.md)
- Plano de war room para aprovação de orçamento: [WAR_ROOM_PLAN_2026-04-01.md](/Users/anderson/Developer/Radiant/docs/WAR_ROOM_PLAN_2026-04-01.md)
- Evidências de simulador do war room: [evidence/smoke-2026-04-01/README.md](/Users/anderson/Developer/Radiant/docs/evidence/smoke-2026-04-01/README.md)
- Snapshot operacional de App Store: [radiant-app/docs/release/APP_STORE_WAR_ROOM_LATEST.md](/Users/anderson/Developer/Radiant/radiant-app/docs/release/APP_STORE_WAR_ROOM_LATEST.md)
- Política de higiene do repositório: [REPO_HYGIENE.md](/Users/anderson/Developer/Radiant/docs/REPO_HYGIENE.md)
- Política de escala pós-lançamento: [SCALE_TRIGGERS.md](/Users/anderson/Developer/Radiant/docs/SCALE_TRIGGERS.md), [CAPACITY_REVIEW.md](/Users/anderson/Developer/Radiant/docs/CAPACITY_REVIEW.md), [ADR-api-growth-path.md](/Users/anderson/Developer/Radiant/docs/ADR-api-growth-path.md)

## Como ler esta documentação

### Snapshot Git do Repositório

Estado verificado em 2026-03-29:

- remoto oficial: `origin -> https://github.com/andersonsmelo/Radiant.git`
- `HEAD` remoto resolve para `main`
- commit publicado verificado: `128d70bbdbc060f92979c275eb5bcd2ef036f6ed`
- a branch local consultada no snapshot foi `ai/feature/update-project-docs`
- não havia divergência de histórico entre `HEAD`, `main` local e `origin/main`

Observação operacional:

- o repositório publicado estava alinhado com o commit local;
- o diretório de trabalho local ainda continha mudanças não publicadas, inclusive documentação staged e um conjunto maior de alterações rastreadas no app e em docs;
- ao usar esta documentação para release, deploy ou auditoria, confirme novamente o estado do Git antes de assumir que esse snapshot continua válido.

### Produto

- [PRD.md](/Users/anderson/Developer/Radiant/docs/PRD.md)
- [EXECUTION_STATUS_2026-03-30.md](/Users/anderson/Developer/Radiant/docs/EXECUTION_STATUS_2026-03-30.md)

Define o que o produto é, para quem existe e quais resultados ele precisa gerar.

### Plano executivo

- [IMPLEMENTATION_PLAN.md](/Users/anderson/Developer/Radiant/docs/IMPLEMENTATION_PLAN.md)
- [CONTENT_PIPELINE.md](/Users/anderson/Developer/Radiant/docs/CONTENT_PIPELINE.md)
- [APP_STORE_OPERATING_SYSTEM.md](/Users/anderson/Developer/Radiant/docs/APP_STORE_OPERATING_SYSTEM.md)
- [radiant-app/docs/release/APP_STORE_WAR_ROOM_TEMPLATE.md](/Users/anderson/Developer/Radiant/radiant-app/docs/release/APP_STORE_WAR_ROOM_TEMPLATE.md)
- [radiant-app/docs/release/APP_STORE_WAR_ROOM_LATEST.md](/Users/anderson/Developer/Radiant/radiant-app/docs/release/APP_STORE_WAR_ROOM_LATEST.md)

Define a ordem de implementação, fases, critérios de saída e a arquitetura-alvo atual.

Para a trilha editorial, o estado operacional atual já inclui um livro-piloto completo em `conteúdo/`, com validação central feita por `scripts/content/validate-foundation.mjs`.

### ADRs

- [ADR-vps-backend.md](/Users/anderson/Developer/Radiant/docs/ADR-vps-backend.md)
- [ADR-auth-sync.md](/Users/anderson/Developer/Radiant/docs/ADR-auth-sync.md)
- [ADR-routing.md](/Users/anderson/Developer/Radiant/docs/ADR-routing.md)
- [ADR-backend.md](/Users/anderson/Developer/Radiant/docs/ADR-backend.md)

Os ADRs registram decisões arquiteturais. `ADR-backend.md` permanece apenas como histórico da decisão inicial e foi substituído pelo ADR do backend self-hosted no VPS.

### Specs

- [specs/quiz.spec.md](/Users/anderson/Developer/Radiant/docs/specs/quiz.spec.md)
- [specs/spaced-repetition.spec.md](/Users/anderson/Developer/Radiant/docs/specs/spaced-repetition.spec.md)
- [specs/gamification.spec.md](/Users/anderson/Developer/Radiant/docs/specs/gamification.spec.md)
- [specs/annotation.spec.md](/Users/anderson/Developer/Radiant/docs/specs/annotation.spec.md)
- [specs/learning-road-redesign.spec.md](/Users/anderson/Developer/Radiant/docs/specs/learning-road-redesign.spec.md)
- [specs/learning-road-redesign.plan.md](/Users/anderson/Developer/Radiant/docs/specs/learning-road-redesign.plan.md)

As specs definem como uma área do produto deve se comportar e quais contratos a implementação precisa respeitar.

### Track de redesign em andamento

- a `Learning Road` é o principal track atual de evolução de produto;
- a spec define o comportamento-alvo da nova jornada;
- o plano complementar define a ordem de execução e rollout técnico;
- a implementação atual já possui fundação local atrás de flag no app, com trilhas de catálogo visíveis e selecionáveis;
- o progresso da jornada é versionado como `journey-progress.v2` e preserva progresso separado por trilha.
- o fallback para trilha sem próximo nó elegível agora é inline na `Journey Home`, sem `Alert` modal.

## Estado arquitetural vigente

A arquitetura vigente do projeto é:

- cliente mobile em Expo/React Native;
- backend próprio em Fastify;
- PostgreSQL no VPS existente;
- auth com JWT de acesso e refresh token;
- sync assíncrono com fila local.

No cliente, o estado atual se divide em duas superfícies:

- fluxo legado estável baseado em `Home`, `Quiz` e `Review`;
- nova base de `Learning Road` com domínio `journey`, progressão local multi-trilha e `lesson-flow`, protegida por flag de rollout.

## Regra prática de execução

PRD define o que construir.

Specs definem como a feature deve se comportar.

ADRs definem por que a arquitetura está assim.

## Regras operacionais vigentes

- `radiant-app/src/app` é a única raiz oficial de navegação do app;
- `conteúdo/` é a única raiz editorial oficial para ingestão, classificação, conceitos e formatos pedagógicos;
- o app deve continuar utilizável mesmo sem API, com sessão inválida ou com falha de refresh;
- sync remoto nunca pode bloquear o loop principal de estudo;
- toda iniciativa que afete iOS precisa carregar um bloco `App Store Impact`;
- telas e ações técnicas de debug devem ficar restritas a builds de desenvolvimento, preview ou homologação;
- o baseline de validação do cliente é `npm run quality` dentro de [`radiant-app/`](/Users/anderson/Developer/Radiant/radiant-app);
- o baseline de validação editorial é `node scripts/content/validate-foundation.mjs` na raiz do repositório;
- homologação iOS em simulador exige tooling Apple funcional no ambiente local, incluindo Xcode CLI e `simctl`;
- build distribuível/TestFlight exige, além do Expo/EAS, uma Apple ID associada a um team válido no Apple Developer Program;
- a `Learning Road` só deve ser considerada fluxo principal quando a flag estiver ligada e as trilhas prioritárias estiverem homologadas ponta a ponta.
- o baseline editorial promovido para runtime deve manter app e API alinhados via `sync-catalog-to-app.mjs` e `sync-catalog-to-api.mjs`.
- mudanças no motor de jornada devem preservar migração local de progresso e manter alternância de trilha sem apagar progresso anterior.
- estados vazios da jornada devem priorizar continuidade visual no fluxo principal e evitar modais sem ação corretiva imediata.
