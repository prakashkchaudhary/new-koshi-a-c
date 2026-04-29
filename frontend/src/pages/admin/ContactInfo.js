import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ContactInfo = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    representativeName: '',
    phone: '',
    email: '',
    address: '',
    officeHours: '',
    mapEmbedUrl: ''
  });

  useEffect(() => {
    api.get('/contact')
      .then(res => setForm(res.data.contact))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/contact', form);
      toast.success('Contact info updated!');
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Contact Information</h1>
          <p className="text-gray-500 mt-1">Update contact and representative details</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl">
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Representative Name</label>
              <input type="text" value={form.representativeName} onChange={e => setForm({ ...form, representativeName: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Office Address</label>
              <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Office Hours</label>
              <input type="text" value={form.officeHours} onChange={e => setForm({ ...form, officeHours: e.target.value })}
                placeholder="e.g. Mon-Sat: 8:00 AM - 8:00 PM"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Google Maps Embed URL (optional)</label>
              <input type="text" value={form.mapEmbedUrl} onChange={e => setForm({ ...form, mapEmbedUrl: e.target.value })}
                placeholder="https://www.google.com/maps/embed?..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p className="text-xs text-gray-400 mt-1">Get embed URL from Google Maps → Share → Embed a map</p>
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="mt-6 bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default ContactInfo;
