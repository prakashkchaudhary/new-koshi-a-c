import React, { useState } from 'react';
import { LOGO_URL } from '../utils/constants';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}! 👋`);
      navigate(res.data.user.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* BG decorations */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-24 h-24 rounded-2xl overflow-hidden
                          mx-auto mb-4 shadow-2xl shadow-blue-900/50">
            <img
              src={LOGO_URL}
              alt="New Koshi Logo"
              className="w-full h-full object-cover"
              onError={e => { e.target.onerror=null; e.target.parentNode.innerHTML='<div class="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center"><span class="text-white font-black text-2xl">NK</span></div>'; }}
            />
          </div>
          <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Welcome Back
          </h1>
          <p className="text-blue-200">Sign in to your New Koshi account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in-up delay-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com" className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" className="input-field pr-12" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-4 text-base justify-center flex items-center gap-2 disabled:opacity-60">
              {loading ? (
                <><div className="spinner w-5 h-5" /><span>Signing in...</span></>
              ) : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:text-blue-800">
              Register here
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-5 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-xs font-bold text-blue-700 mb-2">🔑 Demo Credentials</p>
            <div className="space-y-1">
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Admin:</span> admin@busservice.com / admin123
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-semibold">User:</span> user@example.com / user123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;



