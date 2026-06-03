import React, { useState } from 'react';
import { LOGO_URL } from '../utils/constants';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.phone) {
      toast.error('Please fill in all fields'); return;
    }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      setRegisteredEmail(form.email);
      setRegistered(true);
      toast.success('Registration successful! Check your email 📧');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const handleResendVerification = async () => {
    setResending(true);
    try {
      const res = await api.post('/auth/resend-verification', { email: registeredEmail });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend verification email');
    } finally { setResending(false); }
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
          </div>
          <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {registered ? 'Check Your Email' : 'Create Account'}
          </h1>
          <p className="text-blue-200">
            {registered ? 'न्यू कोशी सुपर यातायात प्रा. लि.' : 'Join New Koshi A/C Yatayat today'}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in-up delay-100">
          {registered ? (
            // Email Verification Message
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Verify Your Email</h2>
              
              <p className="text-gray-600 mb-2">
                We've sent a verification link to:
              </p>
              <p className="font-semibold text-blue-600 mb-6">{registeredEmail}</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-800 mb-2">Next Steps:</h3>
                <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Check your inbox (and spam folder)</li>
                  <li>Click the verification link in the email</li>
                  <li>Return here to log in</li>
                </ol>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-amber-800 text-sm">
                  ⏰ The verification link expires in 24 hours
                </p>
              </div>

              <button
                onClick={handleResendVerification}
                disabled={resending}
                className="w-full mb-3 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {resending ? (
                  <>
                    <div className="spinner w-5 h-5 border-blue-600" />
                    <span>Sending...</span>
                  </>
                ) : (
                  'Resend Verification Email'
                )}
              </button>

              <Link 
                to="/login" 
                className="block w-full btn-primary py-3 text-center"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            // Registration Form
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
          )}

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



