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
