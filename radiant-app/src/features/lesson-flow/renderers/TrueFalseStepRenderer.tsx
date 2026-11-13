import React from 'react';
import { AccessibilityInfo, Text, View } from 'react-native';
import type { TrueFalsePayload } from '../../../types/learningActivity';
import { decodeTrueFalseValue } from './InteractionAnswerValue';
import { EnterView, TapChip, f2Styles } from './TapChip';

type Props = { payload: TrueFalsePayload; value?: string; onChange: (value: string) => void; submitted?: boolean };

/**
 * Certo ou errado, uma afirmação por vez. Julgar é a decisão daquela
 * afirmação: o retorno dela aparece na hora e o julgamento não volta atrás.
 * Quando todas estão julgadas, o player confere o conjunto, cobra a vida uma
 * vez só se alguma estiver errada e anuncia o resultado.
 */
export function TrueFalseStepRenderer({ payload, value, onChange, submitted = false }: Props) {
    const judged = decodeTrueFalseValue(value).slice(0, payload.statements.length);
    const current = payload.statements[judged.length];
    const judge = (verdict: boolean) => {
        if (submitted || !current) return;
        const right = verdict === current.isTrue;
        AccessibilityInfo.announceForAccessibility(`${right ? 'Acertou.' : 'Não é isso.'} ${current.explanation}`);
        onChange(JSON.stringify([...judged, verdict]));
    };

    return (
        <EnterView>
            <Text style={f2Styles.prompt}>{payload.prompt}</Text>
            <Text style={f2Styles.secondary}>{`Afirmação ${Math.min(judged.length + 1, payload.statements.length)} de ${payload.statements.length}`}</Text>
            {payload.statements.slice(0, judged.length).map((statement, index) => {
                const right = judged[index] === statement.isTrue;
                return (
                    <View key={statement.id} style={f2Styles.column} accessible accessibilityLabel={
                        `Afirmação ${index + 1}: ${statement.text}. Você marcou ${judged[index] ? 'certo' : 'errado'}. ${right ? 'Acertou.' : 'Não é isso.'} ${statement.explanation}`}>
                        <Text style={f2Styles.body}>{statement.text}</Text>
                        <TapChip label={`${judged[index] ? 'Certo' : 'Errado'}: ${right ? 'acertou' : 'não é isso'}`}
                            accessibilityLabel={`Você marcou ${judged[index] ? 'certo' : 'errado'}`} disabled selected
                            verdict={right ? 'correct' : 'incorrect'} />
                        <Text style={f2Styles.secondary}>{statement.explanation}</Text>
                    </View>
                );
            })}
            {current && !submitted ? (
                <EnterView key={current.id}>
                    <Text style={f2Styles.section}>{current.text}</Text>
                    <View style={f2Styles.wrap}>
                        <TapChip testID="true-false-certo" label="Certo" accessibilityLabel={`Certo: ${current.text}`}
                            accessibilityHint="Julga esta afirmação. O julgamento não pode ser trocado." onPress={() => judge(true)} />
                        <TapChip testID="true-false-errado" label="Errado" accessibilityLabel={`Errado: ${current.text}`}
                            accessibilityHint="Julga esta afirmação. O julgamento não pode ser trocado." onPress={() => judge(false)} />
                    </View>
                </EnterView>
            ) : null}
        </EnterView>
    );
}
