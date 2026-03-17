import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import { PageSpinner } from '../components/Spinner';
import toast from 'react-hot-toast';

export default function UserBookings() {
  const { auth, updateUserBalance } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api.get('/bookings/mine');
      setBookings(res.data.bookings);
      setBalance(res.data.balance);
      updateUserBalance(res.data.balance);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <PageSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-indigo-200 text-sm font-semibold tracking-widest uppercase mb-2">{auth?.name}&apos;s bookings</p>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">My Bookings</h1>
              <p className="text-indigo-100 mt-2">{bookings.length} active booking{bookings.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="glass rounded-2xl px-8 py-5 backdrop-blur-xl border border-white/20 shadow-2xl">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Wallet Balance</p>
              <p className="text-3xl font-extrabold text-white mt-1">Rs. {balance.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 pb-16">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl shadow-indigo-500/5 border border-gray-100 text-center py-24 px-8">
            <div className="w-28 h-28 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-14 h-14 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No bookings yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Your booking history will appear here. Start by browsing our available hotels and rooms.
            </p>
            <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-base">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Hotels
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((b, idx) => (
              <div
                key={b._id}
                className="opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
                style={{ animationDelay: idx * 80 + 'ms' }}
              >
                <BookingCard booking={b} type="user" onCancelled={() => fetchData()} />
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