import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { JourneyUnit } from '../../../types/journey';
import type { LessonStars } from '../../quiz/services/resolveLessonStars';
import { JourneyMedal } from '../../journey/components/JourneyMedal';
import { resolveNodeTheme } from '../../journey/services/resolveNodeTheme';
import { space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';

/** Quantas medalhas cabem na primeira fileira da estante. */
const FIRST_ROW = 6;

type MedalShelfProps = {
  unit: JourneyUnit | null;
  starsByLessonId: Record<string, LessonStars> | null;
  loading?: boolean;
  starsLoading?: boolean;
};

/** Conclusões vêm do currículo; recordes retidos são opcionais, nunca reconstruídos. */
export function MedalShelf({ unit, starsByLessonId, loading = false, starsLoading = false }: MedalShelfProps): React.ReactElement {
  const { fontScale } = useWindowDimensions();
  const [expanded, setExpanded] = useState(false);
  const lessons = unit?.nodes.filter(node => node.type === 'lesson') ?? [];
  const earned = lessons.filter(node => node.status === 'completed').length;
  const hasMore = lessons.length > FIRST_ROW;
  const shown = hasMore && !expanded ? lessons.slice(0, FIRST_ROW) : lessons;
  return <View style={styles.section}>
    <View style={styles.headingRow}>
      <Text key={`heading-${fontScale}`} style={styles.heading} accessibilityRole="header">Medalhas</Text>
      {unit && lessons.length > 0 && !loading ? <Text key={`count-${fontScale}`} style={styles.detail}>{`${earned} de ${lessons.length}`}</Text> : null}
    </View>
    {loading ? <Text key={`loading-${fontScale}`} style={styles.detail}>Carregando medalhas…</Text>
      : !unit || lessons.length === 0 ? <Text key={`unavailable-${fontScale}`} style={styles.detail}>Medalhas indisponíveis</Text>
        : <>
          <View style={styles.shelf}>
            {shown.map(node => {
              const completed = node.status === 'completed';
              const record = node.lessonId ? starsByLessonId?.[node.lessonId] : undefined;
              const stars = completed && typeof record === 'number' && Number.isInteger(record) && record >= 0 && record <= 3 ? record : undefined;
              const description = completed ? `Concluída.${stars !== undefined ? ` ${stars} ${stars === 1 ? 'estrela' : 'estrelas'}.` : ''}` : 'Ainda não conquistada.';
              return <JourneyMedal key={node.id} node={node} theme={resolveNodeTheme(node, unit)}
                state={completed ? 'done' : 'locked'} pulsing={false} size={30} stars={stars}
                accessibilityLabel={`${node.title}. ${description}`} />;
            })}
          </View>
          {hasMore ? <Pressable accessibilityRole="button" onPress={() => setExpanded(value => !value)} style={styles.more}>
            <Text key={`more-${fontScale}`} style={styles.moreText}>{expanded ? 'Ver menos' : `Ver as ${lessons.length}`}</Text>
          </Pressable> : null}
          {starsByLessonId === null ? <Text key={`stars-${fontScale}`} style={styles.detail}>{starsLoading ? 'Carregando estrelas…' : 'Estrelas indisponíveis'}</Text> : null}
        </>}
  </View>;
}
const styles = StyleSheet.create({
  section: { gap: space.s2 },
  headingRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: space.s2 },
  heading: { ...typography.bodyStrong, lineHeight: undefined, color: galaxyColors.textPrimary },
  shelf: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s3, alignItems: 'flex-start' },
  more: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
  moreText: { ...typography.bodyStrong, lineHeight: undefined, color: galaxyColors.navBlue },
  detail: { ...typography.caption, lineHeight: undefined, color: galaxyColors.textSecondary },
});
