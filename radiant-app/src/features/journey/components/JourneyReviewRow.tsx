import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { galaxyColors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';
import { LABEL_MAX_FONT_SCALE } from '../../../ui/accessibility/useLargeTextLayout';

type JourneyReviewRowProps = {
  /** Quantos itens de revisão estão devidos. Zero some com a linha. */
  dueCount: number;
  onPress: () => void;
};

/**
 * "N itens para revisar", em linha, entre o cabeçalho da unidade e a trilha.
 *
 * Sem cartão e sem etiqueta em caixa alta: duas réguas finas e a ação em azul
 * dizem o que há para fazer (A Regra Sem Cara de IA, docs/DESIGN.md). A linha
 * inteira é um botão só — o leitor de tela não precisa de duas paradas para
 * "2 itens" e "Revisar".
 */
export function JourneyReviewRow({ dueCount, onPress }: JourneyReviewRowProps): React.ReactElement | null {
  if (dueCount <= 0) return null;

  const text = dueCount === 1 ? '1 item para revisar' : `${dueCount} itens para revisar`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${text}. Revisar.`}
      onPress={onPress}
      style={styles.row}
    >
      <View accessible={false} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
        <Svg width={18} height={18} viewBox="0 0 18 18">
          <Path d="M3 9 A6 6 0 1 1 6 14.2" fill="none" stroke={galaxyColors.xpColor} strokeWidth={2.4} strokeLinecap="round" />
          <Path d="M2 5.5 V9.5 H6" fill="none" stroke={galaxyColors.xpColor} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </View>
      <Text style={styles.text} maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}>{text}</Text>
      <Text style={styles.action} maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}>Revisar</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s2,
    minHeight: 44,
    paddingVertical: space.s1,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: galaxyColors.border,
  },
  text: {
    ...typography.bodyRegular,
    color: galaxyColors.textPrimary,
    flexShrink: 1,
  },
  action: {
    ...typography.label,
    // Ação em frase, não em etiqueta de caixa alta.
    textTransform: 'none',
    letterSpacing: 0,
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 'auto',
    color: galaxyColors.navBlue,
    fontWeight: '700',
  },
});
