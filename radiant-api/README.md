# Radiant API

Backend próprio do Radiant para rodar no VPS.

## Stack

- Fastify
- PostgreSQL
- JWT próprio com refresh token
- rate limiting básico em memória (janela fixa)
- bcrypt
- Zod

## Ambiente suportado

O `radiant-api` foi desenhado para rodar em um VPS Linux com:

- Node.js 20+;
- PostgreSQL;
- Nginx;
- `systemd`;
- acesso `sudo` para provisionamento.

Ambientes de hospedagem compartilhada estilo cPanel não são suportados para este backend. Na prática, eles tendem a falhar em um ou mais requisitos críticos:

- ausência de PostgreSQL operacional para a aplicação;
- ausência de `systemd` e fluxo de service management;
- ausência de `sudo`;
- runtime Node incompatível ou desatualizado.

## Objetivo inicial

Cobrir o mínimo necessário para o app mobile:

- autenticação por email e senha;
- bootstrap de sessão;
- renovação de sessão;
- sync de `lesson_progress`;
- sync de `review_cards`.

Além da autenticação, a API já contém schema e seed inicial de conteúdo para suportar as foreign keys de sincronização e publicar o catálogo remoto consumido pelo app.

## Status operacional atual (2026-08-09)

A implementação local existe e passa pelos validadores do projeto, mas a API
pública conhecida continua **inativa (HTTP 502)**. O app distribuído não declara
`EXPO_PUBLIC_API_BASE_URL`, permanece local-first e não depende deste serviço.

A estratégia decidida para a próxima implantação é a opção B da
[`ADR-2026-08-04`](../docs/adr/ADR-2026-08-04-estrategia-da-api.md): publicar
somente `/health`, `/ready` e `/v1/content/catalog`; auth e sync não entram nessa
primeira reativação. **A decisão está assinada, mas nada foi implantado ainda.**
Disponibilidade pública só pode ser promovida depois de deploy e smoke remotos
novos.

O estado e os bloqueios vigentes estão no
[`status canônico`](../docs/EXECUTION_STATUS_2026-08-09.md).

### Evidência histórica de 2026-04-01

Naquela data, a validação consolidada no war room registrou:

- gates de backend passaram (`lint`, `typecheck`, `build`, `test`);
- smoke remoto passou para:
  - `https://api.radiant.ascendcreative.com.br/health`
  - `https://api.radiant.ascendcreative.com.br/ready`
  - `https://api.radiant.ascendcreative.com.br/v1/content/catalog`
- resultado agregado do comando central de prontidão: `PASS=13 FAIL=0`.

Esse smoke é histórico e **não prova** disponibilidade em 2026-08-09.

Referências:

- [`../docs/EXECUTION_STATUS_2026-04-01.md`](../docs/EXECUTION_STATUS_2026-04-01.md)
- [`../docs/WAR_ROOM_PLAN_2026-04-01.md`](../docs/WAR_ROOM_PLAN_2026-04-01.md)

## Variáveis de ambiente

Use `.env` baseado em `.env.example`.

Principais chaves:

- `PORT`
- `HOST`
- `SENTRY_DSN`
- `SENTRY_ENVIRONMENT`
- `SENTRY_RELEASE`
- `SENTRY_TRACES_SAMPLE_RATE`
- `DATABASE_URL`
- `JWT_SECRET`
- `ACCESS_TOKEN_TTL_HOURS`
- `REFRESH_TOKEN_TTL_DAYS`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`

## Comandos

```bash
npm install
npm run dev
npm run build
npm run test
npm run start
npm run db:migrate
```

O `db:migrate` aplica todos os arquivos em `sql/` em ordem lexicográfica.

Observação operacional: `db:migrate` depende do cliente PostgreSQL (`psql`) disponível no `PATH`.

## Endpoints iniciais

- `GET /health`
- `GET /ready`
- `GET /v1/content/catalog`
- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `POST /v1/auth/refresh`
- `POST /v1/auth/logout`
- `GET /v1/auth/me`
- `PUT /v1/sync/lesson-progress`
- `PUT /v1/sync/review-cards`

## Banco de dados

Arquivos SQL atuais:

- `sql/001_initial_schema.sql`
- `sql/002_seed_content.sql`
- `sql/003_seed_editorial_catalog.sql`

O seed inicial replica no banco o catálogo publicado pelo app, incluindo `tracks`, payload completo das lições e copy opcional de `journey`, para que a sincronização de `lesson_progress` e `review_cards` funcione sem violar foreign keys em `content_lessons`.

O catálogo editorial promovido agora também gera um seed remoto idempotente em `sql/003_seed_editorial_catalog.sql`, criado a partir de `conteúdo/governança/catalog-payload.json` por:

```bash
cd "$(git rev-parse --show-toplevel)"
node scripts/content/sync-catalog-to-api.mjs
```

Na prática:

- `002_seed_content.sql` preserva a seed histórica mínima;
- `003_seed_editorial_catalog.sql` despublica essa seed histórica no manifesto remoto e publica a track AI promovida;
- o endpoint `/v1/content/catalog` passa a refletir o catálogo editorial promovido quando `db:migrate` é reaplicado.

## Deploy no VPS

Artefatos operacionais ficam em `deploy/`:

- `deploy/radiant-api.service`
- `deploy/radiant-api.nginx.conf`
- `deploy/deploy.sh`
- `deploy/smoke-test.sh`
- `deploy/rollback.sh`
- `deploy/VPS_SETUP.md`
- Observability runbook: `docs/OBSERVABILITY_RUNBOOK.md`
- Dashboard spec: `docs/DASHBOARD_SPEC.md`

Fluxo esperado no servidor:

1. publicar o código em `/srv/apps/radiant/radiant-api`;
2. criar `.env` a partir de `.env.example`;
3. rodar `npm ci && npm run build && npm run db:migrate`;
4. instalar o service `systemd`;
5. publicar o vhost do Nginx e habilitar TLS.

Precondições operacionais antes do primeiro deploy:

- o domínio da API precisa resolver publicamente para o IP do VPS;
- o servidor precisa ser um VPS real, não um host compartilhado;
- o operador precisa estar autenticado na infraestrutura correta antes de tratar problemas como sendo da aplicação.
- o backend precisa passar no preflight local com `npm run preflight`.

### Operação contínua

- preflight local de env/runtime: `npm run preflight`
- deploy normal: `bash deploy/deploy.sh`
- smoke test isolado: `bash deploy/smoke-test.sh`
- rollback para a última release anterior bem-sucedida: `bash deploy/rollback.sh`

Gate de comando central (monorepo):

- `cd "$(git rev-parse --show-toplevel)"`
- `bash scripts/launch-war-room.sh`

O `deploy.sh` suporta:

- checkout direto do backend em `/srv/apps/radiant/radiant-api`;
- clone do monorepo com sincronização da subpasta `radiant-api` para o diretório de runtime.

Observação: o rollback é de aplicação. As migrações SQL são aditivas e não executam rollback de schema automaticamente.
