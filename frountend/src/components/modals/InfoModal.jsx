import React, { useState } from "react";

const InfoModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("about"); // 'about' | 'guide' | 'features' | 'data'

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      style={{ zIndex: 4000 }}
    >
      <div
        className="modal-card glass-card info-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "92%",
          maxWidth: "740px",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          padding: "26px",
          overflow: "hidden",
        }}
      >
        <button className="close-btn" onClick={onClose} title="Close guide">
          &times;
        </button>

        {/* Modal Hero Header */}
        <div className="modal-header-hero" style={{ marginBottom: "16px" }}>
          <span className="modal-eyebrow">
            🌍 Guide & Information
          </span>
          <h2 className="modal-title" style={{ fontSize: "1.7rem" }}>
            About Geo Pulse & How to Use
          </h2>
          <p className="modal-subtitle">
            A simple guide to explore the 3D globe, view live disaster alerts, and post community reports.
          </p>
          <div className="modal-header-divider" />
        </div>

        {/* Tab Navigation */}
        <div
          className="info-tabs-bar"
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "16px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            paddingBottom: "8px",
            overflowX: "auto",
          }}
        >
          <button
            className={`info-tab-btn ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            <span>🌐</span> About Website
          </button>
          <button
            className={`info-tab-btn ${activeTab === "guide" ? "active" : ""}`}
            onClick={() => setActiveTab("guide")}
          >
            <span>📖</span> How to Use
          </button>
          <button
            className={`info-tab-btn ${activeTab === "features" ? "active" : ""}`}
            onClick={() => setActiveTab("features")}
          >
            <span>⚡</span> Helpful Features
          </button>
          <button
            className={`info-tab-btn ${activeTab === "data" ? "active" : ""}`}
            onClick={() => setActiveTab("data")}
          >
            <span>🛰️</span> Live Data Sources
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div
          className="info-modal-body"
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: "6px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* TAB 1: ABOUT WEBSITE */}
          {activeTab === "about" && (
            <div className="info-tab-content">
              {/* Simple Welcome Banner */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(129, 140, 248, 0.08))",
                  border: "1px solid rgba(56, 189, 248, 0.25)",
                  borderRadius: "14px",
                  padding: "16px 18px",
                  marginBottom: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "1.4rem" }}>🌍</span>
                  <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#38bdf8", fontWeight: 700 }}>
                    Welcome to Geo Pulse
                  </h3>
                </div>
                <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.6, color: "var(--text-color)" }}>
                  <strong>Geo Pulse</strong> is a live 3D world map that helps you stay safe and connected.
                  You can see live natural disasters (like earthquakes and wildfires), report local community problems (like potholes, road blocks, or waterlogging), and discover events happening near you.
                </p>
              </div>

              {/* 3 Main Highlights */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "12px",
                  marginBottom: "14px",
                }}
              >
                <div className="info-card">
                  <div className="info-card-icon">🚨</div>
                  <h4>Live Disaster Alerts</h4>
                  <p>Shows real-time earthquake and weather hazard alerts from official global sources.</p>
                </div>
                <div className="info-card">
                  <div className="info-card-icon">📋</div>
                  <h4>Community Reports</h4>
                  <p>Anyone can drop a pin on the map to share local road issues, accidents, or warnings.</p>
                </div>
                <div className="info-card">
                  <div className="info-card-icon">🎟️</div>
                  <h4>Community Events</h4>
                  <p>Find local meetups, sports, music, and gatherings organized by real people in your area.</p>
                </div>
              </div>

              {/* Creator Credit Badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "14px",
                  padding: "12px 18px",
                  marginTop: "6px",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "1.5px", color: "#38bdf8", fontWeight: 700 }}>
                    Developer & Creator
                  </div>
                  <div style={{ fontSize: "0.98rem", fontWeight: 700, color: "#ffffff", marginTop: "2px" }}>
                    Designed & Developed by Suryapal Singh
                  </div>
                </div>
                <div
                  style={{
                    background: "rgba(56, 189, 248, 0.15)",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    color: "#38bdf8",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                  }}
                >
                  Version 2.0
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOW TO USE */}
          {activeTab === "guide" && (
            <div className="info-tab-content">
              <h3 style={{ fontSize: "1.05rem", color: "#38bdf8", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🎮</span> How to Move Around the 3D Globe
              </h3>

              <div className="guide-step-list">
                <div className="guide-step-item">
                  <div className="guide-step-num">1</div>
                  <div className="guide-step-content">
                    <strong>Spin the Globe</strong>
                    <p>Click and hold your left mouse button, then drag to spin the Earth in any direction.</p>
                  </div>
                </div>

                <div className="guide-step-item">
                  <div className="guide-step-num">2</div>
                  <div className="guide-step-content">
                    <strong>Zoom In and Out</strong>
                    <p>Scroll your mouse wheel up or down to zoom in close to streets or zoom out to see the whole planet.</p>
                  </div>
                </div>

                <div className="guide-step-item">
                  <div className="guide-step-num">3</div>
                  <div className="guide-step-content">
                    <strong>Tilt Your View</strong>
                    <p>Hold down the middle mouse wheel (or hold <code>Ctrl</code> and click) and drag up or down to tilt the camera.</p>
                  </div>
                </div>

                <div className="guide-step-item">
                  <div className="guide-step-num">4</div>
                  <div className="guide-step-content">
                    <strong>Click Any Pin for Details</strong>
                    <p>Click on any marker on the map to see its photos, details, time, and upvote/downvote buttons.</p>
                  </div>
                </div>

                <div className="guide-step-item">
                  <div className="guide-step-num">5</div>
                  <div className="guide-step-content">
                    <strong>Post a Community Report</strong>
                    <p>
                      Click the <strong>Add Report</strong> button at the bottom. Then click anywhere on the globe to pick the location, fill in the problem title and description, and submit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HELPFUL FEATURES */}
          {activeTab === "features" && (
            <div className="info-tab-content">
              <h3 style={{ fontSize: "1.05rem", color: "#38bdf8", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>⚡</span> Useful Features & Tools
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "12px",
                }}
              >
                <div className="feature-pill-card">
                  <span className="feature-pill-icon">📍</span>
                  <div>
                    <strong>Find My Location</strong>
                    <p>Click the crosshair icon on the left bar to jump directly to where you are right now.</p>
                  </div>
                </div>

                <div className="feature-pill-card">
                  <span className="feature-pill-icon">📶</span>
                  <div>
                    <strong>Works Even Offline</strong>
                    <p>If your internet disconnects, your reports are saved safely and sent as soon as you are back online.</p>
                  </div>
                </div>

                <div className="feature-pill-card">
                  <span className="feature-pill-icon">⚠️</span>
                  <div>
                    <strong>Fast Disaster Alerts</strong>
                    <p>Click the Alerts button to see recent earthquakes and natural disasters with live danger levels.</p>
                  </div>
                </div>

                <div className="feature-pill-card">
                  <span className="feature-pill-icon">👍</span>
                  <div>
                    <strong>Helpful Community Votes</strong>
                    <p>Upvote true reports or downvote wrong ones so everyone gets accurate, trustworthy updates.</p>
                  </div>
                </div>

                <div className="feature-pill-card">
                  <span className="feature-pill-icon">🌓</span>
                  <div>
                    <strong>Dark & Light Modes</strong>
                    <p>Open Settings to quickly switch between dark mode for night and light mode for bright rooms.</p>
                  </div>
                </div>

                <div className="feature-pill-card">
                  <span className="feature-pill-icon">💬</span>
                  <div>
                    <strong>Simple Phone Login</strong>
                    <p>Sign in easily using a quick SMS code sent straight to your phone. No long passwords needed.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LIVE DATA SOURCES */}
          {activeTab === "data" && (
            <div className="info-tab-content">
              <h3 style={{ fontSize: "1.05rem", color: "#38bdf8", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🛰️</span> Where Does the Data Come From?
              </h3>

              <div className="tech-stack-grid">
                <div className="tech-item">
                  <div className="tech-header">
                    <span className="tech-tag">3D Earth</span>
                    <strong>CesiumJS 3D</strong>
                  </div>
                  <p>Shows a smooth, interactive 3D Earth directly inside your browser without needing any extra apps.</p>
                </div>

                <div className="tech-item">
                  <div className="tech-header">
                    <span className="tech-tag">Earthquakes</span>
                    <strong>USGS Geological Survey</strong>
                  </div>
                  <p>Official earthquake data updated every few minutes, showing exact magnitude and location on the globe.</p>
                </div>

                <div className="tech-item">
                  <div className="tech-header">
                    <span className="tech-tag">Natural Hazards</span>
                    <strong>NASA EONET</strong>
                  </div>
                  <p>Live hazard updates from NASA satellites, including active wildfires, severe storms, and volcanoes.</p>
                </div>

                <div className="tech-item">
                  <div className="tech-header">
                    <span className="tech-tag">Cloud Database</span>
                    <strong>Fast Cloud Backend</strong>
                  </div>
                  <p>Stores community reports and user updates securely so everyone sees new posts right away.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            marginTop: "16px",
            paddingTop: "12px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Geo Pulse • Live World Map & Community Reports
          </span>
          <button
            className="btn btn-primary"
            onClick={onClose}
            style={{
              padding: "6px 20px",
              fontSize: "0.88rem",
              borderRadius: "20px",
            }}
          >
            Got it, Let's Explore!
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
