import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';

import { galaxyColors } from '../../../ui/theme';
import { PlanCard } from './PlanCard';

const meta = {
  title: 'Assinatura/PlanCard',
  component: PlanCard,
  args: { title: 'Anual', price: 'R$ 149,90', detail: 'por ano, R$ 12,49 por mês', selected: true, tone: 'gold', onPress: fn() },
  argTypes: { tone: { control: 'select', options: ['neutral', 'gold'] } },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: galaxyColors.background }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof PlanCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AnualSelecionado: Story = {};
export const MensalSelecionado: Story = { args: { title: 'Mensal', price: 'R$ 19,90', detail: 'por mês', tone: 'neutral' } };
export const Desabilitado: Story = { args: { disabled: true } };

// Os dois lado a lado, como na tela, com o anual escolhido.
export const LadoALado: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <View style={{ flex: 1 }}>
        <PlanCard title="Mensal" price="R$ 19,90" detail="por mês" selected={false} tone="neutral" onPress={() => {}} />
      </View>
      <View style={{ flex: 1 }}>
        <PlanCard title="Anual" price="R$ 149,90" detail="por ano, R$ 12,49 por mês" selected tone="gold" onPress={() => {}} />
      </View>
    </View>
  ),
};

// Texto ampliado: a tela empilha os cartões (`useLargeTextLayout`); a coluna
// estreita força a quebra que o texto em 3,1× provoca.
export const TextoAmpliado: Story = {
  render: () => (
    <View style={{ gap: 12, width: 180 }}>
      <PlanCard title="Anual" price="R$ 149,90" detail="por ano, R$ 12,49 por mês" selected tone="gold" onPress={() => {}} />
      <PlanCard title="Mensal" price="R$ 19,90" detail="por mês" selected={false} tone="neutral" onPress={() => {}} />
    </View>
  ),
};
