# 🌍 Geo-Pulse

> **A live 3D world map for real-time disaster alerts, community reports, and local events.**

Geo-Pulse connects people with live community issues, local events, and official emergency alerts around the world — all shown on an interactive 3D virtual globe powered by CesiumJS. It pulls real-time disaster data from the USGS and NASA, shows live hazard markers on Earth, and can send SMS warnings to registered users.

[![Live Website](https://img.shields.io/badge/Live-Geo--Pulse%20App-0ea5e9?style=for-the-badge&logo=render)](https://geopulse-frontend.onrender.com)
[![API Status](https://img.shields.io/badge/API-Active-22c55e?style=for-the-badge&logo=node.js)](https://geopulse-backend.onrender.com/api/health)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Geo--Pulse---181717?style=for-the-badge&logo=github)](https://github.com/suryapalsingh8899/Geo-Pulse-)

---

## 🚀 Why Geo-Pulse?

Local neighborhood problems — such as potholes, broken roads, waterlogging, and accidents — often get noticed too late. At the same time, sudden natural disasters like earthquakes and wildfires require immediate public awareness. 

**Geo-Pulse solves both in one place:**
1. **Community Reports:** Citizens can drop a pin on the map to share local road issues, safety hazards, and community updates with photos.
2. **Live Disaster Alerts:** Official real-time hazard data is tracked directly on the 3D globe so you always know what is happening around the planet.

---

## ✨ Features & Highlights

### 🚨 Live Disaster Alert Radar
- **Live Official Feeds:**
  - **USGS** — Live earthquake tracking with Richter magnitude, depth, and tsunami warnings.
  - **NASA EONET** — Active wildfires, severe weather anomalies, volcanoes, and floods.
- **Instant Response (0ms Lag):** Pre-warmed server cache and stale-while-revalidate caching ensure that clicking the Alerts button opens hazards instantly with no loading delay.
- **Visual Hazard Markers:** Clear emoji markers on the 3D globe show the exact locations of earthquakes, fires, and storms.
- **SMS Alerts:** Emergency broadcasts can be sent to registered user phones via the TextBee SMS gateway.

### 🌐 3D Virtual Globe
- **Powered by CesiumJS:** Photorealistic 3D Earth with smooth mouse orbit, zoom, and tilt controls.
- **Live HUD Page Banner:** A top-center glass banner always tells you where you are on the map (Global Overview, Community Reports, Disaster Alerts, Local Events, or Pinning a Location).
- **Day & Night Themes:** Switch between sleek dark mode and clear light mode inside Settings.
- **Smooth Performance:** Renders on demand (`requestRenderMode`) to conserve laptop and mobile battery life.

### 📋 Community Reports (Local Issues)
- **Pin Any Problem:** Click on the globe to report potholes, waterlogged roads, traffic blocks, or accidents.
- **Photo Attachments:** Upload image proof directly with your report.
- **Community Voting:** Upvote true reports or downvote outdated ones so everyone gets reliable information.
- **Works Offline:** If your internet disconnects, your reports are saved safely on your device and sent automatically once you are back online.

### 🎟️ Community Events
- **Discover Local Gatherings:** Find community festivals, music meetups, sports events, and cultural shows pinned near you.
- **Host Your Event:** Drop a pin, add date/time details, poster images, and invite friends and neighbors.

### 📖 Website Guide & Information (`(i)` Button)
- Click the **`(i)`** button in the top-right navbar anytime to open the complete Guide & About modal:
  - **About Website:** High-level platform mission and creator details.
  - **How to Use:** Easy instructions for spinning the globe, zooming, tilting, and dropping pins.
  - **Helpful Features:** Cheat sheet of GPS location finder, offline auto-sync, hazard radar, and voting.
  - **Live Data Sources:** Information on CesiumJS, USGS earthquake data, and NASA satellites.

### 🔐 Simple Phone Login & SMS OTP
- Quick and secure login using a one-time SMS verification code sent straight to your phone.
- No long passwords required; fast account creation for any citizen.

### 👤 User Profiles & Credibility
- View your account statistics, total upvotes, and list of posted community reports.
- Click any contributor's name to view their verified community profile and activity.

---

## 🛠️ Technology Stack

### Frontend (`frountend/`)
| Technology | Purpose |
|---|---|
| **React 19 + Vite** | High-performance frontend application framework |
| **CesiumJS** | Hardware-accelerated 3D virtual globe engine |
| **Vanilla CSS** | Custom glassmorphism design system with dark & light themes |
| **i18next** | Multi-language translation support |
| **react-easy-crop** | Profile avatar image cropping |

### Backend (`backend/`)
| Technology | Purpose |
|---|---|
| **Node.js + Express.js** | Fast REST API server |
| **MongoDB Atlas + Mongoose** | Cloud database with resilient in-memory fallback store |
| **JWT** | Secure user authentication sessions |
| **USGS Earthquake API** | Official global earthquake records |
| **NASA EONET API** | Live natural disaster and hazard events |
| **TextBee SMS Gateway** | Instant SMS OTP codes and emergency warning blasts |
| **Multer** | Photo and media upload handler |

---

## 📁 Project Structure

```text
Geo-Pulse/
├── render.yaml                          # Render Blueprint for 1-click cloud deployment
├── README.md                            # Project documentation
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
│       │   ├── User.js                  # User model
│       │   ├── Report.js                # Community Report model
│       │   ├── Event.js                 # Community Event model
│       │   └── Alert.js                 # Disaster Alert model
│       ├── controllers/
│       │   ├── alertController.js       # USGS & NASA sync with stale-while-revalidate caching
│       │   ├── authController.js        # Phone login, SMS OTP, and JWT
│       │   ├── reportController.js      # Community reports CRUD and voting
│       │   ├── eventController.js       # Community events CRUD
│       │   └── uploadController.js      # Image and media file handling
│       ├── routes/                      # Express route endpoints
│       ├── middleware/                  # Auth and upload middleware
│       └── utils/
│           └── smsService.js            # TextBee SMS service
│
└── frountend/
    ├── vite.config.js                   # Vite + Cesium plugin configuration
    ├── package.json
    └── src/
        ├── App.jsx
        ├── index.css                    # Unified design tokens, modal hero styling & HUD
        ├── services/
        │   └── api.js                   # Centralized API client
        └── components/
            ├── map/
            │   └── Map.jsx              # 3D Cesium globe, HUD page banner, and controls
            ├── layout/
            │   ├── HomePage.jsx         # Main layout, top navbar, and modal handlers
            │   └── SplashScreen.jsx     # Startup screen ("By Suryapal Singh")
            ├── modals/
            │   ├── InfoModal.jsx        # Website guide & about modal (opened via (i) button)
            │   ├── AddReportModal.jsx   # Post a Community Report modal
            │   ├── ReportDetailModal.jsx# Community report details view
            │   ├── AddEventModal.jsx    # Create a Community Event modal
            │   ├── EventDetailModal.jsx # Community event details view
            │   ├── AlertDetailModal.jsx # Live disaster alert details
            │   ├── ProfileModal.jsx     # User profile and account activity
            │   ├── PublicProfileModal.jsx # Public contributor view
            │   └── SettingsModal.jsx    # Display & preference controls
            ├── buttons/
            │   ├── LoginButton.jsx      # Sign In button and modal
            │   ├── RegisterButton.jsx   # Create Account button and modal
            │   ├── ProfileButton.jsx
            │   └── LogoutButton.jsx
            └── utils/
                └── OfflineBuffer.jsx    # Offline storage and auto-sync
```

---

## 🏃 Running Locally

### 1. Clone the Repository

```bash
git clone https://github.com/suryapalsingh8899/Geo-Pulse-.git
cd Geo-Pulse-
```

### 2. Set Up the Backend

```bash
cd backend
npm install
cp .env.example .env     # Add your MongoDB connection string and SMS keys
npm run dev
# Backend starts at: http://localhost:5000
```

### 3. Set Up the Frontend

```bash
cd ../frountend
npm install
npm run dev
# Frontend starts at: http://localhost:5555
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB Atlas database URI | `mongodb+srv://user:pass@cluster.mongodb.net/geopulse` |
| `JWT_SECRET` | Secret key for JWT session tokens | `your_secret_key` |
| `CLIENT_URL` | Allowed frontend origin | `http://localhost:5555` |
| `TEXTBEE_API_KEY` | TextBee SMS API Key | `your_textbee_api_key` |
| `TEXTBEE_DEVICE_ID`| TextBee Device ID | `your_textbee_device_id` |

### Frontend (`frountend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | REST API endpoint | `http://localhost:5000/api` |

*(No API keys needed for NASA or USGS — both are free and public).*

---

## 📄 Author & Credits

Designed & Developed with ❤️ by **Suryapal Singh**  
GitHub: [@suryapalsingh8899](https://github.com/suryapalsingh8899)