import React from 'react';
import { render } from '@testing-library/react-native';
import { PixelBody } from '../../../ui/characters/PixelBody';
import { HybridLessonCharacter } from './HybridLessonCharacter';

jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: () => true,
  useReducedMotionPreferenceState: () => ({ reducedMotionEnabled: true, resolved: true }),
}));

it.each(['streak', 'summary'] as const)('preserva os braços de comemorar sob reduzir movimento no momento %s', moment => {
  const view = render(<HybridLessonCharacter moment={moment} reduceMotion={false} />);
  expect(view.UNSAFE_getByType(PixelBody).props.pose).toBe('comemora');
  view.rerender(<HybridLessonCharacter moment={moment} reduceMotion />);
  expect(view.UNSAFE_getByType(PixelBody).props.pose).toBe('comemora');
});
