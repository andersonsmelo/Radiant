import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Contraste de texto é invisível em revisão de tela: um cinza claro "elegante"
// parece intencional e reprova WCAG. A auditoria de 2026-07-27 encontrou
// textTertiary reprovando em TODOS os seis contextos (2.34–2.64:1), inclusive
// para texto grande, nos dois modos. A regra vira teste porque nenhuma
// inspeção visual pega isso — só o cálculo pega.
//
// Critério: WCAG 2.1, texto normal >= 4.5:1.
const MIN_NORMAL_TEXT = 4.5;

function parseHex(value) {
  const hex = value.replace('#', '').trim();
  const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

function channelLuminance(channel) {
  const scaled = channel / 255;
  return scaled <= 0.03928 ? scaled / 12.92 : Math.pow((scaled + 0.055) / 1.055, 2.4);
}

function relativeLuminance([r, g, b]) {
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

function contrastRatio(foreground, background) {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)]
    .sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

// rgba translúcido não tem contraste próprio: precisa ser composto sobre o
// fundo real antes do cálculo. Compor sobre o fundo errado esconde a falha.
function compositeOver(foreground, alpha, background) {
  return foreground.map((channel, index) =>
    Math.round(channel * alpha + background[index] * (1 - alpha)),
  );
}

function parseColor(value, background) {
  const rgba = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/u);
  if (rgba) {
    const channels = [Number(rgba[1]), Number(rgba[2]), Number(rgba[3])];
    const alpha = rgba[4] === undefined ? 1 : Number(rgba[4]);
    return alpha === 1 ? channels : compositeOver(channels, alpha, background);
  }
  return parseHex(value);
}

async function readTheme() {
  const source = await readFile(path.join(appRoot, 'src/ui/theme.ts'), 'utf8');

  const read = (block, token) => {
    const blockMatch = source.match(new RegExp(`export const ${block} = \\{([\\s\\S]*?)\\n\\} as const;`, 'u'));
    assert.ok(blockMatch, `bloco ${block} não encontrado em theme.ts`);
    const tokenMatch = blockMatch[1].match(new RegExp(`\\n\\s*${token}:\\s*'([^']+)'`, 'u'));
    assert.ok(tokenMatch, `token ${block}.${token} não encontrado`);
    return tokenMatch[1];
  };

  return { read };
}

test('galaxy: todo texto informativo passa WCAG AA sobre fundo e superfície', async () => {
  const { read } = await readTheme();

  const background = parseHex(read('galaxyColors', 'background'));
  const surface = parseColor(read('galaxyColors', 'surface'), background);

  for (const token of ['textPrimary', 'textSecondary', 'textTertiary']) {
    const raw = read('galaxyColors', token);

    for (const [contextName, contextColor] of [['background', background], ['surface', surface]]) {
      const color = parseColor(raw, contextColor);
      const ratio = contrastRatio(color, contextColor);

      assert.ok(
        ratio >= MIN_NORMAL_TEXT,
        `galaxyColors.${token} (${raw}) sobre ${contextName}: ${ratio.toFixed(2)}:1, exigido ${MIN_NORMAL_TEXT}:1`,
      );
    }
  }
});

test('light: todo texto informativo passa WCAG AA sobre background e surface', async () => {
  const { read } = await readTheme();

  const background = parseHex(read('colors', 'background'));
  const surface = parseHex(read('colors', 'surface'));

  for (const token of ['textPrimary', 'textSecondary', 'textTertiary']) {
    const raw = read('colors', token);

    for (const [contextName, contextColor] of [['background', background], ['surface', surface]]) {
      const ratio = contrastRatio(parseColor(raw, contextColor), contextColor);

      assert.ok(
        ratio >= MIN_NORMAL_TEXT,
        `colors.${token} (${raw}) sobre ${contextName}: ${ratio.toFixed(2)}:1, exigido ${MIN_NORMAL_TEXT}:1`,
      );
    }
  }
});

test('light: cortes de status usados como texto passam WCAG AA', async () => {
  const { read } = await readTheme();
  const background = parseHex(read('colors', 'background'));

  for (const token of ['successText', 'warningText', 'dangerText']) {
    const raw = read('colors', token);
    const ratio = contrastRatio(parseColor(raw, background), background);

    assert.ok(
      ratio >= MIN_NORMAL_TEXT,
      `colors.${token} (${raw}) sobre background: ${ratio.toFixed(2)}:1, exigido ${MIN_NORMAL_TEXT}:1`,
    );
  }
});

test('os papéis de status do contexto light apontam para os cortes de texto', async () => {
  const source = await readFile(path.join(appRoot, 'src/ui/semantic-colors.ts'), 'utf8');
  const lightBlock = source.match(/light:\s*\{([\s\S]*?)\n\s{2}\},/u);
  assert.ok(lightBlock, 'bloco light não encontrado em semantic-colors.ts');

  // Os valores vivos (colors.success/warning/danger) reprovam AA como texto.
  // O contexto semântico descreve cor de TEXTO, então precisa dos cortes escuros.
  for (const [role, expected] of [
    ['statusSuccess', 'colors.successText'],
    ['statusWarning', 'colors.warningText'],
    ['statusError', 'colors.dangerText'],
  ]) {
    assert.match(
      lightBlock[1],
      new RegExp(`${role}:\\s*${expected.replace('.', '\\.')},`, 'u'),
      `semanticColors.light.${role} deveria usar ${expected}`,
    );
  }
});

// Medir token isolado não pega composição. Este contrato confirmava que
// `galaxyColors.textTertiary` passa sobre superfícies galaxy — e passou verde
// por seis execuções enquanto o selo da trilha ativa renderizava texto e fundo
// com o MESMO token (`galaxy.statusInformation`), 1,00:1, invisível na tela.
// A pergunta que o contrato não fazia é a única que importa: qual cor final
// sobre qual superfície final.
// **Repontado em 2026-08-21.** O caso media `JourneyTrackCard`, da prateleira de
// trilhas, aposentada junto com a Galáxia. O componente saiu; a classe de defeito
// não. Quem hoje desenha texto sobre o próprio preenchimento na trilha é a
// `JourneyLevelBand` — o marco de "próximo nível" que substituiu o cabeçalho de
// unidade. É lá que a medição de composição passa a morar.
test('a faixa de nível é legível sobre o próprio preenchimento', async () => {
  const [card, semantic, theme] = await Promise.all([
    readFile(path.join(appRoot, 'src/features/journey/components/JourneyLevelBand.tsx'), 'utf8'),
    readFile(path.join(appRoot, 'src/ui/semantic-colors.ts'), 'utf8'),
    readFile(path.join(appRoot, 'src/ui/theme.ts'), 'utf8'),
  ]);

  const readToken = (source, block, token) => {
    const blockMatch = source.match(new RegExp(`${block}:\\s*\\{([\\s\\S]*?)\\n\\s{2}\\}`, 'u'))
      ?? source.match(new RegExp(`export const ${block} = \\{([\\s\\S]*?)\\n\\} as const;`, 'u'));
    assert.ok(blockMatch, `bloco ${block} não encontrado`);
    // O valor pode ser `'rgba(255, 255, 255, 0.09)'`, que tem vírgulas dentro
    // das aspas: cortar na primeira vírgula devolve lixo.
    const tokenMatch = blockMatch[1].match(
      new RegExp(`\\n\\s*${token}:\\s*('[^']*'|[A-Za-z_$][\\w.$]*)`, 'u'),
    );
    assert.ok(tokenMatch, `token ${block}.${token} não encontrado`);
    return tokenMatch[1].trim();
  };

  // Resolve `galaxy.X`, `galaxyColors.X` ou literal até chegar numa cor.
  const resolve = (expression) => {
    let value = expression.trim();
    for (let hop = 0; hop < 4; hop += 1) {
      const quoted = value.match(/^'([^']+)'$/u);
      if (quoted) return quoted[1];
      const semanticRef = value.match(/^galaxy\.(\w+)$/u);
      if (semanticRef) { value = readToken(semantic, 'galaxy', semanticRef[1]); continue; }
      const themeRef = value.match(/^galaxyColors\.(\w+)$/u);
      if (themeRef) { value = readToken(theme, 'galaxyColors', themeRef[1]); continue; }
      break;
    }
    assert.fail(`não consegui resolver a cor a partir de "${expression}"`);
  };

  const readStyle = (name, property) => {
    const styleMatch = card.match(new RegExp(`\\n\\s{2}${name}:\\s*\\{([\\s\\S]*?)\\n\\s{2}\\},`, 'u'));
    assert.ok(styleMatch, `estilo ${name} não encontrado em JourneyLevelBand`);
    const propMatch = styleMatch[1].match(
      new RegExp(`${property}:\\s*('[^']*'|[A-Za-z_$][\\w.$]*)`, 'u'),
    );
    assert.ok(propMatch, `${name}.${property} não encontrado`);
    return resolve(propMatch[1]);
  };

  const base = parseHex(readToken(theme, 'galaxyColors', 'background').replace(/'/gu, ''));

  // A placa é translúcida sobre o fundo da tela: o par medido é o texto contra a
  // cor FINAL da placa, não contra o token que ela declara.
  const plate = parseColor(readStyle('plate', 'backgroundColor'), base);

  for (const [text, rotulo] of [
    ['eyebrow', 'sobrescrito da faixa'],
    ['title', 'nome da trilha seguinte'],
  ]) {
    const foreground = parseColor(readStyle(text, 'color'), plate);
    const ratio = contrastRatio(foreground, plate);

    // O sobrescrito é micro em peso 800 — abaixo dos 14px que a WCAG trata como
    // texto grande, então vale o critério de texto normal para os dois.
    assert.ok(
      ratio >= MIN_NORMAL_TEXT,
      `${rotulo}: ${text}.color sobre plate.backgroundColor rende ${ratio.toFixed(2)}:1, exigido ${MIN_NORMAL_TEXT}:1`,
    );
  }
});


// WCAG 2.1: elemento de interface não-textual e indicador de estado precisam de
// 3:1 contra o que está em volta. Foco e estado ativo não são decoração — são a
// única resposta a "onde eu estou".
const MIN_NON_TEXT = 3;

test('o indicador de foco do contexto galaxy é perceptível', async () => {
  const [semantic, theme] = await Promise.all([
    readFile(path.join(appRoot, 'src/ui/semantic-colors.ts'), 'utf8'),
    readFile(path.join(appRoot, 'src/ui/theme.ts'), 'utf8'),
  ]);

  const galaxyBlock = semantic.match(/galaxy:\s*\{([\s\S]*?)\n\s{2}\}/u);
  assert.ok(galaxyBlock, 'bloco galaxy não encontrado em semantic-colors.ts');
  const focusRef = galaxyBlock[1].match(/\n\s*borderFocus:\s*('[^']*'|[A-Za-z_$][\w.$]*)/u);
  assert.ok(focusRef, 'galaxy.borderFocus não encontrado');

  // Recortado no bloco galaxy: `colors` declara `surface` e `background` antes,
  // e uma busca no arquivo inteiro devolve a paleta CLARA sem avisar.
  const galaxySource = theme.slice(theme.indexOf('export const galaxyColors'));
  const readGalaxyToken = (token) => {
    const match = galaxySource.match(new RegExp(`\\n\\s*${token}:\\s*'([^']+)'`, 'u'));
    assert.ok(match, `galaxyColors.${token} não encontrado`);
    return match[1];
  };

  const raw = focusRef[1].startsWith("'")
    ? focusRef[1].slice(1, -1)
    : readGalaxyToken(focusRef[1].replace('galaxyColors.', ''));

  const background = parseHex(readGalaxyToken('background'));
  const surface = parseColor(readGalaxyToken('surface'), background);
  const focus = parseColor(raw, surface);
  const ratio = contrastRatio(focus, surface);

  // Antes: `galaxyColors.spine`, branco a 12% — abaixo do limiar de percepção.
  // Quem navega por teclado não via onde estava, e não havia canal alternativo.
  assert.ok(
    ratio >= MIN_NON_TEXT,
    `galaxy.borderFocus (${raw}) sobre a superfície: ${ratio.toFixed(2)}:1, exigido ${MIN_NON_TEXT}:1`,
  );
});

test('a barra de abas usa token do tema e distingue de fato o estado ativo', async () => {
  const [layout, theme] = await Promise.all([
    readFile(path.join(appRoot, 'src/app/(tabs)/_layout.tsx'), 'utf8'),
    readFile(path.join(appRoot, 'src/ui/theme.ts'), 'utf8'),
  ]);

  // Uma paleta declarada dentro do arquivo de tela é como `#2155FF` — primário
  // do tema CLARO — virou cor de aba ativa no tema escuro.
  const literais = layout.match(/'#[0-9a-fA-F]{3,8}'/gu) ?? [];
  assert.deepEqual(
    literais,
    [],
    `a barra de abas declara cor literal: ${literais.join(', ')} — as cores vivem em galaxyColors`,
  );

  // Recortado no bloco galaxy: `colors` declara `surface` e `background` antes,
  // e uma busca no arquivo inteiro devolve a paleta CLARA sem avisar.
  const galaxySource = theme.slice(theme.indexOf('export const galaxyColors'));
  const readGalaxyToken = (token) => {
    const match = galaxySource.match(new RegExp(`\\n\\s*${token}:\\s*'([^']+)'`, 'u'));
    assert.ok(match, `galaxyColors.${token} não encontrado`);
    return match[1];
  };

  const activeRef = layout.match(/tabBarActiveTintColor:\s*(?:galaxyColors\.)?(\w+)/u);
  assert.ok(activeRef, 'tabBarActiveTintColor não encontrado');

  const base = parseHex(readGalaxyToken('background'));
  const barra = parseColor(readGalaxyToken('tabBarSurface'), base);
  const ativo = parseColor(readGalaxyToken(activeRef[1]), barra);
  const ratio = contrastRatio(ativo, barra);

  // O rótulo da aba tem 11px: critério de texto normal.
  assert.ok(
    ratio >= MIN_NORMAL_TEXT,
    `a cor de aba ativa rende ${ratio.toFixed(2)}:1 sobre a barra, exigido ${MIN_NORMAL_TEXT}:1`,
  );

  const inactiveRef = layout.match(/tabBarInactiveTintColor:\s*(?:galaxyColors\.)?(\w+)/u);
  assert.ok(inactiveRef, 'tabBarInactiveTintColor não encontrado');
  const inativo = parseColor(readGalaxyToken(inactiveRef[1]), barra);
  const ratioInativo = contrastRatio(inativo, barra);

  assert.ok(
    ratioInativo >= MIN_NORMAL_TEXT,
    `a cor de aba inativa rende ${ratioInativo.toFixed(2)}:1 sobre a barra, exigido ${MIN_NORMAL_TEXT}:1`,
  );

  // Legibilidade não basta: se ativo e inativo tiverem luminância parecida, os
  // dois passam AA e mesmo assim não existe estado ativo. Era o caso — 3,56:1
  // contra 3,14:1, diferença de 13%, e a aba selecionada não parecia selecionada.
  const separacao = Math.max(ratio, ratioInativo) / Math.min(ratio, ratioInativo);
  assert.ok(
    separacao >= 1.3,
    `ativo (${ratio.toFixed(2)}:1) e inativo (${ratioInativo.toFixed(2)}:1) são próximos demais: ` +
      `${separacao.toFixed(2)}× de separação não produz estado ativo perceptível`,
  );
});

test('as duas moedas da gamificação não compartilham a mesma cor', async () => {
  const theme = await readFile(path.join(appRoot, 'src/ui/theme.ts'), 'utf8');

  const read = (token) => theme.match(new RegExp(`\\n\\s*${token}:\\s*'([^']+)'`, 'u'))?.[1];

  // XP e sequência são moedas distintas e o HUD as exibe lado a lado. Pintadas
  // do mesmo âmbar, a cor deixa de ser o segundo canal que distingue as duas.
  assert.notEqual(
    read('xpColor'),
    read('streakColor'),
    'xpColor e streakColor têm o mesmo valor — o HUD mostra duas moedas indistinguíveis',
  );
});

test('existe uma única escala tipográfica e ela usa a fonte da marca', async () => {
  const source = await readFile(path.join(appRoot, 'src/ui/styles.ts'), 'utf8');

  const typographyBlock = source.match(/export const typography = StyleSheet\.create\(\{([\s\S]*?)\n\}\);/u);
  assert.ok(typographyBlock, 'bloco typography não encontrado');

  // Cada papel declara a família: sem isso a Sora é carregada e nunca aparece,
  // que era o estado antes de 2026-07-28.
  const roles = typographyBlock[1].match(/^\s{4}([a-zA-Z0-9]+):\s*\{/gmu) ?? [];
  assert.ok(roles.length >= 7, `esperados ao menos 7 papéis, encontrados ${roles.length}`);

  const families = typographyBlock[1].match(/fontFamily:\s*'([^']+)'/gu) ?? [];
  assert.equal(
    families.length,
    roles.length,
    'todo papel de typography precisa declarar fontFamily',
  );
  for (const family of families) {
    assert.match(family, /Sora-/u, `família fora da marca: ${family}`);
  }

  // textStyles existia como segunda escala com tamanhos próprios. Deve derivar
  // de typography, nunca redeclarar fontSize.
  const textStylesBlock = source.match(/export const textStyles = \{([\s\S]*?)\n\};/u);
  assert.ok(textStylesBlock, 'bloco textStyles não encontrado');
  assert.doesNotMatch(
    textStylesBlock[1],
    /fontSize:/u,
    'textStyles não pode declarar tamanhos próprios — deve derivar de typography',
  );
});

test('keeps the system status bar legible against the surface the app actually paints', async () => {
  // Achado da C2 em 2026-08-03, no emulador API 36: relógio, Wi-Fi, sinal e
  // bateria estavam pretos sobre `#03030d`. Com `edgeToEdgeEnabled: true` o app
  // desenha atrás da barra do sistema, então o estilo do conteúdo dela é
  // responsabilidade do app — e estava em `dark`, que no `expo-status-bar`
  // significa conteúdo ESCURO, o valor para fundo CLARO. O defeito não era
  // intermitente: valia para toda tela, nas duas plataformas, e foi assado nos
  // seis screenshots publicáveis do Play, que o contrato de assets aprova
  // porque mede dimensão e presença, nunca legibilidade.
  //
  // A regra não repete o literal "light": ela deriva da luminância do fundo
  // real. Se o app um dia virar claro, o contrato passa a exigir "dark"
  // sozinho, em vez de fossilizar a decisão de hoje.
  const [theme, layout] = await Promise.all([
    readFile(path.join(appRoot, 'src/ui/theme.ts'), 'utf8'),
    readFile(path.join(appRoot, 'src/app/_layout.tsx'), 'utf8'),
  ]);

  const galaxyBlock = theme.slice(theme.indexOf('galaxyColors'));
  const background = galaxyBlock.match(/background:\s*'(#[0-9a-fA-F]{3,6})'/)?.[1];
  assert.ok(background, 'expected galaxyColors to declare a background colour');

  const surface = parseHex(background);
  const lightContentRatio = contrastRatio(parseHex('#FFFFFF'), surface);
  const darkContentRatio = contrastRatio(parseHex('#000000'), surface);
  const required = lightContentRatio >= darkContentRatio ? 'light' : 'dark';

  const declared = [...layout.matchAll(/<StatusBar style="(\w+)"/g)].map((m) => m[1]);
  assert.ok(declared.length > 0, 'expected _layout.tsx to declare a StatusBar style');

  for (const [index, style] of declared.entries()) {
    assert.equal(
      style,
      required,
      `StatusBar #${index + 1} declares "${style}" over ${background}: light content reads at ` +
        `${lightContentRatio.toFixed(2)}:1 and dark content at ${darkContentRatio.toFixed(2)}:1, ` +
        `so the app must ask for "${required}" content`
    );
  }
});
