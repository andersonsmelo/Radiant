// src/features/home/screens/HomeScreen.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { AppButton } from '../../../components/ui/AppButton';
import { StatPill } from '../../../components/ui/StatPill';
import { ProgressRing } from '../../../components/ui/ProgressRing';
import { PixelIllustration } from '../../../ui/characters/PixelIllustration';
import type { HomeDashboardViewModel } from '../home.types';
import { localHomeDashboardService } from '../services/createLocalHomeDashboardService';
import { space, tabBarClearance, textStyles, fontFamily } from '../../../ui/styles';
import { semanticColors } from '../../../ui/semantic-colors';
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

const light = semanticColors.light;

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
    const [dashboard, setDashboard] = useState<HomeDashboardViewModel | null>(null);
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
            const [nextDashboard, score] = await Promise.all([
                localHomeDashboardService.getDashboard(),
                HealthScoreService.getScore(),
            ]);
            setDashboard(nextDashboard);
            setHealthScore(score);
        } catch (error) {
            console.error('[HomeScreen] Error loading data:', error);
            setDashboard(null);
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

    const handleContinueLearning = useCallback(() => {
        const action = dashboard?.mission?.action;
        if (!action) return;
        if (action.kind === 'review') router.push('/review');
        if (action.kind === 'learn' && action.nodeId && action.blockId) router.push({ pathname: '/learn', params: { nodeId: action.nodeId, blockId: action.blockId } });
    }, [dashboard?.mission?.action]);

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
        if (dashboard && dashboard.dailyGoal.completed >= dashboard.dailyGoal.target) {
            animateGoalBanner();
            void checkPushOptIn();
        }
    }, [animateGoalBanner, checkPushOptIn, dashboard]);

    const progressValue = dashboard ? dashboard.dailyGoal.completed / Math.max(1, dashboard.dailyGoal.target) : 0;

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={light.actionPrimary} />
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
                                {AppConfig.IS_BETA ? 'BETA · ' : ''}{dashboard?.dateLabel ?? '—'}
                            </Text>
                            <Text style={styles.headerGreeting}>{dashboard?.greeting ?? 'Olá'}</Text>
                        </View>
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarInitials}>{dashboard?.avatarInitials ?? '—'}</Text>
                        </View>
                    </View>

                    {/* Stat Pills Row */}
                    <View style={styles.pillsRow}>
                        <StatPill
                            icon={<FlameIcon />}
                            value={`${dashboard?.streakDays ?? 0}`}
                            color="#FF6B2C"
                        />
                        <StatPill
                            icon={<BoltIcon />}
                            value={`${dashboard?.totalXp ?? 0} XP`}
                            color="#F5A623"
                        />
                        <StatPill
                            icon={<HeartIcon />}
                            value={`${dashboard?.hearts.current ?? 0}/${dashboard?.hearts.maximum ?? 0}`}
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
                                    {dashboard?.mission?.title ?? 'Nenhuma atividade elegível agora'}
                                </Text>
                                <View style={styles.heroTags}>
                                    {dashboard?.mission?.caseCount !== null && dashboard?.mission?.caseCount !== undefined ? <View style={styles.heroTag}><Text style={styles.heroTagText}>{dashboard.mission.caseCount} casos</Text></View> : null}
                                    {dashboard?.mission?.durationMinutes !== null && dashboard?.mission?.durationMinutes !== undefined ? <View style={styles.heroTag}><Text style={styles.heroTagText}>~{dashboard.mission.durationMinutes} min</Text></View> : null}
                                    {dashboard?.mission?.xpReward !== null && dashboard?.mission?.xpReward !== undefined ? <View style={styles.heroTag}><Text style={styles.heroTagText}>+{dashboard.mission.xpReward} XP</Text></View> : null}
                                </View>
                            </View>
                            <View style={styles.heroIllustration}>
                                <PixelIllustration state="happy" size="sm" />
                            </View>
                        </View>
                        <AppButton
                            label={dashboard?.mission?.action.kind === 'review' ? 'Iniciar revisão' : 'Iniciar atividade'}
                            variant="primary"
                            onPress={handleContinueLearning}
                            disabled={!dashboard?.mission}
                            style={styles.heroButton}
                            textStyle={{ color: light.actionPrimary }}
                        />
                    </LinearGradient>

                    {/* Journey Card */}
                    {AppConfig.ENABLE_LEARNING_ROAD && (
                        <View style={styles.journeyCard}>
                            <ProgressRing
                                size={64}
                                value={progressValue}
                                stroke={6}
                                color={light.actionPrimary}
                                trackColor="#EAF2FF"
                            >
                                <Text style={styles.progressRingLabel}>
                                    {Math.round(progressValue * 100)}%
                                </Text>
                            </ProgressRing>

                            <View style={styles.journeyInfo}>
                                <Text style={styles.journeyMicro}>CONTINUE CHAPTER</Text>
                                {/* TODO: Wire to real chapter progress from LearningRoadService */}
                                <Text style={styles.journeyTitle}>{dashboard?.mission?.title ?? 'Sua jornada'}</Text>
                                <Text style={styles.journeyBody}>{dashboard ? `${dashboard.dailyGoal.completed} de ${dashboard.dailyGoal.target} atividades hoje` : 'Sem dados de progresso'}</Text>
                            </View>

                            <Pressable
                                style={styles.arrowButton}
                                onPress={handleContinueLearning}
                                accessibilityRole="button"
                                accessibilityLabel="Continuar atividade"
                                accessibilityHint="Abre a próxima atividade recomendada."
                            >
                                <ArrowRightIcon />
                            </Pressable>
                        </View>
                    )}

                    {/* Stats Trio */}
                    <View style={styles.statsTrio}>
                        {/* TODO: Wire mastered count and accuracy to GamificationService / StatsService */}
                        <View style={styles.statsTrioCard}>
                            <Text style={styles.statsTrioMicro}>MASTERED</Text>
                            <Text style={styles.statsTrioValue}>{dashboard?.masteredCases ?? '—'}</Text>
                            <Text style={styles.statsTrioSub}>cases</Text>
                        </View>
                        <View style={styles.statsTrioCard}>
                            <Text style={styles.statsTrioMicro}>ACCURACY</Text>
                            <Text style={styles.statsTrioValue}>{dashboard?.accuracyPercent === null || dashboard?.accuracyPercent === undefined ? '—' : `${dashboard.accuracyPercent}%`}</Text>
                            <Text style={styles.statsTrioSub}>avg score</Text>
                        </View>
                        <View style={styles.statsTrioCard}>
                            <Text style={styles.statsTrioMicro}>SESSIONS</Text>
                            <Text style={styles.statsTrioValue}>{dashboard?.streakDays ?? 0}</Text>
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
                    {dashboard && dashboard.dailyGoal.completed >= dashboard.dailyGoal.target && (
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
                            dueCount={dashboard?.dueReviewCount ?? 0}
                            onboardingStage={onboardingStage}
                            onStartReview={handleContinueLearning}
                        />
                    </Animated.View>

                    {/* Ghost CTA */}
                    <AppButton
                        onPress={handleContinueLearning}
                        variant="ghost"
                        label="Continuar aprendendo"
                        style={styles.ghostButton}
                        textStyle={{ color: light.textSecondary }}
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
                textStyle={{ color: light.textSecondary }}
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
        default: return { backgroundColor: light.border };
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
        backgroundColor: light.surface,
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
        color: light.textTertiary,
    },
    headerGreeting: {
        ...textStyles.h2,
        color: light.textPrimary,
    },
    avatarCircle: {
        width: 40,
        height: 40,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: light.border,
        backgroundColor: light.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitials: {
        fontFamily: fontFamily.soraBold,
        fontSize: 13,
        color: light.actionPrimary,
        letterSpacing: 0.5,
    },

    // Scroll content
    content: {
        paddingHorizontal: space.s3,
        paddingTop: space.s1,
        paddingBottom: tabBarClearance,
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
        backgroundColor: light.surfaceElevated,
        borderWidth: 1,
        borderColor: light.border,
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    progressRingLabel: {
        fontSize: 14,
        fontWeight: '800',
        color: light.textPrimary,
    },
    journeyInfo: {
        flex: 1,
        gap: 2,
    },
    journeyMicro: {
        ...textStyles.micro,
        color: light.textTertiary,
    },
    journeyTitle: {
        ...textStyles.h3,
        color: light.textPrimary,
    },
    journeyBody: {
        ...textStyles.body,
        color: light.textSecondary,
    },
    arrowButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: light.actionPrimary,
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
        backgroundColor: light.surfaceElevated,
        borderWidth: 1,
        borderColor: light.border,
        borderRadius: 16,
        padding: 12,
        gap: 2,
    },
    statsTrioMicro: {
        ...textStyles.micro,
        color: light.textTertiary,
    },
    statsTrioValue: {
        ...textStyles.h2,
        color: light.textPrimary,
    },
    statsTrioSub: {
        ...textStyles.caption,
        color: light.textSecondary,
    },

    // Intro Card
    introCard: {
        backgroundColor: light.surfaceElevated,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: light.borderFocus,
        padding: space.s4,
        alignItems: 'center',
        gap: space.s2,
    },
    introTitle: {
        ...textStyles.h3,
        color: light.textPrimary,
        textAlign: 'center',
    },
    introBody: {
        ...textStyles.body,
        color: light.textSecondary,
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
        color: light.textPrimary,
    },

    // Goal Completed Banner
    goalCompletedBanner: {
        backgroundColor: light.surfaceElevated,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: light.border,
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
        backgroundColor: light.surfaceElevated,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: light.border,
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
        color: light.textPrimary,
    },
    healthBadge: {
        paddingHorizontal: space.s1,
        paddingVertical: 2,
        borderRadius: 6,
    },
    healthBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: light.textPrimary,
    },
    healthMain: {
        gap: 4,
    },
    healthScoreBig: {
        fontSize: 48,
        fontWeight: '800',
        color: light.textPrimary,
        letterSpacing: -1,
    },
    healthMicrocopy: {
        fontSize: 14,
        color: light.textSecondary,
        lineHeight: 20,
    },
    healthDetailsBtn: {
        borderWidth: 1,
        borderColor: light.border,
        height: 36,
    },
    healthDetailsButtonText: {
        fontSize: 13,
        color: light.textSecondary,
    },
    healthDetails: {
        marginTop: space.s1,
        paddingTop: space.s2,
        borderTopWidth: 1,
        borderTopColor: light.border,
        gap: 4,
    },
    healthRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    healthRowLabel: {
        fontSize: 13,
        color: light.textSecondary,
    },
    healthRowValue: {
        fontSize: 13,
        fontWeight: '600',
        color: light.textPrimary,
    },
    healthPenaltyText: {
        color: light.statusError,
    },
    healthPlaceholder: {
        fontSize: 14,
        color: light.textSecondary,
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
        borderColor: light.statusError,
    },
    alertCardInformational: {
        backgroundColor: 'rgba(33, 85, 255, 0.07)',
        borderColor: light.borderFocus,
    },
    alertTitle: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '600',
        color: light.textPrimary,
    },

    // Review Card
    reviewCard: {
        backgroundColor: light.surfaceElevated,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: light.border,
        padding: space.s3,
        alignItems: 'center',
        gap: space.s1,
    },
    reviewLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: light.textSecondary,
    },
    reviewCount: {
        fontSize: 64,
        fontWeight: '700',
        color: light.actionPrimary,
    },
    inlineHelper: {
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '600',
        color: light.actionPrimary,
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
