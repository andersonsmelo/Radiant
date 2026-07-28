import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// Guarda anti-regressão de identidade (ADR-2026-07-27-identidade-visual-galaxy-dark).
//
// A identidade oficial do produto é galaxy dark. As telas e features renderizam
// sobre fundo escuro, então nenhuma delas pode consumir a paleta CLARA primitiva
// `colors` de `src/ui/theme.ts` — foi exatamente essa importação, dentro de uma
// tela escura, que produziu os dois P0 de design (card branco no fundo escuro).
//
// O contrato de contraste (`contrast-contract.test.mjs`) valida tokens ISOLADOS,
// não composições: ele não vê uma tela galaxy pintando texto com um token claro.
// Esta guarda fecha esse ponto cego proibindo a importação na origem.
//
// Camadas permitidas:
//   - `galaxyColors`  (paleta dark, mesmo módulo) — este é o alvo correto;
//   - `semanticColors` (`src/ui/semantic-colors.ts`) — mapa por contexto;
//   - a paleta clara `colors` continua livre em `src/components/ui` e `src/ui`,
//     a camada primitiva compartilhada que oferece ambos os contextos.

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Raízes de produto cobertas pela guarda. Componentes primitivos em
// `src/components/ui` ficam fora: são eles que expõem as duas paletas.
const GUARDED_ROOTS = ['src/features', 'src/app'];

// Só a paleta clara primitiva. `galaxyColors`/`navigationTheme` do mesmo módulo
// e qualquer coisa de `semantic-colors` continuam permitidas.
const LIGHT_PALETTE_MODULE = /(?:^|\/)ui\/theme(?:\.ts)?$/;

function isSourceFile(name) {
  return /\.(ts|tsx)$/.test(name) && !/\.(test|spec|stories)\./.test(name);
}

async function collectSourceFiles(relativeRoot) {
  const absoluteRoot = path.join(appRoot, relativeRoot);
  const files = [];
  async function walk(dir) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return; // raiz ausente é tratada como vazia
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === '__tests__' || entry.name === '__mocks__') continue;
        await walk(full);
      } else if (isSourceFile(entry.name)) {
        files.push(full);
      }
    }
  }
  await walk(absoluteRoot);
  return files;
}

// Encontra qualquer `import { ... colors ... } from '<...>/ui/theme'` — inclusive
// multilinha e com alias (`colors as c`), tratando o nome IMPORTADO, não o local.
function importsLightPalette(source) {
  const importRe = /import\s*(?:type\s+)?\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRe.exec(source)) !== null) {
    const [, bindings, from] = match;
    if (!LIGHT_PALETTE_MODULE.test(from)) continue;
    const importedNames = bindings
      .split(',')
      .map((binding) => binding.trim().split(/\s+as\s+/)[0].trim())
      .filter(Boolean);
    if (importedNames.includes('colors')) return true;
  }
  return false;
}

test('nenhuma tela ou feature importa a paleta clara `colors` (identidade galaxy dark)', async () => {
  const fileGroups = await Promise.all(GUARDED_ROOTS.map(collectSourceFiles));
  const files = fileGroups.flat();

  // A guarda só protege se realmente varrer arquivos; um match vazio seria um
  // falso verde se as raízes mudarem de lugar.
  assert.ok(files.length > 0, 'esperava encontrar arquivos-fonte em src/features e src/app');

  const offenders = [];
  await Promise.all(
    files.map(async (file) => {
      const source = await readFile(file, 'utf8');
      if (importsLightPalette(source)) {
        offenders.push(path.relative(appRoot, file));
      }
    }),
  );

  assert.deepEqual(
    offenders.sort(),
    [],
    `Estes arquivos importam a paleta clara \`colors\` de ui/theme dentro de ${GUARDED_ROOTS.join(
      ' / ',
    )}. Migre para \`galaxyColors\` (ou \`semanticColors\`):\n  ${offenders
      .sort()
      .join('\n  ')}`,
  );
});
