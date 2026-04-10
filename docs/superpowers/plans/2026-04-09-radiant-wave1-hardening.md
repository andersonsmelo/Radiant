# Radiant Wave 1 Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-run and harden the Wave 1 editorial/runtime smoke, validate the published API path from the app/runtime side, add automated journey flow coverage, and close the most relevant accessibility and observability gaps.

**Architecture:** Keep the existing local-first runtime and editorial promotion flow intact, but strengthen it through executable smoke checks and focused test coverage. Favor deterministic scripts and narrow UI changes over broad refactors so the package can land cleanly alongside the current parallel workspace.

**Tech Stack:** Node.js scripts, Fastify tests, Expo/React Native, Jest/@testing-library/react-native, shell curl/smoke validation

---

### Task 1: Baseline the current checks

**Files:**
- Inspect: `scripts/qa/wave-1-smoke.mjs`
- Inspect: `scripts/content/sync-catalog-to-app.mjs`
- Inspect: `scripts/content/sync-catalog-to-api.mjs`
- Inspect: `scripts/launch-war-room.sh`

- [x] Run the current editorial sync and smoke commands to capture failures or missing coverage.
- [x] Record which gaps are script gaps versus runtime/API gaps.

### Task 2: Harden Wave 1 smoke coverage

**Files:**
- Modify: `scripts/qa/wave-1-smoke.mjs`
- Modify: `scripts/qa/wave-1-smoke.test.mjs`
- Test: `scripts/qa/wave-1-smoke.test.mjs`

- [x] Expand the smoke definition so it covers editorial sync plus app/API alignment checks, not only command listing.
- [x] Keep the smoke script deterministic and shell-friendly.
- [x] Update the test to assert the strengthened check set.

### Task 3: Validate published API from the current runtime contract

**Files:**
- Add: `scripts/qa/remote-api-smoke.mjs`
- Add: `scripts/qa/remote-api-smoke.test.mjs`
- Inspect: `radiant-app/src/features/content/services/RemoteCatalogService.ts`

- [x] Run the remote health/ready/catalog checks against the published API.
- [x] Confirm the runtime contract still matches what `RemoteCatalogService` expects.
- [x] Patch only the smallest mismatch if a contract hardening change is needed.

**Result:** The local contract is aligned, and the VPS runtime was redeployed with the Wave 1 editorial catalog. The HostGator zone now publishes `api.radiant.ascendcreative.com.br -> 69.6.222.219`; `/health`, `/ready`, and `/v1/content/catalog` pass through the public hostname, and the catalog returns `version: "1.0.0"`, `tracks`, and `16` lessons.

### Task 4: Add automated journey flow coverage

**Files:**
- Modify: `radiant-app/src/features/journey/screens/JourneyHomeScreen.tsx`
- Modify: `radiant-app/src/features/journey/components/JourneyTrackCard.tsx`
- Add or modify tests near: `radiant-app/src/features/journey/`

- [x] Add stable test hooks/accessibility labels where needed for deterministic testing.
- [x] Add Jest/testing-library coverage for selecting `Fundamentos`, `Tórax`, and `Abdome`.
- [x] Assert that track selection updates the active track and attempts to continue the next eligible node.

### Task 5: Review and tighten a11y + observability

**Files:**
- Modify: `radiant-app/src/features/journey/screens/JourneyHomeScreen.tsx`
- Modify: `radiant-app/src/features/journey/components/JourneyTrackCard.tsx`
- Modify: `radiant-app/src/features/progress/screens/ProgressScreen.tsx`

- [x] Improve accessibility semantics on the track shelf / cards and any actionable journey controls touched by Task 4.
- [x] Review the telemetry and debug surfaces for share/report actions and loading/empty states.
- [x] Add only the minimum code needed to make those surfaces clearer and more testable.

### Task 6: Verify end-to-end package

**Files:**
- Verify: `scripts/qa/wave-1-smoke.mjs`
- Verify: `radiant-app/`
- Verify: `radiant-api/`

- [x] Run the editorial sync, hardened smoke, relevant API tests, and new journey tests.
- [x] Summarize remaining gaps that still depend on physical-device/App Store infrastructure rather than repo code.

**Verification:** Full Wave 1 smoke passes, including the remote API check. Flow tests pass, typecheck passes, and lint exits 0 with existing warnings. The remote smoke uses public A-record resolution plus a controlled request lookup so stale local OS DNS cache does not mask the authoritative DNS state.
