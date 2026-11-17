import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { galaxyColors } from '../../../ui/theme';
import { JourneyMedal } from '../../journey/components/JourneyMedal';
import { SummaryHero } from './SummaryHero';

const medalha = (
  <JourneyMedal
    node={{ id: 'summary-hero-story', type: 'lesson' }}
    theme="tubo"
    state="done"
    pulsing={false}
    size={68}
    accessibilityLabel="Aula concluída."
  />
);

const meta = {
  title: 'Resumo/SummaryHero',
  component: SummaryHero,
  args: { children: medalha },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: galaxyColors.background }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof SummaryHero>;

export default meta;
type Story = StoryObj<typeof meta>;

// O resumo da aula: a medalha no centro e o Pixel ao lado, comemorando.
export const ComPixel: Story = {
  args: { pixel: { state: 'celebrate', expression: 'orgulhoso', accessibilityLabel: 'Pixel comemorando' } },
};

// O resumo da revisão: só a medalha.
export const SemPixel: Story = {};
