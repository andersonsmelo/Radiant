import React, { useCallback, useMemo, useState } from 'react';
import { DecorativeIcon } from '../../../components/ui/DecorativeIcon';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { JourneyProgressService } from '../services/JourneyProgressService';
import type { JourneyNode, JourneySnapshot } from '../../../types/journey';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import type { DailyGoalSnapshot } from '../../../types/dailyGoal';
import { canOpenJourneyNode, getJourneyNodeHref } from '../services/JourneyNodeRouting';
import { AppButton } from '../../../components/ui/AppButton';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { HUD } from '../../../ui/components/HUD';
import { GamificationService } from '../../gamification/services/GamificationService';
import type { GamificationSnapshot } from '../../../types/gamification';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, tabBarClearance, typography } from '../../../ui/styles';
import { JourneyHero } from '../components/JourneyHero';
import { TelemetryService } from '../../telemetry/TelemetryService';
import { useAppOpenLifecycle } from '../../telemetry/hooks/useAppOpenLifecycle';
import { useSporadicPixelSpeech } from '../../pixel-mood/useSporadicPixelSpeech';

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

/** Nome humano do tipo de etapa — o enum interno nunca aparece na tela. */
function nodeTypeLabel(node: JourneyNode): string {
  switch (node.type) {
    case 'lesson':
      return 'Lição';
    case 'review':
      return 'Revisão';
    case 'checkpoint':
      return 'Checkpoint';
    case 'reward':
      return 'Conquista';
    default:
      return 'Etapa';
  }
}

// ── GalaxyStatRow ─────────────────────────────────────────────────
interface GalaxyStatRowProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
}

function GalaxyStatRow({ icon, label, value }: GalaxyStatRowProps) {
  return (
    <View style={galaxyStatRowStyles.row}>
      {icon ? <View style={galaxyStatRowStyles.icon}>{icon}</View> : null}
      <View style={galaxyStatRowStyles.textBlock}>
        <Text style={galaxyStatRowStyles.label}>{label}</Text>
        <Text style={galaxyStatRowStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

const galaxyStatRowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  icon: { width: 28, alignItems: 'center', justifyContent: 'center' },
  textBlock: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 6, flex: 1 },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: galaxyColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: { fontSize: 14, fontWeight: '700', color: galaxyColors.textPrimary },
});

export default function JourneyHomeScreen() {
  // A home oficial é quem responde pela abertura do app. Enquanto isso vivia só
  // na `HomeScreen` legada — inalcançável com `ENABLE_LEARNING_ROAD=true` —,
  // `app_open` nunca era emitido e `cohort.installDate` nunca nascia.
  useAppOpenLifecycle();

  const [snapshot, setSnapshot] = useState<JourneySnapshot | null>(null);
  const [dailyGoalSnapshot, setDailyGoalSnapshot] = useState<DailyGoalSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gamification, setGamification] = useState<GamificationSnapshot | null>(null);

  const loadSnapshot = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [nextSnapshot, nextDailyGoal] = await Promise.all([
        JourneyProgressService.bootstrap(),
        DailyGoalService.getSnapshot(),
      ]);
      setSnapshot(nextSnapshot);
      setDailyGoalSnapshot(nextDailyGoal);
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

  const actionableNodeCount = useMemo(
    () => currentUnit?.nodes.filter((node) => node.status !== 'locked').length ?? 0,
    [currentUnit]
  );

  const pixelSpeech = useSporadicPixelSpeech();

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
    if (!homeNextNode) {
      return 'Nenhum conteúdo elegível agora';
    }

    // "Revisão · Revisão pedida" dizia a mesma palavra duas vezes e soava como
    // cobrança. No único caso em que a revisão ainda chega aqui, o tipo basta.
    if (homeNextNode.type === 'review' || homeNextNode.status === 'due-review') {
      return nodeTypeLabel(homeNextNode);
    }

    return `${nodeTypeLabel(homeNextNode)} · ${statusLabel(homeNextNode)}`;
  }, [homeNextNode]);

  const noNextStepMessage = useMemo(() => {
    if (!snapshot || snapshot.nextRecommendedNode) {
      return null;
    }

    const activeTrackTitle = currentUnit?.title ?? 'Esta trilha';

    return `Você já concluiu tudo que está aberto em ${activeTrackTitle}. Explore outra trilha na aba Galáxia.`;
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
            <JourneyHero
              unitTitle={currentUnit?.title ?? 'Sua trilha'}
              dailyGoalCompleted={dailyGoalSnapshot?.earnedXpToday ?? 0}
              dailyGoalTarget={dailyGoalSnapshot?.goalXp ?? 10}
              message={pixelSpeech?.phrase}
              expression={pixelSpeech?.expression}
            />

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle} accessibilityRole="header">Foco de hoje</Text>
              <View style={styles.summaryList}>
                <GalaxyStatRow
                  icon={<DecorativeIcon name="flag" size={20} color={galaxyColors.ctaGradientEnd} />}
                  label="Próximo"
                  value={recommendedNodeMeta}
                />
                <GalaxyStatRow
                  icon={<DecorativeIcon name="account-tree" size={20} color={galaxyColors.ctaGradientEnd} />}
                  label="Disponível agora"
                  value={
                    actionableNodeCount === 1
                      ? '1 passo liberado nesta unidade'
                      : `${actionableNodeCount} passos liberados nesta unidade`
                  }
                />
                <GalaxyStatRow
                  icon={<DecorativeIcon name="offline-bolt" size={20} color={galaxyColors.ctaGradientEnd} />}
                  label="Offline"
                  value="Seu progresso fica salvo no aparelho, mesmo sem internet"
                />
              </View>
            </View>

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
