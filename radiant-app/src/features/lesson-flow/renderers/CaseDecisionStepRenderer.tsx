import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { CaseDecisionPayload } from '../../../types/learningActivity';
import { semanticColors } from '../../../ui/semantic-colors';
import { layout, typography } from '../../../ui/styles';
import { MultipleChoiceStepRenderer } from './MultipleChoiceStepRenderer';

const PHASE_LABELS = { decision: 'Decisão', reason: 'Motivo', support: 'Ação de apoio' };

export function CaseDecisionStepRenderer({ payload, selectedOptionId, onSelect, submitted = false, confirmationLabel = 'Conferir resposta' }: {
    payload: CaseDecisionPayload;
    selectedOptionId?: string;
    onSelect: (id: string) => void;
    submitted?: boolean;
    confirmationLabel?: string;
}) {
    return <View style={layout.stackSm}>
        {payload.phase ? <Text accessibilityRole="header" style={styles.phase}>{PHASE_LABELS[payload.phase]}</Text> : null}
        {payload.context ? <Text style={styles.context}>{payload.context}</Text> : null}
        <MultipleChoiceStepRenderer
            payload={{ prompt: payload.prompt, options: payload.options, correctOptionId: payload.correctOptionId, explanation: '' }}
            selectedOptionId={selectedOptionId} onSelect={onSelect}
            submitted={submitted} confirmationLabel={confirmationLabel}
        />
    </View>;
}

const styles = StyleSheet.create({
    phase: { ...typography.caption, color: semanticColors.galaxy.textSecondary },
    context: { ...typography.bodyRegular, color: semanticColors.galaxy.textPrimary },
});
