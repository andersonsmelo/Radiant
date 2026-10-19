import { hasUnknownSchemaVersion, rawHasUnknownSchemaVersion } from './schemaVersionGuard';

const KNOWN = ['store.v1', 'store.v2'] as const;

describe('hasUnknownSchemaVersion', () => {
    it('reconhece um schemaVersion declarado que não está na lista', () => {
        expect(hasUnknownSchemaVersion({ schemaVersion: 'store.v3' }, KNOWN)).toBe(true);
        expect(hasUnknownSchemaVersion({ schemaVersion: 2 }, [1])).toBe(true);
        expect(hasUnknownSchemaVersion({ schemaVersion: null }, KNOWN)).toBe(true);
    });

    it('não confunde texto com número', () => {
        expect(hasUnknownSchemaVersion({ schemaVersion: '1' }, [1])).toBe(true);
        expect(hasUnknownSchemaVersion({ schemaVersion: 1 }, ['1'])).toBe(true);
    });

    it('aceita toda versão conhecida', () => {
        expect(hasUnknownSchemaVersion({ schemaVersion: 'store.v1' }, KNOWN)).toBe(false);
        expect(hasUnknownSchemaVersion({ schemaVersion: 'store.v2', extra: true }, KNOWN)).toBe(false);
    });

    it('store sem schemaVersion, ou que nem é objeto, não é de outra versão', () => {
        for (const value of [{}, { cards: {} }, null, undefined, 'texto', 3, [], [{ schemaVersion: 'x' }]]) {
            expect(hasUnknownSchemaVersion(value, KNOWN)).toBe(false);
        }
    });
});

describe('rawHasUnknownSchemaVersion', () => {
    it('lê a string crua', () => {
        expect(rawHasUnknownSchemaVersion('{"schemaVersion":"store.v3"}', KNOWN)).toBe(true);
        expect(rawHasUnknownSchemaVersion('{"schemaVersion":"store.v1"}', KNOWN)).toBe(false);
    });

    it('ausência e JSON quebrado não são de outra versão', () => {
        expect(rawHasUnknownSchemaVersion(null, KNOWN)).toBe(false);
        expect(rawHasUnknownSchemaVersion('{isto não é json', KNOWN)).toBe(false);
    });
});
