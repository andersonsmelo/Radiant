import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import type { LessonDialogue, LessonDialogueLine } from '../../../types/learningActivity';
import { CastAvatar } from '../../../ui/characters/cast/CastAvatar';
import { castSpeakerName } from '../../../ui/characters/cast/castRegistry';
import { useCardEnter } from '../../../ui/motion';
import { radius, space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';

/** Quantas falas a cena mostra: pelo menos a primeira, no máximo todas. */
export function visibleDialogueLines(dialogue: LessonDialogue, visibleCount: number): LessonDialogueLine[] {
    return dialogue.lines.slice(0, Math.max(1, Math.min(visibleCount, dialogue.lines.length)));
}

/** O que o leitor de tela lê de uma fala: quem fala, depois o que diz. */
export function dialogueLineLabel(line: LessonDialogueLine): string {
    return `${castSpeakerName(line.speaker, line.name)}: ${line.text}`;
}

function DialogueBubble({ line }: { line: LessonDialogueLine }) {
    // `useCardEnter` espera a preferência de movimento e, com "Reduzir
    // movimento", põe a fala no lugar sem animar.
    const { animateIn, animatedStyle } = useCardEnter();
    useEffect(() => { animateIn(); }, [animateIn]);

    return (
        // Um nó só por fala: o retrato é decorativo aqui, porque o rótulo já
        // traz o nome de quem fala.
        <Animated.View testID="dialogue-line" style={[styles.row, animatedStyle]}
            accessible accessibilityRole="text" accessibilityLabel={dialogueLineLabel(line)}>
            <CastAvatar speaker={line.speaker} name={line.name} decorative />
            <View style={styles.bubble}>
                <Text style={styles.name}>{castSpeakerName(line.speaker, line.name)}</Text>
                <Text style={styles.text}>{line.text}</Text>
            </View>
        </Animated.View>
    );
}

type DialogueSceneProps = {
    dialogue: LessonDialogue;
    /** Quantas falas já foram reveladas. Quem conta é a tela, pelo botão do rodapé. */
    visibleCount: number;
};

/**
 * Cena em diálogo que abre ou fecha a aula. As falas aparecem uma de cada vez,
 * na ordem em que foram escritas, e ficam na tela: nada some, então a cena
 * inteira continua legível sem som e sem movimento.
 */
export function DialogueScene({ dialogue, visibleCount }: DialogueSceneProps) {
    const lines = visibleDialogueLines(dialogue, visibleCount);
    const total = dialogue.lines.length;

    return (
        <View testID="dialogue-scene" style={styles.scene}>
            {dialogue.setting ? <Text style={styles.setting}>{dialogue.setting}</Text> : null}
            {lines.map((line, index) => <DialogueBubble key={index} line={line} />)}
            {/* Diz em texto por que o botão ainda não avança de passo. */}
            {lines.length < total ? <Text style={styles.count}>{`Fala ${lines.length} de ${total}`}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    scene: { gap: space.s3 },
    setting: { ...typography.caption, lineHeight: undefined, color: galaxyColors.textSecondary },
    row: { flexDirection: 'row', alignItems: 'flex-start', gap: space.s2 },
    // Sem altura fixa nem limite de linhas: com texto ampliado o balão cresce.
    bubble: {
        flex: 1,
        gap: space.s0,
        padding: space.s2,
        borderRadius: radius.rLg,
        borderWidth: 1,
        borderColor: galaxyColors.border,
        backgroundColor: galaxyColors.surfaceActive,
    },
    name: { ...typography.caption, lineHeight: undefined, color: galaxyColors.textSecondary },
    text: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textPrimary },
    count: { ...typography.micro, lineHeight: undefined, color: galaxyColors.textSecondary },
});
