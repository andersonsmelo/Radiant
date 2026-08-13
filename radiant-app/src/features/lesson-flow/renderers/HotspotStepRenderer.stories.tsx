import type { Meta, StoryObj } from '@storybook/react-native';
import { Image, View } from 'react-native';
import { fn } from 'storybook/test';
import { semanticColors } from '../../../ui/semantic-colors';
import { HotspotStepRenderer } from './HotspotStepRenderer';

const xrayPanel = Image.resolveAssetSource(require('../assets/lesson-xray-panel.png')).uri;

const meta = {
    title: 'Aprendizagem/Hotspot',
    component: HotspotStepRenderer,
    args: {
        payload: {
            prompt: 'Selecione a região indicada para inspeção.',
            imageRef: xrayPanel,
            regions: [
                { id: 'superior', label: 'Região superior', x: 0.2, y: 0.08, width: 0.3, height: 0.26 },
                { id: 'inferior', label: 'Região inferior', x: 0.48, y: 0.58, width: 0.32, height: 0.28 },
            ],
            correctRegionIds: ['inferior'],
        },
        accessibilityLabel: 'Imagem didática para localização de regiões',
        onSelect: fn(),
    },
    decorators: [
        (Story) => (
            <View style={{ flex: 1, padding: 20, backgroundColor: semanticColors.galaxy.surface }}>
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof HotspotStepRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SemSelecao: Story = {};

export const ComSelecao: Story = {
    args: { selectedRegionId: 'inferior' },
};
