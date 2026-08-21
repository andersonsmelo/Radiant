/**
 * HUD — Heads-Up Display persistente
 * Exibe XP, streak e corações nas telas da galáxia.
 */

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { galaxyColors } from '../theme';
import { HeartIcon, StreakIcon, XpIcon } from './HudIcons';

// ── Tipos ──────────────────────────────────────────────────────

interface HUDProps {
  totalXp: number;
  streakDays: number;
  hearts: number;
  maxHearts?: number;
  /** compact: mostra só os corações, sem pills de XP/streak */
  compact?: boolean;
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

export function HeartsDisplay({ hearts, maxHearts }: { hearts: number; maxHearts: number }) {
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
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${hearts} de ${maxHearts} vidas`}
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

// ── Componente principal ──────────────────────────────────────

export function HUD({ totalXp, streakDays, hearts, maxHearts = 5, compact = false }: HUDProps) {
  if (compact) {
    return (
      <View style={[styles.container, styles.containerCompact]}>
        <HeartsDisplay hearts={hearts} maxHearts={maxHearts} />
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
      <HeartsDisplay hearts={hearts} maxHearts={maxHearts} />
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
  heartIcon: {
    fontSize: 18,
  },
  heartEmpty: {
    opacity: 0.25,
  },
});
