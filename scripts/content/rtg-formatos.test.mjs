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

test('o rotular sobre diagrama chega ao lote com pontos, fichas embaralhadas e ids gerados', () => {
  const { files } = renderRtgBatches([{ file: 'm01.json', doc }]);
  const text = files.get('rtg-2026-m01.ts');
  const batch = JSON.parse(text.slice(text.indexOf('= {') + 2, text.lastIndexOf(';')));
  const interactions = batch.activities.flatMap(activity => activity.steps.filter(step => step.kind === 'interaction').map(step => step.interaction));
  const label = interactions.find(interaction => interaction.type === 'label');
  assert.equal(label.payload.imageRef, 'diagram:tubo-raios-x');
  assert.match(label.accessibility.label, /^Rotular a imagem: /);
  assert.deepEqual(label.payload.points.map(point => point.id), [1, 2, 3, 4].map(n => `point:rtg-2026:m01:aula-01:i3:${n}`));
  assert.equal(label.payload.labels.length, 5);
  const text2 = new Map(label.payload.labels.map(entry => [entry.id, entry.label]));
  assert.deepEqual(label.payload.points.map(point => text2.get(point.correctLabelId)), ['Cátodo com filamento', 'Ânodo', 'Janela de saída', 'Ampola de vidro']);
  const correct = new Set(label.payload.points.map(point => point.correctLabelId));
  assert.notDeepEqual(label.payload.labels.filter(entry => correct.has(entry.id)).map(entry => entry.id), label.payload.points.map(point => point.correctLabelId));
  assert.deepEqual(label.payload.points.map(point => Object.keys(point).sort().join()), Array(4).fill('correctLabelId,id,x,y'));
});

test('o roteiro Maestro rotula cada ponto pela ficha certa, rolando para cima até o ponto', () => {
  const lesson = renderRtgMaestroFlows([doc]).get('m01-aula-01.yaml').split('\n');
  const at = lesson.findIndex(line => line === '# interaction i3 label');
  assert.ok(at > 0, 'sem o comentário do rotular');
  const segment = lesson.slice(at, lesson.findIndex((line, n) => n > at && line.startsWith('- assertVisible')));
  const tapped = segment.filter(line => /^- tapOn: |^    id: /.test(line));
  assert.deepEqual(tapped, [
    "- tapOn: 'Ponto 1, sem rótulo'", "    id: 'label-chip-Cátodo com filamento'",
    "- tapOn: 'Ponto 2, sem rótulo'", "    id: 'label-chip-Ânodo'",
    "- tapOn: 'Ponto 3, sem rótulo'", "    id: 'label-chip-Janela de saída'",
    "- tapOn: 'Ponto 4, sem rótulo'", "    id: 'label-chip-Ampola de vidro'",
    "- tapOn: 'Conferir resposta'", "- tapOn: 'Continuar'",
  ]);
  assert.equal(segment.filter(line => line === '    direction: UP').length, 4);
});

test('tipo sem ramo na fábrica lança em vez de virar associação', () => {
  const broken = structuredClone(doc);
  broken.lessons[0].interactions[2].type = 'tipo-que-nao-existe';
  assert.throws(() => renderRtgBatches([{ file: 'm01.json', doc: broken }]), /rtg-lint|tipo inválido/);
  const factory = appContract.loadAppContract('features/student-checkpoints/batches/rtgBatchFactory.ts');
  assert.throws(() => factory.buildRtgBatch(broken), /rtg-batch-unknown-type:tipo-que-nao-existe/);
});
