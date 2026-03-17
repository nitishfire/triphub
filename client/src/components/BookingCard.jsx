import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import ConfirmModal from './ConfirmModal';
import { Link } from 'react-router-dom';

const TYPE_COLORS = {
  Single: 'from-blue-500 to-cyan-500',
  Double: 'from-violet-500 to-purple-500',
  Suite: 'from-amber-500 to-orange-500',
  Deluxe: 'from-rose-500 to-pink-500'
};

const STATUS_STYLES = {
  Accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Refunded: 'bg-blue-50 text-blue-700 border-blue-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200'
};

export default function BookingCard({ booking, onCancelled, type }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const gradientClass = TYPE_COLORS[booking.roomType] || 'from-gray-500 to-slate-500';
  const statusClass = STATUS_STYLES[booking.paymentStatus] || 'bg-gray-50 text-gray-700 border-gray-200';

  const handleCancel = async () => {
    setLoading(true);
    try {
      const endpoint = type === 'hotel'
        ? '/bookings/hotel/' + booking.bookingId
        : '/bookings/' + booking.bookingId;
      const res = await api.delete(endpoint);
      toast.success(res.data.message || 'Booking cancelled');
      onCancelled && onCancelled(booking.bookingId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="card hover:shadow-2xl hover:shadow-gray-300/40 hover:-translate-y-0.5 transition-all duration-300">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap mb-3">
              <h3 className="font-bold text-gray-900 text-lg">{booking.name}</h3>
              <span className={'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ' + statusClass}>
                {booking.paymentStatus}
              </span>
              <span className={'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ' + gradientClass}>
                {booking.roomType}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-4 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {booking.address}
              <span className="text-gray-300 mx-1">{'\u2022'}</span>
              <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              {booking.phone}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { label: 'Guest', value: booking.guestName },
                { label: 'Room No.', value: '#' + booking.roomNumber },
                { label: 'Capacity', value: booking.capacity + ' persons' },
                { label: 'Available', value: booking.availableDays + ' days' },
                { label: 'Booking ID', value: booking.bookingId.substring(0, 8) + '...' },
                { label: 'Payment ID', value: booking.paymentId.substring(0, 8) + '...' }
              ].map(function(item) {
                return (
                  <div key={item.label} className="bg-gray-50/80 rounded-2xl p-3 hover:bg-gray-100/80 transition-colors duration-200">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{item.label}</p>
                    <p className="text-sm font-bold text-gray-800 mt-0.5">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-right shrink-0 flex flex-col items-end gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Per Night</p>
              <p className="text-3xl font-extrabold gradient-text">{'\u20B9'}{booking.pricePerNight.toLocaleString()}</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="group/btn flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 bg-red-50 hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-500 hover:text-white rounded-2xl transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
            <Link
              to={(type === 'hotel' ? '/hotel/booking/details/' : '/booking/details/') + booking.bookingId}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-violet-600 hover:text-white rounded-2xl transition-all duration-300"
            >
              More Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      <ConfirmModal
        open={showModal}
        title="Cancel Booking?"
        message={'Cancel booking at ' + booking.name + ' (Room #' + booking.roomNumber + ')? \u20B9' + booking.pricePerNight.toLocaleString() + ' will be refunded to your wallet.'}
        confirmText={loading ? 'Cancelling...' : 'Yes, Cancel'}
        onConfirm={handleCancel}
        onCancel={() => setShowModal(false)}
        loading={loading}
        danger={true}
      />
    </>
  );
}
