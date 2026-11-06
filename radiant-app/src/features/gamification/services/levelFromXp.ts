/**
 * Nível a partir do XP total (plano de 2026-11-05, frente D).
 *
 * O custo cresce 20 XP a cada nível: sair do nível N custa 20 × N. O nível L
 * começa em 10 × L × (L − 1) XP: 2 em 20, 3 em 60, 4 em 120, 5 em 200, 10 em
 * 900. Uma aula rende de 10 a 18 XP (`XP_RULES`), então a primeira subida
 * chega até a segunda aula.
 *
 * Os títulos falam do caminho de estudo, nunca de habilitação profissional.
 * Acima do último título o nível continua subindo e o título fica.
 */
export const LEVEL_TITLES: readonly string[] = [
    'Primeiros passos',
    'Pegando o ritmo',
    'Olhar atento',
    'Mão na massa',
    'Ritmo firme',
    'Trilha aberta',
    'Fôlego longo',
    'Estudo constante',
    'Passo seguro',
    'Visão ampla',
    'Longo caminho',
    'Trilha de ouro',
];

export type LevelInfo = { level: number; title: string; xpIntoLevel: number; xpForNext: number };

const COST_STEP = 20;

/** XP total em que o nível começa. */
export function xpThresholdForLevel(level: number): number {
    return (COST_STEP / 2) * level * (level - 1);
}

/** XP inválido (negativo, NaN, infinito) vale zero: nível nunca nasce de dado quebrado. */
export function levelFromXp(xp: number): LevelInfo {
    const total = Number.isFinite(xp) && xp > 0 ? Math.floor(xp) : 0;
    let level = 1;
    while (total >= xpThresholdForLevel(level + 1)) level += 1;
    return {
        level,
        title: LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length) - 1],
        xpIntoLevel: total - xpThresholdForLevel(level),
        xpForNext: COST_STEP * level,
    };
}
