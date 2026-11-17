import React, { type ReactNode } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { CheckIcon, VerdictIcon } from '../../ui/components/VerdictIcons';
import { MotionPressable, usePressDescend } from '../../ui/motion';
import { radius, space, typography } from '../../ui/styles';
import { feedbackColors, galaxyColors, medalColors } from '../../ui/theme';

export type ChoiceOptionState = 'idle' | 'selected' | 'correct' | 'incorrect' | 'dimmed';

export type ChoiceOptionProps = {
  label: string;
  state: ChoiceOptionState;
  onPress?: () => void;
  disabled?: boolean;
  /** Depois de conferir a escolhida continua anunciada como selecionada, mesmo em `correct` ou `incorrect`. */
  chosen?: boolean;
  /** Sem `role`, é um botão que se seleciona, como a alternativa sempre foi. */
  role?: 'radio' | 'checkbox';
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  /** Imagem ou figura acima do rótulo (comparação): a face empilha em coluna. */
  media?: ReactNode;
  /** Desenha a marca de escolhida em `selected`, para a escolha não depender só de cor. */
  selectedMark?: boolean;
  /** Medida da peça inteira, com o lábio: a aula usa para rolar até a escolhida. */
  onLayout?: (event: LayoutChangeEvent) => void;
};

// Mesmo relevo do `AppButton`, com lábio de 4 pt: face na frente, lábio atrás.
const LIP = 4;
// A face desce até 1 pt do fim do lábio, para a borda dele continuar visível.
const PRESSED_OFFSET = LIP - 1;

// Face, borda e lábio por estado; sem opacidade, para o texto manter o contraste.
const TONES: Record<ChoiceOptionState, { face: string; border: string; lip: string; text: string }> = {
  idle: { face: galaxyColors.surface, border: galaxyColors.border, lip: galaxyColors.backgroundAlt, text: galaxyColors.textPrimary },
  selected: { face: galaxyColors.surfaceActive, border: galaxyColors.navBlue, lip: medalColors.unit.lip, text: galaxyColors.textPrimary },
  correct: { face: feedbackColors.success.surface, border: feedbackColors.success.fill, lip: feedbackColors.success.lip, text: feedbackColors.success.fill },
  incorrect: { face: feedbackColors.error.surface, border: feedbackColors.error.fill, lip: feedbackColors.error.lip, text: feedbackColors.error.fill },
  dimmed: { face: galaxyColors.surface, border: galaxyColors.border, lip: galaxyColors.backgroundAlt, text: galaxyColors.textTertiary },
};


export function ChoiceOption({ label, state, onPress, disabled = false, chosen, role, testID, accessibilityLabel, accessibilityHint, media, selectedMark = false, onLayout }: ChoiceOptionProps) {
  const descend = usePressDescend(PRESSED_OFFSET, disabled);
  const tone = TONES[state];
  const selected = chosen ?? state === 'selected';
  const verdict = state === 'correct' || state === 'incorrect' ? state : undefined;

  return (
    <View style={styles.relief} onLayout={onLayout}>
      <View
        testID="choice-option-lip"
        pointerEvents="none"
        style={[styles.lip, { backgroundColor: tone.lip }]}
      />
      <MotionPressable
        testID={testID}
        onPress={onPress}
        onPressIn={descend.onPressIn}
        onPressOut={descend.onPressOut}
        disabled={disabled}
        accessibilityRole={role ?? 'button'}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={accessibilityHint}
        accessibilityState={role === 'checkbox' ? { checked: selected, disabled } : { selected, disabled }}
        accessibilityValue={verdict ? { text: verdict === 'correct' ? 'certa' : 'errada' } : undefined}
        style={[media ? styles.faceStacked : styles.face, { backgroundColor: tone.face, borderColor: tone.border }, descend.style]}
      >
        {media}
        <View style={media ? styles.copyStacked : styles.copy}>
          <Text style={[styles.label, { color: tone.text }]}>{label}</Text>
          {verdict ? <VerdictIcon verdict={verdict} testID={`verdict-icon-${verdict}`} />
            : selectedMark && state === 'selected' ? <View testID="choice-option-selected-mark" accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><CheckIcon size={16} color={tone.border} /></View> : null}
        </View>
      </MotionPressable>
    </View>
  );
}

const face = {
  minHeight: 56,
  flexDirection: 'row',
  alignItems: 'center',
  gap: space.s2,
  borderWidth: 2,
  borderRadius: radius.rLg,
  paddingVertical: space.s2,
  paddingHorizontal: space.s3,
} as const;

const styles = StyleSheet.create({
  relief: { paddingBottom: LIP },
  lip: { position: 'absolute', top: LIP, bottom: 0, left: 0, right: 0, borderRadius: radius.rLg },
  face,
  // Sem `null` na lista de estilos: o utilitário de teste do Reanimated não o aceita.
  faceStacked: { ...face, flexDirection: 'column', alignItems: 'stretch' },
  copy: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  copyStacked: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  label: { ...typography.body, flex: 1 },
});
