import React, { useEffect, useRef } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WelcomeSlide } from '../components/WelcomeSlide';
import type { FirstRunExitReason } from '../first-run.types';
import { AppButton } from '../../../components/ui/AppButton';
import { layout, space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';
import { isLargeTextScale } from '../../../ui/accessibility/useLargeTextLayout';
import {
    STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
    useShadowCheckpoint,
} from '../../student-checkpoints/useShadowCheckpoint';
import { useActiveCheckpoint } from '../../student-checkpoints/useActiveCheckpoint';

// IDs já persistidos continuam restauráveis; todos levam à apresentação única.
const FIRST_RUN_CURSOR_IDS = ['slide-1', 'slide-2', 'slide-3'];
const EDUCATIONAL_NOTICE = 'Radiant é um app educacional. Não substitui avaliação, diagnóstico ou conduta médica profissional.';

interface WelcomeFlowScreenProps {
    onFinish: (reason: FirstRunExitReason, step: number) => void;
    onStepViewed?: (step: number) => void;
    resumeCheckpointId?: string;
    resumeCursorId?: string;
    onResumeFallback?: () => void;
}

export default function WelcomeFlowScreen({
    onFinish,
    onStepViewed,
    resumeCheckpointId,
    onResumeFallback,
}: WelcomeFlowScreenProps) {
    const finished = useRef(false);
    const { fontScale } = useWindowDimensions();
    const largeText = isLargeTextScale(fontScale);

    const checkpointBinding = {
        surface: 'first-run' as const,
        flowId: 'first-run-v1',
        contentVersion: STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
        cursorId: FIRST_RUN_CURSOR_IDS[0],
        compatibleCursorIds: FIRST_RUN_CURSOR_IDS,
        progressPercent: 0,
        completedStepCount: 0,
        totalStepCount: 1,
    };
    useShadowCheckpoint(checkpointBinding);
    const activeCheckpoint = useActiveCheckpoint({ ...checkpointBinding, resumeCheckpointId, onRestoreFallback: onResumeFallback });

    useEffect(() => { onStepViewed?.(1); }, [onStepViewed]);

    const finish = (reason: FirstRunExitReason) => {
        if (finished.current) return;
        // A trava vem antes do trabalho assíncrono e vale também no replay de Ajustes.
        finished.current = true;
        void activeCheckpoint.finish();
        onFinish(reason, 1);
    };

    const footer = (
        <View style={styles.footer}>
            <AppButton label="Continuar" onPress={() => finish('completed')} variant="galaxy" />
            <Text style={[styles.privacy, largeText && styles.naturalText]}>
                {Platform.OS === 'ios' ? 'Sem conta. Seu progresso fica neste iPhone.' : 'Sem conta. Seu progresso fica neste aparelho.'}
            </Text>
        </View>
    );

    return (
        // O replay nasce num Modal, outra árvore nativa. O contexto React do
        // app atravessa essa fronteira, mas o provider nativo ancestral não.
        // Meça aqui também: sem initialMetrics herdadas ou inset de dispositivo.
        <SafeAreaProvider style={styles.background}>
            <SafeAreaView style={layout.screen}>
                <View style={styles.header}>
                    <Pressable
                        onPress={() => finish('skipped')}
                        accessibilityRole="button"
                        accessibilityLabel="Pular apresentação"
                        hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
                        style={styles.skip}
                    >
                        <Text style={[styles.skipLabel, largeText && styles.naturalText]}>Pular</Text>
                    </Pressable>
                </View>
                <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                    <WelcomeSlide />
                    <Text style={[styles.message, largeText && styles.naturalText]}>Conteúdo em preparação.</Text>
                    <Text style={[styles.notice, largeText && styles.naturalText]}>{EDUCATIONAL_NOTICE}</Text>
                    {largeText ? footer : null}
                </ScrollView>
                {largeText ? null : footer}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    background: { backgroundColor: galaxyColors.background },
    header: { flexDirection: 'row', justifyContent: 'flex-end' },
    skip: { minHeight: 44, minWidth: 44, alignItems: 'flex-end', justifyContent: 'center' },
    skipLabel: { ...typography.caption, color: galaxyColors.textSecondary },
    scroll: { flex: 1 },
    content: { gap: space.s3, paddingBottom: space.s3 },
    // Texto alto usa as métricas da fonte; não impõe min=max ao parágrafo.
    naturalText: { lineHeight: undefined, flexShrink: 0 },
    message: { ...typography.bodyStrong, color: galaxyColors.textPrimary },
    notice: { ...typography.micro, color: galaxyColors.textSecondary },
    footer: { gap: space.s2, paddingTop: space.s2 },
    privacy: { ...typography.micro, color: galaxyColors.textSecondary, textAlign: 'center' },
});
