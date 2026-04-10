#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const outputPath = path.join(projectRoot, 'docs', 'release', 'APP_STORE_WAR_ROOM_LATEST.md');

const requiredMarkers = [
  '# Radiant App Store War Room Snapshot',
  'Decision suggested:',
  'review_prompt_shown:',
  'paywall_view:',
  'upgrade_interest_count:',
];
const placeholderMarkers = ['{{', 'EXPORT_FROM_TELEMETRY_DEBUG', 'PASTE_EXPORTED_LINES_HERE'];

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exit(1);
}

function readFromStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

function getInputFileArg() {
  const index = process.argv.findIndex((arg) => arg === '--input');
  if (index === -1) {
    return null;
  }

  return process.argv[index + 1] ?? null;
}

function validateSnapshot(content) {
  const missing = requiredMarkers.filter((marker) => !content.includes(marker));
  if (missing.length > 0) {
    fail(`Snapshot missing required markers: ${missing.join(', ')}`);
  }

  const hasPlaceholder = placeholderMarkers.some((marker) => content.includes(marker));
  if (hasPlaceholder) {
    fail('Snapshot still contains template placeholders');
  }
}

async function main() {
  console.log('INFO App Store war room snapshot save');
  console.log(`INFO Output path: ${outputPath}`);

  const inputFile = getInputFileArg();
  let content = '';

  if (inputFile) {
    const resolvedInput = path.resolve(process.cwd(), inputFile);
    if (!fs.existsSync(resolvedInput)) {
      fail(`Input file not found: ${resolvedInput}`);
    }
    content = fs.readFileSync(resolvedInput, 'utf8');
    pass(`Loaded snapshot from file: ${resolvedInput}`);
  } else if (!process.stdin.isTTY) {
    content = await readFromStdin();
    pass('Loaded snapshot from stdin');
  } else {
    fail('Provide snapshot content via stdin or --input <file>');
  }

  const normalized = content.trim();
  if (!normalized) {
    fail('Snapshot content is empty');
  }

  validateSnapshot(normalized);
  fs.writeFileSync(outputPath, `${normalized}\n`, 'utf8');
  pass(`Saved App Store snapshot to ${outputPath}`);
}

await main();
