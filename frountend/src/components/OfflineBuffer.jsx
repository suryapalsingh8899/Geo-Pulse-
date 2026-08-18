import React, { useState, useEffect } from 'react';

const OfflineBuffer = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="offline-buffer">
      <div className="offline-content">
        <div className="earth-container">
          <svg className="earth-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            <path d="M 50 5 C 70 5 85 20 90 40 C 92 48 90 60 80 70 C 65 85 45 95 30 85 C 15 75 5 55 10 40 C 15 20 30 5 50 5 Z" fill="rgba(56, 189, 248, 0.2)" />
            <path d="M 30 20 Q 40 10 50 30 T 70 40 T 60 70 T 30 60 Z" fill="#38bdf8" />
            <path d="M 80 30 Q 90 40 85 60 T 60 50 Z" fill="#38bdf8" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="8" />
          </svg>
          <div className="orbit-ring"></div>
          <div className="orbit-ring orbit-ring-2"></div>
        </div>
        <h2 className="offline-title">You're offline</h2>
        <p className="offline-msg">connect to the internet to continue</p>
        <div className="loading-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  );
};

export default OfflineBuffer;
