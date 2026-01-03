'use client';

import { useState } from 'react';
import ImageGallery from '@/components/ImageGallery';
import QuoteRequest from '@/components/QuoteRequest';
import { InventoryItem } from '@/types/inventory';
import Link from 'next/link';

interface InventoryItemClientProps {
  item: InventoryItem | null;
  code: string;
}

export default function InventoryItemClient({ item, code }: InventoryItemClientProps) {
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h1>
          <p className="text-gray-600 mb-4">The inventory item you're looking for doesn't exist.</p>
          <Link
            href="/"
            className="text-primary-blue hover:underline"
          >
            Return to Inventory List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 p-4">
        <nav className="text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-blue">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/" className="hover:text-primary-blue">
            Inventory
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{item.code}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Image Gallery */}
            <div>
              <ImageGallery images={item.images} title={item.title} />
            </div>

            {/* Item Details */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h1>

              <div className="space-y-3 mb-6">
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-32">Listing:</span>
                  <span className="text-gray-900">{item.code}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-32">Category:</span>
                  <span className="text-gray-900">{item.category}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-32">Manufacturer:</span>
                  <span className="text-gray-900">{item.manufacturer || 'Uncategorized'}</span>
                </div>
                {item.brand && (
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">Brand:</span>
                    <span className="text-gray-900">{item.brand}</span>
                  </div>
                )}
                {item.modelNumber && (
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">Model:</span>
                    <span className="text-gray-900">{item.modelNumber}</span>
                  </div>
                )}
                {item.serialNumber && (
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">Serial:</span>
                    <span className="text-gray-900">{item.serialNumber}</span>
                  </div>
                )}
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-32">Location:</span>
                  <span className="text-gray-900">{item.location}</span>
                </div>
                {item.condition && (
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">Condition:</span>
                    <span className="text-gray-900 capitalize">{item.condition}</span>
                  </div>
                )}
                {item.quantity && (
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">Quantity:</span>
                    <span className="text-gray-900">{item.quantity}</span>
                  </div>
                )}
              </div>

              {item.price && (
                <div className="mb-6">
                  <p className="text-4xl font-bold text-primary-blue">
                    ${item.price.toLocaleString()} {item.currency}
                  </p>
                </div>
              )}

              <button
                onClick={() => setShowQuoteModal(true)}
                className="w-full bg-primary-blue text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold text-lg"
              >
                Request Quote
              </button>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <div
                className="prose max-w-none text-gray-700"
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

