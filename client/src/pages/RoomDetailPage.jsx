import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { PageSpinner } from '../components/Spinner';
import toast from 'react-hot-toast';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80';

const TYPE_COLORS = {
  Single: 'from-sky-500 to-cyan-500',
  Double: 'from-violet-500 to-purple-500',
  Suite: 'from-amber-500 to-orange-500',
  Deluxe: 'from-rose-500 to-pink-500'
};

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userBalance } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    api.get('/hotels/rooms/' + id)
      .then(res => setRoom(res.data))
      .catch(() => {
        toast.error('Room not found');
        navigate('/dashboard');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <PageSpinner />;
  if (!room) return null;

  const images = (room.images && room.images.length > 0) ? room.images : [DEFAULT_IMAGE];
  const gradientClass = TYPE_COLORS[room.roomType] || 'from-gray-500 to-slate-500';
  const canAfford = userBalance >= room.pricePerNight;

  return (
    <div className="min-h-screen bg-gray-50 pt-[68px]">
      <div className="relative h-[45vh] min-h-[300px] overflow-hidden bg-black">
        <img src={images[currentImg]} alt={room.roomType + ' Room'} className="w-full h-full object-cover opacity-90 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
        
        <div className="absolute top-6 left-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/20 transition-all border border-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
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
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button key={i} onClick={() => setCurrentImg(i)} className={'w-2 h-2 rounded-full transition-all ' + (i === currentImg ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80')} />
            ))}
          </div>
        )}

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className={'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r mb-3 ' + gradientClass}>
                {room.roomType} Room
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">{room.name}</h1>
              <p className="text-white/80 flex items-center gap-2 mt-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {room.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative -top-16">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Room Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Room Number', value: '#' + room.roomNumber, icon: '🚪' },
                  { label: 'Capacity', value: room.capacity + ' ' + (room.capacity > 1 ? 'Guests' : 'Guest'), icon: '👥' },
                  { label: 'Availability', value: room.availableDays + ' days', icon: '📅' },
                  { label: 'Contact', value: room.phone, icon: '📞' }
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-2xl p-4 text-center hover:bg-indigo-50 transition-colors">
                    <span className="text-2xl block mb-2">{item.icon}</span>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{item.label}</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">{item.value}</p>
                  </div>
                ))}
              </div>

              {room.description && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About This Property</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{room.description}</p>
                </div>
              )}
            </div>

            {room.amenities && room.amenities.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-5">Amenities & Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {room.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Room Type</span>
                  <span className="font-semibold text-gray-900">{room.roomType}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Guests</span>
                  <span className="font-semibold text-gray-900">{room.capacity}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Available</span>
                  <span className="font-semibold text-gray-900">{room.availableDays} days</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700 font-semibold">Total / Night</span>
                  <span className="text-2xl font-extrabold gradient-text">{'\u20B9'}{room.pricePerNight?.toLocaleString()}</span>
                </div>
              </div>

              <div className={'rounded-2xl p-4 mb-6 ' + (canAfford ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100')}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={'text-xs font-semibold uppercase tracking-wider ' + (canAfford ? 'text-emerald-600' : 'text-red-600')}>Your Wallet</p>
                    <p className={'text-xl font-extrabold ' + (canAfford ? 'text-emerald-700' : 'text-red-600')}>{'\u20B9'}{userBalance.toLocaleString()}</p>
                  </div>
                  {canAfford ? (
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                </div>
                {!canAfford && (
                  <p className="text-red-500 text-xs mt-2 font-medium">Insufficient balance. You need {'\u20B9'}{(room.pricePerNight - userBalance).toLocaleString()} more.</p>
                )}
              </div>

              <button
                onClick={() => navigate('/checkout/' + room._id)}
                disabled={!canAfford}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-base flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <Link to="/dashboard" className="mt-4 w-full text-center block text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors">
                Browse other rooms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
