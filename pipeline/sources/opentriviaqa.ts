import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

const RAW_PATH = join(import.meta.dirname, '..', 'raw', 'opentriviaqa.json');
const REPO_BASE = 'https://raw.githubusercontent.com/uberspot/OpenTriviaQA/master/categories';

const CATEGORY_FILES = [
  'animals',
  'brain-teasers',
  'celebrities',
  'entertainment',
  'for-kids',
  'general',
  'geography',
  'history',
  'hobbies',
  'humanities',
  'literature',
  'movies',
  'music',
  'people',
  'rated',
  'religion',
  'science-technology',
  'sports',
  'television',
  'video-games',
  'world',
];

export interface RawOpenTriviaQAQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  category: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parseCategory(text: string, categoryName: string): RawOpenTriviaQAQuestion[] {
  const questions: RawOpenTriviaQAQuestion[] = [];
  const lines = text.split('\n');

  let currentQuestion = '';
  let options: Record<string, string> = {};
  let correctLetter = '';

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith('#Q')) {
      // Save previous question if complete
      if (currentQuestion && correctLetter && options[correctLetter]) {
        const correct = options[correctLetter];
        const incorrect = Object.entries(options)
          .filter(([k]) => k !== correctLetter)
          .map(([, v]) => v);
        questions.push({
          question: currentQuestion,
          correct_answer: correct,
          incorrect_answers: incorrect,
          category: categoryName,
        });
      }
      // Start new question
      currentQuestion = line.substring(2).trim();
      options = {};
      correctLetter = '';
    } else if (line.startsWith('^')) {
      correctLetter = line.substring(1).trim().toUpperCase();
    } else if (/^[A-D]\s/.test(line) || /^[A-D]\)/.test(line)) {
      const letter = line[0].toUpperCase();
      const answer = line.substring(1).replace(/^\)\s*/, '').replace(/^\s+/, '');
      options[letter] = answer;
    }
  }

  // Don't forget the last question
  if (currentQuestion && correctLetter && options[correctLetter]) {
    const correct = options[correctLetter];
    const incorrect = Object.entries(options)
      .filter(([k]) => k !== correctLetter)
      .map(([, v]) => v);
    questions.push({
      question: currentQuestion,
      correct_answer: correct,
      incorrect_answers: incorrect,
      category: categoryName,
    });
  }

  return questions;
}

export async function fetchOpenTriviaQA(): Promise<RawOpenTriviaQAQuestion[]> {
  if (existsSync(RAW_PATH)) {
    console.log('[OpenTriviaQA] Using cached raw data');
    return JSON.parse(readFileSync(RAW_PATH, 'utf-8'));
  }

  console.log('[OpenTriviaQA] Downloading category files from GitHub...');
  const allQuestions: RawOpenTriviaQAQuestion[] = [];

  for (const cat of CATEGORY_FILES) {
    const url = `${REPO_BASE}/${cat}`;
    await sleep(500);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.log(`[OpenTriviaQA] Failed to fetch "${cat}": HTTP ${res.status}`);
        continue;
      }
      const text = await res.text();
      const questions = parseCategory(text, cat);
      allQuestions.push(...questions);
      console.log(`[OpenTriviaQA]   "${cat}": ${questions.length} questions`);
    } catch (err) {
      console.log(`[OpenTriviaQA] Error fetching "${cat}": ${err}`);
    }
  }

  console.log(`[OpenTriviaQA] Total parsed: ${allQuestions.length}`);
  writeFileSync(RAW_PATH, JSON.stringify(allQuestions, null, 2));
  return allQuestions;
}
