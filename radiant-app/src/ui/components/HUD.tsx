/**
 * HUD — Heads-Up Display persistente
 * Exibe XP, streak e corações nas telas da galáxia.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { HeartsSnapshot } from '../../features/hearts/hearts.types';
import { galaxyColors } from '../theme';
import { space } from '../styles';
import { HeartIcon, StreakIcon, XpIcon } from './HudIcons';

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
      <Text style={[styles.pillValue, { color }]} importantForAccessibility="no">
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
  const summary = heartsSnapshot
    ? `${visibleHearts}${minutes === null ? '' : ` · +1 em ${minutes} min`}`
    : null;
  const accessibilityLabel = unlimited
    ? 'Vidas ilimitadas'
    : `${visibleHearts} de ${maxHearts} vidas${minutes === null ? '' : `; próxima em ${minutes} minutos`}`;
  const heartsContent = unlimited ? (
    <UnlimitedHeartsDisplay hiddenFromAccessibility={Boolean(onHeartsPress)} />
  ) : (
    <View style={styles.heartsControlContent}>
      <HeartsDisplay
        hearts={visibleHearts}
        maxHearts={maxHearts}
        hiddenFromAccessibility={Boolean(onHeartsPress)}
      />
      {summary ? <Text style={styles.heartsSummary}>{summary}</Text> : null}
    </View>
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
      <View style={[styles.container, styles.containerCompact]}>
        {heartsControl}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftGroup}>
        <HUDPill
          icon={<XpIcon value={totalXp} />}
          value={totalXp.toLocaleString()}
          color={galaxyColors.xpColor}
          accessibilityLabel={`${totalXp.toLocaleString()} XP`}
        />
        <HUDPill
          icon={<StreakIcon />}
          value={`${streakDays}d`}
          color={galaxyColors.streakColor}
          accessibilityLabel={`${streakDays} ${streakDays === 1 ? 'dia' : 'dias'} de sequência`}
        />
      </View>
      {heartsControl}
    </View>
  );
}

// ── Estilos ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  containerCompact: {
    justifyContent: 'flex-end',
    paddingVertical: 6,
  },
  leftGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: galaxyColors.hudPill,
    borderWidth: 1,
    borderColor: galaxyColors.hudPillBorder,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  pillIcon: {
    fontSize: 14,
  },
  pillValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  heartsRow: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
  },
  // Resumo SOB os corações, não ao lado: em linha, os cinco corações de 28 pt e
  // `0 · +1 em 24 min` somavam a largura e o HUD passava da borda direita da
  // trilha no iPhone 17 (defeito 3 do E2E de 2026-09-24).
  heartsControlContent: { flexDirection: 'column', alignItems: 'flex-end' },
  heartsButton: {
    borderRadius: 20,
    paddingHorizontal: space.s2,
    paddingVertical: 4,
  },
  heartsButtonPressed: { backgroundColor: galaxyColors.surfaceActive },
  heartsSummary: { fontSize: 12, fontWeight: '700', color: galaxyColors.textSecondary },
  infinity: { fontSize: 24, fontWeight: '800', color: galaxyColors.heartFull },
  heartIcon: {
    fontSize: 18,
  },
  heartEmpty: {
    opacity: 0.25,
  },
});
