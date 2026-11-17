import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { galaxyColors } from '../../../ui/theme';
import { AnswerFeedbackSheet } from './AnswerFeedbackSheet';

// A folha se prende ao rodapé do contêiner, como na aula.
const meta = {
    title: 'Aprendizagem/Folha de retorno',
    component: AnswerFeedbackSheet,
    args: {
        correct: true,
        message: 'A opacidade focal com broncograma aéreo sugere consolidação alveolar.',
        actionLabel: 'Continuar',
        onAction: fn(),
    },
    decorators: [
        (Story) => (
            <View style={{ flex: 1, backgroundColor: galaxyColors.background }}>
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof AnswerFeedbackSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Acerto: Story = {};

export const ErroComVidaPerdida: Story = {
    args: { correct: false, heartLost: true, message: 'Compare a densidade das duas regiões antes de decidir.' },
};

export const ErroComRespostaCertaEmTexto: Story = {
    args: { correct: false, correctLabel: 'Pedido; Identificação; Posicionamento', message: 'O pedido vem antes de tudo.' },
};

export const AcertoRicoComIncentivo: Story = {
    args: { rich: true, celebrate: true, encouragement: 'Três seguidas. Você pegou o ritmo.', actionLabel: 'Concluir e voltar' },
};
