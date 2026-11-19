import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { semanticColors } from '../../../ui/semantic-colors';
import { LabelStepRenderer } from './LabelStepRenderer';

const payload = {
    prompt: 'Rotule as quatro partes do tubo de raios X.',
    imageRef: 'diagram:tubo-raios-x',
    points: [
        { id: 'p1', x: 0.28, y: 0.44, correctLabelId: 'catodo' },
        { id: 'p2', x: 0.72, y: 0.44, correctLabelId: 'anodo' },
        { id: 'p3', x: 0.68, y: 0.71, correctLabelId: 'janela' },
        { id: 'p4', x: 0.375, y: 0.71, correctLabelId: 'ampola' },
    ],
    labels: [
        { id: 'janela', label: 'Janela de saída' }, { id: 'fio', label: 'Fio de aterramento' }, { id: 'catodo', label: 'Cátodo com filamento' },
        { id: 'ampola', label: 'Ampola de vidro' }, { id: 'anodo', label: 'Ânodo' },
    ],
};

/** O player guarda a resposta fora do renderer; aqui, o mínimo disso. */
function Controlled({ initial, submitted }: { initial?: string; submitted?: boolean }) {
    const [value, setValue] = useState(initial);
    return <LabelStepRenderer payload={payload} accessibilityLabel="Rotular a imagem: tubo de raios X" value={value} onChange={setValue} submitted={submitted} />;
}

const meta = {
    title: 'Aprendizagem/Rotular',
    component: LabelStepRenderer,
    args: { payload, accessibilityLabel: 'Rotular a imagem: tubo de raios X', onChange: () => undefined },
    decorators: [
        (Story) => (
            <View style={{ flex: 1, padding: 20, backgroundColor: semanticColors.galaxy.surface }}>
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof LabelStepRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SemRotulos: Story = { render: () => <Controlled /> };

export const ParcialmenteRotulada: Story = { render: () => <Controlled initial={JSON.stringify({ p1: 'catodo', p2: 'anodo' })} /> };

export const Conferida: Story = {
    render: () => <Controlled submitted initial={JSON.stringify({ p1: 'catodo', p2: 'janela', p3: 'anodo', p4: 'ampola' })} />,
};
