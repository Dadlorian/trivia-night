import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import type { Question } from '@/types/question';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryBadge } from './CategoryBadge';
import { DifficultyBadge } from './DifficultyBadge';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onSubmit: (answer: string, timeSpentMs: number) => void;
  disabled: boolean;
}

export function QuestionCard({ question, onSubmit, disabled }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [freeResponse, setFreeResponse] = useState('');
  const startTimeRef = useRef(Date.now());

  const handleMultipleChoiceSubmit = (answer: string) => {
    if (disabled) return;
    setSelectedAnswer(answer);
    const elapsed = Date.now() - startTimeRef.current;
    onSubmit(answer, elapsed);
  };

  const handleFreeResponseSubmit = () => {
    if (disabled || !freeResponse.trim()) return;
    const elapsed = Date.now() - startTimeRef.current;
    onSubmit(freeResponse.trim(), elapsed);
  };

  const options = question.type === 'true_false'
    ? ['True', 'False']
    : question.type === 'multiple_choice'
      ? shuffleAnswers(question.correct_answer, question.incorrect_answers, question.id)
      : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
        {/* Badges */}
        <div className="px-5 pt-5 pb-0 flex items-center gap-2 flex-wrap">
          <CategoryBadge category={question.category} />
          <DifficultyBadge difficulty={question.difficulty} />
        </div>

        {/* Question text */}
        <div className="px-5 pt-4 pb-5">
          <p className="text-base sm:text-[17px] leading-[1.6] font-medium text-foreground tracking-[-0.01em]">
            {question.question}
          </p>
        </div>

        {/* Divider */}
        <div className="mx-5 border-t" />

        {/* Answers */}
        <div className="p-5">
          {question.type === 'free_response' ? (
            <div className="space-y-3">
              <Input
                placeholder="Type your answer..."
                value={freeResponse}
                onChange={(e) => setFreeResponse(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleFreeResponseSubmit();
                }}
                disabled={disabled}
                className="h-12 text-base bg-secondary/50 border-0 rounded-xl px-4 placeholder:text-muted-foreground/60"
                autoFocus
              />
              <Button
                onClick={handleFreeResponseSubmit}
                disabled={disabled || !freeResponse.trim()}
                className="w-full h-12 rounded-xl text-base font-semibold gap-2"
              >
                Submit
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="grid gap-2.5">
              {options.map((option, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.2 }}
                >
                  <button
                    onClick={() => handleMultipleChoiceSubmit(option)}
                    disabled={disabled}
                    className={cn(
                      'w-full flex items-start gap-3 px-4 py-3 min-h-[48px] rounded-xl text-left transition-all',
                      'border bg-card hover:bg-secondary/60 active:scale-[0.98]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      selectedAnswer === option && 'ring-2 ring-primary bg-primary/[0.04]',
                      disabled && 'pointer-events-none'
                    )}
                  >
                    <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-secondary text-xs font-semibold text-secondary-foreground shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-[15px] leading-relaxed break-words min-w-0">{option}</span>
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function shuffleAnswers(correct: string, incorrect: string[], seed: string): string[] {
  const all = [correct, ...incorrect];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  for (let i = all.length - 1; i > 0; i--) {
    hash = ((hash << 5) - hash + i) | 0;
    const j = Math.abs(hash) % (i + 1);
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}
