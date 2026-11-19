import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NormalizedRegion, RiskHuntPayload } from '../../../types/learningActivity';
import { semanticColors } from '../../../ui/semantic-colors';
import { CheckIcon } from '../../../ui/components/VerdictIcons';
import { galaxyColors } from '../../../ui/theme';
import { radius, space } from '../../../ui/styles';
import { InteractionFigure, isFigureAvailable } from './InteractionFigure';
import type { InteractionImageResolver } from './InteractionImageSource';
import { decodeInteractionIdSequence, encodeInteractionIdSequence } from './InteractionAnswerValue';
import { touchSlop } from './hotspotTouch';
import { EnterView, TapChip, f2Styles } from './TapChip';

type Props = {
    payload: RiskHuntPayload;
    accessibilityLabel: string;
    value?: string;
    onChange: (value: string) => void;
    resolveImageSource?: InteractionImageResolver;
    submitted?: boolean;
    confirmationLabel?: string;
};

const place = (region: NormalizedRegion) => ({
    left: `${region.x * 100}%` as `${number}%`, top: `${region.y * 100}%` as `${number}%`,
    width: `${region.width * 100}%` as `${number}%`, height: `${region.height * 100}%` as `${number}%`,
});

/**
 * Caça ao erro: marque todas as regiões de risco da cena. Cada região é uma
 * caixa de seleção sobre a figura e, equivalente, uma ficha na lista abaixo.
 * Depois de conferir, cada região diz se faltou marcar ou se foi marcada a mais.
 */
export function RiskHuntStepRenderer({ payload, accessibilityLabel, value, onChange, resolveImageSource, submitted = false, confirmationLabel = 'Conferir resposta' }: Props) {
    if (!isFigureAvailable(payload.imageRef, resolveImageSource)) return <Text>Imagem indisponível para esta atividade.</Text>;

    const regionIds = new Set(payload.regions.map(region => region.id));
    const chosen = decodeInteractionIdSequence(value).filter((id, index, all) => regionIds.has(id) && all.indexOf(id) === index);
    const toggle = (id: string) => {
        if (submitted) return;
        onChange(encodeInteractionIdSequence(chosen.includes(id) ? chosen.filter(entry => entry !== id) : [...chosen, id]));
    };
    const isRisk = (id: string) => payload.riskRegionIds.includes(id);
    // Só há veredito onde o aluno marcou ou onde havia risco: a situação correta deixada em branco não pede marca.
    const verdictOf = (id: string) => (submitted && (chosen.includes(id) || isRisk(id)) ? (chosen.includes(id) === isRisk(id) ? 'correct' : 'incorrect') : undefined);
    const spokenState = (id: string) => (!submitted ? '' : isRisk(id) && chosen.includes(id) ? ', marcada, certo' : isRisk(id) ? ', faltou marcar, errado'
        : chosen.includes(id) ? ', marcou a mais, errado' : ', não marcada, certo');
    const note = (id: string) => (!submitted ? '' : isRisk(id) && !chosen.includes(id) ? ' (faltou marcar)' : !isRisk(id) && chosen.includes(id) ? ' (marcou a mais)' : '');

    return (
        <EnterView>
            <Text style={f2Styles.prompt}>{payload.prompt}</Text>
            <Text style={f2Styles.secondary}>Pode haver mais de uma. Toque na figura ou na lista.</Text>
            <InteractionFigure
                imageRef={payload.imageRef}
                // O rótulo da interação vale também para o diagrama: a descrição dele nomearia as situações.
                alt={accessibilityLabel}
                resolveImage={resolveImageSource}
            >
                {frame => payload.regions.map(region => {
                    const on = chosen.includes(region.id);
                    return (
                        <Pressable
                            key={region.id}
                            testID={`risk-region-${region.label}`}
                            onPress={() => toggle(region.id)}
                            disabled={submitted}
                            // Alvo de 44 pt centrado na região: a parte visível continua sendo a região.
                            hitSlop={touchSlop(region, frame)}
                            accessibilityRole="checkbox"
                            accessibilityLabel={`${region.label}, na imagem${spokenState(region.id)}`}
                            accessibilityHint={submitted ? 'Resposta já conferida. Leia o retorno e continue.' : `Marca ou desmarca. Você confirma em ${confirmationLabel}.`}
                            accessibilityState={{ checked: on, ...(submitted ? { disabled: true } : {}) }}
                            style={[styles.region, place(region), on && styles.regionOn]}
                        >
                            {on ? (
                                <View testID="risk-hunt-selected-mark" style={styles.badge}>
                                    <CheckIcon size={20} color={galaxy.textPrimary} />
                                </View>
                            ) : null}
                        </Pressable>
                    );
                })}
            </InteractionFigure>

            <Text accessibilityLiveRegion="polite" style={f2Styles.gold}>{chosen.length === 1 ? '1 marcada' : `${chosen.length} marcadas`}</Text>

            <View style={f2Styles.column}>
                <Text style={f2Styles.section}>Situações da cena</Text>
                {payload.regions.map(region => (
                    <TapChip key={region.id} role="checkbox" testID={`risk-hunt-${region.label}`} label={`${region.label}${note(region.id)}`}
                        selected={chosen.includes(region.id)} disabled={submitted} onPress={() => toggle(region.id)}
                        accessibilityLabel={`${region.label}, na lista${spokenState(region.id)}`}
                        accessibilityHint={submitted ? undefined : `Equivale a tocar a região na imagem. Você confirma em ${confirmationLabel}.`}
                        verdict={verdictOf(region.id)} />
                ))}
            </View>
        </EnterView>
    );
}

const galaxy = semanticColors.galaxy;

const styles = StyleSheet.create({
    region: {
        position: 'absolute',
        borderRadius: radius.rMd,
        borderWidth: 2,
        borderColor: galaxy.statusInformation,
        backgroundColor: galaxyColors.imageScrim,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: space.s1,
    },
    // Só a borda muda: um fundo opaco apagaria a situação escolhida.
    regionOn: { borderWidth: 3, borderColor: galaxy.statusSuccess },
    badge: {
        backgroundColor: galaxyColors.background,
        borderRadius: radius.rMd,
        paddingHorizontal: space.s2,
        minHeight: 24,
        justifyContent: 'center',
    },
});
