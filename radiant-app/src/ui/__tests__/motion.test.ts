import React from 'react';
import { act, render, renderHook } from '@testing-library/react-native';

import {
    useReducedMotionPreferenceState,
    type ReducedMotionPreference,
} from '../accessibility/useReducedMotionPreference';
import { useScreenFocused } from '../useScreenFocused';
import {
    createLossPulse,
    duration,
    motionPreset,
    resolveMotionValue,
    useLossPulse,
    useLottieFrameLoop,
    useMedalMint,
    useResultStar,
    MotionView,
} from '../motion';

import { readMotionStyle } from '../../test/readMotionStyle';

jest.mock('../accessibility/useReducedMotionPreference', () => ({
    useReducedMotionPreference: jest.fn(() => false),
    useReducedMotionPreferenceState: jest.fn(),
}));

jest.mock('../useScreenFocused', () => ({
    useScreenFocused: jest.fn(() => true),
}));

const mockMotion = useReducedMotionPreferenceState as jest.MockedFunction<typeof useReducedMotionPreferenceState>;
const mockFocused = useScreenFocused as jest.MockedFunction<typeof useScreenFocused>;
const setMotion = (value: ReducedMotionPreference) => mockMotion.mockReturnValue(value);

describe('motion tokens', () => {
    it('keeps durations in ascending order for predictable UI pacing', () => {
        expect(duration.micro).toBeLessThan(duration.ui);
        expect(duration.ui).toBeLessThan(duration.celebrate);
    });

    it('keeps micro interactions fast enough for tap feedback', () => {
        expect(duration.micro).toBeLessThanOrEqual(180);
    });

    it('keeps wave 1 motion presets aligned to the base pacing tokens', () => {
        expect(motionPreset.journeyEnter.duration).toBe(duration.ui);
        expect(motionPreset.lessonStepEnter.duration).toBe(duration.ui);
        expect(motionPreset.celebration.duration).toBe(duration.celebrate);
        expect(motionPreset.lessonStepEnter.translateY).toBeGreaterThan(motionPreset.journeyEnter.translateY);
    });

    it('resolves motion values when reduced motion is enabled', () => {
        expect(resolveMotionValue('animated', 'reduced', false)).toBe('animated');
        expect(resolveMotionValue('animated', 'reduced', true)).toBe('reduced');
    });

    it('expõe o pulso de perda como helper da camada, e não como animação solta', () => {
        // A regra R4 do `visual:qa:strict` reprova uso direto da API de
        // animação dentro de componentes. Este teste existe para que a
        // alternativa continue morando aqui: se `useLossPulse` sumir, quem
        // precisar do movimento vai reescrevê-lo no componente e esbarrar no
        // gate. (O comentário evita citar o literal proibido — a regra casa
        // texto, e cita-lo aqui reprovaria o próprio teste.)
        expect(typeof useLossPulse).toBe('function');
        expect(createLossPulse).toBe(useLossPulse);
    });
});

// O laço da ilustração de tema (tubo: 144 quadros a 60 fps, pose no 60). O
// Jest não toca o Skottie; a asserção recai sobre o quadro que o laço entrega
// a ele, lido ao longo de mais de um ciclo com o relógio falso.
describe('useLottieFrameLoop', () => {
    const LOOP = { totalFrames: 144, fps: 60, posterFrame: 60 };

    beforeEach(() => {
        jest.useFakeTimers();
        setMotion({ reducedMotionEnabled: false, resolved: true });
        mockFocused.mockReturnValue(true);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    function render(playing = true) {
        return renderHook((props: { playing: boolean }) => useLottieFrameLoop({ ...LOOP, ...props }), {
            initialProps: { playing },
        });
    }

    /** Quadros ao longo de ~3 s, mais que um ciclo de 2,4 s. */
    function framesOverTime(result: { current: { value: number } }) {
        const frames = [result.current.value];
        for (const step of [250, 400, 600, 800, 950]) {
            act(() => {
                jest.advanceTimersByTime(step);
            });
            frames.push(result.current.value);
        }
        return frames;
    }

    const isValidFrame = (frame: number) => Number.isFinite(frame) && frame >= 0 && frame < LOOP.totalFrames;

    it('sem redução de movimento, o laço avança a partir do quadro de pose', () => {
        const { result } = render();

        expect(result.current.value).toBe(60);
        const frames = framesOverTime(result);

        expect(new Set(frames).size).toBeGreaterThan(3);
        // Difere e continua válido: todo quadro dentro do laço.
        expect(frames.every(isValidFrame)).toBe(true);
    });

    it('o laço dá a volta: passa do fim e recomeça do início', () => {
        const { result } = render();

        const frames = framesOverTime(result);

        expect(frames.some((frame) => frame > 100)).toBe(true);
        expect(frames.some((frame) => frame < 40)).toBe(true);
    });

    it('com redução de movimento, fica parado no quadro de pose', () => {
        setMotion({ reducedMotionEnabled: true, resolved: true });
        const { result } = render();

        expect(new Set(framesOverTime(result))).toEqual(new Set([60]));
    });

    it('antes de a preferência responder, fica parado no quadro de pose', () => {
        setMotion({ reducedMotionEnabled: false, resolved: false });
        const { result } = render();

        expect(new Set(framesOverTime(result))).toEqual(new Set([60]));
    });

    it('sem playing (nó bloqueado), fica parado no quadro de pose', () => {
        const { result } = render(false);

        expect(new Set(framesOverTime(result))).toEqual(new Set([60]));
    });

    it('fora de foco, o laço não anda', () => {
        mockFocused.mockReturnValue(false);
        const { result } = render();

        expect(new Set(framesOverTime(result)).size).toBe(1);
    });

    it('o laço que já rodava para quando a tela perde o foco, e retoma ao voltar', () => {
        const { result, rerender } = render();
        act(() => {
            jest.advanceTimersByTime(500);
        });

        mockFocused.mockReturnValue(false);
        rerender({ playing: true });
        expect(new Set(framesOverTime(result)).size).toBe(1);

        mockFocused.mockReturnValue(true);
        rerender({ playing: true });
        expect(new Set(framesOverTime(result)).size).toBeGreaterThan(3);
    });
});

// Usa o estilo que a View animada recebe; avançar o quadro aplica o efeito.
describe('resultado Medalhão', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        setMotion({ reducedMotionEnabled: false, resolved: true });
    });
    afterEach(() => jest.useRealTimers());

    function Result({ earned, rating = 0 }: { earned: boolean; rating?: number }) {
        const medal = useMedalMint(earned);
        const star = useResultStar(earned, 1);
        return React.createElement(MotionView, { testID: `medal-${rating}`, style: medal },
            React.createElement(MotionView, { testID: 'star', style: star }));
    }
    const advance = (ms: number) => act(() => { jest.advanceTimersByTime(ms); });
    const expectStarFinal = (view: ReturnType<typeof render>) => {
        expect(readMotionStyle(view.getByTestId('star')).transform).toEqual([
            { translateY: expect.closeTo(0, 5) }, { scale: 1 },
        ]);
    };

    it('cunha e assenta em até 450ms; avaliar não reinicia a conquista', () => {
        const view = render(React.createElement(Result, { earned: true }));
        advance(16);
        expect(readMotionStyle(view.getByTestId('medal-0')).transform).not.toEqual([{ scale: 1 }]);
        expect(readMotionStyle(view.getByTestId('star')).transform).not.toEqual([{ translateY: 0 }, { scale: 1 }]);
        advance(450);
        expect(readMotionStyle(view.getByTestId('medal-0')).transform).toEqual([{ scale: expect.closeTo(1, 2) }]);
        expectStarFinal(view);
        view.rerender(React.createElement(Result, { earned: true, rating: 4 }));
        advance(16);
        expect(readMotionStyle(view.getByTestId('medal-4')).transform).toEqual([{ scale: expect.closeTo(1, 2) }]);
        expectStarFinal(view);
    });

    it.each([
        [true, true], [true, false], [false, false],
    ])('o primeiro quadro é final quando reduzido=%s e resolvido=%s', (reducedMotionEnabled, resolved) => {
        setMotion({ reducedMotionEnabled, resolved });
        const view = render(React.createElement(Result, { earned: true }));
        advance(16);
        expect(readMotionStyle(view.getByTestId('medal-0')).transform).toEqual([{ scale: 1 }]);
        expectStarFinal(view);
    });

    it('repetição sem melhora permanece final mesmo depois do quadro do efeito', () => {
        const view = render(React.createElement(Result, { earned: false }));
        advance(16);
        expect(readMotionStyle(view.getByTestId('medal-0')).transform).toEqual([{ scale: 1 }]);
        expectStarFinal(view);
    });

    it('não reproduz a cunhagem nem as estrelas ao resolver novamente o mesmo ganho montado', () => {
        const view = render(React.createElement(Result, { earned: true }));
        advance(450);
        view.rerender(React.createElement(Result, { earned: false }));
        view.rerender(React.createElement(Result, { earned: true }));
        advance(16);
        expect(readMotionStyle(view.getByTestId('medal-0')).transform).toEqual([{ scale: 1 }]);
        expectStarFinal(view);
    });
});
