import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Company = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', tagline: '', description: '', history: '',
    services: '', routes: '', experience: '', established: ''
  });
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    api.get('/company')
      .then(res => {
        const c = res.data.company;
        setCompany(c);
        setForm({
          name: c.name || '',
          tagline: c.tagline || '',
          description: c.description || '',
          history: c.history || '',
          services: c.services?.join('\n') || '',
          routes: c.routes?.join('\n') || '',
          experience: c.experience || '',
          established: c.established || ''
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('tagline', form.tagline);
      formData.append('description', form.description);
      formData.append('history', form.history);
      formData.append('services', JSON.stringify(form.services.split('\n').map(s => s.trim()).filter(Boolean)));
      formData.append('routes', JSON.stringify(form.routes.split('\n').map(s => s.trim()).filter(Boolean)));
      formData.append('experience', form.experience);
      formData.append('established', form.established);
      imageFiles.forEach(f => formData.append('images', f));

      const res = await api.put('/company', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setCompany(res.data.company);
      toast.success('Company info updated!');
      setImageFiles([]);
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
          <h1 className="text-3xl font-black text-gray-900">Company Information</h1>
          <p className="text-gray-500 mt-1">Update your company details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tagline</label>
                <input type="text" value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Established Year</label>
                <input type="text" value={form.established} onChange={e => setForm({ ...form, established: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
                <input type="text" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })}
                  placeholder="e.g. 15+ years"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">History</label>
                <textarea value={form.history} onChange={e => setForm({ ...form, history: e.target.value })}
                  rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Services (one per line)</label>
              <textarea value={form.services} onChange={e => setForm({ ...form, services: e.target.value })}
                rows={6} placeholder="AC Coach Service&#10;Online Booking&#10;GPS Tracking"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Routes (one per line)</label>
              <textarea value={form.routes} onChange={e => setForm({ ...form, routes: e.target.value })}
                rows={6} placeholder="Kathmandu - Dharan (Night Service)&#10;Dharan - Kathmandu via Sindhuli (Day &amp; Night)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Company Images</label>
            <input type="file" multiple accept="image/*" onChange={e => setImageFiles(Array.from(e.target.files))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {company?.images?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {company.images.map((img, i) => (
                  <img key={i} src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || ''}${img}`}
                    alt="" className="w-24 h-24 object-cover rounded-xl border border-gray-200" />
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={saving}
            className="bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Company;
