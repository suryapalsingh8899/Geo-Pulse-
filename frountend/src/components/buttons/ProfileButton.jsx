import React from "react";

const ProfileButton = ({ onClick }) => {
  return (
    <button
      className="btn btn-outline"
      style={{
        background: "var(--glass-bg)",
        border: "none",
        color: "var(--text-color)",
      }}
      onClick={onClick}
    >
      Profile
    </button>
  );
};

export default ProfileButton;
