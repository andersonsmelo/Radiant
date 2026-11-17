import React, { useState } from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import type { CategorizePayload } from '../../../types/learningActivity';
import { CategorizeStepRenderer, categorizePendingCount } from './CategorizeStepRenderer';

const payload: CategorizePayload = {
    prompt: 'Classifique.',
    categories: [{ id: 'g1', label: 'Técnica' }, { id: 'g2', label: 'Clínica' }],
    items: [{ id: 'i1', label: 'Posicionar', categoryId: 'g1' }, { id: 'i2', label: 'Laudar', categoryId: 'g2' }, { id: 'i3', label: 'Colimar', categoryId: 'g1' }],
};

function Harness({ submitted = false, initial }: { submitted?: boolean; initial?: string }) {
    const [value, setValue] = useState<string | undefined>(initial);
    return <>
        <CategorizeStepRenderer payload={payload} value={value} onChange={setValue} submitted={submitted} />
        <ProbeText value={value} />
    </>;
}
function ProbeText({ value }: { value?: string }) {
    const { Text } = jest.requireActual('react-native');
    return <Text testID="probe">{value ?? ''}</Text>;
}

describe('CategorizeStepRenderer', () => {
    it('não existe mais o rótulo "Colocar em"', () => {
        const screen = render(<Harness />);
        expect(screen.queryByText(/Colocar em/)).toBeNull();
        expect(screen.getAllByText('Vazio')).toHaveLength(2);
    });

    it('tocar numa ficha e depois num grupo põe a ficha dentro do grupo', () => {
        const screen = render(<Harness />);
        fireEvent.press(screen.getByTestId('categorize-item-Laudar'));
        fireEvent.press(screen.getByTestId('categorize-group-Clínica'));
        expect(JSON.parse(String(screen.getByTestId('probe').props.children))).toEqual({ i2: 'g2' });
        expect(screen.queryByTestId('categorize-item-Laudar')).toBeNull();
        expect(screen.getByLabelText('Laudar, em Clínica')).toBeTruthy();
        expect(screen.getAllByText('Vazio')).toHaveLength(1);
    });

    it('tocar numa ficha já colocada a devolve', () => {
        const screen = render(<Harness initial={JSON.stringify({ i2: 'g2' })} />);
        fireEvent.press(screen.getByLabelText('Laudar, em Clínica'));
        expect(JSON.parse(String(screen.getByTestId('probe').props.children))).toEqual({});
        expect(screen.getByTestId('categorize-item-Laudar')).toBeTruthy();
    });

    it('com ficha escolhida, o grupo avisa que recebe e os ids de teste continuam', () => {
        const screen = render(<Harness />);
        expect(screen.getAllByText('Toque aqui para colocar a ficha escolhida')).toHaveLength(2);
        expect(screen.getByTestId('categorize-group-Técnica')).toBeTruthy();
        expect(screen.getByTestId('categorize-item-Posicionar')).toBeTruthy();
    });

    it('depois de conferir, ficha no grupo errado mostra o grupo certo', () => {
        const screen = render(<Harness submitted initial={JSON.stringify({ i1: 'g2', i2: 'g2', i3: 'g1' })} />);
        expect(screen.getByLabelText('Posicionar, em Clínica, errado; o grupo certo é Técnica')).toBeTruthy();
        expect(screen.queryByText('Toque aqui para colocar a ficha escolhida')).toBeNull();
    });
});

describe('categorizePendingCount', () => {
    it('nenhum colocado devolve o total', () => expect(categorizePendingCount(payload, undefined)).toBe(3));
    it('todos colocados devolve 0', () => expect(categorizePendingCount(payload, JSON.stringify({ i1: 'g1', i2: 'g2', i3: 'g1' }))).toBe(0));
    it('conta só os que faltam e ignora grupo inexistente', () => expect(categorizePendingCount(payload, JSON.stringify({ i1: 'g1', i2: 'zz' }))).toBe(2));
    it('valor malformado devolve o total', () => expect(categorizePendingCount(payload, 'não é json')).toBe(3));
});
