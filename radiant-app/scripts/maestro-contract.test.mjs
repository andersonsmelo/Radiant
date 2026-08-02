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

  // A CLI resolve testOutputDir com `File(valor).toPath()`, ou seja contra o cwd
  // da invocação — nunca contra este diretório. O runbook manda rodar de
  // `radiant-app`, então o valor é um caminho relativo a esta pasta e precisa
  // cair sob uma regra deste .gitignore. Afirmar os dois literais em separado,
  // como a versão anterior fazia, deixou `artifacts` e `.maestro/artifacts/`
  // divergirem em silêncio: os dois assertos passavam enquanto as execuções
  // despejavam 296MB num diretório que aparecia como untracked no git status.
  // O contrato agora é o acoplamento, não cada lado.
  const testOutputDir = config.match(/^testOutputDir: (.+)$/m)?.[1].trim();
  assert.ok(testOutputDir, 'expected .maestro/config.yaml to declare testOutputDir');
  assert.doesNotMatch(
    testOutputDir,
    /^[/~]|(^|\/)\.\.(\/|$)/,
    'testOutputDir must stay relative to radiant-app and must not escape it'
  );
  assert.match(
    gitignore,
    new RegExp(`^${testOutputDir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/$`, 'm'),
    `radiant-app/.gitignore must ignore "${testOutputDir}/", the directory Maestro writes runs to`
  );
});

test('keeps each shipped flow tied to the installed mobile identifier', async () => {
  const flowNames = [
    'boot-to-home.yaml',
    'learning-critical-path.yaml',
    'offline-relaunch.yaml',
  ];

  const flows = await Promise.all(flowNames.map((name) => readAppFile(`.maestro/${name}`)));

  for (const flow of flows) {
    assert.match(flow, new RegExp(`^appId: ${appId}$`, 'm'));
    assert.match(flow, /^---$/m);
    assert.match(flow, /- launchApp:/);
  }

  // The boot smoke proves a clean install reaches the local-first home. It
  // deliberately does NOT deep-link onboarding: v1.3 has no blocking wizard, and
  // the retired onboarding-to-home.yaml drove an unfinished prototype removed on
  // 2026-07-28. Keep the deep-link out and the stable home assertion in.
  assert.match(flows[0], /clearState: true/);
  assert.match(flows[0], /assertVisible: Foco de hoje/);
  assert.doesNotMatch(flows[0], /radiantapp:\/\/onboarding/);
  assert.match(flows[1], /lesson-option-q1:option:1/);
  // The critical path ends at Progresso. The reward node is unlocked only after
  // the LAST lesson of the catalog-generated track (7 lessons), so it is not
  // reachable in a smoke run — asserting it here would encode an unrunnable flow.
  // The tab selector is anchored to the tab's accessible name on both platforms
  // (iOS "Progresso, tab, 3 of 4", Android "Progresso"). It must stay anchored:
  // a loose `.*Progresso.*` also matches the home caption "Seu progresso fica
  // salvo..." — Maestro matches case-insensitively — and taps it instead, which
  // broke both platforms on 2026-07-28. The iOS-only literal broke Android.
  assert.match(flows[1], /- tapOn: '\^Progresso\(, tab\.\*\)\?\$'/);
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

  for (const label of ['Abrir checkpoint', 'Concluir checkpoint', 'Abrir próxima lição']) {
    assert.match(
      flow,
      new RegExp(`while:\\n\\s+notVisible: ${label}\\n\\s+commands:\\n\\s+- scroll`),
      `expected a guarded scroll before tapping "${label}"`
    );
    // The guarded repeat stops with the CTA under the floating tab bar on a fast
    // Android emulator (CTA y2212-2277 vs tab bar y2198-2387), so the tap lands
    // on the bar. A top-level lift-scroll must immediately precede the tap to
    // move the CTA clear — removing it reintroduces the occluded tap.
    assert.match(
      flow,
      new RegExp(`\\n- scroll\\n- tapOn: ${label}`),
      `expected a lift-scroll immediately before tapping "${label}" to clear the floating tab bar`
    );
  }
});

test('ties the celebration assertions to the copy CheckpointScreen actually renders', async () => {
  // Duas vezes seguidas o flow crítico afirmou texto que a tela já não mostrava:
  // a migração pt-BR de 2026-07-27 trocou a tarja da celebração e substituiu o
  // CTA fixo pelo rótulo do próximo nó, e o contrato seguiu verde porque só lia
  // o YAML. Uma asserção sobre o texto de um artefato confirma o que alguém
  // escreveu, nunca o que a tela renderiza — então ancore as duas strings na
  // fonte, que é o único lado que o device vê.
  const [flow, screen] = await Promise.all([
    readAppFile('.maestro/learning-critical-path.yaml'),
    readAppFile('src/features/checkpoint/screens/CheckpointScreen.tsx'),
  ]);

  const eyebrow = screen.match(/styles\.celebrationEyebrow\}>([^<]+)</)?.[1].trim();
  assert.ok(eyebrow, 'expected CheckpointScreen to render a celebration eyebrow');
  assert.match(
    flow,
    new RegExp(`^- assertVisible: ${eyebrow}$`, 'm'),
    `the critical path must assert the eyebrow the screen renders ("${eyebrow}")`
  );

  // O CTA da celebração é o rótulo do próximo nó recomendado, não um literal da
  // tela de celebração: o flow só pode tocar num rótulo que resolveNextAction
  // realmente produz.
  const tapped = flow.slice(flow.indexOf(`- assertVisible: ${eyebrow}`)).match(/^- tapOn: (.+)$/m)?.[1];
  assert.ok(tapped, 'expected a tap after the celebration assertion');
  assert.match(
    screen,
    new RegExp(`label: '${tapped}'`),
    `"${tapped}" is not a label resolveNextAction can return`
  );
});

test('keeps icon glyphs out of the accessibility tree', async () => {
  // Icon fonts render private-use codepoints, so an exposed glyph is announced
  // as an unreadable character. DecorativeIcon hides them; importing
  // MaterialIcons directly in a screen puts them back on the tree.
  const wrapper = await readAppFile('src/components/ui/DecorativeIcon.tsx');

  assert.match(wrapper, /accessibilityElementsHidden/);
  assert.match(wrapper, /importantForAccessibility="no-hide-descendants"/);
  assert.match(wrapper, /accessible=\{false\}/);

  // DecorativeIcon and icon-symbol ARE the sanctioned icon-font wrappers: they
  // import MaterialIcons on purpose and hide the glyph from the a11y tree. Every
  // other component must render through them. Scan both component roots too, not
  // just the feature/app screens — the Android blank-icon/glyph-in-name defect
  // (2026-07-28) lived in components/ui/icon-symbol.tsx, which the old scan of
  // src/features + src/app never reached. src/components is included for the same
  // reason: DecorativeIcon lives there, so leaving it unscanned would open the
  // symmetric blind spot.
  const ICON_FONT_WRAPPERS = new Set([
    'components/ui/icon-symbol.tsx',
    'src/components/ui/DecorativeIcon.tsx',
  ]);

  const offenders = [];
  for (const dir of ['components', 'src/components', 'src/features', 'src/app']) {
    for (const entry of await readdir(path.join(appRoot, dir), { recursive: true })) {
      if (!/\.tsx$/.test(entry) || /\.test\.tsx$/.test(entry)) continue;
      const relative = `${dir}/${entry}`;
      if (ICON_FONT_WRAPPERS.has(relative)) continue;
      const source = await readAppFile(relative);
      if (/@expo\/vector-icons\/MaterialIcons/.test(source)) offenders.push(relative);
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
  // the title and the previous route id as the back label — leaking the route
  // path (e.g. "galaxy/[galaxyId]") and "(tabs)" onto the screen and into
  // VoiceOver.
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
  // A alternativa não trava depois do primeiro toque: quem confirma é o
  // "Continuar" do rodapé, então o estado exposto é só `selected`. O contrato
  // proíbe reintroduzir `disabled` aqui — seria voltar a impedir a troca.
  assert.match(source, /accessibilityState=\{\{ selected \}\}/);
  assert.doesNotMatch(source, /disabled=\{/);
});

test('ties the first-run flow to the copy WelcomeFlowScreen actually renders', async () => {
  // A mesma classe de defeito já ocorreu duas vezes neste projeto (a migração
  // pt-BR de 2026-07-27 quebrou o wizard smoke e depois a celebração do
  // checkpoint) porque um flow verde afirmava texto que a tela já não
  // renderizava, e o contrato só lia o YAML. Uma asserção sobre o texto de um
  // artefato confirma o que alguém escreveu, nunca o que a tela renderiza —
  // então ancore as strings do first-run na fonte, o único lado que o device vê.
  const [screen, flow, subflow] = await Promise.all([
    readAppFile('src/features/first-run/screens/WelcomeFlowScreen.tsx'),
    readAppFile('.maestro/first-run.yaml'),
    readAppFile('.maestro/subflows/dismiss-first-run.yaml'),
  ]);

  const escapeForRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const slidesBlock = screen.match(/const SLIDES: SlideSpec\[\] = \[([\s\S]*?)\n\];/)?.[1];
  assert.ok(slidesBlock, 'expected a SLIDES array in WelcomeFlowScreen.tsx');

  const titles = [...slidesBlock.matchAll(/title: '([^']+)'/g)].map((match) => match[1]);
  assert.equal(titles.length, 3, 'expected three slide titles in SLIDES');

  const footnote = slidesBlock.match(/footnote:\s*\n\s*'([^']+)'/)?.[1];
  assert.ok(footnote, 'expected the third slide to declare a footnote');

  for (const copy of [...titles, footnote]) {
    assert.match(
      flow,
      new RegExp(`^- assertVisible: '${escapeForRegExp(copy)}'$`, 'm'),
      `expected .maestro/first-run.yaml to assertVisible the screen's copy ("${copy}")`
    );
  }

  const skipLabel = screen.match(/<Pressable[\s\S]*?accessibilityLabel="([^"]+)"[\s\S]*?styles\.skip/)?.[1];
  assert.ok(skipLabel, 'expected the skip Pressable to declare an accessibilityLabel');

  const escapedSkipLabel = escapeForRegExp(skipLabel);
  assert.match(
    subflow,
    new RegExp(`visible: '${escapedSkipLabel}'`),
    `expected dismiss-first-run.yaml to guard on the skip control's accessibilityLabel ("${skipLabel}")`
  );
  assert.match(
    subflow,
    new RegExp(`tapOn: '${escapedSkipLabel}'`),
    `expected dismiss-first-run.yaml to tap the skip control by its accessibilityLabel ("${skipLabel}")`
  );

  // ENABLE_LEARNING_ROAD é true em todos os perfis do eas.json e por default, e a
  // HomeScreen clássica (única consumidora do card Day-0) nunca renderiza — a
  // ausência da chave @radiant/first_run_v1 é o único gatilho real da
  // apresentação. Sem clearState, o flow passaria vacuamente na segunda execução.
  assert.match(flow, /clearState: true/);
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
