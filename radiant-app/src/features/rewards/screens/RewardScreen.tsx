import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DecorativeIcon } from '../../../components/ui/DecorativeIcon';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppButton } from '../../../components/ui/AppButton';
import { Confetti } from '../../../components/ui/Confetti';
import { hapticCelebrate } from '../../../ui/feedback/haptics';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { HUD } from '../../../ui/components/HUD';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { JourneyMedal } from '../../journey/components/JourneyMedal';
import { resolveNodeTheme } from '../../journey/services/resolveNodeTheme';
import { canOpenJourneyNode, getJourneyNodeHref } from '../../journey/services/JourneyNodeRouting';
import type { JourneyNode, JourneySnapshot } from '../../../types/journey';
import { GamificationService } from '../../gamification/services/GamificationService';
import { shownStreakDays, type GamificationSnapshot } from '../../../types/gamification';
import { heartsRepository } from '../../hearts/HeartsRepository';
import { MAX_HEARTS } from '../../hearts/HeartsService';
import type { HeartsSnapshot } from '../../hearts/hearts.types';
import {
  STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
  useShadowCheckpoint,
} from '../../student-checkpoints/useShadowCheckpoint';
import { feedbackColors, galaxyColors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';
import { RatingPromptService } from '../../../services/RatingPromptService';
import { computeUnitPrimaryProgress } from '../../journey/services/JourneyUnitProgress';
import { SummaryHero, useFixedFooter } from '../../quiz/components/SummaryHero';

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

    return targetNode ?? null;
  }

  return findFallbackReward(snapshot);
}

/**
 * A decisão de coleta, isolada da tela.
 *
 * Ela é exportada porque o ramo de coleta é INALCANÇÁVEL pela UI quando o nó
 * está bloqueado — o mesmo booleano decide se o botão existe e se o handler
 * grava —, e um teste que só renderiza a tela bloqueada passa sem tocar a
 * guarda: era exatamente esse o teste que existia aqui, e apagar a condição do
 * handler o deixava verde. Como função, a regra pode ser invocada diretamente,
 * e apagá-la fica vermelho.
 *
 * `findReward` resolve por id SEM olhar status, de propósito: é o que permite
 * abrir a tela de uma conquista específica. O efeito colateral é que um deep
 * link (`radiantapp://reward?nodeId=...`) alcança um nó ainda bloqueado — e o
 * esquema é invocável de fora do app.
 */
export function canCollectReward(rewardNode: JourneyNode | null, alreadyCompleted: boolean): boolean {
  if (!rewardNode || alreadyCompleted) {
    return false;
  }

  return rewardNode.status === 'available' || rewardNode.status === 'active';
}

function resolveNextAction(snapshot: JourneySnapshot | null) {
  const nextNode = snapshot?.nextRecommendedNode;

  if (!nextNode) {
    return { label: 'Voltar para jornada', action: () => router.dismissTo('/(tabs)') };
  }

  const href = getJourneyNodeHref(nextNode);
  if (!canOpenJourneyNode(nextNode) || !href) {
    return { label: 'Voltar para jornada', action: () => router.dismissTo('/(tabs)') };
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

  return { label: 'Voltar para jornada', action: () => router.dismissTo('/(tabs)') };
}

/** Uma linha de detalhe, como as do resumo da aula: rótulo e valor, sem caixa. */
function DetailRow({ label, value, fontScale }: { label: string; value: string; fontScale: number }) {
  return (
    <View style={styles.row} accessible accessibilityRole="text" accessibilityLabel={`${label}: ${value}`}>
      <Text key={`label-${fontScale}`} style={styles.rowLabel}>{label}</Text>
      <Text key={`value-${fontScale}`} style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function RewardScreen({ nodeId }: RewardScreenProps) {
  const { fontScale } = useWindowDimensions();
  const fixedFooter = useFixedFooter();
  const [snapshot, setSnapshot] = useState<JourneySnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadedRewardId, setLoadedRewardId] = useState<string | undefined>();
  // O ref também protege callbacks capturados antes do próximo render.
  const collectionPending = useRef(false);
  const collectedRewardIds = useRef(new Set<string>());
  const [error, setError] = useState<string | null>(null);
  const [gamification, setGamification] = useState<GamificationSnapshot | null>(null);
  // Vidas vêm do `heartsRepository`, onde a lição desconta. O contador de
  // corações do `GamificationService` é legado e o caminho vivo nunca o toca.
  const [hearts, setHearts] = useState<HeartsSnapshot | null>(null);

  useEffect(() => {
    void GamificationService.getSnapshot().then(setGamification);
    void heartsRepository.getSnapshot(Date.now()).then(setHearts);
  }, []);

  const loadSnapshot = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const baseSnapshot = nodeId
        ? await JourneyProgressService.getSnapshotForNode(nodeId)
        : await JourneyProgressService.bootstrap();
      const rewardNode = findReward(baseSnapshot, nodeId);
      const rewardUnit = baseSnapshot.track.units.find((unit) => unit.id === rewardNode?.unitId);

      if (!rewardNode || !rewardUnit) {
        setSnapshot(null);
        setLoadedRewardId(undefined);
        router.dismissTo('/(tabs)');
        return;
      }

      setLoadedRewardId(rewardNode.id);

      if (rewardNode && (rewardNode.status === 'available' || rewardNode.status === 'active')) {
        const nextSnapshot = await JourneyProgressService.setCurrentNode(rewardNode.id, baseSnapshot.track);
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

  const rewardNode = useMemo(
    () => findReward(snapshot, nodeId ?? loadedRewardId),
    [loadedRewardId, nodeId, snapshot]
  );

  const activeUnit = useMemo(() => {
    if (!snapshot || !rewardNode) {
      return null;
    }

    return snapshot.track.units.find((unit) => unit.id === rewardNode.unitId) ?? null;
  }, [rewardNode, snapshot]);

  // completedPrimaryNodes/totalPrimaryNodes eram calculados aqui mesmo; a
  // regra (todo nó que não é de revisão, e quantos desses já concluíram)
  // agora mora em computeUnitPrimaryProgress porque QuizScreen precisava da
  // MESMA contagem para o resumo de lição, e duas cópias divergem no dia em
  // que só uma muda. RewardScreen é a origem da regra — ela também chama a
  // função extraída, em vez de manter a própria cópia ao lado da nova.
  const { completed: completedPrimaryNodes, total: totalPrimaryNodes } = useMemo(
    () => computeUnitPrimaryProgress(activeUnit),
    [activeUnit]
  );

  const dueReviewCount = useMemo(() => {
    if (!activeUnit) {
      return 0;
    }

    return activeUnit.nodes.filter((node) => node.type === 'review' && node.status === 'due-review').length;
  }, [activeUnit]);

  const rewardOptional = rewardNode?.optionalForProgression === true;
  const rewardCompleted = rewardNode?.status === 'completed';
  // Até 2026-08-04 a tela dizia "Pronta para ser coletada" com 0 de 14 marcos e
  // o botão de coletar gravava `markNodeCompleted`, entregando a conquista da
  // unidade sem estudo nenhum. A assimetria estava dentro do próprio arquivo:
  // `loadSnapshot` já checava status antes de mover o nó atual; só o caminho de
  // coleta não checava. Render e handler agora leem a MESMA função.
  const rewardLocked = !!rewardNode && !rewardCompleted && !canCollectReward(rewardNode, rewardCompleted);
  const nextAction = useMemo(() => resolveNextAction(snapshot), [snapshot]);

  useShadowCheckpoint({
    surface: 'reward',
    flowId: `reward:${rewardNode?.id ?? nodeId ?? 'current'}`,
    contentVersion: STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
    cursorId: rewardCompleted ? 'reward-summary' : 'reward-overview',
    compatibleCursorIds: ['reward-overview', 'reward-summary'],
    progressPercent: rewardCompleted ? 100 : 0,
    completedStepCount: rewardCompleted ? 1 : 0,
    totalStepCount: 1,
    rewardId: rewardNode?.id,
    journeyNodeId: rewardNode?.id,
    unitId: activeUnit?.id,
    enabled: Boolean(rewardNode && activeUnit),
  });

  useEffect(() => {
    if (rewardCompleted) {
      hapticCelebrate();
    }
  }, [rewardCompleted]);

  const handleComplete = useCallback(async () => {
    // Defesa em profundidade: a autorização de verdade vive em
    // `JourneyProgressService.markNodeCompleted`, onde a escrita acontece e
    // onde todos os caminhos passam. Esta é a segunda camada, na porta que a
    // UI abre.
    if (!rewardNode || !canCollectReward(rewardNode, rewardCompleted)
      || collectionPending.current || collectedRewardIds.current.has(rewardNode.id)) {
      return;
    }

    collectionPending.current = true;
    try {
      setSubmitting(true);
      setError(null);
      const nextSnapshot = await JourneyProgressService.markNodeCompleted(rewardNode.id);
      setSnapshot(nextSnapshot);
      // O serviço pode recusar sem lançar: só o status confirmado celebra.
      if (findReward(nextSnapshot, rewardNode.id)?.status !== 'completed') {
        return;
      }
      collectedRewardIds.current.add(rewardNode.id);
      await RatingPromptService.maybePromptForReview({
        trigger: 'reward_complete',
        entrySurface: 'reward',
        lessonId: rewardNode.id,
      });
    } catch (cause) {
      console.error('[RewardScreen] Failed to complete reward:', cause);
      setError('Nao foi possivel registrar a conquista agora.');
    } finally {
      collectionPending.current = false;
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
    if (!error) {
      return null;
    }

    return (
      <View style={styles.root}>
        <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
        <SafeAreaView style={styles.safe}>
          <View style={styles.emptyState}>
            <View style={styles.emptyCard}>
              <Text key={`reward-load-error-${fontScale}`} style={styles.errorText} accessibilityRole="alert">{error}</Text>
              <AppButton onPress={() => void loadSnapshot()} style={styles.fullWidthButton}>
                Tentar novamente
              </AppButton>
              <AppButton onPress={() => router.dismissTo('/(tabs)')} style={styles.fullWidthButton}>
                Voltar para jornada
              </AppButton>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const phrase = rewardCompleted
    ? rewardOptional ? 'Conquista sua! O registro está salvo na sua jornada.' : 'Conquista sua! Já deixei o próximo passo pronto quando você quiser voltar.'
    : rewardOptional ? 'Você chegou até aqui. Colete sua conquista quando quiser.' : 'Você chegou até aqui. Recolha sua conquista antes de seguir.';

  return (
    <View style={styles.root}>
      <Confetti count={50} run={rewardCompleted} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <HUD
          totalXp={gamification?.totalXp ?? 0}
          streakDays={shownStreakDays(gamification)}
          hearts={hearts?.count ?? MAX_HEARTS}
          maxHearts={MAX_HEARTS}
          heartsSnapshot={hearts ?? undefined}
        />
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: fixedFooter.scrollPaddingBottom }]} showsVerticalScrollIndicator={false}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={styles.iconButton}
          >
            <DecorativeIcon name="close" size={22} color={galaxyColors.textPrimary} />
          </Pressable>

          <SummaryHero
            pixel={{
              state: rewardCompleted ? 'celebrate' : 'guide',
              expression: rewardCompleted ? 'orgulhoso' : 'neutro',
              accessibilityLabel: 'Pixel apresentando a conquista da jornada',
            }}
          >
            <JourneyMedal
              node={rewardNode}
              theme={resolveNodeTheme(rewardNode, activeUnit)}
              state={rewardLocked ? 'locked' : rewardCompleted ? 'done' : 'next'}
              pulsing={false}
              size={68}
              accessibilityLabel={`${rewardNode.title}. ${rewardCompleted ? 'Conquista registrada' : rewardLocked ? 'Conquista bloqueada' : 'Pronta para coleta'}.`}
            />
          </SummaryHero>

          {/* Renova só hosts de texto: estado, scroll e controles permanecem montados. */}
          <Text key={`reward-title-${fontScale}`} style={styles.title} accessibilityRole="header">{rewardNode.title}</Text>
          <Text key={`reward-phrase-${fontScale}`} style={styles.phrase}>{phrase}</Text>
          <Text key={`reward-description-${fontScale}`} style={styles.subtitle}>
            {rewardNode.description ?? (rewardOptional ? 'Reconhecimento pelas etapas que você concluiu.' : 'Esta conquista fecha o ciclo atual antes do próximo trecho da estrada.')}
          </Text>

          <View style={styles.details}>
            <DetailRow label="Unidade" value={activeUnit.title} fontScale={fontScale} />
            <DetailRow
              label="Status"
              value={rewardCompleted ? 'Salva no seu progresso' : rewardLocked ? 'Bloqueada até a unidade fechar' : 'Pronta para ser coletada'}
              fontScale={fontScale}
            />
            <DetailRow label="Progresso" value={`${completedPrimaryNodes} de ${totalPrimaryNodes} marcos da unidade concluídos`} fontScale={fontScale} />
            <DetailRow
              label="Revisão"
              value={dueReviewCount > 0 ? `${dueReviewCount} revisão pendente nesta unidade` : 'Nenhuma revisão crítica bloqueando a trilha'}
              fontScale={fontScale}
            />
          </View>

          <Text key={`reward-action-title-${fontScale}`} style={styles.actionTitle}>
            {rewardCompleted
              ? 'Conquista registrada'
              : rewardLocked
                ? 'Esta conquista ainda não abriu'
                : 'Pronto para coletar essa conquista?'}
          </Text>
          <Text key={`reward-action-body-${fontScale}`} style={styles.phrase}>
            {rewardCompleted
              ? rewardOptional ? 'Sua conquista está salva. Volte à jornada para continuar ou rever o que estudou.' : 'Seu progresso está salvo e o próximo passo já está esperando por você.'
              : rewardLocked
                ? 'Ela abre quando os marcos da unidade forem concluídos. O progresso acima mostra quanto falta.'
                : rewardOptional ? 'A coleta é opcional e não bloqueia seus estudos.' : 'Coletar marca esta etapa como concluída e libera a próxima parte da trilha.'}
          </Text>

          {error ? (
            <Text key={`reward-collect-error-${fontScale}`} style={styles.errorText} accessibilityRole="alert">{error}</Text>
          ) : null}
        </ScrollView>

        <View style={[styles.footer, fixedFooter.footerStyle]} testID="reward-footer">
          {rewardLocked ? (
            <AppButton onPress={() => router.dismissTo('/(tabs)')} variant="galaxy" style={styles.fullWidthButton}>
              Voltar para jornada
            </AppButton>
          ) : rewardCompleted ? (
            <AppButton onPress={nextAction.action} accessibilityHint={nextAction.label} variant="galaxy" style={styles.fullWidthButton}>
              Continuar
            </AppButton>
          ) : (
            <>
              <AppButton onPress={() => void handleComplete()} disabled={submitting} variant="galaxy" style={styles.fullWidthButton}>
                {submitting ? 'Registrando conquista...' : 'Receber conquista'}
              </AppButton>
              <AppButton onPress={() => router.dismissTo('/(tabs)')} variant="ghost" style={styles.fullWidthButton}>
                Voltar para jornada
              </AppButton>
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const ICON_BUTTON_SIZE = 44;

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
  },
  iconButton: {
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: galaxyColors.surfaceActive,
    borderRadius: ICON_BUTTON_SIZE / 2,
  },
  title: {
    ...typography.h2,
    // Em texto ampliado, o parágrafo usa as métricas naturais da Sora.
    lineHeight: undefined,
    color: galaxyColors.textPrimary,
    textAlign: 'center',
  },
  phrase: {
    ...typography.bodyRegular,
    lineHeight: undefined,
    color: galaxyColors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyRegular,
    lineHeight: undefined,
    color: galaxyColors.textSecondary,
    textAlign: 'center',
  },
  actionTitle: {
    ...typography.bodyStrong,
    lineHeight: undefined,
    color: galaxyColors.textPrimary,
    textAlign: 'center',
  },
  details: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: galaxyColors.border,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.s2,
    paddingVertical: space.s3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: galaxyColors.border,
  },
  rowLabel: {
    ...typography.bodyRegular,
    color: galaxyColors.textSecondary,
  },
  rowValue: {
    ...typography.bodyStrong,
    flex: 1,
    minWidth: 160,
    color: galaxyColors.textPrimary,
    textAlign: 'right',
  },
  footer: {
    gap: space.s2,
    padding: space.s3,
  },
  fullWidthButton: {
    width: '100%',
  },
  errorText: {
    ...typography.bodyRegular,
    color: feedbackColors.error.fill,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    padding: space.s3,
  },
  emptyCard: {
    gap: space.s3,
  },
});
