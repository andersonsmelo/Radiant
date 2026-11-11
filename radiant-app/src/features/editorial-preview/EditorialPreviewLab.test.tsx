import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { validateLearningActivity } from '../../types/learningActivity';
import EditorialPreviewLab from './dev/EditorialPreviewLab';
import { lessonMaterial, practiceMaterial } from './dev/EditorialPreviewLabMaterial';
import { syntheticCaseSession } from './dev/SyntheticCasePreview';
import { realEditorialPreview, realEditorialPilotEnvelope } from '../../test/fixtures/realEditorialPreview';

jest.mock('@react-native-async-storage/async-storage', () => ({ getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn(), multiSet: jest.fn() }));
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('expo-router', () => ({ router: { replace: jest.fn() } }));
jest.mock('../../ui/accessibility/useReducedMotionPreference', () => ({ useReducedMotionPreference: () => true }));
// Any accidental dependency on learner effects must fail at import time.
jest.mock('../gamification/services/GamificationService', () => { throw Error('Preview imported XP'); });
jest.mock('../hearts/HeartsRepository', () => { throw Error('Preview imported hearts'); });
jest.mock('../journey/services/JourneyProgressService', () => { throw Error('Preview imported progress'); });

const press = (name: string) => fireEvent.press(screen.getByRole('button', { name }));
beforeEach(() => jest.clearAllMocks());
afterEach(() => {
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
    expect(AsyncStorage.multiSet).not.toHaveBeenCalled();
});
it('invalidates native menu text measurement when the font scale changes', () => {
    const dimensions = jest.spyOn(require('react-native'), 'useWindowDimensions');
    dimensions.mockReturnValue({ width: 402, height: 874, scale: 3, fontScale: 1 });
    const view = render(<EditorialPreviewLab />);
    const title = screen.getByText('Prévias do conteúdo · PC06-E');
    dimensions.mockReturnValue({ width: 402, height: 874, scale: 3, fontScale: 3.1 });
    view.rerender(<EditorialPreviewLab />);
    expect(screen.getByText('Prévias do conteúdo · PC06-E')).not.toBe(title);
    dimensions.mockRestore();
});
it('injects the single PC05 artifact without a second copy of the lesson', () => {
    expect(lessonMaterial).toEqual(realEditorialPreview());
    expect(practiceMaterial).toEqual(realEditorialPilotEnvelope());
    expect(validateLearningActivity(syntheticCaseSession.activity)).toEqual([]);
    expect(practiceMaterial.activities.some(a => a.id === syntheticCaseSession.activity.id)).toBe(false);
});
it.each(['M01.01 · Aula e ajuda', 'M01.01 · Avaliação', 'M01.01 · Recuperação guiada', 'M01.01 · Tentativa em outro contexto',
    'Q5 · Ordenar etapas', 'Q2 · Regiões na vista de frente', 'Q2 · Regiões na vista de costas', 'Q3 · Comparar diagramas', 'Q4 · Campo abstrato'])(
    'opens and discards %s', label => {
        render(<EditorialPreviewLab />); press(label);
        expect(screen.queryByText('Não foi possível abrir esta prévia.')).toBeNull();
        expect(screen.getByRole('progressbar').props.accessibilityValue.now).toBe(1);
        press('Continuar'); press('Voltar às prévias'); press(label);
        expect(screen.getByRole('progressbar').props.accessibilityValue.now).toBe(1);
        expect(screen.queryByRole('alert')).toBeNull();
    },
);
it('clears Q6 context/selection and keeps final feedback until a separate exit', () => {
    render(<EditorialPreviewLab />); press('Q6 · Minicaso sintético');
    expect(screen.getByRole('button', { name: 'Confirmar resposta' })).toBeDisabled();
    for (const step of syntheticCaseSession.activity.steps) {
        if (step.kind !== 'interaction' || step.interaction.type !== 'case-decision') throw Error('Expected Q6');
        const { payload } = step.interaction;
        expect(screen.getByText(payload.context!)).toBeTruthy();
        expect(screen.queryByText(step.interaction.feedback.correct)).toBeNull();
        press(payload.options[0].label); press('Confirmar resposta');
        expect(screen.getByText(step.interaction.feedback.correct)).toBeTruthy();
        expect(screen.getByRole('button', { name: payload.options[1].label })).toBeDisabled();
        const last = payload.phase === 'support';
        expect(screen.queryByText('Prévia encerrada')).toBeNull();
        press(last ? 'Encerrar prévia' : 'Continuar');
        expect(screen.queryByText(payload.context!)).toBeNull();
        if (!last) expect(screen.getByRole('button', { name: 'Confirmar resposta' })).toBeDisabled();
    }
    expect(screen.getByText('Prévia encerrada')).toBeTruthy();
    press('Voltar às prévias'); press('Q6 · Minicaso sintético');
    expect(screen.getByRole('button', { name: 'Confirmar resposta' })).toBeDisabled();
});
it.each(['Aviso de aula retirada', 'Aviso de revisão indisponível'])('reuses %s and the real trail destination', label => {
    render(<EditorialPreviewLab />); press(label);
    expect(screen.getByText('Este conteúdo foi atualizado')).toBeTruthy();
    press('Ver a nova trilha'); expect(router.replace).toHaveBeenCalledWith('/(tabs)');
});
