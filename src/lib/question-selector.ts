import type { Question } from '@/types/question';
import type { GameConfig } from '@/types/game';

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function selectQuestions(questions: Question[], config: GameConfig): Question[] {
  let filtered = questions;

  if (config.categories.length > 0) {
    filtered = filtered.filter(q => config.categories.includes(q.category));
  }

  if (config.difficulties.length > 0) {
    filtered = filtered.filter(q => q.difficulty !== null && config.difficulties.includes(q.difficulty));
  }

  if (config.includeTypes.length > 0) {
    filtered = filtered.filter(q => config.includeTypes.includes(q.type));
  }

  const shuffled = fisherYatesShuffle(filtered);
  return shuffled.slice(0, config.questionCount);
}

export function getScouterQuestions(questions: Question[], count: number): Question[] {
  // Scouter Special: prioritize scouting, history, nature, and curated questions
  const scouterCategories = ['Scouting', 'History', 'Science & Nature', 'Geography'];
  const priority = questions.filter(q =>
    scouterCategories.includes(q.category) ||
    q.source.name === 'Curated' ||
    q.tags.some(t => t.includes('scout'))
  );
  const rest = questions.filter(q => !priority.includes(q));

  const shuffledPriority = fisherYatesShuffle(priority);
  const shuffledRest = fisherYatesShuffle(rest);

  // Take 60% from priority pool, 40% from general
  const priorityCount = Math.min(Math.ceil(count * 0.6), shuffledPriority.length);
  const restCount = count - priorityCount;

  return [
    ...shuffledPriority.slice(0, priorityCount),
    ...shuffledRest.slice(0, restCount),
  ];
}
