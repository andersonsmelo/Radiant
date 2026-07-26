import assert from 'node:assert/strict';
import test from 'node:test';
import { inspectDocument } from './docs-contract.mjs';

test('flags the legacy Radiant workspace path in a current-state document', () => {
  const violations = inspectDocument({
    relativePath: 'README.md',
    content: 'Abra /Users/anderson/Documents/Radiant/radiant-app para continuar.',
  });

  assert.deepEqual(violations, [
    'README.md: contains the retired workspace path /Users/anderson/Documents/Radiant.',
  ]);
});

test('flags an API availability statement that contradicts the known inactive state', () => {
  const violations = inspectDocument({
    relativePath: 'README.md',
    content: 'O backend está publicado e respondendo em https://api.radiant.ascendcreative.com.br.',
  });

  assert.deepEqual(violations, [
    'README.md: claims the public API is available; the current canonical status is inactive (HTTP 502).',
  ]);
});

test('flags an editorial approval claim that hides items needing review', () => {
  const violations = inspectDocument({
    relativePath: 'README.md',
    content: '96 bundles gerados e aprovados — 0 em needs-review.',
  });

  assert.deepEqual(violations, [
    'README.md: claims zero editorial items need review; the validated baseline still has review debt.',
  ]);
});

test('flags the same editorial claim when Markdown code marks surround the values', () => {
  const violations = inspectDocument({
    relativePath: 'README.md',
    content: '96 bundles gerados e aprovados — `0` em `needs-review`.',
  });

  assert.deepEqual(violations, [
    'README.md: claims zero editorial items need review; the validated baseline still has review debt.',
  ]);
});

test('accepts an honest local-first status statement', () => {
  assert.deepEqual(
    inspectDocument({
      relativePath: 'docs/EXECUTION_STATUS_2026-07-26.md',
      content: 'O app funciona local-first. A API pública conhecida está inativa e retorna HTTP 502.',
    }),
    []
  );
});
