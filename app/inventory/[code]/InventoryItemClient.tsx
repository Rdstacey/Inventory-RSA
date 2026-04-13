'use client';

import { useState } from 'react';
import ImageGallery from '@/components/ImageGallery';
import QuoteRequest from '@/components/QuoteRequest';
import { InventoryItem } from '@/types/inventory';
import { getSimpleCategory } from '@/lib/categoryMapping';
import Link from 'next/link';

interface InventoryItemClientProps {
  item: InventoryItem | null;
  code: string;
}

export default function InventoryItemClient({ item, code }: InventoryItemClientProps) {
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-steel-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-steel-900 mb-4">Item Not Found</h1>
          <p className="text-steel-600 mb-4">The equipment listing you are looking for does not exist.</p>
          <Link href="/" className="text-primary-blue hover:underline font-medium">
            Return to Equipment Listings
          </Link>
        </div>
      </div>
    );
  }

  const simpleCategory = getSimpleCategory(item.category);

  return (
    <div className="min-h-screen bg-steel-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-steel-200 px-6 py-3">
        <nav className="max-w-7xl mx-auto text-sm text-steel-500">
          <Link href="/" className="hover:text-primary-blue transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/" className="hover:text-primary-blue transition-colors">Equipment</Link>
          <span className="mx-2">/</span>
          <span className="text-steel-800 font-medium">{item.code}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-lg shadow-sm border border-steel-200 p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <ImageGallery images={item.images} title={item.title} />
            </div>

            <div>
              <div className="mb-3">
                <span className="inline-block text-xs font-semibold bg-accent-light text-primary-dark px-3 py-1 rounded-full">
                  {simpleCategory}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-steel-900 mb-5">{item.title}</h1>

              <div className="space-y-3 mb-6">
                <div className="flex">
                  <span className="font-semibold text-steel-600 w-32 text-sm">Listing:</span>
                  <span className="text-steel-900 text-sm">{item.code}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-steel-600 w-32 text-sm">Category:</span>
                  <span className="text-steel-900 text-sm">{simpleCategory}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-steel-600 w-32 text-sm">Manufacturer:</span>
                  <span className="text-steel-900 text-sm">{item.manufacturer || 'N/A'}</span>
                </div>
                {item.brand && (
                  <div className="flex">
                    <span className="font-semibold text-steel-600 w-32 text-sm">Brand:</span>
                    <span className="text-steel-900 text-sm">{item.brand}</span>
                  </div>
                )}
                {item.modelNumber && (
                  <div className="flex">
                    <span className="font-semibold text-steel-600 w-32 text-sm">Model:</span>
                    <span className="text-steel-900 text-sm">{item.modelNumber}</span>
                  </div>
                )}
                {item.serialNumber && (
                  <div className="flex">
                    <span className="font-semibold text-steel-600 w-32 text-sm">Serial:</span>
                    <span className="text-steel-900 text-sm">{item.serialNumber}</span>
                  </div>
                )}
                <div className="flex">
                  <span className="font-semibold text-steel-600 w-32 text-sm">Location:</span>
                  <span className="text-steel-900 text-sm">{item.location}</span>
                </div>
                {item.condition && (
                  <div className="flex">
                    <span className="font-semibold text-steel-600 w-32 text-sm">Condition:</span>
                    <span className="text-steel-900 text-sm capitalize">{item.condition}</span>
                  </div>
                )}
                {item.quantity && (
                  <div className="flex">
                    <span className="font-semibold text-steel-600 w-32 text-sm">Quantity:</span>
                    <span className="text-steel-900 text-sm">{item.quantity}</span>
                  </div>
                )}
              </div>

              {item.price && (
                <div className="mb-6 p-4 bg-steel-50 rounded-lg border border-steel-200">
                  <p className="text-3xl font-bold text-accent-green">
                    ${item.price.toLocaleString()} <span className="text-base font-normal text-steel-500">{item.currency}</span>
                  </p>
                </div>
              )}

              <button
                onClick={() => setShowQuoteModal(true)}
                className="w-full bg-primary-blue text-white px-6 py-3.5 rounded-lg hover:bg-primary-dark transition-colors font-semibold text-lg"
              >
                Request Quote
              </button>
            </div>
          </div>

          {item.description && (
            <div className="border-t border-steel-200 pt-8">
              <h2 className="text-2xl font-bold text-steel-900 mb-4">Description</h2>
              <div
                className="prose max-w-none text-steel-700"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </div>
          )}
        </div>
      </div>

      {showQuoteModal && item && (
        <QuoteRequest item={item} onClose={() => setShowQuoteModal(false)} />
      )}
    </div>
  );
}
