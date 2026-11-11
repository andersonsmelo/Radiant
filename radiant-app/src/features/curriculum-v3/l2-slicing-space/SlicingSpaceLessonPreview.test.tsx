import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { SlicingSpaceLessonPreview, reviewSentence } from './SlicingSpaceLessonPreview';
import { syntheticL2 } from '../../../test/fixtures/syntheticSpatialLessons';
jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({ useReducedMotionPreferenceState: () => ({ reducedMotionEnabled: true, resolved: true }) }));

describe('injected slicing preview', () => {
  it('shows no lesson without explicit content', () => {
    render(<SlicingSpaceLessonPreview />);
    expect(screen.getByText('Conteúdo em preparação')).toBeTruthy();
    expect(screen.queryByText('Confirmar decisão')).toBeNull();
  });
  it('does not reveal feedback before confirmation and follows fresh retrieval', () => {
    render(<SlicingSpaceLessonPreview lesson={syntheticL2} />);
    expect(screen.getByText('Laboratório B')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Selecionar opção 1. Forma A'));
    expect(screen.queryByText('Registro aceito.')).toBeNull();
    fireEvent.press(screen.getByText('Confirmar decisão'));
    expect(screen.getByText('Registro aceito.')).toBeTruthy();
    fireEvent.press(screen.getByText('Tentar um cenário novo sem apoio'));
    expect(screen.getByText('Registro recovery')).toBeTruthy();
  });
  it('makes the outstanding review explicit without promising another immediate item', () => {
    expect(reviewSentence({ reviewTargetId: 'synthetic-review' })).toMatch(/revisão agendada/);
    expect(reviewSentence({ reviewTargetId: 'synthetic-review', nextChallengeId: 'next' })).toMatch(/item novo/);
  });
});
