import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const difficultyStyles = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
};

export function DifficultyBadge({ difficulty }: { difficulty: 'easy' | 'medium' | 'hard' | null }) {
  if (!difficulty) return null;

  return (
    <Badge variant="secondary" className={cn('font-medium text-xs capitalize', difficultyStyles[difficulty])}>
      {difficulty}
    </Badge>
  );
}
