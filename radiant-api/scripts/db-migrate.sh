#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

shopt -s nullglob
sql_files=("$ROOT_DIR"/sql/*.sql)

if [[ ${#sql_files[@]} -eq 0 ]]; then
  echo "No SQL files found in $ROOT_DIR/sql" >&2
  exit 1
fi

for sql_file in "${sql_files[@]}"; do
  echo "[db:migrate] applying $(basename "$sql_file")"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$sql_file"
done
