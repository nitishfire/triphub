import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { PageSpinner } from '../components/Spinner';

const STATUS_STYLES = {
  Accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Refunded: 'bg-blue-50 text-blue-700 border-blue-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200'
};

const TYPE_COLORS = {
  Single: 'from-blue-500 to-cyan-500',
  Double: 'from-violet-500 to-purple-500',
  Suite: 'from-amber-500 to-orange-500',
  Deluxe: 'from-rose-500 to-pink-500'
};

export default function AdminUserBookings() {
  const { guestName } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/bookings/' + guestName).then(res => setBookings(res.data)).finally(() => setLoading(false));
  }, [guestName]);

  if (loading) return <PageSpinner />;

  const totalSpent = bookings.reduce((sum, b) => sum + (b.pricePerNight || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 pt-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-br from-indigo-900 via-violet-900 to-purple-900 z-0 rounded-b-[3rem] shadow-2xl" />
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute top-10 -right-20 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="pt-6 pb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/20 backdrop-blur-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <div>
              <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Guest Booking History</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{guestName}</h1>
              <p className="text-indigo-200 text-sm mt-0.5">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} found</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-7 py-4 text-right border border-white/20">
            <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Total Spent</p>
            <p className="text-2xl font-black text-white mt-1">{'\u20B9'}{totalSpent.toLocaleString()}</p>
          </div>
        </div>

        <div className="-mt-8 pb-12">
          {bookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center shadow-xl border border-gray-100">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">📭</div>
              <h3 className="text-xl font-bold text-gray-900">No bookings found</h3>
              <p className="text-gray-500 mt-2">This user has no bookings on record</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b, idx) => {
                const statusClass = STATUS_STYLES[b.paymentStatus] || 'bg-gray-50 text-gray-700 border-gray-200';
                const gradClass = TYPE_COLORS[b.roomType] || 'from-gray-500 to-slate-500';
                return (
                  <div key={b._id} className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100/50 hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300 opacity-0 animate-[fadeInUp_0.4s_ease-out_forwards]" style={{ animationDelay: idx * 60 + 'ms' }}>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap mb-3">
                          <h3 className="font-bold text-gray-900 text-xl">{b.name}</h3>
                          <span className={'px-2.5 py-0.5 rounded-full text-xs font-bold border ' + statusClass}>{b.paymentStatus}</span>
                          <span className={'px-2.5 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ' + gradClass}>{b.roomType}</span>
                        </div>
                        <p className="text-gray-500 text-sm mb-4 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                          {b.address}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            { label: 'Room', value: '#' + b.roomNumber },
                            { label: 'Capacity', value: b.capacity + ' persons' },
                            { label: 'Available', value: b.availableDays + ' days' },
                            { label: 'Guest', value: b.guestName },
                            { label: 'Booking ID', value: b.bookingId.substring(0, 8) + '...' },
                            { label: 'Payment ID', value: b.paymentId.substring(0, 8) + '...' }
                          ].map(({ label, value }) => (
                            <div key={label} className="bg-gray-50/80 rounded-2xl p-3 hover:bg-gray-100/80 transition-colors">
                              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{label}</p>
                              <p className="text-sm font-bold text-gray-800 mt-0.5">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Per Night</p>
                        <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 mt-1">
                          {'\u20B9'}{b.pricePerNight?.toLocaleString()}
                        </p>
                      </div>
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
