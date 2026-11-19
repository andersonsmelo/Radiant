import React, { useState } from 'react';
import { AccessibilityInfo, AppState, type AppStateStatus } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { validateLearningActivity, type LearningInteractionV2 } from '../../../types/learningActivity';
import { ActivityInteractionRenderer } from './ActivityRendererRegistry';
import { isCorrectInteractionValue } from './InteractionAnswerValue';

let mockMotion = { reducedMotionEnabled: false, resolved: true };
jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
    ...jest.requireActual('../../../ui/accessibility/useReducedMotionPreference'),
    useReducedMotionPreference: () => mockMotion.reducedMotionEnabled,
    useReducedMotionPreferenceState: () => mockMotion,
}));
let mockFocused = true;
jest.mock('../../../ui/useScreenFocused', () => ({ useScreenFocused: () => mockFocused }));

const blitz: LearningInteractionV2 = {
    id: 'bz', type: 'blitz', competencyIds: ['competency:test'], evidenceKind: 'guided-practice', completionRule: 'confirmed',
    criticalSafety: false, feedback: { correct: 'Certo.', incorrect: 'Reveja.' }, accessibility: { label: 'Rodada rápida: proteção' },
    payload: {
        prompt: 'Responda a rodada de proteção.', passCount: 5,
        statements: [
            { id: 's1', text: 'A distância reduz a dose.', isTrue: true, explanation: 'Longe da fonte, menos dose.' },
            { id: 's2', text: 'O dosímetro reduz a dose.', isTrue: false, explanation: 'O dosímetro só mede a dose.' },
            { id: 's3', text: 'O avental cobre o tronco.', isTrue: true, explanation: 'O avental protege o tronco.' },
            { id: 's4', text: 'Mais tempo reduz a dose.', isTrue: false, explanation: 'Mais tempo aumenta a dose.' },
            { id: 's5', text: 'Material rachado sai de uso.', isTrue: true, explanation: 'Material danificado sai de uso.' },
            { id: 's6', text: 'Registrar o uso é opcional.', isTrue: false, explanation: 'O registro vale em todo turno.' },
        ],
    },
};

function Harness({ submitted = false, initial }: { submitted?: boolean; initial?: string }) {
    const [value, setValue] = useState<string | undefined>(initial);
    const { Text } = jest.requireActual('react-native');
    return <>
        <ActivityInteractionRenderer interaction={blitz} value={value} onChange={setValue} submitted={submitted} />
        <Text testID="probe">{`${value ?? ''}|${isCorrectInteractionValue(blitz, value)}`}</Text>
    </>;
}
const probe = () => String(screen.getByTestId('probe').props.children);
const press = (testID: string) => fireEvent.press(screen.getByTestId(testID));
const advance = (ms: number) => act(() => { jest.advanceTimersByTime(ms); });
const hasIcon = (verdict: 'correct' | 'incorrect') => screen.queryByTestId(`verdict-icon-${verdict}`, { includeHiddenElements: true }) !== null;

/** Sistema sem leitor de tela, com o movimento comum: o relógio existe. */
async function renderTimed(props: { submitted?: boolean; initial?: string } = {}) {
    render(<Harness {...props} />);
    await act(async () => { await Promise.resolve(); });
}

describe('BlitzStepRenderer', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        mockMotion = { reducedMotionEnabled: false, resolved: true };
        mockFocused = true;
        jest.spyOn(AccessibilityInfo, 'isScreenReaderEnabled').mockResolvedValue(false);
        jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => undefined);
    });
    afterEach(() => { jest.useRealTimers(); jest.restoreAllMocks(); });

    it('mostra uma afirmação por vez, com Verdadeiro e Falso, e a contagem de seguidas zerada', async () => {
        await renderTimed();
        expect(screen.getByText('Afirmação 1 de 6')).toBeTruthy();
        expect(screen.getByText('A distância reduz a dose.')).toBeTruthy();
        expect(screen.queryByText('O dosímetro reduz a dose.')).toBeNull();
        expect(screen.getByTestId('blitz-verdadeiro').props.accessibilityRole).toBe('button');
        expect(screen.getByTestId('blitz-falso')).toBeTruthy();
        expect(screen.getByTestId('blitz-streak').props.children).toBe('0 seguidas');
    });

    it('o toque registra a resposta, mostra a marca de acerto com ícone e texto, e a próxima entra depois de 900 ms', async () => {
        await renderTimed();
        press('blitz-verdadeiro');
        expect(probe()).toBe('[true]|false');
        expect(hasIcon('correct')).toBe(true);
        expect(screen.getByText('Verdadeiro: acertou')).toBeTruthy();
        expect(screen.getByText('Longe da fonte, menos dose.')).toBeTruthy();
        expect(screen.getByTestId('blitz-streak').props.children).toBe('1 seguida');
        expect(screen.queryByTestId('blitz-verdadeiro')).toBeNull();
        advance(899);
        expect(screen.queryByTestId('blitz-verdadeiro')).toBeNull();
        advance(1);
        expect(screen.getByText('O dosímetro reduz a dose.')).toBeTruthy();
        expect(screen.getByText('Afirmação 2 de 6')).toBeTruthy();
        expect(screen.getByTestId('blitz-verdadeiro')).toBeTruthy();
    });

    it('o erro mostra a marca de erro com ícone e texto e zera a contagem; o acerto seguinte recomeça em 1', async () => {
        await renderTimed();
        press('blitz-verdadeiro'); advance(900);
        press('blitz-verdadeiro');
        expect(hasIcon('incorrect')).toBe(true);
        expect(screen.getByText('Verdadeiro: não é isso')).toBeTruthy();
        expect(screen.getByTestId('blitz-streak').props.children).toBe('0 seguidas');
        advance(900);
        press('blitz-verdadeiro');
        expect(screen.getByTestId('blitz-streak').props.children).toBe('1 seguida');
        expect(probe()).toBe('[true,true,true]|false');
    });

    it('um toque durante a marca não conta: a resposta é uma por afirmação', async () => {
        await renderTimed();
        press('blitz-verdadeiro');
        expect(screen.queryByTestId('blitz-falso')).toBeNull();
        expect(probe()).toBe('[true]|false');
    });

    it('a barra de tempo desce a cada segundo, com valor e texto, e o tempo esgotado conta como não respondida', async () => {
        await renderTimed();
        expect(screen.getByText('Tempo: 10 s')).toBeTruthy();
        advance(3000);
        expect(screen.getByText('Tempo: 7 s')).toBeTruthy();
        expect(screen.getByTestId('blitz-time-bar').props.accessibilityValue).toMatchObject({ min: 0, max: 10, now: 7 });
        advance(7000);
        expect(probe()).toBe('[null]|false');
        expect(hasIcon('incorrect')).toBe(true);
        expect(screen.getByText('Tempo esgotado')).toBeTruthy();
        expect(screen.getByTestId('blitz-streak').props.children).toBe('0 seguidas');
        advance(900);
        expect(screen.getByText('Afirmação 2 de 6')).toBeTruthy();
        expect(screen.getByText('Tempo: 10 s')).toBeTruthy();
    });

    it('o relógio para com o app em segundo plano e retoma do ponto em que parou, sem esgotar a afirmação', async () => {
        let emit: (state: AppStateStatus) => void = () => undefined;
        jest.spyOn(AppState, 'addEventListener').mockImplementation((_type, listener) => { emit = listener as typeof emit; return { remove: jest.fn() }; });
        await renderTimed();
        advance(3000);
        expect(screen.getByText('Tempo: 7 s')).toBeTruthy();
        act(() => emit('background'));
        advance(30000);
        expect(screen.getByText('Tempo: 7 s')).toBeTruthy();
        expect(probe()).toBe('|false');
        act(() => emit('active'));
        advance(1000);
        expect(screen.getByText('Tempo: 6 s')).toBeTruthy();
    });

    it('o relógio para com a tela fora de foco e retoma ao voltar', async () => {
        await renderTimed();
        advance(3000);
        mockFocused = false;
        screen.rerender(<Harness />);
        advance(30000);
        expect(screen.getByText('Tempo: 7 s')).toBeTruthy();
        expect(probe()).toBe('|false');
        mockFocused = true;
        screen.rerender(<Harness />);
        advance(1000);
        expect(screen.getByText('Tempo: 6 s')).toBeTruthy();
    });

    it('"Sem tempo" desliga o relógio pelo resto da rodada, nas afirmações seguintes também', async () => {
        await renderTimed();
        press('blitz-sem-tempo');
        expect(screen.queryByTestId('blitz-sem-tempo')).toBeNull();
        expect(screen.queryByTestId('blitz-time-bar')).toBeNull();
        expect(screen.getByText('Sem relógio nesta rodada.')).toBeTruthy();
        advance(60_000);
        expect(probe()).toBe('|false');
        press('blitz-verdadeiro'); advance(900);
        expect(screen.queryByTestId('blitz-time-bar')).toBeNull();
        advance(60_000);
        expect(probe()).toBe('[true]|false');
    });

    it('com leitor de tela o relógio não existe, o avanço é pelo botão Próxima e a marca é anunciada', async () => {
        (AccessibilityInfo.isScreenReaderEnabled as jest.Mock).mockResolvedValue(true);
        await renderTimed();
        expect(screen.queryByTestId('blitz-time-bar')).toBeNull();
        expect(screen.queryByTestId('blitz-sem-tempo')).toBeNull();
        advance(60_000);
        expect(probe()).toBe('|false');
        press('blitz-falso');
        expect(AccessibilityInfo.announceForAccessibility).toHaveBeenLastCalledWith('Não é isso. Longe da fonte, menos dose. 0 seguidas.');
        advance(900 * 5);
        expect(screen.getByLabelText(/^Afirmação 1: A distância reduz a dose\. Você marcou falso\. Não é isso\./)).toBeTruthy();
        press('blitz-proxima');
        expect(screen.getByText('Afirmação 2 de 6')).toBeTruthy();
        expect(screen.queryByTestId('blitz-proxima')).toBeNull();
    });

    it('com "reduzir movimento" o relógio não existe, e o avanço continua sozinho', async () => {
        mockMotion = { reducedMotionEnabled: true, resolved: true };
        await renderTimed();
        expect(screen.queryByTestId('blitz-time-bar')).toBeNull();
        expect(screen.queryByTestId('blitz-sem-tempo')).toBeNull();
        advance(60_000);
        expect(probe()).toBe('|false');
        press('blitz-verdadeiro'); advance(900);
        expect(screen.getByText('Afirmação 2 de 6')).toBeTruthy();
    });

    it('enquanto a preferência de movimento ou o leitor de tela não respondem, o relógio não começa', async () => {
        mockMotion = { reducedMotionEnabled: false, resolved: false };
        await renderTimed();
        expect(screen.queryByTestId('blitz-time-bar')).toBeNull();
        advance(60_000);
        expect(probe()).toBe('|false');
        mockMotion = { reducedMotionEnabled: false, resolved: true };
        let release: (on: boolean) => void = () => undefined;
        (AccessibilityInfo.isScreenReaderEnabled as jest.Mock).mockReturnValue(new Promise<boolean>(resolve => { release = resolve; }));
        screen.unmount();
        render(<Harness />);
        expect(screen.queryByTestId('blitz-time-bar')).toBeNull();
        advance(60_000);
        expect(probe()).toBe('|false');
        await act(async () => { release(false); await Promise.resolve(); });
        expect(screen.getByTestId('blitz-time-bar')).toBeTruthy();
    });

    it('ligar o leitor de tela no meio da rodada para o relógio, e o avanço passa a ser pelo botão Próxima', async () => {
        let listener: (on: boolean) => void = () => undefined;
        const remove = jest.fn();
        jest.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation(((name: string, handler: (on: boolean) => void) => { if (name === 'screenReaderChanged') listener = handler; return { remove }; }) as never);
        await renderTimed();
        advance(3000);
        expect(screen.getByText('Tempo: 7 s')).toBeTruthy();
        act(() => listener(true));
        expect(screen.queryByTestId('blitz-time-bar')).toBeNull();
        advance(60_000);
        expect(probe()).toBe('|false');
        press('blitz-verdadeiro');
        advance(900 * 5);
        expect(screen.getByTestId('blitz-proxima')).toBeTruthy();
        expect(screen.queryByText('Afirmação 2 de 6')).toBeNull();
        screen.unmount();
        expect(remove).toHaveBeenCalled();
    });

    it('as respostas que zeram no retry apagam a marca e o botão Próxima', async () => {
        (AccessibilityInfo.isScreenReaderEnabled as jest.Mock).mockResolvedValue(true);
        const view = render(<Harness />);
        await act(async () => { await Promise.resolve(); });
        press('blitz-verdadeiro');
        expect(screen.getByTestId('blitz-proxima')).toBeTruthy();
        view.unmount();
        // Retry: a tela volta com as respostas zeradas e o renderer vivo; simulado por um valor controlado.
        function Retry() {
            const [value, setValue] = useState<string | undefined>();
            const { Text } = jest.requireActual('react-native');
            return <><ActivityInteractionRenderer interaction={blitz} value={value} onChange={setValue} /><Text testID="reset" onPress={() => setValue(undefined)}>x</Text></>;
        }
        render(<Retry />);
        await act(async () => { await Promise.resolve(); });
        press('blitz-verdadeiro');
        expect(screen.getByTestId('blitz-proxima')).toBeTruthy();
        fireEvent.press(screen.getByTestId('reset'));
        expect(screen.queryByTestId('blitz-proxima')).toBeNull();
        expect(screen.getByTestId('blitz-verdadeiro')).toBeTruthy();
    });

    it('anuncia a contagem de seguidas depois do toque e a afirmação nova depois de Próxima', async () => {
        (AccessibilityInfo.isScreenReaderEnabled as jest.Mock).mockResolvedValue(true);
        await renderTimed();
        press('blitz-verdadeiro');
        expect(AccessibilityInfo.announceForAccessibility).toHaveBeenLastCalledWith('Acertou. Longe da fonte, menos dose. 1 seguida.');
        press('blitz-proxima');
        expect(AccessibilityInfo.announceForAccessibility).toHaveBeenLastCalledWith('Afirmação 2 de 6: O dosímetro reduz a dose.');
    });

    it('dois toques no mesmo desenho, ou o tempo esgotado junto do toque, gravam só uma resposta', async () => {
        const onChange = jest.fn();
        render(<ActivityInteractionRenderer interaction={blitz} value={undefined} onChange={onChange} />);
        await act(async () => { await Promise.resolve(); });
        const yes = screen.getByTestId('blitz-verdadeiro'); const no = screen.getByTestId('blitz-falso');
        fireEvent.press(yes); fireEvent.press(no);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('[true]');
    });

    it('a última afirmação deixa a marca na tela, completa a resposta e não corre mais relógio', async () => {
        await renderTimed({ initial: '[true,false,true,false,true]' });
        expect(screen.getByText('Afirmação 6 de 6')).toBeTruthy();
        press('blitz-falso');
        expect(probe()).toBe('[true,false,true,false,true,false]|true');
        expect(screen.getByText('Falso: acertou')).toBeTruthy();
        advance(60_000);
        expect(probe()).toBe('[true,false,true,false,true,false]|true');
        expect(screen.getByText('Falso: acertou')).toBeTruthy();
        expect(screen.queryByTestId('blitz-verdadeiro')).toBeNull();
        expect(screen.queryByTestId('blitz-proxima')).toBeNull();
    });

    it('depois de conferir, não há botões de resposta e a última marca fica', async () => {
        await renderTimed({ submitted: true, initial: '[true,false,true,true,true,false]' });
        expect(screen.queryByTestId('blitz-verdadeiro')).toBeNull();
        expect(screen.getByText('Falso: acertou')).toBeTruthy();
        expect(screen.getByTestId('blitz-streak').props.children).toBe('2 seguidas');
    });

    it('o contrato recusa rodada com passCount fora de 1 a n e afirmação sem explicação', () => {
        const activity = (payload: object) => ({
            id: 'a', competencyIds: ['competency:test'], provenance: { contentVersion: 'v', sourceIds: ['s'] },
            steps: [{ kind: 'presentation', id: 'h', role: 'hook', payload: { title: 'x' } }, { kind: 'interaction', interaction: { ...blitz, payload } },
                { kind: 'presentation', id: 'c', role: 'closing', payload: { title: 'y' } }],
        }) as Parameters<typeof validateLearningActivity>[0];
        const payload = (blitz as Extract<LearningInteractionV2, { type: 'blitz' }>).payload;
        const codes = (value: object) => JSON.stringify(validateLearningActivity(activity(value)));
        expect(validateLearningActivity(activity(payload))).toEqual([]);
        expect(codes({ ...payload, passCount: 0 })).toMatch(/invalid-blitz/);
        expect(codes({ ...payload, passCount: 7 })).toMatch(/invalid-blitz/);
        expect(codes({ ...payload, statements: [{ ...payload.statements[0], explanation: ' ' }, ...payload.statements.slice(1)] })).toMatch(/invalid-blitz/);
    });
});
