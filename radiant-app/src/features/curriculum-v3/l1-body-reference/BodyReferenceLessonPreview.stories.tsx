import type { Meta, StoryObj } from '@storybook/react-native';
import { BodyReferenceLessonPreview } from './BodyReferenceLessonPreview';

const meta = {
  title: 'Curriculum V3/L1 O corpo como referência',
  component: BodyReferenceLessonPreview,
} satisfies Meta<typeof BodyReferenceLessonPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interativa: Story = {};
