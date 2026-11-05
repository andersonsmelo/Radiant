import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { checkPilotPayloads } from './check-pilot-payloads.mjs';

const root = new URL('../../', import.meta.url);
const load = async () => JSON.parse(await readFile(new URL('docs/evidence/2026-11-03-pc05-payloads.json', root), 'utf8'));

test('real payloads hold five complete lessons, and the lot stays unpromotable', async () => {
  const result = await checkPilotPayloads(await load());
  assert.deepEqual(result.errors, []);
  assert.equal(result.completeCandidates, 1);
  assert.equal(result.completeLessons, 5);
  assert.equal(result.practiceDrafts, 4);
  assert.equal(result.recoveryActivities, 2);
  assert.equal(result.companionRecoveries, 8);
  assert.equal(result.assetsVerified, 4);
  assert.equal(result.promotionReady, false);
  assert.deepEqual(result.lotContractIssues, []);
  assert.ok(result.lotPromotionErrors.length > 0);
});

test('losing a checkpoint item reopens the lot coverage gap', async () => {
  const pack = await load(); pack.reviewEnvelope.checkpoint.items.pop();
  assert.ok((await checkPilotPayloads(pack)).errors.some(error => error.startsWith('full-lot:checkpoint-coverage:')));
});

test('each new lesson keeps its own per-option feedback, help and two recoveries', async () => {
  const feedback = await load(); const entry = feedback.lessonCompanions[0].checkpointOptionFeedback[0];
  delete entry.byOptionId[Object.keys(entry.byOptionId)[0]];
  assert.ok((await checkPilotPayloads(feedback)).errors.some(error => error.startsWith('companion-feedback:')));
  const recovery = await load(); recovery.lessonCompanions[1].recoveryActivities.pop();
  assert.ok((await checkPilotPayloads(recovery)).errors.some(error => error.startsWith('companion-recovery:')));
  const help = await load(); help.lessonCompanions[2].optionalHelp.text = ' ';
  assert.ok((await checkPilotPayloads(help)).errors.some(error => error.startsWith('companion-help:')));
});

test('brief notes cannot reach the student as lesson text', async () => {
  const pack = await load();
  pack.practiceDrafts[0].steps[0].payload.body = 'M01.01. Leitura de uma ficha; nao solicitar dado real.';
  assert.ok((await checkPilotPayloads(pack)).errors.some(error => error.startsWith('brief-text-exposed:')));
  const empty = await load(); delete empty.variants[0].steps.at(-1).payload.body;
  assert.ok((await checkPilotPayloads(empty)).errors.some(error => error.startsWith('brief-text-exposed:')));
});

test('a changed local asset fingerprint fails integrity without changing the asset', async () => {
  const pack = await load(); pack.assetBindings[0].sha256 = '0'.repeat(64);
  assert.ok((await checkPilotPayloads(pack)).errors.some(error => error.startsWith('asset-integrity:')));
});

test('missing checkpoint coverage cannot be disguised as a complete candidate', async () => {
  const pack = await load(); pack.completeCandidate.activities.push(pack.practiceDrafts[0]);
  assert.ok((await checkPilotPayloads(pack)).errors.some(error => error.startsWith('complete-candidate:')));
});

test('a brief cannot silently gain hash-bound approvals', async () => {
  const pack = await load(); pack.reviewEnvelope.approvals.rights = 'approved';
  assert.ok((await checkPilotPayloads(pack)).errors.some(error => error.includes('human-approval-must-remain-pending')));
});

test('recovery and checkpoint retain separate identities and per-option feedback', async () => {
  const pack = await load();
  const feedback = pack.checkpointOptionFeedback[0]; delete feedback.byOptionId[Object.keys(feedback.byOptionId)[1]];
  assert.ok((await checkPilotPayloads(pack)).errors.some(error => error.startsWith('checkpoint-option-feedback:')));
  const duplicate = await load(); duplicate.recoveryActivities[0].id = duplicate.completeCandidate.activities[0].id;
  assert.ok((await checkPilotPayloads(duplicate)).errors.some(error => error.startsWith('duplicate-package-identity:')));
});

test('invalid ordering and hotspot geometry fail the real shared activity schema', async () => {
  const pack = await load();
  pack.practiceDrafts[0].steps.find(step => step.kind === 'interaction').interaction.payload.correctOrder.pop();
  pack.practiceDrafts[1].steps.find(step => step.kind === 'interaction').interaction.payload.regions[0].x = 1.5;
  assert.ok((await checkPilotPayloads(pack)).errors.some(error => error.startsWith('activity:')));
});
