import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { appRoot } from './ast-helpers.mjs';
import { compareBaseline, scanCopySources } from './copy-style-contract.mjs';

function scan(text, extra = {}) {
  return scanCopySources({ 'src/Fixture.tsx': text, ...extra });
}
function classes(result) {
  return result.violations.map((entry) => entry.class).sort();
}

// Each fixture names the missing detector: returning no findings, traversing a
// condition, or treating internal identifiers as copy must break these checks.
for (const [name, source, expected] of [
  ['JSX Text jargon', '<Text>Volte para a jornada</Text>', ['jargon']],
  ['prop dash', '<Card title="Vidas — e só isso" />', ['dash']],
  ['structural eyebrow deduplicates uppercase', '<Card eyebrow="MISSÕES" />', ['eyebrow']],
  ['lowercase structural eyebrow', '<Card eyebrow="Hoje" />', ['eyebrow']],
  ['uppercase literal', '<Text>MISSÕES</Text>', ['eyebrow']],
  ['unicode jargon boundaries', '<Text>pré-jornada, elegível; nó liberado; checkpoint; Configurações.</Text>', ['jargon']],
  ['singular settings jargon', '<Text>Configuração</Text>', ['jargon']],
  ['en dash with spaces', '<Text>Vidas – e só isso</Text>', ['dash']],
  ['template static span', '<Text>{`Vidas — ${count}`}</Text>', ['dash']],
  ['template interpolation', '<Text>{`Olá ${"jornada"}`}</Text>', ['jargon']],
  ['local alias', 'const a = "jornada"; const b = a; <Text>{b}</Text>', ['jargon']],
  ['object property', 'const copy = { value: "jornada" }; <Text>{copy.value}</Text>', ['jargon']],
  ['array element', 'const copy = ["jornada"]; <Text>{copy[0]}</Text>', ['jargon']],
  ['map array copy', 'const copy = ["jornada"]; copy.map(item => <Text>{item}</Text>)', ['jargon']],
  ['copy function return', 'function copy() { return "jornada"; } <Text>{copy()}</Text>', ['jargon']],
  ['copy function argument', 'const copy = (value) => value; <Text>{copy("jornada")}</Text>', ['jargon']],
  ['ternary ignores discriminant', '<Text>{kind === "checkpoint" ? "jornada" : "Continuar"}</Text>', ['jargon']],
  ['Alert title and message', 'Alert.alert("jornada", "Vidas — agora");', ['dash', 'jargon']],
  ['hint is copy', '<Button accessibilityHint="Abrir checkpoint" />', ['jargon']],
  ['shared uppercase style', 'const styles = { label: { textTransform: "uppercase" } }; <Text style={styles.label}>Hoje</Text>', ['eyebrow']],
  ['uppercase call on text', '<Text>{name.toUpperCase()}</Text>', ['eyebrow']],
  ['nested copy objects', 'const copy = [{ title: "jornada" }]; <List data={copy} />', ['jargon']],
  ['Pixel phrases array', 'export const PIXEL_MOMENTS = { hello: { phrases: ["Eu — robô"] } };', ['dash']],
]) {
  test(`detects ${name}`, () => assert.deepEqual(classes(scan(source)), expected));
}

test('resolves imported aliases and reports the origin once per class', () => {
  const result = scan('import { copy as alias } from "./copy"; <><Text>{alias.title}</Text><Card title={alias.title} /></>', {
    'src/copy.ts': 'export const copy = { title: "jornada — hoje" };',
  });
  assert.deepEqual(classes(result), ['dash', 'jargon']);
  assert.ok(result.violations.every((entry) => entry.file === 'src/copy.ts'));
});

test('resolves an imported uppercase text style', () => {
  const result = scan('import { typeStyle } from "./styles"; <Text style={typeStyle.caption}>Hoje</Text>', {
    'src/styles.ts': 'export const typeStyle = { caption: { textTransform: "uppercase" } };',
  });
  assert.deepEqual(classes(result), ['eyebrow']);
  assert.equal(result.violations[0].file, 'src/styles.ts');
});

test('allows comments, identifiers, internal strings, conditions, unicode neighbors and legitimate dashes', () => {
  assert.deepEqual(classes(scan(`
    // <Text>jornada — CHECKPOINT</Text>
    const checkpoint = 'checkpoint'; const route = '/checkpoint';
    type Name = 'JORNADA'; const storageKey = '@checkpoint';
    <><Text>{checkpoint === 'checkpoint' ? 'Continuar' : 'Voltar'}</Text>
      <Text>pré-jornadas superjornada jornadação elegívelmente nódoa raio-X 120–140</Text>
      <Icon name="checkpoint" testID="JORNADA" /></>;
  `)), []);
});

test('reports unresolved text sinks instead of silently treating them as clean', () => {
  const result = scan('<Text>{remoteCopy()}</Text>');
  assert.ok(result.diagnostics.some((entry) => entry.reason.includes('unresolved')));
  assert.equal(result.sinks, 1);
});

test('excludes tests and stories but scans an external imported Alert source', () => {
  const result = scan('import { ExternalLink } from "../components/external-link"; <ExternalLink />', {
    'src/Bad.test.tsx': '<Text>jornada</Text>',
    'src/Bad.stories.tsx': '<Text>jornada</Text>',
    'components/external-link.tsx': 'export function ExternalLink() { Alert.alert("checkpoint"); return null; }',
  });
  assert.deepEqual(classes(result), ['jargon']);
  assert.equal(result.violations[0].file, 'components/external-link.tsx');
  assert.ok(!result.sources.includes('src/Bad.test.tsx'));
});

test('clinical exclusions are source and field specific; navigation labels stay measured', () => {
  const result = scanCopySources({
    'src/data/lessons.ts': 'export const lesson = { title: "jornada", questions: [{ prompt: "CHECKPOINT —", options: [{label: "JORNADA"}], explanation: "jornada" }] };',
    'src/data/journey/defaultBlocks.ts': 'export const block = { payload: { eyebrow: "Unidade 1", body: "Você fechou um nó" } };',
    'src/features/bench/lessons/exposicao.ts': 'export const activity = { title: "jornada", prompt: "CHECKPOINT —", controls: [{label: "Configurações"}] };',
    'src/Fixture.tsx': 'const title = "checkpoint"; <Card title={title} body="jornada" />;',
  });
  assert.deepEqual(classes(result), ['eyebrow', 'jargon', 'jargon', 'jargon', 'jargon', 'jargon', 'jargon']);
  assert.ok(result.excluded.some((entry) => entry.reason === 'clinical-authorship'));
});

test('legal exclusion protects only legal prose and CANCEL_COPY, preserving nearby UI and hints', () => {
  const result = scanCopySources({
    'src/features/subscription/screens/SubscriptionScreen.tsx': `
      const CANCEL_COPY = "CHECKPOINT — jornada";
      <><Text style={styles.legal}>CHECKPOINT — jornada</Text>
        <Text>{CANCEL_COPY}</Text><Text>Vidas — hoje</Text>
        <Button accessibilityHint="Abrir checkpoint" label="Configurações" /></>;
    `,
  });
  assert.deepEqual(classes(result), ['dash', 'jargon', 'jargon']);
  assert.ok(result.excluded.some((entry) => entry.reason === 'protected-legal-prose'));
});

test('baseline rejects increases and files without a ceiling, and warns on decreases', () => {
  const violations = scan('<Text>jornada — hoje</Text>').violations;
  assert.equal(compareBaseline(violations, {}).errors.length, 2);
  const lowered = compareBaseline(violations, { 'src/Fixture.tsx': { jargon: 2, dash: 1, eyebrow: 0 } });
  assert.deepEqual(lowered.errors, []);
  assert.equal(lowered.warnings.length, 1);
});

test('baseline rejects obsolete paths and unknown classes', () => {
  const result = compareBaseline([], { 'src/Old.tsx': { jargon: 1 }, 'src/Fixture.tsx': { hidden: 1 } }, ['src/Fixture.tsx']);
  assert.equal(result.errors.length, 2);
});

test('a style named eyebrow is not itself text copy', () => {
  assert.deepEqual(classes(scan('const styles = { eyebrow: { color: "red" } }; <Text style={styles.eyebrow}>Hoje</Text>')), []);
});

test('a static array index resolves only the selected element', () => {
  assert.deepEqual(classes(scan('const values = ["Continuar", "jornada"]; <Text>{values[0]}</Text>')), []);
});

test('editorial source and license metadata are not student interface copy', () => {
  const result = scanCopySources({
    'src/features/student-checkpoints/EditorialCurriculumCandidate.ts': 'const LICENSE = {label: "CC BY 4.0"}; const sources = [{title: "Science — now"}]; const copy = {title: "jornada"};',
  });
  assert.deepEqual(classes(result), ['jargon']);
});

test('HTTP request bodies and serialized internal messages are not UI copy', () => {
  const result = scan('fetch("/route", {body: JSON.stringify({message: "checkpoint"})});');
  assert.deepEqual(classes(result), []);
  assert.deepEqual(result.diagnostics, []);
});

test('follows copy through useMemo and string formatting without scanning condition literals', () => {
  assert.deepEqual(classes(scan('const text = useMemo(() => "JORNADA".toLowerCase(), []); <Text>{text}</Text>')), ['jargon']);
});

test('resolves copy from array find and map return values', () => {
  assert.deepEqual(classes(scan('const values = ["jornada"]; <Text>{values.find(value => value !== "checkpoint")}</Text>')), ['jargon']);
});

test('follows text component wrappers, fragments and renamed Text imports', () => {
  const result = scan('import {Text as NativeCopy} from "react-native"; <><AppButton>jornada</AppButton><NativeCopy>Vidas — hoje</NativeCopy><Text>A <Text>MISSÕES</Text></Text></>');
  assert.deepEqual(classes(result), ['dash', 'eyebrow', 'jargon']);
});

test('resolves root and src path aliases', () => {
  const result = scan('import {copy} from "@/copy"; import {other} from "@/components/copy"; <><Text>{copy}</Text><Text>{other}</Text></>', {
    'src/copy.ts': 'export const copy = "jornada";',
    'components/copy.ts': 'export const other = "Vidas — agora";',
  });
  assert.deepEqual(classes(result), ['dash', 'jargon']);
});

test('resolves shorthand properties and joined arrays without losing string origins', () => {
  assert.deepEqual(classes(scan('const value = "jornada"; const copy = {value}; const values = ["Vidas — agora"]; <><Text>{copy.value}</Text><Text>{values.join(", ")}</Text></>')), ['dash', 'jargon']);
});

test('resolves default imported text', () => {
  assert.deepEqual(classes(scan('import copy from "./copy"; <Text>{copy}</Text>', {'src/copy.ts': 'export default "jornada";'})), ['jargon']);
});

test('resolves copy returned by render children and array spreads', () => {
  assert.deepEqual(classes(scan('const first=["jornada"]; const values=[...first]; <><Text>{values}</Text><Pressable>{() => "Vidas — hoje"}</Pressable></>')), ['dash', 'jargon']);
});

// R1-R7: combinations reproduced independently by the reviewer. These are
// static programs in the promised domain, not runtime-analysis exclusions.
for (const [name, source, expected] of [
  ['R1 destructured function return', 'function describe() { return { detail: "Vidas ilimitadas — e só isso." }; } const {detail}=describe(); <Text>{detail}</Text>', ['dash']],
  ['R1 renamed local binding', 'const source={detail:"jornada"}; const {detail: copy}=source; <Text>{copy}</Text>', ['jargon']],
  ['R2 returned array parameter environment', 'function copy(value) { return [value]; } <Text>{copy("jornada")}</Text>', ['jargon']],
  ['R2 returned shorthand parameter environment', 'function copy(value) { return {value}; } <Text>{copy("jornada").value}</Text>', ['jargon']],
  ['R2 returned property parameter environment', 'function copy(value) { return {detail: value}; } <Text>{copy("jornada").detail}</Text>', ['jargon']],
  ['R3 uppercase template number', '<Text>{`MISSÕES ${3}`}</Text>', ['eyebrow']],
  ['R4 visible join separator', '<Text>{["Vidas", "agora"].join(" — ")}</Text>', ['dash']],
  ['R6 React Native Alert import alias', 'import {Alert as Notify} from "react-native"; Notify.alert("jornada");', ['jargon']],
  ['R7 serialized visible string', '<Text>{JSON.stringify({message:"jornada"})}</Text>', ['jargon']],
]) {
  test(`fixes ${name}`, () => assert.deepEqual(classes(scan(source)), expected));
}

test('R3 mixed-case template static span is allowed', () => {
  assert.deepEqual(classes(scan('<Text>{`Missões ${3}`}</Text>')), []);
});

test('R4 empty and singleton joins do not render their separator', () => {
  assert.deepEqual(classes(scan('<><Text>{[].join(" — ")}</Text><Text>{["Vidas"].join(" — ")}</Text></>')), []);
});

test('R5 array length is numeric and never exposes its internal strings', () => {
  const result = scan('const values=["jornada"]; <Text>{values.length}</Text>');
  assert.deepEqual(classes(result), []);
  assert.deepEqual(result.diagnostics, []);
});

test('R6 unrelated alert method is not the React Native sink', () => {
  const result = scan('const Notify={alert(value){return value;}}; Notify.alert("jornada");');
  assert.deepEqual(classes(result), []);
  assert.equal(result.sinks, 0);
});

test('R7 real HTTP serialized body remains transport while adjacent serialization is visible', () => {
  const result = scan('fetch("/route", {body: JSON.stringify({message:"checkpoint"})}); <Text>{JSON.stringify({message:"jornada"})}</Text>');
  assert.deepEqual(classes(result), ['jargon']);
  assert.ok(result.excluded.some(entry => entry.reason === 'internal-transport-payload'));
});

test('R2-A namespace import resolves copy at its exported origin', () => {
  const result = scan('import * as copy from "./copy"; <Text>{copy.value}</Text>', {'src/copy.ts':'export const value="jornada";'});
  assert.deepEqual(classes(result), ['jargon']);
  assert.equal(result.violations[0].file, 'src/copy.ts');
  assert.deepEqual(result.diagnostics, []);
});

test('R2-B empty spread before singleton does not render join separator', () => {
  assert.deepEqual(classes(scan('const values=[]; <Text>{[...values,"Vidas"].join(" — ")}</Text>')), []);
});

test('R2-B spread of two strings renders its join separator', () => {
  assert.deepEqual(classes(scan('const values=["Vidas","agora"]; <Text>{[...values].join(" — ")}</Text>')), ['dash']);
});

test('R2-C shadowing parameter does not inherit the Native Alert import', () => {
  const result = scan('import {Alert as Notify} from "react-native"; function f(Notify) {Notify.alert("jornada");} f({alert:()=>null});');
  assert.deepEqual(classes(result), []);
  assert.equal(result.sinks, 0);
});

test('R3-A join retains static origins from conditional array spreads', () => {
  assert.deepEqual(classes(scan('const values=condition ? ["jornada"] : ["Continuar"]; <Text>{[...values].join(", ")}</Text>')), ['jargon']);
});

test('R3-A alternative singleton arrays do not manufacture a join separator', () => {
  assert.deepEqual(classes(scan('const values=condition ? ["jornada"] : ["Continuar"]; <Text>{[...values].join(" — ")}</Text>')), ['jargon']);
});

test('R3-A two-item alternatives retain origins and their guaranteed separator', () => {
  assert.deepEqual(classes(scan('const values=condition ? ["jornada","hoje"] : ["Continuar","agora"]; <Text>{[...values].join(" — ")}</Text>')), ['dash', 'jargon']);
});

if (!process.env.COPY_STYLE_FIXTURES_ONLY) {
  test('UI copy stays within the measured file/class baseline', async () => {
    const { readCopySources } = await import('./copy-style-contract.mjs');
    const result = scanCopySources(readCopySources(appRoot));
    const baseline = JSON.parse(readFileSync(path.join(appRoot, 'scripts/copy-style-baseline.json'), 'utf8'));
    assert.ok(result.sinks > 100, 'a missing sink traversal must not make a zero-count gate pass');
    assert.ok(result.sources.includes('components/external-link.tsx'), 'follow UI copy sources outside src');
    process.stderr.write(`Copy AST: ${result.sources.length} sources, ${result.sinks} sinks, ${result.violations.length} findings; ${result.diagnostics.length} unresolved static paths require the recorded domain audit.\n`);
    const comparison = compareBaseline(result.violations, baseline.ceilings, result.sources);
    assert.deepEqual(comparison.errors, []);
    for (const warning of comparison.warnings) process.stderr.write(`${warning}\n`);
  });
}
