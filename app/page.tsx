'use client';

import { useState, useMemo, useEffect } from 'react';
// Data loading handled client-side for static export
import { filterItems, getFilterCounts } from '@/lib/filters';
import { FilterState, InventoryItem } from '@/types/inventory';
import FilterSidebar from '@/components/FilterSidebar';
import FilterBar from '@/components/FilterBar';
import InventoryCard from '@/components/InventoryCard';

// Data will be loaded client-side via fetch for static export

export default function Home() {
  // Load data on client side (for static export)
  const [allItems, setAllItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({});
  const [compareItems, setCompareItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Load data on mount
  useEffect(() => {
    // Detect basePath from current location (for GitHub Pages subdirectory)
    // If we're at /Inventory-RSA/, basePath is /Inventory-RSA
    // If we're at /, basePath is empty
    const pathname = window.location.pathname;
    const basePath = pathname.startsWith('/Inventory-RSA') ? '/Inventory-RSA' : '';
    const dataPath = `${basePath}/data/inventory.json`;
    console.log('Starting to fetch inventory data from', dataPath, '(detected basePath:', basePath, ')');
    
    let isCancelled = false;
    
    // Add timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      if (!isCancelled) {
        console.error('Fetch timeout - taking too long to load inventory');
        setError('Request timed out. The inventory file may be too large or the server is slow. Please check the browser console for details.');
        setIsLoading(false);
      }
    }, 30000); // 30 second timeout

    const controller = new AbortController();
    
    fetch(dataPath, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(res => {
        console.log('Fetch response received:', res.status, res.statusText, res.headers.get('content-type'));
        if (!res.ok) {
          throw new Error(`Failed to load inventory: ${res.status} ${res.statusText}. Please check that the file exists at /data/inventory.json`);
        }
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.warn('Unexpected content type:', contentType);
        }
        return res.text().then(text => {
          console.log('Response text length:', text.length);
          try {
            return JSON.parse(text);
          } catch (parseErr) {
            console.error('JSON parse error:', parseErr);
            throw new Error('Failed to parse inventory data. The file may be corrupted.');
          }
        });
      })
      .then(data => {
        if (isCancelled) return;
        console.log('Inventory data loaded successfully:', data.items?.length || 0, 'items');
        clearTimeout(timeoutId);
        if (!data || !data.items) {
          throw new Error('Invalid data format: expected object with "items" array');
        }
        setAllItems(data.items || []);
        setIsLoading(false);
        setError(null);
      })
      .catch(err => {
        if (isCancelled) return;
        console.error('Error loading inventory:', err);
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          setError('Request was cancelled.');
        } else {
          setError(err.message || 'Failed to load inventory. Please check the browser console and refresh the page.');
        }
        setIsLoading(false);
      });
    
    // Cleanup on unmount
    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  // Get filter counts
  const filterCounts = useMemo(() => {
    return getFilterCounts(allItems, filters);
  }, [allItems, filters]);

  // Filter items
  const filteredItems = useMemo(() => {
    return filterItems(allItems, filters);
  }, [allItems, filters]);

  // Paginate
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredItems.slice(start, end);
  }, [filteredItems, currentPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleCompareToggle = (code: string, checked: boolean) => {
    setCompareItems(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(code);
      } else {
        newSet.delete(code);
      }
      return newSet;
    });
  };

  const handleCompareSelected = () => {
    // TODO: Implement compare functionality
    alert(`Comparing ${compareItems.size} items`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mb-4"></div>
          <p className="text-gray-600 text-lg">Loading inventory...</p>
          <p className="text-gray-400 text-sm mt-2">Please check the browser console (F12) if this takes too long</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-4">
          <p className="text-red-600 text-xl font-semibold mb-2">Error loading inventory</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-gray-500 text-sm mb-4">
            Check the browser console (F12) for more details.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-blue text-white px-6 py-2 rounded hover:bg-primary-dark"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  const categories = Object.keys(filterCounts.categories);
  const manufacturers = Object.keys(filterCounts.manufacturers);
  const regions = Object.keys(filterCounts.regions);
  const countries = Object.keys(filterCounts.countries);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Showing {filteredItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} listings
        </h1>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <FilterSidebar
            categories={filterCounts.categories}
            manufacturers={filterCounts.manufacturers}
            activeFilters={filters}
            onFilterChange={setFilters}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Filter Bar */}
          <div className="bg-primary-blue text-white p-3 flex justify-between items-center">
            <h2 className="font-semibold">REFINE your search here by using filters</h2>
            <span className="text-sm bg-white text-primary-blue px-3 py-1 rounded">
              {filteredItems.length} Search Results
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
          <div className="bg-white p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleCompareSelected}
              disabled={compareItems.size === 0}
              className="bg-primary-blue text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed border-2 border-primary-blue"
            >
              Compare Selected ({compareItems.size})
            </button>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Sort by:</label>
                <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Name: A to Z</option>
                  <option>Name: Z to A</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Show:</label>
                <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                  <option>50</option>
                  <option>25</option>
                  <option>100</option>
                </select>
              </div>

              <div className="text-sm text-gray-600">
                &lt;&lt; Page {currentPage} of {totalPages || 1} &gt;&gt;
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white p-4 border-b border-gray-200 text-sm text-gray-600">
            Use top filters to narrow. Use left navigation to expand.
          </div>

          {/* Match by Parent Category */}
          <div className="bg-white p-4 border-b border-gray-200">
            <label className="text-sm text-gray-700">
              <input type="checkbox" className="mr-2" />
              Match by Parent Category ({filteredItems.length})
            </label>
          </div>

          {/* Inventory Listings */}
          <div className="p-4 space-y-4">
            {paginatedItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No items found matching your filters.</p>
                <button
                  onClick={() => setFilters({})}
                  className="mt-4 text-primary-blue hover:underline"
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
            <div className="bg-white p-4 border-t border-gray-200 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border rounded ${
                    currentPage === page
                      ? 'bg-primary-blue text-white border-primary-blue'
                      : 'border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50"
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
