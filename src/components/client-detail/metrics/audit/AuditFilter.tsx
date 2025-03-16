
import { Filter } from "lucide-react";

interface AuditFilterProps {
  filter: string;
  onFilterChange: (filter: string) => void;
}

export const AuditFilter = ({ filter, onFilterChange }: AuditFilterProps) => {
  const categories = ['all', 'performance', 'accessibility', 'best-practices', 'seo'];
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'performance': return 'Rendimiento';
      case 'accessibility': return 'Accesibilidad';
      case 'best-practices': return 'Buenas Prácticas';
      case 'seo': return 'SEO';
      case 'all': return 'Todas las categorías';
      default: return category;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-gray-500" />
      <select
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="text-sm border-gray-200 rounded-md"
      >
        {categories.map(category => (
          <option key={category} value={category}>
            {getCategoryLabel(category)}
          </option>
        ))}
      </select>
    </div>
  );
};
