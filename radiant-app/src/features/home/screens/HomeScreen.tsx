// src/features/home/screens/HomeScreen.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { GamificationService } from '../../gamification/services/GamificationService';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import { AppButton } from '../../../components/ui/AppButton';
import type { QuizLessonId } from '../../../types/quiz';
import type { GamificationSnapshot } from '../../../types/gamification';
import type { DailyGoalSnapshot } from '../../../types/dailyGoal';
import { space, typography, layout } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';
import { useFadeInUp, useCardEnter } from '../../../ui/motion';
import { CharacterSlot } from '../../../ui/characters/CharacterSlot';
import { TelemetryService } from '../../telemetry/TelemetryService';
import { HeuristicsService } from '../../telemetry/heuristics/HeuristicsService';
import type { HeuristicAlert } from '../../telemetry/heuristics/heuristics.types';
import { HEURISTICS_CONSTANTS } from '../../telemetry/heuristics/heuristics.constants';
import { HealthScoreService } from '../../health/HealthScoreService';
import type { HealthScore } from '../../health/health.types';
import { OnboardingService } from '../../onboarding/OnboardingService';
import type { OnboardingStage } from '../../onboarding/onboarding.types';
import { AppConfig } from '../../../config';
import { PushService } from '../../push/services/PushService';
import { PushOptInCard } from '../../push/components/PushOptInCard';

const ENABLE_CHARACTER = true;

export default function HomeScreen() {
    const [dueCount, setDueCount] = useState<number>(0);
    const [dueLessonIds, setDueLessonIds] = useState<QuizLessonId[]>([]);
    const [gamificationState, setGamificationState] = useState<GamificationSnapshot | null>(null);
    const [dailyGoalState, setDailyGoalState] = useState<DailyGoalSnapshot | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [alert, setAlert] = useState<HeuristicAlert | null>(null);
    const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
    const [showHealthDetails, setShowHealthDetails] = useState(false);

    // Onboarding State
    const [onboardingStage, setOnboardingStage] = useState<OnboardingStage>('graduated');
    const [showIntro, setShowIntro] = useState(false);
    const [showClosure, setShowClosure] = useState(false);
    const [showPushOptIn, setShowPushOptIn] = useState(false);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [dueLessons, snapshot, dailyGoal, score] = await Promise.all([
                SpacedRepetitionService.getDueLessons(),
                GamificationService.getSnapshot(),
                DailyGoalService.getSnapshot(),
                HealthScoreService.getScore(),
            ]);
            setDueLessonIds(dueLessons);
            setDueCount(dueLessons.length);
            setGamificationState(snapshot);
            setDailyGoalState(dailyGoal);
            setHealthScore(score);
        } catch (error) {
            console.error('[HomeScreen] Error loading data:', error);
            setDueLessonIds([]);
            setDueCount(0);
        } finally {
            setLoading(false);
        }
    }, []);

    const checkHeuristics = useCallback(async () => {
        const todayAlert = await HeuristicsService.evaluateToday();

        if (HEURISTICS_CONSTANTS.SHADOW_MODE) {
            console.log('[Heuristics] Shadow Mode: Alert evaluated but supressed.', todayAlert?.id);
            return;
        }

        const shown = await HeuristicsService.wasShownToday();
        if (!shown && todayAlert && todayAlert.suggestedAction !== 'none') {
            setAlert(todayAlert);
            HeuristicsService.markShownToday();
        }
    }, []);

    const checkPushOptIn = useCallback(async () => {
        const canShow = await PushService.getOptIn();
        if (canShow === null) {
            setShowPushOptIn(true);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            void loadData();
            void PushService.scheduleDailyIfEligible({ reason: 'home_focus' });
        }, [loadData])
    );

    const handleStartReview = useCallback(() => {
        if (dueLessonIds.length === 0) {
            return;
        }

        router.push('/review' as any);
    }, [dueLessonIds.length]);

    const handleContinueLearning = useCallback(() => {
        router.push('/quiz' as any);
    }, []);

    const { animateIn: animateGoalBanner, style: goalBannerStyle } = useFadeInUp();
    const { animateIn: animateReviewCard, animatedStyle: reviewCardAnimatedStyle } = useCardEnter();

    useEffect(() => {
        TelemetryService.track('app_open');
        TelemetryService.markDayOpen();

        void OnboardingService.init().then(() => {
            setOnboardingStage(OnboardingService.getStage());
            setShowIntro(OnboardingService.shouldShowIntro());
            setShowClosure(OnboardingService.shouldShowClosure());
        });

        void loadData();
        PushService.onAppOpen(); // Reset backoff on valuable engagement
        void checkHeuristics();
        animateReviewCard();
    }, [animateReviewCard, checkHeuristics, loadData]);

    const handleDismissIntro = useCallback(async () => {
        await OnboardingService.dismissIntro();
        setShowIntro(false);
        setOnboardingStage(OnboardingService.getStage());
    }, []);

    const handleDismissClosure = useCallback(async () => {
        await OnboardingService.complete();
        setShowClosure(false);
    }, []);

    useEffect(() => {
        if (dailyGoalState?.isCompleted) {
            animateGoalBanner();
            void checkPushOptIn();
        }
    }, [animateGoalBanner, checkPushOptIn, dailyGoalState?.isCompleted]);

    const homeStatusLabel = dueCount > 0 ? `${dueCount} revisão${dueCount === 1 ? '' : 'ões'} pronta${dueCount === 1 ? '' : 's'}` : 'Sem revisões pendentes';

    return (
        <SafeAreaView style={styles.screen}>
            <HomeHeader statusLabel={homeStatusLabel} />

            {loading ? (
                <View style={[layout.center, { flex: 1 }]}>
                    <ActivityIndicator size="large" color={galaxyColors.ctaGradientEnd} />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    contentInsetAdjustmentBehavior="always"
                >
                    {showIntro && (
                        <Animated.View style={reviewCardAnimatedStyle}>
                            <IntroCard
                                onStart={handleContinueLearning}
                                onSkip={handleDismissIntro}
                            />
                        </Animated.View>
                    )}

                    {showClosure && (
                        <ClosureCard onDismiss={handleDismissClosure} />
                    )}

                    <StatsSection
                        gamificationState={gamificationState}
                        dailyGoalState={dailyGoalState}
                    />

                    {dailyGoalState?.isCompleted && (
                        <Animated.View style={goalBannerStyle}>
                            <View style={styles.goalCompletedBanner}>
                                <Text style={styles.goalCompletedText}>🎯 Meta do dia concluída</Text>
                            </View>
                        </Animated.View>
                    )}

                    {showPushOptIn && (
                        <View style={styles.sectionBlock}>
                            <PushOptInCard onDismiss={() => setShowPushOptIn(false)} />
                        </View>
                    )}

                    <HealthSection
                        healthScore={healthScore}
                        showHealthDetails={showHealthDetails}
                        onToggleDetails={() => setShowHealthDetails((current) => !current)}
                    />

                    {alert && (
                        <AlertBanner alert={alert} />
                    )}

                    <Animated.View style={reviewCardAnimatedStyle}>
                        <ReviewSection
                            dueCount={dueCount}
                            onboardingStage={onboardingStage}
                            onStartReview={handleStartReview}
                        />
                    </Animated.View>

                    <AppButton
                        onPress={handleContinueLearning}
                        variant="ghost"
                        style={styles.secondaryButton}
                        textStyle={{ color: galaxyColors.textSecondary }}
                    >
                        Continuar aprendendo
                    </AppButton>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

type HomeHeaderProps = {
    statusLabel: string;
};

function HomeHeader({ statusLabel }: HomeHeaderProps) {
    return (
        <View style={styles.header}>
            <View style={styles.headerCopy}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>Radiant</Text>
                    {AppConfig.IS_BETA ? (
                        <View style={styles.betaBadge}>
                            <Text style={styles.betaText}>BETA</Text>
                        </View>
                    ) : null}
                </View>
                <Text style={styles.headerStatus}>{statusLabel}</Text>
            </View>

            <CharacterSlot
                state="idle"
                size="sm"
                visible={ENABLE_CHARACTER}
                align="left"
                tier="starter"
                text="Cada detalhe conta."
            />
        </View>
    );
}

type IntroCardProps = {
    onStart: () => void;
    onSkip: () => void;
};

function IntroCard({ onStart, onSkip }: IntroCardProps) {
    return (
        <View style={styles.introCard}>
            <Text style={styles.introTitle}>Bem-vindo ao Radiant</Text>
            <Text style={styles.introBody}>
                Aprenda radiologia com revisões inteligentes e progresso real.
            </Text>
            <AppButton onPress={onStart} style={styles.button}>
                Começar
            </AppButton>
            <AppButton
                onPress={onSkip}
                variant="ghost"
                style={styles.secondaryButton}
                textStyle={{ color: galaxyColors.textSecondary }}
            >
                Pular introdução
            </AppButton>
        </View>
    );
}

type ClosureCardProps = {
    onDismiss: () => void;
};

function ClosureCard({ onDismiss }: ClosureCardProps) {
    return (
        <View style={styles.closureCard}>
            <Text style={styles.closureTitle}>Sua jornada começou 🚀</Text>
            <Text style={styles.closureBody}>
                Agora o Radiant se adapta ao seu ritmo. Continue revisando para manter suas chamas acesas.
            </Text>
            <AppButton onPress={onDismiss} style={styles.button}>
                Entendi
            </AppButton>
        </View>
    );
}

type StatsSectionProps = {
    gamificationState: GamificationSnapshot | null;
    dailyGoalState: DailyGoalSnapshot | null;
};

function StatsSection({ gamificationState, dailyGoalState }: StatsSectionProps) {
    if (!gamificationState && !dailyGoalState) {
        return null;
    }

    return (
        <View style={styles.statsRow}>
            {gamificationState ? (
                <>
                    <View style={styles.statPill}>
                        <Text style={styles.statPillLabel}>XP</Text>
                        <Text style={styles.statPillValue}>{gamificationState.totalXp}</Text>
                    </View>
                    <View style={styles.statPill}>
                        <Text style={styles.statPillLabel}>Sequência</Text>
                        <Text style={styles.statPillValue}>{gamificationState.streakDays}d</Text>
                    </View>
                </>
            ) : null}
            {dailyGoalState ? (
                <View style={styles.statPill}>
                    <Text style={styles.statPillLabel}>Meta</Text>
                    <Text style={styles.statPillValue}>{dailyGoalState.completedToday}/{dailyGoalState.goalPerDay}</Text>
                </View>
            ) : null}
        </View>
    );
}

type HealthSectionProps = {
    healthScore: HealthScore | null;
    showHealthDetails: boolean;
    onToggleDetails: () => void;
};

function HealthSection({ healthScore, showHealthDetails, onToggleDetails }: HealthSectionProps) {
    if (!healthScore) {
        return (
            <View style={styles.healthCard}>
                <Text style={styles.healthTitle}>Ritmo</Text>
                <Text style={styles.healthPlaceholder}>
                    Use o Radiant por mais alguns dias para calcular seu ritmo.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.healthCard}>
            <View style={styles.healthHeader}>
                <Text style={styles.healthTitle}>Ritmo</Text>
                <View style={[styles.healthBadge, getHealthBadgeStyle(healthScore.label)]}>
                    <Text style={styles.healthBadgeText}>{getHealthLabelText(healthScore.label)}</Text>
                </View>
            </View>

            <View style={styles.healthMain}>
                <Text style={styles.healthScoreBig}>{healthScore.score}</Text>
                <Text style={styles.healthMicrocopy}>{healthScore.microcopy}</Text>
            </View>

            <AppButton
                onPress={onToggleDetails}
                variant="ghost"
                style={styles.healthDetailsBtn}
                textStyle={styles.healthDetailsButtonText}
            >
                {showHealthDetails ? 'Ocultar detalhes' : 'Ver detalhes'}
            </AppButton>

            {showHealthDetails ? (
                <View style={styles.healthDetails}>
                    {renderHealthRow('Consistência', healthScore.components.consistency, 35)}
                    {renderHealthRow('Revisão', healthScore.components.reviewStickiness, 35)}
                    {renderHealthRow('Equilíbrio', healthScore.components.balance, 20)}
                    {renderHealthRow('Meta', healthScore.components.goalConsistency, 10)}
                    {healthScore.components.penalty > 0 ? (
                        <View style={styles.healthRow}>
                            <Text style={[styles.healthRowLabel, styles.healthPenaltyText]}>Penalidade</Text>
                            <Text style={[styles.healthRowValue, styles.healthPenaltyText]}>
                                -{healthScore.components.penalty}
                            </Text>
                        </View>
                    ) : null}
                </View>
            ) : null}
        </View>
    );
}

type AlertBannerProps = {
    alert: HeuristicAlert;
};

function AlertBanner({ alert }: AlertBannerProps) {
    const isCritical = alert.level === 'critical';

    return (
        <View
            style={[
                styles.alertCard,
                isCritical ? styles.alertCardCritical : styles.alertCardInformational,
            ]}
        >
            <Text style={styles.alertTitle}>
                {alert.mascotState.toUpperCase()}: {alert.message}
            </Text>
        </View>
    );
}

type ReviewSectionProps = {
    dueCount: number;
    onboardingStage: OnboardingStage;
    onStartReview: () => void;
};

function ReviewSection({ dueCount, onboardingStage, onStartReview }: ReviewSectionProps) {
    return (
        <View style={styles.reviewCard}>
            <Text style={styles.reviewLabel}>Revisões pendentes</Text>
            <Text style={styles.reviewCount}>{dueCount}</Text>

            {onboardingStage === 'review_guided' && dueCount > 0 ? (
                <Text style={styles.inlineHelper}>Revisões rápidas mantêm o conhecimento vivo.</Text>
            ) : null}

            <AppButton
                onPress={onStartReview}
                disabled={dueCount === 0}
                style={styles.button}
            >
                Iniciar revisão
            </AppButton>
        </View>
    );
}

function getHealthBadgeStyle(label: string) {
    switch (label) {
        case 'excellent': return { backgroundColor: 'rgba(52, 199, 89, 0.2)' };
        case 'strong': return { backgroundColor: 'rgba(48, 96, 255, 0.2)' };
        case 'consistent': return { backgroundColor: 'rgba(255, 159, 10, 0.2)' };
        default: return { backgroundColor: 'rgba(255,255,255,0.07)' };
    }
}

function getHealthLabelText(label: string) {
    const map: Record<string, string> = {
        'excellent': 'Excelente',
        'strong': 'Forte',
        'consistent': 'Consistente',
        'adjusting': 'Em ajuste'
    };
    return map[label] || label;
}

function renderHealthRow(label: string, value: number, max: number) {
    return (
        <View style={styles.healthRow}>
            <Text style={styles.healthRowLabel}>{label}</Text>
            <Text style={styles.healthRowValue}>{value}/{max}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        ...layout.screen,
        backgroundColor: galaxyColors.background,
        padding: space.none,
    },
    header: {
        paddingHorizontal: space.s4,
        paddingVertical: space.s5,
        borderBottomWidth: 1,
        borderBottomColor: galaxyColors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: space.s3,
    },
    headerCopy: {
        flex: 1,
    },
    introCard: {
        backgroundColor: galaxyColors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: galaxyColors.ctaGradientEnd,
        padding: space.s5,
        alignItems: 'center',
        gap: space.s3,
    },
    introTitle: {
        ...typography.h2,
        color: galaxyColors.textPrimary,
        textAlign: 'center',
    },
    introBody: {
        ...typography.body,
        color: galaxyColors.textSecondary,
        textAlign: 'center',
    },
    closureCard: {
        backgroundColor: 'rgba(52, 199, 89, 0.08)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#34C759',
        padding: space.s5,
        gap: space.s3,
    },
    closureTitle: {
        ...typography.h2,
        color: '#34C759',
    },
    closureBody: {
        ...typography.body,
        color: galaxyColors.textPrimary,
    },
    inlineHelper: {
        ...typography.caption,
        color: galaxyColors.ctaGradientEnd,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    title: {
        ...typography.h1,
        color: galaxyColors.textPrimary,
    },
    headerStatus: {
        ...typography.caption,
        color: galaxyColors.textSecondary,
        marginTop: space.s1,
    },
    content: {
        padding: space.s4,
        gap: space.s5,
        paddingBottom: space.s6,
    },
    statsRow: {
        ...layout.row,
        gap: space.s2,
    },
    statPill: {
        flex: 1,
        backgroundColor: galaxyColors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: galaxyColors.border,
        paddingVertical: space.s2,
        paddingHorizontal: space.s3,
        alignItems: 'center',
        gap: 2,
    },
    statPillLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: galaxyColors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statPillValue: {
        fontSize: 16,
        fontWeight: '700',
        color: galaxyColors.textPrimary,
    },
    goalCompletedBanner: {
        backgroundColor: galaxyColors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: galaxyColors.border,
        padding: space.s3,
        alignItems: 'center',
    },
    goalCompletedText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#34C759',
    },
    reviewCard: {
        backgroundColor: galaxyColors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: galaxyColors.border,
        padding: space.s4,
        alignItems: 'center',
        gap: space.s2,
    },
    reviewLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: galaxyColors.textSecondary,
    },
    reviewCount: {
        fontSize: 64,
        fontWeight: '700',
        color: galaxyColors.ctaGradientEnd,
    },
    button: {
        width: '100%',
    },
    secondaryButton: {
        width: '100%',
    },
    healthCard: {
        backgroundColor: galaxyColors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: galaxyColors.border,
        padding: space.s4,
        gap: space.s3,
    },
    healthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    healthTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: galaxyColors.textPrimary,
    },
    healthBadge: {
        paddingHorizontal: space.s2,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.07)',
    },
    healthBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: galaxyColors.textPrimary,
    },
    healthMain: {
        gap: space.s1,
    },
    healthScoreBig: {
        fontSize: 48,
        fontWeight: '800',
        color: galaxyColors.textPrimary,
        letterSpacing: -1,
    },
    healthMicrocopy: {
        fontSize: 14,
        color: galaxyColors.textSecondary,
        lineHeight: 20,
    },
    healthDetailsBtn: {
        borderWidth: 1,
        borderColor: galaxyColors.border,
        height: 36,
    },
    healthDetailsButtonText: {
        fontSize: 13,
        color: galaxyColors.textSecondary,
    },
    healthDetails: {
        marginTop: space.s2,
        paddingTop: space.s3,
        borderTopWidth: 1,
        borderTopColor: galaxyColors.border,
        gap: space.s1,
    },
    healthRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    healthRowLabel: {
        fontSize: 13,
        color: galaxyColors.textSecondary,
    },
    healthRowValue: {
        fontSize: 13,
        fontWeight: '600',
        color: galaxyColors.textPrimary,
    },
    healthPenaltyText: {
        color: '#FF453A',
    },
    healthPlaceholder: {
        fontSize: 14,
        color: galaxyColors.textSecondary,
        fontStyle: 'italic',
        marginTop: space.s2,
    },

    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    betaBadge: {
        backgroundColor: 'rgba(255, 159, 10, 0.2)',
        paddingHorizontal: space.s1,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: space.s3,
    },
    betaText: {
        color: '#FF9F0A',
        fontSize: 10,
        fontWeight: '700',
    },
    sectionBlock: {
        marginBottom: space.none,
    },
    alertCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: space.s3,
    },
    alertCardCritical: {
        backgroundColor: 'rgba(255, 69, 58, 0.1)',
        borderColor: '#FF453A',
    },
    alertCardInformational: {
        backgroundColor: 'rgba(48, 96, 255, 0.1)',
        borderColor: galaxyColors.ctaGradientEnd,
    },
    alertTitle: {
        ...typography.body,
        color: galaxyColors.textPrimary,
        fontWeight: '700',
    },
});
