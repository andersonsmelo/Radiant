import React from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  type AccessibilityState,
} from 'react-native';
import { usePressScale } from '../../ui/motion';
import { colors, shadows } from '../../ui/theme';
import { radius, space, typography } from '../../ui/styles';

type AppButtonVariant = 'primary' | 'secondary' | 'ghost';

interface AppButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: AppButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityState?: AccessibilityState;
  testID?: string;
}

export function AppButton({
  onPress,
  children,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  leftSlot,
  rightSlot,
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
  testID,
}: AppButtonProps) {
  const press = usePressScale();
  const variantStyle = BUTTON_VARIANTS[variant];

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled, ...accessibilityState }}
      onPressIn={() => !disabled && press.onPressIn()}
      onPressOut={() => !disabled && press.onPressOut()}
      style={[styles.pressable, style]}
    >
      <Animated.View
        style={[
          styles.button,
          variantStyle.container,
          press.animatedStyle,
          disabled && styles.buttonDisabled,
        ]}
      >
        {leftSlot ? <View style={styles.slot}>{leftSlot}</View> : null}
        <Text style={[styles.label, variantStyle.label, disabled && styles.labelDisabled, textStyle]}>
          {children}
        </Text>
        {rightSlot ? <View style={styles.slot}>{rightSlot}</View> : null}
      </Animated.View>
    </Pressable>
  );
}

const BUTTON_VARIANTS: Record<AppButtonVariant, { container: ViewStyle; label: TextStyle }> = {
  primary: {
    container: {
      backgroundColor: colors.primary,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.18)',
      ...shadows.soft,
    },
    label: {
      color: '#FFFFFF',
    },
  },
  secondary: {
    container: {
      backgroundColor: colors.surfaceGlass,
      borderWidth: 1,
      borderColor: colors.borderSoft,
    },
    label: {
      color: colors.textPrimary,
    },
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    label: {
      color: colors.textSecondary,
    },
  },
};

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  button: {
    minHeight: 56,
    borderRadius: radius.rXl,
    paddingHorizontal: space.s4,
    paddingVertical: space.s2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.s2,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  label: {
    ...typography.body,
    fontWeight: '700',
    textAlign: 'center',
  },
  labelDisabled: {
    color: colors.textTertiary,
  },
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
