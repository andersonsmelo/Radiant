import React, { useEffect, useMemo, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppButton } from '../../../components/ui/AppButton';
import { SurfaceCard } from '../../../components/ui/SurfaceCard';
import { LessonFlowService } from '../services/LessonFlowService';
import type { LessonBlock, MultipleChoicePayload } from '../../../types/lessonFlow';
import { colors } from '../../../ui/theme';
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
            return 'Lesson Flow';
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
            <SafeAreaView style={styles.screen}>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    if (error || !block || !currentStep) {
        return (
            <SafeAreaView style={styles.screen}>
                <View style={styles.centered}>
                    <SurfaceCard variant="solid" style={styles.errorCard}>
                        <Text style={styles.errorText}>{error ?? 'Bloco inválido.'}</Text>
                    </SurfaceCard>
                    <AppButton onPress={exitLesson}>Voltar para a trilha</AppButton>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerTopRow}>
                        <Pressable
                            onPress={exitLesson}
                            style={styles.closeButton}
                            accessibilityRole="button"
                            accessibilityLabel="Fechar lição"
                        >
                            <MaterialIcons name="close" size={24} color={colors.textSecondary} />
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

                    <SurfaceCard variant="solid" style={styles.contentCard}>
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
                    </SurfaceCard>
                </ScrollView>

                <View style={styles.footer}>
                    <AppButton onPress={() => void handleContinue()} disabled={!canContinue} style={styles.primaryAction}>
                        {isLastStep ? 'Concluir e voltar' : 'Continuar'}
                    </AppButton>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
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
        backgroundColor: colors.surfaceGlass,
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
        gap: space.s3,
    },
    footer: {
        paddingHorizontal: space.s3,
        paddingTop: space.s2,
        paddingBottom: space.s3,
        backgroundColor: 'rgba(245, 250, 255, 0.94)',
    },
    primaryAction: {
        width: '100%',
    },
    errorCard: {
        width: '100%',
    },
    errorText: {
        ...typography.bodyRegular,
        color: colors.danger,
        textAlign: 'center',
    },
});
