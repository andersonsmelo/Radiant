import React from 'react';
import { render, type RenderOptions } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const TEST_INITIAL_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export function renderWithProviders(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(
    <SafeAreaProvider initialMetrics={TEST_INITIAL_METRICS}>
      {ui}
    </SafeAreaProvider>,
    options
  );
}
