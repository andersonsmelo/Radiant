// src/types/quiz.ts

/**
 * Quiz Engine — Domain types (source of truth)
 * Used by QuizService, hooks and UI.
 * Keep UI/storage out of this file.
 */

export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type QuizQuestionType = 'multiple-choice' | 'image';

export type QuizQuestionId = string;
export type QuizLessonId = string;

export type QuizAnswerOption = {
  label: string;
};

export type QuizQuestion = {
  id: QuizQuestionId;

  /** Question modality */
  type: QuizQuestionType;

  /** Main statement shown to the user */
  prompt: string;

  /** Optional image for radiology cases */
  imageUrl?: string;

  /** Answer options shown to the user */
  options: QuizAnswerOption[];

  /** 0-based index of the correct option */
  correctAnswerIndex: number;

  /** Short explanation for immediate feedback */
  explanation: string;

  /** Optional hint (future) */
  hint?: string;
};

export type QuizLessonJourneyStageCopy = {
  questionIndex?: number;
  contextBody?: string;
  teachBody?: string;
  reinforceBody?: string;
};

export type QuizLessonJourneyCopy = {
  intro?: QuizLessonJourneyStageCopy;
  review?: QuizLessonJourneyStageCopy;
};

export type QuizLesson = {
  id: QuizLessonId;
  title: string;
  difficulty: QuizDifficulty;
  questions: QuizQuestion[];
  journey?: QuizLessonJourneyCopy;
};

export type QuizAnswerState = {
  selectedAnswerIndex: number | null;
  isAnswered: boolean;
  correctAnswers: number;
};

export type QuizFeedback = {
  visible: boolean;
  isCorrect: boolean;
  explanation: string;
};

export type QuizProgress = {
  currentQuestionIndex: number;
  totalQuestions: number;
};

export type QuizResult = {
  lessonId: QuizLessonId;
  totalQuestions: number;
  correctAnswers: number;

  /**
   * Runtime Date object.
   * When persisting (SR / storage), convert to ISO string and rehydrate.
   */
  answeredAt: Date;
};
