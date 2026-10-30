/**
 * HUD — Heads-Up Display persistente
 * Exibe XP, streak e corações nas telas da galáxia.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { HeartsSnapshot } from '../../features/hearts/hearts.types';
import { galaxyColors, hudLabelTones } from '../theme';
import { fontFamily, layout, space } from '../styles';
import { duration } from '../motion';
import { useReducedMotionPreference } from '../accessibility/useReducedMotionPreference';
import { HeartIcon, StreakIcon, XpIcon } from './HudIcons';
import { CHROME_MAX_FONT_SCALE } from '../accessibility/useLargeTextLayout';

// ── Tipos ──────────────────────────────────────────────────────

interface HUDProps {
  totalXp: number;
  streakDays: number;
  hearts: number;
  maxHearts?: number;
  /** compact: mostra só os corações, sem pills de XP/streak */
  compact?: boolean;
  heartsSnapshot?: HeartsSnapshot;
  onHeartsPress?: () => void;
  nowMs?: number;
}

// ── Sub-componentes ───────────────────────────────────────────

function HUDPill({
  icon,
  value,
  color,
  accessibilityLabel,
}: {
  icon: React.ReactNode;
  value: string;
  color: string;
  accessibilityLabel: string;
}) {
  // O par ícone+valor é lido como um único nó ("1.234 XP"), não como o emoji
  // decorativo seguido do número solto.
  return (
    <View style={styles.pill} accessible accessibilityRole="text" accessibilityLabel={accessibilityLabel}>
      <View importantForAccessibility="no">{icon}</View>
      {/* Cromo persistente: acima do XXXL o HUD sairia da tela (achado 2 do gate
          H4). O valor completo segue no rótulo de acessibilidade. */}
      <Text
        style={[styles.pillValue, { color }]}
        importantForAccessibility="no"
        maxFontSizeMultiplier={CHROME_MAX_FONT_SCALE}
      >
        {value}
      </Text>
    </View>
  );
}

export function HeartsDisplay({
  hearts,
  maxHearts,
  hiddenFromAccessibility = false,
}: {
  hearts: number;
  maxHearts: number;
  hiddenFromAccessibility?: boolean;
}) {
  const previousHearts = useRef(hearts);
  // Índice do coração que acabou de esvaziar. `hearts` já é o valor NOVO, então
  // ele aponta para a posição perdida. Precisa ser state, e não ref: quem decide
  // se o estilo animado entra no JSX é o render, e um ref atribuído dentro do
  // efeito muda depois dele, sem reagendar nada — o transform nunca chegaria a
  // ser aplicado. Custou um teste vermelho para aparecer.
  const [lostIndex, setLostIndex] = useState<number | null>(null);

  useEffect(() => {
    const dropped = hearts < previousHearts.current;
    const gained = hearts > previousHearts.current;
    previousHearts.current = hearts;

    if (gained) {
      // Recarregou: solta o coração marcado, senão o estilo de uma perda antiga
      // fica pendurado num índice que agora está cheio.
      setLostIndex(null);
      return;
    }

    if (!dropped) {
      return;
    }

    setLostIndex(hearts);
  }, [hearts]);

  // Um rótulo único ("3 de 5 vidas") em vez de cinco emojis lidos como
  // "coração vermelho" repetidamente. Mesmo padrão do MissionsScreen.
  //
  // O rótulo é também o canal de acessibilidade da perda: sob reduced motion o
  // pulso não roda, e é ele que continua informando que uma vida se foi.
  return (
    <View
      style={styles.heartsRow}
      accessible={!hiddenFromAccessibility}
      accessibilityRole="text"
      accessibilityLabel={`${hearts} de ${maxHearts} vidas`}
      importantForAccessibility={hiddenFromAccessibility ? 'no-hide-descendants' : 'auto'}
    >
      {Array.from({ length: maxHearts }, (_, i) => (
        <View
          key={i}
          testID={`hud-heart-${i}`}
          importantForAccessibility="no"
        >
          <HeartIcon
            filled={i < hearts}
            losing={i === lostIndex}
            testID={`hud-heart-fill-${i}`}
          />
        </View>
      ))}
    </View>
  );
}

/**
 * O ∞ que SUBSTITUI os corações do assinante (spec 1.4 §5.1, ILIMITADA:
 * "corações somem"). Mostrar os dois juntos sugere que ainda há o que perder.
 * Mesmo peso visual do ∞ do `QuizTopBar`, para os dois cabeçalhos dizerem a
 * mesma coisa do mesmo jeito.
 */
export function UnlimitedHeartsDisplay({
  hiddenFromAccessibility = false,
}: {
  hiddenFromAccessibility?: boolean;
}) {
  return (
    <Text
      style={styles.infinity}
      accessible={!hiddenFromAccessibility}
      accessibilityRole="text"
      accessibilityLabel="Vidas ilimitadas"
      importantForAccessibility={hiddenFromAccessibility ? 'no-hide-descendants' : 'auto'}
    >
      ∞
    </Text>
  );
}

// HUD finito: o mesmo glifo encena cada perda; depois volta a representar
// o saldo atual. HeartsDisplay conserva sua API de cinco glifos.
export function HeartsCountPill({
  hearts,
  maxHearts = 5,
  accessibilityLabel = `${hearts} de ${maxHearts} vidas`,
  hiddenFromAccessibility = false,
}: {
  hearts: number;
  maxHearts?: number;
  accessibilityLabel?: string;
  hiddenFromAccessibility?: boolean;
}) {
  const previousHearts = useRef(hearts);
  const [lostCount, setLostCount] = useState<number | null>(null);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    const dropped = hearts < previousHearts.current;
    previousHearts.current = hearts;
    setLostCount(dropped && !reducedMotion ? hearts : null);
    if (!dropped || reducedMotion) return;

    const timer = setTimeout(() => setLostCount(null), duration.ui);
    return () => clearTimeout(timer);
  }, [hearts, reducedMotion]);

  const losing = lostCount === hearts && !reducedMotion;
  return (
    <View
      style={styles.pill}
      accessible={!hiddenFromAccessibility}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel}
      importantForAccessibility={hiddenFromAccessibility ? 'no-hide-descendants' : 'auto'}
    >
      <View testID="hud-heart-0" importantForAccessibility="no">
        {/* A chave reinicia a encenação se uma segunda perda interromper a
            primeira. O temporizador só restaura o símbolo; não altera vidas. */}
        <HeartIcon key={hearts} filled={hearts > 0 && !losing} losing={losing} testID="hud-heart-fill-0" />
      </View>
      <Text style={[styles.pillValue, { color: hudLabelTones.hearts }]} importantForAccessibility="no" maxFontSizeMultiplier={CHROME_MAX_FONT_SCALE}>
        {hearts}
      </Text>
    </View>
  );
}

// ── Componente principal ──────────────────────────────────────

function remainingMinutes(nextRefillAt: string | null, nowMs: number): number | null {
  if (nextRefillAt === null) return null;
  return Math.max(1, Math.ceil((Date.parse(nextRefillAt) - nowMs) / 60_000));
}

export function HUD({
  totalXp,
  streakDays,
  hearts,
  maxHearts = 5,
  compact = false,
  heartsSnapshot,
  onHeartsPress,
  nowMs = Date.now(),
}: HUDProps) {
  const visibleHearts = heartsSnapshot?.count ?? hearts;
  const minutes = remainingMinutes(heartsSnapshot?.nextRefillAt ?? null, nowMs);
  // Decide pelo status, nunca pelo número: o assinante que zerou chega com
  // `count: 0` e `status: 'unlimited'`.
  const unlimited = heartsSnapshot?.status === 'unlimited';
  const accessibilityLabel = unlimited
    ? 'Vidas ilimitadas'
    : `${visibleHearts} de ${maxHearts} vidas${minutes === null ? '' : `; próxima em ${minutes} minutos`}`;
  const heartsContent = unlimited ? (
    <UnlimitedHeartsDisplay hiddenFromAccessibility={Boolean(onHeartsPress)} />
  ) : (
    <HeartsCountPill
      hearts={visibleHearts}
      accessibilityLabel={accessibilityLabel}
      hiddenFromAccessibility={Boolean(onHeartsPress)}
    />
  );
  const heartsControl = onHeartsPress ? (
    <Pressable
      onPress={onHeartsPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.heartsButton, pressed && styles.heartsButtonPressed]}
    >
      {heartsContent}
    </Pressable>
  ) : heartsContent;

  if (compact) {
    return (
      <View style={[styles.hud, styles.hudCompact]}>
        {heartsControl}
      </View>
    );
  }

  return (
    <View style={styles.hud}>
      <View style={styles.leftGroup}>
        <HUDPill
          icon={<XpIcon value={totalXp} />}
          value={totalXp.toLocaleString()}
          color={hudLabelTones.xp}
          accessibilityLabel={`${totalXp.toLocaleString()} XP`}
        />
        <HUDPill
          icon={<StreakIcon />}
          value={`${streakDays}d`}
          color={hudLabelTones.streak}
          accessibilityLabel={`${streakDays} ${streakDays === 1 ? 'dia' : 'dias'} de sequência`}
        />
      </View>
      {heartsControl}
    </View>
  );
}

// ── Estilos ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  hud: {
    ...layout.rowBetween,
    paddingHorizontal: space.s4,
    paddingVertical: space.s1,
  },
  hudCompact: {
    justifyContent: 'flex-end',
    paddingVertical: space.s0,
  },
  leftGroup: {
    flexDirection: 'row',
    gap: space.s1,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s0,
    backgroundColor: galaxyColors.hudPill,
    borderWidth: 1,
    borderColor: galaxyColors.hudPillBorder,
    borderRadius: 20,
    paddingVertical: space.s0,
    paddingHorizontal: space.s1,
  },
  pillIcon: {
    fontSize: 14,
  },
  pillValue: {
    fontFamily: fontFamily.soraBold,
    fontSize: 13,
    fontWeight: '700',
  },
  heartsRow: {
    flexDirection: 'row',
    gap: space.s0,
    alignItems: 'center',
  },
  heartsButton: {
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: space.s2,
    paddingVertical: 4,
  },
  heartsButtonPressed: { backgroundColor: galaxyColors.surfaceActive },
  infinity: { fontFamily: fontFamily.soraExtraBold, fontSize: 24, fontWeight: '800', color: galaxyColors.heartFull },
  heartIcon: {
    fontSize: 18,
  },
  heartEmpty: {
    opacity: 0.25,
  },
});
