import { execFileSync } from 'node:child_process';
import { parseEnvelope, assertCode } from './envelope.mjs';

const runId = process.argv[2];
if (!runId) {
  console.error('uso: node scripts/loop/fechar.mjs <runId>');
  process.exit(2);
}

const loop = (args) => parseEnvelope(execFileSync('loop', args, { encoding: 'utf8' }));

assertCode(loop(['validate', '--run', runId]), 'VALIDATION_PASSED');
assertCode(loop(['step', 'finish', '--run', runId]), 'STEP_SUCCEEDED');
assertCode(loop(['run', 'close', '--run', runId]), 'RUN_CLOSED');

console.log(`run ${runId} fechado com validacao aprovada`);
