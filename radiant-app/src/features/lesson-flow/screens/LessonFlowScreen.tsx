import React, { useEffect, useMemo, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppButton } from '../../../components/ui/AppButton';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { LessonFlowService } from '../services/LessonFlowService';
import type { LessonBlock, MultipleChoicePayload } from '../../../types/lessonFlow';
import { galaxyColors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';
import { ContextStepRenderer } from '../renderers/ContextStepRenderer';
import { TeachStepRenderer } from '../renderers/TeachStepRenderer';
import { MultipleChoiceStepRenderer } from '../renderers/MultipleChoiceStepRenderer';
import { ReinforceStepRenderer } from '../renderers/ReinforceStepRenderer';
import { AdvanceStepRenderer } from '../renderers/AdvanceStepRenderer';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { LessonVisualPanel } from '../components/LessonVisualPanel';
import { LessonFlowProgressHeader } from '../components/LessonFlowProgressHeader';

type LessonFlowScreenProps = {
    blockId: string;
    nodeId: string;
};

export default function LessonFlowScreen({ blockId, nodeId }: LessonFlowScreenProps) {
    const [block, setBlock] = useState<LessonBlock | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stepIndex, setStepIndex] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>();
    const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | undefined>();
    const [answerExplanation, setAnswerExplanation] = useState<string | undefined>();

    useEffect(() => {
        let alive = true;

        const bootstrap = async () => {
            try {
                setLoading(true);
                setError(null);
                await JourneyProgressService.setCurrentNode(nodeId);
                await JourneyProgressService.setResumableNode(nodeId);
                const nextBlock = LessonFlowService.getBlockById(blockId);

                if (!alive) {
                    return;
                }

                if (!nextBlock) {
                    setError('Bloco de lição não encontrado.');
                    return;
                }

                setBlock(nextBlock);
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

    const currentStep = block?.steps[stepIndex];
    const totalSteps = block?.steps.length ?? 0;
    const isLastStep = stepIndex === totalSteps - 1;
    const progress = totalSteps > 0 ? (stepIndex + 1) / totalSteps : 0;
    const lessonTitle = useMemo(() => {
        if (!block) {
            return 'Fluxo da Lição';
        }

        const contextStep = block.steps.find((step) => step.step.type === 'context');
        if (contextStep?.step.type === 'context') {
            return contextStep.step.payload.title;
        }

        return block.lessonId;
    }, [block]);

    const multipleChoicePayload =
        currentStep?.step.type === 'multiple-choice' ? currentStep.step.payload : null;

    const canContinue = useMemo(() => {
        if (!currentStep) {
            return false;
        }

        if (currentStep.step.type === 'multiple-choice') {
            return Boolean(selectedOptionId);
        }

        return true;
    }, [currentStep, selectedOptionId]);

    const panelHint = useMemo(() => {
        if (!currentStep) {
            return 'Observe a imagem e siga no seu ritmo.';
        }

        if (currentStep.step.type === 'context' || currentStep.step.type === 'teach') {
            return 'Observe a cena com calma. O texto entra como apoio, não como muleta.';
        }

        if (currentStep.step.type === 'multiple-choice') {
            return 'Compare densidade, borda e contexto anatômico antes de responder.';
        }

        return 'Feche o raciocínio radiológico antes de puxar o próximo passo.';
    }, [currentStep]);

    const panelCaption = useMemo(() => {
        if (!currentStep) {
            return 'Fluxo guiado com foco em continuidade';
        }

        switch (currentStep.step.type) {
            case 'context':
                return 'Leitura inicial da cena';
            case 'teach':
                return 'Reforço da lógica visual';
            case 'multiple-choice':
                return 'Decisão baseada em padrões e contexto';
            case 'reinforce':
                return 'Consolidação do raciocínio';
            case 'advance':
                return 'Pronto para avançar sem quebrar o ritmo';
            default:
                return 'Fluxo guiado com foco em continuidade';
        }
    }, [currentStep]);

    const handleSelectOption = (payload: MultipleChoicePayload, optionId: string) => {
        setSelectedOptionId(optionId);
        setAnsweredCorrectly(optionId === payload.correctOptionId);
        setAnswerExplanation(payload.explanation);
    };

    const handleContinue = async () => {
        if (!block || !currentStep || !canContinue) {
            return;
        }

        if (!isLastStep) {
            setStepIndex((value) => value + 1);
            return;
        }

        await JourneyProgressService.markNodeCompleted(nodeId);
        await JourneyProgressService.setCurrentNode(null);
        await JourneyProgressService.setResumableNode(undefined);
        router.replace('/(tabs)');
    };

    const exitLesson = () => {
        router.replace('/(tabs)');
    };

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

    if (error || !block || !currentStep) {
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
                    <View style={styles.header}>
                        <View style={styles.headerTopRow}>
                            <Pressable
                                onPress={exitLesson}
                                style={styles.closeButton}
                                accessibilityRole="button"
                                accessibilityLabel="Fechar lição"
                            >
                                <MaterialIcons name="close" size={24} color={galaxyColors.textSecondary} />
                            </Pressable>
                        </View>
                        <LessonFlowProgressHeader
                            title={lessonTitle}
                            currentStep={stepIndex + 1}
                            totalSteps={totalSteps}
                            progressPercent={progress * 100}
                        />
                    </View>

                    <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <LessonVisualPanel hint={panelHint} caption={panelCaption} />

                        <View style={styles.contentCard}>
                            {currentStep.step.type === 'context' ? (
                                <ContextStepRenderer payload={currentStep.step.payload} />
                            ) : null}

                            {currentStep.step.type === 'teach' ? (
                                <TeachStepRenderer payload={currentStep.step.payload} />
                            ) : null}

                            {currentStep.step.type === 'multiple-choice' ? (
                                <MultipleChoiceStepRenderer
                                    payload={multipleChoicePayload!}
                                    selectedOptionId={selectedOptionId}
                                    onSelect={(optionId) => handleSelectOption(multipleChoicePayload!, optionId)}
                                    locked={Boolean(selectedOptionId)}
                                />
                            ) : null}

                            {currentStep.step.type === 'reinforce' ? (
                                <ReinforceStepRenderer
                                    payload={currentStep.step.payload}
                                    answeredCorrectly={answeredCorrectly}
                                    explanation={answerExplanation}
                                />
                            ) : null}

                            {currentStep.step.type === 'advance' ? (
                                <AdvanceStepRenderer payload={currentStep.step.payload} />
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
