import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import appContract from './load-app-contract.cjs';
import { renderRtgBatches, readRtgImages, readRtgSources, staleRtgFiles } from './build-rtg-batches.mjs';

const script = fileURLToPath(new URL('./build-rtg-batches.mjs', import.meta.url));
const fixtureText = await readFile(new URL('./fixtures/rtg-unit-fixture.json', import.meta.url), 'utf8');
const fixture = () => JSON.parse(fixtureText);
/** A mesma unidade com outra identidade, para testar ordem e convivência entre unidades. */
const as = unit => {
  const doc = JSON.parse(fixtureText.replaceAll('"m01-', `"${unit}-`));
  doc.unit.id = unit;
  return doc;
};
const { validatePromotedProductionBatch } = appContract.loadAppContract('features/student-checkpoints/ProductionBatch.ts');
const run = (...args) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });

async function workspace(t) {
  const dir = await mkdtemp(path.join(tmpdir(), 'rtg-batches-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  await mkdir(path.join(dir, 'aulas'));
  return { source: path.join(dir, 'aulas'), out: path.join(dir, 'out') };
}

test('gera um lote por unidade, o índice e as apresentações, de forma reprodutível', () => {
  const first = renderRtgBatches([{ file: 'm01.json', doc: fixture() }]);
  const second = renderRtgBatches([{ file: 'm01.json', doc: fixture() }]);
  assert.deepEqual([...first.files.keys()], ['rtg-2026-m01.ts', 'index.ts', 'entries.ts', 'rtgImages.ts']);
  assert.deepEqual([...first.files], [...second.files]);
  assert.deepEqual(first.units.map(({ unit, batchId, lessons, checkpointItems }) => ({ unit, batchId, lessons, checkpointItems })),
    [{ unit: 'm01', batchId: 'batch:rtg-2026:m01', lessons: 6, checkpointItems: 12 }]);
  const batchFile = first.files.get('rtg-2026-m01.ts');
  const batch = JSON.parse(batchFile.slice(batchFile.indexOf('= {') + 2, batchFile.lastIndexOf(';')));
  assert.deepEqual(Array.from(validatePromotedProductionBatch(batch)), []);
  assert.equal(batch.materialSha256, first.units[0].materialSha256);
  // Nenhuma data vem do relógio: só a data fixa da ADR aparece como carimbo.
  assert.deepEqual([...new Set(batchFile.match(/\d{4}-\d{2}-\d{2}T[\d:.]+Z/g))], ['2026-11-06T00:00:00.000Z']);
  assert.match(first.files.get('entries.ts'), /"batch:rtg-2026:m01": \{/);
});

test('sem aula-fonte gera índice e apresentações vazios, e ainda assim válidos', () => {
  const { files, units } = renderRtgBatches([]);
  assert.deepEqual(units, []);
  assert.deepEqual([...files.keys()], ['index.ts', 'entries.ts', 'rtgImages.ts']);
  assert.match(files.get('index.ts'), /RTG_2026_BATCHES: readonly ProductionBatchV1\[\] = \[\];/);
  assert.match(files.get('entries.ts'), /= \{\};/);
});

test('a ordem do índice é a da trilha, com os ramos depois do núcleo, qualquer que seja a ordem de entrada', () => {
  const { files, units } = renderRtgBatches([
    { file: 's-rm.json', doc: as('s-rm') }, { file: 'm14.json', doc: as('m14') },
    { file: 's-tc.json', doc: as('s-tc') }, { file: 'm02.json', doc: as('m02') },
  ]);
  assert.deepEqual(units.map(entry => entry.unit), ['m02', 'm14', 's-tc', 's-rm']);
  const index = files.get('index.ts');
  const listed = index.slice(index.indexOf('= [')).match(/RTG_2026_\w+/g);
  assert.deepEqual(listed, ['RTG_2026_M02', 'RTG_2026_M14', 'RTG_2026_S_TC', 'RTG_2026_S_RM']);
  assert.equal(new Set(units.map(entry => entry.batchId)).size, 4);
});

test('reprova a unidade editada à mão com a correta sempre na mesma posição', () => {
  const doc = fixture();
  for (const lesson of doc.lessons) {
    for (const item of [...lesson.interactions.filter(entry => entry.options), ...lesson.checkpoint, lesson.recovery.guided.item, lesson.recovery.transfer.item]) {
      item.options.sort((a, b) => Number(b.correct) - Number(a.correct));
    }
  }
  assert.throws(() => renderRtgBatches([{ file: 'm01.json', doc }]),
    error => /^rtg-lint:m01\.json\n/.test(error.message) && error.message.includes('a resposta correta cai na posição 1 em 100% dos itens'));
});

test('reprova fonte ausente, arquivo com nome de outra unidade, unidade fora do mapa e unidade repetida', () => {
  const semFonte = fixture();
  semFonte.lessons[0].checkpoint[0].sourceIds = [];
  assert.throws(() => renderRtgBatches([{ file: 'm01.json', doc: semFonte }]), /rtg-lint:m01\.json\n {2}- lessons\[0\]\(m01-01\)\.checkpoint\[0\]: sourceIds vazio/);
  assert.throws(() => renderRtgBatches([{ file: 'm02.json', doc: fixture() }]), /^Error: rtg-file-name:m02\.json/);
  assert.throws(() => renderRtgBatches([{ file: 'm99.json', doc: as('m99') }]), /^Error: rtg-unknown-unit:m99\.json:m99$/);
  assert.throws(() => renderRtgBatches([{ file: 'm01.json', doc: fixture() }, { file: 'm01.json', doc: fixture() }]), /^Error: rtg-duplicate-unit:m01$/);
});

// Auditoria de 2026-11-10, achado 16: o verificador quebrava com TypeError e o
// gerador não dizia qual das aulas-fonte tinha a forma errada.
test('aula com forma inesperada reprova dizendo o arquivo', () => {
  const doc = fixture();
  doc.lessons[1] = null;
  assert.throws(() => renderRtgBatches([{ file: 'm01.json', doc }]), /^Error: rtg-lint:m01\.json\n {2}- forma inesperada: /);
});

test('o contrato do lote reprova o que o verificador de forma não vê', () => {
  // Fonte declarada com esquema que não é https: o verificador exige o prefixo, o contrato exige URL válida.
  const doc = fixture();
  doc.sources[0].url = 'https://';
  assert.throws(() => renderRtgBatches([{ file: 'm01.json', doc }]),
    /^Error: rtg-contract:m01\.json:production-batch-invalid:.*invalid-source-metadata:source:rtg-2026:m01:guia-de-estudo/);
});

test('--check passa logo após gerar e falha quando a aula-fonte muda, um arquivo some ou sobra', async t => {
  const { source, out } = await workspace(t);
  await writeFile(path.join(source, 'm01.json'), fixtureText);
  const written = run(`--source=${source}`, `--out=${out}`);
  assert.equal(written.status, 0, written.stderr);
  assert.deepEqual((await readdir(out)).sort(), ['entries.ts', 'index.ts', 'rtg-2026-m01.ts', 'rtgImages.ts']);
  assert.equal(run('--check', `--source=${source}`, `--out=${out}`).status, 0);

  const edited = fixture();
  edited.lessons[0].title = 'Organizar fichas de leitura';
  await writeFile(path.join(source, 'm01.json'), JSON.stringify(edited));
  const stale = run('--check', `--source=${source}`, `--out=${out}`);
  assert.equal(stale.status, 1);
  assert.match(stale.stderr, /^rtg-generated-stale: .*\n {2}- rtg-2026-m01\.ts \(defasado\)\n$/);
  assert.equal((await readFile(path.join(out, 'rtg-2026-m01.ts'), 'utf8')).includes('fichas de leitura'), false, '--check não pode gravar');

  await writeFile(path.join(source, 'm01.json'), fixtureText);
  assert.equal(run('--check', `--source=${source}`, `--out=${out}`).status, 0);
  await writeFile(path.join(out, 'rtg-2026-m02.ts'), 'export {};\n');
  assert.match(run('--check', `--source=${source}`, `--out=${out}`).stderr, /rtg-2026-m02\.ts \(sem aula-fonte\)/);
  // Gerar de novo remove o lote órfão; o índice volta a bater.
  assert.equal(run(`--source=${source}`, `--out=${out}`).status, 0);
  assert.deepEqual((await readdir(out)).sort(), ['entries.ts', 'index.ts', 'rtg-2026-m01.ts', 'rtgImages.ts']);
  await rm(path.join(out, 'index.ts'));
  assert.match(run('--check', `--source=${source}`, `--out=${out}`).stderr, /index\.ts \(ausente\)/);
});

test('os lotes versionados no app estão em dia com as aulas-fonte do repositório', async () => {
  const { files } = renderRtgBatches(await readRtgSources(), await readRtgImages());
  assert.deepEqual(await staleRtgFiles(files), []);
});

const imageEntry = over => ({ id: 'image:rtg-2026:m01:a', file: 'radiant-app/assets/content/rtg-2026/imagens/m01/a.jpg',
  sourcePage: 'https://commons.wikimedia.org/wiki/File:A.jpg', author: 'Autoria de teste', license: 'CC0 1.0',
  licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/', retrievedAt: '2026-11-07', sha256Original: 'a'.repeat(64),
  sha256Asset: 'b'.repeat(64), modification: 'redução', alt: 'Radiografia em tons de cinza.', width: 800, height: 1000, ...over });

test('gera o resolvedor local com require e os dados de crédito de cada imagem', () => {
  const { files } = renderRtgBatches([{ file: 'm01.json', doc: fixture() }], [imageEntry()]);
  const text = files.get('rtgImages.ts');
  assert.match(text, /"source": require\('\.\.\/\.\.\/\.\.\/\.\.\/assets\/content\/rtg-2026\/imagens\/m01\/a\.jpg'\)/);
  assert.match(text, /"author": "Autoria de teste"/);
  assert.match(text, /"license": "CC0 1\.0"/);
  assert.match(text, /export function resolveRtgImage/);
  assert.doesNotMatch(text, /uri/, 'o resolvedor nunca cai numa URL remota');
});

// Auditoria de 2026-11-10: o contrato só checava as imagens que algum lote usa.
// Uma imagem do cadastro sem uso, com licença proibida ou endereço que não é
// https, ia para o app e para a tela de créditos.
test('recusa imagem do cadastro com licença proibida ou endereço inválido, mesmo sem uso', () => {
  const build = image => () => renderRtgBatches([{ file: 'm01.json', doc: fixture() }], [image]);
  assert.throws(build(imageEntry({ license: 'CC BY-NC-SA 4.0' })), /rtg-image-invalid:image:rtg-2026:m01:a/);
  assert.throws(build(imageEntry({ sourcePage: 'javascript:alert(1)' })), /rtg-image-invalid:image:rtg-2026:m01:a/);
  assert.doesNotThrow(build(imageEntry()));
});

test('sem imagens, o resolvedor continua existindo e vazio', () => {
  const { files } = renderRtgBatches([{ file: 'm01.json', doc: fixture() }]);
  assert.match(files.get('rtgImages.ts'), /RTG_IMAGES: readonly RtgImageCredit\[\] = \[\]/);
});

test('recusa imagem cujo arquivo não bate com o hash registrado, e arquivo ausente', async t => {
  const dir = await mkdtemp(path.join(tmpdir(), 'rtg-images-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  await mkdir(path.join(dir, 'radiant-app/assets/content/rtg-2026/imagens/m01'), { recursive: true });
  const registry = path.join(dir, 'imagens.json');
  await writeFile(registry, JSON.stringify([imageEntry()]));
  await assert.rejects(readRtgImages(registry, dir), /rtg-image-missing:image:rtg-2026:m01:a/);
  await writeFile(path.join(dir, 'radiant-app/assets/content/rtg-2026/imagens/m01/a.jpg'), 'bytes');
  await assert.rejects(readRtgImages(registry, dir), /rtg-image-sha:image:rtg-2026:m01:a/);
  const sha256Asset = createHash('sha256').update('bytes').digest('hex');
  await writeFile(registry, JSON.stringify([imageEntry({ sha256Asset })]));
  assert.equal((await readRtgImages(registry, dir)).length, 1);
  assert.deepEqual(await readRtgImages(path.join(dir, 'nao-existe.json'), dir), []);
});
