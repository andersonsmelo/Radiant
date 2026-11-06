import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { LessonFeedback } from '../../../ui/feedback/lessonFeedback';
import { radius, space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';
import { levelFromXp } from '../services/levelFromXp';

type LevelBadgeProps = {
  /** XP total; `null` enquanto não foi lido. Sem leitura não há nível nem subida. */
  xp: number | null;
  /** Só quem recebe `feedback` anuncia a subida (a trilha); o Perfil só mostra. */
  feedback?: Pick<LessonFeedback, 'emit'> | null;
};

/**
 * Nível do aluno em uma linha: número, título e o quanto falta para o próximo.
 *
 * A subida é notada entre duas leituras do mesmo componente montado: a primeira
 * leitura só registra o nível, e cada nível novo dispara `level_up` uma vez.
 * Não anima; a subida aparece em texto, então "reduzir movimento" não muda nada.
 */
export function LevelBadge({ xp, feedback }: LevelBadgeProps): React.ReactElement | null {
  const known = typeof xp === 'number' && Number.isFinite(xp) && xp >= 0;
  const info = levelFromXp(known ? xp : 0);
  const lastLevel = useRef<number | null>(null);
  const [leveledUp, setLeveledUp] = useState(false);

  useEffect(() => {
    if (!known) return;
    if (lastLevel.current !== null && info.level > lastLevel.current) {
      feedback?.emit('level_up');
      setLeveledUp(true);
    }
    lastLevel.current = info.level;
    // `feedback` fica fora: trocar o emissor não é subir de nível.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [known, info.level]);

  if (!known) return null;
  const progress = `${info.xpIntoLevel} de ${info.xpForNext} XP para o próximo nível`;

  return (
    <View style={styles.badge} accessible accessibilityRole="progressbar"
      accessibilityLabel={`Nível ${info.level}, ${info.title}. ${progress}.`}
      accessibilityValue={{ min: 0, max: info.xpForNext, now: info.xpIntoLevel }}>
      <View style={styles.line}>
        <Text style={styles.level}>Nível {info.level}</Text>
        <Text style={styles.title} numberOfLines={1}>{info.title}</Text>
      </View>
      <View testID="level-track" style={styles.track}>
        <View testID="level-fill" style={[styles.fill, { width: `${(info.xpIntoLevel / info.xpForNext) * 100}%` }]} />
      </View>
      {leveledUp ? <Text style={styles.up} accessibilityLiveRegion="polite">Você subiu de nível</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { gap: space.s1 },
  line: { flexDirection: 'row', alignItems: 'baseline', gap: space.s2 },
  level: { ...typography.bodyStrong, lineHeight: undefined, color: galaxyColors.textPrimary },
  title: { ...typography.caption, lineHeight: undefined, color: galaxyColors.textSecondary, flexShrink: 1 },
  track: { height: 6, borderRadius: radius.rMd / 4, backgroundColor: galaxyColors.surfaceMuted, overflow: 'hidden' },
  fill: { height: 6, borderRadius: radius.rMd / 4, backgroundColor: galaxyColors.navBlue },
  up: { ...typography.caption, lineHeight: undefined, color: galaxyColors.textPrimary },
});
