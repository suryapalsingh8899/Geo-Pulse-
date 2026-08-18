import React, { useState, useEffect } from 'react';
import './index.css';
import HomePage from './components/HomePage';
import SplashScreen from './components/SplashScreen';
import OfflineBuffer from './components/OfflineBuffer';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <OfflineBuffer />
      {showSplash ? <SplashScreen /> : <HomePage />}
    </>
  );
}

export default App;
