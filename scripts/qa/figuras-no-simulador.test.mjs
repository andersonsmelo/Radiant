import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { readRtgImages, readRtgSources } from '../content/build-rtg-batches.mjs';
import { findFigureSteps, renderFigureFlows } from './figuras-no-simulador.mjs';

const docs = (await readRtgSources()).map(({ doc }) => doc);
const images = await readRtgImages();
const m25 = docs.find(doc => doc.unit.id === 'm25');
const PILOTO = ['cranio-de-perfil-ossos', 'raio-x-movel-no-leito'];
const lines = content => content.split('\n');

test('acha unidade, aula e passo de cada figura, na ordem em que o app mostra', () => {
  const found = findFigureSteps([m25], images, ['cranio-de-perfil-ossos']);
  assert.deepEqual(found.map(({ unit, aula, step, kind }) => ({ unit, aula, step, kind })), [
    { unit: 'm25', aula: 'aula-01', step: 4, kind: 'interaction' },
    { unit: 'm25', aula: 'aula-01', step: 6, kind: 'interaction' },
  ]);
});

test('o roteiro do crânio abre a M25 aula 01 e captura depois de "Passo 4 de 8"', () => {
  const content = renderFigureFlows([m25], images, ['cranio-de-perfil-ossos']).get('m25-aula-01.yaml');
  assert.ok(content, 'm25-aula-01.yaml');
  const rows = lines(content);
  assert.ok(rows.some(row => row.includes('radiantapp://learn?blockId=activity%3Artg-2026%3Am25%3Aaula-01&nodeId=node%3Aactivity%3Artg-2026%3Am25%3Aaula-01')));
  const passo4 = rows.indexOf("- assertVisible: 'Passo 4 de 8'");
  assert.ok(passo4 > 0);
  assert.equal(rows[passo4 + 1], "- takeScreenshot: 'figura-cranio-de-perfil-ossos-m25-aula-01-passo4'");
  assert.ok(rows.indexOf("- assertVisible: 'Passo 3 de 8'") < passo4);
});

test('duas capturas da mesma figura na aula têm nomes diferentes', () => {
  const content = renderFigureFlows([m25], images, ['cranio-de-perfil-ossos']).get('m25-aula-01.yaml');
  const shots = lines(content).filter(row => row.startsWith('- takeScreenshot:'));
  assert.equal(shots.length, 2);
  assert.equal(new Set(shots).size, 2);
});

test('o roteiro para no último passo capturado, sem jogar o resumo', () => {
  const content = renderFigureFlows([m25], images, ['raio-x-movel-no-leito']).get('m25-aula-05.yaml');
  assert.ok(content.includes("- assertVisible: 'Passo 6 de 8'"));
  assert.ok(!content.includes('Passo 7 de 8'));
  assert.ok(!content.includes('A lição foi concluída'));
});

test('figura que não aparece em aula nenhuma reprova, e não gera roteiro vazio', () => {
  assert.throws(() => renderFigureFlows([m25], images, ['figura-que-nao-existe']), /figuras-sem-passo:figura-que-nao-existe/);
});

test('figura em laço usada como visual do conceito ganha roteiro de 8 s com o movimento ligado', () => {
  const doc = structuredClone(m25);
  doc.lessons[0].concept.visual = 'raio-x-movel-no-leito';
  const files = renderFigureFlows([doc], images, ['raio-x-movel-no-leito']);
  const laco = files.get('m25-aula-01-laco.yaml');
  assert.ok(laco, 'm25-aula-01-laco.yaml');
  assert.match(laco, /radiantReduceMotion: '0'/);
  const rows = lines(laco);
  const passo2 = rows.indexOf("- assertVisible: 'Passo 2 de 8'");
  assert.deepEqual(rows.slice(passo2 + 1, passo2 + 5), [
    "- startRecording: 'figura-raio-x-movel-no-leito-m25-aula-01-laco'",
    '- waitForAnimationToEnd:', '    timeout: 8000', '- stopRecording',
  ]);
  // O laço não gera captura parada do mesmo passo no roteiro de movimento reduzido.
  assert.ok(!files.has('m25-aula-01.yaml'));
});

test('o roteiro de captura parada liga o movimento reduzido', () => {
  for (const content of renderFigureFlows([m25], images, PILOTO).values()) assert.match(content, /radiantReduceMotion: '1'/);
});

test('os roteiros versionados das duas figuras do piloto são os que o gerador produz hoje', async () => {
  for (const [name, content] of renderFigureFlows(docs, images, PILOTO)) {
    assert.equal(await readFile(new URL(`../../radiant-app/.maestro/figuras/${name}`, import.meta.url), 'utf8'), content, name);
  }
});
