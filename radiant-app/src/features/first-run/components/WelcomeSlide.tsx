import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PixelIllustration } from '../../../ui/characters/PixelIllustration';
import type { CharacterSize } from '../../../ui/characters/types';
import { space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';

interface WelcomeSlideProps {
    title: string;
    body: string;
    /** Texto legal opcional, menor e secundário. */
    footnote?: string;
    pixelSize: CharacterSize;
    pixelAccessibilityLabel: string;
    stepLabel: string;
}

export function WelcomeSlide({
    title,
    body,
    footnote,
    pixelSize,
    pixelAccessibilityLabel,
    stepLabel,
}: WelcomeSlideProps) {
    // `accessible` no container colapsa a subárvore inteira num único nó de
    // acessibilidade no iOS, e o `accessibilityLabel` substitui tudo que
    // estava dentro. Sem compor o rótulo aqui, VoiceOver só ouve o
    // `stepLabel` e perde o título, o corpo e — na terceira tela — o aviso
    // legal. O rótulo do grupo reconstrói essa cópia, na ordem em que é lida
    // visualmente. Segmentos que já terminam em pontuação final (`.`, `!`,
    // `?`) só levam um espaço até o próximo — juntar com `'. '` também nesses
    // casos duplicaria o ponto e VoiceOver leria a pausa duas vezes.
    const groupLabel = [stepLabel, title, body, footnote]
        .filter(Boolean)
        .reduce((label, part) => {
            if (!label) {
                return part as string;
            }
            const separator = /[.!?]$/.test(label) ? ' ' : '. ';
            return `${label}${separator}${part}`;
        }, '');

    return (
        <View style={styles.slide} accessible accessibilityLabel={groupLabel}>
            <PixelIllustration
                state="guide"
                size={pixelSize}
                tier="starter"
                accessibilityLabel={pixelAccessibilityLabel}
            />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.body}>{body}</Text>
            {footnote ? <Text style={styles.footnote}>{footnote}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    slide: {
        alignItems: 'center',
        gap: space.s2,
        paddingHorizontal: space.s3,
    },
    title: {
        ...typography.h2,
        color: galaxyColors.textPrimary,
        textAlign: 'center',
    },
    body: {
        ...typography.bodyRegular,
        color: galaxyColors.textSecondary,
        textAlign: 'center',
    },
    footnote: {
        ...typography.micro,
        color: galaxyColors.textSecondary,
        textAlign: 'center',
        marginTop: space.s2,
    },
});
