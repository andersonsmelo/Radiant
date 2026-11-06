import { LEVEL_TITLES, levelFromXp, xpThresholdForLevel } from './levelFromXp';
import { XP_RULES } from '../../../constants/gamification';

describe('levelFromXp', () => {
    it('começa no nível 1 com 0 XP e trata XP quebrado como zero', () => {
        expect(levelFromXp(0)).toEqual({ level: 1, title: 'Primeiros passos', xpIntoLevel: 0, xpForNext: 20 });
        for (const broken of [-5, Number.NaN, Number.POSITIVE_INFINITY]) expect(levelFromXp(broken)).toEqual(levelFromXp(0));
    });

    it('a primeira subida chega até a segunda aula, mesmo sem bônus de acerto', () => {
        expect(levelFromXp(XP_RULES.BASE_XP_PER_QUIZ).level).toBe(1);
        expect(levelFromXp(2 * XP_RULES.BASE_XP_PER_QUIZ).level).toBe(2);
    });

    it('sobe exatamente no limiar, com custo crescente por nível', () => {
        expect([2, 3, 4, 5, 10].map(xpThresholdForLevel)).toEqual([20, 60, 120, 200, 900]);
        for (let level = 2; level <= 40; level += 1) {
            const threshold = xpThresholdForLevel(level);
            expect(levelFromXp(threshold - 1).level).toBe(level - 1);
            expect(levelFromXp(threshold)).toMatchObject({ level, xpIntoLevel: 0 });
            // O custo do nível é a distância até o próximo limiar, e cresce.
            expect(levelFromXp(threshold).xpForNext).toBe(xpThresholdForLevel(level + 1) - threshold);
            expect(levelFromXp(threshold).xpForNext).toBeGreaterThan(levelFromXp(threshold - 1).xpForNext);
        }
    });

    it('é monotônica e o progresso dentro do nível nunca passa do custo', () => {
        let previous = levelFromXp(0);
        for (let xp = 1; xp <= 5000; xp += 1) {
            const current = levelFromXp(xp);
            expect(current.level).toBeGreaterThanOrEqual(previous.level);
            expect(current.level - previous.level).toBeLessThanOrEqual(1);
            expect(current.xpIntoLevel).toBeGreaterThanOrEqual(0);
            expect(current.xpIntoLevel).toBeLessThan(current.xpForNext);
            expect(xpThresholdForLevel(current.level) + current.xpIntoLevel).toBe(xp);
            previous = current;
        }
    });

    it('tem dez ou mais títulos distintos, em frase, sem alegar habilitação profissional', () => {
        expect(LEVEL_TITLES.length).toBeGreaterThanOrEqual(10);
        expect(new Set(LEVEL_TITLES).size).toBe(LEVEL_TITLES.length);
        for (const title of LEVEL_TITLES) {
            expect(title).not.toMatch(/habilitad|especialista|profissional|técnic|tecnólog|doutor|mestre|formad|certificad|diplomad/i);
            expect(title).not.toBe(title.toUpperCase());
            expect(title).not.toMatch(/ [—–-] /);
        }
        expect(LEVEL_TITLES.map((_, index) => levelFromXp(xpThresholdForLevel(index + 1)).title)).toEqual([...LEVEL_TITLES]);
        // Acima do último título o nível segue e o título fica.
        expect(levelFromXp(xpThresholdForLevel(30))).toMatchObject({ level: 30, title: LEVEL_TITLES[LEVEL_TITLES.length - 1] });
    });
});
