import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  CURRENT_STATE_DOCUMENTS,
  NON_INSTRUCTION_RELEASE_DOCUMENTS,
  RELEASE_INSTRUCTION_DOCUMENTS,
  inspectDocument,
  inspectReleaseDocument,
  readDistributedCapabilities,
} from './docs-contract.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('governs the newest execution status as a current-state document', () => {
  // Cada data de execução cria um snapshot novo e aposenta o anterior. Se a
  // lista de documentos governados não acompanhar, o contrato passa a validar
  // um estado histórico e para de checar o que está em vigor — a forma mais
  // silenciosa de o documento canônico voltar a divergir da realidade.
  const newest = readdirSync(path.join(repoRoot, 'docs'))
    .filter((name) => /^EXECUTION_STATUS_\d{4}-\d{2}-\d{2}\.md$/.test(name))
    .sort()
    .at(-1);

  assert.ok(newest, 'expected at least one EXECUTION_STATUS_<date>.md in docs/');
  assert.ok(
    CURRENT_STATE_DOCUMENTS.includes(`docs/${newest}`),
    `docs/${newest} is the newest execution status but is not a governed current-state document`,
  );
});

test('flags a machine-local user path in a current-state document', () => {
  const violations = inspectDocument({
    relativePath: 'README.md',
    content: 'Abra /Users/alguem/Documents/Radiant/radiant-app para continuar.',
  });

  assert.deepEqual(violations, [
    'README.md: contains a machine-local /Users/ path; use a repository-relative link instead.',
  ]);
});

test('flags an API availability statement that contradicts the known inactive state', () => {
  const violations = inspectDocument({
    relativePath: 'README.md',
    content: 'O backend está publicado e respondendo em https://api.radiant.ascendcreative.com.br.',
  });

  assert.deepEqual(violations, [
    'README.md: claims the public API is available; the current canonical status is inactive (HTTP 502).',
  ]);
});

test('flags an editorial approval claim that hides items needing review', () => {
  const violations = inspectDocument({
    relativePath: 'README.md',
    content: '96 bundles gerados e aprovados — 0 em needs-review.',
  });

  assert.deepEqual(violations, [
    'README.md: claims zero editorial items need review; the validated baseline still has review debt.',
  ]);
});

test('flags the same editorial claim when Markdown code marks surround the values', () => {
  const violations = inspectDocument({
    relativePath: 'README.md',
    content: '96 bundles gerados e aprovados — `0` em `needs-review`.',
  });

  assert.deepEqual(violations, [
    'README.md: claims zero editorial items need review; the validated baseline still has review debt.',
  ]);
});

test('accepts an honest local-first status statement', () => {
  assert.deepEqual(
    inspectDocument({
      relativePath: 'docs/EXECUTION_STATUS_2026-07-26.md',
      content: 'O app funciona local-first. A API pública conhecida está inativa e retorna HTTP 502.',
    }),
    []
  );
});

// Os documentos de `radiant-app/docs/release/` mandam um humano exercitar o app
// e dizem à App Review o que a build faz. Entre 2026-04-09 e 2026-08-04 eles
// mandaram fazer login, inspecionar fila de sync e validar layout de iPad — três
// coisas que o binário distribuído não tem —, e nada reprovou, porque o contrato
// governava só os cinco documentos de estado. As capacidades abaixo são lidas de
// `eas.json` e `app.json`: quando uma delas passar a existir de verdade, a guarda
// correspondente some sozinha, em vez de virar literal envelhecida.

test('derives the distributed capabilities from eas.json and app.json', () => {
  const capabilities = readDistributedCapabilities({ rootDir: repoRoot });

  assert.equal(
    capabilities.accountLogin,
    false,
    'no eas.json profile declares EXPO_PUBLIC_API_BASE_URL, so the login surface is unreachable'
  );
  assert.equal(
    capabilities.remoteSync,
    false,
    'the production profile declares EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false'
  );
  assert.equal(capabilities.tablet, false, 'app.json declares ios.supportsTablet: false');
});

test('classifies every release document as instructional or not', () => {
  // Um documento novo nesta pasta precisa de uma decisão explícita. Sem isto, a
  // lista governada envelhece em silêncio — o mesmo modo de falha que o teste do
  // status canônico mais novo existe para conter.
  const present = readdirSync(path.join(repoRoot, 'radiant-app/docs/release'))
    .filter((name) => name.endsWith('.md'))
    .map((name) => `radiant-app/docs/release/${name}`);

  const classified = new Set([...RELEASE_INSTRUCTION_DOCUMENTS, ...NON_INSTRUCTION_RELEASE_DOCUMENTS]);

  for (const relativePath of present) {
    assert.ok(
      classified.has(relativePath),
      `${relativePath} is neither governed as instructional nor listed as a record/template`
    );
  }
});

test('flags a smoke step that instructs a login the build cannot reach', () => {
  const violations = inspectReleaseDocument({
    relativePath: 'radiant-app/docs/release/TESTFLIGHT_SMOKE.md',
    content: '## Scenario 2: auth bootstrap\n\n- log in\n- kill and relaunch the app\n',
    capabilities: { accountLogin: false, remoteSync: false, tablet: false },
  });

  assert.deepEqual(violations, [
    'radiant-app/docs/release/TESTFLIGHT_SMOKE.md: asserts or instructs account login, but no eas.json profile declares EXPO_PUBLIC_API_BASE_URL — the login surface is unreachable in every distributed build.',
  ]);
});

test('flags reviewer notes that promise sync the production profile turns off', () => {
  const violations = inspectReleaseDocument({
    relativePath: 'radiant-app/docs/release/APP_STORE_METADATA.md',
    content: '`This build preserves the local-first study flow and retries sync when connectivity returns.`',
    capabilities: { accountLogin: false, remoteSync: false, tablet: false },
  });

  assert.deepEqual(violations, [
    'radiant-app/docs/release/APP_STORE_METADATA.md: asserts remote sync behaviour, but the production profile declares EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false — nothing syncs in a distributed build.',
  ]);
});

test('flags a tablet instruction item while the build ships phone-only', () => {
  const violations = inspectReleaseDocument({
    relativePath: 'radiant-app/docs/release/IOS_SOFT_LAUNCH_CHECKLIST.md',
    content: '- iPad layout smoke passed\n',
    capabilities: { accountLogin: false, remoteSync: false, tablet: false },
  });

  assert.deepEqual(violations, [
    'radiant-app/docs/release/IOS_SOFT_LAUNCH_CHECKLIST.md: instructs a tablet check, but app.json declares ios.supportsTablet: false — there is no tablet build to check.',
  ]);
});

test('accepts prose that explains the tablet surface is out of scope', () => {
  // A guarda de tablet olha item de instrução (linha de lista), não prosa: o
  // documento precisa poder dizer por que o iPad está fora sem se autodenunciar.
  assert.deepEqual(
    inspectReleaseDocument({
      relativePath: 'radiant-app/docs/release/IOS_SOFT_LAUNCH_CHECKLIST.md',
      content: 'O iPad está fora do escopo da v1.3: o app.json declara `supportsTablet: false`.\n',
      capabilities: { accountLogin: false, remoteSync: false, tablet: false },
    }),
    []
  );
});

test('flags an App Store field that exceeds the platform limit', () => {
  // O subtítulo declarado em 2026-04-09 tinha 46 caracteres contra o teto de 30:
  // ele nunca poderia ser digitado no console, e ninguém tinha medido.
  const violations = inspectReleaseDocument({
    relativePath: 'radiant-app/docs/release/APP_STORE_METADATA.md',
    content: '- Subtitle:\n  `Estudo diário de radiologia com quiz e revisão`\n',
    capabilities: { accountLogin: false, remoteSync: false, tablet: false },
  });

  assert.deepEqual(violations, [
    'radiant-app/docs/release/APP_STORE_METADATA.md: declares a Subtitle of 46 characters; the App Store limit is 30.',
  ]);
});

test('accepts a smoke step written against the surfaces the build actually has', () => {
  assert.deepEqual(
    inspectReleaseDocument({
      relativePath: 'radiant-app/docs/release/TESTFLIGHT_SMOKE.md',
      content:
        '## Cenário 2: abertura em instalação limpa\n\n' +
        '- a apresentação do Pixel aparece antes da Learning Road\n' +
        '- não há conta nem sessão a restaurar: o app abre direto no estudo\n' +
        '- Subtitle:\n  `Radiologia: estude e revise`\n',
      capabilities: { accountLogin: false, remoteSync: false, tablet: false },
    }),
    []
  );
});
