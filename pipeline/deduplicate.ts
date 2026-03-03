import { writeFileSync } from 'fs';
import { join } from 'path';
import type { Question } from './types.js';

const LOG_PATH = join(import.meta.dirname, 'dedup-log.json');

function normalizeForComparison(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function stringSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length === 0 || b.length === 0) return 0;

  // Bigram similarity (Dice coefficient)
  const bigramsA = new Set<string>();
  const bigramsB = new Set<string>();

  for (let i = 0; i < a.length - 1; i++) {
    bigramsA.add(a.substring(i, i + 2));
  }
  for (let i = 0; i < b.length - 1; i++) {
    bigramsB.add(b.substring(i, i + 2));
  }

  let intersection = 0;
  for (const bg of bigramsA) {
    if (bigramsB.has(bg)) intersection++;
  }

  return (2 * intersection) / (bigramsA.size + bigramsB.size);
}

function richness(q: Question): number {
  let score = 0;
  if (q.incorrect_answers.length > 0) score += 2;
  if (q.difficulty !== null) score += 1;
  if (q.tags.length > 0) score += 1;
  return score;
}

interface DuplicateEntry {
  kept: string;
  removed: string;
  keptQuestion: string;
  removedQuestion: string;
  similarity: number;
}

export function deduplicate(questions: Question[]): Question[] {
  console.log(`[Dedup] Starting with ${questions.length} questions`);

  const normalizedMap = new Map<string, { question: Question; normalized: string }>();
  const duplicates: DuplicateEntry[] = [];
  const kept: Question[] = [];

  // First pass: exact match dedup
  for (const q of questions) {
    const norm = normalizeForComparison(q.question);
    const existing = normalizedMap.get(norm);

    if (existing) {
      // Keep the richer version
      if (richness(q) > richness(existing.question)) {
        duplicates.push({
          kept: q.id,
          removed: existing.question.id,
          keptQuestion: q.question.substring(0, 80),
          removedQuestion: existing.question.question.substring(0, 80),
          similarity: 1.0,
        });
        normalizedMap.set(norm, { question: q, normalized: norm });
      } else {
        duplicates.push({
          kept: existing.question.id,
          removed: q.id,
          keptQuestion: existing.question.question.substring(0, 80),
          removedQuestion: q.question.substring(0, 80),
          similarity: 1.0,
        });
      }
    } else {
      normalizedMap.set(norm, { question: q, normalized: norm });
    }
  }

  console.log(`[Dedup] After exact match: ${normalizedMap.size} unique (removed ${questions.length - normalizedMap.size})`);

  // Second pass: fuzzy match dedup
  const entries = Array.from(normalizedMap.values());
  const removed = new Set<string>();

  for (let i = 0; i < entries.length; i++) {
    if (removed.has(entries[i].normalized)) continue;

    for (let j = i + 1; j < entries.length; j++) {
      if (removed.has(entries[j].normalized)) continue;

      // Skip comparison if lengths are too different
      const lenA = entries[i].normalized.length;
      const lenB = entries[j].normalized.length;
      if (Math.abs(lenA - lenB) > Math.max(lenA, lenB) * 0.3) continue;

      const sim = stringSimilarity(entries[i].normalized, entries[j].normalized);
      if (sim >= 0.85) {
        const a = entries[i].question;
        const b = entries[j].question;

        if (richness(b) > richness(a)) {
          removed.add(entries[i].normalized);
          duplicates.push({
            kept: b.id,
            removed: a.id,
            keptQuestion: b.question.substring(0, 80),
            removedQuestion: a.question.substring(0, 80),
            similarity: sim,
          });
          break; // entry i is removed, move on
        } else {
          removed.add(entries[j].normalized);
          duplicates.push({
            kept: a.id,
            removed: b.id,
            keptQuestion: a.question.substring(0, 80),
            removedQuestion: b.question.substring(0, 80),
            similarity: sim,
          });
        }
      }
    }
  }

  for (const entry of entries) {
    if (!removed.has(entry.normalized)) {
      kept.push(entry.question);
    }
  }

  console.log(`[Dedup] After fuzzy match: ${kept.length} unique (removed ${entries.length - kept.length} fuzzy dupes)`);
  console.log(`[Dedup] Total duplicates found: ${duplicates.length}`);

  writeFileSync(LOG_PATH, JSON.stringify(duplicates, null, 2));
  console.log(`[Dedup] Duplicate log written to dedup-log.json`);

  return kept;
}
