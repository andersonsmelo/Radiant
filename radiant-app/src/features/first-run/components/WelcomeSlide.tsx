import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PixelIllustration } from '../../../ui/characters/PixelIllustration';
import { space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';
import { useLargeTextLayout } from '../../../ui/accessibility/useLargeTextLayout';

/** A apresentação não agrupa os controles seguintes num único nó de acessibilidade. */
export function WelcomeSlide() {
    const largeText = useLargeTextLayout();
    return (
        <View style={[styles.introduction, largeText && styles.stacked]}>
            <PixelIllustration state="happy" size="sm" accessibilityLabel="Pixel acenando" />
            <Text style={[styles.greeting, largeText && styles.naturalText]}>Oi, eu sou o Pixel. Vamos tirar sua primeira radiografia.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    introduction: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
    stacked: { flexDirection: 'column', alignItems: 'stretch' },
    naturalText: { lineHeight: undefined, flexShrink: 0 },
    greeting: { ...typography.bodyStrong, color: galaxyColors.textPrimary, flexShrink: 1 },
});
