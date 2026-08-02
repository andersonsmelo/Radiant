import { resolveAppStoreProps } from './appStoreProps';

describe('resolveAppStoreProps', () => {
    it('devolve locale, market, entry_surface e build_channel', () => {
        const props = resolveAppStoreProps('first_run');

        expect(props).toEqual(
            expect.objectContaining({
                entry_surface: 'first_run',
                build_channel: expect.any(String),
                locale: expect.any(String),
                market: expect.any(String),
            })
        );
    });

    it('deriva o market da região do locale', () => {
        const spy = jest
            .spyOn(Intl, 'DateTimeFormat')
            .mockReturnValue({
                resolvedOptions: () => ({ locale: 'pt-BR' }),
            } as unknown as Intl.DateTimeFormat);

        expect(resolveAppStoreProps('first_run').market).toBe('BR');

        spy.mockRestore();
    });

    it('não quebra quando o locale não tem região', () => {
        const spy = jest
            .spyOn(Intl, 'DateTimeFormat')
            .mockReturnValue({
                resolvedOptions: () => ({ locale: 'pt' }),
            } as unknown as Intl.DateTimeFormat);

        expect(resolveAppStoreProps('first_run').market).toBe('unknown');

        spy.mockRestore();
    });
});
