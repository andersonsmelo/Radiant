#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

export EXPO_PUBLIC_APP_ENV="${EXPO_PUBLIC_APP_ENV:-development}"
export EXPO_NO_DOTENV=1
export EXPO_PUBLIC_ENABLE_LEARNING_ROAD=true
export EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false
export EXPO_PUBLIC_ENABLE_BETA_GATE=false
export EXPO_PUBLIC_ENABLE_TELEMETRY_DEBUG_SCREEN=true
export EXPO_PUBLIC_ENABLE_DEV_TOOLS=true

printf 'INFO Starting Radiant iOS V2 homologation mode\n'
printf 'INFO Project root: %s\n' "$PROJECT_ROOT"
printf 'INFO Flags: LEARNING_ROAD=%s REMOTE_SYNC=%s BETA_GATE=%s TELEMETRY_DEBUG=%s DEV_TOOLS=%s\n' \
  "$EXPO_PUBLIC_ENABLE_LEARNING_ROAD" \
  "$EXPO_PUBLIC_ENABLE_REMOTE_SYNC" \
  "$EXPO_PUBLIC_ENABLE_BETA_GATE" \
  "$EXPO_PUBLIC_ENABLE_TELEMETRY_DEBUG_SCREEN" \
  "$EXPO_PUBLIC_ENABLE_DEV_TOOLS"

cd "$PROJECT_ROOT"
exec npx expo start --ios
