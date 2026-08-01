import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { validateMediaManifest } from './validate-media-manifest.mjs';

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function validItem(overrides = {}) {
  return {
    id: 'media:unit-1:test-image',
    assetPath: 'assets/test-image.png',
    sha256: sha256('safe-image'),
    modality: 'radiograph',
    region: 'thorax',
    authorizationRef: 'authorization:owner-2026-07-31',
    anonymization: {
      status: 'verified',
      method: 'metadata-stripped-and-visual-review',
      verifiedAt: '2026-07-31',
      verifiedByRole: 'content-owner',
    },
    altText: 'Radiografia de tórax sem identificadores visíveis.',
    hotspots: [
      { id: 'hotspot:lung', label: 'Campo pulmonar', x: 0.2, y: 0.2, width: 0.3, height: 0.4 },
    ],
    ...overrides,
  };
}

function readyManifest(item = validItem()) {
  return {
    schemaVersion: 1,
    batchId: 'unit-1-authorized-media-v1',
    status: 'ready',
    reviewedAt: '2026-07-31',
    items: [item],
    rejectedCandidates: [],
  };
}

test('accepts an authorized, anonymized asset whose SHA-256 matches', async () => {
  const repoRoot = await mkdtemp(path.join(os.tmpdir(), 'radiant-media-'));
  try {
    await mkdir(path.join(repoRoot, 'assets'));
    await writeFile(path.join(repoRoot, 'assets', 'test-image.png'), 'safe-image');

    const result = await validateMediaManifest(readyManifest(), { repoRoot });

    assert.equal(result.ok, true, JSON.stringify(result.errors));
    assert.equal(result.summary.itemCount, 1);
    assert.equal(result.summary.verifiedAnonymizationCount, 1);
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('requires authorization, SHA-256, accessible description, and verified anonymization', async () => {
  const item = validItem();
  delete item.sha256;
  delete item.authorizationRef;
  delete item.altText;
  item.anonymization.status = 'pending';

  const result = await validateMediaManifest(readyManifest(item), { verifyFiles: false });
  const rules = result.errors.map((error) => error.rule);

  assert.equal(result.ok, false);
  assert.ok(rules.includes('required-field'));
  assert.ok(rules.includes('anonymization-not-verified'));
});

test('rejects hotspots outside normalized bounds', async () => {
  const item = validItem({
    hotspots: [{ id: 'hotspot:bad', label: 'Fora', x: 0.8, y: 0.1, width: 0.4, height: 0.2 }],
  });

  const result = await validateMediaManifest(readyManifest(item), { verifyFiles: false });

  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.rule === 'hotspot-out-of-bounds'));
});

test('rejects patient, record, birth-date, and free DICOM fields without echoing values', async () => {
  const sensitiveValue = 'NEVER_ECHO_THIS_VALUE';
  const item = {
    ...validItem(),
    patientName: sensitiveValue,
    medicalRecordNumber: sensitiveValue,
    dateOfBirth: sensitiveValue,
    dicomMetadata: { freeText: sensitiveValue },
  };

  const result = await validateMediaManifest(readyManifest(item), { verifyFiles: false });
  const serialized = JSON.stringify(result);

  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.rule === 'disallowed-field'));
  assert.equal(serialized.includes(sensitiveValue), false);
});

test('reports a hash mismatch using only path and rule', async () => {
  const repoRoot = await mkdtemp(path.join(os.tmpdir(), 'radiant-media-'));
  try {
    await mkdir(path.join(repoRoot, 'assets'));
    await writeFile(path.join(repoRoot, 'assets', 'test-image.png'), 'different-bytes');

    const result = await validateMediaManifest(readyManifest(), { repoRoot });

    assert.equal(result.ok, false);
    assert.deepEqual(result.errors, [{ path: 'assets/test-image.png', rule: 'sha256-mismatch' }]);
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('allows an empty manifest only while explicitly awaiting authorized assets', async () => {
  const manifest = {
    schemaVersion: 1,
    batchId: 'unit-1-authorized-media-v1',
    status: 'awaiting-authorized-assets',
    reviewedAt: '2026-07-31',
    items: [],
    rejectedCandidates: [
      { assetPath: 'candidate.png', rules: ['contains-personal-data'] },
    ],
  };

  const result = await validateMediaManifest(manifest, { verifyFiles: false });

  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.equal(result.summary.rejectedCandidateCount, 1);
});
