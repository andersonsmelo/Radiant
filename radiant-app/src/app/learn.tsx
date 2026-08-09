import { useLocalSearchParams } from 'expo-router';
import LessonFlowScreen from '../features/lesson-flow/screens/LessonFlowScreen';

export default function LearnRoute() {
    const params = useLocalSearchParams();

    const blockId =
        typeof params.blockId === 'string'
            ? params.blockId
            : Array.isArray(params.blockId)
                ? String(params.blockId[0] ?? '')
                : '';

    const nodeId =
        typeof params.nodeId === 'string'
            ? params.nodeId
            : Array.isArray(params.nodeId)
                ? String(params.nodeId[0] ?? '')
                : '';

    const resumeCheckpointId = typeof params.resumeCheckpointId === 'string'
        ? params.resumeCheckpointId
        : Array.isArray(params.resumeCheckpointId)
            ? String(params.resumeCheckpointId[0] ?? '') || undefined
            : undefined;
    const resumeCursorId = typeof params.resumeCursorId === 'string'
        ? params.resumeCursorId
        : Array.isArray(params.resumeCursorId)
            ? String(params.resumeCursorId[0] ?? '') || undefined
            : undefined;

    return (
        <LessonFlowScreen
            blockId={blockId}
            nodeId={nodeId}
            resumeCheckpointId={resumeCheckpointId}
            resumeCursorId={resumeCursorId}
        />
    );
}
