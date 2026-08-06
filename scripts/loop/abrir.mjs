import { execFileSync } from 'node:child_process';
import { parseEnvelope, assertCode } from './envelope.mjs';

const [descricao, ...arquivos] = process.argv.slice(2);
if (!descricao || arquivos.length === 0) {
  console.error('uso: node scripts/loop/abrir.mjs "<descricao>" <arquivo>...');
  process.exit(2);
}

const loop = (args) => parseEnvelope(execFileSync('loop', args, { encoding: 'utf8' }));

const criado = loop(['run', 'start', '--task', descricao]);
assertCode(criado, 'RUN_CREATED');
const runId = criado.runId;

assertCode(loop(['context', 'build', '--run', runId]), 'CONTEXT_READY');

const declaracao = ['step', 'begin', '--run', runId];
for (const arquivo of arquivos) declaracao.push('--files', arquivo);
assertCode(loop(declaracao), 'STEP_STARTED');

console.log(runId);
