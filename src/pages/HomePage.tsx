import { useNavigate } from 'react-router-dom';
import { Zap, SlidersHorizontal, Compass } from 'lucide-react';
import { useGameContext } from '@/context/GameContext';
import { GameModeCard } from '@/components/GameModeCard';
import { DEFAULT_CONFIG } from '@/types/game';

export function HomePage() {
  const navigate = useNavigate();
  const { questions, stats, loading, error, startGame } = useGameContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <p className="text-destructive font-medium">Failed to load questions</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="text-sm text-muted-foreground">
            Run <code className="bg-muted px-2 py-1 rounded">npm run pipeline</code> first.
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
    <div className="space-y-6 py-2">
      {/* Stats banner */}
      {stats && (
        <div className="bg-primary/5 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">{stats.total.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">
            questions across {Object.keys(stats.byCategory).length} categories
          </p>
        </div>
      )}

      {/* Game modes */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Choose a Game Mode
        </h2>

        <GameModeCard
          title="Quick Play"
          description="10 random questions from all categories. Jump right in."
          icon={Zap}
          onClick={handleQuickPlay}
        />

        <GameModeCard
          title="Custom Game"
          description="Choose your categories, difficulty, and question count."
          icon={SlidersHorizontal}
          onClick={handleCustom}
        />

        <GameModeCard
          title="Scouter Special"
          description="15 questions weighted toward Scouting, history, nature, and curated picks."
          icon={Compass}
          onClick={handleScouter}
          accent
        />
      </div>
    </div>
  );
}
