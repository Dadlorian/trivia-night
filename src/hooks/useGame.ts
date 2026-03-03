import { useReducer, useCallback } from 'react';
import type { Question } from '@/types/question';
import type { GameState, GameConfig, UserAnswer } from '@/types/game';
import { DEFAULT_CONFIG } from '@/types/game';
import { selectQuestions, getScouterQuestions } from '@/lib/question-selector';
import { checkAnswer } from '@/lib/fuzzy-match';

type GameAction =
  | { type: 'START_GAME'; questions: Question[]; config: GameConfig }
  | { type: 'SUBMIT_ANSWER'; answer: string; timeSpentMs: number }
  | { type: 'OVERRIDE_CORRECT' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'RESET' };

const initialState: GameState = {
  phase: 'idle',
  config: DEFAULT_CONFIG,
  questions: [],
  currentIndex: 0,
  answers: [],
  score: 0,
  startedAt: null,
};

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        phase: 'playing',
        config: action.config,
        questions: action.questions,
        currentIndex: 0,
        answers: [],
        score: 0,
        startedAt: Date.now(),
      };

    case 'SUBMIT_ANSWER': {
      const currentQ = state.questions[state.currentIndex];
      const isMultipleChoice = currentQ.type === 'multiple_choice' || currentQ.type === 'true_false';
      const isCorrect = isMultipleChoice
        ? action.answer === currentQ.correct_answer
        : checkAnswer(action.answer, currentQ.correct_answer);

      const userAnswer: UserAnswer = {
        questionId: currentQ.id,
        givenAnswer: action.answer,
        isCorrect,
        overridden: false,
        timeSpentMs: action.timeSpentMs,
      };

      return {
        ...state,
        phase: 'answered',
        answers: [...state.answers, userAnswer],
        score: state.score + (isCorrect ? 1 : 0),
      };
    }

    case 'OVERRIDE_CORRECT': {
      const lastIdx = state.answers.length - 1;
      if (lastIdx < 0) return state;

      const updated = [...state.answers];
      if (!updated[lastIdx].isCorrect) {
        updated[lastIdx] = { ...updated[lastIdx], isCorrect: true, overridden: true };
        return { ...state, answers: updated, score: state.score + 1 };
      }
      return state;
    }

    case 'NEXT_QUESTION': {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.questions.length) {
        return { ...state, phase: 'finished' };
      }
      return { ...state, phase: 'playing', currentIndex: nextIndex };
    }

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startGame = useCallback((allQuestions: Question[], config: GameConfig) => {
    let selected: Question[];
    if (config.mode === 'scouter') {
      selected = getScouterQuestions(allQuestions, config.questionCount);
    } else {
      selected = selectQuestions(allQuestions, config);
    }
    dispatch({ type: 'START_GAME', questions: selected, config });
  }, []);

  const submitAnswer = useCallback((answer: string, timeSpentMs: number) => {
    dispatch({ type: 'SUBMIT_ANSWER', answer, timeSpentMs });
  }, []);

  const overrideCorrect = useCallback(() => {
    dispatch({ type: 'OVERRIDE_CORRECT' });
  }, []);

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    startGame,
    submitAnswer,
    overrideCorrect,
    nextQuestion,
    reset,
  };
}
