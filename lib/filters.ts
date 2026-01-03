import { InventoryItem, FilterState } from '@/types/inventory';

export function filterItems(items: InventoryItem[], filters: FilterState): InventoryItem[] {
  return items.filter(item => {
    if (filters.category && item.category !== filters.category) {
      return false;
    }
    if (filters.manufacturer && item.manufacturer !== filters.manufacturer) {
      return false;
    }
    if (filters.region && item.locationParsed.region !== filters.region) {
      return false;
    }
    if (filters.country && item.locationParsed.country !== filters.country) {
      return false;
    }
    return true;
  });
}

export function getFilterCounts(items: InventoryItem[], activeFilters: FilterState) {
  const categories: Record<string, number> = {};
  const manufacturers: Record<string, number> = {};
  const regions: Record<string, number> = {};
  const countries: Record<string, number> = {};

  items.forEach(item => {
    // Count categories
    if (!activeFilters.manufacturer && !activeFilters.region && !activeFilters.country) {
      categories[item.category] = (categories[item.category] || 0) + 1;
    } else {
      const matches = filterItems([item], activeFilters);
      if (matches.length > 0) {
        categories[item.category] = (categories[item.category] || 0) + 1;
      }
    }

    // Count manufacturers
    if (!activeFilters.category && !activeFilters.region && !activeFilters.country) {
      manufacturers[item.manufacturer] = (manufacturers[item.manufacturer] || 0) + 1;
    } else {
      const matches = filterItems([item], activeFilters);
      if (matches.length > 0) {
        manufacturers[item.manufacturer] = (manufacturers[item.manufacturer] || 0) + 1;
      }
    }

    // Count regions
    if (item.locationParsed.region) {
      if (!activeFilters.category && !activeFilters.manufacturer && !activeFilters.country) {
        regions[item.locationParsed.region] = (regions[item.locationParsed.region] || 0) + 1;
      } else {
        const matches = filterItems([item], activeFilters);
        if (matches.length > 0) {
          regions[item.locationParsed.region] = (regions[item.locationParsed.region] || 0) + 1;
        }
      }
    }

    // Count countries
    if (!activeFilters.category && !activeFilters.manufacturer && !activeFilters.region) {
      countries[item.locationParsed.country] = (countries[item.locationParsed.country] || 0) + 1;
    } else {
      const matches = filterItems([item], activeFilters);
      if (matches.length > 0) {
        countries[item.locationParsed.country] = (countries[item.locationParsed.country] || 0) + 1;
      }
    }
  });

  return { categories, manufacturers, regions, countries };
}

