#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const envFile = process.env.RADIANT_ENV_FILE || path.join(projectRoot, '.env');

const errors = [];
const warnings = [];

function hasCommand(command) {
  const pathEntries = (process.env.PATH || '').split(path.delimiter).filter(Boolean);

  for (const entry of pathEntries) {
    const candidate = path.join(entry, command);
    if (fs.existsSync(candidate)) {
      return true;
    }
  }

  return false;
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function warn(message) {
  warnings.push(message);
  console.log(`WARN ${message}`);
}

function fail(message) {
  errors.push(message);
  console.error(`FAIL ${message}`);
}

function validateNodeVersion() {
  const major = Number(process.versions.node.split('.')[0] || '0');
  if (major >= 20) {
    pass(`Node.js ${process.versions.node}`);
  } else {
    fail(`Node.js ${process.versions.node} detected; use Node.js 20.x`);
  }
}

function validateRequiredCommands() {
  if (hasCommand('psql')) {
    pass('psql is available');
  } else {
    fail('psql is required to run db:migrate');
  }
}

function loadEnvFile() {
  if (!fs.existsSync(envFile)) {
    warn(`No .env found at ${envFile}; relying on shell environment`);
    return;
  }

  dotenv.config({ path: envFile });
  pass(`Loaded env file: ${envFile}`);
}

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    fail(`Missing required env var: ${name}`);
    return '';
  }
  pass(`${name} is set`);
  return value;
}

function validateDatabaseUrl(value) {
  if (!value) return;

  try {
    const url = new URL(value);
    if (!['postgres:', 'postgresql:'].includes(url.protocol)) {
      fail(`DATABASE_URL must use postgres:// or postgresql:// (received ${url.protocol})`);
      return;
    }

    if (!url.hostname) {
      fail('DATABASE_URL must include a hostname');
      return;
    }

    if (!url.pathname || url.pathname === '/') {
      fail('DATABASE_URL must include a database name');
      return;
    }

    pass(`DATABASE_URL parsed successfully (${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''})`);
  } catch (error) {
    fail(`DATABASE_URL is not a valid URL: ${error instanceof Error ? error.message : 'unknown error'}`);
  }
}

function validateJwtSecret(value) {
  if (!value) return;

  if (value === 'change-me-in-production') {
    fail('JWT_SECRET still uses the example placeholder');
    return;
  }

  if (value.length < 24) {
    fail('JWT_SECRET should have at least 24 characters for non-trivial entropy');
    return;
  }

  pass('JWT_SECRET length looks acceptable');
}

function validateNumericEnv(name, fallback) {
  const raw = process.env[name] ?? fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    fail(`${name} must be a positive number`);
    return;
  }

  pass(`${name}=${parsed}`);
}

console.log('INFO Radiant API preflight');
console.log(`INFO Project root: ${projectRoot}`);

validateNodeVersion();
validateRequiredCommands();
loadEnvFile();

const databaseUrl = requireEnv('DATABASE_URL');
const jwtSecret = requireEnv('JWT_SECRET');

validateDatabaseUrl(databaseUrl);
validateJwtSecret(jwtSecret);
validateNumericEnv('PORT', '3100');
validateNumericEnv('ACCESS_TOKEN_TTL_HOURS', '6');
validateNumericEnv('REFRESH_TOKEN_TTL_DAYS', '30');
validateNumericEnv('RATE_LIMIT_WINDOW_MS', '60000');
validateNumericEnv('RATE_LIMIT_MAX', '120');

if (warnings.length > 0) {
  console.log('\nINFO Warnings');
  for (const warning of warnings) {
    console.log(`INFO - ${warning}`);
  }
}

if (errors.length > 0) {
  console.log('\nINFO Next steps');
  console.log('INFO - create radiant-api/.env from .env.example or export the missing vars');
  console.log('INFO - confirm DATABASE_URL points to the target PostgreSQL instance');
  console.log('INFO - install PostgreSQL client tools so psql is available in PATH');
  console.log('INFO - rerun: npm run preflight');
  process.exit(1);
}

console.log('\nPASS API preflight completed');
