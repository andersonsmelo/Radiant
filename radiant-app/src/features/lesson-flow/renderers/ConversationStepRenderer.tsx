import React, { useRef } from 'react';
import { AccessibilityInfo, StyleSheet, Text, View } from 'react-native';
import type { ConversationPayload } from '../../../types/learningActivity';
import { VerdictIcon } from '../../../ui/components/VerdictIcons';
import { CastAvatar } from '../../../ui/characters/cast/CastAvatar';
import { castExpressionFor } from '../../../ui/characters/cast/castExpressionFor';
import { castSpeakerName } from '../../../ui/characters/cast/castRegistry';
import { radius, space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';
import { decodeInteractionIdSequence, encodeInteractionIdSequence } from './InteractionAnswerValue';
import { EnterView, TapChip, f2Styles } from './TapChip';
import type { CastExpression } from '../../../ui/characters/cast/castExpressions';

type Props = { payload: ConversationPayload; value?: string; onChange: (value: string) => void; submitted?: boolean; confirmationLabel?: string };

/** Uma fala do personagem: um nó acessível só, "Nome: texto", como na cena de diálogo. O retrato é decorativo. */
function CastBubble({ payload, text, expression }: { payload: ConversationPayload; text: string; expression: CastExpression }) {
    const name = castSpeakerName(payload.speaker, payload.name);
    return (
        <View testID="conversation-line" style={styles.row} accessible accessibilityRole="text" accessibilityLabel={`${name}: ${text}`}>
            <CastAvatar speaker={payload.speaker} name={payload.name} decorative expression={expression} />
            <View style={styles.bubble}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.text}>{text}</Text>
            </View>
        </View>
    );
}

/**
 * Conduzir uma conversa: o personagem fala, o aluno escolhe a resposta do turno
 * e o personagem reage com o `reply` dela. A reação nunca diz se estava certo;
 * o veredito de cada turno só aparece depois de conferir. A escolha não se desfaz.
 */
export function ConversationStepRenderer({ payload, value, onChange, submitted = false, confirmationLabel = 'Conferir resposta' }: Props) {
    const { turns } = payload;
    const chosen = decodeInteractionIdSequence(value).slice(0, turns.length);
    const who = castSpeakerName(payload.speaker, payload.name);
    const shown = turns.slice(0, Math.min(chosen.length + 1, turns.length));

    // Um segundo toque antes do novo desenho não regrava o turno já respondido.
    const answeredTurn = useRef(-1);
    if (answeredTurn.current >= chosen.length) answeredTurn.current = chosen.length - 1;
    const choose = (turnIndex: number, optionId: string) => {
        if (submitted || turnIndex !== chosen.length || answeredTurn.current >= turnIndex) return;
        answeredTurn.current = turnIndex;
        const reply = turns[turnIndex].options.find(option => option.id === optionId)?.reply ?? '';
        const next = turns[turnIndex + 1];
        // A reação e a fala seguinte chegam juntas: o leitor de tela ouve as duas, na ordem da tela.
        AccessibilityInfo.announceForAccessibility(`${who}: ${reply}${next ? ` ${who}: ${next.line}` : ''}`);
        onChange(encodeInteractionIdSequence([...chosen, optionId]));
    };

    return (
        <EnterView>
            <Text style={f2Styles.prompt}>{payload.prompt}</Text>
            <Text style={f2Styles.secondary}>{`Turno ${shown.length} de ${turns.length}`}</Text>
            <View testID="conversation-scene" style={styles.scene}>
                {shown.map((turn, index) => {
                    const pickedId = chosen[index];
                    const picked = turn.options.find(option => option.id === pickedId);
                    const right = pickedId === turn.correctOptionId;
                    const correctLabel = turn.options.find(option => option.id === turn.correctOptionId)?.label ?? '';
                    return (
                        <View key={turn.id} style={styles.scene}>
                            <CastBubble payload={payload} text={turn.line} expression={castExpressionFor({ kind: 'fala', speaker: payload.speaker, text: turn.line })} />
                            {picked ? (
                                <>
                                    <View testID="conversation-answer" style={[styles.bubble, styles.mine]} accessible accessibilityRole="text"
                                        accessibilityLabel={`Você: ${picked.label}${submitted ? `, ${right ? 'certo' : `errado; a resposta certa era: ${correctLabel}`}` : ''}`}>
                                        <Text style={styles.name}>Você</Text>
                                        <Text style={styles.text}>{picked.label}</Text>
                                        {submitted ? (
                                            <View style={styles.verdict}>
                                                <VerdictIcon verdict={right ? 'correct' : 'incorrect'} size={20} testID={`conversation-verdict-${right ? 'correct' : 'incorrect'}`} />
                                                <Text style={styles.text}>{right ? 'Certo' : `Errado. Cabia: ${correctLabel}`}</Text>
                                            </View>
                                        ) : null}
                                    </View>
                                    {/* A reação é cena: antes de conferir a expressão é a de fala, igual para certa e errada, para o rosto não antecipar o veredito. */}
                                    <CastBubble payload={payload} text={picked.reply} expression={submitted ? castExpressionFor({ kind: 'retorno', correct: right }) : castExpressionFor({ kind: 'fala', speaker: payload.speaker, text: picked.reply })} />
                                </>
                            ) : (
                                <View style={f2Styles.column}>
                                    {turn.options.map(option => (
                                        <TapChip key={option.id} testID={`conversation-option-${option.label}`} label={option.label}
                                            accessibilityLabel={`Responder: ${option.label}`}
                                            accessibilityHint={`Envia esta resposta, e ela não pode ser trocada. Você confirma ao fim em ${confirmationLabel}.`}
                                            disabled={submitted} onPress={() => choose(index, option.id)} />
                                    ))}
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
        </EnterView>
    );
}

const styles = StyleSheet.create({
    scene: { gap: space.s3 },
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
    mine: { backgroundColor: galaxyColors.surface },
    verdict: { flexDirection: 'row', alignItems: 'center', gap: space.s1 },
    name: { ...typography.caption, lineHeight: undefined, color: galaxyColors.textSecondary },
    text: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textPrimary },
});
