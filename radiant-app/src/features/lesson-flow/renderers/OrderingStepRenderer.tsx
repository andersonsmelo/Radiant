import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { OrderingPayload } from '../../../types/learningActivity';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';
import { decodeInteractionIdSequence, encodeInteractionIdSequence } from './InteractionAnswerValue';

type OrderingStepRendererProps = {
    payload: OrderingPayload;
    value?: string;
    onChange: (value: string) => void;
    submitted?: boolean;
    confirmationLabel?: string;
};

export function OrderingStepRenderer({ payload, value, onChange, submitted = false, confirmationLabel = 'Continuar' }: OrderingStepRendererProps) {
    // Arrows beside the label leave a column so narrow that large text breaks words into syllables.
    const stacked = useWindowDimensions().fontScale >= 1.3;
    const decoded = decodeInteractionIdSequence(value);
    const itemIds = payload.items.map((item) => item.id);
    const currentOrder = decoded.length === itemIds.length && decoded.every((id) => itemIds.includes(id))
        ? decoded
        : itemIds;

    const move = (index: number, direction: -1 | 1) => {
        const destination = index + direction;
        if (submitted || destination < 0 || destination >= currentOrder.length) {
            return;
        }
        const next = [...currentOrder];
        [next[index], next[destination]] = [next[destination], next[index]];
        onChange(encodeInteractionIdSequence(next));
    };

    return (
        <View style={styles.activity}>
            <Text style={styles.prompt}>{payload.prompt}</Text>
            <View style={styles.list}>
                {currentOrder.map((id, index) => {
                    const item = payload.items.find((candidate) => candidate.id === id);
                    if (!item) return null;
                    const first = index === 0;
                    const last = index === currentOrder.length - 1;
                    return (
                        <View key={id} style={[styles.itemRow, stacked && styles.itemRowStacked]}>
                            <Text style={styles.position}>{index + 1}</Text>
                            <Text style={[styles.itemLabel, stacked && styles.itemLabelStacked]}>{item.label}</Text>
                            <View style={styles.controls}>
                                <Pressable
                                    onPress={() => move(index, -1)}
                                    disabled={submitted || first}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Subir ${item.label}`}
                                    accessibilityState={{ disabled: submitted || first }}
                                    style={[styles.moveButton, (submitted || first) && styles.disabled]}
                                >
                                    <Text style={styles.moveLabel}>↑</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => move(index, 1)}
                                    disabled={submitted || last}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Descer ${item.label}`}
                                    accessibilityState={{ disabled: submitted || last }}
                                    style={[styles.moveButton, (submitted || last) && styles.disabled]}
                                >
                                    <Text style={styles.moveLabel}>↓</Text>
                                </Pressable>
                            </View>
                        </View>
                    );
                })}
            </View>
            <Pressable
                disabled={submitted}
                onPress={() => { if (!submitted) onChange(encodeInteractionIdSequence(currentOrder)); }}
                accessibilityRole="button"
                accessibilityLabel="Selecionar esta ordem"
                accessibilityHint={submitted ? 'Resposta já conferida. Leia o retorno e continue.' : `Seleciona a sequência atual. Você confirma em ${confirmationLabel}.`}
                accessibilityState={{ selected: value !== undefined, disabled: submitted }}
                style={styles.selectOrder}
            >
                <Text style={styles.selectOrderLabel}>
                    {value === undefined ? 'Selecionar esta ordem' : 'Ordem selecionada'}
                </Text>
            </Pressable>
        </View>
    );
}

const galaxy = semanticColors.galaxy;

const styles = StyleSheet.create({
    activity: { gap: space.s3 },
    prompt: { ...typography.h3, color: galaxy.textPrimary },
    list: { gap: space.s2 },
    itemRow: {
        minHeight: 60,
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.s2,
        paddingLeft: space.s3,
        borderRadius: radius.rMd,
        borderWidth: 1,
        borderColor: galaxy.border,
        backgroundColor: galaxyColors.surface,
        overflow: 'hidden',
    },
    position: { ...typography.bodyStrong, color: galaxy.statusInformation },
    itemLabel: { ...typography.bodyRegular, color: galaxy.textPrimary, flex: 1, paddingVertical: space.s2 },
    itemRowStacked: { flexDirection: 'column', alignItems: 'stretch', paddingTop: space.s2 },
    itemLabelStacked: { flex: 0 },
    controls: { flexDirection: 'row' },
    moveButton: {
        minWidth: 44,
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderColor: galaxy.border,
    },
    disabled: { opacity: 0.32 },
    moveLabel: { ...typography.bodyStrong, color: galaxy.textPrimary },
    selectOrder: {
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: space.s3,
        borderRadius: radius.rMd,
        borderWidth: 1,
        borderColor: galaxy.statusInformation,
        backgroundColor: galaxyColors.surfaceActive,
    },
    selectOrderLabel: { ...typography.bodyStrong, color: galaxy.textPrimary },
});
