import React, { useState } from 'react';
import '../index.css';
import Map from './Map';
import LoginButton from './buttons/LoginButton';
import RegisterButton from './buttons/RegisterButton';
import ProfileButton from './buttons/ProfileButton';
import LogoutButton from './buttons/LogoutButton';
import ProfileModal from './ProfileModal';
import AddReportModal from './AddReportModal';
import PublicProfileModal from './PublicProfileModal';

const initialMockReports = [
  { id: 1, lat: 28.6139, lng: 77.2090, title: "Traffic block at CP", description: "Heavy traffic blocking the road at Connaught Place.", upvotes: 12, downvotes: 2, media: 'https://images.unsplash.com/photo-1517625126871-331da294c79f?w=400&q=80', video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', isMine: false, author: { name: "Rajesh K.", profilePic: "https://randomuser.me/api/portraits/men/32.jpg" } },
  { id: 2, lat: 28.6180, lng: 77.2050, title: "Accident near CP", description: "A collision occurred near the main junction.", upvotes: 45, downvotes: 1, media: 'https://images.unsplash.com/photo-1627392683056-b072834b6b63?w=400&q=80', isMine: true, author: { name: "User", profilePic: null } },
  { id: 3, lat: 28.6100, lng: 77.2150, title: "Waterlogging CP", description: "Severe waterlogging due to heavy rains.", upvotes: 8, downvotes: 5, media: null, video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', isMine: false, author: { name: "Amit S.", profilePic: "https://randomuser.me/api/portraits/men/44.jpg" } },
  { id: 4, lat: 28.6150, lng: 77.2100, title: "Roadwork CP", description: "Construction causing slow movement of vehicles.", upvotes: 2, downvotes: 0, media: 'https://images.unsplash.com/photo-1584462198614-03c2a523945d?w=400&q=80', isMine: false, author: { name: "Priya M.", profilePic: "https://randomuser.me/api/portraits/women/68.jpg" } },
  { id: 5, lat: 28.6120, lng: 77.2080, title: "Pothole CP", description: "Deep pothole in the middle lane.", upvotes: 15, downvotes: 0, media: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&q=80', isMine: false, author: { name: "Suresh", profilePic: "https://randomuser.me/api/portraits/men/22.jpg" } },
  
  { id: 6, lat: 19.0760, lng: 72.8777, title: "Pothole on Linking Road", description: "Dangerous pothole needs fixing immediately.", upvotes: 23, downvotes: 1, media: null, isMine: false, author: { name: "Neha", profilePic: "https://randomuser.me/api/portraits/women/42.jpg" } },
  { id: 7, lat: 19.0800, lng: 72.8800, title: "Traffic jam", description: "Complete gridlock on the highway.", upvotes: 120, downvotes: 10, media: 'https://images.unsplash.com/photo-1555026600-b6ab76dff063?w=400&q=80', video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', isMine: true, author: { name: "User", profilePic: null } },
  { id: 8, lat: 19.0720, lng: 72.8750, title: "Road block", description: "Road blocked due to a fallen tree.", upvotes: 0, downvotes: 0, media: null, isMine: false, author: { name: "Vikas", profilePic: "https://randomuser.me/api/portraits/men/51.jpg" } },
  
  { id: 9, lat: 12.9716, lng: 77.5946, title: "Water logging in Koramangala", description: "Streets flooded, avoid the area.", upvotes: 4, downvotes: 0, media: 'https://images.unsplash.com/photo-1519789115206-f131a4030635?w=400&q=80', isMine: false, author: { name: "Arun", profilePic: "https://randomuser.me/api/portraits/men/15.jpg" } },
  { id: 10, lat: 22.5726, lng: 88.3639, title: "Accident reported", description: "Two-wheeler collision, ambulance on site.", upvotes: 1, downvotes: 0, media: null, isMine: false, author: { name: "Riya", profilePic: "https://randomuser.me/api/portraits/women/24.jpg" } },
  { id: 11, lat: 13.0827, lng: 80.2707, title: "Road construction", description: "Diversions in place for ongoing metro work.", upvotes: 7, downvotes: 0, media: null, isMine: false, author: { name: "Kiran", profilePic: "https://randomuser.me/api/portraits/men/60.jpg" } }
];

const initialMockEvents = [
  { 
    id: 201, lat: 28.62, lng: 77.20, title: "Delhi Music Festival", description: "Annual music festival at Connaught Place featuring local bands and food stalls. Come enjoy the evening!", 
    poster: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80",
    timing: "6:00 PM - 11:00 PM, Oct 25", isPublic: true,
    photos: ["https://images.unsplash.com/photo-1540039155732-684736dd6330?w=400&q=80", "https://images.unsplash.com/photo-1470229722913-7c090be5c5a4?w=400&q=80"],
    videos: ["http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"],
    author: { name: "MusicFiesta", profilePic: "https://randomuser.me/api/portraits/women/10.jpg" }
  },
  { 
    id: 202, lat: 19.07, lng: 72.87, title: "Tech Innovators Conference", description: "A premier tech conference in Mumbai focusing on AI and Web3.", 
    poster: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80",
    timing: "9:00 AM - 5:00 PM, Nov 2-3", isPublic: false,
    photos: ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80"],
    videos: ["http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"],
    author: { name: "DevComm", profilePic: "https://randomuser.me/api/portraits/men/82.jpg" }
  },
  { 
    id: 203, lat: 12.97, lng: 77.59, title: "Bangalore Food Carnival", description: "Taste the best street food and cuisines from all over India.", 
    poster: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    timing: "11:00 AM - 10:00 PM, Dec 15", isPublic: true,
    photos: ["https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&q=80", "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80", "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80"],
    videos: [],
    author: { name: "FoodieBengaluru", profilePic: "https://randomuser.me/api/portraits/men/33.jpg" }
  },
  { 
    id: 204, lat: 28.61, lng: 77.21, title: "Community Park Cleanup", description: "Join us this Sunday to clean our local park and make it green.", 
    poster: "https://images.unsplash.com/photo-1618477461853-cf6ed80fbea5?w=600&q=80",
    timing: "8:00 AM - 12:00 PM, Oct 30", isPublic: true,
    photos: [],
    videos: [],
    isMine: true,
    author: { name: "User", profilePic: null }
  },
  { 
    id: 205, lat: 28.65, lng: 77.23, title: "Local Book Club Meetup", description: "Monthly meetup for our local book club. We are discussing 'The Alchemist'.", 
    poster: "https://images.unsplash.com/photo-1524578954443-4e8bd7412e87?w=600&q=80",
    timing: "4:00 PM - 6:00 PM, Nov 5", isPublic: false,
    photos: [],
    videos: [],
    isMine: true,
    author: { name: "User", profilePic: null }
  }
];

function HomePage() {
  const [isExploring, setIsExploring] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [darkMode]);

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };
  
  const [reports, setReports] = useState(initialMockReports);
  const [events, setEvents] = useState(initialMockEvents);
  
  // Calculate initial stats based on mock data that is mine
  const initialUserStats = initialMockReports.filter(r => r.isMine).reduce((acc, curr) => ({
    totalUpvotes: acc.totalUpvotes + (curr.upvotes || 0),
    totalDownvotes: acc.totalDownvotes + (curr.downvotes || 0)
  }), { totalUpvotes: 0, totalDownvotes: 0 });

  const [userStats, setUserStats] = useState(initialUserStats);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [userName, setUserName] = useState("User");
  const [profilePic, setProfilePic] = useState(null);
  const [selectedPublicUser, setSelectedPublicUser] = useState(null);
  // Registered users state (for mock backend)
  const [registeredUsers, setRegisteredUsers] = useState([]);
  // Security state to track blocks and limits
  const [phoneSecurity, setPhoneSecurity] = useState({});

  // Registration form state
  const [registerStep, setRegisterStep] = useState(1);
  const [generatedRegisterOtp, setGeneratedRegisterOtp] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    country: '',
    countryCode: '+1',
    phone: '',
    otp: ''
  });

  // Login form state
  const [loginStep, setLoginStep] = useState(1);
  const [generatedLoginOtp, setGeneratedLoginOtp] = useState('');
  const [loginData, setLoginData] = useState({
    countryCode: '+1',
    phone: '',
    otp: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const checkSecurity = (phone, isRequestingOtp = false) => {
    const today = new Date().toDateString();
    const current = phoneSecurity[phone] || { failedAttempts: 0, blockUntil: null, otpRequests: 0, lastRequestDate: today };
    
    if (current.blockUntil && current.blockUntil > Date.now()) {
      showToast(`Number blocked for 24 hours due to too many failed attempts.`, 'error');
      return false;
    }

    if (current.lastRequestDate !== today) {
      current.otpRequests = 0;
    }

    if (isRequestingOtp && current.otpRequests >= 5) {
      showToast(`Max OTP requests (5) reached for today.`, 'error');
      return false;
    }

    return true;
  };

  const recordOtpRequest = (phone) => {
    const today = new Date().toDateString();
    setPhoneSecurity(prev => {
      const current = prev[phone] || { failedAttempts: 0, blockUntil: null, otpRequests: 0, lastRequestDate: today };
      return {
        ...prev,
        [phone]: {
          ...current,
          otpRequests: current.lastRequestDate === today ? current.otpRequests + 1 : 1,
          lastRequestDate: today
        }
      };
    });
  };

  const recordFailedAttempt = (phone) => {
    setPhoneSecurity(prev => {
      const current = prev[phone] || { failedAttempts: 0, blockUntil: null, otpRequests: 0, lastRequestDate: new Date().toDateString() };
      const newFailed = current.failedAttempts + 1;
      let newBlock = current.blockUntil;
      
      if (newFailed >= 5) {
        newBlock = Date.now() + 24 * 60 * 60 * 1000;
        showToast(`Too many failed attempts. Number blocked for 24 hours.`, 'error');
      } else {
        showToast(`Wrong OTP. ${5 - newFailed} attempts left.`, 'error');
      }

      return {
        ...prev,
        [phone]: {
          ...current,
          failedAttempts: newFailed,
          blockUntil: newBlock
        }
      };
    });
  };

  const resetFailedAttempts = (phone) => {
    setPhoneSecurity(prev => {
      if (!prev[phone]) return prev;
      return { ...prev, [phone]: { ...prev[phone], failedAttempts: 0 } };
    });
  };

  const handleRegisterNext = (e) => {
    e.preventDefault();
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      showToast('Enter correct phone number', 'error');
      return;
    }
    if (!checkSecurity(formData.phone, true)) return;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedRegisterOtp(otp);
    recordOtpRequest(formData.phone);
    setRegisterStep(2);
    showToast(`OTP is ${otp}`);
  };

  const handleRegisterResend = () => {
    if (!checkSecurity(formData.phone, true)) return;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedRegisterOtp(otp);
    recordOtpRequest(formData.phone);
    showToast(`Resent OTP is ${otp}`);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!checkSecurity(formData.phone)) return;
    
    if (formData.otp === generatedRegisterOtp) {
      console.log("Registered User Data:", formData);
      setRegisteredUsers(prev => [...prev, formData.phone]);
      resetFailedAttempts(formData.phone);
      showToast(`Created account successfully`);
      setUserName(formData.name || "User");
      setShowRegistrationModal(false);
      setRegisterStep(1);
      // Reset form
      setFormData({ name: '', age: '', gender: '', country: '', countryCode: '+1', phone: '', otp: '' });
      setIsLoggedIn(true);
    } else {
      recordFailedAttempt(formData.phone);
    }
  };

  const handleLoginNext = (e) => {
    e.preventDefault();
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(loginData.phone)) {
      showToast('Enter correct phone number', 'error');
      return;
    }
    if (!registeredUsers.includes(loginData.phone)) {
      showToast('Phone number not registered. Please register first.', 'error');
      return;
    }
    if (!checkSecurity(loginData.phone, true)) return;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedLoginOtp(otp);
    recordOtpRequest(loginData.phone);
    setLoginStep(2);
    showToast(`OTP is ${otp}`);
  };

  const handleLoginResend = () => {
    if (!checkSecurity(loginData.phone, true)) return;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedLoginOtp(otp);
    recordOtpRequest(loginData.phone);
    showToast(`Resent OTP is ${otp}`);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!checkSecurity(loginData.phone)) return;

    if (loginData.otp === generatedLoginOtp) {
      console.log("Login User Data:", loginData);
      resetFailedAttempts(loginData.phone);
      showToast(`Login successfully`);
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setLoginStep(1);
      // Reset form
      setLoginData({ countryCode: '+1', phone: '', otp: '' });
    } else {
      recordFailedAttempt(loginData.phone);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      setIsLoggedIn(false);
      showToast("Logged out successfully!");
    }
  };

  const handleVote = (reportId, upDelta, downDelta, newUserVote) => {
    let reportWasMine = false;
    setReports(prevReports => prevReports.map(report => {
      if (report.id === reportId) {
        if (report.isMine) {
          reportWasMine = true;
        }
        return {
          ...report,
          upvotes: Math.max(0, (report.upvotes || 0) + upDelta),
          downvotes: Math.max(0, (report.downvotes || 0) + downDelta),
          userVote: newUserVote
        };
      }
      return report;
    }));

    if (reportWasMine) {
      setUserStats(prev => ({
        totalUpvotes: prev.totalUpvotes + upDelta,
        totalDownvotes: prev.totalDownvotes + downDelta
      }));
    }
  };

  const handleEventVote = (eventId, upDelta, newUserVote) => {
    setEvents(prevEvents => prevEvents.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          upvotes: Math.max(0, (event.upvotes || 0) + upDelta),
          userVote: newUserVote
        };
      }
      return event;
    }));
  };

  const handleDeleteReport = (reportId) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    // Note: userStats is INTENTIONALLY not decremented here as per user request
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const handleEditReport = (report) => {
    setEditingReport(report);
  };

  const [editingEvent, setEditingEvent] = useState(null);

  const handleEditEvent = (event) => {
    setEditingEvent(event);
  };

  const submitEditReport = (updatedData) => {
    setReports(prev => {
      let oldUpvotes = 0;
      let oldDownvotes = 0;
      let wasMine = false;

      const newReports = prev.map(r => {
        if (r.id === updatedData.id) {
          oldUpvotes = r.upvotes || 0;
          oldDownvotes = r.downvotes || 0;
          wasMine = r.isMine;
          return { ...r, ...updatedData, upvotes: 0, downvotes: 0, userVote: null };
        }
        return r;
      });

      if (wasMine && (oldUpvotes > 0 || oldDownvotes > 0)) {
        setUserStats(stats => ({
          totalUpvotes: Math.max(0, stats.totalUpvotes - oldUpvotes),
          totalDownvotes: Math.max(0, stats.totalDownvotes - oldDownvotes)
        }));
      }

      return newReports;
    });
    setEditingReport(null);
  };

  const submitEditEvent = (updatedData) => {
    setEvents(prev => prev.map(e => e.id === updatedData.id ? { ...e, ...updatedData } : e));
    setEditingEvent(null);
  };

  const handleReportOpened = (reportId) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, seen: true } : r));
  };

  const handleEventOpened = (eventId) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, seen: true } : e));
  };

  return (
    <div className="homepage-container">
      {/* Permanent fullscreen map background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <Map
          isLoggedIn={isLoggedIn}
          onRequireLogin={() => setShowLoginModal(true)}
          reports={reports}
          setReports={setReports}
          events={events}
          setEvents={setEvents}
          onVote={handleVote}
          onEventVote={handleEventVote}
          onReportOpened={handleReportOpened}
          onEventOpened={handleEventOpened}
          onAuthorClick={(user) => setSelectedPublicUser(user)}
          userName={userName}
          setUserName={setUserName}
          isDarkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </div>

      <header className="navbar glass-header" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
        <div className="navbar-left">
          <div className="logo" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Geo Pulse</div>
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
        onEdit={handleEditReport}
        onEditEvent={handleEditEvent}
        userName={userName}
        setUserName={setUserName}
        profilePic={profilePic}
        setProfilePic={setProfilePic}
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
            {toastType === 'success' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
