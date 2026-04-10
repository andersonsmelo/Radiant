#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/srv/apps/radiant/radiant-api}"
STATE_DIR="${STATE_DIR:-$APP_DIR/.deploy-state}"
SERVICE_NAME="${SERVICE_NAME:-radiant-api}"
TARGET_STATE="${TARGET_STATE:-previous-successful.env}"
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
    "$DEPLOY_REPO_DIR/$DEPLOY_REPO_SUBDIR/" "$APP_DIR/"
}

write_state() {
  local target_file="$1"
  cat >"$target_file" <<EOF
DEPLOY_SOURCE_MODE=$DEPLOY_SOURCE_MODE
DEPLOY_REPO_DIR=$DEPLOY_REPO_DIR
DEPLOY_REPO_SUBDIR=$DEPLOY_REPO_SUBDIR
DEPLOY_BRANCH=$DEPLOY_BRANCH
DEPLOY_COMMIT_SHA=$DEPLOY_COMMIT_SHA
DEPLOYED_AT_UTC=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF
}

require_cmd git
require_cmd npm
require_cmd sudo

STATE_FILE="$STATE_DIR/$TARGET_STATE"
if [[ ! -f "$STATE_FILE" ]]; then
  echo "Rollback state not found: $STATE_FILE" >&2
  echo "Available files:" >&2
  ls -1 "$STATE_DIR" >&2 || true
  exit 1
fi

# shellcheck disable=SC1090
source "$STATE_FILE"

echo "[radiant-api] Rolling back to $DEPLOY_COMMIT_SHA using mode $DEPLOY_SOURCE_MODE"

if [[ "$DEPLOY_SOURCE_MODE" == "direct" ]]; then
  git -C "$APP_DIR" fetch --all --prune
  git -C "$APP_DIR" checkout --force "$DEPLOY_COMMIT_SHA"
elif [[ "$DEPLOY_SOURCE_MODE" == "monorepo" ]]; then
  git -C "$DEPLOY_REPO_DIR" fetch --all --prune
  git -C "$DEPLOY_REPO_DIR" checkout --force "$DEPLOY_COMMIT_SHA"
  mkdir -p "$APP_DIR"
  sync_from_monorepo
else
  echo "Unsupported deploy source mode: $DEPLOY_SOURCE_MODE" >&2
  exit 1
fi

cd "$APP_DIR"
npm ci
npm run build
npm run db:migrate
sudo systemctl restart "$SERVICE_NAME"
sudo systemctl status "$SERVICE_NAME" --no-pager

bash "$SMOKE_TEST_SCRIPT"

if [[ -f "$STATE_DIR/last-successful.env" ]]; then
  cp "$STATE_DIR/last-successful.env" "$STATE_DIR/rolled-back-from.env"
fi
write_state "$STATE_DIR/last-successful.env"

echo "[radiant-api] Rollback completed successfully"
