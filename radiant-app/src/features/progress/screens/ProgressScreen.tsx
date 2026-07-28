import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { GamificationService } from '../../gamification/services/GamificationService';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { AuthService } from '../../auth/AuthService';
import { SyncQueueService } from '../../sync/SyncQueueService';
import { IosHomologationService } from '../services/IosHomologationService';
import type { GamificationSnapshot } from '../../../types/gamification';
import type { AuthSession } from '../../auth/types';
import { AppConfig } from '../../../config';
import { ApiError, apiRequest, isApiConfigured } from '../../../lib/api';
import { TelemetryService } from '../../telemetry/TelemetryService';
import { productCopy } from '../../../ui/copy/pt-BR';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { tabBarClearance } from '../../../ui/styles';

// ── Paleta (identidade galaxy dark — ADR-2026-07-27) ─────────────
// Alias de tokens: nenhum valor próprio de cor vive nesta tela.

const D = {
    bg: galaxyColors.background,
    surface: galaxyColors.surface,
    surfaceAlt: galaxyColors.surfaceActive,
    border: galaxyColors.border,
    text: galaxyColors.textPrimary,
    textSec: galaxyColors.textSecondary,
    textTert: galaxyColors.textTertiary,
    success: semanticColors.galaxy.statusSuccess,
    warning: galaxyColors.xpColor,
    error: galaxyColors.critical,
    primary: galaxyColors.ctaGradientStart,
    inputBg: galaxyColors.surfaceMuted,
};

// ── Componentes locais ───────────────────────────────────────────

function GlassCard({ children, style }: { children: React.ReactNode; style?: object }) {
    return <View style={[styles.card, style]}>{children}</View>;
}

function CardTitle({ children }: { children: React.ReactNode }) {
    return <Text style={styles.cardTitle}>{children}</Text>;
}

function CardRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>{label}</Text>
            <Text style={styles.cardRowValue}>{value}</Text>
        </View>
    );
}

function ActionButton({
    onPress,
    disabled,
    variant = 'primary',
    children,
}: {
    onPress: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'ghost';
    children: React.ReactNode;
}) {
    const bg =
        variant === 'primary'
            ? D.primary
            : variant === 'secondary'
              ? D.surfaceAlt
              : 'transparent';
    const border =
        variant === 'ghost' ? D.border : 'transparent';

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityState={{ disabled: !!disabled }}
            style={[
                styles.btn,
                { backgroundColor: bg, borderColor: border, opacity: disabled ? 0.45 : 1 },
            ]}
            activeOpacity={0.75}
        >
            <Text style={[styles.btnText, variant !== 'primary' && { color: D.text }]}>
                {children}
            </Text>
        </TouchableOpacity>
    );
}

function getApiHealthErrorLabel(error: unknown): string {
    if (error instanceof ApiError) {
        if (error.code === 'timeout') {
            return 'timeout ao consultar API';
        }

        if (error.code === 'network') {
            return 'falha de rede ou DNS';
        }

        return error.message;
    }

    return error instanceof Error ? error.message : 'falha de conexão';
}

function StreakCalendarCard({ streakDays }: { streakDays: number }) {
    return <View style={styles.whiteCard}><Text style={styles.sectionLabel}>SEQUÊNCIA ATUAL</Text><Text style={styles.streakNumber}>🔥 {streakDays} {streakDays === 1 ? 'dia' : 'dias'}</Text><Text style={styles.streakSub}>O calendário por dia será exibido quando o histórico local estiver disponível.</Text></View>;
}

function AccuracyChartCard() {
    return <View style={styles.whiteCard} accessibilityLabel={productCopy.noEvaluatedAttempts}><Text style={styles.sectionLabel}>PRECISÃO</Text><Text style={styles.accuracyNumber}>—</Text><Text style={styles.streakSub}>{productCopy.noEvaluatedAttempts}</Text></View>;
}

function StatsGrid({ totalXp, dueCount }: { totalXp: number; dueCount: number }) {
    return (
        <View style={styles.statsGridNew}>
            {/* TOTAL XP */}
            <View style={styles.statsGridCard}>
                <Text style={styles.statsGridLabel}>TOTAL XP</Text>
                <Text style={styles.statsGridValue}>⚡ {totalXp}</Text>
                <Text style={styles.statsGridSub}>XP acumulado</Text>
            </View>

            {/* Revisões pendentes */}
            <View style={styles.statsGridCard}>
                <Text style={styles.statsGridLabel}>REVISÕES</Text>
                <Text style={styles.statsGridValue}>{dueCount}</Text>
                <Text style={styles.statsGridSub}>pendentes agora</Text>
            </View>
        </View>
    );
}

function TopicsMasteredList() {
    return (
        <View>
            {/* Section header */}
            <View style={[styles.rowBetween, { marginBottom: 10 }]}>
                <Text style={styles.sectionLabel}>TÓPICOS</Text>
            </View>

            <Text style={styles.streakSub}>{productCopy.noLearningEvidence}</Text>
        </View>
    );
}

// ── Tela principal ───────────────────────────────────────────────

export default function ProgressScreen() {
    const [snapshot, setSnapshot] = useState<GamificationSnapshot | null>(null);
    const [dueCount, setDueCount] = useState(0);
    const [authSession, setAuthSession] = useState<AuthSession | null>(null);
    const [syncQueueCount, setSyncQueueCount] = useState(0);
    const [syncRetryingCount, setSyncRetryingCount] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [resetToken, setResetToken] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [statusTone, setStatusTone] = useState<'neutral' | 'success' | 'warning' | 'error'>('neutral');
    const [apiHealthLabel, setApiHealthLabel] = useState<string>('não verificada');
    const [apiChecking, setApiChecking] = useState(false);
    const [lastQueueError, setLastQueueError] = useState<string | null>(null);
    const [resettingLocalState, setResettingLocalState] = useState(false);

    const load = useCallback(async () => {
        try {
            await LessonCatalogService.bootstrap();

            const [gamificationSnapshot, reviewDueCount, session, queueSummary] = await Promise.all([
                GamificationService.getSnapshot(),
                SpacedRepetitionService.getDueCount(),
                AuthService.bootstrap(),
                SyncQueueService.getSummary(),
            ]);

            setSnapshot(gamificationSnapshot);
            setDueCount(reviewDueCount);
            setAuthSession(session);
            setSyncQueueCount(queueSummary.pending);
            setSyncRetryingCount(queueSummary.retrying);
            setLastQueueError(queueSummary.lastError);
        } catch (error) {
            console.error('[ProgressScreen] Failed to load progress data:', error);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    useFocusEffect(
        useCallback(() => {
            void TelemetryService.track('screen_view', { screen: 'progress' });
            load();
        }, [load])
    );

    const tracks = LessonCatalogService.listTracks();
    const remoteSyncAvailable = AppConfig.ENABLE_REMOTE_SYNC && isApiConfigured();
    const isAuthenticated = Boolean(authSession?.user?.id);
    const showDeveloperTools = AppConfig.SHOW_DEV_TOOLS;

    const setFeedback = (
        message: string,
        tone: 'neutral' | 'success' | 'warning' | 'error' = 'neutral'
    ) => {
        setStatusMessage(message);
        setStatusTone(tone);
    };

    const handleAuthSubmit = async () => {
        if (!remoteSyncAvailable) {
            setFeedback('Configure a API remota e ative o sync para autenticar.', 'warning');
            return;
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail || !password) {
            setFeedback('Preencha email e senha.', 'warning');
            return;
        }

        try {
            setSubmitting(true);
            setFeedback(authMode === 'login' ? 'Entrando...' : 'Criando conta...');

            const session =
                authMode === 'login'
                    ? await AuthService.login(normalizedEmail, password)
                    : await AuthService.register(normalizedEmail, password);

            setAuthSession(session);
            await SyncQueueService.flush();
            const queueSummary = await SyncQueueService.getSummary();
            setSyncQueueCount(queueSummary.pending);
            setSyncRetryingCount(queueSummary.retrying);
            setLastQueueError(queueSummary.lastError);
            setPassword('');
            setFeedback(
                authMode === 'login'
                    ? 'Sessão autenticada e fila sincronizada.'
                    : 'Conta criada e fila sincronizada.',
                'success'
            );
        } catch (error) {
            console.error('[ProgressScreen] Failed to authenticate:', error);
            setFeedback(error instanceof Error ? error.message : 'Falha ao autenticar.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordResetRequest = async () => {
        if (!remoteSyncAvailable) {
            setFeedback('Configure a API remota e ative o sync para recuperar a senha.', 'warning');
            return;
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail) {
            setFeedback('Informe o email da conta para solicitar o reset.', 'warning');
            return;
        }

        try {
            setSubmitting(true);
            setFeedback('Solicitando reset de senha...');
            const result = await AuthService.requestPasswordReset(normalizedEmail);
            if (result.resetToken) {
                setResetToken(result.resetToken);
                setFeedback(
                    `Reset solicitado. Token de homologação disponível: ${result.resetToken}`,
                    'success'
                );
            } else {
                setFeedback(
                    'Se o email existir, um token de redefinição foi emitido para esse usuário.',
                    'success'
                );
            }
        } catch (error) {
            console.error('[ProgressScreen] Failed to request password reset:', error);
            setFeedback(
                error instanceof Error ? error.message : 'Falha ao solicitar reset de senha.',
                'error'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordResetConfirm = async () => {
        if (!remoteSyncAvailable) {
            setFeedback('Configure a API remota e ative o sync para redefinir a senha.', 'warning');
            return;
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail || !resetToken.trim() || !password) {
            setFeedback('Preencha email, token e nova senha.', 'warning');
            return;
        }

        try {
            setSubmitting(true);
            setFeedback('Redefinindo senha...');
            await AuthService.confirmPasswordReset(normalizedEmail, resetToken, password);
            setPassword('');
            setResetToken('');
            setAuthMode('login');
            setFeedback('Senha redefinida. Você já pode entrar com a nova senha.', 'success');
        } catch (error) {
            console.error('[ProgressScreen] Failed to confirm password reset:', error);
            setFeedback(
                error instanceof Error ? error.message : 'Falha ao redefinir a senha.',
                'error'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = async () => {
        try {
            setSubmitting(true);
            await AuthService.logout();
            setAuthSession(null);
            setFeedback('Sessão removida deste dispositivo.', 'success');
        } catch (error) {
            console.error('[ProgressScreen] Failed to logout:', error);
            setFeedback('Falha ao encerrar sessão.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleFlushSync = async () => {
        if (!remoteSyncAvailable) {
            setFeedback('Sync remoto desativado no ambiente atual.', 'warning');
            return;
        }

        if (!AuthService.hasAuthenticatedSession()) {
            setFeedback('Entre com uma conta para enviar a fila pendente.', 'warning');
            return;
        }

        try {
            setSyncing(true);
            setFeedback('Sincronizando fila...');
            await SyncQueueService.flush();
            const queueSummary = await SyncQueueService.getSummary();
            setSyncQueueCount(queueSummary.pending);
            setSyncRetryingCount(queueSummary.retrying);
            setLastQueueError(queueSummary.lastError);
            const refreshedSession = await AuthService.hydrateUser();
            setAuthSession(refreshedSession);
            setFeedback('Sincronização concluída.', 'success');
        } catch (error) {
            console.error('[ProgressScreen] Failed to flush sync queue:', error);
            setFeedback(error instanceof Error ? error.message : 'Falha ao sincronizar.', 'error');
        } finally {
            setSyncing(false);
        }
    };

    const handleCheckApiHealth = async () => {
        if (!isApiConfigured()) {
            setApiHealthLabel('API não configurada');
            setFeedback('Defina EXPO_PUBLIC_API_BASE_URL antes de testar a API.', 'warning');
            return;
        }

        try {
            setApiChecking(true);
            const response = await apiRequest<{ ok: boolean; service: string; now: string }>('/health');
            setApiHealthLabel(response.ok ? `online • ${response.now}` : 'resposta inválida');
            setFeedback('Health check da API concluído.', response.ok ? 'success' : 'warning');
        } catch (error) {
            console.error('[ProgressScreen] Failed to check API health:', error);
            setApiHealthLabel(getApiHealthErrorLabel(error));
            setFeedback('Falha ao consultar /health da API.', 'error');
        } finally {
            setApiChecking(false);
        }
    };

    const handleRemoteSyncHelp = () => {
        Alert.alert(
            'Sync remoto',
            remoteSyncAvailable
                ? 'A API está configurada e o app pode sincronizar progresso autenticado.'
                : 'Defina EXPO_PUBLIC_API_BASE_URL e EXPO_PUBLIC_ENABLE_REMOTE_SYNC=true para ativar auth e sync.'
        );
    };

    const handleResetHomologationState = () => {
        Alert.alert(
            'Resetar homologação iOS V2',
            'Isso limpa o estado local usado no smoke da Learning Road V2 neste dispositivo.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Resetar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setResettingLocalState(true);
                            setFeedback('Resetando estado local da homologação iOS V2...');
                            await IosHomologationService.resetLocalState();
                            await load();
                            setFeedback(
                                'Estado local resetado. A Learning Road V2 está pronta para um novo smoke.',
                                'success'
                            );
                        } catch (error) {
                            console.error('[ProgressScreen] Failed to reset iOS homologation state:', error);
                            setFeedback(
                                error instanceof Error
                                    ? error.message
                                    : 'Falha ao resetar o estado local da homologação.',
                                'error'
                            );
                        } finally {
                            setResettingLocalState(false);
                        }
                    },
                },
            ]
        );
    };

    const statusColor =
        statusTone === 'success'
            ? D.success
            : statusTone === 'warning'
              ? D.warning
              : statusTone === 'error'
                ? D.error
                : D.textSec;

    return (
        <SafeAreaView style={styles.root} edges={['top']}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Header ── */}
                <Text style={styles.screenEyebrow}>SEU PROGRESSO</Text>
                <Text style={styles.screenTitle}>Progresso</Text>

                {/* ── Streak Calendar ── */}
                <StreakCalendarCard streakDays={snapshot?.streakDays ?? 0} />

                {/* ── Accuracy Chart ── */}
                <AccuracyChartCard />

                {/* ── 2×2 Stats Grid ── */}
                <StatsGrid totalXp={snapshot?.totalXp ?? 0} dueCount={dueCount} />

                {/* ── Topics Mastered ── */}
                <View style={styles.whiteCard}>
                    <TopicsMasteredList />
                </View>

                {/* ── Catálogo local ── */}
                <GlassCard>
                    <CardTitle>Catálogo local</CardTitle>
                    <CardRow label="Trilhas" value={String(tracks.length)} />
                    <CardRow label="Versão" value={LessonCatalogService.getCatalogVersion()} />
                    <CardRow label="Fonte" value={LessonCatalogService.getCatalogSourceLabel()} />
                    <CardRow
                        label="Lição inicial"
                        value={LessonCatalogService.getInitialLesson()?.title ?? 'indisponível'}
                    />
                </GlassCard>

                {/* ── Homologação (dev tools) ── */}
                {showDeveloperTools ? (
                    <GlassCard>
                        <CardTitle>Homologação iOS V2</CardTitle>
                        <CardRow
                            label="Learning Road"
                            value={AppConfig.ENABLE_LEARNING_ROAD ? 'ativada' : 'desativada'}
                        />
                        <CardRow
                            label="Beta Gate"
                            value={AppConfig.ENABLE_BETA_GATE ? 'ativo' : 'bypass local'}
                        />
                        <CardRow
                            label="Sync remoto"
                            value={
                                remoteSyncAvailable
                                    ? 'ativado'
                                    : AppConfig.ENABLE_REMOTE_SYNC
                                      ? 'ligado, sem API configurada'
                                      : 'desativado'
                            }
                        />
                        <CardRow
                            label="Telemetry Debug"
                            value={AppConfig.ENABLE_TELEMETRY_DEBUG_SCREEN ? 'ativo' : 'desativado'}
                        />
                        <View style={styles.btnGroup}>
                            <ActionButton
                                onPress={handleResetHomologationState}
                                disabled={resettingLocalState || submitting || syncing}
                                variant="secondary"
                            >
                                {resettingLocalState ? 'Resetando...' : 'Resetar estado local da V2'}
                            </ActionButton>
                            <ActionButton
                                onPress={() => router.replace('/(tabs)')}
                                variant="ghost"
                            >
                                Abrir Journey Home
                            </ActionButton>
                        </View>
                    </GlassCard>
                ) : null}

                {/* ── Conta e sincronização ── */}
                <GlassCard>
                    <CardTitle>Conta e sincronização</CardTitle>
                    <CardRow
                        label="Modo"
                        value={remoteSyncAvailable ? 'sync remoto disponível' : 'local-first'}
                    />
                    <CardRow label="Pendentes" value={String(syncQueueCount)} />
                    <CardRow label="Em retry" value={String(syncRetryingCount)} />

                    {showDeveloperTools ? (
                        <>
                            <CardRow
                                label="API"
                                value={isApiConfigured() ? AppConfig.API_BASE_URL : 'não configurada'}
                            />
                            <CardRow label="Health API" value={apiHealthLabel} />
                            {lastQueueError ? (
                                <Text style={[styles.cardRowValue, { color: D.warning, marginTop: 4 }]}>
                                    Último erro: {lastQueueError}
                                </Text>
                            ) : null}
                        </>
                    ) : (
                        <Text style={styles.cardHint}>
                            O estudo continua funcionando localmente mesmo sem rede ou autenticação ativa.
                        </Text>
                    )}

                    {isAuthenticated ? (
                        <View style={styles.btnGroup}>
                            <View style={styles.authBadge}>
                                <View style={styles.authDot} />
                                <Text style={styles.authBadgeText}>
                                    {authSession?.user.email}
                                </Text>
                            </View>
                            <ActionButton
                                onPress={handleFlushSync}
                                disabled={syncing || submitting}
                            >
                                {syncing ? 'Sincronizando...' : 'Sincronizar agora'}
                            </ActionButton>
                            <ActionButton
                                onPress={handleLogout}
                                disabled={submitting || syncing}
                                variant="secondary"
                            >
                                Sair
                            </ActionButton>
                            {showDeveloperTools ? (
                                <ActionButton
                                    onPress={handleCheckApiHealth}
                                    disabled={apiChecking || submitting || syncing}
                                    variant="ghost"
                                >
                                    {apiChecking ? 'Testando API...' : 'Testar API'}
                                </ActionButton>
                            ) : null}
                        </View>
                    ) : (
                        <View style={styles.btnGroup}>
                            <View style={styles.authModeRow}>
                                <TouchableOpacity
                                    onPress={() => setAuthMode('login')}
                                    style={[
                                        styles.modeTab,
                                        authMode === 'login' && styles.modeTabActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.modeTabText,
                                            authMode === 'login' && styles.modeTabTextActive,
                                        ]}
                                    >
                                        Entrar
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setAuthMode('register')}
                                    style={[
                                        styles.modeTab,
                                        authMode === 'register' && styles.modeTabActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.modeTabText,
                                            authMode === 'register' && styles.modeTabTextActive,
                                        ]}
                                    >
                                        Criar conta
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                                placeholder="Email"
                                placeholderTextColor={D.textSec}
                                value={email}
                                onChangeText={setEmail}
                                style={styles.input}
                            />
                            <TextInput
                                secureTextEntry
                                placeholder="Senha ou nova senha"
                                placeholderTextColor={D.textSec}
                                value={password}
                                onChangeText={setPassword}
                                style={styles.input}
                            />

                            <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Token de reset (opcional até confirmar)"
                                placeholderTextColor={D.textSec}
                                value={resetToken}
                                onChangeText={setResetToken}
                                style={styles.input}
                            />

                            <ActionButton
                                onPress={handleAuthSubmit}
                                disabled={submitting || syncing}
                            >
                                {submitting
                                    ? authMode === 'login'
                                        ? 'Entrando...'
                                        : 'Criando conta...'
                                    : authMode === 'login'
                                      ? 'Entrar para sincronizar'
                                      : 'Criar conta e sincronizar'}
                            </ActionButton>

                            <ActionButton
                                onPress={handlePasswordResetRequest}
                                disabled={submitting || syncing}
                                variant="secondary"
                            >
                                {submitting ? 'Processando...' : 'Solicitar reset de senha'}
                            </ActionButton>

                            <ActionButton
                                onPress={handlePasswordResetConfirm}
                                disabled={submitting || syncing || !resetToken.trim()}
                                variant="ghost"
                            >
                                Confirmar reset com token
                            </ActionButton>

                            {showDeveloperTools ? (
                                <ActionButton
                                    onPress={handleCheckApiHealth}
                                    disabled={apiChecking || submitting || syncing}
                                    variant="ghost"
                                >
                                    {apiChecking ? 'Testando API...' : 'Testar API'}
                                </ActionButton>
                            ) : null}
                        </View>
                    )}

                    {statusMessage ? (
                        <Text style={[styles.statusMessage, { color: statusColor }]}>
                            {statusMessage}
                        </Text>
                    ) : null}

                    {showDeveloperTools ? (
                        <ActionButton onPress={handleRemoteSyncHelp} variant="ghost">
                            Ver requisitos do sync remoto
                        </ActionButton>
                    ) : null}
                </GlassCard>

                {showDeveloperTools ? (
                    <ActionButton onPress={() => router.push('/telemetry')} variant="secondary">
                        Abrir Telemetry Debug
                    </ActionButton>
                ) : null}

            </ScrollView>
        </SafeAreaView>
    );
}

// ── Estilos ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: D.bg },
    scroll: { flex: 1 },
    content: { paddingHorizontal: 20, paddingBottom: tabBarClearance },

    // ── Page header ──
    screenEyebrow: {
        fontSize: 11,
        color: D.textTert,
        letterSpacing: 0.08 * 11,
        textTransform: 'uppercase',
        marginTop: 16,
    },
    screenTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: D.text,
        letterSpacing: -0.02 * 26,
        marginTop: 2,
        marginBottom: 20,
    },

    // ── White card (shared base) ──
    whiteCard: {
        backgroundColor: D.surface,
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: D.border,
    },

    // ── Streak calendar ──
    rowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    streakNumber: {
        fontSize: 28,
        fontWeight: '700',
        color: D.text,
    },
    streakSub: {
        fontSize: 12,
        color: D.textSec,
        marginTop: 2,
    },

    // ── Accuracy chart ──
    sectionLabel: {
        fontSize: 11,
        color: D.textTert,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    accuracyNumber: {
        fontSize: 28,
        fontWeight: '700',
        color: D.text,
    },

    // ── Stats grid 2x2 ──
    statsGridNew: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 14,
    },
    statsGridCard: {
        flex: 1,
        backgroundColor: D.surface,
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: D.border,
    },
    statsGridLabel: {
        fontSize: 10,
        color: D.textTert,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    statsGridValue: {
        fontSize: 24,
        fontWeight: '700',
        color: D.text,
    },
    statsGridSub: {
        fontSize: 11,
        color: D.textSec,
        marginTop: 2,
    },

    // ── GlassCard (legacy sections) ──
    card: {
        backgroundColor: D.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: D.border,
        padding: 16,
        marginBottom: 14,
        gap: 8,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: D.text,
        marginBottom: 4,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardRowLabel: {
        fontSize: 12,
        color: D.textSec,
    },
    cardRowValue: {
        fontSize: 12,
        color: D.text,
        fontWeight: '500',
        flexShrink: 1,
        textAlign: 'right',
    },
    cardHint: {
        fontSize: 12,
        color: D.textTert,
        lineHeight: 18,
        marginTop: 4,
    },

    // ── Buttons ──
    btnGroup: { gap: 10, marginTop: 12 },
    btn: {
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    btnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // ── Auth ──
    authBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(93,227,174,0.12)',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    authDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: D.success,
    },
    authBadgeText: {
        fontSize: 12,
        color: D.success,
        fontWeight: '600',
    },
    authModeRow: {
        flexDirection: 'row',
        backgroundColor: D.surfaceAlt,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: D.border,
        overflow: 'hidden',
    },
    modeTab: {
        flex: 1,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modeTabActive: {
        backgroundColor: D.primary,
    },
    modeTabText: {
        fontSize: 13,
        fontWeight: '600',
        color: D.textSec,
    },
    modeTabTextActive: {
        color: '#FFFFFF',
    },
    input: {
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: D.border,
        backgroundColor: D.inputBg,
        color: D.text,
        paddingHorizontal: 14,
        fontSize: 15,
    },
    statusMessage: {
        fontSize: 12,
        marginTop: 4,
        lineHeight: 18,
    },
});
