'use client';

import { useState, useMemo, useEffect } from 'react';
import { filterItems, getFilterCounts } from '@/lib/filters';
import { FilterState, InventoryItem } from '@/types/inventory';
import FilterSidebar from '@/components/FilterSidebar';
import FilterBar from '@/components/FilterBar';
import InventoryCard from '@/components/InventoryCard';

export default function Home() {
  const [allItems, setAllItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({});
  const [compareItems, setCompareItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  useEffect(() => {
    const isCustomDomain = window.location.hostname === 'inventory.rsautomation.net' || 
                          window.location.hostname === 'www.rsautomation.net';
    const pathname = window.location.pathname;
    const basePath = isCustomDomain ? '' : (pathname.startsWith('/Inventory-RSA') ? '/Inventory-RSA' : '');
    const dataPath = `${basePath}/data/inventory.json`;
    
    let isCancelled = false;
    
    const timeoutId = setTimeout(() => {
      if (!isCancelled) {
        setError('Request timed out. Please refresh the page.');
        setIsLoading(false);
      }
    }, 30000);

    const controller = new AbortController();
    
    fetch(dataPath, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    })
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load inventory: ${res.status}`);
        return res.text().then(text => {
          try { return JSON.parse(text); }
          catch { throw new Error('Failed to parse inventory data.'); }
        });
      })
      .then(data => {
        if (isCancelled) return;
        clearTimeout(timeoutId);
        if (!data?.items) throw new Error('Invalid data format');
        setAllItems(data.items || []);
        setIsLoading(false);
        setError(null);
      })
      .catch(err => {
        if (isCancelled) return;
        clearTimeout(timeoutId);
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load inventory.');
        }
        setIsLoading(false);
      });
    
    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const filterCounts = useMemo(() => {
    return getFilterCounts(allItems, filters);
  }, [allItems, filters]);

  const filteredItems = useMemo(() => {
    return filterItems(allItems, filters);
  }, [allItems, filters]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  useEffect(() => {
    const savedPosition = sessionStorage.getItem('inventoryScrollPosition');
    if (savedPosition && document.referrer.includes('/inventory/')) {
      setTimeout(() => {
        window.scrollTo({ top: parseInt(savedPosition, 10), behavior: 'auto' });
        sessionStorage.removeItem('inventoryScrollPosition');
      }, 100);
    }
  }, []);

  useEffect(() => {
    const savedPosition = sessionStorage.getItem('inventoryScrollPosition');
    if (!savedPosition || !document.referrer.includes('/inventory/')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompareToggle = (code: string, checked: boolean) => {
    setCompareItems(prev => {
      const newSet = new Set(prev);
      if (checked) newSet.add(code);
      else newSet.delete(code);
      return newSet;
    });
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-steel-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mb-4"></div>
          <p className="text-steel-600 text-lg">Loading equipment inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-steel-50">
        <div className="text-center max-w-md mx-4">
          <p className="text-red-600 text-xl font-semibold mb-2">Error loading inventory</p>
          <p className="text-steel-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-blue text-white px-6 py-2 rounded-md hover:bg-primary-dark"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  const categories = Object.keys(filterCounts.categories).sort();
  const manufacturers = Object.keys(filterCounts.manufacturers).sort();
  const regions = Object.keys(filterCounts.regions).sort();
  const countries = Object.keys(filterCounts.countries).sort();
  const hasActiveFilters = !!(filters.category || filters.manufacturer || filters.region || filters.country);

  return (
    <div className="min-h-screen bg-steel-50">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-primary-dark to-primary-blue text-white py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-1">Used Food Process &amp; Plant Automation Equipment</h2>
          <p className="text-primary-light text-sm">
            Quality pumps, valves, mixers, PLCs, sensors, and more &mdash; ready for your facility
          </p>
        </div>
      </div>

      {/* Results header */}
      <div className="bg-white border-b border-steel-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-steel-800">
            {filteredItems.length > 0 
              ? `Showing ${(currentPage - 1) * itemsPerPage + 1}\u2013${Math.min(currentPage * itemsPerPage, filteredItems.length)} of ${filteredItems.length} listings`
              : 'No listings found'
            }
          </h1>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-primary-blue hover:text-primary-dark font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <aside className="w-full md:w-64 flex-shrink-0">
          <FilterSidebar
            categories={filterCounts.categories}
            manufacturers={filterCounts.manufacturers}
            activeFilters={filters}
            onFilterChange={setFilters}
          />
        </aside>

        <main className="flex-1">
          <div className="bg-primary-dark text-white p-3 flex justify-between items-center">
            <h2 className="font-semibold text-sm uppercase tracking-wide">Refine Results</h2>
            <span className="text-xs bg-accent-teal text-white px-3 py-1 rounded-full font-semibold">
              {filteredItems.length} Results
            </span>
          </div>

          <FilterBar
            categories={categories}
            manufacturers={manufacturers}
            regions={regions}
            countries={countries}
            activeFilters={filters}
            onFilterChange={setFilters}
          />

          {/* Controls */}
          <div className="bg-white p-3 border-b border-steel-200 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => alert(`Comparing ${compareItems.size} items`)}
              disabled={compareItems.size === 0}
              className="bg-accent-green text-white px-4 py-2 rounded-md hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
            >
              Compare ({compareItems.size})
            </button>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-steel-500 uppercase">Sort:</label>
                <select className="border border-steel-300 rounded-md px-2 py-1.5 text-sm">
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Name: A to Z</option>
                  <option>Name: Z to A</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-steel-500 uppercase">Show:</label>
                <select 
                  value={itemsPerPage}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleItemsPerPageChange(Number(e.target.value))}
                  className="border border-steel-300 rounded-md px-2 py-1.5 text-sm"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <span className="text-sm text-steel-500">
                Page {currentPage} of {totalPages || 1}
              </span>
            </div>
          </div>

          {/* Inventory Listings */}
          <div className="p-4 space-y-3">
            {paginatedItems.length === 0 ? (
              <div className="text-center py-16 text-steel-500">
                <p className="text-lg font-medium mb-2">No equipment found matching your filters.</p>
                <button
                  onClick={handleClearFilters}
                  className="text-primary-blue hover:underline font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              paginatedItems.map((item) => (
                <InventoryCard
                  key={item.code}
                  item={item}
                  onCompareToggle={handleCompareToggle}
                  isComparing={compareItems.has(item.code)}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white p-4 border-t border-steel-200 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-steel-300 rounded-md disabled:opacity-40 text-sm hover:bg-steel-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3.5 py-2 border rounded-md text-sm font-medium ${
                    currentPage === page
                      ? 'bg-primary-blue text-white border-primary-blue'
                      : 'border-steel-300 hover:bg-steel-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-steel-300 rounded-md disabled:opacity-40 text-sm hover:bg-steel-50"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
