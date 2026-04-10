
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

// Config
const CONFIG = {
    extensions: ['.tsx', '.ts'],
    exclude: ['node_modules', 'dist', 'build', '.expo', 'ui/styles.ts'], // styles.ts is allowed to define numbers
    scanPaths: [
        path.join(SRC_DIR, 'features'),
        path.join(SRC_DIR, 'ui'), // Scan UI too, but exclude styles.ts above
        path.join(SRC_DIR, 'app'),
    ],
    allowedSpacings: [0, 1, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, '-4', '-8', '100%', '50%'], // Common valid values
    allowedRadius: [0, 2, 4, 8, 12, 16, 20, 24, 100, 999],
};

// Rules
const RULES = {
    R1: {
        id: 'R1',
        severity: 'high',
        description: 'Magic Number in Layout',
        regex: /(margin|padding|gap|borderRadius|width|height)(Horizontal|Vertical|Top|Bottom|Left|Right)?\s*:\s*([0-9]+)/g,
        check: (match, content, file) => {
            if (file.includes('styles.ts')) return null; // Ignore styles definition
            const prop = match[1];
            const val = parseInt(match[3], 10);

            if (prop.includes('Radius')) {
                if (!CONFIG.allowedRadius.includes(val)) return `Found radius: ${val}. Use radius.* tokens.`;
            } else if (prop.includes('width') || prop.includes('height')) {
                // Width/Height are lenient, but warn on weird odd numbers if needed.
                // For now, let's skip width/height magic number checks as they vary wildly (e.g. icons).
                return null;
            } else {
                if (!CONFIG.allowedSpacings.includes(val)) return `Found spacing: ${val}. Use space.* tokens.`;
            }
            return null;
        }
    },
    R2: {
        id: 'R2',
        severity: 'warning',
        description: 'Redefining Primitives',
        regex: /(container|screen|center):\s*\{/g,
        check: (match, content, file) => {
            if (file.includes('styles.ts')) return null;
            return 'Local definition of "container", "screen" or "center". Check if you can use layout.* primitives.';
        }
    },
    R3: {
        id: 'R3',
        severity: 'warning',
        description: 'Inline Numeric Style',
        regex: /style=\{\{\s*.*?(margin|padding).*?:\s*([0-9]+).*?\}\}/g,
        check: (match, content, file) => {
            // Very basic regex, might be flaky.
            // match[2] is the number
            const val = parseInt(match[2], 10);
            if (!CONFIG.allowedSpacings.includes(val)) return `Inline style magic number: ${val}.`;
            return null;
        }
    },
    R4: {
        id: 'R4',
        severity: 'high',
        description: 'Unauthorized Animation',
        regex: /from\s+['"](react-native-reanimated|react-native\/Libraries\/Animated\/Animated)['"]|Animated\.timing/g,
        check: (match, content, file) => {
            if (file.includes('ui/motion.ts')) return null;
            return 'Direct animation usage detected. Use helpers from src/ui/motion.ts.';
        }
    },
    R5: {
        id: 'R5',
        severity: 'warning',
        description: 'Character Misuse',
        regex: /(CharacterSlot|PixelIllustration)/g,
        check: (match, content, file) => {
            if (file.includes(`${path.sep}ui${path.sep}characters${path.sep}`)) return null;
            // Allow listing
            const allowed = ['Home', 'Start', 'Finish', 'Intro', 'Summary', 'Character', 'Checkpoint', 'Quiz', 'Review', 'JourneyHero', 'PixelIllustration'];
            const fileName = path.basename(file);
            const isAllowed = allowed.some(a => fileName.includes(a));

            if (!isAllowed) return `Character usage in potential non-standard screen: ${fileName}. verify archetype rules.`;
            return null;
        }
    }
};

// Utils
function getAllFiles(dirPath, arrayOfFiles) {
    let files = [];
    try {
        files = fs.readdirSync(dirPath);
    } catch (error) {
        console.warn(`Skipping unreadable directory: ${dirPath} (${error.message})`);
        return arrayOfFiles || [];
    }

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(file => {
        const absolutePath = path.join(dirPath, file);
        let stat;

        try {
            stat = fs.statSync(absolutePath);
        } catch (error) {
            console.warn(`Skipping unreadable path: ${absolutePath} (${error.message})`);
            return;
        }

        if (stat.isDirectory()) {
            if (!CONFIG.exclude.includes(file)) {
                arrayOfFiles = getAllFiles(absolutePath, arrayOfFiles);
            }
        } else {
            const ext = path.extname(file);
            if (CONFIG.extensions.includes(ext) && !CONFIG.exclude.some(ex => file.includes(ex))) {
                arrayOfFiles.push(absolutePath);
            }
        }
    });

    return arrayOfFiles;
}

function scanFile(filePath) {
    let content;
    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.warn(`Skipping unreadable file: ${filePath} (${error.message})`);
        return [];
    }

    const errors = [];

    // R1: Regex loop
    let match;
    while ((match = RULES.R1.regex.exec(content)) !== null) {
        const msg = RULES.R1.check(match, content, filePath);
        if (msg) errors.push({ rule: 'R1', msg, severity: RULES.R1.severity });
    }

    // R2
    while ((match = RULES.R2.regex.exec(content)) !== null) {
        const msg = RULES.R2.check(match, content, filePath);
        if (msg) errors.push({ rule: 'R2', msg, severity: RULES.R2.severity });
    }

    // R3 (Inline)
    while ((match = RULES.R3.regex.exec(content)) !== null) {
        const msg = RULES.R3.check(match, content, filePath);
        if (msg) errors.push({ rule: 'R3', msg, severity: RULES.R3.severity });
    }

    // R4
    while ((match = RULES.R4.regex.exec(content)) !== null) {
        const msg = RULES.R4.check(match, content, filePath);
        if (msg) errors.push({ rule: 'R4', msg, severity: RULES.R4.severity });
    }

    // R5
    while ((match = RULES.R5.regex.exec(content)) !== null) {
        const msg = RULES.R5.check(match, content, filePath);
        if (msg) errors.push({ rule: 'R5', msg, severity: RULES.R5.severity });
        break; // Once per file is enough
    }

    return errors;
}

// Main
console.log('👁  Starting Radiant Visual QA...\n');
let totalErrors = 0;
let highSeverity = 0;
let filesScanned = 0;

const strictMode = process.argv.includes('--strict');

CONFIG.scanPaths.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    const files = getAllFiles(dir);
    files.forEach(file => {
        filesScanned++;
        const results = scanFile(file);
        if (results.length > 0) {
            console.log(`📄 ${path.relative(ROOT_DIR, file)}`);
            results.forEach(err => {
                const icon = err.severity === 'high' ? '🔴' : 'Vk';
                console.log(`   ${icon} [${err.rule}] ${err.msg}`);
                if (err.severity === 'high') highSeverity++;
            });
            totalErrors += results.length;
            console.log('');
        }
    });
});

console.log('------------------------------------------------');
console.log(`Scanned ${filesScanned} files.`);
console.log(`Found ${totalErrors} potential issues (${highSeverity} high severity).`);

if (highSeverity > 0) {
    console.log('\n❌ High severity issues found. Please fix.');
    process.exit(1);
}

if (strictMode && totalErrors > 0) {
    console.log('\n❌ Strict mode: Clean run required.');
    process.exit(1);
}

console.log('\n✅ Visual QA Passed.');
process.exit(0);
