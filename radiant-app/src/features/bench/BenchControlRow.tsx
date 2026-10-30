import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type AccessibilityActionEvent } from 'react-native';
import Slider from '@react-native-community/slider';

import type { BenchControl } from '../../types/learningActivity';
import { galaxyColors } from '../../ui/theme';
import { semanticColors } from '../../ui/semantic-colors';
import { radius, space, typography } from '../../ui/styles';
import { useLargeTextLayout } from '../../ui/accessibility/useLargeTextLayout';

/** Alvo mínimo de toque dos botões − e +: 48 dp (spec da bancada, seção 8). */
const TOUCH_TARGET = 48;

function clamp(value: number, control: BenchControl): number {
  return Math.min(control.max, Math.max(control.min, value));
}

/** Arredonda ruído de ponto flutuante (0,1 + 0,2) sem mexer em passos inteiros. */
function tidy(value: number): number {
  return Math.round(value * 1e6) / 1e6;
}

function stepOf(control: BenchControl): number {
  return control.step > 0 ? control.step : 1;
}

/** O passo mais próximo de um valor bruto do arrasto, sempre dentro de [min, max]. */
function snap(raw: number, control: BenchControl): number {
  const step = stepOf(control);
  return clamp(tidy(control.min + Math.round((raw - control.min) / step) * step), control);
}

/** Um passo para cima (+1) ou para baixo (−1), preso em [min, max]. */
function stepped(value: number, direction: 1 | -1, control: BenchControl): number {
  return clamp(tidy(value + direction * stepOf(control)), control);
}

/**
 * Um controle da bancada: rótulo e valor ("70 kV"), o Slider e os botões − e +.
 *
 * Os botões e as ações `increment` e `decrement` do leitor de tela existem
 * porque arrastar não é possível para todo mundo (spec, seção 8); os três
 * caminhos chegam ao mesmo valor. O Slider fica escondido do leitor de tela e a
 * linha "ajustável" fala por ele: o Slider nativo anuncia passos de 10% da faixa,
 * e não os passos da bancada.
 *
 * O arrasto é contínuo: `onPreview` recebe o valor bruto a cada quadro (a
 * imagem acompanha o dedo) e `null` ao soltar. `onChange` sobe só quando o
 * valor cruza um passo, para o player não renderizar a cada pixel.
 */
export function BenchControlRow({
  control,
  value,
  onChange,
  onPreview,
  disabled = false,
}: {
  control: BenchControl;
  value: number;
  onChange: (next: number) => void;
  /** O valor bruto durante o arrasto, e `null` ao soltar. Opcional. */
  onPreview?: (raw: number | null) => void;
  disabled?: boolean;
}): React.ReactElement {
  const [live, setLive] = useState<number | null>(null);
  const largeText = useLargeTextLayout();

  const text = `${value} ${control.unit}`;
  const atMin = value <= control.min;
  const atMax = value >= control.max;

  const commit = (next: number) => {
    if (!disabled && next !== value) onChange(next);
  };
  const increment = () => commit(stepped(value, 1, control));
  const decrement = () => commit(stepped(value, -1, control));

  const handleAction = (event: AccessibilityActionEvent) => {
    if (event.nativeEvent.actionName === 'increment') increment();
    else if (event.nativeEvent.actionName === 'decrement') decrement();
  };

  const handleValueChange = (raw: number) => {
    if (disabled) return;
    const bounded = clamp(raw, control);
    setLive(bounded);
    onPreview?.(bounded);
    commit(snap(raw, control));
  };

  const handleSlidingComplete = (raw: number) => {
    if (disabled) return;
    setLive(null);
    onPreview?.(null);
    commit(snap(raw, control));
  };

  return (
    <View style={styles.row}>
      <View style={[styles.header, largeText && styles.headerLarge]}>
        <Text style={[styles.label, largeText && styles.naturalText]}>{control.label}</Text>
        <Text style={[styles.value, largeText && styles.naturalText]} accessibilityLiveRegion="polite">
          {text}
        </Text>
      </View>

      <View style={styles.controls}>
        <Pressable
          onPress={decrement}
          disabled={disabled || atMin}
          accessibilityRole="button"
          accessibilityLabel={`Diminuir ${control.label}`}
          accessibilityHint={`Tira um passo de ${stepOf(control)} ${control.unit}.`}
          accessibilityState={{ disabled: disabled || atMin }}
          style={[styles.button, largeText && styles.buttonLarge, (disabled || atMin) && styles.buttonOff]}
        >
          <Text style={[styles.buttonSymbol, largeText && styles.naturalText]}>−</Text>
        </Pressable>

        <View
          style={styles.sliderFrame}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={control.label}
          accessibilityValue={{ min: control.min, max: control.max, now: value, text }}
          accessibilityState={{ disabled }}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={handleAction}
        >
          <Slider
            testID={`bench-slider-${control.id}`}
            style={styles.slider}
            minimumValue={control.min}
            maximumValue={control.max}
            value={live ?? value}
            disabled={disabled}
            onValueChange={handleValueChange}
            onSlidingComplete={handleSlidingComplete}
            minimumTrackTintColor={galaxy.actionPrimary}
            maximumTrackTintColor={galaxy.border}
            thumbTintColor={galaxy.actionPrimary}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
        </View>

        <Pressable
          onPress={increment}
          disabled={disabled || atMax}
          accessibilityRole="button"
          accessibilityLabel={`Aumentar ${control.label}`}
          accessibilityHint={`Soma um passo de ${stepOf(control)} ${control.unit}.`}
          accessibilityState={{ disabled: disabled || atMax }}
          style={[styles.button, largeText && styles.buttonLarge, (disabled || atMax) && styles.buttonOff]}
        >
          <Text style={[styles.buttonSymbol, largeText && styles.naturalText]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const galaxy = semanticColors.galaxy;

const styles = StyleSheet.create({
  row: { gap: space.s1 },
  header: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  headerLarge: { flexDirection: 'column', alignItems: 'stretch', gap: space.s1 },
  // Sem teto de parágrafo na escala acessível; a caixa acompanha a fonte.
  naturalText: { lineHeight: undefined, flexShrink: 0 },
  label: { ...typography.bodyStrong, color: galaxy.textPrimary },
  value: { ...typography.bodyStrong, color: galaxy.statusInformation },
  controls: { flexDirection: 'row', alignItems: 'center', gap: space.s1 },
  button: {
    minWidth: TOUCH_TARGET,
    minHeight: TOUCH_TARGET,
    borderRadius: radius.rMd,
    borderWidth: 1,
    borderColor: galaxy.border,
    backgroundColor: galaxyColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLarge: { paddingHorizontal: space.s1, paddingVertical: space.s1 },
  buttonOff: { opacity: 0.4 },
  buttonSymbol: { ...typography.h3, color: galaxy.textPrimary },
  sliderFrame: { flex: 1, minHeight: TOUCH_TARGET, justifyContent: 'center' },
  slider: { width: '100%', height: TOUCH_TARGET },
});
