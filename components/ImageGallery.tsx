'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const isCustomDomain = typeof window !== 'undefined' && 
    (window.location.hostname === 'inventory.rsautomation.net' || 
     window.location.hostname === 'www.rsautomation.net');
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const basePath = isCustomDomain ? '' : (pathname.startsWith('/Inventory-RSA') ? '/Inventory-RSA' : '');

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-steel-100 flex items-center justify-center rounded-lg">
        <span className="text-steel-400">No images available</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <div className="relative w-full h-96 bg-steel-50 rounded-lg overflow-hidden border border-steel-200">
          <Image
            src={`${basePath}/${images[selectedImage]}`}
            alt={`${title} - Image ${selectedImage + 1}`}
            fill
            className="object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setIsModalOpen(true)}
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-primary-blue' : 'border-steel-200 hover:border-steel-400'
                }`}
              >
                <Image
                  src={`${basePath}/${image}`}
                  alt={`${title} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 z-10 text-xl"
            >
              &#x2715;
            </button>
            <div className="relative w-full h-full">
              <Image
                src={`${basePath}/${images[selectedImage]}`}
                alt={`${title} - Full size`}
                width={1200}
                height={800}
                className="max-w-full max-h-[90vh] object-contain"
              />
            </div>
            {images.length > 1 && (
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                  }}
                  className="bg-white text-steel-800 px-4 py-2 rounded-md font-medium text-sm hover:bg-steel-100"
                >
                  &#8249; Previous
                </button>
                <span className="text-white self-center text-sm">
                  {selectedImage + 1} / {images.length}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                  }}
                  className="bg-white text-steel-800 px-4 py-2 rounded-md font-medium text-sm hover:bg-steel-100"
                >
                  Next &#8250;
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
