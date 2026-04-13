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
      const subject = encodeURIComponent(`Quote Request for ${item.code} - ${item.title}`);
      const body = encodeURIComponent(
        `Item: ${item.code} - ${item.title}\n\n` +
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n` +
        `Company: ${formData.company}\n\n` +
        `Message:\n${formData.message}`
      );
      
      window.location.href = `mailto:quotes@rsautomation.net?subject=${subject}&body=${body}`;
      
      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="bg-primary-dark text-white p-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-lg font-semibold">Request Quote</h2>
          <button onClick={onClose} className="text-steel-300 hover:text-white text-2xl leading-none">
            &times;
          </button>
        </div>

        <div className="p-6">
          <div className="mb-5 p-4 bg-steel-50 rounded-lg border border-steel-200">
            <p className="font-semibold text-steel-900">{item.title}</p>
            <p className="text-sm text-steel-600 mt-1">Listing: {item.code}</p>
            {item.price && (
              <p className="text-sm font-semibold text-accent-green mt-1">
                ${item.price.toLocaleString()} {item.currency}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-steel-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-steel-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-light focus:border-primary-light"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-steel-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-steel-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-light focus:border-primary-light"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-steel-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-steel-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-light focus:border-primary-light"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-steel-700 mb-1">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full border border-steel-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-light focus:border-primary-light"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-steel-700 mb-1">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full border border-steel-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-light focus:border-primary-light"
                placeholder="Tell us about your requirements..."
              />
            </div>

            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-md text-sm">
                Quote request submitted successfully!
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md text-sm">
                There was an error submitting your request. Please try again.
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary-blue text-white px-6 py-2.5 rounded-md hover:bg-primary-dark disabled:opacity-50 font-medium"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-steel-300 rounded-md hover:bg-steel-50 text-steel-700 font-medium"
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
