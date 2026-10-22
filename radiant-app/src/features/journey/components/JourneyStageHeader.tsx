import React, { useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';

import { galaxyColors, pixelColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
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
  const [trackWidth, setTrackWidth] = useState(0);
  // O realce só existe se couber dentro do preenchimento, com as margens da
  // prancheta: num preenchimento estreito ele vazaria para fora da ponta redonda.
  const showHighlight = trackWidth * ratio >= HIGHLIGHT_MIN_FILL;

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

      <View
        testID="journey-stage-progress-track"
        style={styles.progressTrack}
        onLayout={(event: LayoutChangeEvent) => setTrackWidth(event.nativeEvent.layout.width)}
      >
        <View
          testID="journey-stage-progress-fill"
          style={[styles.progressFill, { width: `${Math.round(ratio * 100)}%` }]}
        >
          {showHighlight ? <View testID="journey-stage-progress-highlight" style={styles.progressHighlight} /> : null}
        </View>
        {/* A barra tem 22 pt fixos: o número cresce até 1,3×, o que ainda cabe. */}
        <Text style={styles.count} maxFontSizeMultiplier={COUNT_MAX_FONT_SCALE}>{`${completed} de ${total}`}</Text>
      </View>
    </View>
  );
}

const COUNT_MAX_FONT_SCALE = 1.3;
const BAR_HEIGHT = 22;
// Margens e altura do realce da prancheta (`.md-prog i::after`): 8 de cada
// lado, 4 do topo, 5 de altura. Abaixo de 16 + 6 pt de preenchimento o realce
// teria menos de 6 pt de largura e viraria um ponto solto.
const HIGHLIGHT_INSET = 8;
const HIGHLIGHT_HEIGHT = 5;
const HIGHLIGHT_MIN_FILL = HIGHLIGHT_INSET * 2 + 6;

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
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: BAR_HEIGHT / 2,
    // O azul da ação primária do Medalhão, como o preenchimento da prancheta.
    backgroundColor: semanticColors.galaxy.actionPrimary,
  },
  progressHighlight: {
    position: 'absolute',
    left: HIGHLIGHT_INSET,
    right: HIGHLIGHT_INSET,
    top: 4,
    height: HIGHLIGHT_HEIGHT,
    // Pílula: a prancheta arredonda em 3 uma faixa de 5; metade da altura é o
    // mesmo desenho sem um raio fora da escala de `radius.*`.
    borderRadius: HIGHLIGHT_HEIGHT / 2,
    // Faixa de luz do preenchimento: branco a 28%, sem sombra nem brilho.
    backgroundColor: pixelColors.coat.light,
    opacity: 0.28,
  },
  count: {
    ...typography.label,
    // "2 de 5" em minúsculas, sem espaçamento e com algarismos de largura fixa,
    // como na prancheta. Branco: 5,75:1 sobre o azul e 13,55:1 sobre a trilha.
    textTransform: 'none',
    letterSpacing: 0,
    fontSize: 12,
    lineHeight: BAR_HEIGHT,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: semanticColors.galaxy.textOnAccent,
  },
});
