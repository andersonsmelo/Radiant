import { useRef } from 'react';
import { AccessibilityInfo, findNodeHandle, ScrollView, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppButton } from '../../../components/ui/AppButton';
import { SurfaceCard } from '../../../components/ui/SurfaceCard';
import { galaxyColors } from '../../../ui/theme';
import { layout, space, typography } from '../../../ui/styles';

export const CONTENT_UPDATED_TITLE = 'Este conteúdo foi atualizado';
export const CONTENT_UPDATED_BODY = 'Seus dados e conquistas foram preservados. Esta aula não está mais disponível. Conheça a nova trilha.';

export function ContentUpdatedScreen({ onOpenTrail, review = false }: { onOpenTrail?: () => void; review?: boolean }) {
    const { fontScale } = useWindowDimensions();
    const title = useRef<Text>(null);
    const focused = useRef(false);
    return <SafeAreaView style={styles.root}>
        <ScrollView contentContainerStyle={[layout.container, styles.content]} testID="content-updated-screen">
            <SurfaceCard variant="galaxy" contentStyle={styles.card}>
                <Text key={`title-${fontScale}`} ref={title} accessibilityRole="header" style={styles.title} onLayout={() => {
                    if (focused.current) return;
                    focused.current = true;
                    const target = findNodeHandle(title.current);
                    if (target != null) AccessibilityInfo.setAccessibilityFocus(target);
                    AccessibilityInfo.announceForAccessibility(CONTENT_UPDATED_TITLE);
                }}>{CONTENT_UPDATED_TITLE}</Text>
                <Text key={`body-${fontScale}`} style={styles.body}>{review
                    ? 'Seus dados e conquistas foram preservados. Não há itens de revisão disponíveis no catálogo atual. Conheça a nova trilha.'
                    : CONTENT_UPDATED_BODY}</Text>
                <AppButton onPress={onOpenTrail ?? (() => router.replace('/(tabs)'))}>Ver a nova trilha</AppButton>
            </SurfaceCard>
        </ScrollView>
    </SafeAreaView>;
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: galaxyColors.background },
    content: { flexGrow: 1, justifyContent: 'center', padding: space.s4 },
    card: { gap: space.s4 },
    title: { ...typography.h2, color: galaxyColors.textPrimary },
    body: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
});
