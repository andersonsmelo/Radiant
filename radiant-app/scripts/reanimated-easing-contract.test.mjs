import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const appDirectory = path.resolve(scriptDirectory, '..');
const reanimatedComponents = [
  'src/components/ui/AppButton.tsx',
  'src/components/ui/ProgressRing.tsx',
];

test('uses Reanimated worklet easings in Reanimated components', async () => {
  for (const relativePath of reanimatedComponents) {
    const source = await readFile(path.join(appDirectory, relativePath), 'utf8');
    const reanimatedImport = source.match(
      /import Animated, \{([\s\S]*?)\} from 'react-native-reanimated';/,
    );

    assert.ok(reanimatedImport, `${relativePath} imports its animation primitives from Reanimated`);
    assert.match(reanimatedImport[1], /\bEasing\b/, `${relativePath} imports Reanimated Easing`);
    assert.doesNotMatch(source, /easing:\s*easing\./, `${relativePath} does not pass React Native easing into a worklet`);
    assert.match(source, /easing:\s*Easing\./, `${relativePath} passes a Reanimated worklet easing to withTiming`);
  }
});
