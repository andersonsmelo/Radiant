import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
        check: (_match, _content, file) => {
            if (file.includes(`${path.sep}ui${path.sep}characters${path.sep}`)) return null;
            const allowed = ['Home', 'Start', 'Finish', 'Intro', 'Summary', 'Character', 'Checkpoint', 'Quiz', 'Review', 'JourneyHero', 'PixelIllustration'];
            return allowed.some((name) => path.basename(file).includes(name))
                ? null
                : { signature: 'character-usage', msg: `Character usage in potential non-standard screen: ${path.basename(file)}. verify archetype rules.` };
        },
        oncePerFile: true,
    },
];

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
        const group = grouped.get(groupKey) || { rule, file, allowances: {}, owner: 'design-system', expiresOn: '2026-10-23', reason: 'Token migration tracked in docs/plans/2026-07-23-radiant-continuation-roadmap.md.' };
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
