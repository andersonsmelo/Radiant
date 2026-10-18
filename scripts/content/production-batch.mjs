import { createHash } from 'node:crypto';
import { open, readFile, rename, rm } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import appContract from './load-app-contract.cjs';
const shared = appContract.loadAppContract('features/student-checkpoints/ProductionBatch.ts');

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

export function fingerprint(value) {
  return createHash('sha256').update(JSON.stringify(canonicalize(value))).digest('hex');
}

export function productionBatchMaterial(batch) {
  return {
    trackId: batch?.trackId,
    unitId: batch?.unitId,
    contentVersion: batch?.contentVersion,
    competencyIds: batch?.competencyIds,
    sources: batch?.sources,
    activities: batch?.activities,
    checkpoint: batch?.checkpoint,
    reinforcement: batch?.reinforcement,
    claimProvenance: batch?.claimProvenance,
  };
}

export function fingerprintProductionBatchMaterial(batch) {
  return fingerprint(productionBatchMaterial(batch));
}

export function validatePromotedBatch(batch) {
  return shared.validatePromotedProductionBatch(batch);
}

async function readCatalog(catalogPath) {
  try {
    const raw = await readFile(catalogPath, 'utf8');
    return { raw, value: JSON.parse(raw), sha256: fingerprint(JSON.parse(raw)) };
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
    const value = { schemaVersion: 1, batches: [], changes: [] };
    return { raw: null, value, sha256: 'absent' };
  }
}

function assertCatalogIdentities(batches) {
  const ids = new Set(batches.map(batch => batch.trackId));
  for (const batch of batches) {
    if (validatePromotedBatch(batch).length) throw new Error('production-catalog-invalid-batch');
    const identities = [batch.batchId, batch.unitId, batch.checkpoint.id,
      ...batch.competencyIds.map(id => `${batch.checkpoint.id}:${id.split(':').at(-1)}`),
      ...batch.activities.flatMap(activity => [activity.id, ...activity.steps.flatMap(step => step.kind === 'interaction'
        ? [step.interaction.id, ...step.interaction.payload.options.map(option => option.id)] : [step.id])]),
      ...batch.checkpoint.items.flatMap(item => [item.id, ...item.options.map(option => option.id)]),
    ];
    for (const id of identities) {
      if (ids.has(id)) throw new Error(`production-catalog-duplicate-identity:${id}`);
      ids.add(id);
    }
  }
}

/**
 * Publica um batch completo com compare-and-swap e um único rename atômico.
 * O changelog fica dentro do catálogo para não existir uma janela em que um
 * arquivo muda e o outro não. Catálogos existentes são append-only por batchId.
 */
export async function promoteProductionBatchArtifact({
  batch,
  catalogPath,
  expectedCatalogSha256,
  now = () => new Date().toISOString(),
  beforeRename = async () => undefined,
}) {
  const issues = validatePromotedBatch(batch);
  if (issues.length > 0) throw new Error(`production-batch-invalid:${issues.join(',')}`);
  const lockPath = `${catalogPath}.lock`;
  let lock;
  try {
    lock = await open(lockPath, 'wx');
  } catch (error) {
    if (error?.code === 'EEXIST') throw new Error('production-catalog-busy');
    throw error;
  }

  try {
    const current = await readCatalog(catalogPath);
    if (current.sha256 !== expectedCatalogSha256) throw new Error('production-catalog-concurrent-change');
    if (current.value.schemaVersion !== 1 || !Array.isArray(current.value.batches) || !Array.isArray(current.value.changes)) {
      throw new Error('production-catalog-invalid');
    }
    if (current.value.batches.some((entry) => entry.batchId === batch.batchId)) {
      throw new Error('production-batch-id-already-published');
    }

    assertCatalogIdentities([...current.value.batches, batch]);

    const next = {
      schemaVersion: 1,
      batches: [...current.value.batches, batch],
      changes: [...current.value.changes, {
        kind: 'batch-promoted',
        batchId: batch.batchId,
        materialSha256: batch.materialSha256,
        promotedAt: batch.promotedAt,
        catalogedAt: now(),
        rollback: { removeBatchId: batch.batchId, restoreCatalogSha256: current.sha256 },
      }],
    };
    const serialized = `${JSON.stringify(next, null, 2)}\n`;
    const temporaryPath = `${catalogPath}.tmp-${process.pid}-${Date.now()}`;
    let temporaryCreated = false;
    try {
      const file = await open(temporaryPath, 'wx');
      temporaryCreated = true;
      try {
        await file.writeFile(serialized, 'utf8');
        await file.sync();
      } finally {
        await file.close();
      }
      await beforeRename({ temporaryPath, catalogPath });
      await rename(temporaryPath, catalogPath);
      temporaryCreated = false;
      const directory = await open(dirname(catalogPath), 'r');
      try { await directory.sync(); } finally { await directory.close(); }
    } finally {
      if (temporaryCreated) await rm(temporaryPath, { force: true });
    }
    return { catalog: next, catalogSha256: fingerprint(next), previousCatalogSha256: current.sha256 };
  } finally {
    try {
      await lock.close();
    } finally {
      await rm(lockPath, { force: true });
    }
  }
}

async function main() {
  const args = Object.fromEntries(process.argv.slice(2).map((entry) => entry.split('=', 2)));
  if (!args['--input'] || !args['--catalog'] || !args['--expected-sha256']) {
    throw new Error('usage: --input=<json> --catalog=<json> --expected-sha256=<sha256|absent>');
  }
  const batch = JSON.parse(await readFile(args['--input'], 'utf8'));
  const result = await promoteProductionBatchArtifact({
    batch,
    catalogPath: args['--catalog'],
    expectedCatalogSha256: args['--expected-sha256'],
  });
  process.stdout.write(`${JSON.stringify({ ok: true, ...result })}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`${JSON.stringify({ ok: false, error: error.message })}\n`);
    process.exitCode = 1;
  });
}
