import Image from 'next/image';
import Link from 'next/link';
import { InventoryItem } from '@/types/inventory';
import { getSimpleCategory } from '@/lib/categoryMapping';

interface InventoryCardProps {
  item: InventoryItem;
  onCompareToggle?: (code: string, checked: boolean) => void;
  isComparing?: boolean;
}

export default function InventoryCard({ item, onCompareToggle, isComparing = false }: InventoryCardProps) {
  const firstImage = item.images && item.images.length > 0 ? item.images[0] : null;
  const isCustomDomain = typeof window !== 'undefined' && 
    (window.location.hostname === 'inventory.rsautomation.net' || 
     window.location.hostname === 'www.rsautomation.net');
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const basePath = isCustomDomain ? '' : (pathname.startsWith('/Inventory-RSA') ? '/Inventory-RSA' : '');
  const imagePath = firstImage ? `${basePath}/${firstImage}` : null;
  const simpleCategory = getSimpleCategory(item.category);

  return (
    <div className="border border-steel-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all hover:border-primary-light group">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-52 h-52 md:h-auto flex-shrink-0 bg-steel-50 relative overflow-hidden">
          {imagePath ? (
            <Image
              src={imagePath}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 208px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-steel-400 bg-steel-50">
              <span className="text-sm">No Image</span>
            </div>
          )}
        </div>

        <div className="flex-1 p-5 flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-lg font-bold text-steel-900 line-clamp-2 group-hover:text-primary-blue transition-colors">
                {item.title}
              </h3>
              <span className="flex-shrink-0 text-xs font-semibold bg-accent-light text-primary-dark px-2.5 py-1 rounded-full">
                {simpleCategory}
              </span>
            </div>
            <div className="space-y-1 text-sm text-steel-600 mb-3">
              <p><span className="font-semibold text-steel-700">Listing:</span> {item.code}</p>
              <p><span className="font-semibold text-steel-700">Manufacturer:</span> {item.manufacturer || 'N/A'}</p>
              <p><span className="font-semibold text-steel-700">Location:</span> {item.location}</p>
              {item.condition && (
                <p><span className="font-semibold text-steel-700">Condition:</span> <span className="capitalize">{item.condition}</span></p>
              )}
            </div>
            {item.price && (
              <p className="text-2xl font-bold text-accent-green">
                ${item.price.toLocaleString()} <span className="text-sm font-normal text-steel-500">{item.currency}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-steel-100">
            <Link
              href={`/inventory/${item.code}`}
              onClick={() => {
                sessionStorage.setItem('inventoryScrollPosition', window.scrollY.toString());
              }}
              className="bg-primary-blue text-white px-5 py-2.5 rounded-md hover:bg-primary-dark transition-colors font-medium text-sm"
            >
              View Details
            </Link>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isComparing}
                onChange={(e) => onCompareToggle?.(item.code, e.target.checked)}
                className="w-4 h-4 text-primary-blue rounded border-steel-300"
              />
              <span className="text-sm text-steel-500">Compare</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
