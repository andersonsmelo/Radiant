#!/usr/bin/env bash

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

pass() {
  printf "PASS %s\n" "$1"
}

fail() {
  printf "FAIL %s\n" "$1" >&2
}

info() {
  printf "INFO %s\n" "$1"
}

warn() {
  printf "WARN %s\n" "$1"
}

has_error=0
env_file="$PROJECT_ROOT/.env"
eas_cmd=""

load_env() {
  if [[ -f "$env_file" ]]; then
    set -a
    # shellcheck disable=SC1090
    source "$env_file"
    set +a
    pass "Loaded env file: $env_file"
  else
    warn "No .env found at $env_file; relying on shell environment"
  fi
}

check_node() {
  if ! command -v node >/dev/null 2>&1; then
    fail "node not found. Install Node.js 20.x."
    has_error=1
    return
  fi

  local version major
  version="$(node -v 2>/dev/null || true)"
  major="${version#v}"
  major="${major%%.*}"

  if [[ -n "$major" && "$major" -ge 20 ]]; then
    pass "Node.js $version"
  else
    fail "Node.js 20.x is required (detected ${version:-unknown})"
    has_error=1
  fi
}

check_release_env() {
  local app_env="${EXPO_PUBLIC_APP_ENV:-}"
  local remote_sync="${EXPO_PUBLIC_ENABLE_REMOTE_SYNC:-}"
  local api_base_url="${EXPO_PUBLIC_API_BASE_URL:-}"

  if [[ -n "$app_env" ]]; then
    pass "EXPO_PUBLIC_APP_ENV=$app_env"
  else
    warn "EXPO_PUBLIC_APP_ENV is not set"
  fi

  if [[ "$remote_sync" == "true" ]]; then
    pass "Remote sync enabled"
    if [[ -z "$api_base_url" ]]; then
      fail "EXPO_PUBLIC_API_BASE_URL is required when EXPO_PUBLIC_ENABLE_REMOTE_SYNC=true"
      has_error=1
      return
    fi

    pass "EXPO_PUBLIC_API_BASE_URL is set"

    if [[ "${app_env:-}" == "preview" || "${app_env:-}" == "production" ]]; then
      if [[ "$api_base_url" == https://* ]]; then
        pass "Preview/production API base URL uses HTTPS"
      else
        fail "Preview/production API base URL must use HTTPS"
        has_error=1
      fi
    fi
  else
    warn "Remote sync disabled; distributed preview/prod builds may not hit the API"
  fi
}

check_eas() {
  if command -v eas >/dev/null 2>&1; then
    eas_cmd="eas"
    pass "eas CLI available globally"
  elif [[ -x "$PROJECT_ROOT/node_modules/.bin/eas" ]]; then
    eas_cmd="$PROJECT_ROOT/node_modules/.bin/eas"
    pass "eas CLI available in project dependencies"
  else
    fail "eas CLI not found. Install eas-cli globally or add it as a project dependency."
    has_error=1
  fi

  if [[ -n "${EXPO_TOKEN:-}" ]]; then
    pass "EXPO_TOKEN is present"
  elif [[ -n "$eas_cmd" ]] && "$eas_cmd" whoami >/dev/null 2>&1; then
    pass "Expo session is authenticated locally"
  else
    fail "Expo authentication missing. Run eas login or export EXPO_TOKEN."
    has_error=1
  fi
}

check_app_store_snapshot() {
  if node "$PROJECT_ROOT/scripts/check-app-store-war-room.mjs"; then
    pass "App Store ops snapshot advisory check completed"
  else
    fail "App Store ops snapshot advisory check failed"
    has_error=1
  fi
}

info "Checking Radiant mobile release preflight"
info "Project root: $PROJECT_ROOT"

load_env
check_node
check_release_env
check_eas
check_app_store_snapshot

if ! bash "$PROJECT_ROOT/scripts/check-ios-tooling.sh"; then
  has_error=1
fi

if [[ "$has_error" -ne 0 ]]; then
  printf "\n"
  info "Recommended next steps:"
  info "  1. Create radiant-app/.env from .env.example and set EXPO_PUBLIC_API_BASE_URL."
  info "  2. Authenticate Expo with eas login or EXPO_TOKEN."
  info "  3. Re-run: npm run release:preflight"
  exit 1
fi

printf "\n"
pass "Mobile release preflight completed"
