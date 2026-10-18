import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectNativeVersion, syncNativeVersion } from './check-native-version.mjs';

const config = { expo: { version: '1.4.0', ios: { buildNumber: '3' } } };
const plist = '<plist><dict><key>CFBundleShortVersionString</key><string>1.3.1</string><key>CFBundleVersion</key><string>3</string><key>CustomSetting</key><string>preserve-me</string></dict></plist>';

test('detects a stale native version even when the build number matches', () => {
  assert.deepEqual(inspectNativeVersion(config, plist), {
    aligned: false, expected: { version: '1.4.0', buildNumber: '3' },
    actual: { version: '1.3.1', buildNumber: '3' },
  });
});

test('synchronizes only version fields and is idempotent', () => {
  const synced = syncNativeVersion(config, plist);
  assert.equal(synced, plist.replace('<string>1.3.1</string>', '<string>1.4.0</string>'));
  assert.equal(inspectNativeVersion(config, synced).aligned, true);
  assert.equal(syncNativeVersion(config, synced), synced);
});

test('refuses malformed native metadata rather than silently claiming alignment', () => {
  assert.throws(() => syncNativeVersion(config, '<plist/>'), /CFBundleShortVersionString/);
  assert.throws(() => syncNativeVersion({ expo: { version: 'oops', ios: { buildNumber: '3' } } }, plist), /version/);
});
