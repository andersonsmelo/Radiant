import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { semanticColors } from '../../../ui/semantic-colors';
import { ConversationStepRenderer } from './ConversationStepRenderer';

const payload = {
    prompt: 'Conduza a conversa com o paciente antes do exame.',
    speaker: 'paciente' as const,
    name: 'Sr. Álvaro',
    turns: [
        { id: 't1', line: 'Vou tomar muita radiação nesse exame?', correctOptionId: 'o2', options: [
            { id: 'o1', label: 'Fique tranquilo, não precisa se preocupar.', reply: 'Mas eu queria entender melhor.' },
            { id: 'o2', label: 'A dose é baixa e controlada.', reply: 'Isso me acalma, obrigado.' }] },
        { id: 't2', line: 'Preciso tirar o relógio?', correctOptionId: 'o3', options: [
            { id: 'o3', label: 'Sim, tire o relógio.', reply: 'Pronto, tirei.' },
            { id: 'o4', label: 'Não precisa tirar nada.', reply: 'Então deixo aqui.' },
            { id: 'o5', label: 'Só se estiver incomodando.', reply: 'Está um pouco apertado.' }] },
    ],
};

/** O player guarda a resposta fora do renderer; aqui, o mínimo disso. */
function Controlled({ initial, submitted }: { initial?: string; submitted?: boolean }) {
    const [value, setValue] = useState(initial);
    return <ConversationStepRenderer payload={payload} value={value} onChange={setValue} submitted={submitted} />;
}

const meta = {
    title: 'Aprendizagem/Conversa',
    component: ConversationStepRenderer,
    args: { payload, onChange: () => undefined },
    decorators: [
        (Story) => (
            <View style={{ flex: 1, padding: 20, backgroundColor: semanticColors.galaxy.surface }}>
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof ConversationStepRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimeiroTurno: Story = { render: () => <Controlled /> };

export const NoMeioDaConversa: Story = { render: () => <Controlled initial={JSON.stringify(['o2'])} /> };

export const Conferida: Story = { render: () => <Controlled submitted initial={JSON.stringify(['o2', 'o4'])} /> };
