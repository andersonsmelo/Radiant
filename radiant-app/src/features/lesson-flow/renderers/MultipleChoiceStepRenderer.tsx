import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MultipleChoicePayload } from '../../../types/lessonFlow';
import { colors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';

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
        ...typography.body,
        color: colors.textPrimary,
        fontSize: 21,
    },
    options: {
        gap: space.s2,
    },
    option: {
        backgroundColor: colors.surfaceMuted,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        borderRadius: radius.rLg,
        padding: space.s3,
    },
    optionSelected: {
        backgroundColor: colors.surface,
        borderColor: colors.borderStrong,
    },
    optionLabel: {
        color: colors.textSecondary,
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
    },
});
