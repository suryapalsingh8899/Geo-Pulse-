import React from "react";

const Mode2D3DToggle = ({ is2DMode = false, onToggle, compact = false }) => {
  return (
    <div
      className={`mode-toggle-group ${compact ? "compact" : ""}`}
      role="group"
      aria-label="Map projection mode"
    >
      <button
        type="button"
        className={`mode-toggle-btn ${!is2DMode ? "active" : ""}`}
        onClick={() => onToggle && onToggle(false)}
        title="Switch to 3D Globe View (CesiumJS)"
        aria-pressed={!is2DMode}
      >
        <span className="mode-icon">🌐</span>
        {!compact && <span className="mode-label">3D Globe</span>}
      </button>

      <button
        type="button"
        className={`mode-toggle-btn ${is2DMode ? "active" : ""}`}
        onClick={() => onToggle && onToggle(true)}
        title="Switch to 2D Flat Map View (CesiumJS)"
        aria-pressed={is2DMode}
      >
        <span className="mode-icon">🗺️</span>
        {!compact && <span className="mode-label">2D Map</span>}
      </button>
    </div>
  );
};

export default Mode2D3DToggle;
