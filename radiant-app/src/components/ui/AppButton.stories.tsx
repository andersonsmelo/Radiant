import type React from 'react';
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
    variant: { control: 'select', options: ['primary', 'galaxy', 'secondary', 'ghost', 'success', 'error'] },
  },
} satisfies Meta<typeof AppButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

// As seis variantes com lábio, desabilitadas: face neutra, rótulo legível.
export const Desabilitado: Story = {
  render: () => (
    <View style={{ flex: 1, justifyContent: 'center', gap: 12, padding: 20, backgroundColor: semanticColors.galaxy.surface }}>
      {(['primary', 'galaxy', 'gold', 'secondary', 'success', 'error'] as const).map((variant) => (
        <AppButton key={variant} variant={variant} label={`Indisponível (${variant})`} disabled onPress={() => {}} />
      ))}
    </View>
  ),
};

export const Loading: Story = {
  args: { loading: true, label: 'Salvando progresso' },
};

export const LongLabel: Story = {
  args: { label: 'Continuar a revisão de casos de tórax com prioridade clínica' },
};

const onGalaxy = [
  (Story: () => React.JSX.Element) => (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: semanticColors.galaxy.surface }}>
      <Story />
    </View>
  ),
];

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

// O rótulo do ghost é o Azul de Navegação, feito para o grafite (6,62:1).
export const Ghost: Story = {
  args: { variant: 'ghost', label: 'Ver detalhes' },
  decorators: onGalaxy,
};

export const Secondary: Story = {
  args: { variant: 'secondary', label: 'Agora não' },
  decorators: onGalaxy,
};

export const SuccessFeedback: Story = {
  args: { variant: 'success', label: 'Continuar' },
  decorators: onGalaxy,
};

export const ErrorFeedback: Story = {
  args: { variant: 'error', label: 'Entendi' },
  decorators: onGalaxy,
};
