import { motion } from 'motion/react';
import { useGameContext } from '@/context/GameContext';
import { Separator } from '@/components/ui/separator';
import { ExternalLink } from 'lucide-react';

const sources = [
  {
    name: 'Open Trivia Database',
    url: 'https://opentdb.com/',
    license: 'CC BY-SA 4.0',
    description: 'Community-contributed trivia database with thousands of verified questions.',
  },
  {
    name: 'The Trivia API',
    url: 'https://the-trivia-api.com/',
    license: 'Free for non-commercial use',
    description: 'Curated trivia API spanning dozens of categories and difficulty levels.',
  },
  {
    name: 'OpenTriviaQA',
    url: 'https://github.com/uberspot/OpenTriviaQA',
    license: 'CC BY-SA 4.0',
    description: 'Open-source dataset parsed from structured category files.',
  },
  {
    name: 'Curated Collection',
    url: '',
    license: 'Fair use',
    description: 'Hand-selected behavioral, Scouting, and cultural questions from 2025-2026 trivia archives.',
  },
];

export function AboutPage() {
  const { stats } = useGameContext();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center pt-2"
      >
        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-3">
          <span className="text-primary-foreground text-lg font-bold">TN</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Trivia Night</h1>
        <p className="text-[13px] text-muted-foreground mt-1 max-w-xs mx-auto leading-relaxed">
          A trivia experience built for Scouters and knowledge enthusiasts.
        </p>
      </motion.div>

      {/* Stats */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
          className="grid grid-cols-3 gap-2"
        >
          <div className="bg-card rounded-2xl border shadow-sm px-2 py-3 text-center">
            <p className="text-lg font-bold text-foreground">{stats.total.toLocaleString()}</p>
            <p className="text-[11px] text-muted-foreground font-medium">Questions</p>
          </div>
          <div className="bg-card rounded-2xl border shadow-sm px-2 py-3 text-center">
            <p className="text-lg font-bold text-foreground">{Object.keys(stats.byCategory).length}</p>
            <p className="text-[11px] text-muted-foreground font-medium">Categories</p>
          </div>
          <div className="bg-card rounded-2xl border shadow-sm px-2 py-3 text-center">
            <p className="text-lg font-bold text-foreground">{Object.keys(stats.bySource).length}</p>
            <p className="text-[11px] text-muted-foreground font-medium">Sources</p>
          </div>
        </motion.div>
      )}

      {/* Sources */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="bg-card rounded-2xl border shadow-sm overflow-hidden"
      >
        <div className="px-5 pt-5 pb-3">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            Data sources
          </p>
        </div>
        <div className="px-5 pb-5 space-y-4">
          {sources.map((source, i) => (
            <div key={source.name}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-medium text-foreground">{source.name}</p>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{source.description}</p>
                <p className="text-[11px] font-medium text-muted-foreground/80">{source.license}</p>
              </div>
              {i < sources.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Breakdown */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="bg-card rounded-2xl border shadow-sm overflow-hidden"
        >
          <div className="px-5 pt-5 pb-3">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Questions by source
            </p>
          </div>
          <div className="px-5 pb-5 space-y-2.5">
            {Object.entries(stats.bySource)
              .sort((a, b) => b[1] - a[1])
              .map(([name, count]) => {
                const pct = Math.round((count / stats.total) * 100);
                return (
                  <div key={name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-foreground">{name}</span>
                      <span className="text-muted-foreground tabular-nums font-medium">
                        {count.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary/40 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.3, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}

      <p className="text-center text-[11px] text-muted-foreground/60 pb-4">
        Built with React, Tailwind CSS, and shadcn/ui
      </p>
    </div>
  );
}
