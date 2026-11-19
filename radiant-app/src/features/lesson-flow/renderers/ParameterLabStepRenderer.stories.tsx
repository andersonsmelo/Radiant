import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import type { ParameterLabPayload } from '../../../types/learningActivity';
import { semanticColors } from '../../../ui/semantic-colors';
import { ParameterLabStepRenderer } from './ParameterLabStepRenderer';

const payload: ParameterLabPayload = {
    prompt: 'Afaste a fonte até a intensidade cair a um quarto da inicial.',
    model: 'inverse-square',
    start: 1,
    goal: { atLeast: 2 },
    hints: { tooLow: 'Ainda perto demais: afaste mais a fonte.', tooHigh: 'Afastou além do necessário.' },
};

/** O player guarda a resposta fora do renderer; aqui, o mínimo disso. */
function Controlled({ lab = payload, initial, submitted }: { lab?: ParameterLabPayload; initial?: string; submitted?: boolean }) {
    const [value, setValue] = useState(initial);
    return <ParameterLabStepRenderer payload={lab} value={value} onChange={setValue} submitted={submitted} />;
}

const meta = {
    title: 'Aprendizagem/Laboratório de parâmetros',
    component: ParameterLabStepRenderer,
    args: { payload, onChange: () => undefined },
    decorators: [
        (Story) => (
            <View style={{ flex: 1, padding: 20, backgroundColor: semanticColors.galaxy.surface }}>
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof ParameterLabStepRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoPontoDePartida: Story = { render: () => <Controlled /> };

export const NaMeta: Story = { render: () => <Controlled initial="2" /> };

export const Blindagem: Story = {
    render: () => <Controlled lab={{ ...payload, prompt: 'Acrescente camadas até passar menos de 10% da radiação.', model: 'shielding', start: 0, goal: { atLeast: 4 } }} initial="2" />,
};

export const Decaimento: Story = {
    render: () => <Controlled lab={{ ...payload, prompt: 'Espere até restar menos de 5% da atividade.', model: 'decay', start: 0, goal: { atLeast: 5 } }} initial="3" />,
};

export const Conferida: Story = { render: () => <Controlled submitted initial="1.5" /> };
