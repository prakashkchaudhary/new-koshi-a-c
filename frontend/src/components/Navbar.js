import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { LOGO_URL } from '../utils/constants';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('#user-menu')) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/',        label: 'Home' },
    { to: '/about',   label: 'About' },
    { to: '/buses',   label: 'Buses' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
        : 'bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center space-x-3 group" onClick={() => setMenuOpen(false)}>
            <div className="w-14 h-14 rounded-xl overflow-hidden shadow-lg
                            group-hover:scale-105 transition-transform flex-shrink-0
                            bg-white flex items-center justify-center p-1">
              <img
                src={LOGO_URL}
                alt="New Koshi Logo"
                className="w-full h-full object-contain"
                onError={e => { e.target.onerror=null; e.target.parentNode.innerHTML='<div class="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"><span class="text-white font-black text-sm">NK</span></div>'; }}
              />
            </div>
            <div className="leading-tight">
              <p className={`font-black text-sm tracking-tight transition-colors ${
                scrolled ? 'text-gray-900' : 'text-white'
              }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                न्यू कोशी सुपर यातायात
              </p>
              <p className={`text-xs font-medium transition-colors ${
                scrolled ? 'text-blue-600' : 'text-amber-300'
              }`}>
                प्रा. लि. · Dharan-8, Sunsari
              </p>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive(link.to)
                    ? scrolled
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-white/15 text-white'
                    : scrolled
                      ? 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Auth Area ── */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative" id="user-menu">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl transition-all duration-200 ${
                    scrolled
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500
                                  flex items-center justify-center text-white font-bold text-xs shadow">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold">{user.name.split(' ')[0]}</span>
                  <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl
                                  border border-gray-100 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                    </div>
                    {isAdmin() && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700
                                   hover:bg-blue-50 hover:text-blue-700 transition-colors">
                        <svg className="w-4 h-4 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Admin Dashboard
                      </Link>
                    )}
                    <Link to="/my-bookings" onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700
                                 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                      <svg className="w-4 h-4 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      My Bookings
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-red-600
                                 hover:bg-red-50 transition-colors">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login"
                  className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                    scrolled ? 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
                             : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}>
                  Sign In
                </Link>
                <Link to="/register" className="btn-gold text-sm py-2 px-5">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div className={`md:hidden pb-4 pt-2 border-t animate-fade-in ${
            scrolled ? 'border-gray-100' : 'border-white/10'
          }`}>
            <div className="space-y-1 mb-3">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive(link.to)
                      ? scrolled ? 'bg-blue-50 text-blue-700' : 'bg-white/15 text-white'
                      : scrolled ? 'text-gray-700 hover:bg-gray-50' : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}>
                  {link.label}
                </Link>
              ))}
            </div>
            <hr className={scrolled ? 'border-gray-100 mb-3' : 'border-white/10 mb-3'} />
            {user ? (
              <>
                <div className={`px-4 py-2 mb-2 rounded-xl text-sm ${
                  scrolled ? 'bg-gray-50 text-gray-700' : 'bg-white/10 text-white'
                }`}>
                  👤 {user.name}
                </div>
                {isAdmin() && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-semibold mb-1 ${
                      scrolled ? 'text-blue-700 hover:bg-blue-50' : 'text-amber-300 hover:bg-white/10'
                    }`}>
                    Admin Dashboard
                  </Link>
                )}
                <Link to="/my-bookings" onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-semibold mb-1 ${
                    scrolled ? 'text-gray-700 hover:bg-gray-50' : 'text-blue-100 hover:bg-white/10'
                  }`}>
                  My Bookings
                </Link>
                <button onClick={handleLogout}
                  className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50">
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-1">
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className={`flex-1 text-center py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                    scrolled ? 'border-gray-200 text-gray-700 hover:bg-gray-50'
                             : 'border-white/20 text-white hover:bg-white/10'
                  }`}>
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold
                             bg-gradient-to-r from-amber-400 to-orange-400 text-gray-900 hover:from-amber-500 hover:to-orange-500">
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
