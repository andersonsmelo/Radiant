import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appId = 'com.ascendcreative.radiant';

async function readAppFile(relativePath) {
  return readFile(path.join(appRoot, relativePath), 'utf8');
}

test('keeps Maestro discovery explicit and artifact output untracked', async () => {
  const [config, gitignore] = await Promise.all([
    readAppFile('.maestro/config.yaml'),
    readAppFile('.gitignore'),
  ]);

  assert.match(config, /flows:\n\s+- "\*\.yaml"/);
  assert.match(config, /testOutputDir: artifacts/);
  assert.match(gitignore, /^\.maestro\/artifacts\/$/m);
});

test('keeps each shipped flow tied to the installed mobile identifier', async () => {
  const flowNames = [
    'onboarding-to-home.yaml',
    'learning-critical-path.yaml',
    'offline-relaunch.yaml',
  ];

  const flows = await Promise.all(flowNames.map((name) => readAppFile(`.maestro/${name}`)));

  for (const flow of flows) {
    assert.match(flow, new RegExp(`^appId: ${appId}$`, 'm'));
    assert.match(flow, /^---$/m);
    assert.match(flow, /- launchApp:/);
  }

  assert.match(flows[0], /radiantapp:\/\/onboarding/);
  assert.match(flows[1], /lesson-option-q1:option:1/);
  // The critical path ends at Progresso. The reward node is unlocked only after
  // the LAST lesson of the catalog-generated track (7 lessons), so it is not
  // reachable in a smoke run — asserting it here would encode an unrunnable flow.
  assert.match(flows[1], /- tapOn: 'Progresso, tab\.\*'/);
  assert.match(flows[1], /- assertVisible: PROGRESSO/);
  assert.doesNotMatch(flows[1], /Receber conquista/);
  // setAirplaneMode takes enabled/disabled; the boolean form fails to parse.
  assert.match(flows[2], /setAirplaneMode: enabled/);
  assert.match(flows[2], /setAirplaneMode: disabled/);
  assert.doesNotMatch(flows[2], /setAirplaneMode: (?:true|false)/);
});

test('keeps every below-the-fold action reachable before it is tapped', async () => {
  // Primary actions are AppButtons, which set accessibilityRole plus
  // accessibilityLabel on the Pressable. iOS collapses the subtree, so the node
  // exposes accessibilityText and no text attribute: scrollUntilVisible's
  // `element.text` never resolves against them, while visible/tapOn do match.
  // Guarded repeat-scroll is the pattern that works; keep it in place.
  const flow = await readAppFile('.maestro/learning-critical-path.yaml');

  for (const label of ['Abrir checkpoint', 'Concluir checkpoint', 'Continue']) {
    assert.match(
      flow,
      new RegExp(`while:\\n\\s+notVisible: ${label}\\n\\s+commands:\\n\\s+- scroll`),
      `expected a guarded scroll before tapping "${label}"`
    );
  }
});

test('keeps icon glyphs out of the accessibility tree', async () => {
  // Icon fonts render private-use codepoints, so an exposed glyph is announced
  // as an unreadable character. DecorativeIcon hides them; importing
  // MaterialIcons directly in a screen puts them back on the tree.
  const wrapper = await readAppFile('src/components/ui/DecorativeIcon.tsx');

  assert.match(wrapper, /accessibilityElementsHidden/);
  assert.match(wrapper, /importantForAccessibility="no-hide-descendants"/);
  assert.match(wrapper, /accessible=\{false\}/);

  const offenders = [];
  for (const dir of ['src/features', 'src/app']) {
    for (const entry of await readdir(path.join(appRoot, dir), { recursive: true })) {
      if (!/\.tsx$/.test(entry) || /\.test\.tsx$/.test(entry)) continue;
      const source = await readAppFile(path.join(dir, entry));
      if (/@expo\/vector-icons\/MaterialIcons/.test(source)) offenders.push(`${dir}/${entry}`);
    }
  }

  assert.deepEqual(offenders, [], 'these files import MaterialIcons directly instead of DecorativeIcon');
});

test('keeps the journey map on the dark galaxy theme it renders inside', async () => {
  // JourneyMap and its children render only inside JourneyHomeScreen, which is a
  // dark galaxy screen. Importing the light `colors` token makes them render a
  // white card with dark text on the dark background — the exact defect fixed in
  // B2. The rule: these components use `galaxyColors`, never the light `colors`.
  const files = [
    'src/features/journey/components/JourneyMap.tsx',
    'src/features/journey/components/JourneyNodeCard.tsx',
    'src/features/journey/components/JourneyMapHeader.tsx',
  ];

  for (const file of files) {
    const source = await readAppFile(file);
    assert.match(source, /\bgalaxyColors\b/, `${file} must theme with galaxyColors`);
    assert.doesNotMatch(
      source,
      /\bcolors\b/,
      `${file} must not use the light \`colors\` theme inside the dark journey screen`
    );
  }
});

test('never lets a route fall back to the native header', async () => {
  // An undeclared route inheriting the default header renders its raw path as
  // the title and the previous route id as the back label — leaking
  // "onboarding/index" and "(tabs)" onto the screen and into VoiceOver.
  const layout = await readAppFile('src/app/_layout.tsx');

  assert.match(layout, /<Stack screenOptions=\{\{ headerShown: false \}\}>/);
});

test('keeps the e2e build local-first and bypasses the beta gate', async () => {
  const eas = JSON.parse(await readAppFile('eas.json'));
  const profile = eas.build['e2e-test'];
  const environment = profile?.env;

  assert.equal(profile?.developmentClient, false);

  assert.deepEqual(environment, {
    EXPO_PUBLIC_APP_ENV: 'development',
    EXPO_PUBLIC_ENABLE_DEV_TOOLS: 'false',
    EXPO_PUBLIC_ENABLE_TELEMETRY_DEBUG_SCREEN: 'false',
    EXPO_PUBLIC_ENABLE_BETA_GATE: 'false',
    EXPO_PUBLIC_ENABLE_LEARNING_ROAD: 'true',
    EXPO_PUBLIC_ENABLE_PUSH: 'false',
    EXPO_PUBLIC_ENABLE_REMOTE_SYNC: 'false',
  });
});

test('keeps lesson-answer selectors accessible and deterministic', async () => {
  const source = await readAppFile('src/features/lesson-flow/renderers/MultipleChoiceStepRenderer.tsx');

  assert.match(source, /testID=\{`lesson-option-\$\{option\.id\}`\}/);
  assert.match(source, /accessibilityRole="button"/);
  assert.match(source, /accessibilityState=\{\{ selected, disabled: locked \}\}/);
});

test('requires dated per-platform device evidence before any e2e pass is claimed', async () => {
  const [runbook, evidenceIndex, baseline] = await Promise.all([
    readAppFile('docs/E2E_RUNBOOK.md'),
    readAppFile('docs/evidence/README.md'),
    readAppFile('docs/evidence/2026-07-23-device-e2e-baseline.md'),
  ]);

  assert.match(runbook, /docs\/evidence\/2026-07-23-device-e2e-baseline\.md/);
  assert.match(evidenceIndex, /environment-blocked/);
  assert.match(evidenceIndex, /app-failed/);
  assert.match(evidenceIndex, /passed/);

  for (const platform of ['iOS', 'Android']) {
    assert.match(baseline, new RegExp(`\\| ${platform} \\|`));
  }

  assert.match(baseline, /environment-blocked/);
  assert.match(baseline, /app-failed/);
  assert.match(baseline, /passed/);
  assert.match(baseline, /pr[ée]-condi[çc][ãa]o/i);
  assert.doesNotMatch(baseline, /E2E (?:aprovad[oa]|PASS)/i);
});
