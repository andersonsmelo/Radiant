import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const routeRoot = path.join(appRoot, 'src/app');

// expo-router builds the route table with `require.context` over src/app, so
// EVERY file in that tree is pulled into the JS bundle — including files that
// were only ever meant to run under jest. A single `*.test.tsx` there is enough
// to drag @testing-library/react-native into the bundle, which requires node's
// `console` module and makes the app fail to boot with a red screen.
//
// This shipped once: `src/app/dev-console.test.tsx` reached main on 2026-08-21
// and broke startup. None of the other gate steps catch it, because none of
// them bundle the app — jest passes, typecheck passes, visual QA passes, and
// the app still does not open. Hence a structural rule.
//
// Tests for route modules live in `src/test/routes/`.
const forbidden = /\.(test|spec)\.[jt]sx?$/;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const found = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(full)));
    else if (forbidden.test(entry.name)) found.push(path.relative(appRoot, full));
  }
  return found;
}

test('no test files live inside the expo-router route tree', async () => {
  const offenders = await walk(routeRoot);
  assert.deepEqual(
    offenders,
    [],
    `These files are inside src/app and therefore inside the app bundle:\n` +
      offenders.map((f) => `  - ${f}`).join('\n') +
      `\nMove them to src/test/routes/ instead.`,
  );
});
