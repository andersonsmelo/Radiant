import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DecorativeIcon } from '../../../components/ui/DecorativeIcon';
import { AccessibilityInfo, ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { AppButton } from '../../../components/ui/AppButton';
import { Confetti } from '../../../components/ui/Confetti';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { HUD } from '../../../ui/components/HUD';
import { XpIcon } from '../../../ui/components/HudIcons';
import { JourneyMedal } from '../../journey/components/JourneyMedal';
import { resolveNodeTheme } from '../../journey/services/resolveNodeTheme';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { canOpenJourneyNode, getJourneyNodeHref } from '../../journey/services/JourneyNodeRouting';
import type { JourneyNode, JourneySnapshot, JourneyUnit } from '../../../types/journey';
import { GamificationService } from '../../gamification/services/GamificationService';
import { LessonOutcomeService } from '../../lesson-flow/services/LessonOutcomeService';
import type { GamificationSnapshot } from '../../../types/gamification';
import { galaxyColors } from '../../../ui/theme';
import { layout, radius, space, typography } from '../../../ui/styles';
import {
  STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
  useShadowCheckpoint,
} from '../../student-checkpoints/useShadowCheckpoint';
import { useActiveCheckpoint } from '../../student-checkpoints/useActiveCheckpoint';
import { ProductionCurriculumCatalog } from '../../student-checkpoints/ProductionCurriculumCatalog';
import type { UnitCheckpointEvaluation, UnitCheckpointEvaluationInput } from '../../student-checkpoints/UnitCheckpointService';
import { assessmentAttemptRepository } from '../../student-checkpoints/AssessmentAttemptRepository';
import { checkpointIntroCopy, checkpointRequirementCopy, requiredCorrectItems } from '../checkpointRuleCopy';
import { checkpointChargeLedger } from '../checkpointChargeLedger';
import type { ItemOutcomeV1 } from '../../student-checkpoints/contracts';
import { heartsRepository } from '../../hearts/HeartsRepository';
import { heartLossAnnouncement } from '../../hearts/heartLossAnnouncement';
import type { HeartsSnapshot } from '../../hearts/hearts.types';
import { HeartsSheet } from '../../hearts/components/HeartsSheet';
import { subscriptionService } from '../../subscription/SubscriptionService';
import { assessmentAttemptSuffix } from '../../spaced-repetition/attemptIds';

const DEFAULT_HEARTS: HeartsSnapshot = {
  count: 5,
  status: 'full',
  nextRefillAt: null,
  unlimitedUntil: null,
};
const HISTORY_LOAD_ERROR = 'Não foi possível carregar o histórico. Tente abrir a avaliação novamente.';

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
    return { label: 'Voltar para a trilha', action: () => router.dismissTo('/(tabs)') };
  }

  const href = getJourneyNodeHref(nextNode);
  if (!canOpenJourneyNode(nextNode) || !href) {
    return { label: 'Voltar para a trilha', action: () => router.dismissTo('/(tabs)') };
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
    return { label: 'Abrir avaliação', action: () => router.replace(href) };
  }

  return { label: 'Voltar para a trilha', action: () => router.dismissTo('/(tabs)') };
}

export default function CheckpointScreen({ nodeId, resumeCheckpointId, resumeCursorId }: CheckpointScreenProps) {
  const [snapshot, setSnapshot] = useState<JourneySnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [completionContext, setCompletionContext] = useState<{
    node: JourneyNode; unit: JourneyUnit; unitNumber: number;
  } | null>(null);
  const [checkpointStarted, setCheckpointStarted] = useState(false);
  const [checkpointItemIndex, setCheckpointItemIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [checkpointAnswers, setCheckpointAnswers] = useState<Record<string, string>>({});
  const [checkpointEvaluation, setCheckpointEvaluation] = useState<UnitCheckpointEvaluation | null>(null);
  const [remainingReinforcementIds, setRemainingReinforcementIds] = useState<string[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gamification, setGamification] = useState<GamificationSnapshot | null>(null);
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);
  const [hearts, setHearts] = useState<HeartsSnapshot>(DEFAULT_HEARTS);
  const [heartsSheetVisible, setHeartsSheetVisible] = useState(false);
  const processingAnswer = useRef(false);
  const reinforcementBlocked = useRef(false);
  const pendingSubmission = useRef<UnitCheckpointEvaluationInput | null>(null);
  const creditedApprovals = useRef(new Set<string>());
  const [historyReload, setHistoryReload] = useState(0);

  useEffect(() => {
    void GamificationService.getSnapshot().then(setGamification);
  }, []);

  // Relê as vidas a cada foco, não só na montagem: quem sai pela folha para
  // assinar volta a esta mesma tela, e sem a releitura continuaria bloqueado
  // pelas vidas vazias de antes da compra.
  useFocusEffect(useCallback(() => {
    void heartsRepository.getSnapshot(Date.now()).then(setHearts);
  }, []));

  const loadSnapshot = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const nextSnapshot = nodeId
        ? await JourneyProgressService.getSnapshotForNode(nodeId)
        : await JourneyProgressService.bootstrap();
      setSnapshot(nextSnapshot);
    } catch (cause) {
      console.error('[CheckpointScreen] Failed to load journey snapshot:', cause);
      setError('Não foi possível carregar a avaliação.');
    } finally {
      setLoading(false);
    }
  }, [nodeId]);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  const checkpointNode = useMemo(() => {
    if (!snapshot) {
      return null;
    }

    // Depois do envio, a identidade fica presa ao nó concluído. O snapshot
    // novo pode oferecer outra avaliação antes de finish resolver; isso não é
    // uma navegação para ela. O status ainda vem do snapshot quando presente.
    if (completionContext) {
      return snapshot.track.units.flatMap(unit => unit.nodes)
        .find(node => node.id === completionContext.node.id) ?? completionContext.node;
    }

    if (nodeId) {
      const targetNode = snapshot.track.units
        .flatMap((unit) => unit.nodes)
        .find((node) => node.id === nodeId && node.type === 'checkpoint');

      return targetNode ?? null;
    }

    return findFallbackCheckpoint(snapshot);
  }, [completionContext, nodeId, snapshot]);

  const activeUnit = useMemo(() => {
    if (!snapshot || !checkpointNode) {
      return null;
    }

    return snapshot.track.units.find((unit) => unit.id === checkpointNode.unitId) ?? completionContext?.unit ?? null;
  }, [checkpointNode, completionContext, snapshot]);

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
  const checkpointLocked = checkpointNode?.status === 'locked';
  const checkpointValid = Boolean(checkpointNode && activeUnit && productionBatch && productionCheckpoint && productionItems.length);
  const unitNumber = completionContext?.unitNumber
    ?? (snapshot && activeUnit ? snapshot.track.units.findIndex(unit => unit.id === activeUnit.id) + 1 : 0);

  // Segue as mesmas dependências do catálogo, sem contar aula futura,
  // revisão ou avaliação como se fossem aulas necessárias para este nó.
  const requiredLessons = useMemo(() => {
    const nodes = new Map(snapshot?.track.units.flatMap(unit => unit.nodes).map(node => [node.id, node]) ?? []);
    const visited = new Set<string>();
    const lessons: JourneyNode[] = [];
    const visit = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      const node = nodes.get(id);
      if (!node) return;
      if (node.type === 'lesson') lessons.push(node);
      node.unlockRule?.requiresNodeIds?.forEach(visit);
    };
    checkpointNode?.unlockRule?.requiresNodeIds?.forEach(visit);
    return lessons;
  }, [checkpointNode, snapshot]);
  const missingLessonCount = requiredLessons.filter(node => !snapshot?.progress.completedNodeIds.includes(node.id)).length;

  useEffect(() => {
    if (!loading && !submitting && !error && !completed && !checkpointValid) router.dismissTo('/(tabs)');
  }, [checkpointValid, completed, error, loading, submitting]);

  useFocusEffect(useCallback(() => {
    if (!checkpointNode || !checkpointValid || checkpointLocked || completionContext) return;
    let cancelled = false;
    setHistoryLoaded(false);
    void assessmentAttemptRepository.getState(checkpointNode.id).then(async state => {
      if (cancelled) return;
      const recoverableApproval = state.evaluation?.attempt.passed
        && !snapshot?.progress?.completedNodeIds.includes(checkpointNode.id);
      if (state.blocked || recoverableApproval) await checkpointChargeLedger.clear(checkpointNode.id);
      if (cancelled) return;
      setCheckpointEvaluation(state.blocked || recoverableApproval ? state.evaluation : null);
      setRemainingReinforcementIds(state.remainingActivityIds);
      if (reinforcementBlocked.current && !state.blocked) {
        setCheckpointStarted(false);
        setCheckpointItemIndex(0);
        setCheckpointAnswers({});
        setSelectedOptionId(null);
        pendingSubmission.current = null;
      }
      reinforcementBlocked.current = state.blocked;
      setError(current => current === HISTORY_LOAD_ERROR ? null : current);
      setHistoryLoaded(true);
    }).catch(() => {
      if (!cancelled) setError(HISTORY_LOAD_ERROR);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- O contador permite repetir a leitura no mesmo foco após falha.
  }, [checkpointNode, checkpointValid, checkpointLocked, completionContext, historyReload, snapshot?.progress?.completedNodeIds]));
  const currentProductionItem = productionItems[checkpointItemIndex] ?? null;
  const productionRequiredCorrect = requiredCorrectItems(
    productionItems.length,
    productionCheckpoint?.targetScoreBasisPoints ?? 8000,
  );
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
    enabled: checkpointValid && !checkpointLocked,
  });
  const handleRestoreFallback = useCallback(() => {
    Alert.alert(
      'Vamos continuar pela trilha',
      'Não foi possível retomar esse ponto com segurança. Seu progresso confirmado foi preservado.',
    );
    router.dismissTo('/(tabs)');
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
    enabled: checkpointValid && !checkpointLocked,
    resumeCheckpointId,
    onRestoreFallback: handleRestoreFallback,
  });

  useEffect(() => {
    if (!resumeSummaryConfirmed || completionContext || !checkpointNode || !activeUnit) return;
    setCompletionContext({ node: checkpointNode, unit: activeUnit, unitNumber });
    setCompleted(true);
    void activeCheckpoint.finish();
  }, [activeCheckpoint, activeUnit, checkpointNode, completionContext, resumeSummaryConfirmed, unitNumber]);

  const dueReviewCount = useMemo(() => {
    if (!activeUnit) {
      return 0;
    }

    return activeUnit.nodes.filter((node) => node.type === 'review' && node.status === 'due-review').length;
  }, [activeUnit]);

  const nextAction = useMemo(() => resolveNextAction(snapshot), [snapshot]);

  const handleComplete = useCallback(async () => {
    if (!checkpointNode || !activeUnit || checkpointLocked || !checkpointValid) {
      return;
    }

    try {
      // Congela ANTES de qualquer await/setSnapshot: inclusive enquanto o
      // runtime original termina, o próximo fallback não recebe o contexto.
      setCompletionContext({ node: checkpointNode, unit: activeUnit, unitNumber });
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
        setError('Não foi possível concluir a avaliação agora.');
        return;
      }

      await activeCheckpoint.finish();
      setCompleted(true);
    } catch (cause) {
      console.error('[CheckpointScreen] Failed to complete checkpoint:', cause);
      setError('Não foi possível concluir a avaliação agora.');
    } finally {
      setSubmitting(false);
    }
  }, [activeCheckpoint, activeUnit, checkpointNode, checkpointLocked, checkpointValid, unitNumber]);

  const applyEvaluation = useCallback(async (evaluation: UnitCheckpointEvaluation) => {
    if (!checkpointNode || checkpointLocked || !checkpointValid) return;
    await activeCheckpoint.commit((checkpointId) => ({ ...evaluation.intent, checkpointId }));
    await checkpointChargeLedger.clear(checkpointNode.id);
    setCheckpointEvaluation(evaluation);
    const retryState = await assessmentAttemptRepository.getState(checkpointNode.id);
    setRemainingReinforcementIds(retryState.remainingActivityIds);
    reinforcementBlocked.current = retryState.blocked;
    if (evaluation.attempt.passed) {
      if (!creditedApprovals.current.has(evaluation.attempt.attemptId)) {
        const approval = await LessonOutcomeService.recordAssessmentApproval({
          nodeId: checkpointNode.id, totalQuestions: evaluation.attempt.totalItemCount,
          correctAnswers: evaluation.attempt.correctItemCount, answeredAt: new Date(evaluation.attempt.committedAt),
        });
        creditedApprovals.current.add(evaluation.attempt.attemptId);
        setXpAwarded(approval.award?.totalXpAwarded ?? null);
      }
      await GamificationService.getSnapshot().then(setGamification, (cause: unknown) => {
        console.error('[CheckpointScreen] Failed to reload XP after approval:', cause);
      });
      await handleComplete();
    }
  }, [activeCheckpoint, checkpointNode, checkpointLocked, checkpointValid, handleComplete]);

  const handleProductionAnswer = useCallback(async () => {
    if (!productionBatch || !currentProductionItem || !selectedOptionId || !checkpointNode || checkpointLocked || !checkpointValid || processingAnswer.current) {
      return;
    }

    processingAnswer.current = true;
    setError(null);

    try {
      const isIncorrect = selectedOptionId !== currentProductionItem.correctOptionId;
      // A reserva é gravada antes da cobrança: se o app morrer entre as duas, o
      // aluno deixa de pagar uma vez, em vez de pagar duas pela mesma pergunta.
      if (isIncorrect && await checkpointChargeLedger.claim(checkpointNode.id, currentProductionItem.id)) {
        const nextHearts = await heartsRepository.spend(Date.now());
        setHearts(nextHearts);

        // FILA, 35: quem enxerga vê o coração cair no HUD; o leitor de tela
        // ouve a mesma frase da lição. A avaliação não diz se a resposta estava
        // certa, então o anúncio é só o da vida.
        const heartLoss = heartLossAnnouncement(hearts, nextHearts);
        if (heartLoss) {
          AccessibilityInfo.announceForAccessibility(heartLoss);
        }

        // O estado decide, não o número: assinante pode carregar `count: 0`.
        if (nextHearts.status === 'empty') {
          setHeartsSheetVisible(true);
          return;
        }
      }

      const nextAnswers = { ...checkpointAnswers, [currentProductionItem.id]: selectedOptionId };
      setCheckpointAnswers(nextAnswers);

      if (checkpointItemIndex < productionItems.length - 1) {
        setCheckpointItemIndex((index) => index + 1);
        setSelectedOptionId(null);
        return;
      }

    const committedAt = pendingSubmission.current?.committedAt ?? new Date().toISOString();
    const attemptSuffix = assessmentAttemptSuffix();
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
    pendingSubmission.current ??= {
      operationId: `operation:assessment:${attemptSuffix}`,
      checkpointId: productionCheckpoint?.id ?? productionBatch.checkpoint.id,
      flowId: `unit-checkpoint:${checkpointNode.id}`,
      attemptId: `attempt:assessment:${attemptSuffix}`,
      checkpointDefinitionId: productionCheckpoint?.id ?? productionBatch.checkpoint.id,
      unitId: productionBatch.unitId,
      journeyNodeId: checkpointNode.id,
      activityId: productionBatch.batchId,
      contentVersion: productionBatch.contentVersion,
      curriculumKind: 'v2',
      committedAt,
      itemOutcomes,
    };

      setSubmitting(true);
      const evaluation = await assessmentAttemptRepository.submit(pendingSubmission.current, productionBatch.activities);
      await applyEvaluation(evaluation);
    } catch (cause) {
      console.error('[CheckpointScreen] Failed to evaluate production checkpoint:', cause);
      setError('Não foi possível registrar a avaliação agora. Suas respostas não foram presumidas como concluídas.');
    } finally {
      setSubmitting(false);
      processingAnswer.current = false;
    }
  }, [
    applyEvaluation,
    checkpointAnswers,
    checkpointItemIndex,
    checkpointNode,
    checkpointLocked,
    checkpointValid,
    currentProductionItem,
    hearts,
    productionBatch,
    productionCheckpoint,
    productionItems,
    selectedOptionId,
  ]);

  if (loading || (!checkpointValid && !completed && !error)) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.centered}>
          <ActivityIndicator size="large" color={galaxyColors.ctaGradientEnd} />
        </SafeAreaView>
      </View>
    );
  }

  // Uma falha de I/O não significa identificador inválido: permite repetir a
  // leitura sem abandonar o aluno nem substituí-lo por outro checkpoint.
  if (!checkpointValid && !completed && error) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.centered}>
          <View style={styles.content}>
            <Text style={styles.errorText}>{error}</Text>
            <AppButton onPress={() => void loadSnapshot()}>Tentar novamente</AppButton>
            <AppButton onPress={() => router.dismissTo('/(tabs)')}>Voltar para a trilha</AppButton>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Antes do vazio: concluir remove do fallback o nó disponível. A medalha e
  // o contexto guardam o nó realmente concluído, sem reexecutar os efeitos.
  if (completed) {
    const presentation = completionContext ?? (checkpointNode ? { node: checkpointNode, unitNumber } : null);
    return (
      <View style={styles.root}>
        <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
        <Confetti count={30} run={completed} />
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <ScrollView contentContainerStyle={styles.celebrationContent} showsVerticalScrollIndicator={false}>
            {presentation ? <JourneyMedal
              node={presentation.node}
              theme={resolveNodeTheme(presentation.node)}
              state="done"
              pulsing={false}
              size={56}
              unitNumber={presentation.unitNumber}
              accessibilityLabel="Avaliação concluída. Medalha de prata."
            /> : null}
            <Text style={styles.title} accessibilityRole="header">Avaliação concluída</Text>
            <Text style={styles.context}>{presentation?.node.title}</Text>
            <Text style={styles.body}>Seu progresso está salvo.</Text>
            {xpAwarded != null && xpAwarded > 0 ? <Text style={styles.xpGain}>{`+${xpAwarded} XP`}</Text> : null}
            {gamification?.totalXp != null ? <View style={styles.xpBox}>
              <XpIcon size={22} value={gamification.totalXp} />
              <Text style={styles.body}>XP total: {gamification.totalXp}</Text>
            </View> : null}
            <AppButton label={nextAction.label} onPress={nextAction.action} style={styles.fullWidthButton} />
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  if (!checkpointNode || !activeUnit || !checkpointValid) return null;

  return (
    <View style={styles.root}>
      <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <HUD totalXp={gamification?.totalXp ?? 0} streakDays={gamification?.streakDays ?? 0}
          hearts={hearts.count} maxHearts={5} heartsSnapshot={hearts} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" style={styles.iconButton}>
              <DecorativeIcon name="close" size={22} color={galaxyColors.textPrimary} />
            </Pressable>
            <Text style={styles.headerLabel}>Avaliação</Text>
            <View style={styles.iconSpacer} />
          </View>
          <View style={styles.hero}>
            <JourneyMedal node={checkpointNode} theme={resolveNodeTheme(checkpointNode, activeUnit)}
              state={checkpointLocked ? 'locked' : 'next'} pulsing={false} size={56} unitNumber={unitNumber}
              accessibilityLabel={`Avaliação da unidade ${unitNumber}. ${checkpointLocked ? 'Bloqueada' : 'Disponível'}.`} />
            <Text style={styles.title} accessibilityRole="header">Avaliação da unidade {unitNumber}</Text>
            <Text style={styles.context}>{checkpointNode.title}</Text>
            <Text style={styles.body}>{checkpointLocked
              ? `Abre depois das ${requiredLessons.length} aulas. Faltam ${missingLessonCount}.`
              : checkpointIntroCopy(productionItems.length, productionRequiredCorrect)}</Text>
          </View>
          {checkpointLocked ? <AppButton onPress={() => router.dismissTo('/(tabs)')}>Voltar para a trilha</AppButton> : <>
            {error ? <View style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
              {!historyLoaded ? <AppButton onPress={() => setHistoryReload(value => value + 1)}>Tentar carregar histórico</AppButton> : null}
            </View> : null}
          <View style={styles.actionCard}>
            {checkpointEvaluation?.attempt.passed ? (
              <>
                <Text style={styles.actionTitle}>Avaliação registrada</Text>
                <Text style={styles.actionBody}>Sua aprovação foi salva. Conclua esta etapa sem responder novamente.</Text>
                <AppButton disabled={submitting} onPress={() => {
                  if (processingAnswer.current) return;
                  processingAnswer.current = true;
                  setSubmitting(true);
                  setError(null);
                  void applyEvaluation(checkpointEvaluation).catch(() => setError('Não foi possível concluir a avaliação. Tente novamente.'))
                    .finally(() => { processingAnswer.current = false; setSubmitting(false); });
                }}>Concluir avaliação registrada</AppButton>
              </>
            ) : productionBatch && checkpointStarted && currentProductionItem && !checkpointEvaluation ? (
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
                        onPress={() => { if (!pendingSubmission.current) setSelectedOptionId(option.id); }}
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
                  {checkpointItemIndex === productionItems.length - 1 ? 'Enviar avaliação' : 'Próxima questão'}
                </AppButton>
              </>
            ) : productionBatch && checkpointEvaluation && !checkpointEvaluation.attempt.passed ? (
              <>
                <Text style={styles.actionTitle}>Reforço necessário antes de tentar novamente</Text>
                <Text style={styles.actionBody}>
                  Você acertou {checkpointEvaluation.attempt.correctItemCount} de {checkpointEvaluation.attempt.totalItemCount} questões.
                  {' '}{checkpointRequirementCopy(productionRequiredCorrect)} A próxima tentativa só será liberada após revisar as competências frágeis.
                </Text>
                <Text style={styles.reinforcementLabel}>
                  {checkpointEvaluation.attempt.resultingSupportState === 'support-required'
                    ? 'Você precisa de apoio antes de uma nova tentativa.'
                    : `Ciclo ${checkpointEvaluation.reinforcementPlan?.reinforcementCycle}: conclua as atividades de reforço das competências frágeis.`}
                </Text>
                <AppButton
                  onPress={() => {
                    const recoveryActivity = productionBatch.activities.find((activity) => remainingReinforcementIds.includes(activity.id));
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
            ) : null}
            {productionBatch && !checkpointStarted && !checkpointEvaluation && historyLoaded ? (
              <AppButton
                disabled={!historyLoaded}
                onPress={() => {
                  if (!historyLoaded || checkpointEvaluation || checkpointLocked || !checkpointValid) return;
                  if (hearts.status === 'empty') {
                    setHeartsSheetVisible(true);
                    return;
                  }
                  pendingSubmission.current = null;
                  setCheckpointStarted(true);
                }}
                style={styles.fullWidthButton}
              >
                Começar avaliação
              </AppButton>
            ) : null}
          </View>
          </>}
        </ScrollView>
      </SafeAreaView>
      <HeartsSheet visible={heartsSheetVisible && hearts.status !== 'unlimited'} snapshot={hearts} dueReviewCount={dueReviewCount}
        storeAvailable={subscriptionService.storeAvailable()} onClose={() => setHeartsSheetVisible(false)}
        onReview={() => { setHeartsSheetVisible(false); router.replace('/review'); }}
        onSubscribe={() => { setHeartsSheetVisible(false); router.push('/subscription'); }} />
    </View>
  );
}

const ICON_BUTTON_SIZE = 48;
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  safe: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: space.s3, gap: space.s4, paddingBottom: space.s6 },
  headerRow: { ...layout.rowBetween, width: '100%' },
  iconButton: { width: ICON_BUTTON_SIZE, height: ICON_BUTTON_SIZE, borderRadius: radius.rMd,
    alignItems: 'center', justifyContent: 'center', backgroundColor: galaxyColors.surface },
  iconSpacer: { width: ICON_BUTTON_SIZE, height: ICON_BUTTON_SIZE },
  headerLabel: { ...typography.caption, color: galaxyColors.textSecondary },
  hero: { alignItems: 'center', gap: space.s3, paddingVertical: space.s3 },
  title: { ...typography.h3, color: galaxyColors.textPrimary, textAlign: 'center' },
  context: { ...typography.bodyStrong, color: galaxyColors.textSecondary, textAlign: 'center' },
  body: { ...typography.bodyRegular, color: galaxyColors.textSecondary, textAlign: 'center' },
  actionCard: { gap: space.s3 },
  actionTitle: { ...typography.h3, color: galaxyColors.textPrimary },
  actionBody: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  checkpointCounter: { ...typography.caption, color: galaxyColors.textSecondary },
  optionList: { gap: space.s2 },
  optionButton: { minHeight: 52, borderRadius: radius.rMd, borderWidth: 1, borderColor: galaxyColors.border,
    backgroundColor: galaxyColors.surfaceMuted, paddingHorizontal: space.s3, paddingVertical: space.s2, justifyContent: 'center' },
  optionButtonSelected: { borderColor: galaxyColors.ctaGradientEnd, backgroundColor: galaxyColors.surface },
  optionText: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  optionTextSelected: { color: galaxyColors.textPrimary },
  reinforcementLabel: { ...typography.caption, color: galaxyColors.textSecondary },
  fullWidthButton: { width: '100%' },
  errorCard: { backgroundColor: galaxyColors.surfaceMuted, borderRadius: radius.rMd, padding: space.s3, gap: space.s2 },
  errorText: { ...typography.bodyRegular, color: galaxyColors.critical },
  celebrationContent: { padding: space.s5, alignItems: 'center', gap: space.s4 },
  xpGain: { ...typography.h3, color: galaxyColors.textPrimary },
  xpBox: { ...layout.row, gap: space.s2, alignItems: 'center' },
});
