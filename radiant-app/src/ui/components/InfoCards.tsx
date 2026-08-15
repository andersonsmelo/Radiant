import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { galaxyColors } from '../theme';
import { radius, space, typography } from '../styles';

// Cartão de informação em linhas rótulo/valor, extraído da `ProgressScreen`
// quando o console de desenvolvimento saiu dela (ADR-2026-08-15). As duas telas
// resultantes — o Perfil do aluno e o console — mostram o mesmo formato de
// informação, e duplicar quatro componentes para isso deixaria os dois lados
// livres para divergirem em silêncio.
//
// Nenhum valor próprio de cor vive aqui: tudo vem de `galaxyColors`, a paleta
// escura. A paleta clara primitiva não é importada, e o
// `identity-palette-contract` cobre esta regra na origem.

const D = {
    surface: galaxyColors.surface,
    surfaceAlt: galaxyColors.surfaceActive,
    border: galaxyColors.border,
    text: galaxyColors.textPrimary,
    textSec: galaxyColors.textSecondary,
    primary: galaxyColors.ctaGradientStart,
};

export function GlassCard({
    children,
    style,
}: {
    children: React.ReactNode;
    style?: object;
}) {
    return <View style={[styles.card, style]}>{children}</View>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
    return <Text style={styles.cardTitle}>{children}</Text>;
}

export function CardRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>{label}</Text>
            <Text style={styles.cardRowValue}>{value}</Text>
        </View>
    );
}

export function ActionButton({
    onPress,
    disabled,
    variant = 'primary',
    children,
}: {
    onPress: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'ghost';
    children: React.ReactNode;
}) {
    const bg =
        variant === 'primary'
            ? D.primary
            : variant === 'secondary'
              ? D.surfaceAlt
              : 'transparent';
    const border = variant === 'ghost' ? D.border : 'transparent';

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityState={{ disabled: !!disabled }}
            style={[
                styles.btn,
                { backgroundColor: bg, borderColor: border, opacity: disabled ? 0.45 : 1 },
            ]}
            activeOpacity={0.75}
        >
            <Text style={[styles.btnText, variant !== 'primary' && { color: D.text }]}>
                {children}
            </Text>
        </TouchableOpacity>
    );
}

const cardRowValue = {
    ...typography.micro,
    color: D.text,
    flexShrink: 1,
    textAlign: 'right',
} as const;

/** Estilos que as telas consumidoras compõem por fora dos componentes. */
export const infoCardStyles = StyleSheet.create({
    cardRowValue,
    btnGroup: {
        gap: space.s2,
        marginTop: space.s1,
    },
});

const styles = StyleSheet.create({
    card: {
        backgroundColor: D.surface,
        borderRadius: radius.rLg,
        borderWidth: 1,
        borderColor: D.border,
        padding: space.s3,
        marginBottom: space.s3,
        gap: space.s1,
    },
    cardTitle: {
        ...typography.bodyStrong,
        color: D.text,
        marginBottom: 4,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardRowLabel: {
        ...typography.micro,
        color: D.textSec,
    },
    cardRowValue,
    btn: {
        height: 48,
        borderRadius: radius.rMd,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    btnText: {
        ...typography.bodyStrong,
        color: '#FFFFFF',
    },
});
