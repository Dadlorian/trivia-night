import type { Question, CategoryInfo, Stats } from '@/types/question';

let cachedQuestions: Question[] | null = null;
let cachedCategories: CategoryInfo[] | null = null;
let cachedStats: Stats | null = null;

export async function loadQuestions(): Promise<Question[]> {
  if (cachedQuestions) return cachedQuestions;

  const res = await fetch('/data/questions.json');
  if (!res.ok) throw new Error(`Failed to load questions: ${res.status}`);
  cachedQuestions = await res.json();
  return cachedQuestions!;
}

export async function loadCategories(): Promise<CategoryInfo[]> {
  if (cachedCategories) return cachedCategories;

  const res = await fetch('/data/categories.json');
  if (!res.ok) throw new Error(`Failed to load categories: ${res.status}`);
  cachedCategories = await res.json();
  return cachedCategories!;
}

export async function loadStats(): Promise<Stats> {
  if (cachedStats) return cachedStats;

  const res = await fetch('/data/stats.json');
  if (!res.ok) throw new Error(`Failed to load stats: ${res.status}`);
  cachedStats = await res.json();
  return cachedStats!;
}
