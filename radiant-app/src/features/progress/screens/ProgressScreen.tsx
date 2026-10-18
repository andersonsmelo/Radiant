import React, { useCallback, useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import {
    STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
    useShadowCheckpoint,
} from '../../student-checkpoints/useShadowCheckpoint';

import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { GamificationService } from '../../gamification/services/GamificationService';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { LearningStatsService, type LearningStatsSnapshot } from '../services/LearningStatsService';
import { LearningAttemptsRepository } from '../services/LearningAttemptsRepository';
import type { GamificationSnapshot } from '../../../types/gamification';
import { TelemetryService } from '../../telemetry/TelemetryService';
import { productCopy } from '../../../ui/copy/pt-BR';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { space, tabBarClearance, typography } from '../../../ui/styles';
import { StreakIcon, XpIcon } from '../../../ui/components/HudIcons';

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
//
// `GlassCard`, `CardTitle`, `CardRow` e `ActionButton` viviam aqui e passaram
// para `src/ui/components/InfoCards.tsx` quando o console de desenvolvimento
// saiu desta tela: as duas telas resultantes usam o mesmo formato, e duplicá-lo
// deixaria os dois lados livres para divergirem em silêncio.
//
// Conta e sincronização, Ajuda e informações e "Rever apresentação" também
// moravam aqui. Saíram em 2026-10-16 para a tela Configuração (FILA 32): o
// Perfil, que embute esta tela, guarda só identidade, missões e progresso.

function StreakCalendarCard({ streakDays }: { streakDays: number }) {
    return <View style={styles.metricCard}><Text style={styles.sectionLabel}>SEQUÊNCIA ATUAL</Text><View style={styles.metricValueRow}><StreakIcon size={24} /><Text style={styles.streakNumber}>{streakDays} {streakDays === 1 ? 'dia' : 'dias'}</Text></View><Text style={styles.streakSub}>O calendário por dia será exibido quando o histórico local estiver disponível.</Text></View>;
}

function AccuracyChartCard({ stats }: { stats: LearningStatsSnapshot | null }) {
    const accuracy = stats?.accuracyPercent ?? null;

    if (accuracy === null) {
        return <View style={styles.metricCard} accessibilityLabel={productCopy.noEvaluatedAttempts}><Text style={styles.sectionLabel}>PRECISÃO</Text><Text style={styles.accuracyNumber}>—</Text><Text style={styles.streakSub}>{productCopy.noEvaluatedAttempts}</Text></View>;
    }

    // A precisão recente só é dita quando difere da total; repetir o mesmo
    // número em duas linhas não informa nada.
    const recent = stats?.recentAccuracyPercent ?? null;
    const subtitle =
        recent !== null && recent !== accuracy
            ? `${recent}% nos últimos 7 dias`
            : 'Sobre todas as tentativas avaliadas.';

    return (
        <View style={styles.metricCard} accessibilityLabel={`Precisão de ${accuracy} por cento`}>
            <Text style={styles.sectionLabel}>PRECISÃO</Text>
            <Text style={styles.accuracyNumber}>{accuracy}%</Text>
            <Text style={styles.streakSub}>{subtitle}</Text>
        </View>
    );
}

function StatsGrid({ totalXp, dueCount }: { totalXp: number; dueCount: number }) {
    return (
        <View style={styles.statsGridNew}>
            {/* TOTAL XP */}
            <View style={styles.statsGridCard}>
                <Text style={styles.statsGridLabel}>TOTAL XP</Text>
                <View style={styles.metricValueRow}><XpIcon size={20} value={totalXp} /><Text style={styles.statsGridValue}>{totalXp}</Text></View>
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

function TopicsMasteredList({
    stats,
    topicLabels,
}: {
    stats: LearningStatsSnapshot | null;
    topicLabels: Record<string, string>;
}) {
    const topics = stats?.topicMastery ?? [];

    return (
        <View>
            {/* Section header */}
            <View style={[styles.rowBetween, { marginBottom: 10 }]}>
                <Text style={styles.sectionLabel}>TÓPICOS</Text>
            </View>

            {topics.length === 0 ? (
                <Text style={styles.streakSub}>{productCopy.noLearningEvidence}</Text>
            ) : (
                topics.map((topic) => (
                    <View key={topic.topicId} style={styles.rowBetween}>
                        {/* O rótulo cai para o id só se a unidade sumir da trilha —
                            preferível a esconder a linha e perder o dado. */}
                        <Text style={styles.streakSub}>{topicLabels[topic.topicId] ?? topic.topicId}</Text>
                        <Text style={styles.streakSub}>
                            {topic.accuracyPercent}% · {topic.completedCases}
                            {topic.completedCases === 1 ? ' lição' : ' lições'}
                        </Text>
                    </View>
                ))
            )}
        </View>
    );
}

// ── Tela principal ───────────────────────────────────────────────

/**
 * `embedded` — a tela renderiza só o corpo, sem `SafeAreaView` nem `ScrollView`.
 *
 * A aba Perfil agrega esta tela e a outra numa rolagem só. Duas `ScrollView`
 * aninhadas na vertical brigam pelo gesto: a de dentro consome o arrasto e a de
 * fora trava, e o aluno não alcança o que está embaixo. Quem rola é o Perfil.
 */
type EmbeddableProps = { embedded?: boolean };

export default function ProgressScreen({ embedded = false }: EmbeddableProps) {
    const [snapshot, setSnapshot] = useState<GamificationSnapshot | null>(null);
    const [dueCount, setDueCount] = useState(0);
    const [learningStats, setLearningStats] = useState<LearningStatsSnapshot | null>(null);
    const [topicLabels, setTopicLabels] = useState<Record<string, string>>({});

    useShadowCheckpoint({
        surface: 'progress',
        flowId: 'progress-v1',
        contentVersion: STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
        cursorId: 'progress',
        compatibleCursorIds: ['progress'],
        progressPercent: 0,
        completedStepCount: 0,
        totalStepCount: 1,
    });

    const load = useCallback(async () => {
        try {
            await LessonCatalogService.bootstrap();

            const [gamificationSnapshot, reviewDueCount] = await Promise.all([
                GamificationService.getSnapshot(),
                SpacedRepetitionService.getDueCount(),
            ]);

            setSnapshot(gamificationSnapshot);
            setDueCount(reviewDueCount);
        } catch (error) {
            console.error('[ProgressScreen] Failed to load progress data:', error);
        }

        // Bloco próprio: acurácia é informação secundária e uma falha aqui não
        // pode zerar XP, sequência e revisões, que já foram carregados acima.
        try {
            const stats = await new LearningStatsService({
                getAttempts: () => LearningAttemptsRepository.getAll(),
            }).getSnapshot();
            setLearningStats(stats);

            if (stats.topicMastery.length > 0) {
                const journey = await JourneyProgressService.getSnapshot();
                setTopicLabels(
                    Object.fromEntries(journey.track.units.map((unit) => [unit.id, unit.title]))
                );
            }
        } catch (error) {
            console.error('[ProgressScreen] Failed to load learning stats:', error);
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

    const body = (
        <>
                {/* ── Header ── */}
                <Text style={styles.screenEyebrow}>SEU PROGRESSO</Text>
                <Text style={styles.screenTitle} accessibilityRole="header">Progresso</Text>

                {/* ── Streak Calendar ── */}
                <StreakCalendarCard streakDays={snapshot?.streakDays ?? 0} />

                {/* ── Accuracy Chart ── */}
                <AccuracyChartCard stats={learningStats} />

                {/* ── 2×2 Stats Grid ── */}
                <StatsGrid totalXp={snapshot?.totalXp ?? 0} dueCount={dueCount} />

                {/* ── Topics Mastered ── */}
                <View style={styles.metricCard}>
                    <TopicsMasteredList stats={learningStats} topicLabels={topicLabels} />
                </View>
        </>
    );

    if (embedded) return body;

    return (
        <SafeAreaView style={styles.root} edges={['top']}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {body}
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
        ...typography.label,
        color: D.textTert,
        letterSpacing: 0.08 * 11,
        textTransform: 'uppercase',
        marginTop: 16,
    },
    screenTitle: {
        ...typography.h3,
        color: D.text,
        letterSpacing: -0.02 * 24,
        marginTop: 2,
        marginBottom: 20,
    },

    // ── White card (shared base) ──
    // Chamava-se `whiteCard`, herança da era clara, e o nome mentia: o fundo
    // sempre foi `galaxyColors.surface` — branco a 5% sobre o fundo escuro, não
    // um card claro. O nome antigo fazia qualquer leitor suspeitar de um defeito
    // de identidade que não existe aqui.
    metricCard: {
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
        ...typography.h2,
        color: D.text,
    },
    metricValueRow: { flexDirection: 'row', alignItems: 'center', gap: space.s1 },
    streakSub: {
        ...typography.micro,
        color: D.textSec,
        marginTop: 2,
    },

    // ── Accuracy chart ──
    sectionLabel: {
        ...typography.label,
        color: D.textTert,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    accuracyNumber: {
        ...typography.h2,
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
        ...typography.label,
        color: D.textTert,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    statsGridValue: {
        ...typography.h3,
        color: D.text,
    },
    statsGridSub: {
        ...typography.micro,
        color: D.textSec,
        marginTop: 2,
    },
});
