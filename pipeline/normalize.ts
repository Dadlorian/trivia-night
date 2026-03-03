import type { Question, RawOpenTDBQuestion, RawTriviaAPIQuestion } from './types.js';
import type { RawOpenTriviaQAQuestion } from './sources/opentriviaqa.js';

// Normalized category taxonomy (all source categories merged, deduplicated)
const CATEGORY_MAP = new Map<string, string>([
  // OpenTDB categories
  ['general knowledge', 'General Knowledge'],
  ['entertainment: books', 'Arts & Literature'],
  ['entertainment: film', 'Entertainment'],
  ['entertainment: music', 'Music'],
  ['entertainment: musicals & theatres', 'Entertainment'],
  ['entertainment: television', 'Entertainment'],
  ['entertainment: video games', 'Video Games'],
  ['entertainment: board games', 'Entertainment'],
  ['entertainment: comics', 'Entertainment'],
  ['entertainment: japanese anime & manga', 'Entertainment'],
  ['entertainment: cartoon & animations', 'Entertainment'],
  ['science & nature', 'Science & Nature'],
  ['science: computers', 'Science & Technology'],
  ['science: mathematics', 'Science & Technology'],
  ['science: gadgets', 'Science & Technology'],
  ['mythology', 'Mythology'],
  ['sports', 'Sports'],
  ['geography', 'Geography'],
  ['history', 'History'],
  ['politics', 'Politics'],
  ['art', 'Arts & Literature'],
  ['celebrities', 'Celebrities'],
  ['animals', 'Science & Nature'],
  ['vehicles', 'Science & Technology'],

  // Trivia API categories
  ['music', 'Music'],
  ['sport_and_leisure', 'Sports'],
  ['film_and_tv', 'Entertainment'],
  ['arts_and_literature', 'Arts & Literature'],
  ['society_and_culture', 'Society & Culture'],
  ['science', 'Science & Nature'],
  ['food_and_drink', 'Food & Drink'],
  ['general_knowledge', 'General Knowledge'],

  // OpenTriviaQA categories
  ['brain-teasers', 'General Knowledge'],
  ['entertainment', 'Entertainment'],
  ['for-kids', 'General Knowledge'],
  ['general', 'General Knowledge'],
  ['hobbies', 'General Knowledge'],
  ['humanities', 'Society & Culture'],
  ['literature', 'Arts & Literature'],
  ['movies', 'Entertainment'],
  ['people', 'Celebrities'],
  ['rated', 'Entertainment'],
  ['religion', 'Mythology'],
  ['science-technology', 'Science & Technology'],
  ['television', 'Entertainment'],
  ['video-games', 'Video Games'],
  ['world', 'Geography'],
]);

function normalizeCategory(raw: string): string {
  const key = raw.toLowerCase().trim();
  return CATEGORY_MAP.get(key) || 'General Knowledge';
}

function normalizeDifficulty(raw: string | undefined): 'easy' | 'medium' | 'hard' | null {
  if (!raw) return null;
  const d = raw.toLowerCase().trim();
  if (d === 'easy') return 'easy';
  if (d === 'medium') return 'medium';
  if (d === 'hard') return 'hard';
  return null;
}

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeOpenTDB(raw: RawOpenTDBQuestion[]): Question[] {
  return raw.map((q, i) => ({
    id: `otdb-${String(i).padStart(6, '0')}`,
    question: cleanText(q.question),
    correct_answer: cleanText(q.correct_answer),
    incorrect_answers: q.incorrect_answers.map(cleanText),
    type: q.type === 'boolean' ? 'true_false' as const : 'multiple_choice' as const,
    category: normalizeCategory(q.category),
    difficulty: normalizeDifficulty(q.difficulty),
    tags: [],
    source: {
      name: 'Open Trivia Database',
      url: 'https://opentdb.com/',
      date_sourced: new Date().toISOString().split('T')[0],
      license: 'CC BY-SA 4.0',
    },
  }));
}

export function normalizeTriviaAPI(raw: RawTriviaAPIQuestion[]): Question[] {
  return raw.map((q, i) => ({
    id: `ttapi-${String(i).padStart(6, '0')}`,
    question: cleanText(q.question.text),
    correct_answer: cleanText(q.correctAnswer),
    incorrect_answers: q.incorrectAnswers.map(cleanText),
    type: q.type === 'boolean' ? 'true_false' as const : 'multiple_choice' as const,
    category: normalizeCategory(q.category),
    difficulty: normalizeDifficulty(q.difficulty),
    tags: q.tags || [],
    source: {
      name: 'The Trivia API',
      url: 'https://the-trivia-api.com/',
      date_sourced: new Date().toISOString().split('T')[0],
      license: 'Free for non-commercial use',
      original_id: q.id,
    },
  }));
}

export function normalizeOpenTriviaQA(raw: RawOpenTriviaQAQuestion[]): Question[] {
  return raw.map((q, i) => ({
    id: `otqa-${String(i).padStart(6, '0')}`,
    question: cleanText(q.question),
    correct_answer: cleanText(q.correct_answer),
    incorrect_answers: q.incorrect_answers.map(cleanText),
    type: 'multiple_choice' as const,
    category: normalizeCategory(q.category),
    difficulty: null,
    tags: [],
    source: {
      name: 'OpenTriviaQA',
      url: 'https://github.com/uberspot/OpenTriviaQA',
      date_sourced: new Date().toISOString().split('T')[0],
      license: 'CC BY-SA 4.0',
    },
  }));
}
