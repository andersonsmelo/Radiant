import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import appContract from './load-app-contract.cjs';
import { fingerprint } from './production-batch.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const { loadAppContract } = appContract;
const { validateLearningActivity } = loadAppContract('types/learningActivity.ts');
const { validateEditorialBatchContract } = loadAppContract('features/student-checkpoints/EditorialBatchContract.ts');
const { validateEditorialPilotContract } = loadAppContract('features/student-checkpoints/EditorialPilotContract.ts');
const { validateProductionBatchDraft, fingerprintProductionBatchMaterial } = loadAppContract('features/student-checkpoints/ProductionBatch.ts');
const readJson = async relative => JSON.parse(await readFile(path.join(root, relative), 'utf8'));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const same = (a, b) => fingerprint(a) === fingerprint(b);

/** Read-only check of the real review artifact. Never publishes or grants a gate. */
export async function checkPilotPayloads(pack) {
  const errors = [];
  if (pack.schemaVersion !== 1 || pack.kind !== 'pc05-review-payloads' || pack.state !== 'review-only-not-promotable'
      || pack.activation.promoted !== false || pack.activation.activeContentAdded !== false) errors.push('invalid-review-envelope');
  const manifest = await readJson('docs/evidence/2026-11-03-pc04-pilot-manifest.json');
  if (!same(pack.productionDocument, manifest.productionDocument)) errors.push('production-document-drift');
  errors.push(...Array.from(validateEditorialBatchContract(pack.completeCandidate), issue => `complete-candidate:${issue}`));
  errors.push(...Array.from(validateEditorialPilotContract(pack.reviewEnvelope), issue => `pilot:${issue}`));
  const activities = [...pack.completeCandidate.activities, ...pack.practiceDrafts, ...pack.variants, ...pack.recoveryActivities];
  const ids = new Set();
  const identity = id => { if (ids.has(id)) errors.push(`duplicate-package-identity:${id}`); ids.add(id); };
  for (const activity of activities) {
    identity(activity.id);
    errors.push(...Array.from(validateLearningActivity(activity), issue => `activity:${activity.id}:${issue.rule}`));
    for (const step of activity.steps) {
      identity(step.kind === 'presentation' ? step.id : step.interaction.id);
      if (step.kind !== 'interaction') continue;
      const payload = step.interaction.payload;
      for (const response of payload.options ?? payload.items ?? payload.regions ?? []) identity(response.id);
      if (step.interaction.completionRule !== 'confirmed') errors.push(`unconfirmed:${activity.id}`);
    }
  }
  const companions = pack.lessonCompanions ?? [];
  const companionRecoveries = companions.flatMap(companion => companion.recoveryActivities);
  for (const activity of companionRecoveries) {
    identity(activity.id);
    errors.push(...Array.from(validateLearningActivity(activity), issue => `activity:${activity.id}:${issue.rule}`));
    for (const step of activity.steps) {
      identity(step.kind === 'presentation' ? step.id : step.interaction.id);
      if (step.kind === 'interaction') step.interaction.payload.options.forEach(option => identity(option.id));
    }
  }
  // Notes to the author must never reach the student as lesson text.
  for (const activity of [...pack.practiceDrafts, ...pack.variants, ...companionRecoveries]) for (const step of activity.steps) {
    if (step.kind === 'presentation' && (typeof step.payload.body !== 'string' || !step.payload.body.trim() || /^M\d\d\.\d\d[.;]/.test(step.payload.body))) errors.push(`brief-text-exposed:${step.id}`);
  }
  if (!same(companions.map(companion => companion.targetId).sort(), pack.practiceDrafts.map(activity => activity.id).sort())) errors.push('companion-recovery:coverage');
  const lessonItems = pack.reviewEnvelope.checkpoint.items.slice(pack.completeCandidate.checkpoint.items.length);
  for (const item of lessonItems) { identity(item.id); item.options.forEach(option => identity(option.id)); }
  for (const companion of companions) {
    const items = lessonItems.filter(item => item.competencyIds.includes(companion.competencyId));
    if (companion.optionalHelp?.targetId !== companion.targetId || !companion.optionalHelp.text?.trim()) errors.push(`companion-help:${companion.targetId}`);
    const kinds = companion.recoveryActivities.map(activity => activity.steps.find(step => step.kind === 'interaction')?.interaction.evidenceKind);
    if (!same(kinds, ['guided-practice', 'applied-transfer'])) errors.push(`companion-recovery:${companion.targetId}`);
    if (companion.checkpointOptionFeedback.length !== items.length) errors.push(`companion-feedback:${companion.targetId}`);
    for (const item of items) {
      const feedback = companion.checkpointOptionFeedback.filter(entry => entry.targetId === item.id);
      if (feedback.length !== 1 || !same(Object.keys(feedback[0].byOptionId).sort(), item.options.map(option => option.id).sort())
          || Object.values(feedback[0].byOptionId).some(value => typeof value !== 'string' || !value.trim())) errors.push(`companion-feedback:${item.id}`);
    }
  }
  for (const item of pack.completeCandidate.checkpoint.items) {
    identity(item.id); item.options.forEach(option => identity(option.id));
    const feedback = pack.checkpointOptionFeedback.filter(entry => entry.targetId === item.id);
    if (feedback.length !== 1 || !same(Object.keys(feedback[0].byOptionId).sort(), item.options.map(option => option.id).sort())
        || Object.values(feedback[0].byOptionId).some(value => typeof value !== 'string' || !value.trim())) errors.push(`checkpoint-option-feedback:${item.id}`);
  }
  if (pack.checkpointOptionFeedback.length !== pack.completeCandidate.checkpoint.items.length) errors.push('checkpoint-option-feedback:orphan');
  if (!same(pack.reviewEnvelope.activities, activities.slice(0, -pack.recoveryActivities.length))
      || !same({ ...pack.reviewEnvelope.checkpoint, items: pack.reviewEnvelope.checkpoint.items.slice(0, pack.completeCandidate.checkpoint.items.length) }, pack.completeCandidate.checkpoint)) errors.push('review-envelope-material-drift');
  const lotContractIssues = Array.from(validateEditorialBatchContract(pack.reviewEnvelope));
  errors.push(...lotContractIssues.map(issue => `full-lot:${issue}`));
  let assetsVerified = 0;
  if (pack.assetBindings.length !== manifest.assets.length) errors.push('asset-binding-count');
  for (const binding of pack.assetBindings) {
    const known = manifest.assets.find(asset => asset.id === binding.id);
    const declared = pack.reviewEnvelope.pilot.assets.find(asset => asset.id === binding.id);
    if (!known || binding.localPath !== known.renderPath || binding.sourcePath !== known.sourcePath
        || !binding.localPath.startsWith('radiant-app/assets/content/rtg-2026/pilot/')
        || binding.sha256 !== known.renderSha256 || binding.uri !== declared?.uri || binding.sha256 !== declared?.sha256
        || binding.sourceSha256 !== known.sourceSha256) {
      errors.push(`asset-integrity:${binding.id}:manifest`); continue;
    }
    const png = await readFile(path.join(root, binding.localPath));
    const svg = await readFile(path.join(root, binding.sourcePath));
    if (sha256(png) !== binding.sha256 || sha256(svg) !== binding.sourceSha256) errors.push(`asset-integrity:${binding.id}:bytes`);
    else assetsVerified++;
  }
  const draft = { schemaVersion: 1, state: 'ready-for-promotion', batchId: 'batch:rtg-2026:pilot:review',
    candidate: pack.completeCandidate, materialSha256: fingerprintProductionBatchMaterial(pack.completeCandidate), media: [],
    schemaRefs: { activity: 'learning-activity.v2', checkpoint: 'unit-checkpoint.v1', batch: 'production-batch.v1' }, approvals: [] };
  const promotionErrors = Array.from(validateProductionBatchDraft(draft));
  if (!promotionErrors.length) errors.push('promotion-without-approvals');
  // A structurally complete lot is still not promotable without the six hash-bound approvals.
  const lotPromotionErrors = Array.from(validateProductionBatchDraft({ ...draft, candidate: pack.reviewEnvelope, materialSha256: fingerprintProductionBatchMaterial(pack.reviewEnvelope) }));
  if (!lotPromotionErrors.length) errors.push('lot-promotion-without-approvals');
  const state = await readJson('radiant-app/src/data/curriculum-state.json');
  const catalog = loadAppContract('features/student-checkpoints/production-batches.ts').PRODUCTION_BATCHES;
  // O pacote de revisão do piloto nunca foi promovido. O catálogo ativo só pode conter
  // lotes do contrato amplo gerados das aulas-fonte (ADR-2026-11-05), nunca o piloto.
  const packageIds = new Set([pack.completeCandidate.unitId, pack.reviewEnvelope.unitId, ...ids]);
  if (state.state !== 'retired' || Array.from(catalog).some(batch => batch.pilot !== undefined || batch.wide === undefined
      || !/^batch:rtg-2026:(m\d{2}|s-[a-z]{2})$/.test(batch.batchId)
      || packageIds.has(batch.unitId) || batch.activities.some(activity => packageIds.has(activity.id)))) errors.push('active-curriculum-changed');
  return { errors, completeCandidates: 1, completeLessons: 1 + companions.length, practiceDrafts: pack.practiceDrafts.length, recoveryActivities: pack.recoveryActivities.length, companionRecoveries: companionRecoveries.length,
    variants: pack.variants.length, assetsVerified, lotContractIssues, lotPromotionErrors, promotionReady: false, promotionErrors,
    packageSha256: fingerprint(pack), materialSha256: fingerprintProductionBatchMaterial(pack.completeCandidate),
    reviewMaterialSha256: fingerprintProductionBatchMaterial(pack.reviewEnvelope) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = await checkPilotPayloads(await readJson('docs/evidence/2026-11-03-pc05-payloads.json'));
  console.log(JSON.stringify(report, null, 2));
  process.exitCode = report.errors.length ? 1 : 0;
}
