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
The development of Geo-Pulse follows a systematic full-stack web development approach:
- **Frontend**: React.js (built with Vite)
- **Backend**: Node.js (RESTful APIs)
- **Database**: MongoDB
- **Map Engine**: CesiumJS (Interactive 3D / 2D Map)
- **Hosting / Deployment**: Render

## 📈 Current Progress
- [x] Initialized the `frountend` project environment with React.js and Vite.
- [x] Integrated **CesiumJS** for the core interactive map interface.
- [x] Designed and implemented basic UI components, including the Home Page, Splash Screen, and Map viewer.
- [x] Built the frontend structures for various interaction modals (Add Event, Add Report, User Profile, Settings, etc.).
- [x] Set up basic client-side routing, modular components, and static assets.

## 📅 Future Updates & Roadmap
- [ ] **Backend Integration**: Set up the Node.js server and connect it to MongoDB for data storage (Users, Reports, Events).
- [ ] **Authentication**: Implement secure OTP-based phone number verification for user login.
- [ ] **Dynamic Reporting**: Connect the frontend Add Report modal to the backend to dynamically render user-submitted issues onto the CesiumJS map.
- [ ] **Voting System**: Implement the upvote/downvote mechanism for community reports to highlight high-priority issues.
- [ ] **Event Publishing**: Enable users to successfully publish, edit, and discover upcoming events directly on the map interface.
- [ ] **Deployment**: Finalize testing and deploy the complete MERN stack application (via Render).

---
*Developed as a project by Suryapal Singh.*