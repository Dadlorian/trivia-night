import { writeFileSync } from 'fs';
import { join } from 'path';
import type { Question, CategoryInfo, PipelineStats } from './types.js';

const OUTPUT_DIR = join(import.meta.dirname, '..', 'public', 'data');

// Seeded pseudo-random shuffle (Mulberry32)
function seededRandom(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fisherYatesShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  const rng = seededRandom(seed);

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function buildBundle(questions: Question[]): void {
  console.log(`[Bundle] Building output from ${questions.length} questions...`);

  // Shuffle deterministically
  const shuffled = fisherYatesShuffle(questions, 42);

  // Re-assign sequential IDs after shuffle to keep them tidy
  const finalQuestions = shuffled.map((q, i) => ({
    ...q,
    id: `${q.id.split('-')[0]}-${String(i).padStart(6, '0')}`,
  }));

  // Build category info
  const catCounts: Record<string, number> = {};
  for (const q of finalQuestions) {
    catCounts[q.category] = (catCounts[q.category] || 0) + 1;
  }
  const categories: CategoryInfo[] = Object.entries(catCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Build stats
  const byDifficulty: Record<string, number> = {};
  const byType: Record<string, number> = {};
  const bySource: Record<string, number> = {};

  for (const q of finalQuestions) {
    const diff = q.difficulty || 'unrated';
    byDifficulty[diff] = (byDifficulty[diff] || 0) + 1;
    byType[q.type] = (byType[q.type] || 0) + 1;
    bySource[q.source.name] = (bySource[q.source.name] || 0) + 1;
  }

  const stats: PipelineStats = {
    total: finalQuestions.length,
    byCategory: catCounts,
    byDifficulty,
    byType,
    bySource,
  };

  // Write files
  writeFileSync(join(OUTPUT_DIR, 'questions.json'), JSON.stringify(finalQuestions));
  console.log(`[Bundle] Wrote questions.json (${finalQuestions.length} questions)`);

  writeFileSync(join(OUTPUT_DIR, 'categories.json'), JSON.stringify(categories, null, 2));
  console.log(`[Bundle] Wrote categories.json (${categories.length} categories)`);

  writeFileSync(join(OUTPUT_DIR, 'stats.json'), JSON.stringify(stats, null, 2));
  console.log(`[Bundle] Wrote stats.json`);

  // Report
  console.log('\n=== Pipeline Summary ===');
  console.log(`Total questions: ${stats.total}`);
  console.log('\nBy source:');
  for (const [src, count] of Object.entries(bySource).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${src}: ${count}`);
  }
  console.log('\nBy category:');
  for (const cat of categories) {
    console.log(`  ${cat.name}: ${cat.count}`);
  }
  console.log('\nBy difficulty:');
  for (const [diff, count] of Object.entries(byDifficulty).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${diff}: ${count}`);
  }
  console.log('\nBy type:');
  for (const [type, count] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type}: ${count}`);
  }
}
