import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { semanticColors } from '../../ui/semantic-colors';
import { fontFamily } from '../../ui/styles';

interface StatPillProps {
  icon: React.ReactNode;
  value: string;
  color: string;
  dark?: boolean;
}

const light = semanticColors.light;
const galaxy = semanticColors.galaxy;

export function StatPill({ icon, value, color, dark = false }: StatPillProps) {
  return (
    <View style={[styles.pill, dark ? styles.pillDark : styles.pillLight]}>
      <View style={{ flexShrink: 0 }}>{icon}</View>
      <Text style={[styles.value, { color: dark ? galaxy.textPrimary : light.textPrimary }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 30,
    paddingHorizontal: 11,
    borderRadius: 10,
  },
  pillLight: {
    backgroundColor: light.surfaceElevated,
    borderWidth: 1,
    borderColor: light.border,
    shadowColor: light.surfaceInverted,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 0,
    elevation: 1,
  },
  pillDark: {
    backgroundColor: galaxy.surfaceElevated,
    borderWidth: 1,
    borderColor: galaxy.borderFocus,
  },
  value: {
    fontFamily: fontFamily.soraBold,
    fontSize: 13,
    letterSpacing: -0.1,
  },
});
