import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const SUPPORTED_NODE_MAJOR = 20;

function parseNodeMajor(nodeVersion) {
  const match = /^v?(\d+)/.exec(nodeVersion ?? '');
  return match ? Number.parseInt(match[1], 10) : null;
}

export function resolveToolchain({
  nodeVersion = process.version,
  npmPath = path.join(path.dirname(process.execPath), 'npm'),
  npmExists = fs.existsSync,
} = {}) {
  const nodeMajor = parseNodeMajor(nodeVersion);
  const npmAvailable = Boolean(npmPath && npmExists(npmPath));

  return {
    ok: nodeMajor === SUPPORTED_NODE_MAJOR && npmAvailable,
    nodeMajor,
    npmAvailable,
  };
}

export function getToolchainDiagnostics({
  nodeVersion = process.version,
  npmPath = path.join(path.dirname(process.execPath), 'npm'),
} = {}) {
  const result = resolveToolchain({ nodeVersion, npmPath });
  const issues = [];

  if (result.nodeMajor !== SUPPORTED_NODE_MAJOR) {
    issues.push(`Node ${SUPPORTED_NODE_MAJOR}.x is required; found ${nodeVersion}.`);
  }

  if (!result.npmAvailable) {
    issues.push(`npm was not found next to the active Node runtime: ${npmPath}.`);
  }

  return {
    ...result,
    nodeVersion,
    npmPath,
    issues,
  };
}

function isMainModule() {
  return process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

if (isMainModule()) {
  const diagnostics = getToolchainDiagnostics();
  console.log(`Node: ${diagnostics.nodeVersion} (major ${diagnostics.nodeMajor ?? 'unknown'})`);
  console.log(`npm: ${diagnostics.npmAvailable ? diagnostics.npmPath : 'unavailable'}`);

  if (!diagnostics.ok) {
    for (const issue of diagnostics.issues) {
      console.error(`ERROR: ${issue}`);
    }
    console.error('Use the repository runtime, for example: export PATH="/Users/anderson/.nvm/versions/node/v20.20.2/bin:$PATH"');
    process.exitCode = 1;
  }
}
