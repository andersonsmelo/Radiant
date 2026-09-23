/**
 * Guardas da ADR 2026-09-23 (decisões do dono), item 3: kill switch só existe
 * se for acionável e se alguém o ler.
 *
 * Em 2026-08-24 o `STATUS.md` mediu que `ENABLE_REVIEW`, `ENABLE_GAMIFICATION`,
 * `ENABLE_ONBOARDING` e `ENABLE_HEURISTICS` eram constantes fixas em `true`:
 * nem build nem OTA os desligava, e três deles ninguém lia. O nome prometia um
 * interruptor justamente na hora do incidente.
 *
 * Toda guarda aqui lê a AST do TypeScript, nunca o texto do fonte: uma guarda
 * de texto casaria com o comentário que documenta a regra (AGENTS.md, "Quatro
 * lições sobre GUARDAS", regra 3).
 */
import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const SRC = path.resolve(__dirname, '..');

/**
 * Flags acionáveis por ambiente que ninguém lê, fora do escopo da ADR de
 * 2026-09-23 — medidas pela primeira vez por esta guarda. Não são apagadas
 * aqui porque o dono não decidiu sobre elas. Sair desta lista exige ganhar um
 * leitor ou ser apagada; a guarda seguinte reprova exceção que envelheceu.
 */
const SEM_LEITOR_POR_DECISAO_PENDENTE: Record<string, string> = {
    ENABLE_PRODUCT_ANALYTICS: 'zero leitores; sem ADR que a sustente — decisão do dono pendente',
    ENABLE_REVENUECAT: 'mantida como "sinal de intenção" pela ADR 2026-07-31, mas a ADR 2026-09-15 vetou RevenueCat — decisão do dono pendente',
};
const CONFIG = path.join(SRC, 'config.ts');

function ast(arquivo: string): ts.SourceFile {
    return ts.createSourceFile(arquivo, fs.readFileSync(arquivo, 'utf8'), ts.ScriptTarget.Latest, true);
}

function visitar(no: ts.Node, visita: (no: ts.Node) => void): void {
    visita(no);
    ts.forEachChild(no, (filho) => visitar(filho, visita));
}

function arquivosDeProducao(dir: string): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entrada) => {
        const caminho = path.join(dir, entrada.name);
        if (entrada.isDirectory()) return entrada.name === '__tests__' ? [] : arquivosDeProducao(caminho);
        if (!/\.tsx?$/.test(entrada.name) || /\.(test|stories)\.tsx?$/.test(entrada.name)) return [];
        return [caminho];
    });
}

function ehLiteralBooleano(no: ts.Expression): boolean {
    return no.kind === ts.SyntaxKind.TrueKeyword || no.kind === ts.SyntaxKind.FalseKeyword;
}

/** As propriedades `ENABLE_*` do objeto literal `export const AppConfig = {...}`. */
function flagsDoAppConfig(): Map<string, ts.Expression> {
    const fonte = ast(CONFIG);
    const flags = new Map<string, ts.Expression>();
    visitar(fonte, (no) => {
        if (!ts.isVariableDeclaration(no) || !ts.isIdentifier(no.name) || no.name.text !== 'AppConfig') return;
        if (no.initializer === undefined || !ts.isObjectLiteralExpression(no.initializer)) return;
        for (const prop of no.initializer.properties) {
            if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name) && prop.name.text.startsWith('ENABLE_')) {
                flags.set(prop.name.text, prop.initializer);
            }
        }
    });
    return flags;
}

/** Nomes lidos como `AppConfig.<NOME>` no código de produção, fora do próprio `config.ts`. */
function flagsLidas(): Set<string> {
    const lidas = new Set<string>();
    for (const arquivo of arquivosDeProducao(SRC)) {
        if (arquivo === CONFIG) continue;
        visitar(ast(arquivo), (no) => {
            if (ts.isPropertyAccessExpression(no) && ts.isIdentifier(no.expression) && no.expression.text === 'AppConfig') {
                lidas.add(no.name.text);
            }
        });
    }
    return lidas;
}

describe('kill switches do AppConfig (ADR 2026-09-23)', () => {
    it('encontra as flags — a guarda não passa vazia', () => {
        const flags = flagsDoAppConfig();
        expect(flags.size).toBeGreaterThanOrEqual(5);
        expect(flags.has('ENABLE_LEARNING_ROAD')).toBe(true);
        expect(flags.has('ENABLE_REVIEW')).toBe(true);
    });

    it('nenhuma flag ENABLE_* é constante fixa: toda uma é acionável', () => {
        const fixas = [...flagsDoAppConfig()]
            .filter(([, valor]) => ehLiteralBooleano(valor))
            .map(([nome]) => nome);
        expect(fixas).toEqual([]);
    });

    it('toda flag ENABLE_* tem leitor no código de produção, salvo as exceções nomeadas', () => {
        const lidas = flagsLidas();
        const semLeitor = [...flagsDoAppConfig().keys()].filter((nome) => !lidas.has(nome));
        expect(semLeitor.filter((nome) => !(nome in SEM_LEITOR_POR_DECISAO_PENDENTE))).toEqual([]);
    });

    it('as exceções continuam sem leitor e existindo — a lista não envelhece', () => {
        const flags = flagsDoAppConfig();
        const lidas = flagsLidas();
        const vencidas = Object.keys(SEM_LEITOR_POR_DECISAO_PENDENTE)
            .filter((nome) => !flags.has(nome) || lidas.has(nome));
        expect(vencidas).toEqual([]);
    });

    it('ENABLE_REVIEW lê EXPO_PUBLIC_ENABLE_REVIEW, com padrão ligado', () => {
        const valor = flagsDoAppConfig().get('ENABLE_REVIEW');
        expect(valor).toBeDefined();
        if (valor === undefined) return;

        expect(ts.isCallExpression(valor)).toBe(true);
        if (!ts.isCallExpression(valor)) return;
        const [variavel, padrao] = valor.arguments;

        expect(ts.isIdentifier(valor.expression) && valor.expression.text).toBe('readBooleanFlag');
        expect(variavel !== undefined && ts.isPropertyAccessExpression(variavel) && variavel.name.text)
            .toBe('EXPO_PUBLIC_ENABLE_REVIEW');
        expect(variavel !== undefined && ts.isPropertyAccessExpression(variavel)
            && ts.isPropertyAccessExpression(variavel.expression)
            && variavel.expression.getText()).toBe('process.env');
        expect(padrao?.kind).toBe(ts.SyntaxKind.TrueKeyword);
    });

    it('nenhum módulo declara um ENABLE_* local fixo, fora do AppConfig', () => {
        const locais: string[] = [];
        for (const arquivo of arquivosDeProducao(SRC)) {
            const fonte = ast(arquivo);
            visitar(fonte, (no) => {
                if (ts.isVariableDeclaration(no) && ts.isIdentifier(no.name) && no.name.text.startsWith('ENABLE_')
                    && no.initializer !== undefined && ehLiteralBooleano(no.initializer)) {
                    locais.push(`${path.relative(SRC, arquivo)}: ${no.name.text}`);
                }
            });
        }
        expect(locais).toEqual([]);
    });
});
