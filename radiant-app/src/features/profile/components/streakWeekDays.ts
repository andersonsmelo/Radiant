export type StreakDayState = 'inStreak' | 'today' | 'unknown' | 'future';

const dayNumber = (key: string): number => {
  const [year, month, day] = key.split('-').map(Number);
  return Math.round(Date.UTC(year, month - 1, day) / 86_400_000);
};

/**
 * O app guarda só a última data de estudo e a contagem, não o histórico. A sequência viva
 * (última data hoje ou ontem, contagem >= 1) cobre os `streak` dias que terminam nela;
 * morta, só a própria última data marca. Dia passado fora disso é desconhecido, nunca falta.
 */
export function streakWeekDays({ weekDays, todayKey, lastActiveDate, streak }: {
  weekDays: string[]; todayKey: string; lastActiveDate: string | null; streak: number;
}): StreakDayState[] {
  const last = lastActiveDate !== null && lastActiveDate <= todayKey ? dayNumber(lastActiveDate) : null;
  const alive = last !== null && streak >= 1 && dayNumber(todayKey) - last <= 1;
  return weekDays.map(key => {
    if (key > todayKey) return 'future';
    const n = dayNumber(key);
    const inStreak = last !== null && (alive ? n <= last && n > last - streak : n === last);
    return inStreak ? 'inStreak' : key === todayKey ? 'today' : 'unknown';
  });
}
