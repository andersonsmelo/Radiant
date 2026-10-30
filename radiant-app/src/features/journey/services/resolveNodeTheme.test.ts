import { resolveNodeTheme } from './resolveNodeTheme';

describe('resolveNodeTheme', () => {
    it('usa o tema do próprio nó quando ele existe', () => {
        expect(resolveNodeTheme({ theme: 'tubo' }, { theme: 'tomografia' })).toBe('tubo');
    });

    it('cai para o tema da unidade quando o nó não tem tema', () => {
        expect(resolveNodeTheme({}, { theme: 'tomografia' })).toBe('tomografia');
    });

    it('cai para radiacao quando a unidade tem um tema que não é de ilustração', () => {
        expect(resolveNodeTheme({}, { theme: 'qualquer-coisa' })).toBe('radiacao');
    });

    it('cai para radiacao quando nem o nó nem a unidade têm tema', () => {
        expect(resolveNodeTheme({})).toBe('radiacao');
        expect(resolveNodeTheme({}, {})).toBe('radiacao');
    });
});
