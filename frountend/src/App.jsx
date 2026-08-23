import React, { useState, useEffect } from "react";
import "./index.css";
import HomePage from "./components/layout/HomePage";
import SplashScreen from "./components/layout/SplashScreen";
import OfflineBuffer from "./components/utils/OfflineBuffer";

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
