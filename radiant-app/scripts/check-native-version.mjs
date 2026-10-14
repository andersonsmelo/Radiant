import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

function expectedVersion(config) {
  const version = config.expo?.version;
  const buildNumber = config.expo?.ios?.buildNumber;
  if (!/^\d+\.\d+\.\d+$/.test(version ?? '') || !/^\d+$/.test(buildNumber ?? '')) {
    throw new Error('Invalid app.json version/buildNumber');
  }
  return { version, buildNumber: String(buildNumber) };
}

function field(plist, key) {
  const pattern = new RegExp(`(<key>${key}</key>\\s*<string>)([^<]*)(</string>)`, 'g');
  const matches = [...plist.matchAll(pattern)];
  if (matches.length !== 1) throw new Error(`Expected exactly one ${key} in native Info.plist`);
  return { pattern, value: matches[0][2] };
}

export function inspectNativeVersion(config, plist) {
  const expected = expectedVersion(config);
  const actual = {
    version: field(plist, 'CFBundleShortVersionString').value,
    buildNumber: field(plist, 'CFBundleVersion').value,
  };
  return { aligned: expected.version === actual.version && expected.buildNumber === actual.buildNumber, expected, actual };
}

export function syncNativeVersion(config, plist) {
  const expected = expectedVersion(config);
  return plist
    .replace(field(plist, 'CFBundleShortVersionString').pattern, (_, start, value, end) => `${start}${expected.version}${end}`)
    .replace(field(plist, 'CFBundleVersion').pattern, (_, start, value, end) => `${start}${expected.buildNumber}${end}`);
}

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const config = JSON.parse(await readFile(path.join(root, 'app.json'), 'utf8'));
  const plistPath = path.join(root, 'ios/Radiant/Info.plist');
  let plist = await readFile(plistPath, 'utf8');
  if (process.argv.includes('--sync')) {
    const synced = syncNativeVersion(config, plist);
    if (synced !== plist) await writeFile(plistPath, synced);
    plist = synced;
  }
  const result = inspectNativeVersion(config, plist);
  console.log(JSON.stringify(result));
  if (!result.aligned) {
    console.error('FAIL native metadata differs from app.json; use node scripts/check-native-version.mjs --sync before building.');
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
