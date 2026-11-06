import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import type { LessonCastId } from '../../../types/learningActivity';
import { galaxyColors, pixelColors } from '../../theme';
import { PixelIllustration } from '../PixelIllustration';
import type { PixelExpression } from '../pixelExpressions';
import { CAST, CAST_TONES, castSpeakerName, type CastPortraitId } from './castRegistry';

/** Lado do retrato, igual à janela da cabeça do Pixel em `sm`: os dois alinham na mesma coluna. */
export const CAST_AVATAR_SIZE = 48;
/** Caixa de desenho de todo retrato. */
export const CAST_VIEWBOX = 64;

/** Círculo em comandos absolutos, para toda coordenada do traçado ficar dentro da caixa. */
function circle(cx: number, cy: number, r: number): string {
    return `M${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;
}

/**
 * A massa de cabelo é o que separa as silhuetas: coque no alto (Lia), topo reto
 * e curto (Caio), cachos largos (Duda) e só as laterais (paciente). Exportado
 * porque o Jest não rasteriza SVG: o teste mede o traçado que decide o desenho.
 */
export const CAST_HAIR_PATH: Record<CastPortraitId, string> = {
    lia: `${circle(32, 10, 6)} M20 29 C17 16 24 11 32 11 C40 11 47 16 44 29 C42 22 38 18 32 18 C26 18 22 22 20 29 Z`,
    caio: 'M21 24 C20 14 26 12 32 12 C39 12 45 14 43 24 C42 20 40 18 37 18 L27 18 C24 18 22 20 21 24 Z',
    duda: [circle(21, 20, 8), circle(30, 13, 8), circle(40, 14, 8), circle(46, 23, 7), circle(18, 30, 6), circle(47, 32, 6)].join(' '),
    paciente: 'M20 28 C18 22 20 18 24 17 C22 21 22 25 22 30 Z M44 28 C46 22 44 18 40 17 C42 21 42 25 42 30 Z',
};

/** Ombros e rosto são os mesmos em todo retrato; muda quem os veste. */
const SHOULDERS = 'M8 64 C8 51 20 45 32 45 C44 45 56 51 56 64 Z';
const SHOULDERS_SHADE = 'M32 45 C44 45 56 51 56 64 L42 64 C43 55 39 49 32 45 Z';
const FACE_SHADE = 'M38 16 C44 20 45 33 38 39 C41 33 41 22 38 16 Z';
const INK = galaxyColors.background;

function Portrait({ id }: { id: CastPortraitId }) {
    const tones = CAST_TONES[id];
    return (
        <Svg width={CAST_AVATAR_SIZE} height={CAST_AVATAR_SIZE} viewBox={`0 0 ${CAST_VIEWBOX} ${CAST_VIEWBOX}`}>
            {/* Os cachos da Duda passam por trás da cabeça; os outros cabelos ficam por cima. */}
            {id === 'duda' ? <Path testID={`cast-hair-${id}`} d={CAST_HAIR_PATH[id]} fill={tones.hair} /> : null}
            <Path testID={`cast-clothing-${id}`} d={SHOULDERS} fill={tones.clothing} />
            <Path d={SHOULDERS_SHADE} fill={tones.clothingShade} />
            <Rect x={27} y={36} width={10} height={11} fill={tones.skinShade} />
            <Ellipse cx={32} cy={27} rx={11} ry={12.5} fill={tones.skin} />
            <Path d={FACE_SHADE} fill={tones.skinShade} />
            {id === 'duda' ? (
                <Path d={`${circle(26, 17, 5)} ${circle(35, 16, 5)}`} fill={tones.hair} />
            ) : (
                <Path testID={`cast-hair-${id}`} d={CAST_HAIR_PATH[id]} fill={tones.hair} />
            )}
            <Circle cx={27.5} cy={27} r={1.4} fill={INK} />
            <Circle cx={36.5} cy={27} r={1.4} fill={INK} />
            <Path d="M28 32.5 Q32 35.5 36 32.5" stroke={INK} strokeWidth={1.4} strokeLinecap="round" fill="none" />
            {id === 'lia' ? (
                <>
                    {/* Óculos e a gola da blusa azul sob o jaleco. */}
                    <Circle cx={27.5} cy={27} r={3.8} stroke={tones.hairShade} strokeWidth={1.2} fill="none" />
                    <Circle cx={36.5} cy={27} r={3.8} stroke={tones.hairShade} strokeWidth={1.2} fill="none" />
                    <Path d="M31.3 27 L32.7 27" stroke={tones.hairShade} strokeWidth={1.2} />
                    <Path d="M27 45.5 L32 54 L37 45.5 Z" fill={pixelColors.blue.base} />
                </>
            ) : null}
            {id === 'caio' ? (
                <>
                    {/* Gola em V do pijama cirúrgico e o crachá do plantão. */}
                    <Path d="M27 45.5 L32 53 L37 45.5 Z" fill={tones.skin} />
                    <Rect x={40} y={54} width={7} height={8} rx={1} fill={pixelColors.coat.base} />
                    <Rect x={41.5} y={57} width={4} height={1.2} fill={pixelColors.coat.shade} />
                </>
            ) : null}
            {id === 'duda' ? (
                <Path d="M22 48 C26 53 38 53 42 48 C39 45 25 45 22 48 Z" fill={tones.clothingShade} />
            ) : null}
            {id === 'paciente' ? (
                <>
                    {/* Sobrancelhas grisalhas, decote redondo e a estampa do avental. */}
                    <Path d="M25 23 L30 22.4 M34 22.4 L39 23" stroke={tones.hairShade} strokeWidth={1.3} strokeLinecap="round" />
                    <Path d="M25 46 Q32 52 39 46" stroke={tones.clothingShade} strokeWidth={2} fill="none" />
                    <Circle cx={20} cy={57} r={1.3} fill={tones.clothingShade} />
                    <Circle cx={32} cy={59} r={1.3} fill={tones.clothingShade} />
                    <Circle cx={44} cy={57} r={1.3} fill={tones.clothingShade} />
                </>
            ) : null}
        </Svg>
    );
}

type CastAvatarProps = {
    speaker: LessonCastId;
    /** Nome da fala, quando difere do elenco (o paciente de cada cena). */
    name?: string;
    /** Só para o Pixel: a expressão do rosto. */
    expression?: PixelExpression;
    /** Rótulo próprio, quando o momento diz mais que nome e papel. */
    accessibilityLabel?: string;
    /** Quando o texto ao lado já diz quem é, o retrato some do leitor de tela. */
    decorative?: boolean;
};

/**
 * Retrato de quem fala. Lia, Caio, Duda e o paciente são desenho autoral em
 * SVG; o Pixel é a cabeça do mascote de sempre, recortada da mesma arte.
 */
export function CastAvatar({ speaker, name, expression, accessibilityLabel, decorative = false }: CastAvatarProps) {
    const label = accessibilityLabel ?? `${castSpeakerName(speaker, name)}, ${CAST[speaker].role}`;
    const hidden = decorative
        ? { accessible: false, accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' as const }
        : null;

    if (speaker === 'pixel') {
        return (
            <View testID="cast-avatar-pixel" style={styles.slot} {...hidden}>
                <PixelIllustration variant="head" size="sm" state="idle" expression={expression} accessibilityLabel={label} />
            </View>
        );
    }

    return (
        <View
            testID={`cast-avatar-${speaker}`}
            style={[styles.slot, styles.plate]}
            accessible={!decorative}
            accessibilityRole={decorative ? undefined : 'image'}
            accessibilityLabel={decorative ? undefined : label}
            {...hidden}
        >
            <Portrait id={speaker} />
        </View>
    );
}

const styles = StyleSheet.create({
    slot: {
        width: CAST_AVATAR_SIZE,
        height: CAST_AVATAR_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    plate: {
        borderRadius: CAST_AVATAR_SIZE / 2,
        overflow: 'hidden',
        backgroundColor: galaxyColors.surfaceActive,
        borderWidth: 1,
        borderColor: galaxyColors.border,
    },
});
