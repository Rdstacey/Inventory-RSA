import Image from 'next/image';
import Link from 'next/link';
import { InventoryItem } from '@/types/inventory';

interface InventoryCardProps {
  item: InventoryItem;
  onCompareToggle?: (code: string, checked: boolean) => void;
  isComparing?: boolean;
}

export default function InventoryCard({ item, onCompareToggle, isComparing = false }: InventoryCardProps) {
  const firstImage = item.images && item.images.length > 0 ? item.images[0] : null;
  // Detect basePath for GitHub Pages (same logic as in page.tsx)
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const basePath = pathname.startsWith('/Inventory-RSA') ? '/Inventory-RSA' : '';
  const imagePath = firstImage ? `${basePath}/${firstImage}` : null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0 bg-gray-100 relative">
          {imagePath ? (
            <Image
              src={imagePath}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 192px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
              <span className="text-sm">No Image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {item.title}
            </h3>
            <div className="space-y-1 text-sm text-gray-600 mb-3">
              <p><span className="font-medium">Listing:</span> {item.code}</p>
              <p><span className="font-medium">Category:</span> {item.category}</p>
              <p><span className="font-medium">Manufacturer:</span> {item.manufacturer || 'Uncategorized'}</p>
              <p><span className="font-medium">Location:</span> {item.location}</p>
            </div>
            {item.price && (
              <p className="text-xl font-bold text-primary-blue mb-3">
                ${item.price.toLocaleString()} {item.currency}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <Link
              href={`/inventory/${item.code}`}
              className="bg-primary-blue text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
            >
              View Listing
            </Link>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isComparing}
                onChange={(e) => onCompareToggle?.(item.code, e.target.checked)}
                className="w-4 h-4 text-primary-blue rounded"
              />
              <span className="text-sm text-gray-600">Compare</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

