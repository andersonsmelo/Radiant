import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';

type JourneyStageHeaderProps = {
  /** Nome do estágio em que o aluno está — a trilha do trecho atual. */
  title: string;
  completed: number;
  total: number;
};

/**
 * O topo da aba Estude: nome do estágio, contagem e barra.
 *
 * **Substitui o `JourneyHero`** (decisão do dono, 2026-08-21). O hero ocupava a
 * primeira tela inteira com o mascote e a meta do dia, e empurrava a trilha para
 * baixo da dobra — numa aba cuja função é a trilha, o primeiro quadro não
 * mostrava trilha nenhuma.
 *
 * O contador não duplica o caminho preenchido: a cor responde "onde eu estou" de
 * relance, e o número responde "quanto falta", que a cor não diz. São perguntas
 * diferentes, e por isso os dois convivem.
 */
export function JourneyStageHeader({ title, completed, total }: JourneyStageHeaderProps) {
  // Estágio ainda sem etapas divide por zero, e `NaN%` é largura inválida no
  // React Native. Contagem inconsistente não pode transbordar a barra.
  const ratio = total > 0 ? Math.min(completed / total, 1) : 0;

  return (
    <View
      style={styles.header}
      // Peça por peça o leitor de tela faria três paradas — título, contagem,
      // barra — para uma informação só.
      accessible
      accessibilityRole="header"
      accessibilityLabel={`${title}. ${completed} de ${total} etapas concluídas.`}
    >
      <View style={styles.headline}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.count}>{`${completed} de ${total}`}</Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          testID="journey-stage-progress-fill"
          style={[styles.progressFill, { width: `${Math.round(ratio * 100)}%` }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: space.s2,
    paddingBottom: space.s1,
  },
  headline: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: space.s2,
  },
  title: {
    ...typography.h3,
    color: galaxyColors.textPrimary,
    fontWeight: '800',
    flexShrink: 1,
  },
  count: {
    ...typography.label,
    color: galaxyColors.textSecondary,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: radius.rSm,
    backgroundColor: galaxyColors.spine,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.rSm,
    // Mesma cor do trecho percorrido do caminho: a barra e a trilha contam a
    // mesma história, e usar dois verdes diferentes faria parecer que não.
    backgroundColor: galaxyColors.nodeCompletedAccent,
  },
});
