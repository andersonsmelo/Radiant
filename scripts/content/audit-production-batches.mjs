import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import appContract from './load-app-contract.cjs';
const shared = appContract.loadAppContract('features/student-checkpoints/ProductionBatch.ts');
const editorial = appContract.loadAppContract('features/student-checkpoints/EditorialBatchContract.ts');

/** Leitura somente. Rendimento é de validação nesta amostra, nunca eficácia educacional ou custo editorial. */
export function auditProductionBatches(batches) {
  if (!Array.isArray(batches)) throw Error('expected-batch-array');
  const rows = batches.map(batch => {
    const material = batch?.candidate ?? batch;
    const materialIssues = Array.from(editorial.validateEditorialBatchContract(batch?.state === 'promoted'
      ? { ...material, schemaVersion: 1, promotionState: 'human-gates-pending', approvals: Object.fromEntries(shared.PRODUCTION_BATCH_APPROVAL_GATES.map(gate => [gate, 'pending'])) }
      : material));
    let promotionIssues;
    try {
      promotionIssues = Array.from(batch?.state === 'promoted'
        ? shared.validatePromotedProductionBatch(batch)
        : shared.validateProductionBatchDraft(batch));
    } catch { promotionIssues = ['invalid-production-batch-shape']; }
    const gates = shared.PRODUCTION_BATCH_APPROVAL_GATES.map(gate => {
      const decisions = Array.isArray(batch?.approvals) ? batch.approvals.filter(approval => approval?.gate === gate) : [];
      const issue = promotionIssues.find(entry => entry.endsWith(`:${gate}`) || entry === 'production-batch-material-hash-mismatch' || entry === 'invalid-production-batch-shape');
      return { gate, state: issue || decisions.length !== 1 ? 'pending-or-invalid' : 'approved' };
    });
    return {
      batchId: batch?.batchId ?? null, contentVersion: material?.contentVersion ?? null,
      materialSha256: batch?.materialSha256 ?? null,
      outcome: promotionIssues.length === 0 ? (batch.state === 'promoted' ? 'promoted' : 'ready-for-promotion')
        : materialIssues.length ? 'invalid-material' : 'awaiting-promotion-gates',
      activityCount: Array.isArray(material?.activities) ? material.activities.length : 0,
      checkpointItemCount: Array.isArray(material?.checkpoint?.items) ? material.checkpoint.items.length : 0,
      sourceCount: Array.isArray(material?.sources) ? material.sources.length : 0,
      claimCount: Array.isArray(material?.claimProvenance) ? material.claimProvenance.length : 0,
      competencies: (Array.isArray(material?.competencyIds) ? material.competencyIds : []).map(id => ({ id,
        activityCount: Array.isArray(material.activities) ? material.activities.filter(activity => activity?.competencyIds?.includes(id)).length : 0,
        checkpointItemCount: Array.isArray(material.checkpoint?.items) ? material.checkpoint.items.filter(item => item?.competencyIds?.includes(id)).length : 0,
      })),
      gates, materialIssues, promotionIssues,
    };
  });
  const reworkByRule = {};
  for (const row of rows) {
    const rules = new Set([...row.materialIssues, ...row.promotionIssues].map(issue => issue.replace(/^invalid-editorial-candidate:/, '').split(':')[0]));
    for (const rule of rules) reworkByRule[rule] = (reworkByRule[rule] ?? 0) + 1;
  }
  return { schemaVersion: 1, scope: 'local-editorial-validation',
    validationYield: { totalBatches: rows.length, materialValid: rows.filter(row => row.materialIssues.length === 0).length,
      promotionValid: rows.filter(row => row.promotionIssues.length === 0).length },
    reworkByRule, batches: rows };
}

async function main() {
  const args = process.argv.slice(2);
  const inputArg = args.find(arg => arg.startsWith('--input='));
  if (args.some(arg => arg !== '--check' && !arg.startsWith('--input='))) throw Error('usage: [--input=<json-array>] [--check]');
  const batches = inputArg ? JSON.parse(await readFile(inputArg.slice('--input='.length), 'utf8'))
    : appContract.loadAppContract('features/student-checkpoints/production-batches.ts').PRODUCTION_BATCHES;
  const report = auditProductionBatches(batches);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (args.includes('--check') && report.validationYield.promotionValid !== report.validationYield.totalBatches) process.exitCode = 1;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch(error => {
  process.stderr.write(`${JSON.stringify({ ok: false, error: error.message })}\n`); process.exitCode = 1;
});
