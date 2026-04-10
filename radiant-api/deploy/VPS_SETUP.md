# Radiant API VPS Setup

Este runbook provisiona o backend do Radiant em um VPS Ubuntu/Debian com PostgreSQL, Nginx e systemd.

## Snapshot validado em producao

Provisionamento real validado em **2026-03-30**:

- VPS: `69.6.222.219:22022`
- app dir: `/srv/apps/radiant/radiant-api`
- dominio publico: `https://api.radiant.ascendcreative.com.br`
- service: `radiant-api.service`
- smoke remoto: aprovado

Observacao importante:

- o template em `deploy/radiant-api.service` assume usuario dedicado `radiant`;
- a instalacao efetiva validada no VPS atual foi publicada rodando como `Hashi1802`, para seguir o padrao operacional ja usado nesse host;
- se voce reproduzir o deploy nesse mesmo VPS, ajuste `User` e `Group` do unit file ou crie previamente o usuario dedicado `radiant`.

## Premissas

- dominio da API apontando para o VPS:
  - `api.radiant.ascendcreative.com.br`
- usuario com sudo no servidor;
- PostgreSQL e Nginx instalados;
- cliente PostgreSQL (`psql`) instalado;
- Node.js 20+ e npm instalados;
- repositorio disponivel para clone no servidor.
- `curl` e `rsync` disponiveis para operação dos scripts.

## Ambiente suportado

Este runbook assume um VPS Linux administravel, equivalente a Ubuntu/Debian, com acesso real de operacao.

Checklist minimo antes de prosseguir:

- `sudo` funcional;
- PostgreSQL local ou acessivel como dependencia de infraestrutura controlada;
- cliente `psql` disponivel no `PATH`;
- `systemd` disponivel para o service da API;
- Node.js 20+ com `npm`;
- Nginx instalavel e configuravel;
- DNS do dominio da API controlado pelo operador.

## Ambiente nao suportado

Nao use este runbook em:

- hospedagem compartilhada estilo cPanel;
- servidores sem `sudo`;
- servidores sem PostgreSQL;
- servidores sem `systemd`;
- ambientes com runtime Node incompatível com o build da API.

Se o host expuser apenas MySQL/cPanel e nao permitir operar `systemd`, `sudo` e PostgreSQL, esse host nao e um alvo valido para o `radiant-api`.

## 1. Criar diretórios da aplicação

Crie um usuário de serviço dedicado:

```bash
sudo useradd --system --create-home --home-dir /srv/apps/radiant --shell /usr/sbin/nologin radiant || true
```

Depois crie a estrutura da aplicação:

Opcao A, checkout direto do backend em runtime:

```bash
sudo mkdir -p /srv/apps/radiant
sudo chown -R "$USER":"$USER" /srv/apps/radiant
cd /srv/apps/radiant
git clone <REPO_URL> radiant-api
cd radiant-api/radiant-api
```

Opcao B, clone do monorepo e sincronizacao automatica da subpasta no deploy:

```bash
sudo mkdir -p /srv/apps/radiant
sudo chown -R "$USER":"$USER" /srv/apps/radiant
cd /srv/apps/radiant
git clone <REPO_URL> repo
mkdir -p /srv/apps/radiant/radiant-api
cd /srv/apps/radiant/radiant-api
```

Se usar a opcao B, os scripts assumem:

```bash
REPO_DIR=/srv/apps/radiant/repo
REPO_SUBDIR=radiant-api
APP_DIR=/srv/apps/radiant/radiant-api
```

## 2. Criar database e usuário do PostgreSQL

Entre no `psql` como postgres:

```bash
sudo -u postgres psql
```

Execute:

```sql
create role radiant with login password 'troque-por-uma-senha-forte';
create database radiant owner radiant;
\c radiant
grant all privileges on database radiant to radiant;
```

Saia com `\q`.

## 3. Configurar ambiente do backend

Opcao A, checkout direto:

```bash
cd /srv/apps/radiant/radiant-api
cp .env.example .env
```

Opcao B, monorepo:

```bash
cp /srv/apps/radiant/repo/radiant-api/.env.example /srv/apps/radiant/radiant-api/.env
cd /srv/apps/radiant/radiant-api
```

Preencha `.env`:

```dotenv
PORT=3100
HOST=127.0.0.1
DATABASE_URL=postgres://radiant:<senha-forte>@127.0.0.1:5432/radiant
JWT_SECRET=<gere-um-secret-longo-e-aleatorio>
ACCESS_TOKEN_TTL_HOURS=6
REFRESH_TOKEN_TTL_DAYS=30
```

Gerando um secret:

```bash
openssl rand -base64 48
```

## 4. Instalar dependências, buildar e aplicar schema

Opcao A, checkout direto:

```bash
cd /srv/apps/radiant/radiant-api
npm ci
npm run build
npm run db:migrate
```

Opcao B, monorepo:

```bash
APP_DIR=/srv/apps/radiant/radiant-api \
REPO_DIR=/srv/apps/radiant/repo \
REPO_SUBDIR=radiant-api \
bash /srv/apps/radiant/repo/radiant-api/deploy/deploy.sh
```

O `db:migrate` aplica todos os arquivos em `sql/`, incluindo o seed inicial de conteúdo usado pelo app.

## 5. Instalar o serviço systemd

O serviço versionado em `deploy/radiant-api.service` está configurado para rodar como `radiant`.

Se o servidor seguir o mesmo padrao da instalacao validada em 2026-03-30, ajuste antes:

- `User=Hashi1802`
- `Group=Hashi1802`

Depois:

```bash
sudo cp deploy/radiant-api.service /etc/systemd/system/radiant-api.service
sudo systemctl daemon-reload
sudo systemctl enable radiant-api
sudo systemctl start radiant-api
sudo systemctl status radiant-api --no-pager
```

Logs:

```bash
journalctl -u radiant-api -n 200 --no-pager
```

## 6. Publicar Nginx

```bash
sudo cp deploy/radiant-api.nginx.conf /etc/nginx/sites-available/radiant-api
sudo ln -sf /etc/nginx/sites-available/radiant-api /etc/nginx/sites-enabled/radiant-api
sudo nginx -t
sudo systemctl reload nginx
```

## 7. Emitir TLS com Certbot

```bash
sudo certbot --nginx -d api.radiant.ascendcreative.com.br
```

Depois teste:

```bash
curl -i https://api.radiant.ascendcreative.com.br/health
```

Se esse `curl` falhar por `NXDOMAIN` ou outro erro de resolucao, corrija o DNS antes de seguir. Auth e sync do app nao podem ser homologados enquanto o dominio publico da API nao resolver.

Na instalacao validada em 2026-03-30, o DNS autoritativo final publicado foi:

- `api.radiant.ascendcreative.com.br -> 69.6.222.219`

Validacao operacional em 2026-04-10:

- `ascendcreative.com.br` usa os nameservers `ns414.hostgator.com.br` e `ns415.hostgator.com.br`;
- a zona HostGator publica `api.radiant.ascendcreative.com.br A 69.6.222.219`;
- o VPS/Nginx/API respondem corretamente pelo hostname publico;
- se `dig +short api.radiant.ascendcreative.com.br A` nao retornar `69.6.222.219`, recrie esse registro A no painel DNS autoritativo da HostGator antes de homologar o app contra a API publicada.

## 8. Smoke test funcional

Registro:

```bash
curl -i https://api.radiant.ascendcreative.com.br/v1/auth/register \
  -H 'content-type: application/json' \
  -d '{"email":"tester@example.com","password":"12345678"}'
```

Login:

```bash
curl -i https://api.radiant.ascendcreative.com.br/v1/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"tester@example.com","password":"12345678"}'
```

Guarde o `accessToken` e teste:

```bash
curl -i https://api.radiant.ascendcreative.com.br/v1/auth/me \
  -H "authorization: Bearer <ACCESS_TOKEN>"
```

## 9. Configuração do app mobile

No app:

```dotenv
EXPO_PUBLIC_API_BASE_URL=https://api.radiant.ascendcreative.com.br
EXPO_PUBLIC_ENABLE_REMOTE_SYNC=true
```

## 9.1 Precondicoes para homologacao ponta a ponta

Antes de validar auth/sync no app:

- `https://api.radiant.ascendcreative.com.br/health` deve responder publicamente;
- o backend precisa estar com migrações e seed aplicados;
- o catalogo editorial remoto deve expor `tracks`, `lessons` e `initialLessonId`;
- o app deve apontar para essa base URL via `EXPO_PUBLIC_API_BASE_URL`.

## 10. Deploys seguintes

Depois do primeiro provisionamento, checkout direto:

```bash
cd /srv/apps/radiant/radiant-api
bash deploy/deploy.sh
```

Depois do primeiro provisionamento, monorepo:

```bash
APP_DIR=/srv/apps/radiant/radiant-api \
REPO_DIR=/srv/apps/radiant/repo \
REPO_SUBDIR=radiant-api \
bash /srv/apps/radiant/repo/radiant-api/deploy/deploy.sh
```

## 11. Smoke tests e rollback

Rodar smoke test manualmente:

```bash
cd /srv/apps/radiant/radiant-api
bash deploy/smoke-test.sh
```

Rollback para a release anterior bem-sucedida:

```bash
cd /srv/apps/radiant/radiant-api
bash deploy/rollback.sh
```

Rollback no modo monorepo:

```bash
cd /srv/apps/radiant/radiant-api
APP_DIR=/srv/apps/radiant/radiant-api \
REPO_DIR=/srv/apps/radiant/repo \
REPO_SUBDIR=radiant-api \
bash deploy/rollback.sh
```

## Observações operacionais

- o `deploy.sh` detecta checkout direto em `APP_DIR` ou clone do monorepo em `REPO_DIR`;
- o serviço escuta apenas em `127.0.0.1:3100`, o acesso público deve passar pelo Nginx;
- qualquer alteração nova em `sql/` será aplicada automaticamente pelo `db:migrate` em ordem lexicográfica.
- o rollback atual reverte código e reinicia o serviço, mas não desfaz migrações SQL já aplicadas.
