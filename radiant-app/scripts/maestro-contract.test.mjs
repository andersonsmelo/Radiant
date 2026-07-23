import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
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
  assert.match(flows[1], /Receber conquista/);
  assert.match(flows[2], /setAirplaneMode: true/);
  assert.match(flows[2], /setAirplaneMode: false/);
});

test('keeps the e2e build local-first and bypasses the beta gate', async () => {
  const eas = JSON.parse(await readAppFile('eas.json'));
  const environment = eas.build['e2e-test']?.env;

  assert.deepEqual(environment, {
    EXPO_PUBLIC_APP_ENV: 'development',
    EXPO_PUBLIC_ENABLE_DEV_TOOLS: 'false',
    EXPO_PUBLIC_ENABLE_TELEMETRY_DEBUG_SCREEN: 'false',
    EXPO_PUBLIC_ENABLE_BETA_GATE: 'false',
    EXPO_PUBLIC_ENABLE_LEARNING_ROAD: 'true',
    EXPO_PUBLIC_ENABLE_REMOTE_SYNC: 'false',
  });
});

test('keeps lesson-answer selectors accessible and deterministic', async () => {
  const source = await readAppFile('src/features/lesson-flow/renderers/MultipleChoiceStepRenderer.tsx');

  assert.match(source, /testID=\{`lesson-option-\$\{option\.id\}`\}/);
  assert.match(source, /accessibilityRole="button"/);
  assert.match(source, /accessibilityState=\{\{ selected, disabled: locked \}\}/);
});
