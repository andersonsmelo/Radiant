import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { JourneyProgressService } from '../services/JourneyProgressService';
import type { JourneyNode, JourneySnapshot } from '../../../types/journey';
import { canOpenJourneyNode, getJourneyNodeHref } from '../services/JourneyNodeRouting';
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

  const loadSnapshot = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // A meta do dia saiu daqui com o hero: ela tem superfície própria e
      // completa na aba Missões, com seleção de nível, e duplicá-la na trilha
      // era o que fazia o primeiro quadro de Estude não mostrar trilha nenhuma.
      const [nextSnapshot, nextTrail] = await Promise.all([
        JourneyProgressService.bootstrap(),
        JourneyCurriculumService.getCurriculumTrail(),
      ]);
      setSnapshot(nextSnapshot);
      setTrail(nextTrail);
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

  const currentUnit = useMemo(
    () => snapshot?.track.units.find((unit) => unit.id === snapshot.progress.currentUnitId) ?? snapshot?.track.units[0] ?? null,
    [snapshot]
  );

  /**
   * O passo que a HOME anuncia — que não é necessariamente o que o serviço
   * recomenda.
   *
   * A revisão deixou de ser objetivo da Home em 2026-08-14: ela pertence à
   * trilha, onde aparece como nó no percurso. Quando a recomendação cai numa
   * revisão, a Home procura a próxima etapa de APRENDIZADO da unidade e
   * anuncia essa; a revisão continua existindo, só não vira manchete.
   *
   * A escolha é feita aqui, e não em `getNextRecommendedNode`, de propósito: o
   * serviço é a autoridade sobre elegibilidade e alimenta também a Galáxia e o
   * roteamento. Filtrar lá mudaria o que é elegível em TODA a aplicação para
   * resolver um problema de destaque de UMA tela.
   *
   * O fallback devolve a própria revisão: se ela é a única coisa aberta, um
   * botão que aponta para lugar nenhum é pior que um que diz a verdade.
   */
  const homeNextNode = useMemo(() => {
    const recommended = snapshot?.nextRecommendedNode ?? null;

    if (!recommended) {
      return null;
    }

    const isReview = recommended.type === 'review' || recommended.status === 'due-review';

    if (!isReview) {
      return recommended;
    }

    const learningStep = currentUnit?.nodes.find(
      (node) =>
        node.type !== 'review' &&
        node.status !== 'due-review' &&
        node.status !== 'completed' &&
        node.status !== 'locked',
    );

    return learningStep ?? recommended;
  }, [snapshot?.nextRecommendedNode, currentUnit]);

  const continueLabel = useMemo(() => {
    const nextNode = homeNextNode;

    if (!nextNode) {
      return 'Aguardando nova etapa';
    }

    if (nextNode.status === 'resumable') {
      return 'Retomar etapa';
    }

    // Só chega aqui quando a revisão é a única coisa aberta na unidade: nesse
    // caso o botão diz o que vai abrir, porque prometer "continuar jornada" e
    // entregar uma revisão é pior que nomeá-la.
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
  }, [homeNextNode]);

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

    const recommendedId = trail?.recommendedNodeId ?? snapshot?.nextRecommendedNode?.id;
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

  const noNextStepMessage = useMemo(() => {
    if (!snapshot || snapshot.nextRecommendedNode) {
      return null;
    }

    const activeTrackTitle = currentUnit?.title ?? 'Esta trilha';

    // Até 2026-08-21 esta frase mandava o aluno para "a aba Galáxia". A aba foi
    // absorvida por Estude, e o percurso contínuo já mostra o que vem adiante —
    // rolar para frente é a ação, não trocar de superfície.
    return `Você já concluiu tudo que está aberto em ${activeTrackTitle}. Role a trilha para ver o que vem adiante.`;
  }, [currentUnit?.title, snapshot]);

  return (
    <View style={styles.root} testID="journey-home-screen">
      <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
      <SafeAreaView style={styles.safe} edges={['top']}>
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
              accessibilityLabel="Carregando jornada"
            />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="always"
          >
            <JourneyStageHeader
              title={currentStage.title}
              completed={currentStage.completed}
              total={currentStage.total}
            />

            <JourneyTrail
              segments={trail?.segments ?? []}
              recommendedNodeId={trail?.recommendedNodeId ?? snapshot?.nextRecommendedNode?.id}
              onNodePress={(node) => {
                void openNode(node);
              }}
              isNodeDisabled={(node) => !canOpenNode(node)}
            />

            {noNextStepMessage ? (
              <View style={styles.messageCard}>
                <Text style={styles.messageTitle}>Trilha pausada por agora</Text>
                <Text style={styles.messageText}>{noNextStepMessage}</Text>
              </View>
            ) : null}

            {error ? (
              <View style={styles.errorCard} accessibilityRole="alert">
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <AppButton
              onPress={() => {
                if (homeNextNode) {
                  void openNode(homeNextNode);
                }
              }}
              disabled={!homeNextNode || !canOpenNode(homeNextNode)}
              style={styles.cta}
              accessibilityLabel={continueLabel}
              accessibilityHint="Abre o próximo passo elegível da trilha ativa."
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
  content: { padding: space.s3, gap: space.s3, paddingBottom: tabBarClearance },
  summaryCard: {
    backgroundColor: galaxyColors.surface,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    gap: space.s2,
  },
  summaryTitle: { ...typography.h3, color: galaxyColors.textPrimary },
  summaryList: { gap: space.s2 },
  messageCard: {
    backgroundColor: galaxyColors.surface,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    gap: space.s1,
  },
  messageTitle: { ...typography.body, color: galaxyColors.textPrimary, fontWeight: '700' },
  messageText: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  errorCard: {
    backgroundColor: 'rgba(255,59,48,0.10)',
    borderRadius: radius.rMd,
    borderWidth: 1,
    borderColor: 'rgba(255,59,48,0.25)',
    padding: space.s3,
  },
  errorText: { ...typography.bodyRegular, color: '#FF6B6B' },
  cta: { marginTop: space.s1 },
});
