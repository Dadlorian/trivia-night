import { Badge } from '@/components/ui/badge';

const categoryColors: Record<string, string> = {
  'General Knowledge': 'bg-blue-100 text-blue-800',
  'Entertainment': 'bg-purple-100 text-purple-800',
  'Music': 'bg-pink-100 text-pink-800',
  'Science & Nature': 'bg-green-100 text-green-800',
  'Science & Technology': 'bg-cyan-100 text-cyan-800',
  'History': 'bg-amber-100 text-amber-800',
  'Geography': 'bg-emerald-100 text-emerald-800',
  'Sports': 'bg-orange-100 text-orange-800',
  'Arts & Literature': 'bg-indigo-100 text-indigo-800',
  'Scouting': 'bg-lime-100 text-lime-800',
  'Celebrities': 'bg-rose-100 text-rose-800',
  'Mythology': 'bg-violet-100 text-violet-800',
  'Politics': 'bg-red-100 text-red-800',
  'Video Games': 'bg-fuchsia-100 text-fuchsia-800',
  'Food & Drink': 'bg-yellow-100 text-yellow-800',
  'Society & Culture': 'bg-teal-100 text-teal-800',
};

export function CategoryBadge({ category }: { category: string }) {
  const colorClass = categoryColors[category] || 'bg-gray-100 text-gray-800';

  return (
    <Badge variant="secondary" className={`${colorClass} font-medium text-xs`}>
      {category}
    </Badge>
  );
}
