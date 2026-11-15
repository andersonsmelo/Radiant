/**
 * Monta o `ReminderContext` a partir das fontes que já existem (levantamento da F6).
 * Cada leitura é independente: uma fonte que falha vira ausência (0, `null`),
 * nunca um dado inventado, e não impede o lembrete.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatLocalDateKey } from '../../../constants/gamification';
import type { GamificationSnapshot } from '../../../types/gamification';
import type { DailyGoalSnapshot } from '../../../types/dailyGoal';
import type { CurriculumTrail } from '../../journey/services/JourneyCurriculumService';
import { ALL_ON, type NotificationPreferences, type ReminderContext } from './composeReminder';
import { EMPTY_LEAGUE_STANDING, type LeagueStandingSource } from './LeagueStandingSource';
import { readNotificationPreferences } from './notificationPreferences';

export type ReminderContextPorts = {
    gamification(): Promise<GamificationSnapshot>;
    goal(now: Date): Promise<DailyGoalSnapshot>;
    dueReviews(now: Date): Promise<number>;
    trail(): Promise<CurriculumTrail>;
    attempts(): Promise<readonly { recordedAt: string }[]>;
    league: LeagueStandingSource;
    /** ISO do último lembrete agendado (`push.lastScheduled.v1`). */
    lastScheduledIso(): Promise<string | null>;
    preferences(): Promise<NotificationPreferences>;
};

/** Mesma chave que o `PushService` usa (`KEYS.LAST_SCHEDULED`); o agendador personalizado a importa daqui. */
export const LAST_SCHEDULED_KEY = 'push.lastScheduled.v1';

const USUAL_HOUR_WINDOW = 40;
const USUAL_HOUR_MIN_ATTEMPTS = 5;

/** A hora local mais frequente nas últimas 40 tentativas; empate fica com a mais recente. */
export function usualStudyHour(recordedAts: readonly string[]): number | null {
    const hours = recordedAts.map(iso => Date.parse(iso)).filter(Number.isFinite)
        .sort((a, b) => a - b).slice(-USUAL_HOUR_WINDOW).map(ms => new Date(ms).getHours());
    if (hours.length < USUAL_HOUR_MIN_ATTEMPTS) return null;
    const counts = new Map<number, number>();
    let best: number | null = null;
    for (const hour of hours) {
        counts.set(hour, (counts.get(hour) ?? 0) + 1);
        if (best === null || counts.get(hour)! >= counts.get(best)!) best = hour;
    }
    return best;
}

export function nextLessonTitle(trail: CurriculumTrail): string | null {
    const node = trail.segments.flatMap(s => s.units).flatMap(u => u.nodes).find(n => n.id === trail.recommendedNodeId);
    return node?.type === 'lesson' ? node.title : null;
}

async function orNull<T>(read: () => Promise<T>): Promise<T | null> {
    try { return await read(); } catch { return null; }
}

export async function gatherReminderContext(now: Date, ports: ReminderContextPorts = livePorts): Promise<ReminderContext> {
    const [gamification, goal, due, trail, attempts, league, lastScheduled, preferences] = await Promise.all([
        orNull(ports.gamification), orNull(() => ports.goal(now)), orNull(() => ports.dueReviews(now)), orNull(ports.trail),
        orNull(ports.attempts), orNull(() => ports.league.getStanding()), orNull(ports.lastScheduledIso), orNull(ports.preferences),
    ]);
    const scheduledMs = lastScheduled ? Date.parse(lastScheduled) : NaN;
    return {
        now,
        lastStudyDateKey: gamification?.lastActiveDate ?? null,
        streakDays: gamification?.streakDays ?? 0,
        dueReviews: due ?? 0,
        nextLessonTitle: trail ? nextLessonTitle(trail) : null,
        goalCompletedToday: goal?.isCompleted === true,
        usualHour: attempts ? usualStudyHour(attempts.map(a => a.recordedAt)) : null,
        league,
        firedTodayAlready: Number.isFinite(scheduledMs) && scheduledMs <= now.getTime()
            && formatLocalDateKey(new Date(scheduledMs)) === formatLocalDateKey(now),
        // Sem preferência legível, nenhum tipo é desligado por engano.
        preferences: preferences ?? ALL_ON,
    };
}

/* eslint-disable @typescript-eslint/no-require-imports -- resolução tardia: o compositor e os testes não inicializam catálogo nem storage nativo. */
const livePorts: ReminderContextPorts = {
    gamification: () => require('../../gamification/services/GamificationService').GamificationService.getSnapshot(),
    goal: now => require('../../daily-goal/services/DailyGoalService').DailyGoalService.getSnapshot(now),
    dueReviews: now => require('../../spaced-repetition/services/SpacedRepetitionService').SpacedRepetitionService.getDueCount(now),
    trail: () => require('../../journey/services/JourneyCurriculumService').JourneyCurriculumService.getCurriculumTrail(),
    attempts: () => require('../../spaced-repetition/repositories/ItemReviewRepository').itemReviewRepository.getAttempts(),
    league: EMPTY_LEAGUE_STANDING,
    lastScheduledIso: () => AsyncStorage.getItem(LAST_SCHEDULED_KEY),
    preferences: readNotificationPreferences,
};
/* eslint-enable @typescript-eslint/no-require-imports */
