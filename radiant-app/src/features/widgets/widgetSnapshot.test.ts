import { buildWidgetSnapshot, WIDGET_SNAPSHOT_SCHEMA_VERSION, type WidgetSource } from './widgetSnapshot';

// O StreakFreezeService importa o AsyncStorage; a função pura não o usa.
jest.mock('@react-native-async-storage/async-storage', () => ({ getItem: jest.fn(), setItem: jest.fn() }));

// 15 de novembro de 2026, 14h, hora local. As datas abaixo são locais de propósito:
// a virada que importa é a meia-noite do aparelho, não a de UTC.
const NOW = new Date(2026, 10, 15, 14, 0, 0);
const midnight = (dayOffset: number) => new Date(2026, 10, 15 + dayOffset).getTime();

const base: WidgetSource = {
    streakDays: 5,
    lastActiveDate: '2026-11-15',
    freezes: 0,
    goalCompleted: 2,
    goalTarget: 3,
    goalDateKey: '2026-11-15',
    nextLesson: { title: 'Incidências de tórax', url: 'radiantapp://learn?nodeId=n1&blockId=b1' },
};

describe('buildWidgetSnapshot', () => {
    it('declara a versão do esquema e leva a próxima aula', () => {
        const snapshot = buildWidgetSnapshot(base, NOW);
        expect(snapshot.schemaVersion).toBe(1);
        expect(WIDGET_SNAPSHOT_SCHEMA_VERSION).toBe(1);
        expect(snapshot.nextLesson).toEqual(base.nextLesson);
        expect(snapshot.generatedAt).toBe(NOW.getTime());
    });

    it('estudou hoje: a primeira entrada vale agora e hoje conta', () => {
        const [first] = buildWidgetSnapshot(base, NOW).entries;
        expect(first).toEqual({ startsAt: NOW.getTime(), streakDays: 5, countsToday: true, goalCompleted: 2, goalTarget: 3 });
    });

    it('à meia-noite local, sem o app abrir, hoje deixa de contar e a meta zera', () => {
        const { entries } = buildWidgetSnapshot(base, NOW);
        expect(entries[1]).toEqual({ startsAt: midnight(1), streakDays: 5, countsToday: false, goalCompleted: 0, goalTarget: 3 });
    });

    it('dois dias sem estudo e sem proteção: a sequência aparece zerada, não a velha', () => {
        const { entries } = buildWidgetSnapshot(base, NOW);
        expect(entries[2]).toEqual({ startsAt: midnight(2), streakDays: 0, countsToday: false, goalCompleted: 0, goalTarget: 3 });
        // Depois de zerada, nada mais muda: a linha do tempo acaba ali.
        expect(entries).toHaveLength(3);
    });

    it('um dia perdido com proteção guardada: a sequência continua de pé', () => {
        const { entries } = buildWidgetSnapshot({ ...base, freezes: 1 }, NOW);
        expect(entries.map((e) => [e.startsAt, e.streakDays])).toEqual([
            [NOW.getTime(), 5],
            [midnight(1), 5],
            // A segunda meia-noite mostraria o mesmo que a primeira e não vira entrada.
            [midnight(3), 0],
        ]);
    });

    it('meta gravada num dia anterior conta zero hoje', () => {
        const [first] = buildWidgetSnapshot({ ...base, goalDateKey: '2026-11-14' }, NOW).entries;
        expect(first.goalCompleted).toBe(0);
    });

    it('nunca estudou: sequência zero, não o 1 padrão do store', () => {
        const { entries } = buildWidgetSnapshot({ ...base, streakDays: 1, lastActiveDate: null }, NOW);
        expect(entries[0]).toMatchObject({ streakDays: 0, countsToday: false });
    });

    it('estudou ontem: hoje ainda não conta, mas a sequência vale', () => {
        const [first, second] = buildWidgetSnapshot({ ...base, lastActiveDate: '2026-11-14' }, NOW).entries;
        expect(first).toMatchObject({ startsAt: NOW.getTime(), streakDays: 5, countsToday: false });
        expect(second).toMatchObject({ startsAt: midnight(1), streakDays: 0 });
    });

    it('dia igual ao anterior não encerra a linha do tempo: a quebra que vem depois ainda entra', () => {
        const source = { ...base, lastActiveDate: '2026-11-14', freezes: 1, goalDateKey: null };
        const { entries } = buildWidgetSnapshot(source, NOW);
        expect(entries.map((e) => [e.startsAt, e.streakDays])).toEqual([
            [NOW.getTime(), 5],
            [midnight(2), 0],
        ]);
    });

    it('último estudo "no futuro" (viagem para oeste, relógio atrasado): hoje conta, não zera', () => {
        const [first] = buildWidgetSnapshot({ ...base, lastActiveDate: '2026-11-16' }, NOW).entries;
        expect(first).toMatchObject({ streakDays: 5, countsToday: true });
    });

    it('estudo um dia "no futuro" com proteção: a linha do tempo vai até a quebra real, em 19/11', () => {
        // Caso do revisor da PR #77: com política `.never`, sem a quebra o widget mostraria 7 para sempre.
        const source = { ...base, streakDays: 7, lastActiveDate: '2026-11-16', freezes: 1 };
        const { entries } = buildWidgetSnapshot(source, NOW);
        expect(entries.map((e) => [e.startsAt, e.streakDays, e.countsToday])).toEqual([
            [NOW.getTime(), 7, true],
            [midnight(1), 7, true],
            [midnight(2), 7, false],
            // 18/11 é coberto pela proteção e repete o dia anterior; 19/11 é a quebra.
            [midnight(4), 0, false],
        ]);
    });

    it('relógio muito atrasado: o horizonte para em sete dias, e as entradas continuam válidas', () => {
        const source = { ...base, lastActiveDate: '2099-01-01', freezes: 1 };
        const { entries } = buildWidgetSnapshot(source, NOW);
        expect(Math.max(...entries.map((e) => e.startsAt))).toBeLessThanOrEqual(midnight(7));
        expect(entries.every((e) => e.streakDays === 5 && e.countsToday)).toBe(true);
    });

    it('cada virada cai na meia-noite local, mesmo no dia em que o relógio muda', () => {
        // 1º de novembro de 2026 tem 25 h em Nova York; o teste roda também com TZ=America/New_York.
        const source = { ...base, lastActiveDate: '2026-10-31', goalDateKey: '2026-10-31' };
        const { entries } = buildWidgetSnapshot(source, new Date(2026, 9, 31, 14, 0, 0));
        const turns = entries.slice(1).map((e) => new Date(e.startsAt));
        expect(turns.length).toBeGreaterThan(0);
        turns.forEach((turn, index) => {
            expect([turn.getHours(), turn.getMinutes()]).toEqual([0, 0]);
            expect(turn.getDate()).toBe(new Date(2026, 9, 31 + index + 1).getDate());
        });
    });
});
