// src/features/home/screens/HomeScreen.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { GamificationService } from '../../gamification/services/GamificationService';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import { AppButton } from '../../../components/ui/AppButton';
import { StatPill } from '../../../components/ui/StatPill';
import { ProgressRing } from '../../../components/ui/ProgressRing';
import { PixelIllustration } from '../../../ui/characters/PixelIllustration';
import type { QuizLessonId } from '../../../types/quiz';
import type { GamificationSnapshot } from '../../../types/gamification';
import type { DailyGoalSnapshot } from '../../../types/dailyGoal';
import { space, layout, textStyles, fontFamily } from '../../../ui/styles';
import { colors } from '../../../ui/theme';
import { useFadeInUp, useCardEnter } from '../../../ui/motion';
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

// ── Inline SVG Icons ────────────────────────────────────────────────────────

const FlameIcon = () => (
    <Svg width={14} height={14} viewBox="0 0 24 24">
        <Path d="M12 2C12 2 9 8 9 12c0 1.66 1.34 3 3 3s3-1.34 3-3c0-1-1-3-1-4 0 0 4 2 4 7 0 3.31-2.69 6-6 6S6 18.31 6 15c0-5.5 4-9 6-13z" fill="#FF6B2C" />
    </Svg>
);

const BoltIcon = () => (
    <Svg width={14} height={14} viewBox="0 0 24 24">
        <Path d="M13 2L4.5 13.5H11L10 22l9.5-12H14L13 2z" fill="#F5A623" />
    </Svg>
);

const HeartIcon = () => (
    <Svg width={14} height={14} viewBox="0 0 24 24">
        <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FF3B30" />
    </Svg>
);

const ArrowRightIcon = () => (
    <Svg width={14} height={14} viewBox="0 0 24 24">
        <Path d="M3 7h8m0 0L7 3m4 4l-4 4" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// ── Main Screen ─────────────────────────────────────────────────────────────

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

    const progressValue = dailyGoalState
        ? dailyGoalState.completedToday / Math.max(1, dailyGoalState.goalPerDay)
        : 0.55;

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.headerDate}>
                                {AppConfig.IS_BETA ? 'BETA · ' : ''}TUESDAY · DAY 24
                            </Text>
                            <Text style={styles.headerGreeting}>Hi, Dr. Alvarez</Text>
                        </View>
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarInitials}>MA</Text>
                        </View>
                    </View>

                    {/* Stat Pills Row */}
                    <View style={styles.pillsRow}>
                        <StatPill
                            icon={<FlameIcon />}
                            value={`${gamificationState?.streakDays ?? 0}`}
                            color="#FF6B2C"
                        />
                        <StatPill
                            icon={<BoltIcon />}
                            value={`${gamificationState?.totalXp ?? 0} XP`}
                            color="#F5A623"
                        />
                        <StatPill
                            icon={<HeartIcon />}
                            value="5"
                            color="#FF3B30"
                        />
                    </View>

                    {/* Hero Card */}
                    <LinearGradient
                        colors={['#2155FF', '#3D6BFF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.heroCard}
                    >
                        <View style={styles.heroContent}>
                            <View style={{ flex: 1, gap: 10 }}>
                                <Text style={styles.heroMicro}>MISSÃO DE HOJE</Text>
                                {/* TODO: Conectar à lição do dia resolvida pelo catálogo. */}
                                <Text style={styles.heroTitle}>
                                    Pulmonary nodules{'\n'}on chest CT
                                </Text>
                                <View style={styles.heroTags}>
                                    <View style={styles.heroTag}><Text style={styles.heroTagText}>8 cases</Text></View>
                                    <View style={styles.heroTag}><Text style={styles.heroTagText}>~12 min</Text></View>
                                    <View style={styles.heroTag}><Text style={styles.heroTagText}>+120 XP</Text></View>
                                </View>
                            </View>
                            <View style={styles.heroIllustration}>
                                <PixelIllustration state="happy" size="sm" />
                            </View>
                        </View>
                        <AppButton
                            label="Start lesson"
                            variant="primary"
                            onPress={handleContinueLearning}
                            style={styles.heroButton}
                            textStyle={{ color: colors.primary }}
                        />
                    </LinearGradient>

                    {/* Journey Card */}
                    {AppConfig.ENABLE_LEARNING_ROAD && (
                        <View style={styles.journeyCard}>
                            <ProgressRing
                                size={64}
                                value={progressValue}
                                stroke={6}
                                color={colors.primary}
                                trackColor="#EAF2FF"
                            >
                                <Text style={styles.progressRingLabel}>
                                    {Math.round(progressValue * 100)}%
                                </Text>
                            </ProgressRing>

                            <View style={styles.journeyInfo}>
                                <Text style={styles.journeyMicro}>CONTINUE CHAPTER</Text>
                                {/* TODO: Wire to real chapter progress from LearningRoadService */}
                                <Text style={styles.journeyTitle}>Thoracic Imaging</Text>
                                <Text style={styles.journeyBody}>11 of 20 lessons</Text>
                            </View>

                            <Pressable style={styles.arrowButton} onPress={handleContinueLearning}>
                                <ArrowRightIcon />
                            </Pressable>
                        </View>
                    )}

                    {/* Stats Trio */}
                    <View style={styles.statsTrio}>
                        {/* TODO: Wire mastered count and accuracy to GamificationService / StatsService */}
                        <View style={styles.statsTrioCard}>
                            <Text style={styles.statsTrioMicro}>MASTERED</Text>
                            <Text style={styles.statsTrioValue}>{23}</Text>
                            <Text style={styles.statsTrioSub}>cases</Text>
                        </View>
                        <View style={styles.statsTrioCard}>
                            <Text style={styles.statsTrioMicro}>ACCURACY</Text>
                            <Text style={styles.statsTrioValue}>84%</Text>
                            <Text style={styles.statsTrioSub}>avg score</Text>
                        </View>
                        <View style={styles.statsTrioCard}>
                            <Text style={styles.statsTrioMicro}>SESSIONS</Text>
                            <Text style={styles.statsTrioValue}>{gamificationState?.streakDays ?? 0}</Text>
                            <Text style={styles.statsTrioSub}>day streak</Text>
                        </View>
                    </View>

                    {/* Onboarding: Intro */}
                    {showIntro && (
                        <Animated.View style={reviewCardAnimatedStyle}>
                            <IntroCard
                                onStart={handleContinueLearning}
                                onSkip={handleDismissIntro}
                            />
                        </Animated.View>
                    )}

                    {/* Onboarding: Closure */}
                    {showClosure && (
                        <ClosureCard onDismiss={handleDismissClosure} />
                    )}

                    {/* Health Section */}
                    <HealthSection
                        healthScore={healthScore}
                        showHealthDetails={showHealthDetails}
                        onToggleDetails={() => setShowHealthDetails((current) => !current)}
                    />

                    {/* Heuristic Alert */}
                    {alert && (
                        <AlertBanner alert={alert} />
                    )}

                    {/* Goal Completed Banner */}
                    {dailyGoalState?.isCompleted && (
                        <Animated.View style={goalBannerStyle}>
                            <View style={styles.goalCompletedBanner}>
                                <Text style={styles.goalCompletedText}>🎯 Meta do dia concluída</Text>
                            </View>
                        </Animated.View>
                    )}

                    {/* Push Opt-In */}
                    {showPushOptIn && (
                        <View>
                            <PushOptInCard onDismiss={() => setShowPushOptIn(false)} />
                        </View>
                    )}

                    {/* Review Section */}
                    <Animated.View style={reviewCardAnimatedStyle}>
                        <ReviewSection
                            dueCount={dueCount}
                            onboardingStage={onboardingStage}
                            onStartReview={handleStartReview}
                        />
                    </Animated.View>

                    {/* Ghost CTA */}
                    <AppButton
                        onPress={handleContinueLearning}
                        variant="ghost"
                        label="Continuar aprendendo"
                        style={styles.ghostButton}
                        textStyle={{ color: colors.textSecondary }}
                    />
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

// ── Sub-components ───────────────────────────────────────────────────────────

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
            <AppButton label="Começar" onPress={onStart} style={styles.fullWidthBtn} />
            <AppButton
                label="Pular introdução"
                onPress={onSkip}
                variant="ghost"
                style={styles.fullWidthBtn}
                textStyle={{ color: colors.textSecondary }}
            />
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
            <AppButton label="Entendi" onPress={onDismiss} style={styles.fullWidthBtn} />
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
                label={showHealthDetails ? 'Ocultar detalhes' : 'Ver detalhes'}
                onPress={onToggleDetails}
                variant="ghost"
                style={styles.healthDetailsBtn}
                textStyle={styles.healthDetailsButtonText}
            />

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
                label="Iniciar revisão"
                onPress={onStartReview}
                disabled={dueCount === 0}
                style={styles.fullWidthBtn}
            />
        </View>
    );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getHealthBadgeStyle(label: string) {
    switch (label) {
        case 'excellent': return { backgroundColor: 'rgba(52, 199, 89, 0.15)' };
        case 'strong': return { backgroundColor: 'rgba(33, 85, 255, 0.12)' };
        case 'consistent': return { backgroundColor: 'rgba(255, 159, 10, 0.15)' };
        default: return { backgroundColor: colors.border };
    }
}

function getHealthLabelText(label: string) {
    const map: Record<string, string> = {
        'excellent': 'Excelente',
        'strong': 'Forte',
        'consistent': 'Consistente',
        'adjusting': 'Em ajuste'
    };
    return map[label] ?? label;
}

function renderHealthRow(label: string, value: number, max: number) {
    return (
        <View key={label} style={styles.healthRow}>
            <Text style={styles.healthRowLabel}>{label}</Text>
            <Text style={styles.healthRowValue}>{value}/{max}</Text>
        </View>
    );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    // Screen
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: space.s3,
        paddingVertical: space.s2,
    },
    headerLeft: {
        gap: 2,
    },
    headerDate: {
        ...textStyles.micro,
        color: colors.textTertiary,
    },
    headerGreeting: {
        ...textStyles.h2,
        color: colors.textPrimary,
    },
    avatarCircle: {
        width: 40,
        height: 40,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitials: {
        fontFamily: fontFamily.soraBold,
        fontSize: 13,
        color: colors.primary,
        letterSpacing: 0.5,
    },

    // Scroll content
    content: {
        paddingHorizontal: space.s3,
        paddingTop: space.s1,
        paddingBottom: space.s6,
        gap: 12,
    },

    // Stat Pills Row
    pillsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 4,
    },

    // Hero Card
    heroCard: {
        borderRadius: 24,
        padding: 20,
        gap: 16,
    },
    heroContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    heroMicro: {
        fontFamily: fontFamily.soraBold,
        fontSize: 11,
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.85)',
    },
    heroTitle: {
        ...textStyles.h2,
        color: '#ffffff',
    },
    heroTags: {
        flexDirection: 'row',
        gap: 6,
        flexWrap: 'wrap',
    },
    heroTag: {
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.18)',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    heroTagText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#ffffff',
    },
    heroIllustration: {
        marginTop: -8,
        marginRight: -10,
    },
    heroButton: {
        backgroundColor: '#ffffff',
        shadowColor: 'transparent',
        elevation: 0,
    },

    // Journey Card
    journeyCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    progressRingLabel: {
        fontSize: 14,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    journeyInfo: {
        flex: 1,
        gap: 2,
    },
    journeyMicro: {
        ...textStyles.micro,
        color: colors.textTertiary,
    },
    journeyTitle: {
        ...textStyles.h3,
        color: colors.textPrimary,
    },
    journeyBody: {
        ...textStyles.body,
        color: colors.textSecondary,
    },
    arrowButton: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Stats Trio
    statsTrio: {
        flexDirection: 'row',
        gap: 8,
    },
    statsTrioCard: {
        flex: 1,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 12,
        gap: 2,
    },
    statsTrioMicro: {
        ...textStyles.micro,
        color: colors.textTertiary,
    },
    statsTrioValue: {
        ...textStyles.h2,
        color: colors.textPrimary,
    },
    statsTrioSub: {
        ...textStyles.caption,
        color: colors.textSecondary,
    },

    // Intro Card
    introCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.primary,
        padding: space.s4,
        alignItems: 'center',
        gap: space.s2,
    },
    introTitle: {
        ...textStyles.h3,
        color: colors.textPrimary,
        textAlign: 'center',
    },
    introBody: {
        ...textStyles.body,
        color: colors.textSecondary,
        textAlign: 'center',
    },

    // Closure Card
    closureCard: {
        backgroundColor: 'rgba(52, 199, 89, 0.06)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#34C759',
        padding: space.s4,
        gap: space.s2,
    },
    closureTitle: {
        ...textStyles.h3,
        color: '#1A7A3A',
    },
    closureBody: {
        ...textStyles.body,
        color: colors.textPrimary,
    },

    // Goal Completed Banner
    goalCompletedBanner: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        padding: space.s2,
        alignItems: 'center',
    },
    goalCompletedText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A7A3A',
    },

    // Health Card
    healthCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: space.s3,
        gap: space.s2,
    },
    healthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    healthTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    healthBadge: {
        paddingHorizontal: space.s1,
        paddingVertical: 2,
        borderRadius: 6,
    },
    healthBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    healthMain: {
        gap: 4,
    },
    healthScoreBig: {
        fontSize: 48,
        fontWeight: '800',
        color: colors.textPrimary,
        letterSpacing: -1,
    },
    healthMicrocopy: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    healthDetailsBtn: {
        borderWidth: 1,
        borderColor: colors.border,
        height: 36,
    },
    healthDetailsButtonText: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    healthDetails: {
        marginTop: space.s1,
        paddingTop: space.s2,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        gap: 4,
    },
    healthRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    healthRowLabel: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    healthRowValue: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    healthPenaltyText: {
        color: '#D8506F',
    },
    healthPlaceholder: {
        fontSize: 14,
        color: colors.textSecondary,
        fontStyle: 'italic',
        marginTop: space.s1,
    },

    // Alert Banner
    alertCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: space.s2,
    },
    alertCardCritical: {
        backgroundColor: 'rgba(216, 80, 111, 0.08)',
        borderColor: '#D8506F',
    },
    alertCardInformational: {
        backgroundColor: 'rgba(33, 85, 255, 0.07)',
        borderColor: colors.primary,
    },
    alertTitle: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '600',
        color: colors.textPrimary,
    },

    // Review Card
    reviewCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: space.s3,
        alignItems: 'center',
        gap: space.s1,
    },
    reviewLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.textSecondary,
    },
    reviewCount: {
        fontSize: 64,
        fontWeight: '700',
        color: colors.primary,
    },
    inlineHelper: {
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '600',
        color: colors.primary,
        textAlign: 'center',
        fontStyle: 'italic',
    },

    // Buttons
    fullWidthBtn: {
        width: '100%',
    },
    ghostButton: {
        width: '100%',
    },
});
