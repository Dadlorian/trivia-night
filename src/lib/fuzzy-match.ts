function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;

  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }

  return dp[m][n];
}

export function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
  const normUser = normalize(userAnswer);
  const normCorrect = normalize(correctAnswer);

  if (!normUser) return false;

  // Exact match
  if (normUser === normCorrect) return true;

  // Contains match (user's answer contains the correct answer or vice versa)
  if (normCorrect.includes(normUser) || normUser.includes(normCorrect)) return true;

  // Levenshtein distance threshold (proportional to answer length)
  const maxDist = Math.max(1, Math.floor(normCorrect.length * 0.25));
  if (levenshtein(normUser, normCorrect) <= maxDist) return true;

  // Check if correct answer has multiple acceptable forms (e.g., "15,000" -> "15000")
  const numericCorrect = normCorrect.replace(/\s/g, '');
  const numericUser = normUser.replace(/\s/g, '');
  if (numericCorrect === numericUser) return true;

  return false;
}
