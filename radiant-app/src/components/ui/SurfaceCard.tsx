import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle, type AccessibilityRole } from 'react-native';
import { radius, space } from '../../ui/styles';
import { colors, galaxyColors, shadows } from '../../ui/theme';

/**
 * `galaxy` e `galaxyElevated` são as variantes do produto: a identidade oficial
 * é galaxy dark (ADR-2026-07-27). As variantes claras existem para superfícies
 * fora do produto (Storybook, ferramentas) e não devem aparecer em telas.
 */
type SurfaceCardVariant = 'galaxy' | 'galaxyElevated' | 'solid' | 'glass' | 'elevated';

interface SurfaceCardProps {
  children: React.ReactNode;
  variant?: SurfaceCardVariant;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  testID?: string;
}

export function SurfaceCard({
  children,
  variant = 'solid',
  style,
  contentStyle,
  accessibilityRole,
  accessibilityLabel,
  testID,
}: SurfaceCardProps) {
  return (
    <View
      testID={testID}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      style={[styles.base, VARIANTS[variant], style]}
    >
      <View style={contentStyle}>{children}</View>
    </View>
  );
}

const VARIANTS: Record<SurfaceCardVariant, ViewStyle> = {
  galaxy: {
    backgroundColor: galaxyColors.surface,
    borderWidth: 1,
    borderColor: galaxyColors.border,
  },
  galaxyElevated: {
    backgroundColor: galaxyColors.galaxySurface2,
    borderWidth: 1,
    borderColor: galaxyColors.borderActive,
  },
  solid: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  glass: {
    backgroundColor: colors.surfaceGlass,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  elevated: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    ...shadows.card,
  },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.rLg,
    padding: space.s3,
  },
});
