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
  // O snapshot mais recente governa; o anterior sai da lista ao ser substituído,
  // senão o contrato passa a validar histórico e para de checar o que está em
  // vigor. O teste irmão afirma exatamente esse acoplamento.
  'docs/EXECUTION_STATUS_2026-08-10.md',
  'radiant-app/README.md',
];

// Documentos que mandam alguém exercitar a build ou declaram à App Review o que
// ela faz. São governados porque erram de um jeito caro: um passo impossível
// consome uma janela humana, e uma declaração falsa vai para a Apple.
export const RELEASE_INSTRUCTION_DOCUMENTS = [
  'radiant-app/docs/release/TESTFLIGHT_SMOKE.md',
  'radiant-app/docs/release/IOS_SOFT_LAUNCH_CHECKLIST.md',
  'radiant-app/docs/release/APP_STORE_METADATA.md',
  'radiant-app/docs/release/APP_STORE_LISTING_MATRIX.md',
];

// Registros datados e moldes vazios. Não instruem nem declaram: o war room é um
// snapshot de 2026-04-03, e os templates são preenchidos por quem os usa.
export const NON_INSTRUCTION_RELEASE_DOCUMENTS = [
  'radiant-app/docs/release/APP_STORE_WAR_ROOM_LATEST.md',
  'radiant-app/docs/release/APP_STORE_WAR_ROOM_TEMPLATE.md',
  'radiant-app/docs/release/TEMPLATE-IOS_RELEASE.md',
  'radiant-app/docs/release/RATING_AND_PAYWALL_TIMING.md',
];

// Tetos da App Store, em caracteres. São limites de plataforma, não escolha
// deste projeto — por isso ficam como constante e não derivam de fonte nenhuma.
const APP_STORE_FIELD_LIMITS = {
  Subtitle: 30,
  'Promo text': 170,
  Keywords: 100,
};

// A guarda de login e a de sync casam em qualquer lugar do documento: uma
// afirmação de capacidade é falsa onde quer que apareça. A de tablet olha só
// item de lista, para que a prosa possa explicar por que o iPad ficou fora sem
// se autodenunciar.
const CAPABILITY_CLAIMS = {
  accountLogin: {
    patterns: [
      /supports account login/i,
      /auth bootstrap/i,
      /session restore/i,
      /auth and sync smoke/i,
      /^\s*[-*]\s*log in\b/im,
      /\bfa[çc]a login\b/i,
      /\befetue login\b/i,
    ],
    violation:
      'asserts or instructs account login, but no eas.json profile declares EXPO_PUBLIC_API_BASE_URL — the login surface is unreachable in every distributed build.',
  },
  remoteSync: {
    patterns: [
      /retries sync when connectivity returns/i,
      /queue state and sync status/i,
      /sync queues drain/i,
      /\bsync smoke\b/i,
    ],
    violation:
      'asserts remote sync behaviour, but the production profile declares EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false — nothing syncs in a distributed build.',
  },
  tablet: {
    patterns: [/^\s*(?:[-*]|\d+\.)\s.*\biPad\b/im],
    violation:
      'instructs a tablet check, but app.json declares ios.supportsTablet: false — there is no tablet build to check.',
  },
};

export function readDistributedCapabilities({ rootDir = REPO_ROOT } = {}) {
  const eas = JSON.parse(fs.readFileSync(path.join(rootDir, 'radiant-app/eas.json'), 'utf8'));
  const app = JSON.parse(fs.readFileSync(path.join(rootDir, 'radiant-app/app.json'), 'utf8'));
  const profiles = Object.values(eas.build ?? {});

  return {
    accountLogin: profiles.some((profile) => Boolean(profile?.env?.EXPO_PUBLIC_API_BASE_URL?.trim())),
    remoteSync: eas.build?.production?.env?.EXPO_PUBLIC_ENABLE_REMOTE_SYNC === 'true',
    tablet: app.expo?.ios?.supportsTablet === true,
  };
}

export function inspectReleaseDocument({ relativePath, content, capabilities }) {
  const violations = [];

  for (const [capability, { patterns, violation }] of Object.entries(CAPABILITY_CLAIMS)) {
    if (capabilities[capability]) {
      continue;
    }

    if (patterns.some((pattern) => pattern.test(content))) {
      violations.push(`${relativePath}: ${violation}`);
    }
  }

  for (const [field, limit] of Object.entries(APP_STORE_FIELD_LIMITS)) {
    const declared = content.match(new RegExp(`^\\s*[-*]\\s*${field}:\\s*\\n?\\s*\`([^\`]+)\``, 'gim')) ?? [];

    for (const block of declared) {
      const value = block.match(/`([^`]+)`/)?.[1] ?? '';

      if (value.length > limit) {
        violations.push(
          `${relativePath}: declares a ${field} of ${value.length} characters; the App Store limit is ${limit}.`
        );
      }
    }
  }

  return violations;
}

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

export function runDocsContract({
  rootDir = REPO_ROOT,
  documents = CURRENT_STATE_DOCUMENTS,
  releaseDocuments = RELEASE_INSTRUCTION_DOCUMENTS,
} = {}) {
  const violations = [];

  for (const relativePath of documents) {
    const absolutePath = path.join(rootDir, relativePath);

    if (!fs.existsSync(absolutePath)) {
      violations.push(`${relativePath}: required current-state document is missing.`);
      continue;
    }

    violations.push(...inspectDocument({ relativePath, content: fs.readFileSync(absolutePath, 'utf8') }));
  }

  const capabilities = readDistributedCapabilities({ rootDir });

  for (const relativePath of releaseDocuments) {
    const absolutePath = path.join(rootDir, relativePath);

    if (!fs.existsSync(absolutePath)) {
      violations.push(`${relativePath}: governed release document is missing.`);
      continue;
    }

    violations.push(
      ...inspectReleaseDocument({
        relativePath,
        content: fs.readFileSync(absolutePath, 'utf8'),
        capabilities,
      })
    );
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
