import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';

import { galaxyColors } from '../../../ui/theme';
import { GroupArea } from './GroupArea';
import { TapChip } from './TapChip';

const meta = {
  title: 'Aprendizagem/Área de grupo',
  component: GroupArea,
  args: { label: 'Proteção', ready: false, empty: false, accessibilityLabel: 'Grupo Proteção', onPress: fn() },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: galaxyColors.background }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof GroupArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const fichas = (
  <>
    <TapChip label="Avental" accessibilityLabel="Avental, no grupo Proteção" onPress={() => {}} />
    <TapChip label="Distância" accessibilityLabel="Distância, no grupo Proteção" onPress={() => {}} />
  </>
);

// Repouso: nenhuma ficha escolhida, borda tracejada.
export const Repouso: Story = { args: { children: fichas } };
// Com ficha escolhida, a área se oferece para recebê-la.
export const ProntaParaReceber: Story = { args: { ready: true, children: fichas } };
export const ComFichas: Story = { args: { children: fichas } };
export const Vazia: Story = { args: { empty: true } };
