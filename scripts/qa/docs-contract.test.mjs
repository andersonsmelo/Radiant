import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { CURRENT_STATE_DOCUMENTS, inspectDocument } from './docs-contract.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('governs the newest execution status as a current-state document', () => {
  // Cada data de execução cria um snapshot novo e aposenta o anterior. Se a
  // lista de documentos governados não acompanhar, o contrato passa a validar
  // um estado histórico e para de checar o que está em vigor — a forma mais
  // silenciosa de o documento canônico voltar a divergir da realidade.
  const newest = readdirSync(path.join(repoRoot, 'docs'))
    .filter((name) => /^EXECUTION_STATUS_\d{4}-\d{2}-\d{2}\.md$/.test(name))
    .sort()
    .at(-1);

  assert.ok(newest, 'expected at least one EXECUTION_STATUS_<date>.md in docs/');
  assert.ok(
    CURRENT_STATE_DOCUMENTS.includes(`docs/${newest}`),
    `docs/${newest} is the newest execution status but is not a governed current-state document`,
  );
});

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
