import React, { useCallback, useMemo, useRef, useState } from 'react';
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
import { PixelIllustration } from '../../../ui/characters/PixelIllustration';
import { PushService } from '../../push/services/PushService';
import { ReminderRow } from '../../push/components/ReminderRow';
import { JourneyReviewRow } from '../components/JourneyReviewRow';
import { JourneyStarsService } from '../services/JourneyStarsService';
import type { LessonStars } from '../../quiz/services/resolveLessonStars';

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
  const [starsByLessonId, setStarsByLessonId] = useState<Record<string, LessonStars>>({});
  // Lembrete diário (ADR de 2026-10-16). A Home legada era a única que
  // agendava e convidava, e ela não se alcança com a trilha. A linha do
  // lembrete aparece aqui, na volta da primeira lição concluída, e não no
  // resumo da lição, que fica limpo por decisão de 2026-08-14. Ela é um
  // interruptor e não um convite: continua ali para quem quiser mudar de ideia.
  const [reminderVisible, setReminderVisible] = useState(false);
  // O esqueleto é só da primeira leitura. Na volta à aba a releitura é
  // silenciosa: trocar a lista pelo carregamento a desmontava, e o aluno
  // voltava com a trilha no topo (visto no simulador em 2026-10-16).
  const hasLoadedRef = useRef(false);

  const loadSnapshot = useCallback(async () => {
    try {
      if (!hasLoadedRef.current) setLoading(true);
      setError(null);
      // A meta do dia saiu daqui com o hero: ela tem superfície própria e
      // completa na aba Missões, com seleção de nível, e duplicá-la na trilha
      // era o que fazia o primeiro quadro de Estude não mostrar trilha nenhuma.
      const [nextSnapshot, nextTrail, nextHearts, nextStars] = await Promise.all([
        JourneyProgressService.bootstrap(),
        JourneyCurriculumService.getCurriculumTrail(),
        heartsRepository.getSnapshot(Date.now()),
        // Estrelas são enfeite da medalha: não ler o recorde não pode derrubar
        // a trilha. Sem elas, a aula concluída aparece em ouro, sem estrelas.
        JourneyStarsService.getRecordStarsByLessonId().catch((cause) => {
          console.error('[JourneyHomeScreen] Failed to load lesson stars:', cause);
          return {} as Record<string, LessonStars>;
        }),
      ]);
      setSnapshot(nextSnapshot);
      setTrail(nextTrail);
      setHearts(nextHearts);
      setStarsByLessonId(nextStars);
      const hasCompletedLesson = nextTrail.segments.some((segment) =>
        segment.units.some((unit) =>
          unit.nodes.some((node) => node.type === 'lesson' && node.status === 'completed'),
        ),
      );
      setReminderVisible(hasCompletedLesson);
      hasLoadedRef.current = true;
    } catch (cause) {
      console.error('[JourneyHomeScreen] Failed to load journey snapshot:', cause);
      setError('Não foi possível carregar a trilha.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void TelemetryService.track('screen_view', { screen: 'journey_home' });
      void PushService.scheduleDailyIfEligible({ reason: 'journey_focus' });
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

  const dueReviewNode = useMemo(
    () => snapshot?.track.units.flatMap(unit => unit.nodes).find(node => node.status === 'due-review') ?? null,
    [snapshot],
  );

  const dueReviewCount = snapshot?.nextDecision?.dueReviewCount ?? snapshot?.dueReviewCount ?? 0;

  const trailHeader = (
    <View style={styles.trailHeader}>
      <JourneyStageHeader title={currentStage.title} completed={currentStage.completed} total={currentStage.total} />
      {/* Sem o nó de revisão a linha não teria para onde levar: some junto. */}
      <JourneyReviewRow
        dueCount={dueReviewNode ? dueReviewCount : 0}
        onPress={() => { if (dueReviewNode) void openNode(dueReviewNode); }}
      />
      <JourneyRecommendationCard
        node={homeNextNode && canOpenNode(homeNextNode) ? homeNextNode : null}
        reason={snapshot?.nextDecision?.reason}
        futureReviewAtMs={futureReviewAtMs}
        onOpen={() => { if (homeNextNode) void openNode(homeNextNode); }}
        accessory={<PixelIllustration size="sm" state="guide" />}
      />
    </View>
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
              dueReviewCount={dueReviewCount}
              starsByLessonId={starsByLessonId}
              onNodePress={(node) => {
                void openNode(node);
              }}
              isNodeDisabled={(node) => !canOpenNode(node)}
            />
            <ReminderRow visible={reminderVisible} />
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
