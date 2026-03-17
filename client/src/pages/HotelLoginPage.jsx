import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function HotelLoginPage() {
  const [form, setForm] = useState({ id: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const res = await api.post('/auth/hotel/login', form);
      login(res.data);
      toast.success('Welcome, ' + res.data.name + '!');
      setRedirecting(true);
      setTimeout(() => navigate('/hotel/dashboard'), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      if (msg === 'Hotel not found') {
        setTimeout(() => navigate('/hotel/register'), 2500);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex mt-[68px] h-[calc(100vh-68px)] overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&q=80"
          alt="Hotel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95" />
        <div className="relative z-10 flex flex-col justify-center p-12 w-full">
          <div className="max-w-md">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-700 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-black/40">
              <span className="text-3xl">🏨</span>
            </div>
            <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6">
              Hotel Management Portal
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-10">
              Access your hotel dashboard to manage rooms, track bookings, and grow your business.
            </p>
            <div className="space-y-4">
              {[
                { icon: '🛏️', text: 'Publish & manage rooms instantly' },
                { icon: '📋', text: 'View all guest reservations' },
                { icon: '💰', text: 'Track earnings in real-time' },
                { icon: '🔄', text: 'Cancel & process refunds easily' }
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-4 text-slate-300">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0 border border-white/10">
                    <span className="text-lg">{icon}</span>
                  </div>
                  <p className="text-sm font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-slate-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-100/60 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 w-full max-w-[440px] px-6 sm:px-8 py-12 animate-slide-up">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <img src="/logo.png" alt="TripHub" className="h-9" onError={(e) => { e.target.style.display = 'none'; }} />
            <span className="font-extrabold text-xl text-slate-800">TripHub</span>
          </div>

          <div className="mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center mb-5 shadow-lg">
              <span className="text-xl">🏨</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Hotel Sign In
            </h1>
            <p className="text-slate-500 text-base">
              Access your hotel management dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2">Hotel ID</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <input
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-500/10 focus:border-slate-500 transition-all text-[15px]"
                  placeholder="Enter your Hotel ID"
                  value={form.id}
                  onChange={e => setForm({ ...form, id: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-12 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-500/10 focus:border-slate-500 transition-all text-[15px]"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {redirecting ? (
              <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl py-4 flex items-center justify-center gap-3 text-emerald-700 mt-2">
                <span className="w-5 h-5 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin" />
                <span className="font-semibold text-[15px]">Redirecting to dashboard...</span>
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/20 hover:shadow-slate-900/30 transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-[15px] mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In to Dashboard
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                )}
              </button>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 space-y-3 text-center">
            <p className="text-slate-500 text-sm">
              New hotel?{' '}
              <Link to="/hotel/register" className="text-slate-700 font-bold hover:text-slate-900 transition-colors">
                Register here
              </Link>
            </p>
            <p className="text-slate-500 text-sm">
              Guest?{' '}
              <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-500 transition-colors">
                User login
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center lg:hidden">
            <Link to="/" className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors inline-flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
