import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { ts, unwrap } from './ast-helpers.mjs';

const COPY_FIELDS = new Set(['title', 'label', 'body', 'eyebrow', 'subtitle', 'description', 'message', 'placeholder', 'accessibilityLabel', 'accessibilityHint', 'prompt', 'explanation', 'phrases']);
const CLASSES = ['eyebrow', 'dash', 'jargon'];
const JARGON = /(?<![\p{L}\p{N}_])(?:jornada|elegível|nó(?: liberado)?|checkpoint|configuraç(?:ão|ões))(?![\p{L}\p{N}_])/iu;
const excludedSource = (file) => /(?:^|\/)(?:__tests__|__mocks__|test-utils)(?:\/|$)|\.(?:test|spec|stories)\.[cm]?tsx?$|\.d\.ts$/.test(file);
const propertyName = (node) => node && (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) ? node.text : undefined;

// Authored teaching text is protected by source AND field/context, never by a
// generic field name across the application. Navigation titles/labels stay in.
export const domainPolicy = {
  roots: ['src/**/*.ts', 'src/**/*.tsx', 'relative and @/* imports reachable from src (root, then src, per tsconfig)'],
  excludedSources: ['*.test.*', '*.spec.*', '*.stories.*', '__tests__', '__mocks__', 'test-utils', '*.d.ts'],
  clinical: [
    { sources: ['src/data/lessons.ts', 'src/data/ai-lessons.ts'], fields: ['questions.*'] },
    { sources: ['src/data/journey/defaultBlocks.ts'], fields: ['payload.prompt', 'payload.explanation', 'payload.options.*', 'teach/reinforce.payload.body'] },
    { sources: ['src/features/bench/lessons/exposicao.ts', 'src/features/bench/lessons/colimacao.ts'], fields: ['prompt', 'body', 'explanation', 'options.*'] },
    { sources: ['src/features/curriculum-v3/l1-body-reference/l1BodyReferenceContent.ts', 'src/features/curriculum-v3/l2-slicing-space/l2SlicingSpaceContent.ts'], fields: ['challenges.*', 'relationships.*', 'modelLayers.*', 'sources.*'] },
  ],
  legal: { source: 'src/features/subscription/screens/SubscriptionScreen.tsx', fields: ['CANCEL_COPY', 'Text[style=styles.legal].children'] },
  metadata: { source: 'src/features/student-checkpoints/EditorialCurriculumCandidate.ts', fields: ['sources.*', 'LICENSE.label'] },
  infrastructure: ['fetch request init/body (including its serialized payload)'],
  internal: ['comments', 'types', 'imports', 'conditions/discriminants', 'routes', 'testIDs', 'storage keys', 'icon names'],
};

/** Read src and only its reachable, relative TS imports outside src. No deps. */
export function readCopySources(root) {
  const sources = {};
  function add(file) {
    const relative = path.relative(root, file).split(path.sep).join('/');
    if (relative.startsWith('../') || excludedSource(relative) || Object.hasOwn(sources, relative)) return;
    sources[relative] = readFileSync(file, 'utf8');
    const source = ts.createSourceFile(relative, sources[relative], ts.ScriptTarget.Latest, true);
    for (const statement of source.statements) {
      if (!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement)) continue;
      const specifier = statement.moduleSpecifier?.text;
      if (!specifier || (!specifier.startsWith('.') && !specifier.startsWith('@/'))) continue;
      const bases = specifier.startsWith('@/') ? [path.join(root, specifier.slice(2)), path.join(root, 'src', specifier.slice(2))] : [path.resolve(path.dirname(file), specifier)];
      const target = bases.flatMap((base) => [base + '.ts', base + '.tsx', path.join(base, 'index.ts'), path.join(base, 'index.tsx')]).find(existsSync);
      if (target) add(target);
    }
  }
  function walk(folder) {
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (/\.tsx?$/.test(entry.name)) add(file);
    }
  }
  walk(path.join(root, 'src'));
  return sources;
}

/** A bounded static data-flow analysis, not execution of application code. */
export function scanCopySources(input) {
  const files = Object.fromEntries(Object.entries(input).filter(([file]) => !excludedSource(file)));
  const absolute = (file) => path.posix.resolve('/copy-domain', file);
  const byPath = new Map(Object.entries(files).map(([file, text]) => [absolute(file), ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS)]));
  function moduleFile(specifier, containing) {
    const bases = specifier.startsWith('@/') ? [absolute(specifier.slice(2)), absolute('src/' + specifier.slice(2))] : [path.posix.resolve(path.posix.dirname(containing), specifier)];
    return bases.flatMap((base) => [base + '.ts', base + '.tsx', base + '/index.ts', base + '/index.tsx']).find((file) => byPath.has(file));
  }
  const host = {
    getSourceFile: (file) => byPath.get(file),
    getDefaultLibFileName: () => '', writeFile: () => {}, getCurrentDirectory: () => '/copy-domain',
    getDirectories: () => [], fileExists: (file) => byPath.has(file), readFile: (file) => files[path.posix.relative('/copy-domain', file)],
    getCanonicalFileName: (file) => file, useCaseSensitiveFileNames: () => true, getNewLine: () => '\n',
    resolveModuleNames: (names, containing) => names.map((name) => {
      const resolvedFileName = (name.startsWith('.') || name.startsWith('@/')) && moduleFile(name, containing);
      return resolvedFileName ? { resolvedFileName, extension: resolvedFileName.endsWith('.tsx') ? ts.Extension.Tsx : ts.Extension.Ts } : undefined;
    }),
  };
  // Source file names must be canonical for the binder and module resolver.
  for (const [file, source] of byPath) source.fileName = file;
  const program = ts.createProgram([...byPath.keys()], { noLib: true, noResolve: false, jsx: ts.JsxEmit.Preserve, allowJs: false }, host);
  const checker = program.getTypeChecker();
  const violations = new Map();
  const diagnostics = new Map();
  const excluded = new Map();
  let sinks = 0;
  const location = (node) => {
    const source = node.getSourceFile();
    const { line, character } = source.getLineAndCharacterOfPosition(node.getStart(source));
    return { file: path.posix.relative('/copy-domain', source.fileName), line: line + 1, column: character + 1 };
  };
  const key = (node) => `${node.getSourceFile().fileName}:${node.pos}:${node.end}`;
  function record(node, kind, value) {
    violations.set(`${key(node)}:${kind}`, { ...location(node), class: kind, text: value });
  }
  function diagnostic(node, reason) {
    diagnostics.set(`${key(node)}:${reason}`, { ...location(node), reason, expression: node.getText().slice(0, 120) });
  }
  function exclusion(node) {
    const file = location(node).file;
    const ancestors = [];
    let cursor = node;
    while (cursor && !ts.isSourceFile(cursor)) { ancestors.push(cursor); cursor = cursor.parent; }
    const fields = ancestors.filter(ts.isPropertyAssignment).map((entry) => propertyName(entry.name));
    if (ancestors.some((entry) => ts.isCallExpression(entry) && entry.expression.getText() === 'fetch')) return 'internal-transport-payload';
    if (file === domainPolicy.metadata.source && ancestors.some((entry) => ts.isVariableDeclaration(entry) && ['sources', 'LICENSE'].includes(propertyName(entry.name)))) return 'internal-source-metadata';
    if (file === domainPolicy.legal.source && ancestors.some((entry) => ts.isVariableDeclaration(entry) && propertyName(entry.name) === 'CANCEL_COPY')) return 'protected-legal-prose';
    if (['src/data/lessons.ts', 'src/data/ai-lessons.ts'].includes(file) && fields.includes('questions')) return 'clinical-authorship';
    if (file === 'src/data/journey/defaultBlocks.ts') {
      if (fields.some((field) => ['prompt', 'explanation', 'options'].includes(field))) return 'clinical-authorship';
      if (fields.includes('body') && ancestors.some((entry) => ts.isObjectLiteralExpression(entry) && entry.properties.some((property) => ts.isPropertyAssignment(property) && propertyName(property.name) === 'type' && ts.isStringLiteral(property.initializer) && ['teach', 'reinforce'].includes(property.initializer.text)))) return 'clinical-authorship';
    }
    if (['src/features/bench/lessons/exposicao.ts', 'src/features/bench/lessons/colimacao.ts'].includes(file) && fields.some((field) => ['prompt', 'body', 'explanation', 'options'].includes(field))) return 'clinical-authorship';
    if (domainPolicy.clinical[3].sources.includes(file) && fields.some((field) => ['challenges', 'relationships', 'modelLayers', 'sources'].includes(field))) return 'clinical-authorship';
    return undefined;
  }
  function text(node, value, structural = false) {
    const reason = exclusion(node);
    if (reason) { excluded.set(key(node), { ...location(node), reason }); return; }
    const normalized = value.replace(/\s+/g, ' ').trim();
    const letters = normalized.match(/\p{L}/gu) ?? [];
    if (structural || (letters.length >= 4 && normalized === normalized.toLocaleUpperCase('pt-BR'))) record(node, 'eyebrow', normalized);
    if (/ [—–] /.test(value.replace(/\s+/g, ' '))) record(node, 'dash', normalized);
    if (JARGON.test(normalized)) record(node, 'jargon', normalized);
  }
  function declaration(node) {
    let symbol = checker.getSymbolAtLocation(node);
    if (symbol?.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
    return symbol?.valueDeclaration ?? symbol?.declarations?.[0];
  }
  function initializer(node) {
    if (!node) return undefined;
    if (ts.isShorthandPropertyAssignment(node)) {
      const target = checker.getShorthandAssignmentValueSymbol(node)?.valueDeclaration;
      return target?.initializer ?? (target && ts.isParameter(target) ? target.name : undefined);
    }
    if (ts.isExportAssignment(node)) return node.expression;
    return node.initializer;
  }
  function returns(fn) {
    if (!fn.body) return [];
    if (!ts.isBlock(fn.body)) return [fn.body];
    const result = [];
    const visit = (node) => {
      if (ts.isReturnStatement(node) && node.expression) result.push(node.expression);
      else if (node === fn.body || !ts.isFunctionLike(node)) ts.forEachChild(node, visit);
    };
    visit(fn.body);
    return result;
  }
  function expandedArray(entry, stack = new Set()) {
    if (stack.has(entry.array)) return { items: [], minimumLength: 0, known: false };
    const next = new Set(stack).add(entry.array);
    const items = [];
    let minimumLength = 0;
    let known = true;
    for (const element of entry.array.elements) {
      if (!ts.isSpreadElement(element)) { items.push({ expression: element, env: entry.env }); minimumLength++; continue; }
      const resolved = resolve(element.expression, entry.env);
      const alternatives = resolved.filter((value) => value.array).map((value) => expandedArray(value, next));
      // Text origins are a union of possible branches; cardinality is separate.
      // Two alternative singleton arrays supply two origins but just one slot.
      for (const alternative of alternatives) items.push(...alternative.items);
      if (!alternatives.length || alternatives.length !== resolved.length) { known = false; continue; }
      minimumLength += Math.min(...alternatives.map((alternative) => alternative.minimumLength));
      known = known && alternatives.every((alternative) => alternative.known && alternative.minimumLength === alternatives[0].minimumLength);
    }
    return { items, minimumLength, known };
  }
  function resolve(expression, env = new Map(), seen = new Set()) {
    const node = unwrap(expression);
    if (!node || seen.has(node) || seen.size > 45) return [];
    const next = new Set(seen).add(node);
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isJsxText(node)) return [{ node, value: node.text }];
    if (ts.isNumericLiteral(node) || node.kind === ts.SyntaxKind.NullKeyword || node.kind === ts.SyntaxKind.TrueKeyword || node.kind === ts.SyntaxKind.FalseKeyword) return [];
    if (ts.isTemplateExpression(node)) {
      // The interpolation marker has no letters: it separates static spans
      // without inventing lowercase copy that defeats uppercase detection.
      return [{ node: node.head, value: [node.head.text, ...node.templateSpans.map((span) => span.literal.text)].join('\uFFFC') }, ...node.templateSpans.flatMap((span) => resolve(span.expression, env, next))];
    }
    if (ts.isConditionalExpression(node)) return [...resolve(node.whenTrue, env, next), ...resolve(node.whenFalse, env, next)];
    if (ts.isBinaryExpression(node)) {
      if (node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken) return resolve(node.right, env, next);
      if ([ts.SyntaxKind.PlusToken, ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken].includes(node.operatorToken.kind)) return [...resolve(node.left, env, next), ...resolve(node.right, env, next)];
      return []; // conditions and discriminants are not copy
    }
    if (ts.isArrayLiteralExpression(node)) return [{ node, array: node, env }];
    if (ts.isSpreadElement(node) || ts.isAwaitExpression(node)) return resolve(node.expression, env, next);
    if (ts.isFunctionLike(node)) return returns(node).flatMap((value) => resolve(value, env, next));
    if (ts.isObjectLiteralExpression(node)) return [{ node, object: node, env }];
    if (ts.isIdentifier(node)) {
      const target = declaration(node);
      if (env.has(target)) return resolve(env.get(target), env, next);
      if (target && ts.isSourceFile(target)) return [{ node, namespace: target, env }];
      if (target && ts.isBindingElement(target)) {
        const binding = target.parent;
        const owner = binding.parent;
        const origin = initializer(owner);
        if (origin) {
          const name = propertyName(target.propertyName ?? target.name);
          return resolve(origin, env, next).flatMap((entry) => {
            if (entry.object) return entry.object.properties.filter((property) => propertyName(property.name) === name).flatMap((property) => resolve(initializer(property), entry.env, next));
            if (entry.array && ts.isArrayBindingPattern(binding)) return resolve(entry.array.elements[binding.elements.indexOf(target)], entry.env, next);
            return [];
          });
        }
      }
      if (target && initializer(target)) return resolve(initializer(target), env, next);
      if (target && ts.isParameter(target)) {
        const fn = target.parent;
        const call = fn.parent;
        if (ts.isCallExpression(call) && ts.isPropertyAccessExpression(call.expression) && ['map', 'flatMap', 'forEach', 'find', 'filter'].includes(call.expression.name.text)) return resolve(call.expression.expression, env, next).flatMap((entry) => entry.array ? entry.array.elements.flatMap((value) => resolve(value, env, next)) : [entry]);
      }
      diagnostic(node, 'unresolved dynamic identifier');
      return [];
    }
    if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
      const name = ts.isPropertyAccessExpression(node) ? node.name.text : propertyName(node.argumentExpression);
      const base = resolve(node.expression, env, next);
      const result = base.flatMap((entry) => {
        if (entry.namespace) {
          const module = checker.getSymbolAtLocation(entry.namespace);
          let exported = module && checker.getExportsOfModule(module).find((symbol) => symbol.name === name);
          if (exported?.flags & ts.SymbolFlags.Alias) exported = checker.getAliasedSymbol(exported);
          const target = exported?.valueDeclaration ?? exported?.declarations?.[0];
          return resolve(initializer(target), entry.env, next);
        }
        if (entry.array) {
          if (name === 'length') return [{ node, value: entry.array.elements.length }];
          const staticKey = ts.isPropertyAccessExpression(node) || (ts.isElementAccessExpression(node) && node.argumentExpression && (ts.isStringLiteral(node.argumentExpression) || ts.isNumericLiteral(node.argumentExpression)));
          if (staticKey && (name === undefined || !/^\d+$/.test(name))) return [];
          const elements = staticKey ? [entry.array.elements[Number(name)]].filter(Boolean) : entry.array.elements;
          return elements.flatMap((value) => resolve(value, entry.env, next));
        }
        if (!entry.object) return ts.isElementAccessExpression(node) ? [entry] : [];
        return entry.object.properties.flatMap((property) => {
          if (ts.isSpreadAssignment(property)) return resolve(property.expression, env, next).flatMap((spread) => spread.object ? spread.object.properties.filter((p) => propertyName(p.name) === name).flatMap((p) => resolve(initializer(p), env, next)) : []);
          return (name === undefined || propertyName(property.name) === name) ? resolve(initializer(property), entry.env, next) : [];
        });
      });
      if (!result.length) diagnostic(node, 'unresolved dynamic property');
      return result;
    }
    if (ts.isCallExpression(node)) {
      if (node.expression.getText() === 'JSON.stringify') {
        const flatten = (entries) => entries.flatMap((entry) => {
          if (entry.array) return flatten(entry.array.elements.flatMap((value) => resolve(value, entry.env, next)));
          if (entry.object) return flatten(entry.object.properties.flatMap((property) => resolve(initializer(property) ?? (ts.isSpreadAssignment(property) ? property.expression : undefined), entry.env, next)));
          return [entry];
        });
        return flatten(resolve(node.arguments[0], env, next));
      }
      if (ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'join') {
        return resolve(node.expression.expression, env, next).flatMap((entry) => {
          if (!entry.array) return [entry];
          const expanded = expandedArray(entry);
          if (!expanded.known) diagnostic(node, 'unresolved join spread cardinality');
          const values = expanded.items.flatMap((item) => resolve(item.expression, item.env, next));
          return [...values, ...(expanded.minimumLength > 1 && node.arguments[0] ? resolve(node.arguments[0], env, next) : [])];
        });
      }
      if (node.expression.getText() === 'useMemo' && node.arguments[0] && ts.isFunctionLike(node.arguments[0])) return returns(node.arguments[0]).flatMap((value) => resolve(value, env, next));
      if (ts.isPropertyAccessExpression(node.expression) && ['find', 'filter', 'map', 'flatMap'].includes(node.expression.name.text)) {
        const collection = resolve(node.expression.expression, env, next);
        const elements = collection.flatMap((entry) => entry.array ? [...entry.array.elements] : []);
        if (elements.length) {
          const callback = node.arguments[0];
          if (['map', 'flatMap'].includes(node.expression.name.text) && callback && ts.isFunctionLike(callback)) {
            return elements.flatMap((element) => {
              const scope = new Map(env);
              if (callback.parameters[0]) scope.set(callback.parameters[0], element);
              return returns(callback).flatMap((value) => resolve(value, scope, next));
            });
          }
          return elements.flatMap((element) => resolve(element, env, next));
        }
      }
      if (ts.isPropertyAccessExpression(node.expression) && ['toLowerCase', 'trim'].includes(node.expression.name.text)) {
        return resolve(node.expression.expression, env, next).map((entry) => typeof entry.value === 'string' ? { ...entry, value: node.expression.name.text === 'trim' ? entry.value.trim() : entry.value.toLocaleLowerCase('pt-BR') } : entry);
      }
      if (ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'toUpperCase') {
        record(node, 'eyebrow', '.toUpperCase() on UI text');
        return resolve(node.expression.expression, env, next);
      }
      const target = declaration(ts.isPropertyAccessExpression(node.expression) ? node.expression.name : node.expression);
      const fn = target && (ts.isFunctionLike(target) ? target : unwrap(target.initializer));
      if (fn && ts.isFunctionLike(fn)) {
        const scope = new Map(env);
        fn.parameters.forEach((parameter, index) => { if (node.arguments[index]) scope.set(parameter, node.arguments[index]); });
        return returns(fn).flatMap((value) => resolve(value, scope, next));
      }
      if (node.expression.getText() === 'StyleSheet.create') return resolve(node.arguments[0], env, next);
      diagnostic(node, 'unresolved function call');
      return [];
    }
    if (ts.isJsxExpression(node)) return resolve(node.expression, env, next);
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node) || ts.isJsxFragment(node)) return [];
    diagnostic(node, `unresolved syntax ${ts.SyntaxKind[node.kind]}`);
    return [];
  }
  function consume(expression, structural = false, env = new Map()) {
    if (!expression) return;
    const reason = exclusion(expression);
    if (reason) { excluded.set(key(expression), { ...location(expression), reason }); return; }
    sinks++;
    const results = resolve(expression, env);
    for (const entry of results) {
      if (typeof entry.value === 'string') text(entry.node, entry.value, structural);
      else if (entry.array) entry.array.elements.forEach((value) => consume(value, structural, entry.env));
      else if (entry.object) {
        for (const property of entry.object.properties) {
          if (ts.isPropertyAssignment(property) && COPY_FIELDS.has(propertyName(property.name))) consume(property.initializer, propertyName(property.name) === 'eyebrow', entry.env);
        }
      }
    }
    if (structural && !results.some((entry) => typeof entry.value === 'string' || entry.object || entry.array)) record(expression, 'eyebrow', 'eyebrow prop');
  }
  function style(expression, seen = new Set()) {
    if (!expression || seen.has(expression) || seen.size > 20) return;
    const next = new Set(seen).add(expression);
    const node = unwrap(expression);
    if (ts.isArrayLiteralExpression(node)) { node.elements.forEach((entry) => style(entry, next)); return; }
    for (const result of resolve(node)) {
      if (!result.object) continue;
      for (const property of result.object.properties) {
        if (ts.isSpreadAssignment(property)) style(property.expression, next);
        if (ts.isPropertyAssignment(property) && propertyName(property.name) === 'textTransform') {
          for (const value of resolve(property.initializer)) if (value.value === 'uppercase') record(value.node, 'eyebrow', "textTransform: 'uppercase'");
        }
      }
    }
  }
  function isNativeAlert(expression, seen = new Set()) {
    if (!ts.isIdentifier(expression) || seen.has(expression)) return false;
    const symbol = checker.getSymbolAtLocation(expression);
    const binding = symbol?.valueDeclaration ?? symbol?.declarations?.[0];
    if (binding && ts.isImportSpecifier(binding)) {
      const statement = binding.parent.parent.parent;
      return ts.isImportDeclaration(statement) && statement.moduleSpecifier.text === 'react-native' && (binding.propertyName ?? binding.name).text === 'Alert';
    }
    if (binding?.initializer) return isNativeAlert(binding.initializer, new Set(seen).add(expression));
    // Preserve canonical unbound Alert fixtures, while rejecting a local object
    // that merely happens to expose an alert method.
    return expression.text === 'Alert' && !binding;
  }
  for (const source of byPath.values()) {
    const visit = (node) => {
      if (ts.isJsxAttribute(node)) {
        const name = propertyName(node.name);
        if (COPY_FIELDS.has(name) && node.initializer) consume(ts.isJsxExpression(node.initializer) ? node.initializer.expression : node.initializer, name === 'eyebrow');
      }
      // Native Text aliases and ReactNode wrappers (AppButton, ExternalLink,
      // fragments) can all carry visible children, so inspect their children.
      if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
        const attributes = ts.isJsxElement(node) ? node.openingElement.attributes.properties : [];
        const styleAttribute = attributes.find((attribute) => ts.isJsxAttribute(attribute) && propertyName(attribute.name) === 'style');
        const legal = location(node).file === domainPolicy.legal.source && styleAttribute?.initializer?.expression?.getText() === 'styles.legal';
        if (legal) excluded.set(key(node), { ...location(node), reason: 'protected-legal-prose' });
        else for (const child of node.children) {
          if (ts.isJsxText(child) && child.text.trim()) consume(child);
          if (ts.isJsxExpression(child) && child.expression) consume(child.expression);
        }
        if (styleAttribute?.initializer?.expression) style(styleAttribute.initializer.expression);
      }
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'alert' && isNativeAlert(node.expression.expression)) node.arguments.slice(0, 2).forEach((argument) => consume(argument));
      if (ts.isPropertyAssignment(node) && COPY_FIELDS.has(propertyName(node.name))) consume(node.initializer, propertyName(node.name) === 'eyebrow');
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  const sort = (items) => [...items.values()].sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.column - b.column || (a.class ?? '').localeCompare(b.class ?? ''));
  return { violations: sort(violations), diagnostics: sort(diagnostics), sources: Object.keys(files).sort(), sinks, excluded: sort(excluded) };
}

export function copyCounts(violations) {
  const counts = {};
  for (const { file, class: kind } of violations) {
    counts[file] ??= { eyebrow: 0, dash: 0, jargon: 0 };
    counts[file][kind]++;
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}

export function compareBaseline(violations, ceilings, sources) {
  const errors = [];
  const warnings = [];
  const counts = copyCounts(violations);
  for (const [file, classes] of Object.entries(ceilings)) {
    if (sources && !sources.includes(file)) errors.push(`${file}: obsolete baseline path`);
    for (const [kind, ceiling] of Object.entries(classes)) {
      if (!CLASSES.includes(kind) || !Number.isInteger(ceiling) || ceiling < 0) errors.push(`${file}: invalid baseline class/ceiling ${kind}`);
    }
  }
  for (const file of new Set([...Object.keys(counts), ...Object.keys(ceilings)])) {
    for (const kind of CLASSES) {
      const actual = counts[file]?.[kind] ?? 0;
      const ceiling = ceilings[file]?.[kind] ?? 0;
      if (actual > ceiling) errors.push(`${file}: ${kind} ${actual} exceeds ${ceiling}`);
      if (actual < ceiling) warnings.push(`${file}: ${kind} dropped ${ceiling} -> ${actual}; reduce the baseline ceiling`);
    }
  }
  return { errors, warnings };
}
