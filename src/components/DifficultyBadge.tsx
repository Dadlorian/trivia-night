import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const difficultyStyles = {
  easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  hard: 'bg-red-50 text-red-700 border-red-200',
};

export function DifficultyBadge({ difficulty }: { difficulty: 'easy' | 'medium' | 'hard' | null }) {
  if (!difficulty) return null;

  return (
    <Badge
      variant="outline"
      className={cn('text-[11px] font-medium px-2 py-0.5 capitalize border', difficultyStyles[difficulty])}
    >
      {difficulty}
    </Badge>
  );
}
