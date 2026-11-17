import assert from 'node:assert/strict';
import test from 'node:test';
import { appRoot } from './ast-helpers.mjs';
import { readStyleSources, scanStyleLiterals } from './style-literal-contract.mjs';

const kinds = (text, file = 'src/features/fixture/Fixture.tsx') =>
  scanStyleLiterals({ [file]: text }).map((finding) => finding.kind);

for (const [name, source, expected] of [
  ['cor hexadecimal em estilo', "const s = { box: { color: '#FF0000' } };", ['color']],
  ['cor curta em prop de SVG', '<Path fill="#fff" />', ['color']],
  ['rgba em estilo', "const s = { box: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } };", ['color']],
  ['rgb em ternário', "const s = { box: { borderColor: on ? 'rgb(1, 2, 3)' : galaxyColors.border } };", ['color']],
  ['rgba montado por template', 'const s = { box: { backgroundColor: `rgba(255, 0, 0, ${alpha})` } };', ['color']],
  ['cor em constante local', "const ACCENT = '#123456';", ['color']],
  ['fontSize numérico', 'const s = { text: { fontSize: 14 } };', ['fontSize']],
  ['fontSize numérico em ternário', 'const s = { text: { fontSize: big ? 20 : typography.body.fontSize } };', ['fontSize']],
  ['fontSize numérico em prop de SVG', '<SvgText fontSize={12}>A</SvgText>', ['fontSize']],
  ['caixa alta literal', "const s = { label: { textTransform: 'uppercase' } };", ['uppercase']],
]) {
  test(`acusa: ${name}`, () => assert.deepEqual(kinds(source), expected));
}

for (const [name, source] of [
  ['cor citada em comentário', "// a cor antiga era '#FF0000'\nconst s = { box: { color: galaxyColors.text } };"],
  ['cor citada em texto que não é valor de estilo', "<Text>Use #FF0000 e rgba(0, 0, 0, 0.5) como exemplo</Text>; const hint = 'cor #FF0000';"],
  ['fontSize por token', 'const s = { text: { fontSize: typography.body.fontSize } };'],
  ['textTransform que não é caixa alta', "const s = { label: { textTransform: 'none' } };"],
  ['âncora de link com cerquilha', "const href = '#topo-da-pagina';"],
]) {
  test(`não acusa: ${name}`, () => assert.deepEqual(kinds(source), []));
}

test('não acusa arquivo isento, teste nem história', () => {
  const literal = "const s = { box: { color: '#FF0000', fontSize: 14, textTransform: 'uppercase' } };";
  for (const file of [
    'src/features/home/HomeScreen.tsx',
    'src/features/curriculum-v3/l2/Model.tsx',
    'src/features/bench/exposureShader.ts',
    'src/app/telemetry.tsx',
    'src/features/quiz/Quiz.test.tsx',
    'src/features/quiz/Quiz.stories.tsx',
  ]) assert.deepEqual(kinds(literal, file), [], file);
  // Validade da isenção: o mesmo trecho fora dela é acusado nas três classes.
  assert.deepEqual(kinds(literal, 'src/features/bench/BenchScreen.tsx'), ['color', 'fontSize', 'uppercase']);
});

test('fora de src/features e src/app não é escopo da guarda', () => {
  assert.deepEqual(kinds("const c = '#FF0000';", 'src/ui/theme.ts'), []);
  assert.deepEqual(kinds("const c = '#FF0000';", 'src/app/(tabs)/index.tsx'), ['color']);
});

test('a localização aponta arquivo e linha do literal', () => {
  const [finding] = scanStyleLiterals({ 'src/app/x.tsx': "const a = 1;\nconst s = { t: { fontSize: 14 } };" });
  assert.equal(finding.file, 'src/app/x.tsx');
  assert.equal(finding.line, 2);
});

test('o app não tem literal de estilo fora dos isentos', () => {
  const sources = readStyleSources(appRoot);
  assert.ok(Object.keys(sources).length > 100, 'a leitura do app precisa achar as telas');
  const findings = scanStyleLiterals(sources);
  assert.deepEqual(findings.map((f) => `${f.file}:${f.line} ${f.kind} ${f.text}`), []);
});
