import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { calculatePercentage, getCategoryBreakdown } from '@/lib/scoring';
import { CategoryBadge } from '@/components/CategoryBadge';
import { Check, X, RotateCcw, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ResultsPage() {
  const navigate = useNavigate();
  const { gameState, questions: allQuestions, reset, startGame } = useGameContext();

  const { answers, score, questions: gameQuestions, config } = gameState;

  if (answers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-[13px] text-muted-foreground">No results yet.</p>
        <Button variant="outline" onClick={() => navigate('/')} className="rounded-xl h-10 text-[14px]">
          Go home
        </Button>
      </div>
    );
  }

  const percentage = calculatePercentage(answers);
  const questionMap = new Map(gameQuestions.map(q => [q.id, q.category]));
  const breakdown = getCategoryBreakdown(answers, questionMap);

  const handlePlayAgain = () => {
    startGame(allQuestions, config);
    navigate('/play');
  };

  const handleGoHome = () => {
    reset();
    navigate('/');
  };

  return (
    <div className="space-y-6">
      {/* Score hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center pt-4 pb-2"
      >
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-3">
          Final score
        </p>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="inline-flex items-baseline gap-1">
            <span className="text-6xl font-bold tracking-tight text-foreground">{score}</span>
            <span className="text-2xl font-medium text-muted-foreground">/{answers.length}</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className={cn(
            'inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-[13px] font-semibold',
            percentage >= 80 ? 'bg-success/10 text-success' :
            percentage >= 50 ? 'bg-amber-50 text-amber-700' :
            'bg-destructive/10 text-destructive'
          )}>
            {percentage}% correct
          </div>
        </motion.div>
      </motion.div>

      {/* Category breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="bg-card rounded-2xl border shadow-sm overflow-hidden"
      >
        <div className="px-5 pt-5 pb-3">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            By category
          </p>
        </div>
        <div className="px-5 pb-4 space-y-3">
          {Object.entries(breakdown)
            .sort((a, b) => b[1].total - a[1].total)
            .map(([category, { correct, total }]) => {
              const catPercent = Math.round((correct / total) * 100);
              return (
                <div key={category} className="flex items-center gap-3">
                  <CategoryBadge category={category} />
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className={cn(
                        'h-full rounded-full',
                        catPercent >= 80 ? 'bg-success' :
                        catPercent >= 50 ? 'bg-amber-400' :
                        'bg-destructive'
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${catPercent}%` }}
                      transition={{ delay: 0.4, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    />
                  </div>
                  <span className="text-[13px] font-medium text-muted-foreground tabular-nums w-8 text-right">
                    {correct}/{total}
                  </span>
                </div>
              );
            })}
        </div>
      </motion.div>

      {/* Answer review */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="bg-card rounded-2xl border shadow-sm overflow-hidden"
      >
        <div className="px-5 pt-5 pb-3">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            Review
          </p>
        </div>
        <div className="px-5 pb-5 space-y-0">
          {gameQuestions.map((q, i) => {
            const answer = answers[i];
            if (!answer) return null;
            return (
              <div key={q.id}>
                <div className="flex items-start gap-3 py-3">
                  <div className={cn(
                    'flex items-center justify-center h-5 w-5 rounded-full shrink-0 mt-0.5',
                    answer.isCorrect ? 'bg-success/10' : 'bg-destructive/10'
                  )}>
                    {answer.isCorrect ? (
                      <Check className="h-3 w-3 text-success" strokeWidth={3} />
                    ) : (
                      <X className="h-3 w-3 text-destructive" strokeWidth={3} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-[13px] leading-relaxed text-foreground">{q.question}</p>
                    {answer.isCorrect ? (
                      <p className="text-[12px] text-success font-medium">
                        {answer.givenAnswer}
                        {answer.overridden && (
                          <Badge variant="outline" className="ml-1.5 text-[10px] py-0 font-normal">overridden</Badge>
                        )}
                      </p>
                    ) : (
                      <div className="flex items-baseline gap-1.5 text-[12px] flex-wrap">
                        <span className="text-destructive line-through break-all">{answer.givenAnswer}</span>
                        <span className="text-muted-foreground">&rarr;</span>
                        <span className="text-success font-medium break-words">{q.correct_answer}</span>
                      </div>
                    )}
                  </div>
                </div>
                {i < gameQuestions.length - 1 && <Separator />}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="flex gap-3 pb-4"
      >
        <Button
          variant="outline"
          onClick={handleGoHome}
          className="flex-1 min-h-[48px] rounded-xl text-[14px] font-medium gap-2"
        >
          <Home className="h-4 w-4" />
          Home
        </Button>
        <Button
          onClick={handlePlayAgain}
          className="flex-1 min-h-[48px] rounded-xl text-[14px] font-semibold gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Play again
        </Button>
      </motion.div>
    </div>
  );
}
