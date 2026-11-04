import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { AppButton } from '../../../components/ui/AppButton';
import { DecorativeIcon } from '../../../components/ui/DecorativeIcon';
import { PixelIllustration } from '../../../ui/characters/PixelIllustration';
import { JourneyMedal } from '../../journey/components/JourneyMedal';
import type { IllustrationTheme } from '../../../ui/illustrations/illustrationPlayback';
import { MotionView, useMedalMint, useResultStar } from '../../../ui/motion';
import { isLargeTextScale } from '../../../ui/accessibility/useLargeTextLayout';
import { space, typography } from '../../../ui/styles';
import { galaxyColors, medalColors } from '../../../ui/theme';
import type { LessonStars } from '../services/resolveLessonStars';

export type LessonSummaryProps = {
  /** Título autoral do catálogo/abertura. Ausente apenas se a fonte não o possui. */
  title?: string;
  theme: IllustrationTheme;
  /** Estrelas DESTA tentativa (ADR de 2026-10-16). */
  stars: LessonStars;
  /** O recorde da lição; aparece à parte quando é maior que esta tentativa. */
  recordStars?: LessonStars;
  /** Revisão da trilha não é aula: muda o subtítulo e não pede avaliação. */
  kind?: 'lesson' | 'review';
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
  onRetry?: () => void;
  continueHint?: string;
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

/** Cada estrela possui seu hook; somente a preenchida encena ganho real. */
function SummaryStar({ filled, animate, index }: { filled: boolean; animate: boolean; index: number }) {
  const style = useResultStar(animate && filled, index);
  return (
    <MotionView style={style}>
      <DecorativeIcon
        name={filled ? 'star' : 'star-border'}
        size={36}
        color={filled ? medalColors.gold.face : galaxyColors.textTertiary}
      />
    </MotionView>
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
        <SummaryStar key={index} index={index} filled={index < stars} animate={animate} />
      ))}
    </View>
  );
}

/** Uma linha pode empilhar com texto ampliado; o corpo continua sem teto de escala. */
function ResultRow({ label, value, stacked, fontScale }: { label: string; value: string; stacked: boolean; fontScale: number }) {
  return (
    <View
      style={[styles.resultRow, stacked && styles.resultRowStacked]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value}`}
    >
      <Text key={`label-${fontScale}`} style={[styles.resultLabel, stacked && styles.resultTextStacked]}>{label}</Text>
      <Text key={`value-${fontScale}`} style={[styles.resultValue, stacked && styles.resultTextStacked]}>{value}</Text>
    </View>
  );
}

export function LessonSummary({
  title,
  theme,
  stars,
  recordStars,
  kind = 'lesson',
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
  onRetry,
  continueHint = 'Continua o estudo',
}: LessonSummaryProps) {
  const { fontScale } = useWindowDimensions();
  const largeText = isLargeTextScale(fontScale);
  const isZeroStars = stars === 0;
  const earned = starsImproved && !isZeroStars;
  const mintStyle = useMedalMint(earned);
  // A nova régua reconhece acertos parciais sem prometer aprovação ou domínio.
  const resultPhrase = stars > 0 && correctAnswers < totalQuestions
    ? 'Você avançou. Vale reforçar os pontos que faltaram.'
    : phrase;
  const xpResult = xpAwarded === null
    ? 'Sem XP nesta tentativa'
    : xpAwarded === 0
      ? 'Progresso registrado'
      : `+${xpAwarded} XP nesta tentativa`;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <MotionView style={mintStyle}>
            <JourneyMedal
              node={{ id: 'lesson-summary', type: 'lesson' }}
              theme={theme}
              state="done"
              appearance={isZeroStars ? 'neutral' : undefined}
              pulsing={false}
              size={68}
              accessibilityLabel={title ? `${title}. Concluído.` : 'Aula concluída.'}
            />
          </MotionView>
          {kind === 'lesson' ? (
            <PixelIllustration
              state={isZeroStars ? 'guide' : 'celebrate'}
              expression={isZeroStars ? 'neutro' : 'orgulhoso'}
              size="md"
              accessibilityLabel={isZeroStars ? 'Pixel incentivando a tentar novamente' : 'Pixel comemorando'}
            />
          ) : null}
        </View>
        <StarRow stars={stars} animate={earned} />
        {/* No cliente iOS, mudar Dynamic Type com o resultado aberto pode
            reutilizar a medição dos parágrafos. Renova só os Text: conquista,
            scroll, controles e seus efeitos continuam montados. */}
        {title ? <Text key={`title-${fontScale}`} style={styles.title} accessibilityRole="header">{title}</Text> : null}
        <Text key={`phrase-${fontScale}`} style={styles.phrase}>{resultPhrase}</Text>
        {/* Literais, com o da lição primeiro: `maestro-contract` extrai daqui a copy
            que o caminho dourado 1 afirma. */}
        {/* Com 0 estrela a lição também conta como concluída na trilha: o
            subtítulo diz o estado, e a faixa, o Pixel e a frase dizem o resultado. */}
        <React.Fragment key={`subtitle-${fontScale}`}>
          {kind !== 'review' ? (
            <Text style={styles.subtitle}>A lição foi concluída</Text>
          ) : (
            <Text style={styles.subtitle}>Revisão concluída</Text>
          )}
        </React.Fragment>
        {recordStars !== undefined && recordStars > stars ? (
          <Text key={`record-${fontScale}`} style={styles.record}>
            {`Seu recorde nesta lição: ${recordStars} ${recordStars === 1 ? 'estrela' : 'estrelas'}`}
          </Text>
        ) : null}

        <View accessible accessibilityRole="text" accessibilityLabel={`XP: ${xpResult}`} style={styles.xp}>
          <Text key={`xp-${fontScale}`} style={xpAwarded !== null && xpAwarded > 0 ? styles.xpAmount : styles.xpStatus}>
            {xpAwarded !== null && xpAwarded > 0 ? `+${xpAwarded} XP` : xpResult}
          </Text>
        </View>

        <View style={styles.results}>
          <ResultRow label="Respostas corretas" value={`${correctAnswers} de ${totalQuestions} corretas`} stacked={largeText} fontScale={fontScale} />
          {/* O total inclui lições, checkpoints e conquista; o rótulo continua sendo etapas. */}
          {unitTotal > 0 ? (
            <ResultRow label="Progresso da unidade" value={`${unitCompleted} de ${unitTotal} etapas`} stacked={largeText} fontScale={fontScale} />
          ) : null}
        </View>

        {habitLine ? <Text key={`habit-${fontScale}`} style={styles.habitLine}>{habitLine}</Text> : null}

        {nextReviewInDays !== null ? (
          <Text key={`schedule-${fontScale}`} style={styles.reviewSchedule}>
            {`Próxima revisão em ${nextReviewInDays} ${nextReviewInDays === 1 ? 'dia' : 'dias'}`}
          </Text>
        ) : null}

        {kind === 'review' ? null : currentRating === null ? (
          <View style={styles.ratingSection}>
            <Text key={`rating-label-${fontScale}`} style={styles.ratingLabel}>Avalie a aula</Text>
            <Text key={`rating-optional-${fontScale}`} style={styles.ratingOptional}>É opcional</Text>
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
          <Text key={`rating-given-${fontScale}`} style={styles.ratingGiven}>{`Você avaliou esta aula com ${currentRating} de 5`}</Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <AppButton label="Continuar" accessibilityHint={continueHint} onPress={onContinue} variant="galaxy" />
        {/* Continuar segue como a ação principal; Refazer é a alternativa. */}
        {kind === 'lesson' && correctAnswers < totalQuestions && onRetry ? (
          <AppButton label="Refazer" onPress={onRetry} variant="secondary" />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: galaxyColors.background,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.s2,
    paddingTop: space.s3,
  },
  title: {
    ...typography.h2,
    // Em texto ampliado, o parágrafo usa as métricas naturais da Sora.
    lineHeight: undefined,
    color: galaxyColors.textPrimary,
    textAlign: 'center',
  },
  xp: {
    alignItems: 'center',
    paddingVertical: space.s2,
  },
  xpAmount: {
    ...typography.h1,
    color: medalColors.gold.face,
    textAlign: 'center',
  },
  xpStatus: {
    ...typography.bodyRegular,
    color: galaxyColors.textSecondary,
    textAlign: 'center',
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
    ...typography.bodyRegular,
    lineHeight: undefined,
    color: galaxyColors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyRegular,
    lineHeight: undefined,
    color: galaxyColors.textSecondary,
    textAlign: 'center',
  },
  record: {
    ...typography.caption,
    color: galaxyColors.textTertiary,
    textAlign: 'center',
  },
  reviewSchedule: {
    ...typography.body,
    color: galaxyColors.textSecondary,
    textAlign: 'center',
  },
  results: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: galaxyColors.border,
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
    gap: space.s2,
    padding: space.s3,
  },
});
