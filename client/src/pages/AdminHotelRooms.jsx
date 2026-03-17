import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { PageSpinner } from '../components/Spinner';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80';

const TYPE_COLORS = {
  Single: 'from-blue-500 to-cyan-500',
  Double: 'from-violet-500 to-purple-500',
  Suite: 'from-amber-500 to-orange-500',
  Deluxe: 'from-rose-500 to-pink-500'
};

export default function AdminHotelRooms() {
  const { hotelId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [hotelName, setHotelName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/hotels/' + hotelId + '/rooms'),
      api.get('/admin/hotels')
    ]).then(([roomsRes, hotelsRes]) => {
      setRooms(roomsRes.data);
      const hotel = hotelsRes.data.find(h => h.hotelId === hotelId);
      if (hotel) setHotelName(hotel.name);
    }).finally(() => setLoading(false));
  }, [hotelId]);

  if (loading) return <PageSpinner />;

  return (
    <div className="min-h-screen bg-slate-50 pt-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-br from-violet-900 via-indigo-900 to-blue-900 z-0 rounded-b-[3rem] shadow-2xl" />
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute top-10 -right-24 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="pt-6 pb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/20 backdrop-blur-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <div>
              <p className="text-violet-200 text-xs font-bold uppercase tracking-widest mb-1">Active Room Listings</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{hotelName || hotelId}</h1>
              <p className="text-violet-200 text-sm mt-0.5">{rooms.length} room{rooms.length !== 1 ? 's' : ''} listed</p>
            </div>
          </div>
          <Link to={'/admin/hotels/' + hotelId + '/bookings'} className="flex items-center gap-2 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white font-bold px-5 py-3 rounded-2xl border border-white/20 transition-all text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" /></svg>
            View Bookings
          </Link>
        </div>

        <div className="-mt-8 pb-12">
          {rooms.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center shadow-xl border border-gray-100">
              <div className="w-24 h-24 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">🛏️</div>
              <h3 className="text-xl font-bold text-gray-900">No rooms listed</h3>
              <p className="text-gray-500 mt-2">This hotel has no active room listings</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {rooms.map((room, idx) => {
                const img = (room.images && room.images.length > 0) ? room.images[0] : DEFAULT_IMAGE;
                const gradClass = TYPE_COLORS[room.roomType] || 'from-gray-500 to-slate-500';
                return (
                  <div key={room._id} className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 opacity-0 animate-[fadeInUp_0.4s_ease-out_forwards]" style={{ animationDelay: idx * 60 + 'ms' }}>
                    <div className="relative h-52">
                      <img src={img} alt={room.name} className="w-full h-full object-cover" onError={e => { e.target.src = DEFAULT_IMAGE; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className={'absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r shadow-lg ' + gradClass}>
                        {room.roomType}
                      </span>
                      {room.images && room.images.length > 1 && (
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                          +{room.images.length - 1} photos
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-bold text-white text-lg leading-tight drop-shadow-lg">{room.name}</h3>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-2 gap-2.5 mb-4">
                        {[
                          { l: 'Room No.', v: '#' + room.roomNumber },
                          { l: 'Capacity', v: room.capacity + ' guests' },
                          { l: 'Available', v: room.availableDays + ' days' },
                          { l: 'Price/Night', v: '\u20B9' + (room.pricePerNight || 0).toLocaleString() }
                        ].map(({ l, v }) => (
                          <div key={l} className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{l}</p>
                            <p className="text-sm font-bold text-gray-800 mt-0.5">{v}</p>
                          </div>
                        ))}
                      </div>
                      {room.amenities && room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
                          {room.amenities.slice(0, 3).map(a => (
                            <span key={a} className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">{a}</span>
                          ))}
                          {room.amenities.length > 3 && (
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md">+{room.amenities.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
