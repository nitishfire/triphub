import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import { PageSpinner } from '../components/Spinner';
import toast from 'react-hot-toast';

const HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
];

function getHotelImage(hotel, idx) {
  let hash = 0;
  const str = hotel.hotelId || hotel.name || '';
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return HOTEL_IMAGES[Math.abs(hash || idx) % HOTEL_IMAGES.length];
}

const AVATAR_COLORS = [
  'from-indigo-500 to-violet-600',
  'from-rose-500 to-pink-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-blue-600',
  'from-fuchsia-500 to-purple-600',
];

function getUserColor(user, idx) {
  let hash = 0;
  const str = user.username || user.name || '';
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return AVATAR_COLORS[Math.abs(hash || idx) % AVATAR_COLORS.length];
}

export default function AdminDashboard() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [declineTarget, setDeclineTarget] = useState(null);
  const [activeTab, setActiveTab] = useState('hotels');

  const fetchData = async () => {
    try {
      const [hotelsRes, usersRes, statsRes] = await Promise.all([
        api.get('/admin/hotels'),
        api.get('/admin/users'),
        api.get('/admin/stats')
      ]);
      setHotels(hotelsRes.data);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDecline = async () => {
    try {
      await api.delete('/admin/hotels/' + declineTarget);
      toast.success('Hotel removed successfully');
      setHotels(prev => prev.filter(h => h.hotelId !== declineTarget));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setDeclineTarget(null);
    }
  };

  const toggleHotelStatus = async (e, hotelId) => {
    e.stopPropagation();
    try {
      const res = await api.put(`/admin/hotels/${hotelId}/toggle-active`);
      setHotels(prev => prev.map(h => h.hotelId === hotelId ? { ...h, active: res.data.active } : h));
      toast.success(`Hotel ${res.data.active ? 'activated' : 'suspended'}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const toggleUserStatus = async (e, userId) => {
    e.stopPropagation();
    try {
      const res = await api.put(`/admin/users/${userId}/toggle-active`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, active: res.data.active } : u));
      toast.success(`User ${res.data.active ? 'activated' : 'suspended'}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  if (loading) return <PageSpinner />;

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers || 0, icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    ), color: 'from-blue-600 to-indigo-600', bg: 'bg-blue-500/10', text: 'text-blue-600' },
    { label: 'Total Hotels', value: stats.totalHotels || 0, icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    ), color: 'from-violet-600 to-purple-600', bg: 'bg-violet-500/10', text: 'text-violet-600' },
    { label: 'Total Bookings', value: stats.totalBookings || 0, icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
    ), color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
    { label: 'Total Revenue', value: '\u20B9' + (stats.totalRevenue || 0).toLocaleString(), icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ), color: 'from-amber-500 to-orange-600', bg: 'bg-amber-500/10', text: 'text-amber-600' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-[28rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 z-0" />
      <div className="absolute top-0 left-0 w-full h-[28rem] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-[30rem] h-[30rem] bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-32 -right-32 w-[25rem] h-[25rem] bg-violet-500/15 rounded-full blur-3xl" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full">
          <div className="absolute top-8 left-1/4 w-1 h-1 bg-white/20 rounded-full" />
          <div className="absolute top-20 right-1/3 w-1.5 h-1.5 bg-white/10 rounded-full" />
          <div className="absolute top-40 left-1/2 w-1 h-1 bg-white/15 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pt-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <div>
                <p className="text-indigo-300 text-xs font-bold uppercase tracking-[0.2em]">Admin Control Panel</p>
                <p className="text-white/50 text-sm font-medium">Welcome back, {auth?.name}</p>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Network <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Overview</span>
            </h1>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-1.5 flex gap-1 border border-white/10 shadow-2xl">
            {[
              { key: 'hotels', label: 'Hotels', count: hotels.length, icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              )},
              { key: 'users', label: 'Customers', count: users.length, icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={"flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-300 " + (activeTab === tab.key ? 'bg-white text-slate-900 shadow-xl scale-105' : 'text-white/70 hover:text-white hover:bg-white/10')}>
                {tab.icon}
                {tab.label}
                <span className={"text-xs font-black px-1.5 py-0.5 rounded-md " + (activeTab === tab.key ? 'bg-indigo-100 text-indigo-700' : 'bg-white/10 text-white/70')}>{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map(({ label, value, icon, color, bg, text }, i) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100 hover:-translate-y-1 transition-all duration-300 opacity-0 animate-[fadeInUp_0.4s_ease-out_forwards]" style={{ animationDelay: i * 80 + 'ms' }}>
              <div className="flex items-center justify-between mb-3">
                <div className={"w-12 h-12 rounded-2xl flex items-center justify-center " + bg}>
                  <div className={text}>{icon}</div>
                </div>
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <p className="text-2xl font-black text-gray-900">{value}</p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Hotels Tab */}
        {activeTab === 'hotels' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Registered Hotels</h2>
              <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
                {hotels.length} partner{hotels.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {hotels.map((hotel, idx) => (
                <div key={hotel._id}
                  className={"bg-white rounded-[2rem] overflow-hidden shadow-lg border-2 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group cursor-pointer opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards] " + (hotel.active ? 'border-transparent hover:border-indigo-200' : 'border-red-200 bg-red-50/30')}
                  style={{ animationDelay: idx * 80 + 'ms' }}
                  onClick={() => navigate('/admin/hotels/' + hotel.hotelId + '/rooms')}
                >
                  {/* Hotel Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={getHotelImage(hotel, idx)}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <span className={"px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md " + (hotel.active ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white')}>
                        {hotel.active ? 'Active' : 'Suspended'}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-black text-white drop-shadow-lg leading-tight">{hotel.name}</h3>
                      <p className="text-white/80 text-xs font-medium mt-0.5 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                        {hotel.address}
                      </p>
                    </div>
                  </div>

                  {/* Hotel Info */}
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-2.5 mb-4">
                      <div className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Hotel ID</p>
                        <p className="text-sm font-bold text-indigo-600 font-mono mt-0.5">{hotel.hotelId}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Contact</p>
                        <p className="text-sm font-bold text-gray-800 mt-0.5">{hotel.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 mb-4">
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        Earnings
                      </span>
                      <span className="text-lg font-black text-emerald-700">{'\u20B9'}{(hotel.earnings || 0).toLocaleString()}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Link to={'/admin/hotels/' + hotel.hotelId + '/rooms'}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold py-2.5 transition-colors border border-indigo-100">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" /></svg>
                        Rooms
                      </Link>
                      <Link to={'/admin/hotels/' + hotel.hotelId + '/bookings'}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center gap-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-xl text-xs font-bold py-2.5 transition-colors border border-violet-100">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /></svg>
                        Bookings
                      </Link>
                      <div className="flex gap-1">
                        <button onClick={(e) => toggleHotelStatus(e, hotel.hotelId)}
                          className={"flex-1 rounded-xl text-xs font-bold py-2.5 transition-colors " + (hotel.active ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100')}>
                          {hotel.active ? 'Pause' : 'Go'}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setDeclineTarget(hotel.hotelId); }}
                          className="w-9 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors border border-red-100 shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {hotels.length === 0 && (
                <div className="col-span-full bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">No hotels registered</h3>
                  <p className="text-gray-500 mt-2">When hotel partners register, they will appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Registered Customers</h2>
              <span className="text-sm font-bold text-violet-600 bg-violet-50 px-4 py-2 rounded-full border border-violet-100">
                {users.length} customer{users.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {users.map((user, idx) => {
                const avatarColor = getUserColor(user, idx);
                return (
                  <div key={user._id}
                    className={"bg-white rounded-[2rem] overflow-hidden shadow-lg border-2 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group cursor-pointer opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards] " + (user.active ? 'border-transparent hover:border-indigo-200' : 'border-red-200 bg-red-50/30')}
                    style={{ animationDelay: idx * 80 + 'ms' }}
                    onClick={() => navigate('/admin/bookings/' + user.name)}
                  >
                    {/* User Header with Avatar */}
                    <div className="relative h-32 overflow-hidden">
                      <div className={"absolute inset-0 bg-gradient-to-br " + avatarColor + " opacity-90"} />
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAyMGgyMFYwSDB6TTIwIDIwaDIwVjBIMjB6TTAgNDBoMjBWMjBIMHpNMjAgNDBoMjBWMjBIMjB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-30" />
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <span className={"px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md " + (user.active ? 'bg-white/90 text-emerald-700' : 'bg-red-500/90 text-white')}>
                          {user.active ? 'Active' : 'Suspended'}
                        </span>
                        {user.type === 'admin' && (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-400/90 text-amber-900 backdrop-blur-md">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="absolute -bottom-8 left-5">
                        <div className={"w-16 h-16 rounded-2xl shadow-xl ring-4 ring-white overflow-hidden " + (!user.avatar ? "bg-gradient-to-br " + avatarColor + " flex items-center justify-center" : '')}>
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl font-black text-white">{(user.name || 'U')[0].toUpperCase()}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="p-5 pt-12">
                      <div className="mb-4">
                        <h3 className="text-xl font-black text-gray-900 leading-tight">{user.name}</h3>
                        <p className="text-indigo-600 text-sm font-bold mt-0.5">@{user.username}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 mb-4">
                        <div className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Email</p>
                          <p className="text-xs font-bold text-gray-700 mt-0.5 truncate">{user.email}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Phone</p>
                          <p className="text-sm font-bold text-gray-800 mt-0.5">{user.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-100 mb-4">
                        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                          Wallet
                        </span>
                        <span className="text-lg font-black text-indigo-700">{'\u20B9'}{(user.walletBalance || 0).toLocaleString()}</span>
                      </div>

                      <div className={"grid gap-2 " + (user.username === auth?.username ? 'grid-cols-1' : 'grid-cols-2')}>
                        {user.username !== auth?.username && (
                          <button onClick={(e) => toggleUserStatus(e, user._id)}
                            className={"rounded-xl text-xs font-bold py-2.5 transition-colors " + (user.active ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100')}>
                            {user.active ? 'Suspend' : 'Activate'}
                          </button>
                        )}
                        <Link to={'/admin/bookings/' + user.name}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold py-2.5 transition-colors border border-indigo-100">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /></svg>
                          Bookings
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
              {users.length === 0 && (
                <div className="col-span-full bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
                  <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">No users found</h3>
                  <p className="text-gray-500 mt-2">When customers register, they will appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!declineTarget}
        title="Remove Hotel?"
        message="This will permanently delete the hotel account and all associated room listings. This action is irreversible."
        confirmText="Yes, remove hotel"
        onConfirm={handleDecline}
        onCancel={() => setDeclineTarget(null)}
        danger={true}
      />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
