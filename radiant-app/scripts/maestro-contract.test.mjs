import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const { parseAllDocuments } = require('yaml');

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appId = 'com.ascendcreative.radiant';

// Os flows que rolam até um elemento. Lista explícita, e não varredura do
// diretório, porque um flow novo que role deve entrar aqui por decisão — é
// nesta lista que as duas regras de `scrollUntilVisible` pegam.
const MAESTRO_FLOWS_WITH_SCROLL = [
  // Rolam até o cabeçalho de Estude desde a trilha centralizada (2026-10-16).
  'boot-to-home.yaml',
  'rating-prompt.yaml',
  'student-checkpoint-active-resume.yaml',
  'student-checkpoint-performance-baseline.yaml',
  'learning-critical-path.yaml',
  'offline-relaunch.yaml',
  'reward-locked.yaml',
  'reward-unlock.yaml',
  'store-capture.yaml',
  'student-checkpoint-no-duplicate-effect.yaml',
  'student-checkpoint-short-viewport.yaml',
  'radiant-1-4-primeira-execucao.yaml',
  'radiant-1-4-segundo-dia.yaml',
  'radiant-1-4-vidas-esgotadas.yaml',
  // Rola até cada botão da sessão de revisão do G4 (FILA 59, 2026-10-18).
  'g4-native-evidence.yaml',
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

const NAVIGATION_FLOWS = [
  'boot-to-home.yaml',
  'rating-prompt.yaml',
  'reward-locked.yaml',
  'student-checkpoint-active-resume.yaml',
  'student-checkpoint-no-duplicate-effect.yaml',
  'student-checkpoint-performance-baseline.yaml',
];

async function flowCommands(name) {
  const documents = parseAllDocuments(await readAppFile(`.maestro/${name}`));
  assert.equal(documents.length, 2, `${name}: expected metadata and commands`);
  assert.deepEqual(documents.flatMap((document) => document.errors), []);
  const commands = documents[1].toJS();
  assert.ok(Array.isArray(commands), `${name}: expected a command sequence`);
  return commands;
}

for (const [name, status] of [
  ['reward-locked.yaml', 'Bloqueada até a unidade fechar'],
  ['reward-unlock.yaml', 'Pronta para ser coletada'],
]) {
  test(`${name} reaches the reward status through a bounded accessibility-label scroll`, async () => {
    const commands = await flowCommands(name);
    const screen = commands.findIndex(command => command?.assertVisible === 'Conquista da unidade');
    assert.ok(screen >= 0, `${name}: expected the reward screen assertion`);
    const statuses = commands.flatMap((command, index) => command?.assertVisible === status ? [index] : []);
    assert.equal(statuses.length, 1, `${name}: assert the actual reward status exactly once`);
    const index = statuses[0];
    assert.ok(index > screen, `${name}: check status after entering the reward screen`);
    // iOS exposes accessibilityText here, so the repeat condition uses the
    // same semantic selector as the assertion. A blind scroll or text-based
    // scrollUntilVisible cannot establish that this offscreen row was reached.
    assert.deepEqual(commands[index - 1]?.repeat, {
      times: 10,
      while: { notVisible: status },
      commands: ['scroll'],
    }, `${name}: reach the status label before asserting it on a short viewport`);
  });
}

test('navigation flows match the accessible journey header, not its hidden count', async () => {
  const source = ts.createSourceFile(
    'JourneyStageHeader.tsx',
    await readAppFile('src/features/journey/components/JourneyStageHeader.tsx'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const templates = [];
  const visit = (node) => {
    if (ts.isJsxAttribute(node) && node.name.getText(source) === 'accessibilityLabel') {
      const expression = node.initializer?.expression;
      if (expression && ts.isTemplateExpression(expression)) templates.push(expression);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  assert.equal(templates.length, 1, 'expected one accessible header template');
  const labels = [
    { title: 'Fundamentos de Radiologia', completed: 0, total: 8 },
    { title: 'Fundamentos de Radiologia', completed: 1, total: 8 },
    { title: 'Matéria, energia e radiação', completed: 8, total: 8 },
  ].map((values) => templates[0].head.text + templates[0].templateSpans.map((span) => {
    assert.ok(ts.isIdentifier(span.expression), 'header substitutions must be named values');
    assert.ok(Object.hasOwn(values, span.expression.text));
    return String(values[span.expression.text]) + span.literal.text;
  }).join(''));

  for (const name of NAVIGATION_FLOWS) {
    // This fixture explicitly requires a completed L1; other flows start at any progress.
    const reachableLabels = name === 'rating-prompt.yaml' ? [labels[1]] : labels;
    const selectors = (await flowCommands(name))
      .filter((command) => typeof command?.assertVisible === 'string'
        && command.assertVisible.startsWith('^') && command.assertVisible.includes(' de '))
      .map((command) => command.assertVisible);
    assert.ok(selectors.length > 0, `${name}: expected a journey header assertion`);
    for (const selector of selectors) {
      const pattern = new RegExp(selector);
      for (const label of reachableLabels) {
        assert.ok(pattern.test(label), `${name}: ${selector} does not match the accessible header "${label}"`);
      }
      for (const unrelated of ['0 de 8', 'Fundamentos de Radiologia', '10 XP', 'Tela 2 de 3. Boas-vindas']) {
        assert.ok(!pattern.test(unrelated), `${name}: ${selector} also matches another screen or the hidden count`);
      }
    }
  }
});

test('navigation flows wait for the dev client after every launch and relaunch', async () => {
  for (const name of [...NAVIGATION_FLOWS, 'student-checkpoint-short-viewport.yaml']) {
    const commands = await flowCommands(name);
    const launches = commands.flatMap((command, index) =>
      command === 'launchApp' || Object.hasOwn(command ?? {}, 'launchApp') ? [index] : []);
    assert.ok(launches.length > 0, `${name}: expected an app launch`);
    for (const index of launches) {
      assert.equal(commands[index + 1]?.runFlow, 'subflows/dismiss-dev-client.yaml',
        `${name}: wait for the dev client immediately after launch ${index}`);
    }
  }
});

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
  // O contrato de navegação acima compara os seletores com o rótulo acessível
  // real do cabeçalho, incluindo título e contagem no mesmo nó.
  assert.doesNotMatch(flows[0], /radiantapp:\/\/onboarding/);
  assert.match(flows[1], /lesson-option-q1:option:1/);
  // O caminho crítico termina no Perfil — que desde 2026-08-21 agrega o que eram
  // as abas Progresso e Missões. O nó de conquista só abre depois da ÚLTIMA lição
  // da trilha gerada pelo catálogo (7 lições), então ele não é alcançável num
  // smoke; afirmá-lo aqui codificaria um flow que não roda.
  //
  // O seletor da aba fica ancorado ao nome acessível dela nas duas plataformas
  // (iOS "Perfil, tab, 2 of 2", Android "Perfil"). Ancorado é obrigatório: um
  // `.*Perfil.*` solto casa com qualquer legenda que contenha a palavra — o
  // Maestro compara sem diferenciar caixa — e toca nela em vez da aba. Foi
  // assim que a versão com `.*Progresso.*` quebrou as duas plataformas em
  // 2026-07-28, e o literal só-iOS quebrou o Android.
  assert.match(flows[1], /- tapOn: '\^Perfil\(, tab\.\*\)\?\$'/);
  assert.match(flows[1], /- assertVisible: Desafios de hoje/);
  assert.doesNotMatch(flows[1], /Receber conquista/);
  // setAirplaneMode takes enabled/disabled; the boolean form fails to parse.
  assert.match(flows[2], /setAirplaneMode: enabled/);
  assert.match(flows[2], /setAirplaneMode: disabled/);
  assert.doesNotMatch(flows[2], /setAirplaneMode: (?:true|false)/);
});

test('centers the recommendation header action before each native tap', async () => {
  for (const name of ['learning-critical-path.yaml', 'reward-unlock.yaml']) {
    const commands = await flowCommands(name);
    const rewardScreen = commands.findIndex(command => command?.assertVisible === 'Conquista da unidade');
    const actions = commands.flatMap((command, index) =>
      (rewardScreen < 0 || index < rewardScreen)
      && ['Continuar jornada', 'Receber conquista'].includes(command?.tapOn) ? [index] : []);
    assert.equal(actions.length, name === 'reward-unlock.yaml' ? 7 : 1);
    for (const index of actions) {
      assertCenteredRecommendation(commands, index, `${name}: center the native button bounds immediately before its semantic tap`);
    }
  }
  const offline = await flowCommands('offline-relaunch.yaml');
  const index = offline.findIndex(command => command?.assertVisible === 'Continuar jornada');
  assert.ok(index > 0);
  assertCenteredRecommendation(offline, index, 'offline relaunch must expose the restored recommendation');
});

/**
 * O botão da recomendação centrado, e de volta se o centramento passou dele.
 * O `centerElement` do Maestro 2.7 dá UM deslize fixo quando o centro do
 * elemento está a mais de 1/5 da altura do centro da tela, e aceita onde ele
 * parar: com o botão um pouco abaixo da faixa central, o deslize o leva para
 * baixo do HUD, onde ele continua "visível" na árvore e o toque cai no HUD
 * (medido em 2026-10-18, `reward-unlock`, 3ª lição). A rolagem centrada para
 * cima, logo depois, não faz nada na faixa e desfaz o excesso fora dela.
 */
function assertCenteredRecommendation(commands, index, message) {
  const centered = (direction) => ({
    element: { id: 'journey-recommendation-action' }, direction,
    centerElement: true, visibilityPercentage: 100,
  });
  assert.deepEqual(commands[index - 3]?.scrollUntilVisible, centered('DOWN'), message);
  assert.deepEqual(commands[index - 2]?.assertVisible, { id: 'journey-recommendation-action' },
    `${message} — the scroll back waits for the button it is about to scroll`);
  assert.deepEqual(commands[index - 1]?.scrollUntilVisible, centered('UP'),
    `${message} — and scrolls it back from under the HUD when the centering swipe overshoots`);
}

async function recommendationActionLabels() {
  const source = ts.createSourceFile('JourneyRecommendationCard.tsx',
    await readAppFile('src/features/journey/components/JourneyRecommendationCard.tsx'),
    ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const nodes = [];
  const visit = node => { nodes.push(node); ts.forEachChild(node, visit); };
  visit(source);
  const copy = nodes.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'recommendationCopy');
  assert.ok(copy?.body, 'expected the recommendation copy function');
  const defaults = [];
  const findDefaults = node => {
    if (ts.isDefaultClause(node)) defaults.push(node);
    ts.forEachChild(node, findDefaults);
  };
  findDefaults(copy.body);
  assert.equal(defaults.length, 1);
  const returned = defaults[0].statements.find(ts.isReturnStatement)?.expression;
  assert.ok(returned && ts.isObjectLiteralExpression(returned));
  const action = returned.properties.find(node => ts.isPropertyAssignment(node) && node.name.getText(source) === 'action')?.initializer;
  assert.ok(action && ts.isConditionalExpression(action), 'default action distinguishes resume from the next lesson');
  assert.ok(ts.isStringLiteral(action.whenFalse));
  const lessonLabel = action.whenFalse.text;
  const button = nodes.find(node => ts.isJsxSelfClosingElement(node) && node.tagName.getText(source) === 'AppButton');
  assert.ok(button, 'expected the actual rendered recommendation button');
  for (const name of ['label', 'accessibilityLabel']) {
    const attribute = button.attributes.properties.find(node => ts.isJsxAttribute(node) && node.name.getText(source) === name);
    assert.equal(attribute?.initializer?.expression?.getText(source), 'copy.action', `${name} must use the computed action`);
  }
  const rewardCase = nodes.find(node => ts.isCaseClause(node) && ts.isStringLiteral(node.expression) && node.expression.text === 'reward');
  const rewardReturn = rewardCase?.statements.find(ts.isReturnStatement)?.expression;
  assert.ok(rewardReturn && ts.isObjectLiteralExpression(rewardReturn));
  const rewardAction = rewardReturn.properties.find(node => ts.isPropertyAssignment(node) && node.name.getText(source) === 'action')?.initializer;
  assert.ok(rewardAction && ts.isStringLiteral(rewardAction));
  return { lessonLabel, rewardLabel: rewardAction.text };
}

test('keeps the critical path walking lesson to lesson on the CTA the home renders for a lesson', async () => {
  const { lessonLabel } = await recommendationActionLabels();
  assert.equal(lessonLabel, 'Continuar jornada');
  const commands = await flowCommands('learning-critical-path.yaml');
  assert.ok(commands.some(command => command?.tapOn === lessonLabel));
  assert.doesNotMatch(JSON.stringify(commands), /checkpoint|CONQUISTA DESBLOQUEADA/i,
    'critical path must reach lesson 2 without a catalog checkpoint');
});

test('native learning flows confirm selected multiple-choice answers with the explicit action', async () => {
  for (const [name, expected] of [['learning-critical-path.yaml', 6], ['offline-relaunch.yaml', 3], ['reward-unlock.yaml', 16]]) {
    const commands = await flowCommands(name);
    const choices = commands.flatMap((command, index) =>
      command?.tapOn?.id?.startsWith('lesson-option-') ? [index] : []);
    assert.equal(choices.length, expected, `${name}: preserve every answer in the path`);
    for (const index of choices) {
      assert.equal(commands[index + 1]?.tapOn, 'Conferir resposta', `${name}: confirm the selected answer explicitly`);
    }
  }
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

    // A proibição vale para TODO componente da trilha, sempre.
    assert.doesNotMatch(
      source,
      /\bcolors\b/,
      `${file} must not use the light \`colors\` theme inside the dark journey screen`
    );

    // A exigência só faz sentido para quem declara cor. Um componente que só
    // compõe filhos e delega toda a cor a eles — como o `JourneyTrail` virou em
    // 2026-08-21 — não tem o que tematizar, e obrigá-lo a importar o token
    // produziria um import morto só para satisfazer o contrato.
    const declaresColor = /(?:^|\s)(?:background|border)?[Cc]olor:/u.test(source);
    if (!declaresColor) continue;

    assert.match(source, /\bgalaxyColors\b/, `${file} declara cor e deve tematizar com galaxyColors`);
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

// Sem a variável, a fase do Xcode tenta enviar os source maps ao Sentry e a
// build reprova por falta de organização. Foi o que derrubou a primeira build
// `development` da 1.4 no EAS, em 2026-09-24: o perfil nunca tinha compilado lá
// depois da entrada do Sentry, e só `preview`, `production` e
// `checkpoint-internal` desligavam o envio.
test('every EAS build profile disables the Sentry source map upload, inheritance resolved', async () => {
  const eas = JSON.parse(await readAppFile('eas.json'));
  const resolveEnv = (name) => {
    const profile = eas.build[name];
    return { ...(profile.extends ? resolveEnv(profile.extends) : {}), ...(profile.env ?? {}) };
  };

  const missing = Object.keys(eas.build).filter(
    (name) => resolveEnv(name).SENTRY_DISABLE_AUTO_UPLOAD !== 'true',
  );

  assert.deepEqual(missing, []);
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
  assert.match(source, /accessibilityState=\{\{ selected, disabled: submitted \}\}/);
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
    'radiant-1-4-primeira-execucao.yaml',
    'radiant-1-4-segundo-dia.yaml',
    'radiant-1-4-vidas-esgotadas.yaml',
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
    'radiant-1-4-primeira-execucao.yaml',
    'radiant-1-4-segundo-dia.yaml',
    'radiant-1-4-vidas-esgotadas.yaml',
    'g4-native-evidence.yaml',
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

test('rating flow completes the current review caller and preserves the native dialog', async () => {
  const commands = await flowCommands('rating-prompt.yaml');
  const review = commands.findIndex(command => command.openLink?.link === 'radiantapp://review');
  assert.ok(review >= 0);
  const taps = commands.slice(review).filter(command => command.tapOn).map(command => command.tapOn);
  assert.deepEqual(taps, ['Começar revisão', { id: 'review-option-0' }, 'Confirmar resposta', 'Continuar']);
  const dialog = commands.find(command => command.runFlow?.when?.platform === 'iOS');
  assert.deepEqual(dialog.runFlow.commands[0], { assertVisible: 'Curtindo o app Radiant\\?' });
  assert.deepEqual(commands.at(-1), { assertVisible: 'Resultado da sessão' });
});

test('preserves rating eligibility prerequisites and the native dialog assertion', async () => {
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

  const commands = await flowCommands('rating-prompt.yaml');
  assert.ok(commands.every(command => !command.launchApp?.clearState),
    'the prepared lesson/due-card fixture must survive every launch');
  assert.equal(commands.filter(command => command === 'killApp').length, minAppOpens,
    'every counted launch must be a real new process');
  assert.ok(commands.some(command => command.openLink?.link === 'radiantapp://review'));
  assert.ok(commands.every(command => !command.openLink?.link?.includes('/quiz')));
  assert.ok(commands.some(command => command.assertVisible === '^.+\\. 1 de \\d+ etapas concluídas\\.$'),
    'require actual lesson completion before the store review route');

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
  const [flow, catalog, rewardScreen] = await Promise.all([
    readAppFile('.maestro/reward-unlock.yaml'),
    readAppFile('src/data/catalog.ts'),
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

  // `buildUnit` cria uma lição por entrada do catálogo e um reward no fim, sem
  // checkpoint entre as lições desde a ADR de 2026-09-28, então a unidade tem
  // `lessonCount + 1` nós primários — é esse o denominador que a tela mostra.
  // O numerador antes da coleta é ele menos um. (Até a ADR eram
  // `2 * lessonCount`, com um checkpoint para toda lição menos a última.)
  const totalPrimaryNodes = lessonCount + 1;

  assert.match(
    rewardScreen,
    /value=\{`\$\{completedPrimaryNodes\} de \$\{totalPrimaryNodes\} marcos da unidade concluídos`\}/,
    'RewardScreen must still render the milestone counter this flow anchors on'
  );

  for (const [completed, why] of [
    [totalPrimaryNodes - 1, 'antes da coleta: todas as lições, menos o próprio reward'],
    [totalPrimaryNodes, 'depois da coleta: é o que separa "o botão apareceu" de "a coleta gravou"'],
  ]) {
    assert.match(
      flow,
      new RegExp(`^- assertVisible: ${completed} de ${totalPrimaryNodes} marcos da unidade concluídos$`, 'm'),
      `reward-unlock.yaml must assert "${completed} de ${totalPrimaryNodes} marcos da unidade concluídos" — ${why}`
    );
  }

  // Uma lição a mais no catálogo é uma passagem a mais pela home. Contar os
  // toques é o que faz o flow acompanhar a trilha em vez de descrever a de
  // ontem — e é a checagem que fica vermelha primeiro quando o currículo cresce.
  const countSteps = (pattern) => (flow.match(pattern) ?? []).length;
  const { lessonLabel } = await recommendationActionLabels();

  assert.equal(
    countSteps(/^- tapOn: Concluir e voltar$/gm),
    lessonCount,
    `reward-unlock.yaml must finish exactly ${lessonCount} lessons — one per lesson the catalog puts in "${track.id}"`
  );
  assert.equal(
    countSteps(new RegExp(`^- tapOn: ${lessonLabel}$`, 'gm')),
    lessonCount - 1,
    `reward-unlock.yaml must reach each lesson after the first through the home CTA "${lessonLabel}" — ${lessonCount - 1} times`
  );
  assert.equal(
    countSteps(/^- tapOn: .*checkpoint.*$/gim),
    0,
    'reward-unlock.yaml must not tap a catalog checkpoint — buildUnit no longer creates one (ADR de 2026-09-28)'
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

  // O card nomeia a ação de reward pelo tipo real; a jornada só recomenda esse nó
  // quando o nó recomendado é do tipo reward, e o reward só é recomendado com
  // `requiresNodeIds: [node:<última lição>]` satisfeito. Pinado à fonte porque
  // um rótulo renomeado deixaria o flow verde tocando outro botão qualquer.
  const { rewardLabel } = await recommendationActionLabels();

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

test('ties the three 1.4 golden paths to the rules and copy they exist to exercise', async () => {
  // Spec 1.4 (2026-09-14), §8, item 6: três caminhos dourados em E2E. Até
  // 2026-09-24 nenhum deles existia, e o plano previa `.maestro/radiant-1-4-*`.
  // Cada flow só prova alguma coisa enquanto afirmar o que a tela renderiza e
  // enquanto o caminho que ele percorre for o que a regra do app descreve — por
  // isso cada literal abaixo é lido da fonte, nunca repetido aqui.
  const GOLDEN = [
    'radiant-1-4-primeira-execucao.yaml',
    'radiant-1-4-segundo-dia.yaml',
    'radiant-1-4-vidas-esgotadas.yaml',
  ];
  const escapeForRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const topLevel = (flow) => flow.split('\n').filter((line) => /^- /.test(line));

  // Exatamente os três da spec: um quarto sem decisão, ou um a menos, reprova.
  const present = (await listMaestroFlows()).filter((name) => name.startsWith('radiant-1-4-'));
  assert.deepEqual(present, GOLDEN, 'the 1.4 golden paths are exactly the three of spec §8 item 6');

  const [first, second, hearts, summary, card, sheet, heartsService, lessons, blocks, hud] = await Promise.all([
    ...GOLDEN.map((name) => readAppFile(`.maestro/${name}`)),
    readAppFile('src/features/quiz/components/LessonSummary.tsx'),
    readAppFile('src/features/journey/components/JourneyNodeCard.tsx'),
    readAppFile('src/features/hearts/components/HeartsSheet.tsx'),
    readAppFile('src/features/hearts/HeartsService.ts'),
    readAppFile('src/data/lessons.ts'),
    readAppFile('src/data/journey/defaultBlocks.ts'),
    readAppFile('src/ui/components/HUD.tsx'),
  ]);

  // O dev client sobe o launcher ou a folha dele DEPOIS de um `runFlow when`
  // avaliado uma vez só (medido em 2026-09-24): a espera explícita do subflow
  // tem de ser o passo seguinte ao launch, em todos os três.
  for (const [name, flow] of [[GOLDEN[0], first], [GOLDEN[1], second], [GOLDEN[2], hearts]]) {
    const steps = topLevel(flow);
    const launch = steps.findIndex((line) => line.startsWith('- launchApp:'));
    assert.ok(launch >= 0, `${name}: expected a launchApp step`);
    assert.equal(
      steps[launch + 1],
      '- runFlow: subflows/dismiss-dev-client.yaml',
      `${name}: the dev-client wait must run right after launchApp — a one-shot "when visible" guard races the dev client`
    );
  }

  // Caminho 1 — instalação limpa até a L1 concluída, na copy da conclusão.
  assert.match(first, /^\s+clearState: true$/m, 'path 1 is a first run, so it must start from a clean install');
  const subtitle = summary.match(/<Text style=\{styles\.subtitle\}>([^<]+)<\/Text>/)?.[1];
  assert.ok(subtitle, 'expected LessonSummary to render a subtitle');
  assert.match(first, new RegExp(`^- assertVisible: ${escapeForRegExp(subtitle)}$`, 'm'));
  assert.match(summary, /`Próxima revisão em \$\{nextReviewInDays\} \$\{nextReviewInDays === 1 \? 'dia' : 'dias'\}`/);
  // Sem o número: o texto arredonda para cima a diferença entre dois relógios
  // e já disse "2 dias" para 24 h + 1 ms (medido em 2026-09-24, defeito na FILA).
  assert.match(first, /^- assertVisible: '\^Próxima revisão em \\d\+ \(dia\|dias\)\$'$/m);
  const reviewTitle = blocks.match(/eyebrow: 'Revisão',\s*title: `Revisar \$\{lesson1\.title\}`/);
  assert.ok(reviewTitle, 'expected the lesson-1 review block to be titled "Revisar ${lesson1.title}"');
  assert.match(card, /default:\s*return 'Bloqueado';/);
  // O fim do caminho 1 é o dia 1 do caminho 2: a revisão agendada e fechada.
  assert.ok((await flowCommands('radiant-1-4-primeira-execucao.yaml')).some(command => typeof command.assertVisible === 'string' && new RegExp(command.assertVisible).test('Revisar Fundamentos de Radiologia. Disponível em 15/10/2026 às 08:00.')), 'scheduled review must display its availability date');

  // Caminho 2 — relógio real. Sem clearState, e a revisão devida é a PRIMEIRA
  // coisa afirmada, antes de qualquer toque: rodado antes das 24 h, ele reprova
  // ali em vez de passar vazio.
  // Só a CHAVE conta: o comentário do flow explica o clearState e não pode
  // nem satisfazer nem reprovar esta guarda.
  assert.doesNotMatch(second, /^\s+clearState:/m, 'path 2 starts from the state path 1 left one day earlier; clearing it makes day 2 unreachable');
  const dueCopy = card.match(/return `(Revisão devida · )\$\{dueReviewCount\}/)?.[1];
  assert.ok(dueCopy, 'expected JourneyNodeCard to announce a due review');
  const secondSteps = topLevel(second);
  const firstAssertion = secondSteps.find((line) => line.startsWith('- assertVisible:'));
  const firstTap = secondSteps.findIndex((line) => line.startsWith('- tapOn:'));
  assert.ok(
    firstAssertion?.includes(`Revisar Fundamentos de Radiologia\\. ${dueCopy}`),
    'path 2 must assert the due-review recommendation first'
  );
  assert.ok(
    secondSteps.indexOf(firstAssertion) < firstTap,
    'path 2 must assert the due review before it taps anything'
  );

  // Caminho 3 — as vidas acabam errando, sem atalho: um toque errado por vida.
  const maxHearts = Number(heartsService.match(/export const MAX_HEARTS = (\d+);/)?.[1]);
  assert.ok(maxHearts > 0, 'expected HeartsService to export MAX_HEARTS');
  const q1 = lessons.match(/id: 'q1',[\s\S]*?correctAnswerIndex: (\d+),/);
  assert.ok(q1, 'expected lesson q1 to declare its correct answer');
  const q1Correct = Number(q1[1]);
  const heartCommands = await flowCommands(GOLDEN[2]);
  const taps = heartCommands.flatMap(command => command?.tapOn?.id?.startsWith('lesson-option-q1:option:')
    ? [Number(command.tapOn.id.split(':option:')[1])] : []);
  // Cada vida custa um primeiro contato grátis e um retorno errado. Depois, sem
  // vidas, uma sessão a mais erra o primeiro contato e é barrada no retorno.
  assert.equal(taps.length, maxHearts * 2 + 2, 'first contact and one retry per heart, then the blocked session');
  for (const option of taps) {
    assert.ok(Number.isInteger(option) && option >= 0 && option < 4, 'valid answer option');
    assert.notEqual(option, q1Correct, 'both q1 attempts are wrong');
  }
  // O retorno barrado não mostra feedback: a folha toma o lugar dele.
  assert.equal(heartCommands.filter(command => command.assertVisible === 'Vamos reforçar').length, maxHearts * 2 + 1);
  const emptyTitle = sheet.match(/snapshot\.count === 0 \? '([^']+)'/)?.[1];
  assert.ok(emptyTitle, 'expected HeartsSheet to title the empty state');
  const sheetAt = hearts.indexOf(`- assertVisible: ${emptyTitle}`);
  const lastTapAt = hearts.lastIndexOf("id: 'lesson-option-q1:option:");
  assert.ok(sheetAt > lastTapAt, 'the empty-hearts sheet must be asserted after the last wrong answer');
  // A folha é modal: o HUD de trás sai da árvore enquanto ela está aberta, então
  // as vidas zeradas só são afirmáveis depois de fechá-la.
  // Na trilha o HUD é botão e o rótulo soma o prazo da recarga (`HUD.tsx`).
  assert.match(hud, /`\$\{visibleHearts\} de \$\{maxHearts\} vidas\$\{minutes === null \? '' : `; próxima em \$\{minutes\} minutos`\}`/);
  const closeAt = hearts.indexOf('- tapOn: Voltar', sheetAt);
  const zeroAt = hearts.indexOf(`- assertVisible: '^0 de ${maxHearts} vidas; próxima em \\d+ minutos$'`);
  assert.ok(
    zeroAt >= 0,
    'on the trail the hearts HUD is a button whose label adds the refill ETA — assert "0 de N vidas; próxima em … minutos", not the bare count'
  );
  assert.ok(closeAt > sheetAt && zeroAt > closeAt, 'assert the emptied hearts only after the modal sheet is closed');

  // Defeito 1 do E2E (ADR de 2026-09-25, opção A; FILA, 16): a L1 concluída,
  // reaberta e abandonada pela folha, voltava como retomável, com o cabeçalho em
  // "0 de N". Depois da folha, o caminho 3 afirma o estado certo — a L1 concluída
  // e o cabeçalho contando a etapa —, e não mais um padrão que casa com os dois.
  const completedCopy = card.match(/case 'completed':\s*return '([^']+)';/)?.[1];
  assert.ok(completedCopy, 'expected JourneyNodeCard to label the completed status');
  const stageHeader = await readAppFile('src/features/journey/components/JourneyStageHeader.tsx');
  assert.match(stageHeader, /accessibilityLabel=\{`\$\{title\}\. \$\{completed\} de \$\{total\} etapas concluídas\.`\}/);
  const afterSheet = hearts.slice(closeAt);
  assert.ok(
    afterSheet.includes(`- assertVisible: '^Fundamentos de Radiologia\\. ${completedCopy}\\.$'`),
    `after the hearts sheet closes, path 3 must assert L1 still "${completedCopy}"`
  );
  assert.ok(
    afterSheet.includes("- assertVisible: '^Fundamentos de Radiologia\\. 1 de \\d+ etapas concluídas\\.$'"),
    'after the hearts sheet closes, path 3 must assert the stage header counting L1 ("1 de N")'
  );
  assert.ok(
    !afterSheet.includes('\\. \\d+ de \\d+ etapas concluídas'),
    'a header pattern that matches "0 de N" as well as "1 de N" cannot tell defect 1 apart'
  );
});

async function hybridCatalogLessons() {
  const modules = await Promise.all(['lessons.ts', 'ai-lessons.ts'].map(async name => {
    const exports = {};
    const source = await readAppFile(`src/data/${name}`);
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
    Function('exports', compiled)(exports);
    return exports.LESSONS ?? exports.AI_LESSONS;
  }));
  return modules.flat();
}

const HYBRID_ANSWER_FLOWS = [
  'learning-critical-path.yaml', 'radiant-1-4-primeira-execucao.yaml',
  'radiant-1-4-vidas-esgotadas.yaml', 'offline-relaunch.yaml',
  'radiant-1-4-segundo-dia.yaml', 'reward-unlock.yaml', 'store-capture.yaml',
  'student-checkpoint-no-duplicate-effect.yaml',
];

// ADR de 2026-10-18 (régua e última vida): a última vida perdida no último
// retorno conclui a lição; a folha só aparece antes de responder um retorno.
test('vidas-esgotadas: the last heart lost on the final retry completes the lesson; the next session pauses before the retry counts', async () => {
  const commands = await flowCommands('radiant-1-4-vidas-esgotadas.yaml');
  const lastHeart = commands.findIndex((command) => command?.assertVisible === '0 de 5 vidas');
  assert.ok(lastHeart > 0, 'the flow reaches zero hearts inside a lesson');
  assert.equal(commands[lastHeart + 1]?.tapOn, 'Concluir e voltar', 'the debit happens on the final retry');
  assert.equal(commands[lastHeart + 2]?.assertVisible, 'A lição foi concluída', 'losing the last heart still completes');
  const sheet = commands.findIndex((command) => command?.assertVisible === 'Suas vidas acabaram');
  assert.ok(sheet > lastHeart + 2, 'the hearts sheet comes in a later session');
  assert.equal(commands[sheet - 1]?.tapOn, 'Conferir resposta', 'the sheet blocks a retry confirmation');
  assert.match(String(commands[sheet - 2]?.tapOn?.id), /^lesson-option-/, 'a retry option was chosen before the block');
  const retryMarker = commands.slice(lastHeart + 2, sheet).findLastIndex((command) => command === 'Vamos tentar novamente'
    || command?.assertVisible === 'Vamos tentar novamente');
  assert.ok(retryMarker >= 0, 'the blocked item is a retry, not a first contact');
});

test('M1-M8 all eight lesson-answer flows exercise every catalog item and its inline feedback', async () => {
  const lessons = await hybridCatalogLessons();
  for (const name of HYBRID_ANSWER_FLOWS) {
    const commands = await flowCommands(name);
    let answered = [];
    let groups = 0;
    for (let index = 0; index < commands.length; index++) {
      const id = commands[index]?.tapOn?.id;
      if (id?.startsWith('lesson-option-')) {
        const itemId = id.slice('lesson-option-'.length).split(':option:')[0];
        answered.push(itemId);
        assert.equal(commands[index + 1]?.tapOn, 'Conferir resposta', `${name}: confirmation for ${itemId}`);
        // Só o roteiro de vidas pode encontrar a folha no lugar do feedback: sem
        // vidas, o retorno é barrado ao conferir, antes de a resposta contar.
        const blockedRetry = name === 'radiant-1-4-vidas-esgotadas.yaml'
          && commands[index + 2]?.assertVisible === 'Suas vidas acabaram';
        if (!blockedRetry) {
          assert.deepEqual(commands[index + 2]?.assertVisible, { id: 'lesson-item-feedback' }, `${name}: visible feedback for ${itemId}`);
        }
      }
      if (answered.length > 0 && (commands[index]?.tapOn === 'Concluir e voltar' || commands[index]?.assertVisible === 'Suas vidas acabaram')) {
        const lesson = lessons.find(entry => entry.questions.some(q => q.id === answered[0]));
        assert.ok(lesson, `${name}: each completed/paused session must answer a real lesson`);
        const expected = lesson.questions.map(q => q.id);
        assert.deepEqual(answered.slice(0, expected.length), expected, `${name}: all items in catalog order`);
        assert.equal(new Set(answered.slice(0, expected.length)).size, expected.length);
        if (name === 'radiant-1-4-segundo-dia.yaml') assert.deepEqual(answered, expected, 'review never repeats');
        else if (name !== 'radiant-1-4-vidas-esgotadas.yaml') assert.deepEqual(answered, expected, `${name}: correct path needs no retries`);
        else assert.deepEqual(answered, [...expected, expected[0]], 'only the wrong item returns once');
        answered = [];
        groups++;
      }
    }
    assert.ok(groups > 0, `${name}: at least one valid session is exercised`);
    assert.deepEqual(answered, [], `${name}: no incomplete answer sequence`);
  }
});

/**
 * As constantes exportadas de um módulo do app, lidas pela AST: a busca por
 * texto casaria também com a menção num comentário.
 */
async function exportedStringConstants(relativePath) {
  const source = ts.createSourceFile(relativePath, await readAppFile(relativePath),
    ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const constants = {};
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    if (!statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.initializer
        && ts.isStringLiteral(declaration.initializer)) {
        constants[declaration.name.text] = declaration.initializer.text;
      }
    }
  }
  return constants;
}

/** Todos os comandos de uma sequência, inclusive os aninhados em `runFlow`, `repeat` e `retry`. */
function everyCommand(commands) {
  return commands.flatMap((command) => {
    const nested = ['runFlow', 'repeat', 'retry']
      .map((key) => command?.[key]?.commands)
      .filter(Array.isArray);
    return [command, ...nested.flatMap(everyCommand)];
  });
}

// FILA 49 (E1). Com o fundo estrelado em laço infinito, a tela nunca assenta e
// o Maestro espera por ela a cada tentativa de rolagem: em 2026-10-16, 8 a 11 s
// por tentativa no `reward-unlock`. O argumento liga "Reduzir movimento" no app,
// e um processo lançado sem ele volta a animar. Por isso a regra vale para
// TODO lançamento, inclusive as reaberturas depois de `killApp`.
test('launches every flow with the launch argument that turns off decorative motion', async () => {
  const constants = await exportedStringConstants('src/ui/accessibility/motionLaunchArgument.ts');
  const key = constants.REDUCE_MOTION_LAUNCH_ARGUMENT;
  const value = constants.REDUCE_MOTION_LAUNCH_VALUE;
  assert.ok(key && value, 'expected motionLaunchArgument.ts to export the argument and its value');

  const flows = await listMaestroFlows();
  const subflows = (await readdir(path.join(appRoot, '.maestro/subflows')))
    .filter((name) => name.endsWith('.yaml'))
    .map((name) => `subflows/${name}`);
  let launches = 0;

  for (const name of [...flows, ...subflows]) {
    for (const command of everyCommand(await flowCommands(name))) {
      assert.notEqual(command, 'launchApp',
        `${name}: a bare launchApp starts the app without the ${key} argument`);
      if (!Object.hasOwn(command ?? {}, 'launchApp')) continue;
      launches += 1;
      const argument = command.launchApp?.arguments?.[key];
      assert.notEqual(argument, undefined, `${name}: launchApp must pass the ${key} argument`);
      // O Maestro 2.7 só põe o `-` antes da chave quando o valor não é
      // booleano; sem o `-`, o iOS não leva o argumento ao NSUserDefaults.
      assert.equal(typeof argument, 'string',
        `${name}: launchApp must pass ${key} as a quoted string — a boolean reaches iOS without the "-" and is ignored`);
      assert.equal(argument, value, `${name}: launchApp must pass ${key}: '${value}'`);
    }
  }

  // Validade: a regra acima passa vazia se nenhum lançamento for encontrado.
  assert.ok(launches >= flows.length, `expected at least one launch per flow, found ${launches}`);
});

// `openLink` com o app parado também lança o processo, e sem argumento nenhum.
test('never lets a deep link start the app the launch argument did not start', async () => {
  for (const name of await listMaestroFlows()) {
    let running = false;
    for (const command of await flowCommands(name)) {
      if (Object.hasOwn(command ?? {}, 'launchApp')) running = true;
      if (command === 'killApp' || command === 'stopApp'
        || Object.hasOwn(command ?? {}, 'killApp') || Object.hasOwn(command ?? {}, 'stopApp')) {
        running = false;
      }
      if (Object.hasOwn(command ?? {}, 'openLink')) {
        assert.ok(running, `${name}: openLink must follow a launchApp, or it starts the app without the argument`);
      }
    }
  }
});
