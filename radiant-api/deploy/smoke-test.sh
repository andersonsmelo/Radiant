#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/srv/apps/radiant/radiant-api}"
BASE_URL="${SMOKE_TEST_BASE_URL:-}"

load_env() {
  if [[ -f "$APP_DIR/.env" ]]; then
    set -a
    # shellcheck disable=SC1091
    source "$APP_DIR/.env"
    set +a
  fi
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Required command not found: $1" >&2
    exit 1
  fi
}

json_get() {
  local path="$1"
  node -e '
    const fs = require("fs");
    const path = process.argv[1].split(".");
    let data = JSON.parse(fs.readFileSync(0, "utf8"));
    for (const key of path) {
      data = data?.[key];
    }
    if (data === undefined || data === null) process.exit(2);
    if (typeof data === "object") {
      process.stdout.write(JSON.stringify(data));
    } else {
      process.stdout.write(String(data));
    }
  ' "$path"
}

request_json() {
  local method="$1"
  local url="$2"
  local body="${3:-}"
  local auth_header="${4:-}"

  local response
  if [[ -n "$body" && -n "$auth_header" ]]; then
    response="$(curl --silent --show-error --fail \
      -X "$method" "$url" \
      -H 'content-type: application/json' \
      -H "$auth_header" \
      -d "$body")"
  elif [[ -n "$body" ]]; then
    response="$(curl --silent --show-error --fail \
      -X "$method" "$url" \
      -H 'content-type: application/json' \
      -d "$body")"
  elif [[ -n "$auth_header" ]]; then
    response="$(curl --silent --show-error --fail \
      -X "$method" "$url" \
      -H "$auth_header")"
  else
    response="$(curl --silent --show-error --fail -X "$method" "$url")"
  fi

  printf '%s' "$response"
}

request_status() {
  local method="$1"
  local url="$2"
  local body="${3:-}"
  local auth_header="${4:-}"

  if [[ -n "$body" && -n "$auth_header" ]]; then
    curl --silent --show-error -o /dev/null -w '%{http_code}' \
      -X "$method" "$url" \
      -H 'content-type: application/json' \
      -H "$auth_header" \
      -d "$body"
  elif [[ -n "$body" ]]; then
    curl --silent --show-error -o /dev/null -w '%{http_code}' \
      -X "$method" "$url" \
      -H 'content-type: application/json' \
      -d "$body"
  elif [[ -n "$auth_header" ]]; then
    curl --silent --show-error -o /dev/null -w '%{http_code}' \
      -X "$method" "$url" \
      -H "$auth_header"
  else
    curl --silent --show-error -o /dev/null -w '%{http_code}' \
      -X "$method" "$url"
  fi
}

require_cmd curl
require_cmd node

load_env

PORT="${PORT:-3100}"
BASE_URL="${BASE_URL:-http://127.0.0.1:$PORT}"
SMOKE_EMAIL="${SMOKE_TEST_EMAIL:-smoke-$(date +%s)@example.com}"
SMOKE_PASSWORD="${SMOKE_TEST_PASSWORD:-RadiantSmoke123!}"
ANSWERED_AT="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
NEXT_REVIEW_AT="$(date -u -v+1d +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -d '+1 day' +"%Y-%m-%dT%H:%M:%SZ")"

echo "[smoke] health"
health_response="$(request_json GET "$BASE_URL/health")"
health_ok="$(printf '%s' "$health_response" | json_get ok)"
if [[ "$health_ok" != "true" ]]; then
  echo "Health check failed: $health_response" >&2
  exit 1
fi

echo "[smoke] readiness"
ready_response="$(request_json GET "$BASE_URL/ready")"
ready_ok="$(printf '%s' "$ready_response" | json_get ok)"
ready_state="$(printf '%s' "$ready_response" | json_get ready)"
if [[ "$ready_ok" != "true" || "$ready_state" != "true" ]]; then
  echo "Readiness check failed: $ready_response" >&2
  exit 1
fi

echo "[smoke] content catalog"
catalog_response="$(request_json GET "$BASE_URL/v1/content/catalog")"
catalog_version="$(printf '%s' "$catalog_response" | json_get version)"
catalog_lessons="$(printf '%s' "$catalog_response" | json_get lessons)"
catalog_initial_lesson_id="$(printf '%s' "$catalog_response" | json_get initialLessonId)"
if [[ -z "$catalog_version" || "$catalog_version" == "null" || "$catalog_lessons" == "[]" || -z "$catalog_initial_lesson_id" || "$catalog_initial_lesson_id" == "null" ]]; then
  echo "Catalog check failed: $catalog_response" >&2
  exit 1
fi

echo "[smoke] register"
register_response="$(request_json POST "$BASE_URL/v1/auth/register" "{\"email\":\"$SMOKE_EMAIL\",\"password\":\"$SMOKE_PASSWORD\"}")"
access_token="$(printf '%s' "$register_response" | json_get accessToken)"
refresh_token="$(printf '%s' "$register_response" | json_get refreshToken)"
registered_email="$(printf '%s' "$register_response" | json_get user.email)"
if [[ "$registered_email" != "$SMOKE_EMAIL" ]]; then
  echo "Unexpected registered user email: $register_response" >&2
  exit 1
fi

echo "[smoke] me"
me_response="$(request_json GET "$BASE_URL/v1/auth/me" "" "authorization: Bearer $access_token")"
me_email="$(printf '%s' "$me_response" | json_get user.email)"
if [[ "$me_email" != "$SMOKE_EMAIL" ]]; then
  echo "Unexpected /me response: $me_response" >&2
  exit 1
fi

echo "[smoke] lesson progress sync"
lesson_status="$(request_status PUT "$BASE_URL/v1/sync/lesson-progress" "{\"lessonId\":\"lesson-1\",\"totalQuestions\":3,\"correctAnswers\":2,\"answeredAtIso\":\"$ANSWERED_AT\"}" "authorization: Bearer $access_token")"
if [[ "$lesson_status" != "204" ]]; then
  echo "Lesson progress sync failed with status $lesson_status" >&2
  exit 1
fi

echo "[smoke] review card sync"
review_status="$(request_status PUT "$BASE_URL/v1/sync/review-cards" "{\"lessonId\":\"lesson-1\",\"easeFactor\":2.5,\"intervalDays\":1,\"repetitions\":1,\"nextReviewAtIso\":\"$NEXT_REVIEW_AT\",\"lastReviewedAtIso\":\"$ANSWERED_AT\",\"createdAtIso\":\"$ANSWERED_AT\"}" "authorization: Bearer $access_token")"
if [[ "$review_status" != "204" ]]; then
  echo "Review card sync failed with status $review_status" >&2
  exit 1
fi

echo "[smoke] refresh"
refresh_response="$(request_json POST "$BASE_URL/v1/auth/refresh" "{\"refreshToken\":\"$refresh_token\"}")"
next_access_token="$(printf '%s' "$refresh_response" | json_get accessToken)"
if [[ -z "$next_access_token" ]]; then
  echo "Refresh failed: $refresh_response" >&2
  exit 1
fi

echo "[smoke] logout"
logout_status="$(request_status POST "$BASE_URL/v1/auth/logout" "{\"refreshToken\":\"$(printf '%s' "$refresh_response" | json_get refreshToken)\"}")"
if [[ "$logout_status" != "204" ]]; then
  echo "Logout failed with status $logout_status" >&2
  exit 1
fi

echo "[smoke] all checks passed"
