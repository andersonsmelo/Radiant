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

/**
 * Ordem em que a coluna da direita aparece: fixa pelo conteúdo, para não
 * mudar entre renderizações, e nunca igual à ordem dos pares. Na ordem dos
 * pares, a resposta certa era sempre o primeiro botão.
 */
export function matchingDisplayOrder(pairs: MatchingPayload['pairs']): MatchingPayload['pairs'] {
    const hash = (text: string) => {
        let value = 2166136261;
        for (let index = 0; index < text.length; index += 1) {
            value = Math.imul(value ^ text.charCodeAt(index), 16777619);
        }
        return value >>> 0;
    };
    const shown = [...pairs].sort((a, b) => hash(a.id + a.right) - hash(b.id + b.right) || a.id.localeCompare(b.id));
    const sameAsPairs = shown.every((pair, index) => pair.id === pairs[index].id);
    return sameAsPairs && shown.length > 1 ? [...shown.slice(1), shown[0]] : shown;
}

export function MatchingStepRenderer({ payload, value, onChange }: MatchingStepRendererProps) {
    const validIds = new Set(payload.pairs.map((pair) => pair.id));
    const selectedRightIds = decodeInteractionIdSequence(value)
        .filter((id, index, all) => validIds.has(id) && all.indexOf(id) === index)
        .slice(0, payload.pairs.length);
    const currentIndex = selectedRightIds.length;
    const currentLeft = payload.pairs[currentIndex];
    const usedIds = new Set(selectedRightIds);
    const total = payload.pairs.length;
    // Com uma opção sobrando, o último par já está decidido: entra junto com a escolha.
    const choose = (rightId: string) => {
        const next = [...selectedRightIds, rightId];
        const remaining = payload.pairs.filter((pair) => !next.includes(pair.id));
        onChange(encodeInteractionIdSequence(remaining.length === 1 ? [...next, remaining[0].id] : next));
    };
    // E o desfazer tira os dois, para não parar num passo de uma opção só.
    const undo = () => {
        const back = selectedRightIds.length === total && total > 1 ? 2 : 1;
        onChange(encodeInteractionIdSequence(selectedRightIds.slice(0, -back)));
    };

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
                                {left.left}: {right?.right}
                            </Text>
                        );
                    })}
                </View>
            ) : null}

            {currentLeft ? (
                <View style={styles.currentPair}>
                    <Text style={styles.sectionTitle}>Agora associe: {currentLeft.left}</Text>
                    {matchingDisplayOrder(payload.pairs).filter((pair) => !usedIds.has(pair.id)).map((right) => (
                        <Pressable
                            key={right.id}
                            onPress={() => choose(right.id)}
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
                    onPress={undo}
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
        color: galaxy.textPrimary,
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
    completeMessage: { ...typography.bodyStrong, color: galaxy.textPrimary },
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
