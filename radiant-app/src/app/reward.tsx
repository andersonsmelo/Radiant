import { useLocalSearchParams } from 'expo-router';
import RewardScreen from '../features/rewards/screens/RewardScreen';

export default function RewardRoute() {
  const params = useLocalSearchParams();

  const nodeId =
    typeof params.nodeId === 'string'
      ? params.nodeId
      : Array.isArray(params.nodeId)
        ? String(params.nodeId[0] ?? '').trim() || undefined
        : undefined;

  return <RewardScreen nodeId={nodeId} />;
}
