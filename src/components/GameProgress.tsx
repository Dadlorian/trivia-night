import { motion } from 'motion/react';

interface GameProgressProps {
  current: number;
  total: number;
  score: number;
}

export function GameProgress({ current, total, score }: GameProgressProps) {
  const progressPercent = total > 0 ? ((current) / total) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-foreground">{current + 1}</span>
          <span className="text-sm text-muted-foreground font-medium">/ {total}</span>
        </div>
        <div className="flex items-center gap-2 bg-secondary rounded-full px-3 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-success" />
          <span className="text-sm font-semibold text-secondary-foreground">{score} correct</span>
        </div>
      </div>
      <div className="h-1 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>
    </div>
  );
}
