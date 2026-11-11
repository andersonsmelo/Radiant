import fs from 'fs';
import path from 'path';
import ts from 'typescript';

/**
 * Toda imagem que o código de `src` pede (`require` ou `import`) existe.
 *
 * O Jest não pega isso sozinho: as stories não rodam nos testes, e o Metro só
 * reprova ao montar o bundle. Em 2026-10-23, duas stories ainda importavam
 * `lesson-xray-panel.png`, removido em `b06c7eb`, e o bundle do Storybook não
 * montava. A leitura é por AST, e não por texto: um comentário que cita o
 * arquivo não conta como uso.
 */
const SRC = path.join(__dirname, '..');
const IMAGE = /\.(png|jpe?g|gif|webp)$/i;

function sourceFiles(dir: string): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return sourceFiles(full);
        return /\.tsx?$/.test(entry.name) ? [full] : [];
    });
}

function imageRequests(fileName: string, text: string): string[] {
    const source = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);
    const found: string[] = [];
    const visit = (node: ts.Node) => {
        if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'require') {
            const [argument] = node.arguments;
            if (argument && ts.isStringLiteralLike(argument) && IMAGE.test(argument.text)) found.push(argument.text);
        }
        if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier) && IMAGE.test(node.moduleSpecifier.text)) {
            found.push(node.moduleSpecifier.text);
        }
        ts.forEachChild(node, visit);
    };
    visit(source);
    return found;
}

/** O Metro aceita `nome.png` quando só existem as densidades (`nome@2x.png`). */
function resolves(file: string, request: string): boolean {
    const target = path.resolve(path.dirname(file), request);
    const ext = path.extname(target);
    const base = target.slice(0, -ext.length);
    return [target, `${base}@2x${ext}`, `${base}@3x${ext}`].some(candidate => fs.existsSync(candidate));
}

function missingImages(file: string, text: string): string[] {
    return imageRequests(file, text)
        .filter(request => request.startsWith('.') && !resolves(file, request))
        .map(request => `${path.relative(SRC, file)} → ${request}`);
}

describe('imagens pedidas pelo código de src', () => {
    it('a varredura acusa uma imagem que não existe (e ignora comentário e imagem existente)', () => {
        const file = path.join(SRC, 'features', 'exemplo.stories.tsx');
        const text = [
            "// require('../assets/so-no-comentario.png')",
            "const a = require('../assets/nao-existe.png');",
            "import b from '../../assets/images/icon.png';",
        ].join('\n');
        expect(missingImages(file, text)).toEqual(['features/exemplo.stories.tsx → ../assets/nao-existe.png']);
    });

    it('toda imagem pedida por um arquivo de src existe', () => {
        const missing = sourceFiles(SRC).flatMap(file => missingImages(file, fs.readFileSync(file, 'utf8')));
        expect(missing).toEqual([]);
    });
});
