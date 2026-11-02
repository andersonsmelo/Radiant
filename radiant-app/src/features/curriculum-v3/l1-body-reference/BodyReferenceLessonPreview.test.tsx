import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { BodyReferenceLessonPreview } from './BodyReferenceLessonPreview';
import { syntheticL1 } from '../../../test/fixtures/syntheticSpatialLessons';
jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({ useReducedMotionPreference: () => true }));

describe('injected body-reference preview', () => {
  it('shows no lesson without explicit content', () => {
    render(<BodyReferenceLessonPreview />);
    expect(screen.getByText('Conteúdo em preparação')).toBeTruthy();
    expect(screen.queryByText('Confirmar decisão')).toBeNull();
  });
  it('separates selecting an answer from feedback and confirmation', () => {
    render(<BodyReferenceLessonPreview lesson={syntheticL1} />);
    expect(screen.getByText('Laboratório A')).toBeTruthy();
    expect(screen.queryByText('Registro aceito.')).toBeNull();
    fireEvent.press(screen.getByLabelText('Selecionar opção 1. Registro A'));
    expect(screen.queryByText('Registro aceito.')).toBeNull();
    fireEvent.press(screen.getByText('Confirmar decisão'));
    expect(screen.getByText('Registro aceito.')).toBeTruthy();
  });
  it('follows the injected remediation route after an error', () => {
    render(<BodyReferenceLessonPreview lesson={syntheticL1} />);
    fireEvent.press(screen.getByLabelText('Selecionar opção 2. Registro B'));
    fireEvent.press(screen.getByText('Confirmar decisão'));
    fireEvent.press(screen.getByText('Praticar com apoio'));
    expect(screen.getByText('Registro support')).toBeTruthy();
  });
});
