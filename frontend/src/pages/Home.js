import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import BusCard from '../components/BusCard';
import LoadingSpinner from '../components/LoadingSpinner';

const StatItem = ({ value, label, icon }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-black text-white mb-1">{value}</div>
    <div className="text-blue-200 text-sm font-medium">{label}</div>
  </div>
);

const FeatureCard = ({ icon, title, desc, delay }) => (
  <div className={`bg-white rounded-2xl p-7 shadow-card card-hover border border-gray-100 animate-fade-in-up delay-${delay}`}>
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700
                    flex items-center justify-center text-2xl mb-5 shadow-lg shadow-blue-200">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const Home = () => {
  const [buses, setBuses] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');

  useEffect(() => {
    Promise.all([api.get('/buses'), api.get('/company')])
      .then(([busRes, compRes]) => {
        setBuses(busRes.data.buses.slice(0, 3));
        setCompany(compRes.data.company);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">

        {/* ── Full-bleed bus exterior background ── */}
        <div className="absolute inset-0">
          <img
            src="/images/bus-exterior.jpg.jpeg"
            alt="New Koshi Bus"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 72%' }}
          />
          {/* Deep layered overlay: dark left for text, lighter right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
          {/* Bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          {/* Subtle blue tint */}
          <div className="absolute inset-0 bg-blue-950/40" />
        </div>

        {/* Decorative glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/3 w-96 h-40 bg-amber-400/10 rounded-full blur-3xl" />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.04]"
               style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* ── Left — Text Content ── */}
            <div className="animate-fade-in-up">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md
                              border border-white/20 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
                <span className="text-white/90 text-sm font-medium">Nepal's Trusted Bus Service</span>
              </div>

              {/* Headline with glass backdrop */}
              <div className="relative mb-6">
                <div className="absolute -inset-4 bg-black/30 backdrop-blur-sm rounded-2xl -z-10" />
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight"
                    style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {company?.name?.split(' ').slice(0, 2).join(' ') || 'New Koshi'}
                  <span className="block gradient-text-gold text-4xl md:text-5xl mt-1">
                    A/C Yatayat Pvt. Ltd.
                  </span>
                </h1>
              </div>

              <p className="text-lg text-blue-100/90 mb-8 leading-relaxed max-w-lg
                            bg-black/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                {company?.tagline || 'Your Comfort, Our Priority'} — Safe, reliable and comfortable
                AC bus service from <strong className="text-white">Dharan, Sunsari</strong> to across Nepal.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Link to="/buses" className="btn-gold text-base px-8 py-4 inline-flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  Book Your Ticket
                </Link>
                <Link to="/about" className="btn-outline text-base px-8 py-4 inline-flex items-center gap-2">
                  Learn More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2">
                {['✓ AC Coaches', '✓ GPS Tracked', '✓ Online Booking', '✓ 24/7 Support'].map(f => (
                  <span key={f}
                    className="text-xs text-white font-semibold bg-white/10 backdrop-blur-sm
                               border border-white/20 px-3 py-1.5 rounded-full">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Right — Interior image + Search card ── */}
            <div className="animate-fade-in-up delay-200 flex flex-col gap-4">

              {/* Interior photo card */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-52 group">
                <img
                  src="/images/bus-interior.jpg.jpeg"
                  alt="Premium bus interior"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3">
                  <span className="bg-amber-400 text-gray-900 text-xs font-black px-3 py-1 rounded-full">
                    ✨ Premium Interior
                  </span>
                  <span className="text-white text-sm font-semibold">VIP Sofa Seats · Full AC</span>
                </div>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Search card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
                <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                  🔍 <span>Find Your Bus</span>
                </h2>
                <div className="space-y-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📍</span>
                    <input type="text" placeholder="From — Departure city"
                      value={searchFrom} onChange={e => setSearchFrom(e.target.value)}
                      className="input-field pl-9 bg-white/90 text-sm" />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🏁</span>
                    <input type="text" placeholder="To — Destination"
                      value={searchTo} onChange={e => setSearchTo(e.target.value)}
                      className="input-field pl-9 bg-white/90 text-sm" />
                  </div>
                  <Link
                    to={`/buses?from=${searchFrom}&to=${searchTo}`}
                    className="btn-primary w-full text-center block py-3 text-sm font-bold">
                    Search Available Buses →
                  </Link>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">Popular Routes</p>
                  <div className="flex flex-wrap gap-2">
                    {['Dharan → KTM', 'KTM → Dharan', 'via Sindhuli'].map(r => (
                      <span key={r}
                        className="text-xs bg-white/10 text-white border border-white/20
                                   px-3 py-1 rounded-full font-medium cursor-pointer hover:bg-white/20 transition-colors">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z"
                  fill="#f0f4f8" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATS BANNER
      ══════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value="15+" label="Years of Service" icon="🏆" />
            <StatItem value="50K+" label="Happy Passengers" icon="😊" />
            <StatItem value="6" label="Daily Routes" icon="🗺️" />
            <StatItem value="100%" label="AC Coaches" icon="❄️" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">Why Choose Us</p>
            <h2 className="section-title">Travel with Confidence</h2>
            <p className="section-subtitle">Experience the best in Nepal bus travel</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard delay="100" icon="🛡️" title="Safe & Secure"
              desc="GPS-tracked coaches, professional drivers, and regular maintenance ensure your safety on every journey." />
            <FeatureCard delay="200" icon="❄️" title="Full AC Comfort"
              desc="Spacious reclining seats, air conditioning, charging ports and blankets for overnight trips." />
            <FeatureCard delay="300" icon="🎫" title="Easy Online Booking"
              desc="Book your seat in minutes. Choose your seat, pay online, and get instant confirmation." />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PHOTO GALLERY
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">Our Fleet</p>
            <h2 className="section-title">See What's On Board</h2>
            <p className="section-subtitle">Premium AC coaches built for your comfort</p>
          </div>

          {/* 3-column equal grid — works well with portrait photos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Interior */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group h-80">
              <img
                src="/images/bus-interior.jpg.jpeg"
                alt="Luxury bus interior with premium seats"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="inline-block bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full mb-2">
                  ✨ Premium Interior
                </span>
                <p className="text-white font-bold text-base leading-tight">
                  VIP Sofa Seats with LED Ambience
                </p>
                <p className="text-white/70 text-sm mt-1">Reclining seats · Charging ports · AC</p>
              </div>
            </div>

            {/* Exterior parked — focus on the bus, not the sky */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group h-80">
              <img
                src="/images/bus-exterior.jpg.jpeg"
                alt="New Koshi AC bus exterior"
                className="w-full h-full object-cover object-bottom transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="inline-block bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                  🚌 Our Fleet
                </span>
                <p className="text-white font-bold text-base">
                  New Koshi AC Air Bus
                </p>
                <p className="text-white/70 text-sm mt-0.5">Dharan ↔ Kathmandu</p>
              </div>
            </div>

            {/* Aerial road */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group h-80">
              <img
                src="/images/bus-road.jpg.jpeg"
                alt="New Koshi bus on highway aerial view"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="inline-block bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                  🛣️ On the Road
                </span>
                <p className="text-white font-bold text-base">
                  Covering every mile — safely and on time
                </p>
                <p className="text-white/70 text-sm mt-0.5">GPS tracked · Air suspension</p>
              </div>
            </div>

          </div>

          {/* CTA below gallery */}
          <div className="text-center mt-10">
            <Link to="/buses" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
              Browse Available Buses
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ROUTES HIGHLIGHT
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">Our Routes</p>
            <h2 className="section-title">Kathmandu ↔ Dharan</h2>
            <p className="section-subtitle">Day & Night services via multiple routes</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { from: 'Kathmandu', to: 'Dharan', type: 'Night Service', time: '7:00 PM', via: 'Direct', color: 'from-indigo-500 to-blue-600' },
              { from: 'Dharan', to: 'Kathmandu', type: 'Night Service', time: '6:30 PM', via: 'Direct', color: 'from-blue-600 to-indigo-500' },
              { from: 'Kathmandu', to: 'Dharan', type: 'Day Service', time: '6:00 AM', via: 'via Sindhuli', color: 'from-emerald-500 to-teal-600' },
              { from: 'Dharan', to: 'Kathmandu', type: 'Day Service', time: '5:30 AM', via: 'via Sindhuli', color: 'from-teal-600 to-emerald-500' },
            ].map((r, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-card
                                      card-hover overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${r.color}`} />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">FROM</p>
                      <p className="text-lg font-black text-gray-900">{r.from}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                        <div className="w-12 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400" />
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-400 mt-1">{r.via}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-medium mb-1">TO</p>
                      <p className="text-lg font-black text-gray-900">{r.to}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${r.color} text-white`}>
                      {r.type}
                    </span>
                    <span className="text-sm font-semibold text-gray-600">Departs {r.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/buses" className="btn-primary inline-flex items-center gap-2 px-8 py-4">
              View All Buses & Book Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURED BUSES
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">Available Now</p>
              <h2 className="section-title mb-0">Featured Buses</h2>
            </div>
            <Link to="/buses"
              className="hidden md:flex items-center gap-2 text-blue-600 font-semibold
                         hover:text-blue-800 transition-colors group">
              View All
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {buses.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {buses.map(bus => <BusCard key={bus._id} bus={bus} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">No buses available at the moment</div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">Simple Process</p>
            <h2 className="section-title">Book in 3 Easy Steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '🔍', title: 'Search Route', desc: 'Enter your departure and destination to find available buses.' },
              { step: '02', icon: '💺', title: 'Select Seat', desc: 'Pick your preferred seat from our interactive 2+2 AC coach layout.' },
              { step: '03', icon: '✅', title: 'Confirm & Go', desc: 'Confirm your booking and receive your ticket instantly.' },
            ].map((s, i) => (
              <div key={i} className="relative text-center">
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5
                                  bg-gradient-to-r from-blue-200 to-transparent -translate-x-1/2 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700
                                  flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-blue-200">
                    {s.icon}
                  </div>
                  <span className="text-xs font-black text-blue-400 tracking-widest">STEP {s.step}</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4"
              style={{ fontFamily: 'Poppins, sans-serif' }}>
            Ready to Travel?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Book your seat now and enjoy a comfortable journey with New Koshi A/C Yatayat.
          </p>
          <Link to="/buses" className="btn-gold text-lg px-10 py-4 inline-flex items-center gap-2">
            🎫 Book Your Ticket Now
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
