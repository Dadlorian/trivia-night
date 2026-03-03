import { Progress } from '@/components/ui/progress';

interface GameProgressProps {
  current: number;
  total: number;
  score: number;
}

export function GameProgress({ current, total, score }: GameProgressProps) {
  const progressPercent = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Question <span className="font-semibold text-foreground">{current + 1}</span> of {total}
        </span>
        <span className="text-muted-foreground">
          Score: <span className="font-semibold text-foreground">{score}</span>
        </span>
      </div>
      <Progress value={progressPercent} className="h-2" />
    </div>
  );
}
