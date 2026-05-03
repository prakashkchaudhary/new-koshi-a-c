import React, { useEffect, useState, useRef } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');

const defaultForm = {
  name: '', routeFrom: '', routeTo: '', departureTime: '', arrivalTime: '',
  price: '', totalSeats: '40', busType: 'AC Night Sleeper',
  amenities: 'AC,Charging Port,Blanket,Pillow', isActive: 'true', imageUrl: '', isSleeper: 'false'
};

// ── Seat Layout Builder ───────────────────────────────────
const SeatLayoutBuilder = ({ totalSeats, blockedSeats, onChange, isSleeper }) => {
  const rows = [];
  
  // Special first row
  rows.push({
    label: '',
    left: [{ id: 'C1' }],
    middle: [],
    right: [{ id: 'J1' }, { id: 'J2' }],
  });
  
  // Second row
  rows.push({
    label: '',
    left: [{ id: 'A' }],
    middle: [{ id: 'B' }],
    right: [{ id: 'KA' }, { id: 'Kha' }],
  });
  
  // Third row
  rows.push({
    label: '',
    left: [{ id: 'C' }],
    middle: [{ id: 'D' }],
    right: [{ id: 'GA' }, { id: 'GHA' }],
  });
  
  // Regular numbered rows
  const regularRowCount = isSleeper ? 10 : 12;
  
  for (let i = 1; i <= regularRowCount; i++) {
    rows.push({
      label: '',
      left: [{ id: `A${i}` }],
      middle: [{ id: `A${i + 1}` }],
      right: [{ id: `B${i}` }, { id: `B${i + 1}` }],
    });
    i++;
  }
  
  // Add sleeper berth rows
  if (isSleeper) {
    rows.push({
      label: '',
      left: [{ id: 'A13L', label: 'berth' }],
      middle: [{ id: 'A14L', label: 'berth' }],
      right: [{ id: 'B13L', label: 'berth' }, { id: 'B14L', label: 'berth' }],
      isSleeper: true
    });
    
    rows.push({
      label: '',
      left: [{ id: 'A13U', label: 'seep' }],
      middle: [{ id: 'A14U', label: 'seep' }],
      right: [{ id: 'B13U', label: 'seep' }, { id: 'B14U', label: 'seep' }],
      isSleeper: true
    });
  }

  const toggle = (seatId) => {
    const updated = blockedSeats.includes(seatId)
      ? blockedSeats.filter(s => s !== seatId)
      : [...blockedSeats, seatId];
    onChange(updated);
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
      <p className="text-xs text-gray-500 mb-3 font-medium">
        Click seats to mark as <span className="text-red-500 font-bold">unavailable/blocked</span> (e.g. driver seat, reserved)
        {isSleeper && <span className="ml-2 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">🛏️ +8 Sleeper Berths at End</span>}
      </p>

      {/* Bus front */}
      <div className="flex justify-center mb-4">
        <div className="bg-gray-800 text-white text-xs px-8 py-1.5 rounded-t-2xl font-medium">
          🚌 FRONT / DRIVER
        </div>
      </div>

      <div className="border-2 border-gray-300 rounded-xl p-3 bg-white">
        {/* Header */}
        <div className="flex items-center mb-2 text-xs text-gray-400 font-medium">
          <div className="w-7" />
          <div className="flex-1 flex justify-end gap-1 mr-2 text-center">
            <span className="w-9">Left</span>
            <span className="w-9">Mid</span>
          </div>
          <div className="w-6 text-center text-gray-200">|</div>
          <div className="flex-1 flex justify-start gap-1 ml-2 text-center">
            <span className="w-9">Right</span>
            <span className="w-9"></span>
          </div>
        </div>

        <div className="space-y-1.5">
          {rows.map((row, idx) => {
            const { label, left, middle, right } = row;
            return (
              <div key={idx} className="flex items-center">
                <div className="w-7 text-center text-xs font-bold text-gray-500">{label}</div>

                {/* Left + Middle */}
                <div className="flex-1 flex justify-end gap-1 mr-2">
                  {left.map(({ id, label: seatLabel }) => (
                    <button key={id} type="button" onClick={() => toggle(id)}
                      className={`w-9 h-9 rounded-t-lg border-2 text-[10px] font-bold transition-all ${
                        blockedSeats.includes(id)
                          ? 'bg-red-100 border-red-400 text-red-600'
                          : 'bg-emerald-50 border-emerald-400 text-emerald-700 hover:bg-emerald-100'
                      }`}>
                      {seatLabel || id}
                    </button>
                  ))}
                  {middle && middle.map(({ id, label: seatLabel }) => (
                    <button key={id} type="button" onClick={() => toggle(id)}
                      className={`w-9 h-9 rounded-t-lg border-2 text-[10px] font-bold transition-all ${
                        blockedSeats.includes(id)
                          ? 'bg-red-100 border-red-400 text-red-600'
                          : 'bg-emerald-50 border-emerald-400 text-emerald-700 hover:bg-emerald-100'
                      }`}>
                      {seatLabel || id}
                    </button>
                  ))}
                </div>

                <div className="w-6 flex justify-center">
                  <div className="w-0.5 bg-gray-300 rounded h-9" />
                </div>

                {/* Right */}
                <div className="flex-1 flex justify-start gap-1 ml-2">
                  {right.map(({ id, label: seatLabel }) => (
                    <button key={id} type="button" onClick={() => toggle(id)}
                      className={`w-9 h-9 rounded-t-lg border-2 text-[10px] font-bold transition-all ${
                        blockedSeats.includes(id)
                          ? 'bg-red-100 border-red-400 text-red-600'
                          : 'bg-emerald-50 border-emerald-400 text-emerald-700 hover:bg-emerald-100'
                      }`}>
                      {seatLabel || id}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3 text-xs">
        <span className="flex items-center gap-1.5">
          <span className={`border-2 border-emerald-400 bg-emerald-100 inline-block ${isSleeper ? 'w-10 h-6 rounded-lg' : 'w-4 h-4 rounded'}`} />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className={`border-2 border-red-400 bg-red-100 inline-block ${isSleeper ? 'w-10 h-6 rounded-lg' : 'w-4 h-4 rounded'}`} />
          Blocked
        </span>
        {isSleeper && (
          <>
            <span className="text-gray-300">|</span>
            <span className="text-amber-600 font-semibold">🛏️ Sleeper Berths:</span>
            <span className="flex items-center gap-1">
              <span className="text-amber-700">▼</span>
              <span className="text-gray-600">Lower</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-amber-700">▲</span>
              <span className="text-gray-600">Upper</span>
            </span>
          </>
        )}
      </div>

      {blockedSeats.length > 0 && (
        <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
          <p className="text-xs text-red-700 font-medium">
            Blocked: {blockedSeats.join(', ')} ({blockedSeats.length} seats)
          </p>
        </div>
      )}
    </div>
  );
};

// ── Main Buses Component ──────────────────────────────────
const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBus, setEditBus] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [blockedSeats, setBlockedSeats] = useState([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'image' | 'seats'
  const fileRef = useRef();

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
    setImagePreview('');
    setBlockedSeats([]);
    setActiveTab('details');
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
      isActive: bus.isActive.toString(),
      imageUrl: bus.image || '',
      isSleeper: (bus.isSleeper || false).toString()
    });
    setImageFile(null);
    // Set preview from existing image
    if (bus.image) {
      const preview = bus.image.startsWith('/images/') || bus.image.startsWith('http')
        ? bus.image
        : `${BASE_URL}${bus.image}`;
      setImagePreview(preview);
    } else {
      setImagePreview('');
    }
    setBlockedSeats(bus.bookedSeats || []);
    setActiveTab('details');
    setShowModal(true);
  };

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setForm(f => ({ ...f, imageUrl: '' }));
  };

  const handleImageUrl = (url) => {
    setForm(f => ({ ...f, imageUrl: url }));
    setImagePreview(url);
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'amenities') {
          formData.append(k, JSON.stringify(v.split(',').map(s => s.trim()).filter(Boolean)));
        } else if (k === 'imageUrl') {
          if (!imageFile && v) formData.append('imageUrl', v);
        } else {
          formData.append(k, v);
        }
      });

      // Blocked seats sent as bookedSeats for layout purposes
      formData.append('blockedSeats', JSON.stringify(blockedSeats));

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

  const getBusImage = (bus) => {
    if (!bus.image) return null;
    if (bus.image.startsWith('/images/') || bus.image.startsWith('http')) return bus.image;
    return `${BASE_URL}${bus.image}`;
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
          <button onClick={openAdd}
            className="bg-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Bus
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading buses...</div>
        ) : (
          <div className="grid gap-4">
            {buses.map(bus => (
              <div key={bus._id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex">
                {/* Thumbnail */}
                <div className="w-32 h-28 flex-shrink-0 bg-gradient-to-br from-blue-800 to-indigo-900 relative overflow-hidden">
                  {getBusImage(bus) ? (
                    <img src={getBusImage(bus)} alt={bus.name}
                      className="w-full h-full object-cover object-bottom" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🚌</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Info */}
                <div className="flex-1 p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{bus.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        bus.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>{bus.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {bus.route.from} → {bus.route.to} · {bus.departureTime} → {bus.arrivalTime}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="font-bold text-blue-700 text-sm">रू {bus.price}</span>
                      <span>💺 {bus.totalSeats - bus.bookedSeats.length}/{bus.totalSeats} available</span>
                      <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{bus.busType}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => openEdit(bus)}
                      className="text-blue-600 font-semibold text-sm bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDelete(bus._id)}
                      className="text-red-600 font-semibold text-sm bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {buses.length === 0 && (
              <div className="text-center py-20 text-gray-400">No buses yet. Click "Add Bus" to get started.</div>
            )}
          </div>
        )}

        {/* ── Modal ── */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">

              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-gray-900">
                  {editBus ? `Edit: ${editBus.name}` : 'Add New Bus'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100 px-6">
                {[
                  { id: 'details', label: '📋 Bus Details' },
                  { id: 'image',   label: '🖼️ Bus Image' },
                  { id: 'seats',   label: '💺 Seat Layout' },
                ].map(tab => (
                  <button key={tab.id} type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-700'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-6">

                  {/* ── TAB: Details ── */}
                  {activeTab === 'details' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Bus Name *</label>
                        <input type="text" value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          placeholder="e.g. New Koshi Night Service (DHR→KTM)"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">From *</label>
                        <input type="text" value={form.routeFrom}
                          onChange={e => setForm({ ...form, routeFrom: e.target.value })}
                          placeholder="e.g. Dharan"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">To *</label>
                        <input type="text" value={form.routeTo}
                          onChange={e => setForm({ ...form, routeTo: e.target.value })}
                          placeholder="e.g. Kathmandu"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Departure Time *</label>
                        <input type="text" value={form.departureTime}
                          onChange={e => setForm({ ...form, departureTime: e.target.value })}
                          placeholder="e.g. 06:30 PM"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Arrival Time *</label>
                        <input type="text" value={form.arrivalTime}
                          onChange={e => setForm({ ...form, arrivalTime: e.target.value })}
                          placeholder="e.g. 05:30 AM"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Price (रू) *</label>
                        <input type="number" value={form.price}
                          onChange={e => setForm({ ...form, price: e.target.value })}
                          placeholder="e.g. 1400"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required min="0" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Total Seats</label>
                        <input type="number" value={form.totalSeats}
                          onChange={e => setForm({ ...form, totalSeats: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" min="1" max="60" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Bus Type</label>
                        <select value={form.busType} onChange={e => setForm({ ...form, busType: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>AC Night Sleeper</option>
                          <option>AC Day Service (via Sindhuli)</option>
                          <option>AC Deluxe</option>
                          <option>AC Premium Sleeper</option>
                          <option>AC VIP</option>
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
                        <input type="text" value={form.amenities}
                          onChange={e => setForm({ ...form, amenities: e.target.value })}
                          placeholder="AC, WiFi, Charging Port, Blanket, Pillow"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <p className="text-xs text-gray-400 mt-1">Separate each amenity with a comma</p>
                      </div>
                    </div>
                  )}

                  {/* ── TAB: Image ── */}
                  {activeTab === 'image' && (
                    <div className="space-y-5">
                      {/* Preview */}
                      <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-800 to-indigo-900 border-2 border-dashed border-gray-300">
                        {imagePreview ? (
                          <>
                            <img src={imagePreview} alt="Preview"
                              className="w-full h-full object-cover object-bottom" />
                            <div className="absolute inset-0 bg-black/20" />
                            <button type="button"
                              onClick={() => { setImagePreview(''); setImageFile(null); setForm(f => ({ ...f, imageUrl: '' })); if (fileRef.current) fileRef.current.value = ''; }}
                              className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold hover:bg-red-600">
                              ✕
                            </button>
                            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                              {imageFile ? `📁 ${imageFile.name}` : '🔗 URL image'}
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-white/60">
                            <span className="text-5xl mb-2">🚌</span>
                            <span className="text-sm">No image selected</span>
                          </div>
                        )}
                      </div>

                      {/* Upload file */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          📁 Upload Image File
                        </label>
                        <div
                          onClick={() => fileRef.current?.click()}
                          className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                          <div className="text-3xl mb-2">📷</div>
                          <p className="text-sm font-medium text-blue-700">Click to upload image</p>
                          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — max 5MB</p>
                          {imageFile && <p className="text-xs text-green-600 mt-2 font-medium">✓ {imageFile.name}</p>}
                        </div>
                        <input ref={fileRef} type="file" accept="image/*"
                          onChange={handleImageFile} className="hidden" />
                      </div>

                      {/* OR divider */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-medium">OR</span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>

                      {/* Image URL */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          🔗 Image URL
                        </label>
                        <input type="url" value={form.imageUrl}
                          onChange={e => handleImageUrl(e.target.value)}
                          placeholder="https://example.com/bus-image.jpg"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                        <p className="text-xs text-gray-400 mt-1">Paste a direct image URL from the web</p>
                      </div>
                    </div>
                  )}

                  {/* ── TAB: Seat Layout ── */}
                  {activeTab === 'seats' && (
                    <div className="space-y-4">

                      {/* Controls row */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-gray-900">Seat Layout Configuration</h3>
                          <p className="text-sm text-gray-500">
                            {form.isSleeper === 'true'
                              ? `🛏️ Custom layout — 1+1|2 configuration with 8 sleeper berths at end`
                              : `💺 Custom layout — 1+1|2 configuration (${form.totalSeats} seats)`}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="text-sm font-semibold text-gray-700">Total Seats:</label>
                          <input type="number" value={form.totalSeats}
                            onChange={e => { setForm({ ...form, totalSeats: e.target.value }); setBlockedSeats([]); }}
                            className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="4" max="60" step="4" />
                        </div>
                      </div>

                      {/* Sleeper toggle — right here in seats tab */}
                      <div className={`flex items-center justify-between rounded-xl px-4 py-3 border-2 transition-all ${
                        form.isSleeper === 'true'
                          ? 'bg-amber-50 border-amber-400'
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {form.isSleeper === 'true' ? '🛏️ Add 8 Sleeper Berths (Last 2 Rows)' : '💺 Regular Seats Only'}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {form.isSleeper === 'true'
                              ? 'Last 2 rows will have sleeper berths (berth + seep), rest are regular seats'
                              : 'All seats are regular — toggle to add sleeper berths at the end'}
                          </p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            const newSleeperValue = form.isSleeper === 'true' ? 'false' : 'true';
                            setForm(f => ({ ...f, isSleeper: newSleeperValue }));
                            setBlockedSeats([]);
                          }}
                          className={`relative flex-shrink-0 w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            form.isSleeper === 'true' ? 'bg-amber-500 focus:ring-amber-400' : 'bg-gray-300 focus:ring-gray-400'
                          }`}
                          aria-label={`Toggle sleeper berths: currently ${form.isSleeper === 'true' ? 'enabled' : 'disabled'}`}
                        >
                          <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                            form.isSleeper === 'true' ? 'translate-x-7' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <SeatLayoutBuilder
                        totalSeats={parseInt(form.totalSeats) || 40}
                        blockedSeats={blockedSeats}
                        onChange={setBlockedSeats}
                        isSleeper={form.isSleeper === 'true'}
                      />

                      <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
                        <p className="font-semibold mb-1">ℹ️ How this works:</p>
                        <ul className="text-xs space-y-1 text-blue-700">
                          <li>• <span className="text-emerald-600 font-semibold">Green</span> = available for booking</li>
                          <li>• <span className="text-red-500 font-semibold">Red</span> = blocked (click to toggle)</li>
                          <li>• Layout: 1 seat (left) + 1 seat (middle) | 2 seats (right)</li>
                          <li>• When sleeper enabled, last 2 rows become berths (berth + seep)</li>
                          <li>• Toggling sleeper mode clears blocked seats</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white">
                  {/* Tab navigation */}
                  <div className="flex gap-2 mr-auto">
                    {activeTab !== 'details' && (
                      <button type="button"
                        onClick={() => setActiveTab(activeTab === 'seats' ? 'image' : 'details')}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                        ← Back
                      </button>
                    )}
                    {activeTab !== 'seats' && (
                      <button type="button"
                        onClick={() => setActiveTab(activeTab === 'details' ? 'image' : 'seats')}
                        className="px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                        Next →
                      </button>
                    )}
                  </div>
                  <button type="button" onClick={() => setShowModal(false)}
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="px-8 py-2.5 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors disabled:opacity-60 flex items-center gap-2">
                    {saving ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                    ) : (
                      <>{editBus ? '✓ Update Bus' : '+ Add Bus'}</>
                    )}
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
