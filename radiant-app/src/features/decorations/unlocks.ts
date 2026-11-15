/**
 * Regras puras de desbloqueio. O ganho é gravado e não volta atrás (a sequência
 * atual zera e as missões só guardam o dia): `newlyEarned` diz o que passou a
 * valer agora, e o serviço o grava em silêncio, sem celebração.
 */
import { DECORATIONS, type Decoration, type DecorationSlot, type UnlockRule } from './catalog';

export type DecorationProgress = {
    lessonsCompleted: number;
    unitsCompleted: number;
    streakDays: number;
    allMissionsDoneToday: boolean;
    level: number;
};

export type EquippedIds = Partial<Record<DecorationSlot, string>>;
export type EquippedDecorations = Record<DecorationSlot, Decoration | null>;

export function meetsRule(rule: UnlockRule, p: DecorationProgress): boolean {
    switch (rule.kind) {
        case 'aulas': return p.lessonsCompleted >= rule.count;
        case 'unidades': return p.unitsCompleted >= rule.count;
        case 'sequencia': return p.streakDays >= rule.days;
        case 'missoes-do-dia': return p.allMissionsDoneToday;
        case 'nivel': return p.level >= rule.level;
        case 'assinante': return false; // decidido ao vivo pela assinatura, nunca gravado
    }
}

export function newlyEarned(progress: DecorationProgress, unlocked: readonly string[]): string[] {
    return DECORATIONS.filter(d => !unlocked.includes(d.id) && meetsRule(d.rule, progress)).map(d => d.id);
}

export function availableIds(unlocked: readonly string[], subscriber: boolean): Set<string> {
    return new Set(DECORATIONS.filter(d => unlocked.includes(d.id) || (subscriber && d.rule.kind === 'assinante')).map(d => d.id));
}

export function resolveEquipped(equipped: EquippedIds, available: ReadonlySet<string>): EquippedDecorations {
    const pick = (slot: DecorationSlot) =>
        DECORATIONS.find(d => d.slot === slot && d.id === equipped[slot] && available.has(d.id)) ?? null;
    return { moldura: pick('moldura'), selo: pick('selo'), cartao: pick('cartao') };
}

export function howToEarn(rule: UnlockRule): string {
    switch (rule.kind) {
        case 'aulas': return rule.count === 1 ? 'Conclua sua primeira aula' : `Conclua ${rule.count} aulas`;
        case 'unidades': return rule.count === 1 ? 'Conclua uma unidade inteira' : `Conclua ${rule.count} unidades`;
        case 'sequencia': return `Estude ${rule.days} dias seguidos`;
        case 'missoes-do-dia': return 'Conclua as três missões de um dia';
        case 'nivel': return `Chegue ao nível ${rule.level}`;
        case 'assinante': return 'Exclusivo do Radiant Ilimitado';
    }
}
