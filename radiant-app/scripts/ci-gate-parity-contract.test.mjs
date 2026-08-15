import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(appRoot, '..');
const workflowPath = path.join(repoRoot, '.github/workflows/radiant-app-quality.yml');

// Medido em 2026-08-15: `npm run quality` tinha 16 passos e o CI rodava 4 —
// lint, typecheck, test e `visual:qa`. Fora ficavam os DOZE contratos e a
// variante estrita do visual QA. Ou seja, os testes que existem exatamente para
// impedir regressão não rodavam em pull request nenhum; só rodavam para quem
// passasse pelo validador local do Loop. Dois defeitos reais fechados no dia
// anterior tinham sido pegos por contratos dessa lista.
//
// O conserto não é acrescentar os doze passos ao workflow: uma lista duplicada
// diverge de novo no dia em que alguém adicionar o décimo terceiro contrato e
// esquecer de espelhar. O conserto é o CI invocar o MESMO comando, e este
// contrato existir para que a duplicação não volte por conveniência.

function stripComments(yaml) {
  // Comentário explicando o contrato não pode satisfazer o contrato. Sem isto,
  // a frase "roda npm run quality" dentro de um comentário faria o caso passar
  // com o workflow rodando outra coisa.
  return yaml
    .split('\n')
    .map((line) => line.replace(/(^|\s)#.*$/u, '$1'))
    .join('\n');
}

function runCommands(yaml) {
  return [...stripComments(yaml).matchAll(/^\s*run:\s*(.+)$/gmu)].map((match) =>
    match[1].trim(),
  );
}

test('o CI invoca o mesmo gate que roda localmente', async () => {
  const workflow = await readFile(workflowPath, 'utf8');
  const commands = runCommands(workflow);

  assert.ok(
    commands.some((command) => /\bnpm run quality\b/u.test(command)),
    `${path.relative(repoRoot, workflowPath)} deve executar \`npm run quality\`, ` +
      `que é o mesmo gate do validador local. Comandos encontrados: ${JSON.stringify(commands)}`,
  );
});

test('o CI não roda um subconjunto do gate em vez do gate', async () => {
  // A forma como a divergência nasceu: alguém enumera lint/typecheck/test
  // achando que é equivalente, e o subconjunto passa a valer como se fosse o
  // todo. Rodar essas etapas soltas SÓ é aceitável se o gate completo também
  // rodar — aí elas são redundância, não substituição.
  const workflow = await readFile(workflowPath, 'utf8');
  const commands = runCommands(workflow);
  const runsFullGate = commands.some((command) => /\bnpm run quality\b/u.test(command));

  const parciais = commands.filter((command) =>
    /\bnpm run (lint|typecheck|test|visual:qa)\b/u.test(command),
  );

  assert.ok(
    runsFullGate || parciais.length === 0,
    `O workflow roda etapas isoladas do gate (${JSON.stringify(parciais)}) sem rodar ` +
      '`npm run quality`. Um subconjunto do gate não é o gate: foi assim que os doze ' +
      'contratos ficaram fora do CI até 2026-08-15.',
  );
});

test('o gate carrega os contratos que o CI precisa executar', async () => {
  // Trava o outro lado do acoplamento. Se alguém enxugar `quality` removendo os
  // contratos, o CI continua "em paridade" — com um gate vazio. Paridade com
  // nada não é paridade.
  const pkg = JSON.parse(await readFile(path.join(appRoot, 'package.json'), 'utf8'));
  const quality = pkg.scripts?.quality ?? '';
  const contratos = [...quality.matchAll(/npm run (test:[a-z-]+)/gu)].map((m) => m[1]);

  assert.ok(
    contratos.length >= 12,
    `\`npm run quality\` deveria encadear pelo menos os 12 contratos medidos em ` +
      `2026-08-15; encontrados ${contratos.length}: ${JSON.stringify(contratos)}`,
  );

  assert.match(
    quality,
    /visual:qa:strict/u,
    '`npm run quality` deve usar `visual:qa:strict`; a variante não-estrita foi o que o CI rodava',
  );
});
