import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import type { RawOpenTDBQuestion } from '../types.js';

const RAW_PATH = join(import.meta.dirname, '..', 'raw', 'opentdb.json');
const BASE_URL = 'https://opentdb.com';
const BATCH_SIZE = 50;
const DELAY_MS = 5500;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function decodeHTML(html: string): string {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&eacute;/g, 'é')
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&ouml;/g, 'ö')
    .replace(/&uuml;/g, 'ü')
    .replace(/&szlig;/g, 'ß')
    .replace(/&pi;/g, 'π')
    .replace(/&shy;/g, '')
    .replace(/&#\d+;/g, match => {
      const code = parseInt(match.slice(2, -1), 10);
      return String.fromCharCode(code);
    });
}

async function getSessionToken(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api_token.php?command=request`);
  const data = await res.json();
  return data.token;
}

interface CategoryCountResponse {
  trivia_categories: Array<{ id: number; name: string }>;
}

interface CategoryQuestionCountResponse {
  category_question_count: {
    total_question_count: number;
  };
}

async function getCategoryList(): Promise<Array<{ id: number; name: string; count: number }>> {
  const res = await fetch(`${BASE_URL}/api_category.php`);
  const data: CategoryCountResponse = await res.json();

  const result: Array<{ id: number; name: string; count: number }> = [];
  for (const cat of data.trivia_categories) {
    await sleep(1000);
    const countRes = await fetch(`${BASE_URL}/api_count.php?category=${cat.id}`);
    const countData: CategoryQuestionCountResponse = await countRes.json();
    result.push({
      id: cat.id,
      name: cat.name,
      count: countData.category_question_count.total_question_count,
    });
  }
  return result;
}

export async function fetchOpenTDB(): Promise<RawOpenTDBQuestion[]> {
  if (existsSync(RAW_PATH)) {
    console.log('[OpenTDB] Using cached raw data');
    return JSON.parse(readFileSync(RAW_PATH, 'utf-8'));
  }

  console.log('[OpenTDB] Fetching session token...');
  const token = await getSessionToken();

  console.log('[OpenTDB] Fetching category list...');
  const categories = await getCategoryList();
  console.log(`[OpenTDB] Found ${categories.length} categories`);

  const allQuestions: RawOpenTDBQuestion[] = [];

  for (const cat of categories) {
    const totalForCat = cat.count;
    let fetched = 0;

    console.log(`[OpenTDB] Fetching "${cat.name}" (${totalForCat} available)...`);

    while (fetched < totalForCat) {
      const amount = Math.min(BATCH_SIZE, totalForCat - fetched);
      const url = `${BASE_URL}/api.php?amount=${amount}&category=${cat.id}&token=${token}`;

      await sleep(DELAY_MS);
      const res = await fetch(url);
      const data = await res.json();

      if (data.response_code === 0 && data.results) {
        const decoded = data.results.map((q: RawOpenTDBQuestion) => ({
          ...q,
          question: decodeHTML(q.question),
          correct_answer: decodeHTML(q.correct_answer),
          incorrect_answers: q.incorrect_answers.map(decodeHTML),
          category: decodeHTML(q.category),
        }));
        allQuestions.push(...decoded);
        fetched += data.results.length;
      } else if (data.response_code === 3) {
        // Token exhausted for this category
        console.log(`[OpenTDB]   Token exhausted at ${fetched} for "${cat.name}"`);
        break;
      } else if (data.response_code === 4) {
        // No more results for this category
        console.log(`[OpenTDB]   No more results at ${fetched} for "${cat.name}"`);
        break;
      } else {
        console.log(`[OpenTDB]   Unexpected response code: ${data.response_code}, stopping category`);
        break;
      }
    }

    console.log(`[OpenTDB]   Got ${fetched} from "${cat.name}"`);
  }

  console.log(`[OpenTDB] Total fetched: ${allQuestions.length}`);
  writeFileSync(RAW_PATH, JSON.stringify(allQuestions, null, 2));
  return allQuestions;
}
