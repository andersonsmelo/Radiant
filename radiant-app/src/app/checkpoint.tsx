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

  return <CheckpointScreen nodeId={nodeId} />;
}
