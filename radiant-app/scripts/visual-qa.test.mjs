import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

import { assessIssues, scanSource } from './visual-qa.mjs';

test('scanSource records a stable signature and source line for token violations', () => {
    const issues = scanSource(`const styles = {\n  card: { marginTop: 6 },\n};\n`, 'src/features/example.tsx');

    assert.deepEqual(issues, [{
        rule: 'R1',
        severity: 'high',
        file: 'src/features/example.tsx',
        line: 2,
        signature: 'marginTop:6',
        msg: 'Found spacing: 6. Use space.* tokens.',
    }]);
});

test('assessIssues distinguishes the exact baseline from a regression', () => {
    const issue = {
        rule: 'R1',
        severity: 'high',
        file: 'src/features/example.tsx',
        line: 2,
        signature: 'marginTop:6',
        msg: 'Found spacing: 6. Use space.* tokens.',
    };
    const policy = {
        baseline: [{
            rule: 'R1',
            file: 'src/features/example.tsx',
            signature: 'marginTop:6',
            count: 1,
            owner: 'design-system',
            expiresOn: '2026-10-23',
            reason: 'Migration tracked in the continuation roadmap.',
        }],
        exceptions: [],
    };

    const report = assessIssues([issue, { ...issue, line: 4 }], policy, new Date('2026-07-23T00:00:00Z'));

    assert.equal(report.baselined.length, 1);
    assert.equal(report.regressions.length, 1);
    assert.equal(report.regressions[0].line, 4);
});

test('assessIssues accepts active path-scoped exceptions and rejects expired ones', () => {
    const issue = {
        rule: 'R4',
        severity: 'high',
        file: 'src/ui/characters/PixelIllustration.tsx',
        line: 1,
        signature: 'react-native-reanimated',
        msg: 'Direct animation usage detected. Use helpers from src/ui/motion.ts.',
    };
    const active = {
        baseline: [],
        exceptions: [{
            rule: 'R4',
            file: 'src/ui/characters/**',
            owner: 'motion-system',
            expiresOn: '2026-10-23',
            reason: 'Character primitive owns its local animation loop.',
        }],
    };
    const expired = {
        ...active,
        exceptions: [{ ...active.exceptions[0], expiresOn: '2026-07-22' }],
    };

    assert.equal(assessIssues([issue], active, new Date('2026-07-23T00:00:00Z')).excepted.length, 1);
    assert.equal(assessIssues([issue], expired, new Date('2026-07-23T00:00:00Z')).regressions.length, 1);
});

const benchPath = 'src/features/lesson-flow/renderers/BenchStepRenderer.tsx';
const benchTestPath = benchPath.replace('.tsx', '.test.tsx');
const benchSource = readFileSync(new URL('../' + benchPath, import.meta.url), 'utf8');
const benchTestSource = readFileSync(new URL('../' + benchTestPath, import.meta.url), 'utf8');
const r5 = (source, file = benchPath) => scanSource(source, file).filter((issue) => issue.rule === 'R5');
function replaceOnce(source, before, after) {
    assert.equal(source.split(before).length - 1, 1, `mutation anchor must be unique: ${before}`);
    return source.replace(before, after);
}

test('R5 accepts the actual approved exploration explanation without a policy entry', () => {
    assert.deepEqual(r5(benchSource), []);
});

test('R5 accepts actual observational Pixel queries without exempting the test file', () => {
    assert.deepEqual(r5(benchTestSource, benchTestPath), []);
});

const benchMutations = [
    ['challenge', "mode === 'explore'", "mode === 'challenge'"],
    ['correct', "mode === 'explore'", "mode === 'correct'"],
    ['always true', "interaction.payload.mode === 'explore'", 'true'],
    ['submitted guard removed', ' && !submitted', ''],
    ['target guard removed', '&& isCorrectInteractionValue(interaction, value)', ''],
    ['wrong feedback', '? interaction.feedback.correct : undefined', '? interaction.feedback.incorrect : undefined'],
    ['false branch visible', '? interaction.feedback.correct : undefined', '? interaction.feedback.correct : "Visible"'],
    ['unconditional mount', '{explanation ? (', '{true ? ('],
    ['second Pixel', '<Text style={styles.prompt}>{payload.prompt}</Text>', '<PixelIllustration /><Text style={styles.prompt}>{payload.prompt}</Text>'],
    ['extra caller', 'const galaxy = semanticColors.galaxy;', 'const extra = <BenchScreen explanation="Visible" />;\nconst galaxy = semanticColors.galaxy;'],
    ['export helper', 'function BenchScreen({', 'export function BenchScreen({'],
    ['escaped helper', 'const galaxy = semanticColors.galaxy;', 'const escaped = BenchScreen;\nconst galaxy = semanticColors.galaxy;'],
    ['explanation text removed', '<Text style={styles.explanationText}>{explanation}</Text>', ''],
    ['essential text inside Pixel', '<PixelIllustration state="happy" size="sm" />', '<PixelIllustration state="happy" size="sm"><Text>{explanation}</Text></PixelIllustration>'],
    ['prompt removed', '<Text style={styles.prompt}>{payload.prompt}</Text>', ''],
    ['decorative flag removed', 'accessible={false}', 'accessible={true}'],
    ['prop overridden by spread', 'explanation={interaction.payload.mode', '{...override} explanation={interaction.payload.mode'],
    ['comment cannot repair condition', "mode === 'explore'", "mode === 'challenge' /* mode === 'explore' */"],
    ['correctness function shadowed', 'export function BenchStepRenderer({', 'const isCorrectInteractionValue = () => true;\nexport function BenchStepRenderer({'],
    ['shadowed interaction', '  return (\n    <BenchScreen', '  const interaction = anything;\n  return (\n    <BenchScreen'],
    ['mutated explanation', '  const { controls, goal, mode } = payload;', '  explanation = "Always";\n  const { controls, goal, mode } = payload;'],
    ['nested binding shadows explanation', '  const { controls, goal, mode } = payload;', '  function hidden(explanation) { return explanation; }\n  const { controls, goal, mode } = payload;'],
    ['alias import unsupported', 'import { PixelIllustration }', 'import { PixelIllustration as Mascot }'],
    ['wrong import module', "from '../../../ui/characters/PixelIllustration'", "from './untrusted'"],
];
for (const [name, before, after] of benchMutations) {
    test(`R5 rejects approved-source mutation: ${name}`, () => {
        const mutated = replaceOnce(benchSource, before, after);
        assert.equal(r5(mutated).length, 1);
    });
}

test('R5 keeps legacy classification outside the exact renderer and test paths', () => {
    assert.equal(r5(benchSource, 'src/features/other/BenchExploreRenderer.tsx').length, 1);
    assert.equal(r5(benchSource, 'src/features/lesson-flow/renderers/OtherRenderer.tsx').length, 1);
    assert.equal(r5('<PixelIllustration />', 'src/features/ReviewScreen.tsx').length, 0);
});

test('R5 test references must remain observational; import and comments alone are not mounting', () => {
    const imported = "import { PixelIllustration } from '../../../ui/characters/PixelIllustration';";
    assert.deepEqual(r5(imported, benchTestPath), []);
    assert.deepEqual(r5('// PixelIllustration\nconst note = "PixelIllustration";', benchTestPath), []);
    for (const added of [
        '<PixelIllustration />;',
        'React.createElement(PixelIllustration);',
        'const Alias = PixelIllustration;',
        'consume(PixelIllustration);',
        'view.render(PixelIllustration);',
        'view.UNSAFE_getByType(PixelIllustration, props);',
        'const PixelIllustration = Other;',
    ]) assert.equal(r5(benchTestSource + '\n' + added, benchTestPath).length, 1, added);
    assert.equal(r5(replaceOnce(benchTestSource, 'import { PixelIllustration }', 'import { PixelIllustration as Alias }'), benchTestPath).length, 1);
});

test('R5 accepts harmless comments and parentheses but not malformed syntax', () => {
    assert.deepEqual(r5(replaceOnce(benchSource, "mode === 'explore'", "mode /* approved moment */ === ('explore')")), []);
    assert.equal(r5(benchSource + '\nconst broken = <PixelIllustration').length, 1);
});


const queryMutations = [
    ['CharacterSlot-only test', '<CharacterSlot />'],
    ['forged query receiver', replaceOnce(benchTestSource, 'const view = render(', 'const view = arbitrary(')],
    ['query receiver reassigned', benchTestSource + '\nview.UNSAFE_getByType = render;'],
    ['query receiver shadowed', benchTestSource + '\nfunction shadow(view) { view.UNSAFE_getByType(PixelIllustration); }'],
];
for (const [name, source] of queryMutations) {
    test(`R5 rejects ${name}`, () => assert.equal(r5(source, benchTestPath).length, 1));
}

const pixelModule = '../../../ui/characters/PixelIllustration';
const namespaceImport = `import * as CharacterArt from '${pixelModule}';`;

test('R5 rejects R3 extra unconditional namespace/bracket alias mount', () => {
    const prefix = namespaceImport + "\nconst ExtraMascot = CharacterArt['PixelIllustration'];\n";
    const anchor = '<Text style={styles.prompt}>{payload.prompt}</Text>';
    const mutated = prefix + replaceOnce(benchSource, anchor,
        '<ExtraMascot state="happy" size="sm" />' + anchor);
    assert.equal(r5(mutated).length, 1);
});

test('R5 rejects R3 test namespace/bracket createElement mount without named identifiers', () => {
    const mounted = "import React from 'react';\n"
        + "import { render } from '@testing-library/react-native';\n"
        + namespaceImport
        + "\nrender(React.createElement(CharacterArt['PixelIllustration'], {state:'happy',size:'sm'}));";
    assert.equal(r5(mounted, benchTestPath).length, 1);
});

const alternativeImports = [
    ['namespace dot access', namespaceImport, 'CharacterArt.PixelIllustration'],
    ['default binding', `import ExtraMascot from '${pixelModule}';`, 'ExtraMascot'],
    ['named alias', `import { PixelIllustration as ExtraMascot } from '${pixelModule}';`, 'ExtraMascot'],
    ['string named alias', `import { "PixelIllustration" as ExtraMascot } from '${pixelModule}';`, 'ExtraMascot'],
    ['extra default beside canonical', `import ExtraMascot, { PixelIllustration } from '${pixelModule}';`, 'ExtraMascot'],
    ['CharacterSlot namespace', "import * as CharacterArt from '../../../ui/characters/CharacterSlot';", "CharacterArt['CharacterSlot']"],
    ['CharacterSlot string alias', "import { 'CharacterSlot' as ExtraMascot } from './unknown';", 'ExtraMascot'],
];
for (const [name, declaration, mounted] of alternativeImports) {
    test(`R5 rejects alternate character import binding: ${name}`, () => {
        assert.equal(r5(declaration + `\nReact.createElement(${mounted});`, benchTestPath).length, 1);
        assert.equal(r5(declaration + '\n' + benchSource).length, 1);
    });
}
