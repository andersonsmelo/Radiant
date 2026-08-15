import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DecorativeIcon } from '../../../components/ui/DecorativeIcon';
import { AccessibilityInfo, ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppButton } from '../../../components/ui/AppButton';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { LessonFlowService } from '../services/LessonFlowService';
import { adaptLegacyBlock } from '../services/LegacyLessonAdapter';
import { useLearningActivity } from '../hooks/useLearningActivity';
import { ActivityInteractionRenderer } from '../renderers/ActivityRendererRegistry';
import type { LessonBlock } from '../../../types/lessonFlow';
import type { LearningActivityV2 } from '../../../types/learningActivity';
import { galaxyColors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';
import { ContextStepRenderer } from '../renderers/ContextStepRenderer';
import { TeachStepRenderer } from '../renderers/TeachStepRenderer';
import { ReinforceStepRenderer } from '../renderers/ReinforceStepRenderer';
import { AdvanceStepRenderer } from '../renderers/AdvanceStepRenderer';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { LessonOutcomeService } from '../services/LessonOutcomeService';
import { LessonVisualPanel } from '../components/LessonVisualPanel';
import { isCorrectInteractionValue } from '../renderers/InteractionAnswerValue';
// A atividade e a conclusão vêm do sub-projeto 1. Eles nasceram montados no
// `QuizScreen`, na rota `/quiz`, que não tem ponto de entrada in-app — então
// nenhum aluno os alcançava. `/learn` é o caminho vivo, e é aqui que eles
// passam a existir de verdade (ADR-2026-08-15).
import { QuizTopBar } from '../../quiz/components/QuizTopBar';
import { LessonSummary } from '../../quiz/components/LessonSummary';
import {
    resolveBestLessonStars,
    resolveLessonStars,
    type LessonStars,
} from '../../quiz/services/resolveLessonStars';
import { pickSummaryPhrase } from '../../quiz/constants/lessonSummaryPhrases';
import { LessonRatingService } from '../../quiz/services/LessonRatingService';
import { LearningAttemptsRepository } from '../../progress/services/LearningAttemptsRepository';
import { computeUnitPrimaryProgress } from '../../journey/services/JourneyUnitProgress';
import { GamificationService } from '../../gamification/services/GamificationService';
import { Confetti } from '../../../components/ui/Confetti';
import { hapticCelebrate } from '../../../ui/feedback/haptics';
import { QUIZ_THRESHOLDS } from '../../../constants/quiz';
import type { GamificationSnapshot, XpAward } from '../../../types/gamification';
import type { JourneySnapshot } from '../../../types/journey';
import type { QuizResult } from '../../../types/quiz';
import {
    STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
    useShadowCheckpoint,
} from '../../student-checkpoints/useShadowCheckpoint';
import { useActiveCheckpoint } from '../../student-checkpoints/useActiveCheckpoint';

type LessonFlowScreenProps = {
    blockId: string;
    nodeId: string;
    resumeCheckpointId?: string;
    resumeCursorId?: string;
};

export default function LessonFlowScreen({ blockId, nodeId, resumeCheckpointId, resumeCursorId }: LessonFlowScreenProps) {
    const [block, setBlock] = useState<LessonBlock | null>(null);
    const [activity, setActivity] = useState<LearningActivityV2 | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [gamification, setGamification] = useState<GamificationSnapshot | null>(null);

    // A conclusão passa a ser um estado desta tela. Antes daqui, terminar a
    // última interação chamava `router.replace('/(tabs)')` e devolvia o aluno
    // em silêncio para a aba — sem estrelas, sem XP, sem frase, sem avaliação.
    const [outcome, setOutcome] = useState<{ result: QuizResult; award: XpAward | null } | null>(null);
    const [journeySnapshot, setJourneySnapshot] = useState<JourneySnapshot | null>(null);
    const [unitProgress, setUnitProgress] = useState<{ completed: number; total: number }>({
        completed: 0,
        total: 0,
    });
    const [summary, setSummary] = useState<{
        stars: LessonStars;
        improved: boolean;
        phrase: string;
        rating: number | null;
    } | null>(null);

    const resumeStepIndex = useMemo(() => {
        if (!activity || !resumeCursorId) return 0;
        const match = /^step-(\d+)$/.exec(resumeCursorId);
        if (!match) return 0;
        const requestedIndex = Number(match[1]) - 1;
        const interactionIndex = activity.steps.findIndex((step) => step.kind === 'interaction');
        // Respostas não entram no checkpoint. Se o cursor já passou pela única
        // interação ainda não commitada, refazemos essa interação em vez de
        // inventar um outcome ou registrar a ausência como erro.
        const privacySafeIndex = interactionIndex >= 0 ? Math.min(requestedIndex, interactionIndex) : requestedIndex;
        return Math.max(0, Math.min(privacySafeIndex, activity.steps.length - 1));
    }, [activity, resumeCursorId]);
    const player = useLearningActivity(activity, resumeStepIndex);

    useEffect(() => {
        let alive = true;

        const bootstrap = async () => {
            try {
                setLoading(true);
                setError(null);
                await JourneyProgressService.setCurrentNode(nodeId);
                await JourneyProgressService.setResumableNode(nodeId);
                const nextBlock = LessonFlowService.getBlockById(blockId);
                // Durante a migração, consumidores legados (inclusive integrações
                // que substituem apenas getBlockById) continuam válidos. A
                // capacidade v2 é preferida quando existe; o bloco ainda é a
                // fonte compatível e determinística do fallback.
                const nextActivity = typeof LessonFlowService.getActivityById === 'function'
                    ? LessonFlowService.getActivityById(blockId) ?? (nextBlock ? adaptLegacyBlock(nextBlock) : null)
                    : nextBlock ? adaptLegacyBlock(nextBlock) : null;

                if (!alive) {
                    return;
                }

                if (!nextActivity) {
                    setError('Atividade de aprendizagem não encontrada.');
                    return;
                }

                setBlock(nextBlock);
                setActivity(nextActivity);
            } catch (cause) {
                console.error('[LessonFlowScreen] Failed to bootstrap block:', cause);
                if (alive) {
                    setError('Não foi possível carregar esta etapa.');
                }
            } finally {
                if (alive) {
                    setLoading(false);
                }
            }
        };

        void bootstrap();

        return () => {
            alive = false;
        };
    }, [blockId, nodeId]);

    const { stepIndex, totalSteps, isLastStep, progress } = player;
    // O passo legado continua disponível enquanto o catálogo antigo coexistir
    // com o v2. A atividade promovida, porém, não precisa fabricar esse bloco.
    const legacyStep = block?.steps[stepIndex];
    const currentStep = player.currentStep;
    const shadowCursorIds = Array.from(
        { length: Math.max(totalSteps, 1) },
        (_, cursorIndex) => `step-${cursorIndex + 1}`,
    );

    useShadowCheckpoint({
        surface: 'lesson',
        flowId: `lesson:${blockId}`,
        contentVersion: activity?.provenance.contentVersion ?? STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
        cursorId: `step-${stepIndex + 1}`,
        compatibleCursorIds: shadowCursorIds,
        progressPercent: Math.max(0, Math.min(100, Math.round(progress * 100))),
        completedStepCount: Math.min(stepIndex, Math.max(totalSteps, 0)),
        totalStepCount: Math.max(totalSteps, 1),
        lessonId: block?.lessonId ?? activity?.id,
        journeyNodeId: nodeId,
        enabled: Boolean(activity && currentStep),
    });
    const handleRestoreFallback = useCallback(() => {
        Alert.alert(
            'Vamos continuar pela jornada',
            'Não foi possível retomar esse ponto com segurança. Seu progresso confirmado foi preservado.',
        );
        router.replace('/(tabs)');
    }, []);
    const activeCheckpoint = useActiveCheckpoint({
        surface: 'lesson',
        flowId: `lesson:${blockId}`,
        contentVersion: activity?.provenance.contentVersion ?? STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
        cursorId: `step-${stepIndex + 1}`,
        compatibleCursorIds: shadowCursorIds,
        progressPercent: Math.max(0, Math.min(100, Math.round(progress * 100))),
        completedStepCount: Math.min(stepIndex, Math.max(totalSteps, 0)),
        totalStepCount: Math.max(totalSteps, 1),
        lessonId: block?.lessonId ?? activity?.id,
        journeyNodeId: nodeId,
        enabled: Boolean(activity && currentStep),
        resumeCheckpointId,
        onRestoreFallback: handleRestoreFallback,
    });
    const lessonTitle = useMemo(() => {
        if (!activity) {
            return 'Fluxo da Lição';
        }

        const opening = activity.steps.find((step) => step.kind === 'presentation');
        if (opening?.kind === 'presentation') {
            return opening.payload.title;
        }

        return block?.lessonId ?? activity.id;
    }, [activity, block]);

    const canContinue = player.canContinue;
    const currentInteraction = player.currentStep?.kind === 'interaction'
        ? player.currentStep.interaction
        : null;

    const panelHint = useMemo(() => {
        if (!currentStep) {
            return 'Observe a imagem e siga no seu ritmo.';
        }

        if (currentStep.kind === 'presentation' && currentStep.role !== 'closing') {
            return 'Observe a cena com calma. O texto entra como apoio, não como muleta.';
        }

        if (currentStep.kind === 'interaction') {
            return 'Compare densidade, borda e contexto anatômico antes de responder.';
        }

        return 'Feche o raciocínio radiológico antes de puxar o próximo passo.';
    }, [currentStep]);

    const panelCaption = useMemo(() => {
        if (!currentStep) {
            return 'Fluxo guiado com foco em continuidade';
        }

        if (currentStep.kind === 'interaction') {
            return 'Decisão baseada em padrões e contexto';
        }

        if (currentStep.role === 'hook') return 'Leitura inicial da cena';
        if (currentStep.role === 'concept') return 'Reforço da lógica visual';
        return 'Consolidação do raciocínio';
    }, [currentStep]);

    const handleContinue = async () => {
        if (!activity || !currentStep || !canContinue) {
            return;
        }

        // A escolha vale no instante do "Continuar", não no toque: trocar de
        // alternativa antes de confirmar não penaliza. `confirm()` devolve o
        // mapa novo em vez de deixar a tela ler o estado — `setState` é
        // assíncrono e no último passo o estado ainda não conteria esta
        // resposta.
        const nextConfirmed = player.confirm();

        if (currentInteraction) {
            const correct = isCorrectInteractionValue(currentInteraction, player.value);
            const message = correct ? currentInteraction.feedback.correct : currentInteraction.feedback.incorrect;
            AccessibilityInfo.announceForAccessibility(
                `${correct ? 'Resposta correta.' : 'Resposta incorreta.'} ${message}`,
            );
        }

        if (!isLastStep) {
            return;
        }

        const lessonOutcome = block
            ? await LessonOutcomeService.recordCompletion({
                  block,
                  nodeId,
                  confirmedAnswers: nextConfirmed,
              })
            : await LessonOutcomeService.recordActivityCompletion({
                  activity,
                  nodeId,
                  confirmedAnswers: nextConfirmed,
              });

        // O snapshot vem do RETORNO de `markNodeCompleted`, não de uma leitura
        // solta via `getSnapshot()`. As duas correriam em paralelo com a
        // escrita, e a leitura pode terminar antes de a marcação pousar —
        // mostrando a unidade sem a lição que acabou de fechar. Encadear a
        // partir da própria marcação elimina a corrida.
        const snapshot = await JourneyProgressService.markNodeCompleted(nodeId);
        await JourneyProgressService.setCurrentNode(null);
        await JourneyProgressService.setResumableNode(undefined);
        await activeCheckpoint.finish();

        setJourneySnapshot(snapshot);
        setOutcome({ result: lessonOutcome.result, award: lessonOutcome.award });

        try {
            setGamification(await GamificationService.getSnapshot());
        } catch (cause) {
            console.error('[LessonFlowScreen] Falha ao reler a gamificação:', cause);
        }
    };

    const exitLesson = () => {
        router.replace('/(tabs)');
    };

    // Carrega as vidas para a barra do topo. Errar consome vida durante a
    // atividade, e o aluno precisa ver isso acontecer.
    useEffect(() => {
        let alive = true;

        void GamificationService.getSnapshot()
            .then((snapshot) => {
                if (alive) {
                    setGamification(snapshot);
                }
            })
            .catch((cause) => {
                console.error('[LessonFlowScreen] Falha ao carregar a gamificação:', cause);
            });

        return () => {
            alive = false;
        };
    }, []);

    // Estrelas, frase e nota da conclusão.
    //
    // `resolveBestLessonStars` exclui a tentativa atual do histórico comparando
    // `completedAt` — por isso o carimbo precisa ser exatamente o que
    // `recordAttempt` persistiu, que é `result.answeredAt`. Um `new Date()`
    // novo aqui não casaria, e `improved` sairia sempre falso.
    //
    // A tela inteira de conclusão fica atrás de `summary`, então uma leitura que
    // rejeita não pode deixá-lo em `null` para sempre: o aluno tem que sempre
    // chegar no Continuar. Falhando o histórico ou a nota, cai para as estrelas
    // só desta tentativa, sem comparação, em vez de travar a tela.
    useEffect(() => {
        if (!outcome) {
            return;
        }

        const { result } = outcome;
        let cancelado = false;

        void (async () => {
            try {
                const attempts = await LearningAttemptsRepository.getAll();
                const { stars, improved } = resolveBestLessonStars(result.lessonId, attempts, {
                    correctAnswers: result.correctAnswers,
                    totalQuestions: result.totalQuestions,
                    completedAt: result.answeredAt.toISOString(),
                });
                const rating = await LessonRatingService.getRating(result.lessonId);

                if (cancelado) {
                    return;
                }

                setSummary({ stars, improved, phrase: pickSummaryPhrase(stars, null), rating });
            } catch (cause) {
                console.error('[LessonFlowScreen] Falha ao resolver o resumo da lição:', cause);

                if (cancelado) {
                    return;
                }

                const stars = resolveLessonStars(result.correctAnswers, result.totalQuestions);
                setSummary({
                    stars,
                    improved: false,
                    phrase: pickSummaryPhrase(stars, null),
                    rating: null,
                });
            }
        })();

        return () => {
            cancelado = true;
        };
    }, [outcome]);

    // Progresso da unidade, pela MESMA regra que o RewardScreen usa —
    // `computeUnitPrimaryProgress` foi extraída justamente para não existirem
    // duas cópias do mesmo par de filtros. A unidade ativa é localizada pelo nó
    // cujo `lessonId` bate com a lição concluída; sem correspondência,
    // `unitProgress` fica em {0, 0} e o card simplesmente não aparece.
    useEffect(() => {
        if (!outcome || !journeySnapshot) {
            return;
        }

        const activeUnit =
            journeySnapshot.track.units.find((unit) =>
                unit.nodes.some((node) => node.lessonId === outcome.result.lessonId)
            ) ?? null;

        setUnitProgress(computeUnitPrimaryProgress(activeUnit));
    }, [outcome, journeySnapshot]);

    const lessonPassed = outcome
        ? Math.round((outcome.result.correctAnswers / Math.max(1, outcome.result.totalQuestions)) * 100) >=
          QUIZ_THRESHOLDS.PASSING_SCORE
        : false;

    useEffect(() => {
        if (lessonPassed) {
            hapticCelebrate();
        }
    }, [lessonPassed]);

    if (loading) {
        return (
            <View style={styles.root}>
                <StarfieldBackground backgroundColor={galaxyColors.background} starCount={80} />
                <SafeAreaView style={styles.safe}>
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color={galaxyColors.ctaGradientEnd} />
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    // A conclusão vem antes do guarda de erro porque, terminada a lição,
    // `currentStep` já não é mais o assunto da tela.
    if (outcome) {
        return (
            <View style={styles.root}>
                <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
                <Confetti count={40} run={lessonPassed} />
                <SafeAreaView style={styles.safe} edges={['top']}>
                    {summary ? (
                        <LessonSummary
                            stars={summary.stars}
                            starsImproved={summary.improved}
                            phrase={summary.phrase}
                            xpAwarded={outcome.award?.totalXpAwarded ?? null}
                            correctAnswers={outcome.result.correctAnswers}
                            totalQuestions={outcome.result.totalQuestions}
                            unitCompleted={unitProgress.completed}
                            unitTotal={unitProgress.total}
                            habitLine={null}
                            currentRating={summary.rating}
                            onRate={(nota) => {
                                void LessonRatingService.rate(outcome.result.lessonId, nota);
                                setSummary((atual) => (atual ? { ...atual, rating: nota } : atual));
                            }}
                            onContinue={exitLesson}
                        />
                    ) : (
                        <View style={styles.centered}>
                            <ActivityIndicator size="large" color={galaxyColors.ctaGradientEnd} />
                        </View>
                    )}
                </SafeAreaView>
            </View>
        );
    }

    if (error || !activity || !currentStep) {
        return (
            <View style={styles.root}>
                <StarfieldBackground backgroundColor={galaxyColors.background} starCount={80} />
                <SafeAreaView style={styles.safe}>
                    <View style={styles.centered}>
                        <View style={styles.errorCard}>
                            <Text style={styles.errorText}>{error ?? 'Bloco inválido.'}</Text>
                        </View>
                        <AppButton onPress={exitLesson}>Voltar para a trilha</AppButton>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <StarfieldBackground backgroundColor={galaxyColors.background} starCount={80} />
            <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
                <View style={styles.container}>
                    {/*
                      Uma linha só: fechar, progresso e vidas. O cabeçalho
                      anterior declarava o mesmo progresso duas vezes — barra e
                      contagem, mais o título da lição —, que é exatamente a
                      repetição que o sub-projeto 1 tirou da tela de atividade.
                    */}
                    <View style={styles.header}>
                        <QuizTopBar
                            questionIndex={stepIndex}
                            totalQuestions={totalSteps}
                            hearts={gamification?.hearts ?? 5}
                            maxHearts={gamification?.maxHearts ?? 5}
                            onClose={exitLesson}
                        />
                        <Text style={styles.stepCount}>
                            Passo {stepIndex + 1} de {totalSteps}
                        </Text>
                    </View>

                    <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {block ? <LessonVisualPanel hint={panelHint} caption={panelCaption} /> : null}

                        <View style={styles.contentCard}>
                            {legacyStep?.step.type === 'context' ? (
                                <ContextStepRenderer payload={legacyStep.step.payload} />
                            ) : null}

                            {legacyStep?.step.type === 'teach' ? (
                                <TeachStepRenderer payload={legacyStep.step.payload} />
                            ) : null}

                            {!legacyStep && currentStep.kind === 'presentation' && currentStep.role === 'hook' ? (
                                <ContextStepRenderer payload={{
                                    title: currentStep.payload.title,
                                    body: currentStep.payload.body ?? '',
                                    eyebrow: currentStep.payload.eyebrow,
                                }} />
                            ) : null}

                            {!legacyStep && currentStep.kind === 'presentation' && currentStep.role === 'concept' ? (
                                <TeachStepRenderer payload={{
                                    title: currentStep.payload.title,
                                    body: currentStep.payload.body ?? '',
                                }} />
                            ) : null}

                            {currentInteraction ? (
                                <ActivityInteractionRenderer
                                    interaction={currentInteraction}
                                    value={player.value}
                                    onChange={player.setValue}
                                />
                            ) : null}

                            {legacyStep?.step.type === 'reinforce' ? (
                                <ReinforceStepRenderer
                                    payload={legacyStep.step.payload}
                                    answeredCorrectly={player.lastFeedback?.correct}
                                    explanation={player.lastFeedback?.message}
                                />
                            ) : null}

                            {legacyStep?.step.type === 'advance' ? (
                                <AdvanceStepRenderer payload={legacyStep.step.payload} />
                            ) : null}

                            {!legacyStep && currentStep.kind === 'presentation' && currentStep.role === 'closing' ? (
                                <ReinforceStepRenderer
                                    payload={{
                                        title: currentStep.payload.title,
                                        body: currentStep.payload.body ?? '',
                                        tone: currentStep.payload.tone ?? 'neutral',
                                    }}
                                    answeredCorrectly={player.lastFeedback?.correct}
                                    explanation={player.lastFeedback?.message}
                                />
                            ) : null}
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <AppButton onPress={() => void handleContinue()} disabled={!canContinue} style={styles.primaryAction}>
                            {isLastStep ? 'Concluir e voltar' : 'Continuar'}
                        </AppButton>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: galaxyColors.background },
    safe: { flex: 1 },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: space.s4,
        gap: space.s3,
    },
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: space.s3,
        paddingTop: space.s1,
        paddingBottom: space.s2,
        gap: space.s2,
    },
    // Contagem discreta, sob a barra. Quem anuncia a posição é este texto — a
    // barra do topo não carrega `accessibilityLabel` de progresso de propósito,
    // para não anunciar a mesma coisa duas vezes.
    stepCount: {
        ...typography.micro,
        color: galaxyColors.textSecondary,
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    closeButton: {
        width: 44,
        height: 44,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.07)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: space.s3,
        paddingBottom: space.s4,
        gap: space.s3,
    },
    contentCard: {
        backgroundColor: galaxyColors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: galaxyColors.border,
        padding: space.s3,
        gap: space.s3,
    },
    footer: {
        paddingHorizontal: space.s3,
        paddingTop: space.s2,
        paddingBottom: space.s3,
        backgroundColor: 'rgba(3,3,13,0.92)',
    },
    primaryAction: {
        width: '100%',
    },
    errorCard: {
        backgroundColor: 'rgba(255,59,48,0.10)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,59,48,0.25)',
        padding: space.s3,
        width: '100%',
    },
    errorText: {
        ...typography.bodyRegular,
        color: '#FF6B6B',
        textAlign: 'center',
    },
});
