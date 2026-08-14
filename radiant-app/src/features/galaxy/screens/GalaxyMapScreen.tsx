/**
 * GalaxyMapScreen — a projeção exploratória da jornada canônica.
 *
 * A Home oferece a próxima ação. A Galáxia é o único lugar onde o aluno troca
 * de trilha e percorre seus nós; ambas consomem JourneyProgressService.
 */

import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../../../components/ui/AppButton';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { HUD } from '../../../ui/components/HUD';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, tabBarClearance, typography } from '../../../ui/styles';
import { GamificationService } from '../../gamification/services/GamificationService';
import type { GamificationSnapshot } from '../../../types/gamification';
import type { JourneyNode, JourneySnapshot } from '../../../types/journey';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { canOpenJourneyNode, getJourneyNodeHref } from '../../journey/services/JourneyNodeRouting';
import { JourneyMap } from '../../journey/components/JourneyMap';
import { TelemetryService } from '../../telemetry/TelemetryService';
import {
  STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
  useShadowCheckpoint,
} from '../../student-checkpoints/useShadowCheckpoint';

export default function GalaxyMapScreen() {
  const router = useRouter();
  const [journey, setJourney] = useState<JourneySnapshot | null>(null);
  const [gamification, setGamification] = useState<GamificationSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useShadowCheckpoint({
    surface: 'galaxy-map',
    flowId: 'galaxy-map-v1',
    contentVersion: STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
    cursorId: 'galaxy-map',
    compatibleCursorIds: ['galaxy-map'],
    progressPercent: 0,
    completedStepCount: journey?.completedCount ?? 0,
    totalStepCount: journey?.track.units.reduce((total, unit) => total + unit.nodes.length, 0) ?? 1,
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // O catálogo continua sendo carregado, mas o retorno já não é guardado:
      // quem o consumia era o seletor de trilhas. `bootstrap` é o que hidrata o
      // catálogo para o resto do app, então a chamada fica — tirá-la seria uma
      // mudança de comportamento disfarçada de limpeza de variável não usada.
      const [nextJourney, , nextGamification] = await Promise.all([
        JourneyProgressService.bootstrap(),
        LessonCatalogService.bootstrap(),
        GamificationService.getSnapshot(),
      ]);
      setJourney(nextJourney);
      setGamification(nextGamification);
    } catch (cause) {
      console.error('[GalaxyMapScreen] Failed to load canonical journey:', cause);
      setError('Não foi possível carregar sua Galáxia agora.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void TelemetryService.track('screen_view', { screen: 'galaxy_map' });
      void load();
    }, [load]),
  );

  // `selectTrack` saiu junto com o seletor de trilhas em 2026-08-14: o percurso
  // passou a ser único, e trocar de trilha por escolha deixou de existir como
  // ação do aluno. `JourneyProgressService.selectTrack` continua sendo o
  // caminho de troca — quem vai chamá-lo é o destravamento automático ao
  // concluir a trilha atual, não um toque no catálogo.

  const openNode = useCallback(async (node: JourneyNode) => {
    const href = getJourneyNodeHref(node);
    if (!canOpenJourneyNode(node) || !href) {
      Alert.alert('Ainda não disponível', 'Esse ponto ainda não foi liberado na sua jornada.');
      return;
    }

    await JourneyProgressService.setCurrentNode(node.id);
    router.push(href);
  }, [router]);

  const continueLabel = journey?.nextRecommendedNode ? 'Continuar pela Galáxia' : 'Sem etapa disponível';

  return (
    <View style={styles.root} testID="galaxy-map-screen">
      <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.statusBar}>
          <Text style={styles.appTitle} accessibilityRole="header">GALÁXIA</Text>
        </View>

        <HUD
          totalXp={gamification?.totalXp ?? 0}
          streakDays={gamification?.streakDays ?? 0}
          hearts={gamification?.hearts ?? 5}
          maxHearts={gamification?.maxHearts ?? 5}
        />

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator
              size="large"
              color={galaxyColors.ctaGradientEnd}
              accessibilityRole="progressbar"
              accessibilityLabel="Carregando Galáxia"
            />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="always"
          >
            <View style={styles.introCard}>
              <Text style={styles.eyebrow}>Céu navegável</Text>
              <Text style={styles.title} accessibilityRole="header">Sua jornada, uma única rota</Text>
              <Text style={styles.subtitle}>
                Um caminho só: avance pelos mesmos pontos que alimentam a próxima ação da Home. A
                trilha seguinte abre quando esta terminar.
              </Text>
            </View>

            {journey ? (
              <JourneyMap
                units={journey.track.units}
                recommendedNodeId={journey.nextRecommendedNode?.id}
                onNodePress={openNode}
                isNodeDisabled={(node) => !canOpenJourneyNode(node)}
              />
            ) : null}

            {error ? (
              <View style={styles.errorCard} accessibilityRole="alert">
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <AppButton
              onPress={() => {
                if (journey?.nextRecommendedNode) void openNode(journey.nextRecommendedNode);
              }}
              disabled={!journey?.nextRecommendedNode}
              accessibilityLabel={continueLabel}
              accessibilityHint="Abre o próximo ponto elegível da trilha selecionada."
              variant="galaxy"
            >
              {continueLabel}
            </AppButton>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  safe: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statusBar: { paddingHorizontal: space.s3, paddingTop: space.s1, paddingBottom: space.s1, alignItems: 'center' },
  appTitle: { ...typography.label, letterSpacing: 3, color: galaxyColors.textTertiary },
  content: { padding: space.s3, gap: space.s3, paddingBottom: tabBarClearance },
  introCard: {
    backgroundColor: galaxyColors.surface,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    gap: space.s1,
  },
  eyebrow: { ...typography.micro, color: galaxyColors.ctaGradientEnd, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase' },
  title: { ...typography.h2, color: galaxyColors.textPrimary },
  subtitle: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  errorCard: {
    backgroundColor: 'rgba(255,59,48,0.10)',
    borderRadius: radius.rMd,
    borderWidth: 1,
    borderColor: 'rgba(255,59,48,0.25)',
    padding: space.s3,
  },
  errorText: { ...typography.bodyRegular, color: '#FF6B6B' },
});
