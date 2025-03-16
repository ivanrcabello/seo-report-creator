
import { Badge } from "@/components/ui/badge";

interface CategoryBadgeProps {
  category: string;
}

export const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'performance': return 'Rendimiento';
      case 'accessibility': return 'Accesibilidad';
      case 'best-practices': return 'Buenas Prácticas';
      case 'seo': return 'SEO';
      default: return category;
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'bg-purple-100 text-purple-800';
      case 'accessibility': return 'bg-blue-100 text-blue-800';
      case 'best-practices': return 'bg-green-100 text-green-800';
      case 'seo': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge className={getCategoryColor(category)}>
      {getCategoryLabel(category)}
    </Badge>
  );
};
