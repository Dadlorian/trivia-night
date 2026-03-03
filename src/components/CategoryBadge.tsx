import { Badge } from '@/components/ui/badge';

const categoryColors: Record<string, string> = {
  'General Knowledge': 'bg-slate-100 text-slate-700 border-slate-200',
  'Entertainment': 'bg-violet-50 text-violet-700 border-violet-200',
  'Music': 'bg-rose-50 text-rose-700 border-rose-200',
  'Science & Nature': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Science & Technology': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'History': 'bg-amber-50 text-amber-700 border-amber-200',
  'Geography': 'bg-teal-50 text-teal-700 border-teal-200',
  'Sports': 'bg-orange-50 text-orange-700 border-orange-200',
  'Arts & Literature': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Scouting': 'bg-lime-50 text-lime-700 border-lime-200',
  'Celebrities': 'bg-pink-50 text-pink-700 border-pink-200',
  'Mythology': 'bg-purple-50 text-purple-700 border-purple-200',
  'Politics': 'bg-red-50 text-red-700 border-red-200',
  'Video Games': 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
  'Food & Drink': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Society & Culture': 'bg-sky-50 text-sky-700 border-sky-200',
  'Science': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Arts & Music': 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

export function CategoryBadge({ category }: { category: string }) {
  const colorClass = categoryColors[category] || 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <Badge
      variant="outline"
      className={`${colorClass} text-[11px] font-medium px-2 py-0.5 border`}
    >
      {category}
    </Badge>
  );
}
