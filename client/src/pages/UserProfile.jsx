import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { PageSpinner } from '../components/Spinner';
import toast from 'react-hot-toast';

export default function UserProfile() {
  const { auth } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/user-stats')
      .then(res => setStats(res.data))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;

  const profileData = stats || {};
  const displayName = profileData.name || auth?.name || 'User';
  const displayUsername = profileData.username || auth?.username || '';
  const displayEmail = profileData.email || auth?.email || '';
  const displayPhone = profileData.phone || auth?.phone || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-6 shadow-2xl border border-white/30 rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="text-white text-5xl font-extrabold">{displayName[0].toUpperCase()}</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">{displayName}</h1>
            <p className="text-indigo-200 text-lg mt-1">@{displayUsername}</p>
            <span className="mt-3 inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm border border-white/20">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
              Active User
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            {
              label: 'Wallet Balance',
              value: 'Rs. ' + (profileData.balance || 0).toLocaleString(),
              gradient: 'from-emerald-500 to-teal-600',
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              )
            },
            {
              label: 'Total Bookings',
              value: profileData.totalBookings || 0,
              gradient: 'from-blue-500 to-indigo-600',
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )
            },
            {
              label: 'Total Spent',
              value: 'Rs. ' + (profileData.totalSpent || 0).toLocaleString(),
              gradient: 'from-violet-500 to-purple-600',
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              )
            }
          ].map((card) => (
            <div key={card.label} className={'rounded-2xl p-6 text-white bg-gradient-to-br shadow-xl ' + card.gradient}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  {card.icon}
                </div>
              </div>
              <p className="text-white/70 text-sm font-semibold">{card.label}</p>
              <p className="text-2xl font-extrabold mt-1">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
            <p className="text-gray-500 text-sm mt-1">Your personal details and account info</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-8">
            {[
              { label: 'Full Name', value: displayName, icon: '👤' },
              { label: 'Username', value: '@' + displayUsername, icon: '🏷️' },
              { label: 'Email Address', value: displayEmail || 'Not provided', icon: '✉️' },
              { label: 'Phone Number', value: displayPhone || 'Not provided', icon: '📱' }
            ].map((item) => (
              <div key={item.label} className="group bg-gray-50 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 rounded-xl p-5 transition-all duration-300 border border-transparent hover:border-indigo-100">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">{item.icon}</span>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{item.label}</p>
                </div>
                <p className="text-gray-900 font-bold text-lg pl-8">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            to="/dashboard"
            className="btn-primary flex-1 text-center py-4 text-base font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Hotels
          </Link>
          <Link
            to="/bookings"
            className="btn-secondary flex-1 text-center py-4 text-base font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}