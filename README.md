# 🌍 Geo-Pulse

Geo-Pulse is an interactive, location-based web platform designed to bring relevant local information together through a unified 3D/2D visual map interface. It connects communities with local issues, events, emergency alerts, and spatial insights to promote community awareness and rapid decision-making.

[![Live Website](https://img.shields.io/badge/Live-Geo--Pulse%20App-0ea5e9?style=for-the-badge&logo=render)](https://geopulse-frontend.onrender.com)
[![API Status](https://img.shields.io/badge/API-Active-22c55e?style=for-the-badge&logo=node.js)](https://geopulse-backend.onrender.com/api/health)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Geo--Pulse---181717?style=for-the-badge&logo=github)](https://github.com/suryapalsingh8899/Geo-Pulse-)

---

## 🚀 Motivation
Many local community concerns—such as damaged infrastructure, sanitation hazards, or safety hazards—often remain unnoticed or fail to reach local authorities in time. Geo-Pulse empowers citizens to report structured issues connected directly to geographical coordinates with supporting photo/video evidence. Simultaneously, it allows citizens and organizations to visually publish and discover nearby events and emergency alerts without searching through scattered channels.

---

## ✨ Key Features

- **🌐 Interactive 3D/2D Map Engine**: Powered by **CesiumJS**, featuring interactive globe entity markers, custom category pins, geo-location centering, and 3D terrain exploration.
- **📢 Community Reporting System**: Submit location-anchored reports with descriptions, photo/video media uploads, category tagging, and community voting (upvote/downvote).
- **📅 Location-Based Events & Activities**: Discover and publish community events (meetings, concerts, hackathons, cleanups) with date/time pickers and interactive map entities.
- **🔐 Phone Authentication & Dual SMS OTP**: Real-time SMS OTP verification powered by **Firebase Phone Auth** with invisible reCAPTCHA, backed by dual backend SMS dispatch (Fast2SMS) and on-screen toast fallback code alerts.
- **⚡ Resilient Database Architecture**: MongoDB Atlas integration with an automatic in-memory fallback store to ensure zero downtime even if the database is unconfigured.
- **👤 User Profiles & Reputation**: Personalized user profiles, reputation points, contribution metrics, and security lockouts against spam/brute-force.

---

## 🛠️ Tech Stack

### Frontend (`frountend/`)
- **Core Framework**: React 19 (built with Vite)
- **Map Viewer**: CesiumJS & `vite-plugin-cesium`
- **Styling**: Vanilla CSS (Modern Dark Glassmorphism Design System)
- **Utilities**: `i18next` (Multi-language localization), `react-easy-crop` (Avatar cropping)

### Backend (`backend/`)
- **Runtime & Server**: Node.js & Express.js (ES Modules)
- **Database**: MongoDB & Mongoose ODM (with automatic in-memory fallback store)
- **Authentication**: JWT (JSON Web Tokens) & Firebase Auth SDK
- **File Storage**: Multer middleware for static media uploads (`/uploads`)

### Hosting & Infrastructure
- **Deployment**: Render Blueprint (`render.yaml`) & Vercel (`frountend/vercel.json`)
- **Production Endpoints**:
  - **Live Frontend App**: [https://geopulse-frontend.onrender.com](https://geopulse-frontend.onrender.com)
  - **Live Backend API**: [https://geopulse-backend.onrender.com/api](https://geopulse-backend.onrender.com/api)

---

## 📁 Repository Structure

```text
Geo-Pulse/
├── render.yaml                  # Render Blueprint configuration for 1-click deployment
├── README.md                    # Project documentation
├── .gitignore                   # Excludes secrets, node_modules, and build outputs
├── backend/                     # Express REST API Server
│   ├── server.js                # Server entry point (CORS, trust proxy, routes, uploads)
│   ├── package.json             # Backend dependencies & scripts
│   ├── .env.example             # Template for environment variables
│   └── src/
│       ├── config/db.js         # Mongoose connection & in-memory fallback store
│       ├── models/              # User, Report, Event Mongoose schemas
│       ├── controllers/         # Authentication, Report, Event & Upload logic
│       ├── routes/              # Express route definitions
│       ├── middleware/          # JWT auth, Multer upload, and error handling
│       └── utils/               # Fast2SMS helper & utility functions
└── frountend/                   # React 19 + Vite Frontend Application
    ├── vite.config.js           # Vite + Cesium plugin configuration
    ├── vercel.json              # Vercel SPA rewrite rules
    ├── package.json             # Frontend dependencies & scripts
    └── src/
        ├── App.jsx              # Main Dashboard shell
        ├── services/api.js      # Central API client layer
        ├── config/firebase.js   # Firebase App & Phone Auth initializers
        ├── components/
        │   ├── map/Map.jsx      # CesiumJS globe component & entity rendering
        │   ├── modals/          # Add Report, Add Event, Details & Profile modals
        │   └── buttons/         # Register, Login, Profile & Filter buttons
        └── assets/              # UI graphics and styles
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB Atlas Connection String | `mongodb+srv://user:pass@cluster.mongodb.net/geopulse` |
| `JWT_SECRET` | Secret key for JWT signing | `geopulse_super_secret_jwt_key_2026` |
| `CLIENT_URL` | Allowed CORS origin | `*` or `https://geopulse-frontend.onrender.com` |
| `FAST2SMS_API_KEY` | Optional Fast2SMS API Key for SMS fallback | `your_fast2sms_api_key` |

### Frontend (`frountend/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL of the backend REST API | `http://localhost:5000/api` |

---

## 🏃 Running Locally

### 1. Clone the Repository
```bash
git clone https://github.com/suryapalsingh8899/Geo-Pulse-.git
cd Geo-Pulse-
```

### 2. Start Backend API
```bash
cd backend
npm install
npm run dev
# Server running on http://localhost:5000
```

### 3. Start Frontend App
```bash
cd ../frountend
npm install
npm run dev
# App running on http://localhost:5173
```

---

## 🚀 Cloud Deployment

### Deploy via Render Blueprint (Recommended)
1. Go to [dashboard.render.com](https://dashboard.render.com/) $\rightarrow$ **New +** $\rightarrow$ **Blueprint**.
2. Connect repository `suryapalsingh8899/Geo-Pulse-`.
3. Provide environment variables (`MONGODB_URI`, `JWT_SECRET`).
4. Click **Deploy Blueprint**. Render will provision both backend web service and frontend static site automatically using [`render.yaml`](file:///e:/GITHUB/Geo%20pulse/render.yaml).

---

## 📄 License & Author

Developed with ❤️ by **Suryapal Singh** ([@suryapalsingh8899](https://github.com/suryapalsingh8899)).