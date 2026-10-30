import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ts, unwrap } from './ast-helpers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const POLICY_PATH = path.join(__dirname, 'visual-qa-policy.json');

const CONFIG = {
    extensions: ['.tsx', '.ts'],
    exclude: ['node_modules', 'dist', 'build', '.expo', 'ui/styles.ts'],
    scanPaths: [path.join(SRC_DIR, 'features'), path.join(SRC_DIR, 'ui'), path.join(SRC_DIR, 'app')],
    allowedSpacings: [0, 1, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, '-4', '-8', '100%', '50%'],
    allowedRadius: [0, 2, 4, 8, 12, 16, 20, 24, 100, 999],
};

const RULES = [
    {
        id: 'R1', severity: 'high', description: 'Magic Number in Layout',
        regex: /(margin|padding|gap|borderRadius|width|height)(Horizontal|Vertical|Top|Bottom|Left|Right)?\s*:\s*([0-9]+)/g,
        check: (match) => {
            const prop = `${match[1]}${match[2] || ''}`;
            const value = Number.parseInt(match[3], 10);
            if (prop.startsWith('borderRadius')) {
                return CONFIG.allowedRadius.includes(value) ? null : { signature: `${prop}:${value}`, msg: `Found radius: ${value}. Use radius.* tokens.` };
            }
            if (prop === 'width' || prop === 'height') return null;
            return CONFIG.allowedSpacings.includes(value) ? null : { signature: `${prop}:${value}`, msg: `Found spacing: ${value}. Use space.* tokens.` };
        },
    },
    {
        id: 'R2', severity: 'warning', description: 'Redefining Primitives', regex: /(container|screen|center):\s*\{/g,
        check: (match) => ({ signature: match[1], msg: 'Local definition of "container", "screen" or "center". Check if you can use layout.* primitives.' }),
    },
    {
        id: 'R3', severity: 'warning', description: 'Inline Numeric Style', regex: /style=\{\{\s*.*?(margin|padding).*?:\s*([0-9]+).*?\}\}/g,
        check: (match) => {
            const value = Number.parseInt(match[2], 10);
            return CONFIG.allowedSpacings.includes(value) ? null : { signature: `inline-${match[1]}:${value}`, msg: `Inline style magic number: ${value}.` };
        },
    },
    {
        id: 'R4', severity: 'high', description: 'Unauthorized Animation', regex: /from\s+['"](react-native-reanimated|react-native\/Libraries\/Animated\/Animated)['"]|Animated\.timing/g,
        check: (match, _content, file) => {
            if (file.endsWith(`${path.sep}ui${path.sep}motion.ts`)) return null;
            return { signature: match[0].includes('Animated.timing') ? 'Animated.timing' : match[1], msg: 'Direct animation usage detected. Use helpers from src/ui/motion.ts.' };
        },
    },
    {
        id: 'R5', severity: 'warning', description: 'Character Misuse', regex: /(CharacterSlot|PixelIllustration)/g,
        check: (_match, content, file) => {
            if (isApprovedBenchCharacterUse(content, path.relative(ROOT_DIR, file))) return null;
            if (file.includes(`${path.sep}ui${path.sep}characters${path.sep}`)) return null;
            const allowed = ['Home', 'Start', 'Finish', 'Intro', 'Welcome', 'Summary', 'Character', 'Checkpoint', 'Quiz', 'Review', 'JourneyHero', 'PixelIllustration'];
            return allowed.some((name) => path.basename(file).includes(name))
                ? null
                : { signature: 'character-usage', msg: `Character usage in potential non-standard screen: ${path.basename(file)}. verify archetype rules.` };
        },
        oncePerFile: true,
    },
];

// This is a bounded recognizer for the already approved T04 explanation, not
// a new screen allowance. Unknown syntax/bindings fail closed. The historical
// R5 rule is unchanged everywhere else, including its existing filename debt.
const BENCH_FILE = 'src/features/lesson-flow/renderers/BenchStepRenderer.tsx';
const BENCH_TEST_FILE = BENCH_FILE.replace('.tsx', '.test.tsx');
const PIXEL_MODULE = '../../../ui/characters/PixelIllustration';

function descendants(node, predicate) {
    const found = [];
    function visit(child) {
        if (predicate(child)) found.push(child);
        ts.forEachChild(child, visit);
    }
    visit(node);
    return found;
}

// Compare parsed syntax, ignoring comments, whitespace and transparent type
// wrappers. In particular a correct condition in a comment cannot authorize
// an incorrect executable condition.
function syntaxShape(input) {
    const node = unwrap(input);
    if (!node || (ts.isJsxText(node) && !node.text.trim())) return null;
    const children = [];
    ts.forEachChild(node, (child) => { const shape = syntaxShape(child); if (shape) children.push(shape); });
    const text = ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node) || ts.isJsxText(node) ? node.text : undefined;
    return [node.kind, text, children];
}
function matchesExpression(node, expected) {
    const parsed = ts.createSourceFile('expected.tsx', `const expected = (${expected});`, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    return JSON.stringify(syntaxShape(node)) === JSON.stringify(syntaxShape(parsed.statements[0].declarationList.declarations[0].initializer));
}

function isApprovedBenchCharacterUse(content, file) {
    if (file !== BENCH_FILE && file !== BENCH_TEST_FILE) return false;
    const source = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    if (source.parseDiagnostics.length) return false;
    const identifiers = (name) => descendants(source, (node) => ts.isIdentifier(node) && node.text === name);
    // Inspect module bindings before counting identifiers: namespace/bracket
    // aliases may never contain a PixelIllustration Identifier at all. Only
    // the existing single named import is understood; refactors fail closed.
    const characterNames = ['PixelIllustration', 'CharacterSlot'];
    const characterImports = descendants(source, (node) => ts.isImportDeclaration(node)
        && (node.moduleSpecifier.text === PIXEL_MODULE
            || node.moduleSpecifier.text === '../../../ui/characters/CharacterSlot'
            || (node.importClause?.namedBindings && ts.isNamedImports(node.importClause.namedBindings)
                && node.importClause.namedBindings.elements.some((entry) =>
                    characterNames.includes(entry.name.text) || characterNames.includes(entry.propertyName?.text)))));
    if (characterImports.length > 1 || characterImports.some((node) => {
        const clause = node.importClause;
        const bindings = clause?.namedBindings;
        if (node.moduleSpecifier.text !== PIXEL_MODULE || !clause || clause.name || clause.isTypeOnly
            || !bindings || !ts.isNamedImports(bindings) || bindings.elements.length !== 1) return true;
        const entry = bindings.elements[0];
        return entry.name.text !== 'PixelIllustration' || !!entry.propertyName || entry.isTypeOnly;
    })) return false;
    const pixelImport = characterImports[0]?.importClause.namedBindings.elements[0];
    const pixelNames = identifiers('PixelIllustration');
    if (identifiers('CharacterSlot').length) return false;
    if (file === BENCH_TEST_FILE && pixelNames.length === 0 && !pixelImport) return true;
    if (!pixelImport) return false;
    if (file === BENCH_TEST_FILE) {
        // Only the existing query assertions are observational. No blanket
        // exemption for tests, JSX, createElement, aliasing or unknown calls.
        if (pixelNames.length === 1) return true;
        const viewNames = identifiers('view');
        const viewBinding = viewNames.find((name) => ts.isVariableDeclaration(name.parent));
        if (!viewBinding || viewBinding.parent.name !== viewBinding
            || !(viewBinding.parent.parent.flags & ts.NodeFlags.Const)
            || !ts.isCallExpression(viewBinding.parent.initializer)
            || !ts.isIdentifier(viewBinding.parent.initializer.expression)
            || viewBinding.parent.initializer.expression.text !== 'render') return false;
        if (!viewNames.every((name) => name === viewBinding
            || (ts.isPropertyAccessExpression(name.parent) && name.parent.expression === name
                && ts.isCallExpression(name.parent.parent) && name.parent.parent.expression === name.parent
                && ['getByText', 'getByRole', 'UNSAFE_queryByType', 'UNSAFE_getByType'].includes(name.parent.name.text)))) return false;
        const renderNames = identifiers('render');
        const renderImport = renderNames.find((name) => ts.isImportSpecifier(name.parent));
        if (!renderImport || renderImport.parent.propertyName
            || renderImport.parent.parent.parent.parent.moduleSpecifier.text !== '@testing-library/react-native'
            || !renderNames.every((name) => name === renderImport
                || (ts.isCallExpression(name.parent) && name.parent.expression === name))) return false;
        return pixelNames.every((name) => {
            if (name === pixelImport.name) return true;
            const call = name.parent;
            return ts.isCallExpression(call) && call.arguments.length === 1 && call.arguments[0] === name
                && !call.questionDotToken && ts.isPropertyAccessExpression(call.expression)
                && !call.expression.questionDotToken && ts.isIdentifier(call.expression.expression)
                && call.expression.expression.text === 'view'
                && ['UNSAFE_queryByType', 'UNSAFE_getByType'].includes(call.expression.name.text);
        });
    }
    const functions = source.statements.filter(ts.isFunctionDeclaration);
    const screen = functions.find((node) => node.name?.text === 'BenchScreen');
    const renderer = functions.find((node) => node.name?.text === 'BenchStepRenderer');
    if (!screen?.body || screen.modifiers?.length || !renderer?.body || renderer.body.statements.length !== 2) return false;
    const [typeGuard, returned] = renderer.body.statements;
    if (!ts.isIfStatement(typeGuard) || typeGuard.elseStatement
        || !matchesExpression(typeGuard.expression, "interaction.type !== 'bench'")
        || !ts.isBlock(typeGuard.thenStatement) || typeGuard.thenStatement.statements.length !== 1
        || !ts.isReturnStatement(typeGuard.thenStatement.statements[0])
        || !matchesExpression(typeGuard.thenStatement.statements[0].expression, '<View />')
        || !ts.isReturnStatement(returned)) return false;
    if (!matchesExpression(returned.expression, `<BenchScreen
        interactionId={interaction.id}
        payload={interaction.payload}
        value={value} onChange={onChange} submitted={submitted}
        explanation={interaction.payload.mode === 'explore' && !submitted
          && isCorrectInteractionValue(interaction, value) ? interaction.feedback.correct : undefined}
    />`)) return false;
    // Check the binding declaration too: an identical expression over a new
    // default, renamed parameter or shadowed predicate is not the same proof.
    const parameterShape = (fn) => fn.parameters.length === 1 ? syntaxShape(fn.parameters[0].name) : null;
    const expectedRenderer = ts.createSourceFile('parameter.ts', 'function f({ interaction, value, onChange, submitted = false }) {}', ts.ScriptTarget.Latest, true);
    if (JSON.stringify(parameterShape(renderer)) !== JSON.stringify(parameterShape(expectedRenderer.statements[0]))) return false;
    const predicateNames = identifiers('isCorrectInteractionValue');
    if (predicateNames.length !== 2 || !ts.isImportSpecifier(predicateNames[0].parent)
        || predicateNames[0].parent.propertyName
        || predicateNames[0].parent.parent.parent.parent.moduleSpecifier.text !== './InteractionAnswerValue') return false;
    const screenNames = identifiers('BenchScreen');
    if (screenNames.length !== 2 || screenNames[0] !== screen.name
        || screenNames[1] !== unwrap(returned.expression).tagName) return false;
    const pixelUsages = pixelNames.filter((node) => node !== pixelImport.name);
    if (pixelUsages.length !== 1 || !ts.isJsxSelfClosingElement(pixelUsages[0].parent)) return false;
    const pixel = pixelUsages[0].parent;
    const conditions = descendants(screen.body, ts.isConditionalExpression).filter((node) =>
        descendants(node.whenTrue, (child) => child === pixel).length === 1);
    if (conditions.length !== 1 || !matchesExpression(conditions[0], `explanation ? (
        <View style={styles.explanation}>
            <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                <PixelIllustration state="happy" size="sm" />
            </View>
            <Text style={styles.explanationText}>{explanation}</Text>
        </View>
    ) : null`)) return false;
    const screenReturn = screen.body.statements.find(ts.isReturnStatement);
    if (!screenReturn || !ts.isJsxElement(unwrap(screenReturn.expression))) return false;
    const directChildren = unwrap(screenReturn.expression).children;
    if (!directChildren.some((node) => matchesExpression(node, '<Text style={styles.prompt}>{payload.prompt}</Text>'))
        || !directChildren.some((node) => ts.isJsxExpression(node) && node.expression === conditions[0])) return false;
    // The explanation has one local binding and exactly its condition/text
    // reads. Extra assignments, nested shadows and defaults are not accepted.
    const explanationNames = identifiers('explanation').filter((node) =>
        !ts.isPropertySignature(node.parent) && !ts.isJsxAttribute(node.parent)
        && !(ts.isPropertyAssignment(node.parent) && node.parent.name === node)
        && !(ts.isPropertyAccessExpression(node.parent) && node.parent.name === node));
    const binding = explanationNames.find((node) => ts.isBindingElement(node.parent));
    if (!binding || binding.parent.initializer || binding.parent.propertyName
        || binding.parent.parent !== screen.parameters[0]?.name || explanationNames.length !== 3) return false;
    return true;
}

function lineAt(content, index) {
    return content.slice(0, index).split('\n').length;
}

export function scanSource(content, relativeFile) {
    const issues = [];
    const filePath = path.join(ROOT_DIR, relativeFile);

    for (const rule of RULES) {
        const regex = new RegExp(rule.regex.source, rule.regex.flags);
        let match;
        while ((match = regex.exec(content)) !== null) {
            const details = rule.check(match, content, filePath);
            if (details) {
                issues.push({ rule: rule.id, severity: rule.severity, file: relativeFile, line: lineAt(content, match.index), ...details });
            }
            if (rule.oncePerFile) break;
        }
    }

    return issues;
}

function getAllFiles(dirPath, files = []) {
    let entries;
    try {
        entries = fs.readdirSync(dirPath);
    } catch (error) {
        console.warn(`Skipping unreadable directory: ${dirPath} (${error.message})`);
        return files;
    }

    for (const entry of entries) {
        const absolutePath = path.join(dirPath, entry);
        let stat;
        try {
            stat = fs.statSync(absolutePath);
        } catch (error) {
            console.warn(`Skipping unreadable path: ${absolutePath} (${error.message})`);
            continue;
        }
        if (stat.isDirectory() && !CONFIG.exclude.includes(entry)) getAllFiles(absolutePath, files);
        if (stat.isFile() && CONFIG.extensions.includes(path.extname(entry)) && !CONFIG.exclude.some((excluded) => absolutePath.includes(excluded))) files.push(absolutePath);
    }
    return files;
}

function globMatches(file, pattern) {
    const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replaceAll('**', '::DOUBLE_STAR::').replaceAll('*', '[^/]*').replaceAll('::DOUBLE_STAR::', '.*');
    return new RegExp(`^${escaped}$`).test(file);
}

function isActive(record, now) {
    return new Date(`${record.expiresOn}T23:59:59.999Z`) >= now;
}

function assertPolicyRecord(record, kind) {
    for (const field of ['rule', 'file', 'owner', 'expiresOn', 'reason']) {
        if (!record[field]) throw new Error(`${kind} policy record is missing "${field}".`);
    }
    if (Number.isNaN(new Date(`${record.expiresOn}T00:00:00Z`).valueOf())) throw new Error(`${kind} policy record has an invalid expiresOn date.`);
}

function loadPolicy(policyPath = POLICY_PATH) {
    if (!fs.existsSync(policyPath)) return { baseline: [], exceptions: [] };
    const policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
    if (!Array.isArray(policy.baseline) || !Array.isArray(policy.exceptions)) throw new Error('Visual QA policy must expose baseline and exceptions arrays.');
    policy.baseline.forEach((record) => {
        assertPolicyRecord(record, 'Baseline');
        const hasSingleAllowance = record.signature && Number.isInteger(record.count) && record.count > 0;
        const hasGroupedAllowances = record.allowances && typeof record.allowances === 'object'
            && Object.values(record.allowances).every((count) => Number.isInteger(count) && count > 0);
        if (!hasSingleAllowance && !hasGroupedAllowances) throw new Error('Baseline policy record requires a signature/count pair or allowances map.');
    });
    policy.exceptions.forEach((record) => assertPolicyRecord(record, 'Exception'));
    return policy;
}

export function assessIssues(issues, policy, now = new Date()) {
    const baselineUsed = new Map();
    const report = { excepted: [], baselined: [], regressions: [] };

    for (const issue of issues) {
        const exception = policy.exceptions.find((record) => record.rule === issue.rule && globMatches(issue.file, record.file));
        if (exception && isActive(exception, now)) {
            report.excepted.push({ ...issue, policy: exception });
            continue;
        }

        const baselineIndex = policy.baseline.findIndex((record) => {
            const allowance = record.signature === issue.signature ? record.count : record.allowances?.[issue.signature];
            return record.rule === issue.rule && record.file === issue.file && allowance && isActive(record, now);
        });
        if (baselineIndex !== -1) {
            const record = policy.baseline[baselineIndex];
            const allowance = record.signature === issue.signature ? record.count : record.allowances[issue.signature];
            const usageKey = `${baselineIndex}:${issue.signature}`;
            const used = baselineUsed.get(usageKey) || 0;
            if (used < allowance) {
                baselineUsed.set(usageKey, used + 1);
                report.baselined.push({ ...issue, policy: policy.baseline[baselineIndex] });
                continue;
            }
        }

        const expired = policy.exceptions.find((record) => record.rule === issue.rule && globMatches(issue.file, record.file) && !isActive(record, now))
            || policy.baseline.find((record) => {
                const allowance = record.signature === issue.signature ? record.count : record.allowances?.[issue.signature];
                return record.rule === issue.rule && record.file === issue.file && allowance && !isActive(record, now);
            });
        report.regressions.push(expired ? { ...issue, policy: expired, msg: `${issue.msg} Policy exception expired on ${expired.expiresOn}.` } : issue);
    }
    return report;
}

function scanProject() {
    const issues = [];
    let filesScanned = 0;
    for (const dir of CONFIG.scanPaths) {
        if (!fs.existsSync(dir)) continue;
        for (const file of getAllFiles(dir)) {
            filesScanned++;
            const relativeFile = path.relative(ROOT_DIR, file);
            issues.push(...scanSource(fs.readFileSync(file, 'utf8'), relativeFile));
        }
    }
    return { issues, filesScanned };
}

function printIssues(title, issues, icon) {
    if (issues.length === 0) return;
    console.log(`\n${title}`);
    for (const issue of issues) console.log(`   ${icon} ${issue.file}:${issue.line} [${issue.rule}] ${issue.msg}`);
}

function printBaselineTemplate(issues) {
    const counts = new Map();
    for (const issue of issues) {
        const key = `${issue.rule}\u0000${issue.file}\u0000${issue.signature}`;
        counts.set(key, (counts.get(key) || 0) + 1);
    }
    const grouped = new Map();
    for (const [key, count] of counts) {
        const [rule, file, signature] = key.split('\u0000');
        const groupKey = `${rule}\u0000${file}`;
        const group = grouped.get(groupKey) || { rule, file, allowances: {}, owner: 'design-system', expiresOn: '2026-11-30', reason: 'Token migration tracked in plan 5 of the Medalhão track (FILA 67).' };
        group.allowances[signature] = count;
        grouped.set(groupKey, group);
    }
    const baseline = [...grouped.values()];
    console.log(JSON.stringify({ baseline, exceptions: [] }, null, 2));
}

export function main(argv = process.argv.slice(2)) {
    const strictMode = argv.includes('--strict');
    const auditMode = argv.includes('--audit');
    const { issues, filesScanned } = scanProject();
    if (argv.includes('--print-baseline')) {
        printBaselineTemplate(issues);
        return 0;
    }
    const report = assessIssues(issues, loadPolicy());
    const highRegressions = report.regressions.filter((issue) => issue.severity === 'high');

    console.log('👁  Starting Radiant Visual QA...');
    printIssues('Unapproved regressions:', report.regressions, '🔴');
    if (auditMode) {
        printIssues('Active, scoped exceptions:', report.excepted, '🟡');
        printIssues('Baseline migration debt:', report.baselined, '🔵');
    }
    console.log('\n------------------------------------------------');
    console.log(`Scanned ${filesScanned} files.`);
    console.log(`Found ${issues.length} issues: ${report.regressions.length} regressions, ${report.baselined.length} baselined, ${report.excepted.length} scoped exceptions.`);

    if (highRegressions.length > 0 || (strictMode && report.regressions.length > 0)) {
        console.log('\n❌ Visual QA failed. Resolve the regression or add a time-bound policy entry.');
        return 1;
    }
    console.log('\n✅ Visual QA passed without unapproved regressions.');
    return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(main());
