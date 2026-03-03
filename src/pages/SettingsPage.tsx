import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '@/context/GameContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { GameConfig } from '@/types/game';
import { Play } from 'lucide-react';

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
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
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

  // Count available questions matching current filters
  const availableCount = questions.filter(q => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(q.category)) return false;
    if (selectedDifficulties.length > 0 && q.difficulty && !selectedDifficulties.includes(q.difficulty)) return false;
    return true;
  }).length;

  return (
    <div className="space-y-5 py-2">
      {/* Question count */}
      <Card className="shadow border-0 ring-1 ring-border">
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Number of Questions
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-primary">{questionCount}</span>
              <span className="text-sm text-muted-foreground">{availableCount.toLocaleString()} available</span>
            </div>
            <Slider
              value={[questionCount]}
              onValueChange={([v]) => setQuestionCount(v)}
              min={5}
              max={50}
              step={5}
              className="py-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Difficulty filter */}
      <Card className="shadow border-0 ring-1 ring-border">
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Difficulty
          </h3>
          <ToggleGroup
            type="multiple"
            value={selectedDifficulties}
            onValueChange={setSelectedDifficulties}
            className="justify-start"
          >
            <ToggleGroupItem value="easy" className="min-h-[48px] px-5 data-[state=on]:bg-green-100 data-[state=on]:text-green-800">
              Easy
            </ToggleGroupItem>
            <ToggleGroupItem value="medium" className="min-h-[48px] px-5 data-[state=on]:bg-yellow-100 data-[state=on]:text-yellow-800">
              Medium
            </ToggleGroupItem>
            <ToggleGroupItem value="hard" className="min-h-[48px] px-5 data-[state=on]:bg-red-100 data-[state=on]:text-red-800">
              Hard
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="text-xs text-muted-foreground">Leave all unselected for any difficulty.</p>
        </CardContent>
      </Card>

      {/* Category filter */}
      <Card className="shadow border-0 ring-1 ring-border">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Categories
            </h3>
            {selectedCategories.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategories([])}
                className="text-xs h-7"
              >
                Clear all
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Leave all unselected for all categories.</p>
          <Separator />
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {categories.map(cat => (
              <label
                key={cat.name}
                className="flex items-center gap-3 min-h-[44px] cursor-pointer hover:bg-muted/50 rounded-lg px-2 -mx-2"
              >
                <Checkbox
                  checked={selectedCategories.includes(cat.name)}
                  onCheckedChange={() => toggleCategory(cat.name)}
                />
                <span className="text-sm flex-1">{cat.name}</span>
                <span className="text-xs text-muted-foreground">{cat.count}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Start button */}
      <Button
        onClick={handleStartCustomGame}
        disabled={availableCount < questionCount}
        className="w-full h-14 text-lg font-semibold gap-2 shadow-lg"
      >
        <Play className="h-5 w-5" />
        Start Custom Game
      </Button>
    </div>
  );
}
