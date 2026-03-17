import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function HotelRegisterPage() {
  const [form, setForm] = useState({ id: '', hname: '', adrs: '', phone: '', pswd: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id || !form.hname || !form.adrs || !form.phone || !form.pswd)
      return toast.error('Please fill all fields');
    if (form.phone.length !== 10) return toast.error('Phone number must be exactly 10 digits');
    if (form.pswd.length < 8) return toast.error('Password must be at least 8 characters');
    setLoading(true);
    try {
      await api.post('/auth/hotel/register', form);
      toast.success('Property registered! Please sign in.');
      setRedirecting(true);
      setTimeout(() => navigate('/hotel/login'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Property ID (unique)', field: 'id', type: 'text', placeholder: 'e.g. HOTEL001', icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2' },
    { label: 'Property Name', field: 'hname', type: 'text', placeholder: 'Grand Palace Hotel', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { label: 'City / Address', field: 'adrs', type: 'text', placeholder: 'Mumbai, Maharashtra', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
    { label: 'Contact Number (10 digits)', field: 'phone', type: 'tel', placeholder: '9876543210', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' }
  ];

  return (
    <div className="flex mt-[68px] h-[calc(100vh-68px)] overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"
          alt="Hotel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/85 to-slate-900/90" />
        <div className="relative z-10 flex flex-col justify-end p-12 w-full pb-16">
          <div className="max-w-md mb-auto mt-auto">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
                  <span className="text-2xl">💼</span>
                </div>
                <div>
                  <p className="text-amber-300 text-xs font-bold uppercase tracking-wider">Partner Benefit</p>
                  <p className="text-white font-extrabold text-2xl">Zero Commission</p>
                  <p className="text-slate-300 text-sm">Keep 100% of your earnings</p>
                </div>
              </div>
            </div>

            <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6">
              List Your Property on TripHub
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              Join hundreds of properties and reach thousands of travelers looking for their perfect stay.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { num: '500+', label: 'Properties' },
                { num: '2K+', label: 'Bookings' },
                { num: '4.8', label: 'Rating' }
              ].map(stat => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-center">
                  <p className="text-white font-extrabold text-xl">{stat.num}</p>
                  <p className="text-slate-400 text-xs font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-400 text-sm">
            {['Free to list', 'Instant payouts', 'Full control'].map(f => (
              <div key={f} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 relative overflow-y-auto overflow-x-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-slate-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-100/60 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 w-full max-w-[440px] px-6 sm:px-8 py-10 animate-slide-up">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src="/logo.png" alt="TripHub" className="h-9" onError={(e) => { e.target.style.display = 'none'; }} />
            <span className="font-extrabold text-xl text-slate-800">TripHub</span>
          </div>

          <div className="mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <span className="text-xl">🏨</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Register Property
            </h1>
            <p className="text-slate-500 text-base">
              Fill in your property details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ label, field, type, placeholder, icon }) => (
              <div key={field}>
                <label className="block text-slate-700 text-sm font-semibold mb-1.5">{label}</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                    </svg>
                  </div>
                  <input
                    type={type}
                    className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-500/10 focus:border-slate-500 transition-all text-[15px]"
                    placeholder={placeholder}
                    value={form[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                  />
                </div>
              </div>
            ))}

            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-1.5">Password (min 8 characters)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-12 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-500/10 focus:border-slate-500 transition-all text-[15px]"
                  placeholder="Create a strong password"
                  value={form.pswd}
                  onChange={e => setForm({ ...form, pswd: e.target.value })}
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
              <p className="text-slate-400 text-xs mt-1.5 ml-1">Must be at least 8 characters</p>
            </div>

            {redirecting ? (
              <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl py-4 flex items-center justify-center gap-3 text-emerald-700 mt-2">
                <span className="w-5 h-5 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin" />
                <span className="font-semibold text-[15px]">Taking you to sign in...</span>
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
                    Registering...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Register Property
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                )}
              </button>
            )}
          </form>

          <div className="mt-6 pt-5 border-t border-slate-200 text-center">
            <p className="text-slate-500 text-sm">
              Already registered?{' '}
              <Link to="/hotel/login" className="text-slate-700 font-bold hover:text-slate-900 transition-colors">
                Sign in
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
