import { useState, useEffect } from 'react';
import type { Question, CategoryInfo, Stats } from '@/types/question';
import { loadQuestions, loadCategories, loadStats } from '@/lib/question-loader';

interface UseQuestionsResult {
  questions: Question[];
  categories: CategoryInfo[];
  stats: Stats | null;
  loading: boolean;
  error: string | null;
}

export function useQuestions(): UseQuestionsResult {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [q, c, s] = await Promise.all([
          loadQuestions(),
          loadCategories(),
          loadStats(),
        ]);
        if (!cancelled) {
          setQuestions(q);
          setCategories(c);
          setStats(s);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load questions');
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { questions, categories, stats, loading, error };
}
