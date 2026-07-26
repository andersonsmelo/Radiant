import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DecorativeIcon } from '../../../components/ui/DecorativeIcon';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { AppButton } from '../../../components/ui/AppButton';
import { Confetti } from '../../../components/ui/Confetti';
import { PixelHeroSplit } from '../../../components/ui/PixelHeroSplit';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { HUD } from '../../../ui/components/HUD';
import { GalaxyStatRow } from '../../../ui/components/GalaxyStatRow';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { canOpenJourneyNode, getJourneyNodeHref } from '../../journey/services/JourneyNodeRouting';
import type { JourneyNode, JourneySnapshot } from '../../../types/journey';
import { GamificationService } from '../../gamification/services/GamificationService';
import type { GamificationSnapshot } from '../../../types/gamification';
import { galaxyColors } from '../../../ui/theme';
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
  const [gamification, setGamification] = useState<GamificationSnapshot | null>(null);
  const [displayXp, setDisplayXp] = useState(0);

  useEffect(() => {
    void GamificationService.getSnapshot().then(setGamification);
  }, []);

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

  useEffect(() => {
    if (!rewardCompleted) return;

    const xpTotal = gamification?.totalXp ?? 145;
    let n = 0;
    const id = setInterval(() => {
      n += 6;
      if (n >= xpTotal) { n = xpTotal; clearInterval(id); }
      setDisplayXp(n);
    }, 18);
    return () => clearInterval(id);
  }, [rewardCompleted, gamification?.totalXp]);

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
      <View style={styles.root}>
        <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
        <SafeAreaView style={styles.safe}>
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={galaxyColors.ctaGradientEnd} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (!rewardNode || !activeUnit) {
    return (
      <View style={styles.root}>
        <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
        <SafeAreaView style={styles.safe}>
          <View style={styles.emptyState}>
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Conquista indisponível</Text>
              <Text style={styles.emptyBody}>
                Nenhuma recompensa está elegível neste momento. Volte para a jornada e siga o próximo nó liberado.
              </Text>
              <AppButton onPress={() => router.replace('/(tabs)')} style={styles.fullWidthButton}>
                Voltar para jornada
              </AppButton>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
      <Confetti count={50} run={rewardCompleted} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <HUD
          totalXp={gamification?.totalXp ?? 0}
          streakDays={gamification?.streakDays ?? 0}
          hearts={gamification?.hearts ?? 5}
          maxHearts={gamification?.maxHearts ?? 5}
        />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              style={styles.iconButton}
            >
              <DecorativeIcon name="close" size={22} color={galaxyColors.textPrimary} />
            </Pressable>
            <Text style={styles.headerLabel}>Reward</Text>
            <View style={styles.iconSpacer} />
          </View>

          <View style={styles.heroCard}>
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
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{rewardNode.title}</Text>
            <Text style={styles.sectionBody}>
              {rewardNode.description ?? 'Esta conquista fecha o ciclo atual antes do próximo trecho da estrada.'}
            </Text>

            <View style={styles.statsList}>
              <GalaxyStatRow
                icon={<DecorativeIcon name="emoji-events" size={20} color={galaxyColors.ctaGradientEnd} />}
                label="Status"
                value={rewardCompleted ? 'Conquista registrada localmente' : 'Pronta para ser coletada'}
              />
              <GalaxyStatRow
                icon={<DecorativeIcon name="task-alt" size={20} color={galaxyColors.ctaGradientEnd} />}
                label="Progresso"
                value={`${completedPrimaryNodes} de ${totalPrimaryNodes} marcos da unidade concluídos`}
              />
              <GalaxyStatRow
                icon={<DecorativeIcon name="refresh" size={20} color={galaxyColors.ctaGradientEnd} />}
                label="Revisão"
                value={dueReviewCount > 0 ? `${dueReviewCount} revisão pendente nesta unidade` : 'Nenhuma revisão crítica bloqueando a trilha'}
              />
            </View>
          </View>

          {rewardCompleted && (
            <View style={styles.rewardStack}>
              {/* XP card */}
              <View style={styles.xpCard}>
                <View style={styles.xpIcon}>
                  <Svg width={20} height={20} viewBox="0 0 24 24">
                    <Path d="M13 2L4.5 13.5H11L10 22l9.5-12H14L13 2z" fill="#fff"/>
                  </Svg>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rewardCardLabel}>XP EARNED</Text>
                  <Text style={styles.xpValue}>+{displayXp} XP</Text>
                </View>
                <View style={styles.streakBadge}>
                  <Text style={styles.streakBadgeText}>2× streak</Text>
                </View>
              </View>

              {/* Streak card */}
              <View style={styles.streakCard}>
                <View style={styles.streakIcon}>
                  <Svg width={16} height={16} viewBox="0 0 24 24">
                    <Path d="M12 2C12 2 9 8 9 12c0 1.66 1.34 3 3 3s3-1.34 3-3c0-1-1-3-1-4 0 0 4 2 4 7 0 3.31-2.69 6-6 6S6 18.31 6 15c0-5.5 4-9 6-13z" fill="#FF8A4C"/>
                  </Svg>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rewardCardTitle}>{gamification?.streakDays ?? 0}-day streak maintained</Text>
                  <Text style={styles.rewardCardSub}>Keep it alive tomorrow</Text>
                </View>
              </View>

              {/* Level card */}
              <View style={styles.levelCard}>
                <View style={styles.levelIcon}>
                  <Svg width={16} height={16} viewBox="0 0 24 24">
                    <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" fill="#3DCAE8"/>
                  </Svg>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rewardCardTitle}>Level up — Resident</Text>
                  <Text style={styles.rewardCardSub}>320 XP to Senior Resident</Text>
                </View>
              </View>
            </View>
          )}

          {error ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
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
            <View style={styles.messageCard}>
              <Text style={styles.messageText}>{paywallFeedback}</Text>
            </View>
          ) : null}

          <View style={styles.actionCard}>
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
                  variant="ghost"
                  style={styles.fullWidthButton}
                  textStyle={{ color: galaxyColors.textSecondary }}
                >
                  Voltar para jornada
                </AppButton>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const ICON_BUTTON_SIZE = 36;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: galaxyColors.background,
  },
  safe: {
    flex: 1,
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
    paddingHorizontal: space.s1,
  },
  iconButton: {
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
    borderRadius: radius.rXl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: galaxyColors.border,
  },
  iconSpacer: {
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
  },
  headerLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  heroCard: {
    backgroundColor: galaxyColors.surface,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    gap: space.s3,
    overflow: 'hidden',
  },
  heroFooter: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.rMd,
    paddingHorizontal: space.s3,
    paddingVertical: space.s2,
    gap: space.s0,
  },
  heroFooterLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: galaxyColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroFooterValue: {
    ...typography.h3,
    color: galaxyColors.textPrimary,
  },
  sectionCard: {
    backgroundColor: galaxyColors.surface,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    gap: space.s2,
  },
  sectionTitle: {
    ...typography.h3,
    color: galaxyColors.textPrimary,
  },
  sectionBody: {
    ...typography.bodyRegular,
    color: galaxyColors.textSecondary,
  },
  statsList: {
    gap: space.s2,
    marginTop: space.s1,
  },
  actionCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    gap: space.s2,
  },
  actionTitle: {
    ...typography.h3,
    color: galaxyColors.textPrimary,
  },
  actionBody: {
    ...typography.bodyRegular,
    color: galaxyColors.textSecondary,
  },
  fullWidthButton: {
    width: '100%',
  },
  errorCard: {
    backgroundColor: 'rgba(255,59,48,0.10)',
    borderRadius: radius.rMd,
    borderWidth: 1,
    borderColor: 'rgba(255,59,48,0.25)',
    padding: space.s3,
  },
  errorText: {
    ...typography.bodyRegular,
    color: '#FF6B6B',
  },
  messageCard: {
    backgroundColor: galaxyColors.surfaceMuted,
    borderRadius: radius.rMd,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
  },
  messageText: {
    ...typography.bodyRegular,
    color: galaxyColors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    padding: space.s3,
  },
  emptyCard: {
    backgroundColor: galaxyColors.surface,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    gap: space.s3,
  },
  emptyTitle: {
    ...typography.h3,
    color: galaxyColors.textPrimary,
    textAlign: 'center',
  },
  emptyBody: {
    ...typography.bodyRegular,
    color: galaxyColors.textSecondary,
    textAlign: 'center',
  },
  rewardStack: {
    gap: 8,
  },
  xpCard: {
    backgroundColor: 'rgba(245,166,35,0.20)',
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.40)',
    borderRadius: 18,
    padding: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  xpIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F5A623',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.60)',
    letterSpacing: 0.08,
    textTransform: 'uppercase',
  },
  xpValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.02,
  },
  streakBadge: {
    backgroundColor: 'rgba(245,166,35,0.20)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  streakBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F5A623',
  },
  streakCard: {
    backgroundColor: 'rgba(255,107,44,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,44,0.35)',
    borderRadius: 18,
    padding: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: 'rgba(255,107,44,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelCard: {
    backgroundColor: 'rgba(61,202,232,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(61,202,232,0.35)',
    borderRadius: 18,
    padding: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: 'rgba(61,202,232,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rewardCardSub: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },
});
