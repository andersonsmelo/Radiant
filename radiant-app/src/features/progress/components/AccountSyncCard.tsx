import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { AuthService } from '../../auth/AuthService';
import type { AuthSession } from '../../auth/types';
import { SyncQueueService } from '../../sync/SyncQueueService';
import { AppConfig } from '../../../config';
import { isApiConfigured } from '../../../lib/api';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';
import { ActionButton, CardRow, CardTitle, GlassCard } from '../../../ui/components/InfoCards';

const D = {
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

/**
 * Conta e sincronização — o cartão que saiu da `ProgressScreen` em 2026-10-16,
 * quando a configuração do Perfil ganhou tela própria (FILA 32).
 *
 * Só existe quando o sync remoto está de fato disponível. Em produção
 * (`ENABLE_REMOTE_SYNC=false`, sem API configurada) o cartão inteiro some:
 * renderizar o formulário com os handlers travados pôs sete controles inertes no
 * Perfil do build 1.3.1 (10) — botões que não fazem nada são "App
 * Completeness", e um login visível contradiz "no account, login, or
 * credentials" na resposta à App Review.
 *
 * Os handlers são os mesmos que moravam na `ProgressScreen`. Os espaçamentos
 * passaram aos tokens do design system, que o QA visual exige de arquivo novo.
 */
export function AccountSyncCard() {
    const remoteSyncAvailable = AppConfig.ENABLE_REMOTE_SYNC && isApiConfigured();

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

    useFocusEffect(
        useCallback(() => {
            if (!remoteSyncAvailable) return;
            void (async () => {
                try {
                    const [session, queueSummary] = await Promise.all([
                        AuthService.bootstrap(),
                        SyncQueueService.getSummary(),
                    ]);
                    setAuthSession(session);
                    setSyncQueueCount(queueSummary.pending);
                    setSyncRetryingCount(queueSummary.retrying);
                } catch (error) {
                    console.error('[AccountSyncCard] Failed to load account state:', error);
                }
            })();
        }, [remoteSyncAvailable])
    );

    if (!remoteSyncAvailable) return null;

    const isAuthenticated = Boolean(authSession?.user?.id);

    const setFeedback = (
        message: string,
        tone: 'neutral' | 'success' | 'warning' | 'error' = 'neutral'
    ) => {
        setStatusMessage(message);
        setStatusTone(tone);
    };

    const handleAuthSubmit = async () => {
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
            setPassword('');
            setFeedback(
                authMode === 'login'
                    ? 'Sessão autenticada e fila sincronizada.'
                    : 'Conta criada e fila sincronizada.',
                'success'
            );
        } catch (error) {
            console.error('[AccountSyncCard] Failed to authenticate:', error);
            setFeedback(error instanceof Error ? error.message : 'Falha ao autenticar.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordResetRequest = async () => {
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
            console.error('[AccountSyncCard] Failed to request password reset:', error);
            setFeedback(
                error instanceof Error ? error.message : 'Falha ao solicitar reset de senha.',
                'error'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordResetConfirm = async () => {
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
            console.error('[AccountSyncCard] Failed to confirm password reset:', error);
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
            console.error('[AccountSyncCard] Failed to logout:', error);
            setFeedback('Falha ao encerrar sessão.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleFlushSync = async () => {
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
            const refreshedSession = await AuthService.hydrateUser();
            setAuthSession(refreshedSession);
            setFeedback('Sincronização concluída.', 'success');
        } catch (error) {
            console.error('[AccountSyncCard] Failed to flush sync queue:', error);
            setFeedback(error instanceof Error ? error.message : 'Falha ao sincronizar.', 'error');
        } finally {
            setSyncing(false);
        }
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
        <GlassCard>
            <CardTitle>Conta e sincronização</CardTitle>
            <CardRow label="Modo" value="sync remoto disponível" />
            <CardRow label="Pendentes" value={String(syncQueueCount)} />
            <CardRow label="Em retry" value={String(syncRetryingCount)} />
            <Text style={styles.cardHint}>
                O estudo continua funcionando localmente mesmo sem rede ou autenticação ativa.
            </Text>

            {isAuthenticated ? (
                <View style={styles.btnGroup}>
                    <View style={styles.authBadge}>
                        <View style={styles.authDot} />
                        <Text style={styles.authBadgeText}>{authSession?.user.email}</Text>
                    </View>
                    <ActionButton onPress={handleFlushSync} disabled={syncing || submitting}>
                        {syncing ? 'Sincronizando...' : 'Sincronizar agora'}
                    </ActionButton>
                    <ActionButton onPress={handleLogout} disabled={submitting || syncing} variant="secondary">
                        Sair
                    </ActionButton>
                </View>
            ) : (
                <View style={styles.btnGroup}>
                    <View style={styles.authModeRow}>
                        <TouchableOpacity
                            onPress={() => setAuthMode('login')}
                            style={[styles.modeTab, authMode === 'login' && styles.modeTabActive]}
                        >
                            <Text style={[styles.modeTabText, authMode === 'login' && styles.modeTabTextActive]}>
                                Entrar
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setAuthMode('register')}
                            style={[styles.modeTab, authMode === 'register' && styles.modeTabActive]}
                        >
                            <Text style={[styles.modeTabText, authMode === 'register' && styles.modeTabTextActive]}>
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
                    <ActionButton onPress={handleAuthSubmit} disabled={submitting || syncing}>
                        {submitting
                            ? authMode === 'login'
                                ? 'Entrando...'
                                : 'Criando conta...'
                            : authMode === 'login'
                              ? 'Entrar para sincronizar'
                              : 'Criar conta e sincronizar'}
                    </ActionButton>
                    <ActionButton onPress={handlePasswordResetRequest} disabled={submitting || syncing} variant="secondary">
                        {submitting ? 'Processando...' : 'Solicitar reset de senha'}
                    </ActionButton>
                    <ActionButton
                        onPress={handlePasswordResetConfirm}
                        disabled={submitting || syncing || !resetToken.trim()}
                        variant="ghost"
                    >
                        Confirmar reset com token
                    </ActionButton>
                </View>
            )}

            {statusMessage ? (
                <Text style={[styles.statusMessage, { color: statusColor }]}>{statusMessage}</Text>
            ) : null}
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    cardHint: {
        ...typography.micro,
        color: D.textTert,
        lineHeight: 18,
        marginTop: space.s0,
    },
    btnGroup: { gap: space.s2, marginTop: space.s2 },
    authBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.s1,
        backgroundColor: 'rgba(93,227,174,0.12)',
        borderRadius: radius.rSm,
        paddingHorizontal: space.s2,
        paddingVertical: space.s1,
    },
    authDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: D.success,
    },
    authBadgeText: {
        ...typography.micro,
        color: D.success,
    },
    authModeRow: {
        flexDirection: 'row',
        backgroundColor: D.surfaceAlt,
        borderRadius: radius.rMd,
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
        ...typography.caption,
        color: D.textSec,
    },
    modeTabTextActive: {
        color: '#FFFFFF',
    },
    input: {
        height: 48,
        borderRadius: radius.rMd,
        borderWidth: 1,
        borderColor: D.border,
        backgroundColor: D.inputBg,
        color: D.text,
        paddingHorizontal: space.s2,
        ...typography.bodyRegular,
    },
    statusMessage: {
        ...typography.micro,
        marginTop: space.s0,
        lineHeight: 18,
    },
});
