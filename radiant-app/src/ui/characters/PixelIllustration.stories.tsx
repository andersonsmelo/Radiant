import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { semanticColors } from '../semantic-colors';
import { PixelIllustration } from './PixelIllustration';

const meta = {
  title: 'Personagens/PixelIllustration',
  component: PixelIllustration,
  args: {
    state: 'guide',
    size: 'md',
  },
  argTypes: {
    state: { control: 'select', options: ['idle', 'thinking', 'guide', 'happy', 'celebrate', 'oops'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: semanticColors.light.surface }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof PixelIllustration>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Guide: Story = {};

export const Celebrate: Story = {
  args: { state: 'celebrate', size: 'lg' },
};

export const Thinking: Story = {
  args: { state: 'thinking' },
};

export const Oops: Story = {
  args: { state: 'oops' },
};
