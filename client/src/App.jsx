import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import UserBookings from './pages/UserBookings';
import RoomDetailPage from './pages/RoomDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import HotelLoginPage from './pages/HotelLoginPage';
import HotelRegisterPage from './pages/HotelRegisterPage';
import HotelDashboard from './pages/HotelDashboard';
import HotelProfile from './pages/HotelProfile';
import HotelManageBookings from './pages/HotelManageBookings';
import HotelUpdateRoom from './pages/HotelUpdateRoom';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserBookings from './pages/AdminUserBookings';
import AdminHotelRooms from './pages/AdminHotelRooms';
import AdminHotelBookings from './pages/AdminHotelBookings';
import BookedRoomDetail from './pages/BookedRoomDetail';
import HotelBookingDetail from './pages/HotelBookingDetail';

// 'customer' is the legacy DB type — normalise it to 'user' for all checks
function normaliseType(t) {
  return t === 'customer' ? 'user' : t;
}

function RequireAuth({ children, type }) {
  const { auth } = useAuth();
  if (!auth) {
    if (type === 'hotel') return <Navigate to="/hotel/login" replace />;
    return <Navigate to="/login" replace />;
  }
  if (type && normaliseType(auth.type) !== type) return <Navigate to="/" replace />;
  return children;
}

function PublicOnlyRoute({ children }) {
  const { auth } = useAuth();
  if (auth) {
    const t = normaliseType(auth.type);
    if (t === 'admin') return <Navigate to="/admin" replace />;
    if (t === 'hotel') return <Navigate to="/hotel/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  const { auth } = useAuth();
  const location = useLocation();
  const showFooter = !auth && location.pathname === '/';
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<PublicOnlyRoute><LandingPage /></PublicOnlyRoute>} />
          <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
          <Route path="/hotel/login" element={<PublicOnlyRoute><HotelLoginPage /></PublicOnlyRoute>} />
          <Route path="/hotel/register" element={<PublicOnlyRoute><HotelRegisterPage /></PublicOnlyRoute>} />
          <Route path="/dashboard" element={<RequireAuth type="user"><UserDashboard /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth type="user"><UserProfile /></RequireAuth>} />
          <Route path="/bookings" element={<RequireAuth type="user"><UserBookings /></RequireAuth>} />
          <Route path="/room/:id" element={<RequireAuth type="user"><RoomDetailPage /></RequireAuth>} />
          <Route path="/checkout/:id" element={<RequireAuth type="user"><CheckoutPage /></RequireAuth>} />
          <Route path="/hotel/dashboard" element={<RequireAuth type="hotel"><HotelDashboard /></RequireAuth>} />
          <Route path="/hotel/profile" element={<RequireAuth type="hotel"><HotelProfile /></RequireAuth>} />
          <Route path="/hotel/bookings" element={<RequireAuth type="hotel"><HotelManageBookings /></RequireAuth>} />
          <Route path="/hotel/update/:id" element={<RequireAuth type="hotel"><HotelUpdateRoom /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth type="admin"><AdminDashboard /></RequireAuth>} />
          <Route path="/admin/bookings/:guestName" element={<RequireAuth type="admin"><AdminUserBookings /></RequireAuth>} />
          <Route path="/admin/hotels/:hotelId/rooms" element={<RequireAuth type="admin"><AdminHotelRooms /></RequireAuth>} />
          <Route path="/admin/hotels/:hotelId/bookings" element={<RequireAuth type="admin"><AdminHotelBookings /></RequireAuth>} />
          <Route path="/booking/details/:id" element={<RequireAuth type="user"><BookedRoomDetail /></RequireAuth>} />
          <Route path="/hotel/booking/details/:id" element={<RequireAuth type="hotel"><HotelBookingDetail /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {showFooter && <Footer />}
    </div>
  );
}
