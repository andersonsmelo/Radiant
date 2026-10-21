import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, Text, View } from 'react-native';

import { typography } from '../styles';
import { galaxyColors, medalColors } from '../theme';
import type { IllustrationState } from './illustrationPlayback';
import { ThemeIllustration } from './ThemeIllustration';

// A ilustração sobre um disco na cor da face da medalha, só para conferir a
// leitura em cada estado. A medalha de verdade (lábio, miolo, brilho) é da
// trilha, no plano 2; aqui o disco está no lugar dela.

const FACE: Record<IllustrationState, string> = {
  done: medalColors.gold.inner,
  next: medalColors.unit.inner,
  locked: medalColors.locked.inner,
};

const LABEL: Record<IllustrationState, string> = {
  done: 'Concluído',
  next: 'Próximo',
  locked: 'Bloqueado',
};

const MEDAL = 100;
// Na prancheta, a arte de 80 cabe no miolo de raio 37 da medalha de raio 46,
// na escala 0,92, um pouco acima do centro.
const ILLUSTRATION = Math.round((MEDAL / 92) * 0.92 * (120 / 1.4));

function OnMedal({ state, theme }: { state: IllustrationState; theme: 'tubo' }) {
  return (
    <View style={styles.cell}>
      <View style={[styles.medal, { backgroundColor: FACE[state] }]}>
        <View style={styles.art}>
          <ThemeIllustration theme={theme} state={state} size={ILLUSTRATION} />
        </View>
      </View>
      <Text style={[typography.caption, styles.label]}>{LABEL[state]}</Text>
    </View>
  );
}

const meta = {
  title: 'Trilha/ThemeIllustration',
  component: ThemeIllustration,
  args: { theme: 'tubo', state: 'done', size: 160 },
  argTypes: {
    state: { control: 'select', options: ['done', 'next', 'locked'] },
  },
  decorators: [
    (Story) => (
      <View style={styles.stage}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ThemeIllustration>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solta: Story = {};

export const TuboNosTresEstados: Story = {
  render: () => (
    <View style={styles.row}>
      <OnMedal theme="tubo" state="done" />
      <OnMedal theme="tubo" state="next" />
      <OnMedal theme="tubo" state="locked" />
    </View>
  ),
};

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: galaxyColors.background,
  },
  row: { flexDirection: 'row', gap: 12 },
  cell: { alignItems: 'center', gap: 8 },
  medal: {
    width: MEDAL,
    height: MEDAL,
    borderRadius: MEDAL / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  art: { transform: [{ translateY: -3 * (MEDAL / 92) }] },
  label: { color: galaxyColors.textSecondary },
});
