/**
 * Guarda do inventário de armazenamento (G7, FILA 54).
 *
 * Lê a AST de `src/` com o verificador de tipos do TypeScript, nunca o texto,
 * e junta as chaves por dois caminhos:
 * 1. toda chamada de leitura ou escrita (`getItem`, `setItem`, `multiSet`, os
 *    embrulhos de `src/storage`...), seguindo constantes, objetos de chaves,
 *    template literals e funções que montam a chave até o texto de origem;
 * 2. toda constante de chave declarada (nome com KEY ou PREFIX, ou dentro de um
 *    objeto `*_KEYS`), porque algumas chaves chegam ao store pelo construtor e
 *    não aparecem na chamada.
 * O conjunto encontrado precisa ser igual ao inventário: chave nova sem entrada
 * reprova, e entrada sem chave no código também.
 */
import fs from 'fs';
import path from 'path';
import ts from 'typescript';

import { STORAGE_INVENTORY, type StorageInventoryEntry } from './storageInventory';

const APP_ROOT = path.resolve(__dirname, '../..');
const SRC = path.join(APP_ROOT, 'src');

const STORAGE_CALLS = new Set([
    'getItem', 'setItem', 'removeItem', 'mergeItem',
    'multiGet', 'multiSet', 'multiRemove', 'multiMerge',
    'readJsonStorage', 'writeJsonStorage', 'removeStorageKey',
]);
const WRAPPERS = new Set(['readJsonStorage', 'writeJsonStorage', 'removeStorageKey']);
const MULTI_PAIRS = new Set(['multiSet', 'multiMerge']);
const MULTI_KEYS = new Set(['multiGet', 'multiRemove']);

/**
 * Chamadas que repassam uma chave recebida por parâmetro ou campo. A chave real
 * chega a elas por uma chamada ou por uma constante que a guarda também lê.
 * Uma chamada nova sem chave resolvível precisa entrar aqui de propósito.
 */
const PASS_THROUGH = new Set([
    'src/storage/index.ts#getItem#key',
    'src/storage/index.ts#setItem#key',
    'src/storage/index.ts#removeItem#key',
    'src/features/student-checkpoints/storage.ts#getItem#key',
    'src/features/student-checkpoints/storage.ts#setItem#key',
    'src/features/student-checkpoints/storage.ts#removeItem#key',
    'src/features/student-checkpoints/CheckpointStore.ts#getItem#this.storageKey',
    'src/features/student-checkpoints/CheckpointStore.ts#setItem#this.storageKey',
    'src/features/student-checkpoints/CheckpointStore.ts#setItem#this.quarantineKey',
    'src/features/student-checkpoints/CheckpointStore.ts#removeItem#this.storageKey',
    'src/features/spaced-repetition/repositories/ItemReviewRepository.ts#getItem#key',
    'src/features/spaced-repetition/repositories/ItemReviewRepository.ts#setItem#key',
    'src/features/spaced-repetition/repositories/ItemReviewRepository.ts#removeItem#key',
    'src/features/curriculum-v3/CurriculumMigrationService.ts#getItem#key',
    'src/features/progress-sync/LocalProgressAdapter.ts#getItem#key',
    'src/features/storage-migration/StorageMigrationService.ts#getItem#key',
    'src/features/storage-migration/StorageMigrationService.ts#setItem#key',
    'src/features/storage-migration/StorageMigrationService.ts#removeItem#key',
]);

/** Textos em constantes com KEY ou PREFIX no nome que não são chaves do store. */
const NOT_STORAGE = new Map([
    ['build_channel', 'dimensão de telemetria'],
    ['entry_surface', 'dimensão de telemetria'],
    ['experiment_id', 'dimensão de telemetria'],
    ['locale', 'dimensão de telemetria'],
    ['market', 'dimensão de telemetria'],
    ['RADIANT_CHECKPOINT_PERF ', 'prefixo de linha de log de desempenho'],
    ['competency:legacy:', 'prefixo de identificador de competência'],
    ['boolean — só indica existência do token, não o valor', 'descrição de campo sanitizado'],
]);

interface Resolved { keys: string[]; match: 'exact' | 'prefix' }
interface Found { key: string; match: 'exact' | 'prefix'; where: string }

function sourceFiles(dir: string): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return entry.name === '__tests__' || entry.name === '__mocks__' ? [] : sourceFiles(full);
        return /\.(ts|tsx)$/.test(entry.name) && !/\.(test|stories)\.tsx?$|\.d\.ts$/.test(entry.name) ? [full] : [];
    });
}

function relative(file: string): string {
    return path.relative(APP_ROOT, file).split(path.sep).join('/');
}

function scan(): { found: Found[]; unresolved: string[] } {
    const config = ts.readConfigFile(path.join(APP_ROOT, 'tsconfig.json'), ts.sys.readFile);
    const options = ts.parseJsonConfigFileContent(config.config, ts.sys, APP_ROOT).options;
    const files = sourceFiles(SRC);
    const program = ts.createProgram(files, { ...options, noEmit: true });
    const checker = program.getTypeChecker();
    const wanted = new Set(files.map((file) => path.resolve(file)));
    const found: Found[] = [];
    const unresolved: string[] = [];

    const literals = (type: ts.Type): string[] | null => {
        if (type.isUnion()) {
            const parts = type.types.map(literals);
            return parts.every(Boolean) ? (parts as string[][]).flat() : null;
        }
        return type.isStringLiteral() ? [type.value] : null;
    };

    const resolve = (node: ts.Expression, depth = 0): Resolved | null => {
        if (depth > 8) return null;
        let expr = node;
        while (ts.isParenthesizedExpression(expr) || ts.isAsExpression(expr) || ts.isSatisfiesExpression(expr) || ts.isNonNullExpression(expr)) {
            expr = expr.expression;
        }
        if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return { keys: [expr.text], match: 'exact' };
        if (ts.isTemplateExpression(expr)) {
            if (expr.head.text) return { keys: [expr.head.text], match: 'prefix' };
            const first = resolve(expr.templateSpans[0].expression, depth + 1);
            return first && first.keys.length === 1 ? { keys: [first.keys[0] + expr.templateSpans[0].literal.text], match: 'prefix' } : null;
        }
        if (ts.isBinaryExpression(expr) && expr.operatorToken.kind === ts.SyntaxKind.PlusToken) {
            const left = resolve(expr.left, depth + 1);
            return left && left.keys.length === 1 ? { keys: left.keys, match: 'prefix' } : null;
        }
        if (ts.isConditionalExpression(expr)) {
            const a = resolve(expr.whenTrue, depth + 1);
            const b = resolve(expr.whenFalse, depth + 1);
            return a && b && a.match === b.match ? { keys: [...a.keys, ...b.keys], match: a.match } : null;
        }
        if (ts.isCallExpression(expr)) {
            const body = declaredInitializer(expr.expression);
            if (body && (ts.isArrowFunction(body) || ts.isFunctionExpression(body)) && !ts.isBlock(body.body)) {
                return resolve(body.body, depth + 1);
            }
            const returned = singleReturn(expr.expression);
            return returned ? resolve(returned, depth + 1) : null;
        }
        const fromType = literals(checker.getTypeAtLocation(expr));
        if (fromType) return { keys: fromType, match: 'exact' };
        const initializer = declaredInitializer(expr);
        return initializer ? resolve(initializer, depth + 1) : null;
    };

    const declaredInitializer = (expr: ts.Expression): ts.Expression | undefined => {
        let symbol = checker.getSymbolAtLocation(expr);
        if (symbol && symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
        const declaration = symbol?.valueDeclaration;
        if (declaration && (ts.isVariableDeclaration(declaration) || ts.isPropertyAssignment(declaration) || ts.isPropertyDeclaration(declaration))) {
            return declaration.initializer;
        }
        return undefined;
    };

    /** Método que só devolve uma expressão, como `AuthorityStore.storageKey()`. */
    const singleReturn = (callee: ts.Expression): ts.Expression | undefined => {
        const declaration = checker.getSymbolAtLocation(callee)?.valueDeclaration;
        if (!declaration || !ts.isMethodDeclaration(declaration) || !declaration.body) return undefined;
        const [statement, ...rest] = declaration.body.statements;
        return rest.length === 0 && statement && ts.isReturnStatement(statement) ? statement.expression : undefined;
    };

    const record = (resolved: Resolved, where: string) => {
        for (const key of resolved.keys) found.push({ key, match: resolved.match, where });
    };

    for (const sourceFile of program.getSourceFiles()) {
        if (!wanted.has(path.resolve(sourceFile.fileName))) continue;
        const file = relative(sourceFile.fileName);

        const visit = (node: ts.Node, insideKeysObject: boolean): void => {
            if (ts.isCallExpression(node)) {
                const callee = node.expression;
                // Função solta só conta pelos nomes dos embrulhos: `setItem` solto
                // é, por exemplo, o setter de um `useState` (HybridLessonScreen).
                const name = ts.isPropertyAccessExpression(callee)
                    ? callee.name.text
                    : ts.isIdentifier(callee) && WRAPPERS.has(callee.text) ? callee.text : null;
                const arg = node.arguments[0];
                if (name && STORAGE_CALLS.has(name) && arg) {
                    const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
                    const where = `${file}:${line}`;
                    const items = (MULTI_PAIRS.has(name) || MULTI_KEYS.has(name)) && ts.isArrayLiteralExpression(arg)
                        ? arg.elements.map((element) => (MULTI_PAIRS.has(name) && ts.isArrayLiteralExpression(element) ? element.elements[0] : element))
                        : [arg];
                    for (const item of items) {
                        const resolved = item && !ts.isSpreadElement(item) ? resolve(item) : null;
                        if (resolved) record(resolved, where);
                        else unresolved.push(`${file}#${name}#${item ? item.getText(sourceFile).replace(/\s+/g, ' ') : '?'}`);
                    }
                }
            }

            let name: string | null = null;
            let initializer: ts.Expression | undefined;
            if ((ts.isVariableDeclaration(node) || ts.isPropertyAssignment(node)) && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name))) {
                name = node.name.text;
                initializer = node.initializer;
            }
            if (name && initializer) {
                let value = initializer;
                while (ts.isAsExpression(value) || ts.isSatisfiesExpression(value)) value = value.expression;
                if (ts.isObjectLiteralExpression(value) && /KEYS/i.test(name)) {
                    ts.forEachChild(value, (child) => visit(child, true));
                    return;
                }
                const namedAsKey = /KEY|PREFIX|^chave$/i.test(name) || insideKeysObject;
                const where = `${file}:${sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1}`;
                if (namedAsKey && (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value))) {
                    found.push({ key: value.text, match: /PREFIX/i.test(name) ? 'prefix' : 'exact', where });
                } else if (namedAsKey && (ts.isArrowFunction(value) || ts.isFunctionExpression(value)) && !ts.isBlock(value.body)) {
                    const resolved = resolve(value.body);
                    if (resolved) record(resolved, where);
                }
            }
            ts.forEachChild(node, (child) => visit(child, insideKeysObject));
        };
        visit(sourceFile, false);
    }
    return { found: found.filter((entry) => !NOT_STORAGE.has(entry.key)), unresolved };
}

function covers(entry: StorageInventoryEntry, found: Found): boolean {
    if (entry.match === 'exact') return found.match === 'exact' && found.key === entry.key;
    return found.key.startsWith(entry.key);
}

describe('inventário de armazenamento (G7)', () => {
    let result: ReturnType<typeof scan>;

    beforeAll(() => {
        result = scan();
    }, 120_000);

    it('lê as chaves do código: a varredura acha as chaves conhecidas', () => {
        const keys = new Set(result.found.map((entry) => entry.key));
        // Validade da varredura: sem isto, uma varredura vazia passaria nas
        // comparações abaixo e esconderia qualquer chave nova.
        expect(keys).toContain('@radiant:item_review_v1');
        expect(keys).toContain('@radiant:student_checkpoints_active_v1');
        expect(keys).toContain('push.optin.v1');
        expect(keys).toContain('pixel-mood:last:');
        expect(keys.size).toBeGreaterThanOrEqual(STORAGE_INVENTORY.length - 5);
    });

    it('toda chave gravada pelo app está no inventário', () => {
        const missing = result.found
            .filter((found) => !STORAGE_INVENTORY.some((entry) => covers(entry, found)))
            .map((found) => `${found.key} (${found.match}, ${found.where})`);
        expect([...new Set(missing)]).toEqual([]);
    });

    it('toda entrada do inventário existe no código', () => {
        const stale = STORAGE_INVENTORY
            .filter((entry) => !result.found.some((found) => covers(entry, found)))
            .map((entry) => entry.key);
        expect(stale).toEqual([]);
    });

    it('o inventário não repete chave', () => {
        const keys = STORAGE_INVENTORY.map((entry) => entry.key);
        expect(keys.filter((key, index) => keys.indexOf(key) !== index)).toEqual([]);
    });

    it('chamada com chave não resolvível só existe onde foi declarada como repasse', () => {
        const seen = new Set(result.unresolved);
        expect([...seen].filter((site) => !PASS_THROUGH.has(site))).toEqual([]);
        expect([...PASS_THROUGH].filter((site) => !seen.has(site))).toEqual([]);
    });
});
