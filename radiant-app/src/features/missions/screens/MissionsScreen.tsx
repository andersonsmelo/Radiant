import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

import { IconSymbol } from '../../../../components/ui/icon-symbol';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { radius, space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';
import { DailyMissionsService, MISSION_BONUS_XP, type DailyMission } from '../services/DailyMissionsService';
import { STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION, useShadowCheckpoint } from '../../student-checkpoints/useShadowCheckpoint';

type Reading = { state: 'loading' } | { state: 'ready'; missions: DailyMission[] } | { state: 'unavailable' };

/**
 * Missões de hoje, na rota `/missions`.
 *
 * A tela antiga (cartão laranja, etiquetas em caixa alta, vidas repetidas do
 * HUD) saiu do Perfil na T09 do Medalhão. Esta volta só com o que é dela: três
 * missões em linha, o progresso que os registros provam e o bônus de cada uma.
 * Abrir a tela também paga o bônus das missões que acabaram de ser concluídas.
 */
export default function MissionsScreen() {
  const [reading, setReading] = useState<Reading>({ state: 'loading' });

  // Observação inerte da superfície, como nas outras telas de aluno (`screen-integrations.test.ts`).
  useShadowCheckpoint({
    surface: 'missions',
    flowId: 'missions-v1',
    contentVersion: STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
    cursorId: 'missions',
    compatibleCursorIds: ['missions'],
    progressPercent: 0,
    completedStepCount: 0,
    totalStepCount: 1,
  });

  useFocusEffect(useCallback(() => {
    let alive = true;
    DailyMissionsService.sync().then(
      result => { if (alive) setReading({ state: 'ready', missions: result.missions }); },
      () => { if (alive) setReading({ state: 'unavailable' }); },
    );
    return () => { alive = false; };
  }, []));

  return (
    <View style={styles.root}>
      <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={space.s1}
            style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
            <IconSymbol name="chevron.left" size={20} color={galaxyColors.navBlue} />
            <Text style={styles.backLabel}>Voltar</Text>
          </Pressable>
          <Text style={styles.title} accessibilityRole="header">Missões de hoje</Text>
          <Text style={styles.detail}>Cada missão concluída rende {MISSION_BONUS_XP} XP de bônus, uma vez. Amanhã chegam outras três.</Text>
        </View>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {reading.state === 'loading' ? <Text style={styles.detail}>Carregando missões…</Text>
            : reading.state === 'unavailable' ? <Text style={styles.detail} accessibilityRole="alert">Não foi possível ler as missões agora. Tente de novo em instantes.</Text>
              : reading.missions.map(mission => {
                const status = mission.done
                  ? mission.rewarded ? `Concluída, +${MISSION_BONUS_XP} XP` : 'Concluída'
                  : `${mission.progress} de ${mission.goal}`;
                return (
                  <View key={mission.id} style={styles.mission} accessible accessibilityRole="progressbar"
                    accessibilityLabel={`${mission.title}. ${status}.`}
                    accessibilityValue={{ min: 0, max: mission.goal, now: mission.progress }}>
                    <View style={styles.missionLine}>
                      <Text style={styles.missionTitle}>{mission.title}</Text>
                      <Text style={styles.detail}>{status}</Text>
                    </View>
                    <View style={styles.track}>
                      <View testID={`mission-fill-${mission.id}`}
                        style={[styles.fill, mission.done && styles.fillDone, { width: `${(mission.progress / mission.goal) * 100}%` }]} />
                    </View>
                  </View>
                );
              })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  safe: { flex: 1 },
  header: { paddingHorizontal: space.s3, paddingTop: space.s1, paddingBottom: space.s3, gap: space.s2 },
  back: { minHeight: 48, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: space.s0 },
  pressed: { opacity: 0.7 },
  backLabel: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.navBlue },
  title: { ...typography.h2, lineHeight: undefined, color: galaxyColors.textPrimary },
  detail: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textSecondary },
  scroll: { flex: 1 },
  content: { paddingHorizontal: space.s3, paddingBottom: space.s6 },
  mission: { gap: space.s2, paddingVertical: space.s3, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: galaxyColors.border },
  missionLine: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', columnGap: space.s2 },
  missionTitle: { ...typography.bodyStrong, lineHeight: undefined, color: galaxyColors.textPrimary, flexShrink: 1 },
  track: { height: 6, borderRadius: radius.rMd / 4, backgroundColor: galaxyColors.surfaceMuted, overflow: 'hidden' },
  fill: { height: 6, borderRadius: radius.rMd / 4, backgroundColor: galaxyColors.navBlue },
  fillDone: { backgroundColor: galaxyColors.xpColor },
});
