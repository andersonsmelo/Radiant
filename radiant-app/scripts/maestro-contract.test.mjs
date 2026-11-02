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


// As chaves do Maestro que recebem um SELETOR — todas casam por regex de
// correspondência total, então todas carregam a mesma armadilha do `?`.
// `tapOn` fica de fora de propósito: dois flows usam regex intencional ali
// (`^Progresso(, tab.*)?$`), e proibir o `?` lá proibiria a regex.
const SELECTOR_KEYS = ['assertVisible', 'assertNotVisible', 'visible', 'notVisible'];

const UNESCAPED_QUESTION_MARK = /(?<!\\)\?/;


async function readAppFile(relativePath) {
  return readFile(path.join(appRoot, relativePath), 'utf8');
}


async function flowCommands(name) {
  const documents = parseAllDocuments(await readAppFile(`.maestro/${name}`));
  assert.equal(documents.length, 2, `${name}: expected metadata and commands`);
  assert.deepEqual(documents.flatMap((document) => document.errors), []);
  const commands = documents[1].toJS();
  assert.ok(Array.isArray(commands), `${name}: expected a command sequence`);
  return commands;
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





// Os atributos que tiram o glifo da árvore de acessibilidade, com o valor que
// cada um precisa ter no JSX. A guarda lê a AST desde a FILA 66 (2026-10-19):
// a versão de texto casava com a menção num comentário e continuava verde com o
// atributo fora do JSX, com `accessibilityElementsHidden={false}` e com o
// `{...props}` depois dos atributos.
const GLYPH_HIDING_ATTRIBUTES = {
  accessible: 'false',
  accessibilityElementsHidden: 'true',
  importantForAccessibility: 'no-hide-descendants',
};


// DecorativeIcon e icon-symbol SÃO os envoltórios autorizados da fonte de
// ícones: importam MaterialIcons de propósito e escondem o glifo. Todo outro
// componente renderiza por eles.
const ICON_FONT_WRAPPERS = new Set([
  'components/ui/icon-symbol.tsx',
  'src/components/ui/DecorativeIcon.tsx',
]);


function parseAppSource(relativePath, text) {
  return ts.createSourceFile(relativePath, text, ts.ScriptTarget.Latest, true,
    relativePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
}


// O valor estático de um atributo JSX: a forma curta vale 'true'; uma expressão
// que não é literal devolve undefined, porque não prova valor nenhum.
function staticJsxAttributeValue(attribute) {
  const initializer = attribute.initializer;
  if (!initializer) return 'true';
  if (ts.isStringLiteral(initializer)) return initializer.text;
  const expression = initializer.expression;
  if (expression?.kind === ts.SyntaxKind.TrueKeyword) return 'true';
  if (expression?.kind === ts.SyntaxKind.FalseKeyword) return 'false';
  if (expression && ts.isStringLiteralLike(expression)) return expression.text;
  return undefined;
}


// O elemento JSX que a função DecorativeIcon devolve, sem descer em funções
// aninhadas: o `return` de um callback interno não é o dela.
function decorativeIconElement(source) {
  const component = source.statements.find((node) =>
    ts.isFunctionDeclaration(node) && node.name?.text === 'DecorativeIcon');
  assert.ok(component?.body, 'DecorativeIcon must stay a function declaration');
  const returns = [];
  const visit = (node) => {
    if (ts.isFunctionLike(node)) return;
    if (ts.isReturnStatement(node)) returns.push(node);
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(component.body, visit);
  assert.equal(returns.length, 1, 'DecorativeIcon must have one return');
  let element = returns[0].expression;
  while (element && ts.isParenthesizedExpression(element)) element = element.expression;
  const opening = element && ts.isJsxElement(element) ? element.openingElement : element;
  assert.ok(opening && (ts.isJsxSelfClosingElement(opening) || ts.isJsxOpeningElement(opening)),
    'DecorativeIcon must return a JSX element');
  assert.equal(opening.tagName.getText(source), 'MaterialIcons', 'DecorativeIcon must render MaterialIcons');
  return opening;
}


// Os módulos da fonte de ícones que o arquivo traz por import, export-from,
// require() ou import(). Qualquer família de @expo/vector-icons desenha glifo
// de uso privado; o barril também. Comentário e texto não contam.
function iconFontModules(source) {
  const modules = [];
  const visit = (node) => {
    let specifier;
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) specifier = node.moduleSpecifier;
    else if (ts.isCallExpression(node)
      && (node.expression.kind === ts.SyntaxKind.ImportKeyword
        || ts.isIdentifier(node.expression) && node.expression.text === 'require')) {
      specifier = node.arguments[0];
    }
    if (specifier && ts.isStringLiteralLike(specifier)
      && /^@expo\/vector-icons(\/|$)/.test(specifier.text)) modules.push(specifier.text);
    ts.forEachChild(node, visit);
  };
  visit(source);
  return modules;
}


test('keeps icon glyphs out of the accessibility tree', async () => {
  // Icon fonts render private-use codepoints, so an exposed glyph is announced
  // as an unreadable character. DecorativeIcon hides them; importing the icon
  // font directly in a screen puts them back on the tree.
  const wrapperPath = 'src/components/ui/DecorativeIcon.tsx';
  const wrapper = parseAppSource(wrapperPath, await readAppFile(wrapperPath));
  const attributes = decorativeIconElement(wrapper).attributes.properties;
  // O último vence no JSX: um atributo antes do spread é sobrescrito por quem chama.
  const lastSpread = attributes.findLastIndex(ts.isJsxSpreadAttribute);
  for (const [name, expected] of Object.entries(GLYPH_HIDING_ATTRIBUTES)) {
    const index = attributes.findLastIndex((node) =>
      ts.isJsxAttribute(node) && node.name.getText(wrapper) === name);
    assert.notEqual(index, -1, `DecorativeIcon must pass ${name} to MaterialIcons`);
    assert.equal(staticJsxAttributeValue(attributes[index]), expected, `DecorativeIcon: ${name} must be ${expected}`);
    assert.ok(index > lastSpread, `DecorativeIcon: ${name} must come after {...props}, or a caller overrides it`);
  }

  // Varre as duas raízes de código do app inteiras. A versão anterior lia só
  // components, src/components, src/features e src/app, e um import em src/ui
  // passava (FILA 66). O defeito de 2026-07-28, ícone vazio e glifo no nome no
  // Android, morava em components/ui/icon-symbol.tsx, fora da varredura de então.
  const offenders = [];
  const wrappersSeen = [];
  for (const dir of ['components', 'src']) {
    for (const entry of await readdir(path.join(appRoot, dir), { recursive: true })) {
      if (!/\.tsx?$/.test(entry) || /\.test\.tsx?$/.test(entry)) continue;
      const relative = `${dir}/${entry}`;
      const modules = iconFontModules(parseAppSource(relative, await readAppFile(relative)));
      if (ICON_FONT_WRAPPERS.has(relative)) wrappersSeen.push([relative, modules]);
      else if (modules.length > 0) offenders.push(relative);
    }
  }

  // Validade da própria guarda: uma varredura que não alcançasse os envoltórios,
  // ou que não visse o import do DecorativeIcon, estaria cega, e não limpa.
  assert.deepEqual(wrappersSeen.map(([relative]) => relative).sort(), [...ICON_FONT_WRAPPERS].sort(),
    'the scan must reach both icon-font wrappers');
  assert.deepEqual(new Map(wrappersSeen).get(wrapperPath), ['@expo/vector-icons/MaterialIcons'],
    'the scan must see the import DecorativeIcon renders with');
  assert.deepEqual(offenders, [],
    `these files import the icon font directly instead of DecorativeIcon: ${offenders.join(', ')}`);
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

    // A proibição vale para TODO componente da trilha, sempre. O `(?<!-)` deixa
    // passar o caminho `ui/semantic-colors`, que é o papel escuro `galaxy` e não
    // o token claro; `colors` sozinho continua proibido.
    assert.doesNotMatch(
      source,
      /(?<!-)\bcolors\b/,
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

// These static checks and the empty-shell smoke cannot prove lesson behavior.
test('retired catalog exposes only the empty-shell smoke to Maestro discovery', async () => {
  assert.equal(JSON.parse(await readAppFile('src/data/curriculum-state.json')).state, 'retired');
  assert.deepEqual(await listMaestroFlows(), ['boot-to-home.yaml']);
  const config = parseAllDocuments(await readAppFile('.maestro/config.yaml'))[0].toJS();
  assert.deepEqual(config.flows, ['boot-to-home.yaml']);
  assert.equal(config.testOutputDir, '.maestro/artifacts');
  const metadata = parseAllDocuments(await readAppFile('.maestro/boot-to-home.yaml'))[0].toJS();
  assert.equal(metadata.appId, appId);
  const commands = await flowCommands('boot-to-home.yaml');
  assert.deepEqual(commands[0].launchApp.arguments, { radiantReduceMotion: '1' });
  assert.ok(commands.some(command => command.assertVisible?.id === 'journey-trail'));
  assert.ok(!commands.some(command => command.openLink || command.tapOn));
});

test('selector parser detects an unescaped question mark in synthetic commands', () => {
  assert.match(maestroSelectors('- assertNotVisible: Falhou?')[0].selector, UNESCAPED_QUESTION_MARK);
  assert.doesNotMatch(maestroSelectors(String.raw`- assertVisible: Falhou\?`)[0].selector, UNESCAPED_QUESTION_MARK);
});
