import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import { PageSpinner } from '../components/Spinner';

export default function HotelManageBookings() {
  const { auth } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    api.get('/bookings/hotel').then(res => {
      setBookings(res.data.bookings);
      setEarnings(res.data.earnings);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <PageSpinner />;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-700">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-violet-300/10 rounded-full blur-3xl" />
          <div className="absolute top-0 left-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-32">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-violet-200 text-sm font-semibold tracking-widest uppercase">{auth?.name}</p>
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">Guest Bookings</h1>
              <p className="text-violet-100 mt-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {bookings.length} active booking{bookings.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-8 py-5 border border-white/20 shadow-2xl">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                Total Earnings
              </p>
              <p className="text-3xl font-extrabold text-white mt-1">{'\u20B9'}{earnings.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 pb-16">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl shadow-violet-500/5 border border-gray-100 text-center py-24 px-8">
            <div className="w-28 h-28 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-14 h-14 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No bookings yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">When guests book your rooms, their bookings will appear here.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((b, idx) => (
              <div key={b._id} className="opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]" style={{ animationDelay: idx * 80 + 'ms' }}>
                <BookingCard booking={b} type="hotel" onCancelled={() => fetchData()} />
              </div>
            ))}
          </div>
        )}
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
