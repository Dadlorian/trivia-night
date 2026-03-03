export interface QuestionSource {
  name: string;
  url: string;
  date_sourced: string;
  license: string;
  original_id?: string;
}

export interface Question {
  id: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  type: 'multiple_choice' | 'true_false' | 'free_response';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  tags: string[];
  source: QuestionSource;
}

export interface CategoryInfo {
  name: string;
  count: number;
}

export interface Stats {
  total: number;
  byCategory: Record<string, number>;
  byDifficulty: Record<string, number>;
  byType: Record<string, number>;
  bySource: Record<string, number>;
}
