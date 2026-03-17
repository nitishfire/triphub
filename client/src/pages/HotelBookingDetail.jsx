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

export default function HotelBookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    api.get('/bookings/hotel/' + id + '/details')
      .then(res => setBooking(res.data))
      .catch(() => {
        toast.error('Booking not found');
        navigate(-1);
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <PageSpinner />;
  if (!booking) return null;

  const images = (booking.images && booking.images.length > 0) ? booking.images : [DEFAULT_IMAGE];
  const gradientClass = TYPE_COLORS[booking.roomType] || 'from-gray-500 to-slate-500';

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
          <>
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-6 pointer-events-none">
              <button onClick={() => setCurrentImg(Math.max(0, currentImg - 1))} disabled={currentImg === 0} className="w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/60 transition-colors pointer-events-auto disabled:opacity-30 disabled:cursor-not-allowed">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={() => setCurrentImg(Math.min(images.length - 1, currentImg + 1))} disabled={currentImg === images.length - 1} className="w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/60 transition-colors pointer-events-auto disabled:opacity-30 disabled:cursor-not-allowed">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button key={i} onClick={() => setCurrentImg(i)} className={'w-2.5 h-2.5 rounded-full transition-all ' + (i === currentImg ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80')} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative -top-24">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 border border-gray-100/50">
              <div className="mb-6">
                <span className={'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r mb-3 ' + gradientClass}>
                  {booking.roomType} Room
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{booking.name}</h1>
                <p className="text-gray-500 flex items-center gap-2 mt-2">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                  {booking.address}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-gray-100">
                {[
                  { label: 'Room Number', value: '#' + booking.roomNumber, icon: '🚪' },
                  { label: 'Capacity', value: booking.capacity + ' Guests', icon: '👥' },
                  { label: 'Stay Duration', value: booking.availableDays + ' days', icon: '📅' },
                  { label: 'Contact', value: booking.phone, icon: '📞' }
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-2xl p-4 text-center">
                    <span className="text-2xl block mb-2">{item.icon}</span>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{item.label}</p>
                    <p className="text-sm font-extrabold text-gray-800 mt-1">{item.value}</p>
                  </div>
                ))}
              </div>

              {booking.description && (
                <div className="mt-8">
                  <h2 className="text-xl font-extrabold text-gray-900 mb-4">About This Room</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{booking.description}</p>
                </div>
              )}
            </div>

            {booking.amenities && booking.amenities.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50">
                <h2 className="text-xl font-extrabold text-gray-900 mb-5">Amenities & Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {booking.amenities.map(amenity => (
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
            <div className="bg-gradient-to-br from-violet-900 via-indigo-900 to-indigo-800 rounded-3xl p-1 shadow-2xl shadow-indigo-900/20">
              <div className="bg-white rounded-[22px] p-6">
                <h3 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  </div>
                  Booking Summary
                </h3>

                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Guest Name', value: booking.guestName },
                    { label: 'Booking ID', value: booking.bookingId.substring(0, 8) + '...', mono: true },
                    { label: 'Payment ID', value: booking.paymentId.substring(0, 8) + '...', mono: true },
                    { label: 'Room Type', value: booking.roomType }
                  ].map(({ label, value, mono }) => (
                    <div key={label} className="flex justify-between items-center py-2.5 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">{label}</span>
                      <span className={'font-bold text-gray-900 ' + (mono ? 'font-mono text-xs bg-gray-100 px-2 py-1 rounded' : '')}>{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Status</span>
                    <span className="font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs border border-emerald-100">{booking.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 pb-1 bg-indigo-50/50 px-3 rounded-xl border border-indigo-50">
                    <span className="text-indigo-900 font-bold">Revenue</span>
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                      {'\u20B9'}{booking.pricePerNight?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
