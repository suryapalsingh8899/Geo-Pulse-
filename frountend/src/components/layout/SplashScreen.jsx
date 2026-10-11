import React from "react";
import "../../index.css";

function SplashScreen() {
  return (
    <div className="splash-screen">
      <div className="splash-content">
        <h1 className="splash-logo">Geo Pulse</h1>
        <div className="splash-loader"></div>
        <div className="splash-author">
          <span className="splash-author-prefix">By</span>
          <span className="splash-author-name">Suryapal Singh</span>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
