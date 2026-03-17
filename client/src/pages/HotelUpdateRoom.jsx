import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { PageSpinner } from '../components/Spinner';

const ALL_AMENITIES = [
  'Free Wi-Fi', 'Air Conditioning', 'Smart TV', 'Mini Bar',
  'Work Desk', 'Daily Housekeeping', 'Room Service', 'Balcony',
  'Coffee Machine', 'Jacuzzi', 'Kitchenette', 'City View',
  'Swimming Pool', 'Spa Access', 'Parking'
];

export default function HotelUpdateRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ 
    roomType: '', capacity: '', pricePerNight: '', 
    availableDays: '', description: '', amenities: [], images: [] 
  });
  const [roomNumber, setRoomNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/hotels/rooms/mine').then(res => {
      const room = res.data.find(r => r._id === id);
      if (room) {
        setForm({ 
          roomType: room.roomType, capacity: room.capacity, pricePerNight: room.pricePerNight, 
          availableDays: room.availableDays, description: room.description || '', 
          amenities: room.amenities || [], images: room.images || []
        });
        setRoomNumber(room.roomNumber);
      }
    }).finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/hotels/rooms/' + id, form);
      toast.success('Room updated successfully!');
      navigate('/hotel/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
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
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
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
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
           <button onClick={() => navigate('/hotel/dashboard')} className="p-2.5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
             <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
           </button>
           <div>
             <h1 className="text-3xl font-extrabold text-gray-900">Update Room</h1>
             <p className="text-gray-500 font-medium">Room #{roomNumber}</p>
           </div>
        </div>
        
        <div className="card shadow-2xl shadow-indigo-500/5 bg-white/80 backdrop-blur-xl border-0">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Room Type</label>
                <select className="input-field" value={form.roomType} onChange={e => setForm({ ...form, roomType: e.target.value })}>
                  <option>Single</option><option>Double</option><option>Suite</option><option>Deluxe</option>
                </select>
              </div>
              <div>
                 <label className="label">Price (\u20B9)</label>
                 <input className="input-field" type="number" value={form.pricePerNight}
                    onChange={e => setForm({ ...form, pricePerNight: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Capacity (persons)</label>
                <input className="input-field" type="number" value={form.capacity}
                  onChange={e => setForm({ ...form, capacity: e.target.value })} />
              </div>
              <div>
                <label className="label">Availability (days)</label>
                <input className="input-field" type="number" value={form.availableDays}
                  onChange={e => setForm({ ...form, availableDays: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="label">Description</label>
              <textarea 
                className="input-field min-h-[100px] resize-y" 
                placeholder="Describe the room, view, and unique features..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Amenities & Features</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[200px] overflow-y-auto p-3 bg-gray-50 rounded-2xl border border-gray-100">
                {ALL_AMENITIES.map(amenity => (
                  <label key={amenity} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                      checked={form.amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                    />
                    <span className="text-sm font-medium text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Room Images ({form.images.length}/5)</label>
              {form.images.length > 0 && (
                <div className="grid grid-cols-5 gap-3 mb-4">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm bg-gray-100">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {form.images.length < 5 && (
                 <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 rounded-2xl p-8 text-center cursor-pointer transition-colors"
                 >
                   <div className="w-12 h-12 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                   </div>
                   <p className="text-sm font-semibold text-indigo-600 mb-1">Click to add images</p>
                   <p className="text-xs text-indigo-400">JPEG, PNG, WEBP (up to 2MB)</p>
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

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button type="submit" disabled={saving} className="btn-primary flex-1 py-4 text-lg">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => navigate('/hotel/dashboard')} className="btn-secondary flex-1 py-4 text-lg">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
