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

has_error=0

info "Checking local iOS tooling for Radiant"
info "Project root: $PROJECT_ROOT"

if ! command -v xcode-select >/dev/null 2>&1; then
  fail "xcode-select not found. Install Xcode from the App Store."
  exit 1
fi

developer_dir="$(xcode-select -p 2>/dev/null || true)"

if [[ -z "$developer_dir" ]]; then
  fail "Active developer directory is not configured."
  has_error=1
elif [[ "$developer_dir" == "/Library/Developer/CommandLineTools" ]]; then
  fail "Active developer directory points to Command Line Tools only."
  info "Switch to full Xcode with:"
  info "  sudo xcode-select -s /Applications/Xcode.app/Contents/Developer"
  has_error=1
else
  pass "Active developer directory: $developer_dir"
fi

if xcodebuild_version="$(xcodebuild -version 2>/dev/null)"; then
  pass "xcodebuild available"
  printf "%s\n" "$xcodebuild_version"
else
  fail "xcodebuild unavailable. Open Xcode once and finish initial setup."
  has_error=1
fi

if simctl_output="$(xcrun simctl list devices 2>/dev/null)"; then
  pass "simctl available"
  printf "%s\n" "$simctl_output" | sed -n '1,20p'
else
  fail "simctl unavailable. Full Xcode is required for simulator validation."
  has_error=1
fi

if command -v npx >/dev/null 2>&1; then
  if (cd "$PROJECT_ROOT" && npx expo config --type public >/dev/null 2>&1); then
    pass "Expo app config resolves successfully"
  else
    fail "Expo app config resolution failed. Check app.json and env setup."
    has_error=1
  fi
else
  fail "npx not found. Install Node.js 20+."
  has_error=1
fi

if [[ "$has_error" -ne 0 ]]; then
  printf "\n"
  info "Recommended next steps:"
  info "  1. Install full Xcode and open it once to complete setup."
  info "  2. Run: sudo xcode-select -s /Applications/Xcode.app/Contents/Developer"
  info "  3. Re-run: npm run ios:doctor"
  info "  4. For a simulator artifact on EAS, use the development-simulator profile."
  exit 1
fi

printf "\n"
pass "Local iOS tooling is ready for simulator validation"
