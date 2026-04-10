import { QuizService } from './QuizService';
import type { QuizLesson } from '../../../types/quiz';

const lesson: QuizLesson = {
  id: 'lesson-quiz-1',
  title: 'Thorax Basics',
  difficulty: 'beginner',
  questions: [
    {
      id: 'q1',
      type: 'multiple-choice',
      prompt: 'Question 1',
      options: [{ label: 'A' }, { label: 'B' }],
      correctAnswerIndex: 0,
      explanation: 'Explanation 1',
    },
    {
      id: 'q2',
      type: 'multiple-choice',
      prompt: 'Question 2',
      options: [{ label: 'A' }, { label: 'B' }],
      correctAnswerIndex: 1,
      explanation: 'Explanation 2',
    },
  ],
};

describe('QuizService', () => {
  it('tracks progress, feedback, and score across a completed quiz', () => {
    const service = new QuizService(lesson);

    expect(service.getProgress()).toEqual({
      currentQuestionIndex: 0,
      totalQuestions: 2,
    });
    expect(service.isFinished()).toBe(false);

    const firstFeedback = service.submitAnswer(0);
    expect(firstFeedback).toEqual({
      visible: true,
      isCorrect: true,
      explanation: 'Explanation 1',
    });
    expect(service.getCorrectAnswers()).toBe(1);
    expect(service.getAnswerState('q1')).toEqual({
      selectedAnswerIndex: 0,
      isAnswered: true,
      correctAnswers: 1,
    });

    service.nextQuestion();
    expect(service.getProgress()).toEqual({
      currentQuestionIndex: 1,
      totalQuestions: 2,
    });

    const secondFeedback = service.submitAnswer(0);
    expect(secondFeedback).toEqual({
      visible: true,
      isCorrect: false,
      explanation: 'Explanation 2',
    });
    expect(service.getCorrectAnswers()).toBe(1);
    expect(service.getScore()).toBe(50);
    expect(service.hasPassed()).toBe(false);

    service.nextQuestion();
    expect(service.isFinished()).toBe(true);

    const result = service.finishQuiz();
    expect(result.lessonId).toBe('lesson-quiz-1');
    expect(result.totalQuestions).toBe(2);
    expect(result.correctAnswers).toBe(1);
    expect(result.answeredAt).toBeInstanceOf(Date);
  });

  it('resets state back to the initial quiz session', () => {
    const service = new QuizService(lesson);

    service.submitAnswer(0);
    service.nextQuestion();
    service.submitAnswer(1);

    service.reset();

    expect(service.getProgress()).toEqual({
      currentQuestionIndex: 0,
      totalQuestions: 2,
    });
    expect(service.getCorrectAnswers()).toBe(0);
    expect(service.getAnswerState('q1')).toBeUndefined();
    expect(service.isFinished()).toBe(false);
    expect(service.getCurrentQuestion()?.id).toBe('q1');
  });
});
