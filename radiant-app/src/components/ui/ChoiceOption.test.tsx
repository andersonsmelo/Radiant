import React from 'react';
import { StyleSheet } from 'react-native';
import { act, fireEvent, render } from '@testing-library/react-native';
import { getAnimatedStyle } from 'react-native-reanimated';
import { ChoiceOption, type ChoiceOptionState } from './ChoiceOption';
import { feedbackColors, galaxyColors, medalColors } from '../../ui/theme';

let mockReducedMotion = false;
jest.mock('../../ui/accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: () => mockReducedMotion,
}));
jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual('react-native-reanimated');
  return { ...actual, __esModule: true, default: actual.default, withTiming: jest.fn(actual.withTiming) };
});
const { withTiming } = jest.requireMock('react-native-reanimated') as { withTiming: jest.Mock };

const HIDDEN = { includeHiddenElements: true };
const flat = (node: { props: { style?: unknown } }) => StyleSheet.flatten(node.props.style as never) as Record<string, unknown>;
const translateYOf = (node: Parameters<typeof getAnimatedStyle>[0]) =>
  (getAnimatedStyle(node) as { transform: { translateY: number }[] }).transform[0].translateY;

const renderState = (state: ChoiceOptionState) =>
  render(<ChoiceOption label="Pneumotórax" state={state} testID="opt" onPress={jest.fn()} />);

beforeEach(() => { jest.useFakeTimers(); withTiming.mockClear(); mockReducedMotion = false; });
afterEach(() => { jest.useRealTimers(); });

describe('ChoiceOption', () => {
  it('mostra a marca de acerto só em correct', () => {
    expect(renderState('correct').queryByTestId('verdict-icon-correct', HIDDEN)).toBeTruthy();
    for (const state of ['idle', 'selected', 'incorrect', 'dimmed'] as const) {
      expect(renderState(state).queryByTestId('verdict-icon-correct', HIDDEN)).toBeNull();
    }
  });

  it('mostra a marca de erro só em incorrect', () => {
    expect(renderState('incorrect').queryByTestId('verdict-icon-incorrect', HIDDEN)).toBeTruthy();
    for (const state of ['idle', 'selected', 'correct', 'dimmed'] as const) {
      expect(renderState(state).queryByTestId('verdict-icon-incorrect', HIDDEN)).toBeNull();
    }
  });

  it('selected anuncia selecionado (botão e radio) ou marcado (checkbox)', () => {
    expect(renderState('selected').getByTestId('opt').props.accessibilityState.selected).toBe(true);
    expect(renderState('idle').getByTestId('opt').props.accessibilityState.selected).toBe(false);
    expect(renderState('selected').getByTestId('opt').props.accessibilityRole).toBe('button');
    const radio = render(<ChoiceOption label="A" state="selected" role="radio" testID="opt" />).getByTestId('opt');
    expect(radio.props.accessibilityRole).toBe('radio');
    expect(radio.props.accessibilityState.selected).toBe(true);
    const box = render(<ChoiceOption label="A" state="selected" role="checkbox" testID="opt" />).getByTestId('opt');
    expect(box.props.accessibilityRole).toBe('checkbox');
    expect(box.props.accessibilityState.checked).toBe(true);
  });

  it('correct e incorrect dizem o veredito por extenso, além da marca', () => {
    expect(renderState('correct').getByTestId('opt').props.accessibilityValue).toEqual({ text: 'certa' });
    expect(renderState('incorrect').getByTestId('opt').props.accessibilityValue).toEqual({ text: 'errada' });
    expect(renderState('idle').getByTestId('opt').props.accessibilityValue.text).toBeUndefined();
  });

  it('chosen mantém a escolhida anunciada como selecionada mesmo depois do veredito', () => {
    const view = render(<ChoiceOption label="A" state="incorrect" chosen testID="opt" />);
    expect(view.getByTestId('opt').props.accessibilityState.selected).toBe(true);
    expect(render(<ChoiceOption label="A" state="correct" testID="opt" />).getByTestId('opt').props.accessibilityState.selected).toBe(false);
  });

  it('altura mínima de 44', () => {
    expect(flat(renderState('idle').getByTestId('opt')).minHeight).toBeGreaterThanOrEqual(44);
  });

  it('não usa opacidade em dimmed e muda só a cor do texto', () => {
    const view = renderState('dimmed');
    expect(flat(view.getByTestId('opt')).opacity).toBeUndefined();
    expect(flat(view.getByText('Pneumotórax')).color).toBe(galaxyColors.textTertiary);
    expect(flat(view.getByTestId('opt')).backgroundColor).toBe(galaxyColors.surface);
  });

  it.each([
    ['idle', galaxyColors.surface, galaxyColors.border, galaxyColors.backgroundAlt, galaxyColors.textPrimary],
    ['selected', galaxyColors.surfaceActive, galaxyColors.navBlue, medalColors.unit.lip, galaxyColors.textPrimary],
    ['correct', feedbackColors.success.surface, feedbackColors.success.fill, feedbackColors.success.lip, feedbackColors.success.fill],
    ['incorrect', feedbackColors.error.surface, feedbackColors.error.fill, feedbackColors.error.lip, feedbackColors.error.fill],
  ] as const)('%s: face, borda de 2 px, lábio e texto', (state, face, border, lip, text) => {
    const view = renderState(state);
    const faceStyle = flat(view.getByTestId('opt'));
    expect(faceStyle.backgroundColor).toBe(face);
    expect(faceStyle.borderColor).toBe(border);
    expect(faceStyle.borderWidth).toBe(2);
    expect(flat(view.getByTestId('choice-option-lip')).backgroundColor).toBe(lip);
    expect(flat(view.getByText('Pneumotórax')).color).toBe(text);
  });

  it('o lábio tem 4 pt e a face desce até 1 pt do fim dele ao pressionar', () => {
    const view = renderState('idle');
    expect(flat(view.getByTestId('choice-option-lip')).top).toBe(4);
    const face = view.getByTestId('opt');
    expect(translateYOf(face)).toBe(0);
    fireEvent(face, 'pressIn');
    expect(withTiming).toHaveBeenCalledWith(3, expect.anything());
    act(() => { jest.advanceTimersByTime(500); });
    expect(translateYOf(view.getByTestId('opt'))).toBe(3);
    fireEvent(face, 'pressOut');
    act(() => { jest.advanceTimersByTime(500); });
    expect(translateYOf(view.getByTestId('opt'))).toBe(0);
  });

  it('sob reduzir movimento a face desce de uma vez, sem withTiming', () => {
    mockReducedMotion = true;
    const view = renderState('idle');
    fireEvent(view.getByTestId('opt'), 'pressIn');
    act(() => { jest.advanceTimersByTime(16); });
    expect(withTiming).not.toHaveBeenCalled();
    expect(translateYOf(view.getByTestId('opt'))).toBe(3);
  });

  it('desabilitado não dispara onPress', () => {
    const onPress = jest.fn();
    const view = render(<ChoiceOption label="A" state="idle" disabled onPress={onPress} testID="opt" />);
    fireEvent.press(view.getByTestId('opt'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
