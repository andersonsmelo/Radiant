import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { semanticColors } from '../../../ui/semantic-colors';
import { encodeInteractionIdSequence } from './InteractionAnswerValue';
import { MatchingStepRenderer } from './MatchingStepRenderer';

const meta = {
    title: 'Aprendizagem/Associação',
    component: MatchingStepRenderer,
    args: {
        payload: {
            prompt: 'Associe cada parâmetro ao efeito principal.',
            pairs: [
                { id: 'kvp', left: 'kVp', right: 'Penetração do feixe' },
                { id: 'mas', left: 'mAs', right: 'Quantidade de fótons' },
                { id: 'sid', left: 'SID', right: 'Magnificação geométrica' },
            ],
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
} satisfies Meta<typeof MatchingStepRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimeiroPar: Story = {};

export const EmProgresso: Story = {
    args: { value: encodeInteractionIdSequence(['kvp']) },
};

export const Completa: Story = {
    args: { value: encodeInteractionIdSequence(['kvp', 'mas', 'sid']) },
};
