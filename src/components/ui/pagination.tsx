
import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from 'lucide-react';

interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

export function Pagination({ current, total, onChange }: PaginationProps) {
  const renderPageButtons = () => {
    const buttons = [];
    const maxButtonsToShow = 5;
    
    let startPage = Math.max(1, current - Math.floor(maxButtonsToShow / 2));
    let endPage = Math.min(total, startPage + maxButtonsToShow - 1);
    
    // Ajustar el rango si estamos cerca del final
    if (endPage - startPage + 1 < maxButtonsToShow && startPage > 1) {
      startPage = Math.max(1, endPage - maxButtonsToShow + 1);
    }
    
    // First page button
    if (startPage > 1) {
      buttons.push(
        <button
          key="first"
          onClick={() => onChange(1)}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
          aria-label="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
      );
    }
    
    // Previous page button
    if (current > 1) {
      buttons.push(
        <button
          key="prev"
          onClick={() => onChange(current - 1)}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      );
    }
    
    // Page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`w-8 h-8 flex items-center justify-center rounded ${
            i === current
              ? 'bg-purple-100 text-purple-700 font-medium'
              : 'hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Next page button
    if (current < total) {
      buttons.push(
        <button
          key="next"
          onClick={() => onChange(current + 1)}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      );
    }
    
    // Last page button
    if (endPage < total) {
      buttons.push(
        <button
          key="last"
          onClick={() => onChange(total)}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
          aria-label="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      );
    }
    
    return buttons;
  };

  if (total <= 1) return null;

  return (
    <div className="flex items-center space-x-1">
      {renderPageButtons()}
    </div>
  );
}
