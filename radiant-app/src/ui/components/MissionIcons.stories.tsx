import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { galaxyColors } from '../theme';
import { MissionIcon, type MissionKind } from './MissionIcons';

const meta = {
  title: 'Missões/MissionIcon',
  component: MissionIcon,
  args: { kind: 'aulas', done: false },
  argTypes: {
    kind: { control: 'select', options: ['aulas', 'acertos', 'meta'] },
    done: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: galaxyColors.background }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof MissionIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

const KINDS: MissionKind[] = ['aulas', 'acertos', 'meta'];

export const Aulas: Story = {};
export const Acertos: Story = { args: { kind: 'acertos' } };
export const MetaDiaria: Story = { args: { kind: 'meta' } };
export const Concluida: Story = { args: { done: true } };

// Os três tipos em andamento (azul da unidade) e concluídos (ouro, com a marca de feito).
export const TresTipos: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      {[false, true].map((done) => (
        <View key={String(done)} style={{ flexDirection: 'row', gap: 16 }}>
          {KINDS.map((kind) => <MissionIcon key={kind} kind={kind} done={done} />)}
        </View>
      ))}
    </View>
  ),
};
