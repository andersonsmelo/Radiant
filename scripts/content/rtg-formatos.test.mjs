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

test('o hotspot sobre diagrama chega ao lote com imageRef diagram:<id> e região com id gerado', () => {
  const { files } = renderRtgBatches([{ file: 'm01.json', doc }]);
  const text = files.get('rtg-2026-m01.ts');
  const batch = JSON.parse(text.slice(text.indexOf('= {') + 2, text.lastIndexOf(';')));
  const interactions = batch.activities.flatMap(activity => activity.steps.filter(step => step.kind === 'interaction').map(step => step.interaction));
  const hotspot = interactions.find(interaction => interaction.type === 'hotspot');
  assert.equal(hotspot.payload.imageRef, 'diagram:tubo-raios-x');
  assert.match(hotspot.accessibility.label, /^Toque na imagem: /);
  assert.deepEqual(hotspot.payload.regions.map(region => region.id), [1, 2, 3, 4].map(n => `region:rtg-2026:m01:aula-01:i2:${n}`));
  assert.deepEqual(hotspot.payload.correctRegionIds, ['region:rtg-2026:m01:aula-01:i2:2']);
  assert.equal(Object.hasOwn(hotspot.payload.regions[0], 'correct'), false);
});

test('o roteiro Maestro toca o hotspot pelo rótulo acessível da região certa e confere', () => {
  const lesson = renderRtgMaestroFlows([doc]).get('m01-aula-01.yaml').split('\n');
  const at = lesson.findIndex(line => line === '# interaction i2 hotspot');
  assert.ok(at > 0, 'sem o comentário do hotspot');
  const tapped = lesson.slice(at, at + 12).filter(line => line.startsWith('- tapOn:'));
  assert.deepEqual(tapped, ["- tapOn: 'Selecionar Ânodo na imagem'", "- tapOn: 'Conferir resposta'", "- tapOn: 'Continuar'"]);
});

test('tipo sem ramo na fábrica lança em vez de virar associação', () => {
  const broken = structuredClone(doc);
  broken.lessons[0].interactions[2].type = 'tipo-que-nao-existe';
  assert.throws(() => renderRtgBatches([{ file: 'm01.json', doc: broken }]), /rtg-lint|tipo inválido/);
  const factory = appContract.loadAppContract('features/student-checkpoints/batches/rtgBatchFactory.ts');
  assert.throws(() => factory.buildRtgBatch(broken), /rtg-batch-unknown-type:tipo-que-nao-existe/);
});
