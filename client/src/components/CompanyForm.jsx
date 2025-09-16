import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CompanyForm({ apiBaseUrl, onCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: '',
    industry: 'Technology',
    size: '1-10',
    location: { city: '', state: '', country: 'United States' },
    founded: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    revenue: 'Not disclosed',
    status: 'Active',
    tags: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locField = name.split('.')[1];
      setForm(prev => ({ ...prev, location: { ...prev.location, [locField]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...form,
        founded: form.founded ? Number(form.founded) : undefined,
        tags: form.tags
          ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
          : []
      };
      const res = await axios.post(`${apiBaseUrl}/companies`, payload);
      if (res.data?.success) {
        setIsOpen(false);
        setForm({
          name: '', industry: 'Technology', size: '1-10',
          location: { city: '', state: '', country: 'United States' },
          founded: '', description: '', website: '', email: '', phone: '',
          revenue: 'Not disclosed', status: 'Active', tags: ''
        });
        onCreated && onCreated();
      } else {
        setError(res.data?.message || 'Failed to create company');
      }
    } catch (err) {
      const apiError = err.response?.data;
      if (apiError?.errors?.length) {
        setError(apiError.errors.join(', '));
      } else {
        setError(apiError?.message || 'Error creating company');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add Company
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 mx-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Add New Company</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input name="name" value={form.name} onChange={handleChange} required className="mt-1 w-full border rounded-md px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <select name="industry" value={form.industry} onChange={handleChange} required className="mt-1 w-full border rounded-md px-3 py-2">
                  {['Technology','Healthcare','Finance','Education','Manufacturing','Retail','Real Estate','Consulting','Media & Entertainment','Transportation','Energy','Government','Non-profit','Other'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Size</label>
                <select name="size" value={form.size} onChange={handleChange} required className="mt-1 w-full border rounded-md px-3 py-2">
                  {['1-10','11-50','51-200','201-500','501-1000','1000+'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Founded Year</label>
                <input type="number" name="founded" value={form.founded} onChange={handleChange} min="1800" max={new Date().getFullYear()} required className="mt-1 w-full border rounded-md px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input name="location.city" value={form.location.city} onChange={handleChange} required className="mt-1 w-full border rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input name="location.state" value={form.location.state} onChange={handleChange} required className="mt-1 w-full border rounded-md px-3 py-2" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input name="location.country" value={form.location.country} onChange={handleChange} required className="mt-1 w-full border rounded-md px-3 py-2" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows="3" required className="mt-1 w-full border rounded-md px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input name="website" value={form.website} onChange={handleChange} placeholder="https://..." className="mt-1 w-full border rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Revenue</label>
                <select name="revenue" value={form.revenue} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2">
                  {['Under $1M','$1M - $10M','$10M - $50M','$50M - $100M','$100M - $500M','$500M+','Not disclosed'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2">
                  {['Active','Inactive','Acquired','Merged'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                <input name="tags" value={form.tags} onChange={handleChange} placeholder="e.g., SaaS, B2B, Cloud" className="mt-1 w-full border rounded-md px-3 py-2" />
              </div>

              <div className="sm:col-span-2 flex justify-end space-x-3 mt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-md border text-gray-700">Cancel</button>
                <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
                  {submitting ? 'Saving...' : 'Save Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyForm;


