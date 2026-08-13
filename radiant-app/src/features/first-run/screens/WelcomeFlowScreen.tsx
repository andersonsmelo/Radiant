import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WelcomeSlide } from '../components/WelcomeSlide';
import type { FirstRunExitReason } from '../first-run.types';
import { AppButton } from '../../../components/ui/AppButton';
import type { CharacterSize } from '../../../ui/characters/types';
import { space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';
import {
    STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
    useShadowCheckpoint,
} from '../../student-checkpoints/useShadowCheckpoint';
import { useActiveCheckpoint } from '../../student-checkpoints/useActiveCheckpoint';

const FIRST_RUN_CURSOR_IDS = ['slide-1', 'slide-2', 'slide-3'];

interface SlideSpec {
    title: string;
    body: string;
    footnote?: string;
    cta: string;
    pixelSize: CharacterSize;
    pixelAccessibilityLabel: string;
}

// Cópia alinhada à ficha das lojas (docs/store/textos-loja-pt-BR.md). Alterar
// aqui sem alterar lá cria divergência entre o app e o que a revisão de loja lê.
const SLIDES: SlideSpec[] = [
    {
        title: 'Oi, eu sou o Pixel.',
        body: 'Vou estudar radiologia com você, em sessões curtas e no seu ritmo.',
        cta: 'Continuar',
        pixelSize: 'lg',
        pixelAccessibilityLabel: 'Pixel, o mascote do Radiant, acenando',
    },
    {
        title: 'Trilha, quiz e revisão.',
        body:
            'Você segue uma trilha guiada, responde quizzes curtos, e o que ainda não fixou volta na hora certa para revisar.',
        cta: 'Continuar',
        pixelSize: 'md',
        pixelAccessibilityLabel: 'Pixel apontando para a trilha de estudo',
    },
    {
        title: 'Funciona offline, sem conta.',
        body: 'Seu progresso fica no seu aparelho. Comece agora, sem cadastro.',
        footnote:
            'Radiant é um app educacional. Não substitui avaliação, diagnóstico ou conduta médica profissional.',
        cta: 'Começar',
        pixelSize: 'md',
        pixelAccessibilityLabel: 'Pixel pronto para começar',
    },
];

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
    resumeCursorId,
    onResumeFallback,
}: WelcomeFlowScreenProps) {
    const [index, setIndex] = useState(() => {
        const restoredIndex = resumeCursorId ? FIRST_RUN_CURSOR_IDS.indexOf(resumeCursorId) : -1;
        return restoredIndex >= 0 ? restoredIndex : 0;
    });
    const step = index + 1;
    const slide = SLIDES[index];
    const isLast = index === SLIDES.length - 1;

    useShadowCheckpoint({
        surface: 'first-run',
        flowId: 'first-run-v1',
        contentVersion: STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
        cursorId: FIRST_RUN_CURSOR_IDS[index],
        compatibleCursorIds: FIRST_RUN_CURSOR_IDS,
        progressPercent: Math.round((index / SLIDES.length) * 100),
        completedStepCount: index,
        totalStepCount: SLIDES.length,
    });

    const activeCheckpoint = useActiveCheckpoint({
        surface: 'first-run',
        flowId: 'first-run-v1',
        contentVersion: STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
        cursorId: FIRST_RUN_CURSOR_IDS[index],
        compatibleCursorIds: FIRST_RUN_CURSOR_IDS,
        progressPercent: Math.round((index / SLIDES.length) * 100),
        completedStepCount: index,
        totalStepCount: SLIDES.length,
        resumeCheckpointId,
        onRestoreFallback: onResumeFallback,
    });

    useEffect(() => {
        onStepViewed?.(step);
    }, [step, onStepViewed]);

    const handleAdvance = () => {
        if (isLast) {
            void activeCheckpoint.finish();
            onFinish('completed', step);
            return;
        }
        setIndex((current) => current + 1);
    };

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.header}>
                <Pressable
                    onPress={() => {
                        void activeCheckpoint.finish();
                        onFinish('skipped', step);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Pular apresentação"
                    hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
                    style={styles.skip}
                >
                    <Text style={styles.skipLabel}>Pular</Text>
                </Pressable>
            </View>

            <View style={styles.content}>
                <WelcomeSlide
                    title={slide.title}
                    body={slide.body}
                    footnote={slide.footnote}
                    pixelSize={slide.pixelSize}
                    pixelAccessibilityLabel={slide.pixelAccessibilityLabel}
                    stepLabel={`Tela ${step} de ${SLIDES.length}`}
                />
            </View>

            <View style={styles.footer}>
                <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                    {SLIDES.map((item, dotIndex) => (
                        <View
                            key={item.title}
                            style={[styles.dot, dotIndex === index && styles.dotActive]}
                        />
                    ))}
                </View>
                <AppButton label={slide.cta} onPress={handleAdvance} variant="galaxy" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: galaxyColors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: space.s3,
        paddingTop: space.s2,
    },
    skip: {
        // 44pt de alvo, independente do tamanho do texto: discreto no visual,
        // nunca no alvo de toque.
        minHeight: 44,
        minWidth: 44,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    skipLabel: {
        ...typography.caption,
        color: galaxyColors.textSecondary,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    footer: {
        gap: space.s3,
        paddingHorizontal: space.s3,
        paddingBottom: space.s3,
    },
    dots: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: space.s1,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: galaxyColors.textSecondary,
        opacity: 0.35,
    },
    dotActive: {
        opacity: 1,
    },
});
