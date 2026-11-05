import React from 'react';
import { Text } from 'react-native';
import { ActivityInteractionRenderer, type InteractionRendererProps } from '../lesson-flow/renderers/ActivityRendererRegistry';
import { AbstractCollimationRenderer } from './AbstractCollimationRenderer';
import { EditorialPreviewSessionView } from './EditorialLessonPreview';
import { resolveEditorialLocalDiagram } from './EditorialLocalDiagrams';
import { createEditorialPracticeMaterial } from './EditorialPracticeMaterial';

type Props = Pick<React.ComponentProps<typeof EditorialPreviewSessionView>, 'onObservation' | 'onFinish'> & {
    material?: unknown; activityId?: string;
};

function EditorialPracticeInteraction(props: InteractionRendererProps) {
    return props.interaction.type === 'bench'
        ? <AbstractCollimationRenderer {...props} />
        : <ActivityInteractionRenderer {...props} />;
}

/** Reviewer-only, no route/catalog lookup and no remote image fallback. */
export function EditorialPracticePreview({ material, activityId, onObservation, onFinish }: Props) {
    if (material === undefined) return <Text>Conteúdo em preparação</Text>;
    const result = createEditorialPracticeMaterial(material, activityId ?? '');
    if (!result.ok) return <Text>Não foi possível abrir esta prévia.</Text>;
    const resolveImageSource = (ref: string) => {
        const asset = result.assets.find(asset => asset.uri === ref);
        return asset ? resolveEditorialLocalDiagram(asset) : null;
    };
    return <EditorialPreviewSessionView key={JSON.stringify({ session: result.session, assets: result.assets })}
        session={result.session} stage="practice" InteractionComponent={EditorialPracticeInteraction}
        resolveImageSource={resolveImageSource} onObservation={onObservation} onFinish={onFinish} />;
}
