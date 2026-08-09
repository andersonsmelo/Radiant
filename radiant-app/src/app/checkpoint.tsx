import { useLocalSearchParams } from 'expo-router';
import CheckpointScreen from '../features/checkpoint/screens/CheckpointScreen';

export default function CheckpointRoute() {
  const params = useLocalSearchParams();

  const nodeId =
    typeof params.nodeId === 'string'
      ? params.nodeId
      : Array.isArray(params.nodeId)
        ? String(params.nodeId[0] ?? '').trim() || undefined
        : undefined;

  const resumeCheckpointId = typeof params.resumeCheckpointId === 'string'
    ? params.resumeCheckpointId
    : Array.isArray(params.resumeCheckpointId)
      ? String(params.resumeCheckpointId[0] ?? '').trim() || undefined
      : undefined;
  const resumeCursorId = typeof params.resumeCursorId === 'string'
    ? params.resumeCursorId
    : Array.isArray(params.resumeCursorId)
      ? String(params.resumeCursorId[0] ?? '').trim() || undefined
      : undefined;

  return (
    <CheckpointScreen
      nodeId={nodeId}
      resumeCheckpointId={resumeCheckpointId}
      resumeCursorId={resumeCursorId}
    />
  );
}
