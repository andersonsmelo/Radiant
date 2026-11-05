import React, { useRef, useState } from 'react';
import { AccessibilityInfo, findNodeHandle, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { AuthoredEvidenceKind } from '../../types/learningActivity';
import { AppButton } from '../../components/ui/AppButton';
import { layout, space, typography } from '../../ui/styles';
import { galaxyColors } from '../../ui/theme';
import { useLearningActivity } from '../lesson-flow/hooks/useLearningActivity';
import { ActivityInteractionRenderer, type InteractionRendererProps } from '../lesson-flow/renderers/ActivityRendererRegistry';
import type { InteractionImageResolver } from '../lesson-flow/renderers/InteractionImageSource';
import {
    createEditorialPreviewMaterial,
    type EditorialPreviewSession,
    type EditorialPreviewStage,
} from './EditorialPreviewMaterial';

export type EditorialObservationStage = EditorialPreviewStage | 'practice';

export type EditorialPreviewObservation =
    | Readonly<{ kind: 'help-opened'; stage: EditorialObservationStage; targetId: string; interactionId: string }>
    | Readonly<{ kind: 'answer-confirmed'; stage: EditorialObservationStage; targetId: string; interactionId: string;
        value: string; correct: boolean; helpUsed: boolean; assisted: boolean; evidenceKind: AuthoredEvidenceKind }>;

type Props = Readonly<{
    material?: unknown;
    stage?: EditorialPreviewStage;
    onObservation?: (observation: EditorialPreviewObservation) => void;
    onFinish?: (result: Readonly<{ stage: EditorialObservationStage; firstConfirmedAnswers: Readonly<Record<string, boolean>> }>) => void;
}>;

/** Isolated reviewer component. The caller supplies material and chooses the stage explicitly. */
export function EditorialLessonPreview({ material, stage = 'lesson', onObservation, onFinish }: Props) {
    if (material === undefined) return <Text>Conteúdo em preparação</Text>;
    const parsed = createEditorialPreviewMaterial(material);
    if (!parsed.ok || !parsed.sessions[stage]) return <Text>Não foi possível abrir esta prévia.</Text>;
    const session = parsed.sessions[stage];
    // Reset the ephemeral cursor when stage OR authored material changes, including feedback/help.
    return <EditorialPreviewSessionView key={JSON.stringify({ stage, session })} session={session} stage={stage}
        onObservation={onObservation} onFinish={onFinish} />;
}

export function EditorialPreviewSessionView({ session, stage, onObservation, onFinish, InteractionComponent = ActivityInteractionRenderer, resolveImageSource }: Omit<Props, 'material' | 'stage'> & {
    session: EditorialPreviewSession; stage: EditorialObservationStage;
    InteractionComponent?: React.ComponentType<InteractionRendererProps>;
    resolveImageSource?: InteractionImageResolver;
}) {
    const player = useLearningActivity(session.activity, 0, { feedbackPerItem: true, repeatIncorrect: false });
    const [helpVisible, setHelpVisible] = useState(false);
    const [finished, setFinished] = useState(false);
    const observed = useRef(new Set<string>());
    const helped = useRef(new Set<string>());
    const finishedRef = useRef(false);
    const step = player.currentStep;
    const { fontScale } = useWindowDimensions();
    const scroll = useRef<ScrollView>(null);
    const heading = useRef<Text>(null);
    const feedback = useRef<Text>(null);
    const announced = useRef('');
    function announce(key: string, target: Text | null, message: string) {
        if (announced.current === key) return;
        announced.current = key;
        const handle = findNodeHandle(target);
        if (handle != null) AccessibilityInfo.setAccessibilityFocus(handle);
        AccessibilityInfo.announceForAccessibility(message);
    }

    function openHelp() {
        if (!step || step.kind !== 'interaction' || player.showingFeedback || helped.current.has(step.interaction.id)) return;
        helped.current.add(step.interaction.id);
        setHelpVisible(true);
        onObservation?.({ kind: 'help-opened', stage, targetId: session.targetIds[step.interaction.id], interactionId: step.interaction.id });
    }

    function advance() {
        if (!step || !player.canContinue || finishedRef.current) return;
        if (step.kind === 'interaction' && !player.showingFeedback) {
            const answers = player.confirm();
            if (observed.current.has(step.interaction.id) || !Object.hasOwn(answers, step.interaction.id)) return;
            observed.current.add(step.interaction.id);
            const helpUsed = helped.current.has(step.interaction.id);
            onObservation?.({
                kind: 'answer-confirmed', stage, targetId: session.targetIds[step.interaction.id],
                interactionId: step.interaction.id, value: player.value!, correct: answers[step.interaction.id],
                helpUsed, assisted: helpUsed || stage === 'guided-recovery',
                evidenceKind: step.interaction.evidenceKind as AuthoredEvidenceKind,
            });
            return;
        }
        if (player.isLastStep) {
            finishedRef.current = true;
            setFinished(true);
            onFinish?.({ stage, firstConfirmedAnswers: { ...player.firstConfirmedAnswers } });
            return;
        }
        player.confirm();
        setHelpVisible(false);
    }

    if (finished) return <View style={[layout.screen, styles.background]}><Text key={`finished-${fontScale}`} ref={heading} style={styles.title} accessibilityRole="header" onLayout={() => announce('finished', heading.current, 'Prévia encerrada')}>Prévia encerrada</Text></View>;
    const confirming = step?.kind === 'interaction' && !player.showingFeedback;
    const label = confirming ? 'Confirmar resposta' : player.isLastStep ? 'Encerrar prévia' : 'Continuar';
    return (
        <View style={[layout.screen, styles.background]}>
            <ScrollView ref={scroll} contentContainerStyle={styles.content}>
                <Text key={`caption-${fontScale}`} style={styles.caption}>Prévia de conteúdo</Text>
                <Text key={`step-${player.stepIndex}-${fontScale}`} ref={heading} style={styles.caption} accessibilityRole="progressbar"
                    onLayout={() => {
                        scroll.current?.scrollTo({ y: 0, animated: false });
                        announce(`step:${player.stepIndex}`, heading.current, `Etapa ${player.stepIndex + 1} de ${player.totalSteps}`);
                    }}
                    accessibilityValue={{ min: 0, max: player.totalSteps, now: player.stepIndex + 1 }}>
                    Etapa {player.stepIndex + 1} de {player.totalSteps}
                </Text>
                {step?.kind === 'presentation' ? (
                    <View style={styles.section}>
                        <Text key={`title-${fontScale}`} style={styles.title} accessibilityRole="header">{step.payload.title}</Text>
                        {step.payload.body ? <Text key={`body-${fontScale}`} style={styles.body}>{step.payload.body}</Text> : null}
                    </View>
                ) : step?.kind === 'interaction' ? (
                    <View style={styles.section}>
                        <InteractionComponent resolveImageSource={resolveImageSource} interaction={step.interaction} value={player.value}
                            onChange={player.setValue} confirmationLabel="Confirmar resposta" submitted={player.showingFeedback} />
                        {session.help && !player.showingFeedback ? (
                            <View style={styles.section}>
                                <AppButton label="Ver ajuda" variant="secondary" onPress={openHelp} />
                                {helpVisible ? <Text key={`help-${fontScale}`} style={styles.body} accessibilityLiveRegion="polite">{session.help.text}</Text> : null}
                            </View>
                        ) : null}
                    </View>
                ) : null}
                {player.showingFeedback && player.lastFeedback ? (
                    <View style={styles.feedback} onLayout={event => {
                        scroll.current?.scrollTo({ y: event.nativeEvent.layout.y, animated: false });
                        announce(`feedback:${player.stepIndex}`, feedback.current, player.lastFeedback!.message);
                    }}>
                        <Text key={`feedback-heading-${fontScale}`} style={styles.heading}>{player.lastFeedback.correct ? 'Resposta conferida' : 'Vamos rever'}</Text>
                        <Text key={`feedback-${fontScale}`} ref={feedback} style={styles.body} accessibilityRole="alert">{player.lastFeedback.message}</Text>
                    </View>
                ) : null}
                <AppButton label={label} variant="galaxy" onPress={advance} disabled={!player.canContinue} fullWidth />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    background: { backgroundColor: galaxyColors.background },
    content: { padding: space.s1, gap: space.s5, paddingBottom: space.s6 },
    section: { gap: space.s3 },
    feedback: { padding: space.s4, gap: space.s2, backgroundColor: galaxyColors.surface },
    title: { ...typography.h3, color: galaxyColors.textPrimary },
    heading: { ...typography.bodyStrong, color: galaxyColors.textPrimary },
    body: { ...typography.bodyRegular, color: galaxyColors.textPrimary },
    caption: { ...typography.caption, color: galaxyColors.textSecondary },
});
