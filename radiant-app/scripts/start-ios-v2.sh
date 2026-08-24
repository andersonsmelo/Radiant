#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

export EXPO_PUBLIC_APP_ENV="${EXPO_PUBLIC_APP_ENV:-development}"
export EXPO_NO_DOTENV=1
export EXPO_PUBLIC_ENABLE_LEARNING_ROAD=true
export EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false
# A URL vazia é parte do perfil, não detalhe: `ENABLE_REMOTE_SYNC=false` NÃO
# impede o app de falar com a API. `AuthService` gateia apenas em
# `isApiConfigured()`, e `bootstrap()` roda no startup (`_layout.tsx`), no Perfil
# e no Progresso. Com uma URL configurada, "sync desligado" ainda autentica
# contra ela. Homologação V2 é local-first, então a URL tem que estar vazia.
export EXPO_PUBLIC_API_BASE_URL=""
export EXPO_PUBLIC_ENABLE_BETA_GATE=false
export EXPO_PUBLIC_ENABLE_TELEMETRY_DEBUG_SCREEN=true
export EXPO_PUBLIC_ENABLE_DEV_TOOLS=true

# ── Verificação, antes de qualquer promessa ──────────────────────────────────
#
# Este bloco existe porque em 2026-08-21 o script exportava
# EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false, imprimia "REMOTE_SYNC=false", e o app
# subia com sync ATIVADO contra a API de produção: `.env` declarava `true`, e
# arquivo de ambiente vence o `export` do shell. O `EXPO_NO_DOTENV=1` acima NÃO
# impede isso — foi medido.
#
# Uma sessão inteira de homologação mediu um app diferente do que o roteiro
# descrevia, e nada avisou. Imprimir a intenção não é verificar o efeito, e é
# por isso que a verificação vem ANTES do INFO.
node "$SCRIPT_DIR/check-env-precedence.mjs" \
  "EXPO_PUBLIC_APP_ENV=${EXPO_PUBLIC_APP_ENV}" \
  "EXPO_PUBLIC_ENABLE_LEARNING_ROAD=${EXPO_PUBLIC_ENABLE_LEARNING_ROAD}" \
  "EXPO_PUBLIC_ENABLE_REMOTE_SYNC=${EXPO_PUBLIC_ENABLE_REMOTE_SYNC}" \
  "EXPO_PUBLIC_API_BASE_URL=${EXPO_PUBLIC_API_BASE_URL}" \
  "EXPO_PUBLIC_ENABLE_BETA_GATE=${EXPO_PUBLIC_ENABLE_BETA_GATE}" \
  "EXPO_PUBLIC_ENABLE_TELEMETRY_DEBUG_SCREEN=${EXPO_PUBLIC_ENABLE_TELEMETRY_DEBUG_SCREEN}" \
  "EXPO_PUBLIC_ENABLE_DEV_TOOLS=${EXPO_PUBLIC_ENABLE_DEV_TOOLS}"

printf 'INFO Starting Radiant iOS V2 homologation mode\n'
printf 'INFO Project root: %s\n' "$PROJECT_ROOT"
printf 'INFO Flags (verificadas contra os arquivos de ambiente): LEARNING_ROAD=%s REMOTE_SYNC=%s BETA_GATE=%s TELEMETRY_DEBUG=%s DEV_TOOLS=%s\n' \
  "$EXPO_PUBLIC_ENABLE_LEARNING_ROAD" \
  "$EXPO_PUBLIC_ENABLE_REMOTE_SYNC" \
  "$EXPO_PUBLIC_ENABLE_BETA_GATE" \
  "$EXPO_PUBLIC_ENABLE_TELEMETRY_DEBUG_SCREEN" \
  "$EXPO_PUBLIC_ENABLE_DEV_TOOLS"

cd "$PROJECT_ROOT"
exec npx expo start --ios
