import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const LEGACY_WORKSPACE_PATH = '/Users/anderson/Documents/Radiant';

export const CURRENT_STATE_DOCUMENTS = [
  'README.md',
  'docs/README.md',
  'docs/ARCHITECTURE_STATE.md',
  'docs/EXECUTION_STATUS_2026-07-29.md',
  'radiant-app/README.md',
];

export function inspectDocument({ relativePath, content }) {
  const violations = [];
  const plainContent = content.replaceAll('`', '');

  if (content.includes(LEGACY_WORKSPACE_PATH)) {
    violations.push(`${relativePath}: contains the retired workspace path ${LEGACY_WORKSPACE_PATH}.`);
  }

  const claimsApiAvailability =
    /backend está publicado e respondendo/i.test(content) ||
    /API pública já responde/i.test(content) ||
    /API pública (?:está )?(?:disponível|saudável)/i.test(content);

  if (claimsApiAvailability) {
    violations.push(
      `${relativePath}: claims the public API is available; the current canonical status is inactive (HTTP 502).`
    );
  }

  if (/\b0\s+em\s+needs-review\b/i.test(plainContent) || /\b0\s+em\s+needs review\b/i.test(plainContent)) {
    violations.push(
      `${relativePath}: claims zero editorial items need review; the validated baseline still has review debt.`
    );
  }

  return violations;
}

export function runDocsContract({ rootDir = REPO_ROOT, documents = CURRENT_STATE_DOCUMENTS } = {}) {
  const violations = [];

  for (const relativePath of documents) {
    const absolutePath = path.join(rootDir, relativePath);

    if (!fs.existsSync(absolutePath)) {
      violations.push(`${relativePath}: required current-state document is missing.`);
      continue;
    }

    violations.push(...inspectDocument({ relativePath, content: fs.readFileSync(absolutePath, 'utf8') }));
  }

  return violations;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const violations = runDocsContract();

  if (violations.length === 0) {
    console.log('PASS documentation contract');
  } else {
    for (const violation of violations) {
      console.error(`FAIL ${violation}`);
    }
    process.exitCode = 1;
  }
}
