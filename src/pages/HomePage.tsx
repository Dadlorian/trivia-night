import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Zap, SlidersHorizontal, Compass, Database, Layers } from 'lucide-react';
import { useGameContext } from '@/context/GameContext';
import { GameModeCard } from '@/components/GameModeCard';
import { DEFAULT_CONFIG } from '@/types/game';

export function HomePage() {
  const navigate = useNavigate();
  const { questions, stats, loading, error, startGame } = useGameContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"
          />
          <p className="text-[13px] text-muted-foreground font-medium">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-3 max-w-xs">
          <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <Database className="h-5 w-5 text-destructive" />
          </div>
          <p className="text-[15px] font-semibold text-foreground">No question data found</p>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Run <code className="bg-secondary px-1.5 py-0.5 rounded text-[12px] font-mono">npm run pipeline</code> to
            build the question database.
          </p>
        </div>
      </div>
    );
  }

  const handleQuickPlay = () => {
    startGame(questions, { ...DEFAULT_CONFIG, mode: 'quick', questionCount: 10 });
    navigate('/play');
  };

  const handleCustom = () => {
    navigate('/settings');
  };

  const handleScouter = () => {
    startGame(questions, { ...DEFAULT_CONFIG, mode: 'scouter', questionCount: 15 });
    navigate('/play');
  };

  return (
    <div className="space-y-8">
      {/* Hero stats */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center pt-2"
        >
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-2">
            Ready to play
          </p>
          <p className="text-4xl font-bold tracking-tight text-foreground">
            {stats.total.toLocaleString()}
          </p>
          <p className="text-[13px] text-muted-foreground mt-1">
            questions across {Object.keys(stats.byCategory).length} categories
          </p>

          {/* Compact stat pills */}
          <div className="flex items-center justify-center gap-1.5 mt-4 flex-wrap">
            {Object.entries(stats.bySource)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([name, count]) => (
                <div
                  key={name}
                  className="flex items-center gap-1.5 bg-secondary rounded-full px-2.5 py-1"
                >
                  <Layers className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="text-[11px] font-medium text-secondary-foreground whitespace-nowrap">
                    {count.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Game modes */}
      <div className="space-y-2.5">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest px-1">
          Play
        </p>

        <GameModeCard
          title="Quick Play"
          description="10 random questions from all categories"
          icon={Zap}
          onClick={handleQuickPlay}
          index={0}
        />

        <GameModeCard
          title="Custom Game"
          description="Pick categories, difficulty, and count"
          icon={SlidersHorizontal}
          onClick={handleCustom}
          index={1}
        />

        <GameModeCard
          title="Scouter Special"
          description="15 questions weighted toward Scouting and history"
          icon={Compass}
          onClick={handleScouter}
          accent
          index={2}
        />
      </div>
    </div>
  );
}
