import React, { useState, useEffect } from "react";
import "../../index.css";
import Map from "../map/Map";
import LoginButton from "../buttons/LoginButton";
import RegisterButton from "../buttons/RegisterButton";
import ProfileButton from "../buttons/ProfileButton";
import LogoutButton from "../buttons/LogoutButton";
import ProfileModal from "../modals/ProfileModal";
import AddReportModal from "../modals/AddReportModal";
import AddEventModal from "../modals/AddEventModal";
import PublicProfileModal from "../modals/PublicProfileModal";
import api from "../../services/api";

const initialMockReports = [
  {
    id: "rep_1",
    lat: 28.6139,
    lng: 77.209,
    title: "Traffic block at CP",
    description: "Heavy traffic blocking the road at Connaught Place.",
    upvotes: 12,
    downvotes: 2,
    media:
      "https://images.unsplash.com/photo-1517625126871-331da294c79f?w=400&q=80",
    video:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    isMine: false,
    author: {
      name: "Rajesh K.",
      profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  },
  {
    id: "rep_2",
    lat: 28.618,
    lng: 77.205,
    title: "Accident near CP",
    description: "A collision occurred near the main junction.",
    upvotes: 45,
    downvotes: 1,
    media:
      "https://images.unsplash.com/photo-1627392683056-b072834b6b63?w=400&q=80",
    isMine: true,
    author: { name: "User", profilePic: null },
  },
  {
    id: "rep_3",
    lat: 28.61,
    lng: 77.215,
    title: "Waterlogging CP",
    description: "Severe waterlogging due to heavy rains.",
    upvotes: 8,
    downvotes: 5,
    media: null,
    video:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    isMine: false,
    author: {
      name: "Amit S.",
      profilePic: "https://randomuser.me/api/portraits/men/44.jpg",
    },
  },
  {
    id: "rep_4",
    lat: 28.615,
    lng: 77.21,
    title: "Roadwork CP",
    description: "Construction causing slow movement of vehicles.",
    upvotes: 2,
    downvotes: 0,
    media:
      "https://images.unsplash.com/photo-1584462198614-03c2a523945d?w=400&q=80",
    isMine: false,
    author: {
      name: "Priya M.",
      profilePic: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  },
  {
    id: "rep_5",
    lat: 28.612,
    lng: 77.208,
    title: "Pothole CP",
    description: "Deep pothole in the middle lane.",
    upvotes: 15,
    downvotes: 0,
    media:
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&q=80",
    isMine: false,
    author: {
      name: "Suresh",
      profilePic: "https://randomuser.me/api/portraits/men/22.jpg",
    },
  },
  {
    id: "rep_6",
    lat: 19.076,
    lng: 72.8777,
    title: "Pothole on Linking Road",
    description: "Dangerous pothole needs fixing immediately.",
    upvotes: 23,
    downvotes: 1,
    media: null,
    isMine: false,
    author: {
      name: "Neha",
      profilePic: "https://randomuser.me/api/portraits/women/42.jpg",
    },
  },
  {
    id: "rep_7",
    lat: 19.08,
    lng: 72.88,
    title: "Traffic jam",
    description: "Complete gridlock on the highway.",
    upvotes: 120,
    downvotes: 10,
    media:
      "https://images.unsplash.com/photo-1555026600-b6ab76dff063?w=400&q=80",
    video:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    isMine: true,
    author: { name: "User", profilePic: null },
  },
  {
    id: "rep_8",
    lat: 19.072,
    lng: 72.875,
    title: "Road block",
    description: "Road blocked due to a fallen tree.",
    upvotes: 0,
    downvotes: 0,
    media: null,
    isMine: false,
    author: {
      name: "Vikas",
      profilePic: "https://randomuser.me/api/portraits/men/51.jpg",
    },
  },
  {
    id: "rep_9",
    lat: 12.9716,
    lng: 77.5946,
    title: "Water logging in Koramangala",
    description: "Streets flooded, avoid the area.",
    upvotes: 4,
    downvotes: 0,
    media:
      "https://images.unsplash.com/photo-1519789115206-f131a4030635?w=400&q=80",
    isMine: false,
    author: {
      name: "Arun",
      profilePic: "https://randomuser.me/api/portraits/men/15.jpg",
    },
  },
  {
    id: "rep_10",
    lat: 22.5726,
    lng: 88.3639,
    title: "Accident reported",
    description: "Two-wheeler collision, ambulance on site.",
    upvotes: 1,
    downvotes: 0,
    media: null,
    isMine: false,
    author: {
      name: "Riya",
      profilePic: "https://randomuser.me/api/portraits/women/24.jpg",
    },
  },
  {
    id: "rep_11",
    lat: 13.0827,
    lng: 80.2707,
    title: "Road construction",
    description: "Diversions in place for ongoing metro work.",
    upvotes: 7,
    downvotes: 0,
    media: null,
    isMine: false,
    author: {
      name: "Kiran",
      profilePic: "https://randomuser.me/api/portraits/men/60.jpg",
    },
  },
];

const initialMockEvents = [
  {
    id: "ev_201",
    lat: 28.62,
    lng: 77.2,
    title: "Delhi Music Festival",
    description:
      "Annual music festival at Connaught Place featuring local bands and food stalls. Come enjoy the evening!",
    poster:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80",
    timing: "6:00 PM - 11:00 PM, Oct 25",
    isPublic: true,
    photos: [
      "https://images.unsplash.com/photo-1540039155732-684736dd6330?w=400&q=80",
      "https://images.unsplash.com/photo-1470229722913-7c090be5c5a4?w=400&q=80",
    ],
    videos: [
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    ],
    author: {
      name: "MusicFiesta",
      profilePic: "https://randomuser.me/api/portraits/women/10.jpg",
    },
  },
  {
    id: "ev_202",
    lat: 19.07,
    lng: 72.87,
    title: "Tech Innovators Conference",
    description: "A premier tech conference in Mumbai focusing on AI and Web3.",
    poster:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80",
    timing: "9:00 AM - 5:00 PM, Nov 2-3",
    isPublic: false,
    photos: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80",
    ],
    videos: [
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    ],
    author: {
      name: "DevComm",
      profilePic: "https://randomuser.me/api/portraits/men/82.jpg",
    },
  },
  {
    id: "ev_203",
    lat: 12.97,
    lng: 77.59,
    title: "Bangalore Food Carnival",
    description: "Taste the best street food and cuisines from all over India.",
    poster:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    timing: "11:00 AM - 10:00 PM, Dec 15",
    isPublic: true,
    photos: [
      "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
    ],
    videos: [],
    author: {
      name: "FoodieBengaluru",
      profilePic: "https://randomuser.me/api/portraits/men/33.jpg",
    },
  },
  {
    id: "ev_204",
    lat: 28.61,
    lng: 77.21,
    title: "Community Park Cleanup",
    description:
      "Join us this Sunday to clean our local park and make it green.",
    poster:
      "https://images.unsplash.com/photo-1618477461853-cf6ed80fbea5?w=600&q=80",
    timing: "8:00 AM - 12:00 PM, Oct 30",
    isPublic: true,
    photos: [],
    videos: [],
    isMine: true,
    author: { name: "User", profilePic: null },
  },
  {
    id: "ev_205",
    lat: 28.65,
    lng: 77.23,
    title: "Local Book Club Meetup",
    description:
      "Monthly meetup for our local book club. We are discussing 'The Alchemist'.",
    poster:
      "https://images.unsplash.com/photo-1524578954443-4e8bd7412e87?w=600&q=80",
    timing: "4:00 PM - 6:00 PM, Nov 5",
    isPublic: false,
    photos: [],
    videos: [],
    isMine: true,
    author: { name: "User", profilePic: null },
  },
];

function HomePage() {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("success");

  const [reports, setReports] = useState(initialMockReports);
  const [events, setEvents] = useState(initialMockEvents);
  const [userStats, setUserStats] = useState({ totalUpvotes: 0, totalDownvotes: 0 });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [userName, setUserName] = useState("User");
  const [profilePic, setProfilePic] = useState(null);
  const [selectedPublicUser, setSelectedPublicUser] = useState(null);

  // Registration form state
  const [registerStep, setRegisterStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    country: "",
    countryCode: "+1",
    phone: "",
    otp: "",
  });

  // Login form state
  const [loginStep, setLoginStep] = useState(1);
  const [loginData, setLoginData] = useState({
    countryCode: "+1",
    phone: "",
    otp: "",
  });

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Fetch initial data & verify session on mount
  useEffect(() => {
    // 1. Fetch Reports from backend
    api.reports.getAll().then((res) => {
      if (res.success && res.reports && res.reports.length > 0) {
        setReports(res.reports);
      }
    });

    // 2. Fetch Events from backend
    api.events.getAll().then((res) => {
      if (res.success && res.events && res.events.length > 0) {
        setEvents(res.events);
      }
    });

    // 3. Verify user session if token exists
    const token = localStorage.getItem("geopulse_token");
    if (token) {
      api.auth.getMe().then((res) => {
        if (res.success && res.user) {
          setIsLoggedIn(true);
          setUserName(res.user.name || "User");
          setProfilePic(res.user.profilePic || null);
          if (res.user.stats) {
            setUserStats(res.user.stats);
          }
        } else {
          localStorage.removeItem("geopulse_token");
        }
      });
    }
  }, []);

  // Sync theme
  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
    }
  }, [darkMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // --- Registration Flow ---
  const handleRegisterNext = async (e) => {
    e.preventDefault();
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      showToast("Enter a valid 10-digit phone number", "error");
      return;
    }

    const res = await api.auth.requestRegisterOtp(formData.phone, formData.countryCode);
    if (res.success) {
      setRegisterStep(2);
      showToast(res.otp ? `OTP sent: ${res.otp}` : "OTP sent to your phone");
    } else {
      showToast(res.message || "Failed to send OTP", "error");
    }
  };

  const handleRegisterResend = async () => {
    const res = await api.auth.requestRegisterOtp(formData.phone, formData.countryCode);
    if (res.success) {
      showToast(res.otp ? `Resent OTP is ${res.otp}` : "OTP resent");
    } else {
      showToast(res.message || "Failed to resend OTP", "error");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await api.auth.verifyAndRegister(formData);
    if (res.success && res.token) {
      localStorage.setItem("geopulse_token", res.token);
      setIsLoggedIn(true);
      setUserName(res.user?.name || "User");
      setProfilePic(res.user?.profilePic || null);
      if (res.user?.stats) setUserStats(res.user.stats);
      setShowRegistrationModal(false);
      setRegisterStep(1);
      setFormData({
        name: "",
        age: "",
        gender: "",
        country: "",
        countryCode: "+1",
        phone: "",
        otp: "",
      });
      showToast("Account created successfully!");
      // Refresh reports/events with newly authenticated context
      api.reports.getAll().then((r) => r.success && setReports(r.reports));
      api.events.getAll().then((ev) => ev.success && setEvents(ev.events));
    } else {
      showToast(res.message || "Registration failed", "error");
    }
  };

  // --- Login Flow ---
  const handleLoginNext = async (e) => {
    e.preventDefault();
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(loginData.phone)) {
      showToast("Enter a valid 10-digit phone number", "error");
      return;
    }

    const res = await api.auth.requestLoginOtp(loginData.phone);
    if (res.success) {
      setLoginStep(2);
      showToast(res.otp ? `OTP is ${res.otp}` : "OTP sent successfully");
    } else {
      showToast(res.message || "Login OTP failed", "error");
    }
  };

  const handleLoginResend = async () => {
    const res = await api.auth.requestLoginOtp(loginData.phone);
    if (res.success) {
      showToast(res.otp ? `Resent OTP is ${res.otp}` : "OTP resent");
    } else {
      showToast(res.message || "Failed to resend OTP", "error");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await api.auth.verifyAndLogin(loginData.phone, loginData.otp);
    if (res.success && res.token) {
      localStorage.setItem("geopulse_token", res.token);
      setIsLoggedIn(true);
      setUserName(res.user?.name || "User");
      setProfilePic(res.user?.profilePic || null);
      if (res.user?.stats) setUserStats(res.user.stats);
      setShowLoginModal(false);
      setLoginStep(1);
      setLoginData({ countryCode: "+1", phone: "", otp: "" });
      showToast("Logged in successfully!");
      // Refresh reports/events with newly authenticated context
      api.reports.getAll().then((r) => r.success && setReports(r.reports));
      api.events.getAll().then((ev) => ev.success && setEvents(ev.events));
    } else {
      showToast(res.message || "Invalid OTP", "error");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("geopulse_token");
      setIsLoggedIn(false);
      setUserName("User");
      setProfilePic(null);
      setUserStats({ totalUpvotes: 0, totalDownvotes: 0 });
      showToast("Logged out successfully!");
      api.reports.getAll().then((r) => r.success && setReports(r.reports));
      api.events.getAll().then((ev) => ev.success && setEvents(ev.events));
    }
  };

  // --- Reports Handlers ---
  const handleAddReport = async (reportData) => {
    const res = await api.reports.create(reportData);
    if (res.success && res.report) {
      setReports((prev) => [res.report, ...prev]);
      showToast("Report added successfully!");
    } else {
      // Fallback
      const fallbackReport = {
        ...reportData,
        id: `rep_${Date.now()}`,
        upvotes: 0,
        downvotes: 0,
        isMine: true,
        author: { name: userName, profilePic },
      };
      setReports((prev) => [fallbackReport, ...prev]);
      showToast("Report pinned!");
    }
  };

  const handleVote = async (reportId, upDelta, downDelta, newUserVote) => {
    // Optimistic UI update
    setReports((prevReports) =>
      prevReports.map((report) => {
        if (report.id === reportId || report._id === reportId) {
          return {
            ...report,
            upvotes: Math.max(0, (report.upvotes || 0) + upDelta),
            downvotes: Math.max(0, (report.downvotes || 0) + downDelta),
            userVote: newUserVote,
          };
        }
        return report;
      })
    );

    const action = newUserVote === "up" ? "up" : newUserVote === "down" ? "down" : "cancel";
    const res = await api.reports.vote(reportId, action);
    if (res.success && res.report) {
      setReports((prev) =>
        prev.map((r) => (r.id === reportId || r._id === reportId ? { ...r, ...res.report } : r))
      );
    }

    // Refresh user stats
    api.auth.getMe().then((res) => {
      if (res.success && res.user?.stats) setUserStats(res.user.stats);
    });
  };

  const handleDeleteReport = async (reportId) => {
    setReports((prev) => prev.filter((r) => r.id !== reportId && r._id !== reportId));
    await api.reports.delete(reportId);
    showToast("Report deleted");
  };

  const submitEditReport = async (updatedData) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === updatedData.id || r._id === updatedData.id
          ? { ...r, ...updatedData, upvotes: 0, downvotes: 0, userVote: null }
          : r
      )
    );
    await api.reports.update(updatedData.id || updatedData._id, updatedData);
    setEditingReport(null);
    showToast("Report updated");
  };

  const handleReportOpened = async (reportId) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId || r._id === reportId ? { ...r, seen: true } : r))
    );
    await api.reports.markSeen(reportId);
  };

  // --- Events Handlers ---
  const handleAddEvent = async (eventData) => {
    const res = await api.events.create(eventData);
    if (res.success && res.event) {
      setEvents((prev) => [res.event, ...prev]);
      showToast("Event created successfully!");
    } else {
      const fallbackEvent = {
        ...eventData,
        id: `ev_${Date.now()}`,
        upvotes: 0,
        isMine: true,
        author: { name: userName, profilePic },
      };
      setEvents((prev) => [fallbackEvent, ...prev]);
      showToast("Event created!");
    }
  };

  const handleEventVote = async (eventId, upDelta, newUserVote) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId || event._id === eventId) {
          return {
            ...event,
            upvotes: Math.max(0, (event.upvotes || 0) + upDelta),
            userVote: newUserVote,
          };
        }
        return event;
      })
    );

    const action = newUserVote === "up" ? "up" : "cancel";
    await api.events.vote(eventId, action);
  };

  const handleDeleteEvent = async (eventId) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId && e._id !== eventId));
    await api.events.delete(eventId);
    showToast("Event deleted");
  };

  const submitEditEvent = async (updatedData) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === updatedData.id || e._id === updatedData.id ? { ...e, ...updatedData } : e
      )
    );
    await api.events.update(updatedData.id || updatedData._id, updatedData);
    setEditingEvent(null);
    showToast("Event updated");
  };

  const handleEventOpened = async (eventId) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId || e._id === eventId ? { ...e, seen: true } : e))
    );
    await api.events.markSeen(eventId);
  };

  // --- Profile Updates ---
  const handleUpdateUserName = async (newName) => {
    if (isLoggedIn) {
      const res = await api.auth.updateProfile({ name: newName });
      if (res.success && res.user) {
        setUserName(res.user.name);
        showToast("Username updated!");
        return true;
      } else {
        showToast(res.message || "Username already taken", "error");
        return false;
      }
    } else {
      setUserName(newName);
      return true;
    }
  };

  const handleUpdateProfilePic = async (newPic) => {
    setProfilePic(newPic);
    if (isLoggedIn) {
      await api.auth.updateProfile({ profilePic: newPic });
    }
  };

  return (
    <div className="homepage-container">
      {/* Permanent fullscreen map background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      >
        <Map
          isLoggedIn={isLoggedIn}
          onRequireLogin={() => setShowLoginModal(true)}
          reports={reports}
          setReports={setReports}
          events={events}
          setEvents={setEvents}
          onAddReport={handleAddReport}
          onAddEvent={handleAddEvent}
          onVote={handleVote}
          onEventVote={handleEventVote}
          onReportOpened={handleReportOpened}
          onEventOpened={handleEventOpened}
          onAuthorClick={(user) => setSelectedPublicUser(user)}
          userName={userName}
          setUserName={handleUpdateUserName}
          isDarkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </div>

      <header
        className="navbar glass-header"
        style={{ background: "transparent", border: "none", boxShadow: "none" }}
      >
        <div className="navbar-left">
          <div
            className="logo"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
          >
            Geo Pulse
          </div>
        </div>
        <div className="navbar-right">
          {!isLoggedIn ? (
            <>
              <LoginButton
                onClick={() => setShowLoginModal(true)}
                showModal={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSubmit={handleLogin}
                loginData={loginData}
                onChange={handleLoginChange}
                onSwitchToRegister={() => {
                  setShowLoginModal(false);
                  setShowRegistrationModal(true);
                }}
                step={loginStep}
                onNext={handleLoginNext}
                onResend={handleLoginResend}
              />
              <RegisterButton
                onClick={() => setShowRegistrationModal(true)}
                showModal={showRegistrationModal}
                onClose={() => setShowRegistrationModal(false)}
                onSubmit={handleRegister}
                formData={formData}
                onChange={handleChange}
                step={registerStep}
                onNext={handleRegisterNext}
                onResend={handleRegisterResend}
              />
            </>
          ) : (
            <>
              <ProfileButton onClick={() => setShowProfileModal(true)} />
              <LogoutButton onClick={handleLogout} />
            </>
          )}
        </div>
      </header>

      <ProfileModal
        showModal={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userStats={userStats}
        reports={reports}
        events={events}
        onDelete={handleDeleteReport}
        onDeleteEvent={handleDeleteEvent}
        onEdit={(rep) => setEditingReport(rep)}
        onEditEvent={(ev) => setEditingEvent(ev)}
        userName={userName}
        setUserName={handleUpdateUserName}
        profilePic={profilePic}
        setProfilePic={handleUpdateProfilePic}
      />

      {selectedPublicUser && (
        <PublicProfileModal
          user={selectedPublicUser}
          reports={reports}
          events={events}
          onClose={() => setSelectedPublicUser(null)}
        />
      )}

      {editingReport && (
        <AddReportModal
          initialData={editingReport}
          location={{ lat: editingReport.lat, lng: editingReport.lng }}
          onSubmit={submitEditReport}
          onClose={() => setEditingReport(null)}
        />
      )}

      {editingEvent && (
        <AddEventModal
          initialData={editingEvent}
          location={{ lat: editingEvent.lat, lng: editingEvent.lng }}
          onSubmit={submitEditEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}

      {toastMessage && (
        <div className="toast-container">
          <div className={`toast ${toastType}`}>
            {toastType === "success" ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            )}
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
