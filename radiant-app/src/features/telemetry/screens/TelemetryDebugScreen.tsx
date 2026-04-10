import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TelemetryService } from '../TelemetryService';
import { PrimaryButton } from '../../../components/ui/PrimaryButton';
import { Card } from '../../../components/ui/Card';
import { space, typography, layout } from '../../../ui/styles';
import { DailyMetric } from '../telemetry.types';
import { HeuristicsService } from '../heuristics/HeuristicsService';
import type { HeuristicAlert } from '../heuristics/heuristics.types';
import { HealthScoreService } from '../../health/HealthScoreService';
import type { HealthScore } from '../../health/health.types';
import { BetaService } from '../../beta/BetaService';
import { PushService } from '../../push/services/PushService';
import { UpgradeInterestService } from '../../paywall/UpgradeInterestService';
import type { UpgradeInterestEntry } from '../../paywall/UpgradeInterestService';
import { AppStoreOpsService } from '../services/AppStoreOpsService';
import type { AppStoreOpsSummary } from '../services/AppStoreOpsService';

const COLORS = {
    background: '#000000',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    card: '#1C1C1E',
    border: '#2C2C2E',
    success: '#34C759',
    error: '#FF453A',
    warning: '#FF9F0A',
    primary: '#0A84FF',
};

interface RetentionStats {
    d1: boolean;
    d3: boolean;
    d7: boolean;
}

export default function TelemetryDebugScreen() {
    const [today, setToday] = useState<DailyMetric | null>(null);
    const [retention, setRetention] = useState<RetentionStats>({ d1: false, d3: false, d7: false });
    const [stickiness, setStickiness] = useState(0);
    const [maintenanceRatio, setMaintenanceRatio] = useState(0);
    const [alerts, setAlerts] = useState<HeuristicAlert[]>([]);
    const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
    const [exportData, setExportData] = useState<string>('');
    const [copied, setCopied] = useState(false);
    const [pushDebug, setPushDebug] = useState<any>(null);
    const [upgradeInterests, setUpgradeInterests] = useState<UpgradeInterestEntry[]>([]);
    const [appStoreOps, setAppStoreOps] = useState<AppStoreOpsSummary | null>(null);

    // Beta Feedback State
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackCategory, setFeedbackCategory] = useState<'bug' | 'confusing' | 'suggestion' | 'praise'>('bug');
    const [sendingFeedback, setSendingFeedback] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const dayStats = await TelemetryService.getDailySummary();
        const ret = await TelemetryService.getRetentionStats();
        const stick = await TelemetryService.getReviewStickiness();
        const ratio = await TelemetryService.getLearningMaintenanceRatio();

        // v1.1 Heuristics
        const todayAlert = await HeuristicsService.evaluateToday();
        // Also get history for debugging
        const history = await HeuristicsService.getHistory(7);
        const allAlerts = todayAlert ? [todayAlert, ...history.map(h => h.alert)] : history.map(h => h.alert);
        // Dedupe roughly
        const uniqueAlerts = Array.from(new Set(allAlerts.map(a => JSON.stringify(a)))).map(s => JSON.parse(s));

        // Health Score
        const score = await HealthScoreService.getScore();

        const pDebug = await PushService.getDebugState();
        const interests = await UpgradeInterestService.listInterests();
        const opsSummary = await AppStoreOpsService.getSummary();

        const json = await TelemetryService.exportEvents();

        setToday(dayStats);
        setRetention(ret);
        setStickiness(stick);
        setMaintenanceRatio(ratio);
        setAlerts(uniqueAlerts);
        setHealthScore(score);
        setPushDebug(pDebug);
        setUpgradeInterests(interests);
        setAppStoreOps(opsSummary);
        setExportData(json);
    };

    const handleCopy = () => {
        Share.share({ message: exportData })
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((error) => {
                console.error('[TelemetryDebugScreen] Failed to share telemetry export:', error);
            });
    };

    const handleClear = async () => {
        await TelemetryService.clear();
        await HeuristicsService.clear();
        await HealthScoreService.clear();
        await UpgradeInterestService.reset();
        loadData();
    };

    const handleRecalculateHealth = async () => {
        await HealthScoreService.getScore({ force: true });
        loadData();
    };

    const handleSendFeedback = async () => {
        if (!feedbackText.trim()) return;
        setSendingFeedback(true);
        await BetaService.submitFeedback(feedbackText, feedbackCategory);
        setSendingFeedback(false);
        setShowFeedback(false);
        setFeedbackText('');
        Alert.alert('Feedback enviado', 'Obrigado pelo feedback!');
    };

    const handleShareUpgradeInterests = async () => {
        if (upgradeInterests.length === 0) {
            Alert.alert('Sem interesses', 'Nenhum interesse de upgrade foi capturado ainda.');
            return;
        }

        const summary = upgradeInterests
            .map((entry) => {
                const date = new Date(entry.ts).toLocaleString();
                return [
                    `${date} • ${entry.offerTitle}`,
                    `email: ${entry.email ?? 'anonimo'}`,
                    `trigger: ${entry.trigger}`,
                    `surface: ${entry.entrySurface}`,
                    `lesson: ${entry.lessonId ?? 'n/a'}`,
                ].join('\n');
            })
            .join('\n\n');

        try {
            await Share.share({
                message: `Radiant upgrade interest\n\n${summary}`,
            });
        } catch (error) {
            console.error('[TelemetryDebugScreen] Failed to share upgrade interests:', error);
        }
    };

    const handleClearUpgradeInterests = async () => {
        await UpgradeInterestService.reset();
        setUpgradeInterests([]);
    };

    const handleShareAppStoreOpsReport = async () => {
        try {
            const report = await AppStoreOpsService.exportWarRoomReport();
            await Share.share({
                message: report,
            });
        } catch (error) {
            console.error('[TelemetryDebugScreen] Failed to share App Store ops report:', error);
        }
    };

    const categories: ('bug' | 'confusing' | 'suggestion' | 'praise')[] = ['bug', 'confusing', 'suggestion', 'praise'];

    const getAlertStyle = (level: string) => {
        switch (level) {
            case 'critical': return styles.alertCritical;
            case 'warning': return styles.alertWarning;
            default: return styles.alertInfo;
        }
    };

    const renderMetricRow = (label: string, value: any) => (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{String(value)}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Telemetry Debug</Text>

                <Card style={styles.betaCard}>
                    <Text style={styles.cardTitle}>Beta Summary</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>XP Total</Text>
                        <Text style={styles.value}>{today?.totals.xpQuiz ? '(Calc...)' : '...'}</Text>
                    </View>
                    <PrimaryButton onPress={() => setShowFeedback(true)} style={styles.feedbackBtn}>
                        💬 Enviar Feedback
                    </PrimaryButton>
                    <Text style={styles.betaFooter}>Radiant Beta — dados locais, não enviados</Text>
                </Card>

                <Card style={{ ...styles.card, borderColor: COLORS.primary, borderWidth: 1 }}>
                    <Text style={styles.cardTitle}>App Store Ops</Text>
                    {appStoreOps ? (
                        <>
                            {renderMetricRow('Install date', appStoreOps.installDate ?? 'n/a')}
                            {renderMetricRow('User', appStoreOps.currentUserEmail ?? 'anonimo')}
                            {renderMetricRow('Value reached', appStoreOps.firstValueMomentReached ? 'yes' : 'no')}
                            {renderMetricRow('Review shown', appStoreOps.reviewPromptShownCount)}
                            {renderMetricRow('Review blocked', appStoreOps.reviewPromptBlockedCount)}
                            {renderMetricRow('Paywall views', appStoreOps.paywallViewCount)}
                            {renderMetricRow('Paywall CTA taps', appStoreOps.paywallCtaTapCount)}
                            {renderMetricRow('Paywall dismiss', appStoreOps.paywallDismissedCount)}
                            {renderMetricRow('Paywall blocked', appStoreOps.paywallBlockedCount)}
                            {renderMetricRow('Tap rate', appStoreOps.paywallTapRate)}
                            {renderMetricRow('Upgrade interests', appStoreOps.upgradeInterestCount)}

                            <View style={styles.divider} />
                            <Text style={styles.subHeader}>Recent App Store Events</Text>
                            {appStoreOps.recentEvents.map((event) => (
                                <View key={`${event.name}-${event.ts}`} style={styles.interestEntry}>
                                    <Text style={styles.interestTitle}>{event.name}</Text>
                                    <Text style={styles.interestMeta}>
                                        {new Date(event.ts).toLocaleString()} • {event.trigger ?? 'no-trigger'}
                                    </Text>
                                    <Text style={styles.interestMeta}>
                                        {event.entrySurface ?? 'no-surface'} {event.outcome ? `• ${event.outcome}` : ''}
                                    </Text>
                                </View>
                            ))}

                            <View style={{ height: space.s3 }} />
                            <PrimaryButton onPress={handleShareAppStoreOpsReport} style={styles.feedbackBtn}>
                                Compartilhar war room snapshot
                            </PrimaryButton>
                        </>
                    ) : (
                        <Text style={styles.placeholder}>Loading App Store operational summary...</Text>
                    )}
                </Card>

                <Card style={{ ...styles.card, borderColor: COLORS.warning, borderWidth: 1 }}>
                    <Text style={styles.cardTitle}>Upgrade Interest</Text>
                    {renderMetricRow('Capturas locais', upgradeInterests.length)}
                    {renderMetricRow(
                        'Ultimo email',
                        upgradeInterests[0]?.email ?? 'nenhum'
                    )}

                    <View style={styles.divider} />

                    {upgradeInterests.length > 0 ? (
                        upgradeInterests.slice(0, 5).map((entry) => (
                            <View key={entry.id} style={styles.interestEntry}>
                                <Text style={styles.interestTitle}>{entry.offerTitle}</Text>
                                <Text style={styles.interestMeta}>
                                    {new Date(entry.ts).toLocaleString()} • {entry.entrySurface}
                                </Text>
                                <Text style={styles.interestMeta}>
                                    {entry.email ?? 'anonimo'} • {entry.trigger}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.placeholder}>Nenhum interesse de upgrade capturado ainda.</Text>
                    )}

                    <View style={{ height: space.s3 }} />
                    <PrimaryButton onPress={handleShareUpgradeInterests} style={styles.feedbackBtn}>
                        Compartilhar interesses
                    </PrimaryButton>
                    <PrimaryButton
                        onPress={handleClearUpgradeInterests}
                        style={styles.btnClear}
                        textStyle={{ color: COLORS.warning }}
                    >
                        Limpar interesses
                    </PrimaryButton>
                </Card>

                <Card style={{ ...styles.card, borderColor: '#0A84FF', borderWidth: 1 }}>
                    <Text style={styles.cardTitle}>Push Notifications v1</Text>
                    {pushDebug ? (
                        <>
                            {renderMetricRow('Enabled', JSON.stringify(pushDebug.optIn))}
                            {renderMetricRow('Permission', pushDebug.permission)}
                            {renderMetricRow('Shadow Mode', JSON.stringify(pushDebug.shadowMode))}
                            {renderMetricRow('Last Sent', pushDebug.lastSent)}
                            {renderMetricRow('Last Sched', pushDebug.lastScheduled)}

                            <View style={styles.divider} />
                            <Text style={styles.label}>Last Decision:</Text>
                            <Text style={{ ...typography.caption, color: COLORS.textSecondary }}>
                                {pushDebug.lastDecision || 'None'}
                            </Text>

                            <View style={{ height: space.s3 }} />
                            <PrimaryButton onPress={async () => {
                                await PushService.cancelAll();
                                alert('Cancelled all');
                                loadData();
                            }} style={{ backgroundColor: COLORS.border, height: 36 }} textStyle={{ fontSize: 13 }}>
                                Cancel Logic
                            </PrimaryButton>
                        </>
                    ) : <Text style={styles.placeholder}>Loading...</Text>}
                </Card>

                <Card style={styles.card}>
                    <Text style={styles.cardTitle}>Heuristics (v1.1)</Text>
                    {alerts.length > 0 ? (
                        alerts.map(a => (
                            <View key={a.id + a.createdAt} style={[styles.alertContainer, getAlertStyle(a.level)]}>
                                <Text style={styles.alertTitle}>{a.id} • {a.mascotState.toUpperCase()}</Text>
                                <Text style={styles.value}>{a.message}</Text>
                                <Text style={styles.alertAction}>👉 {a.suggestedAction}</Text>
                                <Text style={styles.rawTitle}>{new Date(a.createdAt).toLocaleString()}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.placeholder}>No active alerts found.</Text>
                    )}
                </Card>

                <Card style={styles.card}>
                    <Text style={styles.cardTitle}>Health Score v1</Text>
                    {healthScore ? (
                        <>
                            <View style={styles.row}>
                                <Text style={styles.label}>Score</Text>
                                <Text style={[styles.value, { fontSize: 24 }]}>{healthScore.score}</Text>
                            </View>
                            <Text style={{ ...typography.caption, color: COLORS.textSecondary, marginBottom: 8 }}>{healthScore.label} • {new Date(healthScore.computedAt).toLocaleTimeString()}</Text>

                            <View style={styles.divider} />
                            {renderMetricRow('Consistency (35)', healthScore.components.consistency)}
                            {renderMetricRow('Stickiness (35)', healthScore.components.reviewStickiness)}
                            {renderMetricRow('Balance (20)', healthScore.components.balance)}
                            {renderMetricRow('Goal (10)', healthScore.components.goalConsistency)}
                            {renderMetricRow('Penalty', `-${healthScore.components.penalty}`)}

                            <View style={{ height: space.s3 }} />
                            <PrimaryButton onPress={handleRecalculateHealth} style={{ height: 36, backgroundColor: COLORS.border }} textStyle={{ fontSize: 13 }}>
                                Recalculate (Force)
                            </PrimaryButton>
                        </>
                    ) : (
                        <Text style={styles.placeholder}>Insufficient Data.</Text>
                    )}
                </Card>

                <Card style={styles.card}>
                    <Text style={styles.cardTitle}>Retention & Engagement</Text>
                    {renderMetricRow('Retention D1', retention.d1 ? 'yes' : 'no')}
                    {renderMetricRow('Retention D3', retention.d3 ? 'yes' : 'no')}
                    {renderMetricRow('Retention D7', retention.d7 ? 'yes' : 'no')}
                    {renderMetricRow('Review Stickiness', stickiness)}
                    {renderMetricRow('Maintenance Ratio', maintenanceRatio)}
                </Card>

                <Card style={styles.card}>
                    <Text style={styles.cardTitle}>Today ({new Date().toISOString().split('T')[0]})</Text>
                    {today ? (
                        <>
                            {renderMetricRow('XP (Quiz)', today.totals.xpQuiz)}
                            {renderMetricRow('XP (Review)', today.totals.xpReview)}
                            {renderMetricRow('Review Items', today.totals.reviewItemsAnswered)}
                            {renderMetricRow('Quiz Time (ms)', today.totals.quizDurationMs)}
                            {renderMetricRow('Review Time (ms)', today.totals.reviewDurationMs)}
                            {renderMetricRow('Errors', today.totals.errors)}

                            <View style={styles.divider} />
                            <Text style={styles.subHeader}>Event Counts</Text>
                            {Object.entries(today.eventCounts).map(([key, count]) => (
                                renderMetricRow(key, count)
                            ))}
                        </>
                    ) : (
                        <Text style={styles.placeholder}>No data for today yet.</Text>
                    )}
                </Card>

                <View style={styles.actions}>
                    <PrimaryButton
                        onPress={handleCopy}
                        style={copied ? styles.btnSuccess : undefined}
                    >
                        {copied ? 'Export compartilhado' : 'Compartilhar JSON'}
                    </PrimaryButton>

                    <View style={{ height: space.s3 }} />

                    <PrimaryButton
                        onPress={handleClear}
                        style={styles.btnClear}
                        textStyle={{ color: COLORS.error }}
                    >
                        Clear Telemetry
                    </PrimaryButton>
                </View>

                <View style={styles.rawPreview}>
                    <Text style={styles.rawTitle}>Raw JSON Preview (First 500 chars)</Text>
                    <Text style={styles.rawText}>
                        {exportData.substring(0, 500)}...
                    </Text>
                </View>

            </ScrollView>

            <Modal visible={showFeedback} animationType="slide" transparent>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enviar Feedback</Text>

                        <View style={styles.categoryRow}>
                            {categories.map(c => (
                                <TouchableOpacity
                                    key={c}
                                    style={[styles.catChip, feedbackCategory === c && styles.catChipActive]}
                                    onPress={() => setFeedbackCategory(c)}
                                >
                                    <Text style={[styles.catText, feedbackCategory === c && styles.catTextActive]}>{c.toUpperCase()}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput
                            style={styles.feedbackInput}
                            placeholder="Descreva o problema ou sugestão..."
                            placeholderTextColor="#666"
                            multiline
                            numberOfLines={4}
                            value={feedbackText}
                            onChangeText={setFeedbackText}
                        />

                        <View style={styles.modalActions}>
                            <PrimaryButton onPress={() => setShowFeedback(false)} style={styles.modalBtnSec}>
                                Cancelar
                            </PrimaryButton>
                            <PrimaryButton onPress={handleSendFeedback} style={styles.modalBtnPrim} disabled={sendingFeedback}>
                                {sendingFeedback ? 'Enviando...' : 'Enviar'}
                            </PrimaryButton>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        ...layout.screen,
        backgroundColor: COLORS.background,
    },
    scroll: {
        padding: space.s4,
    },
    title: {
        ...typography.h1,
        color: COLORS.text,
        marginBottom: space.s4,
    },
    card: {
        backgroundColor: COLORS.card,
        padding: space.s4,
        marginBottom: space.s4,
    },
    cardTitle: {
        ...typography.h2,
        color: COLORS.text,
        marginBottom: space.s4,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: space.s2,
    },
    label: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    value: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: space.s4,
    },
    subHeader: {
        color: COLORS.text,
        fontWeight: 'bold',
        marginBottom: space.s3,
    },
    placeholder: {
        color: COLORS.textSecondary,
        fontStyle: 'italic',
    },
    actions: {
        marginBottom: space.s6,
    },
    btnSuccess: {
        backgroundColor: COLORS.success,
    },
    btnClear: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.error,
    },
    rawPreview: {
        padding: space.s4,
        backgroundColor: '#111',
        borderRadius: 8,
    },
    rawTitle: {
        color: '#666',
        fontSize: 12,
        marginBottom: space.s2,
    },
    rawText: {
        color: '#33ff00',
        fontFamily: 'monospace',
        fontSize: 10,
    },
    retentionPill: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
        opacity: 0.3,
        padding: space.s2,
        borderWidth: 1,
        borderColor: COLORS.textSecondary,
        borderRadius: 8,
        minWidth: 40,
        textAlign: 'center',
    },
    retentionActive: {
        color: COLORS.success,
        borderColor: COLORS.success,
        opacity: 1,
        backgroundColor: 'rgba(52, 199, 89, 0.1)',
    },
    alertContainer: {
        padding: space.s3,
        borderRadius: 8,
        marginBottom: space.s2,
        borderLeftWidth: 4,
    },
    alertCritical: {
        backgroundColor: 'rgba(255, 69, 58, 0.1)',
        borderLeftColor: COLORS.error,
    },
    alertWarning: {
        backgroundColor: 'rgba(255, 159, 10, 0.1)',
        borderLeftColor: COLORS.warning,
    },
    alertInfo: {
        backgroundColor: 'rgba(10, 132, 255, 0.1)',
        borderLeftColor: '#0A84FF',
    },
    alertTitle: {
        color: COLORS.text,
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 4,
    },

    alertAction: {
        color: COLORS.textSecondary,
        fontSize: 12,
        fontStyle: 'italic',
    },
    interestEntry: {
        paddingVertical: space.s2,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        gap: 2,
    },
    interestTitle: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '700',
    },
    interestMeta: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
    betaCard: {
        backgroundColor: '#1C1C1E',
        padding: space.s4,
        marginBottom: space.s4,
        borderWidth: 1,
        borderColor: '#FF9F0A',
    },
    feedbackBtn: {
        marginTop: space.s3,
        marginBottom: space.s3,
    },
    betaFooter: {
        textAlign: 'center',
        fontSize: 12,
        color: COLORS.textSecondary,
        opacity: 0.6,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        padding: space.s4,
    },
    modalContent: {
        backgroundColor: COLORS.background,
        padding: space.s5,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: space.s4,
        textAlign: 'center',
    },
    categoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: space.s4,
    },
    catChip: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    catChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    catText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    catTextActive: {
        color: '#FFF',
    },
    feedbackInput: {
        backgroundColor: COLORS.card,
        color: COLORS.text,
        padding: space.s3,
        borderRadius: 8,
        height: 100,
        textAlignVertical: 'top',
        marginBottom: space.s4,
    },
    modalActions: {
        flexDirection: 'row',
        gap: space.s3,
    },
    modalBtnSec: {
        flex: 1,
        backgroundColor: COLORS.border,
    },
    modalBtnPrim: {
        flex: 1,
    },
});
