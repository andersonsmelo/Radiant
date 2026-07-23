import assert from 'node:assert/strict';
import test from 'node:test';

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
