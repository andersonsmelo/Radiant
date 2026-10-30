import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { semanticColors } from '../../../ui/semantic-colors';
import { ComparisonStepRenderer } from './ComparisonStepRenderer';

// As opções vão só com texto: `imageRef` é opcional nesta interação. A imagem
// antiga era um mockup com texto em inglês e saiu do app em `b06c7eb`.

const meta = {
    title: 'Aprendizagem/Comparação',
    component: ComparisonStepRenderer,
    args: {
        payload: {
            prompt: 'Qual opção representa a melhor delimitação da região de interesse?',
            options: [
                { id: 'amplo', label: 'Campo amplo, além da região necessária' },
                { id: 'restrito', label: 'Campo delimitado à região necessária' },
            ],
            correctOptionId: 'restrito',
        },
        onSelect: fn(),
    },
    decorators: [
        (Story) => (
            <View style={{ flex: 1, padding: 20, backgroundColor: semanticColors.galaxy.surface }}>
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof ComparisonStepRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SemSelecao: Story = {};

export const SelecionadaSemDependerDeCor: Story = {
    args: { selectedOptionId: 'restrito' },
};
