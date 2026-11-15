/**
 * A semana da liga é a ocorrência do placar recorrente do Game Center
 * `radiant.liga.semanal.xp`: começa segunda 00:00 UTC e dura 7 dias (ADR
 * 2026-11-13). O app usa esta conta só para saber em que balde guardar o XP
 * ganho. Quem venceu e quando a semana termina vêm do Game Center.
 */
const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

/** Início (ISO, UTC) da semana do placar que contém `at`. */
export function weekStartUtc(at: Date): string {
    const midnight = Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate());
    const daysSinceMonday = (new Date(midnight).getUTCDay() + 6) % 7;
    return new Date(midnight - daysSinceMonday * DAY_MS).toISOString();
}

/** "Termina em …" a partir do fim que o Game Center informou; `null` sem fim válido. */
export function formatTimeLeft(endsAt: string | null, now: Date): string | null {
    const end = endsAt === null ? NaN : Date.parse(endsAt);
    const left = end - now.getTime();
    if (!Number.isFinite(left) || left <= 0) return null;
    if (left < HOUR_MS) return 'Termina em menos de 1 h';
    const days = Math.floor(left / DAY_MS);
    const hours = Math.floor((left % DAY_MS) / HOUR_MS);
    if (days === 0) return `Termina em ${hours} h`;
    const dayText = days === 1 ? '1 dia' : `${days} dias`;
    return hours === 0 ? `Termina em ${dayText}` : `Termina em ${dayText} e ${hours} h`;
}
