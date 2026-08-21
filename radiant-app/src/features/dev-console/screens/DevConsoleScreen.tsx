import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { SyncQueueService } from '../../sync/SyncQueueService';
import { IosHomologationService } from '../../progress/services/IosHomologationService';
import { AppConfig } from '../../../config';
import { ApiError, apiRequest, isApiConfigured } from '../../../lib/api';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { space, typography } from '../../../ui/styles';
import {
    ActionButton,
    CardRow,
    CardTitle,
    GlassCard,
    infoCardStyles,
} from '../../../ui/components/InfoCards';

// Console de desenvolvimento (ADR-2026-08-15).
//
// Estes painéis moravam dentro da `ProgressScreen`, misturados com streak,
// acurácia e XP do aluno. Quando o Progresso passou a ser agregado ao Perfil, a
// mistura deixou de ser só desarrumação: levaria flags de build, health de API e
// reset de estado local para dentro do perfil de quem estuda. A separação vem
// antes da agregação.
//
// A rota que monta esta tela é gated por `SHOW_DEV_TOOLS`, cujo padrão é
// `__DEV__ || EXPO_PUBLIC_ENABLE_DEV_TOOLS` — em build de release ela some sem
// precisar de flag nova. A homologação em aparelho, que dependia da tela do
// aluno, continua possível ligando a variável.

const D = {
    bg: galaxyColors.background,
    border: galaxyColors.border,
    text: galaxyColors.textPrimary,
    textSec: galaxyColors.textSecondary,
    textTert: galaxyColors.textTertiary,
    success: semanticColors.galaxy.statusSuccess,
    warning: galaxyColors.xpColor,
    error: galaxyColors.critical,
};

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

export default function DevConsoleScreen() {
    const [apiHealthLabel, setApiHealthLabel] = useState<string>('não verificada');
    const [apiChecking, setApiChecking] = useState(false);
    const [resettingLocalState, setResettingLocalState] = useState(false);
    const [lastQueueError, setLastQueueError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [statusTone, setStatusTone] = useState<'neutral' | 'success' | 'warning' | 'error'>(
        'neutral'
    );

    const load = useCallback(async () => {
        try {
            await LessonCatalogService.bootstrap();
            const queueSummary = await SyncQueueService.getSummary();
            setLastQueueError(queueSummary.lastError);
        } catch (error) {
            console.error('[DevConsoleScreen] Failed to load diagnostics:', error);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const tracks = LessonCatalogService.listTracks();
    const remoteSyncAvailable = AppConfig.ENABLE_REMOTE_SYNC && isApiConfigured();

    const setFeedback = (
        message: string,
        tone: 'neutral' | 'success' | 'warning' | 'error' = 'neutral'
    ) => {
        setStatusMessage(message);
        setStatusTone(tone);
    };

    const handleCheckApiHealth = async () => {
        if (!isApiConfigured()) {
            setApiHealthLabel('API não configurada');
            setFeedback('Defina EXPO_PUBLIC_API_BASE_URL antes de testar a API.', 'warning');
            return;
        }

        try {
            setApiChecking(true);
            const response = await apiRequest<{ ok: boolean; service: string; now: string }>(
                '/health'
            );
            setApiHealthLabel(response.ok ? `online • ${response.now}` : 'resposta inválida');
            setFeedback('Health check da API concluído.', response.ok ? 'success' : 'warning');
        } catch (error) {
            console.error('[DevConsoleScreen] Failed to check API health:', error);
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
                            console.error(
                                '[DevConsoleScreen] Failed to reset iOS homologation state:',
                                error
                            );
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
                <Text style={styles.screenEyebrow}>DIAGNÓSTICO</Text>
                <Text style={styles.screenTitle} accessibilityRole="header">
                    Console de desenvolvimento
                </Text>

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

                {/* ── Homologação ── */}
                <GlassCard>
                    <CardTitle>Homologação iOS V2</CardTitle>
                    <CardRow
                        label="Learning Road"
                        value={AppConfig.ENABLE_LEARNING_ROAD ? 'ativada' : 'desativada'}
                    />
                    {/*
                      O gate aplicado é `ENABLE_BETA_GATE && !SHOW_DEV_TOOLS`
                      (`_layout.tsx`), e este painel só existe sob
                      `SHOW_DEV_TOOLS` — logo "ativo" é inalcançável aqui por
                      construção, e a flag crua anunciava exatamente o contrário
                      do que a build faz. Mesma correção de honestidade da linha
                      de sync abaixo.
                    */}
                    <CardRow
                        label="Beta Gate"
                        value={
                            AppConfig.ENABLE_BETA_GATE && !AppConfig.SHOW_DEV_TOOLS
                                ? 'ativo'
                                : AppConfig.ENABLE_BETA_GATE
                                  ? 'ligado, bypass por dev tools'
                                  : 'desativado'
                        }
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
                    <View style={infoCardStyles.btnGroup}>
                        <ActionButton
                            onPress={handleResetHomologationState}
                            disabled={resettingLocalState}
                            variant="secondary"
                        >
                            {resettingLocalState ? 'Resetando...' : 'Resetar estado local da V2'}
                        </ActionButton>
                        <ActionButton onPress={() => router.replace('/(tabs)')} variant="ghost">
                            Abrir Journey Home
                        </ActionButton>
                    </View>
                </GlassCard>

                {/* ── API e fila ── */}
                <GlassCard>
                    <CardTitle>API e fila de sync</CardTitle>
                    <CardRow
                        label="API"
                        value={isApiConfigured() ? AppConfig.API_BASE_URL : 'não configurada'}
                    />
                    <CardRow label="Health API" value={apiHealthLabel} />
                    {lastQueueError ? (
                        <Text
                            style={[
                                infoCardStyles.cardRowValue,
                                { color: D.warning, marginTop: 4 },
                            ]}
                        >
                            Último erro: {lastQueueError}
                        </Text>
                    ) : null}

                    <View style={infoCardStyles.btnGroup}>
                        <ActionButton
                            onPress={handleCheckApiHealth}
                            disabled={apiChecking}
                            variant="ghost"
                        >
                            {apiChecking ? 'Testando API...' : 'Testar API'}
                        </ActionButton>
                        <ActionButton onPress={handleRemoteSyncHelp} variant="ghost">
                            Ver requisitos do sync remoto
                        </ActionButton>
                    </View>

                    {statusMessage ? (
                        <Text style={[styles.statusMessage, { color: statusColor }]}>
                            {statusMessage}
                        </Text>
                    ) : null}
                </GlassCard>

                <ActionButton onPress={() => router.push('/telemetry')} variant="secondary">
                    Abrir Telemetry Debug
                </ActionButton>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: D.bg },
    scroll: { flex: 1 },
    // Sem `tabBarClearance`: esta tela vive fora do grupo `(tabs)` e a barra
    // flutuante não passa por cima dela.
    content: { paddingHorizontal: 20, paddingBottom: space.s6 },
    screenEyebrow: {
        ...typography.label,
        color: D.textTert,
        letterSpacing: 0.08 * 11,
        textTransform: 'uppercase',
        marginTop: 16,
    },
    screenTitle: {
        ...typography.h3,
        color: D.text,
        marginBottom: 16,
    },
    statusMessage: {
        ...typography.micro,
        marginTop: 4,
        lineHeight: 18,
    },
});
