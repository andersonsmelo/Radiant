import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerSource } from './register-source.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');

test('registerSource normalizes metadata for the pilot book', () => {
  const result = registerSource({
    inputPath: path.join(
      repoRoot,
      'conteúdo',
      '02.-Fundamentos-de-radiologia-Autor-Everton-Costa-Pinto.pdf'
    ),
  });

  assert.equal(result.slug, 'fundamentos-de-radiologia-everton-costa-pinto');
  assert.equal(result.title, 'Fundamentos de Radiologia');
  assert.equal(result.sourceType, 'pdf');
  assert.equal(result.authorLabel, 'Everton Costa Pinto');
  assert.equal(result.fileExists, true);
  assert.equal(result.fileSizeBytes > 0, true);
  assert.equal(result.ingestionStatus, 'registered');
  assert.equal(result.extractionStatus, 'pending');
  assert.equal(result.classificationStatus, 'pending');
  assert.equal(result.conceptStatus, 'pending');
  assert.equal(result.formatStatus, 'pending');
});
