import { InventoryItem, FilterState } from '@/types/inventory';
import { getSimpleCategory } from '@/lib/categoryMapping';

export function filterItems(items: InventoryItem[], filters: FilterState): InventoryItem[] {
  return items.filter(item => {
    if (filters.category) {
      const itemSimpleCat = getSimpleCategory(item.category);
      if (itemSimpleCat !== filters.category) {
        return false;
      }
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
    const simpleCat = getSimpleCategory(item.category);

    const matchesOtherFilters = (excludeKey: keyof FilterState) => {
      const testFilters = { ...activeFilters, [excludeKey]: undefined };
      return filterItems([item], testFilters).length > 0;
    };

    if (!activeFilters.manufacturer && !activeFilters.region && !activeFilters.country) {
      categories[simpleCat] = (categories[simpleCat] || 0) + 1;
    } else if (matchesOtherFilters('category')) {
      categories[simpleCat] = (categories[simpleCat] || 0) + 1;
    }

    if (!activeFilters.category && !activeFilters.region && !activeFilters.country) {
      manufacturers[item.manufacturer] = (manufacturers[item.manufacturer] || 0) + 1;
    } else if (matchesOtherFilters('manufacturer')) {
      manufacturers[item.manufacturer] = (manufacturers[item.manufacturer] || 0) + 1;
    }

    if (item.locationParsed.region) {
      if (!activeFilters.category && !activeFilters.manufacturer && !activeFilters.country) {
        regions[item.locationParsed.region] = (regions[item.locationParsed.region] || 0) + 1;
      } else if (matchesOtherFilters('region')) {
        regions[item.locationParsed.region] = (regions[item.locationParsed.region] || 0) + 1;
      }
    }

    if (!activeFilters.category && !activeFilters.manufacturer && !activeFilters.region) {
      countries[item.locationParsed.country] = (countries[item.locationParsed.country] || 0) + 1;
    } else if (matchesOtherFilters('country')) {
      countries[item.locationParsed.country] = (countries[item.locationParsed.country] || 0) + 1;
    }
  });

  return { categories, manufacturers, regions, countries };
}
