import { useNavigate } from 'react-router-dom';
import { useGameContext } from '@/context/GameContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { calculatePercentage, getCategoryBreakdown } from '@/lib/scoring';
import { CategoryBadge } from '@/components/CategoryBadge';
import { CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ResultsPage() {
  const navigate = useNavigate();
  const { gameState, questions: allQuestions, reset, startGame } = useGameContext();

  const { answers, score, questions: gameQuestions, config } = gameState;

  if (answers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">No game results to show.</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  const percentage = calculatePercentage(answers);
  const questionMap = new Map(gameQuestions.map(q => [q.id, q.category]));
  const breakdown = getCategoryBreakdown(answers, questionMap);

  const getGrade = () => {
    if (percentage >= 90) return { text: 'Outstanding!', color: 'text-success' };
    if (percentage >= 70) return { text: 'Great Job!', color: 'text-primary' };
    if (percentage >= 50) return { text: 'Not Bad!', color: 'text-accent-foreground' };
    return { text: 'Keep Trying!', color: 'text-muted-foreground' };
  };

  const grade = getGrade();

  const handlePlayAgain = () => {
    startGame(allQuestions, config);
    navigate('/play');
  };

  const handleGoHome = () => {
    reset();
    navigate('/');
  };

  return (
    <div className="space-y-5 py-2">
      {/* Score card */}
      <Card className="shadow-lg border-0 ring-1 ring-border">
        <CardContent className="p-6 text-center space-y-3">
          <p className={cn('text-2xl font-bold', grade.color)}>{grade.text}</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-bold text-primary">{score}</span>
            <span className="text-2xl text-muted-foreground">/ {answers.length}</span>
          </div>
          <p className="text-lg text-muted-foreground">{percentage}% correct</p>
        </CardContent>
      </Card>

      {/* Category breakdown */}
      <Card className="shadow border-0 ring-1 ring-border">
        <CardContent className="p-5 space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            By Category
          </h3>
          <div className="space-y-2">
            {Object.entries(breakdown)
              .sort((a, b) => b[1].total - a[1].total)
              .map(([category, { correct, total }]) => (
                <div key={category} className="flex items-center justify-between">
                  <CategoryBadge category={category} />
                  <span className="text-sm font-medium">
                    {correct}/{total}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Answer review */}
      <Card className="shadow border-0 ring-1 ring-border">
        <CardContent className="p-5 space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Answer Review
          </h3>
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-3">
              {gameQuestions.map((q, i) => {
                const answer = answers[i];
                if (!answer) return null;
                return (
                  <div key={q.id} className="space-y-1.5">
                    <div className="flex items-start gap-2">
                      {answer.isCorrect ? (
                        <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                      )}
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-sm leading-snug">{q.question}</p>
                        <p className="text-xs text-muted-foreground">
                          {answer.isCorrect ? (
                            <span className="text-success">
                              {answer.givenAnswer}
                              {answer.overridden && (
                                <Badge variant="outline" className="ml-1 text-[10px] py-0">overridden</Badge>
                              )}
                            </span>
                          ) : (
                            <>
                              <span className="text-destructive line-through">{answer.givenAnswer}</span>
                              <span className="ml-2 text-success">{q.correct_answer}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    {i < gameQuestions.length - 1 && <Separator />}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={handleGoHome} className="flex-1 h-12 gap-2">
          <Home className="h-4 w-4" />
          Home
        </Button>
        <Button onClick={handlePlayAgain} className="flex-1 h-12 gap-2">
          <RotateCcw className="h-4 w-4" />
          Play Again
        </Button>
      </div>
    </div>
  );
}
