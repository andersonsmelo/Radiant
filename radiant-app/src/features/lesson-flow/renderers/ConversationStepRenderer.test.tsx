import React, { useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { validateLearningActivity, type LearningInteractionV2 } from '../../../types/learningActivity';
import { ActivityInteractionRenderer } from './ActivityRendererRegistry';
import { isCorrectInteractionValue } from './InteractionAnswerValue';

jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
    ...jest.requireActual('../../../ui/accessibility/useReducedMotionPreference'),
    useReducedMotionPreference: () => true,
    useReducedMotionPreferenceState: () => ({ reducedMotionEnabled: true, resolved: true }),
}));
jest.mock('../../../ui/useScreenFocused', () => ({ useScreenFocused: () => true }));
// O retrato é SVG: o teste lê a expressão que o renderer pediu.
jest.mock('../../../ui/characters/cast/CastAvatar', () => {
    const { Text } = jest.requireActual('react-native');
    return { CastAvatar: ({ speaker, expression, decorative }: { speaker: string; expression: string; decorative?: boolean }) =>
        <Text testID={`avatar-${speaker}`} accessibilityLabel={decorative ? undefined : 'retrato'}>{expression}</Text> };
});

const conversation: LearningInteractionV2 = {
    id: 'cv', type: 'conversation', competencyIds: ['competency:test'], evidenceKind: 'guided-practice', completionRule: 'confirmed',
    criticalSafety: false, feedback: { correct: 'Certo.', incorrect: 'Reveja.' }, accessibility: { label: 'Conversa: acolher o paciente' },
    payload: {
        prompt: 'Conduza a conversa com o paciente.', speaker: 'paciente', name: 'Sr. Álvaro',
        turns: [
            { id: 't1', line: 'Vou tomar muita radiação?', correctOptionId: 'o2', options: [
                { id: 'o1', label: 'Fique tranquilo, não precisa se preocupar.', reply: 'Mas eu queria entender melhor.' },
                { id: 'o2', label: 'A dose é baixa.', reply: 'Isso me acalma, obrigado.' }] },
            { id: 't2', line: 'Preciso tirar o relógio?', correctOptionId: 'o3', options: [
                { id: 'o3', label: 'Sim, tire o relógio.', reply: 'Pronto, tirei.' },
                { id: 'o4', label: 'Não precisa tirar nada.', reply: 'Então deixo aqui.' }] },
        ],
    },
};

function Harness({ submitted = false, initial }: { submitted?: boolean; initial?: string }) {
    const [value, setValue] = useState<string | undefined>(initial);
    const { Text } = jest.requireActual('react-native');
    return <>
        <ActivityInteractionRenderer interaction={conversation} value={value} onChange={setValue} submitted={submitted} />
        <Text testID="probe">{`${value ?? ''}|${isCorrectInteractionValue(conversation, value)}`}</Text>
    </>;
}
const probe = () => String(screen.getByTestId('probe').props.children);

describe('ConversationStepRenderer', () => {
    beforeEach(() => { jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => undefined); });
    afterEach(() => jest.restoreAllMocks());

    it('abre com a fala do personagem num nó "Nome: texto" e só as respostas do primeiro turno', () => {
        render(<Harness />);
        expect(screen.getByLabelText('Sr. Álvaro: Vou tomar muita radiação?')).toBeTruthy();
        expect(screen.getByTestId('conversation-option-A dose é baixa.')).toBeTruthy();
        expect(screen.queryByLabelText(/Preciso tirar o relógio/)).toBeNull();
        expect(screen.queryByTestId('conversation-option-Sim, tire o relógio.')).toBeNull();
        expect(screen.getByText('Turno 1 de 2')).toBeTruthy();
    });

    it('escolher registra a fala do aluno, mostra a reação do personagem e abre o turno seguinte', () => {
        render(<Harness />);
        fireEvent.press(screen.getByTestId('conversation-option-A dose é baixa.'));
        expect(probe()).toBe('["o2"]|false');
        expect(screen.getByLabelText('Você: A dose é baixa.')).toBeTruthy();
        expect(screen.getByLabelText('Sr. Álvaro: Isso me acalma, obrigado.')).toBeTruthy();
        expect(screen.getByLabelText('Sr. Álvaro: Preciso tirar o relógio?')).toBeTruthy();
        expect(screen.queryByTestId('conversation-option-A dose é baixa.')).toBeNull();
        fireEvent.press(screen.getByTestId('conversation-option-Sim, tire o relógio.'));
        expect(probe()).toBe('["o2","o3"]|true');
        expect(screen.queryByText(/Turno 3/)).toBeNull();
    });

    it('a fala nova é anunciada: a reação e a próxima fala, na ordem da tela', () => {
        render(<Harness />);
        fireEvent.press(screen.getByTestId('conversation-option-A dose é baixa.'));
        expect(AccessibilityInfo.announceForAccessibility).toHaveBeenLastCalledWith('Sr. Álvaro: Isso me acalma, obrigado. Sr. Álvaro: Preciso tirar o relógio?');
        fireEvent.press(screen.getByTestId('conversation-option-Sim, tire o relógio.'));
        expect(AccessibilityInfo.announceForAccessibility).toHaveBeenLastCalledWith('Sr. Álvaro: Pronto, tirei.');
    });

    it('a reação não julga: o texto é o reply, sem ícone nem palavra de veredito antes de conferir', () => {
        render(<Harness />);
        fireEvent.press(screen.getByTestId('conversation-option-Fique tranquilo, não precisa se preocupar.'));
        expect(screen.getByLabelText('Sr. Álvaro: Mas eu queria entender melhor.')).toBeTruthy();
        expect(screen.queryByTestId('conversation-verdict-incorrect', { includeHiddenElements: true })).toBeNull();
        expect(screen.queryByTestId('conversation-verdict-correct', { includeHiddenElements: true })).toBeNull();
        expect(screen.queryByText(/errado|certo/i)).toBeNull();
    });

    it('a expressão do personagem vem do momento: pergunta preocupa o paciente, e a reação segue o retorno certo ou errado', () => {
        render(<Harness />);
        expect(screen.getAllByTestId('avatar-paciente').map(node => node.props.children)).toEqual(['preocupado']);
        fireEvent.press(screen.getByTestId('conversation-option-A dose é baixa.'));
        // fala inicial (pergunta), reação a escolha certa, fala seguinte (pergunta)
        expect(screen.getAllByTestId('avatar-paciente').map(node => node.props.children)).toEqual(['preocupado', 'feliz', 'preocupado']);
        fireEvent.press(screen.getByTestId('conversation-option-Não precisa tirar nada.'));
        expect(screen.getAllByTestId('avatar-paciente').map(node => node.props.children).at(-1)).toBe('preocupado');
    });

    it('o retrato é decorativo: o leitor de tela lê só o nó da fala', () => {
        render(<Harness />);
        expect(screen.queryByLabelText('retrato')).toBeNull();
    });

    it('a escolha feita não se desfaz: só o turno atual aceita resposta', () => {
        render(<Harness initial='["o1"]' />);
        expect(screen.getByLabelText('Você: Fique tranquilo, não precisa se preocupar.')).toBeTruthy();
        expect(screen.queryByTestId('conversation-option-A dose é baixa.')).toBeNull();
        fireEvent.press(screen.getByTestId('conversation-option-Sim, tire o relógio.'));
        expect(probe()).toBe('["o1","o3"]|false');
    });

    it('depois de conferir, cada fala do aluno diz certo ou errado com ícone e texto, e as opções não aceitam toque', () => {
        render(<Harness submitted initial='["o2","o4"]' />);
        expect(screen.getByLabelText('Você: A dose é baixa., certo')).toBeTruthy();
        expect(screen.getByLabelText('Você: Não precisa tirar nada., errado; a resposta certa era: Sim, tire o relógio.')).toBeTruthy();
        expect(screen.getByTestId('conversation-verdict-correct', { includeHiddenElements: true })).toBeTruthy();
        expect(screen.getByTestId('conversation-verdict-incorrect', { includeHiddenElements: true })).toBeTruthy();
        expect(screen.getByText('Errado. Cabia: Sim, tire o relógio.')).toBeTruthy();
    });

    it('submitted sem resposta do turno atual deixa as opções desativadas', () => {
        render(<Harness submitted initial='["o2"]' />);
        const option = screen.getByTestId('conversation-option-Sim, tire o relógio.');
        expect(option.props.accessibilityState.disabled).toBe(true);
        fireEvent.press(option);
        expect(probe()).toBe('["o2"]|false');
    });

    it('o contrato recusa conversa de duas falas com turno sem resposta certa e paciente sem nome', () => {
        const activity = (payload: object) => ({
            id: 'a', competencyIds: ['competency:test'], provenance: { contentVersion: 'v', sourceIds: ['s'] },
            steps: [{ kind: 'presentation', id: 'h', role: 'hook', payload: { title: 'x' } }, { kind: 'interaction', interaction: { ...conversation, payload } },
                { kind: 'presentation', id: 'c', role: 'closing', payload: { title: 'y' } }],
        }) as Parameters<typeof validateLearningActivity>[0];
        const payload = (conversation as Extract<LearningInteractionV2, { type: 'conversation' }>).payload;
        expect(validateLearningActivity(activity(payload))).toEqual([]);
        const codes = (value: object) => JSON.stringify(validateLearningActivity(activity(value)));
        expect(codes({ ...payload, turns: [{ ...payload.turns[0], correctOptionId: 'fora' }, payload.turns[1]] })).toMatch(/invalid-conversation/);
        expect(codes({ ...payload, name: undefined })).toMatch(/invalid-conversation/);
        expect(codes({ ...payload, turns: [payload.turns[0]] })).toMatch(/invalid-conversation/);
    });
});
