import React, { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';

type GroupAreaProps = {
    label: string;
    /** Há ficha escolhida: a área se oferece para recebê-la. */
    ready: boolean;
    empty: boolean;
    onPress?: () => void;
    accessibilityLabel: string;
    testID?: string;
    children?: ReactNode;
};

/**
 * Grupo que recebe fichas e mostra o que já está dentro. O alvo de toque é o
 * cabeçalho; as fichas colocadas ficam fora dele para continuarem alcançáveis
 * pelo leitor de tela, cada uma com o seu próprio toque.
 */
export function GroupArea({ label, ready, empty, onPress, accessibilityLabel, testID, children }: GroupAreaProps) {
    return (
        <View testID={testID ? `${testID}-box` : undefined}
            style={[styles.box, ready ? styles.ready : styles.idle]}>
            <Pressable testID={testID} onPress={onPress} disabled={!onPress} accessibilityRole="button"
                accessibilityLabel={accessibilityLabel} accessibilityState={{ disabled: !onPress }} style={styles.header}>
                <Text style={styles.label}>{label}</Text>
                {ready ? <Text style={styles.hint}>Toque aqui para colocar a ficha escolhida</Text> : null}
                {empty ? <Text style={styles.empty}>Vazio</Text> : null}
            </Pressable>
            {children ? <View style={styles.items}>{children}</View> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    box: { borderRadius: radius.rLg, borderWidth: 2, backgroundColor: galaxyColors.surface, padding: space.s3, gap: space.s2 },
    idle: { borderStyle: 'dashed', borderColor: galaxyColors.borderActive },
    ready: { borderStyle: 'solid', borderColor: galaxyColors.navBlue },
    header: { minHeight: 44, justifyContent: 'center', gap: space.s1 },
    label: { ...typography.bodyStrong, color: galaxyColors.textPrimary },
    hint: { ...typography.caption, color: galaxyColors.navBlue },
    empty: { ...typography.caption, color: galaxyColors.textSecondary },
    items: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s2 },
});
