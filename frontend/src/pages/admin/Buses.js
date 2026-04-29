import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const defaultForm = {
  name: '', routeFrom: '', routeTo: '', departureTime: '', arrivalTime: '',
  price: '', totalSeats: '40', busType: 'AC Sleeper', amenities: 'AC,WiFi,Charging Port', isActive: 'true'
};

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBus, setEditBus] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchBuses = () => {
    api.get('/buses/admin/all')
      .then(res => setBuses(res.data.buses))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBuses(); }, []);

  const openAdd = () => {
    setEditBus(null);
    setForm(defaultForm);
    setImageFile(null);
    setShowModal(true);
  };

  const openEdit = (bus) => {
    setEditBus(bus);
    setForm({
      name: bus.name,
      routeFrom: bus.route.from,
      routeTo: bus.route.to,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      price: bus.price,
      totalSeats: bus.totalSeats,
      busType: bus.busType,
      amenities: bus.amenities.join(','),
      isActive: bus.isActive.toString()
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'amenities') {
          formData.append(k, JSON.stringify(v.split(',').map(s => s.trim()).filter(Boolean)));
        } else {
          formData.append(k, v);
        }
      });
      if (imageFile) formData.append('image', imageFile);

      if (editBus) {
        await api.put(`/buses/${editBus._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Bus updated successfully');
      } else {
        await api.post('/buses', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Bus added successfully');
      }
      setShowModal(false);
      fetchBuses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (busId) => {
    if (!window.confirm('Delete this bus? This cannot be undone.')) return;
    try {
      await api.delete(`/buses/${busId}`);
      toast.success('Bus deleted');
      fetchBuses();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Manage Buses</h1>
            <p className="text-gray-500 mt-1">{buses.length} buses total</p>
          </div>
          <button
            onClick={openAdd}
            className="bg-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Bus</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading buses...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-4 px-6 text-gray-500 font-semibold">Bus</th>
                    <th className="text-left py-4 px-6 text-gray-500 font-semibold">Route</th>
                    <th className="text-left py-4 px-6 text-gray-500 font-semibold">Timing</th>
                    <th className="text-left py-4 px-6 text-gray-500 font-semibold">Price</th>
                    <th className="text-left py-4 px-6 text-gray-500 font-semibold">Seats</th>
                    <th className="text-left py-4 px-6 text-gray-500 font-semibold">Status</th>
                    <th className="text-left py-4 px-6 text-gray-500 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map(bus => (
                    <tr key={bus._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-900">{bus.name}</p>
                        <p className="text-gray-400 text-xs">{bus.busType}</p>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{bus.route.from} → {bus.route.to}</td>
                      <td className="py-4 px-6 text-gray-600">
                        <p>{bus.departureTime}</p>
                        <p className="text-gray-400 text-xs">{bus.arrivalTime}</p>
                      </td>
                      <td className="py-4 px-6 font-bold text-blue-700">৳{bus.price}</td>
                      <td className="py-4 px-6 text-gray-600">
                        {bus.totalSeats - bus.bookedSeats.length}/{bus.totalSeats}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          bus.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {bus.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEdit(bus)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(bus._id)}
                            className="text-red-600 hover:text-red-800 font-medium text-xs bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{editBus ? 'Edit Bus' : 'Add New Bus'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Bus Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">From *</label>
                    <input type="text" value={form.routeFrom} onChange={e => setForm({ ...form, routeFrom: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">To *</label>
                    <input type="text" value={form.routeTo} onChange={e => setForm({ ...form, routeTo: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Departure Time *</label>
                    <input type="text" placeholder="e.g. 08:00 AM" value={form.departureTime} onChange={e => setForm({ ...form, departureTime: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Arrival Time *</label>
                    <input type="text" placeholder="e.g. 02:00 PM" value={form.arrivalTime} onChange={e => setForm({ ...form, arrivalTime: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Price (৳) *</label>
                    <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Total Seats</label>
                    <input type="number" value={form.totalSeats} onChange={e => setForm({ ...form, totalSeats: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" min="1" max="60" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Bus Type</label>
                    <select value={form.busType} onChange={e => setForm({ ...form, busType: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>AC Sleeper</option>
                      <option>AC Deluxe</option>
                      <option>AC Premium</option>
                      <option>AC Premium Sleeper</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                    <select value={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Amenities (comma-separated)</label>
                    <input type="text" value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })}
                      placeholder="AC, WiFi, Charging Port"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Bus Image</label>
                    <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors disabled:opacity-60">
                    {saving ? 'Saving...' : editBus ? 'Update Bus' : 'Add Bus'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Buses;
