import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { formatLocalDateKey } from '../../../constants/gamification';
import { isLargeTextScale } from '../../../ui/accessibility/useLargeTextLayout';
import { space, typography } from '../../../ui/styles';
import { galaxyColors, hudLabelTones } from '../../../ui/theme';
import { StreakIcon } from '../../../ui/components/HudIcons';
import { streakWeekDays } from './streakWeekDays';

type StreakWeekProps = {
  lastActiveDate: string | null;
  streakDays: number | null;
  today: Date;
  loading?: boolean;
  /** Proteções de sequência guardadas. Ausente não mostra a linha. `max` e `everyDays` seguem na API para quem monta a tela. */
  freezes?: { stored: number; max: number; everyDays: number } | null;
};
const DAY_NAMES = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const DAY_INITIALS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

/** A chave é calendário local, nunca um timestamp UTC. Não normaliza dias impossíveis. */
function validDateKey(value: string | null): boolean {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day, 12);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

/** O agregado e a única data do serviço são fatos independentes, inclusive após restauração. */
export function StreakWeek({ lastActiveDate, streakDays, today, loading = false, freezes = null }: StreakWeekProps): React.ReactElement {
  const { fontScale } = useWindowDimensions();
  const largeText = isLargeTextScale(fontScale);
  const circleSize = Math.max(30, Math.ceil(12 * fontScale + 16));
  const todayKey = formatLocalDateKey(today);
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
  const keys = DAY_NAMES.map((_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return formatLocalDateKey(date);
  });
  const countKnown = typeof streakDays === 'number' && Number.isFinite(streakDays) && streakDays >= 0;
  const states = streakWeekDays({ weekDays: keys, todayKey, lastActiveDate: validDateKey(lastActiveDate) ? lastActiveDate : null, streak: countKnown ? streakDays : 0 });
  const days = DAY_NAMES.map((name, index) => ({ name, initial: DAY_INITIALS[index], key: keys[index], state: states[index] }));
  const rows = largeText ? [days.slice(0, 4), days.slice(4)] : [days];

  const freezeLine = freezes && Number.isInteger(freezes.stored) && freezes.stored >= 0
    ? freezes.stored === 0 ? 'Nenhuma proteção guardada' : `${freezes.stored} ${freezes.stored === 1 ? 'proteção guardada' : 'proteções guardadas'}` : null;

  return <View style={styles.section}>
    {loading || !countKnown ? <Text key={`heading-${fontScale}`} accessibilityRole="header" style={styles.detail}>
      {loading ? 'Carregando sequência…' : 'Sequência indisponível'}
    </Text> : <View accessible accessibilityRole="header" accessibilityLabel={`Contador de sequência: ${streakDays}`} style={styles.count}>
      <View testID="streak-flame" accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><StreakIcon size={40} /></View>
      <Text key={`count-${fontScale}`} style={styles.number}>{String(streakDays)}</Text>
      <Text key={`unit-${fontScale}`} style={styles.detail}>{streakDays === 1 ? 'dia' : 'dias'}</Text>
    </View>}
    {!loading ? <>
      <View style={styles.calendar}>
        {rows.map((row, rowIndex) => <View key={rowIndex} testID={`week-row-${rowIndex}`} style={styles.weekRow}>
          {row.map(day => {
            const isToday = day.key === todayKey;
            const description = day.state === 'inStreak' ? 'na sequência' : day.state === 'today' ? 'ainda sem estudo'
              : day.state === 'future' ? 'ainda não chegou' : 'sem registro';
            return <View key={day.key} accessible accessibilityRole="text"
              accessibilityLabel={`${day.name}${isToday ? ', hoje' : ''}, ${description}`}
              style={styles.day}>
              <Text key={`day-${fontScale}`} style={styles.dayName}>{day.initial}</Text>
              {day.state === 'unknown'
                ? <View style={[styles.dotSlot, { height: circleSize }]}><View testID="week-unknown-dot" style={styles.dot} /></View>
                : <View testID={isToday ? 'week-today-ring' : undefined} style={[styles.ring, isToday && styles.today]}>
                  <View style={[styles.circle, { width: circleSize, height: circleSize, borderRadius: circleSize / 2 }, day.state === 'inStreak' && styles.recorded]}>
                    {day.state === 'inStreak' ? <Svg width={16} height={16} viewBox="0 0 16 16"><Path d="M3 8 L6.5 11.5 L13 4.5" stroke={galaxyColors.background} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></Svg> : null}
                  </View>
                </View>}
            </View>;
          })}
          {largeText && row.length === 3 ? <View style={styles.day} /> : null}
        </View>)}
      </View>
      {freezeLine ? <Text key={`freezes-${fontScale}`} style={styles.detail}>{freezeLine}</Text> : null}
    </> : null}
  </View>;
}
const styles = StyleSheet.create({
  section: { gap: space.s2 },
  calendar: { gap: space.s2 },
  weekRow: { flexDirection: 'row', alignItems: 'flex-start' },
  day: { flex: 1, minWidth: 0, alignItems: 'center', gap: space.s1 },
  dayName: { ...typography.caption, lineHeight: undefined, color: galaxyColors.textSecondary, textAlign: 'center' },
  ring: { borderWidth: 2, borderColor: 'transparent', borderRadius: 999, padding: space.s2 / 4 },
  today: { borderColor: galaxyColors.streakColor },
  dotSlot: { alignItems: 'center', justifyContent: 'center', padding: space.s2 / 4 + 2 },
  dot: { width: 6, height: 6, borderRadius: 999, backgroundColor: galaxyColors.textTertiary },
  circle: { alignItems: 'center', justifyContent: 'center', backgroundColor: galaxyColors.surfaceMuted },
  recorded: { backgroundColor: galaxyColors.streakColor },
  count: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  number: { ...typography.h2, lineHeight: undefined, color: hudLabelTones.streak },
  detail: { ...typography.caption, lineHeight: undefined, color: galaxyColors.textSecondary },
});
