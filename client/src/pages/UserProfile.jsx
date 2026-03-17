import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { PageSpinner } from '../components/Spinner';
import toast from 'react-hot-toast';

export default function UserProfile() {
  const { auth, login } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    api.get('/bookings/user-stats')
      .then(res => {
        setStats(res.data);
        setEditName(res.data.name || auth?.name || '');
        setEditPhone(res.data.phone || '');
        setEditAvatar(res.data.avatar || '');
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setEditAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!editName.trim()) { toast.error('Name cannot be empty'); return; }
    if (editPhone && String(editPhone).replace(/\D/g, '').length !== 10) {
      toast.error('Phone must be 10 digits'); return;
    }
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', {
        name: editName.trim(),
        phone: editPhone,
        avatar: editAvatar,
      });
      const updated = res.data;
      setStats(prev => ({ ...prev, ...updated }));
      // Sync name change into auth context / localStorage
      login({ ...auth, name: updated.name });
      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditName(stats?.name || auth?.name || '');
    setEditPhone(stats?.phone || '');
    setEditAvatar(stats?.avatar || '');
    setEditMode(false);
  };

  if (loading) return <PageSpinner />;

  const profileData = stats || {};
  const displayName = profileData.name || auth?.name || 'User';
  const displayUsername = profileData.username || auth?.username || '';
  const displayEmail = profileData.email || auth?.email || '';
  const displayPhone = profileData.phone || auth?.phone || '';
  // In edit mode show the preview avatar, otherwise show the saved one
  const displayAvatar = editMode ? editAvatar : (profileData.avatar || '');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          <div className="flex flex-col items-center text-center">

            {/* Avatar */}
            <div className="relative mb-6">
              <div
                className={"w-28 h-28 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-2xl border border-white/30 rotate-3 hover:rotate-0 transition-transform duration-300 overflow-hidden " + (editMode ? 'cursor-pointer' : '')}
                onClick={() => editMode && fileInputRef.current?.click()}
              >
                {displayAvatar ? (
                  <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-5xl font-extrabold">{displayName[0].toUpperCase()}</span>
                )}
                {editMode && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-3xl">
                    <svg className="w-7 h-7 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-white text-[10px] font-bold">Change</span>
                  </div>
                )}
              </div>

              {/* Camera badge shown in edit mode */}
              {editMode && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-9 h-9 bg-white rounded-xl shadow-xl flex items-center justify-center hover:bg-indigo-50 transition-colors border border-gray-100 z-10"
                >
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <h1 className="text-4xl font-extrabold text-white tracking-tight">{displayName}</h1>
            <p className="text-indigo-200 text-lg mt-1">@{displayUsername}</p>

            <div className="flex items-center gap-3 mt-3 flex-wrap justify-center">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm border border-white/20">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
                Active User
              </span>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-white/90 text-indigo-700 hover:bg-white transition-colors shadow-lg"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-16">

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            {
              label: 'Wallet Balance',
              value: '₹' + (profileData.balance || 0).toLocaleString(),
              gradient: 'from-emerald-500 to-teal-600',
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              )
            },
            {
              label: 'Total Bookings',
              value: profileData.totalBookings || 0,
              gradient: 'from-blue-500 to-indigo-600',
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )
            },
            {
              label: 'Total Spent',
              value: '₹' + (profileData.totalSpent || 0).toLocaleString(),
              gradient: 'from-violet-500 to-purple-600',
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              )
            }
          ].map((card) => (
            <div key={card.label} className={'rounded-2xl p-6 text-white bg-gradient-to-br shadow-xl ' + card.gradient}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  {card.icon}
                </div>
              </div>
              <p className="text-white/70 text-sm font-semibold">{card.label}</p>
              <p className="text-2xl font-extrabold mt-1">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Profile Information Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
              <p className="text-gray-500 text-sm mt-1">
                {editMode ? 'Update your personal details below' : 'Your personal details and account info'}
              </p>
            </div>
            {editMode ? (
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2"
                >
                  {saving && (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-100 shrink-0 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
          </div>

          {editMode ? (
            /* ── EDIT MODE ── */
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                  placeholder="Your full name"
                />
              </div>

              {/* Username (read-only) */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Username
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 font-semibold select-none">
                  @{displayUsername}
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5 ml-1">Username cannot be changed</p>
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 font-semibold select-none truncate">
                  {displayEmail || 'Not provided'}
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5 ml-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                  placeholder="10-digit phone number"
                  maxLength={10}
                />
              </div>

              {/* Avatar upload hint */}
              <div className="sm:col-span-2 flex items-center gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-indigo-800">Profile Photo</p>
                  <p className="text-xs text-indigo-600/70 mt-0.5">Click the avatar above or use the button to upload. Max 2 MB.</p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors shrink-0"
                >
                  Upload Photo
                </button>
              </div>
            </div>
          ) : (
            /* ── VIEW MODE ── */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-8">
              {[
                {
                  label: 'Full Name', value: displayName,
                  icon: (
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )
                },
                {
                  label: 'Username', value: '@' + displayUsername,
                  icon: (
                    <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  )
                },
                {
                  label: 'Email Address', value: displayEmail || 'Not provided',
                  icon: (
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )
                },
                {
                  label: 'Phone Number', value: displayPhone || 'Not provided',
                  icon: (
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  )
                }
              ].map((item) => (
                <div key={item.label} className="group bg-gray-50 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 rounded-xl p-5 transition-all duration-300 border border-transparent hover:border-indigo-100">
                  <div className="flex items-center gap-3 mb-2">
                    {item.icon}
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{item.label}</p>
                  </div>
                  <p className="text-gray-900 font-bold text-lg pl-8 truncate">{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom nav buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            to="/dashboard"
            className="btn-primary flex-1 text-center py-4 text-base font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Hotels
          </Link>
          <Link
            to="/bookings"
            className="btn-secondary flex-1 text-center py-4 text-base font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
