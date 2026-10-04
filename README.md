# 🌍 Geo-Pulse

> **A real-time global disaster awareness & community reporting platform powered by a 3D interactive globe.**

Geo-Pulse connects communities with live local issues, events, and official global emergency alerts — all visualised on a stunning CesiumJS 3D map. It pulls real-time disaster data from NASA and USGS, animates them with pulsing radar waves on the globe, and can broadcast SMS warnings to all registered users instantly.

[![Live Website](https://img.shields.io/badge/Live-Geo--Pulse%20App-0ea5e9?style=for-the-badge&logo=render)](https://geopulse-frontend.onrender.com)
[![API Status](https://img.shields.io/badge/API-Active-22c55e?style=for-the-badge&logo=node.js)](https://geopulse-backend.onrender.com/api/health)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Geo--Pulse---181717?style=for-the-badge&logo=github)](https://github.com/suryapalsingh8899/Geo-Pulse-)

---

## 🚀 Motivation

Local community concerns — damaged infrastructure, sanitation hazards, road accidents — often fail to reach authorities in time. Meanwhile, global disasters like earthquakes and wildfires demand immediate public awareness. Geo-Pulse solves both: it empowers citizens to report geo-anchored local issues and delivers real-time official disaster alerts directly on an immersive 3D globe, making critical information impossible to miss.

---

## ✨ Feature Highlights

### 🚨 Global Disaster Alert System
- Pulls **live official data** from two major global APIs every 10 minutes:
  - **USGS** — Significant earthquakes & tsunami warnings worldwide
  - **NASA EONET** — Active wildfires, severe storms, cyclones, volcanoes, floods, and sea-ice events
- Disasters appear on the globe as **Emoji Billboards** for instant recognition:
  - 💥 Earthquakes & 🌊 Tsunamis (USGS)
  - 🔥 Wildfires, 🌋 Volcanoes, ⛈️ Severe Storms & 🌀 Cyclones (NASA)
- **Zero-Lag Static Rendering:** Complex 3D wave geometries have been replaced with highly performant static emoji billboards, eliminating main-thread stuttering and saving mobile battery.
- **Strictly Live Data:** Removed all historical/mock data. The map only tracks threats verified within the last 24–72 hours.
- Alerts are **lazy-loaded** — fetched only when the user first opens Alert Mode, keeping initial page load fast
- Server-side **10-minute in-memory cache** with `AbortSignal` timeouts prevents API hammering and handles NASA API downtimes gracefully
- Admin-created alerts trigger instant **SMS broadcasts** to all registered users via Textbee

### 🌐 Interactive 3D/2D Map Engine
- Powered by **CesiumJS** — full 3D globe with Google Maps raster tiles (forced English labels)
- Dark/Light mode toggle with live imagery layer adjustment (brightness, contrast, saturation, gamma)
- Smooth inertia zoom (trackpad + pinch), enforced pitch limits, custom camera controls
- `requestRenderMode: true` — no continuous GPU draw loop; renders only on demand (critical for mobile battery)
- Mobile-adaptive tile cache (`100` tiles) and screen-space error (`4`) vs desktop (`500` / `2`)

### 📢 Community Reporting
- Pin geo-anchored reports with photo/video evidence, category tags, and descriptions
- Community upvote/downvote with optimistic UI updates
- Offline Mode: reports and events saved to `localStorage` when backend is unreachable
- Seen/unseen marker state — seen pins render as grey, unseen as vivid heatmap glows

### 📅 Local Events
- Create, browse, and interact with community events pinned to the globe
- Event posters, photos, videos, timing, and public/private visibility settings
- Event upvoting system

### 🔐 Phone Authentication & SMS OTP
- **Backend SMS Auth** via Textbee SMS Gateway — OTP sent to user's phone
- JWT session management with auto-session restore on page reload
- Brute-force protection and spam lockout on the backend

### ⚡ Resilient Architecture
- MongoDB Atlas primary database with automatic **in-memory fallback store** if DB is unreachable
- `localStorage` offline buffer persists reports/events across sessions
- All external API failures are isolated — if NASA or USGS is down, cached data is served

### 👤 User Profiles & Reputation
- Custom usernames, avatar upload with crop tool (`react-easy-crop`)
- Reputation stats: total upvotes, downvotes, contribution count
- Public profile view — click any author name to see their profile

### 🌐 Multi-Language Support
- `i18next` internationalisation — map UI elements support multiple languages

---

## 🛠️ Tech Stack

### Frontend (`frountend/`)
| Technology | Purpose |
|---|---|
| React 19 + Vite | Core framework & build tool |
| CesiumJS + `vite-plugin-cesium` | 3D globe, entity rendering, wave animations |
| Vanilla CSS | Modern dark glassmorphism design system |
| `i18next` | Multi-language localisation |
| `react-easy-crop` | Avatar image cropping |

### Backend (`backend/`)
| Technology | Purpose |
|---|---|
| Node.js + Express.js (ES Modules) | REST API server |
| MongoDB + Mongoose (`.lean()` queries) | Primary database with in-memory fallback |
| JWT | Stateless session auth |
| **USGS Earthquake API** | Live earthquake & tsunami data |
| **NASA EONET API** | Live wildfire, storm, volcano, flood data |
| Textbee SMS Gateway | OTP auth + emergency SMS broadcasts |
| Multer | File upload middleware |

### Infrastructure
| Service | Purpose |
|---|---|
| Render Blueprint (`render.yaml`) | One-click deploy for backend + frontend |
| Vercel (`vercel.json`) | Frontend SPA routing fallback |
| MongoDB Atlas | Cloud database |

**Production URLs:**
- 🌐 Frontend: [https://geopulse-frontend.onrender.com](https://geopulse-frontend.onrender.com)
- ⚙️ Backend API: [https://geopulse-backend.onrender.com/api](https://geopulse-backend.onrender.com/api)

---

## 📁 Repository Structure

```text
Geo-Pulse/
├── render.yaml                      # Render Blueprint — 1-click deploy both services
├── README.md
├── .gitignore
│
├── backend/
│   ├── server.js                    # Express entry point (CORS, routes, uploads, trust proxy)
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── config/
│       │   └── db.js                # MongoDB connection + in-memory fallback store
│       ├── models/
│       │   ├── User.js
│       │   ├── Report.js
│       │   ├── Event.js
│       │   └── Alert.js             # Admin/custom alert schema
│       ├── controllers/
│       │   ├── authController.js    # SMS OTP, JWT, profile management
│       │   ├── reportController.js  # CRUD, voting, seen state
│       │   ├── eventController.js   # CRUD, voting
│       │   ├── alertController.js   # USGS + NASA EONET fetcher, 10-min cache, SMS blast
│       │   └── uploadController.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── reportRoutes.js
│       │   ├── eventRoutes.js
│       │   ├── alertRoutes.js
│       │   └── uploadRoutes.js
│       ├── middleware/
│       │   ├── authMiddleware.js    # JWT verification
│       │   └── uploadMiddleware.js  # Multer config
│       └── utils/
│           └── smsService.js        # Textbee SMS helper
│
└── frountend/
    ├── vite.config.js               # Vite + Cesium plugin
    ├── vercel.json                  # SPA rewrite rules
    ├── package.json
    └── src/
        ├── App.jsx
        ├── index.css                # Global design system (glassmorphism, dark/light tokens)
        ├── services/
        │   └── api.js               # Centralised API client (auth, reports, events, alerts)
        ├── config/
        │   └── firebase.js
        └── components/
            ├── map/
            │   └── Map.jsx          # CesiumJS globe, entity rendering, wave pulse animation
            ├── layout/
            │   └── HomePage.jsx     # App shell, state management, lazy alert loading
            ├── modals/
            │   ├── AddReportModal.jsx
            │   ├── ReportDetailModal.jsx
            │   ├── AddEventModal.jsx
            │   ├── EventDetailModal.jsx
            │   ├── AlertDetailModal.jsx  # Disaster detail view (severity, source, description)
            │   ├── ProfileModal.jsx
            │   ├── PublicProfileModal.jsx
            │   └── SettingsModal.jsx
            ├── buttons/
            │   ├── LoginButton.jsx
            │   ├── RegisterButton.jsx
            │   ├── ProfileButton.jsx
            │   ├── LogoutButton.jsx
            │   └── ReportsButton.jsx
            └── utils/
                └── OfflineBuffer.jsx
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/geopulse` |
| `JWT_SECRET` | JWT signing secret | `your_jwt_secret` |
| `CLIENT_URL` | CORS allowed origin | `https://geopulse-frontend.onrender.com` |
| `TEXTBEE_API_KEY` | Textbee API key for SMS | `your_textbee_api_key` |
| `TEXTBEE_DEVICE_ID` | Textbee Device ID | `your_textbee_device_id` |

### Frontend (`frountend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend REST API base URL | `http://localhost:5000/api` |

> No API keys are needed for NASA EONET or USGS — both are **free and public**.

---

## 🏃 Running Locally

### 1. Clone

```bash
git clone https://github.com/suryapalsingh8899/Geo-Pulse-.git
cd Geo-Pulse-
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev
# → http://localhost:5000
```

### 3. Frontend

```bash
cd ../frountend
npm install
npm run dev
# → http://localhost:5173
```

---

## 🚀 Cloud Deployment (Render)

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New +** → **Blueprint**
2. Connect repository `suryapalsingh8899/Geo-Pulse-`
3. Fill in environment variables (`MONGODB_URI`, `JWT_SECRET`, `TEXTBEE_API_KEY`, `TEXTBEE_DEVICE_ID`)
4. Click **Deploy Blueprint** — Render provisions both services automatically from [`render.yaml`](render.yaml)

---

## 📄 License & Author

Developed with ❤️ by **Suryapal Singh** ([@suryapalsingh8899](https://github.com/suryapalsingh8899))