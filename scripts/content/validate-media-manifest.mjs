import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultRepoRoot = path.resolve(__dirname, '..', '..');
const defaultManifestPath = path.join(defaultRepoRoot, 'Conteúdo', 'mídia', 'manifest.json');
const ROOT_FIELDS = new Set(['schemaVersion', 'batchId', 'status', 'reviewedAt', 'items', 'rejectedCandidates']);
const ITEM_FIELDS = new Set([
  'id', 'assetPath', 'sha256', 'modality', 'region', 'authorizationRef',
  'anonymization', 'altText', 'hotspots',
]);
const ANONYMIZATION_FIELDS = new Set(['status', 'method', 'verifiedAt', 'verifiedByRole']);
const HOTSPOT_FIELDS = new Set(['id', 'label', 'x', 'y', 'width', 'height']);
const REJECTED_FIELDS = new Set(['assetPath', 'rules']);
const REQUIRED_ITEM_FIELDS = [...ITEM_FIELDS];
const MODALITIES = new Set(['radiograph', 'ct', 'mri', 'mammography', 'illustration', 'photograph']);
const REJECTION_RULES = new Set([
  'contains-personal-data',
  'contains-financial-data',
  'contains-identifiable-person',
  'unverified-rights',
  'not-educational-derived-asset',
  'anonymization-not-verified',
]);
const SENSITIVE_TEXT = /patient|paciente|prontu[aá]rio|medical\s*record|date\s*of\s*birth|data\s*de\s*nascimento|dicom/i;

function pushError(errors, itemPath, rule) {
  if (!errors.some((error) => error.path === itemPath && error.rule === rule)) {
    errors.push({ path: itemPath, rule });
  }
}

function isSafeRelativePath(value) {
  return typeof value === 'string'
    && value.length > 0
    && !path.isAbsolute(value)
    && !value.split(/[\\/]+/).includes('..')
    && /^[\p{L}\p{N} ._()@+\-/]+$/u.test(value);
}

function safeItemPath(item, index) {
  return isSafeRelativePath(item?.assetPath) ? item.assetPath : `items[${index}]`;
}

function hasOnlyFields(value, allowed) {
  return value && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).every((key) => allowed.has(key));
}

function isNormalizedNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1;
}

function containsSensitiveText(value) {
  if (typeof value === 'string') {
    return SENSITIVE_TEXT.test(value);
  }
  if (Array.isArray(value)) {
    return value.some(containsSensitiveText);
  }
  if (value && typeof value === 'object') {
    return Object.values(value).some(containsSensitiveText);
  }
  return false;
}

export function validateMediaManifestStructure(manifest) {
  const errors = [];
  const root = manifest && typeof manifest === 'object' && !Array.isArray(manifest) ? manifest : {};
  const items = Array.isArray(root.items) ? root.items : [];
  const rejectedCandidates = Array.isArray(root.rejectedCandidates) ? root.rejectedCandidates : [];

  if (!hasOnlyFields(root, ROOT_FIELDS)) {
    pushError(errors, 'manifest', 'disallowed-field');
  }
  for (const field of ROOT_FIELDS) {
    if (!Object.hasOwn(root, field)) {
      pushError(errors, 'manifest', 'required-field');
    }
  }
  if (root.schemaVersion !== 1) {
    pushError(errors, 'manifest', 'invalid-schema-version');
  }
  if (!['ready', 'awaiting-authorized-assets'].includes(root.status)) {
    pushError(errors, 'manifest', 'invalid-status');
  }
  if (!Array.isArray(root.items) || !Array.isArray(root.rejectedCandidates)) {
    pushError(errors, 'manifest', 'invalid-collection');
  }
  if (root.status === 'ready' && items.length === 0) {
    pushError(errors, 'manifest', 'empty-ready-manifest');
  }

  const seenIds = new Set();
  const seenPaths = new Set();

  for (const [index, item] of items.entries()) {
    const itemPath = safeItemPath(item, index);
    if (!hasOnlyFields(item, ITEM_FIELDS)) {
      pushError(errors, itemPath, 'disallowed-field');
    }
    for (const field of REQUIRED_ITEM_FIELDS) {
      if (!Object.hasOwn(item ?? {}, field)) {
        pushError(errors, itemPath, 'required-field');
      }
    }
    if (typeof item?.id !== 'string' || !/^media:[a-z0-9][a-z0-9:-]*$/.test(item.id)) {
      pushError(errors, itemPath, 'invalid-id');
    } else if (seenIds.has(item.id)) {
      pushError(errors, itemPath, 'duplicate-id');
    } else {
      seenIds.add(item.id);
    }
    if (!isSafeRelativePath(item?.assetPath)) {
      pushError(errors, itemPath, 'unsafe-asset-path');
    } else if (seenPaths.has(item.assetPath)) {
      pushError(errors, itemPath, 'duplicate-asset-path');
    } else {
      seenPaths.add(item.assetPath);
    }
    if (!/^[a-f0-9]{64}$/.test(item?.sha256 ?? '')) {
      pushError(errors, itemPath, 'invalid-sha256');
    }
    if (!MODALITIES.has(item?.modality)) {
      pushError(errors, itemPath, 'invalid-modality');
    }
    if (typeof item?.region !== 'string' || item.region.length === 0) {
      pushError(errors, itemPath, 'invalid-region');
    }
    if (typeof item?.authorizationRef !== 'string' || !/^authorization:[a-z0-9][a-z0-9:-]*$/.test(item.authorizationRef)) {
      pushError(errors, itemPath, 'invalid-authorization-reference');
    }
    if (!hasOnlyFields(item?.anonymization, ANONYMIZATION_FIELDS)) {
      pushError(errors, itemPath, 'disallowed-field');
    }
    if (item?.anonymization?.status !== 'verified') {
      pushError(errors, itemPath, 'anonymization-not-verified');
    }
    for (const field of ANONYMIZATION_FIELDS) {
      if (typeof item?.anonymization?.[field] !== 'string' || item.anonymization[field].length === 0) {
        pushError(errors, itemPath, 'invalid-anonymization-evidence');
      }
    }
    if (typeof item?.altText !== 'string' || item.altText.trim().length < 10) {
      pushError(errors, itemPath, 'invalid-accessible-description');
    }
    if (containsSensitiveText(item)) {
      pushError(errors, itemPath, 'sensitive-text-detected');
    }
    if (!Array.isArray(item?.hotspots)) {
      pushError(errors, itemPath, 'invalid-hotspots');
    } else {
      for (const [hotspotIndex, hotspot] of item.hotspots.entries()) {
        const hotspotPath = `${itemPath}/hotspots[${hotspotIndex}]`;
        if (!hasOnlyFields(hotspot, HOTSPOT_FIELDS)) {
          pushError(errors, hotspotPath, 'disallowed-field');
          continue;
        }
        const bounds = ['x', 'y', 'width', 'height'].map((field) => hotspot[field]);
        if (bounds.some((value) => !isNormalizedNumber(value))
          || hotspot.x + hotspot.width > 1
          || hotspot.y + hotspot.height > 1) {
          pushError(errors, hotspotPath, 'hotspot-out-of-bounds');
        }
      }
    }
  }

  for (const [index, candidate] of rejectedCandidates.entries()) {
    const candidatePath = isSafeRelativePath(candidate?.assetPath) ? candidate.assetPath : `rejectedCandidates[${index}]`;
    if (!hasOnlyFields(candidate, REJECTED_FIELDS)) {
      pushError(errors, candidatePath, 'disallowed-field');
    }
    if (!isSafeRelativePath(candidate?.assetPath)) {
      pushError(errors, candidatePath, 'unsafe-asset-path');
    }
    if (!Array.isArray(candidate?.rules)
      || candidate.rules.length === 0
      || candidate.rules.some((rule) => !REJECTION_RULES.has(rule))) {
      pushError(errors, candidatePath, 'invalid-rejection-rule');
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    summary: {
      status: root.status ?? 'invalid',
      itemCount: items.length,
      verifiedAnonymizationCount: items.filter((item) => item?.anonymization?.status === 'verified').length,
      rejectedCandidateCount: rejectedCandidates.length,
    },
  };
}

export async function validateMediaManifest(manifest, { repoRoot = defaultRepoRoot, verifyFiles = true } = {}) {
  const result = validateMediaManifestStructure(manifest);
  if (!verifyFiles) {
    return result;
  }

  for (const [index, item] of (manifest?.items ?? []).entries()) {
    const itemPath = safeItemPath(item, index);
    if (!isSafeRelativePath(item?.assetPath) || !/^[a-f0-9]{64}$/.test(item?.sha256 ?? '')) {
      continue;
    }
    const absolutePath = path.resolve(repoRoot, item.assetPath);
    const relative = path.relative(repoRoot, absolutePath);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      pushError(result.errors, itemPath, 'unsafe-asset-path');
      continue;
    }
    try {
      const bytes = await readFile(absolutePath);
      const actualHash = createHash('sha256').update(bytes).digest('hex');
      if (actualHash !== item.sha256) {
        pushError(result.errors, itemPath, 'sha256-mismatch');
      }
    } catch {
      pushError(result.errors, itemPath, 'asset-not-found');
    }
  }

  result.ok = result.errors.length === 0;
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const manifest = JSON.parse(fs.readFileSync(defaultManifestPath, 'utf8'));
  const result = await validateMediaManifest(manifest);
  const output = JSON.stringify(result, null, 2);
  if (!result.ok) {
    console.error(output);
    process.exit(1);
  }
  console.log(output);
}
