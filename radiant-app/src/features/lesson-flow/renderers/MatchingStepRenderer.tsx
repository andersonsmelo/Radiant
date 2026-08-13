import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MatchingPayload } from '../../../types/learningActivity';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';
import { decodeInteractionIdSequence, encodeInteractionIdSequence } from './InteractionAnswerValue';

type MatchingStepRendererProps = {
    payload: MatchingPayload;
    value?: string;
    onChange: (value: string) => void;
};

export function MatchingStepRenderer({ payload, value, onChange }: MatchingStepRendererProps) {
    const validIds = new Set(payload.pairs.map((pair) => pair.id));
    const selectedRightIds = decodeInteractionIdSequence(value)
        .filter((id, index, all) => validIds.has(id) && all.indexOf(id) === index)
        .slice(0, payload.pairs.length);
    const currentIndex = selectedRightIds.length;
    const currentLeft = payload.pairs[currentIndex];
    const usedIds = new Set(selectedRightIds);

    return (
        <View style={styles.activity}>
            <Text style={styles.prompt}>{payload.prompt}</Text>

            {selectedRightIds.length > 0 ? (
                <View style={styles.completedList}>
                    <Text style={styles.sectionTitle}>Associações escolhidas</Text>
                    {selectedRightIds.map((rightId, index) => {
                        const left = payload.pairs[index];
                        const right = payload.pairs.find((pair) => pair.id === rightId);
                        return (
                            <Text key={`${left.id}:${rightId}`} style={styles.completedPair}>
                                {left.left} — {right?.right}
                            </Text>
                        );
                    })}
                </View>
            ) : null}

            {currentLeft ? (
                <View style={styles.currentPair}>
                    <Text style={styles.sectionTitle}>Agora associe: {currentLeft.left}</Text>
                    {payload.pairs.filter((pair) => !usedIds.has(pair.id)).map((right) => (
                        <Pressable
                            key={right.id}
                            onPress={() => onChange(encodeInteractionIdSequence([...selectedRightIds, right.id]))}
                            accessibilityRole="button"
                            accessibilityLabel={`Associar ${currentLeft.left} a ${right.right}`}
                            accessibilityHint="Forma este par sem arrastar. Você confirma a atividade em Continuar."
                            style={styles.option}
                        >
                            <Text style={styles.optionLabel}>{right.right}</Text>
                        </Pressable>
                    ))}
                </View>
            ) : (
                <Text style={styles.completeMessage}>Todas as associações foram selecionadas.</Text>
            )}

            {selectedRightIds.length > 0 ? (
                <Pressable
                    onPress={() => onChange(encodeInteractionIdSequence(selectedRightIds.slice(0, -1)))}
                    accessibilityRole="button"
                    accessibilityLabel="Desfazer última associação"
                    style={styles.undoButton}
                >
                    <Text style={styles.undoLabel}>Desfazer última associação</Text>
                </Pressable>
            ) : null}
        </View>
    );
}

const galaxy = semanticColors.galaxy;

const styles = StyleSheet.create({
    activity: { gap: space.s3 },
    prompt: { ...typography.h3, color: galaxy.textPrimary },
    completedList: { gap: space.s1 },
    sectionTitle: { ...typography.bodyStrong, color: galaxy.textPrimary },
    completedPair: {
        ...typography.bodyRegular,
        color: galaxy.statusSuccess,
        paddingVertical: space.s1,
    },
    currentPair: { gap: space.s2 },
    option: {
        minHeight: 44,
        paddingHorizontal: space.s3,
        paddingVertical: space.s2,
        borderRadius: radius.rMd,
        borderWidth: 1,
        borderColor: galaxy.border,
        backgroundColor: galaxyColors.surface,
        justifyContent: 'center',
    },
    optionLabel: { ...typography.bodyRegular, color: galaxy.textPrimary },
    completeMessage: { ...typography.bodyStrong, color: galaxy.statusSuccess },
    undoButton: {
        minHeight: 44,
        alignSelf: 'flex-start',
        paddingHorizontal: space.s3,
        justifyContent: 'center',
        borderRadius: radius.rMd,
        borderWidth: 1,
        borderColor: galaxy.border,
    },
    undoLabel: { ...typography.caption, color: galaxy.textSecondary },
});
