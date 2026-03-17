import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { PageSpinner } from '../components/Spinner';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ALL_AMENITIES = [
  'Free Wi-Fi', 'Air Conditioning', 'Smart TV', 'Mini Bar',
  'Work Desk', 'Daily Housekeeping', 'Room Service', 'Balcony',
  'Coffee Machine', 'Jacuzzi', 'Kitchenette', 'City View',
  'Swimming Pool', 'Spa Access', 'Parking'
];

export default function HotelDashboard() {
  const { auth } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [hotelInfo, setHotelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  
  const [form, setForm] = useState({ 
    roomNumber: '', roomType: '', capacity: '', pricePerNight: '', 
    availableDays: '', description: '', amenities: [], images: [] 
  });
  const [publishing, setPublishing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = async () => {
    try {
      const [roomsRes, profileRes] = await Promise.all([
        api.get('/hotels/rooms/mine'),
        api.get('/hotels/profile')
      ]);
      setRooms(roomsRes.data);
      setHotelInfo(profileRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!form.roomNumber || !form.roomType || !form.capacity || !form.pricePerNight || !form.availableDays)
      return toast.error('Please fill all essential room fields');
    setPublishing(true);
    try {
      await api.post('/hotels/rooms', form);
      toast.success('Room published successfully!');
      setForm({ roomNumber: '', roomType: '', capacity: '', pricePerNight: '', availableDays: '', description: '', amenities: [], images: [] });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish room');
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete('/hotels/rooms/' + deleteTarget);
      toast.success('Room deleted');
      setRooms(prev => prev.filter(r => r._id !== deleteTarget));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (form.images.length + files.length > 5) {
      return toast.error('Maximum 5 images allowed');
    }
    
    files.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
         toast.error(`${file.name} is larger than 2MB`);
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const toggleAmenity = (amenity) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="min-h-screen bg-slate-50 pt-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 z-0 rounded-b-[4rem] shadow-2xl opacity-95" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] bg-indigo-500/20 rounded-full blur-3xl mix-blend-overlay" />
        <div className="absolute top-20 -right-20 w-[20rem] h-[20rem] bg-violet-400/20 rounded-full blur-3xl mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12 bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white/20">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-indigo-600 text-4xl font-black shadow-inner border border-indigo-50 transform -rotate-3 hover:rotate-0 transition-transform">
              {auth?.name?.charAt(0) || 'H'}
            </div>
            <div>
              <p className="text-indigo-200 font-bold tracking-wide uppercase text-xs mb-1">Partner Dashboard</p>
              <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-md">{auth?.name}</h1>
              <p className="text-indigo-100 font-medium mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ID: {auth?.hotelId}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-[1.5rem] px-8 py-5 text-right shadow-2xl transform hover:-translate-y-1 transition-transform border border-indigo-50">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-end gap-1">
              Total Earnings <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </p>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 drop-shadow-sm">
              {'\u20B9'}{(hotelInfo?.earnings || 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-indigo-900/5 border border-indigo-50 sticky top-24">
              <div className="mb-8 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">List New Room</h2>
                <p className="text-gray-500 text-sm mt-2 font-medium">Add a new offering to your property portfolio.</p>
              </div>
              
              <form onSubmit={handlePublish} className="space-y-6">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Room No.</label>
                    <input className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 font-semibold text-gray-900 placeholder-gray-400 transition-all" type="number" placeholder="101" required
                      value={form.roomNumber} onChange={e => setForm({ ...form, roomNumber: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Type</label>
                    <select className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 font-semibold text-gray-900 transition-all cursor-pointer" required value={form.roomType} onChange={e => setForm({ ...form, roomType: e.target.value })}>
                      <option value="">Select</option>
                      <option>Single</option><option>Double</option><option>Suite</option><option>Deluxe</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-5">
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Price</label>
                    <input className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 font-semibold text-gray-900 transition-all" type="number" placeholder="2500" required
                      value={form.pricePerNight} onChange={e => setForm({ ...form, pricePerNight: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Guests</label>
                    <input className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 font-semibold text-gray-900 transition-all" type="number" placeholder="2" required
                      value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Days</label>
                    <input className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 font-semibold text-gray-900 transition-all" type="number" placeholder="30" required
                      value={form.availableDays} onChange={e => setForm({ ...form, availableDays: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Description</label>
                  <textarea 
                    className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 placeholder-gray-400 transition-all min-h-[100px] resize-y" 
                    placeholder="Describe the room, view, and unique features..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Amenities & Features</label>
                  <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto p-3 bg-gray-50 rounded-2xl border border-gray-100 custom-scrollbar">
                    {ALL_AMENITIES.map(amenity => (
                      <label key={amenity} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 transition-all"
                          checked={form.amenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                        />
                        <span className="text-sm font-semibold text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Images</label>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{form.images.length}/5</span>
                  </div>
                  
                  {form.images.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mb-3">
                      {form.images.map((img, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                          <img src={img} alt="preview" className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => removeImage(i)}
                            className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {form.images.length < 5 && (
                     <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 rounded-2xl p-6 text-center cursor-pointer transition-colors"
                     >
                       <div className="w-10 h-10 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-2">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                       </div>
                       <p className="text-sm font-medium text-indigo-600">Click to upload images</p>
                       <p className="text-xs text-indigo-400 mt-1">JPEG, PNG up to 2MB</p>
                       <input 
                         type="file" 
                         className="hidden" 
                         ref={fileInputRef} 
                         multiple 
                         accept="image/jpeg,image/png,image/webp" 
                         onChange={handleImageUpload}
                       />
                     </div>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <button type="submit" disabled={publishing} className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:transform-none text-lg tracking-wide flex items-center justify-center gap-2">
                    {publishing ? (
                      <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Publishing...</>
                    ) : 'Publish Room Listing'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Active Listings</h2>
              <span className="bg-indigo-100 text-indigo-700 font-bold px-4 py-1.5 rounded-xl text-sm shadow-sm border border-indigo-200">
                {rooms.length} Rooms Available
              </span>
            </div>

            {rooms.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-16 text-center shadow-lg border border-gray-100/50">
                <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <span className="text-6xl transform -rotate-12">🛏️</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">No rooms published yet</h3>
                <p className="text-gray-500 font-medium max-w-sm mx-auto">List your first room using the form to start receiving bookings and generating revenue.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {rooms.map(room => (
                  <div key={room._id} className="bg-white rounded-[2rem] p-5 shadow-lg border border-gray-100/50 hover:shadow-2xl hover:border-indigo-100 transition-all duration-300 flex flex-col group hover:-translate-y-1">
                    <div className="w-full h-56 rounded-2xl overflow-hidden shrink-0 bg-gray-100 relative mb-5">
                      {room.images && room.images.length > 0 ? (
                        <img src={room.images[0]} alt="Room" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                      )}
                      {room.images && room.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg">
                          +{room.images.length - 1} more
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl font-black text-gray-900 tracking-tight">Room {room.roomNumber}</span>
                            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                              {room.roomType}
                            </span>
                          </div>
                          <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 mb-1">
                            {'\u20B9'}{(room.pricePerNight || 0).toLocaleString()} <span className="text-sm font-bold text-gray-400">/night</span>
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-5">
                        <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 border border-gray-100">
                          <span className="text-lg">👥</span> <span className="font-bold text-gray-700">{room.capacity} Guests</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 border border-gray-100">
                          <span className="text-lg">📅</span> <span className="font-bold text-gray-700">{room.availableDays} Days left</span>
                        </div>
                      </div>

                      <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                        <Link to={'/hotel/update/' + room._id} className="w-full text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-800 py-2.5 rounded-xl text-center transition-colors">Edit Listing</Link>
                        <button onClick={() => setDeleteTarget(room._id)} className="w-full text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 py-2.5 rounded-xl text-center transition-colors">Delete</button>
                      </div>

                      {room.amenities && room.amenities.length > 0 && (
                        <div className="mt-auto pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                          {room.amenities.slice(0, 4).map(a => (
                            <span key={a} className="text-xs font-semibold text-gray-600 bg-white border border-gray-200 px-2.5 py-1 rounded-lg">
                              {a}
                            </span>
                          ))}
                          {room.amenities.length > 4 && (
                            <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
                              +{room.amenities.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Room?"
        message="This will permanently remove this room listing. This action cannot be undone."
        confirmText="Delete Room"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        danger={true}
      />
    </div>
  );
}
