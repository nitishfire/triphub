import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import { PageSpinner } from '../components/Spinner';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { auth } = useAuth();
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

  const toggleHotelStatus = async (hotelId) => {
    try {
      const res = await api.put(`/admin/hotels/${hotelId}/toggle-active`);
      setHotels(prev => prev.map(h => h.hotelId === hotelId ? { ...h, active: res.data.active } : h));
      toast.success(`Hotel ${res.data.active ? 'activated' : 'suspended'}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const toggleUserStatus = async (userId) => {
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
    { label: 'Total Users', value: stats.totalUsers || 0, icon: '👥', color: 'from-blue-600 to-indigo-600', shadow: 'shadow-blue-500/30' },
    { label: 'Total Hotels', value: stats.totalHotels || 0, icon: '🏨', color: 'from-violet-600 to-purple-600', shadow: 'shadow-violet-500/30' },
    { label: 'Total Bookings', value: stats.totalBookings || 0, icon: '📋', color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/30' },
    { label: 'Total Revenue', value: '\u20B9' + (stats.totalRevenue || 0).toLocaleString(), icon: '💰', color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/30' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-br from-indigo-900 to-violet-900 z-0 rounded-b-[3rem] shadow-2xl opacity-90" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute top-32 -right-32 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pt-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">Admin Workspace</h1>
            <p className="text-indigo-100 font-medium mt-2 text-lg drop-shadow-sm">Welcome back, {auth?.name} \u2022 Monitoring network operations</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 flex gap-1 border border-white/20">
            {['hotels', 'users'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={"px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-300 " + (activeTab === tab ? 'bg-white text-indigo-900 shadow-lg scale-105' : 'text-indigo-50 hover:bg-white/10')}>
                {tab === 'hotels' ? 'Hotels (' + hotels.length + ')' : 'Users (' + users.length + ')'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map(({ label, value, icon, color, shadow }) => (
            <div key={label} className={"relative rounded-[2rem] p-6 text-white bg-gradient-to-br overflow-hidden shadow-xl " + color + " " + shadow + " transform hover:-translate-y-1 transition-transform duration-300"}>
              <div className="absolute -right-6 -top-6 text-9xl opacity-10">{icon}</div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mb-4 backdrop-blur-sm border border-white/10">{icon}</div>
                <p className="text-sm text-white/80 font-bold uppercase tracking-wider mb-1 mt-4">{label}</p>
                <p className="text-3xl font-black">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {activeTab === 'hotels' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {hotels.map(hotel => (
              <div key={hotel._id} className={"bg-white rounded-[2rem] p-6 shadow-xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col h-full " + (hotel.active ? 'border-transparent shadow-gray-200/50' : 'border-red-100 shadow-red-100/50 bg-red-50/30')}>
                <div className="flex items-start gap-4 mb-5">
                  <div className={"w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner " + (hotel.active ? 'bg-indigo-50 text-indigo-500' : 'bg-red-50 text-red-500')}>🏨</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-900 truncate pr-2">{hotel.name}</h3>
                      <span className={"px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0 " + (hotel.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700')}>
                        {hotel.active ? 'Active' : 'Suspended'}
                      </span>
                    </div>
                    <p className="text-indigo-600 font-mono text-xs font-bold mt-1 tracking-tight">ID: {hotel.hotelId}</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm mb-6 flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">📍</span>
                    <p className="text-gray-700 font-medium leading-tight">{hotel.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📞</span>
                    <p className="text-gray-700 font-bold">{hotel.phone}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200 mt-2">
                    <span className="text-gray-400">💰</span>
                    <p className="text-emerald-600 font-black text-lg">{'\u20B9'}{(hotel.earnings || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-auto">
                  <div className="grid grid-cols-2 gap-2">
                    <Link to={'/admin/hotels/' + hotel.hotelId + '/rooms'} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold py-2.5 text-center transition-colors">
                      View Rooms
                    </Link>
                    <Link to={'/admin/hotels/' + hotel.hotelId + '/bookings'} className="bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-xl text-xs font-bold py-2.5 text-center transition-colors">
                      Bookings
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => toggleHotelStatus(hotel.hotelId)} className={"rounded-xl text-xs font-bold py-2.5 transition-colors " + (hotel.active ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100')}>
                      {hotel.active ? 'Suspend' : 'Activate'}
                    </button>
                    <button onClick={() => setDeclineTarget(hotel.hotelId)} className="bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold py-2.5 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {hotels.length === 0 && (
              <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">🏢</div>
                <h3 className="text-xl font-bold text-gray-900">No hotels registered</h3>
                <p className="text-gray-500 mt-1">When partners register, they will appear here.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {users.map(user => (
              <div key={user._id} className={"bg-white rounded-[2rem] p-6 shadow-xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col h-full " + (user.active ? 'border-transparent shadow-gray-200/50' : 'border-red-100 shadow-red-100/50 bg-red-50/30')}>
                <div className="flex items-start gap-4 mb-5">
                  <div className={"w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 shadow-inner " + (user.active ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white' : 'bg-red-200 text-red-700')}>
                    {(user.name || 'U')[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-900 truncate pr-2">{user.name}</h3>
                      <span className={"px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0 " + (user.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700')}>
                        {user.active ? 'Active' : 'Suspended'}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center mt-1">
                      <p className="text-indigo-600 font-mono text-xs font-bold tracking-tight">@{user.username}</p>
                      {user.type === 'admin' && (
                        <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Admin</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm mb-6 flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">✉️</span>
                    <p className="text-gray-700 font-medium truncate">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📱</span>
                    <p className="text-gray-700 font-bold">{user.phone}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200 mt-2">
                    <span className="text-gray-400">💳</span>
                    <p className="text-gray-900 font-black text-lg">{'\u20B9'}{(user.walletBalance || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <button onClick={() => toggleUserStatus(user._id)} className={"flex-1 rounded-xl text-sm font-bold py-3 transition-colors " + (user.active ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100')}>
                     {user.active ? 'Suspend' : 'Activate'}
                  </button>
                  <Link to={'/admin/bookings/' + user.name} className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-bold py-3 text-center transition-colors">
                    View Bookings
                  </Link>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">👥</div>
                <h3 className="text-xl font-bold text-gray-900">No users found</h3>
              </div>
            )}
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
    </div>
  );
}
