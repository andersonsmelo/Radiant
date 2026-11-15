import { CaseDecisionStepRenderer } from './CaseDecisionStepRenderer';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { InteractionType, LearningInteractionV2 } from '../../../types/learningActivity';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';
import { BenchStepRenderer } from './BenchStepRenderer';
import { ComparisonStepRenderer } from './ComparisonStepRenderer';
import { HotspotStepRenderer } from './HotspotStepRenderer';
import { MatchingStepRenderer } from './MatchingStepRenderer';
import { MultipleChoiceStepRenderer } from './MultipleChoiceStepRenderer';
import { OrderingStepRenderer } from './OrderingStepRenderer';
import { CategorizeStepRenderer } from './CategorizeStepRenderer';
import { ClozeStepRenderer } from './ClozeStepRenderer';
import { MultiSelectStepRenderer } from './MultiSelectStepRenderer';
import { TrueFalseStepRenderer } from './TrueFalseStepRenderer';

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
    resolveImageSource?: import('./InteractionImageSource').InteractionImageResolver;
    interaction: LearningInteractionV2;
    value: string | undefined;
    onChange: (value: string) => void;
    confirmationLabel?: string;
    submitted?: boolean;
};

type InteractionRenderer = (props: InteractionRendererProps) => React.ReactElement;

function MultipleChoiceInteraction({ interaction, value, onChange, confirmationLabel = 'Continuar', submitted = false }: InteractionRendererProps) {
    if (interaction.type !== 'multiple-choice') {
        return <UnsupportedInteraction interaction={interaction} />;
    }

    return (
        <MultipleChoiceStepRenderer
            payload={{
                prompt: interaction.payload.prompt,
                options: interaction.payload.options,
                correctOptionId: interaction.payload.correctOptionId,
                // A tela do player apresenta o feedback, preservando a explicação autoral.
                explanation: interaction.feedback.correct,
            }}
            exposureImage={interaction.payload.exposureImage}
            selectedOptionId={value}
            onSelect={onChange}
            confirmationLabel={confirmationLabel}
            submitted={submitted}
        />
    );
}

function HotspotInteraction({ interaction, value, onChange, resolveImageSource, submitted, confirmationLabel }: InteractionRendererProps) {
    if (interaction.type !== 'hotspot') {
        return <UnsupportedInteraction interaction={interaction} />;
    }

    return (
        <HotspotStepRenderer
            payload={interaction.payload}
            accessibilityLabel={interaction.accessibility.label}
            resolveImageSource={resolveImageSource} submitted={submitted} confirmationLabel={confirmationLabel}
            selectedRegionId={value}
            onSelect={onChange}
        />
    );
}

function ComparisonInteraction({ interaction, value, onChange, resolveImageSource, submitted, confirmationLabel }: InteractionRendererProps) {
    if (interaction.type !== 'comparison') {
        return <UnsupportedInteraction interaction={interaction} />;
    }

    return (
        <ComparisonStepRenderer
            resolveImageSource={resolveImageSource} submitted={submitted} confirmationLabel={confirmationLabel}
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

function OrderingInteraction({ interaction, value, onChange, submitted, confirmationLabel }: InteractionRendererProps) {
    if (interaction.type !== 'ordering') {
        return <UnsupportedInteraction interaction={interaction} />;
    }

    return <OrderingStepRenderer payload={interaction.payload} value={value} onChange={onChange} submitted={submitted} confirmationLabel={confirmationLabel} />;
}

function BenchInteraction(props: InteractionRendererProps) {
    if (props.interaction.type !== 'bench') {
        return <UnsupportedInteraction interaction={props.interaction} />;
    }

    return <BenchStepRenderer {...props} />;
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

function CaseDecisionInteraction({ interaction, value, onChange, submitted, confirmationLabel = 'Conferir resposta' }: InteractionRendererProps) {
    if (interaction.type !== 'case-decision' || interaction.payload.options.some(option => option.imageRef !== undefined)) {
        return <UnsupportedInteraction interaction={interaction} />;
    }
    return <CaseDecisionStepRenderer payload={interaction.payload} selectedOptionId={value}
        onSelect={onChange} submitted={submitted} confirmationLabel={confirmationLabel} />;
}

/** Famílias da 1.6: o mesmo contrato `interaction / value / onChange`, com o retorno pós-conferência dentro do componente. */
function NewFamilyInteraction({ interaction, value, onChange, submitted, confirmationLabel }: InteractionRendererProps) {
    const shared = { value, onChange, submitted, confirmationLabel };
    switch (interaction.type) {
        case 'cloze': return <ClozeStepRenderer payload={interaction.payload} {...shared} />;
        case 'true-false': return <TrueFalseStepRenderer payload={interaction.payload} value={value} onChange={onChange} submitted={submitted} />;
        case 'categorize': return <CategorizeStepRenderer key={interaction.id} payload={interaction.payload} {...shared} />;
        case 'multi-select': return <MultiSelectStepRenderer payload={interaction.payload} {...shared} />;
        default: return <UnsupportedInteraction interaction={interaction} />;
    }
}

const RENDERERS: Partial<Record<InteractionType, InteractionRenderer>> = {
    'case-decision': CaseDecisionInteraction,
    'multiple-choice': MultipleChoiceInteraction,
    hotspot: HotspotInteraction,
    comparison: ComparisonInteraction,
    matching: MatchingInteraction,
    ordering: OrderingInteraction,
    bench: BenchInteraction,
    cloze: NewFamilyInteraction,
    'true-false': NewFamilyInteraction,
    categorize: NewFamilyInteraction,
    'multi-select': NewFamilyInteraction,
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
