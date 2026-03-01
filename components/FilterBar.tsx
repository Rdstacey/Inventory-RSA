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
    <div className="bg-white p-4 border-b border-steel-200">
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-semibold text-steel-500 uppercase tracking-wide mb-1">Category</label>
          <select
            value={activeFilters.category || ''}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="w-full border border-steel-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary-light focus:border-primary-light"
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
          <label className="block text-xs font-semibold text-steel-500 uppercase tracking-wide mb-1">Manufacturer</label>
          <select
            value={activeFilters.manufacturer || ''}
            onChange={(e) => updateFilter('manufacturer', e.target.value)}
            className="w-full border border-steel-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary-light focus:border-primary-light"
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
          <label className="block text-xs font-semibold text-steel-500 uppercase tracking-wide mb-1">Region</label>
          <select
            value={activeFilters.region || ''}
            onChange={(e) => updateFilter('region', e.target.value)}
            className="w-full border border-steel-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary-light focus:border-primary-light"
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
          <label className="block text-xs font-semibold text-steel-500 uppercase tracking-wide mb-1">Country</label>
          <select
            value={activeFilters.country || ''}
            onChange={(e) => updateFilter('country', e.target.value)}
            className="w-full border border-steel-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary-light focus:border-primary-light"
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
