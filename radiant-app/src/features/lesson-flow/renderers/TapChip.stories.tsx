import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';

import { galaxyColors } from '../../../ui/theme';
import { TapChip } from './TapChip';

const meta = {
  title: 'Aprendizagem/Ficha',
  component: TapChip,
  args: { label: 'Avental', accessibilityLabel: 'Avental', onPress: fn() },
  argTypes: {
    verdict: { control: 'select', options: [undefined, 'correct', 'incorrect'] },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: galaxyColors.background }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof TapChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutra: Story = {};
export const Escolhida: Story = { args: { selected: true } };
export const Certa: Story = { args: { verdict: 'correct', disabled: true } };
export const Errada: Story = { args: { verdict: 'incorrect', disabled: true } };
export const Desabilitada: Story = { args: { disabled: true } };

// Os cinco estados juntos, como aparecem numa etapa conferida.
export const CincoEstados: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
      <TapChip label="Neutra" accessibilityLabel="Neutra" onPress={() => {}} />
      <TapChip label="Escolhida" accessibilityLabel="Escolhida" selected onPress={() => {}} />
      <TapChip label="Certa" accessibilityLabel="Certa" verdict="correct" disabled />
      <TapChip label="Errada" accessibilityLabel="Errada" verdict="incorrect" disabled />
      <TapChip label="Desabilitada" accessibilityLabel="Desabilitada" disabled />
    </View>
  ),
};
