import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { formatLocalDateKey } from '../../../constants/gamification';
import { isLargeTextScale } from '../../../ui/accessibility/useLargeTextLayout';
import { space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';

type StreakWeekProps = {
  lastActiveDate: string | null;
  streakDays: number | null;
  today: Date;
  loading?: boolean;
};
const DAY_NAMES = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
const DAY_INITIALS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

/** A chave é calendário local, nunca um timestamp UTC. Não normaliza dias impossíveis. */
function validDateKey(value: string | null): boolean {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day, 12);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

/** O agregado e a única data do serviço são fatos independentes, inclusive após restauração. */
export function StreakWeek({ lastActiveDate, streakDays, today, loading = false }: StreakWeekProps): React.ReactElement {
  const { fontScale } = useWindowDimensions();
  const largeText = isLargeTextScale(fontScale);
  const circleSize = Math.max(30, Math.ceil(12 * fontScale + 16));
  const todayKey = formatLocalDateKey(today);
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
  const days = DAY_NAMES.map((name, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const key = formatLocalDateKey(date);
    const state = key > todayKey ? 'future'
      : validDateKey(lastActiveDate) && lastActiveDate === key ? 'recorded' : 'unknown';
    return { name, initial: DAY_INITIALS[index], key, state };
  });
  const rows = largeText ? [days.slice(0, 4), days.slice(4)] : [days];
  const countKnown = typeof streakDays === 'number' && Number.isFinite(streakDays) && streakDays >= 0;

  return <View style={styles.section}>
    <Text key={`heading-${fontScale}`} accessibilityRole="header"
      accessibilityLabel={!loading && countKnown ? `Contador de sequência: ${streakDays}` : undefined}
      style={styles.heading}>
      {loading ? 'Carregando sequência…' : countKnown ? `Sequência registrada: ${streakDays}` : 'Sequência indisponível'}
    </Text>
    {!loading ? <>
      <View style={styles.calendar}>
        {rows.map((row, rowIndex) => <View key={rowIndex} testID={`week-row-${rowIndex}`} style={styles.weekRow}>
          {row.map(day => {
            const isToday = day.key === todayKey;
            const description = day.state === 'recorded' ? 'atividade registrada'
              : day.state === 'future' ? 'dia futuro' : 'sem registro disponível';
            return <View key={day.key} accessible accessibilityRole="text"
              accessibilityLabel={`${day.name}, ${day.key}${isToday ? ', hoje' : ''}: ${description}`}
              style={styles.day}>
              <Text key={`day-${fontScale}`} style={styles.dayName}>{day.initial}</Text>
              <View testID={isToday ? 'week-today-ring' : undefined} style={[styles.ring, isToday && styles.today]}>
                <View style={[styles.circle, { width: circleSize, height: circleSize, borderRadius: circleSize / 2 }, day.state === 'recorded' && styles.recorded]}>
                  {day.state === 'recorded' ? <Svg width={16} height={16} viewBox="0 0 16 16"><Path d="M3 8 L6.5 11.5 L13 4.5" stroke={galaxyColors.background} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></Svg>
                    : day.state === 'unknown' ? <Text key={`unknown-${fontScale}`} style={styles.unknown}>?</Text>
                      : <Svg width={12} height={12} viewBox="0 0 12 12"><Path d="M3 6 H9" stroke={galaxyColors.textTertiary} strokeWidth={1.5} /></Svg>}
                </View>
              </View>
            </View>;
          })}
          {largeText && row.length === 3 ? <View style={styles.day} /> : null}
        </View>)}
      </View>
      <Text key={`legend-${fontScale}`} style={styles.detail}>Sem registro disponível não significa falta. A semana mostra apenas a última data registrada.</Text>
    </> : null}
  </View>;
}
const styles = StyleSheet.create({
  section: { gap: space.s2 },
  heading: { ...typography.bodyStrong, lineHeight: undefined, color: galaxyColors.textPrimary },
  calendar: { gap: space.s2 },
  weekRow: { flexDirection: 'row', alignItems: 'flex-start' },
  day: { flex: 1, minWidth: 0, alignItems: 'center', gap: space.s1 },
  dayName: { ...typography.caption, lineHeight: undefined, color: galaxyColors.textSecondary, textAlign: 'center' },
  ring: { borderWidth: 2, borderColor: 'transparent', borderRadius: 999, padding: space.s2 / 4 },
  today: { borderColor: galaxyColors.streakColor },
  circle: { alignItems: 'center', justifyContent: 'center', backgroundColor: galaxyColors.surfaceMuted },
  recorded: { backgroundColor: galaxyColors.streakColor },
  unknown: { ...typography.caption, fontSize: 12, lineHeight: undefined, color: galaxyColors.textSecondary },
  detail: { ...typography.caption, lineHeight: undefined, color: galaxyColors.textSecondary },
});
