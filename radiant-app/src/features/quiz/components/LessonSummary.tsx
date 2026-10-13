import React, { useEffect } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../../components/ui/AppButton';
import { DecorativeIcon } from '../../../components/ui/DecorativeIcon';
import { PixelIllustration } from '../../../ui/characters/PixelIllustration';
// Telas de feature não podem importar Reanimated direto (regra R4 do QA
// visual — `scripts/visual-qa.mjs`): animação reutilizável vive em
// `ui/motion.ts`. `useScalePop` já resolve movimento reduzido por dentro.
import { useScalePop } from '../../../ui/motion';
import { LABEL_MAX_FONT_SCALE, useLargeTextLayout } from '../../../ui/accessibility/useLargeTextLayout';
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
  nextReviewInDays?: number | null;
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
const CTA_HEIGHT = 56; // altura mínima do AppButton, components/ui/AppButton.tsx
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

/** Uma linha pode empilhar com texto ampliado; o corpo continua sem teto de escala. */
function ResultRow({ label, value, stacked }: { label: string; value: string; stacked: boolean }) {
  return (
    <View
      style={[styles.resultRow, stacked && styles.resultRowStacked]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value}`}
    >
      <Text style={[styles.resultLabel, stacked && styles.resultTextStacked]}>{label}</Text>
      <Text style={[styles.resultValue, stacked && styles.resultTextStacked]}>{value}</Text>
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
  nextReviewInDays = null,
  currentRating,
  onRate,
  onContinue,
}: LessonSummaryProps) {
  const largeText = useLargeTextLayout();
  const xpResult = xpAwarded === null
    ? 'Sem XP nesta tentativa'
    : xpAwarded === 0
      ? 'Progresso registrado'
      : `+${xpAwarded} XP nesta tentativa`;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* A celebração compacta também rola: não disputa altura fixa com o texto ampliado. */}
        <View style={styles.band}>
          <PixelIllustration
            state="celebrate"
            tier="intermediate"
            size="md"
            accessibilityLabel="Pixel comemorando"
          />
          <StarRow stars={stars} animate={starsImproved} />
        </View>

        <Text style={styles.phrase} accessibilityRole="header" maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}>
          {phrase}
        </Text>
        <Text style={styles.subtitle}>A lição foi concluída</Text>

        <View style={styles.results}>
          <ResultRow label="Respostas corretas" value={`${correctAnswers} de ${totalQuestions} corretas`} stacked={largeText} />
          <ResultRow label="XP" value={xpResult} stacked={largeText} />
          {/* O total inclui lições, checkpoints e conquista; o rótulo continua sendo etapas. */}
          {unitTotal > 0 ? (
            <ResultRow label="Progresso da unidade" value={`${unitCompleted} de ${unitTotal} etapas`} stacked={largeText} />
          ) : null}
        </View>

        {habitLine ? <Text style={styles.habitLine}>{habitLine}</Text> : null}

        {nextReviewInDays !== null ? (
          <Text style={styles.reviewSchedule}>
            {`Próxima revisão em ${nextReviewInDays} ${nextReviewInDays === 1 ? 'dia' : 'dias'}`}
          </Text>
        ) : null}

        {currentRating === null ? (
          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>Avalie a aula</Text>
            <Text style={styles.ratingOptional}>É opcional</Text>
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
        <AppButton label="Continuar" accessibilityHint="Volta para Estude" onPress={onContinue} variant="galaxy" />
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
    flexDirection: 'row',
    gap: space.s2,
    paddingVertical: space.s1,
    borderRadius: radius.rLg,
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
  reviewSchedule: {
    ...typography.body,
    color: galaxyColors.textSecondary,
    textAlign: 'center',
  },
  results: {
    backgroundColor: galaxyColors.surface,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    borderRadius: radius.rLg,
    paddingHorizontal: space.s3,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s2,
    paddingVertical: space.s3,
  },
  resultRowStacked: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: space.s1,
  },
  resultLabel: {
    ...typography.bodyRegular,
    flex: 1,
    color: galaxyColors.textSecondary,
  },
  resultValue: {
    ...typography.bodyStrong,
    flex: 1,
    color: galaxyColors.textPrimary,
    textAlign: 'right',
  },
  resultTextStacked: {
    flex: 0,
    textAlign: 'left',
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
    ...typography.bodyRegular,
    color: galaxyColors.textSecondary,
    textAlign: 'center',
  },
  ratingOptional: {
    ...typography.caption,
    color: galaxyColors.textSecondary,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: space.s2,
  },
  ratingButton: {
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
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
