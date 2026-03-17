import toast from 'react-hot-toast';
import api from '../api/axios';
import { useState } from 'react';

const TYPE_COLORS = {
  Single: 'from-blue-500 to-cyan-500',
  Double: 'from-violet-500 to-purple-500',
  Suite: 'from-amber-500 to-orange-500',
  Deluxe: 'from-rose-500 to-pink-500'
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80';

export default function HotelCard({ room, onBooked, showBookButton = true }) {
  const [loading, setLoading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  const images = (room.images && room.images.length > 0) ? room.images : [DEFAULT_IMAGE];
  const gradientClass = TYPE_COLORS[room.roomType] || 'from-gray-500 to-slate-500';

  const handleBook = async () => {
    setLoading(true);
    try {
      await api.post('/bookings', { roomId: room._id });
      toast.success('Room booked successfully!');
      onBooked && onBooked(room._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100/60 overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-300/40 transition-all duration-500">
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        )}
        <img
          src={images[currentImg]}
          alt={room.name}
          className={'w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ' + (imgLoaded ? 'opacity-100' : 'opacity-0')}
          onLoad={() => setImgLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {images.length > 1 && (
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImg(Math.max(0, currentImg - 1)); }} disabled={currentImg === 0} className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImg(Math.min(images.length - 1, currentImg + 1)); }} disabled={currentImg === images.length - 1} className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}

        <div className="absolute top-4 left-4">
          <span className={'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r shadow-lg ' + gradientClass}>
            {room.roomType}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-bold text-white text-lg leading-tight drop-shadow-lg">{room.name}</h3>
          <p className="text-white/80 text-sm mt-0.5 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {room.address}
          </p>
        </div>
      </div>

      <div className="p-5 flex flex-col h-[280px]">
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {[
            { label: 'Room No.', value: '#' + room.roomNumber, icon: '\uD83D\uDEAA' },
            { label: 'Capacity', value: room.capacity + (room.capacity > 1 ? ' persons' : ' person'), icon: '\uD83D\uDC65' },
            { label: 'Available', value: room.availableDays + ' days', icon: '\uD83D\uDCC5' },
            { label: 'Contact', value: room.phone, icon: '\uD83D\uDCDE' }
          ].map(function(item) {
            return (
              <div key={item.label} className="bg-gray-50/80 rounded-2xl p-3 hover:bg-gray-100/80 transition-colors duration-200">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{item.label}</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">{item.value}</p>
              </div>
            );
          })}
        </div>

        {room.amenities && room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 max-h-[50px] overflow-hidden">
            {room.amenities.slice(0, 3).map(a => (
              <span key={a} className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                {a}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Per Night</p>
            <p className="text-2xl font-extrabold gradient-text">{'\u20B9'}{(room.pricePerNight || 0).toLocaleString()}</p>
          </div>
          {showBookButton && (
            <button
              onClick={(e) => { e.preventDefault(); handleBook(); }}
              disabled={loading}
              className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  Book Now
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
