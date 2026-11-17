import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { galaxyColors, medalColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';
import { planComparison } from '../planComparison';

/**
 * Comparação gratuito × assinante (F8), só com a linha em que os planos
 * diferem. Cada linha é um nó só para o leitor de tela, lido como
 * "Vidas: …. Com o Ilimitado: …", porque as duas colunas não têm ordem de
 * leitura por si.
 */
export function PlanComparison() {
    return (
        <View style={styles.card}>
            {planComparison().map(row => (
                <View key={row.label} style={styles.row} accessible
                    accessibilityLabel={`${row.label}: ${row.free}. Com o Ilimitado: ${row.plus}.`}>
                    <View style={styles.column}>
                        <Text style={styles.columnTitle}>{row.label}</Text>
                        <Text style={styles.cell}>{row.free}</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={[styles.columnTitle, styles.plus]}>Com o Ilimitado</Text>
                        <Text style={[styles.cell, styles.plusCell]}>{row.plus}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: galaxyColors.surface,
        borderRadius: radius.rLg,
        borderWidth: 1,
        borderColor: galaxyColors.border,
        padding: space.s3,
    },
    row: { flexDirection: 'row', gap: space.s3, alignItems: 'flex-start' },
    column: { flex: 1, minWidth: 0, gap: space.s1 },
    columnTitle: { ...typography.bodyStrong, color: galaxyColors.textPrimary },
    plus: { color: medalColors.gold.face },
    cell: { ...typography.caption, color: galaxyColors.textSecondary },
    plusCell: { ...typography.bodyStrong, color: galaxyColors.textPrimary },
});
