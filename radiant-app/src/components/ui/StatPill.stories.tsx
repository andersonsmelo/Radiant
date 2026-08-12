import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { semanticColors } from '../../ui/semantic-colors';
import { StreakIcon, XpIcon } from '../../ui/components/HudIcons';
import { StatPill } from './StatPill';

const meta = {
  title: 'Dados/StatPill',
  component: StatPill,
  args: {
    icon: <XpIcon value={2840} />,
    value: '2 840 XP',
    color: semanticColors.light.reward,
  },
} satisfies Meta<typeof StatPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {};

export const Galaxy: Story = {
  args: {
    dark: true,
    icon: <StreakIcon />,
    value: '12 dias',
    color: semanticColors.galaxy.reward,
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: semanticColors.galaxy.surface }}>
        <Story />
      </View>
    ),
  ],
};

export const LongValue: Story = {
  args: { value: '12 480 pontos de experiência' },
};
