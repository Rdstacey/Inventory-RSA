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

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={`/${images[selectedImage]}`}
            alt={`${title} - Image ${selectedImage + 1}`}
            fill
            className="object-contain cursor-pointer"
            onClick={() => setIsModalOpen(true)}
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-24 h-24 relative rounded overflow-hidden border-2 ${
                  selectedImage === index ? 'border-primary-blue' : 'border-gray-200'
                }`}
              >
                <Image
                  src={`/${image}`}
                  alt={`${title} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal for full-size view */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 z-10"
            >
              ✕
            </button>
            <div className="relative w-full h-full">
              <Image
                src={`/${images[selectedImage]}`}
                alt={`${title} - Full size`}
                width={1200}
                height={800}
                className="max-w-full max-h-[90vh] object-contain"
              />
            </div>
            {images.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                  }}
                  className="bg-white text-black px-4 py-2 rounded"
                >
                  ‹ Previous
                </button>
                <span className="text-white self-center">
                  {selectedImage + 1} / {images.length}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                  }}
                  className="bg-white text-black px-4 py-2 rounded"
                >
                  Next ›
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

