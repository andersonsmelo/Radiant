import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { semanticColors } from '../../../ui/semantic-colors';
import { encodeInteractionIdSequence } from './InteractionAnswerValue';
import { OrderingStepRenderer } from './OrderingStepRenderer';

const meta = {
    title: 'Aprendizagem/Ordenação',
    component: OrderingStepRenderer,
    args: {
        payload: {
            prompt: 'Organize a sequência segura antes da exposição.',
            items: [
                { id: 'identificar', label: 'Confirmar identificação' },
                { id: 'posicionar', label: 'Posicionar conforme o protocolo' },
                { id: 'expor', label: 'Realizar a exposição' },
            ],
            correctOrder: ['identificar', 'posicionar', 'expor'],
        },
        onChange: fn(),
    },
    decorators: [
        (Story) => (
            <View style={{ flex: 1, padding: 20, backgroundColor: semanticColors.galaxy.surface }}>
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof OrderingStepRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OrdemInicial: Story = {};

export const OrdemAlterada: Story = {
    args: { value: encodeInteractionIdSequence(['posicionar', 'identificar', 'expor']) },
};
