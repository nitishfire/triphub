import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { PageSpinner } from '../components/Spinner';
import toast from 'react-hot-toast';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80';

const TYPE_COLORS = {
  Single: 'from-sky-500 to-cyan-500',
  Double: 'from-violet-500 to-purple-500',
  Suite: 'from-amber-500 to-orange-500',
  Deluxe: 'from-rose-500 to-pink-500'
};

export default function BookedRoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    api.get('/bookings/' + id + '/details')
      .then(res => setRoom(res.data))
      .catch((err) => {
        const msg = err.response?.data?.message || err.message || 'Booking not found';
        toast.error(msg);
        setTimeout(() => navigate(-1), 1500);
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <PageSpinner />;
  if (!room) return null;

  const images = (room.images && room.images.length > 0) ? room.images : [DEFAULT_IMAGE];
  const gradientClass = TYPE_COLORS[room.roomType] || 'from-gray-500 to-slate-500';

  return (
    <div className="min-h-screen bg-gray-50 pt-[68px]">
      <div className="relative h-[45vh] min-h-[300px] bg-black">
        <img src={images[currentImg]} alt="Room" className="w-full h-full object-cover opacity-80 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
        
        <div className="absolute top-6 left-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back
          </button>
        </div>

        {images.length > 1 && (
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-6 pointer-events-none">
            <button onClick={() => setCurrentImg(Math.max(0, currentImg - 1))} disabled={currentImg === 0} className="w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/60 transition-colors pointer-events-auto disabled:opacity-30 disabled:cursor-not-allowed">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => setCurrentImg(Math.min(images.length - 1, currentImg + 1))} disabled={currentImg === images.length - 1} className="w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/60 transition-colors pointer-events-auto disabled:opacity-30 disabled:cursor-not-allowed">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button key={i} onClick={() => setCurrentImg(i)} className={'w-2.5 h-2.5 rounded-full transition-all ' + (i === currentImg ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80')} />
            ))}
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative -top-24">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 border border-gray-100/50">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <span className={'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r mb-3 ' + gradientClass}>
                    {room.roomType} Room
                  </span>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{room.name}</h1>
                  <p className="text-gray-500 flex items-center gap-2 mt-2">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                    {room.address}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-gray-100">
                {[
                  { label: 'Room Number', value: '#' + room.roomNumber, icon: '🚪' },
                  { label: 'Capacity', value: room.capacity + ' Guests', icon: '👥' },
                  { label: 'Stay Duration', value: room.availableDays + ' days', icon: '📅' },
                  { label: 'Contact', value: room.phone, icon: '📞' }
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-2xl p-4 text-center">
                    <span className="text-2xl block mb-2">{item.icon}</span>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{item.label}</p>
                    <p className="text-sm font-extrabold text-gray-800 mt-1">{item.value}</p>
                  </div>
                ))}
              </div>

              {room.description && (
                <div className="mt-8">
                  <h2 className="text-xl font-extrabold text-gray-900 mb-4">About This Room</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{room.description}</p>
                </div>
              )}
            </div>

            {room.amenities && room.amenities.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50">
                <h2 className="text-xl font-extrabold text-gray-900 mb-5">Amenities & Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {room.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-1 relative overflow-hidden shadow-2xl shadow-indigo-900/20">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <div className="bg-white rounded-[22px] p-6 relative z-10">
                <div className="inline-flex items-center justify-center w-full px-4 py-2 bg-emerald-50 text-emerald-700 font-black tracking-widest uppercase rounded-xl border border-emerald-100 mb-6 gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Already Booked
                </div>

                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Guest Name</span>
                    <span className="font-extrabold text-gray-900">{room.guestName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Booking ID</span>
                    <span className="font-mono font-bold text-gray-800 text-xs bg-gray-100 px-2 py-1 rounded">{room.bookingId.substring(0,8)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Payment Status</span>
                    <span className="font-extrabold text-emerald-600">{room.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 bg-indigo-50/50 p-3 rounded-xl border border-indigo-50">
                    <span className="text-indigo-900 font-bold">Total Paid</span>
                    <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{'\u20B9'}{room.pricePerNight?.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-xs text-center text-gray-400 font-medium px-4">This room is currently active under your bookings. You can cancel it from the My Bookings page.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
