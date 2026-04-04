import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');

const requiredPaths = [
  'conteúdo/README.md',
  'conteúdo/fontes',
  'conteúdo/extrações',
  'conteúdo/classificação',
  'conteúdo/conceitos',
  'conteúdo/formatos/microlições',
  'conteúdo/formatos/quizzes',
  'conteúdo/formatos/reviews',
  'conteúdo/formatos/casos',
  'conteúdo/formatos/checkpoints',
  'conteúdo/formatos/rewards',
  'conteúdo/governança/README.md',
  'conteúdo/taxonomia/README.md',
];

test('content foundation skeleton exists', () => {
  for (const relativePath of requiredPaths) {
    const absolutePath = path.join(repoRoot, relativePath);
    assert.equal(
      fs.existsSync(absolutePath),
      true,
      `Expected ${relativePath} to exist`
    );
  }
});

test('canonical docs reference the content foundation', () => {
  const readme = fs.readFileSync(path.join(repoRoot, 'README.md'), 'utf8');
  const contentPipeline = fs.readFileSync(path.join(repoRoot, 'docs/CONTENT_PIPELINE.md'), 'utf8');

  assert.match(readme, /conteúdo\//);
  assert.match(contentPipeline, /conteúdo\//);
  assert.match(contentPipeline, /validate-foundation\.mjs/);
});
