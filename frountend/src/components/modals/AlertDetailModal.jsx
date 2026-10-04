import React from "react";
import "../../index.css";

const SEVERITY_CONFIG = {
  critical: { color: "#ff1a1a", bg: "rgba(255,26,26,0.12)", label: "🔴 CRITICAL", border: "#ff1a1a", radius: 500 },
  high:     { color: "#ff6600", bg: "rgba(255,102,0,0.12)",  label: "🟠 HIGH",     border: "#ff6600", radius: 300 },
  medium:   { color: "#ffcc00", bg: "rgba(255,204,0,0.12)", label: "🟡 MEDIUM",   border: "#ffcc00", radius: 150 },
  low:      { color: "#22c55e", bg: "rgba(34,197,94,0.12)", label: "🟢 LOW",      border: "#22c55e", radius: 50 },
};

const TYPE_ICON = {
  earthquake:    "💥",
  tsunami:       "🌊",
  wildfire:      "🔥",
  wildfires:     "🔥",
  "severe storms": "⛈️",
  severe_storms: "⛈️",
  cyclone:       "🌀",
  cyclones:      "🌀",
  volcano:       "🌋",
  volcanoes:     "🌋",
  flood:         "💧",
  floods:        "💧",
  drought:       "☀️",
  "sea and lake ice": "🧊",
  "dust and haze": "💨",
  other:         "⚠️",
};

function getTypeIcon(type) {
  if (!type) return "⚠️";
  const key = type.toLowerCase().replace(/_/g, " ");
  return TYPE_ICON[key] || TYPE_ICON[type.toLowerCase()] || "⚠️";
}

function AlertDetailModal({ alert, onClose }) {
  if (!alert) return null;

  const severity = (alert.severity || "high").toLowerCase();
  const cfg = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.high;
  const icon = getTypeIcon(alert.type);
  const source = alert.author?.name || "Official Source";
  const isOfficial = alert.isOfficial;
  const date = alert.createdAt
    ? new Date(alert.createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 9999,
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: "480px",
          padding: 0,
          overflow: "hidden",
          borderRadius: "24px",
          background: "rgba(20, 25, 35, 0.85)",
          backdropFilter: "blur(20px)",
          border: `1px solid ${cfg.border}66`,
          boxShadow: `0 0 50px ${cfg.color}33, 0 30px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)`,
          animation: "modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          position: "relative",
        }}
      >
        {/* Animated Glow Behind Header */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            left: "-50px",
            right: "-50px",
            height: "200px",
            background: `radial-gradient(ellipse at top, ${cfg.color}33 0%, transparent 70%)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Header strip */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "24px 24px 20px",
            display: "flex",
            alignItems: "flex-start",
            gap: "16px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "56px",
              height: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              background: cfg.bg,
              borderRadius: "16px",
              border: `1px solid ${cfg.color}44`,
              flexShrink: 0,
              boxShadow: `0 0 20px ${cfg.color}44`,
            }}
          >
            {icon}
            {/* Pulsing ring */}
            <div
              style={{
                position: "absolute",
                inset: "-2px",
                borderRadius: "18px",
                border: `2px solid ${cfg.color}`,
                animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
                opacity: 0.7,
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              style={{
                margin: "0 0 8px 0",
                fontSize: "clamp(1.1rem, 5vw, 1.3rem)",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.3,
                wordBreak: "break-word",
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              }}
            >
              {alert.title}
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {isOfficial && (
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: "20px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    background: "rgba(34, 197, 94, 0.2)",
                    color: "#4ade80",
                    border: "1px solid rgba(74, 222, 128, 0.3)",
                    letterSpacing: "0.5px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  OFFICIAL
                </span>
              )}
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: "20px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  background: cfg.bg,
                  color: cfg.color,
                  border: `1px solid ${cfg.color}55`,
                  letterSpacing: "0.5px",
                }}
              >
                {cfg.label.split(" ")[1]} SEVERITY
              </span>
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: "20px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                {alert.type ? alert.type.replace(/_/g, " ") : "ALERT"}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-color)",
              cursor: "pointer",
              flexShrink: 0,
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ position: "relative", zIndex: 1, padding: "0 24px 24px" }}>
          
          {/* Description Box */}
          {alert.description && (
            <div
              style={{
                background: "rgba(0,0,0,0.2)",
                borderLeft: `4px solid ${cfg.color}`,
                padding: "16px",
                borderRadius: "0 12px 12px 0",
                marginBottom: "20px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "0.95rem",
                }}
              >
                {alert.description}
              </p>
            </div>
          )}

          {/* Data Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <div style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Coordinates</div>
              <div style={{ fontSize: "0.85rem", color: "#fff", fontWeight: 600 }}>
                {Math.abs(alert.lat)}°{alert.lat >= 0 ? "N" : "S"}
                <br />
                {Math.abs(alert.lng)}°{alert.lng >= 0 ? "E" : "W"}
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Danger Radius</div>
              <div style={{ fontSize: "0.9rem", color: cfg.color, fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "1.2rem" }}>🎯</span> ~{cfg.radius} km
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Reported Time</div>
              <div style={{ fontSize: "0.85rem", color: "#fff", fontWeight: 600 }}>
                {date || "Unknown"}
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Source</div>
              <div style={{ fontSize: "0.85rem", color: "#fff", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                🏛️ {source}
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "14px",
              background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}dd)`,
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: `0 4px 15px ${cfg.color}66`,
              textTransform: "uppercase",
              letterSpacing: "1px",
              transition: "transform 0.1s, box-shadow 0.2s",
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Acknowledge Alert
          </button>
        </div>
      </div>
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default AlertDetailModal;
