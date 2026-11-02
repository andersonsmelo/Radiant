import type { Meta, StoryObj } from '@storybook/react-native';
import { SlicingSpaceLessonPreview } from './SlicingSpaceLessonPreview';

const meta = {
  title: 'Curriculum V3/Retired slicing preview',
  component: SlicingSpaceLessonPreview,
} satisfies Meta<typeof SlicingSpaceLessonPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interativa: Story = {};
