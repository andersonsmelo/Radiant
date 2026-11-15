import { act, renderHook } from '@testing-library/react-native';

import { useConversionInvite, useUnlimitedExpiry } from './useConversionInvite';

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

const AGORA = Date.parse('2026-11-15T12:00:00.000Z');

type Invite = { sampleAvailable: boolean } | null;
type FakeService = {
    resolve(value: Invite): void;
    peekInvite: jest.Mock<Promise<Invite>, []>;
    markInviteSeen: jest.Mock<Promise<undefined>, [string, number]>;
    takeInvite: jest.Mock<Promise<Invite>, ['hearts-empty' | 'unit-complete', number]>;
    takeSample: jest.Mock<Promise<null>, []>;
};

function fakeService(): FakeService {
    let resolvePeek: ((value: { sampleAvailable: boolean } | null) => void) | undefined;
    const service: FakeService = {
        resolve: (value: { sampleAvailable: boolean } | null) => resolvePeek?.(value),
        peekInvite: jest.fn(() => new Promise<{ sampleAvailable: boolean } | null>((resolve) => { resolvePeek = resolve; })),
        markInviteSeen: jest.fn(async (_moment: string, _nowMs: number) => undefined),
        // O caminho de uma chamada só, como o serviço oferece para quem não tem tela.
        takeInvite: jest.fn(async (moment: 'hearts-empty' | 'unit-complete', nowMs: number) => {
            const invite = await service.peekInvite();
            if (invite) await service.markInviteSeen(moment, nowMs);
            return invite;
        }),
        takeSample: jest.fn(async () => null),
    };
    return service;
}

describe('useConversionInvite', () => {
    it('marca o convite como visto só quando ele chega à tela', async () => {
        const service = fakeService();
        const { result } = renderHook(() => useConversionInvite('hearts-empty', true, service, () => AGORA));
        expect(service.markInviteSeen).not.toHaveBeenCalled();
        await act(async () => { service.resolve({ sampleAvailable: true }); });
        expect(result.current.invite).toEqual({ sampleAvailable: true });
        expect(service.markInviteSeen).toHaveBeenCalledWith('hearts-empty', AGORA);
    });

    it('folha fechada antes da decisão: o dia não é consumido nem contado', async () => {
        const service = fakeService();
        const { rerender } = renderHook(({ active }: { active: boolean }) => useConversionInvite('hearts-empty', active, service, () => AGORA),
            { initialProps: { active: true } });
        rerender({ active: false });
        await act(async () => { service.resolve({ sampleAvailable: true }); });
        expect(service.markInviteSeen).not.toHaveBeenCalled();
    });

    it('sem convite, nada é marcado', async () => {
        const service = fakeService();
        renderHook(() => useConversionInvite('unit-complete', true, service, () => AGORA));
        await act(async () => { service.resolve(null); });
        expect(service.markInviteSeen).not.toHaveBeenCalled();
    });
});

describe('useUnlimitedExpiry', () => {
    beforeEach(() => { jest.useFakeTimers(); });
    afterEach(() => { jest.useRealTimers(); });

    it('avisa quando as vidas ilimitadas acabam, para a tela reler o estado', () => {
        const onExpire = jest.fn();
        renderHook(() => useUnlimitedExpiry('2026-11-15T12:30:00.000Z', onExpire, () => AGORA));
        act(() => { jest.advanceTimersByTime(30 * 60_000 - 1); });
        expect(onExpire).not.toHaveBeenCalled();
        act(() => { jest.advanceTimersByTime(1_000); });
        expect(onExpire).toHaveBeenCalledTimes(1);
    });

    it('sem data, ou além do que um timer aguenta (assinatura anual), não agenda nada', () => {
        const onExpire = jest.fn();
        renderHook(() => useUnlimitedExpiry(null, onExpire, () => AGORA));
        renderHook(() => useUnlimitedExpiry('2027-11-15T12:00:00.000Z', onExpire, () => AGORA));
        act(() => { jest.advanceTimersByTime(2 ** 31); });
        expect(onExpire).not.toHaveBeenCalled();
    });
});
