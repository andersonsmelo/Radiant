import React from 'react';
import { screen } from '@testing-library/react-native';
import HybridLessonRoute from '../../app/licao-hibrida';
import { renderWithProviders } from '../renderWithProviders';
import { AppConfig } from '../../config';
jest.mock('../../ui/accessibility/useReducedMotionPreference', () => ({ useReducedMotionPreference: () => true, useReducedMotionPreferenceState: () => ({ reducedMotionEnabled: true, resolved: true }) }));
jest.mock('expo-router', () => ({ router: { replace: jest.fn(), back: jest.fn() } }));
jest.mock('../../config', () => ({ AppConfig: { SHOW_DEV_TOOLS: true } }));

describe('retired hybrid deep link', () => {
  it.each([true, false])('does not reactivate the old lesson with dev tools=%s', (enabled) => {
    AppConfig.SHOW_DEV_TOOLS = enabled;
    renderWithProviders(<HybridLessonRoute />);
    expect(screen.getByText('Este conteúdo foi atualizado')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Ver a nova trilha' })).toBeTruthy();
    expect(screen.queryByText('Começar')).toBeNull();
  });
});
