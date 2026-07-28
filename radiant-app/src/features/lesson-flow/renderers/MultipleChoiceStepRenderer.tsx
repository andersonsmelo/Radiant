import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MultipleChoicePayload } from '../../../types/lessonFlow';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';

const galaxy = semanticColors.galaxy;

type MultipleChoiceStepRendererProps = {
    payload: MultipleChoicePayload;
    selectedOptionId?: string;
    onSelect: (optionId: string) => void;
    locked: boolean;
};

export function MultipleChoiceStepRenderer({
    payload,
    selectedOptionId,
    onSelect,
    locked,
}: MultipleChoiceStepRendererProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.prompt}>{payload.prompt}</Text>
            <View style={styles.options}>
                {payload.options.map((option) => {
                    const selected = option.id === selectedOptionId;

                    return (
                        <Pressable
                            key={option.id}
                            onPress={() => onSelect(option.id)}
                            disabled={locked}
                            testID={`lesson-option-${option.id}`}
                            accessibilityRole="button"
                            accessibilityLabel={option.label}
                            accessibilityHint={locked ? 'Resposta bloqueada após a seleção.' : 'Seleciona esta resposta.'}
                            accessibilityState={{ selected, disabled: locked }}
                            style={[
                                styles.option,
                                selected && styles.optionSelected,
                            ]}
                        >
                            <Text style={styles.optionLabel}>{option.label}</Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: space.s3,
    },
    prompt: {
        ...typography.h3,
        color: galaxyColors.textPrimary,
    },
    options: {
        gap: space.s2,
    },
    option: {
        backgroundColor: galaxyColors.surface,
        borderWidth: 1,
        borderColor: galaxyColors.border,
        borderRadius: radius.rLg,
        padding: space.s3,
    },
    optionSelected: {
        backgroundColor: galaxyColors.surfaceActive,
        borderColor: galaxy.statusInformation,
    },
    optionLabel: {
        ...typography.body,
        color: galaxyColors.textPrimary,
    },
});
