import React from 'react';
import { StyleSheet, Text, Pressable, ViewStyle, TextStyle, StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../ui/theme';
import { fontFamily } from '../../ui/styles';
import { duration, easing } from '../../ui/motion';

type Variant = 'primary' | 'galaxy' | 'secondary' | 'ghost';

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
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  galaxy: {
    backgroundColor: '#1535E8',
    shadowColor: '#3DCAE8',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 10,
  },
  secondary: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
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
    color: '#ffffff',
    letterSpacing: -0.1,
  },
  labelSecondary: {
    color: '#ffffff',
  },
  labelGhost: {
    color: colors.primary,
  },
});
