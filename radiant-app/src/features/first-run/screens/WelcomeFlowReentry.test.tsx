import React from 'react';
import { Modal } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/renderWithProviders';
import SettingsScreen from '../../settings/screens/SettingsScreen';
import { FirstRunService } from '../FirstRunService';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('../../../ui/accessibility/motionLaunchArgument', () => ({ isReduceMotionForcedByLaunchArgument: () => true }));
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('expo-router', () => ({
    Link: ({ children }: { children: React.ReactNode }) => children,
    router: { push: jest.fn(), back: jest.fn() },
    useFocusEffect: (callback: () => void) => { require('react').useEffect(callback, [callback]); },
}));
jest.mock('../../../ui/feedback/feedbackPreferences', () => ({
    DEFAULT_FEEDBACK_PREFERENCES: { sounds: true, haptics: true },
    readFeedbackPreferences: jest.fn().mockResolvedValue({ sounds: true, haptics: true }),
    writeFeedbackPreferences: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../../subscription/SubscriptionService', () => ({ subscriptionService: { getStatus: jest.fn().mockResolvedValue({ kind: 'none' }) } }));
jest.mock('../../progress-sync/ProgressSyncService', () => ({ progressSyncService: {
    getState: jest.fn().mockResolvedValue({ enabled: false, decided: false, lastBackupAt: null, lastError: null }),
    setEnabled: jest.fn(),
} }));
jest.mock('../../progress/components/AccountSyncCard', () => ({ AccountSyncCard: () => null }));
jest.mock('../../../ui/components/StarfieldBackground', () => ({ StarfieldBackground: () => null }));
// Mantém tela, Pixel, controle e imagem reais; só o renderer nativo Skia sai.
jest.mock('@shopify/react-native-skia', () => {
    const ReactInMock = require('react');
    const { View } = require('react-native');
    const host = (name: string) => {
        const Host = ({ children, ...props }: { children?: unknown }) => ReactInMock.createElement(View, { ...props, testID: `skia-${name}` }, children);
        Host.displayName = name;
        return Host;
    };
    return { Canvas: host('Canvas'), Fill: host('Fill'), Shader: host('Shader'), Skia: { RuntimeEffect: { Make: jest.fn(() => ({ kind: 'effect' })) } } };
});

const KEY = '@radiant/first_run_v1';
const ORIGINAL_MARKER = JSON.stringify({ seenAt: 100, exitedAt: 200, exitReason: 'completed', exitStep: 3 });

describe('Rever apresentação — consumidor real de Configuração', () => {
    beforeEach(async () => {
        await FirstRunService.resetForTests();
        await AsyncStorage.setItem(KEY, ORIGINAL_MARKER);
        await FirstRunService.bootstrap();
    });
    afterEach(() => { jest.restoreAllMocks(); });

    it('mede a safe area dentro da fronteira nativa do Modal, sem herdar somente o provider externo', async () => {
        // O iOS resolve o provider por superviews nativas. O contexto React do
        // wrapper de teste atravessa Modal, mas seu provider nativo não atravessa.
        const result = renderWithProviders(<SettingsScreen />);
        await waitFor(() => expect(screen.getByRole('button', { name: 'Rever apresentação' })).toBeTruthy());
        fireEvent.press(screen.getByRole('button', { name: 'Rever apresentação' }));
        const modal = result.UNSAFE_getByType(Modal);
        const localProviders = modal.findAllByType(SafeAreaProvider);
        expect(localProviders).toHaveLength(1);
        const provider = localProviders[0];
        expect(provider.props.initialMetrics).toBeUndefined();
        expect(provider.props.initialSafeAreaInsets).toBeUndefined();
        const safeView = provider.findByType(SafeAreaView);
        const skip = screen.getByLabelText('Pular apresentação');
        const nativeProviders = modal.findAll((node: { readonly type: unknown }) => node.type === 'RNCSafeAreaProvider');
        expect(nativeProviders).toHaveLength(1);
        expect(nativeProviders[0].findAll((node: unknown) => node === skip)).toHaveLength(1);
        expect(safeView.findAll((node: unknown) => node === skip)).toHaveLength(1);
        fireEvent.press(skip);
        expect(screen.queryByLabelText('Pular apresentação')).toBeNull();
        expect(await AsyncStorage.getItem(KEY)).toBe(ORIGINAL_MARKER);
    });

    it.each(['pular', 'concluir'])('%s no replay fecha o modal sem reescrever o marcador anterior', async exit => {
        const markSeen = jest.spyOn(FirstRunService, 'markSeen');
        renderWithProviders(<SettingsScreen />);
        await waitFor(() => expect(screen.getByRole('button', { name: 'Rever apresentação' })).toBeTruthy());
        fireEvent.press(screen.getByRole('button', { name: 'Rever apresentação' }));
        expect(screen.getByText('60 kV')).toBeTruthy();
        if (exit === 'concluir') {
            fireEvent.press(screen.getByLabelText('Aumentar kV'));
            fireEvent.press(screen.getByLabelText('Continuar'));
        } else {
            fireEvent.press(screen.getByLabelText('Pular apresentação'));
        }
        expect(screen.queryByLabelText('Pular apresentação')).toBeNull();
        expect(screen.getByRole('header', { name: 'Configuração' })).toBeTruthy();
        expect(markSeen).not.toHaveBeenCalled();
        expect(await AsyncStorage.getItem(KEY)).toBe(ORIGINAL_MARKER);
        expect(FirstRunService.shouldShowWelcome()).toBe(false);
        fireEvent.press(screen.getByRole('button', { name: 'Rever apresentação' }));
        expect(screen.getByText('60 kV')).toBeTruthy();
        expect(screen.getByLabelText('Continuar')).toBeDisabled();
    });
});
