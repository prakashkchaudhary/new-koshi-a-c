import React from 'react';
import { LOGO_URL } from '../utils/constants';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Top wave */}
      <div className="bg-gray-50">
        <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0L1440 0L1440 20C1200 40 960 0 720 20C480 40 240 0 0 20L0 0Z"
                fill="#030712" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                <img
                  src={LOGO_URL}
                  alt="New Koshi Logo"
                  className="w-full h-full object-cover"
                  onError={e => { e.target.onerror=null; e.target.parentNode.innerHTML='<div class="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center"><span class="text-white font-black text-xl">NK</span></div>'; }}
                />
              </div>
              <div>
                <p className="text-white font-black text-base leading-tight"
                   style={{ fontFamily: 'Poppins, sans-serif' }}>न्यू कोशी सुपर यातायात</p>
                <p className="text-amber-400 text-xs font-semibold">प्रा. लि. | Dharan-8, Sunsari</p>
                <p className="text-gray-500 text-xs mt-0.5">पिण्डेश्वरी दर्शन</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-sm">
              Nepal's trusted AC bus service connecting Dharan, Sunsari to Kathmandu and beyond.
              Safe, comfortable, and reliable travel since 2010.
            </p>
            {/* Social */}
            <div className="flex space-x-3">
              {[
                { name: 'Facebook', icon: 'f', href: 'https://facebook.com' },
                { name: 'Instagram', icon: 'in', href: 'https://instagram.com' },
              ].map(s => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                   aria-label={s.name}
                   className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center
                              text-xs font-bold text-gray-400 hover:bg-blue-600 hover:text-white
                              transition-all duration-200">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/',          label: 'Home' },
                { to: '/about',     label: 'About Us' },
                { to: '/buses',     label: 'Our Buses' },
                { to: '/contact',   label: 'Contact' },
                { to: '/register',  label: 'Register' },
                { to: '/login',     label: 'Sign In' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to}
                    className="text-sm text-gray-400 hover:text-amber-400 transition-colors
                               flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-amber-400 transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-amber-400 mt-0.5 flex-shrink-0">📍</span>
                <span className="text-sm">Head Office, Dharan-8, Sunsari, Nepal</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-400 flex-shrink-0">📞</span>
                <a href="tel:+9779814757612" className="text-sm hover:text-amber-400 transition-colors">
                  +977 9814757612
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-400 flex-shrink-0">✉️</span>
                <a href="mailto:newkoshiac@gmail.com"
                   className="text-sm hover:text-amber-400 transition-colors">
                  newkoshiac@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-400 flex-shrink-0">🕐</span>
                <span className="text-sm">Sun–Fri: 6:00 AM – 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Routes strip */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Our Routes</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Kathmandu → Dharan (Night)',
              'Dharan → Kathmandu (Night)',
              'KTM → Dharan via Sindhuli (Day)',
              'Dharan → KTM via Sindhuli (Day)',
              'Night Deluxe via Sindhuli',
            ].map(r => (
              <span key={r}
                className="text-xs bg-gray-800 text-gray-400 px-3 py-1.5 rounded-full
                           border border-gray-700 hover:border-amber-500 hover:text-amber-400
                           transition-colors cursor-default">
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row
                        justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} New Koshi A/C Yatayat Pvt. Ltd. All rights reserved.</p>
          <p>🇳🇵 Proudly serving Nepal · Safe Travel · Comfortable Journey</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

