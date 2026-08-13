import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, Pressable, ViewStyle, TextStyle, StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { semanticColors } from '../../ui/semantic-colors';
import { fontFamily } from '../../ui/styles';
import { duration } from '../../ui/motion';
import { useReducedMotionPreference } from '../../ui/accessibility/useReducedMotionPreference';
import { hapticTap } from '../../ui/feedback/haptics';

type Variant = 'primary' | 'galaxy' | 'secondary' | 'ghost';

/**
 * Variantes que recebem retorno tátil ao serem tocadas.
 *
 * `hapticTap` existia exportado e sem nenhum chamador: o app vibrava na tab bar
 * e ao responder o quiz, e em mais nada. A saída óbvia — espalhar a chamada por
 * todo elemento tocável — é o erro que a literatura de microinterações chama de
 * *feedback overload*: quando tudo vibra, a vibração para de significar algo, e
 * a HIG pede justamente contenção em interação frequente.
 *
 * O critério aqui é ênfase: `primary` e `galaxy` são a ação principal da tela —
 * começar a lição, continuar, confirmar. `secondary` e `ghost` são alternativa e
 * saída (pular, cancelar, agora não), e um toque tátil ali daria a elas o mesmo
 * peso da ação que a tela quer. Escalar o sinal à significância do evento é a
 * mesma regra que separou `hapticLifeLost` de `hapticError`.
 */
const HAPTIC_VARIANTS: ReadonlySet<Variant> = new Set<Variant>(['primary', 'galaxy']);

const light = semanticColors.light;
const galaxy = semanticColors.galaxy;

export interface AppButtonProps {
  label?: string;
  /** @deprecated Use label instead */
  children?: React.ReactNode;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
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
  loading = false,
  style,
  textStyle,
  icon,
  fullWidth = true,
  accessibilityLabel,
  accessibilityHint,
}: AppButtonProps) {
  const resolvedLabel = label ?? (typeof children === 'string' ? children : '');
  const isDisabled = disabled || loading;
  const reducedMotionEnabled = useReducedMotionPreference();
  const [focused, setFocused] = useState(false);
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Disparado no `onPress` (commit), e não no `onPressIn` (toque). Vibrar no
  // toque parece mais imediato, mas mente quando a pessoa arrasta o dedo para
  // fora e cancela: o retorno tátil teria confirmado uma ação que não
  // aconteceu. O `Pressable` já bloqueia `onPress` em estado desabilitado, então
  // botão inerte não vibra.
  const handlePress = () => {
    if (HAPTIC_VARIANTS.has(variant)) {
      hapticTap();
    }

    onPress?.();
  };

  const onPressIn = () => {
    if (reducedMotionEnabled) {
      return;
    }

    scale.value = withTiming(0.97, {
      duration: duration.micro,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    });
  };
  const onPressOut = () => {
    if (reducedMotionEnabled) {
      scale.value = 1;
      return;
    }

    scale.value = withTiming(1.0, {
      duration: duration.micro,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    });
  };

  return (
    <Animated.View style={[animStyle, fullWidth && { width: '100%' }, style]}>
      <Pressable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? resolvedLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        style={[
          styles.base,
          variant === 'primary' && styles.primary,
          variant === 'galaxy' && styles.galaxy,
          variant === 'secondary' && styles.secondary,
          variant === 'ghost' && styles.ghost,
          isDisabled && styles.disabled,
          focused && (variant === 'galaxy' || variant === 'secondary' ? styles.focusGalaxy : styles.focusLight),
        ]}
      >
        {loading ? <ActivityIndicator size="small" color={variant === 'secondary' ? galaxy.textPrimary : light.textOnAccent} /> : null}
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
  focusLight: {
    borderWidth: 3,
    borderColor: light.borderFocus,
  },
  focusGalaxy: {
    borderWidth: 3,
    borderColor: galaxy.borderFocus,
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
