'use client';

import { useState } from 'react';
import { FilterState } from '@/types/inventory';

interface FilterSidebarProps {
  categories: Record<string, number>;
  manufacturers: Record<string, number>;
  activeFilters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export default function FilterSidebar({
  categories,
  manufacturers,
  activeFilters,
  onFilterChange,
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryClick = (category: string) => {
    onFilterChange({
      ...activeFilters,
      category: activeFilters.category === category ? undefined : category,
    });
  };

  const handleManufacturerClick = (manufacturer: string) => {
    onFilterChange({
      ...activeFilters,
      manufacturer: activeFilters.manufacturer === manufacturer ? undefined : manufacturer,
    });
  };

  return (
    <div className="w-full md:w-64 bg-white border-r border-steel-200 md:border-b-0 border-b">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:hidden bg-primary-blue text-white p-3 flex items-center justify-between font-semibold hover:bg-primary-dark transition-colors"
      >
        <span>Filter Equipment</span>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          &#x25BC;
        </span>
      </button>

      <div className="hidden md:block bg-primary-dark text-white p-3 mb-0">
        <h2 className="font-semibold text-sm uppercase tracking-wide">Filter by Type</h2>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} md:block p-4`}>
        <div className="mb-6">
          <details className="group" open>
            <summary className="font-semibold text-steel-700 cursor-pointer mb-2 flex items-center justify-between text-sm uppercase tracking-wide">
              <span>Equipment Category</span>
              <span className="text-steel-400 group-open:rotate-90 transition-transform text-xs">&#x25B6;</span>
            </summary>
            <div className="mt-2 space-y-0.5">
              {Object.entries(categories)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count]) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`w-full flex items-center justify-between p-2 rounded text-left transition-colors ${
                      activeFilters.category === category
                        ? 'bg-primary-blue text-white'
                        : 'hover:bg-steel-50 text-steel-700'
                    }`}
                  >
                    <span className="text-sm font-medium">{category}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeFilters.category === category
                        ? 'bg-white/20 text-white'
                        : 'bg-steel-100 text-steel-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                ))}
            </div>
          </details>
        </div>

        <div>
          <details className="group">
            <summary className="font-semibold text-steel-700 cursor-pointer mb-2 flex items-center justify-between text-sm uppercase tracking-wide">
              <span>Manufacturer</span>
              <span className="text-steel-400 group-open:rotate-90 transition-transform text-xs">&#x25B6;</span>
            </summary>
            <div className="mt-2 space-y-0.5 max-h-64 overflow-y-auto">
              {Object.entries(manufacturers)
                .sort(([, a], [, b]) => b - a)
                .map(([manufacturer, count]) => (
                  <button
                    key={manufacturer}
                    onClick={() => handleManufacturerClick(manufacturer)}
                    className={`w-full flex items-center justify-between p-2 rounded text-left transition-colors ${
                      activeFilters.manufacturer === manufacturer
                        ? 'bg-primary-blue text-white'
                        : 'hover:bg-steel-50 text-steel-700'
                    }`}
                  >
                    <span className="text-sm">{manufacturer}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeFilters.manufacturer === manufacturer
                        ? 'bg-white/20 text-white'
                        : 'bg-steel-100 text-steel-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                ))}
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
