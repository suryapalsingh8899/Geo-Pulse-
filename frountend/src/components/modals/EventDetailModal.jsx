import React from "react";

// Haversine distance helper
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d < 1 ? (d * 1000).toFixed(0) + " m" : d.toFixed(2) + " km";
};

const EventDetailModal = ({
  event,
  onClose,
  onVote,
  onAuthorClick,
  userLocation,
}) => {
  if (!event) return null;

  const userVote = event.userVote || null;
  const distance = userLocation
    ? calculateDistance(
        userLocation.lat,
        userLocation.lng,
        event.lat,
        event.lng,
      )
    : null;

  const handleUpvote = () => {
    let upDelta = 0;
    let newVote = null;

    if (userVote === "up") {
      upDelta = -1;
    } else {
      upDelta = 1;
      newVote = "up";
    }

    if (onVote) onVote(event.id, upDelta, newVote);
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
        style={{
          width: "90%",
          maxWidth: "600px",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "15px",
            gap: "15px",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <h2
              className="modal-title"
              style={{ fontSize: "1.8rem", margin: 0 }}
            >
              {event.title || "Event Details"}
            </h2>
            <span
              style={{
                background: event.isPublic
                  ? "rgba(16, 185, 129, 0.2)"
                  : "rgba(239, 68, 68, 0.2)",
                color: event.isPublic ? "#10b981" : "#ef4444",
                padding: "4px 10px",
                borderRadius: "12px",
                fontSize: "0.8rem",
                fontWeight: "bold",
                border: `1px solid ${event.isPublic ? "rgba(16, 185, 129, 0.5)" : "rgba(239, 68, 68, 0.5)"}`,
                width: "fit-content",
              }}
            >
              {event.isPublic ? "PUBLIC" : "PRIVATE"}
            </span>
          </div>
          {event.author && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "20px",
                background: "var(--panel-bg)",
                border: "1px solid var(--glass-border)",
              }}
              onClick={() => onAuthorClick && onAuthorClick(event.author)}
              title="View Profile"
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-color)",
                  fontWeight: "bold",
                }}
              >
                {event.author.name}
              </span>
              <img
                src={
                  event.author.profilePic ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(event.author.name)
                }
                alt={event.author.name}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </div>

        {distance && (
          <div
            style={{
              marginBottom: "15px",
              color: "var(--secondary)",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          >
            📍 {distance} away from you
          </div>
        )}

        {(event.timing || (event.startTime && event.endTime)) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-muted)",
              marginBottom: "20px",
              fontSize: "0.95rem",
            }}
          >
            <span>🕒</span>
            <span>
              {event.startTime && event.endTime
                ? `${new Date(event.startTime).toLocaleString([], { dateStyle: "short", timeStyle: "short" })} to ${new Date(event.endTime).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}`
                : event.timing}
            </span>
          </div>
        )}

        {event.poster && (
          <div
            style={{
              marginBottom: "20px",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid var(--glass-border)",
            }}
          >
            <img
              src={event.poster}
              alt="Event Poster"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                maxHeight: "250px",
                objectFit: "cover",
              }}
            />
          </div>
        )}

        <div
          style={{
            marginBottom: "20px",
            color: "var(--text-color)",
            lineHeight: "1.6",
          }}
        >
          <strong>Description:</strong>
          <p style={{ marginTop: "8px" }}>{event.description}</p>
        </div>

        {event.photos && event.photos.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <strong
              style={{
                color: "var(--text-color)",
                display: "block",
                marginBottom: "10px",
              }}
            >
              Photos:
            </strong>
            <div
              style={{
                display: "flex",
                gap: "10px",
                overflowX: "auto",
                paddingBottom: "10px",
              }}
            >
              {event.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Event Photo ${index + 1}`}
                  style={{
                    height: "120px",
                    width: "auto",
                    borderRadius: "8px",
                    objectFit: "cover",
                    flexShrink: 0,
                    border: "1px solid var(--glass-border)",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {event.videos && event.videos.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <strong
              style={{
                color: "var(--text-color)",
                display: "block",
                marginBottom: "10px",
              }}
            >
              Videos:
            </strong>
            <div
              style={{
                display: "flex",
                gap: "10px",
                overflowX: "auto",
                paddingBottom: "10px",
              }}
            >
              {event.videos.map((video, index) => (
                <video
                  key={index}
                  src={video}
                  controls
                  style={{
                    height: "150px",
                    width: "auto",
                    borderRadius: "8px",
                    flexShrink: 0,
                    border: "1px solid var(--glass-border)",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <button
            className={`btn ${userVote === "up" ? "btn-primary" : "btn-outline"}`}
            style={{
              padding: "0.5rem 1rem",
              display: "flex",
              justifyContent: "center",
              gap: "5px",
              minWidth: "100px",
            }}
            onClick={handleUpvote}
          >
            <span>👍</span> {event.upvotes || 0}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
