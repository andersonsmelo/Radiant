// FILA 66 (2026-10-19): injeta cada defeito numa cópia descartável de
// radiant-app e roda sobre ela só a guarda
// `keeps icon glyphs out of the accessibility tree`.
//
// uso (Node 20, o mesmo do gate):
//   node injetar.mjs <texto|ast> <guarda.test.mjs> <raiz de radiant-app>
//
// `texto` e `ast` escolhem só a coluna de expectativa. Para `texto`, ela é a
// previsão do furo; para `ast`, é o que a guarda nova tem de fazer. Uma linha
// fora do esperado sai marcada INESPERADO e o script termina com código 1.
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const [modo, guarda, raiz] = process.argv.slice(2);
if (!['texto', 'ast'].includes(modo) || !guarda || !raiz) {
  console.error('uso: node injetar.mjs <texto|ast> <guarda.test.mjs> <raiz de radiant-app>');
  process.exit(2);
}

const NOME = 'keeps icon glyphs out of the accessibility tree';
const ICONE = 'src/components/ui/DecorativeIcon.tsx';
const TELA = 'src/features/review/screens/ReviewScreen.tsx';
const UI = 'src/ui/components/HUD.tsx';
const MODULO_TS = 'src/ui/motion.ts';
const GUARDA = 'scripts/maestro-contract.test.mjs';
const FORA = new Set(['node_modules', 'ios', 'android', '.expo', 'dist', 'coverage', 'artifacts']);

// Toda âncora aparece exatamente uma vez: a injeção não mira a linha errada.
function trocar(texto, de, para) {
  const vezes = texto.split(de).length - 1;
  if (vezes !== 1) throw new Error(`âncora ${JSON.stringify(de)} aparece ${vezes} vezes`);
  return texto.replace(de, para);
}

const ATRIBUTO = {
  accessible: '      accessible={false}\n',
  hidden: '      accessibilityElementsHidden\n',
  important: '      importantForAccessibility="no-hide-descendants"\n',
};
const RETORNO = '  return (\n';
const lembrete = linha => `  // ${linha.trim()}: fica só neste comentário.\n${RETORNO}`;

// [nome, arquivo, mutação, esperado da guarda de texto, esperado da guarda AST].
// As duas últimas mexem na própria guarda nova e não se aplicam à de texto
// (esperado null): medem as asserções de validade da varredura.
const INJECOES = [
  ['controle, sem defeito', ICONE, s => s, 'verde', 'verde'],
  ['accessible={false} sai do JSX e fica num comentário', ICONE,
    s => trocar(trocar(s, ATRIBUTO.accessible, ''), RETORNO, lembrete(ATRIBUTO.accessible)), 'verde', 'vermelho'],
  ['accessibilityElementsHidden sai do JSX e fica num comentário', ICONE,
    s => trocar(trocar(s, ATRIBUTO.hidden, ''), RETORNO, lembrete(ATRIBUTO.hidden)), 'verde', 'vermelho'],
  ['importantForAccessibility sai do JSX e fica num comentário', ICONE,
    s => trocar(trocar(s, ATRIBUTO.important, ''), RETORNO, lembrete(ATRIBUTO.important)), 'verde', 'vermelho'],
  ['accessible={true}', ICONE,
    s => trocar(s, ATRIBUTO.accessible, '      accessible={true}\n'), 'vermelho', 'vermelho'],
  ['accessibilityElementsHidden={false}', ICONE,
    s => trocar(s, ATRIBUTO.hidden, '      accessibilityElementsHidden={false}\n'), 'verde', 'vermelho'],
  ['importantForAccessibility="auto"', ICONE,
    s => trocar(s, ATRIBUTO.important, '      importantForAccessibility="auto"\n'), 'vermelho', 'vermelho'],
  ['{...props} depois dos atributos: quem chama sobrescreve', ICONE,
    s => trocar(trocar(s, '      {...props}\n', ''), ATRIBUTO.important, `${ATRIBUTO.important}      {...props}\n`),
    'verde', 'vermelho'],
  ['import default numa tela de feature', TELA,
    s => `import MaterialIcons from '@expo/vector-icons/MaterialIcons';\n${s}`, 'vermelho', 'vermelho'],
  ['import default em src/ui', UI,
    s => `import MaterialIcons from '@expo/vector-icons/MaterialIcons';\n${s}`, 'verde', 'vermelho'],
  ['require() numa tela de feature', TELA,
    s => `const Glyph = require('@expo/vector-icons/MaterialIcons');\n${s}`, 'vermelho', 'vermelho'],
  ['reexportação num módulo .ts', MODULO_TS,
    s => `export { default as Glyph } from '@expo/vector-icons/MaterialIcons';\n${s}`, 'verde', 'vermelho'],
  ['MaterialIcons pelo barril @expo/vector-icons', TELA,
    s => `import { MaterialIcons } from '@expo/vector-icons';\n${s}`, 'verde', 'vermelho'],
  ['outra família da mesma fonte de ícones', TELA,
    s => `import Ionicons from '@expo/vector-icons/Ionicons';\n${s}`, 'verde', 'vermelho'],
  ['controle, o módulo só citado num comentário da tela', TELA,
    s => `// Não importe @expo/vector-icons/MaterialIcons aqui: use DecorativeIcon.\n${s}`, 'vermelho', 'verde'],
  ['a varredura perde a raiz components, onde mora icon-symbol', GUARDA,
    s => trocar(s, "for (const dir of ['components', 'src'])", "for (const dir of ['src'])"), null, 'vermelho'],
  ['o detector de import fica cego (prefixo errado)', GUARDA,
    s => trocar(s, '/^@expo\\/vector-icons(\\/|$)/', '/^@expo\\/vector-icon\\//'), null, 'vermelho'],
];

console.log(`guarda: ${path.basename(guarda)} (${modo}), node ${process.version}`);
let inesperados = 0;
for (const [nome, arquivo, mutar, esperadoTexto, esperadoAst] of INJECOES) {
  if (modo === 'texto' && esperadoTexto === null) continue;
  const copia = mkdtempSync(path.join(tmpdir(), 'fila66-'));
  try {
    cpSync(raiz, copia, { recursive: true, filter: origem => !FORA.has(path.basename(origem)) });
    symlinkSync(path.join(raiz, 'node_modules'), path.join(copia, 'node_modules'));
    cpSync(guarda, path.join(copia, 'scripts/maestro-contract.test.mjs'));
    const alvo = path.join(copia, arquivo);
    writeFileSync(alvo, mutar(readFileSync(alvo, 'utf8')));

    const execucao = spawnSync(process.execPath,
      ['--test', '--test-reporter=spec', `--test-name-pattern=${NOME}`, 'scripts/maestro-contract.test.mjs'],
      { cwd: copia, encoding: 'utf8' });
    const saida = `${execucao.stdout}${execucao.stderr}`;
    const pass = Number(/ℹ pass (\d+)/.exec(saida)?.[1]);
    const fail = Number(/ℹ fail (\d+)/.exec(saida)?.[1]);
    if (pass + fail !== 1) throw new Error(`a guarda não rodou sozinha: pass ${pass}, fail ${fail}`);

    const obtido = fail === 1 ? 'vermelho' : 'verde';
    const esperado = modo === 'texto' ? esperadoTexto : esperadoAst;
    const marca = obtido === esperado ? '' : '  INESPERADO';
    if (marca) inesperados += 1;
    console.log(`\n[${obtido}] ${nome} (${arquivo})${marca}`);
    const erro = saida.split('\n').find(linha => /AssertionError|Error:/.test(linha));
    if (erro) console.log(`  ${erro.trim()}`);
  } finally {
    rmSync(copia, { recursive: true, force: true });
  }
}
const rodadas = INJECOES.filter(([, , , esperadoTexto]) => modo === 'ast' || esperadoTexto !== null).length;
console.log(`\n${rodadas} injeções, ${inesperados} fora do esperado`);
process.exit(inesperados === 0 ? 0 : 1);
