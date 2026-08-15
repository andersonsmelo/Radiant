import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AnimatedProgressBar } from '../../../components/ui/AnimatedProgressBar';
import { DecorativeIcon } from '../../../components/ui/DecorativeIcon';
import { HeartsDisplay } from '../../../ui/components/HUD';
import { galaxyColors } from '../../../ui/theme';
import { radius, space } from '../../../ui/styles';

type QuizTopBarProps = {
  questionIndex: number;
  totalQuestions: number;
  hearts: number;
  maxHearts: number;
  onClose: () => void;
};

/**
 * Linha única no topo do quiz: fechar, progresso e vidas.
 *
 * Substitui a barra + texto "5/5" + anel de progresso que a tela declarava
 * separadamente. A barra aqui não carrega `accessibilityLabel` de progresso —
 * quem anuncia a posição é a contagem visível "Pergunta X de Y" da Task 6.
 * Duas fontes anunciariam a mesma coisa duas vezes.
 */
export function QuizTopBar({ questionIndex, totalQuestions, hearts, maxHearts, onClose }: QuizTopBarProps) {
  return (
    <View style={styles.row}>
      <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Fechar quiz" style={styles.iconButton}>
        <DecorativeIcon name="close" size={22} color={galaxyColors.textPrimary} />
      </Pressable>
      <View style={styles.barSlot}>
        <AnimatedProgressBar ratio={(questionIndex + 1) / Math.max(1, totalQuestions)} height={10} />
      </View>
      <HeartsDisplay hearts={hearts} maxHearts={maxHearts} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s2, width: '100%' },
  barSlot: { flex: 1 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.rXl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: galaxyColors.border,
  },
});
