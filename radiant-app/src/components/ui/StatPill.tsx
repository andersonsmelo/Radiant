import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../ui/theme';
import { fontFamily } from '../../ui/styles';

interface StatPillProps {
  icon: React.ReactNode;
  value: string;
  color: string;
  dark?: boolean;
}

export function StatPill({ icon, value, color, dark = false }: StatPillProps) {
  return (
    <View style={[styles.pill, dark ? styles.pillDark : styles.pillLight]}>
      <View style={{ flexShrink: 0 }}>{icon}</View>
      <Text style={[styles.value, { color: dark ? '#ffffff' : colors.textPrimary }]}>
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(20,35,63,0.08)',
    shadowColor: '#14233F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 0,
    elevation: 1,
  },
  pillDark: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  value: {
    fontFamily: fontFamily.soraBold,
    fontSize: 13,
    letterSpacing: -0.1,
  },
});
