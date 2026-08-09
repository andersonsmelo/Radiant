import type { Meta, StoryObj } from '@storybook/react-native';
import { Image, View } from 'react-native';
import { fn } from 'storybook/test';
import { semanticColors } from '../../../ui/semantic-colors';
import { ComparisonStepRenderer } from './ComparisonStepRenderer';

const xrayPanel = Image.resolveAssetSource(require('../assets/lesson-xray-panel.png')).uri;

const meta = {
    title: 'Aprendizagem/Comparação',
    component: ComparisonStepRenderer,
    args: {
        payload: {
            prompt: 'Qual opção representa a melhor delimitação da região de interesse?',
            options: [
                { id: 'amplo', label: 'Campo amplo, além da região necessária', imageRef: xrayPanel },
                { id: 'restrito', label: 'Campo delimitado à região necessária', imageRef: xrayPanel },
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
