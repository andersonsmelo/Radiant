import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { CAST_HAIR_PATH, CAST_VIEWBOX, CastAvatar } from './CastAvatar';
import { CAST_TONES, type CastPortraitId } from './castRegistry';

jest.mock('../../accessibility/useReducedMotionPreference', () => ({
    useReducedMotionPreference: () => true,
    useReducedMotionPreferenceState: () => ({ reducedMotionEnabled: true, resolved: true }),
}));

const RETRATOS: CastPortraitId[] = ['lia', 'caio', 'duda', 'paciente'];

describe('CastAvatar', () => {
    it.each([
        ['lia', 'Profa. Lia, supervisora de estágio'],
        ['caio', 'Caio, tecnólogo do plantão'],
        ['duda', 'Duda, colega de turma'],
        ['paciente', 'Paciente, paciente'],
        ['pixel', 'Pixel, guia de estudo'],
    ] as const)('%s é lido como uma imagem com nome e papel', (speaker, rotulo) => {
        render(<CastAvatar speaker={speaker} />);

        expect(screen.getByLabelText(rotulo).props.accessibilityRole).toBe('image');
    });

    it('o paciente da cena é lido pelo nome que a fala traz', () => {
        render(<CastAvatar speaker="paciente" name="Seu Antônio" />);

        expect(screen.getByLabelText('Seu Antônio, paciente')).toBeTruthy();
        expect(screen.queryByLabelText('Paciente, paciente')).toBeNull();
    });

    it.each(RETRATOS)('%s desenha o próprio cabelo e a própria roupa, nas cores do elenco', (id) => {
        render(<CastAvatar speaker={id} />);

        const cabelo = screen.getByTestId(`cast-hair-${id}`, { includeHiddenElements: true });
        expect(cabelo.props.d).toBe(CAST_HAIR_PATH[id]);
        expect(screen.getByTestId(`cast-clothing-${id}`, { includeHiddenElements: true })).toBeTruthy();
    });

    it('as quatro silhuetas de cabelo são diferentes entre si e cabem na caixa do desenho', () => {
        const tracados = RETRATOS.map((id) => CAST_HAIR_PATH[id]);
        expect(new Set(tracados).size).toBe(RETRATOS.length);

        for (const tracado of tracados) {
            const numeros = (tracado.match(/-?\d+(?:\.\d+)?/gu) ?? []).map(Number);
            // Diferente não basta: um cabelo fora da caixa também seria "diferente".
            expect(numeros.length).toBeGreaterThan(8);
            expect(Math.min(...numeros)).toBeGreaterThanOrEqual(0);
            expect(Math.max(...numeros)).toBeLessThanOrEqual(CAST_VIEWBOX);
            // Num círculo, os números do traçado são só as pontas: a altura sai do centro e do raio.
            for (const [, y, r] of tracado.matchAll(/M[\d.]+ ([\d.]+) A([\d.]+) /gu)) {
                expect(Number(y) - Number(r)).toBeGreaterThanOrEqual(0);
                expect(Number(y) + Number(r)).toBeLessThanOrEqual(CAST_VIEWBOX);
            }
        }
        expect(new Set(RETRATOS.map((id) => CAST_TONES[id].clothing)).size).toBe(RETRATOS.length);
    });

    it('decorativo, o retrato some do leitor de tela, porque o texto ao lado já diz quem fala', () => {
        render(<CastAvatar speaker="lia" decorative />);

        expect(screen.queryByLabelText('Profa. Lia, supervisora de estágio')).toBeNull();
        const retrato = screen.getByTestId('cast-avatar-lia', { includeHiddenElements: true });
        expect(retrato.props.accessibilityElementsHidden).toBe(true);
        expect(retrato.props.importantForAccessibility).toBe('no-hide-descendants');
    });

    it('o Pixel decorativo também some, com a cabeça do mascote por dentro', () => {
        render(<CastAvatar speaker="pixel" decorative />);

        expect(screen.queryByLabelText('Pixel, guia de estudo')).toBeNull();
        expect(screen.getByTestId('cast-avatar-pixel', { includeHiddenElements: true }).props.importantForAccessibility).toBe('no-hide-descendants');
    });

    it('o Pixel aceita um rótulo do momento, como a reação à resposta', () => {
        render(<CastAvatar speaker="pixel" expression="feliz" accessibilityLabel="Pixel comemorando o acerto" />);

        expect(screen.getByLabelText('Pixel comemorando o acerto')).toBeTruthy();
    });
});
