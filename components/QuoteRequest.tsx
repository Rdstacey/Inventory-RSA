'use client';

import { useState } from 'react';
import { InventoryItem } from '@/types/inventory';

interface QuoteRequestProps {
  item: InventoryItem;
  onClose: () => void;
}

export default function QuoteRequest({ item, onClose }: QuoteRequestProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll use mailto as a fallback
      const subject = encodeURIComponent(`Quote Request for ${item.code} - ${item.title}`);
      const body = encodeURIComponent(
        `Item: ${item.code} - ${item.title}\n\n` +
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n` +
        `Company: ${formData.company}\n\n` +
        `Message:\n${formData.message}`
      );
      
      // Use mailto link (will be replaced with API call in production)
      window.location.href = `mailto:quotes@rsautomation.net?subject=${subject}&body=${body}`;
      
      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-primary-blue text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Request Quote</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 p-4 bg-gray-50 rounded">
            <p className="font-semibold text-gray-900">{item.title}</p>
            <p className="text-sm text-gray-600">Listing: {item.code}</p>
            {item.price && (
              <p className="text-sm text-gray-600">Price: ${item.price.toLocaleString()} {item.currency}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Please provide any additional information about your quote request..."
              />
            </div>

            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded">
                Quote request submitted successfully!
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded">
                There was an error submitting your request. Please try again.
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary-blue text-white px-6 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

