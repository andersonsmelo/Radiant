import React from 'react';
import { Text } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { GroupArea } from './GroupArea';
import { galaxyColors } from '../../../ui/theme';

const flat = (style: unknown) => Object.assign({}, ...[style].flat(Infinity).filter(Boolean));

describe('GroupArea', () => {
    it('pronta: borda cheia em navBlue e a linha de toque; o toque chama onPress', () => {
        const onPress = jest.fn();
        const view = render(<GroupArea label="Clínica" ready empty={false} onPress={onPress} accessibilityLabel="Colocar X em Clínica" testID="area" />);
        expect(view.getByText('Toque aqui para colocar a ficha escolhida')).toBeTruthy();
        const box = flat(view.getByTestId('area-box').props.style);
        expect(box.borderStyle).not.toBe('dashed');
        expect(box.borderColor).toBe(galaxyColors.navBlue);
        fireEvent.press(view.getByTestId('area'));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('sem ficha escolhida: borda tracejada em borderActive, sem a linha de toque', () => {
        const view = render(<GroupArea label="Clínica" ready={false} empty accessibilityLabel="Grupo Clínica" testID="area" />);
        const box = flat(view.getByTestId('area-box').props.style);
        expect(box.borderStyle).toBe('dashed');
        expect(box.borderColor).toBe(galaxyColors.borderActive);
        expect(view.queryByText('Toque aqui para colocar a ficha escolhida')).toBeNull();
        expect(view.getByText('Vazio')).toBeTruthy();
    });

    it('mostra o que está dentro e não diz Vazio', () => {
        const view = render(<GroupArea label="Clínica" ready={false} empty={false} accessibilityLabel="Grupo Clínica"><Text>Laudar</Text></GroupArea>);
        expect(view.getByText('Laudar')).toBeTruthy();
        expect(view.queryByText('Vazio')).toBeNull();
    });
});
