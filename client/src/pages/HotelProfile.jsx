import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { PageSpinner } from '../components/Spinner';

export default function HotelProfile() {
  const { auth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/hotels/profile').then(res => setProfile(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Hotel Profile</h1>
        <div className="card">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl flex items-center justify-center shrink-0">
              <span className="text-white text-3xl">🏨</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile?.name || auth?.name}</h2>
              <p className="text-gray-500 text-sm">ID: {profile?.hotelId || auth?.hotelId}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 mt-2">Hotel Account</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              { label: 'Property ID', value: profile?.hotelId },
              { label: 'Property Name', value: profile?.name },
              { label: 'Address', value: profile?.address },
              { label: 'Phone', value: profile?.phone }
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
                <p className="text-gray-900 font-semibold">{value || '-'}</p>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl p-6 text-white mb-6">
            <p className="text-slate-400 text-sm font-medium">Total Earnings</p>
            <p className="text-4xl font-extrabold mt-1">{'\u20B9'}{(profile?.earnings || 0).toLocaleString()}</p>
          </div>
          <div className="flex gap-4">
            <Link to="/hotel/dashboard" className="btn-primary flex-1 text-center">Dashboard</Link>
            <Link to="/hotel/bookings" className="btn-secondary flex-1 text-center">Manage Bookings</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
