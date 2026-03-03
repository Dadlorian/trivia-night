import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useGameContext } from '@/context/GameContext';
import { GameProgress } from '@/components/GameProgress';
import { QuestionCard } from '@/components/QuestionCard';
import { AnswerReveal } from '@/components/AnswerReveal';

export function PlayPage() {
  const navigate = useNavigate();
  const { gameState, submitAnswer, overrideCorrect, nextQuestion } = useGameContext();

  useEffect(() => {
    if (gameState.phase === 'idle') {
      navigate('/');
    } else if (gameState.phase === 'finished') {
      navigate('/results');
    }
  }, [gameState.phase, navigate]);

  if (gameState.phase === 'idle' || gameState.phase === 'finished') {
    return null;
  }

  const currentQuestion = gameState.questions[gameState.currentIndex];
  const currentAnswer = gameState.phase === 'answered'
    ? gameState.answers[gameState.answers.length - 1]
    : null;

  return (
    <div className="space-y-6">
      <GameProgress
        current={gameState.currentIndex}
        total={gameState.questions.length}
        score={gameState.score}
      />

      <AnimatePresence mode="wait">
        {gameState.phase === 'playing' && (
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            onSubmit={submitAnswer}
            disabled={false}
          />
        )}

        {gameState.phase === 'answered' && currentAnswer && (
          <AnswerReveal
            key={`${currentQuestion.id}-answer`}
            question={currentQuestion}
            userAnswer={currentAnswer}
            onNext={nextQuestion}
            onOverride={overrideCorrect}
            isLast={gameState.currentIndex === gameState.questions.length - 1}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
