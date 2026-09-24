import React from 'react';
import { screen } from '@testing-library/react-native';

import HybridLessonRoute from '../../app/licao-hibrida';
import { renderWithProviders } from '../renderWithProviders';
import { AppConfig } from '../../config';

jest.mock('expo-router', () => ({ router: { replace: jest.fn(), push: jest.fn(), back: jest.fn() } }));
jest.mock('../../features/curriculum-v3/hybrid-l1/HybridLessonScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return { HybridLessonScreen: () => React.createElement(Text, null, 'Lição híbrida') };
});
jest.mock('../../config', () => ({ AppConfig: { SHOW_DEV_TOOLS: true } }));

describe('rota do piloto da lição híbrida', () => {
  afterEach(() => { AppConfig.SHOW_DEV_TOOLS = true; });

  it('monta a lição quando as ferramentas de desenvolvimento estão ligadas', () => {
    renderWithProviders(<HybridLessonRoute />);
    expect(screen.getByText('Lição híbrida')).toBeTruthy();
  });

  it('não monta a lição no build do aluno', () => {
    AppConfig.SHOW_DEV_TOOLS = false;
    renderWithProviders(<HybridLessonRoute />);
    expect(screen.queryByText('Lição híbrida')).toBeNull();
    expect(screen.getByText('Diagnóstico restrito')).toBeTruthy();
  });
});
