import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import {
  fingerprint,
  fingerprintProductionBatchMaterial,
  promoteProductionBatchArtifact,
  validatePromotedBatch,
} from './production-batch.mjs';

import appContract from './load-app-contract.cjs';
const { loadAppContract } = appContract;
const baseline = JSON.parse(JSON.stringify(loadAppContract('features/student-checkpoints/production-batches.ts').PRODUCTION_BATCHES[0]));
const { createProductionCurriculumCatalog } = loadAppContract('features/student-checkpoints/createProductionCurriculumCatalog.ts');
function batch(overrides = {}) {
  return { ...JSON.parse(JSON.stringify(baseline)), ...overrides };
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
      const compiled = createProductionCurriculumCatalog([{ batch: persisted.batches[0], presentation: { slug: 'fixture', title: 'Fixture', description: 'Fixture', unitTitle: 'Fixture', reward: { id: 'reward:fixture', title: 'Fixture', description: 'Fixture' } } }]);
      assert.equal(compiled.listLessonSummaries().length, 12);
      assert.equal(compiled.getActivityById(baseline.activities[0].id).id, baseline.activities[0].id);
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
        /missing-approval:technical/,
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

  it('recusa colisão entre lotes sem perder o catálogo anterior', async () => {
    const root = await mkdtemp(join(tmpdir(), 'radiant-g3-collision-'));
    try {
      const catalogPath = join(root, 'catalog.json');
      const first = await promoteProductionBatchArtifact({ batch: batch(), catalogPath, expectedCatalogSha256: 'absent' });
      const before = await readFile(catalogPath, 'utf8');
      await assert.rejects(promoteProductionBatchArtifact({ batch: batch({ batchId: 'batch:different-id' }), catalogPath, expectedCatalogSha256: first.catalogSha256 }), /production-catalog-duplicate-identity/);
      assert.equal(await readFile(catalogPath, 'utf8'), before);
      assert.deepEqual((await readdir(root)).filter(name => name.endsWith('.lock') || name.includes('.tmp-')), []);
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
      assert.deepEqual(persisted.batches.map((entry) => entry.batchId), [baseline.batchId]);
      assert.deepEqual((await readdir(root)).filter((name) => name.endsWith('.lock')), []);
    } finally {
      releaseFirst?.();
      await rm(root, { recursive: true, force: true });
    }
  });
});

describe('shared app/CLI contract', () => {
  it('matches SHA256 from Node crypto and keeps historical material unchanged', () => {
    const shared = loadAppContract('features/student-checkpoints/ProductionBatch.ts');
    assert.equal(shared.fingerprintProductionBatchMaterial(baseline), fingerprintProductionBatchMaterial(baseline));
    assert.equal(baseline.materialSha256, fingerprintProductionBatchMaterial(baseline));
    assert.deepEqual(Array.from(validatePromotedBatch(baseline)), []);
  });
  for (const [name, mutate, issue] of [
    ['invalid payload with fresh hash', b => { b.checkpoint.items[0].correctOptionId = 'unknown'; }, 'invalid-checkpoint-item'],
    ['missing claim with fresh hash', b => { b.claimProvenance.shift(); }, 'missing-claim-provenance'],
    ['reviewer absent', b => { delete b.approvals[0].reviewerRef; }, 'invalid-approval:technical'],
    ['duplicate gate', b => { b.approvals.push(b.approvals[0]); }, 'duplicate-approval:technical'],
    ['unknown gate', b => { b.approvals.push({ ...b.approvals[0], gate: 'unknown' }); }, 'unknown-approval-gate'],
    ['unapproved media', b => { b.media = ['image:unapproved']; }, 'unapproved-production-batch-media'],
    ['unknown schema', b => { b.schemaRefs.batch = 'production-batch.v2'; }, 'invalid-production-batch-schema-refs'],
    ['missing promotion', b => { b.promotionRef = ''; }, 'invalid-promotion-authorization'],
  ]) {
    it(`rejects ${name} before any write`, async () => {
      const root = await mkdtemp(join(tmpdir(), 'radiant-g3-rejected-'));
      try {
        const value = batch();
        mutate(value);
        value.materialSha256 = fingerprintProductionBatchMaterial(value);
        value.approvals.forEach(a => { a.materialSha256 = value.materialSha256; });
        const issues = Array.from(validatePromotedBatch(value));
        assert.ok(issues.some(entry => entry.includes(issue)), issues.join(','));
        await assert.rejects(promoteProductionBatchArtifact({ batch: value, catalogPath: join(root, 'catalog.json'), expectedCatalogSha256: 'absent' }), /production-batch-invalid/);
        assert.deepEqual(await readdir(root), []);
      } finally { await rm(root, { recursive: true, force: true }); }
    });
  }
  it('rejects malformed JSON values without treating untested input as valid', () => {
    for (const value of [null, [], {}, { state: 'promoted', approvals: {} }]) assert.ok(validatePromotedBatch(value).length);
  });
});
