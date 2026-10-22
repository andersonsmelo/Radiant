import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { galaxyColors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';
import { LABEL_MAX_FONT_SCALE, useLargeTextLayout } from '../../../ui/accessibility/useLargeTextLayout';

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
  // Com texto grande o título usa quantas linhas precisar: duas linhas ao lado
  // da contagem cortavam o nome ("Matéria, energia e r…", achado 2 do gate H4).
  // Agora a contagem mora dentro da barra, então o título já tem a linha toda.
  const largeText = useLargeTextLayout();

  return (
    <View
      style={styles.header}
      // Peça por peça o leitor de tela faria duas paradas — título e barra com
      // a contagem — para uma informação só.
      accessible
      accessibilityRole="header"
      accessibilityLabel={`${title}. ${completed} de ${total} etapas concluídas.`}
    >
      <Text style={styles.title} numberOfLines={largeText ? undefined : 2} maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}>
        {title}
      </Text>

      <View testID="journey-stage-progress-track" style={styles.progressTrack}>
        <View
          testID="journey-stage-progress-fill"
          style={[styles.progressFill, { width: `${Math.round(ratio * 100)}%` }]}
        />
        {/* A barra tem 22 pt fixos: o número cresce até 1,3×, o que ainda cabe. */}
        <Text style={styles.count} maxFontSizeMultiplier={COUNT_MAX_FONT_SCALE}>{`${completed} de ${total}`}</Text>
      </View>
    </View>
  );
}

const COUNT_MAX_FONT_SCALE = 1.3;
const BAR_HEIGHT = 22;

const styles = StyleSheet.create({
  header: {
    gap: space.s2,
    paddingBottom: space.s1,
  },
  title: {
    ...typography.h3,
    color: galaxyColors.textPrimary,
    fontWeight: '800',
  },
  progressTrack: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    backgroundColor: galaxyColors.spine,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressFill: {
    ...StyleSheet.absoluteFillObject,
    right: undefined,
    borderRadius: BAR_HEIGHT / 2,
    // Mesma cor do trecho percorrido do caminho: a barra e a trilha contam a
    // mesma história, e usar dois verdes diferentes faria parecer que não.
    backgroundColor: galaxyColors.nodeCompletedAccent,
    // O brilho da prancheta: o verde de concluído vaza um pouco da barra.
    shadowColor: galaxyColors.nodeCompletedAccent,
    shadowOpacity: 0.55,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  count: {
    ...typography.label,
    color: galaxyColors.textPrimary,
    fontWeight: '800',
    // A contagem cruza o verde e o cinza da barra; a sombra escura garante a
    // leitura nos dois fundos.
    textShadowColor: galaxyColors.background,
    textShadowRadius: 3,
    textShadowOffset: { width: 0, height: 0 },
  },
});
