import { motion } from 'motion/react';
import type { Question } from '@/types/question';
import type { UserAnswer } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowRight, ThumbsUp, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnswerRevealProps {
  question: Question;
  userAnswer: UserAnswer;
  onNext: () => void;
  onOverride: () => void;
  isLast: boolean;
}

export function AnswerReveal({ question, userAnswer, onNext, onOverride, isLast }: AnswerRevealProps) {
  const isCorrect = userAnswer.isCorrect;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className={cn(
        'bg-card rounded-2xl border shadow-sm overflow-hidden',
        isCorrect ? 'border-success/30' : 'border-destructive/30'
      )}>
        {/* Status header */}
        <div className={cn(
          'px-5 py-4 flex items-center gap-3',
          isCorrect ? 'bg-success/[0.06]' : 'bg-destructive/[0.06]'
        )}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25, delay: 0.1 }}
          >
            <div className={cn(
              'h-10 w-10 rounded-full flex items-center justify-center',
              isCorrect ? 'bg-success' : 'bg-destructive'
            )}>
              {isCorrect ? (
                <Check className="h-5 w-5 text-white" strokeWidth={3} />
              ) : (
                <X className="h-5 w-5 text-white" strokeWidth={3} />
              )}
            </div>
          </motion.div>
          <div>
            <p className={cn(
              'text-[15px] font-semibold',
              isCorrect ? 'text-success' : 'text-destructive'
            )}>
              {isCorrect ? 'Correct' : 'Incorrect'}
            </p>
            {!isCorrect && (
              <p className="text-[13px] text-muted-foreground mt-0.5 truncate max-w-[200px] sm:max-w-none">
                You answered: {userAnswer.givenAnswer}
              </p>
            )}
          </div>
        </div>

        {/* Correct answer */}
        <div className="px-5 py-4">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
            Correct answer
          </p>
          <p className="text-[15px] font-semibold text-foreground">{question.correct_answer}</p>
        </div>

        {/* Source */}
        <div className="mx-5 border-t" />
        <div className="px-5 py-3 flex items-center gap-2">
          <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
          <p className="text-[11px] text-muted-foreground truncate">
            {question.source.name}
            {question.source.license && (
              <span className="text-muted-foreground/60"> &middot; {question.source.license}</span>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="px-4 pb-4 pt-2 flex gap-2.5">
          {question.type === 'free_response' && !isCorrect && !userAnswer.overridden && (
            <Button
              variant="outline"
              onClick={onOverride}
              className="flex-1 h-12 rounded-xl text-[14px] font-medium gap-2"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              I was right
            </Button>
          )}
          <Button
            onClick={onNext}
            className={cn(
              'h-12 rounded-xl text-[14px] font-semibold gap-2',
              question.type === 'free_response' && !isCorrect && !userAnswer.overridden ? 'flex-1' : 'w-full'
            )}
          >
            {isLast ? 'See results' : 'Continue'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
