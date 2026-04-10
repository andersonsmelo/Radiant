#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/srv/apps/radiant/radiant-api}"
REPO_DIR="${REPO_DIR:-/srv/apps/radiant/repo}"
REPO_SUBDIR="${REPO_SUBDIR:-radiant-api}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
SERVICE_NAME="${SERVICE_NAME:-radiant-api}"
STATE_DIR="${STATE_DIR:-$APP_DIR/.deploy-state}"
SMOKE_TEST_SCRIPT="$APP_DIR/deploy/smoke-test.sh"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Required command not found: $1" >&2
    exit 1
  fi
}

sync_from_monorepo() {
  require_cmd rsync
  rsync -a --delete \
    --exclude '.git' \
    --exclude 'node_modules' \
    --exclude 'dist' \
    --exclude '.env' \
    "$REPO_DIR/$REPO_SUBDIR/" "$APP_DIR/"
}

load_env() {
  if [[ -f "$APP_DIR/.env" ]]; then
    set -a
    # shellcheck disable=SC1091
    source "$APP_DIR/.env"
    set +a
  fi
}

write_state() {
  local target_file="$1"
  cat >"$target_file" <<EOF
DEPLOY_SOURCE_MODE=$SOURCE_MODE
DEPLOY_REPO_DIR=$SOURCE_REPO_DIR
DEPLOY_REPO_SUBDIR=$SOURCE_REPO_SUBDIR
DEPLOY_BRANCH=$DEPLOY_BRANCH
DEPLOY_COMMIT_SHA=$DEPLOY_COMMIT_SHA
DEPLOYED_AT_UTC=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF
}

require_cmd git
require_cmd npm
require_cmd psql
require_cmd sudo

mkdir -p "$STATE_DIR"

if [[ -d "$APP_DIR/.git" ]]; then
  SOURCE_MODE="direct"
  SOURCE_REPO_DIR="$APP_DIR"
  SOURCE_REPO_SUBDIR=""
elif [[ -d "$REPO_DIR/.git" && -d "$REPO_DIR/$REPO_SUBDIR" ]]; then
  SOURCE_MODE="monorepo"
  SOURCE_REPO_DIR="$REPO_DIR"
  SOURCE_REPO_SUBDIR="$REPO_SUBDIR"
else
  echo "Could not determine deploy source. Expected either:" >&2
  echo "  - git repo in APP_DIR=$APP_DIR" >&2
  echo "  - git repo in REPO_DIR=$REPO_DIR with subdir $REPO_SUBDIR" >&2
  exit 1
fi

echo "[radiant-api] Source mode: $SOURCE_MODE"

if [[ "$SOURCE_MODE" == "direct" ]]; then
  echo "[radiant-api] Fetching branch $DEPLOY_BRANCH in $APP_DIR"
  git -C "$APP_DIR" fetch --all --prune
  git -C "$APP_DIR" checkout "$DEPLOY_BRANCH"
  git -C "$APP_DIR" pull --ff-only origin "$DEPLOY_BRANCH"
  DEPLOY_COMMIT_SHA="$(git -C "$APP_DIR" rev-parse HEAD)"
else
  echo "[radiant-api] Fetching branch $DEPLOY_BRANCH in monorepo $REPO_DIR"
  git -C "$REPO_DIR" fetch --all --prune
  git -C "$REPO_DIR" checkout "$DEPLOY_BRANCH"
  git -C "$REPO_DIR" pull --ff-only origin "$DEPLOY_BRANCH"
  DEPLOY_COMMIT_SHA="$(git -C "$REPO_DIR" rev-parse HEAD)"

  echo "[radiant-api] Syncing $REPO_SUBDIR to runtime directory"
  mkdir -p "$APP_DIR"
  sync_from_monorepo
fi

echo "[radiant-api] Commit: $DEPLOY_COMMIT_SHA"

load_env

echo "[radiant-api] Installing dependencies"
cd "$APP_DIR"
npm ci

echo "[radiant-api] Building application"
npm run build

echo "[radiant-api] Applying schema"
npm run db:migrate

echo "[radiant-api] Restarting service"
sudo systemctl restart "$SERVICE_NAME"
sudo systemctl status "$SERVICE_NAME" --no-pager

echo "[radiant-api] Running smoke tests"
bash "$SMOKE_TEST_SCRIPT"

if [[ -f "$STATE_DIR/last-successful.env" ]]; then
  cp "$STATE_DIR/last-successful.env" "$STATE_DIR/previous-successful.env"
fi

write_state "$STATE_DIR/last-successful.env"

echo "[radiant-api] Deploy completed successfully"
