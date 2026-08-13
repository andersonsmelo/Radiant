import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import {
  fingerprint,
  fingerprintProductionBatchMaterial,
  promoteProductionBatchArtifact,
} from './production-batch.mjs';

function batch(overrides = {}) {
  const material = {
    schemaVersion: 1,
    state: 'promoted',
    batchId: 'production-batch:test:1',
    trackId: 'track:test',
    unitId: 'unit:test',
    contentVersion: 'test-v1',
    competencyIds: ['competency:test'],
    sources: [{ id: 'source:test' }],
    activities: [{ id: 'activity:1' }],
    checkpoint: { id: 'checkpoint:1' },
    reinforcement: { cycles: [] },
    claimProvenance: [],
    promotedAt: '2026-08-13T20:00:00.000Z',
    ...overrides,
  };
  const materialSha256 = fingerprintProductionBatchMaterial(material);
  return {
    ...material,
    materialSha256,
    approvals: ['technical', 'editorial', 'accessibility', 'rights', 'schema', 'product'].map((gate) => ({
      gate, decision: 'approved', materialSha256,
    })),
    ...overrides,
  };
}

describe('production batch atomic catalog', () => {
  it('publica batch e changelog juntos a partir de catálogo ausente', async () => {
    const root = await mkdtemp(join(tmpdir(), 'radiant-production-batch-'));
    try {
      const catalogPath = join(root, 'catalog.json');
      const result = await promoteProductionBatchArtifact({
        batch: batch(), catalogPath, expectedCatalogSha256: 'absent', now: () => '2026-08-13T20:01:00.000Z',
      });
      const persisted = JSON.parse(await readFile(catalogPath, 'utf8'));
      assert.equal(persisted.batches.length, 1);
      assert.equal(persisted.changes[0].rollback.restoreCatalogSha256, 'absent');
      assert.equal(result.catalogSha256, fingerprint(persisted));
    } finally { await rm(root, { recursive: true, force: true }); }
  });

  it('recusa expected hash stale sem alterar o catálogo', async () => {
    const root = await mkdtemp(join(tmpdir(), 'radiant-production-batch-'));
    try {
      const catalogPath = join(root, 'catalog.json');
      const initial = { schemaVersion: 1, batches: [], changes: [] };
      await writeFile(catalogPath, `${JSON.stringify(initial)}\n`);
      await assert.rejects(
        promoteProductionBatchArtifact({ batch: batch(), catalogPath, expectedCatalogSha256: 'stale' }),
        /production-catalog-concurrent-change/,
      );
      assert.deepEqual(JSON.parse(await readFile(catalogPath, 'utf8')), initial);
    } finally { await rm(root, { recursive: true, force: true }); }
  });

  it('remove o temporário e preserva o catálogo quando a promoção falha antes do rename', async () => {
    const root = await mkdtemp(join(tmpdir(), 'radiant-production-batch-'));
    try {
      const catalogPath = join(root, 'catalog.json');
      const initial = { schemaVersion: 1, batches: [], changes: [] };
      await writeFile(catalogPath, `${JSON.stringify(initial)}\n`);
      await assert.rejects(
        promoteProductionBatchArtifact({
          batch: batch(), catalogPath, expectedCatalogSha256: fingerprint(initial),
          beforeRename: async () => { throw new Error('injected-before-rename'); },
        }),
        /injected-before-rename/,
      );
      assert.deepEqual(JSON.parse(await readFile(catalogPath, 'utf8')), initial);
      assert.deepEqual((await readdir(root)).filter((name) => name.includes('.tmp-')), []);
    } finally { await rm(root, { recursive: true, force: true }); }
  });

  it('recusa gate ausente e batchId já publicado', async () => {
    const root = await mkdtemp(join(tmpdir(), 'radiant-production-batch-'));
    try {
      const catalogPath = join(root, 'catalog.json');
      const missingGate = batch();
      missingGate.approvals = missingGate.approvals.slice(1);
      await assert.rejects(
        promoteProductionBatchArtifact({ batch: missingGate, catalogPath, expectedCatalogSha256: 'absent' }),
        /approval-count:technical/,
      );
      const first = await promoteProductionBatchArtifact({ batch: batch(), catalogPath, expectedCatalogSha256: 'absent' });
      await assert.rejects(
        promoteProductionBatchArtifact({ batch: batch(), catalogPath, expectedCatalogSha256: first.catalogSha256 }),
        /production-batch-id-already-published/,
      );
    } finally { await rm(root, { recursive: true, force: true }); }
  });

  it('recusa conteúdo material alterado depois das aprovações', async () => {
    const root = await mkdtemp(join(tmpdir(), 'radiant-production-batch-'));
    try {
      const catalogPath = join(root, 'catalog.json');
      const tampered = batch();
      tampered.activities = [{ id: 'activity:1', title: 'conteúdo alterado' }];
      await assert.rejects(
        promoteProductionBatchArtifact({ batch: tampered, catalogPath, expectedCatalogSha256: 'absent' }),
        /production-batch-material-hash-mismatch/,
      );
    } finally { await rm(root, { recursive: true, force: true }); }
  });

  it('serializa escritores para impedir que duas promoções sobrescrevam o mesmo catálogo', async () => {
    const root = await mkdtemp(join(tmpdir(), 'radiant-production-batch-'));
    let releaseFirst;
    let firstReachedRename;
    try {
      const catalogPath = join(root, 'catalog.json');
      const reachedRename = new Promise((resolve) => { firstReachedRename = resolve; });
      const releaseRename = new Promise((resolve) => { releaseFirst = resolve; });
      const first = promoteProductionBatchArtifact({
        batch: batch(),
        catalogPath,
        expectedCatalogSha256: 'absent',
        beforeRename: async () => {
          firstReachedRename();
          await releaseRename;
        },
      });
      await reachedRename;

      await assert.rejects(
        promoteProductionBatchArtifact({
          batch: batch({ batchId: 'production-batch:test:2' }),
          catalogPath,
          expectedCatalogSha256: 'absent',
        }),
        /production-catalog-busy/,
      );
      releaseFirst();
      await first;

      const persisted = JSON.parse(await readFile(catalogPath, 'utf8'));
      assert.deepEqual(persisted.batches.map((entry) => entry.batchId), ['production-batch:test:1']);
      assert.deepEqual((await readdir(root)).filter((name) => name.endsWith('.lock')), []);
    } finally {
      releaseFirst?.();
      await rm(root, { recursive: true, force: true });
    }
  });
});
