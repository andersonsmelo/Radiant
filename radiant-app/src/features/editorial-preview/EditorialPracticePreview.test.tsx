import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { realEditorialPilotEnvelope } from '../../test/fixtures/realEditorialPreview';
import { EditorialPracticePreview } from './EditorialPracticePreview';
import { EDITORIAL_LOCAL_DIAGRAMS } from './EditorialLocalDiagrams';
import { ActivityInteractionRenderer } from '../lesson-flow/renderers/ActivityRendererRegistry';

jest.mock('../../../assets/content/rtg-2026/pilot/view-front.png', () => ({ uri: 'file:///pc06-test/view-front.png', width: 800, height: 1000 }));
jest.mock('../../../assets/content/rtg-2026/pilot/view-back.png', () => ({ uri: 'file:///pc06-test/view-back.png', width: 800, height: 1000 }));
jest.mock('../../../assets/content/rtg-2026/pilot/marker-a.png', () => ({ uri: 'file:///pc06-test/marker-a.png', width: 800, height: 1000 }));
jest.mock('../../../assets/content/rtg-2026/pilot/marker-b.png', () => ({ uri: 'file:///pc06-test/marker-b.png', width: 800, height: 1000 }));

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('../../ui/accessibility/useReducedMotionPreference', () => ({ useReducedMotionPreference: () => true }));

const id = (name: string) => `activity:rtg-2026:pilot:${name}`;
const next = () => fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));

describe('PC06-B practice preview integration', () => {
    it('keeps preparation empty until material and an explicit activity are supplied', () => {
        render(<EditorialPracticePreview />);
        expect(screen.getByText('Conteúdo em preparação')).toBeTruthy();
    });

    it('uses the new abstract scene and requires confirmation before evaluating the field', () => {
        const onObservation = jest.fn();
        render(<EditorialPracticePreview material={realEditorialPilotEnvelope()} activityId={id('m06-04-a')} onObservation={onObservation} />);
        next(); next();
        expect(screen.getByTestId('abstract-target', { includeHiddenElements: true })).toBeTruthy();
        expect(onObservation).not.toHaveBeenCalled();
        for (let i = 0; i < 7; i++) fireEvent.press(screen.getByRole('button', { name: 'Diminuir Largura do campo' }));
        expect(screen.getByText('20 cm')).toBeTruthy();
        expect(onObservation).not.toHaveBeenCalled();
        fireEvent.press(screen.getByRole('button', { name: 'Confirmar resposta' }));
        expect(onObservation).toHaveBeenCalledTimes(1);
        expect(onObservation).toHaveBeenCalledWith(expect.objectContaining({ stage: 'practice', targetId: id('m06-04-a'), correct: true, value: JSON.stringify({ fieldWidth: 20 }) }));
        expect(screen.getByRole('button', { name: 'Diminuir Largura do campo' })).toBeDisabled();
    });

    it('loads the front-view module with its real aspect ratio and preserves list selection until confirmation', () => {
        render(<EditorialPracticePreview material={realEditorialPilotEnvelope()} activityId={id('m02-01-a')} />);
        next(); next();
        expect(screen.UNSAFE_getByType(Image).props.source).toBe(EDITORIAL_LOCAL_DIAGRAMS[0].source);
        expect(StyleSheet.flatten(screen.getByTestId('hotspot-image-frame').props.style).aspectRatio).toBe(0.8);
        const region = screen.getByRole('button', { name: 'Selecionar Região A: à esquerda da tela na lista' });
        fireEvent.press(region);
        expect(region.props.accessibilityState.selected).toBe(true);
        fireEvent.press(screen.getByRole('button', { name: 'Confirmar resposta' }));
        expect(screen.getByRole('button', { name: 'Selecionar Região A: à esquerda da tela na lista' })).toBeDisabled();
    });

    it('loads the posterior variant as a distinct source and keeps the other answer', () => {
        const onObservation = jest.fn();
        render(<EditorialPracticePreview material={realEditorialPilotEnvelope()} activityId={id('m02-01-b')} onObservation={onObservation} />);
        next();
        expect(screen.UNSAFE_getByType(Image).props.source).toBe(EDITORIAL_LOCAL_DIAGRAMS[1].source);
        fireEvent.press(screen.getByRole('button', { name: 'Selecionar Região B: à direita da tela na lista' }));
        fireEvent.press(screen.getByRole('button', { name: 'Confirmar resposta' }));
        expect(onObservation).toHaveBeenCalledWith(expect.objectContaining({ correct: true, targetId: id('m02-01-b') }));
    });

    it('keeps complete marker images without cropping and locks both comparison choices after confirmation', () => {
        const input = realEditorialPilotEnvelope();
        render(<EditorialPracticePreview material={input} activityId={id('m02-02-a')} />);
        next(); next();
        const images = screen.UNSAFE_getAllByType(Image);
        expect(images).toHaveLength(2);
        images.forEach(image => {
            expect(image.props.resizeMode).toBe('contain');
            expect(StyleSheet.flatten(image.props.style).aspectRatio).toBe(0.8);
        });
        expect(images.map(image => image.props.source)).toEqual(EDITORIAL_LOCAL_DIAGRAMS.slice(2).map(local => local.source));
        const activity = input.activities.find(activity => activity.id === id('m02-02-a'))!;
        const step = activity.steps.find(step => step.kind === 'interaction');
        if (step?.kind !== 'interaction' || step.interaction.type !== 'comparison') throw Error('Expected comparison');
        fireEvent.press(screen.getByRole('button', { name: step.interaction.payload.options[0].label }));
        fireEvent.press(screen.getByRole('button', { name: 'Confirmar resposta' }));
        step.interaction.payload.options.forEach(option => expect(screen.getByRole('button', { name: option.label })).toBeDisabled());
    });

    it('refuses a corrupt declared asset before mounting the player', () => {
        const input = realEditorialPilotEnvelope();
        const pilot = input.pilot!;
        render(<EditorialPracticePreview material={{ ...input, pilot: { ...pilot, assets: pilot.assets.map(asset => ({ ...asset, sha256: '0'.repeat(64) })) } }} activityId={id('m02-01-a')} />);
        expect(screen.getByText('Não foi possível abrir esta prévia.')).toBeTruthy();
        expect(screen.queryByRole('button', { name: 'Continuar' })).toBeNull();
    });

    it.each([
        { name: 'hotspot null', activity: 'm02-01-a', resolved: null },
        { name: 'comparison null', activity: 'm02-02-a', resolved: null },
        { name: 'hotspot zero width', activity: 'm02-01-a', resolved: { source: 999, width: 0, height: 1000 } },
        { name: 'comparison zero width', activity: 'm02-02-a', resolved: { source: 999, width: 0, height: 1000 } },
        { name: 'hotspot non-finite height', activity: 'm02-01-a', resolved: { source: 999, width: 800, height: NaN } },
        { name: 'comparison non-finite height', activity: 'm02-02-a', resolved: { source: 999, width: 800, height: NaN } },
    ])('refuses $name without remote fallback', ({ activity, resolved }) => {
        const step = realEditorialPilotEnvelope().activities.find(item => item.id === id(activity))!.steps.find(step => step.kind === 'interaction');
        if (step?.kind !== 'interaction') throw Error('Expected image interaction');
        render(<ActivityInteractionRenderer interaction={step.interaction} value={undefined} onChange={jest.fn()} resolveImageSource={() => resolved} />);
        expect(screen.getByText('Imagem indisponível para esta atividade.')).toBeTruthy();
        expect(screen.UNSAFE_queryAllByType(Image)).toHaveLength(0);
    });
});
