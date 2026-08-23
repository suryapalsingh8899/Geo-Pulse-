import React, { useState } from "react";

const PublicProfileModal = ({ user, reports = [], events = [], onClose }) => {
  const [activeTab, setActiveTab] = useState("reports");
  if (!user) return null;

  const userReports = reports.filter(
    (r) => r.author && r.author.name === user.name,
  );
  const userEvents = events.filter(
    (e) => e.author && e.author.name === user.name,
  );
  const contributions = userReports.length + userEvents.length;
  const totalUpvotes =
    userReports.reduce((sum, r) => sum + (r.upvotes || 0), 0) +
    userEvents.reduce((sum, e) => sum + (e.upvotes || 0), 0);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 4000 }}>
      <div
        className="modal-card glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: "500px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2
          className="modal-title"
          style={{
            fontSize: "1.5rem",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          User Profile
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
            marginBottom: "20px",
          }}
        >
          <img
            src={
              user.profilePic ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(user.name)
            }
            alt={user.name}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #38bdf8",
            }}
          />
          <h3
            style={{
              margin: 0,
              color: "var(--text-color)",
              fontSize: "1.2rem",
            }}
          >
            {user.name}
          </h3>
        </div>

        <div
          style={{
            background: "var(--panel-bg)",
            padding: "15px",
            borderRadius: "12px",
            color: "var(--text-color)",
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "20px",
            border: "1px solid var(--glass-border)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#38bdf8",
              }}
            >
              {contributions || Math.floor(Math.random() * 50) + 1}
            </div>
            <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
              Contributions
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#10b981",
              }}
            >
              {totalUpvotes}
            </div>
            <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>Upvoted</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--glass-border)",
            marginBottom: "15px",
          }}
        >
          <button
            style={{
              flex: 1,
              padding: "10px",
              background: "transparent",
              border: "none",
              color:
                activeTab === "reports"
                  ? "var(--primary)"
                  : "var(--text-muted)",
              borderBottom:
                activeTab === "reports" ? "2px solid var(--primary)" : "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => setActiveTab("reports")}
          >
            Reports ({userReports.length})
          </button>
          <button
            style={{
              flex: 1,
              padding: "10px",
              background: "transparent",
              border: "none",
              color:
                activeTab === "events"
                  ? "var(--secondary)"
                  : "var(--text-muted)",
              borderBottom:
                activeTab === "events" ? "2px solid var(--secondary)" : "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => setActiveTab("events")}
          >
            Events ({userEvents.length})
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", paddingRight: "5px" }}>
          {activeTab === "reports" &&
            (userReports.length > 0 ? (
              userReports.map((report) => (
                <div
                  key={report.id}
                  style={{
                    background: "var(--panel-bg)",
                    padding: "15px",
                    borderRadius: "12px",
                    marginBottom: "10px",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  <h4
                    style={{ margin: "0 0 10px 0", color: "var(--text-color)" }}
                  >
                    {report.title || report.description}
                  </h4>
                  {(report.image || report.media) && (
                    <img
                      src={report.image || report.media}
                      alt="Report Media"
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    />
                  )}
                  {report.video && (
                    <video
                      src={report.video}
                      controls
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "10px",
                        backgroundColor: "#000",
                      }}
                    />
                  )}
                  <div
                    style={{
                      display: "flex",
                      gap: "15px",
                      fontSize: "0.9rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    <span>👍 {report.upvotes || 0}</span>
                    <span>👎 {report.downvotes || 0}</span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
                No reports posted yet.
              </p>
            ))}

          {activeTab === "events" &&
            (userEvents.length > 0 ? (
              userEvents.map((event) => (
                <div
                  key={event.id}
                  style={{
                    background: "var(--panel-bg)",
                    padding: "15px",
                    borderRadius: "12px",
                    marginBottom: "10px",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  <h4
                    style={{ margin: "0 0 10px 0", color: "var(--text-color)" }}
                  >
                    {event.title}
                  </h4>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--text-muted)",
                      marginBottom: "5px",
                    }}
                  >
                    {event.timing}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "15px",
                      fontSize: "0.9rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    <span>👍 {event.upvotes || 0}</span>
                    <span
                      style={{ color: event.isPublic ? "#10b981" : "#ef4444" }}
                    >
                      {event.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
                No events posted yet.
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PublicProfileModal;
