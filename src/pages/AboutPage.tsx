import { useGameContext } from '@/context/GameContext';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink } from 'lucide-react';

const sources = [
  {
    name: 'Open Trivia Database (OpenTDB)',
    url: 'https://opentdb.com/',
    license: 'CC BY-SA 4.0',
    description: 'Community-contributed trivia database with ~5,000+ questions.',
  },
  {
    name: 'The Trivia API',
    url: 'https://the-trivia-api.com/',
    license: 'Free for non-commercial use',
    description: 'Curated trivia API with ~10,000+ questions across many categories.',
  },
  {
    name: 'OpenTriviaQA',
    url: 'https://github.com/uberspot/OpenTriviaQA',
    license: 'CC BY-SA 4.0',
    description: 'Open-source trivia dataset parsed from category text files.',
  },
  {
    name: 'Curated Questions',
    url: '',
    license: 'Fair use',
    description: 'Hand-selected behavioral, Scouting, and cultural questions from 2025-2026 trivia archives.',
  },
];

export function AboutPage() {
  const { stats } = useGameContext();

  return (
    <div className="space-y-5 py-2">
      <Card className="shadow border-0 ring-1 ring-border">
        <CardContent className="p-5 space-y-3">
          <h2 className="text-lg font-bold">Trivia Night</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A mobile-first trivia app built for Scouters and trivia enthusiasts.
            Questions span general knowledge, pop culture, history, science, Scouting
            lore, and more.
          </p>
          {stats && (
            <div className="bg-primary/5 rounded-lg p-3 text-sm">
              <p><span className="font-semibold">{stats.total.toLocaleString()}</span> total questions</p>
              <p><span className="font-semibold">{Object.keys(stats.byCategory).length}</span> categories</p>
              <p><span className="font-semibold">{Object.keys(stats.bySource).length}</span> data sources</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow border-0 ring-1 ring-border">
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Data Sources & Licenses
          </h3>
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-4">
              {sources.map((source, i) => (
                <div key={source.name}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{source.name}</p>
                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{source.description}</p>
                    <p className="text-xs font-medium">License: {source.license}</p>
                  </div>
                  {i < sources.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {stats && (
        <Card className="shadow border-0 ring-1 ring-border">
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Question Breakdown by Source
            </h3>
            <div className="space-y-2">
              {Object.entries(stats.bySource)
                .sort((a, b) => b[1] - a[1])
                .map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between text-sm">
                    <span>{name}</span>
                    <span className="font-medium text-muted-foreground">{count.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-center text-xs text-muted-foreground pb-4">
        Built with React, Tailwind CSS, and shadcn/ui
      </p>
    </div>
  );
}
