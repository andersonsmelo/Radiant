import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useScalePop } from '../../../ui/motion';
import { radius, space, typography } from '../../../ui/styles';
import { galaxyColors, hudLabelTones } from '../../../ui/theme';
import { comboLabel, type ComboMilestone } from '../services/lessonCombo';

/**
 * Selo de respostas certas seguidas, no topo da aula. O número vem escrito: a
 * cor e o salto de entrada só acompanham. Com "Reduzir movimento", o selo
 * aparece parado (`useScalePop` cuida disso).
 */
export function ComboBadge({ milestone }: { milestone: ComboMilestone }) {
    const { animateIn, style } = useScalePop();
    useEffect(() => { animateIn(); }, [animateIn, milestone]);

    return (
        <Animated.View testID="combo-badge" style={[styles.badge, style]}
            accessible accessibilityRole="text" accessibilityLabel={`${milestone} respostas certas seguidas`}>
            <Text style={styles.label}>{comboLabel(milestone)}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: space.s2,
        paddingVertical: space.s0,
        borderRadius: radius.rXl,
        borderWidth: 1,
        borderColor: galaxyColors.border,
        backgroundColor: galaxyColors.surfaceActive,
    },
    // Laranja da sequência do HUD: 6,38:1 sobre a pílula `#232733`.
    label: { ...typography.caption, lineHeight: undefined, color: hudLabelTones.streak },
});
