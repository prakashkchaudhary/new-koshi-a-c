import React, { useState } from 'react';
import { LOGO_URL } from '../utils/constants';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.phone) {
      toast.error('Please fill in all fields'); return;
    }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.user, res.data.token);
      toast.success('Account created! Welcome 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-24 h-24 rounded-2xl overflow-hidden
                          mx-auto mb-4 shadow-2xl shadow-blue-900/50">
            <img
              src={LOGO_URL}
              alt="New Koshi Logo"
              className="w-full h-full object-cover"
              onError={e => { e.target.onerror=null; e.target.parentNode.innerHTML='<div class="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center"><span class="text-white font-black text-2xl">NK</span></div>'; }}
            />
              onError={e => { e.target.onerror=null; e.target.parentNode.innerHTML='<div class="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center"><span class="text-white font-black text-2xl">NK</span></div>'; }}
            />
          </div>
          <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Create Account
          </h1>
          <p className="text-blue-200">Join New Koshi A/C Yatayat today</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in-up delay-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input type="text" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Ram Bahadur Thapa" className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com" className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input type="tel" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="+977 98XX-XXXXXX" className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters" className="input-field pr-12" required minLength={6} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-4 text-base justify-center flex items-center gap-2 disabled:opacity-60 mt-2">
              {loading ? (
                <><div className="spinner w-5 h-5" /><span>Creating account...</span></>
              ) : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:text-blue-800">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;



