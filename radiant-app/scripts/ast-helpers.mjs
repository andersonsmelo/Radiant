import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Leitura por AST compartilhada pelos contratos de `scripts/`. Uma busca por
// texto casaria com a menção do token num comentário e passaria com o valor
// errado no código; a AST segue a constante até o literal. Saiu de
// `contrast-contract.test.mjs` em 2026-10-21 para o contrato de geometria do
// Pixel ler `PixelBody.tsx` do mesmo jeito.

export const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ts = createRequire(import.meta.url)('typescript');

const sourceFiles = new Map();
export function sourceOf(relativePath) {
  if (!sourceFiles.has(relativePath)) {
    const text = readFileSync(path.join(appRoot, relativePath), 'utf8');
    const kind = relativePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
    sourceFiles.set(relativePath, ts.createSourceFile(relativePath, text, ts.ScriptTarget.Latest, true, kind));
  }
  return sourceFiles.get(relativePath);
}

export function unwrap(node) {
  let current = node;
  while (
    current &&
    (ts.isAsExpression(current) || ts.isSatisfiesExpression(current) || ts.isParenthesizedExpression(current))
  ) {
    current = current.expression;
  }
  return current;
}

export function topLevelConst(source, name) {
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name) {
        return declaration.initializer;
      }
    }
  }
  return undefined;
}

export function importedFrom(source, name) {
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const named = statement.importClause?.namedBindings;
    if (!named || !ts.isNamedImports(named)) continue;
    if (named.elements.some((element) => element.name.text === name)) {
      const target = path.join(path.dirname(source.fileName), statement.moduleSpecifier.text);
      for (const extension of ['.ts', '.tsx']) {
        try {
          return sourceOf(target + extension);
        } catch {
          // tenta a próxima extensão
        }
      }
    }
  }
  return undefined;
}

// Segue uma expressão até um literal de cor ou um objeto literal: constante
// local, import nomeado, `StyleSheet.create({...})` e acesso a propriedade.
export function resolveNode(expression, source) {
  const node = unwrap(expression);
  assert.ok(node, `expressão vazia em ${source.fileName}`);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return { value: node.text };
  }
  if (ts.isNumericLiteral(node)) {
    return { value: Number(node.text) };
  }
  if (ts.isObjectLiteralExpression(node)) {
    return { object: node, source };
  }
  if (ts.isCallExpression(node) && node.arguments.length === 1 && node.expression.getText(source) === 'StyleSheet.create') {
    return resolveNode(node.arguments[0], source);
  }
  if (ts.isIdentifier(node)) {
    const local = topLevelConst(source, node.text);
    if (local) return resolveNode(local, source);
    const module = importedFrom(source, node.text);
    assert.ok(module, `${node.text} não resolvido em ${source.fileName}`);
    const exported = topLevelConst(module, node.text);
    assert.ok(exported, `${node.text} não declarado em ${module.fileName}`);
    return resolveNode(exported, module);
  }
  if (ts.isPropertyAccessExpression(node)) {
    const base = resolveNode(node.expression, source);
    return resolveProperty(base, node.name.text);
  }
  assert.fail(`expressão não suportada em ${source.fileName}: ${node.getText(source)}`);
}

export function resolveProperty(base, key) {
  assert.ok(base.object, `${key}: a base não é um objeto literal`);
  const property = base.object.properties.find(
    (entry) => ts.isPropertyAssignment(entry) && entry.name.getText(base.source) === key,
  );
  assert.ok(property, `propriedade ${key} não encontrada em ${base.source.fileName}`);
  return resolveNode(property.initializer, base.source);
}

// Ex.: resolveColor('src/ui/theme.ts', 'galaxyColors', 'background').
export function resolveColor(relativePath, root, ...keys) {
  const source = sourceOf(relativePath);
  let current = resolveNode(ts.factory.createIdentifier(root), source);
  for (const key of keys) current = resolveProperty(current, key);
  assert.ok(typeof current.value === 'string', `${root}.${keys.join('.')} não resolve para uma cor literal`);
  return current.value;
}
