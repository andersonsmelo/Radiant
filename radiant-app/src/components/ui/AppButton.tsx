import React from 'react';
import { StyleSheet, Text, Pressable, ViewStyle, TextStyle, StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { semanticColors } from '../../ui/semantic-colors';
import { fontFamily } from '../../ui/styles';
import { duration, easing } from '../../ui/motion';

type Variant = 'primary' | 'galaxy' | 'secondary' | 'ghost';

const light = semanticColors.light;
const galaxy = semanticColors.galaxy;

interface AppButtonProps {
  label?: string;
  /** @deprecated Use label instead */
  children?: React.ReactNode;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function AppButton({
  label,
  children,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  icon,
  fullWidth = true,
}: AppButtonProps) {
  const resolvedLabel = label ?? (typeof children === 'string' ? children : '');
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withTiming(0.97, { duration: duration.micro, easing: easing.out });
  };
  const onPressOut = () => {
    scale.value = withTiming(1.0, { duration: duration.micro, easing: easing.out });
  };

  return (
    <Animated.View style={[animStyle, fullWidth && { width: '100%' }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        style={[
          styles.base,
          variant === 'primary' && styles.primary,
          variant === 'galaxy' && styles.galaxy,
          variant === 'secondary' && styles.secondary,
          variant === 'ghost' && styles.ghost,
          disabled && styles.disabled,
        ]}
      >
        {icon != null && icon}
        <Text
          style={[
            styles.label,
            variant === 'secondary' && styles.labelSecondary,
            variant === 'ghost' && styles.labelGhost,
            textStyle,
          ]}
        >
          {resolvedLabel}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: light.actionPrimary,
    shadowColor: light.actionPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  galaxy: {
    backgroundColor: galaxy.actionPrimary,
    shadowColor: galaxy.statusInformation,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 10,
  },
  secondary: {
    backgroundColor: galaxy.surfaceElevated,
    borderWidth: 1,
    borderColor: galaxy.borderFocus,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontFamily: fontFamily.soraExtraBold,
    fontSize: 16,
    color: light.textOnAccent,
    letterSpacing: -0.1,
  },
  labelSecondary: {
    color: galaxy.textPrimary,
  },
  labelGhost: {
    color: light.actionPrimary,
  },
});
