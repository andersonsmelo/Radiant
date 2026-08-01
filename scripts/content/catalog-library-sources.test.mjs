import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  buildLibraryCatalog,
  validateLibraryCatalog,
} from './catalog-library-sources.mjs';

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function decision(overrides = {}) {
  return {
    title: 'Fonte de teste',
    contributors: ['Equipe editorial'],
    edition: '1a edicao',
    publicationDate: '2026',
    license: {
      status: 'verified',
      label: 'CC BY 4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
    rightsClass: 'authorized',
    commercialUse: true,
    allowedUses: ['factual-reference', 'adaptation'],
    decisionBasis: 'Licenca explicita verificada no documento.',
    ...overrides,
  };
}

test('buildLibraryCatalog groups duplicate PDFs by SHA-256 deterministically', async () => {
  const fixtureRoot = await mkdtemp(path.join(os.tmpdir(), 'radiant-library-'));

  try {
    const libraryRoot = path.join(fixtureRoot, 'Biblioteca');
    await import('node:fs/promises').then(({ mkdir }) => mkdir(libraryRoot));
    await writeFile(path.join(libraryRoot, 'b.pdf'), 'same-pdf');
    await writeFile(path.join(libraryRoot, 'a.pdf'), 'same-pdf');
    await writeFile(path.join(libraryRoot, 'c.pdf'), 'other-pdf');

    const duplicateHash = sha256('same-pdf');
    const uniqueHash = sha256('other-pdf');
    const catalog = await buildLibraryCatalog({
      libraryRoot,
      repoRoot: fixtureRoot,
      rightsDecisions: {
        [duplicateHash]: decision({ title: 'Duplicada' }),
        [uniqueHash]: decision({ title: 'Unica' }),
      },
    });

    assert.equal(catalog.summary.pdfFileCount, 3);
    assert.equal(catalog.summary.uniqueSourceCount, 2);
    assert.equal(catalog.summary.duplicateFileCount, 1);
    assert.deepEqual(catalog.sources[0].paths, [
      'Biblioteca/a.pdf',
      'Biblioteca/b.pdf',
    ]);
    assert.equal(catalog.sources[0].sha256, duplicateHash);
    assert.equal(catalog.sources[0].primaryPath, 'Biblioteca/a.pdf');
    assert.deepEqual(catalog.sources[0].duplicatePaths, ['Biblioteca/b.pdf']);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

test('validateLibraryCatalog requires SHA-256, edition, date, and license metadata', () => {
  const catalog = {
    schemaVersion: 1,
    decisionRevision: '2026-07-31',
    summary: { pdfFileCount: 1, uniqueSourceCount: 1, duplicateFileCount: 0 },
    sources: [{
      id: 'library-source:test',
      sha256: '',
      primaryPath: 'Biblioteca/test.pdf',
      paths: ['Biblioteca/test.pdf'],
      duplicatePaths: [],
      fileSizeBytes: 10,
      title: 'Teste',
      contributors: [],
      rightsClass: 'authorized',
      commercialUse: true,
      decisionBasis: 'Teste.',
    }],
  };

  const result = validateLibraryCatalog(catalog);

  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /sha256/i);
  assert.match(result.errors.join('\n'), /edition/i);
  assert.match(result.errors.join('\n'), /publicationDate/i);
  assert.match(result.errors.join('\n'), /license/i);
});

test('validateLibraryCatalog limits rightsClass to the governed values', () => {
  const entry = {
    id: 'library-source:test',
    sha256: 'a'.repeat(64),
    primaryPath: 'Biblioteca/test.pdf',
    paths: ['Biblioteca/test.pdf'],
    duplicatePaths: [],
    fileSizeBytes: 10,
    ...decision({ rightsClass: 'public-domain-ish' }),
  };
  const catalog = {
    schemaVersion: 1,
    decisionRevision: '2026-07-31',
    summary: { pdfFileCount: 1, uniqueSourceCount: 1, duplicateFileCount: 0 },
    sources: [entry],
  };

  const result = validateLibraryCatalog(catalog);

  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /rightsClass/i);
});

test('validateLibraryCatalog forbids commercial use for noncommercial licenses', () => {
  const entry = {
    id: 'library-source:test',
    sha256: 'b'.repeat(64),
    primaryPath: 'Biblioteca/test.pdf',
    paths: ['Biblioteca/test.pdf'],
    duplicatePaths: [],
    fileSizeBytes: 10,
    ...decision({
      license: {
        status: 'verified',
        label: 'CC BY-NC-SA 4.0',
        url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
      },
      commercialUse: true,
    }),
  };
  const catalog = {
    schemaVersion: 1,
    decisionRevision: '2026-07-31',
    summary: { pdfFileCount: 1, uniqueSourceCount: 1, duplicateFileCount: 0 },
    sources: [entry],
  };

  const result = validateLibraryCatalog(catalog);

  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /noncommercial/i);
});
