import React, { useState } from 'react';
import { Text, View } from 'react-native';
import type { CategorizePayload } from '../../../types/learningActivity';
import { decodeCategorizeValue } from './InteractionAnswerValue';
import { EnterView, TapChip, f2Styles } from './TapChip';
import { GroupArea } from './GroupArea';

type Props = { payload: CategorizePayload; value?: string; onChange: (value: string) => void; submitted?: boolean; confirmationLabel?: string };

/** Fichas que ainda não estão num grupo existente; valor malformado conta como nenhuma colocada. */
export function categorizePendingCount(payload: CategorizePayload, value?: string): number {
    const assigned = decodeCategorizeValue(value);
    const groupIds = new Set(payload.categories.map(category => category.id));
    return payload.items.filter(item => !groupIds.has(assigned[item.id])).length;
}

/**
 * Classificar sem arrastar: toca no item e depois no grupo. O item escolhido é
 * só foco visual, não resposta, por isso fica em estado local; a resposta (o
 * mapa item → grupo) sobe ao player. Tocar num item já colocado o devolve.
 */
export function CategorizeStepRenderer({ payload, value, onChange, submitted = false, confirmationLabel = 'Conferir resposta' }: Props) {
    const assigned = decodeCategorizeValue(value);
    const groupIds = new Set(payload.categories.map(category => category.id));
    const pending = payload.items.filter(item => !groupIds.has(assigned[item.id]));
    const [picked, setPicked] = useState<string | null>(null);
    const active = pending.find(item => item.id === picked) ?? pending[0];
    const write = (next: Record<string, string>) => onChange(JSON.stringify(next));
    const put = (groupId: string) => { if (!submitted && active) { write({ ...assigned, [active.id]: groupId }); setPicked(null); } };
    const unput = (itemId: string) => {
        if (submitted) return;
        const next = { ...assigned };
        delete next[itemId];
        write(next);
        setPicked(itemId);
    };

    return (
        <EnterView>
            <Text style={f2Styles.prompt}>{payload.prompt}</Text>
            {/* Os grupos ficam fixos logo abaixo do enunciado: colocar uma ficha não move o alvo do próximo toque. */}
            <View style={f2Styles.column}>
                {payload.categories.map(category => {
                    const inside = payload.items.filter(item => assigned[item.id] === category.id);
                    return (
                        <GroupArea key={category.id} testID={`categorize-group-${category.label}`} label={category.label}
                            ready={Boolean(active) && !submitted} empty={inside.length === 0}
                            accessibilityLabel={active && !submitted ? `Colocar ${active.label} em ${category.label}` : `Grupo ${category.label}`}
                            onPress={active && !submitted ? () => put(category.id) : undefined}>
                            {inside.map(item => {
                                const right = item.categoryId === category.id;
                                const correctLabel = payload.categories.find(entry => entry.id === item.categoryId)?.label;
                                return (
                                    <TapChip key={item.id} label={submitted && !right ? `${item.label} (certo: ${correctLabel})` : item.label}
                                        accessibilityLabel={`${item.label}, em ${category.label}${submitted ? (right ? ', certo' : `, errado; o grupo certo é ${correctLabel}`) : ''}`}
                                        accessibilityHint={submitted ? undefined : 'Toque para devolver a ficha.'}
                                        disabled={submitted} onPress={() => unput(item.id)} verdict={submitted ? (right ? 'correct' : 'incorrect') : undefined} />
                                );
                            })}
                        </GroupArea>
                    );
                })}
            </View>
            {pending.length && !submitted ? (
                <View style={f2Styles.column}>
                    <Text style={f2Styles.section}>Fichas para classificar</Text>
                    <View style={f2Styles.wrap}>
                        {pending.map(item => (
                            <TapChip key={item.id} testID={`categorize-item-${item.label}`} label={item.label} selected={item.id === active?.id}
                                accessibilityLabel={`Item: ${item.label}`} accessibilityHint={`Escolhe esta ficha; depois toque no grupo. Você confirma em ${confirmationLabel}.`} onPress={() => setPicked(item.id)} />
                        ))}
                    </View>
                </View>
            ) : null}
        </EnterView>
    );
}
