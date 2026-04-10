import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle, type AccessibilityRole } from 'react-native';
import { radius, space } from '../../ui/styles';
import { colors, shadows } from '../../ui/theme';

type SurfaceCardVariant = 'solid' | 'glass' | 'elevated';

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
