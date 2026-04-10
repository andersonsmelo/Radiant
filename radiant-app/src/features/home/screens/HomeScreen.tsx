// src/features/home/screens/HomeScreen.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { GamificationService } from '../../gamification/services/GamificationService';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import { Card } from '../../../components/ui/Card';
import { PrimaryButton } from '../../../components/ui/PrimaryButton';
import { StatPill } from '../../../components/ui/StatPill';
import type { QuizLessonId } from '../../../types/quiz';
import type { GamificationSnapshot } from '../../../types/gamification';
import type { DailyGoalSnapshot } from '../../../types/dailyGoal';
import { space, typography, layout } from '../../../ui/styles';
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

const COLORS = {
    background: '#000000',
    cardBackground: '#1C1C1E',
    secondaryBackground: '#2C2C2E',
    primaryText: '#FFFFFF',
    secondaryText: '#8E8E93',
    primary: '#0A84FF',
    success: '#34C759',
    error: '#FF453A',
    warning: '#FF9F0A',
};

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
                    <ActivityIndicator size="large" color={COLORS.primary} />
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
                            <Card variant="compact" style={styles.goalCompletedBanner}>
                                <Text style={styles.goalCompletedText}>🎯 Meta do dia concluída</Text>
                            </Card>
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

                    <PrimaryButton onPress={handleContinueLearning} style={styles.secondaryButton}>
                        Continuar aprendendo
                    </PrimaryButton>
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
        <Card style={styles.introCard}>
            <Text style={styles.introTitle}>Bem-vindo ao Radiant</Text>
            <Text style={styles.introBody}>
                Aprenda radiologia com revisões inteligentes e progresso real.
            </Text>
            <PrimaryButton onPress={onStart} style={styles.button}>
                Começar
            </PrimaryButton>
            <PrimaryButton onPress={onSkip} style={styles.secondaryButton} textStyle={styles.secondaryButtonText}>
                Pular introdução
            </PrimaryButton>
        </Card>
    );
}

type ClosureCardProps = {
    onDismiss: () => void;
};

function ClosureCard({ onDismiss }: ClosureCardProps) {
    return (
        <Card style={styles.closureCard}>
            <Text style={styles.closureTitle}>Sua jornada começou 🚀</Text>
            <Text style={styles.closureBody}>
                Agora o Radiant se adapta ao seu ritmo. Continue revisando para manter suas chamas acesas.
            </Text>
            <PrimaryButton onPress={onDismiss} style={styles.button}>
                Entendi
            </PrimaryButton>
        </Card>
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
                    <StatPill label="XP" value={gamificationState.totalXp} style={styles.statPill} />
                    <StatPill label="Sequência" value={`${gamificationState.streakDays}d`} style={styles.statPill} />
                </>
            ) : null}
            {dailyGoalState ? (
                <StatPill
                    label="Meta"
                    value={`${dailyGoalState.completedToday}/${dailyGoalState.goalPerDay}`}
                    style={styles.statPill}
                />
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
            <Card style={styles.healthCard}>
                <Text style={styles.healthTitle}>Ritmo</Text>
                <Text style={styles.healthPlaceholder}>
                    Use o Radiant por mais alguns dias para calcular seu ritmo.
                </Text>
            </Card>
        );
    }

    return (
        <Card style={styles.healthCard}>
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

            <PrimaryButton
                onPress={onToggleDetails}
                style={styles.healthDetailsBtn}
                textStyle={styles.healthDetailsButtonText}
            >
                {showHealthDetails ? 'Ocultar detalhes' : 'Ver detalhes'}
            </PrimaryButton>

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
        </Card>
    );
}

type AlertBannerProps = {
    alert: HeuristicAlert;
};

function AlertBanner({ alert }: AlertBannerProps) {
    const isCritical = alert.level === 'critical';

    return (
        <Card
            style={[
                styles.alertCard,
                isCritical ? styles.alertCardCritical : styles.alertCardInformational,
            ]}
        >
            <Text style={styles.alertTitle}>
                {alert.mascotState.toUpperCase()}: {alert.message}
            </Text>
        </Card>
    );
}

type ReviewSectionProps = {
    dueCount: number;
    onboardingStage: OnboardingStage;
    onStartReview: () => void;
};

function ReviewSection({ dueCount, onboardingStage, onStartReview }: ReviewSectionProps) {
    return (
        <Card style={styles.reviewCard}>
            <Text style={styles.reviewLabel}>Revisões pendentes</Text>
            <Text style={styles.reviewCount}>{dueCount}</Text>

            {onboardingStage === 'review_guided' && dueCount > 0 ? (
                <Text style={styles.inlineHelper}>Revisões rápidas mantêm o conhecimento vivo.</Text>
            ) : null}

            <PrimaryButton
                onPress={onStartReview}
                disabled={dueCount === 0}
                style={styles.button}
            >
                Iniciar revisão
            </PrimaryButton>
        </Card>
    );
}

function getHealthBadgeStyle(label: string) {
    switch (label) {
        case 'excellent': return { backgroundColor: 'rgba(52, 199, 89, 0.2)' }; // Success
        case 'strong': return { backgroundColor: 'rgba(10, 132, 255, 0.2)' };   // Primary
        case 'consistent': return { backgroundColor: 'rgba(255, 159, 10, 0.2)' }; // Warning
        default: return { backgroundColor: COLORS.secondaryBackground };
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
        backgroundColor: COLORS.background,
        padding: space.none,
    },
    header: {
        paddingHorizontal: space.s4,
        paddingVertical: space.s5,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.secondaryBackground,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: space.s3,
    },
    headerCopy: {
        flex: 1,
    },
    introCard: {
        padding: space.s5,
        alignItems: 'center',
        backgroundColor: COLORS.cardBackground,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    introTitle: {
        ...typography.h2,
        color: COLORS.primaryText,
        marginBottom: space.s3,
        textAlign: 'center',
    },
    introBody: {
        ...typography.body,
        color: COLORS.secondaryText,
        textAlign: 'center',
        marginBottom: space.s5,
    },
    closureCard: {
        marginBottom: space.s5,
        padding: space.s5,
        backgroundColor: 'rgba(52, 199, 89, 0.1)',
        borderWidth: 1,
        borderColor: COLORS.success,
    },
    closureTitle: {
        ...typography.h2,
        color: COLORS.success,
        marginBottom: space.s2,
    },
    closureBody: {
        ...typography.body,
        color: COLORS.primaryText,
        marginBottom: space.s4,
    },
    inlineHelper: {
        ...typography.caption,
        color: COLORS.primary,
        marginBottom: space.s4,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    title: {
        ...typography.h1,
        color: COLORS.primaryText,
    },
    headerStatus: {
        ...typography.caption,
        color: COLORS.secondaryText,
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
    },
    goalCompletedBanner: {
        alignItems: 'center',
    },
    goalCompletedText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.success,
    },
    reviewCard: {
        alignItems: 'center',
    },
    reviewLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.secondaryText,
        marginBottom: space.s2,
    },
    reviewCount: {
        fontSize: 64,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: space.s5,
    },
    button: {
        width: '100%',
    },
    secondaryButton: {
        width: '100%',
        backgroundColor: COLORS.secondaryBackground,
    },
    healthCard: {
        padding: space.s4,
    },
    healthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: space.s3,
    },
    healthTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primaryText,
    },
    healthBadge: {
        paddingHorizontal: space.s2,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: COLORS.secondaryBackground,
    },
    healthBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.primaryText,
    },
    healthMain: {
        marginBottom: space.s4,
    },
    healthScoreBig: {
        fontSize: 48,
        fontWeight: '800',
        color: COLORS.primaryText,
        letterSpacing: -1,
    },
    healthMicrocopy: {
        fontSize: 14,
        color: COLORS.secondaryText,
        lineHeight: 20,
    },
    healthDetailsBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.secondaryBackground,
        height: 36,
        marginBottom: 0,
    },
    healthDetailsButtonText: {
        fontSize: 13,
        color: COLORS.secondaryText,
    },
    healthDetails: {
        marginTop: space.s4,
        paddingTop: space.s4,
        borderTopWidth: 1,
        borderTopColor: COLORS.secondaryBackground,
    },
    healthRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: space.s1,
    },
    healthRowLabel: {
        fontSize: 13,
        color: COLORS.secondaryText,
    },
    healthRowValue: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.primaryText,
    },
    healthPenaltyText: {
        color: COLORS.error,
    },
    healthPlaceholder: {
        fontSize: 14,
        color: COLORS.secondaryText,
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
    secondaryButtonText: {
        color: COLORS.secondaryText,
    },
    alertCard: {
        borderWidth: 1,
    },
    alertCardCritical: {
        backgroundColor: 'rgba(255, 69, 58, 0.1)',
        borderColor: COLORS.error,
    },
    alertCardInformational: {
        backgroundColor: 'rgba(10, 132, 255, 0.1)',
        borderColor: COLORS.primary,
    },
    alertTitle: {
        ...typography.body,
        color: COLORS.primaryText,
        fontWeight: '700',
    },
});
