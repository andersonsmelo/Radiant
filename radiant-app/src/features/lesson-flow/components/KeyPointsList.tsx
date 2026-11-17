import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, typography } from '../../../ui/styles';
import { galaxyColors, medalColors, medalGlyphTones } from '../../../ui/theme';
import { splitKeyPoint } from '../renderers/teachBody';

const PIECE = 32;
const LIP = 3;

/** Os pontos do conceito em blocos: peça numerada, termo e explicação. */
export function KeyPointsList({ points }: { points: readonly string[] }) {
    if (points.length === 0) return null;

    return (
        <View testID="lesson-key-points" accessibilityRole="list" style={styles.list}>
            {points.map((point, index) => {
                const { term, text } = splitKeyPoint(point);
                return (
                    <View
                        key={index}
                        testID="lesson-key-point"
                        accessible
                        accessibilityLabel={`${index + 1}. ${term ? `${term}: ${text}` : text}`}
                        style={styles.block}
                    >
                        <View style={styles.piece} accessibilityElementsHidden importantForAccessibility="no">
                            <View style={styles.pieceFace}>
                                <Text style={styles.number}>{index + 1}</Text>
                            </View>
                        </View>
                        <View style={styles.copy}>
                            {term ? <Text style={styles.term}>{term}</Text> : null}
                            <Text style={term ? styles.text : styles.bareText}>{text}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    list: { gap: space.s2 },
    block: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: space.s3,
        paddingTop: space.s3,
        borderTopWidth: 1,
        borderTopColor: galaxyColors.border,
    },
    // Lábio: a peça inteira tem a cor da base e a face sobe `LIP` pontos sobre ela.
    piece: {
        width: PIECE,
        height: PIECE,
        borderRadius: PIECE / 2,
        backgroundColor: medalColors.unit.lip,
    },
    pieceFace: {
        width: PIECE,
        height: PIECE - LIP,
        borderRadius: PIECE / 2,
        backgroundColor: medalColors.unit.face,
        alignItems: 'center',
        justifyContent: 'center',
    },
    number: { ...typography.bodyStrong, lineHeight: undefined, color: medalGlyphTones.light },
    copy: { flex: 1, gap: space.s1 },
    term: { ...typography.bodyStrong, color: galaxyColors.textPrimary },
    text: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
    bareText: { ...typography.bodyRegular, color: galaxyColors.textPrimary },
});
