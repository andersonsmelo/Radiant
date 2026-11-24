import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { semanticColors } from '../../../ui/semantic-colors';
import { BlitzStepRenderer } from './BlitzStepRenderer';

const payload = {
    prompt: 'Responda verdadeiro ou falso a cada afirmação sobre a proteção no turno.',
    passCount: 5,
    statements: [
        { id: 's1', text: 'Quanto maior a distância da fonte, menor é a dose recebida.', isTrue: true, explanation: 'Longe da fonte a dose cai.' },
        { id: 's2', text: 'O dosímetro individual reduz a dose que a pessoa recebe.', isTrue: false, explanation: 'O dosímetro só registra a dose.' },
        { id: 's3', text: 'O avental de chumbo protege o tronco da radiação espalhada.', isTrue: true, explanation: 'O avental cobre o tronco.' },
        { id: 's4', text: 'Quanto mais tempo na sala durante a exposição, menor é a dose.', isTrue: false, explanation: 'Mais tempo aumenta a dose.' },
        { id: 's5', text: 'Material com rachadura sai de uso e a supervisão é avisada.', isTrue: true, explanation: 'Material danificado sai de uso.' },
        { id: 's6', text: 'Registrar o uso do dosímetro é opcional em turnos curtos.', isTrue: false, explanation: 'O registro vale em todo turno.' },
    ],
};

/** O player guarda a resposta fora do renderer; aqui, o mínimo disso. */
function Controlled({ initial, submitted }: { initial?: string; submitted?: boolean }) {
    const [value, setValue] = useState(initial);
    return <BlitzStepRenderer payload={payload} value={value} onChange={setValue} submitted={submitted} />;
}

const meta = {
    title: 'Aprendizagem/Rodada rápida',
    component: BlitzStepRenderer,
    args: { payload, onChange: () => undefined },
    decorators: [
        (Story) => (
            <View style={{ flex: 1, padding: 20, backgroundColor: semanticColors.galaxy.surface }}>
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof BlitzStepRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Com o relógio de 10 s ligado (sem leitor de tela nem "reduzir movimento"). */
export const PrimeiraAfirmacao: Story = { render: () => <Controlled /> };

export const NoMeioDaRodada: Story = { render: () => <Controlled initial={JSON.stringify([true, false, true])} /> };

/** O tempo esgotado entra como `null` e conta como não respondida. */
export const ComTempoEsgotado: Story = { render: () => <Controlled initial={JSON.stringify([true, null, true, false])} /> };

export const Conferida: Story = { render: () => <Controlled submitted initial={JSON.stringify([true, false, true, true, true, false])} /> };
