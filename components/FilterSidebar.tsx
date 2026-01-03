'use client';

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
    <div className="w-full md:w-64 bg-white border-r border-gray-200 p-4">
      <div className="bg-primary-blue text-white p-3 mb-4 rounded">
        <h2 className="font-semibold">EXPAND your search here:</h2>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <details className="group" open>
          <summary className="font-semibold text-gray-700 cursor-pointer mb-2 flex items-center justify-between">
            <span>Category</span>
            <span className="text-gray-400 group-open:rotate-90 transition-transform">›</span>
          </summary>
          <div className="mt-2 space-y-1">
            {Object.entries(categories)
              .sort(([, a], [, b]) => b - a)
              .map(([category, count]) => (
                <label
                  key={category}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <span className="text-sm text-gray-700">{category}</span>
                  <span className="text-sm text-gray-500">({count})</span>
                  <input
                    type="checkbox"
                    checked={activeFilters.category === category}
                    onChange={() => handleCategoryClick(category)}
                    className="ml-2 w-4 h-4 text-primary-blue rounded"
                  />
                </label>
              ))}
          </div>
        </details>
      </div>

      {/* Manufacturer Filter */}
      <div>
        <details className="group" open>
          <summary className="font-semibold text-gray-700 cursor-pointer mb-2 flex items-center justify-between">
            <span>Manufacturer</span>
            <span className="text-gray-400 group-open:rotate-90 transition-transform">›</span>
          </summary>
          <div className="mt-2 space-y-1">
            {Object.entries(manufacturers)
              .sort(([, a], [, b]) => b - a)
              .map(([manufacturer, count]) => (
                <label
                  key={manufacturer}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <span className="text-sm text-gray-700">{manufacturer}</span>
                  <span className="text-sm text-gray-500">({count})</span>
                  <input
                    type="checkbox"
                    checked={activeFilters.manufacturer === manufacturer}
                    onChange={() => handleManufacturerClick(manufacturer)}
                    className="ml-2 w-4 h-4 text-primary-blue rounded"
                  />
                </label>
              ))}
          </div>
        </details>
      </div>
    </div>
  );
}

