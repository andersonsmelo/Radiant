/**
 * Guardas da ADR 2026-09-23 (StoreKit por módulo Expo local).
 *
 * Toda guarda aqui lê DADO ESTRUTURADO — JSON, a tabela da ADR, a AST do
 * TypeScript —, nunca texto do código-fonte por regex: uma guarda de texto
 * casa com o comentário que documenta a regra e passa com o defeito presente
 * (AGENTS.md, "Quatro lições sobre GUARDAS", regra 3).
 *
 * O que ela NÃO cobre, e por isso não afirma: o Swift. Jest não tem parser de
 * Swift; a ausência de log no módulo nativo foi medida uma vez com
 * `swiftc -dump-parse` e está no relatório da fatia, não aqui.
 */
import fs from 'fs';
import path from 'path';
import ts from 'typescript';

import { RADIANT_STOREKIT_MODULE } from './StoreKit2Adapter';
import { SUBSCRIPTION_PRODUCTS } from './subscriptionProducts';

const APP = path.resolve(__dirname, '../../..');
const MODULO = path.join(APP, 'modules/radiant-storekit');
const ADR_PRODUTOS = path.resolve(APP, '../docs/adr/ADR-2026-09-15-radiant-ilimitado-storekit-products.md');

function lerJson(arquivo: string): Record<string, unknown> {
    return JSON.parse(fs.readFileSync(arquivo, 'utf8')) as Record<string, unknown>;
}

function ast(arquivo: string): ts.SourceFile {
    return ts.createSourceFile(arquivo, fs.readFileSync(arquivo, 'utf8'), ts.ScriptTarget.Latest, true);
}

function visitar(no: ts.Node, visita: (no: ts.Node) => void): void {
    visita(no);
    ts.forEachChild(no, (filho) => visitar(filho, visita));
}

/** Chamadas `console.<qualquer>(...)` dentro de `raiz`, com a linha de cada uma. */
function chamadasDeConsole(raiz: ts.Node, fonte: ts.SourceFile): string[] {
    const achadas: string[] = [];
    visitar(raiz, (no) => {
        if (!ts.isCallExpression(no)) return;
        const alvo = no.expression;
        if (ts.isPropertyAccessExpression(alvo) && ts.isIdentifier(alvo.expression) && alvo.expression.text === 'console') {
            achadas.push(`${alvo.getText(fonte)} na linha ${fonte.getLineAndCharacterOfPosition(no.getStart()).line + 1}`);
        }
    });
    return achadas;
}

/** Primeiro argumento literal de cada `requireOptionalNativeModule(...)`. */
function nomesResolvidos(fonte: ts.SourceFile): string[] {
    const nomes: string[] = [];
    visitar(fonte, (no) => {
        if (ts.isCallExpression(no) && ts.isIdentifier(no.expression)
            && no.expression.text === 'requireOptionalNativeModule') {
            const [primeiro] = no.arguments;
            nomes.push(primeiro !== undefined && ts.isStringLiteral(primeiro) ? primeiro.text : '<não literal>');
        }
    });
    return nomes;
}

/** Product IDs da tabela "Produtos" da ADR, lida por coluna, não por padrão de texto. */
function productIdsDaAdr(): string[] {
    const linhas = fs.readFileSync(ADR_PRODUTOS, 'utf8').split('\n').filter((linha) => linha.startsWith('|'));
    const celulas = (linha: string) => linha.split('|').slice(1, -1).map((celula) => celula.trim());
    const cabecalho = linhas.findIndex((linha) => celulas(linha).includes('Product ID'));
    if (cabecalho < 0) throw new Error('A ADR de produtos não tem mais a coluna "Product ID".');
    const coluna = celulas(linhas[cabecalho]).indexOf('Product ID');
    return linhas
        .slice(cabecalho + 2)
        .map((linha) => celulas(linha)[coluna]?.replace(/`/g, ''))
        .filter((id): id is string => typeof id === 'string' && id.length > 0);
}

describe('radiant-storekit — ADR 2026-09-23', () => {
    it('o módulo não declara dependência npm nenhuma (regra 1)', () => {
        const pacote = lerJson(path.join(MODULO, 'package.json'));

        for (const campo of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
            expect({ campo, valor: pacote[campo] ?? null }).toEqual({ campo, valor: null });
        }
    });

    it('o app não ganha biblioteca de compra: nenhum terceiro no caminho da compra (regra 1)', () => {
        const pacote = lerJson(path.join(APP, 'package.json'));
        const nomes = ['dependencies', 'devDependencies', 'optionalDependencies'].flatMap((campo) =>
            Object.keys((pacote[campo] as Record<string, string> | undefined) ?? {}));

        const deCompra = nomes.filter((nome) => /(^|[-/@])(iap|purchases?|revenuecat|storekit|in-app)([-/]|$)/i.test(nome));

        expect(deCompra).toEqual([]);
    });

    it('o módulo é só Apple, com exatamente o módulo Swift da fatia (regra 6)', () => {
        const config = lerJson(path.join(MODULO, 'expo-module.config.json'));

        expect(config).toEqual({ platforms: ['apple'], apple: { modules: ['RadiantStoreKitModule'] } });
    });

    it('os produtos do app são exatamente os da tabela da ADR de produtos, sem alias', () => {
        expect(Object.keys(SUBSCRIPTION_PRODUCTS).sort()).toEqual(productIdsDaAdr().sort());
        expect(productIdsDaAdr()).toHaveLength(2);
    });

    it('o adaptador e o ponto de entrada do módulo resolvem o MESMO nome nativo', () => {
        // Uma asserção só sobre os dois literais acoplados: afirmar cada um
        // separadamente nunca provaria que concordam.
        const doIndex = nomesResolvidos(ast(path.join(MODULO, 'index.ts')));

        expect(doIndex).toEqual([RADIANT_STOREKIT_MODULE]);
    });

    it('nenhum console.* dentro do adaptador StoreKit nem no ponto de entrada do módulo (regra 5)', () => {
        const adaptador = ast(path.join(__dirname, 'StoreKit2Adapter.ts'));
        const classe = adaptador.statements.find(
            (no): no is ts.ClassDeclaration => ts.isClassDeclaration(no) && no.name?.text === 'StoreKit2Adapter',
        );
        if (classe === undefined) throw new Error('A classe StoreKit2Adapter sumiu do arquivo; a guarda não tem o que ler.');
        const index = ast(path.join(MODULO, 'index.ts'));

        expect({
            adaptador: chamadasDeConsole(classe, adaptador),
            index: chamadasDeConsole(index, index),
        }).toEqual({ adaptador: [], index: [] });
    });
});
