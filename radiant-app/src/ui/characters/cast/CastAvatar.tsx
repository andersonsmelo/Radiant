import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import type { LessonCastId } from '../../../types/learningActivity';
import { galaxyColors, medalColors } from '../../theme';
import { PixelIllustration, PIXEL_HEAD_SIZE_MAP } from '../PixelIllustration';
import type { PixelExpression } from '../pixelExpressions';
import type { CharacterSize } from '../types';
import {
    CAST_ACCESSORIES, CAST_BROWS, CAST_EXPRESSION_LABEL, CAST_EYES, CAST_FACES, CAST_MOUTHS,
    isCastExpression, labelExpressionFor, pixelExpressionFor, type CastExpression,
} from './castExpressions';
import {
    CAST_FACE, CAST_FACE_SHADE, CAST_INK, CAST_LOOKS, CAST_NECK, CAST_SHOULDERS, CAST_SHOULDERS_SHADE, CAST_VIEWBOX,
    castLookFor, type CastDetail, type CastLook, type CastShape,
} from './castLooks';
import { CAST, castSpeakerName, type CastPortraitId } from './castRegistry';

export { CAST_VIEWBOX } from './castLooks';

/** Lado do retrato em `sm`, igual à janela da cabeça do Pixel: os dois alinham na mesma coluna. */
export const CAST_AVATAR_SIZE = PIXEL_HEAD_SIZE_MAP.sm;

/**
 * Quanto do diâmetro da placa a cabeça do Pixel ocupa. A janela da cabeça dele
 * é a caixa inteira; sem a escala, o mascote ficaria quase duas vezes maior que
 * as cabeças do elenco ao lado (bíblia, "escala relativa").
 */
export const PIXEL_HEAD_SCALE_ON_PLATE = 0.8;

/**
 * A massa de cabelo é o que separa as silhuetas: coque no alto (Lia), topo reto
 * e curto (Caio), cachos largos (Duda) e só as laterais (paciente). Exportado
 * porque o Jest não rasteriza SVG: o teste mede o traçado que decide o desenho.
 */
export const CAST_HAIR_PATH: Record<CastPortraitId, string> = {
    lia: CAST_LOOKS.lia.hair,
    caio: CAST_LOOKS.caio.hair,
    duda: CAST_LOOKS.duda.hair,
    paciente: CAST_LOOKS.paciente.hair,
};

/** Desenha uma forma da caixa 64. Traço com `strokeWidth`; senão, preenchimento. */
function Shape({ shape, color, testID }: { shape: CastShape | CastDetail; color: string; testID?: string }) {
    const isStroke = 'strokeWidth' in shape && shape.strokeWidth !== undefined;
    const paint = isStroke
        ? { stroke: color, strokeWidth: shape.strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' }
        : { fill: color };
    if (shape.kind === 'circle') return <Circle testID={testID} cx={shape.cx} cy={shape.cy} r={shape.r} {...paint} />;
    if (shape.kind === 'rect') {
        return <Rect testID={testID} x={shape.x} y={shape.y} width={shape.width} height={shape.height} rx={shape.rx} {...paint} />;
    }
    return <Path testID={testID} d={shape.d} {...paint} />;
}

function Details({ list }: { list: readonly CastDetail[] | undefined }) {
    return <>{list?.map((detail, index) => <Shape key={index} shape={detail} color={detail.color} />)}</>;
}

type PortraitProps = { look: CastLook; expression?: CastExpression; size?: CharacterSize };

/**
 * O retrato de um personagem do elenco, montado pelas regras da bíblia: o
 * mesmo corpo para todos, o que ele veste, e as feições do conjunto comum.
 * Exportado para o Storybook e para o teste de padrão, que o conferem com os
 * candidatos que ainda não estão nas aulas.
 */
export function CastPortrait({ look, expression = 'neutro', size = 'sm' }: PortraitProps) {
    const { tones } = look;
    const face = CAST_FACES[expression];
    const dimension = PIXEL_HEAD_SIZE_MAP[size];
    const hair = <Path testID={`cast-hair-${look.id}`} d={look.hair} fill={tones.hair} />;

    return (
        <Svg width={dimension} height={dimension} viewBox={`0 0 ${CAST_VIEWBOX} ${CAST_VIEWBOX}`}>
            {look.hairBehind ? hair : null}
            <Path testID={`cast-clothing-${look.id}`} d={CAST_SHOULDERS} fill={tones.clothing} />
            <Path d={CAST_SHOULDERS_SHADE} fill={tones.clothingShade} />
            <Rect {...CAST_NECK} fill={tones.skinShade} />
            <Ellipse {...CAST_FACE} fill={tones.skin} />
            <Path d={CAST_FACE_SHADE} fill={tones.skinShade} />
            {look.hairBehind ? null : hair}
            {look.fringe ? <Path d={look.fringe} fill={tones.hair} /> : null}
            <Path testID={`cast-hair-shine-${look.id}`} d={look.hairShine} fill={tones.hairLight} />
            <Details list={look.details} />
            {/* As feições são sempre tinta; o acessório de expressão, sempre ouro. */}
            <G testID={`cast-face-${expression}`}>
                {[...CAST_BROWS[face.brows], ...CAST_EYES[face.eyes], ...CAST_MOUTHS[face.mouth]].map((shape, index) => (
                    <Shape key={index} shape={shape} color={CAST_INK} />
                ))}
                {CAST_ACCESSORIES[face.accessory].map((shape, index) => (
                    <Shape key={`a${index}`} shape={shape} color={medalColors.gold.face} />
                ))}
            </G>
            <Details list={look.overlay} />
        </Svg>
    );
}

type CastAvatarProps = {
    speaker: LessonCastId;
    /** Nome da fala, quando difere do elenco (o paciente de cada cena). */
    name?: string;
    /**
     * A expressão do rosto, do conjunto comum (`castExpressionFor` escolhe pelo
     * contexto). Para o Pixel, a família dele também é aceita, como já era.
     */
    expression?: CastExpression | PixelExpression;
    /** `sm` é o avatar da fala; `lg`, o do retorno. Os mesmos lados da cabeça do Pixel. */
    size?: CharacterSize;
    /** Rótulo próprio, quando o momento diz mais que nome e papel. */
    accessibilityLabel?: string;
    /** Quando o texto ao lado já diz quem é, o retrato some do leitor de tela. */
    decorative?: boolean;
};

/** O que o leitor de tela lê: nome, papel e, quando muda o sentido, a expressão. */
export function castAvatarLabel(speaker: LessonCastId, name: string | undefined, expression: CastExpression): string {
    const base = `${castSpeakerName(speaker, name)}, ${CAST[speaker].role}`;
    const mood = CAST_EXPRESSION_LABEL[labelExpressionFor(speaker, expression)];
    return mood ? `${base}, ${mood}` : base;
}

/** A expressão do conjunto comum que um valor recebido representa (a família do Pixel é traduzida). */
function commonExpression(expression: CastExpression | PixelExpression | undefined): CastExpression {
    if (expression === undefined) return 'neutro';
    if (isCastExpression(expression)) return expression;
    if (expression === 'pensando' || expression === 'surpreso') return 'pensativo';
    if (expression === 'orgulhoso') return 'comemorando';
    return 'neutro';
}

/**
 * Retrato de quem fala. Lia, Caio, Duda e o paciente são desenho autoral em
 * SVG, montado por `CastPortrait`; o Pixel é a cabeça do mascote de sempre,
 * sobre a mesma placa e na mesma escala do elenco.
 */
export function CastAvatar({ speaker, name, expression, size = 'sm', accessibilityLabel, decorative = false }: CastAvatarProps) {
    const common = commonExpression(expression);
    const label = accessibilityLabel ?? castAvatarLabel(speaker, name, common);
    const dimension = PIXEL_HEAD_SIZE_MAP[size];
    const slot = { width: dimension, height: dimension, borderRadius: dimension / 2 };
    const hidden = decorative
        ? { accessible: false, accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' as const }
        : null;

    if (speaker === 'pixel') {
        return (
            <View testID="cast-avatar-pixel" style={[styles.plate, slot]} {...hidden}>
                <View style={{ transform: [{ scale: PIXEL_HEAD_SCALE_ON_PLATE }] }}>
                    <PixelIllustration variant="head" size={size} state="idle"
                        expression={expression === undefined ? undefined : pixelExpressionFor(expression)} accessibilityLabel={label} />
                </View>
            </View>
        );
    }

    return (
        <View
            testID={`cast-avatar-${speaker}`}
            style={[styles.plate, slot]}
            accessible={!decorative}
            accessibilityRole={decorative ? undefined : 'image'}
            accessibilityLabel={decorative ? undefined : label}
            {...hidden}
        >
            <CastPortrait look={castLookFor(speaker, name)} expression={common} size={size} />
        </View>
    );
}

const styles = StyleSheet.create({
    plate: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: galaxyColors.surfaceActive,
        borderWidth: 1,
        borderColor: galaxyColors.border,
    },
});
