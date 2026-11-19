import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { semanticColors } from '../../../ui/semantic-colors';
import { RiskHuntStepRenderer } from './RiskHuntStepRenderer';

const payload = {
    prompt: 'Toque em todas as situações de risco que você vê na sala de raios X.',
    imageRef: 'diagram:sala-com-riscos',
    regions: [
        { id: 'porta', label: 'Porta da sala aberta', x: 0.02, y: 0.08, width: 0.15, height: 0.82, explanation: 'A porta aberta com a lâmpada acesa expõe o corredor.' },
        { id: 'campo', label: 'Campo de luz grande demais', x: 0.18, y: 0.26, width: 0.33, height: 0.4, explanation: 'Um campo que cobre o paciente inteiro expõe tecido à toa.' },
        { id: 'acompanhante', label: 'Acompanhante sem avental', x: 0.56, y: 0.45, width: 0.1, height: 0.45, explanation: 'Quem fica ao lado da mesa recebe radiação espalhada.' },
        { id: 'biombo', label: 'Operador atrás do biombo', x: 0.7, y: 0.43, width: 0.17, height: 0.47, explanation: 'Atrás do biombo o operador fica protegido.' },
        { id: 'avental', label: 'Avental no suporte', x: 0.85, y: 0.17, width: 0.11, height: 0.24, explanation: 'O avental guardado não expõe ninguém.' },
    ],
    riskRegionIds: ['porta', 'campo', 'acompanhante'],
};

/** O player guarda a resposta fora do renderer; aqui, o mínimo disso. */
function Controlled({ initial, submitted }: { initial?: string[]; submitted?: boolean }) {
    const [value, setValue] = useState(initial ? JSON.stringify(initial) : undefined);
    return <RiskHuntStepRenderer payload={payload} accessibilityLabel="Encontre os riscos: sala de raios X" value={value} onChange={setValue} submitted={submitted} />;
}

const meta = {
    title: 'Aprendizagem/Caça ao erro',
    component: RiskHuntStepRenderer,
    args: { payload, accessibilityLabel: 'Encontre os riscos: sala de raios X', onChange: () => undefined },
    decorators: [
        (Story) => (
            <View style={{ flex: 1, padding: 20, backgroundColor: semanticColors.galaxy.surface }}>
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof RiskHuntStepRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SemMarcas: Story = { render: () => <Controlled /> };

export const ComMarcas: Story = { render: () => <Controlled initial={['porta', 'biombo']} /> };

export const Conferida: Story = { render: () => <Controlled submitted initial={['porta', 'biombo']} /> };
