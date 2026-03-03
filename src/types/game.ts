import type { Question } from './question';

export type GamePhase = 'idle' | 'playing' | 'answered' | 'finished';

export type GameMode = 'quick' | 'custom' | 'scouter';

export interface GameConfig {
  mode: GameMode;
  questionCount: number;
  categories: string[];
  difficulties: ('easy' | 'medium' | 'hard')[];
  includeTypes: ('multiple_choice' | 'true_false' | 'free_response')[];
}

export interface UserAnswer {
  questionId: string;
  givenAnswer: string;
  isCorrect: boolean;
  overridden: boolean;
  timeSpentMs: number;
}

export interface GameState {
  phase: GamePhase;
  config: GameConfig;
  questions: Question[];
  currentIndex: number;
  answers: UserAnswer[];
  score: number;
  startedAt: number | null;
}

export const DEFAULT_CONFIG: GameConfig = {
  mode: 'quick',
  questionCount: 10,
  categories: [],
  difficulties: [],
  includeTypes: ['multiple_choice', 'true_false', 'free_response'],
};
