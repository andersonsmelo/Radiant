import React, { useEffect } from 'react';
import { AccessibilityInfo, Animated } from 'react-native';
import { act, render } from '@testing-library/react-native';
import { useCardEnter } from '../motion';
import { isReduceMotionForcedByLaunchArgument } from '../accessibility/motionLaunchArgument';

jest.mock('../accessibility/motionLaunchArgument', () => ({
    isReduceMotionForcedByLaunchArgument: jest.fn(() => false),
}));

const mockForcedByLaunchArgument = isReduceMotionForcedByLaunchArgument as jest.MockedFunction<
    typeof isReduceMotionForcedByLaunchArgument
>;

/**
 * Usa o hook como os três consumidores reais (`ReviewCard`, `QuizQuestion` e
 * `HomeScreen`): pede a entrada num efeito que depende das funções devolvidas.
 */
function Card({ onEffect, onValues }: {
    onEffect: () => void;
    onValues: (values: { opacity: Animated.Value; translateY: Animated.Value }) => void;
}) {
    const { opacity, translateY, reset, animateIn } = useCardEnter();
    onValues({ opacity, translateY });
    useEffect(() => {
        onEffect();
        reset();
        animateIn();
    }, [animateIn, onEffect, reset]);
    return null;
}

function valueOf(value: Animated.Value): number {
    return (value as unknown as { __getValue(): number }).__getValue();
}

describe('useCardEnter', () => {
    let resolvePreference: (enabled: boolean) => void;
    let timing: jest.SpyInstance;

    beforeEach(() => {
        mockForcedByLaunchArgument.mockReturnValue(false);
        resolvePreference = () => undefined;
        jest
            .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
            .mockReturnValue(new Promise<boolean>((resolve) => {
                resolvePreference = resolve;
            }));
        jest
            .spyOn(AccessibilityInfo, 'addEventListener')
            .mockImplementation((() => ({ remove: jest.fn() })) as never);
        timing = jest.spyOn(Animated, 'timing');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    function mount() {
        const onEffect = jest.fn();
        let values: { opacity: Animated.Value; translateY: Animated.Value } | null = null;
        render(<Card onEffect={onEffect} onValues={(v) => { values = v; }} />);
        return { onEffect, values: () => values! };
    }

    it('não começa animação antes de saber a preferência; com "Remover animações", o cartão entra parado e visível', async () => {
        // FILA 64, medido no Android em 2026-10-19: a animação nativa começada
        // antes da resposta era interrompida pelo `setValue(1)` da redução, e o
        // retorno nativo dela chegava DEPOIS, gravando opacidade 0 por cima.
        // O cartão ficava invisível. Nenhuma animação começada = nenhum retorno
        // atrasado para sobrescrever.
        const { values } = mount();
        expect(timing).not.toHaveBeenCalled();

        await act(async () => {
            resolvePreference(true);
        });

        expect(timing).not.toHaveBeenCalled();
        expect(valueOf(values().opacity)).toBe(1);
        expect(valueOf(values().translateY)).toBe(0);
    });

    it('sem redução, anima uma vez só, depois que a preferência chega', async () => {
        mount();
        expect(timing).not.toHaveBeenCalled();

        await act(async () => {
            resolvePreference(false);
        });

        // Uma entrada = duas curvas (opacidade e deslocamento).
        expect(timing).toHaveBeenCalledTimes(2);
    });

    it('a chegada da preferência não refaz o reset de quem chamou', async () => {
        // Se `reset`/`animateIn` mudassem de identidade quando a preferência
        // chega, o efeito do chamador rodaria de novo e interromperia a entrada
        // em curso: é a mesma interrupção que deixava o cartão invisível.
        const { onEffect } = mount();
        expect(onEffect).toHaveBeenCalledTimes(1);

        await act(async () => {
            resolvePreference(true);
        });

        expect(onEffect).toHaveBeenCalledTimes(1);
    });

    it('com o argumento de lançamento do E1, entra visível já na primeira passada', () => {
        mockForcedByLaunchArgument.mockReturnValue(true);

        const { values } = mount();

        expect(timing).not.toHaveBeenCalled();
        expect(valueOf(values().opacity)).toBe(1);
    });
});
