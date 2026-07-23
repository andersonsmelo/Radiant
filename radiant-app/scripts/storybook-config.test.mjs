import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('keeps Storybook opt-in and outside the normal Expo Router entry point', () => {
  const metroConfig = read('../metro.config.js');
  const rootLayout = read('../src/app/_layout.tsx');

  assert.match(metroConfig, /@storybook\/react-native\/withStorybook/);
  assert.match(metroConfig, /enabled: process\.env\.STORYBOOK_ENABLED === 'true'/);
  assert.match(metroConfig, /configPath: '\.\/\.rnstorybook'/);
  assert.doesNotMatch(rootLayout, /\.rnstorybook/);
});

test('swaps the Expo Router entry point only when Storybook is enabled', () => {
  const resolvedEntrypoint = execFileSync(
    process.execPath,
    ['-e', `
      const config = require('./metro.config');
      const appEntry = require.resolve('expo-router/entry');
      const result = config.resolver.resolveRequest(
        { resolveRequest: () => ({ filePath: appEntry, type: 'sourceFile' }) },
        'expo-router/entry',
        'ios',
      );
      process.stdout.write(result.filePath);
    `],
    {
      cwd: new URL('..', import.meta.url),
      env: {
        ...process.env,
        STORYBOOK_ENABLED: 'true',
        STORYBOOK_SERVER: 'false',
        STORYBOOK_DISABLE_TELEMETRY: 'true',
      },
    },
  ).toString();

  assert.match(resolvedEntrypoint, /\.rnstorybook\/index\.tsx?$/);
});

test('aligns every Storybook package to the supported 10.4 line', () => {
  const packageJson = JSON.parse(read('../package.json'));
  const storybookPackages = Object.entries(packageJson.dependencies)
    .filter(([name]) => name === 'storybook' || name.startsWith('@storybook/'));

  assert.deepEqual(storybookPackages.map(([, version]) => version), ['10.4.0', '10.4.0', '10.4.0', '10.4.0', '10.4.0']);
  assert.equal(packageJson.scripts.storybook, 'STORYBOOK_ENABLED=true expo start');
  assert.equal(packageJson.scripts['storybook:ios'], 'STORYBOOK_ENABLED=true expo start --ios');
  assert.equal(packageJson.scripts['storybook:android'], 'STORYBOOK_ENABLED=true expo start --android');
});
