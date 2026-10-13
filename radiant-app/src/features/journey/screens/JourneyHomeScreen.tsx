import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { JourneyProgressService } from '../services/JourneyProgressService';
import type { JourneyNode, JourneySnapshot } from '../../../types/journey';
import { canOpenJourneyNode, getJourneyNodeHref, getNextNodeHref } from '../services/JourneyNodeRouting';
import { AppButton } from '../../../components/ui/AppButton';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { HUD } from '../../../ui/components/HUD';
import { GamificationService } from '../../gamification/services/GamificationService';
import type { GamificationSnapshot } from '../../../types/gamification';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, tabBarClearance, typography } from '../../../ui/styles';
import { JourneyStageHeader } from '../components/JourneyStageHeader';
import { JourneyTrail } from '../components/JourneyTrail';
import { JourneyCurriculumService, type CurriculumTrail } from '../services/JourneyCurriculumService';
import { computeSegmentPrimaryProgress } from '../services/JourneyUnitProgress';
import { TelemetryService } from '../../telemetry/TelemetryService';
import { useAppOpenLifecycle } from '../../telemetry/hooks/useAppOpenLifecycle';
import { heartsRepository } from '../../hearts/HeartsRepository';
import { MAX_HEARTS } from '../../hearts/HeartsService';
import type { HeartsSnapshot } from '../../hearts/hearts.types';
import { HeartsSheet } from '../../hearts/components/HeartsSheet';
import { subscriptionService } from '../../subscription/SubscriptionService';
import { JourneyRecommendationCard } from '../components/JourneyRecommendationCard';

export default function JourneyHomeScreen() {
  // A home oficial é quem responde pela abertura do app. Enquanto isso vivia só
  // na `HomeScreen` legada — inalcançável com `ENABLE_LEARNING_ROAD=true` —,
  // `app_open` nunca era emitido e `cohort.installDate` nunca nascia.
  useAppOpenLifecycle();

  const [snapshot, setSnapshot] = useState<JourneySnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gamification, setGamification] = useState<GamificationSnapshot | null>(null);
  const [trail, setTrail] = useState<CurriculumTrail | null>(null);
  const [hearts, setHearts] = useState<HeartsSnapshot | null>(null);
  const [heartsSheetVisible, setHeartsSheetVisible] = useState(false);

  const loadSnapshot = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // A meta do dia saiu daqui com o hero: ela tem superfície própria e
      // completa na aba Missões, com seleção de nível, e duplicá-la na trilha
      // era o que fazia o primeiro quadro de Estude não mostrar trilha nenhuma.
      const [nextSnapshot, nextTrail, nextHearts] = await Promise.all([
        JourneyProgressService.bootstrap(),
        JourneyCurriculumService.getCurriculumTrail(),
        heartsRepository.getSnapshot(Date.now()),
      ]);
      setSnapshot(nextSnapshot);
      setTrail(nextTrail);
      setHearts(nextHearts);
    } catch (cause) {
      console.error('[JourneyHomeScreen] Failed to load journey snapshot:', cause);
      setError('Não foi possível carregar a jornada.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void TelemetryService.track('screen_view', { screen: 'journey_home' });
      void loadSnapshot();
      void GamificationService.getSnapshot().then(setGamification);
    }, [loadSnapshot])
  );

  const homeNextNode = snapshot?.nextRecommendedNode ?? null;

  /**
   * O estágio que o cabeçalho nomeia e conta.
   *
   * É o segmento que contém o nó recomendado — o trecho em que o aluno está de
   * fato, que não é necessariamente o primeiro nem o último aberto. Sem
   * recomendação, cai no último segmento com algum nó concluído, e daí no
   * primeiro: um cabeçalho que não sabe onde o aluno está é pior que um que
   * chuta o começo, porque some.
   */
  const currentStage = useMemo(() => {
    const segments = trail?.segments ?? [];
    const nodesOf = (segment: (typeof segments)[number]) =>
      segment.units.flatMap((unit) => unit.nodes);

    const recommendedId = snapshot?.nextRecommendedNode?.id ?? trail?.recommendedNodeId;
    const withRecommended = recommendedId
      ? segments.find((segment) => nodesOf(segment).some((node) => node.id === recommendedId))
      : undefined;
    const lastTouched = [...segments]
      .reverse()
      .find((segment) => nodesOf(segment).some((node) => node.status === 'completed'));
    const segment = withRecommended ?? lastTouched ?? segments[0];

    if (!segment) {
      return { title: snapshot?.track.title ?? 'Sua trilha', completed: 0, total: 0 };
    }

    // A contagem NÃO é feita aqui. `computeSegmentPrimaryProgress` é a mesma
    // regra que a conclusão de lição e o checkpoint usam — revisão não conta
    // como marco. Contar todos os nós aqui foi o defeito medido em 2026-08-21:
    // o topo anunciava "2 de 21" e a conclusão anunciava "3 de 14" para o mesmo
    // currículo, minutos depois.
    return { title: segment.trackTitle, ...computeSegmentPrimaryProgress(segment.units) };
  }, [trail, snapshot?.nextRecommendedNode?.id, snapshot?.track.title]);

  const canOpenNode = useCallback((node: JourneyNode) => {
    // A data futura permanece informativa, mesmo se um snapshot estiver stale.
    const futureReview = node.type === 'review' && Number.isFinite(node.reviewAvailableAtMs)
      && node.reviewAvailableAtMs! > Date.now();
    return !futureReview && canOpenJourneyNode(node);
  }, []);

  const openNode = useCallback(async (node: JourneyNode) => {
    const decision = snapshot?.nextDecision;
    // O progresso salva o índice do player (base zero); /learn e o helper
    // serializam IDs de cursor (base um), como os checkpoints. Converta só
    // nesta fronteira, sem alterar o índice salvo nem a convenção do helper.
    const routeDecision = decision && (node.type === 'lesson' || node.type === 'review')
      && decision.reason === 'paused-lesson' && decision.resumeStepIndex !== undefined
      ? { ...decision, resumeStepIndex: decision.resumeStepIndex + 1 }
      : decision;
    const href = routeDecision?.nodeId === node.id
      ? getNextNodeHref(node, routeDecision)
      : getJourneyNodeHref(node);

    if (!canOpenNode(node) || !href) {
      Alert.alert('Ainda não disponível', 'Esse nó ainda não está elegível na jornada.');
      return;
    }

    await JourneyProgressService.setCurrentNode(node.id);
    router.push(href);
  }, [canOpenNode, snapshot?.nextDecision]);

  const futureReviewAtMs = useMemo(() => {
    const dates = (snapshot?.track.units.flatMap(unit => unit.nodes) ?? [])
      .filter(node => node.type === 'review' && Number.isFinite(node.reviewAvailableAtMs)
        && node.reviewAvailableAtMs! > Date.now())
      .map(node => node.reviewAvailableAtMs!);
    return dates.length > 0 ? Math.min(...dates) : undefined;
  }, [snapshot]);

  const trailHeader = (
    <View style={styles.trailHeader}>
      <JourneyStageHeader title={currentStage.title} completed={currentStage.completed} total={currentStage.total} />
      <JourneyRecommendationCard
        node={homeNextNode && canOpenNode(homeNextNode) ? homeNextNode : null}
        reason={snapshot?.nextDecision?.reason}
        futureReviewAtMs={futureReviewAtMs}
        onOpen={() => { if (homeNextNode) void openNode(homeNextNode); }}
      />
    </View>
  );

  const dueReviewNode = useMemo(
    () => snapshot?.track.units.flatMap(unit => unit.nodes).find(node => node.status === 'due-review') ?? null,
    [snapshot],
  );

  return (
    <View style={styles.root} testID="journey-home-screen">
      <StarfieldBackground variant="focused" backgroundColor={galaxyColors.background} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <HUD
          totalXp={gamification?.totalXp ?? 0}
          streakDays={gamification?.streakDays ?? 0}
          hearts={hearts?.count ?? MAX_HEARTS}
          maxHearts={MAX_HEARTS}
          heartsSnapshot={hearts ?? undefined}
          onHeartsPress={() => setHeartsSheetVisible(true)}
        />
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator
              size="large"
              color={galaxyColors.ctaGradientEnd}
              accessibilityRole="progressbar"
              accessibilityLabel="Carregando jornada"
            />
            <Text style={styles.loadingText}>Preparando sua trilha…</Text>
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <View style={styles.errorCard} accessibilityRole="alert">
              <Text style={styles.errorText}>{error}</Text>
            </View>
            <AppButton onPress={() => void loadSnapshot()} style={styles.retry}>Tentar novamente</AppButton>
          </View>
        ) : (
          <View style={styles.content}>
            <JourneyTrail
              header={trailHeader}
              segments={trail?.segments ?? []}
              recommendedNodeId={snapshot?.nextRecommendedNode?.id ?? trail?.recommendedNodeId}
              recommendationReason={snapshot?.nextDecision?.reason}
              dueReviewCount={snapshot?.nextDecision?.dueReviewCount ?? snapshot?.dueReviewCount ?? 0}
              onNodePress={(node) => {
                void openNode(node);
              }}
              isNodeDisabled={(node) => !canOpenNode(node)}
            />
          </View>
        )}
      </SafeAreaView>
      {hearts ? (
        <HeartsSheet
          visible={heartsSheetVisible && hearts.status !== 'unlimited'}
          snapshot={hearts}
          dueReviewCount={snapshot?.dueReviewCount ?? 0}
          storeAvailable={subscriptionService.storeAvailable()}
          onClose={() => setHeartsSheetVisible(false)}
          onReview={() => {
            setHeartsSheetVisible(false);
            if (dueReviewNode) void openNode(dueReviewNode);
          }}
          onSubscribe={() => {
            // A volta da assinatura passa pelo `useFocusEffect` acima, que
            // relê as vidas: assinante ganha ∞ no cabeçalho e a folha some.
            setHeartsSheetVisible(false);
            router.push('/subscription');
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  safe: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.s3, gap: space.s2 },
  loadingText: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  content: { flex: 1, padding: space.s3, gap: space.s3, paddingBottom: tabBarClearance },
  trailHeader: { gap: space.s3 },
  errorCard: {
    backgroundColor: 'rgba(255,59,48,0.10)',
    borderRadius: radius.rMd,
    borderWidth: 1,
    borderColor: 'rgba(255,59,48,0.25)',
    padding: space.s3,
  },
  errorText: { ...typography.bodyRegular, color: '#FF6B6B' },
  retry: { marginTop: space.s1 },
});
