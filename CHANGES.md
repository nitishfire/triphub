# TripHub v2.0 — Changes & Improvements

## Summary
Complete rebuild of TripHub from a basic EJS/HTML app into a modern full-stack application using **React.js**, **Node.js REST API**, and **Tailwind CSS** with a stunning glassmorphism UI design.

---

## New File Structure

```
triphub/
├── server/                     ← Node.js backend (REST API)
│   ├── index.js                ← Express server entry point
│   ├── db.js                   ← MongoDB connection
│   ├── middleware/
│   │   └── auth.js             ← JWT authentication middleware
│   ├── models/
│   │   ├── User.js             ← User Mongoose schema
│   │   ├── Hotel.js            ← Hotel Mongoose schema
│   │   ├── Room.js             ← Room listing schema
│   │   ├── Booking.js          ← Booking schema
│   │   └── Admin.js            ← Admin schema
│   └── routes/
│       ├── auth.js             ← Register/Login endpoints
│       ├── hotels.js           ← Hotel/Room CRUD + stats endpoints
│       ├── bookings.js         ← Booking + user-stats endpoints
│       └── admin.js            ← Admin management endpoints
│
├── client/                     ← React.js frontend
│   ├── index.html              ← Root HTML with Inter font
│   ├── vite.config.js          ← Vite dev server + API proxy
│   ├── tailwind.config.js      ← Custom animations & design tokens
│   ├── postcss.config.js       ← PostCSS with Tailwind + Autoprefixer
│   ├── public/
│   │   ├── logo.png            ← TripHub logo (dark)
│   │   ├── logo-white.png      ← TripHub logo (white)
│   │   └── logo-color.png      ← TripHub logo (color)
│   └── src/
│       ├── App.jsx             ← Router with protected routes
│       ├── main.jsx            ← React entry + toast provider
│       ├── index.css           ← Tailwind + custom component classes
│       ├── api/axios.js        ← Axios instance with JWT interceptor
│       ├── context/AuthContext.jsx  ← Auth state (JWT + localStorage)
│       ├── components/
│       │   ├── Navbar.jsx      ← Smart navbar (changes by user type)
│       │   ├── HotelCard.jsx   ← Room card with Unsplash images
│       │   ├── BookingCard.jsx ← Booking card with cancel action
│       │   ├── ConfirmModal.jsx← Glassmorphism confirmation dialog
│       │   ├── Spinner.jsx     ← Loading spinner + page spinner
│       │   └── Footer.jsx      ← Dark gradient footer
│       └── pages/
│           ├── LandingPage.jsx         ← Hero with search + animated stats
│           ├── LoginPage.jsx           ← Glassmorphism login
│           ├── RegisterPage.jsx        ← Registration with welcome bonus
│           ├── UserDashboard.jsx       ← Browse & book with filters
│           ├── UserProfile.jsx         ← Profile stats & info
│           ├── UserBookings.jsx        ← My bookings + cancel
│           ├── HotelLoginPage.jsx      ← Hotel login portal
│           ├── HotelRegisterPage.jsx   ← Hotel registration
│           ├── HotelDashboard.jsx      ← Publish rooms, manage listings
│           ├── HotelProfile.jsx        ← Hotel profile & earnings
│           ├── HotelManageBookings.jsx ← View & cancel user bookings
│           ├── HotelUpdateRoom.jsx     ← Edit room details
│           ├── AdminDashboard.jsx      ← Stats + tabbed Hotels/Users
│           └── AdminUserBookings.jsx   ← View specific user bookings
│
├── .env                        ← Environment variables
├── package.json                ← Root scripts (dev, build, install:all)
└── CHANGES.md                  ← This file
```

---

## Architecture Changes

### Before
- **Server-side rendering** with EJS templates
- **Global variables** used for session state (username, password, hotel data) — severe security flaw
- No authentication — any user could access any page
- All files flat at root level (CSS_Files/, views/, Node_JS_Files/)
- Static HTML pages with inline CSS

### After
- **React SPA** with client-side routing (React Router v6)
- **JWT authentication** — tokens stored in localStorage, sent as Bearer header
- **Protected routes** — each route checks auth type (user/hotel/admin)
- **REST API** — clean separation between frontend and backend
- Proper **MVC structure** (models, routes, middleware)
- **Vite** as build tool with hot module replacement
- **Tailwind CSS** with custom design system (glassmorphism, gradients, animations)

---

## Security Fixes

| Issue | Fix |
|-------|-----|
| Passwords stored in plain text | **bcryptjs** hashing (salt rounds: 10) |
| Global variables for sessions | **JWT tokens** (7 day expiry) |
| No route protection | `RequireAuth` component + JWT middleware |
| No input validation | Server-side validation on all endpoints |
| Deprecated callback-style Mongoose | Converted to **async/await** |
| alert() for error messages | **react-hot-toast** notifications |

---

## UI/UX Improvements

- **Glassmorphism design** — backdrop-blur, semi-transparent cards, frosted glass effects throughout
- **Full-screen hero landing page** — Unsplash background with animated counters, gradient overlays, and featured rooms grid
- **Glassmorphism auth pages** — full-viewport background images with frosted glass form cards
- **Smart Navbar** — fixed top navbar with glassmorphism blur, different links per user type, avatar initials, mobile hamburger menu
- **Wallet balance pill** — gradient emerald pill in navbar showing real-time balance
- **Unsplash hotel images** — 6 rotating high-quality hotel room images for room cards
- **Animated counters** — landing page stats animate counting up on load
- **Room cards with image overlays** — hover zoom effect, gradient price badges, room type/capacity pills
- **Gradient headers** — purple-to-pink gradient hero banners on dashboard pages
- **Custom design system** — reusable classes: btn-primary, btn-secondary, btn-danger, input-field, card, glass, glass-dark, gradient-text
- **Custom animations** — fade-in, slide-up, slide-down, scale-in, float, shimmer, count-up
- **Loading states** — gradient spinners with logo pulse on all async operations
- **Confirmation modals** — glassmorphism backdrop with smooth animations
- **Toast notifications** — styled toasts replacing browser `alert()` dialogs
- **Hotel room cards** with color-coded room type badges and Unsplash images
- **Admin dashboard** with animated stats cards and tabbed Hotels/Users layout
- **Price range filter** — min/max price filtering on room search
- **Dark gradient footer** with quick links
- **Responsive design** — mobile-first, works on all screen sizes
- **Custom scrollbar** — thin, rounded scrollbar styling
- **Inter font** — clean, modern typography via Google Fonts

---

## New Features Added

1. **Public Stats API** — GET /api/hotels/stats returns total hotels, rooms, users, and bookings for landing page
2. **User Stats API** — GET /api/bookings/user-stats returns total bookings, total spent, and balance
3. **Animated Landing Page Counters** — real-time animated stats (hotels, rooms, guests, bookings)
4. **Featured Rooms on Landing** — public room browsing with "Login to Book" overlay on hover
5. **Price Range Filter** — min/max price filtering in addition to city, type, and capacity
6. **Room Type Dropdown** — standardized room types (Single, Double, Suite, Deluxe)
7. **Smart City Search** — regex-based case-insensitive city search
8. **Balance Display in Navbar** — wallet balance always visible as gradient pill
9. **Welcome Bonus Badge** — Rs. 50,000 bonus shown on registration page
10. **Confirmation Modals** — glassmorphism modals prevent accidental cancellations
11. **Password Security** — bcrypt hashing with backward compatibility for existing DB entries
12. **Room Restore on Cancellation** — cancelled rooms go back to available listings
13. **Protected Routes** — unauthorized users redirected to login
14. **Auto Token Handling** — axios interceptor handles 401s and redirects to login
15. **Hotel Earnings Tracking** — earnings shown on hotel profile and dashboard
16. **Mobile Navigation** — hamburger menu with slide-down animation
17. **Admin Stats Dashboard** — animated cards with gradients for key metrics
18. **Footer Component** — dark gradient footer with organized quick links
19. **Image Zoom Effect** — hotel room images zoom on hover for visual engagement
20. **"Why TripHub" Section** — feature showcase cards on landing page

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, Vite 5, Tailwind CSS 3.4 |
| Backend | Node.js, Express.js 4 |
| Database | MongoDB with Mongoose 8 |
| Auth | JWT (jsonwebtoken), bcryptjs |
| HTTP Client | Axios with interceptors |
| Notifications | react-hot-toast |
| Routing | React Router v6 |
| Images | Unsplash (online, no local storage) |
| Font | Inter (Google Fonts) |
| Build | Vite with HMR + API proxy |

---

## How to Run

### Install dependencies
```bash
npm run install:all
```

### Development (runs both server + client)
```bash
npm run dev
```

- **API Server:** http://localhost:3000
- **React App:** http://localhost:5173

### Production build
```bash
npm run build
npm start
```
Then open http://localhost:3000

### Environment Variables (.env)
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/TripHub
JWT_SECRET=triphub_super_secret_2024_key
CLIENT_URL=http://localhost:5173
```

> **Note:** MongoDB must be running on localhost:27017

---

## Removed Files

- `CSS_Files/` — all old CSS files removed
- `views/` — all EJS templates removed
- `Node_JS_Files/Main.js` — replaced by `server/` directory
- `Home_Page_Images/` — all extra images removed (logos moved to `client/public/`)
- `Screenshot/` — screenshot folder removed
- `index.html`, `LogInPage.html`, `RegistrationPage.html`, `HotelLogInPage.html`, `HotelRegistrationPage.html` — replaced by React pages
