'use client';

import { FilterState } from '@/types/inventory';

interface FilterBarProps {
  categories: string[];
  manufacturers: string[];
  regions: string[];
  countries: string[];
  activeFilters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export default function FilterBar({
  categories,
  manufacturers,
  regions,
  countries,
  activeFilters,
  onFilterChange,
}: FilterBarProps) {
  const updateFilter = (key: keyof FilterState, value: string) => {
    onFilterChange({
      ...activeFilters,
      [key]: value === '' ? undefined : value,
    });
  };

  return (
    <div className="bg-white p-4 border-b border-gray-200">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">By Category</label>
          <select
            value={activeFilters.category || ''}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">By Manufacturer</label>
          <select
            value={activeFilters.manufacturer || ''}
            onChange={(e) => updateFilter('manufacturer', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">All Manufacturers</option>
            {manufacturers.map((mfg) => (
              <option key={mfg} value={mfg}>
                {mfg}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">By Region</label>
          <select
            value={activeFilters.region || ''}
            onChange={(e) => updateFilter('region', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">All Regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">By Country</label>
          <select
            value={activeFilters.country || ''}
            onChange={(e) => updateFilter('country', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

