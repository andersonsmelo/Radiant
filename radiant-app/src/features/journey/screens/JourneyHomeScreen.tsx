import React, { useCallback, useMemo, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { JourneyProgressService } from '../services/JourneyProgressService';
import type { JourneyNode, JourneySnapshot } from '../../../types/journey';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import type { DailyGoalSnapshot } from '../../../types/dailyGoal';
import { canOpenJourneyNode, getJourneyNodeHref } from '../services/JourneyNodeRouting';
import { AppButton } from '../../../components/ui/AppButton';
import { StatItem } from '../../../components/ui/StatItem';
import { SurfaceCard } from '../../../components/ui/SurfaceCard';
import { colors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';
import { JourneyHero } from '../components/JourneyHero';
import { JourneyMap } from '../components/JourneyMap';
import { JourneyTrackShelf } from '../components/JourneyTrackShelf';
import { TelemetryService } from '../../telemetry/TelemetryService';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import type { LearningTrack, LessonCatalogManifest } from '../../content/content.types';

function statusLabel(node: JourneyNode): string {
  switch (node.status) {
    case 'available':
      return 'Disponível';
    case 'active':
      return 'Em andamento';
    case 'resumable':
      return 'Retomável';
    case 'completed':
      return 'Concluído';
    case 'due-review':
      return 'Revisão pedida';
    default:
      return 'Bloqueado';
  }
}

export default function JourneyHomeScreen() {
  const [snapshot, setSnapshot] = useState<JourneySnapshot | null>(null);
  const [dailyGoalSnapshot, setDailyGoalSnapshot] = useState<DailyGoalSnapshot | null>(null);
  const [catalogManifest, setCatalogManifest] = useState<LessonCatalogManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSnapshot = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [nextSnapshot, nextDailyGoal, nextCatalogManifest] = await Promise.all([
        JourneyProgressService.bootstrap(),
        DailyGoalService.getSnapshot(),
        LessonCatalogService.bootstrap(),
      ]);
      setSnapshot(nextSnapshot);
      setDailyGoalSnapshot(nextDailyGoal);
      setCatalogManifest(nextCatalogManifest);
    } catch (cause) {
      console.error('[JourneyHomeScreen] Failed to load journey snapshot:', cause);
      setError('Nao foi possivel carregar a Learning Road.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void TelemetryService.track('screen_view', { screen: 'journey_home' });
      void loadSnapshot();
    }, [loadSnapshot])
  );

  const currentUnit = useMemo(
    () => snapshot?.track.units.find((unit) => unit.id === snapshot.progress.currentUnitId) ?? snapshot?.track.units[0] ?? null,
    [snapshot]
  );

  const actionableNodeCount = useMemo(
    () => currentUnit?.nodes.filter((node) => node.status !== 'locked').length ?? 0,
    [currentUnit]
  );

  const totalJourneyNodeCount = useMemo(
    () => snapshot?.track.units.reduce((total, unit) => total + unit.nodes.length, 0) ?? 0,
    [snapshot]
  );

  const activeTrackProgressPercent = useMemo(() => {
    if (!snapshot || totalJourneyNodeCount === 0) {
      return 0;
    }

    return Math.round((snapshot.completedCount / totalJourneyNodeCount) * 100);
  }, [snapshot, totalJourneyNodeCount]);

  const activeCatalogTrack = useMemo(
    () => catalogManifest?.tracks.find((track) => track.id === snapshot?.progress.activeTrackId) ?? null,
    [catalogManifest, snapshot?.progress.activeTrackId]
  );

  const continueLabel = useMemo(() => {
    const nextNode = snapshot?.nextRecommendedNode;

    if (!nextNode) {
      return 'Aguardando nova etapa';
    }

    if (nextNode.status === 'resumable') {
      return 'Retomar etapa';
    }

    if (nextNode.type === 'review' || nextNode.status === 'due-review') {
      return 'Fazer revisão';
    }

    if (nextNode.type === 'checkpoint') {
      return 'Abrir checkpoint';
    }

    if (nextNode.type === 'reward') {
      return 'Receber conquista';
    }

    return 'Continuar jornada';
  }, [snapshot?.nextRecommendedNode]);

  const heroMessage = useMemo(() => {
    if (!snapshot?.nextRecommendedNode) {
      return 'Você fechou o trecho disponível. Assim que houver um novo passo elegível, Pixel te puxa de volta para a trilha.';
    }

    if (snapshot.nextRecommendedNode.type === 'review' || snapshot.nextRecommendedNode.status === 'due-review') {
      return `Bom ritmo. Antes de avançar, vale consolidar ${snapshot.nextRecommendedNode.title.toLowerCase()}.`;
    }

    if (snapshot.nextRecommendedNode.type === 'checkpoint') {
      return 'Você fechou a lição atual. Agora valide o trecho da unidade antes de puxar o próximo conteúdo.';
    }

    if (snapshot.nextRecommendedNode.type === 'reward') {
      return 'Boa. Antes de puxar o próximo trecho, colete a conquista que fecha esse marco da unidade.';
    }

    return `Você está indo bem. O próximo passo da sua trilha é ${snapshot.nextRecommendedNode.title.toLowerCase()}.`;
  }, [snapshot]);

  const canOpenNode = useCallback((node: JourneyNode) => canOpenJourneyNode(node), []);

  const openNode = useCallback(async (node: JourneyNode) => {
    const href = getJourneyNodeHref(node);

    if (!canOpenNode(node) || !href) {
      Alert.alert('Ainda não disponível', 'Esse nó ainda não está elegível na jornada.');
      return;
    }

    await JourneyProgressService.setCurrentNode(node.id);
    router.push(href);
  }, [canOpenNode]);

  const recommendedNodeMeta = useMemo(() => {
    if (!snapshot?.nextRecommendedNode) {
      return 'Nenhum conteúdo elegível agora';
    }

    return `${snapshot.nextRecommendedNode.type} · ${statusLabel(snapshot.nextRecommendedNode)}`;
  }, [snapshot]);

  const noNextStepMessage = useMemo(() => {
    if (!snapshot || snapshot.nextRecommendedNode) {
      return null;
    }

    const activeTrackTitle = activeCatalogTrack?.title ?? currentUnit?.title ?? 'Esta trilha';

    return `${activeTrackTitle} está pronta no catálogo, mas não há um nó elegível para abrir agora. Você pode acompanhar por aqui e trocar de trilha assim que quiser.`;
  }, [activeCatalogTrack?.title, currentUnit?.title, snapshot]);

  const openTrack = useCallback(async (track: LearningTrack) => {
    void TelemetryService.track('journey_track_selected', {
      trackId: track.id,
      active: track.id === snapshot?.progress.activeTrackId,
    });

    const nextSnapshot = await JourneyProgressService.selectTrack(track.id);
    setSnapshot(nextSnapshot);

    if (nextSnapshot.nextRecommendedNode) {
      void openNode(nextSnapshot.nextRecommendedNode);
    }
  }, [openNode, snapshot]);

  return (
    <SafeAreaView style={styles.screen}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="always"
        >
          <JourneyHero
            unitTitle={currentUnit?.title ?? 'Sua trilha'}
            dailyGoalCompleted={dailyGoalSnapshot?.completedToday ?? 0}
            dailyGoalTarget={dailyGoalSnapshot?.goalPerDay ?? 1}
            message={heroMessage}
          />

          <SurfaceCard variant="solid" style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Foco de hoje</Text>
            <View style={styles.summaryList}>
              <StatItem
                icon={<MaterialIcons name="flag" size={20} color={colors.primary} />}
                label="Próximo"
                value={recommendedNodeMeta}
              />
              <StatItem
                icon={<MaterialIcons name="account-tree" size={20} color={colors.primary} />}
                label="Nós ativos"
                value={`${actionableNodeCount} passos elegíveis nesta unidade`}
              />
              <StatItem
                icon={<MaterialIcons name="offline-bolt" size={20} color={colors.primary} />}
                label="Sync"
                value="Modo local-first ativo, com progresso protegido mesmo sem rede"
              />
            </View>
          </SurfaceCard>

          <JourneyTrackShelf
            tracks={catalogManifest?.tracks ?? []}
            lessons={catalogManifest?.lessons ?? []}
            activeTrackId={snapshot?.progress.activeTrackId ?? 'track-radiology-foundations'}
            activeProgressPercent={activeTrackProgressPercent}
            onTrackPress={openTrack}
          />

          {noNextStepMessage ? (
            <SurfaceCard variant="solid" style={styles.messageCard}>
              <Text style={styles.messageTitle}>Trilha pausada por agora</Text>
              <Text style={styles.messageText}>{noNextStepMessage}</Text>
            </SurfaceCard>
          ) : null}

          {error ? (
            <SurfaceCard variant="solid" style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
            </SurfaceCard>
          ) : null}

          {snapshot && currentUnit ? (
            <JourneyMap
              units={snapshot.track.units}
              recommendedNodeId={snapshot.nextRecommendedNode?.id}
              onNodePress={(node) => void openNode(node)}
              isNodeDisabled={(node) => !canOpenNode(node)}
            />
          ) : null}

          <AppButton
            onPress={() => {
              if (snapshot?.nextRecommendedNode) {
                void openNode(snapshot.nextRecommendedNode);
              }
            }}
            disabled={!snapshot?.nextRecommendedNode || !canOpenNode(snapshot.nextRecommendedNode)}
            style={styles.cta}
          >
            {continueLabel}
          </AppButton>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: space.s3,
    gap: space.s3,
    paddingBottom: space.s5,
  },
  summaryCard: {
    gap: space.s2,
  },
  summaryTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  summaryList: {
    gap: space.s2,
  },
  messageCard: {
    gap: space.s1,
    borderColor: colors.borderSoft,
  },
  messageTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  messageText: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
  },
  errorCard: {
    borderColor: colors.danger,
  },
  errorText: {
    ...typography.bodyRegular,
    color: colors.danger,
  },
  cta: {
    marginTop: space.s1,
  },
});
