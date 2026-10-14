# 🌍 Geo-Pulse

> **A real-time 3D/2D geospatial platform for live disaster tracking, community civic reporting, and location-based event discovery.**

Geo-Pulse connects citizens, communities, and authorities through an interactive, photorealistic virtual globe powered by CesiumJS. It aggregates official real-time hazard data from the USGS and NASA, allows users to report local infrastructure issues with photo/video proof, and enables visual discovery of nearby events and opportunities.

[![Live Website](https://img.shields.io/badge/Live-Geo--Pulse%20App-0ea5e9?style=for-the-badge&logo=render)](https://geopulse-frontend.onrender.com)
[![API Status](https://img.shields.io/badge/API-Active-22c55e?style=for-the-badge&logo=node.js)](https://geopulse-backend.onrender.com/api/health)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Geo--Pulse---181717?style=for-the-badge&logo=github)](https://github.com/suryapalsingh8899/Geo-Pulse-)
[![CesiumJS](https://img.shields.io/badge/Map_Engine-CesiumJS_3D%2F2D-6366f1?style=for-the-badge)](https://cesium.com/)

---

## 🚀 Why Geo-Pulse?

Local neighborhood problems — such as potholes, broken drainage, sanitation issues, and waterlogging — often remain scattered across social media or WhatsApp groups without reaching authorities. Simultaneously, sudden natural disasters like earthquakes and wildfires require immediate, visual public awareness.

**Geo-Pulse bridges this gap in a single unified platform:**
1. **Community Civic Reports:** Citizens pin local hazards on the globe, attach photos, and upvote critical issues so authorities can prioritize action.
2. **Real-Time Disaster Radar:** Live hazard data from NASA and USGS is mapped globally with live counts, severity indicators, and radar pulses.
3. **Location-Based Events:** Discover nearby concerts, college festivals, hackathons, and sports meetups based on date and distance.
4. **Interactive 3D / 2D Mapping:** Seamlessly switch between a 3D digital globe and a 2D flat map, with instant geocoding search to fly anywhere on Earth.

---

## ✨ Features & Highlights

### 🔍 Interactive Location Search Bar (OpenStreetMap Nominatim)
- **Instant Geocoding:** Type any city, country, or landmark into the navbar search bar.
- **Smart Autocomplete:** Debounced suggestions dropdown with location icons and full address hierarchy.
- **Fly-To Animation:** Automatically animates the CesiumJS camera across space to the searched location with a branded animated pin.
- **In-Place Responsive Layout:** Engineered to sit directly in the top navbar without overlapping the brand logo or action buttons across any screen size (from 360px mobile to 4K desktop).

### 🌐 3D Globe & 2D Flat Map Morphing
- **Dual-Projection Engine:** Switch dynamically between an orbital **3D Digital Globe** and a **2D Flat Projection Map** using Cesium's `morphTo2D()` and `morphTo3D()`.
- **Floating Projection Controls:** Convenient one-tap projection switcher at the bottom-right of the viewport.
- **Battery & Performance Optimized:** Runs with on-demand rendering (`requestRenderMode: true`) to preserve battery life on laptops and mobile devices.

### 🚨 Live Disaster Alert Radar & Dropdown Menu
- **Official Satellite & Sensor Feeds:**
  - **USGS** — Live global earthquake tracking with magnitude, depth, and tsunami warnings.
  - **NASA EONET** — Wildfires, volcanic activity, severe storms, cyclones, and flood anomalies.
- **Collapsible Dropdown Menu:** Replaces obstructive static sidebars with a sleek, interactive glassmorphic dropdown (`📡 Live Trackers • Active Count ▾`).
- **Real-Time Categorization & Counts:** Displays individual live counts for:
  - 💥 **Earthquakes**
  - 🌋 **Volcanoes**
  - 🌊 **Tsunamis**
  - 🔥 **Wildfires**
  - ⛈️ **Severe Storms**
  - 🌀 **Cyclones**
- **Interactive Map Filtering:** Click any disaster category in the dropdown to instantly filter and isolate those specific hazards on the globe.
- **Severity Level Legend:** Clear color-coded radar indicators for **Critical** (🔴), **High** (🟠), and **Medium / Low** (🟡).
- **Instant Response Caching:** Stale-while-revalidate caching and MongoDB Atlas backups ensure 0ms latency when opening alerts.

### 📋 Community Reporting System (Civic Issues)
- **Pin Any Issue:** Click anywhere on Earth to drop an issue pin (potholes, waterlogging, streetlights, accidents).
- **Rich Media Proof:** Upload photos or video evidence directly with the report.
- **Crowdsourced Prioritization:** Community members upvote genuine issues and downvote resolved ones to highlight urgent civic problems.
- **Offline Buffer:** Works even without an active internet connection — reports are saved in `localStorage` and automatically sync to the database once connection is restored.

### 🎟️ Location-Based Events Discovery
- **Local Event Exploration:** Browse upcoming college events, hackathons, concerts, workshops, and sports activities plotted geographically.
- **Host & Publish:** Registered users and organizers can pin new events with dates, descriptions, posters, and venue coordinates.

### 📱 Responsive & Standardized Typography
- **Clean Standardized Headers:** All modal and page headings are normalized (`font-weight: 600`, standard letter-spacing, clean hierarchy) for a professional, distraction-free interface.
- **Zero-Overlap Navbar:** Proportional UI scaling ensures the logo, search bar, and action buttons fit gracefully on all viewports without text collision.

### 🔐 Phone Login & SMS OTP Authentication
- Secure authentication flow using phone number verification and OTP codes.
- JWT session management with persistent login state.

### 👤 User Profile & Community Credibility
- View your account statistics, total upvotes received across reports, and community impact score.
- **Manage Contributions:** Easily edit or delete your own published reports and events.
- **Public Profile View:** Click any contributor's name to view their public impact and verified community activities.

### ⚙️ Settings & Personalization
- **Dark & Light Mode:** Seamless theme switching with custom glassmorphism color palettes.
- **Multi-Language Support:** Integrated `i18next` localization for multiple languages.
- **Privacy Controls:** Toggle location permissions and emergency notification preferences.

---

## 🛠️ Technology Stack

### Frontend (`frountend/`)
| Technology | Purpose |
|---|---|
| **React 19 + Vite** | High-performance SPA frontend framework |
| **CesiumJS** | WebGL-based 3D digital globe & 2D map engine |
| **OpenStreetMap Nominatim** | Public geocoding & place search API |
| **Vanilla CSS** | Tailored design system with glassmorphic tokens & dark/light modes |
| **i18next** | Internationalization & multi-language engine |
| **react-easy-crop** | Avatar profile image cropping |

### Backend (`backend/`)
| Technology | Purpose |
|---|---|
| **Node.js + Express.js** | RESTful API server |
| **MongoDB Atlas + Mongoose** | Cloud database with resilient in-memory fallback store |
| **JWT (JSON Web Tokens)** | Secure token-based user authentication |
| **USGS Earthquake API** | Official global earthquake records feed |
| **NASA EONET API** | Live natural hazard and satellite event feed |
| **TextBee SMS Gateway** | SMS OTP verification and emergency broadcast alerts |
| **Multer** | Image and media file upload handling |

---

## 📁 Project Structure

```text
Geo-Pulse/
├── render.yaml                          # Render Blueprint for 1-click cloud deployment
├── README.md                            # Comprehensive project documentation
├── .gitignore                           # Git ignore rules
│
├── backend/
│   ├── server.js                        # Express server entry point
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── config/
│       │   └── db.js                    # MongoDB Atlas connection & fallback store
│       ├── models/
│       │   ├── User.js                  # User profile & auth model
│       │   ├── Report.js                # Community Report model
│       │   ├── Event.js                 # Community Event model
│       │   └── Alert.js                 # Disaster Alert model
│       ├── controllers/
│       │   ├── alertController.js       # USGS & NASA sync with stale-while-revalidate caching
│       │   ├── authController.js        # Phone login, SMS OTP, and JWT
│       │   ├── reportController.js      # Community reports CRUD and voting
│       │   ├── eventController.js       # Community events CRUD
│       │   └── uploadController.js      # Image and media file handling
│       ├── routes/                      # Express route handlers (/api/auth, /api/reports, etc.)
│       ├── middleware/                  # JWT auth and file upload middleware
│       └── utils/
│           └── smsService.js            # SMS OTP and emergency dispatch service
│
└── frountend/
    ├── vite.config.js                   # Vite + Cesium plugin configuration
    ├── package.json
    └── src/
        ├── App.jsx
        ├── index.css                    # Unified design tokens, responsive breakpoints & UI
        ├── services/
        │   └── api.js                   # Centralized API service client
        └── components/
            ├── map/
            │   └── Map.jsx              # 3D/2D Cesium globe, Live Trackers dropdown, and pins
            ├── layout/
            │   ├── HomePage.jsx         # Main layout, responsive in-place navbar
            │   ├── SearchBar.jsx        # OpenStreetMap geocoding autocomplete search bar
            │   ├── Mode2D3DToggle.jsx   # 2D/3D map projection switcher
            │   └── SplashScreen.jsx     # Startup splash screen
            ├── modals/
            │   ├── InfoModal.jsx        # Platform guide & about documentation modal
            │   ├── AddReportModal.jsx   # Post a Community Report modal
            │   ├── ReportDetailModal.jsx# Community report details view
            │   ├── AddEventModal.jsx    # Create a Community Event modal
            │   ├── EventDetailModal.jsx # Community event details view
            │   ├── AlertDetailModal.jsx # Live disaster alert details modal
            │   ├── ProfileModal.jsx     # User profile, votes, and contribution management
            │   ├── PublicProfileModal.jsx # Public contributor view
            │   └── SettingsModal.jsx    # Theme, language, and permission controls
            ├── buttons/
            │   ├── LoginButton.jsx      # Sign In button and modal
            │   ├── RegisterButton.jsx   # Create Account button and modal
            │   ├── ProfileButton.jsx    # Profile trigger button
            │   └── LogoutButton.jsx     # Sign out action button
            └── utils/
                └── OfflineBuffer.jsx    # Offline storage & auto-sync mechanism
```

---

## 🏃 Running Locally

### 1. Clone the Repository

```bash
git clone https://github.com/suryapalsingh8899/Geo-Pulse-.git
cd Geo-Pulse-
```

### 2. Set Up and Start the Backend

```bash
cd backend
npm install
cp .env.example .env     # Configure MongoDB Atlas URI and JWT secret
npm run dev
# Backend runs at: http://localhost:5000/api
```

### 3. Set Up and Start the Frontend

```bash
cd ../frountend
npm install
npm run dev
# Frontend runs at: http://localhost:5555
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server listening port | `5000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/geopulse` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_secret_key` |
| `CLIENT_URL` | Allowed CORS frontend origin | `http://localhost:5555` |
| `TEXTBEE_API_KEY` | TextBee SMS gateway key *(optional)* | `your_textbee_api_key` |
| `TEXTBEE_DEVICE_ID`| TextBee Device ID *(optional)* | `your_textbee_device_id` |

### Frontend (`frountend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend REST API endpoint | `http://localhost:5000/api` |

*(No API keys are required for NASA EONET or USGS feeds — both are free and public).*

---

## 🎓 Academic Synopsis Alignment

This project is developed in accordance with the **Project Synopsis on GEO-PULSE**:
- **Author:** Mr. Suryapal Singh (2024COMPSC0029)
- **Department:** Department of Computer Science & Engineering
- **Institution:** NIMS Institute of Engineering & Technology, NIMS University, Jaipur, Rajasthan
- **Advisors:** Mr. Rameez Raja Sir & Dr. Shafqat UL Ahsaan Sir

All core objectives specified in the synopsis — including CesiumJS 3D/2D visualization, community civic problem reporting, location-based event discovery, real-time NASA/USGS emergency alerts, user profile tracking, and responsive design — are fully implemented and verified.

---

## 📄 Author & Credits

Designed & Developed with ❤️ by **Suryapal Singh**  
GitHub: [@suryapalsingh8899](https://github.com/suryapalsingh8899)