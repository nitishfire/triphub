import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function RegisterPage() {
  const [form, setForm] = useState({ fullname: '', username: '', email: '', phone: '', pswd: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullname || !form.username || !form.email || !form.phone || !form.pswd)
      return toast.error('Please fill all fields');
    if (form.phone.length !== 10) return toast.error('Phone number must be exactly 10 digits');
    if (form.pswd.length < 8) return toast.error('Password must be at least 8 characters');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      toast.success('Account created! Please sign in.');
      setRedirecting(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Full Name', field: 'fullname', type: 'text', placeholder: 'John Doe', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { label: 'Username', field: 'username', type: 'text', placeholder: 'johndoe123', icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Email Address', field: 'email', type: 'email', placeholder: 'john@email.com', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { label: 'Phone Number', field: 'phone', type: 'tel', placeholder: '9876543210', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
  ];

  return (
    <div className="flex mt-[68px] h-[calc(100vh-68px)] overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80"
          alt="Hotel Room"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/90 via-purple-800/80 to-indigo-900/90" />
        <div className="relative z-10 flex flex-col justify-end p-12 w-full pb-16">
          <div className="max-w-md mb-auto mt-auto">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                  <span className="text-2xl">🎁</span>
                </div>
                <div>
                  <p className="text-emerald-300 text-xs font-bold uppercase tracking-wider">Welcome Bonus</p>
                  <p className="text-white font-extrabold text-3xl">Rs. 50,000</p>
                  <p className="text-indigo-200 text-sm">Added to your wallet instantly</p>
                </div>
              </div>
            </div>

            <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6">
              Start your journey with us
            </h2>
            <p className="text-indigo-200 text-lg leading-relaxed mb-8">
              Join thousands of travelers who book premium stays through TripHub every day.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { num: '500+', label: 'Hotels' },
                { num: '2K+', label: 'Travelers' },
                { num: '4.9', label: 'Rating' }
              ].map(stat => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-center">
                  <p className="text-white font-extrabold text-xl">{stat.num}</p>
                  <p className="text-indigo-300 text-xs font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 text-indigo-300 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Free to join
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Rs. 50K bonus
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No hidden fees
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 w-full max-w-[440px] px-6 sm:px-8 py-10 animate-slide-up">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src="/logo.png" alt="TripHub" className="h-9" onError={(e) => { e.target.style.display = 'none'; }} />
            <span className="font-extrabold text-xl text-slate-800">TripHub</span>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Create account
            </h1>
            <p className="text-slate-500 text-base">
              Fill in your details to get started
            </p>
          </div>

          <div className="lg:hidden bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-lg">🎁</span>
            </div>
            <div>
              <p className="text-emerald-700 font-extrabold text-lg">Rs. 50,000 bonus</p>
              <p className="text-emerald-600/60 text-xs">Added to your wallet on signup</p>
            </div>
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
                    className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-[15px]"
                    placeholder={placeholder}
                    value={form[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                  />
                </div>
              </div>
            ))}

            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-12 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-[15px]"
                  placeholder="Min 8 characters"
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
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-[15px] mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create Account
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
              Already have an account?{' '}
              <Link to="/login" className="text-violet-600 font-bold hover:text-violet-500 transition-colors">
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
