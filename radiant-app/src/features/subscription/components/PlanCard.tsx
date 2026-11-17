import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MotionPressable, usePressDescend } from '../../../ui/motion';
import { radius, space, typography } from '../../../ui/styles';
import { galaxyColors, medalColors } from '../../../ui/theme';

export type PlanCardProps = {
    title: string;
    /** Preço localizado exatamente como o StoreKit entregou. */
    price: string;
    detail: string;
    selected: boolean;
    tone: 'neutral' | 'gold';
    onPress: () => void;
    disabled?: boolean;
    testID?: string;
};

// Relevo da alternativa (`ChoiceOption`): lábio de 4 pt e face que desce 3 pt.
const LIP = 4;

/**
 * Cartão de escolha de plano da assinatura. Selecionado, a borda e o lábio
 * tomam o tom do plano (ouro no anual, azul no mensal); em repouso, os dois
 * ficam neutros.
 */
export function PlanCard({ title, price, detail, selected, tone, onPress, disabled = false, testID }: PlanCardProps) {
    const descend = usePressDescend(LIP - 1, disabled);
    const gold = tone === 'gold';
    const border = !selected ? galaxyColors.border : gold ? medalColors.gold.face : galaxyColors.navBlue;
    const lip = !selected ? galaxyColors.backgroundAlt : gold ? medalColors.gold.lip : medalColors.unit.lip;

    return (
        <View style={styles.relief}>
            <View testID="plan-card-lip" pointerEvents="none" style={[styles.lip, { backgroundColor: lip }]} />
            <MotionPressable
                testID={testID}
                onPress={onPress}
                onPressIn={descend.onPressIn}
                onPressOut={descend.onPressOut}
                disabled={disabled}
                accessibilityRole="radio"
                accessibilityLabel={`${title}, ${price}, ${detail}`}
                accessibilityState={{ selected, disabled }}
                style={[styles.face, { backgroundColor: selected ? galaxyColors.surfaceActive : galaxyColors.surface, borderColor: border }, descend.style]}
            >
                <Text style={[styles.title, gold && styles.goldTitle]}>{title}</Text>
                <Text style={styles.price}>{price}</Text>
                <Text style={styles.detail}>{detail}</Text>
            </MotionPressable>
        </View>
    );
}

const styles = StyleSheet.create({
    // `flexGrow`, e não `flex: 1`: empilhado, dentro da rolagem, `flex: 1` zera a altura.
    relief: { flexGrow: 1, paddingBottom: LIP },
    lip: { position: 'absolute', top: LIP, bottom: 0, left: 0, right: 0, borderRadius: radius.rLg },
    face: {
        flexGrow: 1,
        minHeight: 112,
        gap: space.s1,
        borderWidth: 2,
        borderRadius: radius.rLg,
        padding: space.s3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: { ...typography.bodyStrong, color: galaxyColors.textPrimary, textAlign: 'center' },
    goldTitle: { color: medalColors.gold.face },
    price: { ...typography.h3, color: galaxyColors.textPrimary, textAlign: 'center' },
    detail: { ...typography.caption, color: galaxyColors.textSecondary, textAlign: 'center' },
});
