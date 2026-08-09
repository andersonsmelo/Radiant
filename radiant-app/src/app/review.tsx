import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ReviewScreen from '../features/review/screens/ReviewScreen';

export default function ReviewRoute() {
    const params = useLocalSearchParams();
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

    return <ReviewScreen resumeCheckpointId={resumeCheckpointId} resumeCursorId={resumeCursorId} />;
}
