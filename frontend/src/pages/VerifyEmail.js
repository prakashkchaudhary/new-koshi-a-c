import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LOGO_URL } from '../utils/constants';
import api from '../utils/api';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your email...');
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState('');
  const [showResend, setShowResend] = useState(false);

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const res = await api.get(`/auth/verify-email/${token}`);
      setStatus('success');
      setMessage(res.data.message);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Email verification failed. The link may be expired or invalid.');
      setShowResend(true);
    }
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setResending(true);
    try {
      const res = await api.post('/auth/resend-verification', { email });
      toast.success(res.data.message);
      setEmail('');
      setShowResend(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-4 shadow-2xl shadow-blue-900/50">
            <img
              src={LOGO_URL}
              alt="New Koshi Logo"
              className="w-full h-full object-cover"
              onError={e => {
                e.target.onerror = null;
                e.target.parentNode.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center"><span class="text-white font-black text-2xl">NK</span></div>';
              }}
            />
          </div>
          <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Email Verification
          </h1>
          <p className="text-blue-200">New Koshi A/C Yatayat</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in-up delay-100">
          <div className="text-center">
            {/* Verifying State */}
            {status === 'verifying' && (
              <div className="py-8">
                <div className="spinner w-16 h-16 mx-auto mb-6 border-4 border-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying...</h2>
                <p className="text-gray-600">{message}</p>
              </div>
            )}

            {/* Success State */}
            {status === 'success' && (
              <div className="py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Email Verified! 🎉</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 text-sm">
                    Redirecting you to login in a few seconds...
                  </p>
                </div>
                <Link
                  to="/login"
                  className="btn-primary inline-flex items-center gap-2 px-8 py-3"
                >
                  Go to Login →
                </Link>
              </div>
            )}

            {/* Error State */}
            {status === 'error' && (
              <div className="py-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Verification Failed</h2>
                <p className="text-gray-600 mb-6">{message}</p>

                {showResend && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Resend Verification Email</h3>
                    <form onSubmit={handleResendVerification} className="space-y-4">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="input-field"
                        required
                      />
                      <button
                        type="submit"
                        disabled={resending}
                        className="btn-primary w-full py-3 justify-center flex items-center gap-2 disabled:opacity-60"
                      >
                        {resending ? (
                          <>
                            <div className="spinner w-5 h-5" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          'Resend Verification Email'
                        )}
                      </button>
                    </form>
                  </div>
                )}

                <div className="flex gap-3">
                  <Link
                    to="/register"
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Register Again
                  </Link>
                  <Link
                    to="/login"
                    className="flex-1 btn-primary px-6 py-3 text-center"
                  >
                    Go to Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
