// app/quiz.tsx
/**
 * Quiz Route — Renders QuizScreen with route params
 * Supports:
 *  - /quiz
 *  - /quiz?mode=review&lessonIds=cxr-001,cxr-002
 */
import { useLocalSearchParams } from 'expo-router';
import QuizScreen from '../features/quiz/screens/QuizScreen';

export default function QuizRoute() {
    const params = useLocalSearchParams();

    const mode: 'normal' | 'review' =
        params.mode === 'review' ? 'review' : 'normal';

    const rawLessonIds = params.lessonIds;

    const lessonIds =
        typeof rawLessonIds === 'string'
            ? rawLessonIds.split(',').map(s => s.trim()).filter(Boolean)
            : Array.isArray(rawLessonIds)
                ? rawLessonIds.map(s => String(s).trim()).filter(Boolean)
                : [];

    const lessonId =
        typeof params.lessonId === 'string'
            ? params.lessonId
            : Array.isArray(params.lessonId)
                ? String(params.lessonId[0] ?? '').trim() || undefined
                : undefined;

    return <QuizScreen mode={mode} lessonIds={lessonIds} lessonId={lessonId} />;
}
