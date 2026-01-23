/**
 * Quiz Types and Interfaces
 * 
 * This file contains all TypeScript type definitions for the quiz feature.
 * No React imports, AsyncStorage, or business logic - types only.
 */

/**
 * Represents a single quiz question
 */
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

/**
 * Represents a complete quiz
 */
export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  timeLimit?: number; // Time limit in seconds
  passingScore?: number; // Percentage required to pass (0-100)
  category?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a user's answer to a question
 */
export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number; // Index of the selected option
  isCorrect: boolean;
  timeSpent?: number; // Time spent on this question in seconds
}

/**
 * Represents a user's quiz attempt/result
 */
export interface QuizResult {
  id: string;
  quizId: string;
  userId?: string;
  answers: QuizAnswer[];
  score: number; // Percentage score (0-100)
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // Total time spent in seconds
  passed: boolean;
  completedAt: string;
}

/**
 * Represents the current state of an ongoing quiz
 */
export interface QuizState {
  quiz: Quiz;
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  startTime: number; // Timestamp when quiz started
  isPaused: boolean;
  timeElapsed: number; // Time elapsed in seconds
}

/**
 * Quiz statistics for analytics
 */
export interface QuizStatistics {
  quizId: string;
  totalAttempts: number;
  averageScore: number;
  averageTimeSpent: number;
  passRate: number; // Percentage of users who passed
  questionStats: QuestionStatistics[];
}

/**
 * Statistics for individual questions
 */
export interface QuestionStatistics {
  questionId: string;
  totalAttempts: number;
  correctAttempts: number;
  correctRate: number; // Percentage of correct answers
  averageTimeSpent: number;
}

/**
 * Quiz filter options
 */
export interface QuizFilters {
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  searchTerm?: string;
  sortBy?: 'title' | 'createdAt' | 'difficulty';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Quiz progress tracking
 */
export interface QuizProgress {
  quizId: string;
  userId?: string;
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  lastUpdated: string;
  isCompleted: boolean;
}
