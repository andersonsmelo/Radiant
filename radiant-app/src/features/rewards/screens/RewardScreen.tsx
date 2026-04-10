import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppButton } from '../../../components/ui/AppButton';
import { PixelHeroSplit } from '../../../components/ui/PixelHeroSplit';
import { StatItem } from '../../../components/ui/StatItem';
import { SurfaceCard } from '../../../components/ui/SurfaceCard';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { canOpenJourneyNode, getJourneyNodeHref } from '../../journey/services/JourneyNodeRouting';
import type { JourneyNode, JourneySnapshot } from '../../../types/journey';
import { colors } from '../../../ui/theme';
import { layout, radius, space, typography } from '../../../ui/styles';
import { RatingPromptService } from '../../../services/RatingPromptService';
import { PaywallService, type PaywallOffer } from '../../paywall/PaywallService';
import { PaywallOfferCard } from '../../paywall/components/PaywallOfferCard';
import { UpgradeInterestService } from '../../paywall/UpgradeInterestService';

interface RewardScreenProps {
  nodeId?: string;
}

function findFallbackReward(snapshot: JourneySnapshot | null): JourneyNode | null {
  if (!snapshot) {
    return null;
  }

  return snapshot.track.units
    .flatMap((unit) => unit.nodes)
    .find((node) => node.type === 'reward' && (node.status === 'available' || node.status === 'active')) ?? null;
}

function findReward(snapshot: JourneySnapshot | null, nodeId?: string): JourneyNode | null {
  if (!snapshot) {
    return null;
  }

  if (nodeId) {
    const targetNode = snapshot.track.units
      .flatMap((unit) => unit.nodes)
      .find((node) => node.id === nodeId && node.type === 'reward');

    if (targetNode) {
      return targetNode;
    }
  }

  return findFallbackReward(snapshot);
}

function resolveNextAction(snapshot: JourneySnapshot | null) {
  const nextNode = snapshot?.nextRecommendedNode;

  if (!nextNode) {
    return { label: 'Voltar para jornada', action: () => router.replace('/(tabs)') };
  }

  const href = getJourneyNodeHref(nextNode);
  if (!canOpenJourneyNode(nextNode) || !href) {
    return { label: 'Voltar para jornada', action: () => router.replace('/(tabs)') };
  }

  if (nextNode.type === 'review') {
    return { label: 'Seguir para revisão', action: () => router.replace(href) };
  }

  if (nextNode.type === 'lesson') {
    return { label: 'Abrir próxima lição', action: () => router.replace(href) };
  }

  if (nextNode.type === 'checkpoint') {
    return { label: 'Abrir checkpoint', action: () => router.replace(href) };
  }

  if (nextNode.type === 'reward') {
    return { label: 'Receber próxima conquista', action: () => router.replace(href) };
  }

  return { label: 'Voltar para jornada', action: () => router.replace('/(tabs)') };
}

export default function RewardScreen({ nodeId }: RewardScreenProps) {
  const [snapshot, setSnapshot] = useState<JourneySnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paywallOffer, setPaywallOffer] = useState<PaywallOffer | null>(null);
  const [paywallFeedback, setPaywallFeedback] = useState<string | null>(null);
  const [paywallSubmitting, setPaywallSubmitting] = useState(false);

  const loadSnapshot = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const baseSnapshot = await JourneyProgressService.bootstrap();
      const rewardNode = findReward(baseSnapshot, nodeId);

      if (rewardNode && (rewardNode.status === 'available' || rewardNode.status === 'active')) {
        const nextSnapshot = await JourneyProgressService.setCurrentNode(rewardNode.id);
        setSnapshot(nextSnapshot);
        return;
      }

      setSnapshot(baseSnapshot);
    } catch (cause) {
      console.error('[RewardScreen] Failed to load reward snapshot:', cause);
      setError('Nao foi possivel carregar a conquista.');
    } finally {
      setLoading(false);
    }
  }, [nodeId]);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  const rewardNode = useMemo(() => findReward(snapshot, nodeId), [nodeId, snapshot]);

  const activeUnit = useMemo(() => {
    if (!snapshot || !rewardNode) {
      return null;
    }

    return snapshot.track.units.find((unit) => unit.id === rewardNode.unitId) ?? null;
  }, [rewardNode, snapshot]);

  const completedPrimaryNodes = useMemo(() => {
    if (!activeUnit) {
      return 0;
    }

    return activeUnit.nodes.filter((node) => node.type !== 'review' && node.status === 'completed').length;
  }, [activeUnit]);

  const totalPrimaryNodes = useMemo(() => {
    if (!activeUnit) {
      return 0;
    }

    return activeUnit.nodes.filter((node) => node.type !== 'review').length;
  }, [activeUnit]);

  const dueReviewCount = useMemo(() => {
    if (!activeUnit) {
      return 0;
    }

    return activeUnit.nodes.filter((node) => node.type === 'review' && node.status === 'due-review').length;
  }, [activeUnit]);

  const rewardCompleted = completed || rewardNode?.status === 'completed';
  const nextAction = useMemo(() => resolveNextAction(snapshot), [snapshot]);

  const handleComplete = useCallback(async () => {
    if (!rewardNode || rewardCompleted) {
      return;
    }

    try {
      setSubmitting(true);
      const nextSnapshot = await JourneyProgressService.markNodeCompleted(rewardNode.id);
      setSnapshot(nextSnapshot);
      setCompleted(true);
      const reviewShown = await RatingPromptService.maybePromptForReview({
        trigger: 'reward_complete',
        entrySurface: 'reward',
        lessonId: rewardNode.id,
      });
      if (!reviewShown) {
        const offer = await PaywallService.maybePresentOffer({
          trigger: 'reward_complete',
          entrySurface: 'reward',
          lessonId: rewardNode.id,
        });
        setPaywallOffer(offer);
      }
    } catch (cause) {
      console.error('[RewardScreen] Failed to complete reward:', cause);
      setError('Nao foi possivel registrar a conquista agora.');
    } finally {
      setSubmitting(false);
    }
  }, [rewardCompleted, rewardNode]);

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!rewardNode || !activeUnit) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={[layout.container, styles.emptyState]}>
          <SurfaceCard variant="solid" style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Conquista indisponível</Text>
            <Text style={styles.emptyBody}>
              Nenhuma recompensa está elegível neste momento. Volte para a jornada e siga o próximo nó liberado.
            </Text>
            <AppButton onPress={() => router.replace('/(tabs)')} style={styles.fullWidthButton}>
              Voltar para jornada
            </AppButton>
          </SurfaceCard>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={styles.iconButton}
          >
            <MaterialIcons name="close" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerLabel}>Reward</Text>
          <View style={styles.iconSpacer} />
        </View>

        <SurfaceCard variant="glass" style={styles.heroCard}>
          <PixelHeroSplit
            eyebrow="Learning Road"
            message={rewardCompleted
              ? 'Conquista registrada. A jornada recalculou o próximo passo e manteve tudo salvo no fluxo local.'
              : 'Feche esse marco agora para sinalizar a virada de etapa e manter a trilha consistente.'}
            ringValue={completedPrimaryNodes}
            ringTotal={Math.max(totalPrimaryNodes, 1)}
            ringLabel="Marcos concluídos"
            state={rewardCompleted ? 'celebrate' : 'happy'}
            tier={rewardCompleted ? 'advanced' : 'intermediate'}
            accessibilityLabel="Pixel apresentando a conquista da jornada"
          />

          <View style={styles.heroFooter}>
            <Text style={styles.heroFooterLabel}>Unidade ativa</Text>
            <Text style={styles.heroFooterValue}>{activeUnit.title}</Text>
          </View>
        </SurfaceCard>

        <SurfaceCard variant="solid" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{rewardNode.title}</Text>
          <Text style={styles.sectionBody}>
            {rewardNode.description ?? 'Esta conquista fecha o ciclo atual antes do próximo trecho da estrada.'}
          </Text>

          <View style={styles.statsList}>
            <StatItem
              icon={<MaterialIcons name="emoji-events" size={20} color={colors.primary} />}
              label="Status"
              value={rewardCompleted ? 'Conquista registrada localmente' : 'Pronta para ser coletada'}
            />
            <StatItem
              icon={<MaterialIcons name="task-alt" size={20} color={colors.primary} />}
              label="Progresso"
              value={`${completedPrimaryNodes} de ${totalPrimaryNodes} marcos da unidade concluídos`}
            />
            <StatItem
              icon={<MaterialIcons name="refresh" size={20} color={colors.primary} />}
              label="Revisão"
              value={dueReviewCount > 0 ? `${dueReviewCount} revisão pendente nesta unidade` : 'Nenhuma revisão crítica bloqueando a trilha'}
            />
          </View>
        </SurfaceCard>

        {error ? (
          <SurfaceCard variant="solid" style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </SurfaceCard>
        ) : null}

        {paywallOffer ? (
          <PaywallOfferCard
            offer={paywallOffer}
            submitting={paywallSubmitting}
            onPrimary={() => {
              if (paywallSubmitting) {
                return;
              }

              void (async () => {
                try {
                  setPaywallSubmitting(true);
                  const interest = await UpgradeInterestService.captureInterest(paywallOffer, {
                    lessonId: rewardNode.id,
                  });
                  await PaywallService.recordOutcome(paywallOffer, 'cta_tap', { lessonId: rewardNode.id });
                  setPaywallFeedback(
                    interest.email
                      ? `Interesse registrado para ${interest.email}. Vamos avisar quando o Radiant Plus abrir.`
                      : 'Interesse registrado neste dispositivo. Vamos usar esse sinal para abrir o Radiant Plus no momento certo.'
                  );
                } catch (cause) {
                  console.error('[RewardScreen] Failed to capture paywall interest:', cause);
                  setPaywallFeedback('Nao foi possivel registrar seu interesse agora. Tente novamente em outro momento.');
                } finally {
                  setPaywallOffer(null);
                  setPaywallSubmitting(false);
                }
              })();
            }}
            onDismiss={() => {
              if (paywallSubmitting) {
                return;
              }
              void PaywallService.recordOutcome(paywallOffer, 'dismissed', { lessonId: rewardNode.id });
              setPaywallOffer(null);
            }}
          />
        ) : null}

        {paywallFeedback ? (
          <SurfaceCard variant="solid" style={styles.messageCard}>
            <Text style={styles.messageText}>{paywallFeedback}</Text>
          </SurfaceCard>
        ) : null}

        <SurfaceCard variant="elevated" style={styles.actionCard}>
          <Text style={styles.actionTitle}>{rewardCompleted ? 'Reward concluído' : 'Pronto para coletar essa conquista?'}</Text>
          <Text style={styles.actionBody}>
            {rewardCompleted
              ? 'A trilha já registrou esse marco e deixou o próximo passo preparado para você continuar sem retrabalho.'
              : 'Essa ação não cria inventário nem badge complexa neste ciclo. Ela apenas fecha o marco da unidade e registra a progressão no estado local.'}
          </Text>

          {rewardCompleted ? (
            <AppButton onPress={nextAction.action} style={styles.fullWidthButton}>
              {nextAction.label}
            </AppButton>
          ) : (
            <>
              <AppButton onPress={() => void handleComplete()} disabled={submitting} style={styles.fullWidthButton}>
                {submitting ? 'Registrando conquista...' : 'Receber conquista'}
              </AppButton>
              <AppButton
                onPress={() => router.replace('/(tabs)')}
                variant="secondary"
                style={styles.fullWidthButton}
              >
                Voltar para jornada
              </AppButton>
            </>
          )}
        </SurfaceCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const ICON_BUTTON_SIZE = space.s6 + space.s4;
const SCREEN_MAX_WIDTH = 720;

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
  headerRow: {
    ...layout.rowBetween,
    width: '100%',
    maxWidth: SCREEN_MAX_WIDTH,
    alignSelf: 'center',
  },
  iconButton: {
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
    borderRadius: radius.rXl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceGlass,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  iconSpacer: {
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
  },
  headerLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  heroCard: {
    gap: space.s3,
    overflow: 'hidden',
  },
  heroFooter: {
    backgroundColor: 'rgba(255,255,255,0.58)',
    borderRadius: radius.rLg,
    paddingHorizontal: space.s3,
    paddingVertical: space.s2,
    gap: space.s0,
  },
  heroFooterLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroFooterValue: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  sectionCard: {
    gap: space.s2,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  sectionBody: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
  },
  statsList: {
    gap: space.s2,
  },
  actionCard: {
    gap: space.s2,
  },
  actionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  actionBody: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
  },
  fullWidthButton: {
    width: '100%',
  },
  errorCard: {
    borderColor: colors.danger,
  },
  errorText: {
    ...typography.bodyRegular,
    color: colors.danger,
  },
  messageCard: {
    borderColor: colors.borderStrong,
  },
  messageText: {
    ...typography.bodyRegular,
    color: colors.textPrimary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyCard: {
    gap: space.s3,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  emptyBody: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
