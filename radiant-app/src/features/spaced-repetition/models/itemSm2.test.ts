import { advanceItemSm2 } from './itemSm2';

describe('SM-2 por item com relógio explícito', () => {
    it('preserva intervalos 1, 3 e multiplicação, com limites de facilidade', () => {
        const time = Date.parse('2026-10-17T00:00:00.000Z');
        const initial = { interval: 1, easeFactor: 2.5, repetitions: 0 };
        const first = advanceItemSm2(initial, 5, time);
        const second = advanceItemSm2(first, 5, time);
        const third = advanceItemSm2(second, 5, time);
        expect([first.interval, second.interval, third.interval]).toEqual([1, 3, 8]);
        expect(first.dueAtMs).toBe(time + 86400000);
        expect(third.easeFactor).toBe(2.5);
    });
    it('erro reinicia repetições sem apagar o cartão nem produzir intervalo zero', () => {
        const result = advanceItemSm2({ interval: 300, repetitions: 20, easeFactor: 1.3 }, 0, 0);
        expect(result).toMatchObject({ interval: 1, repetitions: 0, easeFactor: 1.3, dueAtMs: 86400000 });
    });
    it('aplica o teto de um ano a cartão com repetições altas', () => {
        expect(advanceItemSm2({ interval: 365, repetitions: 20, easeFactor: 2.5 }, 5, 0).interval).toBe(365);
    });
});
