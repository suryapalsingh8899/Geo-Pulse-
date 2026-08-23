import React, { useState, Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            background: "red",
            color: "white",
            padding: "20px",
            zIndex: 9999,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <h1>Something went wrong.</h1>
          <pre>{this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const AddEventModal = ({ location, onSubmit, onClose, initialData = null }) => {
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        title: initialData.title || "",
        description: initialData.description || "",
        startTime: initialData.startTime || "",
        endTime: initialData.endTime || "",
        timing: initialData.timing || "",
        isPublic:
          initialData.isPublic !== undefined ? initialData.isPublic : true,
        poster: initialData.poster || "",
        photos:
          Array.isArray(initialData.photos) && initialData.photos.length > 0
            ? initialData.photos[0]
            : typeof initialData.photos === "string"
              ? initialData.photos
              : "",
        videos:
          Array.isArray(initialData.videos) && initialData.videos.length > 0
            ? initialData.videos[0]
            : typeof initialData.videos === "string"
              ? initialData.videos
              : "",
        lat: initialData.lat,
        lng: initialData.lng,
      };
    }
    return {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      timing: "", // Legacy string support
      isPublic: true,
      poster: "",
      photos: "",
      videos: "",
    };
  });

  const [uploadProgress, setUploadProgress] = useState({});

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    if (file) {
      setUploadProgress((prev) => ({ ...prev, [name]: 0 }));

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress >= 100) {
          clearInterval(interval);
          const objectUrl = URL.createObjectURL(file);
          setFormData((prev) => ({ ...prev, [name]: objectUrl }));
          setUploadProgress((prev) => ({ ...prev, [name]: "done" }));
          setTimeout(() => {
            setUploadProgress((prev) => {
              const newProgress = { ...prev };
              delete newProgress[name];
              return newProgress;
            });
          }, 2000);
        } else {
          setUploadProgress((prev) => ({ ...prev, [name]: progress }));
        }
      }, 150);
    }
  };

  const removeMedia = (fieldName) => {
    setFormData({ ...formData, [fieldName]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      lat: location ? location.lat : formData.lat,
      lng: location ? location.lng : formData.lng,
      photos: formData.photos ? [formData.photos] : [],
      videos: formData.videos ? [formData.videos] : [],
    };

    if (initialData) {
      onSubmit(submitData);
    } else {
      onSubmit(submitData);
    }
  };

  return (
    <ErrorBoundary>
      <div
        className="modal-overlay"
        onClick={onClose}
        onWheel={(e) => e.stopPropagation()}
        style={{ zIndex: 5000 }}
      >
        <div
          className="modal-card glass-card"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "90%",
            maxWidth: "500px",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
          <h2
            className="modal-title"
            style={{ fontSize: "1.8rem", marginBottom: "10px" }}
          >
            {initialData ? "Edit Event" : "Post Event"}
          </h2>
          {!initialData &&
            location &&
            location.lat !== undefined &&
            location.lng !== undefined && (
              <p className="modal-subtitle" style={{ marginBottom: "20px" }}>
                Location pinned at: {location.lat.toFixed(4)},{" "}
                {location.lng.toFixed(4)}
              </p>
            )}

          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                placeholder="E.g., Local Music Festival"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Describe the event..."
                value={formData.description}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  background: "var(--panel-bg)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text-color)",
                  minHeight: "80px",
                }}
              />
            </div>

            <div className="form-group">
              <label>Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div
              className="form-group"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "10px",
                marginBottom: "15px",
              }}
            >
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                style={{ width: "auto", margin: 0 }}
              />
              <label style={{ margin: 0 }}>This is a Public Event</label>
            </div>

            <div className="form-group">
              <label>Upload Poster Image</label>
              {formData.poster ? (
                <div style={{ position: "relative", marginBottom: "10px" }}>
                  <img
                    src={formData.poster}
                    alt="Poster preview"
                    style={{
                      width: "100%",
                      maxHeight: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeMedia("poster")}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "rgba(239, 68, 68, 0.8)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      cursor: "pointer",
                    }}
                  >
                    &times;
                  </button>
                </div>
              ) : typeof uploadProgress["poster"] === "number" ? (
                <div
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    background: "var(--panel-bg)",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "8px",
                      background: "var(--text-muted)",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${uploadProgress["poster"]}%`,
                        height: "100%",
                        background: "var(--primary)",
                        transition: "width 0.1s linear",
                      }}
                    ></div>
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      marginTop: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Uploading... {uploadProgress["poster"]}%</span>
                    <span>{100 - uploadProgress["poster"]}% remaining</span>
                  </div>
                </div>
              ) : (
                <input
                  type="file"
                  name="poster"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              )}
              {uploadProgress["poster"] === "done" && (
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#10b981",
                    marginTop: "5px",
                  }}
                >
                  Successfully uploaded!
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Upload Additional Photo</label>
              {formData.photos ? (
                <div style={{ position: "relative", marginBottom: "10px" }}>
                  <img
                    src={formData.photos}
                    alt="Photo preview"
                    style={{
                      width: "100%",
                      maxHeight: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeMedia("photos")}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "rgba(239, 68, 68, 0.8)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      cursor: "pointer",
                    }}
                  >
                    &times;
                  </button>
                </div>
              ) : typeof uploadProgress["photos"] === "number" ? (
                <div
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    background: "var(--panel-bg)",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "8px",
                      background: "var(--text-muted)",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${uploadProgress["photos"]}%`,
                        height: "100%",
                        background: "var(--primary)",
                        transition: "width 0.1s linear",
                      }}
                    ></div>
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      marginTop: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Uploading... {uploadProgress["photos"]}%</span>
                    <span>{100 - uploadProgress["photos"]}% remaining</span>
                  </div>
                </div>
              ) : (
                <input
                  type="file"
                  name="photos"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              )}
              {uploadProgress["photos"] === "done" && (
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#10b981",
                    marginTop: "5px",
                  }}
                >
                  Successfully uploaded!
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Upload Video</label>
              {formData.videos ? (
                <div style={{ position: "relative", marginBottom: "10px" }}>
                  <video
                    src={formData.videos}
                    controls
                    style={{
                      width: "100%",
                      maxHeight: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeMedia("videos")}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "rgba(239, 68, 68, 0.8)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      cursor: "pointer",
                    }}
                  >
                    &times;
                  </button>
                </div>
              ) : typeof uploadProgress["videos"] === "number" ? (
                <div
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    background: "var(--panel-bg)",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "8px",
                      background: "var(--text-muted)",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${uploadProgress["videos"]}%`,
                        height: "100%",
                        background: "var(--primary)",
                        transition: "width 0.1s linear",
                      }}
                    ></div>
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      marginTop: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Uploading... {uploadProgress["videos"]}%</span>
                    <span>{100 - uploadProgress["videos"]}% remaining</span>
                  </div>
                </div>
              ) : (
                <input
                  type="file"
                  name="videos"
                  accept="video/*"
                  onChange={handleFileChange}
                />
              )}
              {uploadProgress["videos"] === "done" && (
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#10b981",
                    marginTop: "5px",
                  }}
                >
                  Successfully uploaded!
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-pink form-submit-btn w-full"
            >
              {initialData ? "Save Changes" : "Post Event"}
            </button>
          </form>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AddEventModal;
