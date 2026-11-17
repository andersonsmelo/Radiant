import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';

import { galaxyColors } from '../../ui/theme';
import { ChoiceOption, type ChoiceOptionState } from './ChoiceOption';

const meta = {
  title: 'Controles/ChoiceOption',
  component: ChoiceOption,
  args: { label: 'Consolidação alveolar', state: 'idle', onPress: fn() },
  argTypes: {
    state: { control: 'select', options: ['idle', 'selected', 'correct', 'incorrect', 'dimmed'] },
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: galaxyColors.background }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ChoiceOption>;

export default meta;
type Story = StoryObj<typeof meta>;

const STATES: ChoiceOptionState[] = ['idle', 'selected', 'correct', 'incorrect', 'dimmed'];

export const Idle: Story = {};
export const Selected: Story = { args: { state: 'selected' } };
export const Correct: Story = { args: { state: 'correct' } };
export const Incorrect: Story = { args: { state: 'incorrect' } };
export const Dimmed: Story = { args: { state: 'dimmed' } };

// Os cinco estados juntos, como aparecem numa questão conferida.
export const CincoEstados: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      {STATES.map((state) => (
        <ChoiceOption key={state} state={state} label={`Alternativa ${state}`} onPress={() => {}} />
      ))}
    </View>
  ),
};

// Texto ampliado: a coluna estreita (180 pt) força a quebra que o texto em
// 3,1× provoca. A face cresce com o rótulo e a marca de veredito não corta.
export const TextoAmpliado: Story = {
  render: () => (
    <View style={{ gap: 12, width: 180 }}>
      {STATES.map((state) => (
        <ChoiceOption key={state} state={state} label="Consolidação alveolar com broncograma aéreo" onPress={() => {}} />
      ))}
    </View>
  ),
};
