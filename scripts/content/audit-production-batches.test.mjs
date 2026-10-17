import assert from 'node:assert/strict';
import { it } from 'node:test';
import { auditProductionBatches } from './audit-production-batches.mjs';
import appContract from './load-app-contract.cjs';
const baseline = appContract.loadAppContract('features/student-checkpoints/production-batches.ts').PRODUCTION_BATCHES[0];
const candidate = appContract.loadAppContract('features/student-checkpoints/EditorialCurriculumCandidate.ts').MATERIA_ENERGIA_E_RADIACAO_CANDIDATE;

it('mede cobertura e rendimento da amostra sem promover candidato pendente', () => {
  const report = auditProductionBatches([baseline, { batchId: 'candidate:pending', candidate }]);
  assert.deepEqual(report.validationYield, { totalBatches: 2, materialValid: 2, promotionValid: 1 });
  assert.equal(report.batches[0].outcome, 'promoted');
  assert.equal(report.batches[1].outcome, 'awaiting-promotion-gates');
  assert.equal(report.batches[0].claimCount, 154);
  assert.equal(report.batches[0].sourceCount, 8);
  assert.equal(report.batches[0].competencies.length, 5);
  assert.ok(report.batches[0].competencies.every(row => row.activityCount > 0 && row.checkpointItemCount === 2));
  assert.ok(report.batches[1].gates.every(gate => gate.state === 'pending-or-invalid'));
});
it('contabiliza retrabalho detectado e não chama hash antigo de aprovação', () => {
  const changed = JSON.parse(JSON.stringify(baseline));
  changed.activities[0].provenance.contentVersion = 'changed';
  const report = auditProductionBatches([changed]);
  assert.equal(report.validationYield.promotionValid, 0);
  assert.equal(report.batches[0].outcome, 'invalid-material');
  assert.ok(report.reworkByRule['activity-version-mismatch'] > 0);
  assert.ok(report.batches[0].promotionIssues.includes('production-batch-material-hash-mismatch'));
  assert.ok(report.batches[0].gates.every(gate => gate.state === 'pending-or-invalid'));
  assert.equal(report.reworkByRule['activity-version-mismatch'], 1);
});
it('recusa raiz inválida e preserva ausência de prova para entradas incompletas', () => {
  assert.throws(() => auditProductionBatches({}), /expected-batch-array/);
  const report = auditProductionBatches([null, {}]);
  assert.equal(report.validationYield.materialValid, 0);
  assert.equal(report.validationYield.promotionValid, 0);
});
