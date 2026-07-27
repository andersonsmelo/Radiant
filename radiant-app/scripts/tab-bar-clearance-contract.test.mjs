import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// The tab bar in src/app/(tabs)/_layout.tsx is position:absolute, so it floats
// over scrollable content instead of insetting it. Every screen reachable from a
// tab must reserve `tabBarClearance` at the bottom of its scroll container, or
// its last element renders under the bar and can never be fully seen or tapped.
// This defect shipped once already (the Home CTA, fixed in 86d1867); a per-screen
// review did not prevent it from surviving on the other tab screens, so the rule
// is enforced structurally here.
const tabScreens = [
  'src/features/home/screens/HomeScreen.tsx',
  'src/features/journey/screens/JourneyHomeScreen.tsx',
  'src/features/progress/screens/ProgressScreen.tsx',
  'src/features/galaxy/screens/MissionsScreen.tsx',
  'src/features/galaxy/screens/GalaxyMapScreen.tsx',
];

async function readAppFile(relativePath) {
  return readFile(path.join(appRoot, relativePath), 'utf8');
}

test('derives the clearance from the real tab bar measurements', async () => {
  const styles = await readAppFile('src/ui/styles.ts');

  assert.match(styles, /export const tabBar = \{/);
  assert.match(styles, /export const tabBarClearance = tabBar\.height \+ tabBar\.bottomOffset \+ space\.s3;/);
});

test('reserves the shared clearance on every scrollable tab screen', async () => {
  for (const relativePath of tabScreens) {
    const source = await readAppFile(relativePath);

    // A screen that never scrolls cannot hide content under the bar.
    const scrolls = /contentContainerStyle=\{/.test(source);
    if (!scrolls) {
      continue;
    }

    assert.match(
      source,
      /paddingBottom: tabBarClearance/,
      `${relativePath} scrolls but does not reserve tabBarClearance`,
    );
    assert.match(
      source,
      /import \{[^}]*tabBarClearance[^}]*\} from/,
      `${relativePath} must import tabBarClearance instead of redefining it`,
    );
  }
});

test('keeps the scroll container of each tab screen free of hardcoded bottom padding', async () => {
  // A literal value here is how the defect returns: it looks deliberate, matches
  // no token, and silently drifts from the bar's real height.
  for (const relativePath of tabScreens) {
    const source = await readAppFile(relativePath);
    const contentStyle = source.match(
      /(?:content|scrollContent):\s*\{[^}]*\}/,
    );

    if (!contentStyle) {
      continue;
    }

    assert.doesNotMatch(
      contentStyle[0],
      /paddingBottom:\s*\d/,
      `${relativePath} hardcodes the scroll bottom padding instead of using tabBarClearance`,
    );
  }
});
