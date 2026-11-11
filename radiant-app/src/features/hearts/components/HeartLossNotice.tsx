import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HeartIcon } from '../../../ui/components/HudIcons';
import { hudLabelTones } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';

/** Quanto o aviso de vida perdida (e, na aula, o selo de sequência) fica visível. */
export const TOP_NOTICE_MS = 2400;

/**
 * Aviso de vida perdida (FILA 26): o coração esvazia com
 * `useHeartLossAnimation` e o texto diz o que aconteceu. Com "Reduzir
 * movimento" o coração aparece vazio, parado, e o texto é o mesmo. A aula e a
 * avaliação usam o mesmo aviso, e o som da vida só toca junto dele.
 */
export function HeartLossNotice({ testID }: { testID: string }) {
    return (
        <View testID={testID} style={styles.heartLoss}
            accessible accessibilityRole="text" accessibilityLabel="Você perdeu uma vida">
            <HeartIcon size={20} filled={false} losing />
            <Text style={styles.heartLossText}>Menos 1 vida</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    heartLoss: { flexDirection: 'row', alignItems: 'center', gap: space.s1 },
    heartLossText: { ...typography.caption, lineHeight: undefined, color: hudLabelTones.hearts },
});
