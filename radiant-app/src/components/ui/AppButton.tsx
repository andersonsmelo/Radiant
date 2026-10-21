import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, Pressable, View, ViewStyle, TextStyle, StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { semanticColors } from '../../ui/semantic-colors';
import { fontFamily, space } from '../../ui/styles';
import { depth, feedbackColors, galaxyColors, medalColors } from '../../ui/theme';
import { duration } from '../../ui/motion';
import { useReducedMotionPreference } from '../../ui/accessibility/useReducedMotionPreference';
import { hapticTap } from '../../ui/feedback/haptics';
import { LABEL_MAX_FONT_SCALE } from '../../ui/accessibility/useLargeTextLayout';

type Variant = 'primary' | 'galaxy' | 'secondary' | 'ghost' | 'success' | 'error';

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

/**
 * Cor do lábio por papel. `ghost` não tem lábio: é texto sem superfície, e um
 * relevo ali o faria passar por botão cheio.
 *
 * O lábio do `secondary` é o degrau mais escuro da escala de superfícies que
 * ainda se separa do fundo da tela (`backgroundAlt`, `#171920`, contra
 * `background`, `#13151c`); a face dele é `surface`, `#1b1e27`.
 */
const LIP_COLOR: Record<Exclude<Variant, 'ghost'>, string> = {
  primary: medalColors.unit.lip,
  galaxy: medalColors.unit.lip,
  secondary: galaxyColors.backgroundAlt,
  success: feedbackColors.success.lip,
  error: feedbackColors.error.lip,
};

// Quanto a face desce ao ser pressionada: até 1 pt do fim do lábio, para que a
// borda dele ainda apareça e o botão não pareça achatado contra o fundo.
const PRESSED_OFFSET = depth.lip - 1;

// A face é o próprio `Pressable`: ele carrega o papel `button`, o fundo, o foco
// e agora também a translação animada.
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  const translateY = useSharedValue(0);
  const hasLip = variant !== 'ghost';

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
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

  // Sob "reduzir movimento" a face continua descendo, que é a resposta ao
  // toque, mas de uma vez: a troca é instantânea, sem `withTiming`.
  const moveFaceTo = (target: number) => {
    if (!hasLip) {
      return;
    }

    translateY.value = reducedMotionEnabled
      ? target
      : withTiming(target, {
          duration: duration.micro,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
  };
  const onPressIn = () => moveFaceTo(PRESSED_OFFSET);
  const onPressOut = () => moveFaceTo(0);

  const onFillLabel =
    variant === 'success'
      ? feedbackColors.success.onFill
      : variant === 'error'
        ? feedbackColors.error.onFill
        : undefined;

  // Só entradas verdadeiras: o Reanimated, em jest, percorre o array de estilo
  // com `in`, que lança diante de `false`.
  const faceStyle: StyleProp<ViewStyle>[] = [styles.base, VARIANT_STYLE[variant]];
  if (!hasLip && isDisabled) {
    // Com lábio, a opacidade do desabilitado vai no conjunto: na face sozinha,
    // o lábio apareceria através dela.
    faceStyle.push(styles.disabled);
  }
  if (focused) {
    faceStyle.push(variant === 'galaxy' || variant === 'secondary' ? styles.focusGalaxy : styles.focusLight);
  }
  if (hasLip) {
    faceStyle.push(animStyle);
  }

  const face = (
    <AnimatedPressable
      testID="app-button-face"
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
      style={faceStyle}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' ? galaxy.textPrimary : (onFillLabel ?? light.textOnAccent)}
        />
      ) : null}
      {icon != null && icon}
      <Text
        style={[
          styles.label,
          variant === 'secondary' && styles.labelSecondary,
          variant === 'ghost' && styles.labelGhost,
          onFillLabel != null && { color: onFillLabel },
          textStyle,
        ]}
        maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}
      >
        {resolvedLabel}
      </Text>
    </AnimatedPressable>
  );

  return (
    <View style={[fullWidth && { width: '100%' }, style]}>
      {variant === 'ghost' ? (
        face
      ) : (
        // A altura do conjunto vem dos filhos: a face (que cresce com o rótulo)
        // mais o `paddingBottom` fixo do lábio. Nada aqui tem altura própria.
        <View
          testID="app-button-lip"
          style={[
            styles.lip,
            { backgroundColor: LIP_COLOR[variant] },
            isDisabled && styles.disabled,
          ]}
        >
          {face}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    // Altura mínima, não fixa: com texto grande o rótulo quebra linha e o botão
    // cresce, em vez de cortar ("Continuar i", achado 2 do gate H4).
    minHeight: 56,
    paddingVertical: space.s1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
  },
  // O relevo é o lábio, e não sombra: `shadow*` e `elevation` borram a borda e
  // variam entre iOS e Android.
  lip: {
    borderRadius: 18,
    paddingBottom: depth.lip,
  },
  primary: {
    backgroundColor: light.actionPrimary,
  },
  galaxy: {
    backgroundColor: galaxy.actionPrimary,
  },
  success: {
    backgroundColor: feedbackColors.success.fill,
  },
  error: {
    backgroundColor: feedbackColors.error.fill,
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

const VARIANT_STYLE: Record<Variant, ViewStyle> = {
  primary: styles.primary,
  galaxy: styles.galaxy,
  secondary: styles.secondary,
  ghost: styles.ghost,
  success: styles.success,
  error: styles.error,
};
