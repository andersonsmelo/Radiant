import React, { useCallback, useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { galaxyColors } from '../../ui/theme';
import { radius, space, typography } from '../../ui/styles';
import { duration } from '../../ui/motion';
import { useReducedMotionPreference } from '../../ui/accessibility/useReducedMotionPreference';

// Mesma curva do token `out` do motion.ts, mas reconstruída aqui com o Easing
// do REANIMATED de propósito: aquele token vem do Easing do `react-native`,
// que não é worklet e não roda na UI thread. O contrato de easing recusa o
// token do motion dentro de um worklet exatamente por isso.
const EMERGE = { duration: duration.ui, easing: Easing.bezier(0.22, 1, 0.36, 1) } as const;
const RETRACT = { duration: duration.micro, easing: Easing.bezier(0.22, 1, 0.36, 1) } as const;

interface SpeechBubbleProps {
  text: string;
  align?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
  /**
   * Distância, em px, do topo do balão até o ponto que o rabicho deve apontar.
   * Quem passa é o layout que sabe onde está a boca do Pixel — este componente
   * não conhece o mascote. Sem ela, o rabicho fica ancorado embaixo, que é o
   * comportamento histórico dos outros dois consumidores (CharacterSlot e
   * LessonVisualPanel).
   */
  tailTop?: number;
  /**
   * Quando definido, o balão nasce e recolhe animado a partir do rabicho.
   * Indefinido = balão estático, sem animação: é o que os consumidores antigos
   * esperam, e trocar esse default silenciosamente animaria telas que ninguém
   * pediu para animar.
   */
  visible?: boolean;
  /** Chamado quando o recolhimento termina, para o pai poder desmontar. */
  onHidden?: () => void;
}

/**
 * O balão do Pixel usava vidro branco (`colors.surfaceGlass`) e texto escuro —
 * e aparece em todo `PixelHeroSplit`, ou seja, em Journey, Quiz, Reward,
 * Checkpoint e Review. Era a maior superfície clara sobrevivente dentro do
 * app galaxy.
 *
 * Sobre a animação: o balão cresce A PARTIR do rabicho, não do próprio centro.
 * É o que faz a fala parecer sair da boca em vez de aparecer ao lado da cabeça.
 * Por isso `transformOrigin` acompanha `tailTop` — origem na borda esquerda, na
 * altura do rabicho. A ALTURA é animada junto com a escala de propósito: escala
 * não afeta layout, então sem animar a altura o irmão de baixo (o anel de
 * META DO DIA) saltaria de posição em vez de acompanhar.
 */
export function SpeechBubble({
  text,
  align = 'left',
  style,
  textStyle,
  testID,
  tailTop,
  visible,
  onHidden,
}: SpeechBubbleProps) {
  const animated = visible !== undefined;
  const reducedMotion = useReducedMotionPreference();
  const [naturalHeight, setNaturalHeight] = useState<number | null>(null);
  const progress = useSharedValue(animated && visible ? 1 : 0);

  const handleContentLayout = useCallback((event: LayoutChangeEvent) => {
    const measured = Math.round(event.nativeEvent.layout.height);
    setNaturalHeight((current) => (current === measured ? current : measured));
  }, []);

  useEffect(() => {
    if (!animated) {
      return;
    }

    // Sem medida ainda não há altura para animar; o valor entra direto e a
    // primeira transição real acontece no próximo toggle.
    if (naturalHeight === null) {
      progress.value = visible ? 1 : 0;
      return;
    }

    if (reducedMotion) {
      progress.value = visible ? 1 : 0;
      if (!visible) {
        onHidden?.();
      }
      return;
    }

    // Os dois call sites são escritos por extenso, e não com um ternário no
    // argumento de opções, porque o contrato de easing lê o texto da chamada:
    // ele reconhece a constante passada direto como argumento, não escondida
    // atrás de `? :`. Uma chamada só, mais curta, escaparia da verificação.
    if (visible) {
      progress.value = withTiming(1, EMERGE);
      return;
    }

    progress.value = withTiming(0, RETRACT, (finished) => {
      if (finished && onHidden) {
        runOnJS(onHidden)();
      }
    });
  }, [animated, visible, reducedMotion, naturalHeight, progress, onHidden]);

  const wrapperAnimatedStyle = useAnimatedStyle(() => {
    if (!animated || naturalHeight === null) {
      return {};
    }

    return { height: progress.value * naturalHeight };
  }, [animated, naturalHeight]);

  const contentAnimatedStyle = useAnimatedStyle(() => {
    if (!animated) {
      return {};
    }

    return {
      opacity: interpolate(progress.value, [0, 0.35, 1], [0, 1, 1]),
      transform: [{ scale: interpolate(progress.value, [0, 1], [0.3, 1]) }],
    };
  }, [animated]);

  const resolvedTailTop = tailTop !== undefined && naturalHeight !== null
    // O rabicho não pode escapar do balão: com fonte grande a boca pode cair
    // acima ou abaixo da caixa, e um rabicho solto no vazio aponta para nada.
    ? Math.min(Math.max(tailTop - TAIL_SIZE / 2, TAIL_INSET), Math.max(naturalHeight - TAIL_SIZE - TAIL_INSET, TAIL_INSET))
    : null;

  const tailPositionStyle = resolvedTailTop !== null
    ? { top: resolvedTailTop }
    : styles.tailBottom;

  return (
    <Animated.View
      style={[styles.wrapper, align === 'right' && styles.wrapperRight, animated && styles.wrapperClipped, style, wrapperAnimatedStyle]}
    >
      <Animated.View
        onLayout={handleContentLayout}
        style={[
          styles.content,
          animated && resolvedTailTop !== null
            ? { transformOrigin: [align === 'right' ? '100%' : 0, resolvedTailTop + TAIL_SIZE / 2, 0] }
            : null,
          contentAnimatedStyle,
        ]}
      >
        <View style={[styles.bubble, align === 'right' && styles.bubbleRight]}>
          <Text testID={testID} style={[styles.text, textStyle]}>{text}</Text>
        </View>
        <View
          testID={testID ? `${testID}-tail` : undefined}
          style={[styles.tail, align === 'right' ? styles.tailRight : styles.tailLeft, tailPositionStyle]}
        />
      </Animated.View>
    </Animated.View>
  );
}

const TAIL_SIZE = 18;
const TAIL_INSET = 8;

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  wrapperClipped: {
    overflow: 'hidden',
  },
  wrapperRight: {
    alignItems: 'flex-end',
  },
  content: {
    position: 'relative',
  },
  bubble: {
    backgroundColor: galaxyColors.galaxySurface2,
    borderRadius: radius.rLg,
    paddingHorizontal: space.s3,
    paddingVertical: space.s2,
    borderWidth: 1,
    borderColor: galaxyColors.borderActive,
  },
  bubbleRight: {
    alignSelf: 'flex-end',
  },
  text: {
    ...typography.body,
    color: galaxyColors.textPrimary,
    lineHeight: 24,
  },
  tail: {
    position: 'absolute',
    width: TAIL_SIZE,
    height: TAIL_SIZE,
    backgroundColor: galaxyColors.galaxySurface2,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: galaxyColors.borderActive,
    transform: [{ rotate: '45deg' }],
  },
  tailBottom: {
    bottom: 10,
  },
  tailLeft: {
    left: 10,
  },
  tailRight: {
    right: 10,
  },
});
