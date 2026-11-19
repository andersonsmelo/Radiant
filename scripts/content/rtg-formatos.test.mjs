// A unidade sintética de formatos passa pelo verificador, pela fábrica e pelo gerador Maestro.
// As tarefas da fase B trocam uma interação dela pelo tipo novo que cada uma cria.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { renderRtgMaestroFlows } from '../qa/generate-rtg-maestro.mjs';
import appContract from './load-app-contract.cjs';
import { renderRtgBatches } from './build-rtg-batches.mjs';
import { TYPES, lintUnit } from './rtg-lesson-lint.mjs';

const { WIDE_ACTIVITY_FAMILIES } = appContract.loadAppContract('features/student-checkpoints/EditorialWideContract.ts');
const { FAMILY_LABEL } = appContract.loadAppContract('features/student-checkpoints/batches/rtgBatchFactory.ts');
const doc = JSON.parse(await readFile(new URL('./fixtures/unidade-formatos.json', import.meta.url), 'utf8'));
/** `comparison` precisa de imagem registrada; o roteiro dele é coberto pelas aulas reais em generate-rtg-maestro.test.mjs. */
const NEEDS_IMAGE = ['comparison'];
const usedTypes = () => new Set(doc.lessons.flatMap(lesson => lesson.interactions.map(item => item.type)));

test('a unidade sintética passa no verificador, sem nenhum erro', () => {
  assert.deepEqual(lintUnit(doc), []);
});

test('todo tipo aceito pelo verificador está em WIDE_ACTIVITY_FAMILIES e em FAMILY_LABEL', () => {
  for (const type of TYPES) {
    assert.ok(WIDE_ACTIVITY_FAMILIES.includes(type), `${type} falta em WIDE_ACTIVITY_FAMILIES`);
    assert.ok(Object.hasOwn(FAMILY_LABEL, type), `${type} falta em FAMILY_LABEL`);
  }
});

test('a unidade usa todos os tipos da aula-fonte, menos os que exigem imagem', () => {
  assert.deepEqual([...usedTypes()].sort(), TYPES.filter(type => !NEEDS_IMAGE.includes(type)).sort());
});

test('a fábrica gera o lote com um tipo de interação para cada tipo da aula-fonte', () => {
  const { files } = renderRtgBatches([{ file: 'm01.json', doc }]);
  const text = files.get('rtg-2026-m01.ts');
  const batch = JSON.parse(text.slice(text.indexOf('= {') + 2, text.lastIndexOf(';')));
  const types = new Set(batch.activities.flatMap(activity => activity.steps.filter(step => step.kind === 'interaction').map(step => step.interaction.type)));
  assert.deepEqual([...types].sort(), [...usedTypes()].sort());
});

test('o gerador Maestro tem roteiro de resposta para todo tipo da unidade', () => {
  assert.doesNotThrow(() => renderRtgMaestroFlows([doc]));
});
