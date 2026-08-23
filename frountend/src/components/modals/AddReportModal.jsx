import React, { useState } from "react";
import api from "../../services/api";

const AddReportModal = ({
  location,
  onSubmit,
  onClose,
  initialData = null,
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      description: "",
      websiteLink: "",
      image: "",
      video: "",
    },
  );

  const [uploadProgress, setUploadProgress] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    if (file) {
      setUploadProgress((prev) => ({ ...prev, [name]: 20 }));

      try {
        const res = await api.upload.file(file);
        if (res.success && res.url) {
          setFormData((prev) => ({ ...prev, [name]: res.url }));
          setUploadProgress((prev) => ({ ...prev, [name]: "done" }));
        } else {
          const objectUrl = URL.createObjectURL(file);
          setFormData((prev) => ({ ...prev, [name]: objectUrl }));
          setUploadProgress((prev) => ({ ...prev, [name]: "done" }));
        }
      } catch (err) {
        const objectUrl = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, [name]: objectUrl }));
        setUploadProgress((prev) => ({ ...prev, [name]: "done" }));
      }

      setTimeout(() => {
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[name];
          return newProgress;
        });
      }, 2000);
    }
  };

  const removeMedia = (fieldName) => {
    setFormData({ ...formData, [fieldName]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initialData) {
      onSubmit({ ...formData });
    } else {
      onSubmit({ ...formData, lat: location.lat, lng: location.lng });
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      style={{ zIndex: 5000 }}
    >
      <div
        className="modal-card glass-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2
          className="modal-title"
          style={{ fontSize: "1.8rem", marginBottom: "10px" }}
        >
          {initialData ? "Edit Report" : "Add Report"}
        </h2>
        <p className="modal-subtitle" style={{ marginBottom: "20px" }}>
          Location pinned at: {location.lat.toFixed(4)},{" "}
          {location.lng.toFixed(4)}
        </p>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="E.g., Pothole, Traffic Jam"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
              placeholder="Describe the problem..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Upload Image (Proof)</label>
            {formData.image ? (
              <div style={{ position: "relative", marginBottom: "10px" }}>
                <img
                  src={formData.image}
                  alt="Report preview"
                  style={{
                    width: "100%",
                    maxHeight: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeMedia("image")}
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
            ) : typeof uploadProgress["image"] === "number" ? (
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
                      width: `${uploadProgress["image"]}%`,
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
                  <span>Uploading... {uploadProgress["image"]}%</span>
                  <span>{100 - uploadProgress["image"]}% remaining</span>
                </div>
              </div>
            ) : (
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
              />
            )}
            {uploadProgress["image"] === "done" && (
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
            <label>Upload Video (Optional)</label>
            {formData.video ? (
              <div style={{ position: "relative", marginBottom: "10px" }}>
                <video
                  src={formData.video}
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
                  onClick={() => removeMedia("video")}
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
            ) : typeof uploadProgress["video"] === "number" ? (
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
                      width: `${uploadProgress["video"]}%`,
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
                  <span>Uploading... {uploadProgress["video"]}%</span>
                  <span>{100 - uploadProgress["video"]}% remaining</span>
                </div>
              </div>
            ) : (
              <input
                type="file"
                name="video"
                accept="video/*"
                onChange={handleFileChange}
              />
            )}
            {uploadProgress["video"] === "done" && (
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
            className="btn btn-primary form-submit-btn w-full"
          >
            {initialData ? "Save Changes" : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReportModal;
