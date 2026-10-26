import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { renderWithProviders } from '../../../test/renderWithProviders';
import * as checkpointRuntime from '../../student-checkpoints/ActiveCheckpointRuntime';
import { CheckpointCoordinator } from '../../student-checkpoints/CheckpointCoordinator';
import { CheckpointStore } from '../../student-checkpoints/CheckpointStore';
import { MemoryKeyValueStorage } from '../../student-checkpoints/storage';
import { checkpoint, FIXED_NOW } from '../../student-checkpoints/testFixtures';
import { STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION } from '../../student-checkpoints/useShadowCheckpoint';
import { AppConfig } from '../../../config';
import { exposureModel } from '../../bench/exposureModel';
import WelcomeFlowScreen from './WelcomeFlowScreen';

jest.mock('../../../ui/accessibility/motionLaunchArgument', () => ({ isReduceMotionForcedByLaunchArgument: () => true }));

// Só o renderer nativo é substituído. ExposureImage, controle, modelo e hooks são reais.
jest.mock('@shopify/react-native-skia', () => {
    const ReactInMock = require('react');
    const { View } = require('react-native');
    const host = (name: string) => {
        const Host = ({ children, ...props }: { children?: unknown }) =>
            ReactInMock.createElement(View, { ...props, testID: `skia-${name}` }, children);
        Host.displayName = name;
        return Host;
    };
    return { Canvas: host('Canvas'), Fill: host('Fill'), Shader: host('Shader'),
        Skia: { RuntimeEffect: { Make: jest.fn(() => ({ kind: 'effect' })) } } };
});

const LOW = 'Osso branco, partes moles escuras: muito contraste.';
const MIDDLE = 'Contraste no meio: dá para ver osso e partes moles.';
const HIGH = 'Tudo cinza parecido: o feixe atravessa demais.';
const LEGAL = 'Radiant é um app educacional. Não substitui avaliação, diagnóstico ou conduta médica profissional.';
function changeKv(value: number) {
    fireEvent(screen.getByTestId('bench-slider-kv', { includeHiddenElements: true }), 'valueChange', value);
}

// Quebras cobertas: bancada ausente, faixa errada, imagem desligada do controle,
// bloqueio sem interação, duplicação de saída e perda da compatibilidade legada.
describe('WelcomeFlowScreen — primeira bancada', () => {
    it('começa em 60 kV, sem paginação, com instrução fora da fala do Pixel', () => {
        renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} />);
        expect(screen.getByRole('image', { name: 'Radiografia simulada de um fantoma' })).toBeTruthy();
        expect(screen.getByText('60 kV')).toBeTruthy();
        expect(screen.getByText('Ajuste o kV e veja a imagem mudar.')).toBeTruthy();
        expect(screen.queryByLabelText(/Tela \d de/)).toBeNull();
        expect(screen.getByLabelText('Continuar')).toBeDisabled();
        expect(screen.getByLabelText('Pular apresentação')).not.toBeDisabled();
        expect(screen.getByText(LEGAL)).toBeTruthy();
    });

    it.each([['ios', 'Sem conta. Seu progresso fica neste iPhone.'], ['android', 'Sem conta. Seu progresso fica neste aparelho.']])(
        'explica o armazenamento local na plataforma %s', (platform, privacy) => {
            const original = Platform.OS;
            Object.defineProperty(Platform, 'OS', { value: platform, configurable: true });
            try {
                renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} />);
                expect(screen.getByText(privacy)).toBeTruthy();
            } finally { Object.defineProperty(Platform, 'OS', { value: original, configurable: true }); }
        },
    );

    it('não conclui sem uma mudança real de valor', () => {
        const onFinish = jest.fn();
        renderWithProviders(<WelcomeFlowScreen onFinish={onFinish} />);
        changeKv(60);
        fireEvent.press(screen.getByLabelText('Continuar'));
        expect(onFinish).not.toHaveBeenCalled();
        expect(screen.getByLabelText('Continuar')).toBeDisabled();
    });

    it.each([[65, LOW], [70, MIDDLE], [90, MIDDLE], [95, HIGH], [100, HIGH]])(
        'ao ajustar para %s kV, muda a faixa e os números usados no shader', (kv, copy) => {
            renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} />);
            const before = screen.getByTestId('skia-Shader').props.uniforms;
            changeKv(kv as number);
            expect(screen.getByText(copy as string)).toBeTruthy();
            expect(screen.getByText(`${kv} kV`)).toBeTruthy();
            const after = screen.getByTestId('skia-Shader').props.uniforms;
            const expected = exposureModel({ kv: kv as number, mas: 10 });
            expect(after).toMatchObject(expected);
            expect(after.soft).not.toBe(before.soft);
            expect(after.bone).toBeCloseTo(before.bone, 12);
            expect(after.noise).toBe(before.noise);
            expect(after.soft).toBeGreaterThan(after.background);
            expect(after.soft).toBeLessThan(after.bone);
            expect(screen.getByLabelText('Continuar')).not.toBeDisabled();
        },
    );

    it('a imagem acompanha o preview contínuo e volta ao valor do passo ao soltar', () => {
        renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} />);
        const slider = screen.getByTestId('bench-slider-kv', { includeHiddenElements: true });
        fireEvent(slider, 'valueChange', 72);
        expect(screen.getByText('70 kV')).toBeTruthy();
        expect(screen.getByTestId('skia-Shader').props.uniforms.soft).toBe(exposureModel({ kv: 72, mas: 10 }).soft);
        fireEvent(slider, 'slidingComplete', 72);
        expect(screen.getByTestId('skia-Shader').props.uniforms.soft).toBe(exposureModel({ kv: 70, mas: 10 }).soft);
    });

    it('botões e ações acessíveis operam a bancada; voltar a 60 mantém Continuar habilitado', () => {
        renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} />);
        fireEvent.press(screen.getByLabelText('Aumentar kV'));
        expect(screen.getByText('65 kV')).toBeTruthy();
        fireEvent(screen.getByRole('adjustable', { name: 'kV' }), 'accessibilityAction', { nativeEvent: { actionName: 'decrement' } });
        expect(screen.getByText('60 kV')).toBeTruthy();
        expect(screen.getByLabelText('Continuar')).not.toBeDisabled();
    });

    it('conclui uma vez no passo 1 mesmo com toques repetidos e Pular logo depois', () => {
        const onFinish = jest.fn();
        renderWithProviders(<WelcomeFlowScreen onFinish={onFinish} />);
        changeKv(100);
        fireEvent.press(screen.getByLabelText('Continuar'));
        fireEvent.press(screen.getByLabelText('Continuar'));
        fireEvent.press(screen.getByLabelText('Pular apresentação'));
        expect(onFinish).toHaveBeenCalledTimes(1);
        expect(onFinish).toHaveBeenCalledWith('completed', 1);
    });

    it('Pular sai uma vez sem operar a bancada', () => {
        const onFinish = jest.fn();
        renderWithProviders(<WelcomeFlowScreen onFinish={onFinish} />);
        fireEvent.press(screen.getByLabelText('Pular apresentação'));
        fireEvent.press(screen.getByLabelText('Pular apresentação'));
        expect(onFinish).toHaveBeenCalledTimes(1);
        expect(onFinish).toHaveBeenCalledWith('skipped', 1);
    });

    it('avisa apenas o passo único, sem repetir ao ajustar kV', () => {
        const onStepViewed = jest.fn();
        renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} onStepViewed={onStepViewed} />);
        changeKv(100);
        expect(onStepViewed.mock.calls).toEqual([[1]]);
    });

    it('texto máximo mantém CTA e privacidade na rolagem, com Pular independente', () => {
        const dimensions = jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({ width: 320, height: 568, scale: 2, fontScale: 3.1 });
        try {
            const onFinish = jest.fn();
            const result = renderWithProviders(<WelcomeFlowScreen onFinish={onFinish} />);
            const scroll = result.UNSAFE_getByType(ScrollView);
            const continueButton = screen.getByLabelText('Continuar');
            const privacy = screen.getByText(/Sem conta\. Seu progresso fica neste/);
            const skip = screen.getByLabelText('Pular apresentação');
            expect(scroll.findAll((node: unknown) => node === continueButton)).toHaveLength(1);
            expect(scroll.findAll((node: unknown) => node === privacy)).toHaveLength(1);
            expect(scroll.findAll((node: unknown) => node === skip)).toHaveLength(0);
            fireEvent.press(screen.getByLabelText('Aumentar kV'));
            fireEvent.press(continueButton);
            expect(onFinish.mock.calls).toEqual([['completed', 1]]);
        } finally { dimensions.mockRestore(); }
    });

    it('texto máximo entrega copy inteira ao Text sem teto de parágrafo ou fonte', () => {
        const dimensions = jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({ width: 320, height: 568, scale: 2, fontScale: 3.1 });
        try {
            renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} />);
            const texts = [screen.getByText('Ajuste o kV e veja a imagem mudar.'), screen.getByText(LOW), screen.getByText(LEGAL), screen.getByText(/Sem conta\. Seu progresso fica neste/), screen.getByText('Pular')];
            for (const text of texts) {
                const style = StyleSheet.flatten(text.props.style);
                expect(style.lineHeight).toBeUndefined();
                expect(style.height).toBeUndefined();
                expect(style.maxHeight).toBeUndefined();
                expect(text.props.numberOfLines).toBeUndefined();
                expect(text.props.allowFontScaling).not.toBe(false);
                expect(text.props.maxFontSizeMultiplier).toBeUndefined();
            }
        } finally { dimensions.mockRestore(); }
    });

    it('mantém Pular dentro da safe area e fora da rolagem em viewport curta com texto máximo', () => {
        const dimensions = jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({ width: 320, height: 568, scale: 2, fontScale: 3.1 });
        const result = render(<SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 320, height: 568 }, insets: { top: 59, bottom: 34, left: 0, right: 0 } }}>
            <WelcomeFlowScreen onFinish={jest.fn()} />
        </SafeAreaProvider>);
        try {
            const safe = result.UNSAFE_getByType(SafeAreaView);
            const scroll = result.UNSAFE_getByType(ScrollView);
            const skip = screen.getByLabelText('Pular apresentação');
            const style = StyleSheet.flatten(skip.props.style);
            expect(safe.findAll((node: unknown) => node === skip)).toHaveLength(1);
            expect(scroll.findAll((node: unknown) => node === skip)).toHaveLength(0);
            expect(style.minHeight).toBeGreaterThanOrEqual(44);
            expect(style.minWidth).toBeGreaterThanOrEqual(44);
            expect(style.position).not.toBe('absolute');
            expect(screen.getByText('Ajuste o kV e veja a imagem mudar.').props.numberOfLines).toBeUndefined();
            expect(screen.getByText(LEGAL).props.numberOfLines).toBeUndefined();
        } finally { dimensions.mockRestore(); }
    });
});

describe('WelcomeFlowScreen — checkpoint real em memória', () => {
    const previousEnvironment = AppConfig.APP_ENV;
    const previousMode = process.env.EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE;
    let store: CheckpointStore;
    let runtime: checkpointRuntime.ActiveCheckpointRuntime;
    beforeEach(() => {
        AppConfig.APP_ENV = 'development';
        process.env.EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE = 'active';
        store = CheckpointStore.active(new MemoryKeyValueStorage(), () => FIXED_NOW);
        const coordinator = new CheckpointCoordinator({ mode: 'active', store, activeSurfaces: ['first-run'], commitCoordinator: { commit: jest.fn() } as never, now: () => FIXED_NOW, id: () => 'operation' });
        runtime = new checkpointRuntime.ActiveCheckpointRuntime({ mode: 'active', store, coordinator, now: () => FIXED_NOW, id: () => 'welcome-checkpoint' });
        jest.spyOn(checkpointRuntime, 'getNativeActiveCheckpointRuntime').mockReturnValue(runtime);
    });
    afterEach(() => {
        AppConfig.APP_ENV = previousEnvironment;
        if (previousMode === undefined) delete process.env.EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE;
        else process.env.EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE = previousMode;
        jest.restoreAllMocks();
    });

    it.each(['slide-1', 'slide-2', 'slide-3'])('retoma %s na bancada única e normaliza o checkpoint persistido', async cursorId => {
        await store.saveCheckpoint(checkpoint({ checkpointId: 'legacy', surface: 'first-run', flowId: 'first-run-v1', contentVersion: STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION, cursorId, totalStepCount: 3 }));
        const fallback = jest.fn();
        renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} resumeCheckpointId="legacy" resumeCursorId={cursorId} onResumeFallback={fallback} />);
        await waitFor(async () => expect(await store.getCheckpointById('legacy')).toMatchObject({ cursorId: 'slide-1', totalStepCount: 1, completedStepCount: 0 }));
        expect(screen.getByText('60 kV')).toBeTruthy();
        expect(fallback).not.toHaveBeenCalled();
    });

    it('não duplica onFinish enquanto a conclusão assíncrona do checkpoint ainda espera', async () => {
        let release!: () => void;
        const barrier = new Promise<void>(resolve => { release = resolve; });
        const realFinish = runtime.finish.bind(runtime);
        const finish = jest.spyOn(runtime, 'finish').mockImplementation(async handle => { await barrier; await realFinish(handle); });
        const onFinish = jest.fn();
        renderWithProviders(<WelcomeFlowScreen onFinish={onFinish} />);
        await waitFor(async () => expect(await store.getCheckpointById('welcome-checkpoint')).not.toBeNull());
        changeKv(100);
        fireEvent.press(screen.getByLabelText('Continuar'));
        fireEvent.press(screen.getByLabelText('Continuar'));
        fireEvent.press(screen.getByLabelText('Pular apresentação'));
        await waitFor(() => expect(finish).toHaveBeenCalledTimes(1));
        expect(onFinish.mock.calls).toEqual([['completed', 1]]);
        await act(async () => { release(); await barrier; });
        await waitFor(async () => expect(await store.getCheckpointById('welcome-checkpoint')).toMatchObject({ phase: 'superseded' }));
    });
});
