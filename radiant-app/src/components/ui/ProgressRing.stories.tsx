import type { Meta, StoryObj } from '@storybook/react-native';
import { Text, View } from 'react-native';

import { semanticColors } from '../../ui/semantic-colors';
import { ProgressRing } from './ProgressRing';

const meta = {
  title: 'Dados/ProgressRing',
  component: ProgressRing,
  args: {
    value: 0.72,
    size: 96,
    stroke: 8,
    children: <Text style={{ color: semanticColors.light.textPrimary, fontWeight: '800' }}>72%</Text>,
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    size: { control: { type: 'range', min: 48, max: 160, step: 4 } },
  },
} satisfies Meta<typeof ProgressRing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { value: 0, children: <Text style={{ color: semanticColors.light.textSecondary }}>0%</Text> },
};

export const Success: Story = {
  args: { value: 1, color: semanticColors.light.statusSuccess, children: <Text style={{ color: semanticColors.light.statusSuccess }}>✓</Text> },
};

export const NeedsAttention: Story = {
  args: { value: 0.2, color: semanticColors.light.statusError, children: <Text style={{ color: semanticColors.light.textCritical }}>20%</Text> },
};

export const Galaxy: Story = {
  args: {
    color: semanticColors.galaxy.reward,
    trackColor: semanticColors.galaxy.border,
    children: <Text style={{ color: semanticColors.galaxy.textPrimary, fontWeight: '800' }}>72%</Text>,
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: semanticColors.galaxy.surface }}>
        <Story />
      </View>
    ),
  ],
};
