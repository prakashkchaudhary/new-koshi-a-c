import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import BusCard from '../components/BusCard';
import LoadingSpinner from '../components/LoadingSpinner';

const BusDetails = () => {
  const [buses, setBuses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ from: '', to: '' });

  useEffect(() => {
    api.get('/buses')
      .then(res => {
        setBuses(res.data.buses);
        setFiltered(res.data.buses);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const result = buses.filter(bus => {
      const fromMatch = !search.from || bus.route.from.toLowerCase().includes(search.from.toLowerCase());
      const toMatch = !search.to || bus.route.to.toLowerCase().includes(search.to.toLowerCase());
      return fromMatch && toMatch;
    });
    setFiltered(result);
  };

  const handleReset = () => {
    setSearch({ from: '', to: '' });
    setFiltered(buses);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-black mb-2">Available Buses</h1>
          <p className="text-blue-200">Find and book your perfect journey</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">From</label>
              <input
                type="text"
                placeholder="Departure city..."
                value={search.from}
                onChange={e => setSearch({ ...search, from: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">To</label>
              <input
                type="text"
                placeholder="Destination city..."
                value={search.to}
                onChange={e => setSearch({ ...search, to: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>
            <div className="flex items-end gap-3">
              <button
                type="submit"
                className="bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bus Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            <span className="font-bold text-gray-900">{filtered.length}</span> bus{filtered.length !== 1 ? 'es' : ''} found
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(bus => (
              <BusCard key={bus._id} bus={bus} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚌</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No buses found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusDetails;
