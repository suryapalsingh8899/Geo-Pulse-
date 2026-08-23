const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper for HTTP requests
async function request(endpoint, options = {}) {
  const token = localStorage.getItem("geopulse_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Handle FormData (multipart file upload)
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    return { success: false, message: error.message || "Network error. Backend might be unreachable." };
  }
}

export const api = {
  // Authentication APIs
  auth: {
    requestRegisterOtp: (phone, countryCode = "+1") =>
      request("/auth/register-otp", {
        method: "POST",
        body: JSON.stringify({ phone, countryCode }),
      }),

    verifyAndRegister: (payload) =>
      request("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    requestLoginOtp: (phone) =>
      request("/auth/login-otp", {
        method: "POST",
        body: JSON.stringify({ phone }),
      }),

    verifyAndLogin: (phone, otp) =>
      request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ phone, otp }),
      }),

    getMe: () => request("/auth/me"),

    updateProfile: (profileData) =>
      request("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(profileData),
      }),

    getUserProfile: (userId) => request(`/auth/user/${userId}`),
  },

  // Community Reports APIs
  reports: {
    getAll: () => request("/reports"),

    getById: (id) => request(`/reports/${id}`),

    create: (reportData) =>
      request("/reports", {
        method: "POST",
        body: JSON.stringify(reportData),
      }),

    update: (id, reportData) =>
      request(`/reports/${id}`, {
        method: "PUT",
        body: JSON.stringify(reportData),
      }),

    delete: (id) =>
      request(`/reports/${id}`, {
        method: "DELETE",
      }),

    vote: (id, action) =>
      request(`/reports/${id}/vote`, {
        method: "POST",
        body: JSON.stringify({ action }), // "up" | "down" | "cancel"
      }),

    markSeen: (id) =>
      request(`/reports/${id}/seen`, {
        method: "POST",
      }),
  },

  // Community Events APIs
  events: {
    getAll: () => request("/events"),

    getById: (id) => request(`/events/${id}`),

    create: (eventData) =>
      request("/events", {
        method: "POST",
        body: JSON.stringify(eventData),
      }),

    update: (id, eventData) =>
      request(`/events/${id}`, {
        method: "PUT",
        body: JSON.stringify(eventData),
      }),

    delete: (id) =>
      request(`/events/${id}`, {
        method: "DELETE",
      }),

    vote: (id, action) =>
      request(`/events/${id}/vote`, {
        method: "POST",
        body: JSON.stringify({ action }),
      }),

    markSeen: (id) =>
      request(`/events/${id}/seen`, {
        method: "POST",
      }),
  },

  // Media Uploads
  upload: {
    file: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      return request("/upload", {
        method: "POST",
        body: formData,
      });
    },

    multiple: async (files) => {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("files", f));
      return request("/upload/multiple", {
        method: "POST",
        body: formData,
      });
    },
  },
};

export default api;
