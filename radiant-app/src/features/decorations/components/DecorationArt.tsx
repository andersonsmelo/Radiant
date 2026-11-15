import React from 'react';
import type { ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import type { BadgeShape, Decoration } from '../catalog';

/** Desenho do selo numa caixa de 24, só traço e preenchimento com tokens do catálogo. */
const SHAPES: Record<BadgeShape, string> = {
    faisca: 'M13 2 L4 14 H11 L10 22 L20 9 H13 Z',
    estrela: 'M12 2 L14.9 8.6 L22 9.3 L16.6 14 L18.2 21 L12 17.3 L5.8 21 L7.4 14 L2 9.3 L9.1 8.6 Z',
    escudo: 'M12 2 L20 5 V11 C20 16 16.5 20 12 22 C7.5 20 4 16 4 11 V5 Z',
    cometa: 'M3 21 L10.5 13.5 M5 15 L9 12 M9 19 L12 15',
};

/** Decorativo: quem o mostra diz o nome do selo em texto ou rótulo. */
export function DecorationBadge({ item, size = 22 }: { item: Decoration; size?: number }): React.ReactElement | null {
    if (item.art.type !== 'selo') return null;
    const { shape, fill, stroke } = item.art;
    return <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {shape === 'cometa' ? <>
            <Path d={SHAPES.cometa} stroke={fill} strokeWidth={2} strokeLinecap="round" fill="none" />
            <Circle cx={15.5} cy={8.5} r={5.5} fill={fill} stroke={stroke} strokeWidth={1.2} />
        </> : <Path d={SHAPES[shape]} fill={fill} stroke={stroke} strokeWidth={1.2} strokeLinejoin="round" />}
    </Svg>;
}

/** Anel do avatar. O anel interno, quando existe, é um segundo traço (a forma muda, não só a cor). */
export function frameStyles(item: Decoration | null): { outer: ViewStyle; inner: ViewStyle | null } | null {
    if (!item || item.art.type !== 'moldura') return null;
    return {
        outer: { borderWidth: 3, borderColor: item.art.ring, borderRadius: 999, padding: 2 },
        inner: item.art.inner ? { borderWidth: 2, borderColor: item.art.inner, borderRadius: 999 } : null,
    };
}

export function cardStyle(item: Decoration | null): ViewStyle | null {
    if (!item || item.art.type !== 'cartao') return null;
    return { backgroundColor: item.art.background, borderColor: item.art.border, borderWidth: 2, borderRadius: 20, padding: 12 };
}
