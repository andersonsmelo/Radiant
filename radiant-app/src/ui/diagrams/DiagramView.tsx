import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useReducedMotionPreferenceState } from '../accessibility/useReducedMotionPreference';
import { DiagramLayerMotion, useLoopProgress } from '../motion';
import { semanticColors } from '../semantic-colors';
import { radius } from '../styles';
import { galaxyColors } from '../theme';
import { diagramSvgAt } from './diagramMotion';
import { DIAGRAMS } from './diagramRegistry';

type DiagramViewProps = {
    id: string;
    /** 0 a 1: quem chama dirige o quadro. Sem ele, o laço roda no relógio. */
    progress?: number;
    /** Figura só de enfeite: sai da árvore de acessibilidade. */
    decorative?: boolean;
};

const hidden = { accessible: false, accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' } as const;

/** O diagrama em código sobre o painel escuro, no mesmo quadro das imagens do tocador. */
export function DiagramView({ id, progress, decorative = false }: DiagramViewProps) {
    const spec = DIAGRAMS[id];
    const preference = useReducedMotionPreferenceState();
    const loop = useLoopProgress(spec?.periodMs, progress === undefined);
    const animated = !!spec?.periodMs && progress === undefined && preference.resolved && !preference.reducedMotionEnabled;
    const a11y = decorative ? hidden : { accessible: true, accessibilityRole: 'image' as const, accessibilityLabel: spec?.alt ?? 'Figura indisponível' };

    if (!spec) return <View testID="diagram-missing" style={[styles.frame, { aspectRatio: 4 / 3 }]} {...a11y} />;

    return (
        <View testID="diagram-frame" style={[styles.frame, { aspectRatio: spec.width / spec.height }]} {...a11y}>
            {animated ? (
                spec.layers.map((layer, index) => (
                    <DiagramLayerMotion key={index} motion={layer.motion} progress={loop} width={spec.width} height={spec.height}>
                        <SvgXml testID="diagram-layer" xml={diagramSvgAt({ ...spec, layers: [{ svg: layer.svg }] }, 0)} width="100%" height="100%" />
                    </DiagramLayerMotion>
                ))
            ) : (
                <SvgXml testID="diagram-still" xml={diagramSvgAt(spec, progress ?? spec.posterAt ?? 0)} width="100%" height="100%" />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    frame: {
        width: '100%',
        overflow: 'hidden',
        borderRadius: radius.rLg,
        borderWidth: 1,
        borderColor: semanticColors.galaxy.border,
        backgroundColor: galaxyColors.backgroundAlt,
    },
});

