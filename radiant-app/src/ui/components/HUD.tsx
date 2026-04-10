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

function HUDPill({ icon, value, color }: { icon: string; value: string; color: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillIcon}>{icon}</Text>
      <Text style={[styles.pillValue, { color }]}>{value}</Text>
    </View>
  );
}

function HeartsDisplay({ hearts, maxHearts }: { hearts: number; maxHearts: number }) {
  return (
    <View style={styles.heartsRow}>
      {Array.from({ length: maxHearts }, (_, i) => (
        <Text
          key={i}
          style={[
            styles.heartIcon,
            i >= hearts && styles.heartEmpty,
          ]}
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
        <HUDPill icon="⚡" value={totalXp.toLocaleString()} color={galaxyColors.xpColor} />
        <HUDPill icon="🔥" value={`${streakDays}d`} color={galaxyColors.streakColor} />
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
