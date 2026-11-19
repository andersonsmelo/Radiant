import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useReducedMotionPreferenceState } from '../accessibility/useReducedMotionPreference';
import { DiagramLayerMotion, useLoopProgress } from '../motion';
import { semanticColors } from '../semantic-colors';
import { radius } from '../styles';
import { galaxyColors } from '../theme';
import { useScreenFocused } from '../useScreenFocused';
import { diagramSvgAt, groupLayers, layerFrameSvg } from './diagramMotion';
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
    const focused = useScreenFocused();
    // Fora de foco o laço pausa, e o quadro parado é o pôster, não onde ele parou.
    const animated = !!spec?.periodMs && progress === undefined && preference.resolved && !preference.reducedMotionEnabled && focused;
    const a11y = decorative ? hidden : { accessible: true, accessibilityRole: 'image' as const, accessibilityLabel: spec?.alt ?? 'Figura indisponível' };

    if (!spec) return <View testID="diagram-missing" style={[styles.frame, { aspectRatio: 4 / 3 }]} {...a11y} />;

    return (
        <View testID="diagram-frame" style={[styles.frame, { aspectRatio: spec.width / spec.height }]} {...a11y}>
            {animated ? (
                groupLayers(spec.layers).map((group, index) =>
                    group[0].motion ? (
                        <DiagramLayerMotion key={index} motion={group[0].motion} progress={loop} width={spec.width} height={spec.height}>
                            <SvgXml testID="diagram-layer" xml={layerFrameSvg(spec, group[0])} width="100%" height="100%" />
                        </DiagramLayerMotion>
                    ) : (
                        <View key={index} pointerEvents="none" style={StyleSheet.absoluteFill}>
                            <SvgXml testID="diagram-static-layer" xml={diagramSvgAt({ ...spec, layers: group }, 0)} width="100%" height="100%" />
                        </View>
                    ),
                )
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

