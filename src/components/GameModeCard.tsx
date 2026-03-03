import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameModeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  accent?: boolean;
}

export function GameModeCard({ title, description, icon: Icon, onClick, accent }: GameModeCardProps) {
  return (
    <Card className={cn(
      'shadow-md hover:shadow-lg transition-shadow cursor-pointer border-0 ring-1 ring-border',
      accent && 'ring-2 ring-accent'
    )}>
      <CardContent className="p-0">
        <Button
          variant="ghost"
          className="w-full h-auto p-5 flex items-start gap-4 justify-start text-left"
          onClick={onClick}
        >
          <div className={cn(
            'rounded-xl p-3 shrink-0',
            accent ? 'bg-accent/20' : 'bg-primary/10'
          )}>
            <Icon className={cn('h-6 w-6', accent ? 'text-accent-foreground' : 'text-primary')} />
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground font-normal leading-relaxed">{description}</p>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}
