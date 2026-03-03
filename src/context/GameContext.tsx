import { createContext, useContext, type ReactNode } from 'react';
import { useGame } from '@/hooks/useGame';
import { useQuestions } from '@/hooks/useQuestions';
import type { Question, CategoryInfo, Stats } from '@/types/question';
import type { GameState, GameConfig } from '@/types/game';

interface GameContextValue {
  // Question data
  questions: Question[];
  categories: CategoryInfo[];
  stats: Stats | null;
  loading: boolean;
  error: string | null;

  // Game state
  gameState: GameState;
  startGame: (allQuestions: Question[], config: GameConfig) => void;
  submitAnswer: (answer: string, timeSpentMs: number) => void;
  overrideCorrect: () => void;
  nextQuestion: () => void;
  reset: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const { questions, categories, stats, loading, error } = useQuestions();
  const { state: gameState, startGame, submitAnswer, overrideCorrect, nextQuestion, reset } = useGame();

  return (
    <GameContext.Provider
      value={{
        questions,
        categories,
        stats,
        loading,
        error,
        gameState,
        startGame,
        submitAnswer,
        overrideCorrect,
        nextQuestion,
        reset,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}
