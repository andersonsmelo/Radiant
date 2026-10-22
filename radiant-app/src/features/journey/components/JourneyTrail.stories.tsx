import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';

import type { JourneyNode } from '../../../types/journey';
import { ILLUSTRATION_THEMES } from '../../../ui/illustrations/illustrationPlayback';
import { galaxyColors } from '../../../ui/theme';
import type { CurriculumSegment } from '../services/JourneyCurriculumService';
import { JourneyStageHeader } from './JourneyStageHeader';
import { JourneyTrail } from './JourneyTrail';

// Carga sintética do componente real. Não lê nem grava progresso do aluno.
// Os 40 nós concluídos têm ilustrações elegíveis a animação; a lista decide
// quais estão visíveis e podem tocar. A medição deve declarar este cenário.
const nodes: JourneyNode[] = Array.from({ length: 40 }, (_, index) => ({
  id: `benchmark-medal-${index + 1}`,
  unitId: 'benchmark-unit',
  type: 'lesson',
  title: `Etapa ${index + 1}`,
  status: 'completed',
  theme: ILLUSTRATION_THEMES[index % ILLUSTRATION_THEMES.length],
}));

const segments: CurriculumSegment[] = [{
  trackId: 'benchmark-track',
  trackTitle: '40 medalhas concluídas',
  order: 1,
  unlocked: true,
  completed: true,
  units: [{ id: 'benchmark-unit', title: 'Percurso de medição', nodes }],
}];

const meta = {
  title: 'Trilha/JourneyTrail',
  component: JourneyTrail,
  args: {
    segments,
    onNodePress: () => undefined,
    isNodeDisabled: () => false,
    header: <JourneyStageHeader title="40 medalhas concluídas" completed={40} total={40} />,
  },
  decorators: [(Story) => <View style={styles.surface}><Story /></View>],
} satisfies Meta<typeof JourneyTrail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const QuarentaConcluidas: Story = {};

const styles = StyleSheet.create({
  surface: { flex: 1, alignSelf: 'stretch', backgroundColor: galaxyColors.background },
});
