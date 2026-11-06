import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import type { LearningInteractionV2 } from '../../types/learningActivity';
import { space, typography } from '../../ui/styles';
import { galaxyColors } from '../../ui/theme';
import { BenchControlRow } from '../bench/BenchControlRow';
import { decodeBenchValue, encodeBenchValue } from '../lesson-flow/renderers/InteractionAnswerValue';
import type { InteractionRendererProps } from '../lesson-flow/renderers/ActivityRendererRegistry';
import { abstractCollimationScene } from './abstractCollimationScene';

type Bench = Extract<LearningInteractionV2, { type: 'bench' }>;

/** This scene implements exactly the approved artificial pilot configuration. */
export function isAbstractCollimationInteraction(interaction: LearningInteractionV2): interaction is Bench {
    if (interaction.type !== 'bench') return false;
    const { simulator, mode, controls, goal } = interaction.payload;
    const control = controls[0];
    return simulator === 'collimation' && (mode === 'challenge' || mode === 'correct') && controls.length === 1
        && control.id === 'fieldWidth' && control.unit === 'cm' && control.min === 1 && control.max === 27
        && control.step === 1 && control.initial === 27
        && goal.kind === 'reach' && goal.control === 'fieldWidth' && goal.atLeast === 18 && goal.atMost === 20;
}

export function AbstractCollimationRenderer(props: InteractionRendererProps) {
    if (!isAbstractCollimationInteraction(props.interaction)) return <Text>Esta cena não está disponível para a atividade.</Text>;
    return <AbstractFieldControls {...props} interaction={props.interaction} />;
}

function AbstractFieldControls({ interaction, value, onChange, submitted = false }: InteractionRendererProps & { interaction: Bench }) {
    const controls = interaction.payload.controls;
    const values = decodeBenchValue(value, controls);
    const canonical = encodeBenchValue(values);
    const initializedFor = useRef<string | null>(null);
    const [previewWidth, setPreviewWidth] = useState<number | null>(null);
    useEffect(() => {
        if (initializedFor.current === interaction.id) return;
        initializedFor.current = interaction.id;
        if (value !== canonical) onChange(canonical);
    }, [interaction.id, value, canonical, onChange]);
    const committed = abstractCollimationScene(values.fieldWidth);
    const scene = abstractCollimationScene(!submitted && previewWidth !== null ? previewWidth : values.fieldWidth);
    return (
        <View style={styles.activity}>
            <Text style={styles.prompt}>{interaction.payload.prompt}</Text>
            <Svg width="100%" height={300} viewBox={`-2 -2 ${scene.detector.width + 4} ${scene.detector.height + 4}`}
                accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                <Rect x={0} y={0} width={scene.detector.width} height={scene.detector.height} fill={galaxyColors.backgroundAlt} />
                <Rect testID="abstract-field" {...scene.field} fill={galaxyColors.surfaceActive} stroke={galaxyColors.navBlue} strokeWidth={3} />
                <Rect testID="abstract-target" {...scene.target} fill="none" stroke={galaxyColors.textPrimary} strokeWidth={2} strokeDasharray="6 4" />
            </Svg>
            <Text style={styles.body}>Alvo central em tracejado; campo com borda contínua.</Text>
            <Text style={styles.body} accessibilityLiveRegion="polite">{committed.description}</Text>
            <BenchControlRow control={controls[0]} value={values.fieldWidth} disabled={submitted}
                onPreview={setPreviewWidth} onChange={next => onChange(encodeBenchValue({ fieldWidth: next }))} />
            <Text style={styles.caption}>Esta cena mostra apenas o campo e sua área.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    activity: { gap: space.s3 },
    prompt: { ...typography.h3, color: galaxyColors.textPrimary },
    body: { ...typography.bodyRegular, color: galaxyColors.textPrimary },
    caption: { ...typography.caption, color: galaxyColors.textSecondary },
});
