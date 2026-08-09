import fs from 'node:fs';
import path from 'node:path';
import type { CheckpointSurface } from './contracts';

const ROOT = path.resolve(__dirname, '../..');
const integrations: [CheckpointSurface, string][] = [
    ['first-run', 'features/first-run/screens/WelcomeFlowScreen.tsx'],
    ['home', 'features/home/screens/HomeScreen.tsx'],
    ['galaxy-map', 'features/galaxy/screens/GalaxyMapScreen.tsx'],
    ['galaxy-interior', 'features/galaxy/screens/GalaxyInteriorScreen.tsx'],
    ['planet-interior', 'features/galaxy/screens/PlanetInteriorScreen.tsx'],
    ['missions', 'features/galaxy/screens/MissionsScreen.tsx'],
    ['progress', 'features/progress/screens/ProgressScreen.tsx'],
    ['lesson', 'features/lesson-flow/screens/LessonFlowScreen.tsx'],
    ['legacy-quiz', 'features/quiz/screens/QuizScreen.tsx'],
    ['unit-checkpoint', 'features/checkpoint/screens/CheckpointScreen.tsx'],
    ['review', 'features/review/screens/ReviewScreen.tsx'],
    ['reward', 'features/rewards/screens/RewardScreen.tsx'],
];

describe('shadow screen integrations', () => {
    it.each(integrations)('%s is wired through the inert shadow hook', (surface, relativePath) => {
        const source = fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
        expect(source).toContain('useShadowCheckpoint');
        expect(source).toContain(`surface: '${surface}'`);
    });

    it.each([
        ['first-run', 'features/first-run/screens/WelcomeFlowScreen.tsx'],
        ['lesson', 'features/lesson-flow/screens/LessonFlowScreen.tsx'],
        ['review', 'features/review/screens/ReviewScreen.tsx'],
        ['unit-checkpoint', 'features/checkpoint/screens/CheckpointScreen.tsx'],
    ] as const)('%s is allowlisted through the active hook', (surface, relativePath) => {
        const source = fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
        expect(source).toContain('useActiveCheckpoint');
        expect(source).toContain(`surface: '${surface}'`);
    });

    it.each(integrations.filter(([surface]) => !['first-run', 'lesson', 'review', 'unit-checkpoint'].includes(surface)))(
        '%s remains outside direct active restore',
        (_surface, relativePath) => {
            const source = fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
            expect(source).not.toContain('useActiveCheckpoint');
        },
    );
});
