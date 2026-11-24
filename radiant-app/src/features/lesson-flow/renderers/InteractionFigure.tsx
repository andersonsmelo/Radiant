import React, { useState, type ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { DiagramView } from '../../../ui/diagrams/DiagramView';
import { DIAGRAMS, parseDiagramRef } from '../../../ui/diagrams/diagramRegistry';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';
import { isResolvedInteractionImage, type InteractionImageResolver } from './InteractionImageSource';

type InteractionFigureProps = {
    /** Identificador da imagem licenciada, ou `diagram:<id>` para um diagrama em código. */
    imageRef: string;
    /** Rótulo acessível da figura. Sem ele, o diagrama usa a descrição própria e a imagem, a do cadastro (se houver). */
    alt?: string;
    resolveImage?: InteractionImageResolver;
    /** Sobreposição em coordenadas 0 a 1, com o tamanho da figura em pontos (0 até a primeira medição). */
    children?: (frame: { width: number; height: number }) => ReactNode;
};

/** Falso quando a figura não pode ser desenhada: diagrama fora do registro, ou imagem que o resolvedor recusa. */
export function isFigureAvailable(imageRef: string, resolveImage?: InteractionImageResolver): boolean {
    const diagramId = parseDiagramRef(imageRef);
    return diagramId !== null ? Object.hasOwn(DIAGRAMS, diagramId) : !resolveImage || isResolvedInteractionImage(resolveImage(imageRef));
}

/** A figura de uma interação (imagem licenciada ou diagrama) na largura disponível e na proporção dela. */
export function InteractionFigure({ imageRef, alt, resolveImage, children }: InteractionFigureProps) {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const diagramId = parseDiagramRef(imageRef);
    const diagram = diagramId === null ? undefined : DIAGRAMS[diagramId];
    const resolved = diagramId === null ? resolveImage?.(imageRef) : undefined;
    if (!isFigureAvailable(imageRef, resolveImage)) return <Text style={styles.unavailable}>Imagem indisponível</Text>;

    // Figura tocável fica parada no quadro de pôster: os alvos não acompanham o laço.
    const poster = diagram?.posterAt ?? 0;
    const label = alt ?? resolved?.alt;
    const aspectRatio = diagram ? diagram.width / diagram.height : resolved ? resolved.width / resolved.height : 4 / 3;
    return (
        <View
            testID="interaction-figure"
            style={[styles.frame, diagram ? null : styles.bordered, { aspectRatio }]}
            onLayout={event => setSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}
        >
            {diagram ? (alt ? (
                // O DiagramView só sabe a descrição dele; uma alt de quem chama a substitui por fora.
                <View accessible accessibilityRole="image" accessibilityLabel={alt}><DiagramView id={diagram.id} progress={poster} decorative /></View>
            ) : <DiagramView id={diagram.id} progress={poster} />) : (
                <Image
                    source={resolved?.source ?? { uri: imageRef }}
                    resizeMode="contain"
                    style={styles.image}
                    // Sem texto alternativo, a imagem sai da árvore: nunca fica "acessível sem rótulo".
                    {...(label ? { accessible: true, accessibilityLabel: label } : { accessible: false, accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' as const })}
                />
            )}
            {children ? <View style={StyleSheet.absoluteFill} pointerEvents="box-none">{children(size)}</View> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    frame: { width: '100%', overflow: 'hidden' },
    bordered: {
        borderRadius: radius.rLg,
        borderWidth: 1,
        borderColor: semanticColors.galaxy.border,
        backgroundColor: galaxyColors.backgroundAlt,
    },
    image: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
    unavailable: { color: semanticColors.galaxy.textSecondary },
});
