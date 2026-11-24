import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { DiagramView } from './DiagramView';

const meta = {
  title: 'Figuras/DiagramView',
  component: DiagramView,
  decorators: [
    (Story) => (
      <View style={{ width: 320 }}>
        <Story />
      </View>
    ),
  ],
  args: { id: 'tubo-raios-x' },
} satisfies Meta<typeof DiagramView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TuboParado: Story = {};

export const ColimadorEmLaco: Story = { args: { id: 'colimador-abrindo' } };

export const ColimadorDirigido: Story = {
  args: { id: 'colimador-abrindo', progress: 0.5 },
  argTypes: { progress: { control: { type: 'range', min: 0, max: 1, step: 0.05 } } },
};

export const FiguraIndisponivel: Story = { args: { id: 'nao-existe' } };
