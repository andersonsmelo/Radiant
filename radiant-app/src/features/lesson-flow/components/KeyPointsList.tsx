import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { radius, space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';

/** Os dois ou três pontos que resumem o conceito, em lista curta sob o corpo. */
export function KeyPointsList({ points }: { points: readonly string[] }) {
    if (points.length === 0) return null;

    return (
        <View testID="lesson-key-points" accessibilityRole="list" style={styles.list}>
            {points.map((point, index) => (
                <View key={index} style={styles.item}>
                    <View style={styles.marker} accessibilityElementsHidden importantForAccessibility="no" />
                    <Text style={styles.text}>{point}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    list: { gap: space.s2 },
    item: { flexDirection: 'row', alignItems: 'flex-start', gap: space.s2 },
    // Marcador desenhado, não caractere de texto; alinha com a primeira linha.
    marker: { width: 6, height: 6, borderRadius: radius.rSm, marginTop: space.s1, backgroundColor: galaxyColors.textSecondary },
    text: { ...typography.bodyRegular, lineHeight: undefined, flex: 1, color: galaxyColors.textPrimary },
});
