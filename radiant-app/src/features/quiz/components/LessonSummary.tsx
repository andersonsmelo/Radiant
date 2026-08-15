import React, { useEffect } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AnimatedProgressBar } from '../../../components/ui/AnimatedProgressBar';
import { AppButton } from '../../../components/ui/AppButton';
import { DecorativeIcon } from '../../../components/ui/DecorativeIcon';
import { PixelIllustration } from '../../../ui/characters/PixelIllustration';
// Telas de feature não podem importar Reanimated direto (regra R4 do QA
// visual — `scripts/visual-qa.mjs`): animação reutilizável vive em
// `ui/motion.ts`. `useScalePop` já resolve movimento reduzido por dentro.
import { useScalePop } from '../../../ui/motion';
import { radius, space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';
import type { LessonStars } from '../services/resolveLessonStars';

export type LessonSummaryProps = {
  stars: LessonStars;
  starsImproved: boolean;
  phrase: string;
  xpAwarded: number | null;
  correctAnswers: number;
  totalQuestions: number;
  unitCompleted: number;
  unitTotal: number;
  habitLine: string | null;
  currentRating: number | null;
  onRate: (rating: number) => void;
  onContinue: () => void;
};

const TOTAL_STARS = 3;
const STAR_SLOTS = Array.from({ length: TOTAL_STARS }, (_, index) => index);
const RATING_MAX = 5;
const RATING_SLOTS = Array.from({ length: RATING_MAX }, (_, index) => index + 1);

// `Continuar` vive num rodapé fixo fora do ScrollView — a mesma forma do
// problema que `tabBarClearance` (src/ui/styles.ts) resolve para as telas de
// tab: um elemento fixado fora do conteúdo rolável precisa da sua própria
// reserva, ou o fim do scroll (aqui, a linha de hábito e a linha de
// avaliação) renderiza cortado ou fica invisível no primeiro paint atrás do
// botão. Esta tela não é uma tab, então ganha sua própria constante nomeada
// em vez de importar `tabBarClearance` — mesmo desenho, valor próprio.
const CTA_HEIGHT = 56; // altura fixa do AppButton, components/ui/AppButton.tsx
const ctaClearance = space.s3 * 2 /* padding vertical do rodapé */ + CTA_HEIGHT + space.s3; /* respiro */

/**
 * Uma estrela do placar, com entrada animada quando a marca melhorou.
 *
 * `animate` controla a animação de GANHO, não o preenchimento: quando a marca
 * não melhora (`animate === false`), o pop nunca dispara e a escala é fixada
 * em 1 direto — a tela não pode sugerir uma melhora que não aconteceu.
 * `useScalePop` já resolve movimento reduzido por dentro, então o mesmo vale
 * quando a pessoa pediu menos animação.
 */
function SummaryStar({ filled, animate }: { filled: boolean; animate: boolean }) {
  const { scale, style, animateIn } = useScalePop();

  useEffect(() => {
    if (animate) {
      animateIn();
    } else {
      scale.setValue(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate]);

  return (
    <Animated.View style={style}>
      <DecorativeIcon
        name={filled ? 'star' : 'star-border'}
        size={36}
        color={filled ? galaxyColors.xpColor : galaxyColors.textTertiary}
      />
    </Animated.View>
  );
}

function StarRow({ stars, animate }: { stars: LessonStars; animate: boolean }) {
  return (
    <View
      style={styles.starRow}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${stars} de ${TOTAL_STARS} estrelas`}
    >
      {STAR_SLOTS.map((index) => (
        <SummaryStar key={index} filled={index < stars} animate={animate} />
      ))}
    </View>
  );
}

export function LessonSummary({
  stars,
  starsImproved,
  phrase,
  xpAwarded,
  correctAnswers,
  totalQuestions,
  unitCompleted,
  unitTotal,
  habitLine,
  currentRating,
  onRate,
  onContinue,
}: LessonSummaryProps) {
  return (
    <View style={styles.root}>
      {/* Faixa de comemoração: só arte do Pixel, nenhum texto de leitura sobre ela. */}
      <View style={styles.band}>
        <PixelIllustration
          state="celebrate"
          tier="intermediate"
          size="lg"
          accessibilityLabel="Pixel comemorando"
        />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <StarRow stars={stars} animate={starsImproved} />

        <Text style={styles.phrase} accessibilityRole="header">
          {phrase}
        </Text>
        <Text style={styles.subtitle}>A lição foi concluída</Text>

        <View style={styles.scoreRow}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreValue}>
              {xpAwarded === null ? 'Sem XP nesta tentativa' : `+${xpAwarded} XP nesta tentativa`}
            </Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreValue}>{`${correctAnswers} de ${totalQuestions} corretas`}</Text>
          </View>
        </View>

        {unitTotal > 0 ? (
          <View style={styles.unitCard}>
            <Text style={styles.unitLabel}>Progresso da unidade</Text>
            <Text style={styles.unitValue}>{`${unitCompleted} de ${unitTotal} lições`}</Text>
            <AnimatedProgressBar
              ratio={unitCompleted / unitTotal}
              height={10}
              accessibilityLabel="Progresso da unidade"
            />
          </View>
        ) : null}

        {habitLine ? <Text style={styles.habitLine}>{habitLine}</Text> : null}

        {currentRating === null ? (
          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>Avalie a aula</Text>
            <View style={styles.ratingRow}>
              {RATING_SLOTS.map((n) => (
                <Pressable
                  key={n}
                  onPress={() => onRate(n)}
                  accessibilityRole="button"
                  accessibilityLabel={`Avaliar a aula com ${n} de 5`}
                  style={styles.ratingButton}
                >
                  <DecorativeIcon name="star" size={28} color={galaxyColors.textSecondary} />
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <Text style={styles.ratingGiven}>{`Você avaliou esta aula com ${currentRating} de 5`}</Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <AppButton label="Continuar" onPress={onContinue} variant="galaxy" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: galaxyColors.background,
  },
  band: {
    backgroundColor: galaxyColors.celebrationBand,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.s5,
  },
  body: {
    padding: space.s3,
    gap: space.s3,
    paddingBottom: ctaClearance,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: space.s2,
  },
  phrase: {
    ...typography.h3,
    color: galaxyColors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyRegular,
    color: galaxyColors.textSecondary,
    textAlign: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    gap: space.s2,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: galaxyColors.surface,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    borderRadius: radius.rLg,
    padding: space.s3,
    alignItems: 'center',
  },
  scoreValue: {
    ...typography.bodyStrong,
    color: galaxyColors.textPrimary,
    textAlign: 'center',
  },
  unitCard: {
    backgroundColor: galaxyColors.surface,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    borderRadius: radius.rLg,
    padding: space.s3,
    gap: space.s1,
  },
  unitLabel: {
    ...typography.caption,
    color: galaxyColors.textSecondary,
    textTransform: 'uppercase',
  },
  unitValue: {
    ...typography.h3,
    color: galaxyColors.textPrimary,
  },
  habitLine: {
    ...typography.bodyRegular,
    color: galaxyColors.textSecondary,
    textAlign: 'center',
  },
  ratingSection: {
    gap: space.s1,
  },
  ratingLabel: {
    ...typography.caption,
    color: galaxyColors.textSecondary,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: space.s2,
  },
  ratingButton: {
    padding: space.s1,
  },
  ratingGiven: {
    ...typography.bodyRegular,
    color: galaxyColors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    padding: space.s3,
  },
});
