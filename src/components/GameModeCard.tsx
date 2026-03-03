import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameModeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  accent?: boolean;
  index?: number;
}

export function GameModeCard({ title, description, icon: Icon, onClick, accent, index = 0 }: GameModeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <button
        onClick={onClick}
        className={cn(
          'w-full group flex items-center gap-3.5 p-4 rounded-2xl text-left transition-all',
          'bg-card border shadow-sm min-h-[72px]',
          'hover:shadow-md hover:border-border/80 active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          accent && 'border-accent/20 bg-accent/[0.03]'
        )}
      >
        <div className={cn(
          'flex items-center justify-center h-10 w-10 rounded-xl shrink-0',
          accent ? 'bg-accent/10 text-accent' : 'bg-primary/[0.06] text-primary'
        )}>
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-foreground tracking-[-0.01em]">{title}</p>
          <p className="text-[13px] text-muted-foreground leading-snug mt-0.5">{description}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0 hidden sm:block" />
      </button>
    </motion.div>
  );
}
