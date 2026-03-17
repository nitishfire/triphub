import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import HotelCard from '../components/HotelCard';
import { PageSpinner } from '../components/Spinner';

const roomImages = [
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80',
];

function AnimatedCounter({ target, label, icon }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="text-center animate-fade-in">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-4xl sm:text-5xl font-extrabold text-white mb-1">
        {count.toLocaleString()}+
      </p>
      <p className="text-indigo-200 text-sm font-medium tracking-wide uppercase">{label}</p>
    </div>
  );
}

export default function LandingPage() {
  const [rooms, setRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalHotels: 0, totalRooms: 0, totalUsers: 0, totalBookings: 0 });
  const [search, setSearch] = useState({ city: '', roomtype: '', capacity: '' });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/hotels/rooms').then(res => {
      setRooms(res.data);
      setFiltered(res.data);
    }).finally(() => setLoading(false));

    api.get('/hotels/stats').then(res => setStats(res.data)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = [];
    if (search.city) q.push('city=' + encodeURIComponent(search.city));
    if (search.roomtype) q.push('roomType=' + encodeURIComponent(search.roomtype));
    if (search.capacity && search.capacity !== 'Any') q.push('capacity=' + encodeURIComponent(search.capacity));
    api.get('/hotels/rooms/search?' + q.join('&')).then(res => setFiltered(res.data));
  };

  const clearSearch = () => {
    setSearch({ city: '', roomtype: '', capacity: '' });
    setFiltered(rooms);
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="min-h-screen">
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-20 text-center w-full">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full mb-8">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">Hundreds of hotels available now</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Discover Your{' '}
              <span className="gradient-text">Perfect Stay</span>
            </h1>

            <p className="text-white/70 text-xl sm:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Browse and book unique accommodations across India. Trusted by thousands of travelers worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/register"
                className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105"
              >
                Get Started Free
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white glass rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <form onSubmit={handleSearch} className="glass-dark rounded-3xl p-6 sm:p-8 flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[160px]">
                <label className="block text-white/70 text-sm font-medium mb-2">City / Location</label>
                <input
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all"
                  placeholder="e.g. Mumbai, Goa..."
                  value={search.city}
                  onChange={e => setSearch({ ...search, city: e.target.value })}
                />
              </div>
              <div className="flex-1 min-w-[140px]">
                <label className="block text-white/70 text-sm font-medium mb-2">Room Type</label>
                <select
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all appearance-none cursor-pointer"
                  value={search.roomtype}
                  onChange={e => setSearch({ ...search, roomtype: e.target.value })}
                >
                  <option value="" className="bg-slate-900">All Types</option>
                  <option className="bg-slate-900">Single</option>
                  <option className="bg-slate-900">Double</option>
                  <option className="bg-slate-900">Suite</option>
                  <option className="bg-slate-900">Deluxe</option>
                </select>
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block text-white/70 text-sm font-medium mb-2">Capacity</label>
                <select
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all appearance-none cursor-pointer"
                  value={search.capacity}
                  onChange={e => setSearch({ ...search, capacity: e.target.value })}
                >
                  <option value="" className="bg-slate-900">Any</option>
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n} className="bg-slate-900">{n} Person{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-105"
                >
                  Search
                </button>
                {(search.city || search.roomtype || search.capacity) && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 transition-all"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      <div className="bg-gradient-to-b from-slate-950 to-slate-900 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
            <AnimatedCounter target={stats.totalHotels || 0} label="Total Hotels" icon="🏨" />
            <AnimatedCounter target={stats.totalRooms || 0} label="Available Rooms" icon="🛏️" />
            <AnimatedCounter target={stats.totalUsers || 0} label="Happy Guests" icon="😊" />
            <AnimatedCounter target={stats.totalBookings || 0} label="Bookings Made" icon="🌍" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-slate-900 to-gray-50 px-4 pt-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Featured <span className="gradient-text">Rooms</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Handpicked rooms from our best-rated hotels
            </p>
          </div>

          <div className="flex items-center justify-between mb-8">
            <p className="text-white/60 font-medium">{filtered.length} room{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="text-sm bg-amber-500/10 text-amber-300 border border-amber-500/20 px-4 py-2 rounded-xl font-medium backdrop-blur">
              Login to book a room
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="text-7xl mb-6">🏨</div>
              <h3 className="text-2xl font-bold text-white mb-3">No rooms found</h3>
              <p className="text-white/50 text-lg">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((room, index) => (
                <div key={room._id} className="relative group animate-fade-in" style={{ animationDelay: (index * 0.1) + 's' }}>
                  <div className="overflow-hidden rounded-2xl mb-0">
                    <img
                      src={roomImages[index % roomImages.length]}
                      alt={room.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <HotelCard room={room} showBookButton={false} />
                  <div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8 cursor-pointer"
                    onClick={() => navigate('/login')}
                  >
                    <Link
                      to="/login"
                      className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-6 py-3 rounded-xl shadow-2xl shadow-indigo-500/40 hover:scale-105 transition-transform"
                    >
                      Login to Book
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 animate-slide-up">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              Why <span className="gradient-text">TripHub</span>?
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Everything you need for a seamless hotel booking experience
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: '🔒',
                title: 'Secure Payments',
                desc: 'Your wallet is fully protected with end-to-end security. Instant refunds on any cancellation.',
                gradient: 'from-indigo-500 to-blue-500',
              },
              {
                icon: '🏨',
                title: 'Verified Hotels',
                desc: 'Every hotel is reviewed and verified by our admin team to ensure top quality stays.',
                gradient: 'from-violet-500 to-purple-500',
              },
              {
                icon: '⚡',
                title: 'Instant Booking',
                desc: 'Book your perfect room in seconds using your digital wallet. No waiting, no hassle.',
                gradient: 'from-amber-500 to-orange-500',
              },
            ].map((f, i) => (
              <div
                key={f.title}
                className="card text-center group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: (i * 0.15) + 's' }}
              >
                <div className={'w-16 h-16 bg-gradient-to-br ' + f.gradient + ' rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300'}>
                  {f.icon}
                </div>
                <h3 className="font-extrabold text-gray-900 text-xl mb-2">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
