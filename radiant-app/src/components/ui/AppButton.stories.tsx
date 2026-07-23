import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';

import { semanticColors } from '../../ui/semantic-colors';
import { AppButton } from './AppButton';

const meta = {
  title: 'Controles/AppButton',
  component: AppButton,
  args: {
    label: 'Continuar',
    onPress: fn(),
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'galaxy', 'secondary', 'ghost'] },
  },
} satisfies Meta<typeof AppButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Disabled: Story = {
  args: { disabled: true, label: 'Indisponível agora' },
};

export const LongLabel: Story = {
  args: { label: 'Continuar a revisão de casos de tórax com prioridade clínica' },
};

export const Galaxy: Story = {
  args: { variant: 'galaxy', label: 'Resgatar recompensa' },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: semanticColors.galaxy.surface }}>
        <Story />
      </View>
    ),
  ],
};

export const Ghost: Story = {
  args: { variant: 'ghost', label: 'Ver detalhes' },
};
