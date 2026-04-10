#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const strictMode = process.argv.includes('--strict');
const snapshotPath = process.env.RADIANT_APP_STORE_SNAPSHOT_FILE
  ? path.resolve(process.cwd(), process.env.RADIANT_APP_STORE_SNAPSHOT_FILE)
  : path.join(projectRoot, 'docs', 'release', 'APP_STORE_WAR_ROOM_LATEST.md');

const requiredMarkers = [
  '# Radiant App Store War Room Snapshot',
  'Decision suggested:',
  'review_prompt_shown:',
  'paywall_view:',
  'upgrade_interest_count:',
];
const placeholderMarkers = ['{{', 'EXPORT_FROM_TELEMETRY_DEBUG', 'PASTE_EXPORTED_LINES_HERE'];

let hasError = false;

function pass(message) {
  console.log(`PASS ${message}`);
}

function warn(message) {
  console.log(`WARN ${message}`);
}

function fail(message) {
  hasError = true;
  console.error(`FAIL ${message}`);
}

function checkSnapshotExists() {
  if (fs.existsSync(snapshotPath)) {
    pass(`App Store snapshot found: ${snapshotPath}`);
    return true;
  }

  const message = `App Store snapshot not found at ${snapshotPath}`;
  if (strictMode) {
    fail(message);
  } else {
    warn(message);
    warn('Generate it from Telemetry Debug > Compartilhar war room snapshot before strict release sign-off.');
  }
  return false;
}

function checkSnapshotMarkers(content) {
  const missing = requiredMarkers.filter((marker) => !content.includes(marker));
  if (missing.length === 0) {
    pass('App Store snapshot contains required markers');
    return;
  }

  const message = `Snapshot missing required markers: ${missing.join(', ')}`;
  if (strictMode) {
    fail(message);
  } else {
    warn(message);
  }
}

function checkSnapshotPlaceholderState(content) {
  const foundPlaceholder = placeholderMarkers.some((marker) => content.includes(marker));
  if (!foundPlaceholder) {
    pass('App Store snapshot does not look like a placeholder');
    return;
  }

  const message = 'App Store snapshot still contains template placeholders';
  if (strictMode) {
    fail(message);
  } else {
    warn(message);
    warn('Replace the placeholder file with the latest export from Telemetry Debug before strict release sign-off.');
  }
}

function checkSnapshotFreshness() {
  const stats = fs.statSync(snapshotPath);
  const ageMs = Date.now() - stats.mtimeMs;
  const ageHours = Math.floor(ageMs / (1000 * 60 * 60));

  if (ageHours <= 24) {
    pass(`App Store snapshot freshness OK (${ageHours}h old)`);
    return;
  }

  const message = `App Store snapshot is stale (${ageHours}h old)`;
  if (strictMode) {
    fail(message);
  } else {
    warn(message);
  }
}

console.log('INFO App Store war room snapshot check');
console.log(`INFO Project root: ${projectRoot}`);
console.log(`INFO Snapshot path: ${snapshotPath}`);
console.log(`INFO Mode: ${strictMode ? 'strict' : 'advisory'}`);

if (checkSnapshotExists()) {
  const content = fs.readFileSync(snapshotPath, 'utf8');
  checkSnapshotMarkers(content);
  checkSnapshotPlaceholderState(content);
  checkSnapshotFreshness();
}

if (hasError) {
  console.log('\nINFO Next steps');
  console.log(`INFO - export the latest runtime snapshot to ${snapshotPath}`);
  console.log(`INFO - use ${path.join(projectRoot, 'docs', 'release', 'APP_STORE_WAR_ROOM_TEMPLATE.md')} as the canonical format`);
  console.log('INFO - rerun: npm run app-store:ops-check:strict');
  process.exit(1);
}

console.log('\nPASS App Store war room snapshot check completed');
