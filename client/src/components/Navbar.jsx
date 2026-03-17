import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { auth, logout, isUser, isHotel, isAdmin, userBalance, userAvatar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const homeLink = isUser ? '/dashboard' : isHotel ? '/hotel/dashboard' : isAdmin ? '/admin' : '/';
  const isActive = (path) => location.pathname === path;

  const navLink = (path) =>
    'px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ' +
    (isActive(path)
      ? 'text-white bg-indigo-600 shadow-md shadow-indigo-500/25'
      : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50');

  const mobileNavLink = (path) =>
    'block px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ' +
    (isActive(path)
      ? 'text-white bg-indigo-600 shadow-md shadow-indigo-500/25'
      : 'text-slate-700 hover:text-indigo-600 hover:bg-indigo-50');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-slate-200/60 shadow-sm shadow-slate-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          <Link to={homeLink} className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <img src="/logo.png" alt="TripHub" className="h-9 w-auto transition-transform duration-300 group-hover:scale-110" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl items-center justify-center shadow-lg shadow-indigo-500/30 hidden">
                <span className="text-white font-bold text-sm">T</span>
              </div>
            </div>
            <span className="font-extrabold text-xl text-slate-800 tracking-tight">TripHub</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {!auth && (
              <>
                <Link to="/" className={navLink('/')}>Home</Link>
                <div className="w-px h-5 bg-slate-200 mx-1" />
                <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-indigo-600 border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-xl transition-all duration-200">
                  Sign In
                </Link>
                <Link to="/register" className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all duration-200">
                  Get Started
                </Link>
                <div className="w-px h-5 bg-slate-200 mx-1" />
                <Link to="/hotel/login" className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all duration-200">
                  Hotel Portal
                </Link>
              </>
            )}

            {isUser && (
              <>
                <Link to="/dashboard" className={navLink('/dashboard')}>Browse</Link>
                <Link to="/bookings" className={navLink('/bookings')}>My Bookings</Link>
                <Link to="/profile" className={navLink('/profile')}>Profile</Link>
                <div className="ml-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-extrabold shadow-lg shadow-emerald-500/25 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  {'\u20B9'}{userBalance.toLocaleString()}
                </div>
              </>
            )}

            {isHotel && (
              <>
                <Link to="/hotel/dashboard" className={navLink('/hotel/dashboard')}>Dashboard</Link>
                <Link to="/hotel/bookings" className={navLink('/hotel/bookings')}>Bookings</Link>
                <Link to="/hotel/profile" className={navLink('/hotel/profile')}>Profile</Link>
              </>
            )}

            {isAdmin && (
              <Link to="/admin" className={navLink('/admin')}>Dashboard</Link>
            )}

            {auth && (
              <div className="flex items-center gap-2 ml-2 pl-3 border-l border-slate-200">
                <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden shadow-md shadow-indigo-500/20 shrink-0">
                    {userAvatar && isUser ? (
                      <img src={userAvatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">{(auth.name || auth.username || '?')[0].toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider leading-none">{auth.type}</p>
                    <p className="text-sm font-bold text-slate-700 leading-tight">{auth.name || auth.username}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200" title="Sign Out">
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-5 pt-2 animate-slide-down border-t border-slate-100">
            <div className="flex flex-col gap-1">
              {!auth && (
                <>
                  <Link to="/" onClick={() => setMobileOpen(false)} className={mobileNavLink('/')}>Home</Link>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="text-center px-4 py-3 text-sm font-bold text-indigo-600 border-2 border-indigo-200 rounded-xl transition-all">
                      Sign In
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="text-center px-4 py-3 text-sm font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl shadow-md">
                      Get Started
                    </Link>
                  </div>
                  <div className="border-t border-slate-100 mt-3 pt-3">
                    <Link to="/hotel/login" onClick={() => setMobileOpen(false)} className={mobileNavLink('/hotel/login')}>Hotel Portal</Link>
                  </div>
                </>
              )}
              {isUser && (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className={mobileNavLink('/dashboard')}>Browse</Link>
                  <Link to="/bookings" onClick={() => setMobileOpen(false)} className={mobileNavLink('/bookings')}>My Bookings</Link>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className={mobileNavLink('/profile')}>Profile</Link>
                  <div className="mt-3 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-extrabold text-center shadow-lg shadow-emerald-500/20">
                    Wallet: {'\u20B9'}{userBalance.toLocaleString()}
                  </div>
                </>
              )}
              {isHotel && (
                <>
                  <Link to="/hotel/dashboard" onClick={() => setMobileOpen(false)} className={mobileNavLink('/hotel/dashboard')}>Dashboard</Link>
                  <Link to="/hotel/bookings" onClick={() => setMobileOpen(false)} className={mobileNavLink('/hotel/bookings')}>Bookings</Link>
                  <Link to="/hotel/profile" onClick={() => setMobileOpen(false)} className={mobileNavLink('/hotel/profile')}>Profile</Link>
                </>
              )}
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className={mobileNavLink('/admin')}>Dashboard</Link>
              )}
              {auth && (
                <div className="border-t border-slate-100 mt-3 pt-3">
                  <div className="flex items-center gap-3 px-4 py-2 mb-2">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shrink-0">
                      {userAvatar && isUser ? (
                        <img src={userAvatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                          <span className="text-white font-bold">{(auth.name || auth.username || '?')[0].toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{auth.type}</p>
                      <p className="text-sm font-bold text-slate-700">{auth.name || auth.username}</p>
                    </div>
                  </div>
                  <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="w-full text-left px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
