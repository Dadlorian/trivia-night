import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="space-y-5 py-2">
      <GameProgress
        current={gameState.currentIndex}
        total={gameState.questions.length}
        score={gameState.score}
      />

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
          question={currentQuestion}
          userAnswer={currentAnswer}
          onNext={nextQuestion}
          onOverride={overrideCorrect}
          isLast={gameState.currentIndex === gameState.questions.length - 1}
        />
      )}
    </div>
  );
}
