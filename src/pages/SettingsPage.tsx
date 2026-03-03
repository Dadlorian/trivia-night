import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useGameContext } from '@/context/GameContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { GameConfig } from '@/types/game';
import { Play, Minus, Plus } from 'lucide-react';

export function SettingsPage() {
  const navigate = useNavigate();
  const { questions, categories, loading, startGame } = useGameContext();

  const [savedSettings, setSavedSettings] = useLocalStorage<Partial<GameConfig>>('trivia-settings', {});

  const [selectedCategories, setSelectedCategories] = useState<string[]>(savedSettings.categories || []);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(
    (savedSettings.difficulties || []) as string[]
  );
  const [questionCount, setQuestionCount] = useState(savedSettings.questionCount || 10);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const toggleCategory = (name: string) => {
    setSelectedCategories(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const handleStartCustomGame = () => {
    const config: GameConfig = {
      mode: 'custom',
      questionCount,
      categories: selectedCategories,
      difficulties: selectedDifficulties as GameConfig['difficulties'],
      includeTypes: ['multiple_choice', 'true_false', 'free_response'],
    };
    setSavedSettings(config);
    startGame(questions, config);
    navigate('/play');
  };

  const availableCount = questions.filter(q => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(q.category)) return false;
    if (selectedDifficulties.length > 0 && q.difficulty && !selectedDifficulties.includes(q.difficulty)) return false;
    return true;
  }).length;

  return (
    <div className="space-y-6">
      {/* Question count */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-card rounded-2xl border shadow-sm overflow-hidden"
      >
        <div className="px-5 pt-5 pb-3">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            Questions
          </p>
        </div>
        <div className="px-5 pb-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuestionCount(Math.max(5, questionCount - 5))}
                className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-secondary/80 active:scale-95 transition-all"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-3xl font-bold tracking-tight text-foreground tabular-nums w-10 text-center">
                {questionCount}
              </span>
              <button
                onClick={() => setQuestionCount(Math.min(50, questionCount + 5))}
                className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-secondary/80 active:scale-95 transition-all"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-[12px] text-muted-foreground font-medium">
              {availableCount.toLocaleString()} available
            </span>
          </div>
          <Slider
            value={[questionCount]}
            onValueChange={([v]) => setQuestionCount(v)}
            min={5}
            max={50}
            step={5}
          />
        </div>
      </motion.div>

      {/* Difficulty */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="bg-card rounded-2xl border shadow-sm overflow-hidden"
      >
        <div className="px-5 pt-5 pb-3">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            Difficulty
          </p>
        </div>
        <div className="px-5 pb-5 space-y-3">
          <ToggleGroup
            type="multiple"
            value={selectedDifficulties}
            onValueChange={setSelectedDifficulties}
            className="justify-start gap-2"
          >
            <ToggleGroupItem
              value="easy"
              className="h-9 px-4 rounded-lg text-[13px] font-medium data-[state=on]:bg-emerald-50 data-[state=on]:text-emerald-700 data-[state=on]:border-emerald-200"
            >
              Easy
            </ToggleGroupItem>
            <ToggleGroupItem
              value="medium"
              className="h-9 px-4 rounded-lg text-[13px] font-medium data-[state=on]:bg-amber-50 data-[state=on]:text-amber-700 data-[state=on]:border-amber-200"
            >
              Medium
            </ToggleGroupItem>
            <ToggleGroupItem
              value="hard"
              className="h-9 px-4 rounded-lg text-[13px] font-medium data-[state=on]:bg-red-50 data-[state=on]:text-red-700 data-[state=on]:border-red-200"
            >
              Hard
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="text-[11px] text-muted-foreground">
            No selection includes all difficulties.
          </p>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="bg-card rounded-2xl border shadow-sm overflow-hidden"
      >
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            Categories
          </p>
          {selectedCategories.length > 0 && (
            <button
              onClick={() => setSelectedCategories([])}
              className="text-[11px] text-primary font-medium hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="px-5 pb-2">
          <p className="text-[11px] text-muted-foreground mb-3">
            No selection includes all categories.
          </p>
          <Separator />
        </div>
        <div className="px-5 pb-5 max-h-[320px] overflow-y-auto space-y-0.5">
          {categories.map(cat => (
            <label
              key={cat.name}
              className="flex items-center gap-3 min-h-[44px] cursor-pointer hover:bg-secondary/40 rounded-xl px-2 -mx-2 transition-colors"
            >
              <Checkbox
                checked={selectedCategories.includes(cat.name)}
                onCheckedChange={() => toggleCategory(cat.name)}
                className="h-4 w-4"
              />
              <span className="text-[14px] flex-1 text-foreground">{cat.name}</span>
              <span className="text-[12px] text-muted-foreground tabular-nums">{cat.count}</span>
            </label>
          ))}
        </div>
      </motion.div>

      {/* Start */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="pb-4"
      >
        <Button
          onClick={handleStartCustomGame}
          disabled={availableCount < questionCount}
          className="w-full min-h-[48px] h-12 rounded-xl text-[15px] font-semibold gap-2 shadow-md"
        >
          <Play className="h-4 w-4" />
          Start game
        </Button>
      </motion.div>
    </div>
  );
}
