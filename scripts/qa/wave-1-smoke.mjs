import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export function buildWave1Checks({ includeRemote = true } = {}) {
  const checks = [
    {
      id: 'documentation-contract',
      command: 'node',
      args: ['scripts/qa/docs-contract.mjs'],
    },
    {
      id: 'sync-catalog-app',
      command: 'node',
      args: ['scripts/content/sync-catalog-to-app.mjs'],
    },
    {
      id: 'sync-catalog-api',
      command: 'node',
      args: ['scripts/content/sync-catalog-to-api.mjs'],
    },
    {
      id: 'content-foundation',
      command: 'node',
      args: ['scripts/content/validate-foundation.mjs'],
    },
    {
      id: 'content-route',
      command: 'npm',
      args: ['test', '--', 'src/routes/content.test.ts', 'src/routes/content-contract.test.ts'],
      cwd: 'radiant-api',
      display: 'cd radiant-api && npm test -- src/routes/content.test.ts src/routes/content-contract.test.ts',
    },
    {
      id: 'editorial-status',
      command: 'rg',
      args: [
        '-n',
        'generatedAt|health|wave1Readiness|getWave1TrackReadiness',
        'tools/editorial-panel/app/api/status/route.ts',
        'tools/editorial-panel/lib/content-io.ts',
        'tools/editorial-panel/app/page.tsx',
      ],
    },
    {
      id: 'remote-api',
      command: 'node',
      args: ['scripts/qa/remote-api-smoke.mjs'],
      remote: true,
    },
  ];

  return includeRemote ? checks : checks.filter((check) => !check.remote);
}

export function formatCheckCommand(check) {
  return check.display ?? [check.command, ...check.args].join(' ');
}

function runCheck(check) {
  const result = spawnSync(check.command, check.args, {
    cwd: check.cwd ? path.join(REPO_ROOT, check.cwd) : REPO_ROOT,
    encoding: 'utf8',
    stdio: 'pipe',
  });

  return {
    id: check.id,
    status: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    error: result.error?.message,
  };
}

export function runWave1Smoke({ checks = buildWave1Checks(), executor = runCheck } = {}) {
  return checks.map((check) => {
    const result = executor(check);
    return {
      ...result,
      id: check.id,
      command: formatCheckCommand(check),
      ok: result.status === 0,
    };
  });
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const checks = buildWave1Checks({ includeRemote: !hasFlag('--skip-remote') });

  if (hasFlag('--list')) {
    for (const check of checks) {
      console.log(`${check.id}: ${formatCheckCommand(check)}`);
    }
    process.exit(0);
  }

  const results = runWave1Smoke({ checks });
  for (const result of results) {
    const marker = result.ok ? 'PASS' : 'FAIL';
    console.log(`${marker} ${result.id}: ${result.command}`);

    if (!result.ok) {
      const details = [result.error, result.stderr.trim(), result.stdout.trim()]
        .filter(Boolean)
        .join('\n');
      if (details) {
        console.error(details);
      }
    }
  }

  process.exit(results.every((result) => result.ok) ? 0 : 1);
}
