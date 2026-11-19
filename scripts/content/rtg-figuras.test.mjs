import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';
import { creditErrors, figurasErrors, readFiguras } from './rtg-figuras.mjs';
import { renderRtgBatches } from './build-rtg-batches.mjs';

const { loadAppContract } = createRequire(import.meta.url)('./load-app-contract.cjs');
const { DIAGRAMS } = loadAppContract('ui/diagrams/diagramRegistry.ts');
const importedIds = Object.keys(DIAGRAMS).filter((id) => DIAGRAMS[id].art === 'imported');
const acervo = (patch = {}) => ({ id: 'a', origem: 'acervo', sourcePage: 'https://x', author: 'Autora', license: 'CC BY 4.0', licenseUrl: 'https://y', retrievedAt: '2026-11-19', sha256Original: 'ab', modification: 'recolorido', ...patch });

test('o registro real passa', async () => {
  assert.deepEqual(figurasErrors(await readFiguras(), importedIds), []);
});
test('figura importada sem entrada reprova', async () => {
  const figuras = (await readFiguras()).filter((entry) => entry.id !== 'cranio-de-perfil-ossos');
  assert.match(figurasErrors(figuras, importedIds).join('\n'), /cranio-de-perfil-ossos: art 'imported' sem entrada/);
});
test('entrada de acervo sem licença aberta reprova, com a licença do crânio tirada', async () => {
  const figuras = await readFiguras();
  const cranio = figuras.find((entry) => entry.id === 'cranio-de-perfil-ossos');
  assert.match(figurasErrors(figuras.map((e) => (e === cranio ? { ...e, license: undefined } : e)), importedIds).join('\n'), /acervo sem license/);
  assert.match(figurasErrors([acervo({ id: 'cranio-de-perfil-ossos', license: 'CC BY-SA 4.0' })], ['cranio-de-perfil-ossos']).join('\n'), /licença fora de/);
  assert.match(figurasErrors([acervo({ id: 'cranio-de-perfil-ossos', license: 'CC BY-NC 4.0' })], ['cranio-de-perfil-ossos']).join('\n'), /licença fora de/);
  assert.deepEqual(figurasErrors([acervo({ id: 'cranio-de-perfil-ossos' })], ['cranio-de-perfil-ossos']), []);
});
test('entrada gerada sem conferidaPor reprova', () => {
  assert.match(figurasErrors([{ id: 'g', origem: 'gerada' }], ['g']).join('\n'), /gerada sem conferidaPor/);
  assert.match(figurasErrors([{ id: 'g', origem: 'gerada', conferidaPor: 'dono' }], ['g']).join('\n'), /gerada sem modification/);
  assert.deepEqual(figurasErrors([{ id: 'g', origem: 'gerada', conferidaPor: 'dono', modification: 'ferramenta X' }], ['g']), []);
});
const FONTE = 'scripts/content/figuras/fontes/cranio-de-perfil-ossos.svg';
test('figura importada registrada como codigo reprova (escaparia da régua de licença)', () => {
  assert.match(figurasErrors([{ id: 'x', origem: 'codigo' }], ['x']).join('\n'), /registrada como origem codigo/);
  assert.deepEqual(figurasErrors([{ id: 'x', origem: 'codigo' }], []), []);
});
test('acervo sem modification reprova', () => {
  assert.match(figurasErrors([acervo({ id: 'x', modification: undefined })], ['x']).join('\n'), /acervo sem modification/);
});
test('anatomy exige fonte versionada que exista', () => {
  assert.match(figurasErrors([{ id: 'x', origem: 'anatomy' }], ['x']).join('\n'), /anatomy sem fonte/);
  assert.match(figurasErrors([{ id: 'x', origem: 'anatomy', fonte: 'docs/qualquer.svg' }], ['x']).join('\n'), /anatomy sem fonte/);
  assert.match(figurasErrors([{ id: 'x', origem: 'anatomy', fonte: FONTE.replace('cranio', 'nao-existe') }], ['x']).join('\n'), /fonte inexistente/);
  assert.deepEqual(figurasErrors([{ id: 'x', origem: 'anatomy', fonte: FONTE }], ['x']), []);
});
test('entrada que não é objeto reprova sem derrubar o verificador', () => {
  assert.match(figurasErrors([null], []).join('\n'), /não é um objeto/);
});
test('entrada que aponta para figura inexistente reprova', () => {
  assert.match(figurasErrors([{ id: 'fantasma', origem: 'anatomy', fonte: FONTE }], []).join('\n'), /sem figura art: 'imported'/);
});
test('licença CC BY sem crédito na lista gerada reprova; com a lista gerada, passa', async () => {
  const figuras = [acervo()];
  assert.match(creditErrors(figuras, 'export const RTG_FIGURE_CREDITS = [];').join('\n'), /crédito ausente/);
  const { files } = renderRtgBatches([], [], figuras);
  assert.deepEqual(creditErrors(figuras, files.get('rtgImages.ts')), []);
  const real = await readFiguras();
  assert.deepEqual(creditErrors(real, renderRtgBatches([], [], real).files.get('rtgImages.ts')), []);
});
