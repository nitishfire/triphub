# TripHub 🏨

**Find Your Perfect Stay** — A modern hotel booking platform where users can browse, search, and book accommodations effortlessly.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-blue)](https://triphub-theta.vercel.app/)
[![JavaScript](https://img.shields.io/badge/JavaScript-99.2%25-yellow)](https://github.com/nitishfire/triphub)

---

## Features ✨

- 🔐 **User Authentication** — Secure login and registration system
- 🏠 **Hotel Listings** — Browse and search hotels with detailed information
- 💰 **Booking System** — Reserve your perfect stay with ease
- 🔍 **Advanced Search** — Filter hotels by location, price, and amenities
- 📱 **Responsive Design** — Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI** — Clean and intuitive user interface

---

## Tech Stack 🛠️

**Frontend:**
- React.js
- HTML5 & CSS3
- JavaScript (ES6+)
- Responsive Web Design

**Backend:**
- Node.js
- Express.js
- REST API

**Deployment:**
- Vercel (Frontend)
- Database: [Configured in backend]

---

## Getting Started 🚀

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
   git clone https://github.com/nitishfire/triphub.git
   cd triphub
```

2. **Install dependencies for both client and server:**
```bash
   # Install client dependencies
   cd client
   npm install
   cd ..

   # Install server dependencies
   cd server
   npm install
   cd ..
```

3. **Configure environment variables:**
```bash
   # Create .env file in the root directory
   cp .env.example .env
```
   Update the `.env` file with your configuration:
```
   REACT_APP_API_URL=http://localhost:5000
   PORT=5000
   DATABASE_URL=your_database_url
```

### Running Locally

**Start the development server:**
```bash
# From the root directory
npm run dev
```

Or run client and server separately:
```bash
# Terminal 1 - Start the backend server
cd server
npm start

# Terminal 2 - Start the frontend development server
cd client
npm start
```

The application will be available at `http://localhost:3000`

---

## Usage 📖

### For Users

1. **Sign Up / Login** — Create an account or log in to your existing account
2. **Search Hotels** — Use the search bar to find hotels by location and dates
3. **View Details** — Click on a hotel to see full details, amenities, and reviews
4. **Book a Room** — Select your dates and complete the booking process
5. **Manage Bookings** — View and manage your reservations

### API Endpoints (Backend)

- `POST /auth/register` — Register a new user
- `POST /auth/login` — User login
- `GET /hotels` — Get all available hotels
- `GET /hotels/:id` — Get hotel details
- `POST /bookings` — Create a new booking
- `GET /bookings` — Get user bookings

---

## Project Structure 📁
```
triphub/
├── client/              # Frontend (React)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/              # Backend (Node.js + Express)
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
├── .env                 # Environment variables
└── package.json
```

---

## Screenshots 📸

### Login Page
![Login Page](https://github.com/nitishfire/triphub/raw/master/Screenshot/1.png)

### Hotel Listings
![Hotel Listings](https://github.com/nitishfire/triphub/raw/master/Screenshot/2.png)

### Hotel Details
![Hotel Details](https://github.com/nitishfire/triphub/raw/master/Screenshot/3.png)

### Booking Page
![Booking Page](https://github.com/nitishfire/triphub/raw/master/Screenshot/4.png)

### User Dashboard
![User Dashboard](https://github.com/nitishfire/triphub/raw/master/Screenshot/5.png)

### Confirmation
![Booking Confirmation](https://github.com/nitishfire/triphub/raw/master/Screenshot/6.png)

---

## Deployment 🌐

The application is deployed on **Vercel** and is live at:

**👉 [https://triphub-theta.vercel.app/](https://triphub-theta.vercel.app/)**

### Deploy Your Own

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy with a single click

---

## Contributing 🤝

Contributions are welcome! If you'd like to improve TripHub:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License 📄

This project is distributed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Terms of Use ⚖️

By accessing, downloading, or using this project, you agree to the following:

- **Misuse**: Any misuse or misleading use of this project is strictly prohibited
- **Modifications**: You can modify the project, but modifications are at your own risk
- **Functionality**: The project is provided as-is without any warranty
- **Acceptance**: By downloading and using the project, you accept these terms

For full details, see the [TERMS.md](TERMS.md) file in the repository.

---

## About

TripHub is a prototype hotel booking website built during my college final years. It demonstrates full-stack web development with a focus on user experience and modern web technologies.

---

## Support 💬

If you have questions or need help:
- Open an [Issue](https://github.com/nitishfire/triphub/issues) on GitHub
- Check out existing discussions
- Review the documentation

---

## Acknowledgements 🙏

- Built with React.js and Node.js
- Deployed on Vercel
- Created as a college project

---

**Made with ❤️ by [Nitish](https://github.com/nitishfire)**
