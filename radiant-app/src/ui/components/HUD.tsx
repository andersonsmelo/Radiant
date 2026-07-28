/**
 * HUD — Heads-Up Display persistente
 * Exibe XP, streak e corações nas telas da galáxia.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { galaxyColors } from '../theme';

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
  icon: string;
  value: string;
  color: string;
  accessibilityLabel: string;
}) {
  // O par ícone+valor é lido como um único nó ("1.234 XP"), não como o emoji
  // decorativo seguido do número solto.
  return (
    <View style={styles.pill} accessible accessibilityRole="text" accessibilityLabel={accessibilityLabel}>
      <Text style={styles.pillIcon} importantForAccessibility="no">
        {icon}
      </Text>
      <Text style={[styles.pillValue, { color }]} importantForAccessibility="no">
        {value}
      </Text>
    </View>
  );
}

function HeartsDisplay({ hearts, maxHearts }: { hearts: number; maxHearts: number }) {
  // Um rótulo único ("3 de 5 vidas") em vez de cinco emojis lidos como
  // "coração vermelho" repetidamente. Mesmo padrão do MissionsScreen.
  return (
    <View
      style={styles.heartsRow}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${hearts} de ${maxHearts} vidas`}
    >
      {Array.from({ length: maxHearts }, (_, i) => (
        <Text
          key={i}
          style={[
            styles.heartIcon,
            i >= hearts && styles.heartEmpty,
          ]}
          importantForAccessibility="no"
        >
          {i < hearts ? '❤️' : '🤍'}
        </Text>
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
          icon="⚡"
          value={totalXp.toLocaleString()}
          color={galaxyColors.xpColor}
          accessibilityLabel={`${totalXp.toLocaleString()} XP`}
        />
        <HUDPill
          icon="🔥"
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
