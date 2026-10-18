import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { AppButton } from '../../../components/ui/AppButton';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { LessonFlowService } from '../services/LessonFlowService';
import { adaptLegacyBlock } from '../services/LegacyLessonAdapter';
import { useLearningActivity } from '../hooks/useLearningActivity';
import { ActivityInteractionRenderer } from '../renderers/ActivityRendererRegistry';
import type { LessonBlock } from '../../../types/lessonFlow';
import type { LearningActivityV2 } from '../../../types/learningActivity';
import { galaxyColors } from '../../../ui/theme';
import { LABEL_MAX_FONT_SCALE } from '../../../ui/accessibility/useLargeTextLayout';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';
import { ContextStepRenderer } from '../renderers/ContextStepRenderer';
import { TeachStepRenderer } from '../renderers/TeachStepRenderer';
import { ReinforceStepRenderer } from '../renderers/ReinforceStepRenderer';
import { AdvanceStepRenderer } from '../renderers/AdvanceStepRenderer';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { LessonOutcomeService } from '../services/LessonOutcomeService';
import { resolveNextReviewInDays } from '../services/nextReviewInDays';
import { isCorrectInteractionValue } from '../renderers/InteractionAnswerValue';
// A atividade e a conclusão vêm do sub-projeto 1. Eles nasceram montados no
// `QuizScreen`, na rota `/quiz`, que não tem ponto de entrada in-app — então
// nenhum aluno os alcançava. `/learn` é o caminho vivo, e é aqui que eles
// passam a existir de verdade (ADR-2026-08-15).
import { QuizTopBar } from '../../quiz/components/QuizTopBar';
import { LessonSummary } from '../../quiz/components/LessonSummary';
import {
    resolveAttemptStars,
    resolveLessonStars,
    type LessonStars,
} from '../../quiz/services/resolveLessonStars';
import { pickSummaryPhrase } from '../../quiz/constants/lessonSummaryPhrases';
import { LessonRatingService } from '../../quiz/services/LessonRatingService';
import { LearningAttemptsRepository } from '../../progress/services/LearningAttemptsRepository';
import { computeUnitPrimaryProgress } from '../../journey/services/JourneyUnitProgress';
import { Confetti } from '../../../components/ui/Confetti';
import { createLessonFeedback, type LessonFeedback, type LessonFeedbackEvent } from '../../../ui/feedback/lessonFeedback';
import { createLessonSoundPlayer } from '../../../ui/feedback/lessonSounds';
import { readFeedbackPreferences } from '../../../ui/feedback/feedbackPreferences';
import { QUIZ_THRESHOLDS } from '../../../constants/quiz';
import type { XpAward } from '../../../types/gamification';
import type { JourneySnapshot } from '../../../types/journey';
import type { QuizResult } from '../../../types/quiz';
import {
    STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
    useShadowCheckpoint,
} from '../../student-checkpoints/useShadowCheckpoint';
import { useActiveCheckpoint } from '../../student-checkpoints/useActiveCheckpoint';
import { heartsRepository } from '../../hearts/HeartsRepository';
import { JourneyDefinitionService } from '../../journey/services/JourneyDefinitionService';
import { heartLossAnnouncement } from '../../hearts/heartLossAnnouncement';
import type { HeartsSnapshot } from '../../hearts/hearts.types';
import { HeartsSheet } from '../../hearts/components/HeartsSheet';
import { subscriptionService } from '../../subscription/SubscriptionService';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';

const DEFAULT_HEARTS: HeartsSnapshot = {
    count: 5,
    status: 'full',
    nextRefillAt: null,
    unlimitedUntil: null,
};

type LessonFlowScreenProps = {
    blockId: string;
    nodeId: string;
    resumeCheckpointId?: string;
    resumeCursorId?: string;
};

export default function LessonFlowScreen(props: LessonFlowScreenProps) {
    const [attempt, setAttempt] = useState(0);
    return <LessonFlowAttempt key={`${props.blockId}:${props.nodeId}:${attempt}`} {...props}
        resumeCheckpointId={attempt === 0 ? props.resumeCheckpointId : undefined}
        resumeCursorId={attempt === 0 ? props.resumeCursorId : undefined}
        onRetry={() => setAttempt(value => value + 1)} />;
}

function LessonFlowAttempt({ blockId, nodeId, resumeCheckpointId, resumeCursorId, onRetry }: LessonFlowScreenProps & { onRetry: () => void }) {
    const [block, setBlock] = useState<LessonBlock | null>(null);
    const [activity, setActivity] = useState<LearningActivityV2 | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hearts, setHearts] = useState<HeartsSnapshot>(DEFAULT_HEARTS);
    const [heartsSheetVisible, setHeartsSheetVisible] = useState(false);
    const chargedInteractions = useRef(new Set<string>());
    const completions = useRef(new Map<string, { finishing: boolean; finished: boolean; identity: { attemptId: string; answeredAt: Date } | null }>());
    // Revisão é prática, não prova (ADR de 2026-09-14: "Revisão nunca consome
    // vida"; vidas "não bloqueiam revisão"). Esta tela atende lição e revisão
    // da trilha e cobrava todo erro: no simulador em 2026-10-16, errar a
    // revisão levou de 5 para 4 vidas. ADR de 2026-10-16.
    const isReview = useMemo(() => JourneyDefinitionService.getNodeType(nodeId) === 'review', [nodeId]);

    // Som e vibração da lição: a mesma camada do piloto do V3 (spec 2026-09-23,
    // §5.2), ligada às lições do aluno em 2026-09-28 (decisão B do dono). Os
    // sons carregam na abertura e saem na desmontagem; até as preferências
    // chegarem, nada toca. Som é enfeite: falha aqui nunca para a lição.
    const feedbackRef = useRef<LessonFeedback | null>(null);
    const scrollRef = useRef<ScrollView>(null);
    useEffect(() => {
        const sounds = createLessonSoundPlayer();
        let alive = true;
        void readFeedbackPreferences().then((preferences) => {
            if (alive) feedbackRef.current = createLessonFeedback(sounds, preferences);
        });
        return () => {
            alive = false;
            feedbackRef.current = null;
            sounds.release();
        };
    }, []);
    const emit = useCallback((event: LessonFeedbackEvent) => feedbackRef.current?.emit(event), []);

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
        recordStars: LessonStars;
        improved: boolean;
        phrase: string;
        rating: number | null;
        nextReviewInDays: number | null;
    } | null>(null);

    const resumeStepIndex = useMemo(() => {
        if (!activity || !resumeCursorId) return 0;
        const match = /^step-(\d+)$/.exec(resumeCursorId);
        if (!match) return 0;
        const requestedIndex = Number(match[1]) - 1;
        const interactionIndex = activity.steps.findIndex((step) => step.kind === 'interaction');
        // Respostas e fila de retorno não entram no checkpoint. Retomamos desde
        // a primeira interação para reconstruir a sessão sem inventar respostas.
        const privacySafeIndex = interactionIndex >= 0 ? Math.min(requestedIndex, interactionIndex) : requestedIndex;
        return Math.max(0, Math.min(privacySafeIndex, activity.steps.length - 1));
    }, [activity, resumeCursorId]);
    const hybrid = Boolean(block?.sessionMode);
    const player = useLearningActivity(activity, resumeStepIndex, {
        feedbackPerItem: hybrid,
        repeatIncorrect: block?.sessionMode === 'hybrid-lesson' && !isReview,
    });

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
    useEffect(() => { scrollRef.current?.scrollTo({ y: 0, animated: false }); }, [stepIndex]);
    // O passo legado continua disponível enquanto o catálogo antigo coexistir
    // com o v2. A atividade promovida, porém, não precisa fabricar esse bloco.
    const legacyStep = player.isRetry ? undefined : block?.steps[stepIndex];
    const currentStep = player.currentStep;
    // A lista de cursores compatíveis é estável: acrescentar um retorno não
    // deve criar outro checkpoint da mesma sessão. Reservamos até um por item.
    const checkpointCapacity = block?.sessionMode === 'hybrid-lesson' && activity
        ? activity.steps.length + activity.steps.filter(step => step.kind === 'interaction').length
        : totalSteps;
    const shadowCursorIds = Array.from(
        { length: Math.max(checkpointCapacity, 1) },
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
        router.dismissTo('/(tabs)');
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
    const canContinue = player.canContinue;
    const currentInteraction = player.currentStep?.kind === 'interaction'
        ? player.currentStep.interaction
        : null;

    const confirmationLabel = player.showingFeedback
        ? isLastStep ? 'Concluir e voltar' : 'Continuar'
        : currentInteraction?.type === 'multiple-choice'
        ? 'Conferir resposta'
        : isLastStep ? 'Concluir e voltar' : 'Continuar';

    const handleContinue = async () => {
        const key = JSON.stringify([blockId, nodeId]);
        if (!completions.current.has(key)) completions.current.set(key, { finishing: false, finished: false, identity: null });
        const completion = completions.current.get(key)!;
        if (!activity || !currentStep || !canContinue || completion.finishing || completion.finished) {
            return;
        }

        // O estado decide, não o número: assinante pode carregar `count: 0`.
        // Sem vidas, o bloqueio vem antes de responder um item que custa vida.
        // Depois do feedback de um débito, seguir é livre: a última vida perdida
        // no último retorno conclui a lição (ADR de 2026-10-18, régua e última vida).
        const costsHeart = !isReview && (!hybrid || player.isRetry);
        if (costsHeart && hearts.status === 'empty' && currentInteraction && !player.showingFeedback) {
            setHeartsSheetVisible(true);
            return;
        }

        // A escolha vale no instante da confirmação, não no toque: trocar de
        // alternativa antes de confirmar não penaliza. `confirm()` devolve o
        // mapa novo em vez de deixar a tela ler o estado — `setState` é
        // assíncrono e no último passo o estado ainda não conteria esta
        // resposta.
        let nextHearts = hearts;
        let heartLossCopy = '';
        if (currentInteraction && !player.showingFeedback) {
            const correct = isCorrectInteractionValue(currentInteraction, player.value);

            if (!correct && !costsHeart) {
                emit('incorrect');
            } else if (!correct) {
                if (chargedInteractions.current.has(currentInteraction.id)) {
                    return;
                }

                // Marca antes do await: um segundo toque durante a escrita não
                // pode debitar a mesma confirmação duas vezes.
                chargedInteractions.current.add(currentInteraction.id);
                // O erro soa antes da escrita da vida: o retorno não espera o disco.
                emit('incorrect');
                nextHearts = await heartsRepository.spend(Date.now());
                setHearts(nextHearts);

                // Quem enxerga vê o coração mudar no HUD; o leitor de tela
                // precisa ouvir (`heartLossAnnouncement`, a mesma frase das
                // avaliações da V2).
                const heartLoss = heartLossAnnouncement(hearts, nextHearts);
                if (heartLoss) {
                    heartLossCopy = ` ${heartLoss}`;
                    // Sem som nem vibração próprios (decisão do dono, 2026-09-28):
                    // saíam 2 ms depois do erro e soavam como um só. Voltam com
                    // a animação do coração em primeiro plano (FILA, 26).
                }
            } else {
                emit('correct');
            }

            const message = correct ? currentInteraction.feedback.correct : currentInteraction.feedback.incorrect;
            const choice = currentInteraction.type === 'multiple-choice'
                ? currentInteraction.payload.options.find(option => option.id === player.value)?.label : undefined;
            const answer = currentInteraction.type === 'multiple-choice'
                ? currentInteraction.payload.options.find(option => option.id === currentInteraction.payload.correctOptionId)?.label : undefined;
            const recap = hybrid && choice && answer ? `Sua resposta: ${choice}. Resposta certa: ${answer}. ` : '';
            AccessibilityInfo.announceForAccessibility(
                `${correct ? 'Resposta correta.' : 'Resposta incorreta.'} ${recap}${message}${heartLossCopy}`,
            );
        }

        const nextConfirmed = player.confirm();
        // Conferir mantém a pergunta na tela. Só o segundo toque avança ou conclui.
        if (hybrid && currentInteraction && !player.showingFeedback) {
            return;
        }

        if (!isLastStep) {
            if (costsHeart && nextHearts.status === 'empty') {
                await JourneyProgressService.setResumableNode(nodeId, stepIndex + 1);
                setHeartsSheetVisible(true);
            }
            return;
        }

        if (completion.finishing || completion.finished) return;
        completion.finishing = true;
        completion.identity ??= { attemptId: `study:${Date.now()}:${Math.random().toString(36).slice(2)}`, answeredAt: new Date() };
        try {
            const lessonOutcome = block
                ? await LessonOutcomeService.recordCompletion({
                      block,
                      nodeId,
                      confirmedAnswers: nextConfirmed,
                      firstConfirmedAnswers: hybrid ? player.firstConfirmedAnswers : nextConfirmed,
                      ...completion.identity,
                  })
                : await LessonOutcomeService.recordActivityCompletion({
                      activity,
                      nodeId,
                      confirmedAnswers: nextConfirmed,
                      firstConfirmedAnswers: hybrid ? player.firstConfirmedAnswers : nextConfirmed,
                      ...completion.identity,
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
            completion.finished = true;
        } finally { completion.finishing = false; }
    };

    const exitLesson = useCallback(() => {
        void (async () => {
            if (!outcome) {
                await JourneyProgressService.setResumableNode(nodeId, stepIndex);
            }
            router.dismissTo('/(tabs)');
        })();
    }, [nodeId, outcome, stepIndex]);

    // Carrega as vidas para a barra do topo. Errar consome vida durante a
    // atividade, e o aluno precisa ver isso acontecer. Relê a cada foco, não
    // só na montagem: quem sai pela folha para assinar volta a esta mesma tela,
    // e sem a releitura veria as vidas vazias de antes da compra — e continuaria
    // bloqueado por elas.
    useFocusEffect(useCallback(() => {
        let alive = true;

        void heartsRepository.getSnapshot(Date.now())
            .then((heartsSnapshot) => {
                if (alive) {
                    setHearts(heartsSnapshot);
                }
            })
            .catch((cause) => {
                console.error('[LessonFlowScreen] Falha ao carregar as vidas:', cause);
            });

        return () => {
            alive = false;
        };
    }, []));

    // Estrelas, frase e nota da conclusão.
    //
    // `resolveAttemptStars` exclui a tentativa atual do histórico comparando
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
                const { stars, recordStars, improved } = resolveAttemptStars(result.lessonId, attempts, {
                    correctAnswers: result.correctAnswers,
                    totalQuestions: result.totalQuestions,
                    completedAt: result.answeredAt.toISOString(),
                });
                const [rating, card] = await Promise.all([
                    LessonRatingService.getRating(result.lessonId),
                    SpacedRepetitionService.getCardState(result.lessonId),
                ]);
                const nextReviewInDays = card ? resolveNextReviewInDays(card, result.answeredAt) : null;

                if (cancelado) {
                    return;
                }

                setSummary({ stars, recordStars, improved, phrase: pickSummaryPhrase(stars, null), rating, nextReviewInDays });
            } catch (cause) {
                console.error('[LessonFlowScreen] Falha ao resolver o resumo da lição:', cause);

                if (cancelado) {
                    return;
                }

                const stars = resolveLessonStars(result.correctAnswers, result.totalQuestions);
                setSummary({
                    stars,
                    recordStars: stars,
                    improved: false,
                    phrase: pickSummaryPhrase(stars, null),
                    rating: null,
                    nextReviewInDays: null,
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
            emit('lesson_complete');
        }
    }, [emit, lessonPassed]);

    if (loading) {
        return (
            <View style={styles.root}>
                <StarfieldBackground backgroundColor={galaxyColors.background} variant="focused" />
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
                            recordStars={summary.recordStars}
                            kind={isReview ? 'review' : 'lesson'}
                            starsImproved={summary.improved}
                            phrase={summary.phrase}
                            xpAwarded={outcome.award?.totalXpAwarded ?? null}
                            correctAnswers={outcome.result.correctAnswers}
                            totalQuestions={outcome.result.totalQuestions}
                            unitCompleted={unitProgress.completed}
                            unitTotal={unitProgress.total}
                            habitLine={null}
                            nextReviewInDays={summary.nextReviewInDays}
                            currentRating={summary.rating}
                            onRate={(nota) => {
                                void LessonRatingService.rate(outcome.result.lessonId, nota);
                                setSummary((atual) => (atual ? { ...atual, rating: nota } : atual));
                            }}
                            onContinue={exitLesson}
                            onRetry={onRetry}
                            continueHint="Volta para Estude"
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
                <StarfieldBackground backgroundColor={galaxyColors.background} variant="focused" />
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
            <StarfieldBackground backgroundColor={galaxyColors.background} variant="focused" />
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
                            hearts={hearts.count}
                            maxHearts={5}
                            unlimited={hearts.status === 'unlimited'}
                            onClose={exitLesson}
                        />
                        <Text style={styles.stepCount}>
                            Passo {stepIndex + 1} de {totalSteps}
                        </Text>
                    </View>

                    <ScrollView
                        ref={scrollRef}
                        style={styles.scroll}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
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

                            {player.isRetry ? <Text style={styles.retryLabel}>Vamos tentar novamente</Text> : null}
                            {currentInteraction ? (
                                <ActivityInteractionRenderer
                                    interaction={currentInteraction}
                                    value={player.value}
                                    confirmationLabel={confirmationLabel}
                                    submitted={player.showingFeedback}
                                    onChange={(value) => {
                                        if (player.showingFeedback) return;
                                        emit('option_tap');
                                        player.setValue(value);
                                    }}
                                />
                            ) : null}

                            {player.showingFeedback && currentInteraction?.type === 'multiple-choice' ? (
                                <View testID="lesson-item-feedback" accessibilityLiveRegion="polite"
                                    style={[styles.itemFeedback, player.lastFeedback?.correct ? styles.itemFeedbackCorrect : styles.itemFeedbackIncorrect]}
                                    onLayout={event => scrollRef.current?.scrollTo({
                                        y: Math.max(0, event.nativeEvent.layout.y - space.s3), animated: false,
                                    })}>
                                    <Text style={[styles.feedbackTitle, player.lastFeedback?.correct ? styles.feedbackTitleCorrect : styles.feedbackTitleIncorrect]}
                                        accessibilityRole="header" maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}>
                                        {player.lastFeedback?.correct ? 'Resposta correta' : 'Vamos reforçar'}
                                    </Text>
                                    <Text style={styles.feedbackText}>{`Sua resposta: ${currentInteraction.payload.options.find(option => option.id === player.value)?.label ?? ''}`}</Text>
                                    <Text style={styles.feedbackText}>{`Resposta certa: ${currentInteraction.payload.options.find(option => option.id === currentInteraction.payload.correctOptionId)?.label ?? ''}`}</Text>
                                    <Text style={styles.feedbackText}>{player.lastFeedback?.message}</Text>
                                </View>
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
                            {confirmationLabel}
                        </AppButton>
                    </View>
                </View>
            </SafeAreaView>
            <HeartsSheet
                visible={heartsSheetVisible}
                snapshot={hearts}
                dueReviewCount={0}
                storeAvailable={subscriptionService.storeAvailable()}
                onClose={exitLesson}
                onReview={() => router.replace('/review')}
                onSubscribe={() => {
                    setHeartsSheetVisible(false);
                    router.push('/subscription');
                }}
            />
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
        backgroundColor: semanticColors.galaxy.surface,
        borderRadius: radius.rLg,
        borderWidth: 1,
        borderColor: galaxyColors.border,
        padding: space.s4,
        gap: space.s4,
    },
    footer: {
        paddingHorizontal: space.s3,
        paddingTop: space.s2,
        paddingBottom: space.s3,
        backgroundColor: semanticColors.galaxy.surface,
    },
    retryLabel: { ...typography.bodyStrong, color: galaxyColors.textPrimary },
    itemFeedback: {
        gap: space.s2, padding: space.s3, borderRadius: radius.rMd,
        backgroundColor: semanticColors.galaxy.surfaceElevated,
    },
    // O tom segue o cartão da revisão G4: borda e título dizem o resultado, e o
    // texto continua em `textPrimary` para manter o contraste do corpo.
    itemFeedbackCorrect: { borderWidth: 1, borderColor: semanticColors.galaxy.statusSuccess },
    itemFeedbackIncorrect: { borderWidth: 1, borderColor: semanticColors.galaxy.statusError },
    feedbackTitle: { ...typography.h3, color: galaxyColors.textPrimary },
    feedbackTitleCorrect: { color: semanticColors.galaxy.statusSuccess },
    feedbackTitleIncorrect: { color: semanticColors.galaxy.statusError },
    feedbackText: { ...typography.bodyRegular, color: galaxyColors.textPrimary },
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
