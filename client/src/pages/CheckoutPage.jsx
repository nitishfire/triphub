import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { PageSpinner } from '../components/Spinner';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth, userBalance, updateUserBalance } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    api.get('/hotels/rooms/' + id)
      .then(res => setRoom(res.data))
      .catch(() => {
        toast.error('Room not found');
        navigate('/dashboard');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleConfirmBooking = async () => {
    setBooking(true);
    try {
      const res = await api.post('/bookings', { roomId: id });
      setBookingData(res.data.booking);
      updateUserBalance(userBalance - room.pricePerNight);
      setConfirmed(true);
      toast.success('Booking confirmed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <PageSpinner />;
  if (!room && !confirmed) return null;

  if (confirmed && bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[68px] flex items-center justify-center px-4">
        <div className="w-full max-w-lg animate-slide-up">
          <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-500/10 border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-8 py-10 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-extrabold text-white mb-2">Booking Confirmed!</h1>
              <p className="text-emerald-100">Your reservation has been successfully placed</p>
            </div>
            <div className="p-8">
              <div className="space-y-3 mb-6">
                {[
                  { label: 'Hotel', value: bookingData.name },
                  { label: 'Location', value: bookingData.address },
                  { label: 'Room Number', value: '#' + bookingData.roomNumber },
                  { label: 'Room Type', value: bookingData.roomType },
                  { label: 'Guests', value: bookingData.capacity },
                  { label: 'Amount Paid', value: '\u20B9' + bookingData.pricePerNight?.toLocaleString() },
                  { label: 'Payment Status', value: bookingData.paymentStatus },
                  { label: 'Booking ID', value: bookingData.bookingId?.substring(0, 16) + '...' }
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500 text-sm">{item.label}</span>
                    <span className="font-semibold text-gray-900 text-sm text-right max-w-[60%] truncate">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-6 text-center">
                <p className="text-emerald-600 text-sm font-medium">Remaining wallet balance</p>
                <p className="text-3xl font-extrabold text-emerald-700 mt-1">{'\u20B9'}{userBalance.toLocaleString()}</p>
              </div>

              <div className="flex gap-3">
                <Link to="/bookings" className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3.5 rounded-2xl text-center shadow-lg transition-all hover:scale-[1.02]">
                  View My Bookings
                </Link>
                <Link to="/dashboard" className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl text-center hover:bg-gray-50 transition-all">
                  Browse More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const canAfford = userBalance >= room.pricePerNight;
  const balanceAfter = userBalance - room.pricePerNight;

  return (
    <div className="min-h-screen bg-gray-50 pt-[68px]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1>
            <p className="text-gray-500 text-sm mt-0.5">Review and confirm your booking</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          {['Room Details', 'Review & Pay', 'Confirmed'].map((step, i) => (
            <div key={step} className="flex items-center gap-2 flex-1">
              <div className={'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ' + (i === 1 ? 'bg-indigo-600 text-white' : i === 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400')}>
                {i + 1}
              </div>
              <span className={'text-sm font-semibold hidden sm:block ' + (i === 1 ? 'text-indigo-600' : 'text-gray-400')}>{step}</span>
              {i < 2 && <div className={'flex-1 h-0.5 mx-2 hidden sm:block ' + (i < 1 ? 'bg-indigo-200' : 'bg-gray-200')} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Room Summary</h2>
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shrink-0">
                  <span className="text-3xl">🛏️</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{room.name}</h3>
                  <p className="text-gray-500 text-sm">{room.address}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{room.roomType}</span>
                    <span className="text-xs text-gray-500">Room #{room.roomNumber}</span>
                    <span className="text-xs text-gray-500">{room.capacity} Guest{room.capacity > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Guest Information</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Guest Name', value: auth?.name },
                  { label: 'Username', value: '@' + auth?.username }
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{item.label}</p>
                    <p className="font-bold text-gray-900 mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-emerald-800">TripHub Wallet</p>
                  <p className="text-emerald-600 text-sm">Balance: {'\u20B9'}{userBalance.toLocaleString()}</p>
                </div>
                <div className="ml-auto">
                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Price Breakdown</h3>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Room rate / night</span>
                  <span className="font-semibold">{'\u20B9'}{room.pricePerNight?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service charge</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Taxes</span>
                  <span className="font-semibold text-emerald-600">Included</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total Due</span>
                  <span className="text-xl font-extrabold gradient-text">{'\u20B9'}{room.pricePerNight?.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-500 text-sm">Wallet before</span>
                  <span className="font-semibold text-gray-900">{'\u20B9'}{userBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-500 text-sm">Payment</span>
                  <span className="font-semibold text-red-500">- {'\u20B9'}{room.pricePerNight?.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
                  <span className="font-bold text-gray-700 text-sm">Wallet after</span>
                  <span className={'font-extrabold ' + (canAfford ? 'text-emerald-600' : 'text-red-500')}>{'\u20B9'}{balanceAfter.toLocaleString()}</span>
                </div>
              </div>

              {!canAfford && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-4 text-center">
                  <p className="text-red-600 font-semibold text-sm">Insufficient wallet balance</p>
                  <p className="text-red-400 text-xs mt-1">You need {'\u20B9'}{(room.pricePerNight - userBalance).toLocaleString()} more</p>
                </div>
              )}

              <button
                onClick={handleConfirmBooking}
                disabled={booking || !canAfford}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base flex items-center justify-center gap-2"
              >
                {booking ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm & Pay {'\u20B9'}{room.pricePerNight?.toLocaleString()}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-center text-gray-400 text-xs mt-3">
                By confirming, payment will be deducted from your TripHub wallet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
