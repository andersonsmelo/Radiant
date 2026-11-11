import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import * as ts from 'typescript';
import { EDITORIAL_LOCAL_DIAGRAMS, resolveEditorialLocalDiagram } from './EditorialLocalDiagrams';

jest.mock('../../../assets/content/rtg-2026/pilot/view-front.png', () => (101));
jest.mock('../../../assets/content/rtg-2026/pilot/view-back.png', () => (102));
jest.mock('../../../assets/content/rtg-2026/pilot/marker-a.png', () => (103));
jest.mock('../../../assets/content/rtg-2026/pilot/marker-b.png', () => (104));

const root = resolve(__dirname, '../../../..');
const manifest = JSON.parse(readFileSync(resolve(root, 'docs/evidence/2026-11-03-pc04-pilot-manifest.json'), 'utf8')) as {
    assets: { id: string; renderPath: string; renderSha256: string; width: number; height: number }[];
};
const codePath = resolve(__dirname, 'EditorialLocalDiagrams.ts');

describe('PC06-B bundled diagram registry', () => {
    it('binds each actual static Metro require to the source file declared by the manifest', () => {
        const ast = ts.createSourceFile(codePath, readFileSync(codePath, 'utf8'), ts.ScriptTarget.Latest, true);
        const imports = new Map<string, string>();
        const visit = (node: ts.Node) => {
            if (ts.isObjectLiteralExpression(node)) {
                const fields = new Map(node.properties.filter(ts.isPropertyAssignment).map(prop => [prop.name.getText(ast), prop.initializer]));
                const id = fields.get('id'), source = fields.get('source');
                if (id && ts.isStringLiteral(id) && id.text.startsWith('asset:rtg-2026:') && source
                    && ts.isCallExpression(source) && source.expression.getText(ast) === 'require'
                    && source.arguments.length === 1 && ts.isStringLiteral(source.arguments[0]))
                    imports.set(id.text, resolve(dirname(codePath), source.arguments[0].text));
            }
            ts.forEachChild(node, visit);
        };
        visit(ast);
        expect(imports.size).toBe(4);
        manifest.assets.forEach(asset => expect(imports.get(asset.id)).toBe(resolve(root, asset.renderPath)));
    });

    it('verifies the actual PNG bytes and dimensions against both registry and approved source manifest', () => {
        expect(EDITORIAL_LOCAL_DIAGRAMS).toHaveLength(4);
        expect(new Set(EDITORIAL_LOCAL_DIAGRAMS.map(local => local.source)).size).toBe(4);
        EDITORIAL_LOCAL_DIAGRAMS.forEach(local => {
            const asset = manifest.assets.find(asset => asset.id === local.id)!;
            const bytes = readFileSync(resolve(root, asset.renderPath));
            expect(createHash('sha256').update(bytes).digest('hex')).toBe(local.sha256);
            expect(local.sha256).toBe(asset.renderSha256);
            expect(bytes.readUInt32BE(16)).toBe(local.width);
            expect(bytes.readUInt32BE(20)).toBe(local.height);
            expect(local.width).toBe(asset.width); expect(local.height).toBe(asset.height);
            expect(resolveEditorialLocalDiagram(local)).toEqual({ source: local.source, width: 800, height: 1000 });
        });
    });

    it('refuses an unknown identity, URI or hash with no remote fallback', () => {
        const first = EDITORIAL_LOCAL_DIAGRAMS[0];
        for (const changed of [{ ...first, id: 'asset:other' }, { ...first, uri: 'https://example.invalid/other.png' }, { ...first, sha256: '0'.repeat(64) }])
            expect(resolveEditorialLocalDiagram(changed)).toBeNull();
    });
});
