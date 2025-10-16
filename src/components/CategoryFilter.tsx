const CATEGORIES = [
  { id: 'all', label: 'Semua', icon: '📋', color: 'from-gray-500 to-gray-600' },
  { id: 'infrastruktur', label: 'Infrastruktur', icon: '🏗️', color: 'from-blue-500 to-blue-600' },
  { id: 'lingkungan', label: 'Lingkungan', icon: '🌱', color: 'from-green-500 to-green-600' },
  { id: 'keamanan', label: 'Keamanan', icon: '🛡️', color: 'from-red-500 to-red-600' },
  { id: 'kesehatan', label: 'Kesehatan', icon: '🏥', color: 'from-pink-500 to-pink-600' },
  { id: 'pendidikan', label: 'Pendidikan', icon: '📚', color: 'from-purple-500 to-purple-600' },
  { id: 'sosial', label: 'Sosial', icon: '🤝', color: 'from-orange-500 to-orange-600' },
];

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => onChange(category.id)}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all hover:scale-105
            ${selected === category.id
              ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
              : 'bg-white/80 text-gray-700 hover:bg-white shadow-md'
            }
          `}
        >
          <span className="text-lg">{category.icon}</span>
          <span className="text-sm">{category.label}</span>
        </button>
      ))}
    </div>
  );
}

export { CATEGORIES };
