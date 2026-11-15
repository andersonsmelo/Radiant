import { STORAGE_KEYS } from '../../constants/storageKeys';
import type { HeartsSnapshot } from '../hearts/hearts.types';
import type { SubscriptionStatus } from '../subscription/subscription.types';
import { ConversionService, SAMPLE_MINUTES } from './ConversionService';

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

// O dia do limite é o do aluno, não o UTC: o defeito da sequência de 2026-11-06
// só aparecia fora de UTC (AGENTS.md, lições de 2026-11-05 e 06). As datas são
// montadas no calendário local, como o relógio do aparelho, e valem em qualquer
// fuso. Mudar `process.env.TZ` dentro do Jest não muda o fuso do Node: o teste
// antigo dependia da máquina e reprovou no CI, que roda em UTC.

function memoryStorage(initial: Record<string, string> = {}) {
    const data = new Map(Object.entries(initial));
    return {
        data,
        getItem: jest.fn(async (key: string) => data.get(key) ?? null),
        setItem: jest.fn(async (key: string, value: string) => { data.set(key, value); }),
    };
}

const unlimitedSnapshot = (until: string): HeartsSnapshot => ({ count: 0, status: 'unlimited', nextRefillAt: null, unlimitedUntil: until });

function build(opts: { status?: SubscriptionStatus; store?: boolean; enabled?: boolean; storage?: ReturnType<typeof memoryStorage> } = {}) {
    const storage = opts.storage ?? memoryStorage();
    const hearts = { setUnlimited: jest.fn(async (until: string | null) => unlimitedSnapshot(until ?? '')) };
    const service = new ConversionService({
        storage,
        hearts,
        subscription: { getStatus: async () => opts.status ?? { kind: 'none' }, storeAvailable: () => opts.store ?? true },
        enabled: () => opts.enabled ?? true,
    });
    return { service, storage, hearts };
}

// 23h30 de 15/11 no relógio do aparelho; no Brasil, o UTC já está no dia 16.
const night = new Date(2026, 10, 15, 23, 30).getTime();
// 01h de 16/11 no relógio do aparelho: dia local novo, o mesmo dia UTC de `night` no Brasil.
const nextLocalDay = new Date(2026, 10, 16, 1, 0).getTime();

describe('ConversionService', () => {
    it('desligado, não convida, não amostra, não conta e não escreve nada', async () => {
        const { service, storage, hearts } = build({ enabled: false });
        expect(await service.takeInvite('hearts-empty', night)).toBeNull();
        expect(await service.takeSample(night)).toBeNull();
        await service.record('screen_opened');
        expect(storage.setItem).not.toHaveBeenCalled();
        expect(hearts.setUnlimited).not.toHaveBeenCalled();
    });

    it('ligado, convida uma vez por dia local, somando os momentos, e conta cada convite visto', async () => {
        const { service } = build();
        expect(await service.takeInvite('hearts-empty', night)).toEqual({ sampleAvailable: true });
        expect(await service.takeInvite('hearts-empty', night + 60_000)).toBeNull();
        expect(await service.takeInvite('unit-complete', night + 60_000)).toBeNull();
        expect(await service.takeInvite('unit-complete', nextLocalDay)).toEqual({ sampleAvailable: false });

        const state = await service.read();
        expect(state.lastInviteDay).toBe('2026-11-16');
        expect(state.counts.invite_seen_hearts_empty).toBe(1);
        expect(state.counts.invite_seen_unit_complete).toBe(1);
    });

    it.each<[string, SubscriptionStatus]>([
        ['assinante', { kind: 'unlimited', expiresAt: '2027-01-01T00:00:00.000Z', willRenew: true }],
        ['pedido pendente', { kind: 'pending', since: '2026-11-15T20:00:00.000Z' }],
    ])('não convida %s', async (_nome, status) => {
        const { service, storage } = build({ status });
        expect(await service.takeInvite('hearts-empty', night)).toBeNull();
        expect(storage.setItem).not.toHaveBeenCalled();
    });

    it('não convida sem loja neste aparelho', async () => {
        const { service } = build({ store: false });
        expect(await service.takeInvite('hearts-empty', night)).toBeNull();
    });

    it('ex-assinante recebe convite, mas não a amostra', async () => {
        const { service, hearts } = build({ status: { kind: 'expired', expiredAt: '2026-10-01T00:00:00.000Z' } });
        expect(await service.takeInvite('hearts-empty', night)).toEqual({ sampleAvailable: false });
        expect(await service.takeSample(night)).toBeNull();
        expect(hearts.setUnlimited).not.toHaveBeenCalled();
    });

    it(`a amostra dá ${SAMPLE_MINUTES} minutos de vidas ilimitadas, uma vez por aparelho`, async () => {
        const { service, hearts } = build();
        const snapshot = await service.takeSample(night);
        expect(hearts.setUnlimited).toHaveBeenCalledWith(new Date(night + SAMPLE_MINUTES * 60_000).toISOString(), night);
        expect(snapshot?.status).toBe('unlimited');
        expect(SAMPLE_MINUTES).toBeGreaterThan(0);

        expect(await service.takeSample(nextLocalDay)).toBeNull();
        expect(hearts.setUnlimited).toHaveBeenCalledTimes(1);
        const state = await service.read();
        expect(state.sampleTakenAt).toBe(new Date(night).toISOString());
        expect(state.counts.sample_taken).toBe(1);
        // Depois de usada, o convite não a oferece mais.
        expect(await service.takeInvite('hearts-empty', nextLocalDay)).toEqual({ sampleAvailable: false });
    });

    it('a amostra só vale no momento das vidas esgotadas', async () => {
        const { service } = build();
        expect(await service.takeInvite('unit-complete', night)).toEqual({ sampleAvailable: false });
    });

    it('conta as etapas do funil na chave registrada', async () => {
        const { service, storage } = build();
        await service.record('screen_opened');
        await service.record('purchase_started');
        await service.record('purchase_started');
        await service.record('purchase_completed');
        const saved = JSON.parse(storage.data.get(STORAGE_KEYS.CONVERSION)!);
        expect(saved.schemaVersion).toBe(1);
        expect(saved.counts).toEqual({
            invite_seen_hearts_empty: 0, invite_seen_unit_complete: 0, screen_opened: 1,
            purchase_started: 2, purchase_completed: 1, sample_taken: 0,
        });
    });

    it('não grava por cima de um store de versão mais nova, e não convida (G7)', async () => {
        const raw = JSON.stringify({ schemaVersion: 2, qualquer: true });
        const storage = memoryStorage({ [STORAGE_KEYS.CONVERSION]: raw });
        const { service } = build({ storage });
        expect(await service.takeInvite('hearts-empty', night)).toBeNull();
        expect(await service.takeSample(night)).toBeNull();
        await service.record('screen_opened');
        expect(storage.data.get(STORAGE_KEYS.CONVERSION)).toBe(raw);
    });

    it('store ilegível vira estado vazio, sem derrubar o convite', async () => {
        const storage = memoryStorage({ [STORAGE_KEYS.CONVERSION]: '{quebrado' });
        const { service } = build({ storage });
        expect(await service.takeInvite('hearts-empty', night)).toEqual({ sampleAvailable: true });
    });

    it('espiar o convite não grava; só marcar o visto consome o dia e conta', async () => {
        const { service, storage } = build();
        expect(await service.peekInvite('hearts-empty', night)).toEqual({ sampleAvailable: true });
        expect(storage.setItem).not.toHaveBeenCalled();
        await service.markInviteSeen('hearts-empty', night);
        expect(await service.peekInvite('hearts-empty', night)).toBeNull();
        expect((await service.read()).counts.invite_seen_hearts_empty).toBe(1);
    });

    it('toque duplo na amostra dá uma só', async () => {
        const { service, hearts } = build();
        const [a, b] = await Promise.all([service.takeSample(night), service.takeSample(night)]);
        expect(hearts.setUnlimited).toHaveBeenCalledTimes(1);
        expect([a, b].filter(Boolean)).toHaveLength(2); // a mesma promessa para os dois toques
        expect((await service.read()).counts.sample_taken).toBe(1);
    });

    it('contagens simultâneas não se perdem', async () => {
        const { service } = build();
        await Promise.all([service.record('purchase_started'), service.record('purchase_started'), service.record('purchase_completed')]);
        const { counts } = await service.read();
        expect(counts.purchase_started).toBe(2);
        expect(counts.purchase_completed).toBe(1);
    });

    it('se as vidas não forem gravadas, a amostra não fica marcada como usada', async () => {
        const { service, hearts } = build();
        hearts.setUnlimited.mockRejectedValueOnce(new Error('disco cheio'));
        jest.spyOn(console, 'error').mockImplementation(() => undefined);
        expect(await service.takeSample(night)).toBeNull();
        expect((await service.read()).sampleTakenAt).toBeNull();
        expect(await service.takeSample(night)).not.toBeNull();
    });

    it('falha do armazenamento não vira rejeição: não convida, não conta e não quebra a tela', async () => {
        const storage = memoryStorage();
        storage.getItem.mockRejectedValue(new Error('sem acesso'));
        const { service } = build({ storage });
        jest.spyOn(console, 'error').mockImplementation(() => undefined);
        await expect(service.peekInvite('hearts-empty', night)).resolves.toBeNull();
        await expect(service.markInviteSeen('hearts-empty', night)).resolves.toBeUndefined();
        await expect(service.record('screen_opened')).resolves.toBeUndefined();
        await expect(service.takeSample(night)).resolves.toBeNull();
        await expect(service.read()).resolves.toMatchObject({ lastInviteDay: null });
    });
});
