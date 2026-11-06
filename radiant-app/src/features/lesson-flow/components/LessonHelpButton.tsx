import React, { useState } from 'react';
import { AccessibilityInfo, Pressable, StyleSheet, Text } from 'react-native';
import { space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';

type LessonHelpButtonProps = {
    /** A pista autoral do item: orienta sem entregar o gabarito. */
    help: string;
    /** Depois de responder, a pista não é mais oferecida; a que já foi aberta continua na tela. */
    locked?: boolean;
    onReveal?: () => void;
};

/** Pista opcional, discreta, pedida pelo aluno antes de responder. */
export function LessonHelpButton({ help, locked = false, onReveal }: LessonHelpButtonProps) {
    const [open, setOpen] = useState(false);

    if (open) return <Text testID="lesson-help-text" style={styles.help}>{`Pista: ${help}`}</Text>;
    if (locked) return null;

    return (
        <Pressable accessibilityRole="button" accessibilityLabel="Ver pista"
            accessibilityHint="Mostra uma pista, sem dar a resposta" style={styles.button}
            onPress={() => {
                setOpen(true);
                onReveal?.();
                // O foco do leitor de tela fica no botão que sumiu: a pista é dita.
                AccessibilityInfo.announceForAccessibility(`Pista: ${help}`);
            }}>
            <Text style={styles.label}>Ver pista</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    // Alvo de toque de 44 pt, sem cara de ação principal.
    button: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center', paddingRight: space.s3 },
    label: { ...typography.bodyStrong, lineHeight: undefined, color: galaxyColors.navBlue },
    help: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textSecondary },
});
