import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { appRoot, ts, unwrap } from './ast-helpers.mjs';

// Cor e tamanho de texto nascem em `src/ui` (`theme.ts`, `styles.ts`) e chegam
// às telas por token. Esta guarda lê a AST das telas e acusa o literal que
// escapou: cor (`#rgb`, `#rrggbb`, `rgb(`, `rgba(`), `fontSize` numérico e
// `textTransform: 'uppercase'`. Comentário não existe na AST, e texto que só
// cita uma cor não é uma cor inteira, então nenhum dos dois é acusado.
//
// shortcut: a guarda só vê literal escrito no lugar. Ela não acusa tamanho de
// texto vindo de identificador ou de conta (`fontSize: SIZE`, `fontSize: base * 1.2`),
// cor montada por template (`#${hex}`) nem cor nomeada (`'white'`, `'black'`).
// Vale ampliar quando um desses aparecer numa revisão de tela, ou quando uma
// tarefa trocar uma cor ou um tamanho por constante local para escapar da guarda.

const ROOTS = ['src/features/', 'src/app/'];

// Cada isenção diz por que a tela não segue os tokens. Entrar nesta lista
// exige decisão escrita; o adendo da Tarefa 6 (2026-11-17) fixou estas.
export const EXEMPT = [
  ['src/features/home/', 'HomeScreen antiga, fora do alcance do aluno'],
  ['src/features/telemetry/', 'tela de desenvolvimento'],
  ['src/features/dev-console/', 'tela de desenvolvimento'],
  ['src/features/editorial-preview/', 'prévia editorial, só em desenvolvimento'],
  ['src/features/beta/', 'legado do beta, fora do alcance do aluno'],
  ['src/app/telemetry.tsx', 'rota da tela de desenvolvimento'],
  ['src/features/curriculum-v3/', 'ilustrações SVG das lições híbridas, com cores de desenho'],
  ['src/features/bench/exposureShader.ts', 'constantes de um shader'],
];

const COLOR_WHOLE = /^\s*(?:#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|rgba?\(.*\))\s*$/i;
const testOrStory = /(?:^|\/)(?:__tests__|__mocks__)\/|\.(?:test|spec|stories)\.[cm]?tsx?$|\.d\.ts$/;

const inScope = (file) =>
  ROOTS.some((root) => file.startsWith(root)) &&
  !testOrStory.test(file) &&
  !EXEMPT.some(([prefix]) => file === prefix || (prefix.endsWith('/') && file.startsWith(prefix)));

const nameOf = (node) => (node && (ts.isIdentifier(node) || ts.isStringLiteral(node)) ? node.text : undefined);

// Literais que decidem o valor de uma expressão: ramos de ternário e lados de
// `??`/`||`, não condições.
function valueLiterals(expression) {
  const node = unwrap(expression);
  if (!node) return [];
  if (ts.isJsxExpression(node)) return valueLiterals(node.expression);
  if (ts.isConditionalExpression(node)) return [...valueLiterals(node.whenTrue), ...valueLiterals(node.whenFalse)];
  if (ts.isBinaryExpression(node) && [ts.SyntaxKind.QuestionQuestionToken, ts.SyntaxKind.BarBarToken].includes(node.operatorToken.kind)) {
    return [...valueLiterals(node.left), ...valueLiterals(node.right)];
  }
  return [node];
}

export function scanStyleLiterals(sources) {
  const findings = [];
  for (const [file, text] of Object.entries(sources)) {
    if (!inScope(file)) continue;
    const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const report = (node, kind) => findings.push({
      file,
      line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1,
      kind,
      text: node.getText(source).slice(0, 60),
    });
    const visit = (node) => {
      if (ts.isLiteralTypeNode(node) || ts.isImportDeclaration(node)) return;
      if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && COLOR_WHOLE.test(node.text)) report(node, 'color');
      if (ts.isTemplateExpression(node) && /^\s*rgba?\(/i.test(node.head.text)) report(node, 'color');
      const property = ts.isPropertyAssignment(node) || ts.isJsxAttribute(node) ? nameOf(node.name) : undefined;
      const value = ts.isPropertyAssignment(node) ? node.initializer : ts.isJsxAttribute(node) ? node.initializer : undefined;
      if (property === 'fontSize' && value) {
        for (const literal of valueLiterals(value)) {
          if (ts.isNumericLiteral(literal) || (ts.isStringLiteral(literal) && /^\d/.test(literal.text))) report(literal, 'fontSize');
        }
      }
      if (property === 'textTransform' && value) {
        for (const literal of valueLiterals(value)) {
          if ((ts.isStringLiteral(literal) || ts.isNoSubstitutionTemplateLiteral(literal)) && literal.text === 'uppercase') report(literal, 'uppercase');
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  return findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
}

export function readStyleSources(root) {
  const sources = {};
  const walk = (folder) => {
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (/\.tsx?$/.test(entry.name)) sources[path.relative(root, file).split(path.sep).join('/')] = readFileSync(file, 'utf8');
    }
  };
  for (const folder of ROOTS) walk(path.join(root, folder));
  return sources;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const findings = scanStyleLiterals(readStyleSources(appRoot));
  for (const { file, line, kind, text } of findings) console.log(`${file}:${line}  ${kind}  ${text}`);
  console.log(`${findings.length} literal(is) de estilo fora dos isentos.`);
  process.exitCode = findings.length ? 1 : 0;
}
