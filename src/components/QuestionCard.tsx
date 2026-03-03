import { useState, useRef } from 'react';
import type { Question } from '@/types/question';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryBadge } from './CategoryBadge';
import { DifficultyBadge } from './DifficultyBadge';
import { cn } from '@/lib/utils';

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

  // Build shuffled answer options for multiple choice
  const options = question.type === 'true_false'
    ? ['True', 'False']
    : question.type === 'multiple_choice'
      ? shuffleAnswers(question.correct_answer, question.incorrect_answers, question.id)
      : [];

  return (
    <Card className="shadow-lg border-0 ring-1 ring-border">
      <CardContent className="p-5 space-y-5">
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryBadge category={question.category} />
          <DifficultyBadge difficulty={question.difficulty} />
        </div>

        <p className="text-lg font-medium leading-relaxed">
          {question.question}
        </p>

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
              className="text-base h-12"
              autoFocus
            />
            <Button
              onClick={handleFreeResponseSubmit}
              disabled={disabled || !freeResponse.trim()}
              className="w-full h-12 text-base font-semibold"
            >
              Submit Answer
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {options.map((option, idx) => (
              <Button
                key={idx}
                variant="outline"
                onClick={() => handleMultipleChoiceSubmit(option)}
                disabled={disabled}
                className={cn(
                  'h-auto min-h-[48px] px-4 py-3 text-left text-base font-normal whitespace-normal justify-start',
                  selectedAnswer === option && 'ring-2 ring-primary bg-primary/5'
                )}
              >
                <span className="font-semibold text-muted-foreground mr-3">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {option}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Deterministic shuffle using question ID as seed
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
