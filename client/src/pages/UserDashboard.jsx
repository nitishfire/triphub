import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { PageSpinner } from '../components/Spinner';
import toast from 'react-hot-toast';

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80'
];

const TYPE_COLORS = {
  Single: 'from-sky-500 to-cyan-500',
  Double: 'from-violet-500 to-purple-500',
  Suite: 'from-amber-500 to-orange-500',
  Deluxe: 'from-rose-500 to-pink-500'
};

function getRoomImage(room, idx) {
  if (room.imageUrl) return room.imageUrl;
  let hash = 0;
  if (room._id) {
    for (let i = 0; i < room._id.length; i++) {
      hash = ((hash << 5) - hash) + room._id.charCodeAt(i);
      hash |= 0;
    }
  }
  return DEFAULT_IMAGES[Math.abs(hash || idx) % DEFAULT_IMAGES.length];
}

export default function UserDashboard() {
  const { auth, userBalance, updateUserBalance } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filters, setFilters] = useState({ city: '', roomType: '', capacity: '', minPrice: '', maxPrice: '' });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await api.get('/hotels/rooms');
      setRooms(res.data);
    } catch {
      toast.error('Failed to load rooms');
    }
  }, []);

  const fetchBalance = useCallback(async () => {
    try {
      const res = await api.get('/bookings/mine');
      updateUserBalance(res.data.balance);
    } catch {}
  }, [updateUserBalance]);

  useEffect(() => {
    Promise.all([fetchRooms(), fetchBalance()]).finally(() => setLoading(false));
  }, [fetchRooms, fetchBalance]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.roomType) params.append('roomType', filters.roomType);
      if (filters.capacity) params.append('capacity', filters.capacity);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      const query = params.toString();
      const url = query ? '/hotels/rooms/search?' + query : '/hotels/rooms';
      const res = await api.get(url);
      setRooms(res.data);
    } catch {
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleTypeFilter = (type) => {
    setActiveFilter(type);
    if (type === 'all') {
      setLoading(true);
      fetchRooms().finally(() => setLoading(false));
    } else {
      setSearching(true);
      api.get('/hotels/rooms/search?roomType=' + type)
        .then(res => setRooms(res.data))
        .catch(() => toast.error('Filter failed'))
        .finally(() => setSearching(false));
    }
  };

  const handleClear = () => {
    setFilters({ city: '', roomType: '', capacity: '', minPrice: '', maxPrice: '' });
    setActiveFilter('all');
    setLoading(true);
    fetchRooms().finally(() => setLoading(false));
  };

  if (loading) return <PageSpinner />;

  const typeFilters = ['all', 'Single', 'Double', 'Suite', 'Deluxe'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-indigo-200 text-sm font-semibold tracking-widest uppercase mb-2">Welcome back, {auth?.name}</p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Find Your Stay</h1>
              <p className="mt-3 text-indigo-100 text-lg max-w-lg">
                Discover premium rooms from our curated collection of verified properties
              </p>
            </div>
            <div className="glass rounded-2xl px-8 py-5 min-w-[220px] backdrop-blur-xl border border-white/20 shadow-2xl">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Wallet Balance</p>
              <p className="text-3xl font-extrabold text-white mt-1">{'\u20B9'}{userBalance.toLocaleString()}</p>
              <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000" style={{ width: Math.min(100, (userBalance / 50000) * 100) + '%' }} />
              </div>
              <p className="text-white/40 text-xs mt-1">{Math.round((userBalance / 50000) * 100)}% of bonus remaining</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 border border-gray-100 overflow-hidden mb-8">
          <form onSubmit={handleSearch}>
            <div className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-[15px] bg-gray-50 focus:bg-white"
                    placeholder="Search by city or location..."
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  />
                </div>
                <div className="sm:w-44">
                  <select
                    className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-[15px] bg-gray-50 focus:bg-white"
                    value={filters.roomType}
                    onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
                  >
                    <option value="">Room Type</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Suite">Suite</option>
                    <option value="Deluxe">Deluxe</option>
                  </select>
                </div>
                <div className="sm:w-40">
                  <select
                    className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-[15px] bg-gray-50 focus:bg-white"
                    value={filters.capacity}
                    onChange={(e) => setFilters({ ...filters, capacity: e.target.value })}
                  >
                    <option value="">Guests</option>
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4+ Guests</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={searching} className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2">
                    {searching ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={'border-2 px-4 py-3.5 rounded-2xl transition-all duration-200 ' + (showAdvanced ? 'border-indigo-500 text-indigo-600 bg-indigo-50' : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-gray-50')}
                    title="Advanced filters"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </button>
                </div>
              </div>

              {showAdvanced && (
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-3 animate-slide-down">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Min Price (Rs.)</label>
                    <input
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm bg-gray-50"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Max Price (Rs.)</label>
                    <input
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm bg-gray-50"
                      placeholder="50000"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    />
                  </div>
                  <div className="flex items-end">
                    <button type="button" onClick={handleClear} className="w-full border-2 border-gray-200 text-gray-600 font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-all text-sm">
                      Clear All
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 sm:px-6 pb-5 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider shrink-0">Filter:</span>
              {typeFilters.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeFilter(type)}
                  className={'shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ' + (activeFilter === type ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
                >
                  {type === 'all' ? 'All Rooms' : type}
                </button>
              ))}
            </div>
          </form>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Available Rooms</h2>
          <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
            {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'} found
          </span>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700">No rooms available</h3>
            <p className="text-gray-400 mt-2 max-w-sm mx-auto">Try adjusting your search filters or check back later</p>
            <button onClick={handleClear} className="mt-6 btn-primary text-sm px-6">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-16">
            {rooms.map((room, idx) => {
              const imgUrl = getRoomImage(room, idx);
              const gradientClass = TYPE_COLORS[room.roomType] || 'from-gray-500 to-slate-500';
              return (
                <div
                  key={room._id}
                  className="opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards] cursor-pointer group"
                  style={{ animationDelay: (idx % 9) * 60 + 'ms' }}
                  onClick={() => navigate('/room/' + room._id)}
                >
                  <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 border border-gray-100 hover:-translate-y-1">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={imgUrl}
                        alt={room.roomType + ' Room'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute top-4 right-4">
                        <span className="bg-black/40 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
                          {'\u20B9'}{room.pricePerNight?.toLocaleString()}/night
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <span className={'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r shadow-lg ' + gradientClass}>
                          {room.roomType}
                        </span>
                        <span className="bg-white/95 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                          {room.capacity} {room.capacity > 1 ? 'Guests' : 'Guest'}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{room.name}</h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-4">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {room.address}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Room #{room.roomNumber}</p>
                          <p className="text-2xl font-extrabold gradient-text">{'\u20B9'}{room.pricePerNight?.toLocaleString()}</p>
                        </div>
                        <span className="flex items-center gap-1.5 text-indigo-600 font-bold text-sm group-hover:gap-2.5 transition-all">
                          View Details
                          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
