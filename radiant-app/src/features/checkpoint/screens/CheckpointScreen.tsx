import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DecorativeIcon } from '../../../components/ui/DecorativeIcon';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AppButton } from '../../../components/ui/AppButton';
import { PixelHeroSplit } from '../../../components/ui/PixelHeroSplit';
import { Confetti } from '../../../components/ui/Confetti';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { HUD } from '../../../ui/components/HUD';
import { XpIcon } from '../../../ui/components/HudIcons';
import { GalaxyStatRow } from '../../../ui/components/GalaxyStatRow';
import { PixelIllustration } from '../../../ui/characters/PixelIllustration';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { canOpenJourneyNode, getJourneyNodeHref } from '../../journey/services/JourneyNodeRouting';
import type { JourneyNode, JourneySnapshot } from '../../../types/journey';
import { GamificationService } from '../../gamification/services/GamificationService';
import type { GamificationSnapshot } from '../../../types/gamification';
import { galaxyColors } from '../../../ui/theme';
import { layout, radius, space, typography } from '../../../ui/styles';
import { PaywallService, type PaywallOffer } from '../../paywall/PaywallService';
import { PaywallOfferCard } from '../../paywall/components/PaywallOfferCard';
import { UpgradeInterestService } from '../../paywall/UpgradeInterestService';
import {
  STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
  useShadowCheckpoint,
} from '../../student-checkpoints/useShadowCheckpoint';
import { useActiveCheckpoint } from '../../student-checkpoints/useActiveCheckpoint';
import { ProductionCurriculumCatalog } from '../../student-checkpoints/ProductionCurriculumCatalog';
import { UnitCheckpointService, type UnitCheckpointEvaluation } from '../../student-checkpoints/UnitCheckpointService';
import type { ItemOutcomeV1 } from '../../student-checkpoints/contracts';

interface CheckpointScreenProps {
  nodeId?: string;
  resumeCheckpointId?: string;
  resumeCursorId?: string;
}

function findFallbackCheckpoint(snapshot: JourneySnapshot | null): JourneyNode | null {
  if (!snapshot) {
    return null;
  }

  return snapshot.track.units
    .flatMap((unit) => unit.nodes)
    .find((node) => node.type === 'checkpoint' && (node.status === 'available' || node.status === 'active')) ?? null;
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

  if (nextNode.type === 'reward') {
    return { label: 'Receber conquista', action: () => router.replace(href) };
  }

  if (nextNode.type === 'checkpoint') {
    return { label: 'Abrir checkpoint', action: () => router.replace(href) };
  }

  return { label: 'Voltar para jornada', action: () => router.replace('/(tabs)') };
}

export default function CheckpointScreen({ nodeId, resumeCheckpointId, resumeCursorId }: CheckpointScreenProps) {
  const [snapshot, setSnapshot] = useState<JourneySnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [checkpointStarted, setCheckpointStarted] = useState(false);
  const [checkpointItemIndex, setCheckpointItemIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [checkpointAnswers, setCheckpointAnswers] = useState<Record<string, string>>({});
  const [checkpointEvaluation, setCheckpointEvaluation] = useState<UnitCheckpointEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paywallOffer, setPaywallOffer] = useState<PaywallOffer | null>(null);
  const [paywallFeedback, setPaywallFeedback] = useState<string | null>(null);
  const [paywallSubmitting, setPaywallSubmitting] = useState(false);

  const [gamification, setGamification] = useState<GamificationSnapshot | null>(null);

  useEffect(() => {
    void GamificationService.getSnapshot().then(setGamification);
  }, []);

  const loadSnapshot = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const nextSnapshot = await JourneyProgressService.bootstrap();
      setSnapshot(nextSnapshot);
    } catch (cause) {
      console.error('[CheckpointScreen] Failed to load journey snapshot:', cause);
      setError('Nao foi possivel carregar o checkpoint.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  const checkpointNode = useMemo(() => {
    if (!snapshot) {
      return null;
    }

    if (nodeId) {
      const targetNode = snapshot.track.units
        .flatMap((unit) => unit.nodes)
        .find((node) => node.id === nodeId && node.type === 'checkpoint');

      if (targetNode) {
        return targetNode;
      }
    }

    return findFallbackCheckpoint(snapshot);
  }, [nodeId, snapshot]);

  const activeUnit = useMemo(() => {
    if (!snapshot || !checkpointNode) {
      return null;
    }

    return snapshot.track.units.find((unit) => unit.id === checkpointNode.unitId) ?? null;
  }, [checkpointNode, snapshot]);

  const productionBatch = useMemo(
    () => checkpointNode ? ProductionCurriculumCatalog.getBatchByCheckpointNodeId(checkpointNode.id) : null,
    [checkpointNode],
  );
  /**
   * A avaliação DESTE nó — não a do lote inteiro.
   *
   * Até 2026-08-21 o lote tinha uma avaliação só, e ler `batch.checkpoint` dava
   * a resposta certa por coincidência. Com a avaliação repartida por competência
   * (cinco nós, dois itens cada), a mesma leitura aplicaria as dez questões em
   * qualquer um dos cinco estágios. Quem sabe qual avaliação pertence a qual nó
   * é `getCheckpointByNodeId`, e é ela que decide os itens, o identificador e o
   * limiar daqui para baixo.
   */
  const productionCheckpoint = useMemo(
    () => (checkpointNode ? ProductionCurriculumCatalog.getCheckpointByNodeId(checkpointNode.id) : null),
    [checkpointNode],
  );
  const productionItems = useMemo(() => productionCheckpoint?.items ?? [], [productionCheckpoint]);
  const currentProductionItem = productionItems[checkpointItemIndex] ?? null;
  const productionCursorIds = useMemo(
    () => ['checkpoint-overview', ...productionItems.map((_, index) => `checkpoint-item-${index + 1}`), 'checkpoint-summary'],
    [productionItems],
  );
  const productionProgress = productionBatch && checkpointStarted
    ? Math.round(100 * checkpointItemIndex / Math.max(productionItems.length, 1))
    : 0;

  const resumeSummaryConfirmed = Boolean(
    resumeCheckpointId
    && resumeCursorId === 'checkpoint-summary'
    && checkpointNode
    && snapshot?.progress.completedNodeIds.includes(checkpointNode.id),
  );

  useShadowCheckpoint({
    surface: 'unit-checkpoint',
    flowId: `unit-checkpoint:${checkpointNode?.id ?? nodeId ?? 'current'}`,
    contentVersion: productionBatch?.contentVersion ?? STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
    cursorId: completed
      ? 'checkpoint-summary'
      : productionBatch && checkpointStarted
        ? `checkpoint-item-${checkpointItemIndex + 1}`
        : 'checkpoint-overview',
    compatibleCursorIds: productionBatch ? productionCursorIds : ['checkpoint-overview', 'checkpoint-summary'],
    progressPercent: completed ? 100 : productionProgress,
    completedStepCount: completed ? productionItems.length : checkpointItemIndex,
    totalStepCount: productionBatch ? productionItems.length : 1,
    checkpointDefinitionId: checkpointNode?.id,
    journeyNodeId: checkpointNode?.id,
    unitId: activeUnit?.id,
    enabled: Boolean(checkpointNode && activeUnit),
  });
  const handleRestoreFallback = useCallback(() => {
    Alert.alert(
      'Vamos continuar pela jornada',
      'Não foi possível retomar esse ponto com segurança. Seu progresso confirmado foi preservado.',
    );
    router.replace('/(tabs)');
  }, []);
  const activeCheckpoint = useActiveCheckpoint({
    surface: 'unit-checkpoint',
    flowId: `unit-checkpoint:${checkpointNode?.id ?? nodeId ?? 'current'}`,
    contentVersion: productionBatch?.contentVersion ?? STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
    cursorId: completed || resumeSummaryConfirmed
      ? 'checkpoint-summary'
      : productionBatch && checkpointStarted
        ? `checkpoint-item-${checkpointItemIndex + 1}`
        : 'checkpoint-overview',
    compatibleCursorIds: resumeSummaryConfirmed
      ? productionCursorIds
      : productionBatch ? productionCursorIds.slice(0, checkpointItemIndex + 2) : ['checkpoint-overview'],
    progressPercent: completed || resumeSummaryConfirmed ? 100 : productionProgress,
    completedStepCount: completed || resumeSummaryConfirmed ? productionItems.length || 1 : checkpointItemIndex,
    totalStepCount: productionBatch ? productionItems.length : 1,
    checkpointDefinitionId: checkpointNode?.id,
    journeyNodeId: checkpointNode?.id,
    unitId: activeUnit?.id,
    enabled: Boolean(checkpointNode && activeUnit),
    resumeCheckpointId,
    onRestoreFallback: handleRestoreFallback,
  });

  useEffect(() => {
    if (!resumeSummaryConfirmed) return;
    setCompleted(true);
    void activeCheckpoint.finish();
  }, [activeCheckpoint, resumeSummaryConfirmed]);

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

  const nextAction = useMemo(() => resolveNextAction(snapshot), [snapshot]);

  const handleComplete = useCallback(async () => {
    if (!checkpointNode) {
      return;
    }

    try {
      setSubmitting(true);
      const nextSnapshot = await JourneyProgressService.markNodeCompleted(checkpointNode.id);
      setSnapshot(nextSnapshot);

      // A recusa da guarda não é uma exceção: `markNodeCompleted` devolve o
      // snapshot inalterado. Sem olhar o resultado, a tela comemorava uma
      // conquista que não foi gravada — antes da guarda a comemoração era
      // verdadeira porque a escrita sempre acontecia. Quem decide se houve
      // conquista é o snapshot que voltou, não o fato de a chamada ter
      // retornado.
      if (!nextSnapshot.progress.completedNodeIds.includes(checkpointNode.id)) {
        setError('Nao foi possivel concluir o checkpoint agora.');
        return;
      }

      await activeCheckpoint.finish();
      setCompleted(true);
      const offer = await PaywallService.maybePresentOffer({
        trigger: 'checkpoint_complete',
        entrySurface: 'checkpoint',
        lessonId: checkpointNode.id,
      });
      setPaywallOffer(offer);
    } catch (cause) {
      console.error('[CheckpointScreen] Failed to complete checkpoint:', cause);
      setError('Nao foi possivel concluir o checkpoint agora.');
    } finally {
      setSubmitting(false);
    }
  }, [activeCheckpoint, checkpointNode]);

  const handleProductionAnswer = useCallback(async () => {
    if (!productionBatch || !currentProductionItem || !selectedOptionId || !checkpointNode) return;

    const nextAnswers = { ...checkpointAnswers, [currentProductionItem.id]: selectedOptionId };
    setCheckpointAnswers(nextAnswers);

    if (checkpointItemIndex < productionItems.length - 1) {
      setCheckpointItemIndex((index) => index + 1);
      setSelectedOptionId(null);
      return;
    }

    const committedAt = new Date().toISOString();
    const attemptSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const itemOutcomes: ItemOutcomeV1[] = productionItems.map((item) => {
      const activityId = productionBatch.activities.find((activity) => (
        activity.competencyIds.includes(item.competencyIds[0])
      ))?.id ?? productionBatch.batchId;
      return {
        itemId: item.id,
        activityId,
        competencyIds: [...item.competencyIds],
        evidenceKind: 'independent-recall',
        outcome: nextAnswers[item.id] === item.correctOptionId ? 'correct' : 'incorrect',
        isCriticalError: false,
        hintUsed: false,
        durationBucket: 'unknown',
      };
    });
    const evaluate = (checkpointId: string) => UnitCheckpointService.evaluate({
      operationId: `operation:${productionCheckpoint?.id ?? productionBatch.checkpoint.id}:${attemptSuffix}`,
      checkpointId,
      flowId: `unit-checkpoint:${checkpointNode.id}`,
      attemptId: `attempt:${productionCheckpoint?.id ?? productionBatch.checkpoint.id}:${attemptSuffix}`,
      checkpointDefinitionId: productionCheckpoint?.id ?? productionBatch.checkpoint.id,
      unitId: productionBatch.unitId,
      journeyNodeId: checkpointNode.id,
      activityId: productionBatch.batchId,
      contentVersion: productionBatch.contentVersion,
      curriculumKind: 'v2',
      committedAt,
      itemOutcomes,
    });

    try {
      setSubmitting(true);
      const evaluation = evaluate(productionCheckpoint?.id ?? productionBatch.checkpoint.id);
      await activeCheckpoint.commit((checkpointId) => evaluate(checkpointId).intent);
      setCheckpointEvaluation(evaluation);
      if (evaluation.attempt.passed) {
        await handleComplete();
      }
    } catch (cause) {
      console.error('[CheckpointScreen] Failed to evaluate production checkpoint:', cause);
      setError('Nao foi possivel registrar o checkpoint agora. Suas respostas não foram presumidas como concluídas.');
    } finally {
      setSubmitting(false);
    }
  }, [
    activeCheckpoint,
    checkpointAnswers,
    checkpointItemIndex,
    checkpointNode,
    currentProductionItem,
    handleComplete,
    productionBatch,
    productionCheckpoint,
    productionItems,
    selectedOptionId,
  ]);

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

  // A celebração vem ANTES do estado vazio de propósito. Sem nodeId explícito,
  // `checkpointNode` vem de findFallbackCheckpoint, que só procura nós
  // disponíveis ou ativos — ao concluir, o nó vira 'completed' e some da busca.
  // Na ordem anterior, quem terminava o checkpoint caía em "Checkpoint
  // indisponível" e a celebração era inalcançável nesse caminho.
  if (completed) {
    return (
      <View style={styles.root}>
        <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
        {/* Radial glow backdrop */}
        <View style={styles.celebrationGlow} />
        <Confetti count={30} run={completed} />
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          <ScrollView
            contentContainerStyle={styles.celebrationContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Pixel mascot */}
            <View style={styles.celebrationPixelContainer}>
              <PixelIllustration state="celebrate" size="lg" />
            </View>

            {/* Achievement card */}
            <View style={styles.celebrationCard}>
              {/* Gold badge */}
              <LinearGradient
                colors={['#F5A623', '#FF8A4C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.celebrationBadge}
              >
                <DecorativeIcon name="star" size={28} color="#FFFFFF" />
              </LinearGradient>

              <Text style={styles.celebrationEyebrow}>CONQUISTA DESBLOQUEADA</Text>
              <Text style={styles.celebrationTitle}>
                {checkpointNode?.title ?? 'Checkpoint concluído'}
              </Text>
              <Text style={styles.celebrationDescription}>
                {checkpointNode?.description ?? 'Você completou esta etapa da trilha com sucesso.'}
              </Text>

              {/* XP box — total real acumulado */}
              {gamification?.totalXp != null && (
                <View style={styles.celebrationXpBox}>
                  <XpIcon size={22} value={gamification.totalXp} />
                  <Text style={styles.celebrationXpText}>XP total: {gamification.totalXp}</Text>
                </View>
              )}
            </View>

            {/* CTAs */}
            <View style={styles.celebrationCtas}>
              <AppButton label={nextAction.label} onPress={nextAction.action} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  if (!checkpointNode || !activeUnit) {
    return (
      <View style={styles.root}>
        <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
        <SafeAreaView style={styles.safe}>
          <View style={[layout.container, styles.emptyState]}>
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Checkpoint indisponível</Text>
              <Text style={styles.emptyBody}>
                Não existe um checkpoint elegível neste momento. Volte para a jornada e siga o próximo nó liberado.
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
            <Text style={styles.headerLabel}>Checkpoint</Text>
            <View style={styles.iconSpacer} />
          </View>

          <View style={styles.heroCard}>
            <PixelHeroSplit
              eyebrow="Jornada de Radiologia"
              message={completed
                ? 'Checkpoint concluído! A próxima etapa já está liberada.'
                : 'Vamos conferir o que você aprendeu antes de seguir para a próxima etapa.'}
              ringValue={completedPrimaryNodes}
              ringTotal={Math.max(totalPrimaryNodes, 1)}
              ringLabel="Blocos concluídos"
              state={completed ? 'celebrate' : 'guide'}
              tier={completed ? 'advanced' : 'intermediate'}
              accessibilityLabel="Pixel apresentando o checkpoint"
            />
            <View style={styles.heroFooter}>
              <Text style={styles.heroFooterLabel}>Unidade ativa</Text>
              <Text style={styles.heroFooterValue}>{activeUnit.title}</Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle} accessibilityRole="header">{checkpointNode.title}</Text>
            <Text style={styles.sectionBody}>
              {checkpointNode.description ?? 'Feche este marco para liberar o próximo trecho da trilha.'}
            </Text>
            <View style={styles.statsList}>
              <GalaxyStatRow
                icon={<DecorativeIcon name="task-alt" size={20} color={galaxyColors.ctaGradientEnd} />}
                label="Progresso"
                value={`${completedPrimaryNodes} de ${totalPrimaryNodes} etapas concluídas`}
              />
              <GalaxyStatRow
                icon={<DecorativeIcon name="refresh" size={20} color={galaxyColors.ctaGradientEnd} />}
                label="Revisão"
                value={dueReviewCount > 0
                  ? `${dueReviewCount} ${dueReviewCount === 1 ? 'revisão pendente' : 'revisões pendentes'} nesta unidade`
                  : 'Nenhuma revisão pendente'}
              />
              <GalaxyStatRow
                icon={<DecorativeIcon name="bolt" size={20} color={galaxyColors.ctaGradientEnd} />}
                label="O que vem depois"
                value={completed ? 'Próxima etapa já liberada' : 'Concluir este checkpoint libera a próxima lição'}
              />
            </View>
          </View>

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
                if (paywallSubmitting) { return; }
                void (async () => {
                  try {
                    setPaywallSubmitting(true);
                    const interest = await UpgradeInterestService.captureInterest(paywallOffer, { lessonId: checkpointNode.id });
                    await PaywallService.recordOutcome(paywallOffer, 'cta_tap', { lessonId: checkpointNode.id });
                    setPaywallFeedback(
                      interest.email
                        ? `Interesse registrado para ${interest.email}. Vamos avisar quando o Radiant Plus abrir.`
                        : 'Interesse registrado neste dispositivo. Vamos usar esse sinal para abrir o Radiant Plus no momento certo.'
                    );
                  } catch (cause) {
                    console.error('[CheckpointScreen] Failed to capture paywall interest:', cause);
                    setPaywallFeedback('Nao foi possivel registrar seu interesse agora. Tente novamente em outro momento.');
                  } finally {
                    setPaywallOffer(null);
                    setPaywallSubmitting(false);
                  }
                })();
              }}
              onDismiss={() => {
                if (paywallSubmitting) { return; }
                void PaywallService.recordOutcome(paywallOffer, 'dismissed', { lessonId: checkpointNode.id });
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
            {productionBatch && checkpointStarted && currentProductionItem && !checkpointEvaluation ? (
              <>
                <Text style={styles.checkpointCounter}>
                  Questão {checkpointItemIndex + 1} de {productionItems.length}
                </Text>
                <Text style={styles.actionTitle} accessibilityRole="header">
                  {currentProductionItem.prompt}
                </Text>
                <View style={styles.optionList}>
                  {currentProductionItem.options.map((option) => {
                    const selected = selectedOptionId === option.id;
                    return (
                      <Pressable
                        key={option.id}
                        onPress={() => setSelectedOptionId(option.id)}
                        accessibilityRole="radio"
                        accessibilityLabel={option.label}
                        accessibilityState={{ selected }}
                        style={[styles.optionButton, selected ? styles.optionButtonSelected : null]}
                      >
                        <Text style={[styles.optionText, selected ? styles.optionTextSelected : null]}>
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <AppButton
                  onPress={() => void handleProductionAnswer()}
                  disabled={!selectedOptionId || submitting}
                  style={styles.fullWidthButton}
                >
                  {checkpointItemIndex === productionItems.length - 1 ? 'Enviar checkpoint' : 'Próxima questão'}
                </AppButton>
              </>
            ) : productionBatch && checkpointEvaluation && !checkpointEvaluation.attempt.passed ? (
              <>
                <Text style={styles.actionTitle}>Reforço necessário antes de tentar novamente</Text>
                <Text style={styles.actionBody}>
                  Você acertou {checkpointEvaluation.attempt.correctItemCount} de {checkpointEvaluation.attempt.totalItemCount} questões.
                  O checkpoint exige 8 acertos. A próxima tentativa só será liberada após revisar as competências frágeis.
                </Text>
                <Text style={styles.reinforcementLabel}>
                  Ciclo 1: explicação causal e prática guiada
                </Text>
                <AppButton
                  onPress={() => {
                    const weakCompetency = checkpointEvaluation.attempt.weakCompetencyIds[0];
                    const recoveryActivity = productionBatch.activities.find((activity) => activity.competencyIds.includes(weakCompetency));
                    if (recoveryActivity) {
                      router.replace({
                        pathname: '/learn',
                        params: { blockId: recoveryActivity.id, nodeId: `node:${recoveryActivity.id}` },
                      });
                    }
                  }}
                  style={styles.fullWidthButton}
                >
                  Revisar competência frágil
                </AppButton>
              </>
            ) : (
              <>
                <Text style={styles.actionTitle}>{completed ? 'Checkpoint concluído' : 'Pronto para fechar esta etapa?'}</Text>
                <Text style={styles.actionBody}>
                  {completed
                    ? 'Seu progresso está salvo e o próximo passo já está preparado.'
                    : productionBatch
                      ? 'Responda 10 questões, duas por competência. Para avançar, acerte pelo menos 8.'
                      : 'Concluir o checkpoint firma o que você viu nesta unidade e libera a próxima lição.'}
                </Text>
              </>
            )}
            {completed ? (
              <AppButton onPress={nextAction.action} style={styles.fullWidthButton}>
                {nextAction.label}
              </AppButton>
            ) : productionBatch && !checkpointStarted ? (
              <AppButton onPress={() => setCheckpointStarted(true)} style={styles.fullWidthButton}>
                Iniciar checkpoint
              </AppButton>
            ) : !productionBatch ? (
              <>
                <AppButton onPress={() => void handleComplete()} disabled={submitting} style={styles.fullWidthButton}>
                  {submitting ? 'Concluindo checkpoint...' : 'Concluir checkpoint'}
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
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const ICON_BUTTON_SIZE = 36;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  safe: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: space.s3, gap: space.s3, paddingBottom: space.s5 },
  headerRow: { ...layout.rowBetween, width: '100%' },
  iconButton: {
    width: ICON_BUTTON_SIZE, height: ICON_BUTTON_SIZE, borderRadius: radius.rXl,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: galaxyColors.border,
  },
  iconSpacer: { width: ICON_BUTTON_SIZE, height: ICON_BUTTON_SIZE },
  headerLabel: { fontSize: 13, fontWeight: '800', color: 'rgba(255,255,255,0.35)', letterSpacing: 3, textTransform: 'uppercase' },
  heroCard: {
    backgroundColor: galaxyColors.surface, borderRadius: radius.rLg,
    borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s3, overflow: 'hidden',
  },
  heroFooter: {
    backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: radius.rMd,
    paddingHorizontal: space.s3, paddingVertical: space.s2, gap: space.s0,
  },
  heroFooterLabel: {
    fontSize: 11, fontWeight: '600', color: galaxyColors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  heroFooterValue: { ...typography.h3, color: galaxyColors.textPrimary },
  sectionCard: {
    backgroundColor: galaxyColors.surface, borderRadius: radius.rLg,
    borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s2,
  },
  sectionTitle: { ...typography.h3, color: galaxyColors.textPrimary },
  sectionBody: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  statsList: { gap: space.s2, marginTop: space.s1 },
  actionCard: {
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: radius.rLg,
    borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s2,
  },
  actionTitle: { ...typography.h3, color: galaxyColors.textPrimary },
  actionBody: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  checkpointCounter: {
    ...typography.caption,
    color: galaxyColors.ctaGradientEnd,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  optionList: { gap: space.s2 },
  optionButton: {
    minHeight: 52,
    borderRadius: radius.rMd,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    backgroundColor: galaxyColors.surfaceMuted,
    paddingHorizontal: space.s3,
    paddingVertical: space.s2,
    justifyContent: 'center',
  },
  optionButtonSelected: {
    borderColor: galaxyColors.ctaGradientEnd,
    backgroundColor: 'rgba(48,96,255,0.16)',
  },
  optionText: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  optionTextSelected: { color: galaxyColors.textPrimary },
  reinforcementLabel: { ...typography.caption, color: galaxyColors.xpColor },
  fullWidthButton: { width: '100%' },
  errorCard: {
    backgroundColor: 'rgba(255,59,48,0.10)', borderRadius: radius.rMd,
    borderWidth: 1, borderColor: 'rgba(255,59,48,0.25)', padding: space.s3,
  },
  errorText: { ...typography.bodyRegular, color: galaxyColors.critical },
  messageCard: {
    backgroundColor: galaxyColors.surfaceMuted, borderRadius: radius.rMd,
    borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3,
  },
  messageText: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  emptyState: { flex: 1, justifyContent: 'center', padding: space.s3 },
  emptyCard: {
    backgroundColor: galaxyColors.surface, borderRadius: radius.rLg,
    borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s3,
  },
  emptyTitle: { ...typography.h3, color: galaxyColors.textPrimary, textAlign: 'center' },
  emptyBody: { ...typography.bodyRegular, color: galaxyColors.textSecondary, textAlign: 'center' },
  celebrationGlow: {
    position: 'absolute',
    top: -100,
    alignSelf: 'center',
    width: 500,
    height: 300,
    borderRadius: 250,
    backgroundColor: 'rgba(48,96,255,0.16)',
  },
  celebrationContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 20,
  },
  celebrationPixelContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  celebrationCard: {
    backgroundColor: galaxyColors.galaxySurface2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: galaxyColors.borderActive,
    padding: 20,
    alignItems: 'center',
    alignSelf: 'stretch',
    shadowColor: galaxyColors.galaxyGlow,
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    gap: 6,
  },
  celebrationBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  celebrationEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: galaxyColors.xpColor,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: galaxyColors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 28,
    textAlign: 'center',
  },
  celebrationDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: galaxyColors.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
  },
  celebrationXpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(245,166,35,0.12)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.30)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: 'stretch',
    marginTop: 8,
  },
  celebrationXpText: {
    fontSize: 14,
    fontWeight: '800',
    color: galaxyColors.xpColor,
  },
  celebrationCtas: {
    alignSelf: 'stretch',
    gap: 12,
  },
});
