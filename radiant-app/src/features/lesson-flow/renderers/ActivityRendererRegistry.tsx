import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { InteractionType, LearningInteractionV2 } from '../../../types/learningActivity';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';
import { ComparisonStepRenderer } from './ComparisonStepRenderer';
import { HotspotStepRenderer } from './HotspotStepRenderer';
import { MatchingStepRenderer } from './MatchingStepRenderer';
import { MultipleChoiceStepRenderer } from './MultipleChoiceStepRenderer';
import { OrderingStepRenderer } from './OrderingStepRenderer';

/**
 * Registro de renderizadores de interação.
 *
 * O player deixa de saber quais tipos existem: ele pede ao registro o
 * renderizador do tipo que veio na atividade e passa **um único contrato**,
 * `interaction / value / onChange`. Adicionar um jogo novo passa a ser
 * registrar uma entrada aqui, e não abrir mais um `if` na tela — que é como a
 * tela vinha crescendo, um ramo por tipo.
 *
 * **Renderizador não guarda estado.** `value` chega de fora e `onChange` sobe;
 * quem confirma é o player. Isso preserva a regra que já valia no contrato
 * legado — selecionar não confirma, trocar de alternativa antes de continuar
 * não penaliza — e a mantém válida para qualquer tipo futuro, em vez de cada
 * jogo reinventá-la.
 */

export type InteractionRendererProps = {
    interaction: LearningInteractionV2;
    value: string | undefined;
    onChange: (value: string) => void;
};

type InteractionRenderer = (props: InteractionRendererProps) => React.ReactElement;

function MultipleChoiceInteraction({ interaction, value, onChange }: InteractionRendererProps) {
    if (interaction.type !== 'multiple-choice') {
        return <UnsupportedInteraction interaction={interaction} />;
    }

    return (
        <MultipleChoiceStepRenderer
            payload={{
                prompt: interaction.payload.prompt,
                options: interaction.payload.options,
                correctOptionId: interaction.payload.correctOptionId,
                // O renderizador legado não exibe a explicação — ela é do
                // reforço —, mas o tipo a exige. O feedback de acerto é o
                // equivalente v2, e passá-lo evita inventar texto vazio.
                explanation: interaction.feedback.correct,
            }}
            selectedOptionId={value}
            onSelect={onChange}
        />
    );
}

function HotspotInteraction({ interaction, value, onChange }: InteractionRendererProps) {
    if (interaction.type !== 'hotspot') {
        return <UnsupportedInteraction interaction={interaction} />;
    }

    return (
        <HotspotStepRenderer
            payload={interaction.payload}
            accessibilityLabel={interaction.accessibility.label}
            selectedRegionId={value}
            onSelect={onChange}
        />
    );
}

function ComparisonInteraction({ interaction, value, onChange }: InteractionRendererProps) {
    if (interaction.type !== 'comparison') {
        return <UnsupportedInteraction interaction={interaction} />;
    }

    return (
        <ComparisonStepRenderer
            payload={interaction.payload}
            selectedOptionId={value}
            onSelect={onChange}
        />
    );
}

function MatchingInteraction({ interaction, value, onChange }: InteractionRendererProps) {
    if (interaction.type !== 'matching') {
        return <UnsupportedInteraction interaction={interaction} />;
    }

    return <MatchingStepRenderer payload={interaction.payload} value={value} onChange={onChange} />;
}

function OrderingInteraction({ interaction, value, onChange }: InteractionRendererProps) {
    if (interaction.type !== 'ordering') {
        return <UnsupportedInteraction interaction={interaction} />;
    }

    return <OrderingStepRenderer payload={interaction.payload} value={value} onChange={onChange} />;
}

/**
 * Erro seguro: tipo sem renderizador não derruba a lição.
 *
 * O aluno pode estar no meio de uma sessão quando o app encontra uma atividade
 * de um tipo que esta versão do binário não conhece — conteúdo é versionado
 * separadamente do app. Lançar aqui perderia o progresso da sessão inteira por
 * causa de uma tela; avisar e deixar seguir custa uma interação.
 */
function UnsupportedInteraction({ interaction }: { interaction: LearningInteractionV2 }) {
    return (
        <View style={styles.unsupported} accessibilityRole="alert">
            <Text style={styles.unsupportedTitle}>Esta atividade não pode ser exibida</Text>
            <Text style={styles.unsupportedBody}>
                O tipo “{interaction.type}” ainda não tem renderizador nesta versão do app. Atualize o
                aplicativo para continuar esta prática.
            </Text>
        </View>
    );
}

const RENDERERS: Partial<Record<InteractionType, InteractionRenderer>> = {
    'multiple-choice': MultipleChoiceInteraction,
    hotspot: HotspotInteraction,
    comparison: ComparisonInteraction,
    matching: MatchingInteraction,
    ordering: OrderingInteraction,
};

export const REGISTERED_INTERACTION_TYPES = Object.keys(RENDERERS) as InteractionType[];

export function isInteractionTypeRegistered(type: string): boolean {
    return Object.hasOwn(RENDERERS, type);
}

export function ActivityInteractionRenderer(props: InteractionRendererProps) {
    const Renderer = RENDERERS[props.interaction.type];

    if (!Renderer) {
        return <UnsupportedInteraction interaction={props.interaction} />;
    }

    return <Renderer {...props} />;
}

const styles = StyleSheet.create({
    unsupported: {
        gap: space.s2,
        padding: space.s4,
        borderRadius: radius.rMd,
        borderWidth: 1,
        borderColor: galaxyColors.textSecondary,
    },
    unsupportedTitle: {
        ...typography.bodyStrong,
        color: galaxyColors.textPrimary,
    },
    unsupportedBody: {
        ...typography.bodyRegular,
        color: galaxyColors.textSecondary,
    },
});
