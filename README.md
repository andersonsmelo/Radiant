# Radiant

Radiant é um aplicativo mobile educacional de radiologia, local-first, com foco em microlearning, quiz, revisão por repetição espaçada e gamificação discreta.

O repositório está organizado em dois blocos principais:

- [`radiant-app/`](/Users/anderson/Developer/Radiant/radiant-app): cliente mobile em Expo/React Native
- [`radiant-api/`](/Users/anderson/Developer/Radiant/radiant-api): backend próprio em Fastify/PostgreSQL para autenticação e sincronização

## Estado atual

O projeto saiu de um desenho inicial orientado a backend gerenciado e agora segue uma arquitetura self-hosted no VPS já existente.

Direção técnica vigente:

- app mobile local-first;
- sincronização assíncrona;
- auth própria com JWT + refresh token;
- PostgreSQL no VPS;
- Nginx + `systemd` para operação do backend.

Estado prático atual:

- `radiant-api` já possui runbook de provisionamento e operação para VPS;
- a API pública conhecida em `https://api.radiant.ascendcreative.com.br` está inativa e retorna HTTP 502; o caminho principal do app continua local-first;
- migrações SQL são cumulativas e já incluem seed mínimo de catálogo;
- o app já possui bootstrap de sessão com estados explícitos de loading/erro, fila local de sync com retry e flush idempotente e operação local-first mesmo sob falha remota;
- `radiant-app/src/app` é a árvore oficial de rotas; a pasta legada `radiant-app/app` não é a raiz vigente do produto;
- a `Learning Road V2` já possui `Journey Home`, `Lesson Flow`, `Checkpoint` e `Reward` dedicados atrás de flag;
- a `Learning Road V2` agora lê as trilhas do catálogo runtime e suporta seleção real entre `Fundamentos`, `Tórax` e `Abdome`;
- o progresso da jornada usa `journey-progress.v2`, com progresso persistido por trilha e migração segura do store legado `journey-progress.v1`;
- a `Journey Home` já responde inline quando a trilha ativa não tem próximo nó elegível, sem modal de interrupção;
- a tela `Progresso` permanece como superfície operacional útil para homologação e agora concentra também o reset local da Learning Road V2 em builds não-produtivas;
- o runtime de App Store já mede `first_value_moment_reached`, tenta `rating prompt` nos momentos elegíveis e evita empilhar review prompt com paywall na mesma sessão de sucesso;
- o paywall contextual já roda em `reward`, `quiz` e `checkpoint`, com captura local-first de interesse de upgrade e telemetria de `paywall_view`, `paywall_cta_tap` e `paywall_outcome`;
- a `Telemetry Debug Screen` agora expõe um resumo operacional `App Store Ops`, interesses de upgrade e o compartilhamento do war room snapshot textual;
- o cliente já possui `eas.json`, identificadores mobile, workflow de qualidade e comando agregado `npm run quality`;
- o tooling Apple local voltou a operar para validação em simulador, incluindo `xcodebuild` e `simctl`;
- a homologação iOS no simulador já é viável para checagem de runtime e captura de screenshots;
- em 2026-04-09, a build iOS nativa da jornada foi revalidada em `iPhone 17` com o bundle atual;
- Expo/EAS já está autenticado e o projeto mobile já foi vinculado no dashboard Expo;
- existe agora um fluxo dedicado de smoke local da Learning Road V2 via `npm run ios:v2`, sem depender de backend remoto;
- em 2026-04-01, a validação técnica do war room fechou com `PASS=13 FAIL=0`;
- em 2026-04-01, o pacote de evidências de simulador foi consolidado em `docs/evidence/smoke-2026-04-01/`;
- existe agora um fluxo oficial de snapshot operacional via `npm run app-store:ops-save`, `npm run app-store:ops-check` e `npm run app-store:ops-check:strict`;
- o bypass de beta gate para homologação (`ios:v2`) está ativo para não bloquear o fluxo de prova operacional.
- a fundação editorial em `conteúdo/` completou o ciclo ponta a ponta: geração → aprovação → promoção → integração no app.
- a Wave 1 de expansão de trilhas está refletida no app, no painel editorial, na API de catálogo e nos smokes locais.

Estado editorial atual:

- `1` fonte registrada e processada no pipeline editorial;
- `75` páginas e `109` excerpts extraídos da obra piloto;
- `109` registros de classificação, com `30` itens em `needs-review`;
- `16` conceitos canônicos, com `7` itens em `needs-review`;
- `6` formatos pedagógicos gerados (`microlições`, `quizzes`, `reviews`, `casos`, `checkpoints` e `rewards`);
- `96` bundles gerados; a validação atual ainda aponta `42` bundles/formatações em `needs-review`;
- `catalog-payload.json` v1.0.0 promovido com todos os `96` bundles;
- `16` lições AI ativas no catálogo do app como track primário (`radiant-app/src/data/ai-lessons.ts`);
- `3` trilhas prioritárias expostas no manifesto runtime: `Fundamentos`, `Tórax` e `Abdome`;
- prontidão Wave 1 derivada dos bundles aprovados: `18/18` lições prontas nas três trilhas prioritárias;
- o mesmo catálogo promovido agora também já gera o seed remoto da API em `radiant-api/sql/003_seed_editorial_catalog.sql`;
- validação oficial da fundação editorial via `node scripts/content/validate-foundation.mjs`.

Bloqueios operacionais atuais verificados:

- o smoke local iOS da V2 já funciona em simulador;
- a API pública conhecida está inativa e retorna HTTP 502; nenhuma correção remota foi executada neste checkout;
- o build distribuível via EAS agora está bloqueado apenas por ausência de team Apple Developer na conta autenticada;
- o build de simulador iOS em nuvem está em andamento no EAS como fallback operacional.

Decisão operacional vigente:

- a build **não está congelada** neste momento; ajustes controlados continuam permitidos com validação por gates.

## Snapshot Git

Estado verificado em 2026-03-29 contra o repositório publicado em:

- `origin`: `https://github.com/andersonsmelo/Radiant.git`
- branch padrão remota: `main`
- commit publicado verificado no GitHub: `128d70bbdbc060f92979c275eb5bcd2ef036f6ed`

Situação observada nesse snapshot:

- `origin/main`, `main` local e a branch atual `ai/feature/update-project-docs` apontavam para o mesmo commit publicado;
- não havia divergência de histórico entre local e remoto (`0` commits à frente, `0` commits atrás);
- o workspace local permanecia adiantado em relação ao GitHub apenas por alterações não publicadas no diretório de trabalho.

Recorte do workspace local nesse momento:

- 5 arquivos staged ainda não publicados;
- 108 arquivos rastreados com delta local no working tree;
- nenhum arquivo untracked detectado no snapshot.

Os artefatos staged verificados nesse retrato foram:

- [README.md](/Users/anderson/Developer/Radiant/README.md)
- [docs/ADR-vps-backend.md](/Users/anderson/Developer/Radiant/docs/ADR-vps-backend.md)
- [docs/IMPLEMENTATION_PLAN.md](/Users/anderson/Developer/Radiant/docs/IMPLEMENTATION_PLAN.md)
- [radiant-api/README.md](/Users/anderson/Developer/Radiant/radiant-api/README.md)
- [radiant-api/deploy/VPS_SETUP.md](/Users/anderson/Developer/Radiant/radiant-api/deploy/VPS_SETUP.md)

Como esse retrato é temporal, qualquer comparação nova com o GitHub deve repetir a verificação de `fetch`, commit e diff antes de servir como base de decisão operacional.

## Estrutura do repositório

```text
/Users/anderson/Developer/Radiant
  docs/
    PRD.md
    IMPLEMENTATION_PLAN.md
    ADR-*.md
    specs/
  conteúdo/
    fontes/
    extrações/
    taxonomia/
    classificação/
    conceitos/
    formatos/
      {formato}/{fonte}/
        bundles.json         ← geração determinística
        ai-bundles.json      ← geração AI (claude-code-local-v1)
    governança/
      catalog-payload.json   ← bundles aprovados, promovidos
  scripts/
    content/
      promote-to-catalog.mjs
      sync-catalog-to-app.mjs
      sync-catalog-to-api.mjs
      generate-local-bundles.py
      validate-foundation.mjs
  tools/
    editorial-panel/         ← Next.js, porta 3001
  radiant-app/
    docs/
    src/
      data/
        lessons.ts           ← seed manual
        catalog.ts           ← manifesto (merge seed + AI)
        ai-lessons.ts        ← AUTO-GENERATED
        ai-catalog.ts        ← AUTO-GENERATED
  radiant-api/
    deploy/
    sql/
      003_seed_editorial_catalog.sql  ← AUTO-GENERATED from catalog-payload
    src/
```

## Documentação principal

- Produto: [docs/PRD.md](/Users/anderson/Developer/Radiant/docs/PRD.md)
- Estado arquitetural consolidado: [docs/ARCHITECTURE_STATE.md](/Users/anderson/Developer/Radiant/docs/ARCHITECTURE_STATE.md)
- Sistema operacional de App Store: [docs/APP_STORE_OPERATING_SYSTEM.md](/Users/anderson/Developer/Radiant/docs/APP_STORE_OPERATING_SYSTEM.md)
- Status de execução do programa (2026-03-29): [docs/EXECUTION_STATUS_2026-03-29.md](/Users/anderson/Developer/Radiant/docs/EXECUTION_STATUS_2026-03-29.md)
- Status de execução atualizado (2026-03-30): [docs/EXECUTION_STATUS_2026-03-30.md](/Users/anderson/Developer/Radiant/docs/EXECUTION_STATUS_2026-03-30.md)
- Status de execução atualizado (2026-04-01): [docs/EXECUTION_STATUS_2026-04-01.md](/Users/anderson/Developer/Radiant/docs/EXECUTION_STATUS_2026-04-01.md)
- Status de execução atualizado (2026-04-03): [docs/EXECUTION_STATUS_2026-04-03.md](/Users/anderson/Developer/Radiant/docs/EXECUTION_STATUS_2026-04-03.md)
- Status de execução atualizado (2026-04-04): [docs/EXECUTION_STATUS_2026-04-04.md](/Users/anderson/Developer/Radiant/docs/EXECUTION_STATUS_2026-04-04.md)
- Status de execução atualizado (2026-04-05): [docs/EXECUTION_STATUS_2026-04-05.md](/Users/anderson/Developer/Radiant/docs/EXECUTION_STATUS_2026-04-05.md)
- Status de execução atualizado (2026-04-09): [docs/EXECUTION_STATUS_2026-04-09.md](/Users/anderson/Developer/Radiant/docs/EXECUTION_STATUS_2026-04-09.md)
- Status canônico atual (2026-07-27): [docs/EXECUTION_STATUS_2026-07-27.md](docs/EXECUTION_STATUS_2026-07-27.md)
- Regras de engenharia e mapa da documentação: [docs/README.md](/Users/anderson/Developer/Radiant/docs/README.md)
- Plano de implementação: [docs/IMPLEMENTATION_PLAN.md](/Users/anderson/Developer/Radiant/docs/IMPLEMENTATION_PLAN.md)
- Fundação editorial de conteúdo: [conteúdo/README.md](/Users/anderson/Developer/Radiant/conteúdo/README.md)
- Pipeline editorial e estado do catálogo-base: [docs/CONTENT_PIPELINE.md](/Users/anderson/Developer/Radiant/docs/CONTENT_PIPELINE.md)
- Plano operacional para war room de lançamento (2026-04-01): [docs/WAR_ROOM_PLAN_2026-04-01.md](/Users/anderson/Developer/Radiant/docs/WAR_ROOM_PLAN_2026-04-01.md)
- Pacote de evidências do smoke de simulador (2026-04-01): [docs/evidence/smoke-2026-04-01/README.md](/Users/anderson/Developer/Radiant/docs/evidence/smoke-2026-04-01/README.md)
- ADR de backend vigente: [docs/ADR-vps-backend.md](/Users/anderson/Developer/Radiant/docs/ADR-vps-backend.md)
- ADR de auth/sync: [docs/ADR-auth-sync.md](/Users/anderson/Developer/Radiant/docs/ADR-auth-sync.md)
- ADR de routing: [docs/ADR-routing.md](/Users/anderson/Developer/Radiant/docs/ADR-routing.md)
- Higiene do repositório: [docs/REPO_HYGIENE.md](/Users/anderson/Developer/Radiant/docs/REPO_HYGIENE.md)
- Política de escala pós-lançamento: [docs/SCALE_TRIGGERS.md](/Users/anderson/Developer/Radiant/docs/SCALE_TRIGGERS.md), [docs/CAPACITY_REVIEW.md](/Users/anderson/Developer/Radiant/docs/CAPACITY_REVIEW.md), [docs/ADR-api-growth-path.md](/Users/anderson/Developer/Radiant/docs/ADR-api-growth-path.md)

## Aplicativo mobile

O cliente vive em [radiant-app/](/Users/anderson/Developer/Radiant/radiant-app).

Pontos principais:

- Expo Router como camada de navegação;
- catálogo local de conteúdo enquanto o catálogo remoto evolui;
- fila local de sincronização;
- bootstrap de auth com sessão persistida;
- sistema oficial do mascote `Pixel` com resolver de assets e hero compartilhado entre superfícies principais;
- `src/app/` como router root oficial;
- nova jornada V2 com rotas dedicadas `/learn`, `/checkpoint`, `/reward`, `/quiz` e `/review`;
- prateleira `Trilhas disponíveis` na `Journey Home`, conectada ao catálogo e à seleção real de trilha;
- store local de progresso da jornada por trilha, preservando avanço ao alternar entre trilhas;
- superfícies técnicas controladas por ambiente, sem depender de telas de debug para uso normal;
- camada de App Store já operacional no runtime com:
  - `first_value_moment_reached`;
  - `rating prompt` elegível por heurística;
  - paywall contextual orientado a valor;
  - captura local-first de interesse de upgrade;
  - resumo `App Store Ops` e snapshot compartilhável no debug;
- painel operacional em `Progresso` para homologação de:
  - `/health`;
  - autenticação;
  - inspeção de fila pendente;
  - flush manual de sincronização;
  - reset local determinístico da Learning Road V2;
- integração remota controlada por:
  - `EXPO_PUBLIC_APP_ENV`
  - `EXPO_PUBLIC_API_BASE_URL`
  - `EXPO_PUBLIC_ENABLE_REMOTE_SYNC`
  - `EXPO_PUBLIC_ENABLE_REMOTE_CONTENT_CATALOG`
  - `EXPO_PUBLIC_ENABLE_CRASH_REPORTING`
  - `EXPO_PUBLIC_ENABLE_PRODUCT_ANALYTICS`
  - `EXPO_PUBLIC_ENABLE_PAYWALL`
  - `EXPO_PUBLIC_ENABLE_REVENUECAT`
  - `EXPO_PUBLIC_ENABLE_LEARNING_ROAD`
  - `EXPO_PUBLIC_ENABLE_DEV_TOOLS`
  - `EXPO_PUBLIC_ENABLE_TELEMETRY_DEBUG_SCREEN`
  - `EXPO_PUBLIC_ENABLE_BETA_GATE`
  - `EXPO_PUBLIC_BETA_INVITE_CODE`

O endpoint remoto de catálogo já existe para smoke e operação. O catálogo promovido em `conteúdo/` agora já sincroniza tanto os artefatos locais do app quanto o seed remoto da API, enquanto o cliente continua local-first e só troca para o remoto quando a flag estiver habilitada.

Qualidade e release do app:

- `npm run quality` executa lint, typecheck, os testes de contrato estrutural
  (Storybook, Maestro, easing, folga da tab bar, contraste, paleta de
  identidade), a suíte Jest e o visual QA estrito — é o gate completo do app,
  num comando só;
- `npm run ios:doctor` valida o ambiente Apple local;
- `npm run ios:v2` sobe o simulador com a combinação oficial de flags para homologação local da V2;
- `npm run app-store:ops-save` salva o snapshot exportado da tela de debug em `radiant-app/docs/release/APP_STORE_WAR_ROOM_LATEST.md`;
- `npm run app-store:ops-check` valida o snapshot em modo advisory;
- `npm run app-store:ops-check:strict` transforma esse snapshot em gate real de release;
- o smoke V2 agora inclui a navegação `Journey -> Lesson/Checkpoint -> Reward -> próximo nó`;
- [`.github/workflows/radiant-app-quality.yml`](/Users/anderson/Developer/Radiant/.github/workflows/radiant-app-quality.yml) valida o app em CI;
- [`radiant-app/eas.json`](/Users/anderson/Developer/Radiant/radiant-app/eas.json) define perfis `development`, `preview` e `production`.

Documentação específica do app:

- [radiant-app/README.md](/Users/anderson/Developer/Radiant/radiant-app/README.md)
- [radiant-app/docs/](/Users/anderson/Developer/Radiant/radiant-app/docs)

## Backend

O backend vive em [radiant-api/](/Users/anderson/Developer/Radiant/radiant-api).

Escopo atual:

- registro e login por email/senha;
- refresh/logout de sessão;
- bootstrap de usuário autenticado;
- sync de progresso e review cards.

Infraestrutura suportada para o backend:

- VPS Linux com acesso administrativo real;
- Node.js 20+;
- PostgreSQL;
- Nginx;
- `systemd`;
- acesso `sudo` para provisionamento e operação.

Infraestrutura explicitamente não suportada:

- hospedagem compartilhada estilo cPanel;
- ambientes sem PostgreSQL;
- servidores sem `sudo`, `systemd` ou runtime Node compatível.

Artefatos de deploy para VPS:

- [radiant-api/deploy/radiant-api.service](/Users/anderson/Developer/Radiant/radiant-api/deploy/radiant-api.service)
- [radiant-api/deploy/radiant-api.nginx.conf](/Users/anderson/Developer/Radiant/radiant-api/deploy/radiant-api.nginx.conf)
- [radiant-api/deploy/deploy.sh](/Users/anderson/Developer/Radiant/radiant-api/deploy/deploy.sh)
- [radiant-api/deploy/smoke-test.sh](/Users/anderson/Developer/Radiant/radiant-api/deploy/smoke-test.sh)
- [radiant-api/deploy/rollback.sh](/Users/anderson/Developer/Radiant/radiant-api/deploy/rollback.sh)
- [radiant-api/deploy/VPS_SETUP.md](/Users/anderson/Developer/Radiant/radiant-api/deploy/VPS_SETUP.md)

## Regras de trabalho

- nenhuma feature entra sem spec;
- toda iniciativa que afete iOS precisa declarar `App Store Impact`;
- decisões estruturais relevantes devem virar ADR;
- o estado local continua sendo a base imediata da UX;
- sync nunca pode bloquear o loop principal de estudo.
- a fundação editorial em `conteúdo/` deve permanecer íntegra e validável antes de qualquer consumo no app ou backend.
