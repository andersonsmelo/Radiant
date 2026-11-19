import React from 'react';
import { render } from '@testing-library/react-native';
import { ConceptVisual } from './ConceptVisual';
import { DIAGRAMS } from '../../../ui/diagrams/diagramRegistry';
import { useReducedMotionPreferenceState } from '../../../ui/accessibility/useReducedMotionPreference';
import { useScreenFocused } from '../../../ui/useScreenFocused';

jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({ useReducedMotionPreferenceState: jest.fn() }));
jest.mock('../../../ui/useScreenFocused', () => ({ useScreenFocused: jest.fn() }));

describe('ConceptVisual', () => {
    beforeEach(() => {
        (useReducedMotionPreferenceState as jest.Mock).mockReturnValue({ reducedMotionEnabled: true, resolved: true });
        (useScreenFocused as jest.Mock).mockReturnValue(true);
    });

    it('desenha o diagrama e o leitor de tela lê a descrição dele (não é decorativo)', () => {
        const view = render(<ConceptVisual id="colimador-abrindo" />);
        expect(view.getByTestId('diagram-frame')).toBeTruthy();
        expect(view.getByLabelText(DIAGRAMS['colimador-abrindo'].alt)).toBeTruthy();
    });

    it('id desconhecido não desenha nada e não lança', () => {
        const view = render(<ConceptVisual id="diagrama-que-nao-existe" />);
        expect(view.toJSON()).toBeNull();
    });
});
