import { mkdirSync } from 'fs';
import { join } from 'path';
import { fetchOpenTDB } from './sources/opentdb.js';
import { fetchTriviaAPI } from './sources/trivia-api.js';
import { fetchOpenTriviaQA } from './sources/opentriviaqa.js';
import { getCuratedQuestions } from './sources/curated.js';
import { normalizeOpenTDB, normalizeTriviaAPI, normalizeOpenTriviaQA } from './normalize.js';
import { deduplicate } from './deduplicate.js';
import { buildBundle } from './build-bundle.js';

const fetchOnly = process.argv.includes('--fetch-only');

async function main() {
  console.log('=== Trivia Night Data Pipeline ===\n');

  // Ensure raw and output directories exist
  mkdirSync(join(import.meta.dirname, 'raw'), { recursive: true });
  mkdirSync(join(import.meta.dirname, '..', 'public', 'data'), { recursive: true });

  // Step 1: Fetch from all sources
  console.log('--- Step 1: Fetching from sources ---\n');

  const [rawOpenTDB, rawTriviaAPI, rawOpenTriviaQA] = await Promise.all([
    fetchOpenTDB(),
    fetchTriviaAPI(),
    fetchOpenTriviaQA(),
  ]);

  const curatedQuestions = getCuratedQuestions();

  console.log(`\nRaw counts: OpenTDB=${rawOpenTDB.length}, TriviaAPI=${rawTriviaAPI.length}, OpenTriviaQA=${rawOpenTriviaQA.length}, Curated=${curatedQuestions.length}`);

  if (fetchOnly) {
    console.log('\n--fetch-only: stopping after fetch');
    return;
  }

  // Step 2: Normalize
  console.log('\n--- Step 2: Normalizing ---\n');

  const normalizedOpenTDB = normalizeOpenTDB(rawOpenTDB);
  const normalizedTriviaAPI = normalizeTriviaAPI(rawTriviaAPI);
  const normalizedOpenTriviaQA = normalizeOpenTriviaQA(rawOpenTriviaQA);

  const allQuestions = [
    ...normalizedOpenTDB,
    ...normalizedTriviaAPI,
    ...normalizedOpenTriviaQA,
    ...curatedQuestions,
  ];

  console.log(`Total after normalization: ${allQuestions.length}`);

  // Step 3: Deduplicate
  console.log('\n--- Step 3: Deduplicating ---\n');

  const deduped = deduplicate(allQuestions);

  // Step 4: Build bundle
  console.log('\n--- Step 4: Building bundle ---\n');

  buildBundle(deduped);

  console.log('\n=== Pipeline Complete ===');
}

main().catch(err => {
  console.error('Pipeline failed:', err);
  process.exit(1);
});
