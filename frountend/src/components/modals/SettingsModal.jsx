import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const SettingsModal = ({
  onClose,
  locationEnabled,
  setLocationEnabled,
  alertsEnabled,
  setAlertsEnabled,
  userName,
  setUserName,
  darkMode,
  setDarkMode,
}) => {
  const { t, i18n } = useTranslation();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const handleLocationToggle = (e) => {
    setLocationEnabled(e.target.checked);
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      style={{ zIndex: 3000 }}
    >
      <div
        className="modal-card glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "400px" }}
      >
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2
          className="modal-title"
          style={{ fontSize: "1.5rem", marginBottom: "20px" }}
        >
          {t("settings")}
        </h2>

        <div
          style={{
            marginBottom: "20px",
            color: "var(--text-color)",
            lineHeight: "1.6",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <strong>Username:</strong>
            {isEditingName ? (
              <div style={{ display: "flex", gap: "5px" }}>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  style={{
                    background: "var(--input-bg)",
                    border: "1px solid var(--primary)",
                    borderRadius: "8px",
                    padding: "5px 10px",
                    color: "var(--text-color)",
                    outline: "none",
                    width: "120px",
                  }}
                  autoFocus
                />
                <button
                  className="btn btn-primary"
                  style={{ padding: "5px 10px", fontSize: "0.8rem" }}
                  onClick={() => {
                    setUserName(tempName);
                    setIsEditingName(false);
                  }}
                >
                  Save
                </button>
              </div>
            ) : (
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span
                  style={{ fontSize: "1.1rem", color: "var(--text-color)" }}
                >
                  {userName}
                </span>
                <span
                  style={{ cursor: "pointer", fontSize: "1rem", opacity: 0.7 }}
                  onClick={() => {
                    setTempName(userName);
                    setIsEditingName(true);
                  }}
                >
                  ✏️
                </span>
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <strong>{t("language")}:</strong>
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                background: "var(--input-bg)",
                color: "var(--text-color)",
                border: "1px solid var(--glass-border)",
                cursor: "pointer",
              }}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <strong>{t("darkMode")}:</strong>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span style={{ marginRight: "10px" }}>
                {darkMode ? "ON" : "OFF"}
              </span>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                style={{
                  width: "18px",
                  height: "18px",
                  cursor: "pointer",
                  accentColor: "var(--primary)",
                }}
              />
            </label>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <strong>{t("locationAccess") || "Location Access"}:</strong>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span style={{ marginRight: "10px" }}>
                {locationEnabled ? "ON" : "OFF"}
              </span>
              <input
                type="checkbox"
                checked={locationEnabled}
                onChange={handleLocationToggle}
                style={{
                  width: "18px",
                  height: "18px",
                  cursor: "pointer",
                  accentColor: "var(--primary)",
                }}
              />
            </label>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <strong>{t("alertNotifications") || "Alert Notifications"}:</strong>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span style={{ marginRight: "10px" }}>
                {alertsEnabled ? "ON" : "OFF"}
              </span>
              <input
                type="checkbox"
                checked={alertsEnabled}
                onChange={(e) => setAlertsEnabled(e.target.checked)}
                style={{
                  width: "18px",
                  height: "18px",
                  cursor: "pointer",
                  accentColor: "var(--primary)",
                }}
              />
            </label>
          </div>

          <div style={{ marginTop: "35px" }}>
            <button
              className="btn btn-danger"
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
              onClick={() => {
                if (window.confirm(t("areYouSure"))) {
                  alert(t("accountDeleted"));
                  onClose();
                }
              }}
            >
              {t("deleteAccount")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
