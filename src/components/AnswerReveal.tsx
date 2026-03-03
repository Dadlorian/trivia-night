import type { Question } from '@/types/question';
import type { UserAnswer } from '@/types/game';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnswerRevealProps {
  question: Question;
  userAnswer: UserAnswer;
  onNext: () => void;
  onOverride: () => void;
  isLast: boolean;
}

export function AnswerReveal({ question, userAnswer, onNext, onOverride, isLast }: AnswerRevealProps) {
  return (
    <Card className={cn(
      'shadow-lg border-0 ring-2 transition-all',
      userAnswer.isCorrect ? 'ring-success' : 'ring-destructive'
    )}>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          {userAnswer.isCorrect ? (
            <CheckCircle className="h-8 w-8 text-success shrink-0" />
          ) : (
            <XCircle className="h-8 w-8 text-destructive shrink-0" />
          )}
          <div>
            <p className={cn(
              'text-lg font-bold',
              userAnswer.isCorrect ? 'text-success' : 'text-destructive'
            )}>
              {userAnswer.isCorrect ? 'Correct!' : 'Incorrect'}
            </p>
            {!userAnswer.isCorrect && (
              <p className="text-sm text-muted-foreground">
                Your answer: {userAnswer.givenAnswer}
              </p>
            )}
          </div>
        </div>

        <div className="bg-secondary/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Correct answer:</p>
          <p className="text-base font-semibold">{question.correct_answer}</p>
        </div>

        {/* Source attribution */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <ExternalLink className="h-3 w-3 mt-0.5 shrink-0" />
          <div>
            <span>Source: {question.source.name}</span>
            {question.source.license && (
              <span className="ml-1">({question.source.license})</span>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          {/* Override button for free-response */}
          {question.type === 'free_response' && !userAnswer.isCorrect && !userAnswer.overridden && (
            <Button
              variant="outline"
              onClick={onOverride}
              className="flex-1 h-12 text-base"
            >
              I Was Right
            </Button>
          )}

          <Button
            onClick={onNext}
            className="flex-1 h-12 text-base font-semibold"
          >
            {isLast ? 'See Results' : 'Next Question'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
