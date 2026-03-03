import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import type { RawTriviaAPIQuestion } from '../types.js';

const RAW_PATH = join(import.meta.dirname, '..', 'raw', 'trivia-api.json');
const BASE_URL = 'https://the-trivia-api.com/v2/questions';
const BATCH_SIZE = 50;
const DELAY_MS = 1500;
const MAX_CONSECUTIVE_DUPES = 10;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchTriviaAPI(): Promise<RawTriviaAPIQuestion[]> {
  if (existsSync(RAW_PATH)) {
    console.log('[TriviaAPI] Using cached raw data');
    return JSON.parse(readFileSync(RAW_PATH, 'utf-8'));
  }

  console.log('[TriviaAPI] Starting fetch...');

  const allQuestions: RawTriviaAPIQuestion[] = [];
  const seenIds = new Set<string>();
  let consecutiveDupes = 0;
  let batch = 0;

  const difficulties = ['easy', 'medium', 'hard'];

  for (const difficulty of difficulties) {
    consecutiveDupes = 0;
    batch = 0;
    console.log(`[TriviaAPI] Fetching difficulty: ${difficulty}`);

    while (consecutiveDupes < MAX_CONSECUTIVE_DUPES) {
      const url = `${BASE_URL}?limit=${BATCH_SIZE}&difficulties=${difficulty}`;
      await sleep(DELAY_MS);

      try {
        const res = await fetch(url);
        if (!res.ok) {
          console.log(`[TriviaAPI] HTTP ${res.status}, waiting and retrying...`);
          await sleep(5000);
          continue;
        }

        const data: RawTriviaAPIQuestion[] = await res.json();

        if (!data || data.length === 0) {
          consecutiveDupes++;
          continue;
        }

        let newInBatch = 0;
        for (const q of data) {
          if (!seenIds.has(q.id)) {
            seenIds.add(q.id);
            allQuestions.push(q);
            newInBatch++;
          }
        }

        if (newInBatch === 0) {
          consecutiveDupes++;
        } else {
          consecutiveDupes = 0;
        }

        batch++;
        if (batch % 20 === 0) {
          console.log(`[TriviaAPI]   ${difficulty}: batch ${batch}, total unique: ${allQuestions.length}`);
        }
      } catch (err) {
        console.log(`[TriviaAPI] Fetch error: ${err}, waiting and retrying...`);
        await sleep(5000);
      }
    }

    console.log(`[TriviaAPI] Finished ${difficulty}: ${allQuestions.length} total unique so far`);
  }

  console.log(`[TriviaAPI] Total fetched: ${allQuestions.length}`);
  writeFileSync(RAW_PATH, JSON.stringify(allQuestions, null, 2));
  return allQuestions;
}
