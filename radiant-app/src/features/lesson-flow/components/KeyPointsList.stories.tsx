import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { galaxyColors } from '../../../ui/theme';
import { KeyPointsList } from './KeyPointsList';

const meta = {
  title: 'Aprendizagem/Pontos do conceito',
  component: KeyPointsList,
  args: {
    points: [
      'Distância: dobrar a distância da fonte reduz a dose a um quarto.',
      'Tempo: quanto menos tempo exposto, menor a dose.',
      'Blindagem: o avental de chumbo protege o tronco.',
    ],
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: galaxyColors.background }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof KeyPointsList>;

export default meta;
type Story = StoryObj<typeof meta>;

// Cada ponto com termo em negrito e a explicação no texto secundário.
export const ComTermo: Story = {};

// Sem ": " no começo, o ponto é só texto, no principal.
export const SemTermo: Story = {
  args: {
    points: [
      'O dosímetro mede a dose, mas não protege.',
      'Confira o pedido antes de posicionar o paciente.',
    ],
  },
};
