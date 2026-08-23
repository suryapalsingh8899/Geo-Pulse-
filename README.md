# Geo-Pulse

Geo-Pulse is a location-based web platform designed to bring relevant local information together through a single, interactive, and visual interface. It connects people with local problems, events, alerts, and important information in a unified system, helping generate useful location-based insights that can support better community awareness and decision-making.

## 🚀 Motivation
The primary motivation behind Geo-Pulse is to make the voice of local people more visible and reachable. Many community concerns (like damaged infrastructure, sanitation issues, etc.) often remain unnoticed or fail to reach the appropriate authorities. Geo-Pulse gives people a structured way to bring these issues forward by connecting reports with geographical locations and supporting evidence. Additionally, it helps users visually discover nearby events, activities, and emergency alerts without having to search across multiple scattered sources.

## ✨ Key Features
- **Community Reporting System**: Users can report local problems with descriptions, images/videos, and precise geographical locations. Community members can view, discuss, and vote (upvote/downvote) on these reports.
- **Location-Based Events and Activities**: Users, organizers, colleges, and communities can add and discover upcoming events (concerts, hackathons, meetings, etc.) based on location and date.
- **Location-Based Alerts**: Timely information and notifications regarding situations that may affect specific areas (e.g., heavy rainfall, road blockages, fires, emergencies).
- **Interactive Map Interface**: A centralized visual platform powered by CesiumJS to easily understand *what* is happening, *where* it is happening, and *when* it is happening.
- **User Authentication & Profiles**: Secure OTP-based phone number login, personalized profiles, and user contribution tracking.

## 🛠️ Tech Stack
- **Frontend**: React.js 19 (built with Vite)
- **Backend**: Node.js & Express.js (RESTful APIs with Multer file uploads & JWT)
- **Database**: MongoDB (with Mongoose ODM & resilient development store)
- **Map Engine**: CesiumJS (Interactive 3D / 2D Map)
- **Hosting / Deployment**: Render

## 🏃 Running Locally

### 1. Start Backend Server
```bash
cd backend
npm install
npm run dev # Runs on http://localhost:5000
```

### 2. Start Frontend App
```bash
cd frountend
npm install
npm run dev # Runs on http://localhost:5173
```

### 3. Run Backend API Tests
```bash
cd backend
npm test
```

## 📈 Current Progress
- [x] Initialized the `frountend` project environment with React.js and Vite.
- [x] Integrated **CesiumJS** for the core interactive map interface.
- [x] Designed and implemented basic UI components, including the Home Page, Splash Screen, and Map viewer.
- [x] Built the frontend structures for various interaction modals (Add Event, Add Report, User Profile, Settings, etc.).
- [x] **Backend Integration**: Set up the Node.js Express server with RESTful APIs.
- [x] **Database & Models**: MongoDB Schemas for Users, Reports, and Events with Mongoose and seed data.
- [x] **Authentication**: Secure OTP-based phone number verification, JWT issuance, and security lockouts.
- [x] **Dynamic Reporting & Media**: Connected frontend modals with backend file uploads (Multer) and geo-coordinates.
- [x] **Voting & Reputation**: Upvote/downvote mechanism with real-time user reputation stats.
- [x] **Event Publishing**: Publishing, editing, voting, and discovering events directly on the map interface.

---
*Developed as a project by Suryapal Singh.*