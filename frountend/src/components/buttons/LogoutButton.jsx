import React from "react";

const LogoutButton = ({ onClick }) => {
  return (
    <button
      className="btn btn-danger"
      style={{
        marginLeft: "10px",
        padding: "0.6rem 1.2rem",
        borderRadius: "10px",
      }}
      onClick={onClick}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
