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
//   - `semanticColors` (`src/ui/semantic-colors.ts`) — mapa por contexto, MAS
//     só o contexto `galaxy`; ver abaixo;
//   - a paleta clara `colors` continua livre em `src/components/ui` e `src/ui`,
//     a camada primitiva compartilhada que oferece ambos os contextos.
//
// **A segunda porta, fechada em 2026-08-24.** Esta guarda cobria `HomeScreen` e
// passava verde enquanto a tela renderizava fundo BRANCO — verificado acionando
// o kill switch `ENABLE_LEARNING_ROAD`. Ela não importava `colors`: fazia
// `const light = semanticColors.light`, e `semanticColors` estava na lista de
// permitidos. Era a mesma paleta clara por uma porta autorizada.
//
// Proibir o módulo inteiro seria errado — `semanticColors.galaxy` é justamente
// o alvo recomendado. O que se proíbe é o ACESSO ao contexto claro dentro das
// raízes de produto.

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
/**
 * Remove comentários antes de julgar.
 *
 * Sem isto o contrato acusa quem DOCUMENTA a regra: o comentário que explica
 * por que a `HomeScreen` deixou de usar `semanticColors.light` contém a própria
 * expressão proibida. Um guarda que pune a explicação empurra o autor a apagar
 * o registro para ficar verde, que é o oposto do que se quer.
 */
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

/**
 * O acesso ao contexto claro de `semanticColors` dentro das raízes de produto.
 *
 * Cobre `semanticColors.light`, `semanticColors['light']` e a desestruturação
 * `const { light } = semanticColors`. Não cobre um alias indireto de duas
 * etapas — quem quiser burlar consegue, e o contrato não existe para vencer
 * quem tenta, e sim para impedir quem não percebeu.
 */
function usesLightContext(rawSource) {
  const source = stripComments(rawSource);
  return (
    /semanticColors\s*\.\s*light\b/.test(source) ||
    /semanticColors\s*\[\s*['"]light['"]\s*\]/.test(source) ||
    /\{[^}]*\blight\b[^}]*\}\s*=\s*semanticColors/.test(source)
  );
}

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
      if (importsLightPalette(stripComments(source)) || usesLightContext(source)) {
        offenders.push(path.relative(appRoot, file));
      }
    }),
  );

  assert.deepEqual(
    offenders.sort(),
    [],
    `Estes arquivos alcançam a paleta CLARA dentro de ${GUARDED_ROOTS.join(
      ' / ',
    )} — importando \`colors\` de ui/theme, ou pelo contexto \`semanticColors.light\`.\nMigre para \`galaxyColors\` ou \`semanticColors.galaxy\`:\n  ${offenders
      .sort()
      .join('\n  ')}`,
  );
});
