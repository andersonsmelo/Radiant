/**
 * Compositor do lembrete personalizado (F6 da 1.6, ADR 2026-11-15). Função pura:
 * recebe o contexto do aluno e devolve o único lembrete a agendar, ou o motivo de
 * não agendar nenhum. Quem agenda é `scheduleReminder.ts`.
 *
 * Vozes pela bíblia de personagens da F7: o Pixel pergunta e propõe o passo, a
 * Profa. Lia usa imperativo gentil, o Caio afirma com calma e diz "a gente", a
 * Duda fala na primeira pessoa e estuda junto. Nenhum texto cobra, ameaça perda
 * ou usa exclamação.
 */
import { formatLocalDateKey } from '../../../constants/gamification';

export type ReminderPreferenceId = 'sequencia' | 'revisao' | 'aula' | 'meta' | 'liga';
export type NotificationPreferences = Record<ReminderPreferenceId, boolean>;
export const ALL_ON: NotificationPreferences = { sequencia: true, revisao: true, aula: true, meta: true, liga: true };

export type ReminderKind = 'retorno' | ReminderPreferenceId;
export type ReminderVoice = 'Pixel' | 'Profa. Lia' | 'Caio' | 'Duda';
export type ReminderRoute = '/' | '/review';

export type ReminderContext = {
    now: Date;
    /** Data local (AAAA-MM-DD) do último estudo; `null` para quem nunca estudou. */
    lastStudyDateKey: string | null;
    streakDays: number;
    dueReviews: number;
    nextLessonTitle: string | null;
    goalCompletedToday: boolean;
    /** Hora local em que o aluno mais estuda; `null` sem tentativas suficientes. */
    usualHour: number | null;
    league: { rank: number; totalPlayers: number } | null;
    /** Um lembrete marcado para hoje já passou do horário: hoje não sai outro. */
    firedTodayAlready: boolean;
    preferences: NotificationPreferences;
};

export type ReminderPlan = {
    kind: ReminderKind;
    voice: ReminderVoice;
    title: string;
    body: string;
    route: ReminderRoute;
    fireAt: Date;
};
export type ReminderDecision = ReminderPlan | { skip: 'nada-a-dizer' };

export const QUIET_END_HOUR = 9; // primeira hora permitida
export const QUIET_START_HOUR = 21; // última hora permitida (21 h em ponto)
export const DEFAULT_HOUR = 19;
export const RETURN_AFTER_DAYS = 3;
export const MAX_LEAGUE_RANK = 10;
const MIN_LEAD_MS = 15 * 60 * 1000;

function addDays(date: Date, days: number): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function daysBetween(fromKey: string, to: Date): number {
    const [y, m, d] = fromKey.split('-').map(Number);
    return Math.round((addDays(to, 0).getTime() - new Date(y, m - 1, d).getTime()) / 86_400_000);
}

type Copy = { title: string; line: string };

function copyFor(kind: ReminderKind, ctx: ReminderContext, variant: 0 | 1, today: boolean): Copy {
    const lesson = ctx.nextLessonTitle;
    switch (kind) {
        case 'retorno':
            return [
                { title: 'Sua trilha continua aqui', line: 'Vamos retomar do ponto onde você parou? Uma aula curta já põe o raciocínio em movimento.' },
                { title: 'Quando quiser voltar', line: 'Que tal separar uma aula curta para recomeçar? Eu mostro por onde seguir.' },
            ][variant];
        case 'sequencia':
            return [
                { title: `Sequência de ${ctx.streakDays} dias`, line: 'Que tal uma aula curta hoje para seguir com ela? Eu separo o caminho.' },
                { title: `${ctx.streakDays} dias seguidos de estudo`, line: 'Vamos manter o ritmo? Uma aula hoje já conta para a sequência.' },
            ][variant];
        case 'revisao': {
            // A contagem é de agora: para amanhã ela pode ter crescido, então o título não a cita.
            const title = !today ? 'Revisões esperando por você'
                : ctx.dueReviews === 1 ? '1 revisão para hoje' : `${ctx.dueReviews} revisões para hoje`;
            return [
                { title, line: 'Revise antes de avançar. Poucos minutos firmam o que você já viu.' },
                { title, line: 'Separe cinco minutos para a revisão. Depois, siga para a próxima aula.' },
            ][variant];
        }
        case 'liga': {
            const where = `${ctx.league?.rank}º lugar de ${ctx.league?.totalPlayers}`;
            return [
                { title: 'Liga da semana', line: `Vi que você está em ${where}. Vou fazer uma aula agora, bora junto?` },
                { title: 'Liga da semana', line: `Você está em ${where} na liga. Eu também vou estudar hoje.` },
            ][variant];
        }
        case 'aula':
            return [
                { title: `Próxima aula: ${lesson}`, line: 'Quando der, a gente segue com essa aula. É curta e do jeito que acontece na sala.' },
                { title: `Próxima aula: ${lesson}`, line: 'A gente continua daqui, com calma. A aula está pronta para você.' },
            ][variant];
        case 'meta':
            return [
                { title: 'Meta do dia', line: 'Eu ainda vou fazer minha aula de hoje. Bora junto?' },
                { title: 'Meta do dia', line: 'Tenho uma aula curta para fechar a meta de hoje. Quer estudar comigo?' },
            ][variant];
    }
}

const VOICE: Record<ReminderKind, ReminderVoice> = {
    retorno: 'Pixel', sequencia: 'Pixel', revisao: 'Profa. Lia', liga: 'Duda', aula: 'Caio', meta: 'Duda',
};

export function planReminder(ctx: ReminderContext): ReminderDecision {
    const hour = Math.min(QUIET_START_HOUR, Math.max(QUIET_END_HOUR, ctx.usualHour ?? DEFAULT_HOUR));
    const todayKey = formatLocalDateKey(ctx.now);
    const slotToday = new Date(ctx.now.getFullYear(), ctx.now.getMonth(), ctx.now.getDate(), hour);
    const today = ctx.lastStudyDateKey !== todayKey && !ctx.firedTodayAlready
        && slotToday.getTime() - ctx.now.getTime() >= MIN_LEAD_MS;
    const target = today ? slotToday : new Date(addDays(ctx.now, 1).setHours(hour));
    const dayBeforeKey = formatLocalDateKey(addDays(target, -1));
    const p = ctx.preferences;

    const gap = ctx.lastStudyDateKey === null ? null : daysBetween(ctx.lastStudyDateKey, target);
    const kind: ReminderKind | null =
        gap !== null && gap >= RETURN_AFTER_DAYS ? (p.aula ? 'retorno' : null)
            : p.sequencia && ctx.streakDays >= 2 && ctx.lastStudyDateKey === dayBeforeKey ? 'sequencia'
                : p.revisao && ctx.dueReviews > 0 ? 'revisao'
                    : p.liga && ctx.league !== null && ctx.league.rank >= 1 && ctx.league.rank <= MAX_LEAGUE_RANK ? 'liga'
                        : p.aula && ctx.nextLessonTitle ? 'aula'
                            : p.meta && (!today || !ctx.goalCompletedToday) ? 'meta'
                                : null;
    if (kind === null) return { skip: 'nada-a-dizer' };

    const { title, line } = copyFor(kind, ctx, (target.getDate() % 2) as 0 | 1, today);
    const voice = VOICE[kind];
    const route: ReminderRoute = kind === 'revisao' ? '/review' : '/';
    return { kind, voice, title, body: `${voice}: ${line}`, route, fireAt: target };
}
