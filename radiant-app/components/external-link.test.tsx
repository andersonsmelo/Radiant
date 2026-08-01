import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
  WebBrowserResultType,
} from 'expo-web-browser';

import { ExternalLink } from './external-link';

jest.mock('expo-router', () => {
  const React = require('react');
  const { Pressable } = require('react-native');

  return {
    Link: ({ children, onPress, ...rest }: React.ComponentProps<typeof Pressable>) =>
      React.createElement(
        Pressable,
        { accessibilityRole: 'link', onPress, ...rest },
        children,
      ),
  };
});

jest.mock('expo-web-browser', () => ({
  openBrowserAsync: jest.fn(),
  WebBrowserPresentationStyle: {
    AUTOMATIC: 'automatic',
  },
  WebBrowserResultType: {
    DISMISS: 'dismiss',
  },
}));

const mockedOpenBrowserAsync = jest.mocked(openBrowserAsync);
const originalExpoOs = process.env.EXPO_OS;

describe('ExternalLink', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_OS = 'ios';
    mockedOpenBrowserAsync.mockResolvedValue({ type: WebBrowserResultType.DISMISS });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (originalExpoOs === undefined) {
      delete process.env.EXPO_OS;
    } else {
      process.env.EXPO_OS = originalExpoOs;
    }
  });

  it('opens the destination inside the app on native', async () => {
    const preventDefault = jest.fn();

    render(
      <ExternalLink
        href="https://example.com/privacy"
        accessibilityLabel="Política de Privacidade"
        accessibilityHint="Abre no navegador interno"
      >
        Política de Privacidade
      </ExternalLink>,
    );

    const link = screen.getByRole('link', { name: 'Política de Privacidade' });
    fireEvent.press(link, { preventDefault });

    await waitFor(() => {
      expect(preventDefault).toHaveBeenCalledTimes(1);
      expect(mockedOpenBrowserAsync).toHaveBeenCalledWith(
        'https://example.com/privacy',
        { presentationStyle: WebBrowserPresentationStyle.AUTOMATIC },
      );
    });
    expect(link).toHaveProp('accessibilityHint', 'Abre no navegador interno');
  });

  it('contains a native browser failure and informs the user', async () => {
    mockedOpenBrowserAsync.mockRejectedValueOnce(new Error('unavailable'));
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);

    render(<ExternalLink href="https://example.com/support">Suporte</ExternalLink>);
    fireEvent.press(screen.getByRole('link'), { preventDefault: jest.fn() });

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith(
        'Não foi possível abrir o link',
        'Tente novamente em instantes.',
      );
    });
  });
});
