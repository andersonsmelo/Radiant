import { QuizQuestion } from '../../../types/quiz';

// Temporary mock data for Review v2
// In a real app, this would be fetched from a LessonRepository or similar
export const MOCK_REVIEW_QUESTIONS: Record<string, QuizQuestion[]> = {
    'lesson-1': [
        {
            id: 'q1',
            type: 'multiple-choice',
            prompt: 'Qual é a principal função dos raios-X na radiologia diagnóstica?',
            options: [
                { label: 'Tratamento de tumores' },
                { label: 'Visualização de estruturas internas' },
                { label: 'Esterilização de equipamentos' },
                { label: 'Aquecimento de tecidos' },
            ],
            correctAnswerIndex: 1,
            explanation: 'Os raios-X são usados principalmente para criar imagens de estruturas internas do corpo.',
        },
        {
            id: 'q2',
            type: 'multiple-choice',
            prompt: 'Qual estrutura é mais radiopaca em uma radiografia?',
            options: [
                { label: 'Ar' },
                { label: 'Gordura' },
                { label: 'Osso' },
                { label: 'Músculo' },
            ],
            correctAnswerIndex: 2,
            explanation: 'O osso é a estrutura mais radiopaca devido à sua alta densidade.',
        },
    ],
    // Fallback/Generic questions if lesson ID not found
    'generic': [
        {
            id: 'g1',
            type: 'multiple-choice',
            prompt: 'O que é contraste radiológico?',
            options: [
                { label: 'Uma técnica de pintura' },
                { label: 'Substância para realçar estruturas' },
                { label: 'Ajuste de brilho do monitor' },
            ],
            correctAnswerIndex: 1,
            explanation: 'Contraste realça estruturas específicas na imagem.',
        }
    ]
};
