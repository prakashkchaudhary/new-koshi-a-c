import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const About = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/company')
      .then(res => setCompany(res.data.company))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">About {company?.name}</h1>
          <p className="text-xl text-blue-200">{company?.tagline}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Years of Service', value: company?.experience || '15+' },
            { label: 'Routes Covered', value: `${company?.routes?.length || 6}+` },
            { label: 'Happy Passengers', value: '50,000+' },
            { label: 'Established', value: company?.established || '2010' }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-md card-hover">
              <p className="text-3xl font-black text-blue-700 mb-2">{stat.value}</p>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Description */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-6">{company?.description}</p>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Our History</h3>
            <p className="text-gray-600 leading-relaxed">{company?.history}</p>
          </div>

          {/* Services */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Services</h2>
            <div className="space-y-3">
              {company?.services?.map((service, i) => (
                <div key={i} className="flex items-center space-x-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Routes */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Routes We Cover</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {company?.routes?.map((route, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-md card-hover border border-gray-100 flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-700 font-bold text-sm">{i + 1}</span>
                </div>
                <span className="text-gray-700 font-medium">{route}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Gallery — always shown */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">Our Fleet</p>
            <h2 className="text-3xl font-bold text-gray-900">Experience the Journey</h2>
            <p className="text-gray-500 mt-2">Premium coaches designed for comfort on every route</p>
          </div>

          {/* Mosaic grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Interior — tall card */}
            <div className="md:row-span-2 relative rounded-3xl overflow-hidden shadow-xl group h-72 md:h-full min-h-[300px]">
              <img
                src="/images/bus-interior.jpg.jpeg"
                alt="Luxury bus interior"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                  ✨ Premium Interior
                </span>
                <h3 className="text-white font-bold text-xl leading-snug mb-1">
                  VIP Sofa Seats
                </h3>
                <p className="text-white/70 text-sm">LED ambience · Reclining seats · Charging ports · Full AC</p>
              </div>
            </div>

            {/* Exterior parked */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl group h-64 md:h-72">
              <img
                src="/images/bus-exterior.jpg.jpeg"
                alt="New Koshi AC bus exterior"
                className="w-full h-full object-cover object-bottom transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="inline-block bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-2">
                  🚌 Our Bus
                </span>
                <p className="text-white font-bold">New Koshi AC Air Bus</p>
                <p className="text-white/70 text-xs mt-0.5">Dharan ↔ Kathmandu</p>
              </div>
            </div>

            {/* Aerial road */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl group h-64 md:h-72">
              <img
                src="/images/bus-road.jpg.jpeg"
                alt="Bus on highway aerial view"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="inline-block bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-2">
                  🛣️ On the Road
                </span>
                <p className="text-white font-bold">Every mile, on time</p>
                <p className="text-white/70 text-xs mt-0.5">GPS tracked · Safe journey</p>
              </div>
            </div>

          </div>
        </div>

        {/* Additional company images from DB */}
        {company?.images?.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">More from Our Fleet</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {company.images.map((img, i) => (
                <div key={i} className="rounded-2xl overflow-hidden shadow-md card-hover h-48">
                  <img
                    src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || ''}${img}`}
                    alt={`Fleet ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
