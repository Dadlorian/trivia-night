import type { UserAnswer } from '@/types/game';

export function calculateScore(answers: UserAnswer[]): number {
  return answers.filter(a => a.isCorrect).length;
}

export function calculatePercentage(answers: UserAnswer[]): number {
  if (answers.length === 0) return 0;
  return Math.round((calculateScore(answers) / answers.length) * 100);
}

export function getCategoryBreakdown(
  answers: UserAnswer[],
  questionMap: Map<string, string>
): Record<string, { correct: number; total: number }> {
  const breakdown: Record<string, { correct: number; total: number }> = {};

  for (const answer of answers) {
    const category = questionMap.get(answer.questionId) || 'Unknown';
    if (!breakdown[category]) {
      breakdown[category] = { correct: 0, total: 0 };
    }
    breakdown[category].total++;
    if (answer.isCorrect) {
      breakdown[category].correct++;
    }
  }

  return breakdown;
}
