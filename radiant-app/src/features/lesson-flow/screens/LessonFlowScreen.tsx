import { ContentUpdatedScreen } from '../../content/components/ContentUpdatedScreen';
import { isLearningContentMissing } from '../../content/services/ContentAvailability';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, ActivityIndicator, Alert, Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaInsetsContext, SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { AppButton } from '../../../components/ui/AppButton';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { LessonFlowService } from '../services/LessonFlowService';
import { adaptLegacyBlock } from '../services/LegacyLessonAdapter';
import { useLearningActivity } from '../hooks/useLearningActivity';
import { ActivityInteractionRenderer } from '../renderers/ActivityRendererRegistry';
import { statementStem } from '../renderers/TrueFalseStepRenderer';
import { resolveRtgImage } from '../../student-checkpoints/batches/rtgImages';
import type { LessonBlock } from '../../../types/lessonFlow';
import type { LearningActivityV2, LearningInteractionV2 } from '../../../types/learningActivity';
import { feedbackColors, galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { space, typography } from '../../../ui/styles';
import { ContextStepRenderer } from '../renderers/ContextStepRenderer';
import { TeachStepRenderer } from '../renderers/TeachStepRenderer';
import { ReinforceStepRenderer } from '../renderers/ReinforceStepRenderer';
import { AdvanceStepRenderer } from '../renderers/AdvanceStepRenderer';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { LessonOutcomeService } from '../services/LessonOutcomeService';
import { resolveNextReviewInDays } from '../services/nextReviewInDays';
import { isCorrectInteractionValue } from '../renderers/InteractionAnswerValue';
import { categorizePendingCount } from '../renderers/CategorizeStepRenderer';
import { MAX_HEARTS } from '../../hearts/HeartsService';
import { feedbackFor } from '../services/feedbackFor';
import { COMBO_START, nextCombo, type ComboMilestone } from '../services/lessonCombo';
import { AnswerFeedbackSheet, revealOffset } from '../components/AnswerFeedbackSheet';
import { ComboBadge } from '../components/ComboBadge';
import { DialogueScene, dialogueLineLabel } from '../components/DialogueScene';
import { KeyPointsList } from '../components/KeyPointsList';
import { LessonHelpButton } from '../components/LessonHelpButton';
import { useShakeError } from '../../../ui/motion';
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
import { createLessonFeedback, type LessonFeedback, type LessonFeedbackEvent } from '../../../ui/feedback/lessonFeedback';
import { createLessonSoundPlayer } from '../../../ui/feedback/lessonSounds';
import { readFeedbackPreferences } from '../../../ui/feedback/feedbackPreferences';
import { encouragementFor } from '../../../ui/feedback/encouragement';
import { AppConfig } from '../../../config';
import type { XpAward } from '../../../types/gamification';
import type { JourneySnapshot } from '../../../types/journey';
import type { QuizResult } from '../../../types/quiz';
import {
    STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
    useShadowCheckpoint,
} from '../../student-checkpoints/useShadowCheckpoint';
import { useActiveCheckpoint } from '../../student-checkpoints/useActiveCheckpoint';
import { heartsRepository } from '../../hearts/HeartsRepository';
import { JourneyMedal } from '../../journey/components/JourneyMedal';
import { resolveNodeTheme } from '../../journey/services/resolveNodeTheme';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { JourneyDefinitionService } from '../../journey/services/JourneyDefinitionService';
import { isBenchLessonId } from '../../bench/lessons/BenchLessonCatalog';
import { heartLossAnnouncement } from '../../hearts/heartLossAnnouncement';
import { useUnlimitedExpiry } from '../../conversion/useConversionInvite';
import type { HeartsSnapshot } from '../../hearts/hearts.types';
import { HeartsSheet } from '../../hearts/components/HeartsSheet';
import { HeartLossNotice, TOP_NOTICE_MS } from '../../hearts/components/HeartLossNotice';
import { subscriptionService } from '../../subscription/SubscriptionService';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { studyAttemptId } from '../../spaced-repetition/attemptIds';

const DEFAULT_HEARTS: HeartsSnapshot = {
    count: 5,
    status: 'full',
    nextRefillAt: null,
    unlimitedUntil: null,
};

/**
 * O som da vida espera o do erro terminar (136 ms): em 2026-09-28 os dois saíam
 * com 2 ms de diferença e soavam como um só. Ele toca junto do aviso visível.
 */
const HEART_LOSS_DELAY_MS = 320;

/** Famílias em que o botão confere a resposta; nas outras, o botão segue (ADR-2026-11-13 acrescenta as quatro da 1.6). */
const CHECKED_FAMILIES = new Set<LearningInteractionV2['type']>(['multiple-choice', 'bench', 'case-decision', 'cloze', 'true-false', 'categorize', 'multi-select', 'hotspot', 'label']);
// Rodízio da frase de aula sem erro entre as aulas da mesma abertura do app (F3).
let perfectLessonTurn = 0;
// Famílias em que o gesto põe ou tira uma ficha (F3): o mapa decide o som.
const TOKEN_FAMILIES = new Set<LearningInteractionV2['type']>(['cloze', 'categorize', 'label']);

/**
 * A resposta certa em texto, para a folha de retorno no erro. Vale também nos
 * formatos que marcam a certa na tela: com enunciado longo, a alternativa certa
 * fica atrás da folha (Tarefa 11). Categorizar já mostra o grupo certo em cada
 * ficha; bancada, laboratório e caça ao risco não têm uma resposta curta e
 * única, e o retorno autoral explica.
 */
export function correctAnswerText(interaction: LearningInteractionV2): string | undefined {
    switch (interaction.type) {
        case 'multi-select': {
            const { options, correctOptionIds } = interaction.payload;
            return options.filter(option => correctOptionIds.includes(option.id)).map(option => option.label).join('; ');
        }
        case 'true-false':
            return interaction.payload.statements.map(statement => `${statementStem(statement.text)}: ${statement.isTrue ? 'certo' : 'errado'}`).join('; ');
        case 'ordering': {
            const { items, correctOrder } = interaction.payload;
            return correctOrder.map(id => items.find(item => item.id === id)?.label ?? id).join('; ');
        }
        case 'multiple-choice':
        case 'comparison':
        case 'case-decision': {
            const { options, correctOptionId } = interaction.payload;
            return options.find(option => option.id === correctOptionId)?.label;
        }
        case 'matching':
            return interaction.payload.pairs.map(pair => `${pair.left} → ${pair.right}`).join('; ');
        case 'hotspot': {
            const { regions, correctRegionIds } = interaction.payload;
            return correctRegionIds.map(id => regions.find(region => region.id === id)?.label ?? id).join(', ');
        }
        case 'label': {
            const { points, labels } = interaction.payload;
            return points.map((point, index) => `${index + 1}: ${labels.find(entry => entry.id === point.correctLabelId)?.label ?? ''}`).join('; ');
        }
        case 'cloze': {
            const { blanks, tokens } = interaction.payload;
            return blanks.map(blank => tokens.find(token => token.id === blank.correctTokenId)?.label ?? '').join('; ');
        }
        default:
            return undefined;
    }
}

type LessonFlowScreenProps = {
    blockId: string;
    nodeId: string;
    resumeCheckpointId?: string;
    resumeCursorId?: string;
};

export default function LessonFlowScreen(props: LessonFlowScreenProps) {
    const [attempt, setAttempt] = useState(0);
    if (isLearningContentMissing(props.blockId)) return <ContentUpdatedScreen />;
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
    // F8: a folha só convida quando abre entre um passo e outro, nunca no meio de uma questão.
    const [heartsSheetInvites, setHeartsSheetInvites] = useState(false);
    // Vidas ilimitadas que vencem no meio da aula (amostra da F8, assinatura que acaba): relê,
    // para o HUD não seguir em ∞ e a próxima vida perdida ser anunciada.
    const rereadHearts = useCallback(() => { void heartsRepository.getSnapshot(Date.now()).then(setHearts); }, []);
    useUnlimitedExpiry(hearts.unlimitedUntil, rereadHearts);
    const [dueReviewCount, setDueReviewCount] = useState(0);
    const chargedInteractions = useRef(new Set<string>());
    const completions = useRef(new Map<string, { finishing: boolean; finished: boolean; identity: { attemptId: string; answeredAt: Date } | null }>());
    // Revisão é prática, não prova (ADR de 2026-09-14: "Revisão nunca consome
    // vida"; vidas "não bloqueiam revisão"). Esta tela atende lição e revisão
    // da trilha e cobrava todo erro: no simulador em 2026-10-16, errar a
    // revisão levou de 5 para 4 vidas. ADR de 2026-10-16.
    const isReview = useMemo(() => JourneyDefinitionService.getNodeType(nodeId) === 'review', [nodeId]);
    // Sem nó, a aula não pertence à trilha: `learn.tsx` passa `nodeId=''`
    // quando o deep link não o traz (`radiantapp://learn?blockId=…`, como nas
    // aulas-bancada de exemplo). Gravar o nó vazio como atual ou como retomada,
    // ou zerar os dois na conclusão, apagaria o ponto real em que o aluno parou.
    // A conclusão em `LessonOutcomeService` já não premia nó desconhecido.
    const tracksJourney = nodeId !== '';

    // Som e vibração da lição: a mesma camada do piloto do V3 (spec 2026-09-23,
    // §5.2), ligada às lições do aluno em 2026-09-28 (decisão B do dono). Os
    // sons carregam na abertura e saem na desmontagem; até as preferências
    // chegarem, nada toca. Som é enfeite: falha aqui nunca para a lição.
    const feedbackRef = useRef<LessonFeedback | null>(null);
    const scrollRef = useRef<ScrollView>(null);
    // F3 (ADR 2026-11-15): desligado, o mapa devolve o retorno da base.
    const rich = AppConfig.ENABLE_RICH_FEEDBACK;
    useEffect(() => {
        const sounds = createLessonSoundPlayer();
        let alive = true;
        void readFeedbackPreferences().then((preferences) => {
            if (alive) feedbackRef.current = createLessonFeedback(sounds, preferences, { rich });
        });
        return () => {
            alive = false;
            feedbackRef.current = null;
            sounds.release();
        };
    }, [rich]);
    const emit = useCallback((event: LessonFeedbackEvent) => feedbackRef.current?.emit(event), []);

    // Sequência de acertos, aviso de vida perdida, pista e cena de diálogo
    // (plano de 2026-11-05, frente C). Nada disto entra no checkpoint: uma
    // sessão retomada recomeça a contagem.
    const combo = useRef(COMBO_START);
    const [comboMilestone, setComboMilestone] = useState<ComboMilestone | null>(null);
    const [heartLossVisible, setHeartLossVisible] = useState(false);
    const hintUsed = useRef<Record<string, boolean>>({});
    const [dialogueReveal, setDialogueReveal] = useState({ step: -1, count: 1 });
    // Incentivo do retorno (F3): o rodízio conta os incentivos já mostrados, e
    // `anyWrong` guarda se a sessão teve erro, para a frase de aula sem erro.
    // Um contador por tipo, para a mesma frase não voltar no mesmo marco.
    const [retorno, setRetorno] = useState<{ celebrate: boolean; encouragement?: string; heartLost?: boolean }>({ celebrate: false });
    // Altura medida da folha de retorno: vira folga no fim da rolagem.
    const [sheetHeight, setSheetHeight] = useState(0);
    const bottomInset = useContext(SafeAreaInsetsContext)?.bottom ?? 0;
    const answerLayout = useRef({ y: 0, height: 0 });
    // Alternativa escolhida, relativa à área de resposta; só a múltipla escolha informa.
    const chosenLayout = useRef<{ y: number; height: number } | null>(null);
    const scrollY = useRef(0);
    // Estado, não ref: a janela cresce quando o rodapé sai, e a rolagem recalcula.
    const [scrollViewport, setScrollViewport] = useState(0);
    const encouragementTurn = useRef({ sequencia: 0, retomada: 0 });
    const [perfectLine, setPerfectLine] = useState<string | null>(null);
    const lastWasWrong = useRef(false);
    const anyWrong = useRef(false);
    const answerShake = useShakeError();
    const comboTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const heartTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => () => {
        if (comboTimer.current) clearTimeout(comboTimer.current);
        if (heartTimer.current) clearTimeout(heartTimer.current);
    }, []);

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
    // As aulas-bancada de exemplo não têm bloco legado, e é o modo da sessão que
    // liga o retorno por item, o primeiro contato sem custo de vida e a volta do
    // item errado (spec, seção 5). Elas correm como lição híbrida.
    const sessionMode = block?.sessionMode
        ?? (activity && isBenchLessonId(activity.id) ? 'hybrid-lesson' : undefined);
    const hybrid = Boolean(sessionMode);
    // Aula com mais de uma interação mostra o retorno de cada item antes de
    // seguir: sem isso, a aula ampla (até 8 interações) só comentaria a última.
    const interactionCount = activity?.steps.filter(step => step.kind === 'interaction').length ?? 0;
    const perItemFeedback = hybrid || interactionCount > 1 || Boolean(activity?.steps.some(step =>
        step.kind === 'interaction' && step.interaction.type === 'case-decision'));
    const lessonContext = useMemo(() => {
        if (nodeId) {
            for (const track of LessonCatalogService.listTracks()) {
                for (const unit of JourneyDefinitionService.getTrackDefinition(track.id).units) {
                    const node = unit.nodes.find(candidate => candidate.id === nodeId);
                    if (node) return { theme: resolveNodeTheme(node, unit), title: node.title };
                }
            }
        }
        const hook = activity?.steps.find(step => step.kind === 'presentation' && step.role === 'hook');
        const catalogTitle = block ? LessonCatalogService.getLessonById(block.lessonId)?.title : undefined;
        return {
            theme: resolveNodeTheme({ theme: activity?.theme }),
            title: catalogTitle ?? (hook?.kind === 'presentation' ? hook.payload.title : undefined),
        };
    }, [nodeId, activity, block]);
    const lessonTheme = lessonContext.theme;
    const player = useLearningActivity(activity, resumeStepIndex, {
        feedbackPerItem: perItemFeedback,
        repeatIncorrect: sessionMode === 'hybrid-lesson' && !isReview,
    });

    useEffect(() => {
        let alive = true;

        const bootstrap = async () => {
            try {
                setLoading(true);
                setError(null);
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

                // Availability is resolved before any progress/cursor write.
                if (tracksJourney) {
                    await JourneyProgressService.setCurrentNode(nodeId);
                    const entrySnapshot = await JourneyProgressService.setResumableNode(nodeId);
                    if (!alive) return;
                    setDueReviewCount(entrySnapshot?.dueReviewCount ?? 0);
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
    }, [blockId, nodeId, tracksJourney]);

    const { stepIndex, totalSteps, isLastStep, progress } = player;
    useEffect(() => {
        chosenLayout.current = null;
        scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [stepIndex]);
    // O passo legado continua disponível enquanto o catálogo antigo coexistir
    // com o v2. A atividade promovida, porém, não precisa fabricar esse bloco.
    const legacyStep = player.isRetry ? undefined : block?.steps[stepIndex];
    const currentStep = player.currentStep;
    // A lista de cursores compatíveis é estável: acrescentar um retorno não
    // deve criar outro checkpoint da mesma sessão. Reservamos até um por item.
    const checkpointCapacity = sessionMode === 'hybrid-lesson' && activity
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
        // Sem nó, o checkpoint seria uma retomada sem nó para onde voltar.
        enabled: Boolean(activity && currentStep) && tracksJourney,
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
        enabled: Boolean(activity && currentStep) && tracksJourney,
        resumeCheckpointId,
        onRestoreFallback: handleRestoreFallback,
    });
    const currentInteraction = player.currentStep?.kind === 'interaction'
        ? player.currentStep.interaction
        : null;
    // A folha de retorno entra no lugar do rodapé. Com a altura dela medida, a
    // rolagem leva a área de resposta, onde está a alternativa escolhida, para
    // cima da folha, sem esconder o começo dela.
    const showingSheet = player.showingFeedback && currentInteraction !== null;
    useEffect(() => {
        if (!showingSheet || sheetHeight === 0) return;
        const { y, height } = answerLayout.current;
        const chosen = chosenLayout.current;
        if (chosen) {
            const offset = revealOffset({ top: y + chosen.y, bottom: y + chosen.y + chosen.height, scrollY: scrollY.current,
                viewportHeight: scrollViewport, sheetHeight, margin: space.s3 });
            if (offset !== null) scrollRef.current?.scrollTo({ y: offset, animated: false });
            return;
        }
        // Sem alternativas: o fim da área de resposta encosta na folha, sem esconder o começo.
        const target = Math.min(y, y + height + space.s3 - (scrollViewport - sheetHeight));
        scrollRef.current?.scrollTo({ y: Math.max(0, target), animated: false });
    }, [showingSheet, sheetHeight, scrollViewport]);
    // Cena de diálogo: as falas aparecem uma por toque no botão do rodapé, que
    // fica fora da rolagem e por isso continua ao alcance com texto ampliado.
    const stepDialogue = !legacyStep && currentStep?.kind === 'presentation' ? currentStep.payload.dialogue : undefined;
    const revealedLines = dialogueReveal.step === stepIndex ? dialogueReveal.count : 1;
    const dialoguePending = revealedLines < (stepDialogue?.lines.length ?? 0);
    useEffect(() => {
        if (revealedLines > 1) scrollRef.current?.scrollToEnd({ animated: false });
    }, [revealedLines]);
    // O valor inicial da bancada já sobe ao player, então o passo está completo
    // antes de o aluno mexer. No explorar e no corrigir o botão confere, e um
    // toque sem mexer no controle valeria como primeira resposta errada: ele
    // espera o alvo, como na prancheta. No desafio fica livre, porque o erro ali
    // indica o lado certo.
    const benchWaitsForGoal = !player.showingFeedback
        && currentInteraction?.type === 'bench'
        && currentInteraction.payload.mode !== 'challenge'
        && !isCorrectInteractionValue(currentInteraction, player.value);
    const canContinue = player.canContinue && !benchWaitsForGoal;
    const announcedReady = useRef(new Set<string>());
    useEffect(() => {
        if (currentInteraction?.type !== 'bench' || currentInteraction.payload.mode === 'challenge'
            || player.showingFeedback || !canContinue) return;
        // Retornos têm outro índice: cada visita anuncia no máximo uma vez,
        // mesmo quando o aluno sai do alvo e volta a ele antes de conferir.
        const visit = `${stepIndex}:${currentInteraction.id}`;
        if (announcedReady.current.has(visit)) return;
        announcedReady.current.add(visit);
        AccessibilityInfo.announceForAccessibility('Alvo alcançado. Você já pode conferir a resposta.');
    }, [canContinue, currentInteraction, player.showingFeedback, stepIndex]);

    const confirmationLabel = dialoguePending
        ? 'Continuar'
        : player.showingFeedback
        ? isLastStep ? 'Concluir e voltar' : 'Continuar'
        : currentInteraction && CHECKED_FAMILIES.has(currentInteraction.type)
        ? 'Conferir resposta'
        : isLastStep ? 'Concluir e voltar' : 'Continuar';

    // Em classificar o botão diz quantas fichas faltam; o rótulo de confirmação, que os
    // renderizadores citam nas dicas, continua sendo "Conferir resposta".
    const pendingTokens = !player.showingFeedback && !dialoguePending && currentInteraction?.type === 'categorize'
        ? categorizePendingCount(currentInteraction.payload, player.value) : 0;
    const actionLabel = pendingTokens === 1 ? 'Falta 1 ficha' : pendingTokens > 1 ? `Faltam ${pendingTokens} fichas` : confirmationLabel;

    const handleContinue = async () => {
        const key = JSON.stringify([blockId, nodeId]);
        if (!completions.current.has(key)) completions.current.set(key, { finishing: false, finished: false, identity: null });
        const completion = completions.current.get(key)!;
        if (!activity || !currentStep || !canContinue || completion.finishing || completion.finished) {
            return;
        }

        // Com falas por revelar, o botão mostra a próxima e não avança o passo.
        // O foco do leitor de tela está no botão: a fala nova é anunciada.
        if (dialoguePending && stepDialogue) {
            setDialogueReveal({ step: stepIndex, count: revealedLines + 1 });
            emit('dialogue_line');
            AccessibilityInfo.announceForAccessibility(dialogueLineLabel(stepDialogue.lines[revealedLines]));
            return;
        }

        // O estado decide, não o número: assinante pode carregar `count: 0`.
        // Sem vidas, o bloqueio vem antes de responder um item que custa vida.
        // Depois do feedback de um débito, seguir é livre: a última vida perdida
        // no último retorno conclui a lição (ADR de 2026-10-18, régua e última vida).
        const costsHeart = !isReview && (!hybrid || player.isRetry);
        if (costsHeart && hearts.status === 'empty' && currentInteraction && !player.showingFeedback) {
            setHeartsSheetInvites(false);
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
            const comboNow = nextCombo(combo.current, correct);

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
                    // Em 2026-09-28 o dono tirou o som da vida: saía 2 ms depois
                    // do erro e os dois soavam como um só. Ele volta com o aviso
                    // em primeiro plano (FILA, 26), depois do erro e só quando
                    // o contador caiu de fato: assinante e revisão não ouvem.
                    if (heartTimer.current) clearTimeout(heartTimer.current);
                    // Com retorno por item, a folha já diz "Menos 1 vida" na linha do título.
                    const showsInSheet = perItemFeedback;
                    heartTimer.current = setTimeout(() => {
                        if (!showsInSheet) setHeartLossVisible(true);
                        emit('heart_lost');
                        heartTimer.current = setTimeout(() => setHeartLossVisible(false), TOP_NOTICE_MS);
                    }, HEART_LOSS_DELAY_MS);
                }
            } else {
                // No marco, o som da sequência entra no lugar do acerto: dois
                // sons no mesmo instante viram um só.
                emit(comboNow.milestone === 3 ? 'streak' : comboNow.milestone ? 'combo' : 'correct');
            }

            // Só aqui a resposta está de fato confirmada (o toque duplo num erro
            // já cobrado saiu acima): a sequência conta uma vez por confirmação.
            combo.current = comboNow;
            const milestone = correct ? comboNow.milestone : null;
            const turns = encouragementTurn.current;
            const encouragement = milestone ? encouragementFor({ kind: 'sequencia', milestone }, turns.sequencia++)
                : correct && lastWasWrong.current ? encouragementFor({ kind: 'retomada' }, turns.retomada++) : undefined;
            lastWasWrong.current = !correct;
            if (!correct) anyWrong.current = true;
            setRetorno({ celebrate: milestone !== null, encouragement, heartLost: heartLossCopy !== '' });
            if (!correct) answerShake.animateIn();
            if (comboTimer.current) clearTimeout(comboTimer.current);
            setComboMilestone(comboNow.milestone);
            if (comboNow.milestone) comboTimer.current = setTimeout(() => setComboMilestone(null), TOP_NOTICE_MS);
            // Com o retorno rico, o incentivo diz o marco: a contagem não se repete no anúncio.
            const comboCopy = comboNow.milestone && !(rich && encouragement) ? `${comboNow.milestone} respostas certas seguidas. ` : '';

            const result = correct ? 'Resposta correta.' : 'Resposta incorreta.';
            // Com retorno por item, a folha recebe o foco e o leitor lê o título, a
            // explicação e a vida perdida nela: o anúncio diz só o resultado. O
            // marco da sequência fica, porque o selo do topo não recebe o foco.
            const message = feedbackFor(currentInteraction, player.value, correct);
            AccessibilityInfo.announceForAccessibility(perItemFeedback ? `${result} ${comboCopy}`.trim()
                : `${result} ${comboCopy}${message}${heartLossCopy}` + (rich && encouragement ? ` ${encouragement}` : ''));
        }

        const nextConfirmed = player.confirm();
        // Conferir mantém a pergunta na tela. Só o segundo toque avança ou conclui.
        if (perItemFeedback && currentInteraction && !player.showingFeedback) {
            return;
        }

        if (!isLastStep) {
            // Passar de etapa, não conferir: a confirmação já teve o seu retorno.
            if (!currentInteraction || player.showingFeedback) emit('advance');
            if (costsHeart && nextHearts.status === 'empty') {
                if (tracksJourney) await JourneyProgressService.setResumableNode(nodeId, stepIndex + 1);
                setHeartsSheetInvites(true);
                setHeartsSheetVisible(true);
            }
            return;
        }

        if (completion.finishing || completion.finished) return;
        completion.finishing = true;
        completion.identity ??= { attemptId: studyAttemptId(), answeredAt: new Date() };
        // A pista não muda acertos, estrelas nem XP. Ela segue como `hintUsed`
        // para a evidência do item, que o serviço já previa: a memória ganha
        // menos com acerto ajudado, e o domínio não conta esse acerto.
        const hintEvidence = Object.keys(hintUsed.current).length > 0 ? { hintUsedByInteraction: hintUsed.current } : null;
        try {
            const lessonOutcome = block
                ? await LessonOutcomeService.recordCompletion({
                      block,
                      nodeId,
                      confirmedAnswers: nextConfirmed,
                      firstConfirmedAnswers: perItemFeedback ? player.firstConfirmedAnswers : nextConfirmed,
                      ...hintEvidence,
                      ...completion.identity,
                  })
                : await LessonOutcomeService.recordActivityCompletion({
                      activity,
                      nodeId,
                      confirmedAnswers: nextConfirmed,
                      firstConfirmedAnswers: perItemFeedback ? player.firstConfirmedAnswers : nextConfirmed,
                      ...hintEvidence,
                      ...completion.identity,
                  });

            // O snapshot vem do RETORNO de `markNodeCompleted`, não de uma leitura
            // solta via `getSnapshot()`. As duas correriam em paralelo com a
            // escrita, e a leitura pode terminar antes de a marcação pousar —
            // mostrando a unidade sem a lição que acabou de fechar. Encadear a
            // partir da própria marcação elimina a corrida.
            const snapshot = tracksJourney ? await JourneyProgressService.markNodeCompleted(nodeId) : null;
            if (snapshot) {
                // Na trilha do nó, não na ativa: a unidade inserida atrás do aluno
                // (1.6) não pode apagar a retomada da trilha onde ele está.
                await JourneyProgressService.setCurrentNode(null, snapshot.track);
                await JourneyProgressService.setResumableNode(undefined, snapshot.track);
            }
            await activeCheckpoint.finish();

            setJourneySnapshot(snapshot);
            // Aula (não revisão) sem erro nesta sessão e completa no registro: a
            // retomada no meio não sabe dos erros de antes, então o registro também conta.
            const { correctAnswers, totalQuestions } = lessonOutcome.result;
            setPerfectLine(rich && !isReview && !anyWrong.current && totalQuestions > 0 && correctAnswers === totalQuestions
                ? encouragementFor({ kind: 'aula-sem-erro' }, perfectLessonTurn++) : null);
            setOutcome({ result: lessonOutcome.result, award: lessonOutcome.award });
            completion.finished = true;
        } finally { completion.finishing = false; }
    };

    const exitLesson = useCallback(() => {
        void (async () => {
            if (!outcome && tracksJourney) {
                await JourneyProgressService.setResumableNode(nodeId, stepIndex);
            }
            router.dismissTo('/(tabs)');
        })();
    }, [nodeId, outcome, stepIndex, tracksJourney]);

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

    // A conclusão comemora com pelo menos uma estrela, que é pelo menos um
    // acerto (plano de 2026-11-05, frente C). Com zero acerto, nem som nem
    // confete. Um booleano, para avaliar a aula no resumo não tocar de novo.
    const celebrates = (summary?.stars ?? 0) > 0;

    useEffect(() => {
        if (celebrates) {
            emit('lesson_complete');
        }
    }, [emit, celebrates]);

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
                <SafeAreaView style={styles.safe} edges={['top']}>
                    {summary ? (
                        <LessonSummary
                            title={lessonContext.title}
                            theme={lessonTheme}
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
                            habitLine={perfectLine}
                            mintOnComplete={rich}
                            nextReviewInDays={summary.nextReviewInDays}
                            currentRating={summary.rating}
                            onRate={(nota) => {
                                void LessonRatingService.rate(outcome.result.lessonId, nota);
                                setSummary((atual) => (atual ? { ...atual, rating: nota } : atual));
                            }}
                            onContinue={exitLesson}
                            onRetry={onRetry}
                            continueHint="Volta para Estude"
                            celebrate
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
            {/* Sem a borda de baixo: o rodapé e a folha de retorno pintam até a borda da tela e levam o inset por dentro. */}
            <SafeAreaView style={styles.safe} edges={['top']}>
                <View style={styles.page}>
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
                        <View style={styles.statusRow}>
                            <Text style={styles.stepCount}>
                                Passo {stepIndex + 1} de {totalSteps}
                            </Text>
                            {comboMilestone ? <ComboBadge milestone={comboMilestone} /> : null}
                            {heartLossVisible ? <HeartLossNotice testID="lesson-heart-loss" /> : null}
                        </View>
                    </View>

                    <ScrollView
                        ref={scrollRef}
                        testID="lesson-scroll"
                        style={styles.scroll}
                        contentContainerStyle={[styles.scrollContent, showingSheet ? { paddingBottom: space.s4 + sheetHeight } : null]}
                        showsVerticalScrollIndicator={false}
                        onLayout={event => setScrollViewport(event.nativeEvent.layout.height)}
                        onScroll={event => { scrollY.current = event.nativeEvent.contentOffset.y; }}
                        scrollEventThrottle={16}
                    >
                        {currentStep.kind === 'presentation' && currentStep.role === 'hook' ? (
                            <View style={styles.openingMedal}>
                                <JourneyMedal node={{ id: nodeId || activity.id, type: 'lesson' }}
                                    theme={lessonTheme} state="done" pulsing={false} size={68}
                                    accessibilityLabel="Medalha do tema da aula" />
                            </View>
                        ) : null}
                        {legacyStep?.step.type === 'context' ? (
                            <ContextStepRenderer payload={legacyStep.step.payload} />
                        ) : null}

                        {legacyStep?.step.type === 'teach' ? (
                            <TeachStepRenderer payload={legacyStep.step.payload} />
                        ) : null}

                        {!legacyStep && currentStep.kind === 'presentation' && currentStep.role === 'hook' ? (
                            <>
                                {/* Com cena, as falas vêm antes do corpo, que espera a última. */}
                                <ContextStepRenderer payload={{
                                    title: currentStep.payload.title,
                                    body: stepDialogue ? '' : currentStep.payload.body ?? '',
                                    eyebrow: currentStep.payload.eyebrow,
                                }} />
                                {stepDialogue ? <DialogueScene dialogue={stepDialogue} visibleCount={revealedLines} /> : null}
                                {stepDialogue && !dialoguePending && currentStep.payload.body ? (
                                    <Text style={styles.sceneBody}>{currentStep.payload.body}</Text>
                                ) : null}
                            </>
                        ) : null}

                        {!legacyStep && currentStep.kind === 'presentation' && currentStep.role === 'concept' ? (
                            <>
                                <TeachStepRenderer payload={{
                                    title: currentStep.payload.title,
                                    body: currentStep.payload.body ?? '',
                                }} />
                                {currentStep.payload.keyPoints?.length ? <KeyPointsList points={currentStep.payload.keyPoints} /> : null}
                            </>
                        ) : null}

                        {player.isRetry ? <Text style={styles.retryLabel}>Vamos tentar novamente</Text> : null}
                        {currentInteraction ? (
                            // O tremor leve no erro é da área de resposta, não do cartão de retorno.
                            <Animated.View style={answerShake.style}
                                testID="lesson-answer"
                                onLayout={event => { answerLayout.current = event.nativeEvent.layout; }}>
                                <ActivityInteractionRenderer
                                    interaction={currentInteraction}
                                    resolveImageSource={resolveRtgImage}
                                    value={player.value}
                                    confirmationLabel={confirmationLabel}
                                    submitted={player.showingFeedback}
                                    onChosenLayout={layout => { chosenLayout.current = layout; }}
                                    onChange={(value) => {
                                        if (player.showingFeedback) return;
                                        emit(TOKEN_FAMILIES.has(currentInteraction.type) ? 'token_drop' : 'option_tap');
                                        player.setValue(value);
                                    }}
                                />
                            </Animated.View>
                        ) : null}

                        {currentInteraction?.help ? (
                            <LessonHelpButton key={`${stepIndex}:${currentInteraction.id}`}
                                help={currentInteraction.help} locked={player.showingFeedback}
                                onReveal={() => { hintUsed.current = { ...hintUsed.current, [currentInteraction.id]: true }; }} />
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

                        {/*
                          Quando cada item já mostrou o próprio retorno (lição
                          híbrida ou aula com várias interações), o fechamento
                          mostra o próprio título e texto, e não repete o da
                          última interação (achado 4 da prova de 2026-11-07).
                        */}
                        {currentStep.kind === 'presentation' && currentStep.role === 'closing' && stepDialogue ? (
                            <DialogueScene dialogue={stepDialogue} visibleCount={revealedLines} />
                        ) : null}
                        {!legacyStep && currentStep.kind === 'presentation' && currentStep.role === 'closing' && !dialoguePending ? (
                            <ReinforceStepRenderer
                                payload={{
                                    title: currentStep.payload.title,
                                    body: currentStep.payload.body ?? '',
                                    tone: currentStep.payload.tone ?? 'neutral',
                                }}
                                answeredCorrectly={perItemFeedback ? undefined : player.lastFeedback?.correct}
                                explanation={perItemFeedback ? undefined : player.lastFeedback?.message}
                            />
                        ) : null}
                    </ScrollView>

                    {showingSheet && currentInteraction ? (
                        <AnswerFeedbackSheet
                            rich={rich}
                            celebrate={retorno.celebrate}
                            encouragement={retorno.encouragement}
                            heartLost={retorno.heartLost}
                            heartsLeft={{ current: hearts.count, max: MAX_HEARTS }}
                            correct={player.lastFeedback?.correct === true}
                            message={player.lastFeedback?.message ?? ''}
                            correctLabel={correctAnswerText(currentInteraction)}
                            actionLabel={confirmationLabel}
                            onAction={() => void handleContinue()}
                            onHeightChange={setSheetHeight}
                        />
                    ) : (
                        <View testID="lesson-footer" style={[styles.footer, { paddingBottom: space.s3 + bottomInset }]}>
                            <AppButton onPress={() => void handleContinue()} disabled={!canContinue} style={styles.primaryAction}
                                accessibilityHint={benchWaitsForGoal ? 'Alcance o alvo indicado na atividade para conferir a resposta.' : undefined}>
                                {actionLabel}
                            </AppButton>
                        </View>
                    )}
                </View>
            </SafeAreaView>
            <HeartsSheet
                visible={heartsSheetVisible && hearts.status !== 'unlimited'}
                snapshot={hearts}
                dueReviewCount={dueReviewCount}
                storeAvailable={subscriptionService.storeAvailable()}
                inviteAllowed={heartsSheetInvites}
                onHeartsChanged={(next) => { setHearts(next); setHeartsSheetVisible(false); }}
                onClose={exitLesson}
                onReview={() => {
                    setHeartsSheetVisible(false);
                    router.replace('/review');
                }}
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
    page: {
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
        lineHeight: undefined,
        flexShrink: 0,
        color: galaxyColors.textSecondary,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: space.s3,
        paddingBottom: space.s4,
        // O conteúdo do passo fica direto sobre o fundo, sem moldura (spec 2026-11-16, 7.1).
        gap: space.s4,
    },
    openingMedal: { alignItems: 'center' },
    // O padding de baixo soma o inset da área segura, na própria tela.
    footer: {
        paddingHorizontal: space.s3,
        paddingTop: space.s2,
        backgroundColor: semanticColors.galaxy.surface,
    },
    retryLabel: { ...typography.bodyStrong, color: galaxyColors.textPrimary },
    // Contagem à esquerda e, por instantes, o selo de sequência ou o aviso de
    // vida. A altura mínima é a do selo, para o conteúdo não pular quando ele
    // entra; com texto ampliado a linha quebra em vez de comprimir.
    statusRow: {
        flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
        gap: space.s2, minHeight: 28,
    },
    sceneBody: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
    primaryAction: {
        width: '100%',
    },
    errorCard: {
        backgroundColor: galaxyColors.surfaceActive,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: feedbackColors.error.fill,
        padding: space.s3,
        width: '100%',
    },
    errorText: {
        ...typography.bodyRegular,
        color: galaxyColors.critical,
        textAlign: 'center',
    },
});
