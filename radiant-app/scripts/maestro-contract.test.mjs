import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appId = 'com.ascendcreative.radiant';

// Os flows que rolam até um elemento. Lista explícita, e não varredura do
// diretório, porque um flow novo que role deve entrar aqui por decisão — é
// nesta lista que as duas regras de `scrollUntilVisible` pegam.
const MAESTRO_FLOWS_WITH_SCROLL = [
  'learning-critical-path.yaml',
  'offline-relaunch.yaml',
  'reward-locked.yaml',
  'reward-unlock.yaml',
  'store-capture.yaml',
  'student-checkpoint-no-duplicate-effect.yaml',
  'student-checkpoint-short-viewport.yaml',
];

// As chaves do Maestro que recebem um SELETOR — todas casam por regex de
// correspondência total, então todas carregam a mesma armadilha do `?`.
// `tapOn` fica de fora de propósito: dois flows usam regex intencional ali
// (`^Progresso(, tab.*)?$`), e proibir o `?` lá proibiria a regex.
const SELECTOR_KEYS = ['assertVisible', 'assertNotVisible', 'visible', 'notVisible'];
const UNESCAPED_QUESTION_MARK = /(?<!\\)\?/;

async function readAppFile(relativePath) {
  return readFile(path.join(appRoot, relativePath), 'utf8');
}

async function listMaestroFlows() {
  const entries = await readdir(path.join(appRoot, '.maestro'), { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.yaml') && entry.name !== 'config.yaml')
    .map((entry) => entry.name)
    .sort();
}

/**
 * Todos os seletores de um flow, com a linha em que aparecem. Varre o
 * diretório inteiro em vez de uma lista: um flow novo nasce coberto, e a
 * armadilha do `?` não espera decisão de ninguém para valer.
 */
function maestroSelectors(flow) {
  const found = [];

  flow.split('\n').forEach((line, index) => {
    if (/^\s*#/.test(line)) return;

    const match = line.match(/^\s*(?:- )?([A-Za-z]+):\s*(\S.*?)\s*$/);
    if (!match || !SELECTOR_KEYS.includes(match[1])) return;

    const raw = match[2];
    const selector = /^'.*'$/.test(raw) || /^".*"$/.test(raw) ? raw.slice(1, -1) : raw;

    found.push({ key: match[1], selector, line: index + 1 });
  });

  return found;
}

function unescapeSelector(selector) {
  return selector.replace(/\\(.)/g, '$1');
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

test('keeps the journey trail on the dark galaxy theme it renders inside', async () => {
  // Os componentes da trilha renderizam só dentro de JourneyHomeScreen, que é
  // tela escura. Importar o token claro `colors` faz um card branco com texto
  // escuro sobre o fundo escuro — o defeito exato corrigido em B2. A regra:
  // estes componentes usam `galaxyColors`, nunca o `colors` claro.
  //
  // A lista é DERIVADA do diretório desde 2026-08-21. Antes ela nomeava três
  // arquivos, e quando `JourneyMap` foi aposentado em favor de `JourneyTrail` o
  // contrato quebrou por ENOENT — que é o modo bom de falhar. O modo ruim é o
  // inverso: um componente novo entrar no diretório e nunca ser verificado
  // porque ninguém lembrou de acrescentá-lo aqui.
  const componentDir = 'src/features/journey/components';
  const files = (await readdir(path.join(appRoot, componentDir)))
    .filter((name) => name.endsWith('.tsx') && !name.endsWith('.test.tsx'))
    .map((name) => `${componentDir}/${name}`);

  assert.ok(files.length > 0, 'nenhum componente de trilha encontrado');

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

test('keeps active checkpoints confined to the dedicated internal profile', async () => {
  const eas = JSON.parse(await readAppFile('eas.json'));
  const internal = eas.build['checkpoint-internal'];

  assert.equal(internal?.extends, 'development');
  assert.equal(internal?.distribution, 'internal');
  assert.deepEqual(internal?.env, {
    EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE: 'active',
    EXPO_PUBLIC_STUDENT_CHECKPOINT_PERFORMANCE: 'true',
    SENTRY_DISABLE_AUTO_UPLOAD: 'true',
  });
  assert.deepEqual(eas.build['checkpoint-internal-simulator'], {
    extends: 'checkpoint-internal',
    ios: { simulator: true },
  });
  assert.equal(eas.build.production.env.EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE, 'off');
  assert.equal(eas.build.production.env.EXPO_PUBLIC_STUDENT_CHECKPOINT_PERFORMANCE, undefined);
  assert.equal(eas.build.preview.env.EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE, 'shadow');
  assert.equal(eas.build['e2e-test'].env.EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE, undefined);
});

test('keeps the active and baseline performance flows on the same cold-start and Home-to-Lesson path', async () => {
  const [active, baseline] = await Promise.all([
    readAppFile('.maestro/student-checkpoint-active-resume.yaml'),
    readAppFile('.maestro/student-checkpoint-performance-baseline.yaml'),
  ]);

  assert.match(active, /setAirplaneMode: enabled/);
  assert.match(active, /- killApp\n- launchApp/);
  assert.match(active, /- tapOn: Retomar estudo/);
  assert.match(active, /- tapOn: Continuar jornada\n- assertVisible: Fundamentos de Radiologia/);
  assert.doesNotMatch(baseline, /Retomar estudo|setAirplaneMode/);
  assert.match(baseline, /clearState: true/);
  assert.match(baseline, /- tapOn: Continuar jornada\n- assertVisible: Fundamentos de Radiologia/);
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
  //
  // Desde a correção de a11y do WelcomeSlide, o grupo de acessibilidade compõe
  // o rótulo como "Tela N de M. {título} {corpo}..." (ver WelcomeSlide.tsx):
  // o título nunca existe isolado no nó. Um `assertVisible` com o título cru
  // deixou de casar — o Maestro exige correspondência total — e passou a
  // "passar" vazio só porque o contrato lia o YAML, não o dispositivo. O
  // contrato agora exige o prefixo "Tela N de M" ancorado E proíbe
  // explicitamente o formato antigo, para que essa regressão não volte por um
  // caminho que ele não olha.
  const [screen, flow, subflow, defaultBlocks] = await Promise.all([
    readAppFile('src/features/first-run/screens/WelcomeFlowScreen.tsx'),
    readAppFile('.maestro/first-run.yaml'),
    readAppFile('.maestro/subflows/dismiss-first-run.yaml'),
    readAppFile('src/data/journey/defaultBlocks.ts'),
  ]);

  const escapeForRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const slidesBlock = screen.match(/const SLIDES: SlideSpec\[\] = \[([\s\S]*?)\n\];/)?.[1];
  assert.ok(slidesBlock, 'expected a SLIDES array in WelcomeFlowScreen.tsx');

  const titles = [...slidesBlock.matchAll(/title: '([^']+)'/g)].map((match) => match[1]);
  assert.ok(titles.length > 0, 'expected at least one slide title in SLIDES');

  const footnote = slidesBlock.match(/footnote:\s*\n\s*'([^']+)'/)?.[1];
  assert.ok(footnote, 'expected the third slide to declare a footnote');

  // N vem do próprio array, nunca de um literal cravado: um slide a mais ou a
  // menos em SLIDES não pode silenciosamente destravar este contrato.
  const slideCount = titles.length;

  titles.forEach((title, index) => {
    const step = index + 1;

    // O padrão precisa começar por "Tela {step} de {slideCount}\. " seguido do
    // título com os metacaracteres escapados, ancorado em `^` e fechado por
    // `.*$` — é o único jeito de casar contra o rótulo de grupo, que continua
    // com o corpo do slide depois do título.
    const expectedAssertion = `- assertVisible: '^Tela ${step} de ${slideCount}\\. ${escapeForRegExp(title)}.*$'`;
    assert.match(
      flow,
      new RegExp(`^${escapeForRegExp(expectedAssertion)}$`, 'm'),
      `expected .maestro/first-run.yaml to assertVisible slide ${step} anchored on "Tela ${step} de ${slideCount}. ${title}"`
    );

    // Formato antigo proibido explicitamente: o título sozinho, sem a âncora
    // "Tela N de M", é exatamente o padrão que passou a casar vácuo depois da
    // correção de a11y (o nó nunca mais expõe o título isolado). Só exigir o
    // formato novo, sem banir o antigo, deixaria a regressão voltar por um
    // caminho que este contrato não olha.
    const bareAssertion = `- assertVisible: '${title}'`;
    assert.doesNotMatch(
      flow,
      new RegExp(`^${escapeForRegExp(bareAssertion)}$`, 'm'),
      `first-run.yaml must not assertVisible the bare slide title "${title}" without the "Tela N de M" anchor`
    );
  });

  // O aviso legal é exigência da ficha da loja e mora no fim do rótulo da
  // tela 3: âncora só no fim (`.*` no começo, `$` no fim), separado da
  // asserção do título para falhar sozinho quando sumir.
  const expectedFootnoteAssertion = `- assertVisible: '.*${escapeForRegExp(footnote)}$'`;
  assert.match(
    flow,
    new RegExp(`^${escapeForRegExp(expectedFootnoteAssertion)}$`, 'm'),
    `expected .maestro/first-run.yaml to assertVisible the footnote anchored at the end ("${footnote}")`
  );

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

  // O flow antes terminava em "a apresentação sumiu" — um predicado que fica
  // verde tanto na Home quanto numa tela vazia. A primeira vitória precisa
  // provar o destino positivo, e a copy vem do bloco que a instalação limpa
  // realmente abre, não de um literal duplicado dentro deste teste.
  const firstLessonBlock = defaultBlocks.match(
    /id: 'block:lesson-1:intro',[\s\S]*?(?=\n    \},\n    \{\n        id: 'block:review:lesson-1')/
  )?.[0];
  assert.ok(firstLessonBlock, 'expected defaultBlocks.ts to declare block:lesson-1:intro');

  const firstLessonBody = firstLessonBlock.match(/body: '([^']+)'/)?.[1];
  assert.ok(firstLessonBody, 'expected the first lesson context step to declare a body');

  const destinationAssertion = `- assertVisible: '${firstLessonBody}'`;
  assert.match(
    flow,
    new RegExp(`^${escapeForRegExp(destinationAssertion)}$`, 'm'),
    'expected first-run.yaml to prove that Começar opens the first learning step'
  );
  assert.ok(
    flow.indexOf(destinationAssertion) > flow.indexOf("- tapOn: 'Começar'"),
    'the first learning-step assertion must happen after tapping Começar'
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

test('makes every scroll-until-visible wait for the screen it is about to scroll', async () => {
  // No Maestro, `assertVisible` É a espera. Dois `tapOn` seguidos emendando num
  // `scrollUntilVisible` fazem a rolagem começar antes de o passo existir na
  // árvore, e o scroll estoura o timeout procurando um elemento que ainda não
  // renderizou. No iOS isso nunca aparecia — a tela monta em ~0,1s. No Android,
  // ~5x mais lento, `offline-relaunch` falhou 2 de 2 em 2026-08-03 exatamente
  // aqui, enquanto `learning-critical-path`, que já intercalava as asserções,
  // passou no mesmo emulador e na mesma execução. O contrato prende a espera,
  // não o tempo: aumentar o timeout esconderia o defeito em vez de removê-lo.
  // `student-checkpoint-short-viewport.yaml` entrou nesta lista em 2026-08-10 e
  // traz uma consequencia medida da regra: numa viewport curta a ancora da
  // espera tem de ser o PRIMEIRO elemento da tela, nao qualquer um. Ancorada no
  // corpo do cartao, a espera reprovava em AX5 numa tela de 375x667 — o corpo
  // ja nasce abaixo da dobra ali — enquanto a tela funcionava e o CTA era
  // alcancavel rolando. A regra pede um `assertVisible` que espere a tela; o
  // elemento escolhido para isso precisa ser visivel ANTES de qualquer rolagem.
  for (const name of [
    'learning-critical-path.yaml',
    'offline-relaunch.yaml',
    'reward-unlock.yaml',
    'student-checkpoint-no-duplicate-effect.yaml',
    'student-checkpoint-short-viewport.yaml',
  ]) {
    const lines = (await readAppFile(`.maestro/${name}`)).split('\n');

    lines.forEach((line, index) => {
      if (!/^- scrollUntilVisible:/.test(line)) return;

      const previousCommand = lines
        .slice(0, index)
        .reverse()
        .find((candidate) => /^\S/.test(candidate) && !candidate.startsWith('#'));

      assert.match(
        previousCommand ?? '',
        /^- assertVisible:/,
        `${name}:${index + 1}: scrollUntilVisible must be preceded by an assertVisible — that assertion is what makes Maestro wait for the screen to render before scrolling`
      );
    });
  }
});

test('makes every scroll-until-visible state the visibility bar it is measured by', async () => {
  // O Maestro exige 100% de visibilidade por PADRÃO, e nenhum flow declarava
  // isso. Em 2026-08-06 o `reward-unlock` falhou no Android em
  // `lesson-option-…:estrutura-da-materia-e-nucleo-atomico:q1:option:0` com o
  // elemento na tela e clicável: um brilho decorativo — não clicável e com
  // `important-for-accessibility=false` — cobria ~11% dos bounds da opção, e a
  // régua herdada transformou 89% de visibilidade em reprovação. A sonda no
  // aparelho fechou o diagnóstico: `assertVisible` e `tapOn` do MESMO id
  // passaram, e o scroll passou com 80%.
  //
  // A regra aqui não é "aceite menos"; é "declare a régua". Um valor herdado
  // não é decisão de ninguém e some da revisão, e a diferença entre 100 e 89
  // decidiu uma execução de 15 minutos. Onde 100 passa, 100 fica escrito.
  for (const name of MAESTRO_FLOWS_WITH_SCROLL) {
    const lines = (await readAppFile(`.maestro/${name}`)).split('\n');

    lines.forEach((line, index) => {
      if (!/^- scrollUntilVisible:/.test(line)) return;

      const block = [];
      for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
        if (/^\S/.test(lines[cursor])) break;
        block.push(lines[cursor]);
      }

      assert.match(
        block.join('\n'),
        /^\s+visibilityPercentage:\s*\d+\s*$/m,
        `${name}:${index + 1}: scrollUntilVisible must declare visibilityPercentage — Maestro defaults to 100%, and an inherited bar is a decision nobody made until it fails on the platform where a decorative layer overlaps the target`
      );
    });
  }
});

test('never lets a scroll-until-visible hide behind a visibility guard', async () => {
  // `runFlow when notVisible: <id>` envolvendo um `scrollUntilVisible` já mordeu
  // duas vezes, em plataformas diferentes: o Maestro não modela OCLUSÃO, então o
  // elemento está na árvore e lê como "visível" para a guarda enquanto está por
  // baixo do CTA flutuante. A guarda pula a rolagem, o tap cai no botão errado, e
  // o flow para com o quiz em 0% selecionado — no iPhone 16 Plus em 2026-07-30
  // (segundo quiz, corrigido em f7b602a) e no iPhone 17 Pro em 2026-08-02/03
  // (primeiro quiz). O remédio nos dois casos foi um `- scroll` fixo: rolar além
  // do fim é no-op, então ele serve à tela que não rola E à que oclui, enquanto a
  // guarda só servia a uma.
  //
  // O contrato exige que todo `scrollUntilVisible` seja passo de topo. Aninhá-lo
  // sob qualquer condicional o traz de volta para dentro de uma guarda.
  // Atenção: isto NÃO proíbe `repeat ... while: notVisible` sobre os CTAs de
  // rodapé — esses são exigidos pelo teste de alcançabilidade acima e não
  // envolvem `scrollUntilVisible`.
  for (const name of [
    'learning-critical-path.yaml',
    'offline-relaunch.yaml',
    'store-capture.yaml',
    'rating-prompt.yaml',
    'reward-locked.yaml',
    'reward-unlock.yaml',
  ]) {
    const lines = (await readAppFile(`.maestro/${name}`)).split('\n');

    lines.forEach((line, index) => {
      if (!/scrollUntilVisible:/.test(line) || /^\s*#/.test(line)) return;

      assert.match(
        line,
        /^- scrollUntilVisible:/,
        `${name}:${index + 1}: scrollUntilVisible must be a top-level step, never nested under a conditional — a visibility guard cannot see occlusion, and that is exactly what it would be guarding against`
      );
    });
  }
});

test('ties the rating-prompt flow to the eligibility gate it exists to reach', async () => {
  // Este flow existe por um único motivo: alcançar o gate
  // `countEvents('app_open') >= MIN_APP_OPENS` do `RatingPromptService`, que
  // nenhum outro flow atinge — quatro abrem o app uma vez e o
  // `offline-relaunch`, duas. Se alguém subir o mínimo no serviço e o flow
  // continuar com o mesmo número de aberturas, ele passa a medir um gate que
  // não é mais o do produto, e passa verde enquanto o prompt fica bloqueado.
  // Por isso o número vem da fonte, nunca de um literal repetido aqui.
  const [service, flow] = await Promise.all([
    readAppFile('src/services/RatingPromptService.ts'),
    readAppFile('.maestro/rating-prompt.yaml'),
  ]);

  const minAppOpens = Number(service.match(/const MIN_APP_OPENS = (\d+);/)?.[1]);
  assert.ok(
    Number.isInteger(minAppOpens) && minAppOpens > 0,
    'expected RatingPromptService.ts to declare MIN_APP_OPENS'
  );

  assert.match(flow, new RegExp(`^appId: ${appId}$`, 'm'));

  const launches = flow.match(/^- launchApp\b/gm) ?? [];
  assert.ok(
    launches.length >= minAppOpens,
    `.maestro/rating-prompt.yaml must launch the app at least MIN_APP_OPENS (${minAppOpens}) times to reach eligibility; it launches ${launches.length}`
  );

  // Só a primeira abertura limpa o estado. As outras precisam preservá-lo — é o
  // estado que acumula a contagem, e um `clearState` a mais a zera sem que nada
  // falhe: o flow seguiria verde medindo um gate que nunca abriu.
  const clearingLaunches = flow.match(/clearState: true/g) ?? [];
  assert.equal(
    clearingLaunches.length,
    1,
    'rating-prompt.yaml must clear state exactly once — the later launches accumulate the app_open count'
  );

  // `maybePromptForReview` é chamado por `QuizScreen` (rota `/quiz`),
  // `ReviewScreen` e `RewardScreen` — nunca pelo lesson-flow da rota `/learn`.
  // A primeira versão deste flow completou a lição e passou verde sem tocar o
  // call site: a telemetria do aparelho não trouxe um único evento
  // `rating_prompt_*`. O contrato prende a rota, que é o que faz o flow medir
  // o que o nome dele diz.
  assert.match(
    flow,
    /radiantapp:\/\/quiz\?lessonId=/,
    'rating-prompt.yaml must drive the /quiz route — /learn never reaches maybePromptForReview'
  );

  // O gate exige `first_value_moment_reached`, emitido no primeiro
  // `quiz_complete`, e o `QuizScreen` retorna antes de chamar o prompt quando a
  // nota fica abaixo de PASSING_SCORE. Então o flow precisa **acertar**, e as
  // respostas certas vêm da fonte do conteúdo: editar `lessons.ts` sem editar o
  // flow tornaria a nota insuficiente e o vermelho se leria como falha do gate.
  const lessons = await readAppFile('src/data/lessons.ts');
  const lessonOne = lessons.slice(lessons.indexOf("id: 'lesson-1'"));
  const questionsBlock = lessonOne.slice(0, lessonOne.indexOf("id: 'lesson-2'"));

  const correctLabels = [];
  const questionRe = /options:\s*\[([\s\S]*?)\][\s\S]*?correctAnswerIndex:\s*(\d+)/g;
  let match;
  while ((match = questionRe.exec(questionsBlock)) !== null) {
    const labels = [...match[1].matchAll(/label:\s*'([^']+)'/g)].map((m) => m[1]);
    const correct = labels[Number(match[2])];
    if (correct) correctLabels.push(correct);
  }

  assert.ok(
    correctLabels.length >= 3,
    `expected to derive lesson-1 answers from lessons.ts; got ${correctLabels.length}`
  );

  for (const label of correctLabels) {
    assert.match(
      flow,
      new RegExp(`^- tapOn: ${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'm'),
      `rating-prompt.yaml must tap "${label}" — it is the answer lessons.ts marks correct, and a failing score skips the prompt entirely`
    );
  }

  // A prova do diálogo é do iOS e só dele. O AVD do projeto usa imagem
  // `google_apis`, sem Play Store, e mesmo com imagem de Play Store o in-app
  // review é no-op documentado para APK instalado por sideload. Uma asserção do
  // diálogo sem guarda de plataforma tornaria o Android vermelho por limite de
  // ambiente, que é a atribuição errada.
  for (const [index, line] of flow.split('\n').entries()) {
    const platform = line.match(/^\s*platform:\s*(\S+)/)?.[1];
    if (!platform) continue;

    assert.equal(
      platform,
      'iOS',
      `rating-prompt.yaml:${index + 1}: the store-review dialog is only observable on iOS here — platform guards in this flow must be iOS`
    );
  }
});

test('ties the locked-reward flow to the node id the app actually builds', async () => {
  // O flow alcança o nó de reward por deep link, e o id não é um literal
  // escolhido: ele é montado por `rewardNodeId()` sobre o slug da primeira
  // trilha do catálogo. Trocar o slug do catálogo, ou o formato do id, sem
  // trocar o flow produziria um deep link que não resolve — e `findReward`
  // cairia no fallback, que exige nó DESBLOQUEADO. O flow ficaria vermelho
  // dizendo "não achei a conquista", que é a atribuição errada.
  const [flow, definition, catalog] = await Promise.all([
    readAppFile('.maestro/reward-locked.yaml'),
    readAppFile('src/features/journey/services/JourneyDefinitionService.ts'),
    readAppFile('src/data/catalog.ts'),
  ]);

  const shape = definition.match(/return `node:reward:\$\{trackSegment\}:final`;/);
  assert.ok(shape, 'expected rewardNodeId to build `node:reward:<slug>:final`');

  const firstSlug = catalog.match(/"slug":\s*"([^"]+)"/)?.[1];
  assert.ok(firstSlug, 'expected catalog.ts to declare a first track slug');

  // `slugSegment` fica com o último segmento separado por hífen.
  const segment = firstSlug.split('-').filter(Boolean).pop() ?? firstSlug;
  const expected = encodeURIComponent(`node:reward:${segment}:final`);

  assert.match(
    flow,
    new RegExp(`radiantapp://reward\\?nodeId=${expected}`, 'i'),
    `reward-locked.yaml must deep-link the id the app builds today (node:reward:${segment}:final)`
  );

  // A ausência do botão é o que o flow existe para provar. Uma asserção
  // positiva a mais não substitui estas: sem elas o flow passaria mesmo que a
  // coleta voltasse a ser oferecida para um nó bloqueado.
  //
  // O contrato exige a PROPRIEDADE, não a linha: "este elemento carrega uma
  // asserção negativa, e ela está escapada corretamente". A versão anterior
  // congelava o literal — inclusive o `?` sem barra —, e por isso *exigia* a
  // forma quebrada: corrigir o flow deixava o contrato vermelho. Um contrato
  // que só aceita o texto de hoje não sobrevive à próxima correção; um que
  // aceita a propriedade sobrevive.
  const rewardScreen = await readAppFile('src/features/rewards/screens/RewardScreen.tsx');
  const collectLabel = rewardScreen.match(/: '(Receber conquista)'/)?.[1];
  const collectPrompt = rewardScreen.match(/: '(Pronto para coletar[^']+)'/)?.[1];
  assert.ok(
    collectLabel && collectPrompt,
    'expected RewardScreen to name both the collect button and the collect prompt'
  );

  const negatives = maestroSelectors(flow).filter((entry) => entry.key === 'assertNotVisible');

  for (const forbidden of [collectLabel, collectPrompt]) {
    const match = negatives.find((entry) => unescapeSelector(entry.selector) === forbidden);

    assert.ok(
      match,
      `reward-locked.yaml must assert "${forbidden}" is absent — that absence is the defect guard`
    );
    assert.doesNotMatch(
      match.selector,
      UNESCAPED_QUESTION_MARK,
      `reward-locked.yaml:${match.line}: the negative assertion for "${forbidden}" must escape its "?" — unescaped it can never match, so the guard passes forever, including when the element IS visible`
    );
  }
});

// Os dois literais do catálogo são gerados (JSON puro dentro de um `.ts`), então
// dá para lê-los sem transpilar. A anotação de tipo traz `[]` antes do `=`, e é
// por isso que a fatia ancora no `=` e não no primeiro colchete.
function sliceJsonLiteral(source, constName) {
  const start = source.indexOf(constName);
  assert.notEqual(start, -1, `expected catalog.ts to declare ${constName}`);

  const open = source.indexOf('[', source.indexOf('=', start));
  let depth = 0;

  for (let index = open; index < source.length; index += 1) {
    if (source[index] === '[') depth += 1;
    if (source[index] === ']') {
      depth -= 1;
      if (depth === 0) return JSON.parse(source.slice(open, index + 1));
    }
  }

  throw new Error(`could not slice ${constName} from catalog.ts`);
}

test('keeps the unlock-rule flow walking the whole track the catalog declares', async () => {
  // Este flow existe para provar a metade que o `reward-locked` declara não
  // provar: que a conquista abre DEPOIS da última lição, e não antes. Tudo que
  // ele afirma sai do tamanho da trilha, então o contrato precisa derivar esse
  // tamanho da mesma fonte que o app usa. Se alguém acrescentar uma lição ao
  // catálogo, o flow passa a descrever uma trilha que não existe — e sem este
  // teste isso só apareceria queimando uma janela de aparelho.
  const [flow, catalog, home, rewardScreen] = await Promise.all([
    readAppFile('.maestro/reward-unlock.yaml'),
    readAppFile('src/data/catalog.ts'),
    readAppFile('src/features/journey/screens/JourneyHomeScreen.tsx'),
    readAppFile('src/features/rewards/screens/RewardScreen.tsx'),
  ]);

  const tracks = sliceJsonLiteral(catalog, 'const WAVE1_TRACKS');
  const links = sliceJsonLiteral(catalog, 'const WAVE1_LESSON_LINKS');
  const track = tracks[0];
  const ordered = links
    .filter((link) => link.trackId === track.id)
    .sort((left, right) => left.order - right.order);
  const lessonCount = ordered.length;

  assert.ok(lessonCount >= 3, 'the unlock rule is only meaningful on a track with more than two lessons');

  // `buildUnit` cria um checkpoint para toda lição menos a última e um reward
  // no fim, então a unidade tem `2 * lessonCount` nós primários — é esse o
  // denominador que a tela mostra. O numerador antes da coleta é ele menos um.
  const totalPrimaryNodes = lessonCount * 2;

  assert.match(
    rewardScreen,
    /value=\{`\$\{completedPrimaryNodes\} de \$\{totalPrimaryNodes\} marcos da unidade concluídos`\}/,
    'RewardScreen must still render the milestone counter this flow anchors on'
  );

  for (const [completed, why] of [
    [totalPrimaryNodes - 1, 'antes da coleta: todas as lições e checkpoints, menos o próprio reward'],
    [totalPrimaryNodes, 'depois da coleta: é o que separa "o botão apareceu" de "a coleta gravou"'],
  ]) {
    assert.match(
      flow,
      new RegExp(`^- assertVisible: ${completed} de ${totalPrimaryNodes} marcos da unidade concluídos$`, 'm'),
      `reward-unlock.yaml must assert "${completed} de ${totalPrimaryNodes} marcos da unidade concluídos" — ${why}`
    );
  }

  // Uma lição a mais no catálogo é um checkpoint a mais no caminho. Contar os
  // toques é o que faz o flow acompanhar a trilha em vez de descrever a de
  // ontem — e é a checagem que fica vermelha primeiro quando o currículo cresce.
  const countSteps = (pattern) => (flow.match(pattern) ?? []).length;

  assert.equal(
    countSteps(/^- tapOn: Concluir e voltar$/gm),
    lessonCount,
    `reward-unlock.yaml must finish exactly ${lessonCount} lessons — one per lesson the catalog puts in "${track.id}"`
  );
  assert.equal(
    countSteps(/^- tapOn: Concluir checkpoint$/gm),
    lessonCount - 1,
    `reward-unlock.yaml must clear exactly ${lessonCount - 1} checkpoints — buildUnit creates one per lesson except the last`
  );

  // As lições geradas expõem o id da pergunta como `<lessonId>:qN`, então a
  // ordem dos testIDs no arquivo tem de ser a ordem do catálogo. Uma troca de
  // ordem no catálogo quebraria a cadeia de destravamento sem quebrar nenhuma
  // asserção de texto.
  const generatedLessonIds = ordered.map((link) => link.lessonId).filter((id) => id.startsWith('ai-lesson:'));
  let cursor = 0;

  for (const lessonId of generatedLessonIds) {
    const marker = `lesson-option-${lessonId}:q`;
    const at = flow.indexOf(marker, cursor);

    assert.notEqual(
      at,
      -1,
      `reward-unlock.yaml must answer "${lessonId}" in catalog order — expected "${marker}" after position ${cursor}`
    );
    cursor = at + marker.length;
  }

  // O rótulo do CTA é a regra falando: `continueLabel` só devolve este literal
  // quando o nó recomendado é do tipo reward, e o reward só é recomendado com
  // `requiresNodeIds: [node:<última lição>]` satisfeito. Pinado à fonte porque
  // um rótulo renomeado deixaria o flow verde tocando outro botão qualquer.
  const rewardLabel = home.match(/if \(nextNode\.type === 'reward'\) \{\s*return '([^']+)';/)?.[1];
  assert.ok(rewardLabel, 'expected JourneyHomeScreen.continueLabel to name the reward CTA');

  // O rótulo aparece duas vezes com papéis diferentes: primeiro é o CTA da home,
  // que só existe porque a regra foi satisfeita, e depois é o botão de coleta na
  // própria tela. Contar é o que separa os dois — uma asserção de presença fica
  // verde com qualquer um deles, e foi assim que uma mutação que removia a
  // chegada pela home passou despercebida ao escrever este teste.
  assert.equal(
    countSteps(new RegExp(`^- tapOn: ${rewardLabel}$`, 'gm')),
    2,
    `reward-unlock.yaml must tap "${rewardLabel}" twice: once as the home CTA that only appears when the rule is satisfied, once as the collect button on the reward screen`
  );

  // A guarda estrutural do flow. Alcançar o reward por deep link provaria de
  // novo o que o `reward-locked` já prova e deixaria a regra descoberta — sem
  // nada ficando vermelho, que é a forma cara de perder cobertura.
  //
  // Só os passos contam: o cabeçalho do flow cita o esquema justamente para
  // explicar por que ele não é usado, e uma guarda cega a comentários proibiria
  // o arquivo de dizer o que faz.
  const executableFlow = flow
    .split('\n')
    .filter((line) => !/^\s*#/.test(line))
    .join('\n');

  assert.doesNotMatch(
    executableFlow,
    /radiantapp:\/\/reward/,
    'reward-unlock.yaml must not deep-link the reward — arriving by the product path IS the assertion'
  );

  // O par: o mesmo `GalaxyStatRow`, o mesmo nó, os dois estados. Se um dia a
  // tela parar de distinguir, um dos dois flows fica vermelho.
  const lockedLabel = rewardScreen.match(/\? '(Bloqueada[^']+)'/)?.[1];
  const readyLabel = rewardScreen.match(/: '(Pronta para ser coletada)'/)?.[1];
  assert.ok(lockedLabel && readyLabel, 'expected RewardScreen to name both the locked and the collectable status');
  assert.match(
    flow,
    new RegExp(`^- assertVisible: ${readyLabel}$`, 'm'),
    `reward-unlock.yaml must assert "${readyLabel}" — the mirror of what reward-locked.yaml asserts about the same node`
  );

});

test('escapes every "?" in every selector of every flow', async () => {
  // O seletor do Maestro é regex de casamento total: um `?` sem barra torna a
  // letra anterior opcional e deixa o literal sem nada para casar, então a
  // asserção passa a descrever uma tela que não existe.
  //
  // A assimetria é o que torna isto caro: numa asserção POSITIVA a falha é
  // barulhenta — fica vermelha na primeira execução em aparelho. Numa
  // NEGATIVA ela é silenciosa e permanente: `assertNotVisible` com padrão
  // impossível passa sempre, inclusive quando o elemento está visível. Era
  // esse o caso de `reward-locked.yaml`, cuja metade do guarda-defeito não
  // podia falhar — e o contrato, congelando o literal, *exigia* a forma
  // quebrada.
  //
  // A varredura cobre o diretório inteiro e as quatro chaves de seletor, não
  // um flow e uma chave: a versão anterior olhava só `assertVisible` em
  // `reward-unlock.yaml`, e o defeito estava no arquivo ao lado.
  for (const name of await listMaestroFlows()) {
    const flow = await readAppFile(`.maestro/${name}`);

    for (const entry of maestroSelectors(flow)) {
      assert.doesNotMatch(
        entry.selector,
        UNESCAPED_QUESTION_MARK,
        `${name}:${entry.line}: escape the "?" in this ${entry.key} selector — Maestro selectors are full-match regexes, so an unescaped one silently changes what is being matched (on a negative assertion it can never fail)`
      );
    }
  }
});

test('keeps one visibility bar per selector across every flow', async () => {
  // Em 2026-08-06 o mesmo `lesson-option-q1:option:1`, na mesma tela, era
  // exigido a 100% por dois flows e a 80% por um terceiro — este último com o
  // comentário registrando que um brilho decorativo cobre ~11% dos bounds no
  // Android e que 100 custou uma execução de 15 minutos. Duas réguas para o
  // mesmo elemento não é tolerância a plataforma: é uma contradição que só se
  // manifesta queimando janela de aparelho, e o flow que perde é sorteado pela
  // ordem de execução.
  //
  // O contrato não escolhe o número — ele exige que só exista um. Quem medir
  // outro valor muda todos os lugares de uma vez, que é a revisão que a
  // divergência silenciosa nunca teve.
  const bars = new Map();

  for (const name of await listMaestroFlows()) {
    const lines = (await readAppFile(`.maestro/${name}`)).split('\n');

    lines.forEach((line, index) => {
      if (!/^- scrollUntilVisible:/.test(line)) return;

      const block = [];
      for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
        if (/^\S/.test(lines[cursor])) break;
        block.push(lines[cursor]);
      }

      const body = block.join('\n');
      const selector = body.match(/^\s+id:\s*'?([^'\n]+?)'?\s*$/m)?.[1];
      const percentage = body.match(/^\s+visibilityPercentage:\s*(\d+)\s*$/m)?.[1];

      if (!selector || !percentage) return;

      if (!bars.has(selector)) {
        bars.set(selector, []);
      }
      bars.get(selector).push({ name, line: index + 1, percentage });
    });
  }

  for (const [selector, occurrences] of bars) {
    const distinct = [...new Set(occurrences.map((entry) => entry.percentage))];

    assert.equal(
      distinct.length,
      1,
      `"${selector}" is scrolled to with ${distinct.join(' and ')} across ${occurrences
        .map((entry) => `${entry.name}:${entry.line} (${entry.percentage})`)
        .join(', ')} — the same element on the same screen must carry the same visibility bar in every flow`
    );
  }
});
